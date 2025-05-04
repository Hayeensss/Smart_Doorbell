import RPi.GPIO as GPIO
import time

try:
    # 设置 GPIO 编号模式为 BCM
    GPIO.setmode(GPIO.BCM)

    # 定义使用的 BCM 引脚号
    PIN_TRIGGER = 5  
    PIN_ECHO = 6     # 对应物理引脚 11

    # 设置 GPIO 引脚方向
    GPIO.setup(PIN_TRIGGER, GPIO.OUT)
    GPIO.setup(PIN_ECHO, GPIO.IN)

    # 初始化 Trigger 引脚为低电平
    GPIO.output(PIN_TRIGGER, GPIO.LOW)
    print("Waiting for sensor to settle")
    time.sleep(2)

    # 发送一个超短高电平脉冲
    print("Calculating distance")
    GPIO.output(PIN_TRIGGER, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(PIN_TRIGGER, GPIO.LOW)

    # 记录 ECHO 引脚从低变高的时间（声波发出）
    while GPIO.input(PIN_ECHO) == 0:
        pulse_start_time = time.time()

    # 记录 ECHO 引脚从高变低的时间（声波返回）
    while GPIO.input(PIN_ECHO) == 1:
        pulse_end_time = time.time()

    # 计算距离（单位：cm）
    pulse_duration = pulse_end_time - pulse_start_time
    distance = round(pulse_duration * 17150, 2)
    print("Distance: " + str(distance) + " cm")

finally:
    GPIO.cleanup()
