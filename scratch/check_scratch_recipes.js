const fs = require('fs');
const path = require('path');

['breakfast', 'morning_snacks', 'lunch', 'evening_snacks', 'dinner', 'healthy_drinks'].forEach(cat => {
  const file = path.join(__dirname, 'recipes_' + cat + '.js');
  if (fs.existsSync(file)) {
    try {
      const data = require(file);
      console.log(cat + ':', Array.isArray(data) ? data.length : typeof data);
    } catch(e) {
      console.log(cat + ' load error:', e.message);
    }
  } else {
    console.log(cat + ': Not found');
  }
});
