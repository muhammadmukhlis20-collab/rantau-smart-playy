import React from 'react';
import { Volume2, VolumeX, Sparkles, GraduationCap, Gamepad2, School } from 'lucide-react';
import { sound } from '../../services/audio';
import { storage } from '../../services/storage';

interface HeaderProps {
  currentMode: 'teacher' | 'student';
  onToggleMode: (mode: 'teacher' | 'student') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onToggleMode,
  soundEnabled,
  onToggleSound
}) => {
  const settings = storage.getSettings();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <School className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-bold text-lg text-slate-900 tracking-tight">
                RANTAU SMART PLAY
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                SDN 32 Rantau Bayur
              </span>
            </div>
            <p className="text-xs text-slate-700 hidden sm:block">
              Smart Learning, Happy Classroom
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Switch */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Audio toggle button */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            title={soundEnabled ? 'Matikan Suara Efek' : 'Nyalakan Suara Efek'}
            className={`p-2 rounded-lg transition-colors border ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mode Switcher Pill */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => {
                sound.playClick();
                onToggleMode('teacher');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentMode === 'teacher'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Dashboard Guru</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onToggleMode('student');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentMode === 'student'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Arena Siswa</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
