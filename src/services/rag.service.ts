// src/services/rag.service.ts

import { processDocument } from "./document.service";
import { embedText, embedTexts } from "./embedding.service";
import { storeChunk, searchSimilarChunks } from "./vector.service";
import { generateAnswer } from "./llm.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function ingestDocument(filePath: string) {
  const processed = await processDocument(filePath);

  const document = await prisma.document.create({
    data: {
      title: processed.title,
      sourcePath: filePath,
    },
  });

  const embeddings = await embedTexts(
    processed.chunks.map((chunk) => chunk.content)
  );

  for (let i = 0; i < processed.chunks.length; i++) {
    await storeChunk({
      documentId: document.id,
      content: processed.chunks[i].content,
      chunkIndex: processed.chunks[i].index,
      embedding: embeddings[i],
    });
  }

  return {
    documentId: document.id,
    title: document.title,
    chunksStored: processed.chunks.length,
  };
}

export async function askRag(question: string) {
  const queryEmbedding = await embedText(question);

  const similarChunks = (await searchSimilarChunks(
    queryEmbedding,
    5
  )) as Array<{ content: string }>;

  const context = similarChunks
    .map((chunk) => chunk.content)
    .join("\n\n");

  const answer = await generateAnswer({
    question,
    context,
  });

  return {
    answer,
    contextChunks: similarChunks.length,
  };
}