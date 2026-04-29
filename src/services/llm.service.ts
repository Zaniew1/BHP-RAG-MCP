// src/services/llm.service.ts

import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.2,
});

interface GenerateAnswerParams {
  question: string;
  context: string;
}

export async function generateAnswer({
  question,
  context,
}: GenerateAnswerParams): Promise<string> {
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