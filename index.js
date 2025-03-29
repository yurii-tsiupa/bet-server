import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

app.post('/api/analyze', async (req, res) => {
  const { teamA, teamB, sport } = req.body;

  if (!teamA || !teamB || !sport) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const prompt = `Проаналізуй гру між ${teamA} та ${teamB} у виді спорту "${sport}". Дай короткий аналіз, ключові фактори та пораду для ставки.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    });

    const text = completion.choices[0].message.content;
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI error' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
