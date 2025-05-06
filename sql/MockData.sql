-- Mock Data for Smart Doorbell Project

-- Insert mock devices
-- Clerk User IDs by hayeen
INSERT INTO devices (device_id, owner_id, name, location, paired_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'user_2wOlHlkgaKmeKBfw6dF5NgxYxmB', 'Front Door Cam', 'Front Porch', NOW() - INTERVAL '10 days'),
('d0e1f2a3-b4c5-6789-0123-456789abcdef', 'user_2wOlHlkgaKmeKBfw6dF5NgxYxmB', 'Backyard Cam', 'Backyard', NOW() - INTERVAL '5 days');

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

-- Event ID 4 (Front Door Cam - 'a1b2c3d4-e5f6-7890-1234-567890abcdef')
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'package_detected', '{"source": "ai_vision", "package_count": 1}', NOW() - INTERVAL '2 hours');

-- Event ID 5 (Backyard Cam - 'd0e1f2a3-b4c5-6789-0123-456789abcdef') - This event corresponds to the media entry for event_ref = 5
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('d0e1f2a3-b4c5-6789-0123-456789abcdef', 'motion_detected', '{"sensitivity": "high", "zone": "patio"}', NOW() - INTERVAL '15 minutes');

-- Event ID 6 (Front Door Cam - 'a1b2c3d4-e5f6-7890-1234-567890abcdef')
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'person_detected', '{"name": "Known Visitor", "recognition_id": "visitor_001"}', NOW() - INTERVAL '3 days');

-- Event ID 7 (Front Door Cam - 'a1b2c3d4-e5f6-7890-1234-567890abcdef')
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'doorbell_offline', '{"reason": "power_loss"}', NOW() - INTERVAL '1 day');

-- Event ID 8 (Front Door Cam - 'a1b2c3d4-e5f6-7890-1234-567890abcdef')
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'doorbell_online', '{}', NOW() - INTERVAL '23 hours');

-- Event ID 9 (Front Door Cam - 'a1b2c3d4-e5f6-7890-1234-567890abcdef')
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'sound_detected', '{"sound_type": "dog_bark", "intensity": "loud"}', NOW() - INTERVAL '6 hours');

-- Event ID 10 (Front Door Cam - 'a1b2c3d4-e5f6-7890-1234-567890abcdef')
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'motion_detected', '{"sensitivity": "low"}', NOW() - INTERVAL '7 days');

-- Event ID 11 (Front Door Cam - 'a1b2c3d4-e5f6-7890-1234-567890abcdef')
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'button_pressed', '{}', NOW() - INTERVAL '1 month');

-- Event ID 12 (Backyard Cam - 'd0e1f2a3-b4c5-6789-0123-456789abcdef')
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('d0e1f2a3-b4c5-6789-0123-456789abcdef', 'person_detected', '{"name": "Unknown", "recognition_id": null}', NOW() - INTERVAL '4 hours');

-- Event ID 13 (Backyard Cam - 'd0e1f2a3-b4c5-6789-0123-456789abcdef')
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('d0e1f2a3-b4c5-6789-0123-456789abcdef', 'motion_detected', '{"sensitivity": "medium", "zone": "gate"}', NOW() - INTERVAL '2 weeks');

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

-- Additional media for new events
-- Media for Event 4 (Front Door package_detected)
INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(4, 'image', 'https://storage.example.com/snaps/a1b2c3d4/event4_package_snapshot.jpg', NULL, NULL, NOW() - INTERVAL '2 hours');

-- Media for Event 6 (Front Door person_detected - Known Visitor)
INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(6, 'video', 'https://storage.example.com/clips/a1b2c3d4/event6_person_video.mp4', 10, 'Hi, just dropping by!', NOW() - INTERVAL '3 days'),
(6, 'image', 'https://storage.example.com/snaps/a1b2c3d4/event6_person_snapshot.jpg', NULL, NULL, NOW() - INTERVAL '3 days');

-- Media for Event 9 (Front Door sound_detected - dog_bark)
INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(9, 'audio', 'https://storage.example.com/audio/a1b2c3d4/event9_dog_bark.mp3', 5, NULL, NOW() - INTERVAL '6 hours');

-- Media for Event 12 (Backyard person_detected - Unknown)
INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(12, 'image', 'https://storage.example.com/snaps/d0e1f2a3/event12_unknown_person.jpg', NULL, NULL, NOW() - INTERVAL '4 hours');

-- Mock Events with Older Dates for Filtering --
-- Assuming event_id auto-increments. Current max event_id is 13.

-- Event ID 14 (Front Door Cam - 'a1b2c3d4-e5f6-7890-1234-567890abcdef') - 3 months ago
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'motion_detected', '{"sensitivity": "medium"}', NOW() - INTERVAL '3 months');

-- Event ID 15 (Backyard Cam - 'd0e1f2a3-b4c5-6789-0123-456789abcdef') - 6 months ago
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('d0e1f2a3-b4c5-6789-0123-456789abcdef', 'button_pressed', '{}', NOW() - INTERVAL '6 months');

-- Event ID 16 (Front Door Cam - 'a1b2c3d4-e5f6-7890-1234-567890abcdef') - 1 year ago
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'person_detected', '{"name": "Mail Carrier", "recognition_id": "carrier_002"}', NOW() - INTERVAL '1 year');

-- Event ID 17 (Backyard Cam - 'd0e1f2a3-b4c5-6789-0123-456789abcdef') - 90 days ago
INSERT INTO events (device_id, event_type, payload, occurred_at) VALUES
('d0e1f2a3-b4c5-6789-0123-456789abcdef', 'sound_detected', '{"sound_type": "unknown", "intensity": "low"}', NOW() - INTERVAL '90 days');

-- Optional: Media for these older events --

-- Media for Event 14 (Front Door Motion - 3 months ago)
INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(14, 'video', 'https://storage.example.com/clips/a1b2c3d4/event14_video_3months.mp4', 20, NULL, NOW() - INTERVAL '3 months');

-- Media for Event 16 (Front Door Person Detected - 1 year ago)
INSERT INTO media (event_ref, media_type, url, duration_s, transcript, created_at) VALUES
(16, 'image', 'https://storage.example.com/snaps/a1b2c3d4/event16_person_1year.jpg', NULL, NULL, NOW() - INTERVAL '1 year');
