const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('script.js', 'utf8');

// Parse all buttons in index.html
const btnRegex = /<button\s+([^>]+)>([\s\S]*?)<\/button>/g;
let m;
const buttons = [];
while ((m = btnRegex.exec(html)) !== null) {
  const attrs = m[1];
  const content = m[2].trim().replace(/<[^>]+>/g, '').trim();
  const idM = /id=["']([^"']+)["']/.exec(attrs);
  const classM = /class=["']([^"']+)["']/.exec(attrs);
  const typeM = /type=["']([^"']+)["']/.exec(attrs);
  const dataCat = /data-cat=["']([^"']+)["']/.exec(attrs);
  const dataCuisine = /data-cuisine=["']([^"']+)["']/.exec(attrs);
  const dataPortion = /data-portion=["']([^"']+)["']/.exec(attrs);
  const dataSample = /data-sample=["']([^"']+)["']/.exec(attrs);
  const dataDiet = /data-diet=["']([^"']+)["']/.exec(attrs);
  const dataAllergy = /data-allergy=["']([^"']+)["']/.exec(attrs);
  const dataCup = /data-cup=["']([^"']+)["']/.exec(attrs);

  buttons.push({
    id: idM ? idM[1] : null,
    classes: classM ? classM[1].split(/\s+/) : [],
    type: typeM ? typeM[1] : 'submit',
    text: content,
    dataCat: dataCat ? dataCat[1] : null,
    dataCuisine: dataCuisine ? dataCuisine[1] : null,
    dataPortion: dataPortion ? dataPortion[1] : null,
    dataSample: dataSample ? dataSample[1] : null,
    dataDiet: dataDiet ? dataDiet[1] : null,
    dataAllergy: dataAllergy ? dataAllergy[1] : null,
    dataCup: dataCup ? dataCup[1] : null,
    raw: m[0].split('\n')[0]
  });
}

console.log(`Found ${buttons.length} total buttons.`);

// Group buttons by selector / action
const report = [];
buttons.forEach((b, idx) => {
  let matchedRule = null;
  if (b.id) {
    if (script.includes(b.id)) matchedRule = `ID #${b.id} found in script.js`;
  }
  if (!matchedRule) {
    for (const c of b.classes) {
      if (script.includes('.' + c) || script.includes(`'${c}'`) || script.includes(`"${c}"`)) {
        matchedRule = `Class .${c} found in script.js`;
        break;
      }
    }
  }
  if (!matchedRule && b.type === 'submit') {
    matchedRule = 'Form Submit button (handled by parent form submit listener)';
  }
  if (!matchedRule) {
    report.push({ index: idx + 1, ...b });
  }
});

console.log(`\nButtons WITHOUT matching listener in script.js: ${report.length}`);
report.forEach(r => {
  console.log(`[#${r.index}] id="${r.id}" classes="${r.classes.join(' ')}" type="${r.type}" text="${r.text}" -> ${r.raw}`);
});
