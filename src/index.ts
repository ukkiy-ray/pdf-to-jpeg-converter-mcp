#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Poppler } from "node-poppler";
import path from "path";
import fs from "fs";

// --- メインロジック ---

// サーバーのメイン関数
async function main() {
  // 1. コマンドライン引数からPDFフォルダのパスを取得
  const pdfDirectory = process.argv[2];
  if (!pdfDirectory || !fs.existsSync(pdfDirectory)) {
    console.error("エラー: PDFフォルダの有効なパスを引数として指定してください。");
    process.exit(1);
  }
  console.error(`監視対象フォルダ: ${pdfDirectory}`);

  // 2. MCPサーバーのインスタンスを作成
  const server = new McpServer({
    name: "pdf-converter-mcp",
    version: "1.0.0",
    capabilities: {
      tools: {}, // このサーバーがToolsを提供することを宣言
    },
  });

  const poppler = new Poppler();

  // --- Tool 1: PDFメタデータ取得 (修正済み) ---
  server.tool(
    "get_pdf_metadata",
    "指定されたPDFファイルのメタデータを取得します。",
    {
      filename: z.string().describe("メタデータを取得したいPDFファイル名 (例: document.pdf)"),
    },
    async ({ filename }) => {
      const filePath = path.join(pdfDirectory, filename);

      if (!fs.existsSync(filePath)) {
        return {
          content: [{ type: "text", text: `エラー: ファイルが見つかりません: ${filename}` }],
          isError: true,
        };
      }

      try {
        const info = await poppler.pdfInfo(filePath);
        const metadataJson = JSON.stringify(info, null, 2);
        return {
          content: [{ type: "text", text: metadataJson }],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "不明なエラーが発生しました。";
        return {
          content: [{ type: "text", text: `メタデータの取得中にエラーが発生しました: ${errorMessage}` }],
          isError: true,
        };
      }
    }
  );

  // --- Tool 2: PDFからJPEGへの変換 (修正済み) ---
  server.tool(
    "convert_pdf_to_jpeg",
    "指定されたPDFファイルをページごとにJPEG画像に変換し、同じフォルダに保存します。",
    {
      filename: z.string().describe("JPEGに変換したいPDFファイル名 (例: presentation.pdf)"),
    },
    async ({ filename }) => {
      const filePath = path.join(pdfDirectory, filename);
      const outputPrefix = path.join(pdfDirectory, path.basename(filename, ".pdf"));

      if (!fs.existsSync(filePath)) {
        return {
          content: [{ type: "text", text: `エラー: ファイルが見つかりません: ${filename}` }],
          isError: true,
        };
      }

      try {
        await poppler.pdfToCairo(filePath, outputPrefix, { jpegFile: true });

        return {
          content: [{ type: "text", text: `${filename} のJPEGへの変換が完了しました。ファイルはPDFと同じフォルダに保存されています。` }],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "不明なエラーが発生しました。";
        return {
          content: [{ type: "text", text: `JPEGへの変換中にエラーが発生しました: ${errorMessage}` }],
          isError: true,
        };
      }
    }
  );

  // 3. サーバーを起動
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("PDF Converter MCP Server is running on stdio.");
}

// サーバーを実行
main().catch((error) => {
  console.error("サーバーの起動に失敗しました:", error);
  process.exit(1);
});