const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('script.js', 'utf8');
const recipes = fs.readFileSync('recipes-data.js', 'utf8');
const iconsFile = fs.readFileSync('icons.js', 'utf8');

// Find all data-lucide references
const lucideRegex = /data-lucide=["']([^"']+)["']/g;
const referencedIcons = new Set();
let match;
while ((match = lucideRegex.exec(html)) !== null) {
  referencedIcons.add(match[1]);
}
while ((match = lucideRegex.exec(script)) !== null) {
  referencedIcons.add(match[1]);
}
while ((match = lucideRegex.exec(recipes)) !== null) {
  referencedIcons.add(match[1]);
}

// Find all icons defined in icons.js
const definedIcons = new Set();
const defRegex = /'([a-z0-9-]+)':\s*'<[^']+'/g;
while ((match = defRegex.exec(iconsFile)) !== null) {
  definedIcons.add(match[1]);
}

console.log('--- ICON AUDIT ---');
console.log('Total icons referenced:', referencedIcons.size);
console.log('Referenced icons:', Array.from(referencedIcons).sort());

const missingIcons = [];
for (const icon of referencedIcons) {
  if (!definedIcons.has(icon)) {
    missingIcons.push(icon);
  }
}
console.log('MISSING ICONS in icons.js:', missingIcons);

// Find all buttons and links in HTML
console.log('\n--- BUTTON & LINK AUDIT ---');
// Match <button ... id="..." class="..."
const btnRegex = /<button\s+([^>]+)>/g;
const buttons = [];
while ((match = btnRegex.exec(html)) !== null) {
  const attrs = match[1];
  const idMatch = /id=["']([^"']+)["']/.exec(attrs);
  const classMatch = /class=["']([^"']+)["']/.exec(attrs);
  const typeMatch = /type=["']([^"']+)["']/.exec(attrs);
  buttons.push({
    raw: match[0],
    id: idMatch ? idMatch[1] : null,
    class: classMatch ? classMatch[1] : null,
    type: typeMatch ? typeMatch[1] : null
  });
}
console.log('Total <button> elements in HTML:', buttons.length);

// Check which buttons with IDs or classes have event listeners or actions in script.js
const unhandledButtons = [];
for (const b of buttons) {
  if (b.type === 'submit') continue; // Handled by form submit
  let handled = false;
  if (b.id && script.includes(b.id)) {
    handled = true;
  }
  if (b.class) {
    const classes = b.class.split(/\s+/);
    for (const c of classes) {
      if (script.includes(c) || script.includes('.' + c)) {
        handled = true;
        break;
      }
    }
  }
  if (!handled) {
    unhandledButtons.push(b);
  }
}
console.log('POTENTIALLY UNHANDLED BUTTONS:', unhandledButtons);

// Check all <a href="#..."> links
const linkRegex = /<a\s+[^>]*href=["']#([^"']+)["'][^>]*>/g;
const pageLinks = new Set();
while ((match = linkRegex.exec(html)) !== null) {
  pageLinks.add(match[1]);
}
console.log('\nTotal hash links in HTML:', pageLinks.size);
console.log('Hash targets:', Array.from(pageLinks).sort());

// Check which page targets exist as #view-<target> or id="<target>"
const missingTargets = [];
for (const target of pageLinks) {
  if (!html.includes(`id="view-${target}"`) && !html.includes(`id="${target}"`)) {
    missingTargets.push(target);
  }
}
console.log('MISSING OR BROKEN HASH TARGETS:', missingTargets);
