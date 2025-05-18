import RPi.GPIO as GPIO
import time
import subprocess
import os
from datetime import datetime
from picamera2 import Picamera2, encoders
import threading

# === Config ===
BUTTON_PIN = 10
MICROPHONE_CARD = 2
OUTDOOR_SPEAKER_CARD = 4
INDOOR_SPEAKER_CARD = 3

AUDIO_DEVICE = 0

# initialize GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

# initialize camera
camera = Picamera2()
camera.start()
time.sleep(2)

# play audio function
def play_audio(file, card, device=AUDIO_DEVICE):
    subprocess.run(["aplay", "-D", f"plughw:{card},{device}", file])

# play dual audio function
def play_dual_audio(file):
    t1 = threading.Thread(target=play_audio, args=(file, INDOOR_SPEAKER_CARD))
    t2 = threading.Thread(target=play_audio, args=(file, OUTDOOR_SPEAKER_CARD))
    t1.start()
    t2.start()
    t1.join()
    t2.join()

# take photo function
def take_photo():
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"Record/photo_{ts}.jpg"
    camera.capture_file(filename)
    print(f"Take{filename}")

# Video recording function
def record_video():
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    video_file = f"Record/video_{ts}.h264"
    audio_file = f"Record/audio_{ts}.wav"
    output_file = f"Record/output_{ts}.mp4"

    try:
        camera.stop()
        time.sleep(0.5)
    except Exception as e:
        print("Fault when terminating:", e)

    video_config = camera.create_video_configuration(main={"size": (1280, 720)})
    camera.configure(video_config)
    camera.start()
    time.sleep(1)

    # audio recording
    arecord_cmd = [
        "arecord", "-D", f"hw:{MICROPHONE_CARD},0",
        "-f", "S16_LE", "-r", "44100", "-c", "1",
        "-t", "wav", "-d", "10", audio_file
    ]
    arecord_proc = subprocess.Popen(arecord_cmd)

    # video recording
    camera.start_recording(output=video_file, encoder=encoders.H264Encoder(bitrate=4000000))
    time.sleep(10)
    camera.stop_recording()
    camera.stop()
    arecord_proc.wait()

    # merge video and audio
    subprocess.run(["ffmpeg", "-y", "-i", video_file, "-i", audio_file, "-c:v", "copy", "-c:a", "aac", output_file])
    os.remove(video_file)
    os.remove(audio_file)
    print(f"Finish video merging: {output_file}")

    # Restart camera
    camera.configure(camera.create_still_configuration(main={"size": (1280, 720)}))
    camera.start()
    time.sleep(1)

# Main program
try:
    print("System ready. Press the button to take a photo or record a video.")

    press_times = []
    first_press_time = None
    last_second_press_time = None
    waiting_for_third_press = False

    while True:
        now = time.time()

        # Automatic reset mechanism: if waiting for the third press and 20 seconds have passed since the last second press
        if waiting_for_third_press and last_second_press_time and (now - last_second_press_time > 20):
            print("Over 20 seconds since last second press → Reset to initial state")
            waiting_for_third_press = False
            press_times.clear()
            first_press_time = None
            last_second_press_time = None

        # Automatic reset mechanism: if first press time is set and 20 seconds have passed since the first press
        if first_press_time and not waiting_for_third_press and (now - first_press_time > 20):
            print("Over 20 seconds since first press → Reset to initial state")
            first_press_time = None
            press_times.clear()

        # Detect button press
        if GPIO.input(BUTTON_PIN) == GPIO.HIGH:
            press_times.append(now)
            press_times = [t for t in press_times if now - t <= 5]
            print("Current time stamp", [round(t % 60, 2) for t in press_times])

            # Three quick presses within 5 seconds
            if waiting_for_third_press and len(press_times) >= 3 and now - press_times[-3] < 5:
                print("Detected 3 quick presses → Start video recording")
                play_audio("Audios/countdown.wav", card=OUTDOOR_SPEAKER_CARD)
                play_audio("Audios/bi_tone.wav", card=OUTDOOR_SPEAKER_CARD)
                record_video()
                play_audio("Audios/bi_tone.wav", card=OUTDOOR_SPEAKER_CARD)
                play_audio("Audios/videofinish.wav", card=OUTDOOR_SPEAKER_CARD)
                press_times.clear()
                waiting_for_third_press = False
                first_press_time = None
                last_second_press_time = None
                time.sleep(1)
                continue

            # First press
            if not first_press_time:
                first_press_time = now
                print("First press detected → Start countdown")
                play_dual_audio("Audios/doorbell.wav")
                take_photo()

            # Second press in 20 seconds
            elif not waiting_for_third_press and now - first_press_time < 20:
                last_second_press_time = now
                waiting_for_third_press = True
                print("20 seconds countdown started → Waiting for third press")
                play_dual_audio("Audios/doorbell.wav")
                take_photo()
                play_audio("Audios/press3times.wav", card=OUTDOOR_SPEAKER_CARD)

            time.sleep(1)

        time.sleep(0.1)

except KeyboardInterrupt:
    print("Manually terminated the program...")

finally:
    GPIO.cleanup()
    camera.stop()
