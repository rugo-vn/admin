import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

const base = process.env.BASE || ''

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'ADMIN_',
  base: `/${base}`,
  
  server: {
    port: 8080
  },

  build: {
    outDir: `dist/${base}`
  },

  plugins: [vue(), svgLoader()],

  resolve: {
    dedupe: [
      'vue'
    ]
  }
})
