# File: hardware/cloudinary_api/db_io.py
import psycopg2
from psycopg2 import sql
from datetime import datetime, timezone
from .retry import retry_db
import json

# Decorator to retry the function on database errors
@retry_db(max_attempts=3, delay=2)
def insert_media_record(event_ref, media_type, url, duration_s=None, transcript=None):
    """
    Inserts a new media record into the PostgreSQL 'media' table.

    Parameters:
    - event_ref: int, foreign key referencing an event
    - media_type: str, e.g. 'video', 'audio'
    - url: str, media file URL
    - duration_s: int, optional, media duration in seconds
    - transcript: str, optional, transcript of audio/video

    Returns:
    - inserted record ID or error message
    """
    try:
        # Establish a connection to the PostgreSQL database
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres.uyuevbmeshcnwzdfysta",
            password="Iotproject000.",
            host="aws-0-ap-southeast-2.pooler.supabase.com",
            port=6543,
            sslmode="require"
        )
        # Create a cursor object to execute SQL commands
        cur = conn.cursor()
        # Check if cursor was successfully created (implies connection)
        if cur:
            print("Connected to database")
        else:
            print("Failed to connect to database")
            return None

        # Define the SQL query for inserting a new media record
        query = sql.SQL("""
            INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING media_id; -- Return the ID of the newly inserted row
        """)

        # Get the current timestamp in UTC
        now = datetime.now(timezone.utc)
        # Set a default duration if none is provided
        if duration_s is None:
            duration_s = 10  # Set a default duration if not provided
        else:
            duration_s = duration_s  # Use provided duration

        # Execute the insert query with the provided parameters
        cur.execute(query, (event_ref, media_type, url, duration_s, transcript, now))
        # Fetch the returned media_id
        media_id = cur.fetchone()[0]

        # Commit the transaction to save the changes
        conn.commit()
        # Close the cursor
        cur.close()
        # Close the database connection
        conn.close()
        # Return the inserted media ID
        return media_id

    except Exception as e:
        # Handle any exceptions that occur during the process
        print(f"Database connection or insertion failed: {e}")
        return None


# Decorator to retry the function on database errors
@retry_db(max_attempts=3, delay=2)
def insert_event_record(device_id, event_type, payload=None, occurred_at=None):
    """
    Inserts a new event record into the PostgreSQL 'events' table.

    Parameters:
    - device_id: str (UUID of the device, must exist in devices table)
    - event_type: str (e.g. 'ring', 'motion')
    - payload: dict (optional JSON content, default is empty dict)
    - occurred_at: datetime (optional timestamp, defaults to now)

    Returns:
    - Inserted event ID or error message
    """
    try:
        # Establish a connection to the PostgreSQL database
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres.uyuevbmeshcnwzdfysta",
            password="Iotproject000.",
            host="aws-0-ap-southeast-2.pooler.supabase.com",
            port=6543,
            sslmode="require"
        )
        # Create a cursor object to execute SQL commands
        cur = conn.cursor()
        # Check if cursor was successfully created (implies connection)
        if cur:
            print("Connected to database")
        else:
            print("Failed to connect to database")
            return None

        # Set default payload to an empty dictionary if none is provided
        if payload is None:
            payload = {}

        # Set default occurred_at to the current UTC time if none is provided
        if occurred_at is None:
            occurred_at = datetime.now(timezone.utc)

        # Define the SQL query for inserting a new event record
        query = sql.SQL("""
            INSERT INTO events (device_id, event_type, payload, occurred_at)
            VALUES (%s, %s, %s, %s)
            RETURNING event_id; -- Return the ID of the newly inserted row
        """)

        # Execute the insert query with the provided parameters
        # json.dumps converts the Python dict payload to a JSON string for the database
        cur.execute(query, (device_id, event_type, json.dumps(payload), occurred_at))
        # Fetch the returned event_id
        event_id = cur.fetchone()[0]

        # Commit the transaction to save the changes
        conn.commit()
        # Close the cursor
        cur.close()
        # Close the database connection
        conn.close()

        # Return the inserted event ID
        return event_id

    except Exception as e:
        # Handle any exceptions that occur during the process
        print(f"Database connection or insertion failed: {e}")
        return None
