const fs = require('fs');
const path = 'data/FoodData_Central_foundation_food_json_2026-04-30/FoodData_Central_foundation_food_json_2026-04-30.json';
const raw = fs.readFileSync(path, 'utf8');
const data = JSON.parse(raw);
const items = data.FoundationFoods || [];
const macros = {
  'Protein': 'protein',
  'Carbohydrate, by difference': 'carbs',
  'Total lipid (fat)': 'fats'
};
const output = [];
for (const item of items) {
  const name = item.description || item.foodDescription || item.food_name || '';
  if (!name) continue;
  let protein = 0;
  let carbs = 0;
  let fats = 0;
  if (Array.isArray(item.foodNutrients)) {
    for (const n of item.foodNutrients) {
      const label = n.nutrient && n.nutrient.name;
      if (macros[label]) {
        const value = Number(n.amount) || 0;
        if (macros[label] === 'protein') protein = value;
        if (macros[label] === 'carbs') carbs = value;
        if (macros[label] === 'fats') fats = value;
      }
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
