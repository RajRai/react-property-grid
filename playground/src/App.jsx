import React, {useState, useEffect, useRef} from "react";
import {
    CssBaseline, Container, Paper, ThemeProvider, Box, Typography,
    Stack, Button, TextField, Alert, FormControl, InputLabel,
    Collapse
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { PropertyGrid } from "@rajrai/react-property-grid";
import {defaultSceneData, usePlaygroundSchema} from "./schema";
import {
    allPresets,
    NewThemeButton,
    ThemeEditor,
    ThemeManagerProvider,
    ThemeSelector,
    useThemeManager
} from "@rajrai/mui-theme-manager";

export default function App() {
    const containerRef = useRef(null);
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new ResizeObserver(([entry]) => {
            setIsCompact(entry.contentRect.width < 900); // adjust threshold as needed
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const [editorOpen, setEditorOpen] = useState(false);

    const {activeTheme} = useThemeManager();

    // === SCHEMA HOOK ===
    const [data, setData] = useState(defaultSceneData);
    const [globalDisabled, setGlobalDisabled] = useState(false);
    const {
        schema,
        schemaEditor,
        setSchemaEditor,
        schemaError,
        applyEditedSchema,
        resetSchema,
    } = usePlaygroundSchema();

    return (
        <Container ref={containerRef} maxWidth="xl" sx={{ py: 2, px: isCompact ? 1 : 2 }}>
            <Stack
                direction={isCompact ? "column" : "row"}
                justifyContent="space-between"
                alignItems={isCompact ? "stretch" : "center"}
                spacing={isCompact ? 2 : 1}
                sx={{ mb: 1 }}
            >
                <Typography
                    variant="h5"
                    sx={{ textAlign: isCompact ? "center" : "left" }}
                >
                    React Property Grid — Playground
                </Typography>
                <Stack direction={isCompact ? "column" : "row"} spacing={1} sx={{ width: isCompact ? "100%" : "auto" }}>
                    <ThemeSelector
                        formControlProps={{
                            sx: {
                                width: isCompact ? "100%" : "auto",
                            }
                        }}
                    />
                    <NewThemeButton/>

                    {/* New: Customize Theme button */}
                    <Button
                        fullWidth={isCompact}
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setEditorOpen((o) => !o)}
                        endIcon={
                            <KeyboardArrowDownIcon
                                sx={{ transform: editorOpen ? "rotate(180deg)" : "none" }}
                            />
                        }
                    >
                        Customize Theme
                    </Button>

                    {/* Existing buttons */}
                    <Button fullWidth={isCompact} variant="outlined" onClick={() => setGlobalDisabled((d) => !d)}>
                        {globalDisabled ? 'Enable Editing' : 'Disable All'}
                    </Button>
                    <Button fullWidth={isCompact} variant="outlined" onClick={resetSchema}>Reset Schema</Button>
                    <Button fullWidth={isCompact} variant="contained" onClick={applyEditedSchema}>Apply Schema</Button>
                </Stack>
            </Stack>
            <Collapse in={editorOpen} unmountOnExit>
                <ThemeEditor value={activeTheme}/>
            </Collapse>

            <Stack direction={isCompact ? "column" : { xs: 'column', md: 'row' }} spacing={2}>
                {/* Left: Schema Editor */}
                <Paper sx={{ flex: 1, minWidth: isCompact ? "100%" : 300 }}>
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
                <Box sx={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: isCompact ? "100%" : 360 }}>
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
    );
}
