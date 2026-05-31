import { cloudflareTest } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

const rootDir = new URL('./', import.meta.url).pathname;

export default defineConfig({
  resolve: {
    alias: {
      '@': rootDir,
      // Wasm in @cf-wasm/photon is not resolved in vitest-pool-workers; swap for a shim.
      '@cf-wasm/photon': new URL(
        './tests/__mocks__/cf-wasm-photon.ts',
        import.meta.url,
      ).pathname,
    },
  },

  plugins: [
    ...(process.env.CF_VPW
      ? [
          cloudflareTest({
            wrangler: { configPath: './wrangler.toml' },
          }),
        ]
      : []),
  ],

  test: {
    include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
    environment: 'node',
  },
});
