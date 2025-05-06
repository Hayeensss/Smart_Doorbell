import string
from cloudinary_api import upload_image
from cloudinary_api import upload_video
from cloudinary_api import insert_media_record
from cloudinary_api import insert_event_record

test_image_file1 = "Smart_Doorbell/hardware/cloudinary_api_test_files/test_image1.jpeg"
test_image_file2 = "Smart_Doorbell/hardware/cloudinary_api_test_files/test_image2.jpeg"
test_video_file = "Smart_Doorbell/hardware/cloudinary_api_test_files/test_video.mp4"
doorbell_id = "a1b2c3d4-e5f6-7890-1234-567890abcdef"


def first_button_press(image_file:string):
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
    return


def second_button_press(image_file:string, event_id:int):
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
    return


def Thiple_hit_video(video_file:string, event_id:int):
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
    return


if __name__ == "__main__":
    # 1. Test create event and upload image (fist button press)
    first_button_press(test_image_file1)
    print('----------------------------------')
    # 2. Test upload image (second button press)
    second_button_press(test_image_file2, 100)
    print('----------------------------------')
    # 3. Test insert media record (triple hit video recoding)
    Thiple_hit_video(test_video_file, 100)
    
