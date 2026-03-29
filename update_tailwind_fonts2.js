const fs = require('fs');

let tailwindContent = fs.readFileSync('frontend/tailwind.config.ts', 'utf8');

// The file currently has:
//      fontFamily: {
//        headline: ["Plus Jakarta Sans", "sans-serif"],
//        body: ["Be Vietnam Pro", "sans-serif"],
//        label: ["Be Vietnam Pro", "sans-serif"],
//      },
// We will replace it with Inter and Plus Jakarta Sans.
tailwindContent = tailwindContent.replace(
    /fontFamily:\s*\{\s*headline:\s*\["Plus Jakarta Sans", "sans-serif"\],\s*body:\s*\["Be Vietnam Pro", "sans-serif"\],\s*label:\s*\["Be Vietnam Pro", "sans-serif"\],\s*\}/,
      `fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      }`
);

fs.writeFileSync('frontend/tailwind.config.ts', tailwindContent);
console.log("Updated tailwind fonts.");
