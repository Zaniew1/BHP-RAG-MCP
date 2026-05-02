"use strict";
// src/services/vector.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeChunk = storeChunk;
exports.searchSimilarChunks = searchSimilarChunks;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function storeChunk({ documentId, content, embedding, chunkIndex, }) {
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
async function searchSimilarChunks(embedding, limit = 5) {
    const embeddingString = `[${embedding.join(",")}]`;
    return prisma.$queryRawUnsafe(`
    SELECT id, content, "documentId", "chunkIndex"
    FROM "DocumentChunk"
    ORDER BY embedding <=> '${embeddingString}'::vector
    LIMIT ${limit};
  `);
}
