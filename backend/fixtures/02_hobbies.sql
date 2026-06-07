-- 02_hobbies.sql
INSERT INTO "Hobby" (id, name, description, "createdAt", "updatedAt") VALUES
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Running', 'Morning jogs', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Guitar', 'Playing acoustic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Reading', 'Science fiction', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "_HobbyToUser" ("A", "B") VALUES
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '22222222-2222-4222-8222-222222222222'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '11111111-1111-4111-8111-111111111111'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '44444444-4444-4444-8444-444444444444'),
('cccccccc-cccc-4ccc-8ccc-cccccccccccc', '33333333-3333-4333-8333-333333333333');
