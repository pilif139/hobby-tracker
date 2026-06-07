-- 01_users.sql
INSERT INTO "User" (id, email, name, password, "createdAt", "updatedAt") VALUES
('11111111-1111-4111-8111-111111111111', 'alice@example.com', 'Alice Nowak', 'bcrypt_hash_here', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('22222222-2222-4222-8222-222222222222', 'marek@example.com', 'Marek Kaczmarek', 'bcrypt_hash_here', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('33333333-3333-4333-8333-333333333333', 'zoe@example.com', 'Zoe Szabo', 'bcrypt_hash_here', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('44444444-4444-4444-8444-444444444444', 'piotr@example.com', 'Piotr Lewandowski', 'bcrypt_hash_here', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
