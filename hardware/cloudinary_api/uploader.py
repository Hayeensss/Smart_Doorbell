import cloudinary
import cloudinary.uploader
import mimetypes
from .retry import retry_uploader

# Configuration       
cloudinary.config( 
    cloud_name = "dihuubzfr", 
    api_key = "764725392948151", 
    api_secret = "FSubqmLeShPriV2iFT07iCIb2mQ", # Click 'View API Keys' above to copy your API secret
    secure=True
)

def upload_image(file_path):
    """
    Uploads an image file to Cloudinary's Home/IoT-image folder.
    Returns the secure URL if successful, or an error message if failed.
    """
    mime_type, _ = mimetypes.guess_type(file_path)
    if not mime_type or not mime_type.startswith("image"):
        return {"status": "error", "message": "The file is not an image"}

    folder = "Home/IoT-image"

    try:
        response = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            resource_type="image"
        )
        secure_url = response.get("secure_url")
        if not secure_url:
            return {"status": "error", "message": "Upload failed: no URL returned"}
        return {"status": "success", "url": secure_url}

    except Exception as e:
        return {"status": "error", "message": str(e)}


def upload_video(file_path):
    """
    Uploads a video file to Cloudinary's Home/IoT-video folder.
    Returns the secure URL if successful, or an error message if failed.
    """
    mime_type, _ = mimetypes.guess_type(file_path)
    if not mime_type or not mime_type.startswith("video"):
        return {"status": "error", "message": "The file is not a video"}

    folder = "Home/IoT-video"

    try:
        response = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            resource_type="video"
        )
        secure_url = response.get("secure_url")
        if not secure_url:
            return {"status": "error", "message": "Upload failed: no URL returned"}
        return {"status": "success", "url": secure_url}

    except Exception as e:
        return {"status": "error", "message": str(e)}