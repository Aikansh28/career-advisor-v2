const fs = require('fs');

let tailwindContent = fs.readFileSync('frontend/tailwind.config.ts', 'utf8');

// I will insert fontFamily after colors
const fonts = `
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Be Vietnam Pro", "sans-serif"],
        label: ["Be Vietnam Pro", "sans-serif"],
      },`;

tailwindContent = tailwindContent.replace(/extend:\s*\{/, 'extend: {' + fonts);
fs.writeFileSync('frontend/tailwind.config.ts', tailwindContent);
