const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const ids = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
console.log('--- ALL VIEWS ---');
console.log(ids.filter(i => i.startsWith('view-')));

console.log('--- AUTH / LOGIN / REG ---');
console.log(ids.filter(i => /login|reg|auth|modal/i.test(i)));

console.log('--- DASHBOARD ---');
console.log(ids.filter(i => /dash/i.test(i)));

console.log('--- SCANNER ---');
console.log(ids.filter(i => /scan/i.test(i)));
