import React from 'react';
import {
  Users,
  BookOpen,
  Gamepad2,
  Trophy,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  BarChart,
  School
} from 'lucide-react';
import { storage } from '../../services/storage';
import { sound } from '../../services/audio';
import { TeacherTab } from '../common/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: TeacherTab) => void;
  onLaunchGameDirectly: (gameType: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onLaunchGameDirectly
}) => {
  const classrooms = storage.getClassrooms();
  const students = storage.getStudents();
  const questionSets = storage.getQuestionSets();
  const sessions = storage.getSessions();
  const settings = storage.getSettings();

  // Metrics calculation
  const totalClasses = classrooms.length;
  const totalStudents = students.length;
  const totalQuestionSets = questionSets.length;
  const totalSessionsCompleted = sessions.length;

  // Calculate questions/topics that need strengthening (accuracy < 60%)
  const questionStats: Record<string, { text: string; topic: string; correct: number; total: number }> = {};
  sessions.forEach(sess => {
    sess.answers?.forEach(ans => {
      if (!questionStats[ans.questionId]) {
        questionStats[ans.questionId] = {
          text: ans.questionText,
          topic: sess.gameTitle || sess.subject,
          correct: 0,
          total: 0
        };
      }
      questionStats[ans.questionId].total += 1;
      if (ans.isCorrect) {
        questionStats[ans.questionId].correct += 1;
      }
    });
  });

  const weakQuestions = Object.values(questionStats)
    .filter(q => q.total >= 2 && (q.correct / q.total) < 0.6)
    .map(q => ({
      ...q,
      accuracy: Math.round((q.correct / q.total) * 100)
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 4);

  // Average class mastery
  const averageMastery = sessions.length > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.scorePercentage, 0) / sessions.length)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
          <School className="w-64 h-64 -mr-16" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <span>🏫 {settings.schoolName}</span>
            <span>•</span>
            <span>Tahun Ajaran 2025/2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 font-heading">
            Selamat Datang di RANTAU SMART PLAY!
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-6">
            Platform pembelajaran interaktif berbasis gamifikasi ramah anak untuk guru dan siswa kelas IV, V, & VI. Mari ciptakan suasana kelas yang ceria dan penuh antusiasme belajar.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('ai-generator');
              }}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Buat Soal dengan AI</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('game-center');
              }}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/30 transition-all active:scale-95"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Mulai Permainan Kelas</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('reports');
              }}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/30 transition-all active:scale-95"
            >
              <BarChart className="w-4 h-4" />
              <span>Lihat Laporan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Kelas Tersimpan</p>
            <p className="text-2xl font-bold text-slate-900 font-heading">{totalClasses}</p>
            <p className="text-[11px] text-slate-400">Kelas IV, V, & VI</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Siswa</p>
            <p className="text-2xl font-bold text-slate-900 font-heading">{totalStudents}</p>
            <p className="text-[11px] text-emerald-600 font-medium">Terdaftar di sistem</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Bank Paket Soal</p>
            <p className="text-2xl font-bold text-slate-900 font-heading">{totalQuestionSets}</p>
            <p className="text-[11px] text-indigo-600 font-medium">Siap dimainkan</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Sesi Permainan</p>
            <p className="text-2xl font-bold text-slate-900 font-heading">{totalSessionsCompleted}</p>
            <p className="text-[11px] text-slate-400">
              Rata-rata: {averageMastery}%
            </p>
          </div>
        </div>

      </div>

      {/* Grid: Weak Areas & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Activity & Mastery Summary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Game Center Hub */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Game Edukatif Siap Main
                </h3>
                <p className="text-xs text-slate-500">Pilih mode permainan yang ingin dijalankan di kelas sekarang</p>
              </div>
              <button
                onClick={() => onNavigate('game-center')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Quiz Adventure */}
              <div
                onClick={() => onLaunchGameDirectly('quiz_adventure')}
                className="group relative bg-gradient-to-br from-blue-50 to-indigo-50/50 hover:to-blue-100/70 p-4 rounded-xl border border-blue-100 hover:border-blue-300 transition-all cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                  🎮
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  Quiz Adventure
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Petualangan kuis kartu dengan XP, lencana seru, dan umpan balik ramah anak.
                </p>
                <div className="mt-3 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Mainkan</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>

              {/* Roda Tantangan */}
              <div
                onClick={() => onLaunchGameDirectly('challenge_wheel')}
                className="group relative bg-gradient-to-br from-purple-50 to-pink-50/50 hover:to-purple-100/70 p-4 rounded-xl border border-purple-100 hover:border-purple-300 transition-all cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                  🎡
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  Roda Tantangan
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Roda acak digital untuk tantangan cepat, senam otak ceria, dan tanya jawab kelas.
                </p>
                <div className="mt-3 flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
                  <span>Putar Roda</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>

              {/* Match & Learn */}
              <div
                onClick={() => onLaunchGameDirectly('match_learn')}
                className="group relative bg-gradient-to-br from-emerald-50 to-teal-50/50 hover:to-emerald-100/70 p-4 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                  🧩
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  Match & Learn
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Mencocokkan istilah, konsep sains, dan kosakata secara interaktif dan seru.
                </p>
                <div className="mt-3 flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                  <span>Mulai Cocokkan</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>

            </div>
          </div>

          {/* Riwayat Aktivitas Terbaru */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Riwayat Aktivitas Belajar
              </h3>
              <button
                onClick={() => onNavigate('reports')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Lihat Rekap Lengkap
              </button>
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Belum ada sesi permainan yang selesai.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Mainkan game pertama Anda dari menu Game Center untuk mulai mencatat riwayat.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {sessions.slice(0, 5).map(sess => (
                  <div key={sess.id} className="py-3 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                        sess.scorePercentage >= 80
                          ? 'bg-emerald-100 text-emerald-700'
                          : sess.scorePercentage >= 60
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {sess.scorePercentage}%
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-semibold text-slate-900">{sess.studentName}</p>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {sess.className}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {sess.gameTitle} • {sess.correctCount} benar dari {sess.totalQuestions} soal
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-600">
                        <span>+{sess.xpEarned} XP</span>
                      </span>
                      <p className="text-[11px] text-slate-400">
                        {new Date(sess.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Materi Yang Perlu Diperkuat & Remedial Trigger */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Perlu Diperkuat
                </h3>
              </div>
              <button
                onClick={() => onNavigate('remedial')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Beri Remedial
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Butir konsep yang paling sering keliru dijawab oleh siswa pada kuis terkini:
            </p>

            {weakQuestions.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-emerald-800">
                  Pemahaman Kelas Sangat Baik!
                </p>
                <p className="text-[11px] text-emerald-600 mt-1">
                  Tidak ada soal dengan tingkat kesalahan di atas 40%. Semua konsep dikuasai stabil.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {weakQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        {q.topic}
                      </span>
                      <span className="text-xs font-bold text-rose-600">
                        Akurasi {q.accuracy}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium line-clamp-2">
                      "{q.text}"
                    </p>
                  </div>
                ))}

                <button
                  onClick={() => onNavigate('remedial')}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Rancang Latihan Konkret</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Notice about Local Storage */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-1">
              Catatan Penyimpanan
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Semua data kelas, kuis, dan nilai tersimpan aman di peramban komputer ini. Anda dapat mencadangkan seluruh data melalui menu <strong>Pengaturan &gt; Cadangkan Data</strong> kapan saja.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
