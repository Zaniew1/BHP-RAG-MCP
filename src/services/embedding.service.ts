
import {EMBEDDING_MODEL} from '../utils/constants.ts'
import { OpenAIEmbeddings } from "@langchain/openai";

interface EmbeddingModelInterface{
    embedText(text: string): Promise<number[]>
    embedTexts(texts: string[]): Promise<number[][]>
}

export class EmbeddingClass implements EmbeddingModelInterface{
    constructor(private embedModel : EmbeddingModelInterface){
    }
    async embedText(text: string): Promise<number[]>{
        return await this.embedModel.embedText(text)
    }
    async embedTexts(texts: string[]): Promise<number[][]>{
       return await this.embedModel.embedTexts(texts)

    }
}


export class OpenAiEmbed implements EmbeddingModelInterface{
    private model = new OpenAIEmbeddings({
        model: EMBEDDING_MODEL,
    });
    async embedText(text: string): Promise<number[]> {
        if (!text.trim()) {
            throw new Error("Cannot embed empty text");
        }

        return this.model.embedQuery(text);
    }

    async embedTexts(texts: string[]): Promise<number[][]> {
        if (!texts.length) {
            throw new Error("No texts provided for embedding");
        }

        return this.model.embedDocuments(texts);
    }
}
