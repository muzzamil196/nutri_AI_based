const fs = require('fs');
const vm = require('vm');

const recipesContent = fs.readFileSync('recipes-data.js', 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(recipesContent, sandbox);
const NutriRecipesDB = sandbox.window.NutriRecipesDB;

console.log('Loaded DB recipes:', NutriRecipesDB.length);

function normalizeCategory(cat) {
  if (!cat) return '';
  const c = cat.toLowerCase().replace(/[- ]/g, '_');
  if (c === 'healthy_drinks' || c === 'healthy_drink' || c === 'healthydrinks' || c === 'drinks' || c === 'drink') {
    return 'healthy_drinks';
  }
  if (c === 'morning_snacks' || c === 'morning_snack' || c === 'morningsnacks') {
    return 'morning_snacks';
  }
  if (c === 'evening_snacks' || c === 'evening_snack' || c === 'eveningsnacks') {
    return 'evening_snacks';
  }
  return c;
}

function recipeMatchesCuisine(r, selectedCuisine) {
  if (!selectedCuisine || selectedCuisine === 'all') return true;
  const target = selectedCuisine.toLowerCase().replace(/[- /]/g, '_');
  const tags = (r.cuisineTags || []).map(t => t.toLowerCase().replace(/[- /]/g, '_'));
  const rCuisine = (r.cuisine || '').toLowerCase().replace(/[- /]/g, '_');

  if (target === 'indian') {
    return tags.includes('indian') || rCuisine.includes('indian') || tags.includes('south_indian') || tags.includes('north_indian') || tags.includes('andhra_telugu');
  }
  if (target === 'global') {
    return tags.includes('global') || (!tags.includes('indian') && !rCuisine.includes('indian') && !tags.includes('south_indian') && !tags.includes('north_indian') && !tags.includes('andhra_telugu'));
  }
  if (target === 'south_indian') {
    return tags.includes('south_indian') || rCuisine.includes('south_indian');
  }
  if (target === 'andhra_telugu') {
    return tags.includes('andhra_telugu') || rCuisine.includes('andhra_telugu') || tags.includes('andhra') || tags.includes('telugu');
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

function recipeMatchesSearch(recipe, query) {
  if (!query || !query.trim()) return true;
  const q = query.toLowerCase().trim();
  if (recipe.name && recipe.name.toLowerCase().includes(q)) return true;
  if (recipe.cuisine && recipe.cuisine.toLowerCase().includes(q)) return true;
  if (recipe.category && recipe.category.toLowerCase().includes(q)) return true;
  if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
    for (const ing of recipe.ingredients) {
      if (ing.name && ing.name.toLowerCase().includes(q)) return true;
    }
  }
  return false;
}

const DAILY_MEAL_SLOTS = [
  { key: 'breakfast', label: 'Breakfast', icon: 'sun', defaultId: 'bf-2' },
  { key: 'morning_snacks', label: 'Morning Snack', icon: 'apple', defaultId: 'ms-1' },
  { key: 'lunch', label: 'Lunch', icon: 'salad', defaultId: 'ln-1' },
  { key: 'evening_snacks', label: 'Evening Snack', icon: 'sparkles', defaultId: 'es-1' },
  { key: 'dinner', label: 'Dinner', icon: 'moon', defaultId: 'dn-1' },
  { key: 'healthy_drinks', label: 'Healthy Drink', icon: 'cup-soda', defaultId: 'hd-1' }
];

console.log('Testing slots defaults...');
DAILY_MEAL_SLOTS.forEach(s => {
  const r = NutriRecipesDB.find(x => x.id === s.defaultId);
  console.log(`Slot ${s.key}: found recipe "${r?.name}" (${r?.category}, ${r?.cuisine})`);
});
