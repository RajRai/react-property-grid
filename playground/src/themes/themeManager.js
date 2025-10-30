// themeManager.js
import { createTheme } from "@mui/material/styles";
import { THEME_OPTIONS } from "./themes";

// Build MUI theme objects from raw configs
export const BUILTIN_THEMES = Object.fromEntries(
    Object.entries(THEME_OPTIONS).map(([name, opts]) => [name, createTheme(opts)])
);

// === Core helpers ===
const STORAGE_KEY = "customThemes";
const LAST_KEY = "lastTheme";

/**
 * Load all themes: built-in + custom (from localStorage)
 * @returns {Record<string, Theme>}
 */
export const loadThemes = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...BUILTIN_THEMES };

    try {
        const parsed = JSON.parse(stored);
        const rebuilt = Object.fromEntries(
            Object.entries(parsed).map(([name, config]) => [name, createTheme(config)])
        );
        return { ...BUILTIN_THEMES, ...rebuilt };
    } catch (err) {
        console.warn("⚠️ Failed to parse custom themes:", err);
        return { ...BUILTIN_THEMES };
    }
};

/**
 * Save a new or updated custom theme (raw JSON ThemeOptions)
 */
export const saveCustomTheme = (name, config) => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    all[name] = config;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
};

/**
 * Delete a custom theme by name
 */
export const deleteCustomTheme = (name) => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    delete all[name];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
};

/**
 * Reset all custom themes
 */
export const resetCustomThemes = () => {
    localStorage.removeItem(STORAGE_KEY);
};

/**
 * Return list of custom theme names
 */
export const listCustomThemeNames = () => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return Object.keys(all);
};

/**
 * Get the raw ThemeOptions for a given theme name (built-in or custom)
 */
export const getThemeOptions = (name) => {
    if (THEME_OPTIONS[name]) return THEME_OPTIONS[name];
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return all[name] || null;
};

/**
 * Load and save last selected theme
 */
export const loadLastTheme = () =>
    localStorage.getItem(LAST_KEY) || "slate";
export const saveLastTheme = (name) =>
    localStorage.setItem(LAST_KEY, name);

// themeManager.js
export const formatThemeName = (name) =>
    name.charAt(0).toUpperCase() + name.slice(1);
