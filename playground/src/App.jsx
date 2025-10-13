import React, { useMemo, useState } from 'react';
import {
    CssBaseline, Container, Paper, ThemeProvider, createTheme,
    Box, Typography, Stack, Button
} from '@mui/material';
import { PropertyGrid } from '@rajrai/react-property-grid'; // or your local alias

export default function App() {
    const [data, setData] = useState({
        name: 'My Scene',
        width: 1920,
        height: 1080,
        fullscreen: true,
        quality: 1,                  // stored as numeric
        tags: ['cinematic'],
        camera: {
            fovRange: [45, 90],        // valueRange example
            lodRange: [0, 3],          // sliderRange example
        },
        render: { flags: { ambientOcclusion: true } }, // get/set mapping example
        resolutionIndex: 2,          // 0/1/2 mapped to labels via render/parse
    });

    const [globalDisabled, setGlobalDisabled] = useState(false);

    const schema = useMemo(() => ({
        section: 'Scene',
        fields: {
            name: {
                type: 'string',
                label: 'Name',
                validate: (v) => (!v ? 'Required' : null),
            },

            // Example: store numeric, but show string labels in UI
            resolution: {
                type: 'single-select',
                label: 'Resolution',
                options: ['720p', '1080p', '4K'],
                get: (obj) => obj.resolutionIndex,
                set: (obj, v) => { obj.resolutionIndex = v; },
                // UI should show a string label, so map number <-> label
                renderValue: (stored) => ['720p', '1080p', '4K'][stored] ?? '',
                parseValue: (uiVal) => ['720p', '1080p', '4K'].indexOf(uiVal),
            },

            // Classic numeric select (no transforms required)
            quality: {
                type: 'single-select',
                label: 'Quality',
                options: [
                    { value: 0, label: 'Low' },
                    { value: 1, label: 'Medium' },
                    { value: 2, label: 'High' },
                ],
                validate: (v) => (v == null ? 'Choose a quality' : null),
            },

            fullscreen: { type: 'boolean', label: 'Fullscreen' },
        },

        children: [
            {
                section: 'Dimensions',
                fields: {
                    width: {
                        type: 'number', label: 'Width',
                        validate: (v) => (v < 320 ? 'Too small' : null),
                    },
                    height: {
                        type: 'number', label: 'Height',
                        validate: (v) => (v < 200 ? 'Too small' : null),
                    },
                },
            },

            {
                section: 'Camera',
                fields: {
                    fovRange: {
                        type: 'valueRange',            // "range" also aliases to valueRange
                        label: 'FOV Range (deg)',
                        min: 1, max: 170,
                        get: (obj) => obj.camera.fovRange,
                        set: (obj, v) => { obj.camera.fovRange = v; },
                        validate: ([min, max]) => (min > max ? 'Min must be ≤ Max' : null),
                    },
                    lodRange: {
                        type: 'sliderRange',
                        label: 'LOD Range',
                        min: 0, max: 5, step: 1,
                        get: (obj) => obj.camera.lodRange,
                        set: (obj, v) => { obj.camera.lodRange = v; },
                    },
                },
            },

            {
                section: 'Rendering',
                fields: {
                    ambientOcclusion: {
                        type: 'boolean',
                        label: 'Ambient Occlusion',
                        get: (obj) => obj.render.flags.ambientOcclusion,
                        set: (obj, v) => { obj.render.flags.ambientOcclusion = v; },
                    },
                    tags: {
                        type: 'multi-select',
                        label: 'Tags',
                        options: ['cinematic', 'draft', 'final', 'internal'],
                    },
                },
            },

            {
                section: 'Experimental',
                collapsed: true,
                disabled: true, // whole section disabled
                fields: {
                    debugFeature: { type: 'boolean', label: 'New Debug Toggle' },
                },
            },
        ],
    }), []);

    const theme = useMemo(() => createTheme({
        palette: { mode: 'dark' },
        components: { MuiPaper: { styleOverrides: { root: { padding: 16 } } } },
    }), []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h5">React Property Grid — Playground</Typography>
                    <Button variant="outlined" onClick={() => setGlobalDisabled((d) => !d)}>
                        {globalDisabled ? 'Enable Editing' : 'Disable All'}
                    </Button>
                </Stack>

                <Paper variant="outlined">
                    <PropertyGrid
                        schema={schema}
                        object={data}
                        onChange={setData}
                        disabled={globalDisabled}
                        denseDivider
                    />
                </Paper>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Current object</Typography>
                    <Paper variant="outlined" sx={{ fontFamily: 'monospace', p: 2, fontSize: 12 }}>
                        {JSON.stringify(data, null, 2)}
                    </Paper>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
