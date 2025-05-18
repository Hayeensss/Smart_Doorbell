import RPi.GPIO as GPIO
import time
import subprocess
import os
from datetime import datetime
from picamera2 import Picamera2, encoders
import threading
from PiicoDev_VEML6030 import PiicoDev_VEML6030
from flask import Flask, Response
import cv2
from cloudinary_api import upload_image, upload_video, insert_media_record, insert_event_record

# === Configuration ===

# Speaker, microphone, and button pin
BUTTON_PIN = 10
MICROPHONE_CARD = 3
OUTDOOR_SPEAKER_CARD = 2
INDOOR_SPEAKER_CARD = 4
AUDIO_DEVICE = 0
# GPIO pins for distance sensor and relay
TRIG = 5
ECHO = 6
RELAY_PIN = 17
# Doorbell ID
doorbell_id = "a1b2c3d4-e5f6-7890-1234-567890abcdef"

# === Initialize ===

# Initialize GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(RELAY_PIN, GPIO.OUT, initial=GPIO.HIGH)
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)
# Initialize camera and light sensor
camera = Picamera2()
camera.configure(camera.create_video_configuration(main={"size": (640, 480)}))
camera.start()
time.sleep(1)
light_sensor = PiicoDev_VEML6030()

# === Functions ===

# Audio playback function
# This function plays audio files on the specified card
def play_audio(file, card, device=AUDIO_DEVICE):
    subprocess.run(["aplay", "-D", f"plughw:{card},{device}", file])

# Dual audio playback function
# This function plays the same audio file on both indoor and outdoor speakers
# It uses threading to play the audio simultaneously
def play_dual_audio(file):
    t1 = threading.Thread(target=play_audio, args=(file, INDOOR_SPEAKER_CARD))
    t2 = threading.Thread(target=play_audio, args=(file, OUTDOOR_SPEAKER_CARD))
    t1.start()
    t2.start()
    t1.join()
    t2.join()

# Flask app for video streaming
# This function sets up a Flask app to stream video from the camera
app = Flask(__name__)
def generate_frames():
    while True:
        frame = camera.capture_array()
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue
        jpg_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpg_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def run_flask():
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)

# Take photo function
# This function captures a photo using the camera and saves it with a timestamp
def take_photo():
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"Record/photo_{ts}.jpg"
    camera.capture_file(filename)
    print(f"Photo taken successfully:{filename}")
    return filename

# Record video function
# This function records a video with audio for 10 seconds and saves it with a timestamp
# It uses the arecord command to capture audio and ffmpeg to combine video and audio
def record_video():
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    video_file = f"Record/video_{ts}.h264"
    audio_file = f"Record/audio_{ts}.wav"
    output_file = f"Record/output_{ts}.mp4"

    try:
        print("Start Recording Video...")
        # Do not switch configuration, use the current stream for direct recording
        arecord_cmd = [
            "arecord", "-D", f"hw:{MICROPHONE_CARD},0",
            "-f", "S16_LE", "-r", "44100", "-c", "1",
            "-t", "wav", "-d", "10", audio_file
        ]
        arecord_proc = subprocess.Popen(arecord_cmd)
        # Start recording
        camera.start_recording(
            encoder=encoders.H264Encoder(bitrate=4000000),
            output=video_file
        )
        time.sleep(10)
        camera.stop_recording()
        arecord_proc.wait()
        subprocess.run([
            "ffmpeg", "-y",
            "-i", video_file,
            "-i", audio_file,
            "-c:v", "copy", "-c:a", "aac",
            output_file
        ])
        os.remove(video_file)
        os.remove(audio_file)
        print(f"Video combination complete:{output_file}")

        # Reconfigure to live streaming mode
        camera.configure(camera.create_video_configuration(main={"size": (640, 480)}))
        camera.start()
    except Exception as e:
        print(f"Error: Error during recording: {e}")
    return output_file

# The background upload function
# This function uploads the recorded video to a cloud service
# It uses the upload_video function from the cloudinary_api module
def upload_video_background(video_file, event_id):
    try:
        print(f"Starting asynchronous upload:{video_file}")
        result = upload_video(video_file)
        if result["status"] != "success":
            print(f"Upload failed: {result['message']}")
            delete_file_safely(video_file)
            return

        media_id = insert_media_record(
            event_ref=event_id,
            media_type="video",
            url=result["url"]
        )

        if not media_id:
            print("Failed to insert media record.")
            delete_file_safely(video_file)
            return

        print(f"🎉 Video uploaded successfully: {result['url']}")
        delete_file_safely(video_file)

    except Exception as e:
        print(f"Error: Asynchronous upload thread crashed: {e}")

# Distance measurement function
# This function measures the distance using an ultrasonic sensor
# It sends a trigger signal and waits for the echo signal to calculate the distance
def get_distance_cm(timeout=0.02):
    GPIO.output(TRIG, False)
    time.sleep(0.05)
    GPIO.output(TRIG, True)
    time.sleep(0.00001)
    GPIO.output(TRIG, False)

    start_time = time.time()
    while GPIO.input(ECHO) == 0:
        if time.time() - start_time > timeout:
            print("Timeout: ECHO waiting for rising edge failed")
            return -1

    pulse_start = time.time()

    while GPIO.input(ECHO) == 1:
        if time.time() - pulse_start > timeout:
            print("Timeout: ECHO waiting for falling edge failed")
            return -1

    pulse_end = time.time()
    pulse_duration = pulse_end - pulse_start
    return round(pulse_duration * 17150, 2)

# Light and distance monitoring function
# This function continuously monitors the ambient light and distance
# It uses the light sensor to read the ambient brightness and the ultrasonic sensor to measure distance
def light_and_distance_monitor():
    # Main monitoring loop
    try:
        print("Monitoring ambient brightness and forward distance....")
        while True:
            try:
                lux = light_sensor.read()
            except Exception as e:
                print(f"Light reading failed:  {e}")
                lux = 1000  # Assume bright light
            distance = get_distance_cm()
            if distance == -1:
                continue  

            print(f"Light: {lux:.2f} lux | Distance: {distance:.2f} cm")

            if lux < 50 and distance < 62 :
                GPIO.output(RELAY_PIN, GPIO.LOW)  # 开灯
                print("Dark + someone approaching → turn on the light")
            else:
                GPIO.output(RELAY_PIN, GPIO.HIGH)  # 关灯
                print("Enough light or no one approaching → turn off the light")

            time.sleep(1)

    except KeyboardInterrupt:
        print("Program terminated")

# Cleanup function to delete files safely
# This function checks if a file exists and deletes it
# It handles exceptions and prints appropriate messages
def delete_file_safely(path):
    try:
        if os.path.exists(path):
            os.remove(path)
            print(f"[CLEANUP] Deleted file: {path}")
        else:
            print(f"[CLEANUP] File not found: {path}")
    except Exception as e:
        print(f"[CLEANUP ERROR] Could not delete file: {path} -> {e}")

# Camera capture function
# This function handles the button press events and captures photos/videos
# It uses threading to manage the button press logic and video recording
def camera_capture():
    try:
        print("Button test program started")
        press_times = []
        first_press_time = None
        last_second_press_time = None
        waiting_for_third_press = False
        event_id = None
        last_button_state = GPIO.LOW  

        while True:
            now = time.time()
            current_state = GPIO.input(BUTTON_PIN)

            # Automatic reset logic
            if waiting_for_third_press and last_second_press_time and (now - last_second_press_time > 20):
                print("More than 20 seconds without completing triple press, auto reset")
                waiting_for_third_press = False
                press_times.clear()
                first_press_time = None
                last_second_press_time = None
                event_id = None
            # Automatic reset logic for first press
            if first_press_time and not waiting_for_third_press and (now - first_press_time > 20):
                print("More than 20 seconds without the second press → auto reset to initial state")
                first_press_time = None
                press_times.clear()
                event_id = None

            #  State change detection: only from LOW -> HIGH triggers press logic
            if current_state == GPIO.HIGH and last_button_state == GPIO.LOW:
                press_times.append(now)
                press_times = [t for t in press_times if now - t <= 5]
                print("Current button press timestamps:", [round(t % 60, 2) for t in press_times])

                # Triple press video recording
                if waiting_for_third_press and len(press_times) >= 3 and now - press_times[-3] < 5:
                    print("Detected 3 presses within 5 seconds → start recording")
                    play_audio("Audios/countdown.wav", card=OUTDOOR_SPEAKER_CARD)
                    play_audio("Audios/bi_tone.wav", card=OUTDOOR_SPEAKER_CARD)

                    if not event_id:
                        print("Error: no event ID, cannot record/upload.")
                        continue

                    video_file = record_video()
                    upload_thread = threading.Thread(target=upload_video_background, args=(video_file, event_id))
                    upload_thread.daemon = True
                    upload_thread.start()

                    play_audio("Audios/bi_tone.wav", card=OUTDOOR_SPEAKER_CARD)
                    play_audio("Audios/videofinish.wav", card=OUTDOOR_SPEAKER_CARD)

                    press_times.clear()
                    waiting_for_third_press = False
                    first_press_time = None
                    last_second_press_time = None
                    time.sleep(1)

                # First press
                # Pressing the button once
                # If the first press is within 20 seconds, take a photo and play the doorbell sound
                elif not first_press_time:
                    first_press_time = now
                    print("First press → take photo + doorbell")
                    play_dual_audio("Audios/doorbell.wav")
                    image_file = take_photo()

                    event_id = insert_event_record(
                        device_id=doorbell_id,
                        event_type="button_pressed",
                        payload={"message": "Doorbell rings"}
                    )
                    # Retry logic for event record insertion
                    if not event_id:
                        print("Failed to insert event record after retries.")
                        delete_file_safely(image_file)
                        continue

                    result = upload_image(image_file)
                    if result["status"] != "success":
                        print(f"Upload failed: {result['message']}")
                        delete_file_safely(image_file)
                        continue

                    media_id = insert_media_record(
                        event_ref=event_id,
                        media_type="image",
                        url=result["url"]
                    )
                    if not media_id:
                        print("Failed to insert media record.")
                        delete_file_safely(image_file)
                        continue

                # Second press
                # If the second press is within 20 seconds, take another photo and play the doorbell sound
                elif not waiting_for_third_press and now - first_press_time < 20:
                    last_second_press_time = now
                    waiting_for_third_press = True
                    print("Press again within 20 seconds → another photo + doorbell + prompt sound")
                    play_dual_audio("Audios/doorbell.wav")
                    image_file = take_photo()
                    play_audio("Audios/press3times.wav", card=OUTDOOR_SPEAKER_CARD)

                    result = upload_image(image_file)
                    if result["status"] != "success":
                        print(f"Upload failed: {result['message']}")
                        delete_file_safely(image_file)
                        continue

                    media_id = insert_media_record(
                        event_ref=event_id,
                        media_type="image",
                        url=result["url"]
                    )
                    if not media_id:
                        print("Failed to insert media record.")
                        delete_file_safely(image_file)
                        continue

                time.sleep(0.2)  # Debounce

            last_button_state = current_state
            time.sleep(0.1)

    except KeyboardInterrupt:
        print("Manual termination")

# === Main Program ===

try:
    # Start threads
    # Start the light and distance monitoring, camera capture, and Flask app in separate threads
    # The light and distance monitoring thread handles the light sensor and distance measurement
    # The camera capture thread handles the button press events and captures photos/videos
    # The Flask app thread handles the video streaming
    t1 = threading.Thread(target=light_and_distance_monitor)
    t2 = threading.Thread(target=camera_capture)
    t3 = threading.Thread(target=run_flask)

    # Set threads as daemon threads
    t1.daemon = True
    t2.daemon = True
    t3.daemon = True
    # Start the threads
    t1.start()
    t2.start()
    t3.start()

    # The main thread waits for the camera capture thread to finish
    t1.join()
    t2.join()
    t3.join()

# Wait for the threads to finish
except KeyboardInterrupt:
    print("User interrupts program")
finally:
    GPIO.cleanup()
    print("Cleanup completed")
