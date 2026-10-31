const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const keywords = ['notification', 'bell', 'search', 'profile', 'settings', 'favorites', 'logout', 'filter', 'swap', 'log'];
keywords.forEach(kw => {
  const regex = new RegExp(`.*${kw}.*`, 'gi');
  let match;
  let count = 0;
  while ((match = regex.exec(html)) !== null) {
    count++;
  }
  console.log(`Keyword "${kw}": ${count} lines`);
});
