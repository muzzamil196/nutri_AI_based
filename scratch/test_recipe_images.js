const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const req = https.get(url, (res) => {
        resolve({ url, status: res.statusCode, ok: res.statusCode === 200 });
        res.resume();
      });
      req.on('error', (err) => {
        resolve({ url, status: 0, ok: false, error: err.message });
      });
      req.setTimeout(8000, () => {
        req.destroy();
        resolve({ url, status: 408, ok: false, error: 'Timeout' });
      });
    } catch(e) {
      resolve({ url, status: 0, ok: false, error: e.message });
    }
  });
}

// Test sample URLs
const sampleUrls = [
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', // Idli
  'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80', // Dosa
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', // Salad bowl
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', // Veggie bowl
  'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80'  // Korean food
];

Promise.all(sampleUrls.map(checkUrl)).then(results => {
  results.forEach(r => console.log(r.status, r.ok ? 'OK' : 'FAIL', r.url.slice(0, 60)));
});

