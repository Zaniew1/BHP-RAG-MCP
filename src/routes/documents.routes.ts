import { Router } from "express";
import { rag } from "../services/rag.service";

const router = Router();

// ingest all documents in folder src/documents
router.get("/ingest", async (req, res) => {
    try {
        await rag.ingestDocuments("src/documents");
        return res.json({
            message: "Document ingested successfully",
        });
    } catch (err: any) {
        return res.status(500).json({
            message: "Error ingesting document",
            error: err.message,
        });
    }
});

export default router;