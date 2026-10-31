// 22 Healthy Drinks Recipes (hd-1 to hd-22)
const imageMap = require('./verified_images.js');

module.exports = [
  {
    id: 'hd-1',
    name: 'Andhra Masala Buttermilk (Majjiga / Chaas)',
    category: 'healthy_drinks',
    cuisine: 'Andhra / Telugu',
    cuisineTags: ['indian', 'south_indian', 'andhra_telugu', 'telangana'],
    diet: ['vegetarian', 'balanced'],
    calories: 60,
    protein: 4,
    carbs: 6,
    fat: 2,
    fiber: 1,
    prepTime: '5 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 tall glass (280ml)',
    image: imageMap['hd-1'],
    ingredients: [
      { name: 'Fresh Cultured Curd (Dahi), Whisked Thin', amount: 100, unit: 'g', category: 'dairy' },
      { name: 'Filtered Chilled Water', amount: 180, unit: 'ml', category: 'pantry' },
      { name: 'Finely Minced Ginger & Green Chilies', amount: 1, unit: 'tsp', category: 'spices' },
      { name: 'Fresh Curry Leaves & Chopped Cilantro', amount: 1, unit: 'tbsp', category: 'spices' },
      { name: 'Roasted Cumin Powder & Pink Salt', amount: 0.5, unit: 'tsp', category: 'spices' }
    ],
    instructions: [
      'In a pitcher or blender, churn fresh curd with chilled water until light, frothy, and homogeneous.',
      'Add crushed ginger, minced green chili, crushed curry leaves, and fresh cilantro.',
      'Season with dry roasted cumin powder and rock salt.',
      'Pour into a tall clay tumbler or glass and serve chilled.'
    ],
    tips: 'Natural lactic acid fermentation replenishes probiotic microbiota and restores electrolytes without added sugar.',
    allergens: ['Dairy'],
    substitutions: ['Use unsweetened almond or cashew yogurt for a 100% plant-based dairy-free majjiga.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Contains Dairy',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-2',
    name: 'Warm Ragi Malt (Finger Millet Beverage)',
    category: 'healthy_drinks',
    cuisine: 'South Indian',
    cuisineTags: ['indian', 'south_indian', 'karnataka', 'andhra_telugu'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 120,
    protein: 4,
    carbs: 23,
    fat: 1,
    fiber: 4,
    prepTime: '3 mins',
    cookTime: '6 mins',
    difficulty: 'Easy',
    servingSize: '1 warm mug (250ml)',
    image: imageMap['hd-2'],
    ingredients: [
      { name: 'Sprouted Finger Millet (Ragi) Flour', amount: 30, unit: 'g', category: 'grains' },
      { name: 'Filtered Water', amount: 200, unit: 'ml', category: 'pantry' },
      { name: 'Thin Low-Fat Buttermilk or Water', amount: 50, unit: 'ml', category: 'dairy' },
      { name: 'Roasted Cumin Powder & Crushed Ginger', amount: 0.5, unit: 'tsp', category: 'spices' },
      { name: 'Himalayan Pink Salt', amount: 0.25, unit: 'tsp', category: 'spices' }
    ],
    instructions: [
      'Whisk sprouted ragi flour in 1/2 cup room temperature water until free of lumps.',
      'Bring remaining water to a gentle boil in a saucepan.',
      'Slowly stream ragi slurry into boiling water while stirring constantly.',
      'Simmer for 4-5 minutes until the malt turns glossy and cooked.',
      'Allow to cool slightly; stir in thin buttermilk, roasted cumin, and pink salt before sipping warm.'
    ],
    tips: 'Delivers 100mg bioavailable calcium and complex low-GI carbs with zero added sugars.',
    allergens: ['Dairy'],
    substitutions: ['Use plant milk or plain water for 100% dairy-free vegan ragi malt.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free Option Available',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-3',
    name: 'Spiced Golden Turmeric Milk',
    category: 'healthy_drinks',
    cuisine: 'Indian',
    cuisineTags: ['indian', 'ayurvedic'],
    diet: ['vegetarian', 'balanced'],
    calories: 130,
    protein: 8,
    carbs: 11,
    fat: 5,
    fiber: 1,
    prepTime: '2 mins',
    cookTime: '5 mins',
    difficulty: 'Easy',
    servingSize: '1 warm cup (240ml)',
    image: imageMap['hd-3'],
    ingredients: [
      { name: 'Pure Unsweetened Cow’s Milk (or Almond Milk)', amount: 220, unit: 'ml', category: 'dairy' },
      { name: 'Organic Turmeric Root Powder (High Curcumin)', amount: 1, unit: 'tsp', category: 'spices' },
      { name: 'Freshly Cracked Black Peppercorns', amount: 0.25, unit: 'tsp', category: 'spices' },
      { name: 'Ceylon Cinnamon & Green Cardamom Pod', amount: 0.5, unit: 'tsp', category: 'spices' },
      { name: 'Drop of Ghee or Cold-Pressed Coconut Oil', amount: 0.5, unit: 'tsp', category: 'pantry' }
    ],
    instructions: [
      'Warm milk in a saucepan over medium-low heat.',
      'Whisk in turmeric powder, cracked black pepper, ground cardamom, and cinnamon.',
      'Simmer gently for 4 minutes (do not boil furiously) to extract aromatic polyphenol oils.',
      'Stir in a drop of ghee to enhance lipid-soluble curcumin absorption.',
      'Pour into a mug and sip warm before bedtime.'
    ],
    tips: 'Black pepper piperine enhances systemic curcumin bioavailability by up to 2,000%.',
    allergens: ['Dairy'],
    substitutions: ['Use oat or almond milk for a soothing plant-based golden elixir.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Contains Dairy (Plant Milk Optional)',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-4',
    name: 'Pure Tender Coconut Water with Chia & Lime',
    category: 'healthy_drinks',
    cuisine: 'South Indian',
    cuisineTags: ['indian', 'south_indian', 'global'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 75,
    protein: 2,
    carbs: 14,
    fat: 1,
    fiber: 4,
    prepTime: '3 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 glass (250ml)',
    image: imageMap['hd-4'],
    ingredients: [
      { name: 'Fresh Pure Tender Coconut Water', amount: 230, unit: 'ml', category: 'fruits' },
      { name: 'Black Chia Seeds (Hydrated)', amount: 10, unit: 'g', category: 'proteins' },
      { name: 'Fresh Lime Juice & Mint Sprig', amount: 1, unit: 'tbsp', category: 'pantry' },
      { name: 'Pinch of Pink Himalayan Salt', amount: 1, unit: 'pinch', category: 'spices' }
    ],
    instructions: [
      'Extract natural tender coconut water directly from fresh coconut.',
      'Stir in pre-soaked chia seeds until evenly suspended.',
      'Squeeze fresh lime juice and add a micro-pinch of pink Himalayan rock salt.',
      'Garnish with bruised fresh mint leaves and serve chilled.'
    ],
    tips: 'Provides 600mg natural potassium, balancing intracellular osmotic fluid equilibrium.',
    allergens: ['None'],
    substitutions: ['Add tender coconut jelly pulp blended smoothly for creamier texture.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-5',
    name: 'Korean Iced Roasted Barley Tea (Boricha)',
    category: 'healthy_drinks',
    cuisine: 'Korean',
    cuisineTags: ['korean', 'global'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 10,
    protein: 0,
    carbs: 2,
    fat: 0,
    fiber: 0,
    prepTime: '2 mins',
    cookTime: '10 mins',
    difficulty: 'Easy',
    servingSize: '1 tall glass (300ml)',
    image: imageMap['hd-5'],
    ingredients: [
      { name: 'Roasted Whole Barley Kernels (Bori)', amount: 20, unit: 'g', category: 'grains' },
      { name: 'Filtered Boiling Water', amount: 350, unit: 'ml', category: 'pantry' },
      { name: 'Ice Cubes', amount: 3, unit: 'count', category: 'pantry' }
    ],
    instructions: [
      'Bring water to a boil in a kettle.',
      'Add roasted barley grains and simmer over low heat for 8-10 minutes until amber-golden.',
      'Remove from heat; allow to steep for 5 minutes, then strain out grains.',
      'Chill tea thoroughly in refrigerator.',
      'Serve over ice in a tall glass as Korea’s premier zero-sugar daily hydration staple.'
    ],
    tips: 'Roasted barley tea is naturally caffeine-free and contains antioxidant alkylpyrazines that improve blood circulation.',
    allergens: ['Gluten'],
    substitutions: ['Use roasted corn kernels (oksusu cha) for a gluten-free sweet-savory grain tea.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-6',
    name: 'Homemade Fresh Ginger Herbal Tea',
    category: 'healthy_drinks',
    cuisine: 'Indian',
    cuisineTags: ['indian', 'ayurvedic'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 25,
    protein: 0,
    carbs: 5,
    fat: 0,
    fiber: 1,
    prepTime: '3 mins',
    cookTime: '8 mins',
    difficulty: 'Easy',
    servingSize: '1 warm mug (240ml)',
    image: imageMap['hd-6'],
    ingredients: [
      { name: 'Fresh Ginger Root, Crushed', amount: 20, unit: 'g', category: 'spices' },
      { name: 'Fresh Holy Basil (Tulsi) Leaves', amount: 6, unit: 'count', category: 'spices' },
      { name: 'Green Cardamom Pod & Black Peppercorn', amount: 1, unit: 'count', category: 'spices' },
      { name: 'Filtered Water', amount: 280, unit: 'ml', category: 'pantry' },
      { name: 'Fresh Lemon Juice', amount: 1, unit: 'tsp', category: 'pantry' }
    ],
    instructions: [
      'Crush fresh ginger root coarsely with green cardamom and peppercorn.',
      'Add to boiling water along with fresh tulsi leaves.',
      'Simmer gently on low flame for 7 minutes to extract spicy gingerols and shogaols.',
      'Strain tea into a mug; stir in fresh lemon juice.',
      'Sip warm without refined sweeteners for digestive stimulation.'
    ],
    tips: 'Gingerols accelerate gastric emptying and soothe gastrointestinal mucosal linings naturally.',
    allergens: ['None'],
    substitutions: ['Add a Ceylon cinnamon stick for natural sweetness without caloric sugars.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-7',
    name: 'Unsweetened Lemon Water with Chia & Mint',
    category: 'healthy_drinks',
    cuisine: 'Global',
    cuisineTags: ['global', 'mediterranean'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 35,
    protein: 1,
    carbs: 4,
    fat: 1,
    fiber: 3,
    prepTime: '3 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 tall glass (300ml)',
    image: imageMap['hd-7'],
    ingredients: [
      { name: 'Freshly Squeezed Lemon Juice', amount: 2, unit: 'tbsp', category: 'pantry' },
      { name: 'Black Chia Seeds (Hydrated in Water)', amount: 8, unit: 'g', category: 'proteins' },
      { name: 'Chilled Filtered Water', amount: 280, unit: 'ml', category: 'pantry' },
      { name: 'Bruised Fresh Mint Leaves', amount: 5, unit: 'count', category: 'vegetables' },
      { name: 'Pinch of Himalayan Pink Salt', amount: 1, unit: 'pinch', category: 'spices' }
    ],
    instructions: [
      'In a tall glass, squeeze fresh lemon juice.',
      'Add hydrated chia seeds and crushed fresh spearmint leaves.',
      'Pour chilled filtered water and add a pinch of pink salt.',
      'Stir vigorously to disperse chia seeds.',
      'Drink 20 minutes before meals for optimal gastric priming.'
    ],
    tips: 'Lemon citric acid supports bile flow and gastric acid secretion, assisting enzyme action.',
    allergens: ['None'],
    substitutions: ['Use fresh lime juice or grapefruit juice for varied citrus bioflavonoids.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-8',
    name: 'Antioxidant Green Tea (Steeped Whole Leaf)',
    category: 'healthy_drinks',
    cuisine: 'Japanese',
    cuisineTags: ['japanese', 'global'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 5,
    protein: 0,
    carbs: 1,
    fat: 0,
    fiber: 0,
    prepTime: '2 mins',
    cookTime: '3 mins',
    difficulty: 'Easy',
    servingSize: '1 cup (220ml)',
    image: imageMap['hd-8'],
    ingredients: [
      { name: 'Whole Leaf Sencha Green Tea', amount: 3, unit: 'g', category: 'pantry' },
      { name: 'Hot Water at 80°C (175°F)', amount: 220, unit: 'ml', category: 'pantry' },
      { name: 'Fresh Lemon Peel Strip', amount: 1, unit: 'count', category: 'fruits' }
    ],
    instructions: [
      'Heat filtered water until steam rises but before a rolling boil (approx 80°C / 175°F).',
      'Place whole leaf green tea into a porcelain cup or glass teapot.',
      'Pour hot water over leaves and steep for exactly 2.5 minutes (do not over-steep to avoid bitterness).',
      'Strain liquor; drop a twist of fresh lemon peel.',
      'Enjoy freshly brewed for peak polyphenol integrity.'
    ],
    tips: 'Contains epigallocatechin gallate (EGCG) catechins, which upregulate metabolic fat oxidation.',
    allergens: ['Caffeine'],
    substitutions: ['Use ceremonial matcha whisked in water for 3x concentrated antioxidant intake.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Low Caffeine (~25mg natural caffeine)'
    }
  },
  {
    id: 'hd-9',
    name: 'Homemade Green Vegetable Detox Smoothie',
    category: 'healthy_drinks',
    cuisine: 'Global',
    cuisineTags: ['global'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 95,
    protein: 4,
    carbs: 18,
    fat: 1,
    fiber: 6,
    prepTime: '5 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 glass (300ml)',
    image: imageMap['hd-9'],
    ingredients: [
      { name: 'Fresh Baby Spinach Leaves', amount: 60, unit: 'g', category: 'vegetables' },
      { name: 'English Cucumber & Celery Stalk', amount: 80, unit: 'g', category: 'vegetables' },
      { name: 'Green Granny Smith Apple (Core Removed)', amount: 40, unit: 'g', category: 'fruits' },
      { name: 'Fresh Lemon Juice & Ginger Coin', amount: 1, unit: 'tbsp', category: 'pantry' },
      { name: 'Chilled Coconut Water or Filtered Water', amount: 150, unit: 'ml', category: 'pantry' }
    ],
    instructions: [
      'Wash fresh baby spinach, celery stalk, and cucumber thoroughly.',
      'Add spinach, cucumber, celery, green apple slices, and fresh ginger to high-speed blender.',
      'Pour chilled coconut water and freshly squeezed lemon juice.',
      'Blend on high for 45 seconds until silky smooth and emerald-green.',
      'Pour into a glass and drink immediately to prevent oxidation.'
    ],
    tips: 'Retaining whole vegetable pulp delivers essential dietary fiber that moderates fructose absorption.',
    allergens: ['None'],
    substitutions: ['Add 1 tbsp hemp hearts or chia seeds for plant protein and omega-3s.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-10',
    name: 'Thai Butterfly Pea Lemongrass Herbal Tea',
    category: 'healthy_drinks',
    cuisine: 'Thai',
    cuisineTags: ['thai', 'global'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 15,
    protein: 0,
    carbs: 3,
    fat: 0,
    fiber: 0,
    prepTime: '2 mins',
    cookTime: '5 mins',
    difficulty: 'Easy',
    servingSize: '1 tall glass (260ml)',
    image: imageMap['hd-10'],
    ingredients: [
      { name: 'Dried Butterfly Pea Flowers (Clitoria ternatea)', amount: 6, unit: 'count', category: 'spices' },
      { name: 'Bruised Fresh Lemongrass Stalk', amount: 15, unit: 'g', category: 'spices' },
      { name: 'Boiling Filtered Water', amount: 250, unit: 'ml', category: 'pantry' },
      { name: 'Fresh Lime Juice Squeeze', amount: 1, unit: 'tsp', category: 'pantry' },
      { name: 'Ice Cubes', amount: 3, unit: 'count', category: 'pantry' }
    ],
    instructions: [
      'Steep bruised lemongrass and dried butterfly pea flowers in boiling water for 5 minutes until deep sapphire blue.',
      'Strain flowers and chill liquid.',
      'Fill a glass with ice; pour the blue lemongrass infusion.',
      'Squeeze fresh lime juice over the top; watch pH-sensitive anthocyanins transform drink to royal violet.',
      'Stir and enjoy this aromatic, zero-sugar calming infusion.'
    ],
    tips: 'Butterfly pea flowers are rich in ternatins (polyacylated anthocyanins), offering cellular protection.',
    allergens: ['None'],
    substitutions: ['Enjoy warm without ice on cool evenings for a bedtime tea.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-11',
    name: 'Fresh Watermelon Juice without Added Sugar',
    category: 'healthy_drinks',
    cuisine: 'Global',
    cuisineTags: ['global'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 85,
    protein: 2,
    carbs: 20,
    fat: 0,
    fiber: 2,
    prepTime: '4 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 glass (250ml)',
    image: imageMap['hd-11'],
    ingredients: [
      { name: 'Fresh Chilled Seedless Watermelon Cubes', amount: 250, unit: 'g', category: 'fruits' },
      { name: 'Fresh Lime Juice', amount: 1, unit: 'tsp', category: 'pantry' },
      { name: 'Torn Fresh Spearmint Leaves', amount: 4, unit: 'count', category: 'vegetables' },
      { name: 'Pinch of Himalayan Black Salt (Kala Namak)', amount: 1, unit: 'pinch', category: 'spices' }
    ],
    instructions: [
      'Place chilled watermelon cubes into a blender.',
      'Blend for 20 seconds; strain through a coarse sieve if pulp-free texture is preferred.',
      'Stir in fresh lime juice, crushed mint, and a micro-pinch of black salt.',
      'Serve chilled without any added sugar or syrups.'
    ],
    tips: 'Watermelon is rich in L-citrulline, an amino acid precursor to nitric oxide that eases post-workout soreness.',
    allergens: ['None'],
    substitutions: ['Blend with 1/2 cucumber for extra hydrating electrolytes.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-12',
    name: 'Fresh Orange Juice (150ml Serving)',
    category: 'healthy_drinks',
    cuisine: 'Global',
    cuisineTags: ['global'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 70,
    protein: 1,
    carbs: 16,
    fat: 0,
    fiber: 2,
    prepTime: '4 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 clinical portion glass (150ml)',
    image: imageMap['hd-12'],
    ingredients: [
      { name: 'Fresh Ripe Oranges, Hand-Pressed with Pulp', amount: 2, unit: 'count', category: 'fruits' },
      { name: 'Pulp Retained (Do Not Filter Clean)', amount: 20, unit: 'g', category: 'fruits' }
    ],
    instructions: [
      'Halve fresh ripe seasonal oranges.',
      'Hand-press using a citrus squeezer, retaining natural pulp strands in the juice.',
      'Pour strictly a 150ml portion into a glass to control natural fructose load.',
      'Consume immediately to capture peak un-oxidized vitamin C.'
    ],
    tips: 'Restricting portion size to 150ml delivers 100% daily vitamin C while preventing hepatic fructose overload.',
    allergens: ['None'],
    substitutions: ['Dilute 1:1 with sparkling water for a refreshing low-sugar citrus spritzer.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-13',
    name: 'Traditional Unsweetened Lassi with Roasted Cumin',
    category: 'healthy_drinks',
    cuisine: 'North Indian',
    cuisineTags: ['indian', 'north_indian'],
    diet: ['vegetarian', 'balanced'],
    calories: 110,
    protein: 7,
    carbs: 9,
    fat: 4,
    fiber: 1,
    prepTime: '4 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 glass (250ml)',
    image: imageMap['hd-13'],
    ingredients: [
      { name: 'Fresh Whole Milk Yogurt (Dahi)', amount: 150, unit: 'g', category: 'dairy' },
      { name: 'Cold Chilled Water', amount: 100, unit: 'ml', category: 'pantry' },
      { name: 'Dry Roasted Cumin Powder', amount: 0.5, unit: 'tsp', category: 'spices' },
      { name: 'Black Salt & Fresh Mint Leaves', amount: 0.5, unit: 'tsp', category: 'spices' }
    ],
    instructions: [
      'Add fresh curd and chilled water into a blender or churn with a traditional wooden mathani.',
      'Whip for 30 seconds until rich, thick, and topped with natural foam.',
      'Fold in roasted cumin powder and rock salt.',
      'Pour into a tall glass and garnish with crushed mint.'
    ],
    tips: 'Unsweetened lassi delivers bioavailable casein and calcium without triggering glucose spikes.',
    allergens: ['Dairy'],
    substitutions: ['Use cashew curd for a rich dairy-free plant lassi.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Contains Dairy',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-14',
    name: 'Unsweetened Cold-Pressed Almond Milk',
    category: 'healthy_drinks',
    cuisine: 'Global',
    cuisineTags: ['global'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 60,
    protein: 2,
    carbs: 2,
    fat: 5,
    fiber: 1,
    prepTime: '2 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 cup (240ml)',
    image: imageMap['hd-14'],
    ingredients: [
      { name: 'Cold-Pressed Unsweetened Almond Milk', amount: 240, unit: 'ml', category: 'dairy' },
      { name: 'Pure Vanilla Bean Powder', amount: 0.25, unit: 'tsp', category: 'spices' },
      { name: 'Ground Ceylon Cinnamon', amount: 0.25, unit: 'tsp', category: 'spices' }
    ],
    instructions: [
      'Pour pure unsweetened almond milk into a glass or warm in a small saucepan.',
      'Dust with real vanilla bean powder and Ceylon cinnamon.',
      'Whisk until lightly frothed.',
      'Enjoy chilled or warm as a soothing low-calorie plant drink.'
    ],
    tips: 'Provides natural alpha-tocopherol (vitamin E) with only 60 kcal and zero lactose.',
    allergens: ['Nuts'],
    substitutions: ['Use oat milk if tree-nut allergies are present.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-15',
    name: 'Unsweetened Organic Soy Milk',
    category: 'healthy_drinks',
    cuisine: 'Asian',
    cuisineTags: ['global', 'japanese', 'chinese'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 90,
    protein: 8,
    carbs: 4,
    fat: 4,
    fiber: 2,
    prepTime: '2 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 cup (240ml)',
    image: imageMap['hd-15'],
    ingredients: [
      { name: 'Organic Non-GMO Unsweetened Soy Milk', amount: 240, unit: 'ml', category: 'dairy' },
      { name: 'Ground Cardamom or Cinnamon', amount: 0.25, unit: 'tsp', category: 'spices' }
    ],
    instructions: [
      'Pour organic unsweetened soy milk into a cup.',
      'Warm gently on low flame or serve cold over ice.',
      'Whisk in a pinch of cardamom for aromatic finish.',
      'Enjoy as a rich source of complete plant protein.'
    ],
    tips: 'Soy milk matches dairy milk protein content (8g/cup) with an identical essential amino acid score.',
    allergens: ['Soy'],
    substitutions: ['Use pea protein milk for soy-free high protein.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-16',
    name: 'Unsweetened Warm Milk with Cardamom',
    category: 'healthy_drinks',
    cuisine: 'Indian',
    cuisineTags: ['indian'],
    diet: ['vegetarian', 'balanced'],
    calories: 120,
    protein: 8,
    carbs: 11,
    fat: 4,
    fiber: 0,
    prepTime: '2 mins',
    cookTime: '4 mins',
    difficulty: 'Easy',
    servingSize: '1 mug (240ml)',
    image: imageMap['hd-16'],
    ingredients: [
      { name: 'Fresh Pasteurized Cow’s Milk', amount: 240, unit: 'ml', category: 'dairy' },
      { name: 'Freshly Crushed Green Cardamom Seeds', amount: 2, unit: 'count', category: 'spices' },
      { name: 'Saffron Strands (Optional)', amount: 2, unit: 'count', category: 'spices' }
    ],
    instructions: [
      'Heat milk in a saucepan over medium heat.',
      'Add crushed green cardamom pods and saffron strands.',
      'Bring to a gentle simmer for 3 minutes without scorching.',
      'Pour into a mug and sip warm.'
    ],
    tips: 'Warm dairy milk supplies sleep-inducing tryptophan and bioactive peptides that support REM rest.',
    allergens: ['Dairy'],
    substitutions: ['Use lactose-free milk if lactose intolerant.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Contains Dairy',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-17',
    name: 'Fresh Tomato Juice without Excessive Salt',
    category: 'healthy_drinks',
    cuisine: 'Global',
    cuisineTags: ['global'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 50,
    protein: 2,
    carbs: 10,
    fat: 0,
    fiber: 3,
    prepTime: '4 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 glass (240ml)',
    image: imageMap['hd-17'],
    ingredients: [
      { name: 'Ripe Vine-Ripened Tomatoes', amount: 250, unit: 'g', category: 'vegetables' },
      { name: 'Fresh Lemon Juice', amount: 1, unit: 'tsp', category: 'pantry' },
      { name: 'Cracked Black Pepper & Celery Salt', amount: 0.25, unit: 'tsp', category: 'spices' },
      { name: 'Fresh Celery Stalk for Stirring', amount: 1, unit: 'count', category: 'vegetables' }
    ],
    instructions: [
      'Blanch ripe tomatoes for 60 seconds; peel skin and chop coarsely.',
      'Blend in a blender with lemon juice and cracked black pepper until smooth.',
      'Strain through a fine mesh sieve into a tall glass.',
      'Season with a micro-pinch of celery salt and garnish with a fresh celery stalk.'
    ],
    tips: 'Vine tomatoes supply over 6,000 mcg lycopene per glass, an antioxidant supporting prostate and vascular health.',
    allergens: ['None'],
    substitutions: ['Add a dash of hot sauce or Worcestershire sauce for zesty flavor.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-18',
    name: 'Banana and Milk Smoothie (Zero Added Sugar)',
    category: 'healthy_drinks',
    cuisine: 'Global',
    cuisineTags: ['global'],
    diet: ['vegetarian', 'balanced'],
    calories: 175,
    protein: 8,
    carbs: 30,
    fat: 3,
    fiber: 3,
    prepTime: '3 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 glass (260ml)',
    image: imageMap['hd-18'],
    ingredients: [
      { name: 'Ripe Banana (Naturally Sweet)', amount: 1, unit: 'count', category: 'fruits' },
      { name: 'Cold Pasteurized Milk (or Soy Milk)', amount: 180, unit: 'ml', category: 'dairy' },
      { name: 'Ground Ceylon Cinnamon', amount: 0.25, unit: 'tsp', category: 'spices' },
      { name: 'Ice Cubes', amount: 3, unit: 'count', category: 'pantry' }
    ],
    instructions: [
      'Peel ripe banana and slice into blender.',
      'Add cold milk, cinnamon, and ice cubes.',
      'Blend on high for 30 seconds until frothy and creamy.',
      'Pour into a tall glass and dust with cinnamon.'
    ],
    tips: 'Bananas provide natural fruit sweetness and potassium, eliminating any need for refined syrups or sugars.',
    allergens: ['Dairy'],
    substitutions: ['Use unsweetened soy milk or almond milk for a plant-based vegan smoothie.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Contains Dairy (Plant Milk Optional)',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-19',
    name: 'Homemade Wild Berry Fruit Smoothie',
    category: 'healthy_drinks',
    cuisine: 'Global',
    cuisineTags: ['global'],
    diet: ['vegetarian', 'balanced'],
    calories: 140,
    protein: 7,
    carbs: 24,
    fat: 2,
    fiber: 6,
    prepTime: '4 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 glass (280ml)',
    image: imageMap['hd-19'],
    ingredients: [
      { name: 'Wild Blueberries & Strawberries', amount: 100, unit: 'g', category: 'fruits' },
      { name: 'Plain Low-Fat Yogurt or Dahi', amount: 100, unit: 'g', category: 'dairy' },
      { name: 'Black Chia Seeds', amount: 8, unit: 'g', category: 'proteins' },
      { name: 'Cold Water or Coconut Water', amount: 80, unit: 'ml', category: 'pantry' }
    ],
    instructions: [
      'Combine wild blueberries, strawberries, plain yogurt, and chia seeds in a blender.',
      'Add cold water and blend on high for 40 seconds until velvety.',
      'Pour into a chilled glass and serve immediately.'
    ],
    tips: 'Dark berries contain polyphenols that feed probiotic strains without raising blood insulin levels.',
    allergens: ['Dairy'],
    substitutions: ['Use almond yogurt for a 100% dairy-free vegan smoothie.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Contains Dairy (Plant Yogurt Optional)',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-20',
    name: 'Plain Cultured Probiotic Kefir',
    category: 'healthy_drinks',
    cuisine: 'Global',
    cuisineTags: ['global', 'mediterranean'],
    diet: ['vegetarian', 'balanced'],
    calories: 110,
    protein: 8,
    carbs: 8,
    fat: 4,
    fiber: 0,
    prepTime: '1 min',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 glass (220ml)',
    image: imageMap['hd-20'],
    ingredients: [
      { name: 'Traditional Cultured Whole Milk Kefir', amount: 220, unit: 'ml', category: 'dairy' },
      { name: 'Ground Cardamom or Mint Garnish', amount: 0.25, unit: 'tsp', category: 'spices' }
    ],
    instructions: [
      'Shake chilled kefir bottle gently.',
      'Pour into a ceramic or glass cup.',
      'Dust with a pinch of green cardamom or drop a fresh mint leaf.',
      'Sip slowly to populate oral and gastrointestinal mucosal linings.'
    ],
    tips: 'Kefir contains up to 61 diverse strains of beneficial bacteria and yeasts, vastly outnumbering standard yogurt.',
    allergens: ['Dairy'],
    substitutions: ['Use coconut water kefir for a dairy-free bio-active cultured alternative.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Contains Dairy',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-21',
    name: 'Cucumber and Mint Infused Detox Spa Water',
    category: 'healthy_drinks',
    cuisine: 'Global',
    cuisineTags: ['global'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 10,
    protein: 0,
    carbs: 2,
    fat: 0,
    fiber: 1,
    prepTime: '4 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 carafe glass (350ml)',
    image: imageMap['hd-21'],
    ingredients: [
      { name: 'Thinly Sliced English Cucumber Ribbons', amount: 60, unit: 'g', category: 'vegetables' },
      { name: 'Bruised Fresh Spearmint Leaves', amount: 8, unit: 'count', category: 'vegetables' },
      { name: 'Sliced Lemon Wheels', amount: 2, unit: 'count', category: 'fruits' },
      { name: 'Chilled Spring Water & Ice', amount: 320, unit: 'ml', category: 'pantry' }
    ],
    instructions: [
      'Slice cucumber into long ribbons with a peeler.',
      'Place cucumber ribbons, bruised mint leaves, and lemon wheels into a glass carafe.',
      'Fill with chilled water and ice.',
      'Allow to infuse for 15 minutes before pouring into tall glasses.'
    ],
    tips: 'Provides gentle hydration with zero calories, zero sugar, and natural refreshing terpene aromas.',
    allergens: ['None'],
    substitutions: ['Add fresh rosemary or lime wheels for alternative aroma notes.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Caffeine-Free'
    }
  },
  {
    id: 'hd-22',
    name: 'Fresh Carrot and Ginger Cold-Pressed Tonic',
    category: 'healthy_drinks',
    cuisine: 'Global',
    cuisineTags: ['global'],
    diet: ['vegetarian', 'vegan', 'balanced'],
    calories: 80,
    protein: 2,
    carbs: 18,
    fat: 0,
    fiber: 2,
    prepTime: '5 mins',
    cookTime: '0 mins',
    difficulty: 'Easy',
    servingSize: '1 glass (220ml)',
    image: imageMap['hd-22'],
    ingredients: [
      { name: 'Fresh Sweet Orange Carrots, Juiced', amount: 200, unit: 'g', category: 'vegetables' },
      { name: 'Fresh Ginger Root, Pressed', amount: 15, unit: 'g', category: 'spices' },
      { name: 'Fresh Lemon Juice', amount: 1, unit: 'tbsp', category: 'pantry' },
      { name: 'Pinch of Cayenne Pepper or Black Pepper', amount: 1, unit: 'pinch', category: 'spices' }
    ],
    instructions: [
      'Run sweet carrots and ginger through a cold-press masticating juicer.',
      'Stir in fresh lemon juice.',
      'Dust with a micro-pinch of black pepper to aid absorption.',
      'Serve freshly pressed without added water or sweeteners.'
    ],
    tips: 'Beta-carotene supports skin lipid barrier integrity and nocturnal cellular repair.',
    allergens: ['None'],
    substitutions: ['Juice with 1/2 green apple for sweeter taste.'],
    drinkMetadata: {
      addedSugar: '0g (Zero Added Sugar)',
      dairyStatus: 'Dairy-Free',
      caffeineStatus: 'Caffeine-Free'
    }
  }
];
