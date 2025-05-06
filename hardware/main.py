import RPi.GPIO as GPIO
import time
import subprocess
import os
from datetime import datetime
from picamera2 import Picamera2, encoders
import threading
import queue
from PiicoDev_VEML6030 import PiicoDev_VEML6030
from cloudinary_api import upload_image, upload_video, insert_media_record, insert_event_record

doorbell_id = "a1b2c3d4-e5f6-7890-1234-567890abcdef"

# === 配置区域 ===

# 扩音器，麦克风和按钮引脚
BUTTON_PIN = 10
MICROPHONE_CARD = 3
OUTDOOR_SPEAKER_CARD = 2
INDOOR_SPEAKER_CARD = 4
AUDIO_DEVICE = 0

# 距离传感器/灯泡引脚
TRIG = 5
ECHO = 6
RELAY_PIN = 17


# === 初始化引脚 ===
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(RELAY_PIN, GPIO.OUT, initial=GPIO.HIGH)
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)


# 初始化相机和光照传感器
camera = Picamera2()
camera.start()
time.sleep(2)
light_sensor = PiicoDev_VEML6030()


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
    return filename

# 视频录制函数
def record_video(output_queue):
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
    output_queue.put(output_file) # Put the output file path into the queue for upload

    # 恢复为拍照模式
    camera.configure(camera.create_still_configuration(main={"size": (1280, 720)}))
    camera.start()
    time.sleep(1)


# 距离测量函数
def get_distance_cm():
    GPIO.output(TRIG, False)
    time.sleep(0.05)
    GPIO.output(TRIG, True)
    time.sleep(0.00001)
    GPIO.output(TRIG, False)

    while GPIO.input(ECHO) == 0:
        pulse_start = time.time()
    while GPIO.input(ECHO) == 1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start
    distance_cm = round(pulse_duration * 17150, 2)
    return distance_cm


def light_and_distance_monitor():
    # 主监测循环
    try:
        print("✅ 正在监测环境亮度与前方距离...")
        while True:
            lux = light_sensor.read()
            distance = get_distance_cm()

            print(f"光照: {lux:.2f} lux | 距离: {distance:.2f} cm")

            if lux < 50 and distance < 100:
                GPIO.output(RELAY_PIN, GPIO.LOW)  # 开灯
                print("💡 天黑 + 有人靠近 → 开灯")
            else:
                GPIO.output(RELAY_PIN, GPIO.HIGH)  # 关灯
                print("🌞 光线充足或无人靠近 → 灭灯")

            time.sleep(1)

    except KeyboardInterrupt:
        print("程序终止")


def camera_capture():
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
                # 三连击录像
                if waiting_for_third_press and len(press_times) >= 3 and now - press_times[-3] < 5:
                    print("🎬 检测到 5 秒内快速按下 3 次 → 开始录制")
                    play_audio("Audios/countdown.wav", card=OUTDOOR_SPEAKER_CARD)
                    play_audio("Audios/bi_tone.wav", card=OUTDOOR_SPEAKER_CARD)
                    result_queue = queue.Queue()
                    record_thread = threading.Thread(target=record_video, args=(result_queue,))
                    record_thread.start()
                    record_thread.join() 
            
                    play_audio("Audios/bi_tone.wav", card=OUTDOOR_SPEAKER_CARD)
                    play_audio("Audios/videofinish.wav", card=OUTDOOR_SPEAKER_CARD)
                    # Ryan, 这里按钮了，储存了一个10s视频，这里可以连API
                    if not result_queue.empty():
                        video_file = result_queue.get()
                    else:
                        print("Failed to get video result.")
                    
                    # Upload video to Cloudinary
                    result = upload_video(video_file)

                    if result["status"] == "success":
                        print(f"Upload successful: {result['url']}")

                        # 3. Insert media record
                        media_id = insert_media_record(
                            event_ref=event_id,
                            media_type="video",
                            url=result["url"]
                        )

                        if media_id:
                            print(f"Media record created with ID: {media_id}")
                        else:
                            print("Failed to insert media record.")
                    else:
                        print(f"Upload failed: {result['message']}")



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
                    image_file = take_photo()
                    # Ryan, 这里按钮了，储存了一个图片，这里可以连API

                    # Create event record
                    event_id = insert_event_record(
                        device_id=doorbell_id,
                        event_type="button_pressed",
                        payload={"message": "Doorbell rings"}
                    )

                    if not event_id:
                        print("Failed to insert event record.")
                    else:
                        print(f"Event created with ID: {event_id}")

                        # Upload photo to Cloudinary
                        result = upload_image(image_file)

                        if result["status"] == "success":
                            print(f"Upload successful: {result['url']}")

                            # 3. Insert media record
                            media_id = insert_media_record(
                                event_ref=event_id,
                                media_type="image",
                                url=result["url"]
                            )

                            if media_id:
                                print(f"Media record created with ID: {media_id}")
                            else:
                                print("Failed to insert media record.")
                        else:
                            print(f"Upload failed: {result['message']}")


                    

                # 第二次按下（20s 内）
                elif not waiting_for_third_press and now - first_press_time < 20:
                    last_second_press_time = now
                    waiting_for_third_press = True
                    print("📢 20 秒内再次按下 → 再拍照 + 门铃 + 提示音")
                    play_dual_audio("Audios/doorbell.wav")
                    image_file = take_photo()
                    play_audio("Audios/press3times.wav", card=OUTDOOR_SPEAKER_CARD)
                    # Ryan, 这里按钮了，储存了一个图片，这里可以连API

                    # Upload photo to Cloudinary
                    result = upload_image(image_file)

                    if result["status"] == "success":
                        print(f"Upload successful: {result['url']}")

                        # 3. Insert media record
                        media_id = insert_media_record(
                            event_ref=event_id,
                            media_type="image",
                            url=result["url"]
                        )

                        if media_id:
                            print(f"Media record created with ID: {media_id}")
                        else:
                            print("Failed to insert media record.")
                    else:
                        print(f"Upload failed: {result['message']}")



                time.sleep(1)

            time.sleep(0.1)

    except KeyboardInterrupt:
        print("🛑 手动终止")




# === 主程序 ===
try:
    t1 = threading.Thread(target=light_and_distance_monitor)
    t2 = threading.Thread(target=camera_capture)

    t1.start()
    t2.start()

    t1.join()
    t2.join()

except KeyboardInterrupt:
    print("🛑 用户中断程序")
finally:
    GPIO.cleanup()
    print("✅ 清理完毕")
