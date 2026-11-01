import { defineConfig } from 'vite';
export default defineConfig({
  base: '/binance-hot-wallet-incident-2026/',
  publicDir: 'public',
  server: {
    host: '127.0.0.1',
    strictPort: true,
    fs: { strict: true, allow: ['.'] },
    cors: { origin: false },
  },
  preview: { host: '127.0.0.1' },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2022',
    cssMinify: true,
  },
});
