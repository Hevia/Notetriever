// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

// Here, we use the `contextBridge` API to expose a custom API to the renderer process.
// This API allows the renderer process to invoke the `transformers:run` event in the main process.
contextBridge.exposeInMainWorld('electronAPI', {
    embed_batch: (texts: string[]) => ipcRenderer.invoke('transformers:embed_batch', texts),
    query: (text: string) => ipcRenderer.invoke('transformers:query', text),
    readFiles: (directoryPath: string) => ipcRenderer.invoke('fileManager:readFiles', directoryPath),
    saveFile: (filePath: string, content: string) => ipcRenderer.invoke('fileManager:saveFile', filePath, content),
    createVectorDB: (vectors: Array<Record<string, unknown>>) => ipcRenderer.invoke('vectorDBManager:createVectorDB', vectors),
    readFromDB: (vector: number[], limit?: number) => ipcRenderer.invoke('vectorDBManager:readFromDB', vector, limit),
    openFileInOS: (filePath: string) => ipcRenderer.invoke('fileManager:openFileInOS', filePath),
});