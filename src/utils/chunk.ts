export interface ChunkOptions {
  chunkSize?: number;
  chunkOverlap?: number;
}

export interface TextChunk {
  content: string;
  index: number;
}

/**
 * Prosty chunker tekstu pod RAG:
 * - dzieli po długości znaków
 * - zachowuje overlap między chunkami
 */
export function chunkText(
  text: string,
  options: ChunkOptions = {}
): TextChunk[] {
  const chunkSize = options.chunkSize ?? 1000;
  const chunkOverlap = options.chunkOverlap ?? 200;

  if (!text || !text.trim()) return [];

  const normalizedText = text.replace(/\s+/g, " ").trim();
  const chunks: TextChunk[] = [];

  let start = 0;
  let index = 0;

  while (start < normalizedText.length) {
    const end = Math.min(start + chunkSize, normalizedText.length);

    const chunk = normalizedText.slice(start, end).trim();

    if (chunk) {
      chunks.push({
        content: chunk,
        index,
      });
    }

    if (end >= normalizedText.length) break;

    start += chunkSize - chunkOverlap;
    index++;
  }

  return chunks;
}