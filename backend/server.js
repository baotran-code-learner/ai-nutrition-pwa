import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/analyze-food', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;
    const cleanedData = base64Data.replace(/^data:image\/\w+;base64,/, '');

    const response = await groq.chat.completions.create({
      model: 'qwen/qwen3.6-27b',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this food image. Estimate realistic, non-zero nutritional numbers based on the plate contents and return JSON strictly matching this schema:
              {
                "items": [
                  { "name": "food item name", "portion": "1 cup", "calories": 200 }
                ],
                "total_nutrition": {
                  "calories": 650,
                  "protein_g": 35,
                  "carbs_g": 50,
                  "fat_g": 20
                }
              }`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType || 'image/jpeg'};base64,${cleanedData}`
              }
            }
          ]
        }
      ]
    });

    const resultText = response.choices[0].message.content;
    res.json(JSON.parse(resultText));
  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));