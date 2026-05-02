import path from "path";
import { loadTxt } from "./txt.loader";
import { loadMarkdown } from "./markdown.loader";
import { loadPdf } from "./pdf.loader";

export async function loadDocument(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".txt":
      return loadTxt(filePath);

    case ".md":
    case ".markdown":
      return loadMarkdown(filePath);

    case ".pdf":
      return loadPdf(filePath);

    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}