import baseConfig from '@hono/eslint-config';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  ...baseConfig,
  {
    ignores: [
      '*.config.js',
      'dist/**',
      'node_modules/**',
      '.wrangler/**',
      'prisma/**',
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
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },
  {
    files: ['*.config.js', '*.config.ts'],
    ...tseslint.configs.disableTypeChecked,
  },
]);
