import React, { useState } from 'react';
import { fileToBase64 } from '../utils/base64';

const analyzerEndpoint = import.meta.env.VITE_FOOD_VISION_API_URL || '/api/analyze-food';

export default function FoodAnalyzer() {
  const [imagePreview, setImagePreview] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setLoading(true);
    setNutritionData(null);
    setError('');

    try {
      const { base64Data, mimeType } = await fileToBase64(file);

      const response = await fetch(analyzerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ base64Data, mimeType })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Food analysis failed.');
      }

      const parsedJSON = await response.json();
      setNutritionData(parsedJSON);
    } catch (error) {
      console.error('Error analyzing food image:', error);
      setError(error.message || 'Unable to analyze the selected image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Food Nutrition Analyzer</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {imagePreview && (
        <img src={imagePreview} alt="Uploaded food" style={{ width: '100%', marginTop: '10px' }} />
      )}

      {loading && <p>Analyzing image with Gemini AI...</p>}

      {nutritionData && (
        <div style={{ marginTop: '20px' }}>
          <h3>Nutritional Summary:</h3>
          <p><strong>Total Calories:</strong> {nutritionData.total_nutrition.calories} kcal</p>
          <p><strong>Protein:</strong> {nutritionData.total_nutrition.protein_g}g</p>
          <p><strong>Carbs:</strong> {nutritionData.total_nutrition.carbs_g}g</p>
          <p><strong>Fat:</strong> {nutritionData.total_nutrition.fat_g}g</p>

          <h4>Items Identified:</h4>
          <ul>
            {nutritionData.items.map((item, index) => (
              <li key={index}>
                {item.name} ({item.portion}) - {item.calories} kcal
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}