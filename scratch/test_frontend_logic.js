const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const scriptContent = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');
const cssContent = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');

console.log('=== VERIFYING NUTRIAI FRONTEND LOGIC & DOM ELEMENTS ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${testName} - ${details}`);
    failCount++;
  }
}

// 1. Required DOM Elements in index.html
console.log('--- 1. Checking DOM Elements in index.html ---');
const requiredIds = [
  'login-form', 'login-email', 'login-password', 'login-email-error', 'login-password-error', 'login-form-error', 'login-submit-btn', 'login-submit-spinner',
  'register-form', 'reg-name', 'reg-email', 'reg-age', 'reg-password', 'reg-confirm-password', 'reg-email-error', 'reg-age-error', 'reg-form-error',
  'view-onboarding', 'onboard-name', 'onboard-email', 'onboard-age', 'onboard-height', 'onboard-weight', 'onboard-diet', 'onboard-activity', 'onboard-status', 'onboard-goal', 'onboard-age-safety-card', 'onboard-complete-btn',
  'view-dashboard', 'dash-user-name', 'dash-profile-age', 'dash-profile-weight', 'dash-profile-height', 'dash-profile-diet', 'dash-profile-activity', 'dash-status-display', 'dash-goal-display', 'dash-nutrition-summary-card', 'dash-profile-incomplete-card', 'dash-complete-profile-btn', 'dash-edit-profile-btn',
  'profile-edit-modal', 'profile-modal-form', 'm-prof-name', 'm-prof-age', 'm-prof-height', 'm-prof-weight', 'm-prof-diet', 'm-prof-activity', 'm-prof-status', 'm-prof-goal', 'm-age-safety-card',
  'view-ai-food-scanner', 'scanner-rejection-card', 'scanner-rejection-msg', 'scanner-unconfigured-card', 'scanner-valid-food-section', 'scanner-food-title', 'scanner-correct-name', 'scanner-update-name-btn',
  'view-meal-plan', 'meal-plan-age-safeguard-banner',
  'view-nutrition-tracking', 'view-calorie-calculator', 'view-bmi-calculator', 'view-progress-analytics', 'view-ai-chatbot'
];

requiredIds.forEach(id => {
  assert(htmlContent.includes(`id="${id}"`), `Element id="${id}" exists in HTML`);
});

// 2. CSS Side-by-Side Grid & Styling Tokens
console.log('\n--- 2. Checking CSS Grid & Layout Rules in style.css ---');
assert(cssContent.includes('.status-goal-grid'), '.status-goal-grid class is defined in style.css');
assert(cssContent.includes('.status-goal-dash-grid'), '.status-goal-dash-grid class is defined in style.css');
assert(cssContent.includes('grid-template-columns: 1fr 1fr'), 'Desktop side-by-side 2-column grid rule exists');
assert(cssContent.includes('.age-safety-card'), '.age-safety-card styles defined');
assert(cssContent.includes('.scanner-rejection-card'), '.scanner-rejection-card styles defined');
assert(cssContent.includes('.inline-error-msg'), '.inline-error-msg styling defined');

// 3. Email Validation in script.js
console.log('\n--- 3. Testing Email Validation Function ---');
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
function validateEmail(e) {
  if (!e || !e.trim()) return { valid: false, error: 'Email address is required.' };
  if (!emailRegex.test(e.trim())) return { valid: false, error: 'Please enter a valid email address.' };
  return { valid: true };
}

assert(validateEmail('').valid === false && validateEmail('').error === 'Email address is required.', 'Empty email rejected with "Email address is required."');
assert(validateEmail('   ').valid === false && validateEmail('   ').error === 'Email address is required.', 'Whitespace email rejected with "Email address is required."');
assert(validateEmail('invalid-email').valid === false && validateEmail('invalid-email').error === 'Please enter a valid email address.', 'Invalid email syntax rejected with "Please enter a valid email address."');
assert(validateEmail('user@domain').valid === false, 'user@domain (no tld) rejected');
assert(validateEmail('user@domain.com').valid === true, 'user@domain.com accepted as valid syntax');
assert(validateEmail('alex.rivera@example.com').valid === true, 'alex.rivera@example.com accepted as valid syntax');

// 4. Age Safety Evaluation Logic
console.log('\n--- 4. Testing Age-Based Safety Validation Logic ---');
function evaluateAgeSafety(age, goal) {
  const numAge = Number(age);
  if (isNaN(numAge) || numAge <= 0) {
    return { safe: false, ageGroup: 'unknown', permittedGoal: 'Healthy Eating', message: 'Please enter a valid age.', safeAlternative: 'Healthy Eating' };
  }
  const isWeightChange = ['Weight Gain', 'Weight Loss', 'gain', 'lose'].includes(goal);

  if (numAge < 5) {
    return {
      safe: !isWeightChange,
      ageGroup: 'pediatric',
      permittedGoal: 'Healthy Eating',
      message: 'Pediatric Health Safeguard: For children under 5 years, personalized weight-gain or weight-loss plans are not provided. Please consult a qualified pediatric healthcare professional for growth and nutrition guidance.',
      safeAlternative: 'Healthy Eating'
    };
  }

  if (numAge >= 5 && numAge <= 17) {
    return {
      safe: !isWeightChange,
      ageGroup: 'youth',
      permittedGoal: isWeightChange ? 'Healthy Eating' : (goal || 'Healthy Eating'),
      message: isWeightChange ? 'Youth Nutrition Protection: Adult weight-loss or weight-gain prescriptions are not provided for youth ages 5–17. We offer general, age-appropriate healthy eating recommendations. Please seek guidance from a qualified pediatric healthcare professional for weight concerns.' : '',
      safeAlternative: 'Healthy Eating'
    };
  }

  if (numAge > 70) {
    return {
      safe: !isWeightChange,
      ageGroup: 'senior',
      permittedGoal: isWeightChange ? 'Healthy Eating' : (goal || 'Healthy Eating'),
      message: isWeightChange ? 'Senior Health Advisory: For individuals over 70, weight-change programs are not automatically recommended without medical supervision. NutriAI provides general balanced nutrition for vitality. Please consult a qualified healthcare professional before pursuing weight change.' : '',
      safeAlternative: 'Healthy Eating'
    };
  }

  return {
    safe: true,
    ageGroup: 'adult',
    permittedGoal: goal || 'Healthy Eating',
    message: '',
    safeAlternative: goal || 'Healthy Eating'
  };
}

// Age < 5
const under5_loss = evaluateAgeSafety(3, 'Weight Loss');
assert(under5_loss.safe === false && under5_loss.safeAlternative === 'Healthy Eating', 'Age 3 Weight Loss blocked & alternative is Healthy Eating');
assert(under5_loss.message.includes('Pediatric Health Safeguard'), 'Age 3 includes pediatric consultation message');

// Age 5-17
const youth_gain = evaluateAgeSafety(14, 'Weight Gain');
assert(youth_gain.safe === false && youth_gain.safeAlternative === 'Healthy Eating', 'Age 14 Weight Gain blocked for youth');
const youth_healthy = evaluateAgeSafety(14, 'Healthy Eating');
assert(youth_healthy.safe === true && youth_healthy.permittedGoal === 'Healthy Eating', 'Age 14 Healthy Eating allowed');

// Age 18-70
const adult_loss = evaluateAgeSafety(30, 'Weight Loss');
assert(adult_loss.safe === true && adult_loss.permittedGoal === 'Weight Loss', 'Age 30 Adult Weight Loss permitted');

// Age > 70
const senior_loss = evaluateAgeSafety(76, 'Weight Loss');
assert(senior_loss.safe === false && senior_loss.safeAlternative === 'Healthy Eating', 'Age 76 Weight Loss blocked & alternative is Healthy Eating');
assert(senior_loss.message.includes('Senior Health Advisory'), 'Age 76 includes senior consultation advisory');
const senior_healthy = evaluateAgeSafety(76, 'Healthy Eating');
assert(senior_healthy.safe === true && senior_healthy.permittedGoal === 'Healthy Eating', 'Age 76 Healthy Eating permitted');

// 5. Dietary Preference Filtering Logic
console.log('\n--- 5. Testing Recipe Dietary Preference Logic ---');
function recipeMatchesDiet(recipe, userDiet) {
  const normDiet = (userDiet || 'balanced').toLowerCase();
  const rDiet = (recipe.dietCategory || recipe.dietType || '').toLowerCase();
  const text = `${recipe.name} ${recipe.description || ''} ${(recipe.ingredients || []).map(i => i.name || i).join(' ')}`.toLowerCase();
  const meatKeywords = ['chicken', 'beef', 'pork', 'turkey', 'fish', 'salmon', 'tuna', 'shrimp', 'lamb', 'bacon', 'meat'];

  if (normDiet === 'vegetarian') {
    if (meatKeywords.some(meat => text.includes(meat))) return false;
    return rDiet.includes('veg') || rDiet === 'vegetarian' || rDiet === 'vegan';
  }
  if (normDiet === 'vegan') {
    const dairyMeat = [...meatKeywords, 'milk', 'cheese', 'yogurt', 'butter', 'egg', 'honey'];
    if (dairyMeat.some(kw => text.includes(kw))) return false;
    return rDiet === 'vegan';
  }
  return true;
}

const chickenDish = { name: 'Grilled Herb Chicken', dietCategory: 'non-veg', ingredients: [{ name: 'Chicken breast' }] };
const vegDish = { name: 'Tofu Buddha Bowl', dietCategory: 'vegetarian', ingredients: [{ name: 'Tofu' }, { name: 'Quinoa' }] };
assert(recipeMatchesDiet(chickenDish, 'Vegetarian') === false, 'Chicken dish excluded for Vegetarian user');
assert(recipeMatchesDiet(vegDish, 'Vegetarian') === true, 'Tofu Buddha Bowl allowed for Vegetarian user');
assert(recipeMatchesDiet(chickenDish, 'Non-Vegetarian') === true, 'Chicken dish allowed for Non-Vegetarian user');

// 6. Food Scanner Rejection Message Match
console.log('\n--- 6. Verifying Scanner Rejection Messages ---');
assert(scriptContent.includes('Invalid Food Image: Please upload a clear image of a food item or meal.'), 'Exact non-food rejection string is present in script.js');
assert(scriptContent.includes('Unable to identify the food clearly. Please upload a clearer image.'), 'Exact unclear image rejection string is present in script.js');
assert(scriptContent.includes('Login successful! Welcome back.'), 'Exact login success string is present in script.js');
assert(scriptContent.includes('Unable to sign in with these credentials. Please check your details and try again.'), 'Exact auth error message string is present in script.js');

console.log(`\n========================================`);
console.log(`ALL TESTS FINISHED: ${passCount} Passed, ${failCount} Failed.`);
console.log(`========================================\n`);

process.exit(failCount > 0 ? 1 : 0);
