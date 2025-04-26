import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: ['delaybot.home.romaaaka.ru', 'roma.office.alt-point.com']
  },
  resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
})
