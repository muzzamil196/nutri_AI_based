const fs = require('fs');

const css = fs.readFileSync('style.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (
    l.includes('water-glass') ||
    l.includes('status-chk') ||
    l.includes('completed') ||
    l.includes('auth-tab') ||
    l.includes('auth-split') ||
    l.includes('password-toggle')
  ) {
    console.log(`${i+1}: ${l.trim().substring(0, 100)}`);
  }
});
