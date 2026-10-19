import React from 'react';
import { School, Heart, Sparkles, Phone, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
          <span>🏫 SDN 32 Rantau Bayur</span>
          <span>•</span>
          <span>Versi 1.0.0</span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            RANTAU SMART PLAY
          </h1>
          <p className="text-amber-300 font-bold text-lg mt-1 font-heading">
            Smart Learning, Happy Classroom.
          </p>
        </div>

        <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
          Aplikasi web edukatif berbasis gamifikasi dan kecerdasan artifisial (AI) yang dirancang khusus untuk mendukung pembelajaran interaktif, asesmen formatif yang menyenangkan, serta efisiensi kerja guru di SDN 32 Rantau Bayur.
        </p>
      </div>

      {/* Developer Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Informasi Pengembang Resmi</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-blue-500/20 font-heading">
              MM
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Muhammad Mukhlis, S.Pd
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pendidik & Pengembang Aplikasi Pembelajaran
              </p>
              <p className="text-xs font-semibold text-blue-700 mt-0.5">
                SDN 32 Rantau Bayur
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Kontak Pengembang</span>
              <a
                href="tel:082226859877"
                className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
              >
                082226859877
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Pedagogic Principles */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-lg text-slate-900">
          Prinsip Pedagogis & Gamifikasi Sehat
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Inklusif & Ramah Anak</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Gamifikasi tidak dimaksudkan untuk memicu kecemasan atau mempermalukan siswa dengan skor rendah. Poin (XP) dan lencana diberikan untuk menghargai ketekunan, partisipasi, dan proses belajar.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Efisiensi Waktu Guru</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Memudahkan guru menyiapkan kuis berkualitas dengan bantuan AI Gemini, melakukan penilaian instan, dan mengunduh laporan asesmen formatif dalam format CSV atau cetak PDF.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Diferensiasi Pembelajaran</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Menghasilkan rekomendasi remedial konkret dengan alat peraga nyata dan pengayaan kreatif eksploratif tanpa memberikan cap permanen kepada anak.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Privasi & Aksesibilitas</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Data tersimpan di peramban lokal komputer guru tanpa meminta data sensitif seperti nomor identitas kependudukan, alamat rumah, atau foto wajah siswa.
            </p>
          </div>
        </div>
      </div>

      {/* Target Pengguna */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
          Target Pengguna Aplikasi:
        </h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Guru kelas IV, V, dan VI SDN 32 Rantau Bayur sebagai fasilitator utama pembelajaran.</li>
          <li>Siswa sekolah dasar kelas tinggi (fase B & C Kurikulum Merdeka).</li>
          <li>Komunitas belajar guru untuk saling berbagi bank soal dan permainan edukatif.</li>
        </ul>
      </div>

    </div>
  );
};
