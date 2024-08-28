import { SelectTabData, SelectTabEvent, Tab, TabList } from "@fluentui/react-components";
import { SearchBase } from "./Components/SearchBase";
import { OnboardBase } from "./Components/OnboardBase";
import { SettingsBase } from "./Components/SettingsBase";
import { useEffect, useRef, useState } from "react";
import { ModelEmbeddingProgress } from "./types";



/**
 * 
 * @returns 
 */
export function SupportBrainBase(): JSX.Element {
    const [selectedTab, setSelectedTab] = useState<string>("Search");
    const [renderedTab, setRenderedTab] = useState<JSX.Element>(<SearchBase />);

    const worker = useRef<Worker>(null);

    function onTabSelect(event: SelectTabEvent, data: SelectTabData): void {
        setSelectedTab(data.value as string);
    }

    // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
    useEffect(() => {
        if (!worker.current) {
            // Create the worker if it does not yet exist.
            (worker.current as unknown) = new Worker('./worker.js', {
                type: 'module'
            });
        }

        // Create a callback function for messages from the worker thread.
        const onMessageReceived = (e: { data: { status: ModelEmbeddingProgress; embeddings: number[][] | ((currVal: number[][]) => number[][]) } }) => {
        
        switch (e.data.status) {
            case ModelEmbeddingProgress.loading:
                // Model file start load: add a new progress item to the list.
                // setModelProgress(ModelEmbeddingProgress.loading)
                break;

            case ModelEmbeddingProgress.completed:
                //setModelProgress(ModelEmbeddingProgress.completed);
                console.log('Embeddings:', e.data.embeddings);
                //setPaperEmbeddings(e.data.embeddings);
                break;
        }
    }

        // Attach the callback function as an event listener.
        (worker.current as Worker).addEventListener('message', onMessageReceived);

        // Define a cleanup function for when the component is unmounted.
        return () => (worker.current as Worker).removeEventListener('message', onMessageReceived);
    }
    );

    useEffect(() => {
        switch(selectedTab) {
            case "Search":
                setRenderedTab(<SearchBase />);
                break;
            case "Onboard":
                setRenderedTab(<OnboardBase />);
                break;
            case "Settings":
                setRenderedTab(<SettingsBase />);
                break;
            default:
                setRenderedTab(<SearchBase />);
        }
    });
    
    return(
        <div className="nt-base">
            <div className="nt-tab-base">
                <TabList onTabSelect={onTabSelect}>
                    <Tab value="Search">
                        Search
                    </Tab>
                    <Tab value="Onboard">
                        Onboard
                    </Tab>
                    <Tab value="Settings">
                        Settings
                    </Tab>
                </TabList>
            </div>
                {renderedTab}
        </div>
    )
}