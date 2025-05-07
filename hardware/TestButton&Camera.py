import RPi.GPIO as GPIO
import time
import subprocess
import os
from datetime import datetime
from picamera2 import Picamera2, encoders
import threading

# === 配置区域 ===
BUTTON_PIN = 10
MICROPHONE_CARD = 2
OUTDOOR_SPEAKER_CARD = 4
INDOOR_SPEAKER_CARD = 3

AUDIO_DEVICE = 0

# 初始化 GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

# 初始化相机
camera = Picamera2()
camera.start()
time.sleep(2)

# 音频播放函数
def play_audio(file, card, device=AUDIO_DEVICE):
    subprocess.run(["aplay", "-D", f"plughw:{card},{device}", file])

# 播放双声道音频
def play_dual_audio(file):
    t1 = threading.Thread(target=play_audio, args=(file, INDOOR_SPEAKER_CARD))
    t2 = threading.Thread(target=play_audio, args=(file, OUTDOOR_SPEAKER_CARD))
    t1.start()
    t2.start()
    t1.join()
    t2.join()

# 拍照函数
def take_photo():
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"Record/photo_{ts}.jpg"
    camera.capture_file(filename)
    print(f"📸 拍照成功：{filename}")

# 视频录制函数
def record_video():
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    video_file = f"Record/video_{ts}.h264"
    audio_file = f"Record/audio_{ts}.wav"
    output_file = f"Record/output_{ts}.mp4"

    try:
        camera.stop()
        time.sleep(0.5)
    except Exception as e:
        print("相机停止时出错（可忽略）:", e)

    video_config = camera.create_video_configuration(main={"size": (1280, 720)})
    camera.configure(video_config)
    camera.start()
    time.sleep(1)

    # 录音
    arecord_cmd = [
        "arecord", "-D", f"hw:{MICROPHONE_CARD},0",
        "-f", "S16_LE", "-r", "44100", "-c", "1",
        "-t", "wav", "-d", "10", audio_file
    ]
    arecord_proc = subprocess.Popen(arecord_cmd)

    # 录像
    camera.start_recording(output=video_file, encoder=encoders.H264Encoder(bitrate=4000000))
    time.sleep(10)
    camera.stop_recording()
    camera.stop()
    arecord_proc.wait()

    # 合成音视频
    subprocess.run(["ffmpeg", "-y", "-i", video_file, "-i", audio_file, "-c:v", "copy", "-c:a", "aac", output_file])
    os.remove(video_file)
    os.remove(audio_file)
    print(f"🎥 视频合成完成：{output_file}")

    # 恢复为拍照模式
    camera.configure(camera.create_still_configuration(main={"size": (1280, 720)}))
    camera.start()
    time.sleep(1)

# 主程序逻辑
try:
    print("🎯 按钮测试程序已启动")

    press_times = []
    first_press_time = None
    last_second_press_time = None
    waiting_for_third_press = False

    while True:
        now = time.time()

        # 自动重置机制：超过10秒未完成三连击
        if waiting_for_third_press and last_second_press_time and (now - last_second_press_time > 20):
            print("⏱️ 超过20秒未完成三连击，自动重置状态")
            waiting_for_third_press = False
            press_times.clear()
            first_press_time = None
            last_second_press_time = None

        # 自动重置机制：首次按下后20秒未再按
        if first_press_time and not waiting_for_third_press and (now - first_press_time > 20):
            print("⏱️ 超过20秒未按第二次 → 自动重置为初始状态")
            first_press_time = None
            press_times.clear()

        # 检测按钮按下
        if GPIO.input(BUTTON_PIN) == GPIO.HIGH:
            press_times.append(now)
            press_times = [t for t in press_times if now - t <= 5]
            print("🔘 当前按键时间戳：", [round(t % 60, 2) for t in press_times])

            # 三连击录像
            if waiting_for_third_press and len(press_times) >= 3 and now - press_times[-3] < 5:
                print("🎬 检测到 5 秒内快速按下 3 次 → 开始录制")
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

            # 第一次按下
            if not first_press_time:
                first_press_time = now
                print("🔔 第一次按下 → 拍照 + 门铃")
                play_dual_audio("Audios/doorbell.wav")
                take_photo()

            # 第二次按下（20s 内）
            elif not waiting_for_third_press and now - first_press_time < 20:
                last_second_press_time = now
                waiting_for_third_press = True
                print("📢 20 秒内再次按下 → 再拍照 + 门铃 + 提示音")
                play_dual_audio("Audios/doorbell.wav")
                take_photo()
                play_audio("Audios/press3times.wav", card=OUTDOOR_SPEAKER_CARD)

            time.sleep(1)

        time.sleep(0.1)

except KeyboardInterrupt:
    print("🛑 手动终止")

finally:
    GPIO.cleanup()
    camera.stop()
