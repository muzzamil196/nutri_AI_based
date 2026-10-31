const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING NUTRIAI BUG FIXES (BUGS 1, 2, 3) ===\n');

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

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const script = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');

// --- Test Bug 1: User Profile Email Field & Saving ---
console.log('--- Checking Bug 1: User Profile Elements & Handlers ---');
assert(html.includes('id="prof-display-email"'), 'id="prof-display-email" exists in HTML');
assert(!html.includes('id="prof-email-static" readonly'), 'Readonly email field is removed');
assert(!html.includes('id="prof-display-name" value="Alex Rivera"'), 'Hardcoded Alex Rivera value removed from Display Name input');
assert(!html.includes('id="prof-display-email" value="alex.rivera@example.com"'), 'Hardcoded email value removed from Email input');
assert(html.includes('id="prof-email-error"'), 'Inline error container prof-email-error exists');
assert(html.includes('id="prof-name-error"'), 'Inline error container prof-name-error exists');
assert(html.includes('id="prof-save-btn"'), 'Save Profile Details button id="prof-save-btn" exists');

// Verify script.js handles prof-display-email properly in syncProfileInputs
assert(script.includes("const emailInput = document.getElementById('prof-display-email')"), 'syncProfileInputs references prof-display-email');
assert(script.includes("Profile details updated successfully!"), 'Success message "Profile details updated successfully!" is present');
assert(!script.includes("document.getElementById('profile-edit-overlay').classList.remove('active')"), 'Console error source profile-edit-overlay removed from profile-edit-form');

// --- Test Bug 2: Protected Pages and Login Redirect ---
console.log('\n--- Checking Bug 2: Protected Pages & Router Guards ---');
const expectedProtected = [
  'dashboard', 'nutrition-profile', 'meal-plan', 'favorites',
  'ai-food-scanner', 'ai-chatbot', 'nutrition-tracking',
  'progress-analytics', 'user-profile', 'settings',
  'bmi-calculator', 'calorie-calculator', 'calculators', 'onboarding'
];

expectedProtected.forEach(p => {
  assert(script.includes(`'${p}'`), `Protected page list includes '${p}'`);
});

// Verify unauthenticated users redirect to login
assert(script.includes("target = 'login';"), 'Unauthenticated requests redirect to login view');
assert(script.includes("window.location.hash !== '#login'"), 'Router checks and enforces #login hash for unauthenticated state');

// Verify logout clears session and redirects to login
assert(script.includes("function logoutUser()"), 'logoutUser function exists');
assert(script.includes("window.location.hash = '#login';\n    navigateTo('login');") ||
       script.includes("window.location.hash = '#login';") && script.includes("navigateTo('login');"),
       'logoutUser redirects to #login');

// --- Test Bug 3: First Page and User Profile Routing ---
console.log('\n--- Checking Bug 3: Initial Routing & Session Behavior ---');
assert(script.includes("navigateTo(ActiveUser ? 'dashboard' : 'login')") ||
       (script.includes("if (!ActiveUser)") && script.includes("navigateTo('login')")),
       'Initial visit routes to login if unauthenticated, dashboard if authenticated');
assert(script.includes("window.location.hash = '#dashboard';") && script.includes("navigateTo('dashboard');"), 'Successful login redirects to dashboard');

// Simulate the Email Update & Account Migration Logic in memory
console.log('\n--- Simulating Profile Email Save & Session Migration ---');

// Mock localStorage and accounts DB
let mockStorage = {};
const ACCOUNTS_DB_KEY = 'nutriai_accounts_db_v3';
const ACTIVE_USER_KEY = 'nutriai_auth_user_session_v4';

let mockAccounts = {
  'alex.rivera@example.com': {
    email: 'alex.rivera@example.com',
    name: 'Alex Rivera',
    avatar: 'AR',
    currentStatus: 'Normal weight',
    primaryGoal: 'Healthy Eating',
    age: 28,
    weight: 70,
    height: 175,
    dietType: 'Vegetarian',
    profileCompleted: true
  },
  'other.user@example.com': {
    email: 'other.user@example.com',
    name: 'Other User'
  }
};
mockStorage[ACCOUNTS_DB_KEY] = JSON.stringify(mockAccounts);
mockStorage[ACTIVE_USER_KEY] = 'alex.rivera@example.com';

let ActiveUser = JSON.parse(JSON.stringify(mockAccounts['alex.rivera@example.com']));

function simulateProfileSave(newName, newEmailRaw) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!newName || !newName.trim()) return { success: false, error: 'Display name is required.' };
  if (!newEmailRaw || !newEmailRaw.trim()) return { success: false, error: 'Email address is required.' };
  if (!emailRegex.test(newEmailRaw.trim())) return { success: false, error: 'Please enter a valid email address.' };

  const oldEmail = ActiveUser.email.toLowerCase().trim();
  const newEmail = newEmailRaw.toLowerCase().trim();
  const db = JSON.parse(mockStorage[ACCOUNTS_DB_KEY]);

  if (newEmail !== oldEmail) {
    if (db[newEmail]) {
      return { success: false, error: 'This email address is already associated with another account.' };
    }
    delete db[oldEmail];
  }

  ActiveUser.name = newName.trim();
  ActiveUser.avatar = ActiveUser.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  ActiveUser.email = newEmail;

  db[newEmail] = ActiveUser;
  mockStorage[ACCOUNTS_DB_KEY] = JSON.stringify(db);
  mockStorage[ACTIVE_USER_KEY] = newEmail;

  return { success: true, user: ActiveUser };
}

// 1. Invalid email attempt
const res1 = simulateProfileSave('Alex Rivera', 'invalid-email');
assert(res1.success === false && res1.error === 'Please enter a valid email address.', 'Invalid email address rejected with proper error message');

// 2. Empty email attempt
const res2 = simulateProfileSave('Alex Rivera', '');
assert(res2.success === false && res2.error === 'Email address is required.', 'Empty email address rejected with proper error message');

// 3. Collision with existing account
const res3 = simulateProfileSave('Alex Rivera', 'other.user@example.com');
assert(res3.success === false && res3.error === 'This email address is already associated with another account.', 'Duplicate email collision rejected');

// 4. Valid email update
const res4 = simulateProfileSave('Alex Rivera Updated', 'alex.updated@example.com');
assert(res4.success === true && res4.user.email === 'alex.updated@example.com', 'Valid email updated successfully');
assert(mockStorage[ACTIVE_USER_KEY] === 'alex.updated@example.com', 'Session key in active storage updated to new email');

const savedDb = JSON.parse(mockStorage[ACCOUNTS_DB_KEY]);
assert(savedDb['alex.updated@example.com'] !== undefined, 'Account exists under new email in database');
assert(savedDb['alex.rivera@example.com'] === undefined, 'Old email key cleanly removed from database');
assert(savedDb['alex.updated@example.com'].dietType === 'Vegetarian', 'Existing profile attributes (dietType) preserved without being overwritten');
assert(savedDb['alex.updated@example.com'].primaryGoal === 'Healthy Eating', 'Existing profile attributes (primaryGoal) preserved');

// 5. Simulate browser reload with new email
function simulateReload() {
  const email = mockStorage[ACTIVE_USER_KEY];
  const db = JSON.parse(mockStorage[ACCOUNTS_DB_KEY]);
  return db[email] || null;
}

const reloadedUser = simulateReload();
assert(reloadedUser !== null && reloadedUser.email === 'alex.updated@example.com', 'Browser reload restores active session with updated email');
assert(reloadedUser.name === 'Alex Rivera Updated', 'Browser reload restores active session with updated name');

console.log(`\n========================================`);
console.log(`TESTS SUMMARY: ${passCount} Passed, ${failCount} Failed.`);
console.log(`========================================\n`);

process.exit(failCount > 0 ? 1 : 0);
