// Raw, JSON-serializable ThemeOptions for each built-in theme
export const THEME_OPTIONS = {
    // 🌤 Default Light
    light: {
        palette: {
            mode: "light",
            primary: { main: "#1976d2" },
            secondary: { main: "#f50057" },
            background: { default: "#fafafa", paper: "#ffffff" },
            text: { primary: "#111", secondary: "#333" },
        },
        typography: {
            fontFamily: [
                "Inter",
                "-apple-system",
                "BlinkMacSystemFont",
                "Segoe UI",
                "Roboto",
                "Helvetica",
                "Arial",
                "sans-serif",
            ].join(","),
            h5: { fontWeight: 600 },
            subtitle2: { letterSpacing: 0.2 },
        },
        shape: { borderRadius: 10 },
        spacing: 8,
        components: {
            MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
            MuiButton: { defaultProps: { variant: "contained" } },
        },
    },

    // 🌑 Default Dark
    dark: {
        palette: {
            mode: "dark",
            primary: { main: "#90caf9" },
            secondary: { main: "#f48fb1" },
            background: { default: "#121212", paper: "#1e1e1e" },
        },
        typography: {
            fontFamily: [
                "Inter",
                "-apple-system",
                "BlinkMacSystemFont",
                "Segoe UI",
                "Roboto",
                "Helvetica",
                "Arial",
                "sans-serif",
            ].join(","),
            h5: { fontWeight: 600 },
        },
        shape: { borderRadius: 12 },
        shadows: Array(25).fill("none"),
        components: {
            MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
        },
    },

    // 💼 Professional – Bloomberg-style greys + teal accents
    slate: {
        palette: {
            mode: "dark",
            primary: { main: "#26a69a" },
            secondary: { main: "#ffca28" },
            background: { default: "#1b1e24", paper: "#23272f" },
            text: { primary: "#e0e0e0", secondary: "#9e9e9e" },
            divider: "#2c313a",
        },
        typography: {
            fontFamily: [
                "Inter",
                "SF Pro Text",
                "Segoe UI",
                "Roboto",
                "Helvetica",
                "Arial",
                "sans-serif",
            ].join(","),
            button: { textTransform: "none", fontWeight: 600 },
            subtitle2: { fontWeight: 600 },
        },
        shape: { borderRadius: 12 },
        spacing: 8,
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: "none", border: "1px solid #2c313a" },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: { borderRadius: 12 },
                },
            },
            MuiSlider: {
                styleOverrides: {
                    thumb: { boxShadow: "none" },
                },
            },
        },
    },

    // 🌇 Sunset — Warm oranges + deep purple tones
    sunset: {
        palette: {
            mode: "dark",
            primary: { main: "#ff7043" },
            secondary: { main: "#ba68c8" },
            background: { default: "#2b1d29", paper: "#3a2738" },
            text: { primary: "#fff3e0", secondary: "#ffe0b2" },
        },
        typography: {
            fontFamily: "Georgia, serif",
            h5: { fontWeight: 700 },
            button: { textTransform: "uppercase", fontWeight: 700 },
        },
        shape: { borderRadius: 6 },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 6,
                        letterSpacing: 1,
                        textTransform: "none",
                    },
                    contained: {
                        backgroundImage: "linear-gradient(45deg,#ff7043,#ffca28)",
                        color: "#000",
                        "&:hover": {
                            backgroundImage: "linear-gradient(45deg,#ff8a65,#ffd54f)",
                            color: "#000",
                        },
                    },
                    outlined: {
                        borderColor: "#ffb74d",
                        color: "#ffb74d",
                        background: "transparent",
                        "&:hover": {
                            borderColor: "#ffd54f",
                            color: "#ffd54f",
                            background: "rgba(255, 183, 77, 0.08)",
                        },
                    },
                },
            },
        },
    },

    // 🌿 Emerald – nature-inspired calm greens
    emerald: {
        palette: {
            mode: "light",
            primary: { main: "#2e7d32" },
            secondary: { main: "#81c784" },
            background: { default: "#f1f8e9", paper: "#ffffff" },
            text: { primary: "#1b5e20", secondary: "#33691e" },
        },
        typography: {
            fontFamily: "'Nunito', sans-serif",
            h5: { fontWeight: 600 },
        },
        shape: { borderRadius: 16 },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: { border: "1px solid #c5e1a5" },
                },
            },
        },
    },

    // 🧊 Arctic – cool blues + glassy look
    arctic: {
        palette: {
            mode: "light",
            primary: { main: "#0288d1" },
            secondary: { main: "#26c6da" },
            background: { default: "#e1f5fe", paper: "#ffffffd9" },
            text: { primary: "#01579b", secondary: "#0277bd" },
        },
        shape: { borderRadius: 20 },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backdropFilter: "blur(8px)",
                        backgroundImage:
                            "linear-gradient(145deg, #e1f5fecc, #ffffffcc)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 20,
                        textTransform: "none",
                        fontWeight: 600,
                    },
                },
            },
        },
    },

    // 🌸 Sakura – pastel pink & white, elegant typography
    sakura: {
        palette: {
            mode: "light",
            primary: { main: "#ec407a" },
            secondary: { main: "#f48fb1" },
            background: { default: "#fff0f5", paper: "#ffffff" },
            text: { primary: "#4a148c", secondary: "#6a1b9a" },
        },
        typography: {
            fontFamily: "'Playfair Display', serif",
            h5: { fontWeight: 700, fontStyle: "italic" },
        },
        shape: { borderRadius: 14 },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        border: "1px solid #f8bbd0",
                    },
                },
            },
        },
    },

    // ⚙️ Terminal – hacker aesthetic green on black
    terminal: {
        palette: {
            mode: "dark",
            primary: { main: "#00ff00" },
            secondary: { main: "#00bfa5" },
            background: { default: "#000000", paper: "#0a0a0a" },
            text: { primary: "#00ff00", secondary: "#00cc99" },
        },
        typography: {
            fontFamily: "'Source Code Pro', monospace",
            h5: { fontWeight: 600 },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 0,
                        fontFamily: "'Source Code Pro', monospace",
                        border: "1px solid #00ff00",
                    },
                },
            },
        },
    },

    // ☀️ Solarized – classic dev palette
    solarized: {
        palette: {
            mode: "light",
            primary: { main: "#268bd2" },
            secondary: { main: "#2aa198" },
            background: { default: "#fdf6e3", paper: "#eee8d5" },
            text: { primary: "#657b83", secondary: "#586e75" },
        },
        typography: {
            fontFamily: "'JetBrains Mono', monospace",
            h5: { fontWeight: 500 },
        },
        components: {
            MuiPaper: {
                styleOverrides: { root: { borderRadius: 4 } },
            },
        },
    },
};
