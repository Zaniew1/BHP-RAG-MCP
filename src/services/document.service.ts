// src/services/document.service.ts

// import path from "path";
// import { loadDocument } from "../loaders/load.loader";
// import { chunkText } from "../utils/chunk";

// export interface ProcessedDocument {
//   title: string;
//   content: string;
//   chunks: {
//     content: string;
//     index: number;
//   }[];
// }

// export async function processDocument(
//   filePath: string
// ): Promise<ProcessedDocument> {
//   const content = await loadDocument(filePath);

//   const chunks = chunkText(content);

//   return {
//     title: path.basename(filePath),
//     content,
//     chunks,
//   };
// }