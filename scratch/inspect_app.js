const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const htmlLines = html.split('\n');

console.log('=== HTML LOCATIONS ===');
htmlLines.forEach((l, i) => {
  if (
    l.includes('id="view-login"') ||
    l.includes('id="view-register"') ||
    l.includes('id="view-dashboard"') ||
    l.includes('Today\'s Meal') ||
    l.includes('meal-completion') ||
    l.includes('water-card') ||
    l.includes('id="water-') ||
    l.includes('logout')
  ) {
    console.log(`${i + 1}: ${l.trim().substring(0, 100)}`);
  }
});

const script = fs.readFileSync('script.js', 'utf8');
const scriptLines = script.split('\n');
console.log('\n=== SCRIPT LOCATIONS ===');
scriptLines.forEach((l, i) => {
  if (
    l.includes('function setupAuthListeners') ||
    l.includes('function handleLogin') ||
    l.includes('function handleRegister') ||
    l.includes('function updateMealStatus') ||
    l.includes('function renderTodayMealStatus') ||
    l.includes('function renderDashboard') ||
    l.includes('function setupDashboard') ||
    l.includes('function updateWater') ||
    l.includes('function addWater') ||
    l.includes('function removeWater') ||
    l.includes('function renderWater') ||
    l.includes('ACCOUNTS_DB') ||
    l.includes('ACTIVE_USER_KEY') ||
    l.includes('todayLogs') ||
    l.includes('hydration') ||
    l.includes('waterLogs') ||
    l.includes('logoutUser')
  ) {
    console.log(`${i + 1}: ${l.trim().substring(0, 100)}`);
  }
});
