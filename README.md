# PDF to JPEG Converter MCP Server

PDFファイルをJPEG画像に変換するModel Context Protocol (MCP) サーバーです。

## 概要

このMCPサーバーは、PDFファイルをページごとにJPEG画像に変換し、メタデータの取得も可能にします。AIアシスタントやMCPクライアントから、PDFファイルの処理を簡単に行うことができます。

## 機能

### 🖼️ PDF to JPEG 変換
- PDFファイルの各ページをJPEG画像に変換
- 高品質な画像出力
- 自動的なファイル名生成

### 📊 PDFメタデータ取得
- PDFファイルの詳細情報を取得
- ページ数、作成日、作成者などの情報を表示

## 前提条件

- Node.js 18.0.0以上
- Poppler（PDF処理ライブラリ）
- TypeScript

## インストール

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd pdf-to-jpeg-converter-mcp
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. ビルド
```bash
npm run build
```

## 使用方法

### 基本的な使用方法

```bash
npm start <PDFフォルダのパス>
```

例：
```bash
npm start ./samplePDF
```

### MCPクライアントからの使用

このサーバーは以下のツールを提供します：

#### `convert_pdf_to_jpeg`
PDFファイルをJPEG画像に変換します。

**パラメータ：**
- `filename`: 変換したいPDFファイル名（例：`document.pdf`）

**使用例：**
```json
{
  "tool": "convert_pdf_to_jpeg",
  "arguments": {
    "filename": "presentation.pdf"
  }
}
```

#### `get_pdf_metadata`
PDFファイルのメタデータを取得します。

**パラメータ：**
- `filename`: メタデータを取得したいPDFファイル名（例：`document.pdf`）

**使用例：**
```json
{
  "tool": "get_pdf_metadata",
  "arguments": {
    "filename": "document.pdf"
  }
}
```

## 設定

### MCPクライアントの設定

MCPクライアントの設定ファイルに以下を追加してください：

```json
{
  "mcpServers": {
    "pdf-converter": {
      "command": "node",
      "args": ["path/to/pdf-to-jpeg-converter-mcp/build/index.js", "/path/to/pdf/folder"],
      "env": {}
    }
  }
}
```

## 開発

### 開発環境のセットアップ
```bash
npm install
npm run build
npm start
```

### スクリプト
- `npm run build`: TypeScriptコードをビルド
- `npm start`: サーバーを起動
- `npm test`: テストを実行（現在は未実装）

## 依存関係

### 本番依存関係
- `@modelcontextprotocol/sdk`: MCPサーバーの実装
- `node-poppler`: PDF処理ライブラリ
- `zod`: スキーマ検証

### 開発依存関係
- `@types/node`: Node.js型定義
- `typescript`: TypeScriptコンパイラ

## ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照してください。

## トラブルシューティング

### よくある問題

1. **Popplerがインストールされていない**
   - Popplerをインストールしてください
   - Windows: [Poppler for Windows](https://github.com/oschwartz10612/poppler-windows/releases)
   - macOS: `brew install poppler`
   - Linux: `sudo apt-get install poppler-utils`

2. **PDFファイルが見つからない**
   - 正しいフォルダパスを指定しているか確認してください
   - ファイル名が正確か確認してください

3. **権限エラー**
   - 出力フォルダへの書き込み権限があるか確認してください

## 貢献

プルリクエストやイシューの報告を歓迎します。大きな変更を行う前に、まずイシューで議論してください。

## 更新履歴

### v1.0.0
- 初期リリース
- PDF to JPEG変換機能
- PDFメタデータ取得機能
- MCPサーバーとしての基本機能
