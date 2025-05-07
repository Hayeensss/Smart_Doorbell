import time
import RPi.GPIO as GPIO
from datetime import datetime
import subprocess
from picamera2 import Picamera2, encoders
import os  # 用于删除中间文件

# 设置 GPIO
GPIO.setmode(GPIO.BCM)
BUTTON_PIN = 10
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

print("系统就绪：按下按钮将同时录制音视频，并合并为 mp4 文件...")

try:
    while True:
        if GPIO.input(BUTTON_PIN) == GPIO.HIGH:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            video_filename = f"video_{timestamp}.h264"
            audio_filename = f"audio_{timestamp}.wav"
            output_filename = f"output_{timestamp}.mp4"

            print("准备摄像头...")
            camera = Picamera2()
            video_config = camera.create_video_configuration(main={"size": (1280, 720)})
            camera.configure(video_config)
            camera.start()
            time.sleep(1)

            print("开始录音和录像...")

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

            print("录音录像完成，开始合成音视频...")

            ffmpeg_cmd = [
                "ffmpeg", "-y",
                "-i", video_filename,
                "-i", audio_filename,
                "-c:v", "copy", "-c:a", "aac",
                output_filename
            ]
            subprocess.run(ffmpeg_cmd)

            print(f"合成完成，文件保存为：{output_filename}")

            # ✅ 自动删除中间文件
            os.remove(video_filename)
            os.remove(audio_filename)

            print("已删除中间文件，仅保留 MP4。")
            time.sleep(1)

except KeyboardInterrupt:
    print("程序终止。")

finally:
    GPIO.cleanup()