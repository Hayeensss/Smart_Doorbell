import psycopg2 
from psycopg2 import sql
from datetime import datetime, timezone
import json

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
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres.uyuevbmeshcnwzdfysta",
            password="Iotproject000.",
            host="aws-0-ap-southeast-2.pooler.supabase.com",
            port=6543,
            sslmode="require"
        )
        cur = conn.cursor()
        if cur:
            print("Connected to database")
        else:
            print("Failed to connect to database")
            return None

        query = sql.SQL("""
            INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING media_id;
        """)

        now = datetime.now(timezone.utc)
        if duration_s is None:
            duration_s = 10  # Set a default duration if not provided
        else:
            duration_s = duration_s  # Use provided duration

        cur.execute(query, (event_ref, media_type, url, duration_s, transcript, now))
        media_id = cur.fetchone()[0]

        conn.commit()
        cur.close()
        conn.close()
        return media_id

    except Exception as e:
        print(f"Database connection or insertion failed: {e}")
        return None
    

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
        conn = psycopg2.connect(
            dbname="postgres",
            user="postgres.uyuevbmeshcnwzdfysta",
            password="Iotproject000.",
            host="aws-0-ap-southeast-2.pooler.supabase.com",
            port=6543,
            sslmode="require"
        )
        cur = conn.cursor()
        if cur:
            print("Connected to database")
        else:
            print("Failed to connect to database")
            return None

        if payload is None:
            payload = {}

        if occurred_at is None:
            occurred_at = datetime.now(timezone.utc)

        query = sql.SQL("""
            INSERT INTO events (device_id, event_type, payload, occurred_at)
            VALUES (%s, %s, %s, %s)
            RETURNING event_id;
        """)

        cur.execute(query, (device_id, event_type, json.dumps(payload), occurred_at))
        event_id = cur.fetchone()[0]

        conn.commit()
        cur.close()
        conn.close()

        return event_id

    except Exception as e:
        print(f"Database connection or insertion failed: {e}")
        return None