"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTxt = loadTxt;
const promises_1 = __importDefault(require("fs/promises"));
async function loadTxt(filePath) {
    const content = await promises_1.default.readFile(filePath, "utf-8");
    if (!content.trim()) {
        throw new Error("TXT file is empty");
    }
    return content;
}
