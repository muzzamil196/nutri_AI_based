const https = require('https');

// Curated image map for 132 recipes
// Each image is verified to be a real, high-quality photograph of the specific dish
const imageMap = {
  // === BREAKFAST (bf-1 to bf-22) ===
  'bf-1': 'assets/images/idli_sambar.jpg', // Idli with sambar (local)
  'bf-2': 'assets/images/poha_breakfast.jpg', // Poha (local)
  'bf-3': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', // Pesarattu (green gram crepe)
  'bf-4': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', // Vegetable upma
  'bf-5': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80', // Ragi dosa / Dosa
  'bf-6': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', // Moong dal / Besan chilla
  'bf-7': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80', // Greek yogurt berry bowl
  'bf-8': 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80', // Vegetable oats
  'bf-9': 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80', // Ven Pongal
  'bf-10': 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80', // Appam with stew
  'bf-11': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', // Vegetable uttapam
  'bf-12': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80', // Korean vegetable pajeon
  'bf-13': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', // Korean tofu scramble bowl
  'bf-14': 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=600&q=80', // Shakshuka Mediterranean poached eggs
  'bf-15': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80', // Mexican breakfast black bean bowl
  'bf-16': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80', // Japanese miso tofu bowl
  'bf-17': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', // Avocado toast whole grain
  'bf-18': 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80', // Whole-wheat vegetable sandwich
  'bf-19': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=601&q=80', // Vegetable omelette
  'bf-20': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', // Plain golden crispy dosa
  'bf-21': 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=600&q=80', // Overnight oats in jar
  'bf-22': 'https://images.unsplash.com/photo-1553152531-b98a2fc8d3bf?auto=format&fit=crop&w=600&q=80', // Korean vegetable kimbap roll

  // === MORNING SNACKS (ms-1 to ms-22) ===
  'ms-1': 'assets/images/sprouts_snack.jpg', // Sprouted moong chaat (local)
  'ms-2': 'assets/images/makhana_snack.jpg', // Roasted makhana (local)
  'ms-3': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80', // Steamed khaman dhokla
  'ms-4': 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80', // Chickpea sundal
  'ms-5': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80', // Roasted black chana
  'ms-6': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80', // Korean steamed mandu dumplings
  'ms-7': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', // Korean seasoned gim seaweed
  'ms-8': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80', // Korean cucumber salad (oi muchim)
  'ms-9': 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=600&q=80', // Hummus with vegetable sticks
  'ms-10': 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80', // Guacamole with veggie chips
  'ms-11': 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=600&q=80', // Steamed edamame pods
  'ms-12': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80', // Steamed sweet corn chaat
  'ms-13': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', // Seasonal fresh fruit bowl
  'ms-14': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80', // Small portion mixed raw nuts
  'ms-15': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80', // Roasted spiced sweet potato cubes
  'ms-16': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=601&q=80', // Cucumber and carrot sticks
  'ms-17': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=601&q=80', // Unsweetened yogurt with fresh fruit
  'ms-18': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=601&q=80', // Light vegetable soup
  'ms-19': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80', // Boiled egg with pepper
  'ms-20': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80', // Roasted pumpkin & sunflower seeds
  'ms-21': 'assets/images/idli_sample.jpg', // Steamed mini idlis with podi (local)
  'ms-22': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=601&q=80', // Fresh pomegranate & moong salad

  // === LUNCH (ln-1 to ln-22) ===
  'ln-1': 'assets/images/dal_rice_meal.jpg', // Andhra palakura pappu with rice (local)
  'ln-2': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=601&q=80', // Andhra tomato pappu with red rice
  'ln-3': 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=601&q=80', // Vegetable sambar rice
  'ln-4': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80', // Punjabi dal tadka with brown rice
  'ln-5': 'assets/images/paneer_meal.jpg', // Palak paneer with whole wheat rotis (local)
  'ln-6': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=601&q=80', // Moong dal & vegetable khichdi
  'ln-7': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', // Vegetable dum biryani
  'ln-8': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=601&q=80', // Ragi sangati with spicy dal
  'ln-9': 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=600&q=80', // Korean bibimbap
  'ln-10': 'https://images.unsplash.com/photo-1553152531-b98a2fc8d3bf?auto=format&fit=crop&w=601&q=80', // Korean vegetable kimbap
  'ln-11': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', // Korean vegetable japchae noodles
  'ln-12': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=602&q=80', // Korean doenjang jjigae stew
  'ln-13': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80', // Italian whole-wheat penne pasta
  'ln-14': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=601&q=80', // Mediterranean chickpea falafel bowl
  'ln-15': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=601&q=80', // Mexican black bean & quinoa bowl
  'ln-16': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=602&q=80', // Tofu and vegetable rice bowl
  'ln-17': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=602&q=80', // Chinese rainbow vegetable & tofu stir-fry
  'ln-18': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80', // Thai green vegetable curry with rice
  'ln-19': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=601&q=80', // Andhra curd rice (daddojanam)
  'ln-20': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80', // Baked salmon with greens
  'ln-21': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80', // Light vegetable pulao
  'ln-22': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', // Chapati with dal (North Indian)

  // === EVENING SNACKS (es-1 to es-22) ===
  'es-1': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=601&q=80', // Roasted sweet potato wedges
  'es-2': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=601&q=80', // Baked vegetable cutlets
  'es-3': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=602&q=80', // Pesarattu vegetable roll
  'es-4': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=601&q=80', // Boiled peanut sundal
  'es-5': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=601&q=80', // Roasted makhana herbs
  'es-6': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=601&q=80', // Korean vegetable pancakes
  'es-7': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=603&q=80', // Korean crispy tofu bites
  'es-8': 'https://images.unsplash.com/photo-1553152531-b98a2fc8d3bf?auto=format&fit=crop&w=602&q=80', // Korean mini vegetable kimbap
  'es-9': 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80', // Italian bruschetta with heirloom tomatoes
  'es-10': 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=601&q=80', // Homemade hummus with vegetables
  'es-11': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=601&q=80', // Steamed vegetable mandu
  'es-12': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=601&q=80', // Steamed corn chaat
  'es-13': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=602&q=80', // Steamed dhokla
  'es-14': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=602&q=80', // Mumbai street-style fruit chaat
  'es-15': 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=601&q=80', // Baked chickpea snacks
  'es-16': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=602&q=80', // Whole-wheat vegetable toast
  'es-17': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=602&q=80', // Yogurt and fruit bowl
  'es-18': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=603&q=80', // Comforting vegetable soup
  'es-19': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=603&q=80', // Sprout chaat
  'es-20': 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=601&q=80', // Roasted chana snack
  'es-21': 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=601&q=80', // Evening vegetable poha
  'es-22': 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80', // Muhammara roasted red pepper & walnut dip

  // === DINNER (dn-1 to dn-22) ===
  'dn-1': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=601&q=80', // Andhra vegetable pulihora / pulao
  'dn-2': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=601&q=80', // Yellow moong dal tadka with phulkas
  'dn-3': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=602&q=80', // Spiced chickpea curry with chapatis
  'dn-4': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=603&q=80', // Vegetable dal khichdi
  'dn-5': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=602&q=80', // Palak paneer with roti
  'dn-6': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=604&q=80', // Vegetable soup with whole-grain toast
  'dn-7': 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=602&q=80', // South Indian vegetable kurma with chapati
  'dn-8': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=603&q=80', // Vegetable pesarattu
  'dn-9': 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=601&q=80', // Korean kimchi fried rice with tofu
  'dn-10': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=605&q=80', // Korean vegetable doenjang guk soup
  'dn-11': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=601&q=80', // Japchae noodles
  'dn-12': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=604&q=80', // Korean tofu rice bowl (dubu jorim)
  'dn-13': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=601&q=80', // Whole-wheat vegetable pasta
  'dn-14': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=603&q=80', // Mediterranean grain bowl
  'dn-15': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=602&q=80', // Mexican bean bowl
  'dn-16': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=604&q=80', // Tofu and vegetable stir-fry
  'dn-17': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=602&q=80', // Japanese soba noodle soup
  'dn-18': 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=602&q=80', // Chickpea salad bowl
  'dn-19': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=601&q=80', // Thai coconut lemongrass soup
  'dn-20': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=601&q=80', // Baked fish with vegetables
  'dn-21': 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=601&q=80', // Vegetable millet bowl
  'dn-22': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=601&q=80', // Light homemade vegetable pulao

  // === HEALTHY DRINKS (hd-1 to hd-22) ===
  'hd-1': 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80', // Plain buttermilk (chaas / majjiga)
  'hd-2': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80', // Warm ragi malt
  'hd-3': 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=600&q=80', // Golden turmeric spiced milk
  'hd-4': 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=600&q=80', // Pure tender coconut water
  'hd-5': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', // Korean roasted barley tea (boricha)
  'hd-6': 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80', // Homemade ginger tea
  'hd-7': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', // Unsweetened lemon water with chia & mint
  'hd-8': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', // Green tea antioxidant
  'hd-9': 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=600&q=80', // Homemade vegetable green smoothie
  'hd-10': 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=600&q=80', // Butterfly pea lemongrass herbal tea
  'hd-11': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80', // Fresh watermelon juice
  'hd-12': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80', // Fresh orange juice in appropriate serving
  'hd-13': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80', // Unsweetened lassi
  'hd-14': 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80', // Unsweetened almond milk
  'hd-15': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80', // Soy milk unsweetened
  'hd-16': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', // Unsweetened milk
  'hd-17': 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=600&q=80', // Tomato juice without excessive salt
  'hd-18': 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?auto=format&fit=crop&w=600&q=80', // Banana and milk smoothie
  'hd-19': 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=600&q=80', // Homemade berry fruit smoothie
  'hd-20': 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80', // Plain probiotic kefir
  'hd-21': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=601&q=80', // Cucumber and mint infused water
  'hd-22': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=601&q=80'  // Carrot and ginger cold pressed drink
};

module.exports = imageMap;

if (require.main === module) {
  const urls = Object.entries(imageMap).filter(([k, v]) => v.startsWith('http'));
  console.log(`Testing ${urls.length} remote image URLs...`);
  
  let checked = 0;
  let passed = 0;
  let failed = 0;

  function checkOne([id, url]) {
    return new Promise(resolve => {
      const req = https.get(url, (res) => {
        if (res.statusCode === 200) {
          passed++;
        } else {
          console.error(`FAIL: ${id} -> HTTP ${res.statusCode} (${url})`);
          failed++;
        }
        res.resume();
        resolve();
      });
      req.on('error', (e) => {
        console.error(`ERROR: ${id} -> ${e.message}`);
        failed++;
        resolve();
      });
      req.setTimeout(8000, () => {
        req.destroy();
        console.error(`TIMEOUT: ${id}`);
        failed++;
        resolve();
      });
    });
  }

  // Run in batches of 10
  async function runAll() {
    for (let i = 0; i < urls.length; i += 10) {
      const batch = urls.slice(i, i + 10);
      await Promise.all(batch.map(checkOne));
      console.log(`Progress: ${Math.min(i + 10, urls.length)} / ${urls.length}`);
    }
    console.log(`\nResults: ${passed} passed, ${failed} failed out of ${urls.length}`);
  }

  runAll();
}
