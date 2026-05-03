

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from "../utils/constants";

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

interface StoreChunkParams {
  documentId:number
  content: string;
  embedding: number[];
  chunkIndex: number;
}
interface StoreDocParams {
  title: string;
  content: string;
  sourcePath: string;
}

export interface VectorDBInterface{
    storeChunk(params: StoreChunkParams): void;
    storeDoc(params: StoreDocParams): Promise<number>;
    checkDocExistance(title: string): Promise<StoreDocParams | null>;
    searchSimilarChunks(embedding: number[],  limit: number): void;
}

export class PrismaVector implements VectorDBInterface {

    async storeChunk({
        documentId,
        content,
        embedding,
        chunkIndex,
    }: StoreChunkParams) {
        const vectorString = `[${embedding.join(",")}]`;
        return prisma.$executeRawUnsafe(`
            INSERT INTO "DocumentChunk" ("documentId", "content", "chunkIndex", "embedding")
            VALUES ($1, $2, $3, $4::vector)
        `, documentId, content, chunkIndex, vectorString);
    }
    async storeDoc({
        title,
        content,
        sourcePath,
    }: StoreDocParams) : Promise<number>{
        
        const result = await prisma.$queryRaw<{ id: number }[]>`
        INSERT INTO "Document" ("title", "content", "sourcePath")
        VALUES (${title}, ${content}, ${sourcePath}) RETURNING id`;

        return result[0].id;
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
    async checkDocExistance(title:string): Promise<StoreDocParams | null>{
       return await prisma.document.findFirst({ where: { title: title } });
    }
}


export class VectorDB{
    constructor(private dbInstance : VectorDBInterface){
    }
    storeChunk(params: StoreChunkParams){
        return this.dbInstance.storeChunk(params)
    }
    storeDoc(params: StoreDocParams){
        return this.dbInstance.storeDoc(params)
    }
    searchSimilarChunks(embedding: number[],  limit: number){
        return this.dbInstance.searchSimilarChunks(embedding, limit)
    }
    checkDocExistance(title: string){
         return this.dbInstance.checkDocExistance(title)
    }
}
