import express from 'express';
import cors from 'cors';
//import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 🟢 Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, '.env'),
  override: true
});

const app = express();

// Startup Key Check
if (!process.env.GROQ_API_KEY) {
  console.error('❌ CRITICAL ERROR: GROQ_API_KEY is not loaded from environment variables!');
} else {
  console.log(`✅ Groq Key Loaded: ${process.env.GROQ_API_KEY.slice(0, 8)}...`);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/analyze-food', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;
    const cleanedData = base64Data.replace(/^data:image\/\w+;base64,/, '');

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `Analyze this food image and return strictly valid JSON matching this structure:
    {
      "items": [{"name": "string", "portion": "string", "calories": 0}],
      "total_nutrition": {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}
    }`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: cleanedData,
          mimeType: mimeType || 'image/jpeg'
        }
      }
    ]);

    const parsedData = JSON.parse(result.response.text());
    res.json(parsedData);
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze food.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});