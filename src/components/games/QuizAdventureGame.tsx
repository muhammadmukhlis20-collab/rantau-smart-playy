import React, { useState } from 'react';
import {
  Trophy,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  Home,
  Award,
  Clock
} from 'lucide-react';
import { QuestionSet, GameSession, GameAnswerRecord } from '../../types';
import { sound } from '../../services/audio';
import { storage } from '../../services/storage';

interface QuizAdventureGameProps {
  questionSet: QuestionSet;
  classId: string;
  className: string;
  studentId?: string;
  studentName: string;
  playMode: 'individual' | 'group' | 'projector';
  onExit: () => void;
}

export const QuizAdventureGame: React.FC<QuizAdventureGameProps> = ({
  questionSet,
  classId,
  className,
  studentId,
  studentName,
  playMode,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answersRecord, setAnswersRecord] = useState<GameAnswerRecord[]>([]);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [savedSession, setSavedSession] = useState<GameSession | null>(null);

  const questions = questionSet.questions;
  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return; // Prevent changing after answer
    sound.playClick();
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    const record: GameAnswerRecord = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      userAnswer: selectedOption,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: isCorrect,
    };

    setAnswersRecord(prev => [...prev, record]);
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    sound.playVictory();
    const totalQ = questions.length;
    const correctCount = answersRecord.filter(a => a.isCorrect).length;
    const wrongCount = totalQ - correctCount;
    const scorePercentage = Math.round((correctCount / totalQ) * 100);
    const xpEarned = Math.round(scorePercentage * 1.2) + 20; // 20 XP bonus for completion

    const badgesAwarded: string[] = [];
    if (scorePercentage >= 80) badgesAwarded.push('badge_math');
    if (scorePercentage >= 60) badgesAwarded.push('badge_explorer');
    if (playMode === 'group' || playMode === 'projector') badgesAwarded.push('badge_team');

    const newSession: GameSession = {
      id: `sess_${Date.now()}`,
      sessionCode: `RSP-${Math.floor(100 + Math.random() * 900)}`,
      gameType: 'quiz_adventure',
      gameTitle: questionSet.title,
      subject: questionSet.subject,
      grade: questionSet.grade,
      classId,
      className,
      studentId,
      studentName,
      playMode,
      timestamp: new Date().toISOString(),
      totalQuestions: totalQ,
      correctCount,
      wrongCount,
      scorePercentage,
      answers: answersRecord,
      xpEarned,
      badgesAwarded,
      isCompleted: true
    };

    storage.saveSession(newSession);
    setSavedSession(newSession);
    setIsGameFinished(true);
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setAnswersRecord([]);
    setIsGameFinished(false);
    setSavedSession(null);
  };

  // Celebration & Results View
  if (isGameFinished && savedSession) {
    return (
      <div className="max-w-3xl mx-auto py-6 px-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl text-center space-y-6">
          
          <div className="inline-flex p-4 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 shadow-lg shadow-amber-300/40 animate-bounce">
            <Trophy className="w-12 h-12" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              {savedSession.sessionCode} • Sesi Selesai!
            </span>
            <h2 className="text-3xl font-extrabold font-heading text-slate-900 mt-2">
              Luar Biasa, {studentName}!
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Kamu telah menyelesaikan kuis <strong>{questionSet.title}</strong>
            </p>
          </div>

          {/* Score & Rewards Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">Skor Akhir</p>
              <p className="text-3xl font-bold font-heading text-blue-600 mt-0.5">
                {savedSession.scorePercentage}%
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {savedSession.correctCount} / {savedSession.totalQuestions} Benar
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <p className="text-xs text-amber-700 font-medium">XP Diperoleh</p>
              <p className="text-3xl font-bold font-heading text-amber-600 mt-0.5">
                +{savedSession.xpEarned}
              </p>
              <p className="text-[11px] text-amber-600 mt-0.5">Poin Belajar</p>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <p className="text-xs text-emerald-700 font-medium">Apresiasi</p>
              <p className="text-2xl font-bold font-heading text-emerald-600 mt-0.5">
                {savedSession.scorePercentage >= 80 ? 'Hebat!' : savedSession.scorePercentage >= 60 ? 'Bagus!' : 'Semangat!'}
              </p>
              <p className="text-[11px] text-emerald-600 mt-0.5">Terus Berlatih</p>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-2xl text-xs text-blue-900 leading-relaxed text-left max-w-lg mx-auto">
            <p className="font-bold flex items-center space-x-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Pesan Guru:</span>
            </p>
            {savedSession.scorePercentage >= 80
              ? 'Kerja kerasmu membuahkan hasil yang memuaskan. Pertahankan ketelitian dan bantu temanmu yang masih belajar ya!'
              : savedSession.scorePercentage >= 60
              ? 'Pemahamanmu sudah berkembang sangat baik. Perhatikan lagi beberapa konsep yang masih keliru agar semakin mantap!'
              : 'Jangan berkecil hati! Belajar adalah sebuah proses bertahap. Coba ulangi kuis ini sekali lagi dengan santai.'}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>

            <button
              onClick={onExit}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Menu</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Active Question Playing View
  return (
    <div className="max-w-3xl mx-auto py-4 px-4 space-y-5">
      
      {/* Top HUD (Bar Status Siswa) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onExit}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Keluar ke Menu"
          >
            <Home className="w-4 h-4" />
          </button>
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900 truncate">
              {questionSet.title}
            </h3>
            <p className="text-[11px] text-slate-500">
              Pemain: <strong className="text-slate-800">{studentName}</strong> • {className}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-blue-600">
            Soal {currentIndex + 1} dari {questions.length}
          </span>
          <div className="w-28 sm:w-36 bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Difficulty badge & Tag */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Tingkat: {currentQuestion.difficulty === 'easy' ? 'Mudah' : currentQuestion.difficulty === 'medium' ? 'Sedang' : 'Tantangan HOTS'}
          </span>
          <span className="text-xs text-slate-400">
            {currentQuestion.type === 'true_false' ? 'Pilih Benar atau Salah' : 'Pilih satu jawaban terbaik'}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {currentQuestion.question}
        </h2>

        {/* Options Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectAnswer = idx === currentQuestion.correctAnswer;

            let cardStyle = 'border-slate-200 bg-white hover:bg-blue-50/50 hover:border-blue-300 text-slate-800';

            if (isAnswerSubmitted) {
              if (isCorrectAnswer) {
                cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500';
              } else if (isSelected && !isCorrectAnswer) {
                cardStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400';
              } else {
                cardStyle = 'border-slate-100 bg-slate-50 opacity-60 text-slate-400';
              }
            } else if (isSelected) {
              cardStyle = 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-600 font-bold';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-start space-x-3 cursor-pointer ${cardStyle}`}
              >
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                  isAnswerSubmitted && isCorrectAnswer
                    ? 'bg-emerald-600 text-white'
                    : isAnswerSubmitted && isSelected && !isCorrectAnswer
                    ? 'bg-rose-500 text-white'
                    : isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 mt-0.5 leading-relaxed">
                  {opt}
                </span>

                {isAnswerSubmitted && isCorrectAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation Box upon Answer Submission */}
        {isAnswerSubmitted && (
          <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-1 animate-fadeIn border ${
            selectedOption === currentQuestion.correctAnswer
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center space-x-2 font-bold text-sm">
              {selectedOption === currentQuestion.correctAnswer ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Jawabanmu Tepat Sekali! 🎉</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                  <span>Mari Kita Pelajari Bersama 💡</span>
                </>
              )}
            </div>
            <p className="pt-1 text-slate-700">
              <strong>Pembahasan:</strong> {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {playMode === 'projector' ? '📺 Mode Layar Proyektor Kelas' : playMode === 'group' ? '👥 Mode Kelompok' : '👤 Mode Mandiri'}
          </span>

          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all ${
                selectedOption !== null
                  ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              Kunci Jawaban
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center space-x-2 active:scale-95 transition-all"
            >
              <span>{currentIndex + 1 < questions.length ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
