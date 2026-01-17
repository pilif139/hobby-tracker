import pluginReact from 'eslint-plugin-react';
import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tanstackConfig,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
];
