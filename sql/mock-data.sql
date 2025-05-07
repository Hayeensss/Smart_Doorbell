
-- devices
INSERT INTO devices (device_id, owner_id, name, location, paired_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'user_2wOlHlkgaKmeKBfw6dF5NgxYxmB', 'Front Door Cam', 'Front Porch', NOW() - INTERVAL '10 days'),

-- user_preferences
INSERT INTO user_preferences (user_id, default_mode, default_clip_duration, notifications_enabled, updated_at) VALUES
('user_2wOlHlkgaKmeKBfw6dF5NgxYxmB', 'Home', 30, true, NOW());

-- events
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'button_pressed', '{}', NOW() - INTERVAL '1 hour'),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'motion_detected', '{"sensitivity": "medium"}', NOW() - INTERVAL '30 minutes'),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'motion_detected', '{"sensitivity": "high"}', NOW() - INTERVAL '5 minutes');

INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'package_detected', '{"source": "ai_vision", "package_count": 1}', NOW() - INTERVAL '2 hours');

INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'motion_detected', '{"sensitivity": "high", "zone": "patio"}', NOW() - INTERVAL '15 minutes');

INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'person_detected', '{"name": "Known Visitor", "recognition_id": "visitor_001"}', NOW() - INTERVAL '3 days');

INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'doorbell_offline', '{"reason": "power_loss"}', NOW() - INTERVAL '1 day');

INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'doorbell_online', '{}', NOW() - INTERVAL '23 hours');

INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'sound_detected', '{"sound_type": "dog_bark", "intensity": "loud"}', NOW() - INTERVAL '6 hours');

INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'motion_detected', '{"sensitivity": "low"}', NOW() - INTERVAL '7 days');

INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'button_pressed', '{}', NOW() - INTERVAL '1 month');

INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'person_detected', '{"name": "Unknown", "recognition_id": null}', NOW() - INTERVAL '4 hours');

INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'motion_detected', '{"sensitivity": "medium", "zone": "gate"}', NOW() - INTERVAL '2 weeks');

-- media
INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(1, 'video', 'https://storage.example.com/clips/a1b2c3d4/event1_video.mp4', 25, 'Hello? Is anyone there?', NOW() - INTERVAL '1 hour'),
(1, 'audio', 'https://storage.example.com/clips/a1b2c3d4/event1_audio.mp3', 25, 'Hello? Is anyone there?', NOW() - INTERVAL '1 hour');

INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(2, 'video', 'https://storage.example.com/clips/a1b2c3d4/event2_video.mp4', 15, NULL, NOW() - INTERVAL '30 minutes');

INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(3, 'video', 'https://storage.example.com/clips/a1b2c3d4/event3_video.mp4', 30, 'Looks like the delivery person.', NOW() - INTERVAL '5 minutes'),
(3, 'image', 'https://storage.example.com/snaps/a1b2c3d4/event3_snapshot.jpg', NULL, NULL, NOW() - INTERVAL '5 minutes');

INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(5, 'video', 'https://storage.example.com/clips/b2c3d4e5/event5_video.mp4', 45, 'Just a cat wandering.', NOW() - INTERVAL '15 minutes');