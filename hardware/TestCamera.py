import time
import RPi.GPIO as GPIO
from picamera2 import Picamera2
from datetime import datetime

# Setup GPIO mode
GPIO.setmode(GPIO.BCM)

# define GPIO pins
BUTTON_PIN = 10
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

# initialize the camera
camera = Picamera2()
camera.start()
time.sleep(2)  #wait for the camera to warm up

print("System ready. Press the button to take a photo.")

try:
    while True:
        if GPIO.input(BUTTON_PIN) == GPIO.HIGH:
            # Get the current timestamp for the filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"photo_{timestamp}.jpg"
            print(f"Photo taking... File name: {filename}")
            camera.capture_file(filename)
            print(f"Photo is saved as {filename}")
            time.sleep(1)  # Debounce delay
except KeyboardInterrupt:
    print("Terminating the program...")
finally:
    camera.stop()
    GPIO.cleanup()
