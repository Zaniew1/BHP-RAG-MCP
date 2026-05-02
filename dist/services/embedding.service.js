"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedText = embedText;
exports.embedTexts = embedTexts;
// src/services/embedding.service.ts
const constants_1 = require("../utils/constants");
const openai_1 = require("@langchain/openai");
const embeddings = new openai_1.OpenAIEmbeddings({
    model: constants_1.EMBEDDING_MODEL,
});
async function embedText(text) {
    if (!text.trim()) {
        throw new Error("Cannot embed empty text");
    }
    return embeddings.embedQuery(text);
}
async function embedTexts(texts) {
    if (!texts.length) {
        throw new Error("No texts provided for embedding");
    }
    return embeddings.embedDocuments(texts);
}
