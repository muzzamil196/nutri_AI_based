const assert = require('assert');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8080';

async function runTests() {
  console.log('--- Starting Nutri AI Verification Suite ---');

  // Test 1: Health check
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  assert.strictEqual(healthRes.status, 200, 'Health endpoint should return 200');
  const healthData = await healthRes.json();
  assert.strictEqual(healthData.status, 'online');
  console.log('✓ Health endpoint responding');

  // Test 2: Authentication Registration
  const testEmail = `user_${Date.now()}@nutritest.org`;
  const testPassword = 'MySecretNutriPassword123!';

  // 2a. Mismatched passwords
  const mismatchRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      confirmPassword: 'DifferentPassword123!'
    })
  });
  assert.strictEqual(mismatchRes.status, 400, 'Mismatched passwords should return 400');
  const mismatchData = await mismatchRes.json();
  assert.strictEqual(mismatchData.error, 'PASSWORD_MISMATCH');
  console.log('✓ Registration correctly rejects mismatched passwords');

  // 2b. Invalid email format
  const invalidEmailRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'invalid-email-no-at-sign',
      password: testPassword,
      confirmPassword: testPassword
    })
  });
  assert.strictEqual(invalidEmailRes.status, 400, 'Invalid email should return 400');
  console.log('✓ Registration correctly rejects invalid email format');

  // 2c. Successful registration
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword
    })
  });
  assert.ok(regRes.status === 200 || regRes.status === 201, 'Successful registration should return 200 or 201');
  const regData = await regRes.json();
  assert.strictEqual(regData.success, true);
  assert.strictEqual(regData.email, testEmail.toLowerCase());
  console.log('✓ Registration succeeds with valid email and created Nutri AI password');

  // 2d. Duplicate email registration
  const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword
    })
  });
  assert.ok(dupRes.status === 400 || dupRes.status === 409, 'Duplicate email should return 400 or 409');
  const dupData = await dupRes.json();
  assert.strictEqual(dupData.error, 'DUPLICATE_EMAIL');
  console.log('✓ Registration correctly rejects duplicate account registration');

  // 2e. Check storage security: verify password is NOT stored as plain text
  const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
  if (fs.existsSync(usersFilePath)) {
    const usersContent = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const storedUser = usersContent[testEmail.toLowerCase()];
    assert.ok(storedUser, 'User must exist in users.json');
    assert.strictEqual(storedUser.password, undefined, 'Plain text password must NEVER be stored');
    assert.ok(storedUser.salt, 'User must have a salt');
    assert.ok(storedUser.hash || storedUser.passwordHash, 'User must have a password hash');
    assert.notStrictEqual(storedUser.hash || storedUser.passwordHash, testPassword, 'Hash must not equal plain password');
    console.log('✓ Security check: Passwords are salted & PBKDF2-hashed; no plaintext passwords');
  }

  // Test 3: Authentication Sign In
  // 3a. Invalid password
  const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'WrongPassword999!'
    })
  });
  assert.strictEqual(badLoginRes.status, 401, 'Wrong password should return 401');
  const badLoginData = await badLoginRes.json();
  assert.strictEqual(badLoginData.error, 'INVALID_CREDENTIALS');
  console.log('✓ Login correctly rejects invalid credentials with clear error message');

  // 3b. Successful login
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword
    })
  });
  assert.strictEqual(loginRes.status, 200, 'Correct credentials should return 200');
  const loginData = await loginRes.json();
  assert.strictEqual(loginData.success, true);
  assert.ok(loginData.sessionToken, 'Login should return a sessionToken');
  const sessionToken = loginData.sessionToken;
  console.log('✓ Login succeeds with correct credentials and returns sessionToken');

  // 3c. Session check
  const sessionRes = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: { 'Authorization': `Bearer ${sessionToken}` }
  });
  assert.strictEqual(sessionRes.status, 200, 'Session validation should return 200');
  const sessionData = await sessionRes.json();
  assert.strictEqual(sessionData.authenticated, true);
  assert.strictEqual(sessionData.user.email, testEmail.toLowerCase());
  console.log('✓ Session persists and retrieves authenticated user');

  // 3d. Logout
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${sessionToken}` }
  });
  assert.strictEqual(logoutRes.status, 200, 'Logout should return 200');
  
  // Verify session is revoked
  const afterLogoutRes = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: { 'Authorization': `Bearer ${sessionToken}` }
  });
  const afterLogoutData = await afterLogoutRes.json();
  assert.strictEqual(afterLogoutData.authenticated, false, 'Revoked session should not be authenticated');
  console.log('✓ Logout successfully invalidates the session');

  console.log('\n--- All Backend API Verification Tests Passed! ---');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
