"use strict";
// src/services/rag.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestDocument = ingestDocument;
exports.askRag = askRag;
const document_service_1 = require("./document.service");
const embedding_service_1 = require("./embedding.service");
const vector_service_1 = require("./vector.service");
const llm_service_1 = require("./llm.service");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function ingestDocument(filePath) {
    const processed = await (0, document_service_1.processDocument)(filePath);
    const document = await prisma.document.create({
        data: {
            title: processed.title,
            sourcePath: filePath,
        },
    });
    const embeddings = await (0, embedding_service_1.embedTexts)(processed.chunks.map((chunk) => chunk.content));
    for (let i = 0; i < processed.chunks.length; i++) {
        await (0, vector_service_1.storeChunk)({
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
async function askRag(question) {
    const queryEmbedding = await (0, embedding_service_1.embedText)(question);
    const similarChunks = (await (0, vector_service_1.searchSimilarChunks)(queryEmbedding, 5));
    const context = similarChunks
        .map((chunk) => chunk.content)
        .join("\n\n");
    const answer = await (0, llm_service_1.generateAnswer)({
        question,
        context,
    });
    return {
        answer,
        contextChunks: similarChunks.length,
    };
}
