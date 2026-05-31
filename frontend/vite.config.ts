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
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
