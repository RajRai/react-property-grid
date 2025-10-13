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
        camera: {
            fovRange: [45, 90],
            lodRange: [0, 3],
            isoRange: [100, 800],
            exposure: { shutter: 1 / 120, iso: 400 },
            lens: { focal: 35, focusDistance: 2.5 },
        },
        render: {
            flags: { ambientOcclusion: true },
            opacity: 0.8,
            tone: { op: 'ACES', exposureComp: 0.0, shoulder: [0.2, 0.8] },
        },
        resolutionIndex: 2,
    });
    const [globalDisabled, setGlobalDisabled] = useState(false);

    // --- Built-in example schema (multi top-level + nested children)
    const builtinSchema = useMemo(() => ([
        {
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
                    get: (o) => o.resolutionIndex,
                    set: (o, v) => { o.resolutionIndex = v; },
                    renderValue: (stored) => ['720p', '1080p', '4K'][stored] ?? '',
                    parseValue: (ui) => ['720p', '1080p', '4K'].indexOf(ui),
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
        },

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
                    type: 'range',
                    label: 'FOV Range (deg)',
                    min: 1, max: 170,
                    get: (o) => o.camera.fovRange,
                    set: (o, v) => { o.camera.fovRange = v; },
                    validate: ([min, max]) => (min > max ? 'Min must be ≤ Max' : null),
                },
                lodRange: {
                    type: 'rangeSlider',
                    label: 'LOD Range',
                    min: 0, max: 5, step: 1,
                    get: (o) => o.camera.lodRange,
                    set: (o, v) => { o.camera.lodRange = v; },
                },
                isoRange: {
                    type: 'range',
                    label: 'ISO Range',
                    min: 50, max: 12800, step: 50,
                    get: (o) => o.camera.isoRange,
                    set: (o, v) => { o.camera.isoRange = v; },
                },
            },
            children: [
                {
                    section: 'Exposure',
                    fields: {
                        shutter: {
                            type: 'number',
                            label: 'Shutter (1/x s)',
                            get: (o) => o.camera.exposure.shutter,
                            set: (o, v) => { o.camera.exposure.shutter = v; },
                            validate: (v) => (v <= 0 ? 'Must be > 0' : null),
                        },
                        iso: {
                            type: 'number',
                            label: 'ISO',
                            get: (o) => o.camera.exposure.iso,
                            set: (o, v) => { o.camera.exposure.iso = v; },
                            validate: (v) => (v < 50 ? 'Too low' : null),
                        },
                    },
                },
                {
                    section: 'Lens',
                    fields: {
                        focal: {
                            type: 'numberSlider',
                            label: 'Focal Length (mm)',
                            min: 12, max: 200, step: 1,
                            get: (o) => o.camera.lens.focal,
                            set: (o, v) => { o.camera.lens.focal = v; },
                        },
                        focusDistance: {
                            type: 'number',
                            label: 'Focus Distance (m)',
                            get: (o) => o.camera.lens.focusDistance,
                            set: (o, v) => { o.camera.lens.focusDistance = v; },
                            validate: (v) => (v < 0 ? 'Must be ≥ 0' : null),
                        },
                    },
                },
            ],
        },

        {
            section: 'Rendering',
            fields: {
                ambientOcclusion: {
                    type: 'boolean',
                    label: 'Ambient Occlusion',
                    get: (o) => o.render.flags.ambientOcclusion,
                    set: (o, v) => { o.render.flags.ambientOcclusion = v; },
                },
                opacity: {
                    type: 'numberSlider',
                    label: 'Opacity',
                    min: 0, max: 1, step: 0.01,
                    get: (o) => o.render.opacity,
                    set: (o, v) => { o.render.opacity = v; },
                },
                tags: {
                    type: 'multiSelect',
                    label: 'Tags',
                    options: ['cinematic', 'draft', 'final', 'internal'],
                },
            },
            children: [
                {
                    section: 'Tone Mapping',
                    fields: {
                        op: {
                            type: 'singleSelect',
                            label: 'Operator',
                            options: ['ACES', 'Reinhard', 'Filmic'],
                            get: (o) => o.render.tone.op,
                            set: (o, v) => { o.render.tone.op = v; },
                        },
                        exposureComp: {
                            type: 'numberSlider',
                            label: 'Exposure Comp (EV)',
                            min: -5, max: 5, step: 0.1,
                            get: (o) => o.render.tone.exposureComp,
                            set: (o, v) => { o.render.tone.exposureComp = v; },
                        },
                        shoulder: {
                            type: 'rangeSlider',
                            label: 'Shoulder',
                            min: 0, max: 1, step: 0.01,
                            get: (o) => o.render.tone.shoulder,
                            set: (o, v) => { o.render.tone.shoulder = v; },
                        },
                    },
                    children: [
                        {
                            section: 'Advanced Tone',
                            collapsed: true,
                            fields: {
                                rolloff: {
                                    type: 'numberSlider',
                                    label: 'Rolloff',
                                    min: 0, max: 1, step: 0.01,
                                    get: (o) => o.render.tone.rolloff ?? 0.5,
                                    set: (o, v) => { o.render.tone.rolloff = v; },
                                },
                            },
                        },
                    ],
                },
            ],
        },

        {
            section: 'Experimental',
            collapsed: true,
            disabled: true,
            fields: {
                debugFeature: { type: 'boolean', label: 'New Debug Toggle' },
            },
        },
    ]), []);

    // --- Editable schema state (JS expression editor) with nesting
    const initialEditor = useMemo(
        () => `([
  {
    section: 'Scene',
    fields: {
      name: { type: 'string', label: 'Name', validate: (v) => (!v ? 'Required' : null) },
      resolution: {
        type: 'singleSelect', label: 'Resolution', options: ['720p','1080p','4K'],
        get: (o) => o.resolutionIndex, set: (o, v) => { o.resolutionIndex = v; },
        renderValue: (i) => ['720p','1080p','4K'][i] ?? '', parseValue: (s) => ['720p','1080p','4K'].indexOf(s),
      },
      quality: {
        type: 'singleSelect', label: 'Quality',
        options: [{value:0,label:'Low'},{value:1,label:'Medium'},{value:2,label:'High'}],
        validate: (v) => (v == null ? 'Choose a quality' : null),
      },
      fullscreen: { type: 'boolean', label: 'Fullscreen' },
    },
  },
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
      fovRange: { type: 'range', label: 'FOV Range (deg)', min:1, max:170,
        get: (o) => o.camera.fovRange, set: (o, v) => { o.camera.fovRange = v; },
        validate: ([min,max]) => (min > max ? 'Min must be ≤ Max' : null),
      },
      lodRange: { type: 'rangeSlider', label: 'LOD Range', min:0, max:5, step:1,
        get: (o) => o.camera.lodRange, set: (o, v) => { o.camera.lodRange = v; },
      },
      isoRange: { type: 'range', label: 'ISO Range', min:50, max:12800, step:50,
        get: (o) => o.camera.isoRange, set: (o, v) => { o.camera.isoRange = v; },
      },
    },
    children: [
      {
        section: 'Exposure',
        fields: {
          shutter: { type:'number', label:'Shutter (1/x s)', get:(o)=>o.camera.exposure.shutter, set:(o,v)=>{o.camera.exposure.shutter=v;},
                     validate:(v)=> (v<=0 ? 'Must be > 0' : null) },
          iso:     { type:'number', label:'ISO', get:(o)=>o.camera.exposure.iso, set:(o,v)=>{o.camera.exposure.iso=v;},
                     validate:(v)=> (v<50 ? 'Too low' : null) },
        },
      },
      {
        section: 'Lens',
        fields: {
          focal: { type:'numberSlider', label:'Focal Length (mm)', min:12, max:200, step:1,
                   get:(o)=>o.camera.lens.focal, set:(o,v)=>{o.camera.lens.focal=v;} },
          focusDistance: { type:'number', label:'Focus Distance (m)',
                   get:(o)=>o.camera.lens.focusDistance, set:(o,v)=>{o.camera.lens.focusDistance=v;},
                   validate:(v)=> (v<0 ? 'Must be ≥ 0' : null) },
        },
      },
    ],
  },
  {
    section: 'Rendering',
    fields: {
      ambientOcclusion: { type:'boolean', label:'Ambient Occlusion',
        get:(o)=>o.render.flags.ambientOcclusion, set:(o,v)=>{o.render.flags.ambientOcclusion=v;} },
      opacity: { type:'numberSlider', label:'Opacity', min:0, max:1, step:0.01,
        get:(o)=>o.render.opacity, set:(o,v)=>{o.render.opacity=v;} },
      tags: { type:'multiSelect', label:'Tags', options:['cinematic','draft','final','internal'] },
    },
    children: [
      {
        section: 'Tone Mapping',
        fields: {
          op: { type:'singleSelect', label:'Operator', options:['ACES','Reinhard','Filmic'],
                get:(o)=>o.render.tone.op, set:(o,v)=>{o.render.tone.op=v;} },
          exposureComp: { type:'numberSlider', label:'Exposure Comp (EV)', min:-5, max:5, step:0.1,
                get:(o)=>o.render.tone.exposureComp, set:(o,v)=>{o.render.tone.exposureComp=v;} },
          shoulder: { type:'rangeSlider', label:'Shoulder', min:0, max:1, step:0.01,
                get:(o)=>o.render.tone.shoulder, set:(o,v)=>{o.render.tone.shoulder=v;} },
        },
        children: [
          { section:'Advanced Tone', collapsed:true,
            fields: {
              rolloff: { type:'numberSlider', label:'Rolloff', min:0, max:1, step:0.01,
                         get:(o)=>o.render.tone.rolloff ?? 0.5, set:(o,v)=>{o.render.tone.rolloff=v;} },
            }
          }
        ]
      }
    ]
  },
  { section: 'Experimental', collapsed: true, disabled: true,
    fields: { debugFeature: { type: 'boolean', label: 'New Debug Toggle' } } },
])`,
        []
    );

    const [schemaEditor, setSchemaEditor] = useState(initialEditor);
    const [schema, setSchema] = useState(builtinSchema);
    const [schemaError, setSchemaError] = useState(null);

    const applyEditedSchema = () => {
        try {
            // Playground-only: eval a single JS expression that returns object/array
            // eslint-disable-next-line no-new-func
            const fn = new Function(`return (${schemaEditor});`);
            const obj = fn();
            if (!obj || typeof obj !== 'object') {
                throw new Error('Schema must evaluate to an object or an array of objects.');
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
                        <Typography variant="subtitle2" gutterBottom>Schema (JS object/array expression)</Typography>
                        <TextField
                            multiline
                            minRows={24}
                            value={schemaEditor}
                            onChange={(e) => setSchemaEditor(e.target.value)}
                            fullWidth
                            placeholder={`([{ section: '...', fields: { ... } }, ...])`}
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
