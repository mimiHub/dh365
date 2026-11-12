import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build:preview` → 이미지·폰트까지 한 HTML에 담은 시안 공유용 파일(dist-preview/index.html)
export default defineConfig(({ mode }) => ({
  plugins: mode === 'preview' ? [react(), viteSingleFile()] : [react()],
  build: mode === 'preview' ? { outDir: 'dist-preview', assetsInlineLimit: 100_000_000 } : undefined,
}))
