import RPi.GPIO as GPIO
import time

# Set up GPIO mode
GPIO.setmode(GPIO.BCM)

# define the GPIO pin for the relay
RELAY_PIN = 17

#  set up the GPIO pin for the relay
GPIO.setup(RELAY_PIN, GPIO.OUT, initial=GPIO.HIGH)

print("Finish the initial setup, waiting for 2 seconds...")

# wait for 2 seconds
time.sleep(2)

# light up the bulb (relay closed)
GPIO.output(RELAY_PIN, GPIO.LOW)
print("light on！")

# stay on for 5 seconds
time.sleep(5)

# turn off the bulb (relay opened)
GPIO.output(RELAY_PIN, GPIO.HIGH)
print("light off！")

# clean up the GPIO settings
GPIO.cleanup()
