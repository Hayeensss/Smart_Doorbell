import RPi.GPIO as GPIO
import time

# 设置模式：使用BCM编号方式
GPIO.setmode(GPIO.BCM)

# 定义接继电器的GPIO引脚
RELAY_PIN = 17

# 设置继电器控制引脚为输出，并且上电时默认高电平（灯泡灭）
GPIO.setup(RELAY_PIN, GPIO.OUT, initial=GPIO.HIGH)

print("初始化完成，灯泡保持熄灭。")

# 等待2秒
time.sleep(2)

# 点亮灯泡（继电器吸合）
GPIO.output(RELAY_PIN, GPIO.LOW)
print("灯泡点亮！")

# 保持5秒
time.sleep(5)

# 熄灭灯泡（继电器断开）
GPIO.output(RELAY_PIN, GPIO.HIGH)
print("灯泡熄灭！")

# 释放资源
GPIO.cleanup()
