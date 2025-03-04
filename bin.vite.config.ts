import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'node12',
    outDir: './dist/bin',
    lib: {
      entry: './lib/bind/yapi-to-code.ts',
      formats: ['cjs'],
      fileName: 'yapi-to-code',
    }
  }
})
