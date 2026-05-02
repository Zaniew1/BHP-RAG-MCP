"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDocument = loadDocument;
const path_1 = __importDefault(require("path"));
const txt_loader_1 = require("./txt.loader");
const markdown_loader_1 = require("./markdown.loader");
const pdf_loader_1 = require("./pdf.loader");
async function loadDocument(filePath) {
    const ext = path_1.default.extname(filePath).toLowerCase();
    switch (ext) {
        case ".txt":
            return (0, txt_loader_1.loadTxt)(filePath);
        case ".md":
        case ".markdown":
            return (0, markdown_loader_1.loadMarkdown)(filePath);
        case ".pdf":
            return (0, pdf_loader_1.loadPdf)(filePath);
        default:
            throw new Error(`Unsupported file type: ${ext}`);
    }
}
