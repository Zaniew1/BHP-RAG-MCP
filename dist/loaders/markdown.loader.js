"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMarkdown = loadMarkdown;
const promises_1 = __importDefault(require("fs/promises"));
/**
 * Prosty markdown loader:
 * - usuwa podstawowe znaczniki markdown
 * - zwraca czysty tekst
 */
async function loadMarkdown(filePath) {
    const content = await promises_1.default.readFile(filePath, "utf-8");
    if (!content.trim()) {
        throw new Error("Markdown file is empty");
    }
    return content
        .replace(/```[\s\S]*?```/g, "") // code blocks
        .replace(/`([^`]+)`/g, "$1") // inline code
        .replace(/!\[.*?\]\(.*?\)/g, "") // images
        .replace(/\[([^\]]+)\]\((.*?)\)/g, "$1") // links
        .replace(/^#{1,6}\s+/gm, "") // headings
        .replace(/[*_~>-]/g, "") // markdown chars
        .replace(/\n{2,}/g, "\n")
        .trim();
}
