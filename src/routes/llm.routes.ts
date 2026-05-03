import { Router } from "express";
import { LLM } from "../services/llm.service";
import { rag } from "../services/rag.service";
const router = Router();

const llm = new LLM(rag);

/**
 * Ask RAG system a question
 */
router.post("/ask", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ message: "Question is required" });
        }

        const answer = await llm.generateAnswer(question);

        return res.json({
            question,
            answer,
        });
    } catch (err: any) {
        return res.status(500).json({
            message: "RAG error",
            error: err.message,
        });
    }
});

export default router;