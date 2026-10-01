import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// PLACEHOLDER: reemplazar por el dominio real antes de desplegar.
// Necesario para que las URLs absolutas de Open Graph funcionen.
export default defineConfig({
  site: 'https://camilayjulian.netlify.app',
  vite: { plugins: [tailwindcss()] },
});
