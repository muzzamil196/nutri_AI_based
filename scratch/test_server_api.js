const http = require('http');

// Test against the running server if already active, or start child process
async function testEndpoint() {
  console.log('Testing /api/ai/scan-food endpoint behavior...');
  
  const postData = JSON.stringify({ imageBase64: 'data:image/jpeg;base64,' + Buffer.from('test food plate').toString('base64') });
  
  const options = {
    hostname: '127.0.0.1',
    port: process.env.PORT || 8080,
    path: '/api/ai/scan-food',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log(`Server responded with status: ${res.statusCode}`);
      try {
        const json = JSON.parse(body);
        console.log('Response JSON:', json);
      } catch (e) {
        console.log('Response body:', body);
      }
      process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.log(`Note: Server is not currently running on port ${options.port} (${e.message}).`);
    process.exit(0);
  });

  req.write(postData);
  req.end();
}

testEndpoint();

