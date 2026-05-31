import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('joins class names', () => {
    const out = cn('a', { b: true }, 'c');
    expect(typeof out).toBe('string');
    expect(out).toContain('a');
    expect(out).toContain('c');
  });

  it('resolves conflicting tailwind classes (keeps last)', () => {
    const out = cn('px-2', 'px-4');
    expect(out).toContain('px-4');
    expect(out).not.toContain('px-2');
  });
});
