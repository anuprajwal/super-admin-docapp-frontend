import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 9000,
    strictPort: true,
    host: true, // Tells Vite to listen on the network interface
    allowedHosts: ['super.docapp.co.in'], // Tells Vite this external domain is safe to trust
  },
});