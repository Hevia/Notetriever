

interface ISearchResultsProps {
    searchResults: Array<Record<string, string>>;
}

export function SearchResults(props: ISearchResultsProps): JSX.Element {
    return(
        <div className="nt-results">
            {props.searchResults.map((result, index) => (
                <div key={index} className="nt-result-item">
                    <a 
                        href={"file://" + result['file_name']} 
                        target="_blank" 
                        rel="noreferrer"
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        onClick={async () => await window.electronAPI.openFileInOS(result['file_name'])}
                    >
                            {result['file_name'].match(/[^\\]+$/)[0]}
                    </a>
                </div>
            ))}
        </div>
    )
}