import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Copy,
  Trash2,
  Eye,
  Gamepad2,
  Sparkles,
  Download,
  Upload,
  CheckCircle2,
  X,
  FileCode
} from 'lucide-react';
import { storage } from '../../services/storage';
import { sound } from '../../services/audio';
import { QuestionSet, Subject, GradeLevel, Question, QuestionType } from '../../types';

interface QuestionBankViewProps {
  onNavigateToAI: () => void;
  onLaunchGame: (questionSet: QuestionSet) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  onNavigateToAI,
  onLaunchGame
}) => {
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>(storage.getQuestionSets());
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [previewSet, setPreviewSet] = useState<QuestionSet | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual Form State
  const [manualTitle, setManualTitle] = useState('');
  const [manualSubject, setManualSubject] = useState<Subject>('IPAS');
  const [manualGrade, setManualGrade] = useState<GradeLevel>(4);
  const [manualTopic, setManualTopic] = useState('');
  const [manualQuestions, setManualQuestions] = useState<Question[]>([
    {
      id: `q_man_${Date.now()}_1`,
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      difficulty: 'medium'
    }
  ]);

  const refreshList = () => {
    setQuestionSets(storage.getQuestionSets());
  };

  const filteredSets = questionSets.filter(qs => {
    const matchesSubject = selectedSubject === 'all' || qs.subject === selectedSubject;
    const matchesGrade = selectedGrade === 0 || qs.grade === selectedGrade;
    const matchesSearch =
      qs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qs.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesGrade && matchesSearch;
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus paket soal "${title}"?`)) {
      sound.playClick();
      storage.deleteQuestionSet(id);
      refreshList();
    }
  };

  const handleDuplicate = (qs: QuestionSet) => {
    sound.playClick();
    const duplicated: QuestionSet = {
      ...qs,
      id: `qs_${Date.now()}`,
      title: `${qs.title} (Salinan)`,
      createdAt: new Date().toISOString(),
      isDemo: false
    };
    storage.saveQuestionSet(duplicated);
    refreshList();
  };

  const handleCreateManualSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualTopic.trim()) return;

    const validQuestions = manualQuestions.filter(q => q.question.trim().length > 0);
    if (validQuestions.length === 0) {
      alert('Harap masukkan minimal 1 butir pertanyaan.');
      return;
    }

    const newSet: QuestionSet = {
      id: `qs_man_${Date.now()}`,
      title: manualTitle.trim(),
      subject: manualSubject,
      grade: manualGrade,
      topic: manualTopic.trim(),
      createdAt: new Date().toISOString(),
      questions: validQuestions,
      isDemo: false
    };

    storage.saveQuestionSet(newSet);
    sound.playVictory();
    setShowManualModal(false);
    refreshList();
    setManualTitle('');
    setManualTopic('');
  };

  const exportSetJSON = (qs: QuestionSet) => {
    sound.playClick();
    const jsonStr = JSON.stringify(qs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Paket_Soal_${qs.subject}_${qs.title.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900">
            Bank Soal & Paket Pembelajaran
          </h2>
          <p className="text-xs text-slate-500">
            Kumpulan bank soal tersimpan untuk digunakan berulang pada asesmen kelas
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowManualModal(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Soal Manual</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onNavigateToAI();
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Buat dengan AI</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul kuis atau materi pokok..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
          />
        </div>

        {/* Filter Mata Pelajaran */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="all">Semua Mata Pelajaran</option>
            <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
            <option value="IPAS">IPAS</option>
            <option value="Matematika">Matematika</option>
            <option value="Seni Rupa">Seni Rupa</option>
            <option value="Bahasa Inggris">Bahasa Inggris</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="Pendidikan Agama">Pendidikan Agama</option>
            <option value="Seni dan Prakarya">Seni dan Prakarya</option>
          </select>
        </div>

        {/* Filter Kelas */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(parseInt(e.target.value))}
            className="w-full sm:w-36 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value={0}>Semua Kelas</option>
            <option value={4}>Kelas IV SD</option>
            <option value={5}>Kelas V SD</option>
            <option value={6}>Kelas VI SD</option>
          </select>
        </div>

      </div>

      {/* Cards List */}
      {filteredSets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <h4 className="text-sm font-bold text-slate-700 mb-1">
            Tidak Ada Paket Soal yang Cocok
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Gunakan tombol "Buat dengan AI" atau "Buat Soal Manual" untuk menambahkan bank soal baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSets.map(qs => (
            <div
              key={qs.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {qs.subject}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Kelas {qs.grade} SD
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 line-clamp-1 mb-1">
                  {qs.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  Topik: {qs.topic} • {qs.questions.length} butir pertanyaan
                </p>

                {qs.isDemo && (
                  <span className="inline-block px-1.5 py-0.2 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-medium mb-3">
                    Contoh Kurikulum Standar
                  </span>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setPreviewSet(qs);
                    }}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Pratinjau Soal"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDuplicate(qs)}
                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Duplikasi Paket"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => exportSetJSON(qs)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Ekspor JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(qs.id, qs.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Hapus Paket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onLaunchGame(qs);
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Mainkan</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewSet && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">
                  {previewSet.subject} • Kelas {previewSet.grade} SD
                </span>
                <h3 className="font-heading font-bold text-slate-900 text-lg">
                  {previewSet.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewSet(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {previewSet.questions.map((q, i) => (
                <div key={q.id || i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-700">Soal #{i + 1}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold text-[10px]">
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{q.question}</p>
                  
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2 rounded-lg border text-xs ${
                            optIdx === q.correctAnswer
                              ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt} {optIdx === q.correctAnswer && '✓ (Kunci)'}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.explanation && (
                    <p className="text-[11px] text-slate-500 pt-1">
                      <strong>Penjelasan:</strong> {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => setPreviewSet(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  const target = previewSet;
                  setPreviewSet(null);
                  onLaunchGame(target);
                }}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
              >
                Mulai Permainan dengan Paket Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Question Creator Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-xl border border-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Buat Paket Soal Manual
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualSet} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Judul Paket Soal
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kuis Ceria Rantai Makanan"
                    value={manualTitle}
                    onChange={e => setManualTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Topik / Materi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ekosistem Sawah"
                    value={manualTopic}
                    onChange={e => setManualTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mata Pelajaran
                  </label>
                  <select
                    value={manualSubject}
                    onChange={e => setManualSubject(e.target.value as Subject)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                    <option value="IPAS">IPAS</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Seni Rupa">Seni Rupa</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Pendidikan Agama">Pendidikan Agama</option>
                    <option value="Seni dan Prakarya">Seni dan Prakarya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tingkat Kelas
                  </label>
                  <select
                    value={manualGrade}
                    onChange={e => setManualGrade(parseInt(e.target.value) as GradeLevel)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value={4}>Kelas IV SD</option>
                    <option value={5}>Kelas V SD</option>
                    <option value={6}>Kelas VI SD</option>
                  </select>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-slate-800 text-sm">Daftar Pertanyaan:</h4>
                {manualQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600">Butir #{idx + 1}</span>
                      {manualQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setManualQuestions(manualQuestions.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Pertanyaan..."
                      value={q.question}
                      onChange={e => {
                        const copy = [...manualQuestions];
                        copy[idx].question = e.target.value;
                        setManualQuestions(copy);
                      }}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center space-x-1.5">
                          <input
                            type="radio"
                            name={`correct_${idx}`}
                            checked={q.correctAnswer === optIdx}
                            onChange={() => {
                              const copy = [...manualQuestions];
                              copy[idx].correctAnswer = optIdx;
                              setManualQuestions(copy);
                            }}
                          />
                          <input
                            type="text"
                            required
                            placeholder={`Pilihan ${String.fromCharCode(65 + optIdx)}`}
                            value={opt}
                            onChange={e => {
                              const copy = [...manualQuestions];
                              copy[idx].options[optIdx] = e.target.value;
                              setManualQuestions(copy);
                            }}
                            className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                          />
                        </div>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Penjelasan / Pembahasan..."
                      value={q.explanation}
                      onChange={e => {
                        const copy = [...manualQuestions];
                        copy[idx].explanation = e.target.value;
                        setManualQuestions(copy);
                      }}
                      className="w-full px-2.5 py-1 border border-slate-200 rounded-lg bg-white text-slate-600"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setManualQuestions([
                    ...manualQuestions,
                    {
                      id: `q_man_${Date.now()}_${manualQuestions.length + 1}`,
                      type: 'multiple_choice',
                      question: '',
                      options: ['', '', '', ''],
                      correctAnswer: 0,
                      explanation: '',
                      difficulty: 'medium'
                    }
                  ])}
                  className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-blue-600 font-bold hover:bg-blue-50 transition-colors"
                >
                  + Tambah Butir Soal Lain
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Simpan ke Bank Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
