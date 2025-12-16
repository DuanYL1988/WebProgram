import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// D:/Projects/WebProgram/htmlProject/resources/00_illustration
const BASE_PATH = 'D:/Projects/WebProgram/htmlProject/resources/images'
const PROJECT_ROOT = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  publicDir: path.resolve(BASE_PATH),
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  /**/
  server: {
    proxy: {
      '/api' : {
        target: 'http://localhost:8081',
        //target: 'http://192.168.91.129:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/\/api/,'')
      }
    },
    fs: {
      allow: [PROJECT_ROOT,path.resolve(BASE_PATH)] 
    }
  }
})
