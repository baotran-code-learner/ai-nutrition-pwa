import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import { cleanBase64String } from './base64FileHelper.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze-food', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;
    const cleanedData = cleanBase64String(base64Data);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze the food in this image. Return strictly JSON:
        {
          "items": [{"name": "string", "portion": "string", "calories": 0}],
          "total_nutrition": {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}
        }`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: cleanedData,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Remove potential markdown formatting if not handled by responseMimeType
    const jsonString = text.replace(/```json|```/gi, '').trim();
    res.json(JSON.parse(jsonString));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));