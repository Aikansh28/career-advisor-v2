const fs = require('fs');

const tailwindPath = 'frontend/tailwind.config.ts';
let code = fs.readFileSync(tailwindPath, 'utf8');

const colors = `
        "tertiary-fixed-dim": "#cdbdff",
        "primary-container": "#0a192f",
        "on-surface-variant": "#c5c6cd",
        "on-primary-fixed-variant": "#39475f",
        "surface-container-lowest": "#070d1f",
        "surface-container-low": "#151b2d",
        "surface-container-high": "#23293c",
        "surface-container": "#191f31",
        "inverse-surface": "#dce1fb",
        "surface-tint": "#b9c7e4",
        "surface-variant": "#2e3447",
        "tertiary-container": "#1d0058",
        "inverse-on-surface": "#2a3043",
        "primary-fixed": "#d6e3ff",
        "secondary-fixed": "#5ffbd6",
        "surface-container-highest": "#2e3447",
        "tertiary-fixed": "#e8deff",
        "on-error": "#690005",
        "on-tertiary-container": "#8b66ff",
        "on-secondary-fixed": "#002019",
        "on-tertiary": "#370096",
        "on-primary-fixed": "#0d1c32",
        "surface-bright": "#33394c",
        "on-background": "#dce1fb",
        "error": "#ffb4ab",
        "surface": "#0c1324",
        "inverse-primary": "#515f78",
        "surface-dim": "#0c1324",
        "on-tertiary-fixed-variant": "#4f00d0",
        "outline": "#8f9097",
        "on-secondary-fixed-variant": "#005142",
        "outline-variant": "#44474d",
        "secondary-container": "#00c7a5",
        "primary-fixed-dim": "#b9c7e4",
        "on-secondary": "#00382d",
        "on-primary-container": "#74829d",
        "error-container": "#93000a",
        "on-primary": "#233148",
        "secondary-fixed-dim": "#38debb",
        "on-surface": "#dce1fb",
        "on-tertiary-fixed": "#20005f",
        "tertiary": "#cdbdff",
        "background": "#0c1324",
        "on-secondary-container": "#004d3f",
        "on-error-container": "#ffdad6",`;

code = code.replace(/colors: {/, 'colors: {\n' + colors);
fs.writeFileSync(tailwindPath, code);
