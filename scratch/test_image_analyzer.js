const fs = require('fs');
const path = require('path');

// Test analyzing the local image files in assets/images/
const files = [
  'assets/images/salad_sample.jpg',
  'assets/images/idli_sambar.jpg',
  'assets/images/dal_rice_meal.jpg',
  'assets/images/makhana_snack.jpg',
  'assets/images/poha_breakfast.jpg'
];

function analyzeBuffer(buf) {
  // Sample bytes across buffer to compute luminosity and color spectrum estimates
  let sum = 0;
  let rSum = 0, gSum = 0, bSum = 0;
  const sampleStep = Math.max(1, Math.floor(buf.length / 5000));
  let samples = 0;

  for (let i = 0; i < buf.length - 3; i += sampleStep) {
    const b1 = buf[i];
    const b2 = buf[i + 1];
    const b3 = buf[i + 2];
    rSum += b1;
    gSum += b2;
    bSum += b3;
    sum += (b1 + b2 + b3) / 3;
    samples++;
  }

  const avgLum = sum / samples;
  const avgR = rSum / samples;
  const avgG = gSum / samples;
  const avgB = bSum / samples;

  return { size: buf.length, samples, avgLum, avgR, avgG, avgB };
}

files.forEach(f => {
  if (fs.existsSync(f)) {
    const buf = fs.readFileSync(f);
    console.log(f, analyzeBuffer(buf));
  }
});

