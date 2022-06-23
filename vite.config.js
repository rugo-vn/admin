import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

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

  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }
    })
  ],

  resolve: {
    dedupe: [
      'vue'
    ]
  }
})
