import RPi.GPIO as GPIO
import time
from PiicoDev_VEML6030 import PiicoDev_VEML6030

# === GPIO setting ===
GPIO.setmode(GPIO.BCM)
TRIG = 5
ECHO = 6
RELAY_PIN = 17

GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)
GPIO.setup(RELAY_PIN, GPIO.OUT, initial=GPIO.HIGH)

# initialize light sensor
light_sensor = PiicoDev_VEML6030()
time.sleep(1)

# define the function to get distance
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

# main loop of monitoring
try:
    print("Testing light and distance sensor...")
    while True:
        lux = light_sensor.read()
        distance = get_distance_cm()

        print(f"Light: {lux:.2f} lux | Distance: {distance:.2f} cm")

        if lux < 50 and distance < 100:
            GPIO.output(RELAY_PIN, GPIO.LOW)  # Switch on the light
            print("Dark + Close → Switch on the light")
        else:
            GPIO.output(RELAY_PIN, GPIO.HIGH)  # Switch off the light
            print("Light + Far → Switch off the light")

        time.sleep(1)

except KeyboardInterrupt:
    print("Terminating the program...")

finally:
    GPIO.cleanup()
