import { ChatOpenAI } from "@langchain/openai";
import { LLM_MODEL, OPENAI_API_KEY } from "../utils/constants";
import { RagInterface } from "./rag.service";

export class LLM{
    constructor(private rag: RagInterface){}
    private llm = new ChatOpenAI({
        model: LLM_MODEL,
        temperature: 0.2,
        apiKey: OPENAI_API_KEY,
    });


public async generateAnswer(prompt:string): Promise<string> {

    const context = await this.rag.augmentPrompt(prompt)
    const newPrompt = `
        You are a helpful RAG assistant.
        Answer the user's question ONLY using the provided context.
        If the answer is not in context, say you don't know.

        Context:
        ${context}

        Question:
        ${prompt}
    `;
    const response = await this.llm.invoke(newPrompt);
    return response.content.toString();
}

}