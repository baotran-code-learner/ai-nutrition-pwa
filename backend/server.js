import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
console.log('Active Key Prefix:', process.env.GEMINI_API_KEY?.substring(0, 10));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze-food', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;

    // Updated model to active stable version: gemini-2.0-flash
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const cleanedData = base64Data.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Analyze this food image and return JSON:
    {
      "items": [{"name": "string", "portion": "string", "calories": 0}],
      "total_nutrition": {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}
    }`;

    const result = await model.generateContent([
      { inlineData: { mimeType: mimeType || 'image/jpeg', data: cleanedData } },
      prompt
    ]);

    const response = await result.response;
    res.json(JSON.parse(response.text()));
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));