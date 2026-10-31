const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('script.js', 'utf8');

// Check all href="#" that don't have a hash or data-nav
const hrefPoundRegex = /<a\s+[^>]*href=["']#["'][^>]*>/g;
let m;
console.log('=== LINKS WITH JUST HREF="#" ===');
while ((m = hrefPoundRegex.exec(html)) !== null) {
  console.log(m[0]);
}

// Check all elements with onclick attribute
const onclickRegex = /onclick=["']([^"']+)["']/g;
console.log('\n=== INLINE ONCLICK ATTRIBUTES ===');
while ((m = onclickRegex.exec(html)) !== null) {
  console.log(m[0]);
}

// Check all buttons and their text / labels
const btnRegex = /<button\s+([^>]+)>([\s\S]*?)<\/button>/g;
const buttonList = [];
while ((m = btnRegex.exec(html)) !== null) {
  const attrs = m[1];
  const inner = m[2].trim().replace(/<[^>]+>/g, '').trim();
  const idM = /id=["']([^"']+)["']/.exec(attrs);
  const classM = /class=["']([^"']+)["']/.exec(attrs);
  buttonList.push({
    id: idM ? idM[1] : null,
    class: classM ? classM[1] : null,
    text: inner,
    raw: m[0].split('\n')[0]
  });
}
console.log(`\nTotal Buttons parsed: ${buttonList.length}`);

// Group buttons by ID and check if script.js binds to them
const unboundButtons = [];
for (const b of buttonList) {
  if (!b.id) continue;
  if (!script.includes(b.id)) {
    unboundButtons.push(b);
  }
}
console.log('\n=== BUTTONS WITH ID BUT NOT IN SCRIPT.JS ===');
console.log(unboundButtons);
