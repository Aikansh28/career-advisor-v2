const fs = require('fs');

const htmlContent = fs.readFileSync('.stitch/designs/LandingPage-Stitch.html', 'utf8');
const tailwindContent = fs.readFileSync('frontend/tailwind.config.ts', 'utf8');

// match the entire colors object in the HTML script tag
const colorsMatch = htmlContent.match(/colors:\s*\{([^}]*)\}/);
if (colorsMatch) {
    const stitchColors = colorsMatch[1].trim();
    
    // now we replace the colors inside tailwind.config.ts.
    // tailwind.config.ts has a colors: { ... } where the first part is existing stuff, e.g. "border:"
    // let's just prepend the stitch colors into the colors object
    const newTailwind = tailwindContent.replace(/colors:\s*\{/, 'colors: {\n' + stitchColors + ',');
    fs.writeFileSync('frontend/tailwind.config.ts', newTailwind);
    console.log("Tailwind updated successfully.");
} else {
    console.error("Could not find colors in HTML");
}
