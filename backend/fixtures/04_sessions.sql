-- 04_sessions.sql
INSERT INTO "HobbySession" (id, "startTime", "endTime", notes, "createdAt", "updatedAt", "hobbyId", "userId") VALUES
('10000000-0000-4000-8000-000000000001', '2026-05-28T06:30:00Z', '2026-05-28T07:15:00Z', 'Running session', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111'),
('10000000-0000-4000-8000-000000000002', '2026-05-29T19:00:00Z', '2026-05-29T19:35:00Z', 'Reading session', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', '33333333-3333-4333-8333-333333333333');

INSERT INTO "HobbySessionFile" ("storageObjectKey", "hobbySessionId", "createdAt", "updatedAt") VALUES
('session-files/alice-running-2026-05-28-note.pdf', '10000000-0000-4000-8000-000000000001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
