import React, { useState, useEffect } from 'react';
import { fileToBase64 } from '../utils/base64';

const analyzerEndpoint = import.meta.env.VITE_FOOD_VISION_API_URL || 'http://localhost:5000/api/analyze-food';

export default function FoodAnalyzer({ capturedImage }) {
  const [imagePreview, setImagePreview] = useState(capturedImage || null);
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Automatically trigger analysis if an image was passed from CameraScreen
  useEffect(() => {
    if (capturedImage) {
      setImagePreview(capturedImage);
      analyzeDataUrl(capturedImage);
    }
  }, [capturedImage]);

  const analyzeDataUrl = async (dataUrl) => {
    setLoading(true);
    setNutritionData(null);
    setError('');

    try {
      // Parse out mimeType and base64 string from data URL
      const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
      let mimeType = 'image/png';
      let base64Data = dataUrl;

      if (matches) {
        mimeType = matches[1];
        base64Data = matches[2];
      }

      const response = await fetch(analyzerEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, mimeType })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Food analysis failed.');
      }

      const parsedJSON = await response.json();
      setNutritionData(parsedJSON);
    } catch (err) {
      console.error('Error analyzing food image:', err);
      setError(err.message || 'Unable to analyze the selected image.');
    } finally {
      setLoading(false);
    }
  };

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, mimeType })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Food analysis failed.');
      }

      const parsedJSON = await response.json();
      setNutritionData(parsedJSON);
    } catch (err) {
      console.error('Error analyzing food image:', err);
      setError(err.message || 'Unable to analyze the selected image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Food Nutrition Analyzer</h2>

      {!capturedImage && (
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      )}

      {imagePreview && (
        <img src={imagePreview} alt="Uploaded food" style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }} />
      )}

      {loading && <p style={{ color: '#10b981', fontWeight: 'bold', marginTop: '10px' }}>Analyzing image with Gemini AI...</p>}

      {error && <p style={{ color: '#f43f5e', marginTop: '10px', fontWeight: 'bold' }}>{error}</p>}

      {nutritionData && (
        <div style={{ marginTop: '20px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', color: '#f8fafc' }}>
          <h3>Nutritional Summary:</h3>
          <p><strong>Total Calories:</strong> {nutritionData?.total_nutrition?.calories ?? 0} kcal</p>
          <p><strong>Protein:</strong> {nutritionData?.total_nutrition?.protein_g ?? 0}g</p>
          <p><strong>Carbs:</strong> {nutritionData?.total_nutrition?.carbs_g ?? 0}g</p>
          <p><strong>Fat:</strong> {nutritionData?.total_nutrition?.fat_g ?? 0}g</p>

          <h4 style={{ marginTop: '12px' }}>Items Identified:</h4>
          <ul>
            {(nutritionData?.items || []).map((item, index) => (
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