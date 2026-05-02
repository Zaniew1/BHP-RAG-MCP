"use strict";
// src/services/document.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDocument = processDocument;
const path_1 = __importDefault(require("path"));
const load_loader_1 = require("../loaders/load.loader");
const chunk_1 = require("../utils/chunk");
async function processDocument(filePath) {
    const content = await (0, load_loader_1.loadDocument)(filePath);
    const chunks = (0, chunk_1.chunkText)(content);
    return {
        title: path_1.default.basename(filePath),
        content,
        chunks,
    };
}
