const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

const viewsToCheck = [
  'view-calorie-calculator',
  'view-bmi-calculator',
  'view-ai-chatbot',
  'view-nutrition-tracking',
  'view-settings'
];

viewsToCheck.forEach(viewId => {
  console.log(`\n=================== ${viewId} ===================`);
  let inView = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes(`id="${viewId}"`)) inView = true;
    if (inView && l.includes('</section>')) {
      inView = false;
    }
    if (inView && (/<button/i.test(l) || /id=["'][^"']*btn/i.test(l))) {
      console.log(`Line ${i + 1}: ${l.trim()}`);
    }
  }
});
