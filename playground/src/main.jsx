import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {allPresets, ThemeManagerProvider} from "@rajrai/mui-theme-manager";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeManagerProvider presets={allPresets}>
            <App />
        </ThemeManagerProvider>
    </React.StrictMode>
);