const fs = require('fs');
const path = 'data/FoodData_Central_foundation_food_json_2026-04-30/FoodData_Central_foundation_food_json_2026-04-30.json';
const raw = fs.readFileSync(path, 'utf8');
const data = JSON.parse(raw);
const items = Array.isArray(data.FoundationFoods) ? data.FoundationFoods : [];
const macros = {
  'Protein': 'protein',
  'Carbohydrate, by difference': 'carbs',
  'Total lipid (fat)': 'fats'
};
const output = [];
for (const item of items) {
  if (!item || typeof item !== 'object') continue;
  const name = item.description || item.foodDescription || item.food_name || '';
  if (!name) continue;
  let protein = 0, carbs = 0, fats = 0;
  if (Array.isArray(item.foodNutrients)) {
    for (const n of item.foodNutrients) {
      if (!n || !n.nutrient || typeof n.amount !== 'number' && typeof n.amount !== 'string') continue;
      const label = n.nutrient.name;
      const value = Number(n.amount) || 0;
      if (label === 'Protein') protein = value;
      if (label === 'Carbohydrate, by difference') carbs = value;
      if (label === 'Total lipid (fat)') fats = value;
    }
  }
  output.push({
    name,
    protein: Number(protein.toFixed(2)),
    carbs: Number(carbs.toFixed(2)),
    fats: Number(fats.toFixed(2))
  });
}
const fileText = 'const foodData = [\n' + output.map(item => `  { name: ${JSON.stringify(item.name)}, protein: ${item.protein}, carbs: ${item.carbs}, fats: ${item.fats} }`).join(',\n') + '\n];\n\nexport default foodData;\n';
fs.writeFileSync('data/foodData.js', fileText, 'utf8');
console.log('Wrote', output.length, 'food items to data/foodData.js');
