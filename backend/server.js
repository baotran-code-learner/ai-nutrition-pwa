import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/analyze-food', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;

    const response = await groq.chat.completions.create({
      model: 'qwen/qwen3.6-27b',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this food image and return ONLY a valid raw JSON object matching this structure. Do NOT wrap in markdown backticks:
{
  "name": "Food Name",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fats": 0,
  "serving_size_g": 100,
  "items": [
    {
      "name": "Item Name",
      "portion": "1 serving",
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fats": 0
    }
  ]
}`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType || 'image/jpeg'};base64,${base64Data}`
              }
            }
          ]
        }
      ],
      response_format: { type: 'json_object' }
    });

    let rawContent = response.choices[0].message.content.trim();
    if (rawContent.startsWith('```')) {
      rawContent = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    const parsedData = JSON.parse(rawContent);
    res.json(parsedData);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze food.' });
  }
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));