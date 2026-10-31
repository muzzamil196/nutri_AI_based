const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const regex = /<section[^>]*class="([^"]*page-view[^"]*)"[^>]*id="([^"]*)"/g;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log(`id="${match[2]}" class="${match[1]}"`);
}
