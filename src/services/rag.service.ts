// src/services/rag.service.ts

// import { processDocument } from "./document.service";
// import { embedText, embedTexts } from "./embedding.service";
// import { storeChunk, searchSimilarChunks } from "./vector.service";
// import { generateAnswer } from "./llm.service";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function ingestDocument(filePath: string) {
//   const processed = await processDocument(filePath);

//   const document = await prisma.document.create({
//     data: {
//       title: processed.title,
//       sourcePath: filePath,
//     },
//   });

//   const embeddings = await embedTexts(
//     processed.chunks.map((chunk) => chunk.content)
//   );

//   for (let i = 0; i < processed.chunks.length; i++) {
//     await storeChunk({
//       documentId: document.id,
//       content: processed.chunks[i].content,
//       chunkIndex: processed.chunks[i].index,
//       embedding: embeddings[i],
//     });
//   }

//   return {
//     documentId: document.id,
//     title: document.title,
//     chunksStored: processed.chunks.length,
//   };
// }

// export async function askRag(question: string) {
//   const queryEmbedding = await embedText(question);

//   const similarChunks = (await searchSimilarChunks(
//     queryEmbedding,
//     5
//   )) as Array<{ content: string }>;

//   const context = similarChunks
//     .map((chunk) => chunk.content)
//     .join("\n\n");

//   const answer = await generateAnswer({
//     question,
//     context,
//   });

//   return {
//     answer,
//     contextChunks: similarChunks.length,
//   };
// }

import {Loader, LoaderInterface} from "./Loader.service.ts"
import {EmbeddingClass, OpenAiEmbed } from "./embedding.service.ts";
import {VectorDB,PrismaVector, VectorDBInterface} from '../services/vector.service.ts'
class RAG{
    constructor(private embeddModel: any, private vectorDb:VectorDBInterface, private docsLoader:LoaderInterface){}
    public startPreprocessing(folderPath:string): void {
        this.loadDocuments(folderPath);
        this.chunkDocuments();
        this.embeddDocuments();
        this.storeEmbeddedDocumentsInVectorDb();
    }
    public augmentPrompt(prompt: string): string {
        this.embeddPrompt()
        this.findPromptSimilarities()
        return this.enrichPromptWithContext()
    }
    private loadDocuments(folderPath:string): void {
        this.docsLoader.parseDocuments(folderPath)
    }
    private chunkDocuments(): void {}
    private embeddDocuments(): void {
        console.log(this.embeddModel)
    }
    private storeEmbeddedDocumentsInVectorDb(): void {
        console.log(this.vectorDb)
    }
    private embeddPrompt(): void {}
    private findPromptSimilarities(): void {}
    private enrichPromptWithContext(): string {return '';}

    
}
const prismaVector = new PrismaVector();
const vectordb = new VectorDB(prismaVector);

const loader = new Loader("src\documents");

const openAiEmbedding = new OpenAiEmbed();
const embedding = new EmbeddingClass(openAiEmbedding)

const rag = new RAG(embedding, vectordb, loader);

console.log(rag.startPreprocessing());