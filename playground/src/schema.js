// schema.js — exports the playground schema and helpers
import { useMemo, useState } from "react";

export const defaultSceneData = {
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
};

export function usePlaygroundSchema() {
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
                    type: 'select',
                    label: 'Resolution',
                    options: ['720p', '1080p', '4K'],
                    // example of transforming a value before display/storage
                    get: (o) => ['720p', '1080p', '4K'][o.resolutionIndex] ?? '',
                    set: (o, v) => { o.resolutionIndex = ['720p', '1080p', '4K'].indexOf(v); },
                },
                quality: {
                    type: 'select',
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
                            type: 'select',
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
      name: {
        type: 'string',
        label: 'Name',
        validate: (v) => (!v ? 'Required' : null),
      },
      resolution: {
        type: 'select',
        label: 'Resolution',
        options: ['720p', '1080p', '4K'],
        // example of transforming a value before display/storage
        get: (o) => ['720p', '1080p', '4K'][o.resolutionIndex] ?? '',
        set: (o, v) => { o.resolutionIndex = ['720p', '1080p', '4K'].indexOf(v); },
      },
      quality: {
        type: 'select',
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
      width: {
        type: 'number',
        label: 'Width',
        validate: (v) => (v < 320 ? 'Too small' : null),
      },
      height: {
        type: 'number',
        label: 'Height',
        validate: (v) => (v < 200 ? 'Too small' : null),
      },
    },
  },

  {
    section: 'Camera',
    fields: {
      fovRange: {
        type: 'range',
        label: 'FOV Range (deg)',
        min: 1,
        max: 170,
        get: (o) => o.camera.fovRange,
        set: (o, v) => { o.camera.fovRange = v; },
        validate: ([min, max]) => (min > max ? 'Min must be ≤ Max' : null),
      },
      lodRange: {
        type: 'rangeSlider',
        label: 'LOD Range',
        min: 0,
        max: 5,
        step: 1,
        get: (o) => o.camera.lodRange,
        set: (o, v) => { o.camera.lodRange = v; },
      },
      isoRange: {
        type: 'range',
        label: 'ISO Range',
        min: 50,
        max: 12800,
        step: 50,
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
            min: 12,
            max: 200,
            step: 1,
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
        min: 0,
        max: 1,
        step: 0.01,
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
            type: 'select',
            label: 'Operator',
            options: ['ACES', 'Reinhard', 'Filmic'],
            get: (o) => o.render.tone.op,
            set: (o, v) => { o.render.tone.op = v; },
          },
          exposureComp: {
            type: 'numberSlider',
            label: 'Exposure Comp (EV)',
            min: -5,
            max: 5,
            step: 0.1,
            get: (o) => o.render.tone.exposureComp,
            set: (o, v) => { o.render.tone.exposureComp = v; },
          },
          shoulder: {
            type: 'rangeSlider',
            label: 'Shoulder',
            min: 0,
            max: 1,
            step: 0.01,
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
                min: 0,
                max: 1,
                step: 0.01,
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
])`, []);

    const [schema, setSchema] = useState(builtinSchema);
    const [schemaEditor, setSchemaEditor] = useState(initialEditor);
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

    return {
        schema,
        schemaEditor,
        setSchemaEditor,
        schemaError,
        applyEditedSchema,
        resetSchema,
    };
}
