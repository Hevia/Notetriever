import { IpcMainInvokeEvent, shell } from 'electron';
import fs from 'fs';
import path from 'path';

/**
 * A function that uses Node's FS module to recursively read all text or markdown files in a directory
 * @param directoryPath The path of the directory to read
 */
export function readFiles(event: IpcMainInvokeEvent, directoryPath: string): [string[], string[]] {
    const files: string[] = [];
    const filePaths: string[] = [];

    function readFilesRecursively(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                // the issues with the path I think is that it isnt the "full" original path being passed in
                readFilesRecursively(fullPath);
            } else if (entry.isFile() && (entry.name.endsWith('.txt') || entry.name.endsWith('.md'))) {
                const content = fs.readFileSync(fullPath, 'utf8');
                files.push(content);
                filePaths.push(fullPath);
            }
        }
    }

    readFilesRecursively(directoryPath);

    return [filePaths, files];
}


/**
 * Saves a file to a specified path using Node's FS module
 * @param filePath The path to save the file to
 * @param content The content of the file to save
 */
export function saveFile(event: IpcMainInvokeEvent, filePath: string, content: string): void {
    fs.writeFileSync(filePath, content);
}

export function openFileInOS(event: IpcMainInvokeEvent, filePath: string): void {
    shell.openPath(filePath);
}