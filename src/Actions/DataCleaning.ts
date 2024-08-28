export function prepareDataForInsertion(filePaths: string[], fileEmbeddings: number[], fileTexts: string[] ): Array<Record<string, unknown>> {
    const data = [];
    const data_length = fileEmbeddings.length as number;

    for (let i = 0; i < data_length; i++) {
        // TODO: Need some better checks here
        data.push({
            "file_text": fileTexts[i] ?? "Unknown",
            "file_name": filePaths[i] ?? "Unknown",
            "vector": fileEmbeddings[i],
        });
    }

    return data;
}