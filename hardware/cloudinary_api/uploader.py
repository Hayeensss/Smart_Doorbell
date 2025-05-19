# File: hardware/cloudinary_api/uploader.py
import cloudinary
import cloudinary.uploader
import mimetypes
from .retry import retry_uploader 

# Cloudinary Configuration
# Configure Cloudinary with account credentials and secure connection setting.
cloudinary.config(
    cloud_name = "dihuubzfr",
    api_key = "764725392948151",
    api_secret = "FSubqmLeShPriV2iFT07iCIb2mQ", # Cloudinary API secret key
    secure=True # Use HTTPS for secure connections
)

# Apply the retry_uploader decorator to handle potential upload failures.
@retry_uploader(max_attempts=3, delay=1)
def upload_image(file_path):
    """
    Uploads an image file to Cloudinary's Home/IoT-image folder.
    Returns the secure URL if successful, or an error message if failed.
    """
    # Guess the MIME type of the file based on its extension.
    mime_type, _ = mimetypes.guess_type(file_path)
    # Check if the file is an image based on its MIME type.
    if not mime_type or not mime_type.startswith("image"):
        # Return an error if the file is not recognized as an image.
        return {"status": "error", "message": "The file is not an image"}

    # Define the target folder in Cloudinary for image uploads.
    folder = "Home/IoT-image"

    try:
        # Attempt to upload the file to Cloudinary.
        response = cloudinary.uploader.upload(
            file_path, # Path to the file to upload
            folder=folder, # Target folder in Cloudinary
            resource_type="image" # Specify the resource type as image
        )
        # Extract the secure URL from the upload response.
        secure_url = response.get("secure_url")
        # Check if a secure URL was returned.
        if not secure_url:
            # Return an error if no URL was found in the response.
            return {"status": "error", "message": "Upload failed: no URL returned"}
        # Return success status and the secure URL.
        return {"status": "success", "url": secure_url}

    except Exception as e:
        # Catch any exceptions during the upload process.
        # Return an error status and the exception message.
        return {"status": "error", "message": str(e)}

# Apply the retry_uploader decorator to handle potential upload failures.
@retry_uploader(max_attempts=3, delay=1)
def upload_video(file_path):
    """
    Uploads a video file to Cloudinary's Home/IoT-video folder.
    Returns the secure URL if successful, or an error message if failed.
    """
    # Guess the MIME type of the file based on its extension.
    mime_type, _ = mimetypes.guess_type(file_path)
    # Check if the file is a video based on its MIME type.
    if not mime_type or not mime_type.startswith("video"):
        # Return an error if the file is not recognized as a video.
        return {"status": "error", "message": "The file is not a video"}

    # Define the target folder in Cloudinary for video uploads.
    folder = "Home/IoT-video"

    try:
        # Attempt to upload the file to Cloudinary.
        response = cloudinary.uploader.upload(
            file_path, # Path to the file to upload
            folder=folder, # Target folder in Cloudinary
            resource_type="video" # Specify the resource type as video
        )
        # Extract the secure URL from the upload response.
        secure_url = response.get("secure_url")
        # Check if a secure URL was returned.
        if not secure_url:
            # Return an error if no URL was found in the response.
            return {"status": "error", "message": "Upload failed: no URL returned"}
        # Return success status and the secure URL.
        return {"status": "success", "url": secure_url}

    except Exception as e:
        # Catch any exceptions during the upload process.
        # Return an error status and the exception message.
        return {"status": "error", "message": str(e)}
