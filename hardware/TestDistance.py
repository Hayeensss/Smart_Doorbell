import RPi.GPIO as GPIO
import time

try:
    # Setup GPIO mode
    GPIO.setmode(GPIO.BCM)

    # define GPIO pins
    PIN_TRIGGER = 5  
    PIN_ECHO = 6    

    # setup GPIO pins
    GPIO.setup(PIN_TRIGGER, GPIO.OUT)
    GPIO.setup(PIN_ECHO, GPIO.IN)

    # initialize the trigger pin to LOW
    GPIO.output(PIN_TRIGGER, GPIO.LOW)
    print("Waiting for sensor to settle")
    time.sleep(2)

    # Send a pulse to the trigger pin
    print("Calculating distance")
    GPIO.output(PIN_TRIGGER, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(PIN_TRIGGER, GPIO.LOW)

    # Record the time when the ECHO pin goes HIGH 
    while GPIO.input(PIN_ECHO) == 0:
        pulse_start_time = time.time()

    # Record the time when the ECHO pin goes LOW
    while GPIO.input(PIN_ECHO) == 1:
        pulse_end_time = time.time()

    # Calculate the distance (in cm)
    pulse_duration = pulse_end_time - pulse_start_time
    distance = round(pulse_duration * 17150, 2)
    print("Distance: " + str(distance) + " cm")

finally:
    GPIO.cleanup()
