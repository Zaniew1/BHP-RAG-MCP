import fs from "fs/promises";

export async function loadTxt(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, "utf-8");

  if (!content.trim()) {
    throw new Error("TXT file is empty");
  }

  return content;
}