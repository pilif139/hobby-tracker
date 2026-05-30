import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { tanstackConfig } from '@tanstack/eslint-config';

export default defineConfig([
  ...tanstackConfig,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/api/generated/**',
      'src/routeTree.gen.ts',
      '*.config.js',
      '*.config.ts',
      'vite.config.ts',
      'vitest.config.ts',
    ],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
  {
    files: [
      '*.config.js',
      '*.config.ts',
      'vite.config.ts',
      'vitest.config.ts',
      'eslint.config.js',
    ],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: undefined,
      },
    },
  },
]);
