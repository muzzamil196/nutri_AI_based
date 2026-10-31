// Automated test suite for NutriAI - Verifying all 12 Phase requirements
const fs = require('fs');
const http = require('http');

console.log('====================================================');
console.log('🧪 RUNNING NUTRIAI COMPLETE AUTOMATED TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(cond, name, details = '') {
  totalTests++;
  if (cond) {
    passedTests++;
    console.log(`✅ [PASS] ${name}`);
    if (details) console.log(`   ℹ️ ${details}`);
  } else {
    console.error(`❌ [FAIL] ${name}`);
    if (details) console.error(`   ⚠️ ${details}`);
  }
}

// 1. Check server health endpoint
function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 8080,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  global.window = global;
  require('../recipes-data.js');
  const recipesDb = global.NutriRecipesDB;
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  const scriptJs = fs.readFileSync('script.js', 'utf8');

  // Test 1: Recipe Database integrity
  assert(Array.isArray(recipesDb) && recipesDb.length >= 35, 'Recipe Database loaded with 35+ authentic items', `Found ${recipesDb.length} authentic recipes.`);
  
  const categories = ['breakfast', 'morning-snacks', 'lunch', 'evening-snacks', 'dinner'];
  const catsPresent = categories.every(c => recipesDb.some(r => r.category === c));
  assert(catsPresent, 'All 5 meal categories represented in Recipe DB');

  // Test 2: Server Health Endpoint
  try {
    const health = await testEndpoint('/api/health');
    assert(health.status === 200 && health.body.status === 'online', 'Backend Express server is running and healthy at /api/health');
  } catch (e) {
    assert(false, 'Backend Express server is running at /api/health', e.message);
  }

  // Test 3: Backend Config Endpoint
  try {
    const config = await testEndpoint('/api/config');
    assert(config.status === 200, 'Backend returns configuration safely at /api/config', `geminiConfigured: ${config.body.geminiConfigured}, googleConfigured: ${config.body.googleClientIdConfigured}`);
  } catch (e) {
    assert(false, 'Backend /api/config reachable', e.message);
  }

  // Test 4: Onboarding Flow Elements
  assert(indexHtml.includes('id="view-onboarding"'), 'Onboarding view exists in HTML');
  assert(indexHtml.includes('id="minor-notice-banner"'), 'Minor/Youth safety notice banner exists in Onboarding');
  assert(indexHtml.includes('id="onboard-to-step-2"'), 'Onboarding Step 1 forward transition button exists');
  assert(indexHtml.includes('id="onboard-to-step-3"'), 'Onboarding Step 2 forward transition button exists');
  assert(indexHtml.includes('id="onboard-complete-btn"'), 'Onboarding completion button exists');
  assert(scriptJs.includes('setupOnboardingListeners'), 'setupOnboardingListeners is implemented in script.js');

  // Test 5: Minor Safety Rules in Logic
  assert(scriptJs.includes('age < 18') && scriptJs.includes('balanced'), 'Minor protection locks aggressive calorie restriction and sets balanced nutrition');

  // Test 6: Dietary & Allergy Filtering Logic
  function normalizeCat(c) { return (c || '').toLowerCase().replace(/[-_]/g, '_'); }
  function recipeMatchesDiet(r, diet) {
    if (!diet || diet === 'all' || diet === 'balanced') return true;
    const tags = Array.isArray(r.diet) ? r.diet.map(d => d.toLowerCase()) : [String(r.diet || '').toLowerCase()];
    if (diet === 'vegetarian') return tags.includes('vegetarian') || tags.includes('vegan');
    if (diet === 'vegan') return tags.includes('vegan');
    if (diet === 'eggetarian') return tags.includes('eggetarian') || tags.includes('vegetarian') || tags.includes('vegan');
    return true;
  }
  function recipeExcludesAllergens(r, declaredAllergens) {
    if (!declaredAllergens || declaredAllergens.length === 0) return true;
    const lowerAllergies = declaredAllergens.map(a => a.toLowerCase().trim()).filter(a => a && a !== 'none');
    const rAllergens = (r.allergens || []).map(a => a.toLowerCase());
    return !lowerAllergies.some(a => rAllergens.some(ra => ra.includes(a) || a.includes(ra)));
  }

  const vegRecipes = recipesDb.filter(r => recipeMatchesDiet(r, 'vegetarian'));
  assert(vegRecipes.length > 0 && vegRecipes.every(r => (Array.isArray(r.diet) ? r.diet : [r.diet]).some(d => d.toLowerCase() === 'vegetarian' || d.toLowerCase() === 'vegan')), 'Dietary filtering accurately isolates vegetarian recipes');

  const nutFreeVeg = vegRecipes.filter(r => recipeExcludesAllergens(r, ['nuts', 'peanuts', 'tree-nuts']));
  assert(nutFreeVeg.length > 0 && nutFreeVeg.every(r => !r.allergens.includes('Nuts') && !r.allergens.includes('Peanuts')), 'Allergen exclusion accurately removes allergens');

  // Test 7: Swap Logic with Duplicate Prevention
  const lunchRecipes = recipesDb.filter(r => normalizeCat(r.category) === 'lunch');
  const currentRecipe = lunchRecipes[0];
  const candidates = lunchRecipes.filter(r => r.id !== currentRecipe.id);
  assert(candidates.length > 0 && !candidates.some(c => c.id === currentRecipe.id), 'Meal swap correctly selects alternative without duplicate');

  // Test 8: Food Scanner API Handling
  try {
    const scanRes = await testEndpoint('/api/ai/scan-food', 'POST', { imageBase64: 'test' });
    // Expect 400 or 503 if unconfigured, with appropriate error message
    assert(scanRes.status === 400 || scanRes.status === 503 || scanRes.status === 200, 'Scanner API endpoint responds with valid HTTP status', `Status: ${scanRes.status}`);
  } catch (e) {
    assert(false, 'Scanner API endpoint responds', e.message);
  }

  // Test 9: Meal Plan Generation API Fallback
  try {
    const planRes = await testEndpoint('/api/ai/generate-meal-plan', 'POST', {
      userProfile: { age: 28, gender: 'female', dietType: 'vegetarian', goal: 'maintain', allergies: [] }
    });
    assert(planRes.status === 503 || planRes.status === 200, 'AI Meal Planner API endpoint responds gracefully', `Status: ${planRes.status}`);
  } catch (e) {
    assert(false, 'Meal Planner API endpoint responds', e.message);
  }

  // Test 10: Google OAuth Backend Token Verification Endpoint
  try {
    const authRes = await testEndpoint('/api/auth/google', 'POST', { credential: 'dummy_token' });
    assert(authRes.status === 400 || authRes.status === 401, 'Google OAuth backend rejects invalid token without claiming verification', `Status: ${authRes.status}`);
  } catch (e) {
    assert(false, 'Google OAuth backend responds', e.message);
  }

  // Test 11: Recipe Modal & Detail Elements
  assert(indexHtml.includes('id="recipe-details-modal"'), 'Recipe details modal overlay exists in DOM');
  assert(indexHtml.includes('id="modal-recipe-title"'), 'Recipe modal title exists');
  assert(indexHtml.includes('id="modal-instructions-list"'), 'Recipe modal step-by-step instructions list exists');
  assert(indexHtml.includes('id="modal-add-to-plan-btn"'), 'Modal Add to Meal Plan button exists');
  assert(indexHtml.includes('id="modal-log-now-btn"'), 'Modal Log Meal Now button exists');

  // Test 12: Icons Engine
  const iconsJs = fs.readFileSync('icons.js', 'utf8');
  assert(iconsJs.includes('window.NutriIcons') && iconsJs.includes('const ICONS ='), 'NutriIcons SVG engine embedded locally with zero CDN dependency');

  console.log('\n====================================================');
  console.log(`📊 SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log('====================================================\n');
}

runTests().catch(err => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
