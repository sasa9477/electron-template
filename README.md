## React × Electron 開発のボイラーテンプレート

### 概要

Node を使用してデスクトップアプリを開発しやすくするための React × Electron のボイラーテンプレートです。  
webpack より高速で設定が簡易な vite を使用し、ホットリロードにも対応しています。  
タスクトレイ常駐型のテンプレートを追加しています。  
確認した環境は windows11 のみです。

### 機能

- Electron
- React
- Vite
- Sass

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
不要なファイルがある場合は、`electron-builder.yaml` の `files`に `glob`パターンで追記してください。

### 多重起動防止、タスクトレイ常駐型のアプリ

```
/**
 * 多重起動しない場合のアプリ
 */
  const isSingletonApp = true

/**
 * タスクトレイ常駐型のアプリ
 */
  const isTrayApp = false
```

`src/main/main.js` に記載されている上記の変数の true / false を変更するか、参照しているコードブロックを削除してください。
