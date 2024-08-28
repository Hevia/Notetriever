import { createRoot } from 'react-dom/client';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import { NotetrieverBase } from './NotetrieverBase';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
        <FluentProvider theme={teamsLightTheme}>
            <NotetrieverBase />
        </FluentProvider>
);