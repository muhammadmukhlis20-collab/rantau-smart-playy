import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Request body size limit
app.use(express.json({ limit: '5mb' }));

// Health and Status Check
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  res.json({
    status: 'ok',
    aiEnabled: hasKey,
    model: model,
    school: 'SDN 32 Rantau Bayur',
    app: 'RANTAU SMART PLAY'
  });
});

// Endpoint: AI Pembuat Soal Pembelajaran SD
app.post('/api/generate-questions', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Kunci API Gemini (GEMINI_API_KEY) belum dikonfigurasi di server. Silakan gunakan pembuatan soal manual atau tambahkan API key di environment.'
      });
    }

    const {
      subject = 'Bahasa Indonesia',
      grade = 4,
      topic = 'Membaca Pemahaman',
      learningObjective = '',
      count = 5,
      type = 'multiple_choice',
      difficulty = 'medium',
      context = ''
    } = req.body;

    const parsedCount = Math.min(Math.max(parseInt(count) || 5, 1), 20);
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const ai = new GoogleGenAI({});

    const prompt = `Anda adalah ahli kurikulum dan guru sekolah dasar berprestasi di Indonesia.
Buatlah ${parsedCount} butir soal latihan/permainan edukatif untuk siswa Sekolah Dasar kelas ${grade}.

Data permintaan:
- Mata Pelajaran: ${subject}
- Kelas: ${grade} SD
- Topik/Materi: ${topic}
- Tujuan Pembelajaran: ${learningObjective || 'Memahami dan mengaplikasikan konsep ' + topic}
- Tipe Soal: ${type} (jika 'all', campurkan pilihan ganda, benar-salah, dan jawaban singkat)
- Tingkat Kesulitan: ${difficulty} (mudah / sedang / menantang)
${context ? `- Konteks/Teks Bacaan/Materi Tambahan: "${context}"` : ''}

Panduan Wajib Pembuatan Soal SD:
1. Bahasa Indonesia yang ramah anak, edukatif, sopan, dan jelas (tidak berbelit-belit).
2. Sesuai taraf kognitif siswa kelas ${grade} SD.
3. Untuk pilihan ganda ('multiple_choice'):
   - Sediakan tepat 4 pilihan jawaban yang masuk akal di array "options".
   - "correctAnswer" harus berupa indeks angka (0, 1, 2, atau 3) yang menunjukkan jawaban yang benar.
4. Untuk benar/salah ('true_false'):
   - "options" berisi ["Benar", "Salah"].
   - "correctAnswer" berisi 0 jika Benar, atau 1 jika Salah.
5. Untuk jawaban singkat ('short_answer'):
   - "options" boleh kosong [].
   - "correctAnswer" adalah string jawaban singkat yang tepat (1-3 kata).
6. Berikan "explanation" yang membimbing dan menjelaskan MENGAPA jawaban tersebut benar secara mendidik.
7. Pastikan tidak ada soal yang ambigu atau menyesatkan.

Keluarkan respon HANYA dalam format JSON murni yang valid sesuai struktur berikut:
{
  "title": "Kuis ${subject} - ${topic}",
  "subject": "${subject}",
  "grade": ${grade},
  "topic": "${topic}",
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "question": "Teks pertanyaan di sini",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "correctAnswer": 0,
      "explanation": "Penjelasan mendidik mengapa jawaban ini benar.",
      "difficulty": "${difficulty}"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const responseText = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Clean possible markdown code fences
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    // Validate structure
    if (!parsedData || !Array.isArray(parsedData.questions) || parsedData.questions.length === 0) {
      throw new Error('Hasil AI tidak memiliki daftar soal yang valid.');
    }

    // Ensure question IDs and sanitized fields
    parsedData.questions = parsedData.questions.map((q: any, idx: number) => ({
      id: q.id || `q_${Date.now()}_${idx + 1}`,
      type: q.type || 'multiple_choice',
      question: String(q.question || `Soal ${idx + 1}`).trim(),
      options: Array.isArray(q.options) ? q.options.map(String) : [],
      correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
      explanation: String(q.explanation || 'Pembahasan jawaban pembelajaran.').trim(),
      difficulty: q.difficulty || difficulty
    }));

    res.json({
      success: true,
      data: parsedData
    });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      error: error.message || 'Gagal membuat soal dengan AI. Silakan coba kembali atau gunakan bank soal manual.'
    });
  }
});

// Endpoint: AI Analisis Pembelajaran dan Rekomendasi Remedial/Pengayaan
app.post('/api/analyze-learning', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Kunci API Gemini belum tersedia untuk analisis AI otomatis.'
      });
    }

    const {
      topic = 'Pembelajaran Tematik',
      className = 'Kelas V',
      totalParticipants = 0,
      averageScore = 0,
      weakQuestions = [],
      strongTopics = []
    } = req.body;

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const ai = new GoogleGenAI({});

    const prompt = `Anda adalah konsultan pedagogi pendidikan dasar untuk SDN 32 Rantau Bayur.
Berikan analisis pembelajaran dan rekomendasi tindakan kelas yang empatik, konstruktif, dan ramah anak berdasarkan data asesmen berikut:

Data Asesmen Kelas:
- Kelas: ${className}
- Materi/Topik: ${topic}
- Jumlah Peserta: ${totalParticipants} siswa
- Rata-rata Skor: ${averageScore}%
- Soal dengan tingkat kesalahan tertinggi: ${JSON.stringify(weakQuestions)}
- Materi/Konsep yang sudah dikuasai baik: ${JSON.stringify(strongTopics)}

Panduan Analisis:
1. Buat ringkasan reflektif untuk guru tentang apa yang terjadi di kelas (1 paragraf hangat dan solutif).
2. Sebutkan kekuatan/kemajuan yang patut diapresiasi dari siswa.
3. Berikan rekomendasi kegiatan REMEDIAL yang bersifat konkret (misalnya gunakan alat peraga konkret, permainan berpasangan, jembatan keledai, atau gambar visual). DILARANG melabeli siswa malas atau kurang mampu.
4. Berikan rekomendasi kegiatan PENGAYAAN yang menantang kreativitas dan kerja sama tim.

Format JSON wajib:
{
  "summary": "Teks ringkasan pemahaman kelas...",
  "strengths": ["Kemajuan 1", "Kemajuan 2"],
  "remedialAdvice": [
    "Langkah remedial konkret 1 dengan media konkret",
    "Langkah remedial 2"
  ],
  "enrichmentAdvice": [
    "Kegiatan pengayaan eksplorasi 1",
    "Kegiatan pengayaan kreatif 2"
  ],
  "teacherEncouragement": "Kalimat motivasi positif untuk guru pengajar."
}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      }
    });

    const responseText = response.text || '';
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    res.json({
      success: true,
      analysis: parsed
    });
  } catch (error: any) {
    console.error('Error analyzing learning:', error);
    res.status(500).json({
      error: error.message || 'Gagal memproses analisis pembelajaran AI.'
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RANTAU SMART PLAY server running on port ${PORT}`);
  });
}

startServer();
