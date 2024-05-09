import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: './dist/bin',
    lib: {
      entry: './lib/bind/yapi-to-code.ts',
      formats: ['umd'],
      name: 'YapiToCode',
      fileName: 'yapi-to-code',
    }
  }
})
