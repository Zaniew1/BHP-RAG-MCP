// src/loaders/pdf.loader.ts

import fs from "fs/promises";
import pdfParse from "pdf-parse";

/**
 * Wymaga:
 * npm install pdf-parse
 */
export async function loadPdf(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);

  const data = await pdfParse(buffer);

  if (!data.text.trim()) {
    throw new Error("PDF contains no readable text");
  }

  return data.text.replace(/\s+/g, " ").trim();
}