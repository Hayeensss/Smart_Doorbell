import time
import functools

def retry_db(max_attempts=3, delay=1):
    """
    Decorator to retry a function call if it raises an exception.
    :param max_attempts: Maximum number of attempts to retry the function.
    :param delay: Delay in seconds between attempts.
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    result = func(*args, **kwargs)
                    if result:
                        return result
                    else:
                        print(f"[Retry {attempt}/{max_attempts}] {func.__name__} returned falsy result.")
                except Exception as e:
                    print(f"[Retry {attempt}/{max_attempts}] {func.__name__} raised error: {e}")
                time.sleep(delay)
            print(f"[ERROR] {func.__name__} failed after {max_attempts} attempts.")
            return None
        return wrapper
    return decorator


def retry_uploader(max_attempts=3, delay=1, retry_on_falsy=True):
    """
    Decorator to retry a Cloudinary uploader function call if it raises an exception.
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    result = func(*args, **kwargs)
                    if not retry_on_falsy or result:
                        return result
                    print(f"[Retry {attempt}/{max_attempts}] {func.__name__} returned falsy result.")
                except Exception as e:
                    print(f"[Retry {attempt}/{max_attempts}] {func.__name__} raised error: {e}")
                time.sleep(delay)
            print(f"[ERROR] {func.__name__} failed after {max_attempts} attempts.")
            return {"status": "error", "message": f"{func.__name__} failed after retries"}
        return wrapper
    return decorator