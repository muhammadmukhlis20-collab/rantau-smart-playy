import React, { useState } from 'react';
import {
  Gamepad2,
  Play,
  Users,
  Tv,
  User,
  Sparkles,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  Layers
} from 'lucide-react';
import { storage } from '../../services/storage';
import { sound } from '../../services/audio';
import { QuestionSet } from '../../types';
import { QuizAdventureGame } from './QuizAdventureGame';
import { WheelOfChallengeGame } from './WheelOfChallengeGame';
import { MatchAndLearnGame } from './MatchAndLearnGame';

interface GameCenterViewProps {
  initialGameType?: string;
  initialQuestionSet?: QuestionSet | null;
}

export const GameCenterView: React.FC<GameCenterViewProps> = ({
  initialGameType = '',
  initialQuestionSet = null,
}) => {
  const classrooms = storage.getClassrooms();
  const questionSets = storage.getQuestionSets();

  // Selected game config
  const [selectedGameType, setSelectedGameType] = useState<
    'quiz_adventure' | 'challenge_wheel' | 'match_learn'
  >(
    (initialGameType as any) || 'quiz_adventure'
  );

  const [selectedPlayMode, setSelectedPlayMode] = useState<
    'individual' | 'group' | 'projector'
  >('individual');

  const [selectedClassId, setSelectedClassId] = useState<string>(
    classrooms[0]?.id || ''
  );

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [customPlayerName, setCustomPlayerName] = useState<string>('');

  const [selectedQuestionSetId, setSelectedQuestionSetId] = useState<string>(
    initialQuestionSet?.id || questionSets[0]?.id || ''
  );

  // Active playing state
  const [isPlaying, setIsPlaying] = useState(Boolean(initialQuestionSet));

  const activeClass = classrooms.find(c => c.id === selectedClassId);
  const studentsInClass = storage.getStudents(selectedClassId);
  const activeQuestionSet =
    questionSets.find(q => q.id === selectedQuestionSetId) || questionSets[0];

  const handleStartGame = () => {
    sound.playClick();
    if (selectedGameType === 'quiz_adventure' && !activeQuestionSet) {
      alert('Silakan pilih paket soal terlebih dahulu di Bank Soal.');
      return;
    }
    setIsPlaying(true);
  };

  const getEffectivePlayerName = () => {
    if (customPlayerName.trim()) return customPlayerName.trim();
    if (selectedStudentId) {
      const st = studentsInClass.find(s => s.id === selectedStudentId);
      if (st) return st.name;
    }
    if (selectedPlayMode === 'projector') return 'Seluruh Kelas (Proyektor)';
    if (selectedPlayMode === 'group') return 'Kelompok Belajar A';
    return 'Siswa SDN 32 Rantau Bayur';
  };

  // If in active gameplay, render the specific game view
  if (isPlaying) {
    if (selectedGameType === 'quiz_adventure' && activeQuestionSet) {
      return (
        <QuizAdventureGame
          questionSet={activeQuestionSet}
          classId={selectedClassId || 'c_default'}
          className={activeClass?.name || 'SDN 32 Rantau Bayur'}
          studentId={selectedStudentId || undefined}
          studentName={getEffectivePlayerName()}
          playMode={selectedPlayMode}
          onExit={() => setIsPlaying(false)}
        />
      );
    }

    if (selectedGameType === 'challenge_wheel') {
      return <WheelOfChallengeGame onExit={() => setIsPlaying(false)} />;
    }

    if (selectedGameType === 'match_learn') {
      return <MatchAndLearnGame onExit={() => setIsPlaying(false)} />;
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold font-heading text-slate-900">
          Game Center Pembelajaran
        </h2>
        <p className="text-xs text-slate-500">
          Pusat permainan edukatif interaktif untuk penguatan materi dan asesmen formatif
        </p>
      </div>

      {/* Step 1: Select Game */}
      <div className="space-y-3">
        <h3 className="font-heading font-bold text-base text-slate-800 flex items-center space-x-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
          <span>Pilih Jenis Permainan</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Quiz Adventure */}
          <div
            onClick={() => {
              sound.playClick();
              setSelectedGameType('quiz_adventure');
            }}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
              selectedGameType === 'quiz_adventure'
                ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20 shadow-md'
                : 'border-slate-200 bg-white hover:border-blue-300 shadow-xs'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl mb-3 shadow-sm">
              🎮
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">
              Quiz Adventure
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Petualangan kuis kartu satu per satu dengan XP, lencana pencapaian, dan umpan balik edukatif ramah anak.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-blue-600">
              {selectedGameType === 'quiz_adventure' ? '✓ Terpilih' : 'Pilih Game'}
            </span>
          </div>

          {/* Roda Tantangan */}
          <div
            onClick={() => {
              sound.playClick();
              setSelectedGameType('challenge_wheel');
            }}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
              selectedGameType === 'challenge_wheel'
                ? 'border-purple-600 bg-purple-50/40 ring-2 ring-purple-600/20 shadow-md'
                : 'border-slate-200 bg-white hover:border-purple-300 shadow-xs'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xl mb-3 shadow-sm">
              🎡
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">
              Roda Tantangan Ceria
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Roda digital berputar acak untuk tanya jawab cepat, senam otak ceria, dan tantangan kerja sama tim.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-purple-600">
              {selectedGameType === 'challenge_wheel' ? '✓ Terpilih' : 'Pilih Game'}
            </span>
          </div>

          {/* Match & Learn */}
          <div
            onClick={() => {
              sound.playClick();
              setSelectedGameType('match_learn');
            }}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
              selectedGameType === 'match_learn'
                ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20 shadow-md'
                : 'border-slate-200 bg-white hover:border-emerald-300 shadow-xs'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl mb-3 shadow-sm">
              🧩
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">
              Match & Learn
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Permainan mencocokkan kartu istilah sains, konsep pecahan matematika, dan nilai karakter Pancasila.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              {selectedGameType === 'match_learn' ? '✓ Terpilih' : 'Pilih Game'}
            </span>
          </div>

        </div>
      </div>

      {/* Step 2: Play Mode Selection */}
      <div className="space-y-3">
        <h3 className="font-heading font-bold text-base text-slate-800 flex items-center space-x-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
          <span>Pilih Mode Tampilan & Peserta</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setSelectedPlayMode('individual');
            }}
            className={`p-4 rounded-xl border text-left flex items-center space-x-3 transition-all ${
              selectedPlayMode === 'individual'
                ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <User className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Mode Individu (Mandiri)</p>
              <p className="text-[11px] text-slate-500 font-normal">Satu siswa mengerjakan kuis secara personal</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setSelectedPlayMode('group');
            }}
            className={`p-4 rounded-xl border text-left flex items-center space-x-3 transition-all ${
              selectedPlayMode === 'group'
                ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Users className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Mode Kelompok</p>
              <p className="text-[11px] text-slate-500 font-normal">Diskusi kelompok bersama memecahkan soal</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setSelectedPlayMode('projector');
            }}
            className={`p-4 rounded-xl border text-left flex items-center space-x-3 transition-all ${
              selectedPlayMode === 'projector'
                ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Tv className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Mode Layar Proyektor</p>
              <p className="text-[11px] text-slate-500 font-normal">Tampilan besar untuk kuis interaktif seisi kelas</p>
            </div>
          </button>
        </div>
      </div>

      {/* Step 3: Class, Student, and Question Set Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-base text-slate-800 flex items-center space-x-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
          <span>Atur Kelas & Materi</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          
          {/* Class Select */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Pilih Kelas
            </label>
            <select
              value={selectedClassId}
              onChange={e => {
                setSelectedClassId(e.target.value);
                setSelectedStudentId('');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
            >
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.grade} SD)</option>
              ))}
            </select>
          </div>

          {/* Student or Player Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Pemain / Siswa Terpilih
            </label>
            {selectedPlayMode === 'individual' ? (
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="">-- Pilih Siswa Terdaftar --</option>
                {studentsInClass.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.xp} XP)</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder={selectedPlayMode === 'group' ? 'Nama Kelompok (mis. Kelompok Garuda)' : 'Layar Proyektor Kelas'}
                value={customPlayerName}
                onChange={e => setCustomPlayerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            )}
          </div>

          {/* Question Set Select (For Quiz Adventure) */}
          {selectedGameType === 'quiz_adventure' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Paket Soal Pembelajaran
              </label>
              <select
                value={selectedQuestionSetId}
                onChange={e => setSelectedQuestionSetId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
              >
                {questionSets.map(qs => (
                  <option key={qs.id} value={qs.id}>
                    [{qs.subject}] {qs.title} ({qs.questions.length} soal)
                  </option>
                ))}
              </select>
            </div>
          )}

        </div>

        {/* Launch Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {selectedGameType === 'quiz_adventure' && activeQuestionSet && (
              <span>Paket terpilih: <strong>{activeQuestionSet.title}</strong> ({activeQuestionSet.questions.length} butir)</span>
            )}
            {selectedGameType === 'challenge_wheel' && (
              <span>Kategori: Tantangan Cepat, Pengetahuan Seru, Gerak Ceria, Tebak Kata</span>
            )}
            {selectedGameType === 'match_learn' && (
              <span>Mencocokkan istilah dan definisi secara interaktif</span>
            )}
          </div>

          <button
            onClick={handleStartGame}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Mulai Permainan Sekarang</span>
          </button>
        </div>

      </div>

    </div>
  );
};
