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

// Back-compat: prefer renderValue/parseValue, fall back to transformIn/transformOut
const getRenderFn = (field) => field.renderValue || field.transformIn;
const getParseFn = (field) => field.parseValue || field.transformOut;

const getFieldValue = (field, object, key) => {
    const raw = field.get ? field.get(object) : object?.[key];
    const render = getRenderFn(field);
    return render ? render(raw, object) : raw;
};

const setFieldValue = (field, object, key, uiValue) => {
    const parse = getParseFn(field);
    const out = parse ? parse(uiValue, object) : uiValue;
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

    // Helpers for compact numeric inputs (allow empty string while editing)
    const numberInputProps = { style: { fontSize: '0.8rem', padding: '2px 6px' } };
    const toMaybeNumber = (v) => (v === '' ? '' : Number(v));

    const control = (() => {
        // NOTE: 'range' defaults to 'valueRange' (two text boxes)
        let type = field.type;
        if (type === 'range') type = 'valueRange';

        switch (type) {
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
                        onChange={(e) => commit(toMaybeNumber(e.target.value))}
                        disabled={disabled}
                        error={!!error}
                        helperText={error}
                        inputProps={numberInputProps}
                    />
                );

            case 'string':
                return (
                    <TextField
                        size="small"
                        fullWidth
                        value={value ?? ''}
                        onChange={(e) => commit(e.target.value)}
                        disabled={disabled}
                        error={!!error}
                        helperText={error}
                        inputProps={numberInputProps}
                    />
                );

            case 'single-select':
            case 'multi-select': {
                const multiple = type === 'multi-select';
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
                            sx={{ fontSize: '0.8rem', '& .MuiSelect-select': { py: 0.5, px: 1 } }}
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

            // Two compact inputs: [min, max]
            case 'valueRange': {
                const minDefault = field.min ?? 0;
                const maxDefault = field.max ?? 100;
                const pair = Array.isArray(value)
                    ? value
                    : typeof value === 'object' && value !== null && 'min' in value && 'max' in value
                        ? [value.min, value.max]
                        : [minDefault, maxDefault];

                const [minVal, maxVal] = pair;
                const commitAt = (idx, newVal) => {
                    const next = [...pair];
                    next[idx] = newVal === '' ? '' : Number(newVal);
                    commit(next);
                };

                return (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr', gap: 0.5, alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', pr: 0.5 }}>Min:</Typography>
                        <TextField
                            type="number"
                            size="small"
                            value={minVal ?? ''}
                            onChange={(e) => commitAt(0, e.target.value)}
                            disabled={disabled}
                            inputProps={{ style: { fontSize: '0.8rem', padding: '2px 6px' } }}
                        />
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', pl: 0.5, pr: 0.5 }}>Max:</Typography>
                        <TextField
                            type="number"
                            size="small"
                            value={maxVal ?? ''}
                            onChange={(e) => commitAt(1, e.target.value)}
                            disabled={disabled}
                            inputProps={{ style: { fontSize: '0.8rem', padding: '2px 6px' } }}
                        />
                        {error && (
                            <FormHelperText error sx={{ gridColumn: '1 / -1', mt: 0 }}>
                                {error}
                            </FormHelperText>
                        )}
                    </Box>
                );
            }

            // Dual-thumb slider: [min, max]
            case 'sliderRange': {
                const minDefault = field.min ?? 0;
                const maxDefault = field.max ?? 100;
                const step = field.step ?? 1;

                const rangeVal = Array.isArray(value) && value.length === 2
                    ? value
                    : [minDefault, maxDefault];

                return (
                    <Slider
                        size="small"
                        min={minDefault}
                        max={maxDefault}
                        step={step}
                        value={rangeVal}
                        onChange={(_, v) => commit(v)}
                        disabled={disabled}
                    />
                );
            }

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
