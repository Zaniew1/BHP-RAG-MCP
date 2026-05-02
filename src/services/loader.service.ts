import fs from 'fs/promises'
import path from "path";
import pdf from 'pdf-parse';

export interface LoaderInterface {
    parseDocuments(folderPath:string):Promise<string>
}

export class Loader implements LoaderInterface{
    constructor(){}
    public async parseDocuments(folderPath:string): Promise<string> {
        const files = await fs.readdir(folderPath);

        const results: string[] = [];

        for (const file of files) {
            const fullPath = path.join(folderPath, file);
            const ext = path.extname(file).toLowerCase();

            try {
                if (ext === ".txt") {
                    results.push(await this.parseText(fullPath));
                }

                if (ext === ".md") {
                    results.push(await this.parseMd(fullPath));
                }

                if (ext === ".pdf") {
                    results.push(await this.parsePDF(fullPath));
                }
            } catch (err) {
                console.error(`Failed to parse ${file}:`, err);
            }
        }

        return results.join("\n\n");
    }
    private async parsePDF(filePath: string): Promise<string |  any>  {
        const buffer = await fs.readFile(filePath);
        try{
            await pdf(buffer).then(result => {
                console.log(result.text)
                return result.text
            }
        );
        }catch(e: unknown){throw Error("BŁAD")}

    }
    private async parseText(filePath: string): Promise<string> {
        const content = await fs.readFile(filePath, "utf-8");

        if (!content.trim()) {
            throw new Error("TXT file is empty");
        }

        return content;
    }
    private async parseMd(filePath: string): Promise<string> {
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

}