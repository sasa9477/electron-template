// @ts-check
'use strict'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './src/renderer',
  // ベースを絶対パスから相対パスに変更
  base: './',
  build: {
    // electronはソースファイルを 圧縮してアプリに含むため別ディレクトリに出力
    outDir: path.resolve(__dirname, './out'),
    // ルート以外に出力するときのエラーを解決
    emptyOutDir: true,
  },
  server: {
    origin: 'http://localhost:5173',
    // ポートが既に使用されている場合に終了
    strictPort: true,
  },
})
