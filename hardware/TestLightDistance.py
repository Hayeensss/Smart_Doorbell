import RPi.GPIO as GPIO
import time
from PiicoDev_VEML6030 import PiicoDev_VEML6030

# === GPIO 设置 ===
GPIO.setmode(GPIO.BCM)
TRIG = 5
ECHO = 6
RELAY_PIN = 17

GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)
GPIO.setup(RELAY_PIN, GPIO.OUT, initial=GPIO.HIGH)

# 初始化光照传感器
light_sensor = PiicoDev_VEML6030()
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

finally:
    GPIO.cleanup()
