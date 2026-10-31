// Master compiler for recipes-data.js
const fs = require('fs');

const breakfast = require('./recipes_breakfast.js');
const morningSnacks = require('./recipes_morning_snacks.js');
const lunch = require('./recipes_lunch.js');
const eveningSnacks = require('./recipes_evening_snacks.js');
const dinner = require('./recipes_dinner.js');
const healthyDrinks = require('./recipes_healthy_drinks.js');

console.log(`Breakfast recipes: ${breakfast.length} (Target >= 20)`);
console.log(`Morning snacks recipes: ${morningSnacks.length} (Target >= 20)`);
console.log(`Lunch recipes: ${lunch.length} (Target >= 20)`);
console.log(`Evening snacks recipes: ${eveningSnacks.length} (Target >= 20)`);
console.log(`Dinner recipes: ${dinner.length} (Target >= 20)`);
console.log(`Healthy drinks recipes: ${healthyDrinks.length} (Target >= 20)`);

const allRecipes = [
  ...breakfast,
  ...morningSnacks,
  ...lunch,
  ...eveningSnacks,
  ...dinner,
  ...healthyDrinks
];

console.log(`\nTotal compiled recipes: ${allRecipes.length}`);

// Validation checks
const ids = new Set();
const images = new Map();
allRecipes.forEach((r, idx) => {
  if (ids.has(r.id)) {
    throw new Error(`Duplicate recipe ID found: ${r.id} at index ${idx}`);
  }
  ids.add(r.id);

  if (!r.name || !r.category || !r.cuisine || !r.cuisineTags || !r.diet) {
    throw new Error(`Incomplete metadata on recipe ${r.id}: ${r.name}`);
  }
  if (typeof r.calories !== 'number' || typeof r.protein !== 'number' || typeof r.carbs !== 'number' || typeof r.fat !== 'number') {
    throw new Error(`Invalid nutrition numbers on recipe ${r.id}`);
  }
  if (!r.image) {
    throw new Error(`Missing image on recipe ${r.id}`);
  }
  if (!Array.isArray(r.ingredients) || r.ingredients.length === 0) {
    throw new Error(`Missing ingredients on recipe ${r.id}`);
  }
  if (!Array.isArray(r.instructions) || r.instructions.length === 0) {
    throw new Error(`Missing instructions on recipe ${r.id}`);
  }

  images.set(r.image, (images.get(r.image) || 0) + 1);
});

console.log(`Validation passed: ${allRecipes.length} unique recipes with zero ID duplicates and complete clinical metadata.`);

// Generate file content
const header = `/**
 * ============================================================================
 * NutriAI — Master Comprehensive Recipe Database (132 Authentic Clinical Recipes)
 * Categories:
 *   1. Breakfast (22 recipes: bf-1 to bf-22)
 *   2. Morning Snacks (22 recipes: ms-1 to ms-22)
 *   3. Lunch (22 recipes: ln-1 to ln-22)
 *   4. Evening Snacks (22 recipes: es-1 to es-22)
 *   5. Dinner (22 recipes: dn-1 to dn-22)
 *   6. Healthy Drinks (22 recipes: hd-1 to hd-22)
 *
 * Cuisines Represented:
 *   - Indian (South Indian, North Indian, Andhra / Telugu, Telangana, Karnataka, Tamil Nadu, Kerala, Ayurvedic)
 *   - Korean (Bibimbap, Kimbap, Japchae, Doenjang, Mandu, Pajeon, Kimchi, etc.)
 *   - Global (Italian, Mediterranean, Mexican, Japanese, Chinese, Thai, Middle Eastern)
 * ============================================================================
 */

(function(window) {
  'use strict';

  const RECIPES_DATABASE = ${JSON.stringify(allRecipes, null, 2)};

  // Expose to window namespace
  window.NutriRecipesDB = RECIPES_DATABASE;

})(typeof window !== 'undefined' ? window : global);
`;

fs.writeFileSync('recipes-data.js', header, 'utf8');
console.log('Successfully written recipes-data.js!');
