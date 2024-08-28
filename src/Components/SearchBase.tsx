import { Button, Field, InputOnChangeData, SearchBox, SearchBoxChangeEvent, Spinner } from "@fluentui/react-components";
import { useState } from "react";
import { SearchResults } from "./SearchResults";



/**
 * 
 * @returns 
 */
export function SearchBase(): JSX.Element {
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchResults, setSearchResults] = useState([]);
    const [resultsLoading, setResultsLoading] = useState<boolean>(false);

    async function onSearchButtonClick() {
        setResultsLoading(true);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const query_embedding = await window.electronAPI.query(searchValue);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const searchResults = await window.electronAPI.readFromDB(query_embedding, 10);

        setResultsLoading(false);
        setSearchResults(searchResults);
    }

    function onSearchBarChange(event: SearchBoxChangeEvent, data: InputOnChangeData): void {
        setSearchValue(data.value);
    }

    return(
        <div className="nt-base">
            <div className="nt-search-bar-container">
                <Field className="nt-search-bar" label="Search">
                    <SearchBox
                        onChange={onSearchBarChange}
                        placeholder="What document are you looking for?" 
                    />
                </Field>
                <Button className="nt-search-button" onClick={onSearchButtonClick} appearance="primary">Search</Button>
            </div>
            {resultsLoading && <Spinner appearance={"primary"} size={"large"} label="Searching...."/>}
            <SearchResults 
                searchResults={searchResults}
            />
        </div>
    )
}