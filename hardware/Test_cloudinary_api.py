# File: hardware/Test_cloudinary_api.py
# This script tests the Cloudinary API integration functions for a smart doorbell.

import string # Import the string module (though not explicitly used in this snippet, it might be a leftover or used elsewhere in the module)
# Import necessary functions from the cloudinary_api module
from cloudinary_api import upload_image
from cloudinary_api import upload_video
from cloudinary_api import insert_media_record
from cloudinary_api import insert_event_record

# Define paths to test media files
test_image_file1 = "Smart_Doorbell/hardware/cloudinary_api_test_files/test_image1.jpeg"
test_image_file2 = "Smart_Doorbell/hardware/cloudinary_api_test_files/test_image2.jpeg"
test_video_file = "Smart_Doorbell/hardware/cloudinary_api_test_files/test_video.mp4"

# Define a static doorbell ID for testing purposes
doorbell_id = "a1b2c3d4-e5f6-7890-1234-567890abcdef"


# Function simulating the first button press event
def first_button_press(image_file:string):
    # 1. Create an event record in the database for a button press
    event_id = insert_event_record(
        device_id=doorbell_id, # Associate the event with the doorbell ID
        event_type="button_pressed", # Specify the event type
        payload={"message": "Doorbell rings"} # Include a simple payload message
    )

    # Check if the event record was successfully inserted
    if not event_id:
        print("Failed to insert event record.")
    else:
        # Print the ID of the newly created event
        print(f"Event created with ID: {event_id}")

        # 2. Upload the image file to Cloudinary
        result = upload_image(image_file)

        # Check if the image upload was successful
        if result["status"] == "success":
            # Print the successful upload URL
            print(f"Upload successful: {result['url']}")

            # 3. Insert a media record in the database linking the event and the uploaded image
            media_id = insert_media_record(
                event_ref=event_id, # Link to the previously created event
                media_type="image", # Specify the media type
                url=result["url"] # Store the Cloudinary URL
            )

            # Check if the media record was successfully inserted
            if media_id:
                print(f"Media record created with ID: {media_id}")
            else:
                print("Failed to insert media record.")
        else:
            # Print the error message if upload failed
            print(f"Upload failed: {result['message']}")
    # The function implicitly returns None
    return


# Function simulating a second button press event (assuming an existing event_id)
def second_button_press(image_file:string, event_id:int):
    # 1. Upload the image file to Cloudinary
    result = upload_image(image_file)

    # Check if the image upload was successful
    if result["status"] == "success":
        # Print the successful upload URL
        print(f"Upload successful: {result['url']}")

        # 2. Insert a media record in the database linking the existing event and the uploaded image
        media_id = insert_media_record(
            event_ref=event_id, # Link to the provided existing event ID
            media_type="image", # Specify the media type
            url=result["url"] # Store the Cloudinary URL
        )

        # Check if the media record was successfully inserted
        if media_id:
            print(f"Media record created with ID: {media_id}")
        else:
            print("Failed to insert media record.")
    else:
        # Print the error message if upload failed
        print(f"Upload failed: {result['message']}")
    # The function implicitly returns None
    return


# Function simulating a triple hit event resulting in video recording
def Thiple_hit_video(video_file:string, event_id:int):
    # 1. Upload the video file to Cloudinary
    result = upload_video(video_file)

    # Check if the video upload was successful
    if result["status"] == "success":
        # Print the successful upload URL
        print(f"Upload successful: {result['url']}")

        # 2. Insert a media record in the database linking the existing event and the uploaded video
        media_id = insert_media_record(
            event_ref=event_id, # Link to the provided existing event ID
            media_type="video", # Specify the media type
            url=result["url"] # Store the Cloudinary URL
        )

        # Check if the media record was successfully inserted
        if media_id:
            print(f"Media record created with ID: {media_id}")
        else:
            print("Failed to insert media record.")
    else:
        # Print the error message if upload failed
        print(f"Upload failed: {result['message']}")
    # The function implicitly returns None
    return


# Main execution block
if __name__ == "__main__":
    # This block runs only when the script is executed directly

    # 1. Test case: Simulate the first button press (creates event and uploads image)
    print("--- Testing First Button Press ---")
    first_button_press(test_image_file1)
    print('----------------------------------') # Separator for test outputs

    # 2. Test case: Simulate a second button press (uploads another image linked to a dummy event ID 100)
    # Note: Using a hardcoded event_id=100 assumes this ID exists or is handled appropriately by insert_media_record.
    print("--- Testing Second Button Press ---")
    second_button_press(test_image_file2, 100)
    print('----------------------------------') # Separator for test outputs

    # 3. Test case: Simulate a triple hit video recording (uploads video linked to a dummy event ID 100)
    # Note: Using a hardcoded event_id=100 assumes this ID exists or is handled appropriately by insert_media_record.
    print("--- Testing Triple Hit Video ---")
    Thiple_hit_video(test_video_file, 100)
