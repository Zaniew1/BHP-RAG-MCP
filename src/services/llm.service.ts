// src/services/llm.service.ts

// import { ChatOpenAI } from "@langchain/openai";
// import { LLM_MODEL } from "../utils/constants";
// const llm = new ChatOpenAI({
//   model: LLM_MODEL,
//   temperature: 0.2,
// });

// interface GenerateAnswerParams {
//   question: string;
//   context: string;
// }

// export async function generateAnswer({
//   question,
//   context,
// }: GenerateAnswerParams): Promise<string> {
//   const prompt = `
// You are a helpful RAG assistant.
// Answer the user's question ONLY using the provided context.
// If the answer is not in context, say you don't know.

// Context:
// ${context}

// Question:
// ${question}
// `;

//   const response = await llm.invoke(prompt);

//   return response.content.toString();
// }