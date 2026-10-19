import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Trophy,
  Sparkles,
  Home,
  CheckCircle2,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { sound } from '../../services/audio';

interface MatchItem {
  id: string;
  pairId: string;
  type: 'term' | 'definition';
  content: string;
  icon?: string;
}

interface MatchTheme {
  title: string;
  subject: string;
  grade: number;
  pairs: { term: string; definition: string; icon: string }[];
}

const THEMES: MatchTheme[] = [
  {
    title: 'Pancasila & Nilai Karakter',
    subject: 'Pendidikan Pancasila',
    grade: 4,
    pairs: [
      { term: 'Sila ke-1', definition: 'Ketuhanan Yang Maha Esa (Bintang)', icon: '⭐' },
      { term: 'Sila ke-2', definition: 'Kemanusiaan yang Adil & Beradab (Rantai)', icon: '🔗' },
      { term: 'Sila ke-3', definition: 'Persatuan Indonesia (Pohon Beringin)', icon: '🌳' },
      { term: 'Sila ke-4', definition: 'Musyawarah & Mufakat (Kepala Banteng)', icon: '🐂' },
      { term: 'Sila ke-5', definition: 'Keadilan Sosial (Padi & Kapas)', icon: '🌾' },
      { term: 'Gotong Royong', definition: 'Bekerja bersama saling membantu', icon: '🤝' }
    ]
  },
  {
    title: 'Sains & Bagian Tumbuhan (IPAS)',
    subject: 'IPAS',
    grade: 4,
    pairs: [
      { term: 'Akar', definition: 'Menyerap air & mineral hara dari tanah', icon: '🌱' },
      { term: 'Daun', definition: 'Tempat fotosintesis & pembuatan makanan', icon: '🍃' },
      { term: 'Klorofil', definition: 'Zat hijau daun penangkap cahaya mentari', icon: '☀️' },
      { term: 'Batang', definition: 'Menopang tanaman & mengalirkan sari makanan', icon: '🪵' },
      { term: 'Floem', definition: 'Pembuluh pembawa hasil fotosintesis', icon: '🔄' },
      { term: 'Oksigen (O2)', definition: 'Gas segar yang dihasilkan saat fotosintesis', icon: '💨' }
    ]
  },
  {
    title: 'Rantai Makanan & Ekosistem (IPAS)',
    subject: 'IPAS',
    grade: 5,
    pairs: [
      { term: 'Produsen', definition: 'Tumbuhan hijau penghasil makanan', icon: '🌾' },
      { term: 'Herbivora', definition: 'Hewan pemakan tumbuhan (Kelinci/Sapi)', icon: '🐰' },
      { term: 'Karnivora', definition: 'Hewan pemakan daging (Harimau/Elang)', icon: '🦅' },
      { term: 'Dekomposer', definition: 'Jamur & bakteri pengurai bangkai', icon: '🍄' },
      { term: 'Habitat', definition: 'Tempat tinggal alami makhluk hidup', icon: '🏞️' },
      { term: 'Ekosistem', definition: 'Interaksi makhluk hidup dengan alam', icon: '🌍' }
    ]
  },
  {
    title: 'Pecahan & Bangun Datar (Matematika)',
    subject: 'Matematika',
    grade: 5,
    pairs: [
      { term: '1/2', definition: 'Sama nilainya dengan 0,5 atau 50%', icon: '🍕' },
      { term: '1/4', definition: 'Sama nilainya dengan 0,25 (seperempat)', icon: '🥧' },
      { term: '3/4', definition: 'Sama nilainya dengan 0,75 atau 75%', icon: '🍰' },
      { term: 'Keliling Persegi', definition: 'Rumus: 4 x panjang sisi (4 x s)', icon: '🔲' },
      { term: 'Luas Persegi Panjang', definition: 'Rumus: Panjang x Lebar (p x l)', icon: '▭' },
      { term: 'Luas Segitiga', definition: 'Rumus: (Alas x Tinggi) / 2', icon: '📐' }
    ]
  },
  {
    title: 'Unsur & Warna Seni Rupa',
    subject: 'Seni Rupa',
    grade: 4,
    pairs: [
      { term: 'Warna Primer', definition: 'Warna pokok: Merah, Kuning, dan Biru', icon: '🎨' },
      { term: 'Warna Jingga (Oranye)', definition: 'Campuran warna Merah + Kuning', icon: '🍊' },
      { term: 'Warna Hijau', definition: 'Campuran warna Kuning + Biru', icon: '🍏' },
      { term: 'Warna Ungu', definition: 'Campuran warna Merah + Biru', icon: '🍇' },
      { term: 'Kolase', definition: 'Karya menempelkan potongan bahan ke pola', icon: '✂️' },
      { term: 'Tekstur', definition: 'Sifat permukaan bidang halus atau kasar', icon: '✋' }
    ]
  },
  {
    title: 'School Vocabulary (Bahasa Inggris)',
    subject: 'Bahasa Inggris',
    grade: 4,
    pairs: [
      { term: 'Whiteboard', definition: 'Papan tulis putih di ruang kelas', icon: '📋' },
      { term: 'Library', definition: 'Perpustakaan tempat membaca buku', icon: '📚' },
      { term: 'Pencil case', definition: 'Kotak tempat menyimpan pensil & pena', icon: '✏️' },
      { term: 'Sharpener', definition: 'Rautan untuk menajamkan pensil', icon: '🗡️' },
      { term: 'Ruler', definition: 'Penggaris untuk mengukur panjang', icon: '📏' },
      { term: 'Scissors', definition: 'Gunting untuk memotong kertas', icon: '✂️' }
    ]
  }
];

interface MatchAndLearnGameProps {
  onExit: () => void;
}

export const MatchAndLearnGame: React.FC<MatchAndLearnGameProps> = ({ onExit }) => {
  const [selectedThemeIdx, setSelectedThemeIdx] = useState(0);
  const [cards, setCards] = useState<MatchItem[]>([]);
  const [firstSelectedId, setFirstSelectedId] = useState<string | null>(null);
  const [secondSelectedId, setSecondSelectedId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeTheme = THEMES[selectedThemeIdx];

  // Initialize and shuffle deck
  const initializeGame = (themeIndex: number) => {
    const theme = THEMES[themeIndex];
    const generatedCards: MatchItem[] = [];

    theme.pairs.forEach((p, idx) => {
      const pairId = `pair_${idx}`;
      generatedCards.push({
        id: `card_t_${idx}`,
        pairId,
        type: 'term',
        content: p.term,
        icon: p.icon
      });
      generatedCards.push({
        id: `card_d_${idx}`,
        pairId,
        type: 'definition',
        content: p.definition,
        icon: p.icon
      });
    });

    // Shuffle cards randomly
    const shuffled = generatedCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFirstSelectedId(null);
    setSecondSelectedId(null);
    setMatchedPairIds([]);
    setMoves(0);
    setSeconds(0);
    setIsGameFinished(false);
    setIsProcessing(false);
  };

  useEffect(() => {
    initializeGame(selectedThemeIdx);
  }, [selectedThemeIdx]);

  // Timer
  useEffect(() => {
    if (isGameFinished) return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameFinished]);

  const handleCardClick = (card: MatchItem) => {
    if (isProcessing) return;
    if (matchedPairIds.includes(card.pairId)) return;
    if (card.id === firstSelectedId) return;

    sound.playCardFlip();

    if (!firstSelectedId) {
      setFirstSelectedId(card.id);
    } else if (!secondSelectedId) {
      setSecondSelectedId(card.id);
      setMoves(m => m + 1);
      setIsProcessing(true);

      const firstCard = cards.find(c => c.id === firstSelectedId);
      if (firstCard && firstCard.pairId === card.pairId) {
        // Matched!
        setTimeout(() => {
          sound.playCorrect();
          const newMatched = [...matchedPairIds, card.pairId];
          setMatchedPairIds(newMatched);
          setFirstSelectedId(null);
          setSecondSelectedId(null);
          setIsProcessing(false);

          // Check if all matched
          if (newMatched.length === activeTheme.pairs.length) {
            setTimeout(() => {
              sound.playVictory();
              setIsGameFinished(true);
            }, 500);
          }
        }, 400);
      } else {
        // Not matched
        setTimeout(() => {
          sound.playWrong();
          setFirstSelectedId(null);
          setSecondSelectedId(null);
          setIsProcessing(false);
        }, 1100);
      }
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 space-y-5">
      
      {/* Top Header & Theme Selector */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onExit}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Kembali ke Menu"
          >
            <Home className="w-4 h-4" />
          </button>
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center space-x-1.5">
              <span>🧩 Match & Learn (Pencocokan Edukatif)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Temukan pasangan istilah dan definisinya dengan melatih ingatan logis
            </p>
          </div>
        </div>

        {/* Theme select dropdown */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedThemeIdx}
            onChange={e => {
              sound.playClick();
              setSelectedThemeIdx(parseInt(e.target.value));
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            {THEMES.map((t, idx) => (
              <option key={idx} value={idx}>{t.title}</option>
            ))}
          </select>

          <button
            onClick={() => {
              sound.playClick();
              initializeGame(selectedThemeIdx);
            }}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Acak Ulang Kartu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Game Stats HUD */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Pasangan Selesai</span>
          <p className="text-xl font-bold font-heading text-emerald-600">
            {matchedPairIds.length} / {activeTheme.pairs.length}
          </p>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Langkah (Percobaan)</span>
          <p className="text-xl font-bold font-heading text-blue-600">
            {moves}
          </p>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Waktu Bermain</span>
          <p className="text-xl font-bold font-heading text-amber-600">
            {formatTime(seconds)}
          </p>
        </div>
      </div>

      {/* Cards Grid Arena */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {cards.map(card => {
          const isMatched = matchedPairIds.includes(card.pairId);
          const isSelected = card.id === firstSelectedId || card.id === secondSelectedId;

          let cardClasses = 'bg-white border-slate-200 text-slate-800 shadow-xs hover:border-blue-400 hover:shadow-sm cursor-pointer';

          if (isMatched) {
            cardClasses = 'bg-emerald-50 border-emerald-400 text-emerald-950 opacity-90 cursor-default ring-2 ring-emerald-400';
          } else if (isSelected) {
            cardClasses = 'bg-blue-50 border-blue-600 text-blue-950 font-bold ring-2 ring-blue-600 scale-[1.02] shadow-md';
          }

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`min-h-[110px] p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all duration-200 select-none ${cardClasses}`}
            >
              {card.icon && <span className="text-xl mb-1">{card.icon}</span>}
              <span className={`text-xs ${card.type === 'term' ? 'font-bold text-slate-900 text-sm' : 'text-slate-600 leading-tight font-medium'}`}>
                {card.content}
              </span>

              {isMatched && (
                <span className="inline-flex items-center space-x-1 mt-1 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cocok!</span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Victory Modal */}
      {isGameFinished && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-4 border-emerald-400 text-center animate-scaleUp">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-200">
              <Trophy className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
              Misi Selesai Sempurna!
            </span>

            <h3 className="font-heading font-extrabold text-2xl text-slate-900 mt-2 mb-1">
              Ingatanmu Tajam Sekali!
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Semua pasangan istilah pada tema <strong>"{activeTheme.title}"</strong> telah kamu temukan dengan tepat.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-2 gap-3 text-center mb-6">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">Total Percobaan</p>
                <p className="text-xl font-bold font-heading text-blue-600">{moves} Langkah</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">Waktu Penyelesaian</p>
                <p className="text-xl font-bold font-heading text-emerald-600">{formatTime(seconds)}</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => initializeGame(selectedThemeIdx)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Main Ulang</span>
              </button>

              <button
                onClick={onExit}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Kembali ke Menu
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
