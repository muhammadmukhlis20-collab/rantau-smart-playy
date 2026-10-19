import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Gamepad2,
  BookOpen,
  Edit3,
  Sliders,
  HelpCircle,
  Check
} from 'lucide-react';
import { Subject, GradeLevel, QuestionType, Difficulty, Question, QuestionSet } from '../../types';
import { storage } from '../../services/storage';
import { sound } from '../../services/audio';

const SUBJECT_LIST: Subject[] = [
  'Pendidikan Pancasila',
  'IPAS',
  'Matematika',
  'Seni Rupa',
  'Bahasa Inggris',
  'Bahasa Indonesia',
  'Pendidikan Agama',
  'Seni dan Prakarya',
  'Mata Pelajaran Lainnya',
];

interface TopicPreset {
  subject: Subject;
  grade: GradeLevel;
  topic: string;
  objective: string;
}

const CURRICULUM_PRESETS: TopicPreset[] = [
  {
    subject: 'Pendidikan Pancasila',
    grade: 4,
    topic: 'Makna Sila-Sila Pancasila & Simbol Garuda',
    objective: 'Siswa memahami arti 5 simbol sila Pancasila dan penerapannya dalam gotong royong di sekolah.'
  },
  {
    subject: 'Pendidikan Pancasila',
    grade: 5,
    topic: 'Hak dan Kewajiban Warga Sekolah & Rumah',
    objective: 'Siswa dapat membedakan hak dan kewajiban serta melaksanakannya secara bertanggung jawab.'
  },
  {
    subject: 'IPAS',
    grade: 4,
    topic: 'Bagian Tumbuhan dan Proses Fotosintesis',
    objective: 'Siswa mengidentifikasi fungsi akar, batang, daun, klorofil, dan proses fotosintesis.'
  },
  {
    subject: 'IPAS',
    grade: 5,
    topic: 'Rantai Makanan dan Jaring-Jaring Ekosistem',
    objective: 'Siswa memahami peran produsen, konsumen herbivora/karnivora, dan dekomposer dalam ekosistem.'
  },
  {
    subject: 'Matematika',
    grade: 4,
    topic: 'Keliling dan Luas Persegi & Persegi Panjang',
    objective: 'Siswa mampu menghitung keliling dan luas bangun datar dalam pemecahan masalah kontekstual.'
  },
  {
    subject: 'Matematika',
    grade: 5,
    topic: 'Operasi Hitung Pecahan Biasa & Desimal',
    objective: 'Siswa mampu menjumlahkan dan mengurangkan pecahan dengan penyebut berbeda secara tepat.'
  },
  {
    subject: 'Seni Rupa',
    grade: 4,
    topic: 'Unsur Seni Rupa, Tekstur, dan Lingkaran Warna',
    objective: 'Siswa mengenal warna primer (pokok), warna sekunder (campuran), dan tekstur permukaan karya.'
  },
  {
    subject: 'Seni Rupa',
    grade: 5,
    topic: 'Ragam Hias Nusantara dan Motif Tradisional',
    objective: 'Siswa mengenal motif flora, fauna, dan geometris tradisional khas berbagai daerah nusantara.'
  },
  {
    subject: 'Bahasa Inggris',
    grade: 4,
    topic: 'Things in the Classroom and School Environment',
    objective: 'Students can identify classroom objects and use prepositions of place (in, on, under).'
  },
  {
    subject: 'Bahasa Inggris',
    grade: 5,
    topic: 'Daily Activities, Time Expression, and Hobbies',
    objective: 'Students can express daily routines, telling time, and talk about simple hobbies in English.'
  }
];

interface AIGeneratorViewProps {
  onSaveToBankSuccess?: () => void;
  onLaunchGame?: (questionSet: QuestionSet) => void;
}

export const AIGeneratorView: React.FC<AIGeneratorViewProps> = ({
  onSaveToBankSuccess,
  onLaunchGame
}) => {
  // Form state
  const [subject, setSubject] = useState<Subject>('IPAS');
  const [grade, setGrade] = useState<GradeLevel>(5);
  const [topic, setTopic] = useState('Organ Pernapasan Manusia');
  const [learningObjective, setLearningObjective] = useState(
    'Siswa mampu mengidentifikasi organ pernapasan pada manusia dan fungsinya secara tepat.'
  );
  const [count, setCount] = useState<number>(5);
  const [type, setType] = useState<QuestionType | 'all'>('multiple_choice');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [context, setContext] = useState('');

  // Generation status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Generated draft questions
  const [draftTitle, setDraftTitle] = useState<string>('');
  const [draftQuestions, setDraftQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const handleGenerateAI = async () => {
    sound.playClick();
    setLoading(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade,
          topic,
          learningObjective,
          count,
          type,
          difficulty,
          context,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(
          resData.error || 'Terjadi kesalahan saat memanggil AI Gemini.'
        );
      }

      setDraftTitle(resData.data.title || `Kuis ${subject} - ${topic}`);
      setDraftQuestions(resData.data.questions || []);
      sound.playVictory();
      setSuccessNotice(`Berhasil membuat ${resData.data.questions?.length || 0} soal draf dengan AI Gemini.`);
    } catch (err: any) {
      console.warn('AI Generation failed, using intelligent curriculum generator:', err);
      setErrorMessage(
        err.message || 'Koneksi ke AI Gemini tidak tersedia. Anda dapat menggunakan draf kurikulum terpadu di bawah.'
      );
      // Generate intelligent offline educational template so teacher is never stuck!
      generateCurriculumTemplate();
    } finally {
      setLoading(false);
    }
  };

  // Fallback template generator when API Key is missing or rate limited
  const generateCurriculumTemplate = () => {
    const templates: Question[] = [];
    for (let i = 1; i <= count; i++) {
      if (type === 'true_false') {
        templates.push({
          id: `q_draft_${Date.now()}_${i}`,
          type: 'true_false',
          question: `[Draf Soal ${i}] Pernyataan tentang materi ${topic} untuk siswa kelas ${grade} SD.`,
          options: ['Benar', 'Salah'],
          correctAnswer: 0,
          explanation: `Penjelasan mendidik mengenai konsep ${topic} pada soal ${i}.`,
          difficulty: difficulty
        });
      } else {
        templates.push({
          id: `q_draft_${Date.now()}_${i}`,
          type: 'multiple_choice',
          question: `Pertanyaan latihan ${i} terkait konsep ${topic} pada mata pelajaran ${subject} kelas ${grade} SD?`,
          options: [
            `Konsep inti A tentang ${topic}`,
            `Pilihan B yang relevan`,
            `Pilihan C sebagai pembanding`,
            `Pilihan D sebagai pengecoh edukatif`
          ],
          correctAnswer: 0,
          explanation: `Pembahasan jawaban yang benar untuk konsep ${topic}.`,
          difficulty: difficulty
        });
      }
    }
    setDraftTitle(`Draf Latihan: ${subject} - ${topic}`);
    setDraftQuestions(templates);
    setSuccessNotice('Draf kurikulum berhasil dibuat. Anda dapat menyunting butir soal secara langsung.');
  };

  const handleUpdateQuestion = (idx: number, updated: Question) => {
    const list = [...draftQuestions];
    list[idx] = updated;
    setDraftQuestions(list);
  };

  const handleDeleteQuestion = (idx: number) => {
    sound.playClick();
    const list = draftQuestions.filter((_, i) => i !== idx);
    setDraftQuestions(list);
  };

  const handleAddBlankQuestion = () => {
    sound.playClick();
    const newQ: Question = {
      id: `q_new_${Date.now()}`,
      type: 'multiple_choice',
      question: 'Tuliskan teks pertanyaan baru di sini...',
      options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
      correctAnswer: 0,
      explanation: 'Penjelasan mengapa pilihan ini benar.',
      difficulty: 'medium'
    };
    setDraftQuestions([...draftQuestions, newQ]);
  };

  const handleSaveToBank = () => {
    if (draftQuestions.length === 0) {
      alert('Tidak ada soal yang dapat disimpan.');
      return;
    }

    const questionSet: QuestionSet = {
      id: `qs_${Date.now()}`,
      title: draftTitle || `Paket ${subject} - ${topic}`,
      subject,
      grade,
      topic,
      createdAt: new Date().toISOString(),
      questions: draftQuestions,
      isDemo: false
    };

    storage.saveQuestionSet(questionSet);
    sound.playVictory();
    setSuccessNotice('Paket soal berhasil disimpan ke Bank Soal!');
    if (onSaveToBankSuccess) {
      setTimeout(() => onSaveToBankSuccess(), 800);
    }
  };

  const handleQuickLaunch = () => {
    if (draftQuestions.length === 0) {
      alert('Silakan buat soal terlebih dahulu sebelum meluncurkan permainan.');
      return;
    }
    const questionSet: QuestionSet = {
      id: `qs_${Date.now()}`,
      title: draftTitle || `Paket ${subject} - ${topic}`,
      subject,
      grade,
      topic,
      createdAt: new Date().toISOString(),
      questions: draftQuestions,
      isDemo: false
    };
    storage.saveQuestionSet(questionSet);
    if (onLaunchGame) {
      onLaunchGame(questionSet);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Curriculum Assistant (Gemini)</span>
          </div>
          <h2 className="text-2xl font-bold font-heading text-slate-900">
            Pembuat Soal Otomatis & Terstruktur
          </h2>
          <p className="text-xs text-slate-500">
            Hasilkan butir soal berkualitas sesuai tujuan pembelajaran SD tanpa perlu mengetik dari nol
          </p>
        </div>
      </div>

      {/* Main Grid: Form Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Generator Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-base text-slate-900 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Parameter Pembelajaran</span>
          </h3>

          <div className="space-y-3 text-xs">
            
            {/* Subject */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mata Pelajaran
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value as Subject)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20"
              >
                {SUBJECT_LIST.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Quick Curriculum Template Chips */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                Inspirasi Topik Cepat ({subject}):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CURRICULUM_PRESETS.filter(p => p.subject === subject).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setGrade(preset.grade);
                      setTopic(preset.topic);
                      setLearningObjective(preset.objective);
                    }}
                    className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-semibold border border-blue-200 transition-colors text-left"
                  >
                    Kls {preset.grade}: {preset.topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade Level */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tingkat Kelas SD
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[4, 5, 6].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g as GradeLevel)}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      grade === g
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Kelas {g} SD
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Materi / Topik Pembelajaran
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Contoh: Ekosistem dan Rantai Makanan"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Learning Objective */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tujuan Pembelajaran (Capaian)
              </label>
              <textarea
                rows={2}
                value={learningObjective}
                onChange={e => setLearningObjective(e.target.value)}
                placeholder="Contoh: Siswa dapat membedakan produsen, konsumen, dan pengurai..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Count & Difficulty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jumlah Soal
                </label>
                <select
                  value={count}
                  onChange={e => setCount(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                >
                  <option value={5}>5 Soal (Cepat)</option>
                  <option value={10}>10 Soal (Standar)</option>
                  <option value={20}>20 Soal (Lengkap)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tingkat Kesulitan
                </label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as Difficulty)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                >
                  <option value="easy">Mudah (Dasar)</option>
                  <option value="medium">Sedang (Penerapan)</option>
                  <option value="challenging">Menantang (HOTS)</option>
                </select>
              </div>
            </div>

            {/* Question Type */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tipe Format Soal
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="multiple_choice">Pilihan Ganda (4 Pilihan)</option>
                <option value="true_false">Benar atau Salah</option>
                <option value="short_answer">Jawaban Singkat</option>
                <option value="story_application">Soal Cerita / Kontekstual</option>
              </select>
            </div>

            {/* Context / Additional Material */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Teks Bacaan / Materi Tambahan (Opsional)
              </label>
              <textarea
                rows={2}
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="Tempelkan ringkasan materi dari buku tema jika ada..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleGenerateAI}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 text-white shadow-md transition-all active:scale-98 ${
                loading
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Sedang Merumuskan Soal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Hasilkan Soal dengan AI Gemini</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={generateCurriculumTemplate}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Gunakan Format Draf Manual</span>
            </button>
          </div>

          {/* Error / Alert notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <p className="font-semibold">Info Koneksi AI:</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {successNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

        </div>

        {/* Generated Questions Review & Editor (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Pratinjau & Penyuntingan Draf
              </h3>
              <p className="text-xs text-slate-500">
                {draftQuestions.length} butir soal siap disunting sebelum disimpan ke bank
              </p>
            </div>

            {draftQuestions.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveToBank}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan ke Bank</span>
                </button>

                <button
                  onClick={handleQuickLaunch}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Mainkan di Kelas</span>
                </button>
              </div>
            )}
          </div>

          {/* Title editor */}
          {draftQuestions.length > 0 && (
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Paket Soal
              </label>
              <input
                type="text"
                value={draftTitle}
                onChange={e => setDraftTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50 text-slate-900"
              />
            </div>
          )}

          {/* Questions List */}
          {draftQuestions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <Sparkles className="w-12 h-12 mb-3 text-purple-300" />
              <h4 className="text-sm font-bold text-slate-700 mb-1">
                Belum Ada Draf Soal
              </h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Isi parameter di sebelah kiri lalu klik tombol "Hasilkan Soal dengan AI Gemini" untuk merumuskan soal kuis otomatis.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {draftQuestions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-700">
                      Soal #{idx + 1} ({q.type === 'multiple_choice' ? 'Pilihan Ganda' : q.type === 'true_false' ? 'Benar/Salah' : 'Jawaban Singkat'})
                    </span>

                    <button
                      onClick={() => handleDeleteQuestion(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Hapus Soal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Question text edit */}
                  <textarea
                    rows={2}
                    value={q.question}
                    onChange={e => handleUpdateQuestion(idx, { ...q, question: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg"
                  />

                  {/* Options */}
                  {q.type !== 'short_answer' && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Pilihan Jawaban (Klik lingkaran untuk memilih kunci jawaban):
                      </p>
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctAnswer === optIdx;
                        return (
                          <div key={optIdx} className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                handleUpdateQuestion(idx, { ...q, correctAnswer: optIdx });
                              }}
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                                isCorrect
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'bg-white border-slate-300 hover:border-emerald-500'
                              }`}
                            >
                              {isCorrect && <Check className="w-3 h-3 stroke-[3]" />}
                            </button>
                            <input
                              type="text"
                              value={opt}
                              onChange={e => {
                                const newOpts = [...q.options];
                                newOpts[optIdx] = e.target.value;
                                handleUpdateQuestion(idx, { ...q, options: newOpts });
                              }}
                              className={`flex-1 px-2.5 py-1 text-xs border rounded-lg bg-white ${
                                isCorrect
                                  ? 'border-emerald-400 font-semibold text-emerald-900 bg-emerald-50/30'
                                  : 'border-slate-200 text-slate-800'
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-0.5">
                      Pembahasan & Umpan Balik Siswa:
                    </label>
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={e => handleUpdateQuestion(idx, { ...q, explanation: e.target.value })}
                      className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddBlankQuestion}
                className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center justify-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Butir Soal Baru</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
