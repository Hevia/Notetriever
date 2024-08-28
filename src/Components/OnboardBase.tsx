import { Button, Field, Spinner, Textarea, TextareaOnChangeData } from "@fluentui/react-components";
import React, { ChangeEvent } from "react";
import { prepareDataForInsertion } from "../Actions/DataCleaning";

/**
 * 
 * @returns 
 */
export function OnboardBase(): JSX.Element {
    const [filePath, setFilePath] = React.useState<string>("")
    const [indexLoading, setIndexLoading] = React.useState<boolean>(false);

    function onFilePathChange(ev: ChangeEvent<HTMLTextAreaElement>, data: TextareaOnChangeData): void {
        setFilePath(data.value);
    }

    async function onIndexButtonClick(): Promise<void> {
        setIndexLoading(true);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const fileInfo = await window.electronAPI.readFiles(filePath);
        const filePaths = fileInfo[0];
        const files = fileInfo[1] as string[];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const checkpoint1 = await window.electronAPI.saveFile("./checkpoint1.txt", "checkpoint1");

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const fileEmbeddings: number[] = await window.electronAPI.embed_batch(files);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const checkpoint2 = await window.electronAPI.saveFile("./checkpoint2.txt", "checkpoint2");

        // Now we insert the embeddings into the index
        const data = prepareDataForInsertion(filePaths, fileEmbeddings, files);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const checkpoint3 = await window.electronAPI.saveFile("./checkpoint3.txt", "checkpoint3");
        
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        await window.electronAPI.createVectorDB(data);

        setIndexLoading(false);
    }

    return(
        <div className="nt-base">
            <h1>Onboard</h1>
            <Field label="Paste the path to a directory here to index it">
                <Textarea onChange={onFilePathChange}/>
            </Field>
            <Button onClick={onIndexButtonClick} appearance="primary">Create Index</Button>
            {indexLoading && <Spinner appearance={"primary"} size={"large"} label="Index is being created..."/>}
        </div>
    )
}