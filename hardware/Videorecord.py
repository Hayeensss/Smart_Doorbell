import time
import RPi.GPIO as GPIO
from datetime import datetime
import subprocess
from picamera2 import Picamera2, encoders
import os  

# setup GPIO
GPIO.setmode(GPIO.BCM)
BUTTON_PIN = 10
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

print("system ready, waiting for button press...")

try:
    while True:
        if GPIO.input(BUTTON_PIN) == GPIO.HIGH:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            video_filename = f"video_{timestamp}.h264"
            audio_filename = f"audio_{timestamp}.wav"
            output_filename = f"output_{timestamp}.mp4"

            print("preparing to record...")
            camera = Picamera2()
            video_config = camera.create_video_configuration(main={"size": (1280, 720)})
            camera.configure(video_config)
            camera.start()
            time.sleep(1)

            print("starting recording...")

            arecord_cmd = [
                "arecord", "-D", "hw:2,0",
                "-f", "S16_LE",
                "-r", "44100",
                "-c", "1",
                "-t", "wav",
                "-d", "10",
                audio_filename
            ]
            arecord_proc = subprocess.Popen(arecord_cmd)

            camera.start_recording(
                output=video_filename,
                encoder=encoders.H264Encoder(bitrate=10000000)
            )

            time.sleep(10)

            camera.stop_recording()
            camera.stop()
            arecord_proc.wait()

            print("finished recording, processing video...")

            ffmpeg_cmd = [
                "ffmpeg", "-y",
                "-i", video_filename,
                "-i", audio_filename,
                "-c:v", "copy", "-c:a", "aac",
                output_filename
            ]
            subprocess.run(ffmpeg_cmd)

            print(f"finish recording, file saved as {output_filename}")

            # automatically delete the original video and
            os.remove(video_filename)
            os.remove(audio_filename)

            print("deleted original video and audio files. Only keep the mp4")
            time.sleep(1)

except KeyboardInterrupt:
    print("Program interrupted by user.")

finally:
    GPIO.cleanup()