import React, { useMemo, useState } from 'react';
import {
    CssBaseline, Container, Paper, ThemeProvider, createTheme,
    Box, Typography, Stack, Button, TextField, Alert
} from '@mui/material';
import { PropertyGrid } from '@rajrai/react-property-grid'; // or your local alias

export default function App() {
    const [data, setData] = useState({
        name: 'My Scene',
        width: 1920,
        height: 1080,
        fullscreen: true,
        quality: 1,
        tags: ['cinematic'],
        camera: { fovRange: [45, 90], lodRange: [0, 3], isoRange: [100, 800] },
        render: { flags: { ambientOcclusion: true }, opacity: 0.8 },
        resolutionIndex: 2,
    });
    const [globalDisabled, setGlobalDisabled] = useState(false);

    // --- Built-in example schema (JS object with functions)
    const builtinSchema = useMemo(() => ({
        section: 'Scene',
        fields: {
            name: {
                type: 'string',
                label: 'Name',
                validate: (v) => (!v ? 'Required' : null),
            },

            // Numeric in data; labeled in UI via render/parse
            resolution: {
                type: 'singleSelect',
                label: 'Resolution',
                options: ['720p', '1080p', '4K'],
                get: (obj) => obj.resolutionIndex,
                set: (obj, v) => { obj.resolutionIndex = v; },
                renderValue: (stored) => ['720p', '1080p', '4K'][stored] ?? '',
                parseValue: (uiVal) => ['720p', '1080p', '4K'].indexOf(uiVal),
            },

            // Classic numeric select (no transforms required)
            quality: {
                type: 'singleSelect',
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
                    width:  { type: 'number', label: 'Width',  validate: (v) => (v < 320 ? 'Too small' : null) },
                    height: { type: 'number', label: 'Height', validate: (v) => (v < 200 ? 'Too small' : null) },
                },
            },

            {
                section: 'Camera',
                fields: {
                    // Two inputs with "Min:" / "Max:" labels
                    fovRange: {
                        type: 'range', // "range" also aliases to range
                        label: 'FOV Range (deg)',
                        min: 1, max: 170,
                        get: (obj) => obj.camera.fovRange,
                        set: (obj, v) => { obj.camera.fovRange = v; },
                        validate: ([min, max]) => (min > max ? 'Min must be ≤ Max' : null),
                    },

                    // Dual-thumb slider with both values shown
                    lodRange: {
                        type: 'rangeSlider',
                        label: 'LOD Range',
                        min: 0, max: 5, step: 1,
                        get: (obj) => obj.camera.lodRange,
                        set: (obj, v) => { obj.camera.lodRange = v; },
                    },

                    // Using the 'range' alias (same as range)
                    isoRange: {
                        type: 'range',
                        label: 'ISO Range',
                        min: 50, max: 12800, step: 50,
                        get: (obj) => obj.camera.isoRange,
                        set: (obj, v) => { obj.camera.isoRange = v; },
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
                    // Single-value slider + number input (synced)
                    opacity: {
                        type: 'numberSlider',
                        label: 'Opacity',
                        min: 0, max: 1, step: 0.01,
                        get: (obj) => obj.render.opacity,
                        set: (obj, v) => { obj.render.opacity = v; },
                    },
                    tags: {
                        type: 'multiSelect',
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

    // --- Editable schema state (JS expression editor)
    const initialEditor = useMemo(
        // The editor expects a JS *expression* that evaluates to the schema object
        () => `({
  section: 'Scene',
  fields: {
    name: {
      type: 'string',
      label: 'Name',
      validate: (v) => (!v ? 'Required' : null),
    },
    resolution: {
      type: 'singleSelect',
      label: 'Resolution',
      options: ['720p', '1080p', '4K'],
      get: (obj) => obj.resolutionIndex,
      set: (obj, v) => { obj.resolutionIndex = v; },
      renderValue: (stored) => ['720p', '1080p', '4K'][stored] ?? '',
      parseValue: (uiVal) => ['720p', '1080p', '4K'].indexOf(uiVal),
    },
    quality: {
      type: 'singleSelect',
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
        width:  { type: 'number', label: 'Width',  validate: (v) => (v < 320 ? 'Too small' : null) },
        height: { type: 'number', label: 'Height', validate: (v) => (v < 200 ? 'Too small' : null) },
      },
    },
    {
      section: 'Camera',
      fields: {
        fovRange: {
          type: 'range', // "range" also works
          label: 'FOV Range (deg)',
          min: 1, max: 170,
          get: (obj) => obj.camera.fovRange,
          set: (obj, v) => { obj.camera.fovRange = v; },
          validate: ([min, max]) => (min > max ? 'Min must be ≤ Max' : null),
        },
        lodRange: {
          type: 'rangeSlider',
          label: 'LOD Range',
          min: 0, max: 5, step: 1,
          get: (obj) => obj.camera.lodRange,
          set: (obj, v) => { obj.camera.lodRange = v; },
        },
        isoRange: {
          type: 'range',
          label: 'ISO Range',
          min: 50, max: 12800, step: 50,
          get: (obj) => obj.camera.isoRange,
          set: (obj, v) => { obj.camera.isoRange = v; },
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
        opacity: {
          type: 'numberSlider',
          label: 'Opacity',
          min: 0, max: 1, step: 0.01,
          get: (obj) => obj.render.opacity,
          set: (obj, v) => { obj.render.opacity = v; },
        },
        tags: {
          type: 'multiSelect',
          label: 'Tags',
          options: ['cinematic', 'draft', 'final', 'internal'],
        },
      },
    },
    {
      section: 'Experimental',
      collapsed: true,
      disabled: true,
      fields: { debugFeature: { type: 'boolean', label: 'New Debug Toggle' } },
    },
  ],
})`,
        []
    );

    const [schemaEditor, setSchemaEditor] = useState(initialEditor);
    const [schema, setSchema] = useState(builtinSchema);
    const [schemaError, setSchemaError] = useState(null);

    const applyEditedSchema = () => {
        try {
            // Evaluate the editor content as a *single JS expression* returning an object
            // NOTE: Playground-only! Do not ship eval in your library.
            // eslint-disable-next-line no-new-func
            const fn = new Function(`return (${schemaEditor});`);
            const obj = fn();
            if (typeof obj !== 'object' || obj == null) {
                throw new Error('Schema must evaluate to an object.');
            }
            setSchema(obj);
            setSchemaError(null);
        } catch (e) {
            setSchemaError(e.message || String(e));
        }
    };

    const resetSchema = () => {
        setSchema(builtinSchema);
        setSchemaEditor(initialEditor);
        setSchemaError(null);
    };

    const theme = useMemo(() => createTheme({
        palette: { mode: 'dark' },
        components: { MuiPaper: { styleOverrides: { root: { padding: 16 } } } },
    }), []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="xl" sx={{ py: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h5">React Property Grid — Playground</Typography>
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => setGlobalDisabled((d) => !d)}>
                            {globalDisabled ? 'Enable Editing' : 'Disable All'}
                        </Button>
                        <Button variant="outlined" onClick={resetSchema}>Reset Schema</Button>
                        <Button variant="contained" onClick={applyEditedSchema}>Apply Schema</Button>
                    </Stack>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    {/* Left: Schema Editor */}
                    <Paper sx={{ flex: 1, minWidth: 300 }}>
                        <Typography variant="subtitle2" gutterBottom>Schema (JS object expression)</Typography>
                        <TextField
                            multiline
                            minRows={24}
                            value={schemaEditor}
                            onChange={(e) => setSchemaEditor(e.target.value)}
                            fullWidth
                            placeholder={`({ section: '...', fields: { ... } })`}
                            InputProps={{
                                sx: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, lineHeight: 1.4 }
                            }}
                        />
                        {schemaError && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                                {schemaError}
                            </Alert>
                        )}
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                            Tip: This editor accepts JavaScript (functions allowed). In real apps, avoid eval; this is playground-only.
                        </Typography>
                    </Paper>

                    {/* Right: Property Grid + Data */}
                    <Box sx={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 360 }}>
                        <Paper variant="outlined">
                            <PropertyGrid
                                schema={schema}
                                object={data}
                                onChange={setData}
                                disabled={globalDisabled}
                                denseDivider
                            />
                        </Paper>

                        <Paper variant="outlined" sx={{ fontFamily: 'monospace', p: 2, fontSize: 12 }}>
                            <Typography variant="subtitle2" gutterBottom>Current object</Typography>
                            <pre style={{ margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>
                        </Paper>
                    </Box>
                </Stack>
            </Container>
        </ThemeProvider>
    );
}
