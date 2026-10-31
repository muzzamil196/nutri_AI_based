const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const htmlLines = html.split('\n');
console.log('--- HTML Sections ---');
htmlLines.forEach((l, i) => {
  if (
    l.includes('id="view-login"') ||
    l.includes('id="view-register"') ||
    l.includes('Today\'s Meal') ||
    l.includes('meal-completion') ||
    l.includes('id="water-') ||
    l.includes('water-card') ||
    l.includes('meal-card') ||
    l.includes('logout')
  ) {
    console.log(`${i + 1}: ${l.trim().substring(0, 100)}`);
  }
});

const script = fs.readFileSync('script.js', 'utf8');
const scriptLines = script.split('\n');
console.log('\n--- Script.js Sections ---');
scriptLines.forEach((l, i) => {
  if (
    l.includes('function loginUser') ||
    l.includes('function registerUser') ||
    l.includes('login-form') ||
    l.includes('register-form') ||
    l.includes('updateMealStatus') ||
    l.includes('renderTodayMealStatus') ||
    l.includes('renderDashboard') ||
    l.includes('mealCompletion') ||
    l.includes('waterIntake') ||
    l.includes('addWater') ||
    l.includes('removeWater') ||
    l.includes('updateWater') ||
    l.includes('ACCOUNTS_DB') ||
    l.includes('ActiveUser')
  ) {
    if (l.trim().length < 120) {
      console.log(`${i + 1}: ${l.trim()}`);
    }
  }
});
