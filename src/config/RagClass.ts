import { OpenAIEmbeddings } from "@langchain/openai";
// import { EMBEDDING_MODEL } from "../utils/constants";
import {Loader, LoaderInterface} from '../loaders/Loader.ts'
import { EMBEDDING_MODEL } from "../utils/constants.ts";
import {vectordb, VectorDBInterface} from '../services/vector.service.ts'
class RAG{
    constructor(private embeddModel: any, private vectorDb:VectorDBInterface, private docsLoader:LoaderInterface){}
    public startPreprocessing(): void {
        this.loadDocuments();
        this.chunkDocuments();
        this.embeddDocuments(
        );
        this.storeEmbeddedDocumentsInVectorDb();
    }
    public augmentPrompt(): void {
        this.embeddPrompt()
        this.findPromptSimilarities()
        this.enrichPromptWithContext()
    }
    private loadDocuments(): void {
        console.log(this.docsLoader)
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
    private enrichPromptWithContext(): void {}

    
}

const loader = new Loader("src\documents");
const embed = new OpenAIEmbeddings({
  model: EMBEDDING_MODEL,
});
const rag = new RAG(embed, vectordb, loader)

console.log(rag.startPreprocessing());