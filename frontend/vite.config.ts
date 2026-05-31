import { URL, fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import { tanstackRouter } from '@tanstack/router-plugin/vite';

// Dynamically import ESM-only plugins to avoid bundler `require` issues during CI/build tools
export default defineConfig(async () => {
  const plugins: any[] = [];

  try {
    const devtools = (await import('@tanstack/devtools-vite')).devtools;
    plugins.push(devtools());
  } catch (e) {
    // optional devtools not available in this environment
  }

  plugins.push(
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
  );

  plugins.push(
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  );

  plugins.push(tailwindcss());

  try {
    const cloudflare = (await import('@cloudflare/vite-plugin')).cloudflare;
    plugins.push(cloudflare());
  } catch (e) {
    // optional cloudflare plugin not available in this environment
  }

  return {
    plugins,
    resolve: {
      alias: [
        {
          find: /^react$/,
          replacement: fileURLToPath(
            new URL('./node_modules/react/index.js', import.meta.url),
          ),
        },
        {
          find: /^react-dom$/,
          replacement: fileURLToPath(
            new URL('./node_modules/react-dom/index.js', import.meta.url),
          ),
        },
        {
          find: /^react\/jsx-runtime$/,
          replacement: fileURLToPath(
            new URL('./node_modules/react/jsx-runtime.js', import.meta.url),
          ),
        },
        {
          find: /^react\/jsx-dev-runtime$/,
          replacement: fileURLToPath(
            new URL('./node_modules/react/jsx-dev-runtime.js', import.meta.url),
          ),
        },
        {
          find: '@',
          replacement: fileURLToPath(new URL('./src', import.meta.url)),
        },
      ],
    },
  };
});
