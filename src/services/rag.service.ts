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

import { DocumentLoadInterface, Loader, LoaderInterface} from "./loader.service"
import {EmbeddedChunk, EmbeddingClass, OpenAiEmbed } from "./embedding.service";
import {VectorDB,PrismaVector, VectorDBInterface, StoreChunkParams} from '../services/vector.service'
export interface RagInterface{
    augmentPrompt(prompt: string): Promise<string>
    ingestDocuments(folderPath:string): Promise<void> 
}

class RAG implements RagInterface{
    private readonly CHUNK_SIZE = 1000; 
    private readonly OVERLAP = 150;  
    constructor(private embeddModel: any, private vectorDb:VectorDBInterface, private docsLoader:LoaderInterface){}
    public async  ingestDocuments(folderPath:string): Promise<void> {
        try{
            const documentsText = await this.loadDocuments(folderPath);
            const documentsTextWithChunks =  this.chunkDocuments(documentsText);
            const documentsTextWithEmbeddedChunks = await this.embeddDocuments(documentsTextWithChunks);
            await this.storeInVectorDb(documentsTextWithEmbeddedChunks);
        }catch(e){
            throw Error('Nie udało się')
        }
    }
    public async augmentPrompt(prompt: string): Promise<string> {
        const embeddedPrompt = await this.embeddPrompt(prompt)
        const similarChunks = await this.findPromptSimilarities(embeddedPrompt)
        const context = similarChunks.map((chunk) => chunk.content).join("\n\n");
        return context;
    }
    private async embeddPrompt(prompt: string): Promise<number[]> {
       return await this.embeddModel.embedText(prompt);
    }
    private async findPromptSimilarities(embeddedPrompt: number[]): Promise<StoreChunkParams[]> {
        const results = await this.vectorDb.searchSimilarChunks(embeddedPrompt, 5)
        return results;
    }

    private async loadDocuments(folderPath:string): Promise<DocumentLoadInterface[]> {
        return await this.docsLoader.parseDocuments(folderPath)
    }
    private chunkDocuments(docs: DocumentLoadInterface[]): DocumentLoadInterface[] {
        return docs.map(doc => {
            const words = doc.content.split(/\s+/).filter(Boolean);

            const chunkSize = this.CHUNK_SIZE;
            const overlap = this.OVERLAP;

            if (chunkSize <= overlap) {
                throw new Error("CHUNK_SIZE must be greater than OVERLAP");
            }

            const chunks: EmbeddedChunk[] = [];

            let start = 0;
            while (start < words.length) {
                const end = Math.min(start + chunkSize, words.length);
                const chunk = words.slice(start, end).join(" ");
                chunks.push({
                    content: chunk,
                    vector: []
                });
                start += chunkSize - overlap;
            }
            return {
                ...doc,
                chunks
            };
        });
    }
   private async embeddDocuments(docs: DocumentLoadInterface[]): Promise<DocumentLoadInterface[]> {
        for (const doc of docs) {
            if (!doc.chunks) continue;
            for (const singleChunk of doc.chunks) {
                singleChunk.vector = await this.embeddModel.embedText(singleChunk.content);
            }
        }
        return docs;
    }
    private async storeInVectorDb(documents: DocumentLoadInterface[]): Promise<void> {
        // zapis wszystkich dokumentów do bazy
        await Promise.all(
            documents.map(async (doc) => {
                // zapis dokumentu głównego
                const existingDocument = await this.vectorDb.checkDocExistance(doc.title);
                if(existingDocument) return;
                const docId = await this.vectorDb.storeDoc({
                    title: doc.title,
                    content: doc.content,
                    sourcePath: doc.source,
                });
                // zapis chunków powiązanych z dokumentem
                if (doc.chunks?.length) {
                    await Promise.all(
                        doc.chunks.map(async (singleChunk, index) => {
                            await this.vectorDb.storeChunk({
                                documentId: docId,
                                content: singleChunk.content,
                                embedding: singleChunk.vector,
                                chunkIndex: index
                            });
                        })
                    );
                }
            })
        );
    }
       
}
const prismaVector = new PrismaVector();
export const vectordb = new VectorDB(prismaVector);

const loader = new Loader();

const openAiEmbedding = new OpenAiEmbed();
const embedding = new EmbeddingClass(openAiEmbedding)

export const rag = new RAG(embedding, vectordb, loader);