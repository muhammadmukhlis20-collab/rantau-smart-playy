import React, { useState } from 'react';
import {
  Settings,
  School,
  Volume2,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Save,
  HelpCircle
} from 'lucide-react';
import { storage } from '../../services/storage';
import { sound } from '../../services/audio';
import { AppSettings } from '../../types';

interface SettingsViewProps {
  onSettingsChanged: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onSettingsChanged }) => {
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [saveNotice, setSaveNotice] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveSettings(settings);
    sound.playVictory();
    setSaveNotice(true);
    onSettingsChanged();
    setTimeout(() => setSaveNotice(false), 2500);
  };

  const handleTestSound = () => {
    sound.playCorrect();
  };

  const handleResetDemo = () => {
    if (confirm('PERINGATAN: Tindakan ini akan mengembalikan seluruh data kelas, siswa, bank soal, dan riwayat sesi ke data demo awal SDN 32 Rantau Bayur. Lanjutkan?')) {
      storage.resetDemo();
      sound.playVictory();
      alert('Data berhasil diatur ulang ke kondisi demo awal.');
      window.location.reload();
    }
  };

  const handleDownloadBackup = () => {
    sound.playClick();
    const backupStr = storage.exportBackup();
    const blob = new Blob([backupStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_RantauSmartPlay_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = String(event.target?.result || '');
        const res = storage.importBackup(text);
        if (res.success) {
          sound.playVictory();
          setImportStatus('Cadangan berhasil dipulihkan!');
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          setImportStatus('Gagal memulihkan: ' + res.message);
        }
      } catch (err: any) {
        setImportStatus('Format file tidak valid: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold font-heading text-slate-900">
          Pengaturan Aplikasi & Penyimpanan
        </h2>
        <p className="text-xs text-slate-500">
          Konfigurasi identitas sekolah, audio efek, dan pencadangan data lokal
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Identitas Sekolah & Guru */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-base text-slate-900 flex items-center space-x-2">
            <School className="w-4 h-4 text-blue-600" />
            <span>Identitas Instansi & Pendidik</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Sekolah Dasar
              </label>
              <input
                type="text"
                required
                value={settings.schoolName}
                onChange={e => setSettings({ ...settings, schoolName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Guru / Administrator
              </label>
              <input
                type="text"
                required
                value={settings.teacherName}
                onChange={e => setSettings({ ...settings, teacherName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Preferensi Audio & Antarmuka */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-base text-slate-900 flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>Preferensi Suara & Tampilan</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Efek Suara Gamifikasi (Web Audio)</p>
                <p className="text-[11px] text-slate-500">
                  Bunyi denting ceria saat benar, boop lembut saat salah, dan fanfare saat menang
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleTestSound}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[11px] hover:bg-emerald-200 transition-colors"
                >
                  Uji Suara 🔊
                </button>

                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={e => setSettings({ ...settings, soundEffects: e.target.checked })}
                  className="w-5 h-5 rounded text-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Tampilkan Papan Peringkat di Arena Siswa</p>
                <p className="text-[11px] text-slate-500">
                  Secara default dimatikan agar tidak memicu stres persaingan yang tidak sehat bagi siswa
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.showLeaderboardInStudentArena}
                onChange={e => setSettings({ ...settings, showLeaderboardInStudentArena: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>

          {saveNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan berhasil diperbarui.</span>
            </div>
          )}
        </div>

      </form>

      {/* Cadangan & Pemulihan Data */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="font-heading font-bold text-base text-slate-900 flex items-center space-x-2">
            <Download className="w-4 h-4 text-purple-600" />
            <span>Cadangkan & Pulihkan Data (JSON)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pindahkan data antarkomputer atau amankan seluruh bank soal dan nilai siswa
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Cadangan Lengkap</span>
          </button>

          <label className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Pulihkan Cadangan JSON</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleUploadBackup}
            />
          </label>

          <button
            type="button"
            onClick={handleResetDemo}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Data Demo Awal</span>
          </button>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
            {importStatus}
          </div>
        )}
      </div>

    </div>
  );
};
