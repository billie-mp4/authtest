import { defineConfig } from 'vite'
import {resolve} from 'node:path'
// https://vite.dev/config/
export default defineConfig({
  build:{
    outDir:'docs',
    rolldownOptions:{
      input:{
        main:resolve(import.meta.dirname,'index.html'),
        page1:resolve(import.meta.dirname,'page1/index.html')
      }
    }
  },
  base:'/authtest/'
})
