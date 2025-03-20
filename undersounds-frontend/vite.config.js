import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite exponer el servidor en la red
    port: 3000,
    allowedHosts: ['6574-79-116-164-116.ngrok-free.app'],
  },
  build: {
    outDir: 'build',
  },
});