// PropertyGrid.jsx — Unreal-style grid view with collapsible sections
import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Chip,
    Collapse,
    FormControl,
    FormControlLabel,
    FormHelperText,
    MenuItem,
    Select,
    Slider,
    Switch,
    TextField,
    Typography,
    IconButton,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// ---------- helpers ----------
const isOptionObject = (opt) => typeof opt === 'object' && opt !== null && 'value' in opt;
const toOptionList = (options = []) =>
    options.map((o) => (isOptionObject(o) ? o : { value: o, label: String(o) }));

const getFieldValue = (field, object, key) => {
    const raw = field.get ? field.get(object) : object?.[key];
    return field.transformIn ? field.transformIn(raw, object) : raw;
};
const setFieldValue = (field, object, key, uiValue) => {
    const out = field.transformOut ? field.transformOut(uiValue, object) : uiValue;
    if (field.set) field.set(object, out);
    else object[key] = out;
    return out;
};
const runValidate = (field, val, object) =>
    typeof field.validate === 'function' ? field.validate(val, object) || null : null;

// ---------- Field ----------
function PropertyField({ fieldKey, field, value, object, onChange, disabled }) {
    const [error, setError] = React.useState(null);

    const commit = (val) => {
        const out = setFieldValue(field, object, fieldKey, val);
        const err = runValidate(field, out, object);
        setError(err);
        onChange?.({ ...object });
    };

    const labelCell = (
        <Typography
            sx={{
                fontSize: '0.8rem',
                color: disabled ? 'text.disabled' : 'text.secondary',
                pr: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}
            title={field.label}
        >
            {field.label}
        </Typography>
    );

    const control = (() => {
        switch (field.type) {
            case 'boolean':
                return (
                    <FormControlLabel
                        sx={{ m: 0 }}
                        control={
                            <Switch
                                size="small"
                                checked={!!value}
                                disabled={disabled}
                                onChange={(e) => commit(e.target.checked)}
                            />
                        }
                        label=""
                    />
                );

            case 'number':
                return (
                    <TextField
                        type="number"
                        size="small"
                        fullWidth
                        value={value ?? ''}
                        onChange={(e) => {
                            const v = e.target.value;
                            // permit empty string for easy clearing; validate/commit number otherwise
                            commit(v === '' ? '' : Number(v));
                        }}
                        disabled={disabled}
                        error={!!error}
                        helperText={error}
                        inputProps={{ style: { fontSize: '0.8rem', padding: '2px 6px' } }}
                    />
                );

            case 'string':
                return <TextField
                    size="small"
                    fullWidth
                    value={value ?? ''}
                    onChange={(e) => commit(e.target.value)}
                    disabled={disabled}
                    error={!!error}
                    helperText={error}
                    inputProps={{ style: { fontSize: '0.8rem', padding: '2px 6px' } }}
                />;

            case 'single-select':
            case 'multi-select': {
                const multiple = field.type === 'multi-select';
                const opts = toOptionList(field.options || []);
                const val = value ?? (multiple ? [] : '');
                return (
                    <FormControl fullWidth size="small" disabled={disabled} error={!!error}>
                        <Select
                            multiple={multiple}
                            value={val}
                            onChange={(e) => commit(e.target.value)}
                            renderValue={
                                multiple
                                    ? (selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {(selected || []).map((v) => {
                                                const found = opts.find((o) => o.value === v) || { label: String(v) };
                                                return <Chip key={String(v)} label={found.label} size="small" />;
                                            })}
                                        </Box>
                                    )
                                    : undefined
                            }
                            sx={{
                                fontSize: '0.8rem',
                                '& .MuiSelect-select': { py: 0.5, px: 1 },
                            }}
                        >
                            {opts.map((opt) => (
                                <MenuItem key={String(opt.value)} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {error && <FormHelperText>{error}</FormHelperText>}
                    </FormControl>
                );
            }

            case 'range':
                return (
                    <Slider
                        size="small"
                        min={field.min ?? 0}
                        max={field.max ?? 100}
                        step={field.step ?? 1}
                        value={typeof value === 'number' ? value : (field.min ?? 0)}
                        onChange={(_, v) => commit(v)}
                        disabled={disabled}
                    />
                );

            default:
                return <Typography color="text.disabled">Unsupported</Typography>;
        }
    })();

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '40% 60%',
                px: 1,
                py: 0.5,
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                '&:nth-of-type(even)': {
                    bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                },
            }}
        >
            {labelCell}
            {control}
        </Box>
    );
}

PropertyField.propTypes = {
    fieldKey: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    value: PropTypes.any,
    object: PropTypes.object,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
};

// ---------- Section ----------
function PropertySection({ section, object, onChange, disabled, depth = 0 }) {
    const isDisabled = !!(disabled || section.disabled);
    const [open, setOpen] = React.useState(!section.collapsed);

    const toggle = () => setOpen((o) => !o);

    return (
        <Box
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <Box
                onClick={toggle}
                role="button"
                aria-expanded={open}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggle();
                    }
                }}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 0.5,
                    py: 0.25,
                    cursor: 'pointer',
                    bgcolor: 'action.hover',
                    userSelect: 'none',
                }}
            >
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggle();
                    }}
                    sx={{
                        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 120ms',
                        mr: 0.5,
                    }}
                    aria-label={open ? 'Collapse section' : 'Expand section'}
                >
                    <KeyboardArrowRightIcon fontSize="small" />
                </IconButton>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 600,
                        color: isDisabled ? 'text.disabled' : 'text.primary',
                        fontSize: '0.85rem',
                    }}
                >
                    {section.section}
                </Typography>
            </Box>

            {/* Body */}
            <Collapse in={open} unmountOnExit>
                <Box>
                    {Object.entries(section.fields || {}).map(([key, field]) => (
                        <PropertyField
                            key={key}
                            fieldKey={key}
                            field={field}
                            value={getFieldValue(field, object, key)}
                            object={object}
                            onChange={onChange}
                            disabled={isDisabled || field.disabled}
                        />
                    ))}

                    {(section.children || []).map((child, i) => (
                        <Box key={`${child.section ?? 'section'}-${i}`} sx={{ p: 0.5 }}>
                            <PropertySection
                                section={child}
                                object={object}
                                onChange={onChange}
                                disabled={isDisabled}
                                depth={depth + 1}
                            />
                        </Box>
                    ))}
                </Box>
            </Collapse>
        </Box>
    );
}

PropertySection.propTypes = {
    section: PropTypes.object.isRequired,
    object: PropTypes.object,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    depth: PropTypes.number,
};

// ---------- Root ----------
export default function PropertyGrid({ schema, object, onChange, disabled = false }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <PropertySection
                section={schema}
                object={object}
                onChange={onChange}
                disabled={disabled}
                depth={0}
            />
        </Box>
    );
}

PropertyGrid.propTypes = {
    schema: PropTypes.object.isRequired,
    object: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
};
