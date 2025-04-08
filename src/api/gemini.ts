import axios from "axios";

const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY`;

export const generateTranslationQuestion = async (
  category: string,
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<{
  indonesian: string;
  english: string;
} | null> => {
  const prompt = `
Buat satu soal menerjemahkan dari Bahasa Indonesia ke Bahasa Inggris.
Kategori: "${category}"
Tingkat kesulitan: "${difficulty}"

Petunjuk tingkat kesulitan:
- Easy: kalimat pendek, kosa kata umum.
- Medium: kalimat percakapan sehari-hari, variasi kata kerja.
- Hard: kalimat kompleks, idiom, atau struktur tata bahasa yang lebih tinggi.

Jawab hanya dalam format JSON berikut:

{
  "indonesian": "Selamat pagi",
  "english": "Good morning"
}

Jangan tambahkan penjelasan lain, hanya JSON.
`;

  try {
    const response = await axios.post(URL, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const text = response.data.candidates[0].content.parts[0].text;
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (err) {
    console.error("Failed to fetch question from Gemini:", err);
    return null;
  }
};
