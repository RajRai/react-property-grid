# React Property Grid (MUI)

Unreal-style, condensed property grid for React + MUI.
- Hierarchical, collapsible sections
- Types: string, number, boolean, single/multi-select, range
- Per-field/section/global disabled
- validate, transformIn/transformOut, or get/set bindings

Install:
```
npm i @rajrai/react-property-grid
```

Usage:
```
import { PropertyGrid } from "@rajrai/react-property-grid";
<PropertyGrid schema={schema} object={obj} onChange={setObj} />;
```