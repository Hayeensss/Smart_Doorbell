-- Mock Data for Smart Doorbell Project

-- Insert mock devices
-- Clerk User IDs by hayeen
INSERT INTO devices (device_id, owner_id, name, location, paired_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'user_2wOlHlkgaKmeKBfw6dF5NgxYxmB', 'Front Door Cam', 'Front Porch', NOW() - INTERVAL '10 days'),

-- Insert mock user preferences
INSERT INTO user_preferences (user_id, default_mode, default_clip_duration, notifications_enabled, updated_at) VALUES
('user_2wOlHlkgaKmeKBfw6dF5NgxYxmB', 'Home', 30, true, NOW()),
-- Note: No preferences for a potential third user yet.

-- Insert mock events
-- Link events to devices using device_id
-- Events for Front Door Cam ('a1b2c3d4-e5f6-7890-1234-567890abcdef')
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'button_pressed', '{}', NOW() - INTERVAL '1 hour'), -- Event ID 1 (assuming serial starts at 1)
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'motion_detected', '{"sensitivity": "medium"}', NOW() - INTERVAL '30 minutes'), -- Event ID 2
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'motion_detected', '{"sensitivity": "high"}', NOW() - INTERVAL '5 minutes'); -- Event ID 3


-- Insert mock media linked to events
-- Make sure event_ref corresponds to the serial IDs generated above
-- Media for Event 1 (Front Door Button Press)
INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(1, 'video', 'https://storage.example.com/clips/a1b2c3d4/event1_video.mp4', 25, 'Hello? Is anyone there?', NOW() - INTERVAL '1 hour'),
(1, 'audio', 'https://storage.example.com/clips/a1b2c3d4/event1_audio.mp3', 25, 'Hello? Is anyone there?', NOW() - INTERVAL '1 hour');

-- Media for Event 2 (Front Door Motion - medium)
INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(2, 'video', 'https://storage.example.com/clips/a1b2c3d4/event2_video.mp4', 15, NULL, NOW() - INTERVAL '30 minutes');

-- Media for Event 3 (Front Door Motion - high)
INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(3, 'video', 'https://storage.example.com/clips/a1b2c3d4/event3_video.mp4', 30, 'Looks like the delivery person.', NOW() - INTERVAL '5 minutes'),
(3, 'image', 'https://storage.example.com/snaps/a1b2c3d4/event3_snapshot.jpg', NULL, NULL, NOW() - INTERVAL '5 minutes');

-- Media for Event 5 (Backyard Motion)
INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(5, 'video', 'https://storage.example.com/clips/b2c3d4e5/event5_video.mp4', 45, 'Just a cat wandering.', NOW() - INTERVAL '15 minutes');
