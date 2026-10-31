const assert = require('assert');

// Simulate client localStorage
const localStorageStore = {};
global.localStorage = {
  getItem: (k) => localStorageStore[k] || null,
  setItem: (k, v) => { localStorageStore[k] = String(v); },
  removeItem: (k) => { delete localStorageStore[k]; },
  clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
};

// Simulate minimal DOM
const elements = {};
function createMockElement(id) {
  return {
    id,
    textContent: '',
    innerHTML: '',
    style: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); }
    },
    checked: false,
    disabled: false,
    getAttribute(attr) { return this[attr]; },
    setAttribute(attr, val) { this[attr] = val; }
  };
}

global.document = {
  getElementById: (id) => {
    if (!elements[id]) elements[id] = createMockElement(id);
    return elements[id];
  },
  querySelectorAll: (selector) => {
    if (selector.includes('.water-glass-btn')) {
      const glasses = [];
      for (let i = 1; i <= 8; i++) {
        const g = createMockElement(`glass_${i}`);
        g.getAttribute = (attr) => attr === 'data-cup' ? String(i) : null;
        glasses.push(g);
      }
      return glasses;
    }
    return [];
  }
};

global.showToast = () => {};

// State management definitions matching script.js
const ACCOUNTS_DB_KEY = 'nutriai_accounts_db_v3';
const ACTIVE_USER_KEY = 'nutriai_auth_user_session_v4';

function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

let ActiveUser = null;

function getTodayWaterLogs() {
  if (!ActiveUser || !Array.isArray(ActiveUser.waterLogs)) return [];
  const today = getTodayDateString();
  return ActiveUser.waterLogs.filter(w => w.date === today);
}

function getTodayWaterMl() {
  const logs = getTodayWaterLogs();
  return logs.reduce((sum, w) => sum + (Number(w.amountMl) || 250), 0);
}

function getTodayWaterCups() {
  return Math.round(getTodayWaterMl() / 250);
}

function addWater(amountMl = 250, silent = false) {
  if (!ActiveUser) return;
  if (!Array.isArray(ActiveUser.waterLogs)) ActiveUser.waterLogs = [];
  ActiveUser.waterLogs.push({
    id: 'w_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    amountMl: amountMl,
    date: getTodayDateString(),
    timestamp: new Date().toISOString()
  });
  ActiveUser.hydrationCups = getTodayWaterCups();
}

function removeWater(amountMl = 250, silent = false) {
  if (!ActiveUser || !Array.isArray(ActiveUser.waterLogs)) return;
  const today = getTodayDateString();
  for (let i = ActiveUser.waterLogs.length - 1; i >= 0; i--) {
    if (ActiveUser.waterLogs[i].date === today) {
      ActiveUser.waterLogs.splice(i, 1);
      break;
    }
  }
  ActiveUser.hydrationCups = getTodayWaterCups();
}

function renderTodayMealStatus() {
  if (!ActiveUser) return;
  if (!ActiveUser.todayLogs) {
    ActiveUser.todayLogs = { breakfast: [], morning_snacks: [], lunch: [], evening_snacks: [], dinner: [] };
  }

  const mealSlots = [
    { key: 'breakfast', cardId: 'dash-status-card-breakfast', chkId: 'status-chk-breakfast', labelId: 'status-label-breakfast' },
    { key: 'morning_snacks', cardId: 'dash-status-card-morning-snacks', chkId: 'status-chk-morning-snacks', labelId: 'status-label-morning-snacks' },
    { key: 'lunch', cardId: 'dash-status-card-lunch', chkId: 'status-chk-lunch', labelId: 'status-label-lunch' },
    { key: 'evening_snacks', cardId: 'dash-status-card-evening-snacks', chkId: 'status-chk-evening-snacks', labelId: 'status-label-evening-snacks' },
    { key: 'dinner', cardId: 'dash-status-card-dinner', chkId: 'status-chk-dinner', labelId: 'status-label-dinner' }
  ];

  let completedCount = 0;
  mealSlots.forEach(slot => {
    const logs = ActiveUser.todayLogs[slot.key];
    const isLogged = Array.isArray(logs) && logs.length > 0;
    if (isLogged) completedCount++;

    const card = document.getElementById(slot.cardId);
    const chk = document.getElementById(slot.chkId);
    const label = document.getElementById(slot.labelId);

    if (card) {
      if (isLogged) {
        card.classList.add('logged');
        card.classList.add('completed');
      } else {
        card.classList.remove('logged');
        card.classList.remove('completed');
      }
    }
    if (chk) chk.checked = isLogged;
    if (label) label.textContent = isLogged ? 'Logged' : 'Not Logged';
  });

  const percentEl = document.getElementById('dash-completion-percent');
  if (percentEl) {
    percentEl.textContent = `${completedCount} of 5 Meals Logged`;
  }
}

function runStateTests() {
  console.log('--- Testing Client Meal Status & Water Logic ---');

  // Initialize a new user session
  ActiveUser = {
    id: 'usr_test',
    email: 'test@example.com',
    todayDate: getTodayDateString(),
    todayLogs: {
      breakfast: [],
      morning_snacks: [],
      lunch: [],
      evening_snacks: [],
      dinner: []
    },
    waterLogs: [],
    hydrationCups: 0
  };

  // Scenario 1: Initial state without logged meals
  renderTodayMealStatus();
  assert.strictEqual(document.getElementById('status-label-breakfast').textContent, 'Not Logged');
  assert.strictEqual(document.getElementById('status-label-morning-snacks').textContent, 'Not Logged');
  assert.strictEqual(document.getElementById('status-label-lunch').textContent, 'Not Logged');
  assert.strictEqual(document.getElementById('status-label-evening-snacks').textContent, 'Not Logged');
  assert.strictEqual(document.getElementById('status-label-dinner').textContent, 'Not Logged');
  assert.strictEqual(document.getElementById('dash-completion-percent').textContent, '0 of 5 Meals Logged');
  console.log('✓ Scenario 1: Empty day initially shows "Not Logged" for all 5 meals and "0 of 5 Meals Logged"');

  // Scenario 2: Log breakfast
  ActiveUser.todayLogs.breakfast.push({ id: 'log_1', name: 'Oatmeal', cal: 300 });
  renderTodayMealStatus();
  assert.strictEqual(document.getElementById('status-label-breakfast').textContent, 'Logged');
  assert.strictEqual(document.getElementById('status-chk-breakfast').checked, true);
  assert.strictEqual(document.getElementById('status-label-lunch').textContent, 'Not Logged');
  assert.strictEqual(document.getElementById('dash-completion-percent').textContent, '1 of 5 Meals Logged');
  console.log('✓ Scenario 2: Logging breakfast updates breakfast to "Logged" while other meals remain "Not Logged"');

  // Scenario 3: Remove breakfast
  ActiveUser.todayLogs.breakfast.splice(0, 1);
  renderTodayMealStatus();
  assert.strictEqual(document.getElementById('status-label-breakfast').textContent, 'Not Logged');
  assert.strictEqual(document.getElementById('status-chk-breakfast').checked, false);
  assert.strictEqual(document.getElementById('dash-completion-percent').textContent, '0 of 5 Meals Logged');
  console.log('✓ Scenario 3: Removing breakfast immediately returns status to "Not Logged"');

  // Scenario 4: Log lunch and dinner
  ActiveUser.todayLogs.lunch.push({ id: 'log_2', name: 'Quinoa Bowl', cal: 450 });
  ActiveUser.todayLogs.dinner.push({ id: 'log_3', name: 'Lentil Soup', cal: 380 });
  renderTodayMealStatus();
  assert.strictEqual(document.getElementById('status-label-breakfast').textContent, 'Not Logged');
  assert.strictEqual(document.getElementById('status-label-lunch').textContent, 'Logged');
  assert.strictEqual(document.getElementById('status-label-dinner').textContent, 'Logged');
  assert.strictEqual(document.getElementById('status-label-morning-snacks').textContent, 'Not Logged');
  assert.strictEqual(document.getElementById('status-label-evening-snacks').textContent, 'Not Logged');
  assert.strictEqual(document.getElementById('dash-completion-percent').textContent, '2 of 5 Meals Logged');
  console.log('✓ Scenario 4: Logging lunch and dinner independently shows only lunch and dinner as "Logged"');

  // Scenario 5: Refresh/Persistence simulation
  const serialized = JSON.stringify(ActiveUser);
  ActiveUser = JSON.parse(serialized);
  renderTodayMealStatus();
  assert.strictEqual(document.getElementById('status-label-lunch').textContent, 'Logged');
  assert.strictEqual(document.getElementById('status-label-dinner').textContent, 'Logged');
  assert.strictEqual(document.getElementById('status-label-breakfast').textContent, 'Not Logged');
  console.log('✓ Scenario 5: Reload / refresh preserves actual saved meal status accurately');

  // Water Tracking Scenarios:
  // Water 1: Initial empty state
  assert.strictEqual(getTodayWaterMl(), 0);
  assert.strictEqual(getTodayWaterCups(), 0);
  console.log('✓ Water 1: Initially 0 ml and 0 cups');

  // Water 2: Add water
  addWater(250);
  assert.strictEqual(getTodayWaterMl(), 250);
  assert.strictEqual(getTodayWaterCups(), 1);
  addWater(250);
  assert.strictEqual(getTodayWaterMl(), 500);
  assert.strictEqual(getTodayWaterCups(), 2);
  console.log('✓ Water 2: Adding water increments total accurately (250 ml -> 500 ml)');

  // Water 3: Remove water
  removeWater(250);
  assert.strictEqual(getTodayWaterMl(), 250);
  assert.strictEqual(getTodayWaterCups(), 1);
  console.log('✓ Water 3: Removing water decrements total accurately (500 ml -> 250 ml)');

  // Water 4: Remove all entries
  removeWater(250);
  assert.strictEqual(getTodayWaterMl(), 0);
  assert.strictEqual(getTodayWaterCups(), 0);
  console.log('✓ Water 4: Removing all entries returns total to 0 ml and 0 cups');

  // Water 5: Persistence
  addWater(250);
  addWater(250);
  addWater(250);
  const userWaterState = JSON.parse(JSON.stringify(ActiveUser));
  ActiveUser = userWaterState;
  assert.strictEqual(getTodayWaterMl(), 750);
  assert.strictEqual(getTodayWaterCups(), 3);
  console.log('✓ Water 5: Total water persisted and accurately calculated from records on refresh');

  console.log('\n--- All Meal Status & Water Tracking Scenarios Passed! ---');
}

runStateTests();
