"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RAG {
    constructor(embeddModel, vectorDb, docsLoader) {
        this.embeddModel = embeddModel;
        this.vectorDb = vectorDb;
        this.docsLoader = docsLoader;
    }
    startPreprocessing() {
        this.loadDocuments();
        this.chunkDocuments();
        this.embeddDocuments();
        this.storeEmbeddedDocumentsInVectorDb();
    }
    augmentPrompt() {
        this.embeddPrompt();
        this.findPromptSimilarities();
        this.enrichPromptWithContext();
    }
    loadDocuments() {
        console.log(this.docsLoader);
    }
    chunkDocuments() { }
    embeddDocuments() {
        console.log(this.embeddModel);
    }
    storeEmbeddedDocumentsInVectorDb() {
        console.log(this.vectorDb);
    }
    embeddPrompt() { }
    findPromptSimilarities() { }
    enrichPromptWithContext() { }
}
