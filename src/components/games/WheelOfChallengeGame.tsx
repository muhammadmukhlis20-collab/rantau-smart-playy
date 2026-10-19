import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  Home,
  Plus,
  Trash2,
  Trophy,
  Volume2,
  Settings2,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { sound } from '../../services/audio';

interface ChallengeItem {
  id: string;
  category: string;
  title: string;
  description: string;
  color: string;
}

const DEFAULT_CHALLENGES: ChallengeItem[] = [
  {
    id: 'ch_1',
    category: 'Tantangan Cepat',
    title: 'Hitung Cepat 10 Detik!',
    description: 'Sebutkan hasil dari 25 x 4 atau berikan 3 contoh kelipatan angka 7 dalam 10 detik!',
    color: '#3B82F6' // Blue
  },
  {
    id: 'ch_2',
    category: 'Gerak Ceria',
    title: 'Senam Otak 5 Gerakan',
    description: 'Pimpin teman sekelas melakukan 5 gerakan peregangan dan tepuk semangat SDN 32 Rantau Bayur!',
    color: '#10B981' // Emerald
  },
  {
    id: 'ch_3',
    category: 'Tebak Kata',
    title: 'Deskripsi Tanpa Sebut Nama',
    description: 'Deskripsikan fungsi bagian tubuh tumbuhan (akar/daun/batang) tanpa menyebut nama bendanya, biarkan temanmu menebak!',
    color: '#F59E0B' // Amber
  },
  {
    id: 'ch_4',
    category: 'Berani Bicara',
    title: 'Ceritakan Pengalaman Belajar',
    description: 'Ceritakan satu hal paling menarik yang baru saja kamu pelajari minggu ini di depan kelas dengan senyum!',
    color: '#8B5CF6' // Purple
  },
  {
    id: 'ch_5',
    category: 'Kerja Sama Tim',
    title: 'Tepuk Kompak Kelompok',
    description: 'Ajak 2 teman di sebelahmu membuat yel-yel penyemangat 1 kalimat secara kompak!',
    color: '#EC4899' // Pink
  },
  {
    id: 'ch_6',
    category: 'Pengetahuan Seru',
    title: 'Fakta Sains Menakjubkan',
    description: 'Sebutkan satu fakta unik tentang fotosintesis atau ekosistem alam yang kamu ketahui!',
    color: '#06B6D4' // Teal
  }
];

interface WheelOfChallengeGameProps {
  onExit: () => void;
}

export const WheelOfChallengeGame: React.FC<WheelOfChallengeGameProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [challenges, setChallenges] = useState<ChallengeItem[]>(DEFAULT_CHALLENGES);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeItem | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Tantangan Cepat');
  const [newDesc, setNewDesc] = useState('');

  // Rotation state in radians
  const currentAngleRef = useRef(0);
  const spinSpeedRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Draw the wheel on canvas
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 16;
    const totalSlices = challenges.length;
    const arcSize = (2 * Math.PI) / totalSlices;

    ctx.clearRect(0, 0, size, size);

    // Draw slices
    challenges.forEach((item, i) => {
      const startAngle = angle + i * arcSize;
      const endAngle = startAngle + arcSize;

      // Slice background
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Slice text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 4;
      ctx.fillText(item.title.length > 18 ? item.title.slice(0, 16) + '...' : item.title, radius - 20, 5);
      ctx.restore();
    });

    // Draw center hub
    ctx.beginPath();
    ctx.arc(center, center, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1E293B';
    ctx.stroke();

    ctx.font = 'bold 18px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1E293B';
    ctx.fillText('RSP', center, center);

    // Draw top arrow pointer
    ctx.beginPath();
    ctx.moveTo(center, 10);
    ctx.lineTo(center - 16, 38);
    ctx.lineTo(center + 16, 38);
    ctx.closePath();
    ctx.fillStyle = '#EF4444';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
  };

  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [challenges]);

  // Spin with physics easing
  const spinWheel = () => {
    if (isSpinning || challenges.length === 0) return;

    sound.playClick();
    setIsSpinning(true);
    setSelectedChallenge(null);

    // Random initial high speed between 0.35 and 0.55 rad/frame
    let speed = 0.4 + Math.random() * 0.25;
    // Deceleration factor per frame
    const deceleration = 0.985 + Math.random() * 0.005;

    let lastTickAngle = currentAngleRef.current;
    const arcSize = (2 * Math.PI) / challenges.length;

    const animate = () => {
      currentAngleRef.current = (currentAngleRef.current + speed) % (2 * Math.PI);
      drawWheel(currentAngleRef.current);

      // Play tick sound whenever needle crosses a slice border
      if (Math.abs(currentAngleRef.current - lastTickAngle) >= arcSize / 2) {
        sound.playWheelTick();
        lastTickAngle = currentAngleRef.current;
      }

      speed *= deceleration;

      if (speed < 0.002) {
        // Stopped!
        speed = 0;
        setIsSpinning(false);
        sound.playVictory();

        // Calculate which slice stopped under top pointer (angle = 3*PI/2)
        const normalizedAngle = (3 * Math.PI / 2 - currentAngleRef.current + 2 * Math.PI) % (2 * Math.PI);
        const winningIndex = Math.floor(normalizedAngle / arcSize) % challenges.length;
        setSelectedChallenge(challenges[winningIndex]);
      } else {
        animFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);
  };

  const handleAddCustomChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
    const randomColor = colors[challenges.length % colors.length];

    const item: ChallengeItem = {
      id: `ch_${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      description: newDesc.trim(),
      color: randomColor,
    };

    setChallenges([...challenges, item]);
    setNewTitle('');
    setNewDesc('');
    sound.playCorrect();
  };

  const handleDeleteChallenge = (id: string) => {
    if (challenges.length <= 2) {
      alert('Roda membutuhkan minimal 2 tantangan.');
      return;
    }
    sound.playClick();
    setChallenges(challenges.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
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
              <span>🎡 Roda Tantangan Ceria</span>
              <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-full font-bold">
                Interaktif
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Putaran acak murni dengan JavaScript untuk menyegarkan suasana belajar kelas
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowConfigModal(true);
          }}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Atur Tantangan ({challenges.length})</span>
        </button>
      </div>

      {/* Main Wheel Arena */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center text-center">
        
        {/* Canvas Wheel */}
        <div className="relative my-2">
          <canvas
            ref={canvasRef}
            width={380}
            height={380}
            className="max-w-full drop-shadow-md select-none"
          />
        </div>

        {/* Spin Button */}
        <div className="mt-4">
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`px-8 py-3.5 rounded-2xl font-extrabold text-base text-white shadow-lg transition-all active:scale-95 flex items-center space-x-2 ${
              isSpinning
                ? 'bg-slate-400 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-purple-500/25'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{isSpinning ? 'Roda Sedang Berputar...' : 'PUTAR RODA SEKARANG!'}</span>
          </button>
        </div>

      </div>

      {/* Selected Challenge Result Popup Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-400 text-center animate-scaleUp">
            
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-300/50">
              <Flame className="w-8 h-8 text-amber-900" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
              {selectedChallenge.category}
            </span>

            <h3 className="font-heading font-extrabold text-2xl text-slate-900 mt-2 mb-3">
              {selectedChallenge.title}
            </h3>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm text-slate-700 leading-relaxed font-medium mb-6">
              "{selectedChallenge.description}"
            </div>

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedChallenge(null);
                  spinWheel();
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Putar Lagi</span>
              </button>

              <button
                onClick={() => setSelectedChallenge(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Tutup & Selesai
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Teacher Challenges Editor Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-100 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Kelola Daftar Tantangan Roda
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Existing List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-4">
              {challenges.map((c, i) => (
                <div key={c.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-2">
                  <div className="text-left text-xs">
                    <span className="font-bold text-slate-900">{i + 1}. {c.title}</span>
                    <span className="text-[10px] ml-2 text-purple-600 font-semibold">({c.category})</span>
                    <p className="text-slate-500 mt-0.5 text-[11px]">{c.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteChallenge(c.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Challenge Form */}
            <form onSubmit={handleAddCustomChallenge} className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 text-xs">Tambah Tantangan Baru:</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Judul Tantangan..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg"
                />
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg"
                >
                  <option value="Tantangan Cepat">Tantangan Cepat</option>
                  <option value="Gerak Ceria">Gerak Ceria</option>
                  <option value="Tebak Kata">Tebak Kata</option>
                  <option value="Berani Bicara">Berani Bicara</option>
                  <option value="Kerja Sama Tim">Kerja Sama Tim</option>
                  <option value="Pengetahuan Seru">Pengetahuan Seru</option>
                </select>
              </div>
              <textarea
                rows={2}
                required
                placeholder="Instruksi tantangan untuk siswa..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
              />
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Tambahkan ke Roda
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
