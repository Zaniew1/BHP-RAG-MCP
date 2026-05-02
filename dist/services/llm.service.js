"use strict";
// src/services/llm.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnswer = generateAnswer;
const openai_1 = require("@langchain/openai");
const constants_1 = require("../utils/constants");
const llm = new openai_1.ChatOpenAI({
    model: constants_1.LLM_MODEL,
    temperature: 0.2,
});
async function generateAnswer({ question, context, }) {
    const prompt = `
You are a helpful RAG assistant.
Answer the user's question ONLY using the provided context.
If the answer is not in context, say you don't know.

Context:
${context}

Question:
${question}
`;
    const response = await llm.invoke(prompt);
    return response.content.toString();
}
