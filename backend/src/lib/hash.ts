import bcrypt from 'bcryptjs';

/**
 * NOTE:
 * Cloudflare workers do not support any hashing librariers that aren't pure js.
 * bcryptjs is a pure js implementation of bcrypt.
 * It is not as fast as the native bcrypt library, but it is good enough for this use case.
 */

export async function createHash(data: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data, salt);
  return hash;
}

export async function compareHash(data: string, hash: string) {
  return bcrypt.compare(data, hash);
}
