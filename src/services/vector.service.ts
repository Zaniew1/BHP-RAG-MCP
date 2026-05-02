// src/services/vector.service.ts

import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface StoreChunkParams {
  documentId: string;
  content: string;
  embedding: number[];
  chunkIndex: number;
}
interface SearchSimiliarityParams{
    embedding: number[],
    limit: number
}
export interface VectorDBInterface{
    storeChunk(params: StoreChunkParams): void;
    searchSimilarChunks(embedding: number[],  limit: number): void;
}

class PrismaVector implements VectorDBInterface {

    async storeChunk({
        documentId,
        content,
        embedding,
        chunkIndex,
        }: StoreChunkParams) 
    {
    return prisma.documentChunk.create({
        data: {
        documentId,
        content,
        chunkIndex,
        embedding,
        },
    });
    }

    async searchSimilarChunks(
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
}

class VectorDB{
    constructor(private dbInstance : VectorDBInterface){
    }
    storeChunk(params: StoreChunkParams){
        this.dbInstance.storeChunk(params)
    }
    searchSimilarChunks(embedding: number[],  limit: number){
        this.dbInstance.searchSimilarChunks(embedding, limit)
    }

}
const prismaVector = new PrismaVector();
export const vectordb = new VectorDB(prismaVector)