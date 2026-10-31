const fs = require('fs');
const code = fs.readFileSync('script.js', 'utf8');

// We can test syntax of prefixes or function slices
// Since script.js is wrapped in (function () { ... })();
// Let's remove the wrapper line 23 and line 4838 and parse top-level functions!

const lines = code.split('\n');
console.log('Total lines:', lines.length);

// Let's find top-level functions inside the IIFE (lines with indentation "  function " or "  const " or "  let ")
let lastGoodLine = 24;
for (let i = 25; i < lines.length - 1; i += 20) {
  const slice = lines.slice(23, i).join('\n') + '\n}'; // close the IIFE
  try {
    new Function(slice);
    // If it compiles without SyntaxError or unexpected token, let's see
  } catch (e) {
    if (e.message.includes('Unexpected end of input')) {
      // Missing closing braces, which is normal for a truncated slice
    } else {
      // Something broke before or at line i
      console.log('Error at slice up to line', i, ':', e.message);
      break;
    }
  }
}
