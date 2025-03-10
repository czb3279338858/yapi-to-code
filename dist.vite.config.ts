import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.json'
    }),
  ],
  build: {
    target: 'node12',
    outDir: "./dist",
    lib: {
      entry: './lib/main.ts',
      name: 'YapiToCode',
      fileName: 'yapi-to-code',
    }
  }
})
