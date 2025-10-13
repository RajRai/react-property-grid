import React, { useMemo, useState } from 'react';
import { CssBaseline, Container, Paper, ThemeProvider, createTheme, Box, Typography, Stack, Button } from '@mui/material';
import PropertyGrid from '@rajrai/react-property-grid';

export default function App() {
    const [data, setData] = useState({
        name: 'My Scene',
        width: 1920,
        height: 1080,
        fullscreen: true,
        quality: 1,
        gamma: 2.2,
        tags: ['cinematic'],
    });

    const [globalDisabled, setGlobalDisabled] = useState(false);

    const schema = useMemo(() => ({
        section: 'Scene',
        fields: {
            name: { type: 'string', label: 'Name', validate: (v) => (!v ? 'Required' : null) },
            quality: {
                type: 'single-select',
                label: 'Quality',
                options: [
                    { value: 0, label: 'Low' },
                    { value: 1, label: 'Medium' },
                    { value: 2, label: 'High' },
                ],
                // Example transforms: store numeric internally, show labels in UI
                transformIn: (v) => v, // already numeric
                transformOut: (v) => v,
            },
            fullscreen: { type: 'boolean', label: 'Fullscreen' },
        },
        children: [
            {
                section: 'Dimensions',
                fields: {
                    width: { type: 'number', label: 'Width', validate: (v) => (v < 320 ? 'Too small' : null) },
                    height: { type: 'number', label: 'Height', validate: (v) => (v < 200 ? 'Too small' : null) },
                },
            },
            {
                section: 'Advanced',
                collapsed: true,
                // You can disable whole sections:
                // disabled: true,
                fields: {
                    gamma: { type: 'range', label: 'Gamma', min: 0.5, max: 3.0, step: 0.1 },
                    tags: {
                        type: 'multi-select',
                        label: 'Tags',
                        options: ['cinematic', 'draft', 'final', 'internal'],
                    },
                },
            },
        ],
    }), []);

    const theme = useMemo(() => createTheme({
        palette: { mode: 'dark' },
        components: {
            MuiPaper: { styleOverrides: { root: { padding: 16 } } },
        },
    }), []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h5">React Property Grid — Demo</Typography>
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
                    <Typography variant="subtitle2" gutterBottom>
                        Current object
                    </Typography>
                    <Paper variant="outlined" sx={{ fontFamily: 'monospace', p: 2, fontSize: 12 }}>
                        {JSON.stringify(data, null, 2)}
                    </Paper>
                </Box>
            </Container>
        </ThemeProvider>
    );
}