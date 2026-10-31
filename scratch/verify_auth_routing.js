/**
 * Automated Verification Script for NutriAI Authentication & Initial Routing
 * Pure Node.js (No external dependencies)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('=== STARTING NUTRIAI AUTH & ROUTING VERIFICATION ===\n');

const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scriptContent = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName} ${details ? '(' + details + ')' : ''}`);
    failCount++;
  }
}

// ----------------------------------------------------------------------------
// 1. RAW HTML INSPECTION
// ----------------------------------------------------------------------------
console.log('--- 1. Raw HTML View Classes & Structure ---');
assert(htmlContent.includes('<section class="page-view active" id="view-login">'), 'view-login has class="page-view active" in raw HTML');
assert(htmlContent.includes('<section class="page-view" id="view-home">'), 'view-home does NOT have "active" in raw HTML');
assert(htmlContent.includes('<section class="page-view" id="view-dashboard">'), 'view-dashboard does NOT have "active" in raw HTML');
assert(htmlContent.includes('<section class="page-view" id="view-user-profile">'), 'view-user-profile does NOT have "active" in raw HTML');

// Check Login/Register form elements in HTML
assert(htmlContent.includes('id="login-form"'), '#login-form exists in HTML');
assert(htmlContent.includes('id="login-email"'), '#login-email exists in HTML');
assert(htmlContent.includes('id="login-password"'), '#login-password exists in HTML');
assert(htmlContent.includes('id="login-submit-btn"'), '#login-submit-btn exists in HTML');
assert(htmlContent.includes('href="#register"'), 'Link to switch to #register exists');
assert(htmlContent.includes('href="#login"'), 'Link to switch to #login exists');
assert(htmlContent.includes('id="profile-logout-btn"'), '#profile-logout-btn (Sign Out / Switch Account) exists in User Profile');

// Check that public actions in nav have Login and Get Started
assert(htmlContent.includes('id="public-auth-actions"'), '#public-auth-actions exists in Navbar');
assert(htmlContent.includes('data-nav="login"'), 'Navbar has link with data-nav="login"');
assert(htmlContent.includes('data-nav="register"'), 'Navbar has link with data-nav="register"');

// ----------------------------------------------------------------------------
// 2. SIMULATED BROWSER RUNTIME TESTS
// ----------------------------------------------------------------------------
console.log('\n--- 2. Simulated DOM & Script Execution ---');

function createDOMEnvironment(initialHash = '', initialLocalStorage = {}) {
  const store = { ...initialLocalStorage };

  const localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };

  class ClassList {
    constructor() { this.classes = new Set(); }
    add(...cls) { cls.forEach(c => this.classes.add(c)); }
    remove(...cls) { cls.forEach(c => this.classes.delete(c)); }
    contains(c) { return this.classes.has(c); }
    toggle(c, force) {
      if (force !== undefined) {
        if (force) this.add(c);
        else this.remove(c);
      } else {
        if (this.contains(c)) this.remove(c);
        else this.add(c);
      }
    }
    get value() { return Array.from(this.classes).join(' '); }
  }

  const elements = new Map();

  function createElement(id, tagName = 'div', classes = '') {
    const el = {
      id,
      tagName: tagName.toUpperCase(),
      classList: new ClassList(),
      style: {},
      attributes: {},
      listeners: {},
      value: '',
      textContent: '',
      innerHTML: '',
      checked: false,
      disabled: false,
      setAttribute(k, v) { this.attributes[k] = v; },
      getAttribute(k) { return this.attributes[k] || null; },
      removeAttribute(k) { delete this.attributes[k]; },
      addEventListener(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
      },
      dispatchEvent(event) {
        const fns = this.listeners[event.type] || [];
        fns.forEach(fn => fn(event));
      },
      appendChild(child) {
        if (!this.children) this.children = [];
        this.children.push(child);
      },
      click() {
        this.dispatchEvent({ type: 'click', preventDefault: () => {} });
      },
      focus() {},
      blur() {
        this.dispatchEvent({ type: 'blur' });
      },
      remove() {}
    };

    if (classes) {
      classes.split(' ').forEach(c => c && el.classList.add(c));
    }
    elements.set(id, el);
    return el;
  }

  // Pre-populate core views and elements from index.html
  const viewNames = [
    'login', 'register', 'home', 'dashboard', 'user-profile', 'meal-plan',
    'nutrition-tracking', 'favorites', 'calorie-calculator', 'bmi-calculator',
    'ai-food-scanner', 'ai-chatbot', 'progress-analytics', 'settings',
    'onboarding', 'privacy', 'terms', 'forgot-password'
  ];

  viewNames.forEach(name => {
    const el = createElement(`view-${name}`, 'section', 'page-view');
    if (name === 'login') el.classList.add('active'); // Matches updated HTML
  });

  // Nav elements
  createElement('public-nav-links', 'nav');
  createElement('auth-nav-links', 'nav');
  createElement('public-auth-actions', 'div');
  createElement('user-auth-actions', 'div');
  createElement('mobile-public-links', 'ul');
  createElement('mobile-auth-links', 'ul');
  createElement('demo-btn-text', 'span');
  createElement('mobile-demo-text', 'span');
  createElement('user-nav-name', 'span');
  createElement('user-avatar-initials', 'div');
  createElement('demo-toggle-btn', 'button');
  createElement('mobile-demo-btn', 'button');
  createElement('login-quick-demo-btn', 'button');
  createElement('logout-btn', 'button');
  createElement('mobile-logout-link', 'a');
  createElement('profile-logout-btn', 'button');
  createElement('theme-icon', 'i');
  createElement('toast-container', 'div');

  // Login form elements
  const loginForm = createElement('login-form', 'form');
  const loginEmail = createElement('login-email', 'input');
  const loginPass = createElement('login-password', 'input');
  const loginSubmit = createElement('login-submit-btn', 'button');
  const loginSpinner = createElement('login-submit-spinner', 'span');
  const loginText = createElement('login-submit-text', 'span');
  createElement('login-email-error', 'div');
  createElement('login-password-error', 'div');
  createElement('login-form-error', 'div');

  // Profile elements
  createElement('prof-display-name', 'input');
  createElement('prof-display-email', 'input');
  createElement('profile-name-heading', 'h1');
  createElement('profile-avatar-large', 'div');
  createElement('profile-diet-badge', 'div');
  createElement('profile-plan-meta', 'div');
  createElement('profile-edit-form', 'form');

  const documentListeners = {};
  const windowListeners = {};

  const documentMock = {
    documentElement: {
      setAttribute: () => {},
      getAttribute: () => 'light'
    },
    getElementById(id) {
      if (!elements.has(id)) {
        return createElement(id);
      }
      return elements.get(id);
    },
    querySelectorAll(selector) {
      if (selector === '.page-view') {
        return viewNames.map(name => elements.get(`view-${name}`));
      }
      if (selector === '[data-nav]') {
        return [];
      }
      if (selector.includes('#')) {
        const ids = selector.split(',').map(s => s.trim().replace(/^#/, ''));
        return ids.map(id => documentMock.getElementById(id));
      }
      return [];
    },
    querySelector(selector) {
      if (selector.startsWith('#')) return documentMock.getElementById(selector.slice(1));
      return null;
    },
    createElement(tag) {
      return createElement('dynamic_' + Math.random(), tag);
    },
    addEventListener(event, fn) {
      if (!documentListeners[event]) documentListeners[event] = [];
      documentListeners[event].push(fn);
    },
    dispatchEvent(event) {
      const fns = documentListeners[event.type] || [];
      fns.forEach(fn => fn(event));
    }
  };

  const windowMock = {
    location: {
      hash: initialHash
    },
    localStorage,
    document: documentMock,
    crypto: {
      subtle: {
        digest: async (algo, data) => {
          const hash = crypto.createHash('sha256');
          hash.update(Buffer.from(data));
          return hash.digest();
        }
      }
    },
    scrollTo() {},
    NutriIcons: { renderAll: () => {}, render: () => '' },
    addEventListener(event, fn) {
      if (!windowListeners[event]) windowListeners[event] = [];
      windowListeners[event].push(fn);
    },
    dispatchEvent(event) {
      const fns = windowListeners[event.type] || [];
      fns.forEach(fn => fn(event));
    }
  };

  // Run script.js in this sandbox context
  const vm = require('vm');
  const sandbox = {
    window: windowMock,
    document: documentMock,
    localStorage,
    crypto: windowMock.crypto,
    setTimeout: (fn) => fn(),
    setInterval: () => 1,
    clearInterval: () => {},
    clearTimeout: () => {},
    console: { log: () => {}, warn: () => {}, error: () => {} },
    FileReader: class {
      readAsDataURL() {}
    },
    Event: class {
      constructor(type) { this.type = type; }
    }
  };

  vm.createContext(sandbox);
  vm.runInContext(scriptContent, sandbox);

  return { window: windowMock, document: documentMock, localStorage, store };
}

// ----------------------------------------------------------------------------
// TEST 2A: First Visit with No Hash & Empty Storage
// ----------------------------------------------------------------------------
console.log('\n--- Test 2A: First Visit (Empty Storage & Empty Hash) ---');
const env1 = createDOMEnvironment('');
env1.document.dispatchEvent({ type: 'DOMContentLoaded' });

assert(env1.window.location.hash === '#login', `Hash redirected to #login on first visit (Actual: ${env1.window.location.hash})`);
const loginEl = env1.document.getElementById('view-login');
assert(loginEl.classList.contains('active'), '#view-login is active');
const publicActions = env1.document.getElementById('public-auth-actions');
assert(publicActions.style.display !== 'none', 'Public actions (Login/Get Started) visible in nav');
const userActions = env1.document.getElementById('user-auth-actions');
assert(userActions.style.display === 'none', 'User actions hidden in nav');

// ----------------------------------------------------------------------------
// TEST 2B: First Visit with #dashboard in Hash (Unauthenticated Route Protection)
// ----------------------------------------------------------------------------
console.log('\n--- Test 2B: Direct unauthenticated visit to #dashboard ---');
const env2 = createDOMEnvironment('#dashboard');
env2.document.dispatchEvent({ type: 'DOMContentLoaded' });

assert(env2.window.location.hash === '#login', `Direct access to #dashboard redirects to #login (Actual: ${env2.window.location.hash})`);
assert(env2.document.getElementById('view-login').classList.contains('active'), '#view-login is active');

// ----------------------------------------------------------------------------
// TEST 2C: Direct unauthenticated visit to #user-profile (Route Protection)
// ----------------------------------------------------------------------------
console.log('\n--- Test 2C: Direct unauthenticated visit to #user-profile ---');
const env3 = createDOMEnvironment('#user-profile');
env3.document.dispatchEvent({ type: 'DOMContentLoaded' });

assert(env3.window.location.hash === '#login', `Direct access to #user-profile redirects to #login (Actual: ${env3.window.location.hash})`);
assert(env3.document.getElementById('view-login').classList.contains('active'), '#view-login is active');

// ----------------------------------------------------------------------------
// TEST 3: Login Authentication Flow
// ----------------------------------------------------------------------------
console.log('\n--- Test 3: Login Authentication via 1-Click Demo ---');
const envLogin = createDOMEnvironment('#login');
envLogin.document.dispatchEvent({ type: 'DOMContentLoaded' });

const demoBtn = envLogin.document.getElementById('login-quick-demo-btn');
demoBtn.click();

assert(envLogin.window.location.hash === '#dashboard', `Successful login navigates to #dashboard (Actual: ${envLogin.window.location.hash})`);
assert(envLogin.document.getElementById('view-dashboard').classList.contains('active'), '#view-dashboard is active');
assert(envLogin.localStorage.getItem('nutriai_auth_user_session_v4') === 'alex.rivera@example.com', 'Active user session saved in localStorage');
assert(envLogin.document.getElementById('public-auth-actions').style.display === 'none', 'Navbar public actions hidden when logged in');
assert(envLogin.document.getElementById('user-auth-actions').style.display === 'flex', 'Navbar user menu displayed when logged in');

// ----------------------------------------------------------------------------
// TEST 4: Returning User (Page Refresh with Authenticated Session)
// ----------------------------------------------------------------------------
console.log('\n--- Test 4: Returning User Page Refresh ---');
const envReturning = createDOMEnvironment('#dashboard', {
  'nutriai_auth_user_session_v4': 'alex.rivera@example.com'
});
envReturning.document.dispatchEvent({ type: 'DOMContentLoaded' });

assert(envReturning.window.location.hash === '#dashboard', `Returning user stays on #dashboard (Actual: ${envReturning.window.location.hash})`);
assert(envReturning.document.getElementById('view-dashboard').classList.contains('active'), '#view-dashboard is active on refresh');
assert(envReturning.document.getElementById('public-auth-actions').style.display === 'none', 'Public actions remain hidden for returning user');
assert(envReturning.document.getElementById('user-auth-actions').style.display === 'flex', 'User actions remain visible for returning user');

// ----------------------------------------------------------------------------
// TEST 5: User Profile Sign Out Button & Logout Flow
// ----------------------------------------------------------------------------
console.log('\n--- Test 5: Profile Sign Out & Logout ---');
const envProfile = createDOMEnvironment('#user-profile', {
  'nutriai_auth_user_session_v4': 'alex.rivera@example.com'
});
envProfile.document.dispatchEvent({ type: 'DOMContentLoaded' });

assert(envProfile.document.getElementById('view-user-profile').classList.contains('active'), '#view-user-profile is active for logged in user');

const profLogoutBtn = envProfile.document.getElementById('profile-logout-btn');
assert(profLogoutBtn !== null, '#profile-logout-btn exists');

// Click Sign Out
profLogoutBtn.click();

assert(envProfile.window.location.hash === '#login', `Profile Sign Out redirects to #login (Actual: ${envProfile.window.location.hash})`);
assert(envProfile.document.getElementById('view-login').classList.contains('active'), '#view-login is active after logout');
assert(envProfile.localStorage.getItem('nutriai_auth_user_session_v4') === null, 'Session removed from localStorage after logout');
assert(envProfile.document.getElementById('public-auth-actions').style.display !== 'none', 'Public nav actions restored after logout');

// ----------------------------------------------------------------------------
// TEST 6: Legacy Session Cleanup
// ----------------------------------------------------------------------------
console.log('\n--- Test 6: Legacy Session Key Cleanup ---');
const envLegacy = createDOMEnvironment('', {
  'nutriai_active_user_session_v3': 'alex.rivera@example.com'
});
envLegacy.document.dispatchEvent({ type: 'DOMContentLoaded' });

assert(envLegacy.localStorage.getItem('nutriai_active_user_session_v3') === null, 'Legacy v3 session key removed on startup');
assert(envLegacy.window.location.hash === '#login', 'User not trapped by legacy v3 session; opens #login');

// ----------------------------------------------------------------------------
// SUMMARY
// ----------------------------------------------------------------------------
console.log(`\n==============================================`);
console.log(`VERIFICATION SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log(`==============================================\n`);

if (failCount > 0) process.exit(1);
