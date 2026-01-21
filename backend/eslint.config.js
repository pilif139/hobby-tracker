import baseConfig from '@hono/eslint-config';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '*.config.js',
      'dist/**',
      'node_modules/**',
      '.wrangler/**',
      'prisma/**',
    ],
  },
  ...baseConfig,
  {
    files: ['src/**/*.ts', 'tests/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['*.config.js', '*.config.ts'],
    ...tseslint.configs.disableTypeChecked,
  },
];
