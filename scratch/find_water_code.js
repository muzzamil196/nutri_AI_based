const fs = require('fs');

const script = fs.readFileSync('script.js', 'utf8');
const scriptLines = script.split('\n');
console.log('=== SCRIPT WATER CODE ===');
scriptLines.forEach((l, i) => {
  if (
    l.includes('hydration') ||
    l.includes('waterTarget') ||
    l.includes('dash-water') ||
    l.includes('dash-cups') ||
    l.includes('water-glass') ||
    l.includes('track-water')
  ) {
    console.log(`${i+1}: ${l.trim().substring(0, 100)}`);
  }
});

const html = fs.readFileSync('index.html', 'utf8');
const htmlLines = html.split('\n');
console.log('\n=== HTML WATER CODE ===');
htmlLines.forEach((l, i) => {
  if (
    l.includes('hydration') ||
    l.includes('waterTarget') ||
    l.includes('dash-water') ||
    l.includes('dash-cups') ||
    l.includes('water-glass') ||
    l.includes('water-card') ||
    l.includes('water-log') ||
    l.includes('water')
  ) {
    if (l.trim().length < 120) {
      console.log(`${i+1}: ${l.trim()}`);
    }
  }
});
