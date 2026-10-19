/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Sidebar, TeacherTab } from './components/common/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ClassroomView } from './components/classes/ClassroomView';
import { AIGeneratorView } from './components/ai-generator/AIGeneratorView';
import { GameCenterView } from './components/games/GameCenterView';
import { QuestionBankView } from './components/bank/QuestionBankView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { RemedialView } from './components/remedial/RemedialView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { AboutView } from './components/about/AboutView';
import { StudentArenaView } from './components/arena/StudentArenaView';
import { storage } from './services/storage';
import { sound } from './services/audio';
import { QuestionSet } from './types';
import { Menu, X, School, Heart } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'teacher' | 'student'>('teacher');
  const [activeTeacherTab, setActiveTeacherTab] = useState<TeacherTab>('dashboard');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Cross-component launcher states
  const [launcherGameType, setLauncherGameType] = useState<string>('quiz_adventure');
  const [launcherQuestionSet, setLauncherQuestionSet] = useState<QuestionSet | null>(null);

  useEffect(() => {
    const s = storage.getSettings();
    setSoundEnabled(s.soundEffects ?? true);
  }, []);

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    const currSettings = storage.getSettings();
    storage.saveSettings({ ...currSettings, soundEffects: nextVal });
  };

  const handleLaunchGameFromAnywhere = (qs: QuestionSet) => {
    setLauncherGameType('quiz_adventure');
    setLauncherQuestionSet(qs);
    setActiveTeacherTab('game-center');
    setCurrentMode('teacher');
  };

  const handleLaunchGameTypeDirectly = (gameType: string) => {
    setLauncherGameType(gameType);
    setLauncherQuestionSet(null);
    setActiveTeacherTab('game-center');
    setCurrentMode('teacher');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        currentMode={currentMode}
        onToggleMode={mode => {
          setCurrentMode(mode);
          setMobileMenuOpen(false);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Body */}
      {currentMode === 'student' ? (
        <main className="flex-1">
          <StudentArenaView onGoToTeacherDashboard={() => setCurrentMode('teacher')} />
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          
          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden fixed bottom-5 right-5 z-40 no-print">
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-3.5 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop & Mobile Drawer Sidebar */}
          <Sidebar
            activeTab={activeTeacherTab}
            onSelectTab={tab => {
              setActiveTeacherTab(tab);
              setMobileMenuOpen(false);
            }}
            className={`${
              mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 shadow-2xl block' : 'hidden md:flex'
            }`}
          />

          {/* Mobile Overlay */}
          {mobileMenuOpen && (
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-xs"
            />
          )}

          {/* Teacher Content Workspace */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
            {activeTeacherTab === 'dashboard' && (
              <DashboardView
                onNavigate={tab => setActiveTeacherTab(tab)}
                onLaunchGameDirectly={handleLaunchGameTypeDirectly}
              />
            )}

            {activeTeacherTab === 'classes' && <ClassroomView />}

            {activeTeacherTab === 'ai-generator' && (
              <AIGeneratorView
                onSaveToBankSuccess={() => setActiveTeacherTab('question-bank')}
                onLaunchGame={handleLaunchGameFromAnywhere}
              />
            )}

            {activeTeacherTab === 'game-center' && (
              <GameCenterView
                key={`${launcherGameType}_${launcherQuestionSet?.id || 'none'}`}
                initialGameType={launcherGameType}
                initialQuestionSet={launcherQuestionSet}
              />
            )}

            {activeTeacherTab === 'question-bank' && (
              <QuestionBankView
                onNavigateToAI={() => setActiveTeacherTab('ai-generator')}
                onLaunchGame={handleLaunchGameFromAnywhere}
              />
            )}

            {activeTeacherTab === 'analytics' && <AnalyticsView />}

            {activeTeacherTab === 'remedial' && <RemedialView />}

            {activeTeacherTab === 'reports' && <ReportsView />}

            {activeTeacherTab === 'settings' && (
              <SettingsView onSettingsChanged={() => {}} />
            )}

            {activeTeacherTab === 'about' && <AboutView />}
          </main>

        </div>
      )}

      {/* Official Footer with Developer Information */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <span className="font-bold text-slate-800">RANTAU SMART PLAY</span>
            <span>•</span>
            <span>SDN 32 Rantau Bayur</span>
            <span>•</span>
            <span className="text-slate-400">Smart Learning, Happy Classroom.</span>
          </div>

          <div className="flex items-center space-x-3 text-center sm:text-right">
            <span>
              Pengembang: <strong>Muhammad Mukhlis, S.Pd</strong>
            </span>
            <span>•</span>
            <span>
              Kontak: <a href="tel:082226859877" className="font-bold text-blue-600 hover:underline">082226859877</a>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
