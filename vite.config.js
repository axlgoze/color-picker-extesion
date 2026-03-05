import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  // ─── Vite Build (Chrome Extension popup) ──────────────────────────────────
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
      },
    },
  },

  // ─── Vitest ───────────────────────────────────────────────────────────────
  test: {
    environment: 'jsdom',
  },
});
