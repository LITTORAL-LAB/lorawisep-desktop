import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        // Especifica o ponto de entrada para o processo principal do Electron
        entry: resolve(__dirname, 'src/main/index.ts'), // Substitua pelo caminho correto
        formats: ['cjs'], // CommonJS, formato necessário para o Electron
        fileName: 'index.js'
      },
      outDir: 'out/main' // Diretório de saída
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        // Especifica o ponto de entrada para o script de preload
        entry: resolve(__dirname, 'src/preload/index.ts'), // Substitua pelo caminho correto, se aplicável
        formats: ['cjs'],
        fileName: 'preload.js'
      },
      outDir: 'out/preload' // Diretório de saída para o preload
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': path.resolve(__dirname, './src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
