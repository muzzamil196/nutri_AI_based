const fs = require('fs');
const code = fs.readFileSync('script.js', 'utf8');
const lines = code.split('\n');

const parenStack = [];
const bracketStack = [];
const braceStack = [];

let inStr = null;
let inComment = false;
let inBlockComment = false;

for (let l = 0; l < lines.length; l++) {
  const line = lines[l];
  for (let c = 0; c < line.length; c++) {
    const ch = line[c];
    const prev = c > 0 ? line[c - 1] : '';
    const next = c + 1 < line.length ? line[c + 1] : '';

    if (inComment) continue;
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        c++;
      }
      continue;
    }
    if (inStr) {
      if (ch === inStr && prev !== '\\') {
        inStr = null;
      }
      continue;
    }

    if (ch === '/' && next === '/') {
      inComment = true;
      break;
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      c++;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      inStr = ch;
      continue;
    }

    if (ch === '(') parenStack.push(l + 1);
    else if (ch === ')') {
      if (parenStack.length === 0) console.log('Extra ) at line', l + 1);
      else parenStack.pop();
    }
    else if (ch === '[') bracketStack.push(l + 1);
    else if (ch === ']') {
      if (bracketStack.length === 0) console.log('Extra ] at line', l + 1);
      else bracketStack.pop();
    }
    else if (ch === '{') braceStack.push(l + 1);
    else if (ch === '}') {
      if (braceStack.length === 0) console.log('Extra } at line', l + 1);
      else braceStack.pop();
    }
  }
  inComment = false;
}

console.log('Unclosed parens:', parenStack);
console.log('Unclosed brackets:', bracketStack);
console.log('Unclosed braces:', braceStack);
console.log('inStr:', inStr, 'inBlockComment:', inBlockComment);
