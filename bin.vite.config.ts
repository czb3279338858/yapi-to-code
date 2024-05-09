import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: './dist/bin',
    lib: {
      entry: './lib/bind/yapi-to-code.ts',
      formats: ['cjs'],
      fileName: 'yapi-to-code',
    }
  }
})
