import fs from "fs/promises";

/**
 * Prosty markdown loader:
 * - usuwa podstawowe znaczniki markdown
 * - zwraca czysty tekst
 */
export async function loadMarkdown(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, "utf-8");

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