## Electron 開発用のテンプレート

### 機能

- Electron
- React
- Vite

### 使い方

```
yarn dev
```

vite server を立ち上げて electron でロードします。

```
yarn build
```

electron のインストール用アプリケーションを構築します。  
ビルドの設定は `electron-builder.yaml`を編集します。

```
yarn check-asar
```

electron パッケージに含まれるリソースファイル `dist/win-unpacked/resources/app.asar` を解凍します。  
不要なファイルがある場合は、`electron-builder.yaml` に追加してください。
