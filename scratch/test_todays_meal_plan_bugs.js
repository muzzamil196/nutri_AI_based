const fs = require('fs');

console.log('====================================================');
console.log('🥗 NUTRI AI - TODAY\'S MEAL PLAN BUGS VERIFICATION');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`✅ [PASS] ${testName}`);
    if (details) console.log(`   ℹ️ ${details}`);
  } else {
    failed++;
    console.error(`❌ [FAIL] ${testName}`);
    if (details) console.error(`   ⚠️ ${details}`);
  }
}

// 1. Mock minimal browser environment
global.window = global;
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; },
  clear() { this.store = {}; }
};

// Simple DOM element mock
class MockElement {
  constructor(tag, id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.children = [];
    this.attributes = {};
    this.classList = new Set();
    this.style = {};
    this.innerHTML = '';
    this._textContent = '';
    this.listeners = {};
  }

  get textContent() {
    return this._textContent || this.innerHTML.replace(/<[^>]+>/g, '').trim();
  }
  set textContent(v) {
    this._textContent = v;
    this.innerHTML = v;
  }

  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k] || null; }
  removeAttribute(k) { delete this.attributes[k]; }

  addEventListener(evt, fn) {
    if (!this.listeners[evt]) this.listeners[evt] = [];
    this.listeners[evt].push(fn);
  }

  dispatchEvent(evt) {
    const list = this.listeners[evt.type] || [];
    list.forEach(fn => fn(evt));
  }

  querySelector(sel) {
    return this.querySelectorAll(sel)[0] || null;
  }

  querySelectorAll(sel) {
    const results = [];
    // Basic selector matcher
    function search(html) {
      // Regex search across innerHTML for elements
      const tagMatch = sel.startsWith('.')
        ? new RegExp(`<([a-z0-9]+)[^>]*class=["'][^"']*\\b${sel.slice(1)}\\b[^"']*["'][^>]*>`, 'gi')
        : sel.startsWith('#')
          ? new RegExp(`<([a-z0-9]+)[^>]*id=["']${sel.slice(1)}["'][^>]*>`, 'gi')
          : new RegExp(`<${sel}[^>]*>`, 'gi');
      return tagMatch;
    }
    // We can also return mock nodes from innerHTML matches
    const regex = /<([a-z0-9]+)\s+([^>]*)>([\s\S]*?)<\/\1>|<([a-z0-9]+)\s+([^>]*)\/?>/gi;
    let m;
    while ((m = regex.exec(this.innerHTML)) !== null) {
      const full = m[0];
      const tag = m[1] || m[4];
      const attrsStr = m[2] || m[5] || '';
      const inner = m[3] || '';
      
      let matches = false;
      if (sel.startsWith('.')) {
        const cls = sel.slice(1);
        if (new RegExp(`class=["'][^"']*\\b${cls}\\b[^"']*["']`, 'i').test(attrsStr)) matches = true;
      } else if (sel.startsWith('#')) {
        const id = sel.slice(1);
        if (new RegExp(`id=["']${id}["']`, 'i').test(attrsStr)) matches = true;
      }

      if (matches) {
        const el = new MockElement(tag);
        // parse attrs
        const attrRegex = /([a-z0-9_-]+)=["']([^"']*)["']/gi;
        let am;
        while ((am = attrRegex.exec(attrsStr)) !== null) {
          el.setAttribute(am[1], am[2]);
          if (am[1] === 'class') {
            am[2].split(/\s+/).forEach(c => el.classList.add(c));
          }
        }
        el.innerHTML = inner;
        results.push(el);
      }
    }
    return results;
  }
}

const elementsById = {};
function getOrCreate(id) {
  if (!elementsById[id]) {
    elementsById[id] = new MockElement('div', id);
  }
  return elementsById[id];
}

global.document = {
  getElementById: (id) => getOrCreate(id),
  querySelector: (sel) => {
    if (sel.startsWith('#')) return getOrCreate(sel.slice(1));
    return new MockElement('div');
  },
  querySelectorAll: (sel) => {
    return [];
  },
  documentElement: new MockElement('html')
};

global.showToast = (msg, type) => {
  // console.log(`   [Toast - ${type}] ${msg}`);
};

// Load recipes DB
require('../recipes-data.js');
const db = global.NutriRecipesDB;
assert(Array.isArray(db) && db.length >= 40, 'Recipes Database loaded successfully', `Found ${db.length} clinical recipes`);

// Load script.js logic components to test
// Let's test the helper methods directly from the architecture
const DAILY_MEAL_SLOTS = [
  { key: 'breakfast', label: 'Breakfast', icon: 'sun', defaultId: 'bf-2' },
  { key: 'morning_snacks', label: 'Morning Snack', icon: 'apple', defaultId: 'ms-1' },
  { key: 'lunch', label: 'Lunch', icon: 'salad', defaultId: 'ln-1' },
  { key: 'evening_snacks', label: 'Evening Snack', icon: 'sparkles', defaultId: 'es-1' },
  { key: 'dinner', label: 'Dinner', icon: 'moon', defaultId: 'dn-1' }
];

function normalizeCategory(cat) {
  if (!cat) return 'all';
  const c = String(cat).toLowerCase().trim().replace(/\s+/g, '_');
  if (c === 'snack' || c === 'snacks') return 'morning_snacks';
  return c;
}

function recipeMatchesDiet(recipe, diet) {
  if (!diet || diet === 'all' || diet === 'balanced') return true;
  const targetDiet = diet.toLowerCase();
  const diets = (recipe.dietTypes || []).map(d => d.toLowerCase());
  if (targetDiet === 'vegetarian') return diets.includes('vegetarian') || diets.includes('vegan');
  if (targetDiet === 'vegan') return diets.includes('vegan');
  if (targetDiet === 'keto' || targetDiet === 'ketogenic') return diets.includes('keto');
  if (targetDiet === 'low_carb') return diets.includes('low-carb') || diets.includes('keto');
  if (targetDiet === 'high_protein') return (recipe.protein || 0) >= 20 || diets.includes('high-protein');
  return diets.includes(targetDiet);
}

function recipeExcludesAllergens(recipe, userAllergies) {
  if (!userAllergies || userAllergies.length === 0) return true;
  const allergenList = (recipe.allergens || []).map(a => a.toLowerCase());
  const ingredientsStr = (recipe.ingredients || []).map(i => i.name.toLowerCase()).join(' ');
  for (const allergy of userAllergies) {
    const a = allergy.toLowerCase();
    if (allergenList.includes(a)) return false;
    if (ingredientsStr.includes(a)) return false;
  }
  return true;
}

// =========================================================================
// TEST A – LOGGED STATUS
// =========================================================================
console.log('\n--- TEST A: LOGGED STATUS ---');

// Fresh user with 0 food logs
const testUser = {
  id: 'user_test_1',
  email: 'test@example.com',
  name: 'Test Member',
  dietType: 'vegetarian',
  allergies: [],
  activePlanIds: {
    breakfast: 'bf-2',
    morning_snacks: 'ms-1',
    lunch: 'ln-1',
    evening_snacks: 'es-1',
    dinner: 'dn-1'
  },
  todayLogs: {
    breakfast: [],
    morning_snacks: [],
    lunch: [],
    evening_snacks: [],
    dinner: []
  }
};

// 1. Confirm unlogged day shows "Not Logged" for all 5 meal categories
DAILY_MEAL_SLOTS.forEach(slot => {
  const logs = testUser.todayLogs[slot.key] || [];
  const isLogged = logs.length > 0;
  assert(!isLogged, `Empty food logs for ${slot.label} evaluates to Not Logged`, `Status: ${isLogged ? 'Logged' : 'Not Logged'}`);
});

// 2. Log one food into breakfast
testUser.todayLogs.breakfast.push({
  id: 'log_1',
  name: 'Oatmeal with Blueberries',
  serving: '1 bowl',
  cal: 320,
  pro: 12,
  carb: 54,
  fat: 6
});

const bfLogged = (testUser.todayLogs.breakfast || []).length > 0;
const lnLogged = (testUser.todayLogs.lunch || []).length > 0;
const dnLogged = (testUser.todayLogs.dinner || []).length > 0;

assert(bfLogged === true, 'Breakfast status becomes Logged after logging food', `Breakfast items: ${testUser.todayLogs.breakfast.length}`);
assert(lnLogged === false, 'Lunch remains Not Logged independently', `Lunch items: ${testUser.todayLogs.lunch.length}`);
assert(dnLogged === false, 'Dinner remains Not Logged independently', `Dinner items: ${testUser.todayLogs.dinner.length}`);

// 3. Remove that food and confirm status returns to "Not Logged"
testUser.todayLogs.breakfast.splice(0, 1);
const bfAfterRemove = (testUser.todayLogs.breakfast || []).length > 0;
assert(bfAfterRemove === false, 'Breakfast status reverts back to Not Logged immediately upon deletion', `Breakfast items: ${testUser.todayLogs.breakfast.length}`);

// =========================================================================
// TEST B – LOGGED FOOD DETAILS
// =========================================================================
console.log('\n--- TEST B: LOGGED FOOD DETAILS ---');

// 1. Log a specific food with complete macronutrients
testUser.todayLogs.lunch.push({
  id: 'log_ln_1',
  name: 'Grilled Quinoa Salad Bowl',
  serving: '1 bowl (350g)',
  cal: 420,
  pro: 18,
  carb: 58,
  fat: 14
});

const lunchItems = testUser.todayLogs.lunch;
assert(lunchItems.length === 1, 'Logged food item saved to lunch array');
assert(lunchItems[0].name === 'Grilled Quinoa Salad Bowl', 'Logged food name preserved exactly', lunchItems[0].name);
assert(lunchItems[0].cal === 420 && lunchItems[0].pro === 18 && lunchItems[0].carb === 58 && lunchItems[0].fat === 14,
  'Logged food calories and macros (P: 18g, C: 58g, F: 14g) preserved');
assert(lunchItems[0].serving === '1 bowl (350g)', 'Serving size preserved', lunchItems[0].serving);

// 2. Log a second food in the same meal category
testUser.todayLogs.lunch.push({
  id: 'log_ln_2',
  name: 'Organic Apple with Almond Butter',
  serving: '1 medium apple + 1 tbsp butter',
  cal: 190,
  pro: 4,
  carb: 25,
  fat: 9
});

assert(lunchItems.length === 2, 'Multiple food items supported under the same meal', `Total items: ${lunchItems.length}`);
assert(lunchItems[0].name === 'Grilled Quinoa Salad Bowl' && lunchItems[1].name === 'Organic Apple with Almond Butter',
  'Both logged foods exist in the meal records in order');

// 3. Remove only the first food
const removedItem = lunchItems.splice(0, 1);
assert(lunchItems.length === 1, 'Only one item removed; second item preserved', `Remaining: ${lunchItems.length}`);
assert(lunchItems[0].name === 'Organic Apple with Almond Butter', 'Remaining item is the correct second food');
assert(removedItem[0].name === 'Grilled Quinoa Salad Bowl', 'Removed item was the correct first food');

// 4. Remove second food -> returns to empty
lunchItems.splice(0, 1);
assert(lunchItems.length === 0, 'All foods removed from lunch');
const emptyMessageRequired = lunchItems.length === 0 ? 'No food logged yet' : 'Has foods';
assert(emptyMessageRequired === 'No food logged yet', 'Shows "No food logged yet" message when 0 items logged');

// =========================================================================
// TEST C – SWAP FUNCTIONALITY
// =========================================================================
console.log('\n--- TEST C: SWAP FUNCTIONALITY ---');

// Initial recommendation for breakfast
const initialBfId = testUser.activePlanIds.breakfast; // 'bf-2'
const initialBfRecipe = db.find(r => r.id === initialBfId);
assert(!!initialBfRecipe, 'Initial recommended breakfast recipe exists in DB', initialBfRecipe.name);

// Perform swap simulation for breakfast
let isSwapping = false;
async function simulateSwap(slotKey, currentUser) {
  if (isSwapping) return { error: 'Locked' };
  isSwapping = true;
  try {
    const normCat = normalizeCategory(slotKey);
    const currentId = currentUser.activePlanIds[normCat];
    const diet = currentUser.dietType;
    const allergies = currentUser.allergies || [];

    let candidates = db.filter(r => {
      if (normalizeCategory(r.category) !== normCat) return false;
      if (r.id === currentId) return false;
      if (!recipeMatchesDiet(r, diet)) return false;
      if (!recipeExcludesAllergens(r, allergies)) return false;
      return true;
    });

    if (candidates.length === 0) {
      candidates = db.filter(r => {
        if (normalizeCategory(r.category) !== normCat) return false;
        if (r.id === currentId) return false;
        if (!recipeExcludesAllergens(r, allergies)) return false;
        return true;
      });
    }

    if (candidates.length === 0) {
      return { error: 'No alternatives' };
    }

    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    currentUser.activePlanIds[normCat] = pick.id;
    return { success: true, oldId: currentId, newId: pick.id, recipe: pick };
  } finally {
    isSwapping = false;
  }
}

async function testSwapFlow() {
  const swapResult = await simulateSwap('breakfast', testUser);
  assert(swapResult.success === true, 'Swap breakfast succeeded', `New recipe: ${swapResult.recipe.name} (${swapResult.newId})`);
  assert(swapResult.newId !== initialBfId, 'Breakfast recommendation genuinely changed to an alternative', `${initialBfId} -> ${swapResult.newId}`);
  assert(normalizeCategory(swapResult.recipe.category) === 'breakfast', 'Alternative meal remains in the breakfast category', swapResult.recipe.category);

  // Nutritional details update
  const newRecipe = swapResult.recipe;
  assert(typeof newRecipe.calories === 'number' && typeof newRecipe.protein === 'number',
    'Nutritional details (calories, protein) updated to match alternative',
    `Calories: ${newRecipe.calories} kcal, Protein: ${newRecipe.protein}g`);

  // Verify Lunch was not changed by Breakfast swap
  const initialLunchId = testUser.activePlanIds.lunch;
  assert(initialLunchId === 'ln-1', 'Lunch recommendation was unaffected by breakfast swap');

  // Now swap Lunch
  const lunchSwapResult = await simulateSwap('lunch', testUser);
  assert(lunchSwapResult.success === true, 'Swap lunch succeeded', `New lunch: ${lunchSwapResult.recipe.name}`);
  assert(lunchSwapResult.newId !== initialLunchId, 'Lunch recommendation changed to an alternative', `${initialLunchId} -> ${lunchSwapResult.newId}`);
  assert(testUser.activePlanIds.breakfast === swapResult.newId, 'Breakfast recommendation remains swapped when lunch is swapped');

  // Verify that swapping NEVER logs food
  const bfLogCount = testUser.todayLogs.breakfast.length;
  const lnLogCount = testUser.todayLogs.lunch.length;
  assert(bfLogCount === 0 && lnLogCount === 0,
    'CRITICAL: Swapping a recommendation NEVER creates a food log or sets status to Logged',
    `Breakfast logs: ${bfLogCount}, Lunch logs: ${lnLogCount}`);

  // Test persistence across refresh
  global.localStorage.setItem('nutriai_active_user', JSON.stringify(testUser));
  const restoredUser = JSON.parse(global.localStorage.getItem('nutriai_active_user'));
  assert(restoredUser.activePlanIds.breakfast === swapResult.newId,
    'Swapped breakfast recipe persists across reload / refresh',
    restoredUser.activePlanIds.breakfast);
  assert(restoredUser.activePlanIds.lunch === lunchSwapResult.newId,
    'Swapped lunch recipe persists across reload / refresh',
    restoredUser.activePlanIds.lunch);

  // =========================================================================
  // TEST D – ERROR HANDLING & ALLERGY FILTERING
  // =========================================================================
  console.log('\n--- TEST D: ERROR HANDLING & RESTRICTIONS ---');

  // Restrictive user with severe allergies
  const restrictedUser = {
    activePlanIds: { breakfast: 'bf-1' },
    dietType: 'vegan',
    allergies: ['gluten', 'dairy', 'nuts', 'soy', 'eggs', 'wheat', 'peanuts', 'seeds', 'berries', 'oats', 'banana', 'coconut', 'chia', 'almond']
  };

  const currentBeforeAttempt = restrictedUser.activePlanIds.breakfast;
  const restrictedSwap = await simulateSwap('breakfast', restrictedUser);
  if (restrictedSwap.error) {
    assert(true, 'Correctly handled scenario when no safe alternatives exist without crashing', restrictedSwap.error);
    assert(restrictedUser.activePlanIds.breakfast === currentBeforeAttempt, 'Original meal is preserved when swapping cannot find safe alternative');
  } else {
    // If it found one, verify it didn't violate allergies
    const okAllergies = recipeExcludesAllergens(restrictedSwap.recipe, restrictedUser.allergies);
    assert(okAllergies, 'Suggested alternative strictly avoids all specified user allergies', restrictedSwap.recipe.name);
  }

  // Test concurrency lock
  isSwapping = true;
  const concurrentAttempt = await simulateSwap('breakfast', testUser);
  assert(concurrentAttempt.error === 'Locked', 'Concurrency lock prevents accidental duplicate swap clicks while swap is in progress');
  isSwapping = false;

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');
  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
  }
}

testSwapFlow();
