import react from '@vitejs/plugin-react';
import path from "path";
import { defineConfig, UserConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imagetools(),
    ViteImageOptimizer({
      jpeg: {
        // https://sharp.pixelplumbing.com/api-output#jpeg
        quality: 30,
      },
      jpg: {
        // https://sharp.pixelplumbing.com/api-output#jpeg
        quality: 30,
      },
      // Your configuration options go here 
    }),
    VitePWA({ 
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,}']
      },
      manifest: {
        name: 'TSN Lastra a Signa',
        short_name: 'TSNLas',
        description: 'Sito web del Tiro a Segno Nazionale di Lastra a Signa',
        theme_color: '#ffffff',
        icons: [
          {
            // src: 'pwa-192x192.png',
            src: '/assets/las-logo.png?w=192;format=png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/las-logo.png?w=512;format=png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ['**/*.png', '**/*.svg'],
}) as UserConfig

