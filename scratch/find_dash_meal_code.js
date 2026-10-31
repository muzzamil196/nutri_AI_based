const fs = require('fs');
const script = fs.readFileSync('script.js', 'utf8');
const lines = script.split('\n');
lines.forEach((l, i) => {
  if (l.includes('dash-meals-list') || l.includes('status-label-') || l.includes('status-chk-') || l.includes('dash-completion-percent')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
