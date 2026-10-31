const { spawn } = require('child_process');
const http = require('http');

console.log('Starting server.js on port 8085 for verification test...');
const server = spawn('node', ['server.js'], {
  env: { ...process.env, PORT: '8085' },
  stdio: 'pipe'
});

server.stdout.on('data', (d) => {
  // console.log('[Server stdout]', d.toString());
});

server.stderr.on('data', (d) => {
  console.error('[Server stderr]', d.toString());
});

setTimeout(() => {
  console.log('Sending test POST to http://127.0.0.1:8085/api/ai/scan-food ...');
  const postData = JSON.stringify({ imageBase64: 'data:image/jpeg;base64,dGVzdA==' });
  
  const req = http.request({
    hostname: '127.0.0.1',
    port: 8085,
    path: '/api/ai/scan-food',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      console.log(`Endpoint returned HTTP Status: ${res.statusCode}`);
      console.log('Payload:', body);
      server.kill();
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('Request error:', err);
    server.kill();
    process.exit(1);
  });

  req.write(postData);
  req.end();
}, 1500);

