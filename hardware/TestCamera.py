import time
import RPi.GPIO as GPIO
from picamera2 import Picamera2
from datetime import datetime

# 设置 GPIO 模式为 BCM
GPIO.setmode(GPIO.BCM)

# 按钮引脚定义
BUTTON_PIN = 10
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

# 初始化摄像头
camera = Picamera2()
camera.start()
time.sleep(2)  # 等待摄像头准备

print("系统就绪：请按下按钮拍照。")

try:
    while True:
        if GPIO.input(BUTTON_PIN) == GPIO.HIGH:
            # 获取当前时间戳作为文件名
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"photo_{timestamp}.jpg"
            print(f"拍照中... 文件名: {filename}")
            camera.capture_file(filename)
            print(f"照片已保存为 {filename}")
            time.sleep(1)  # 防止按钮连发
except KeyboardInterrupt:
    print("程序终止。")
finally:
    camera.stop()
    GPIO.cleanup()
