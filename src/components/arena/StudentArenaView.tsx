import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Award,
  Play,
  RotateCcw,
  User,
  ArrowRight,
  School,
  Star,
  CheckCircle2
} from 'lucide-react';
import { storage, AVAILABLE_BADGES } from '../../services/storage';
import { sound } from '../../services/audio';
import { Student, QuestionSet } from '../../types';
import { QuizAdventureGame } from '../games/QuizAdventureGame';
import { WheelOfChallengeGame } from '../games/WheelOfChallengeGame';
import { MatchAndLearnGame } from '../games/MatchAndLearnGame';

interface StudentArenaViewProps {
  onGoToTeacherDashboard: () => void;
}

export const StudentArenaView: React.FC<StudentArenaViewProps> = ({
  onGoToTeacherDashboard
}) => {
  const classrooms = storage.getClassrooms();
  const allStudents = storage.getStudents();
  const questionSets = storage.getQuestionSets();
  const settings = storage.getSettings();

  const [selectedClassId, setSelectedClassId] = useState<string>(classrooms[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [activeGame, setActiveGame] = useState<'quiz' | 'wheel' | 'match' | null>(null);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<QuestionSet>(
    questionSets[0]
  );

  const studentsInClass = allStudents.filter(s => s.classId === selectedClassId);
  const currentStudent = allStudents.find(s => s.id === selectedStudentId);

  const handleLaunchGame = (gameType: 'quiz' | 'wheel' | 'match') => {
    sound.playClick();
    setActiveGame(gameType);
  };

  // If inside active gameplay
  if (activeGame === 'quiz' && selectedQuestionSet) {
    return (
      <QuizAdventureGame
        questionSet={selectedQuestionSet}
        classId={selectedClassId}
        className={classrooms.find(c => c.id === selectedClassId)?.name || 'Kelas SD'}
        studentId={currentStudent?.id}
        studentName={currentStudent?.name || 'Siswa Hebat'}
        playMode="individual"
        onExit={() => setActiveGame(null)}
      />
    );
  }

  if (activeGame === 'wheel') {
    return <WheelOfChallengeGame onExit={() => setActiveGame(null)} />;
  }

  if (activeGame === 'match') {
    return <MatchAndLearnGame onExit={() => setActiveGame(null)} />;
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8">
      
      {/* Playful Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3">
            <span>✨ Arena Bermain Siswa</span>
            <span>•</span>
            <span>{settings.schoolName}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
            Selamat Datang di RANTAU SMART PLAY!
          </h1>
          <p className="text-amber-300 font-bold text-base sm:text-lg mt-1 font-heading">
            Smart Learning, Happy Classroom.
          </p>

          <p className="text-blue-100 text-xs sm:text-sm mt-3 leading-relaxed max-w-xl">
            Ayo bermain sambil mengasah ilmu pengetahuan! Kumpulkan poin XP, buka lencana prestasi baru, dan selesaikan berbagai tantangan seru bersama teman-teman.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleLaunchGame('quiz')}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-slate-900" />
              <span>Mulai Quiz Adventure!</span>
            </button>

            <button
              onClick={onGoToTeacherDashboard}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-sm border border-white/30 transition-all"
            >
              Masuk Dashboard Guru
            </button>
          </div>

        </div>
      </div>

      {/* Student Profile Card (Pilih Karakter Siswa) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Profil Belajar Siswa</span>
            </h3>
            <p className="text-xs text-slate-500">
              Pilih kelas dan namamu untuk menyimpan poin XP dan lencana prestasi
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedClassId}
              onChange={e => {
                setSelectedClassId(e.target.value);
                setSelectedStudentId('');
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="">-- Main sebagai Siswa Tamu --</option>
              {studentsInClass.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {currentStudent ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-100 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center font-heading">
                {currentStudent.level}
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">Pangkat Belajar</span>
                <p className="font-bold text-slate-900 text-sm">
                  {currentStudent.level === 1 ? 'Pemula Cilik' :
                   currentStudent.level === 2 ? 'Penjelajah Ilmu' :
                   currentStudent.level === 3 ? 'Bintang Kelas' :
                   currentStudent.level === 4 ? 'Master Pengetahuan' : 'Juara Rantau'}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50/50 p-4 rounded-2xl border border-amber-100 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white font-bold text-lg flex items-center justify-center">
                ⭐
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase">XP Terkumpul</span>
                <p className="font-bold text-slate-900 text-lg">
                  {currentStudent.xp} Poin
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50/50 p-4 rounded-2xl border border-purple-100 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white font-bold text-lg flex items-center justify-center">
                🏆
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase">Lencana Diraih</span>
                <p className="font-bold text-slate-900 text-sm">
                  {currentStudent.badges?.length || 0} Lencana
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center text-xs text-slate-500">
            Pilih namamu dari menu di atas jika namamu sudah didaftarkan oleh Bapak/Ibu Guru. Kamu juga bisa langsung bermain!
          </div>
        )}
      </div>

      {/* 3 Main Games Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900">
            Pilihan Game Edukatif Seru
          </h2>
          <p className="text-xs text-slate-500">Pilih salah satu permainan yang ingin kamu mainkan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Quiz Adventure */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl mb-4 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                🎮
              </div>

              <h3 className="font-heading font-extrabold text-lg text-slate-900 mb-1">
                Quiz Adventure
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Jawab pertanyaan kuis pilihan ganda dan benar-salah! Raih poin pengalaman dan buka pembahasan menarik di setiap soal.
              </p>

              {/* Question pack selector */}
              <div className="mb-4">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Pilih Topik Soal:
                </label>
                <select
                  value={selectedQuestionSet.id}
                  onChange={e => {
                    const found = questionSets.find(q => q.id === e.target.value);
                    if (found) setSelectedQuestionSet(found);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                >
                  {questionSets.map(qs => (
                    <option key={qs.id} value={qs.id}>
                      [{qs.subject}] {qs.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => handleLaunchGame('quiz')}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <span>Mulai Petualangan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Roda Tantangan */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center text-2xl mb-4 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                🎡
              </div>

              <h3 className="font-heading font-extrabold text-lg text-slate-900 mb-1">
                Roda Tantangan Ceria
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Putar roda keberuntungan dan dapatkan tantangan seru: hitung cepat 10 detik, senam otak, atau tebak kata sains bersama teman!
              </p>
            </div>

            <button
              onClick={() => handleLaunchGame('wheel')}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <span>Putar Roda Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Match & Learn */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-2xl mb-4 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                🧩
              </div>

              <h3 className="font-heading font-extrabold text-lg text-slate-900 mb-1">
                Match & Learn
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Uji daya ingat dan pemahaman konsep dengan mencocokkan kartu istilah sains, pecahan matematika, dan nilai Pancasila.
              </p>
            </div>

            <button
              onClick={() => handleLaunchGame('match')}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <span>Cocokkan Kartu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Lencana Belajar Showcase */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="font-heading font-bold text-base text-slate-900 flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Koleksi Lencana Prestasi</span>
          </h3>
          <p className="text-xs text-slate-500">
            Lencana ini memotivasimu untuk terus tekun dan ceria dalam belajar
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
          {AVAILABLE_BADGES.map(badge => {
            const hasBadge = currentStudent?.badges?.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border text-xs transition-all ${
                  hasBadge
                    ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/40 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="font-bold text-slate-900 text-[11px] leading-tight mb-0.5">{badge.name}</p>
                <p className="text-[10px] text-slate-500 line-clamp-2">{badge.description}</p>
                {hasBadge && (
                  <span className="inline-block mt-1 text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full">
                    Tercapai ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
