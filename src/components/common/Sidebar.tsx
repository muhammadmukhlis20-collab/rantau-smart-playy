import React from 'react';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Gamepad2,
  BookOpen,
  BarChart3,
  Target,
  FileText,
  Settings,
  Info,
  ChevronRight
} from 'lucide-react';
import { sound } from '../../services/audio';

export type TeacherTab =
  | 'dashboard'
  | 'classes'
  | 'ai-generator'
  | 'game-center'
  | 'question-bank'
  | 'analytics'
  | 'remedial'
  | 'reports'
  | 'settings'
  | 'about';

interface SidebarProps {
  activeTab: TeacherTab;
  onSelectTab: (tab: TeacherTab) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, className = '' }) => {
  const menuItems: { id: TeacherTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'classes', label: 'Kelas Saya', icon: Users },
    { id: 'ai-generator', label: 'AI Pembuat Soal', icon: Sparkles, badge: 'Gemini' },
    { id: 'game-center', label: 'Game Center', icon: Gamepad2 },
    { id: 'question-bank', label: 'Bank Soal', icon: BookOpen },
    { id: 'analytics', label: 'Hasil & Analisis', icon: BarChart3 },
    { id: 'remedial', label: 'Remedial & Pengayaan', icon: Target },
    { id: 'reports', label: 'Laporan', icon: FileText },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
    { id: 'about', label: 'Tentang Aplikasi', icon: Info },
  ];

  return (
    <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 no-print ${className}`}>
      
      {/* Teacher profile badge */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-sm">
            MM
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-slate-900 truncate">
              M. Mukhlis, S.Pd
            </h4>
            <p className="text-xs text-slate-500 truncate">
              SDN 32 Rantau Bayur
            </p>
          </div>
        </div>
      </div>

      {/* Nav list */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                onSelectTab(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              
              <div className="flex items-center space-x-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-blue-500 text-white border border-blue-400'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 opacity-75" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer information */}
      <div className="p-3 border-t border-slate-100 text-center text-xs text-slate-600 bg-slate-50">
        <p className="font-medium text-slate-700">RANTAU SMART PLAY v1.0</p>
        <p className="text-[11px] mt-0.5">SDN 32 Rantau Bayur</p>
      </div>

    </aside>
  );
};
