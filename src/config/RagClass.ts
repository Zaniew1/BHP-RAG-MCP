class RAG{
    constructor(private embeddModel: any, private vectorDb:any, private docsLoader:any){}
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