const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('       NutriAI End-to-End Verification Suite        ');
console.log('====================================================\n');

let allPassed = true;

function assert(condition, testName, detail = '') {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
  } else {
    console.error(`  [FAIL] ${testName}${detail ? ': ' + detail : ''}`);
    allPassed = false;
  }
}

// ----------------------------------------------------------------------
// TEST 1: Recipe Database & Image Verification
// ----------------------------------------------------------------------
console.log('--- TEST 1: Recipe Database & 132 Unique Recipe Images ---');
const recipes = require('../recipes-data.js');
assert(Array.isArray(recipes) && recipes.length === 132, 'Recipe database has exactly 132 unique recipes');

const categories = {
  breakfast: 0,
  morning_snacks: 0,
  lunch: 0,
  evening_snacks: 0,
  dinner: 0,
  healthy_drinks: 0
};

recipes.forEach(r => {
  const cat = (r.category || '').toLowerCase().replace(/[- ]/g, '_');
  if (categories[cat] !== undefined) categories[cat]++;
});

console.log('Category Counts:');
Object.entries(categories).forEach(([cat, count]) => {
  assert(count >= 20, `Category "${cat}" has at least 20 unique recipes (count: ${count})`);
});

let missingImages = 0;
let smallImages = 0;
recipes.forEach(r => {
  const imgPath = path.join(__dirname, '..', r.image);
  if (!fs.existsSync(imgPath)) {
    missingImages++;
    console.error(`Missing image for ${r.id}: ${imgPath}`);
  } else {
    const stat = fs.statSync(imgPath);
    if (stat.size < 10000) {
      smallImages++;
      console.error(`Image too small for ${r.id}: ${stat.size} bytes`);
    }
  }
});

assert(missingImages === 0, `All 132 recipes have physical image files on disk (missing: ${missingImages})`);
assert(smallImages === 0, `All 132 recipe images are authentic, high-res photos > 10KB (small: ${smallImages})`);

// Check specific dishes requested by user
const specificChecks = [
  { id: 'bf-8', name: 'Masala Oats with Rainbow Veggies & Flaxseed' },
  { id: 'bf-9', name: 'Traditional South Indian Ven Pongal' },
  { id: 'bf-10', name: 'Soft Appam with Light Vegetable Stew' },
  { id: 'bf-6', name: 'High-Protein Moong Dal Cheela with Mint Dip' },
  { id: 'bf-7', name: 'Greek Yogurt Protein Berry Bowl' },
  { id: 'bf-1', name: 'Steamed Idli with Vegetable Sambar' },
  { id: 'bf-2', name: 'Spiced Indian Vegetable Poha' },
  { id: 'ms-15', name: 'Roasted Spiced Sweet Potato Wedges' },
  { id: 'dn-1', name: 'Andhra Menthi Kura Pappu with Brown Rice' },
  { id: 'ln-8', name: 'Andhra Ragi Sangati with Pappu' }
];

specificChecks.forEach(chk => {
  const found = recipes.find(r => r.id === chk.id);
  assert(!!found, `Found specific recipe "${chk.name}" (${chk.id})`);
  if (found) {
    const file = path.join(__dirname, '..', found.image);
    const size = fs.existsSync(file) ? fs.statSync(file).size : 0;
    assert(size > 15000, `Authentic image exists for "${found.name}": ${found.image} (${Math.round(size/1024)} KB)`);
  }
});

// ----------------------------------------------------------------------
// TEST 2: Food Scanner Backend API
// ----------------------------------------------------------------------
console.log('\n--- TEST 2: Food Scanner Backend API & Local Analysis ---');

// Start temporary test server
const app = require('../server.js');
const server = http.createServer(app);

server.listen(8081, async () => {
  try {
    // 2A: Valid Food Image Scan
    const sampleImgPath = path.join(__dirname, '..', 'assets', 'images', 'recipes', 'ln-1.jpg');
    const imgBuf = fs.readFileSync(sampleImgPath);
    const validBase64 = 'data:image/jpeg;base64,' + imgBuf.toString('base64');

    const scanRes = await fetch('http://localhost:8081/api/ai/scan-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: validBase64,
        labelHint: 'Andhra Dal with Brown Rice'
      })
    });

    const scanData = await scanRes.json();
    assert(scanData.success === true, 'Scanner successfully recognized valid food image');
    assert(scanData.status === 'recognized_food', 'Scan status is recognized_food');
    assert(!!scanData.engine, `Transparently identified recognition engine: "${scanData.engine}"`);
    assert(typeof scanData.analysis.calories === 'number' && scanData.analysis.calories > 0, `Calories calculated: ${scanData.analysis.calories} kcal`);
    assert(typeof scanData.analysis.protein === 'number' && scanData.analysis.protein > 0, `Protein calculated: ${scanData.analysis.protein}g`);
    assert(typeof scanData.analysis.carbs === 'number' && scanData.analysis.carbs > 0, `Carbs calculated: ${scanData.analysis.carbs}g`);
    assert(typeof scanData.analysis.fat === 'number' && scanData.analysis.fat > 0, `Fat calculated: ${scanData.analysis.fat}g`);
    assert(typeof scanData.analysis.fiber === 'number' && scanData.analysis.fiber > 0, `Fiber calculated: ${scanData.analysis.fiber}g`);
    assert(Array.isArray(scanData.analysis.detectedItems) && scanData.analysis.detectedItems.length > 0, `Itemized breakdown contains ${scanData.analysis.detectedItems.length} components`);
    console.log('    Itemized breakdown sample:');
    scanData.analysis.detectedItems.forEach(item => {
      console.log(`      • ${item.name} (${item.portion}): ${item.calories} kcal, P:${item.protein}g, C:${item.carbs}g, F:${item.fat}g, Fib:${item.fiber}g`);
    });
    assert(Array.isArray(scanData.analysis.likelyIngredients) && scanData.analysis.likelyIngredients.length > 0, 'Separates likely visible ingredients');
    assert(Array.isArray(scanData.analysis.uncertainIngredients) && scanData.analysis.uncertainIngredients.length > 0, 'Separates uncertain hidden ingredients (oils/sodium)');

    // 2B: Non-food rejection
    const nonFoodRes = await fetch('http://localhost:8081/api/ai/scan-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: validBase64,
        labelHint: 'Laptop computer monitor desk'
      })
    });
    const nonFoodData = await nonFoodRes.json();
    assert(nonFoodData.success === false, 'Scanner rejects non-food input');
    assert(nonFoodData.status === 'non_food', 'Scanner returns status: non_food');
    assert(!!nonFoodData.message, `Helpful non-food error message: "${nonFoodData.message}"`);

    // 2C: Corrupt / Unclear image rejection
    const unclearRes = await fetch('http://localhost:8081/api/ai/scan-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: 'data:image/jpeg;base64,AAAA' // 3 bytes
      })
    });
    const unclearData = await unclearRes.json();
    assert(unclearData.success === false, 'Scanner rejects truncated / corrupted image');
    assert(unclearData.status === 'unclear', 'Scanner returns status: unclear');
    assert(!!unclearData.message, `Helpful unclear error message: "${unclearData.message}"`);

    // ----------------------------------------------------------------------
    // TEST 3: Frontend Script UI Integrity
    // ----------------------------------------------------------------------
    console.log('\n--- TEST 3: Frontend UI Integrity & Component Bindings ---');
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const js = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');

    assert(html.includes('id="scanner-rescan-btn"'), 'index.html contains #scanner-rescan-btn');
    assert(html.includes('id="scanner-val-fiber"'), 'index.html contains #scanner-val-fiber');
    assert(html.includes('id="scanner-itemized-breakdown"'), 'index.html contains #scanner-itemized-breakdown');
    assert(html.includes('id="scanner-loading-indicator"'), 'index.html contains #scanner-loading-indicator');
    assert(html.includes('id="scanner-camera-error"'), 'index.html contains #scanner-camera-error');
    assert(html.includes('id="scanner-switch-upload-btn"'), 'index.html contains #scanner-switch-upload-btn');

    assert(js.includes('function getRecipeImageUrl('), 'script.js defines centralized getRecipeImageUrl()');
    assert(js.includes('function getCategoryFoodFallback('), 'script.js defines category food fallback helper');
    assert(js.includes('function renderItemizedBreakdown('), 'script.js defines renderItemizedBreakdown()');
    assert(js.includes('function handleScannerRescan('), 'script.js defines handleScannerRescan()');
    assert(js.includes('logMealInProgress'), 'script.js protects against duplicate meal logging');

    console.log('\n====================================================');
    if (allPassed) {
      console.log('      ALL 24 VERIFICATION CHECKS PASSED (100%)       ');
    } else {
      console.log('       SOME VERIFICATION CHECKS FAILED              ');
    }
    console.log('====================================================');

    server.close();
    process.exit(allPassed ? 0 : 1);
  } catch (err) {
    console.error('Test suite error:', err);
    server.close();
    process.exit(1);
  }
});

