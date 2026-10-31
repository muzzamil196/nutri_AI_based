const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('script.js', 'utf8');
const iconsFile = fs.readFileSync('icons.js', 'utf8');

const htmlLines = html.split('\n');

// 1. Audit all icons
const iconRegex = /data-lucide=["']([^"']+)["']/g;
const iconOccurrences = [];
for (let i = 0; i < htmlLines.length; i++) {
  let m;
  while ((m = iconRegex.exec(htmlLines[i])) !== null) {
    iconOccurrences.push({ line: i + 1, icon: m[1], snippet: htmlLines[i].trim() });
  }
}

// Check against icons.js
const defRegex = /'([a-z0-9-]+)':\s*'<[^']+'/g;
const definedIcons = new Set();
let m;
while ((m = defRegex.exec(iconsFile)) !== null) {
  definedIcons.add(m[1]);
}

const missingIcons = iconOccurrences.filter(item => !definedIcons.has(item.icon));
console.log('=== MISSING ICONS IN ICONS.JS ===');
missingIcons.forEach(item => {
  console.log(`Line ${item.line}: Icon "${item.icon}" | Snippet: ${item.snippet}`);
});

// 2. Audit all buttons
console.log('\n=== ALL BUTTONS AUDIT ===');
const btnLineRegex = /<button\s+([^>]+)>/g;
const allButtons = [];
for (let i = 0; i < htmlLines.length; i++) {
  let bm;
  while ((bm = btnLineRegex.exec(htmlLines[i])) !== null) {
    const rawAttrs = bm[1];
    const idM = /id=["']([^"']+)["']/.exec(rawAttrs);
    const classM = /class=["']([^"']+)["']/.exec(rawAttrs);
    const typeM = /type=["']([^"']+)["']/.exec(rawAttrs);
    allButtons.push({
      line: i + 1,
      id: idM ? idM[1] : null,
      class: classM ? classM[1] : null,
      type: typeM ? typeM[1] : null,
      raw: bm[0],
      lineContent: htmlLines[i].trim()
    });
  }
}

console.log(`Total buttons found: ${allButtons.length}`);
allButtons.forEach(b => {
  const idStr = b.id ? `id="${b.id}"` : '(no id)';
  const classStr = b.class ? `class="${b.class}"` : '(no class)';
  const typeStr = b.type ? `type="${b.type}"` : '(default submit/button)';
  
  // Check if handled in script.js
  let handled = false;
  if (b.id && (script.includes(b.id))) handled = true;
  if (b.class) {
    b.class.split(/\s+/).forEach(c => {
      if (script.includes(c) || script.includes('.' + c)) handled = true;
    });
  }
  if (b.type === 'submit') handled = true; // Handled by form submit

  if (!handled) {
    console.log(`[UNHANDLED BUTTON] Line ${b.line}: ${idStr} ${classStr} ${typeStr} -> ${b.lineContent}`);
  }
});
