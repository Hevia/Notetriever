import { saveFile } from './Services/FileManager';

class RetrieverPipeline {
    static instance = null;

    static async getInstance() {
        if (this.instance === null) {
            try {
                // Dynamically import the Transformers.js library
                const { pipeline } = await import('@xenova/transformers');

                this.instance = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            } catch (error) {
                this.instance = null;
                console.error(error);
            }
        }

        return this.instance;
    }
}


export async function embed_batch(event, texts: string[]) {
    const extractor = await RetrieverPipeline.getInstance();

    if (extractor) {
        const results = [];

        for(let i = 0; i < texts.length; i++) {
            // Due to weird module/import nonsense, we need to ignore the extractor type since transformers.js errors out when not dynamic importing
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const output = await extractor(texts[i], { pooling: 'mean', normalize: true });
            console.log(`Embedding paragraph ${i}... Done`);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            results.push([...output.data]); // we need to convert it to an array from Float32Array otherwise it wont work
        }


        // Send the output back to the main thread
        return results
    }
}

export async function query(event, text) {
    const extractor = await RetrieverPipeline.getInstance();

    if (extractor) {
        console.log(`Embedding query...`);
        const output = await extractor(text, { pooling: 'mean', normalize: true });
        return [...output.data];
    }

    return null;
}