import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite exponer el servidor en la red
    port: 3000,
    allowedHosts: ['41e4-79-117-153-78.ngrok-free.app'],
  },
  build: {
    outDir: 'build',
  },
});