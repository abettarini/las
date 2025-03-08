import react from '@vitejs/plugin-react'
import { defineConfig, UserConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.png', '**/*.svg'],
}) as UserConfig