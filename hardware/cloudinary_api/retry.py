# File: hardware/cloudinary_api/retry.py
import time
import functools

def retry_db(max_attempts=3, delay=1):
    """
    Decorator to retry a function call if it raises an exception or returns a falsy value.
    Specifically designed for database operations.
    :param max_attempts: Maximum number of attempts to retry the function.
    :param delay: Delay in seconds between attempts.
    """
    # This is the decorator factory function
    def decorator(func):
        # functools.wraps preserves the original function's name, docstring, etc.
        @functools.wraps(func)
        # This is the wrapper function that replaces the original function
        def wrapper(*args, **kwargs):
            # Loop through the specified number of retry attempts
            for attempt in range(1, max_attempts + 1):
                try:
                    # Attempt to call the original function
                    result = func(*args, **kwargs)
                    # If the function returns a truthy result, return it immediately
                    if result:
                        return result
                    else:
                        # Log if the function returned a falsy result (e.g., None, False, empty list)
                        print(f"[Retry {attempt}/{max_attempts}] {func.__name__} returned falsy result.")
                except Exception as e:
                    # Catch any exception raised by the function
                    # Log the attempt number, function name, and the error
                    print(f"[Retry {attempt}/{max_attempts}] {func.__name__} raised error: {e}")
                # Wait for the specified delay before the next attempt
                time.sleep(delay)
            # If all attempts fail, log an error message
            print(f"[ERROR] {func.__name__} failed after {max_attempts} attempts.")
            # Return None to indicate failure after retries
            return None
        # Return the wrapper function
        return wrapper
    # Return the decorator function
    return decorator


def retry_uploader(max_attempts=3, delay=1, retry_on_falsy=True):
    """
    Decorator to retry a Cloudinary uploader function call if it raises an exception.
    Can optionally retry on falsy results.
    :param max_attempts: Maximum number of attempts to retry the function.
    :param delay: Delay in seconds between attempts.
    :param retry_on_falsy: Boolean, whether to retry if the function returns a falsy value.
    """
    # This is the decorator factory function
    def decorator(func):
        # functools.wraps preserves the original function's name, docstring, etc.
        @functools.wraps(func)
        # This is the wrapper function that replaces the original function
        def wrapper(*args, **kwargs):
            # Loop through the specified number of retry attempts
            for attempt in range(1, max_attempts + 1):
                try:
                    # Attempt to call the original function
                    result = func(*args, **kwargs)
                    # Check if we should retry on falsy results OR if the result is truthy
                    # If retry_on_falsy is False, we only return on truthy results.
                    # If retry_on_falsy is True, we return on truthy results, otherwise we log and retry.
                    if not retry_on_falsy or result:
                        return result
                    # Log if the function returned a falsy result and retry_on_falsy is True
                    print(f"[Retry {attempt}/{max_attempts}] {func.__name__} returned falsy result.")
                except Exception as e:
                    # Catch any exception raised by the function
                    # Log the attempt number, function name, and the error
                    print(f"[Retry {attempt}/{max_attempts}] {func.__name__} raised error: {e}")
                # Wait for the specified delay before the next attempt
                time.sleep(delay)
            # If all attempts fail, log an error message
            print(f"[ERROR] {func.__name__} failed after {max_attempts} attempts.")
            # Return a dictionary indicating failure after retries
            return {"status": "error", "message": f"{func.__name__} failed after retries"}
        # Return the wrapper function
        return wrapper
    # Return the decorator function
    return decorator
