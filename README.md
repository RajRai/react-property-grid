# React Property Grid (MUI)

Unreal-style, condensed property grid for React + MUI.

- Hierarchical, **collapsible** sections
- Field types: `string`, `number`, `boolean`, `single-select`, `multi-select`, `valueRange`, `sliderRange`  
  (`range` is an alias of `valueRange`)
- Per-field / per-section / global **disabled**
- Validation + value mapping with `renderValue` / `parseValue` (backwards-compatible with `transformIn` / `transformOut`)
- Optional `get` / `set` for custom bindings

**Demo:** [GitHub Pages](https://\<your-username\>.github.io/\<repo\>/)  
**Playground source:** [`playground/`](./playground/)

## Install
```bash
npm i @rajrai/react-property-grid
