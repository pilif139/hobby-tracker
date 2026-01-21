import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { tanstackConfig } from '@tanstack/eslint-config';
import { defineConfig } from 'eslint/config';
import pluginReact from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  ...tanstackConfig,
  tseslint.configs.recommended,
  ...(pluginReact.configs.flat?.recommended
    ? [pluginReact.configs.flat.recommended]
    : []),
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
  eslintConfigPrettier,
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
);
