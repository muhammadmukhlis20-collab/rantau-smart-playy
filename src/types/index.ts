export type GradeLevel = 4 | 5 | 6;

export type Subject =
  | 'Pendidikan Pancasila'
  | 'IPAS'
  | 'Matematika'
  | 'Seni Rupa'
  | 'Bahasa Inggris'
  | 'Bahasa Indonesia'
  | 'Pendidikan Agama'
  | 'Seni dan Prakarya'
  | 'Mata Pelajaran Lainnya';

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'story_application';
export type Difficulty = 'easy' | 'medium' | 'challenging';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options: string[]; // For multiple_choice (4 items) or true_false (2 items: Benar, Salah)
  correctAnswer: number | string; // Index for multiple_choice / true_false, or exact text for short_answer
  explanation: string;
  difficulty: Difficulty;
}

export interface QuestionSet {
  id: string;
  title: string;
  subject: Subject;
  grade: GradeLevel;
  topic: string;
  createdAt: string;
  questions: Question[];
  isDemo?: boolean;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  isActive: boolean;
  xp: number;
  level: number;
  badges: string[];
  completedSessionsCount: number;
}

export interface Classroom {
  id: string;
  name: string;
  grade: GradeLevel;
  academicYear: string;
  teacherName: string;
  studentCount?: number;
}

export interface GameAnswerRecord {
  questionId: string;
  questionText: string;
  userAnswer: number | string;
  correctAnswer: number | string;
  isCorrect: boolean;
  timeTakenSeconds?: number;
}

export interface GameSession {
  id: string;
  sessionCode?: string;
  gameType: 'quiz_adventure' | 'challenge_wheel' | 'match_learn';
  gameTitle: string;
  subject: Subject;
  grade: GradeLevel;
  classId: string;
  className: string;
  studentId?: string;
  studentName: string;
  playMode: 'individual' | 'group' | 'projector';
  timestamp: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  scorePercentage: number;
  answers: GameAnswerRecord[];
  xpEarned: number;
  badgesAwarded: string[];
  isCompleted: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredXp?: number;
  criteria: string;
}

export interface RemedialTask {
  id: string;
  title: string;
  subject: Subject;
  grade: GradeLevel;
  classId: string;
  studentIds: string[]; // target students
  taskType: 'remedial' | 'enrichment';
  description: string;
  learningMaterials: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export interface AppSettings {
  schoolName: string;
  teacherName: string;
  soundEffects: boolean;
  themeColor: string;
  autoReadAloud: boolean;
  showLeaderboardInStudentArena: boolean;
}
