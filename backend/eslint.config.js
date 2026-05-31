import baseConfig from '@hono/eslint-config';
import { defineConfig } from 'eslint/config';
// Avoid importing the top-level `typescript-eslint` meta-package to prevent
// pnpm nested-module resolution issues on Windows.
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export default defineConfig([
  ...baseConfig,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.wrangler/**',
      'prisma/**',
      'eslint.config.js',
    ],
  },
  {
    files: [
      'src/**/*.ts',
      'tests/**/*.{ts,tsx}',
      '*.config.js',
      '*.config.ts',
      '*.d.ts',
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
    },
  },
  {
    files: ['*.config.js', '*.config.ts'],
    // Keep a lightweight override for config files without loading
    // heavy type-checked rule sets.
    languageOptions: {
      parserOptions: {
        project: undefined,
      },
    },
    rules: {},
  },
]);
