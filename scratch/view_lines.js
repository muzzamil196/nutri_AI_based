const fs = require('fs');

function showLines(filePath, start, end) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  console.log(`=== ${filePath} (lines ${start} to ${end}) ===`);
  for (let i = start - 1; i < Math.min(end, lines.length); i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}

const file = process.argv[2];
const start = parseInt(process.argv[3], 10);
const end = parseInt(process.argv[4], 10);
showLines(file, start, end);
