// src/services/vector.service.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface StoreChunkParams {
  documentId: string;
  content: string;
  embedding: number[];
  chunkIndex: number;
}

export async function storeChunk({
  documentId,
  content,
  embedding,
  chunkIndex,
}: StoreChunkParams) {
  return prisma.documentChunk.create({
    data: {
      documentId,
      content,
      chunkIndex,
      embedding,
    },
  });
}

/**
 * Zakłada pgvector + raw SQL cosine similarity
 */
export async function searchSimilarChunks(
  embedding: number[],
  limit = 5
) {
  const embeddingString = `[${embedding.join(",")}]`;

  return prisma.$queryRawUnsafe(`
    SELECT id, content, "documentId", "chunkIndex"
    FROM "DocumentChunk"
    ORDER BY embedding <=> '${embeddingString}'::vector
    LIMIT ${limit};
  `);
}