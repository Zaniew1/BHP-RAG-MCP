// src/services/embedding.service.ts

import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

export async function embedText(text: string): Promise<number[]> {
  if (!text.trim()) {
    throw new Error("Cannot embed empty text");
  }

  return embeddings.embedQuery(text);
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (!texts.length) {
    throw new Error("No texts provided for embedding");
  }

  return embeddings.embedDocuments(texts);
}