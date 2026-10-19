import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  School
} from 'lucide-react';
import { storage } from '../../services/storage';
import { sound } from '../../services/audio';
import { GameSession } from '../../types';

export const ReportsView: React.FC = () => {
  const classrooms = storage.getClassrooms();
  const students = storage.getStudents();
  const sessions = storage.getSessions();
  const settings = storage.getSettings();

  // Filters
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchName, setSearchName] = useState<string>('');

  const filteredSessions = sessions.filter(s => {
    const matchesClass = selectedClassId === 'all' || s.classId === selectedClassId;
    const matchesSubject = selectedSubject === 'all' || s.subject === selectedSubject;
    const matchesName = !searchName.trim() || s.studentName.toLowerCase().includes(searchName.toLowerCase());
    return matchesClass && matchesSubject && matchesName;
  });

  const totalSessions = filteredSessions.length;
  const avgScore = totalSessions > 0
    ? Math.round(filteredSessions.reduce((acc, s) => acc + s.scorePercentage, 0) / totalSessions)
    : 0;
  const totalCorrectAnswers = filteredSessions.reduce((acc, s) => acc + s.correctCount, 0);
  const totalQuestionsEvaluated = filteredSessions.reduce((acc, s) => acc + s.totalQuestions, 0);

  // Print function
  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  // CSV Export with BOM UTF-8 for Excel
  const handleExportCSV = () => {
    sound.playClick();
    if (filteredSessions.length === 0) {
      alert('Tidak ada data hasil untuk diekspor.');
      return;
    }

    const headers = [
      'Kode Sesi',
      'Tanggal',
      'Nama Siswa / Peserta',
      'Kelas',
      'Mata Pelajaran',
      'Judul Kuis',
      'Mode Bermain',
      'Benar',
      'Total Soal',
      'Skor Akhir (%)',
      'XP Diperoleh'
    ];

    const rows = filteredSessions.map(s => [
      s.sessionCode || s.id,
      new Date(s.timestamp).toLocaleDateString('id-ID'),
      `"${s.studentName.replace(/"/g, '""')}"`,
      `"${s.className.replace(/"/g, '""')}"`,
      `"${s.subject.replace(/"/g, '""')}"`,
      `"${s.gameTitle.replace(/"/g, '""')}"`,
      s.playMode,
      s.correctCount,
      s.totalQuestions,
      s.scorePercentage,
      s.xpEarned
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Asesmen_${settings.schoolName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    sound.playClick();
    const jsonStr = storage.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cadangan_Data_RSP_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Print / Export buttons (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900">
            Laporan Hasil Asesmen & Gamifikasi
          </h2>
          <p className="text-xs text-slate-500">
            Unduh atau cetak laporan hasil belajar siswa untuk dokumentasi pembelajaran
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV (Excel)</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Cadangan JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (Hidden on print) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3 no-print">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama siswa..."
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
          />
        </div>

        <select
          value={selectedClassId}
          onChange={e => setSelectedClassId(e.target.value)}
          className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
        >
          <option value="all">Semua Kelas</option>
          {classrooms.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
        >
          <option value="all">Semua Mapel</option>
          <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
          <option value="IPAS">IPAS</option>
          <option value="Matematika">Matematika</option>
          <option value="Seni Rupa">Seni Rupa</option>
          <option value="Bahasa Inggris">Bahasa Inggris</option>
          <option value="Bahasa Indonesia">Bahasa Indonesia</option>
        </select>
      </div>

      {/* Print Official Header (Visible in print) */}
      <div className="hidden print:block text-center border-b-2 border-slate-800 pb-4 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-wider">{settings.schoolName}</h1>
        <h2 className="text-sm font-semibold">REKAPITULASI HASIL ASESMEN FORMATIF BERBASIS GAMIFIKASI</h2>
        <p className="text-xs text-slate-600">Aplikasi RANTAU SMART PLAY • Guru Pengampu: {settings.teacherName}</p>
        <p className="text-[11px] text-slate-500 mt-1">Dicetak pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400">Total Sesi Kuis</p>
          <p className="text-2xl font-bold font-heading text-slate-900 mt-0.5">{totalSessions}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400">Rata-Rata Nilai</p>
          <p className="text-2xl font-bold font-heading text-blue-600 mt-0.5">{avgScore}%</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400">Jawaban Benar</p>
          <p className="text-2xl font-bold font-heading text-emerald-600 mt-0.5">
            {totalCorrectAnswers} / {totalQuestionsEvaluated}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400">Status Pembelajaran</p>
          <p className="text-xl font-bold font-heading text-slate-900 mt-0.5">
            {avgScore >= 75 ? 'Tuntas Ceria' : 'Perlu Penguatan'}
          </p>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold text-slate-600">Tidak ada riwayat hasil asesmen</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan filter kelas atau lakukan permainan kuis terlebih dahulu.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Kode Sesi & Tanggal</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Materi & Mapel</th>
                  <th className="py-3 px-4 text-center">Jawaban Benar</th>
                  <th className="py-3 px-4 text-center">Nilai Akhir</th>
                  <th className="py-3 px-4 text-right">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSessions.map(sess => (
                  <tr key={sess.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-700">{sess.sessionCode || 'RSP'}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(sess.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} • {new Date(sess.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {sess.studentName}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {sess.className}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800 line-clamp-1">{sess.gameTitle}</p>
                      <span className="text-[10px] text-slate-400">{sess.subject}</span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-slate-700">
                        {sess.correctCount} / {sess.totalQuestions}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full font-bold text-xs ${
                        sess.scorePercentage >= 80 ? 'bg-emerald-100 text-emerald-800' :
                        sess.scorePercentage >= 60 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sess.scorePercentage}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-amber-600">
                      +{sess.xpEarned} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Signature Section on Print */}
      <div className="hidden print:flex justify-between pt-12 text-xs">
        <div>
          <p>Mengetahui,</p>
          <p className="font-bold">Kepala SDN 32 Rantau Bayur</p>
          <div className="h-16" />
          <p className="font-bold underline">_________________________</p>
          <p className="text-[11px] text-slate-500">NIP. ........................................</p>
        </div>

        <div className="text-right">
          <p>Rantau Bayur, {new Date().toLocaleDateString('id-ID')}</p>
          <p className="font-bold">Guru Pengampu,</p>
          <div className="h-16" />
          <p className="font-bold underline">{settings.teacherName}</p>
          <p className="text-[11px] text-slate-500">SDN 32 Rantau Bayur</p>
        </div>
      </div>

    </div>
  );
};
