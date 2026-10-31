const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('recipes-data.js', 'utf8');
const sandbox = { window: {}, global: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const db = sandbox.window.NutriRecipesDB;

function recipeMatchesCuisine(r, selectedCuisine) {
  if (!selectedCuisine || selectedCuisine === 'all') return true;
  const target = selectedCuisine.toLowerCase().replace(/[- /]/g, '_');
  const tags = (r.cuisineTags || []).map(t => t.toLowerCase().replace(/[- /]/g, '_'));
  const rCuisine = (r.cuisine || '').toLowerCase().replace(/[- /]/g, '_');

  const indianSubtags = ['indian', 'south_indian', 'north_indian', 'andhra_telugu', 'andhra', 'telugu', 'telangana', 'karnataka', 'tamil_nadu', 'kerala', 'ayurvedic'];
  const isIndian = indianSubtags.some(t => tags.includes(t) || rCuisine.includes(t));

  if (target === 'indian') {
    return isIndian;
  }
  if (target === 'global') {
    return tags.includes('global') || !isIndian;
  }
  if (target === 'south_indian') {
    return tags.includes('south_indian') || rCuisine.includes('south_indian') || tags.includes('andhra_telugu') || tags.includes('karnataka') || tags.includes('tamil_nadu') || tags.includes('kerala');
  }
  if (target === 'andhra_telugu' || target === 'andhra' || target === 'telugu') {
    return tags.includes('andhra_telugu') || rCuisine.includes('andhra_telugu') || tags.includes('andhra') || tags.includes('telugu') || rCuisine.includes('andhra');
  }
  if (target === 'telangana') {
    return tags.includes('telangana') || rCuisine.includes('telangana');
  }
  if (target === 'karnataka') {
    return tags.includes('karnataka') || rCuisine.includes('karnataka');
  }
  if (target === 'tamil_nadu') {
    return tags.includes('tamil_nadu') || rCuisine.includes('tamil_nadu');
  }
  if (target === 'kerala') {
    return tags.includes('kerala') || rCuisine.includes('kerala');
  }
  if (target === 'north_indian') {
    return tags.includes('north_indian') || rCuisine.includes('north_indian');
  }
  if (target === 'korean') {
    return tags.includes('korean') || rCuisine.includes('korean');
  }
  if (target === 'italian') {
    return tags.includes('italian') || rCuisine.includes('italian');
  }
  if (target === 'mediterranean') {
    return tags.includes('mediterranean') || rCuisine.includes('mediterranean');
  }
  if (target === 'middle_eastern') {
    return tags.includes('middle_eastern') || rCuisine.includes('middle_eastern');
  }
  if (target === 'chinese') {
    return tags.includes('chinese') || rCuisine.includes('chinese');
  }
  if (target === 'japanese') {
    return tags.includes('japanese') || rCuisine.includes('japanese');
  }
  if (target === 'mexican') {
    return tags.includes('mexican') || rCuisine.includes('mexican');
  }
  if (target === 'thai') {
    return tags.includes('thai') || rCuisine.includes('thai');
  }
  return tags.includes(target) || rCuisine.includes(target);
}

const testCuisines = [
  'all', 'indian', 'korean', 'global',
  'south_indian', 'andhra_telugu', 'telangana', 'karnataka', 'tamil_nadu', 'kerala', 'north_indian',
  'italian', 'mediterranean', 'middle_eastern', 'mexican', 'japanese', 'chinese', 'thai'
];

console.log('--- Individual Cuisine Counts ---');
testCuisines.forEach(c => {
  const matched = db.filter(r => recipeMatchesCuisine(r, c));
  console.log(`Cuisine: ${c.padEnd(16)} -> ${matched.length} recipes`);
});

console.log('\n--- Cuisine + Category Combinations ---');
const categories = ['breakfast', 'morning_snacks', 'lunch', 'evening_snacks', 'dinner', 'healthy_drinks'];
['indian', 'korean', 'global'].forEach(cuis => {
  categories.forEach(cat => {
    const count = db.filter(r => r.category === cat && recipeMatchesCuisine(r, cuis)).length;
    console.log(`[${cuis.padEnd(8)}] + [${cat.padEnd(15)}] -> ${count} recipes`);
  });
});

