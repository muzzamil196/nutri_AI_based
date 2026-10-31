const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(resBody) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: resBody });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:8080' + path, res => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(resBody) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: resBody });
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('--- Testing Backend Endpoints ---');

  // 1. Health
  const health = await get('/api/health');
  console.log('1. Health check:', health.status === 200 && health.data && health.data.status === 'online' ? 'PASS' : 'FAIL', health.data);

  // 2. Validate email
  const v1 = await post('/api/auth/validate-email', { email: '' });
  console.log('2a. Empty email:', v1.status === 400 && v1.data.message === 'Email address is required.' ? 'PASS' : 'FAIL', v1.data);

  const v2 = await post('/api/auth/validate-email', { email: 'not-an-email' });
  console.log('2b. Malformed email:', v2.status === 400 && v2.data.message === 'Please enter a valid email address.' ? 'PASS' : 'FAIL', v2.data);

  const v3 = await post('/api/auth/validate-email', { email: 'alex.rivera@example.com' });
  console.log('2c. Valid email:', v3.status === 200 && v3.data.success === true ? 'PASS' : 'FAIL', v3.data);

  // 3. Age safety validation
  const ageUnder5 = await post('/api/profile/validate-safety', { age: 3, primaryGoal: 'Weight Loss' });
  console.log('3a. Age 3 Weight Loss:', ageUnder5.data.safe === false && ageUnder5.data.ageGroup === 'under_5' && ageUnder5.data.safeAlternative === 'Healthy Eating' ? 'PASS' : 'FAIL', ageUnder5.data.message);

  const ageYouth = await post('/api/profile/validate-safety', { age: 14, primaryGoal: 'Weight Gain' });
  console.log('3b. Age 14 Weight Gain:', ageYouth.data.safe === false && ageYouth.data.ageGroup === 'youth' && ageYouth.data.safeAlternative === 'Healthy Eating' ? 'PASS' : 'FAIL', ageYouth.data.message);

  const ageAdult = await post('/api/profile/validate-safety', { age: 30, primaryGoal: 'Weight Loss' });
  console.log('3c. Age 30 Weight Loss:', ageAdult.data.safe === true && ageAdult.data.ageGroup === 'adult' ? 'PASS' : 'FAIL');

  const ageSenior = await post('/api/profile/validate-safety', { age: 75, primaryGoal: 'Weight Loss' });
  console.log('3d. Age 75 Weight Loss:', ageSenior.data.safe === false && ageSenior.data.ageGroup === 'senior' && ageSenior.data.safeAlternative === 'Healthy Eating' ? 'PASS' : 'FAIL', ageSenior.data.message);

  // 4. Food scan when API key is unconfigured (Requirement 5: display clear setup/service-unavailable message)
  const scanUnconfigured = await post('/api/ai/scan-food', { imageBase64: 'sample_laptop_image' });
  console.log('4. Scan unconfigured handled gracefully (503):', scanUnconfigured.status === 503 && scanUnconfigured.data.error === 'GEMINI_API_KEY_NOT_CONFIGURED' ? 'PASS' : 'FAIL', scanUnconfigured.data);

  // 5. Meal plan generation endpoint response when unconfigured
  const mealPlanUnconfigured = await post('/api/ai/generate-meal-plan', { userProfile: { age: 10, goal: 'Weight Loss' } });
  console.log('5. Meal plan endpoint unconfigured handled gracefully (503):', mealPlanUnconfigured.status === 503 && mealPlanUnconfigured.data.error === 'GEMINI_API_KEY_NOT_CONFIGURED' ? 'PASS' : 'FAIL');

  console.log('--- Backend Tests Completed ---');
}

run().catch(console.error);
