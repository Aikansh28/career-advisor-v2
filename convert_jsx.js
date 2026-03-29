const fs = require('fs');

const rawHtml = fs.readFileSync('.stitch/designs/LandingPage-Stitch.html', 'utf8');

// extract body content
const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) {
  console.log("No body found");
  process.exit(1);
}

let jsxStr = bodyMatch[1];

// Convert class=" to className="
jsxStr = jsxStr.replace(/class="/g, 'className="');
// Convert for=" to htmlFor="
jsxStr = jsxStr.replace(/for="/g, 'htmlFor="');
// Convert tabindex to tabIndex
jsxStr = jsxStr.replace(/tabindex="/g, 'tabIndex="');
// Convert stroke-width to strokeWidth
jsxStr = jsxStr.replace(/stroke-width/g, 'strokeWidth');
// Convert stroke-dasharray to strokeDasharray
jsxStr = jsxStr.replace(/stroke-dasharray/g, 'strokeDasharray');
// Convert stroke-dashoffset to strokeDashoffset
jsxStr = jsxStr.replace(/stroke-dashoffset/g, 'strokeDashoffset');
// Convert viewBox to viewBox
jsxStr = jsxStr.replace(/viewbox/g, 'viewBox');
// Convert style="font-variation-settings: 'FILL' 1;" to style={{ fontVariationSettings: "'FILL' 1" }}
jsxStr = jsxStr.replace(/style="([^"]+)"/g, (match, styleString) => {
    const styleObj = {};
    styleString.split(';').forEach(rule => {
        if (!rule.trim()) return;
        const [key, value] = rule.split(':').map(s => s.trim());
        if (!key || !value) return;
        const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        styleObj[camelKey] = value;
    });
    return `style={${JSON.stringify(styleObj)}}`;
});

// Self close void tags: img, input, br, hr, area, base, col, embed, link, meta, param, source, track, wbr
const voidElements = ['img', 'input', 'br', 'hr', 'area', 'base', 'col', 'embed', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'circle'];
voidElements.forEach(tag => {
    // Regex to match unclosed void tags, careful with existing />
    const regex = new RegExp(`<${tag}\\b([^>]*?)(?<!/)>`, 'gi');
    jsxStr = jsxStr.replace(regex, `<${tag}$1 />`);
});

// Replace HTML comments
jsxStr = jsxStr.replace(/<!--[\s\S]*?-->/g, match => `{/* ${match.replace(/<!--|-->/g, '').trim()} */}`);

fs.writeFileSync('.stitch/designs/LandingPage-JSX.tsx', jsxStr);
console.log("JSX conversion complete!");
