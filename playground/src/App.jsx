import React, { useState, useEffect } from "react";
import {
    CssBaseline, Container, Paper, ThemeProvider, Box, Typography,
    Stack, Button, TextField, Alert, FormControl, InputLabel,
    Select, MenuItem, Collapse
} from "@mui/material";
import {
    loadThemes,
    saveCustomTheme,
    deleteCustomTheme,
    resetCustomThemes,
    listCustomThemeNames,
    loadLastTheme,
    saveLastTheme, formatThemeName, getThemeOptions,
} from "./themes/themeManager";
import { createTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { PropertyGrid } from "@rajrai/react-property-grid";
import {defaultSceneData, usePlaygroundSchema} from "./schema";

export default function App() {
    // === THEME MANAGER ===
    const [themesMap, setThemesMap] = useState(() => loadThemes());
    const [selectedTheme, setSelectedTheme] = useState(() => loadLastTheme());
    const [muiTheme, setMuiTheme] = useState(
        () => themesMap[selectedTheme] || Object.values(themesMap)[0]
    );

    useEffect(() => {
        const t = themesMap[selectedTheme] || Object.values(themesMap)[0];
        setMuiTheme(t);
    }, [themesMap, selectedTheme]);

    const refreshThemes = () => setThemesMap(loadThemes());

    const handleSelectTheme = (name) => {
        setSelectedTheme(name);
        saveLastTheme(name);
    };

    // === CUSTOM THEME EDITOR ===
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorText, setEditorText] = useState("");
    const [editorError, setEditorError] = useState(null);
    const [saveName, setSaveName] = useState("");

    useEffect(() => {
        if (editorOpen) {
            const opts = getThemeOptions(selectedTheme);
            if (opts) {
                setEditorText(JSON.stringify(opts, null, 2));
                setEditorError(null);
            }
        }
    }, [selectedTheme, editorOpen]);

    const parseEditorJson = () => {
        try {
            const parsed = JSON.parse(editorText);
            createTheme(parsed);
            setEditorError(null);
            return parsed;
        } catch (e) {
            setEditorError(e.message || String(e));
            return null;
        }
    };

    const handleApplyLive = () => {
        const parsed = parseEditorJson();
        if (parsed) setMuiTheme(createTheme(parsed));
    };

    const handleSaveCustom = () => {
        const parsed = parseEditorJson();
        if (!parsed) return;
        const name = saveName.trim() || `custom-${Date.now()}`;
        saveCustomTheme(name, parsed);
        refreshThemes();
        setSelectedTheme(name);
        saveLastTheme(name);
    };

    const handleDeleteSelected = () => {
        if (listCustomThemeNames().includes(selectedTheme)) {
            deleteCustomTheme(selectedTheme);
            refreshThemes();
            const fallback = "slate";
            setSelectedTheme(fallback);
            saveLastTheme(fallback);
        }
    };

    const handleResetCustomAll = () => {
        resetCustomThemes();
        refreshThemes();
        const fallback = "slate";
        setSelectedTheme(fallback);
        saveLastTheme(fallback);
    };

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
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Container maxWidth="xl" sx={{ py: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="h5">React Property Grid — Playground</Typography>
                    <Stack direction="row" spacing={1}>
                        {/* New: Theme selector */}
                        <FormControl size="small" sx={{ minWidth: 180 }} variant={"outlined"}>
                            <InputLabel>Theme</InputLabel>
                            <Select
                                value={selectedTheme}
                                label="Theme"
                                onChange={(e) => handleSelectTheme(e.target.value)}
                                variant={"outlined"}
                            >
                                {Object.keys(themesMap).map((name) => (
                                    <MenuItem key={name} value={name}>
                                        {formatThemeName(name)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* New: Customize Theme button */}
                        <Button
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
                        <Button variant="outlined" onClick={() => setGlobalDisabled((d) => !d)}>
                            {globalDisabled ? 'Enable Editing' : 'Disable All'}
                        </Button>
                        <Button variant="outlined" onClick={resetSchema}>Reset Schema</Button>
                        <Button variant="contained" onClick={applyEditedSchema}>Apply Schema</Button>
                    </Stack>
                </Stack>
                <Collapse in={editorOpen} unmountOnExit>
                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            ThemeOptions JSON
                        </Typography>
                        <TextField
                            multiline
                            minRows={14}
                            value={editorText}
                            onChange={(e) => setEditorText(e.target.value)}
                            fullWidth
                            placeholder='{ "palette": { ... }, "typography": { ... } }'
                            InputProps={{
                                sx: { fontFamily: "monospace", fontSize: 12 },
                            }}
                        />
                        {editorError && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                                {editorError}
                            </Alert>
                        )}
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Button
                                startIcon={<PlayArrowIcon />}
                                variant="contained"
                                onClick={handleApplyLive}
                            >
                                Apply Live
                            </Button>
                            <TextField
                                size="small"
                                label="Save as name"
                                value={saveName}
                                onChange={(e) => setSaveName(e.target.value)}
                                sx={{ width: 180 }}
                            />
                            <Button
                                startIcon={<SaveIcon />}
                                variant="outlined"
                                onClick={handleSaveCustom}
                            >
                                Save
                            </Button>
                            <Button
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteSelected}
                            >
                                Delete
                            </Button>
                            <Button
                                color="warning"
                                startIcon={<RestartAltIcon />}
                                onClick={handleResetCustomAll}
                            >
                                Reset Custom
                            </Button>
                        </Stack>
                    </Paper>
                </Collapse>

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
