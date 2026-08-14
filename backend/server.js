app.post('/api/analyze-food', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'Missing base64Data payload.' });
    }

    const cleanedBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

    const response = await groq.chat.completions.create({
      model: 'llama-3.2-11b-vision-preview',
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 2048,
      messages: [
        {
          role: 'system',
          content:
            'You are a precise nutrition assistant. Respond strictly with valid, well-formed JSON matching the exact schema requested. Never include unescaped double quotes inside key values.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze the food in this image. Estimate realistic portion sizes in grams (as integers), macros, and calories for each food item.

Return strictly following this JSON structure:
{
  "items": [
    {
      "name": "Roasted Chicken",
      "serving_size_g": 150,
      "carbs_g": 0,
      "protein_g": 35,
      "fat_g": 10,
      "calories": 230
    }
  ]
}`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType || 'image/jpeg'};base64,${cleanedBase64}`
              }
            }
          ]
        }
      ]
    });

    const rawContent = response.choices[0]?.message?.content?.trim() || '';

    // Extract JSON object safely
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON object found in vision response.');
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    res.json(parsedData);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze food.' });
  }
});