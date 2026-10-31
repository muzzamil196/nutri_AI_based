const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const RECIPES_DIR = path.join(__dirname, '../assets/images/recipes');
if (!fs.existsSync(RECIPES_DIR)) {
  fs.mkdirSync(RECIPES_DIR, { recursive: true });
}

// Master mapping of authentic, verified food images for all 132 recipes
const AUTHENTIC_IMAGES = {
  // --- BREAKFAST ---
  'bf-1': 'assets/images/idli_sambar.jpg',
  'bf-2': 'assets/images/poha_breakfast.jpg',
  'bf-3': 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Pesarattu.jpg',
  'bf-4': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Upma.jpg/960px-Upma.jpg',
  'bf-5': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Dosa_at_Sri_Ganesha_Restauran%2C_Bangkok_%2844570742744%29.jpg/960px-Dosa_at_Sri_Ganesha_Restauran%2C_Bangkok_%2844570742744%29.jpg',
  'bf-6': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Moonglet_chilla_with_curd_and_hot_tea.jpg/960px-Moonglet_chilla_with_curd_and_hot_tea.jpg',
  'bf-7': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  'bf-8': 'assets/images/oats_berry_bowl.jpg',
  'bf-9': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Ven_pongal_with_sambar_and_chutney.jpg/960px-Ven_pongal_with_sambar_and_chutney.jpg',
  'bf-10': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Appam_-_%E0%AE%85%E0%AE%AA%E0%AF%8D%E0%AE%AA%E0%AE%AE%E0%AF%8D.jpg/960px-Appam_-_%E0%AE%85%E0%AE%AA%E0%AF%8D%E0%AE%AA%E0%AE%AE%E0%AF%8D.jpg',
  'bf-11': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Uttapam.jpg/960px-Uttapam.jpg',
  'bf-12': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Korean_pancake-Pajeon-05.jpg/960px-Korean_pancake-Pajeon-05.jpg',
  'bf-13': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Dolsot-bibimbap.jpg/960px-Dolsot-bibimbap.jpg',
  'bf-14': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Shakshuka_by_Calliopejen1.jpg/960px-Shakshuka_by_Calliopejen1.jpg',
  'bf-15': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
  'bf-16': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  'bf-17': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
  'bf-18': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
  'bf-19': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=600&q=80',
  'bf-20': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Dosa-chutney-sambhar.jpg/960px-Dosa-chutney-sambhar.jpg',
  'bf-21': 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=600&q=80',
  'bf-22': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Gimbap_%28pixabay%29.jpg/960px-Gimbap_%28pixabay%29.jpg',

  // --- MORNING SNACKS ---
  'ms-1': 'assets/images/sprouts_snack.jpg',
  'ms-2': 'assets/images/makhana_snack.jpg',
  'ms-3': 'https://upload.wikimedia.org/wikipedia/commons/6/65/Dhokla_on_Gujrart.jpg',
  'ms-4': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Chana_Sundal.jpg/960px-Chana_Sundal.jpg',
  'ms-5': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
  'ms-6': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
  'ms-7': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
  'ms-8': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
  'ms-9': 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=600&q=80',
  'ms-10': 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80',
  'ms-11': 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=600&q=80',
  'ms-12': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
  'ms-13': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  'ms-14': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80',
  'ms-15': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Potato_wedges_at_Mensa_Paderborn_%2811956794164%29.jpg/960px-Potato_wedges_at_Mensa_Paderborn_%2811956794164%29.jpg',
  'ms-16': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'ms-17': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  'ms-18': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  'ms-19': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
  'ms-20': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
  'ms-21': 'assets/images/idli_sample.jpg',
  'ms-22': 'assets/images/sprouts_snack.jpg',

  // --- LUNCH ---
  'ln-1': 'assets/images/dal_rice_meal.jpg',
  'ln-2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tomato_Pappu.jpg/960px-Tomato_Pappu.jpg',
  'ln-3': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Sambar_Rice.jpg/960px-Sambar_Rice.jpg',
  'ln-4': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
  'ln-5': 'assets/images/paneer_meal.jpg',
  'ln-6': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Dall_Khichdi.jpg',
  'ln-7': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
  'ln-8': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/RAGI_MUDDE.JPG/960px-RAGI_MUDDE.JPG',
  'ln-9': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Dolsot-bibimbap.jpg/960px-Dolsot-bibimbap.jpg',
  'ln-10': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Gimbap_%28pixabay%29.jpg/960px-Gimbap_%28pixabay%29.jpg',
  'ln-11': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Polish_Korean_Cuisine_and_Culture_Exchanges_Gradmother%E2%80%99s_Recipes_05.jpg/960px-Polish_Korean_Cuisine_and_Culture_Exchanges_Gradmother%E2%80%99s_Recipes_05.jpg',
  'ln-12': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  'ln-13': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
  'ln-14': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  'ln-15': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
  'ln-16': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  'ln-17': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'ln-18': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80',
  'ln-19': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  'ln-20': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
  'ln-21': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
  'ln-22': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',

  // --- EVENING SNACKS ---
  'es-1': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Potato_wedges_at_Mensa_Paderborn_%2811956794164%29.jpg/960px-Potato_wedges_at_Mensa_Paderborn_%2811956794164%29.jpg',
  'es-2': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
  'es-3': 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Pesarattu.jpg',
  'es-4': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Chana_Sundal.jpg/960px-Chana_Sundal.jpg',
  'es-5': 'assets/images/makhana_snack.jpg',
  'es-6': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Korean_pancake-Pajeon-05.jpg/960px-Korean_pancake-Pajeon-05.jpg',
  'es-7': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'es-8': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Gimbap_%28pixabay%29.jpg/960px-Gimbap_%28pixabay%29.jpg',
  'es-9': 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80',
  'es-10': 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=600&q=80',
  'es-11': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
  'es-12': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
  'es-13': 'https://upload.wikimedia.org/wikipedia/commons/6/65/Dhokla_on_Gujrart.jpg',
  'es-14': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  'es-15': 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80',
  'es-16': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
  'es-17': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  'es-18': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  'es-19': 'assets/images/sprouts_snack.jpg',
  'es-20': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
  'es-21': 'assets/images/poha_breakfast.jpg',
  'es-22': 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',

  // --- DINNER ---
  'dn-1': 'assets/images/dal_rice_meal.jpg',
  'dn-2': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
  'dn-3': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
  'dn-4': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Dall_Khichdi.jpg',
  'dn-5': 'assets/images/paneer_meal.jpg',
  'dn-6': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  'dn-7': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Sambar_Rice.jpg/960px-Sambar_Rice.jpg',
  'dn-8': 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Pesarattu.jpg',
  'dn-9': 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=600&q=80',
  'dn-10': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  'dn-11': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Polish_Korean_Cuisine_and_Culture_Exchanges_Gradmother%E2%80%99s_Recipes_05.jpg/960px-Polish_Korean_Cuisine_and_Culture_Exchanges_Gradmother%E2%80%99s_Recipes_05.jpg',
  'dn-12': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  'dn-13': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
  'dn-14': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  'dn-15': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
  'dn-16': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'dn-17': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
  'dn-18': 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80',
  'dn-19': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80',
  'dn-20': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
  'dn-21': 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=600&q=80',
  'dn-22': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',

  // --- HEALTHY DRINKS ---
  'hd-1': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Mint_lassi.jpg/960px-Mint_lassi.jpg',
  'hd-2': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
  'hd-3': 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80',
  'hd-4': 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=600&q=80',
  'hd-5': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
  'hd-6': 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80',
  'hd-7': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
  'hd-8': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
  'hd-9': 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=600&q=80',
  'hd-10': 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=600&q=80',
  'hd-11': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
  'hd-12': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
  'hd-13': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Salt_lassi.jpg/960px-Salt_lassi.jpg',
  'hd-14': 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80',
  'hd-15': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
  'hd-16': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  'hd-17': 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=600&q=80',
  'hd-18': 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?auto=format&fit=crop&w=600&q=80',
  'hd-19': 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=600&q=80',
  'hd-20': 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
  'hd-21': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
  'hd-22': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80'
};

async function downloadOrCopyImage(id, sourceUrl) {
  const destPath = path.join(RECIPES_DIR, `${id}.jpg`);
  
  if (sourceUrl.startsWith('assets/')) {
    const srcLocal = path.join(__dirname, '..', sourceUrl);
    if (fs.existsSync(srcLocal)) {
      fs.copyFileSync(srcLocal, destPath);
      return { id, status: 'copied_local', size: fs.statSync(destPath).size };
    }
  }

  // Download from URL
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    const req = https.get(sourceUrl, { headers: { 'User-Agent': 'NutriAI-Bot/1.0 (contact@nutriai.org)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'NutriAI-Bot/1.0 (contact@nutriai.org)' } }, (res2) => {
          res2.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve({ id, status: 'downloaded', size: fs.statSync(destPath).size });
          });
        });
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve({ id, status: 'downloaded', size: fs.statSync(destPath).size });
      });
    });
    req.on('error', (err) => {
      resolve({ id, status: 'error', error: err.message });
    });
  });
}

async function runAll() {
  console.log(`Starting curation and download for ${Object.keys(AUTHENTIC_IMAGES).length} recipes...`);
  let successes = 0;
  let failures = 0;

  for (const [id, src] of Object.entries(AUTHENTIC_IMAGES)) {
    const res = await downloadOrCopyImage(id, src);
    if (res.size && res.size > 2000) {
      successes++;
      console.log(`[OK] ${id} (${res.status}): ${res.size} bytes`);
    } else {
      failures++;
      console.error(`[FAIL] ${id}:`, res);
    }
  }

  console.log(`\nFinished: ${successes} succeeded, ${failures} failed.`);
}

runAll();

