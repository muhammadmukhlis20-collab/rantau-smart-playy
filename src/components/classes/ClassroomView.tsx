import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Trash2,
  Edit2,
  Download,
  Upload,
  Trophy,
  Check,
  AlertTriangle,
  X,
  Sparkles
} from 'lucide-react';
import { storage } from '../../services/storage';
import { sound } from '../../services/audio';
import { Classroom, Student, GradeLevel } from '../../types';

export const ClassroomView: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(storage.getClassrooms());
  const [activeClassId, setActiveClassId] = useState<string>(
    classrooms[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'class' | 'student';
    id: string;
    name: string;
  } | null>(null);

  // Form states for class
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState<GradeLevel>(4);

  // Form states for student
  const [studentName, setStudentName] = useState('');

  const refreshData = () => {
    const updated = storage.getClassrooms();
    setClassrooms(updated);
    if (!updated.some(c => c.id === activeClassId) && updated.length > 0) {
      setActiveClassId(updated[0].id);
    }
  };

  const activeClass = classrooms.find(c => c.id === activeClassId);
  const allStudents = storage.getStudents(activeClassId);

  // Filter students by search
  const filteredStudents = allStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const newClass: Classroom = {
      id: `c_${Date.now()}`,
      name: newClassName.trim(),
      grade: newClassGrade,
      academicYear: '2025/2026',
      teacherName: storage.getSettings().teacherName || 'Guru Kelas',
    };
    storage.saveClassroom(newClass);
    sound.playCorrect();
    setNewClassName('');
    setShowAddClassModal(false);
    refreshData();
    setActiveClassId(newClass.id);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !activeClassId) return;

    if (editingStudent) {
      storage.saveStudent({
        ...editingStudent,
        name: studentName.trim(),
      });
    } else {
      const newSt: Student = {
        id: `s_${Date.now()}`,
        name: studentName.trim(),
        classId: activeClassId,
        isActive: true,
        xp: 0,
        level: 1,
        badges: [],
        completedSessionsCount: 0,
      };
      storage.saveStudent(newSt);
    }

    sound.playCorrect();
    setStudentName('');
    setEditingStudent(null);
    setShowAddStudentModal(false);
    refreshData();
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return;
    if (deleteConfirmTarget.type === 'class') {
      storage.deleteClassroom(deleteConfirmTarget.id);
    } else {
      storage.deleteStudent(deleteConfirmTarget.id);
    }
    sound.playClick();
    setDeleteConfirmTarget(null);
    refreshData();
  };

  // CSV Export for the class roster
  const exportStudentsCSV = () => {
    sound.playClick();
    const rows = [
      ['ID', 'Nama Siswa', 'Kelas', 'Level', 'XP', 'Status'],
      ...filteredStudents.map(s => [
        s.id,
        `"${s.name.replace(/"/g, '""')}"`,
        activeClass?.name || '',
        s.level,
        s.xp,
        s.isActive ? 'Aktif' : 'Non-aktif'
      ])
    ];
    const csvContent = '\uFEFF' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Daftar_Siswa_${activeClass?.name || 'Kelas'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeClassId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = String(event.target?.result || '');
        const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
        let importedCount = 0;

        lines.forEach((line, idx) => {
          if (idx === 0 && line.toLowerCase().includes('nama')) return; // skip header
          const parts = line.split(',');
          // If CSV has Name as first or second column
          const rawName = parts.length > 1 && parts[0].includes('s_') ? parts[1] : parts[0];
          const cleanName = rawName ? rawName.replace(/^"|"$/g, '').trim() : '';

          if (cleanName) {
            const st: Student = {
              id: `s_${Date.now()}_${idx}`,
              name: cleanName,
              classId: activeClassId,
              isActive: true,
              xp: 0,
              level: 1,
              badges: [],
              completedSessionsCount: 0
            };
            storage.saveStudent(st);
            importedCount++;
          }
        });

        sound.playVictory();
        alert(`Berhasil mengimpor ${importedCount} siswa ke ${activeClass?.name}.`);
        refreshData();
      } catch (err: any) {
        alert('Gagal membaca CSV: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900">
            Manajemen Kelas & Siswa
          </h2>
          <p className="text-xs text-slate-500">
            Kelola daftar kelas IV, V, VI dan anggota siswa SDN 32 Rantau Bayur
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowAddClassModal(true);
            }}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kelas</span>
          </button>
        </div>
      </div>

      {/* Class Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200">
        {classrooms.map(c => {
          const isActive = c.id === activeClassId;
          return (
            <button
              key={c.id}
              onClick={() => {
                sound.playClick();
                setActiveClassId(c.id);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{c.name}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {storage.getStudents(c.id).length} siswa
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Class Card & Action toolbar */}
      {activeClass ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  {activeClass.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Tingkat Kelas {activeClass.grade} SD
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Wali Kelas: {activeClass.teacherName} • {allStudents.length} siswa terdaftar
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setStudentName('');
                  setEditingStudent(null);
                  setShowAddStudentModal(true);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Siswa</span>
              </button>

              <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200">
                <Upload className="w-3.5 h-3.5" />
                <span>Impor CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCSVUpload}
                />
              </label>

              <button
                onClick={exportStudentsCSV}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor CSV</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setDeleteConfirmTarget({
                    type: 'class',
                    id: activeClass.id,
                    name: activeClass.name
                  });
                }}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                title="Hapus Kelas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa atau ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Student Table */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-slate-600">
                Belum ada siswa di kelas ini
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Gunakan tombol "Tambah Siswa" atau "Impor CSV" untuk menambahkan anggota kelas.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3">Level & Pangkat</th>
                    <th className="py-2.5 px-3">XP Terkumpul</th>
                    <th className="py-2.5 px-3">Lencana</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 flex items-center space-x-2">
                          <span>{student.name}</span>
                          {student.name.includes('(Demo)') && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded">
                              Demo
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{student.id}</span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                            {student.level}
                          </span>
                          <span className="text-slate-600">
                            {student.level === 1 ? 'Pemula Cilik' :
                             student.level === 2 ? 'Penjelajah' :
                             student.level === 3 ? 'Bintang Kelas' :
                             student.level === 4 ? 'Master Ilmu' : 'Juara Rantau'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold text-amber-600">
                          {student.xp} XP
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1">
                          {student.badges && student.badges.length > 0 ? (
                            student.badges.map((b, i) => (
                              <span key={i} className="text-base" title={b}>
                                {b === 'badge_explorer' ? '🧭' :
                                 b === 'badge_math' ? '➗' :
                                 b === 'badge_reader' ? '📖' :
                                 b === 'badge_challenger' ? '⚡' :
                                 b === 'badge_team' ? '🤝' : '🌟'}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                          Aktif
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => {
                              sound.playClick();
                              setEditingStudent(student);
                              setStudentName(student.name);
                              setShowAddStudentModal(true);
                            }}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                            title="Ubah Siswa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              sound.playClick();
                              setDeleteConfirmTarget({
                                type: 'student',
                                id: student.id,
                                name: student.name
                              });
                            }}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-slate-500">Belum ada kelas yang terdaftar.</p>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Tambah Kelas Baru
              </h3>
              <button
                onClick={() => setShowAddClassModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Kelas
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kelas IV-B atau Kelas V-B"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tingkat Kelas SD
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[4, 5, 6].map(grade => (
                    <button
                      type="button"
                      key={grade}
                      onClick={() => setNewClassGrade(grade as GradeLevel)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        newClassGrade === grade
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Kelas {grade}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-heading font-bold text-slate-900 text-base">
                {editingStudent ? 'Ubah Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button
                onClick={() => {
                  setShowAddStudentModal(false);
                  setEditingStudent(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Bintang Pratama"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                Siswa akan didaftarkan ke kelas <strong>{activeClass?.name}</strong>.
              </p>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStudentModal(false);
                    setEditingStudent(null);
                  }}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Tambahkan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-rose-100 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-base mb-1">
              Konfirmasi Penghapusan
            </h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Apakah Anda yakin ingin menghapus {deleteConfirmTarget.type === 'class' ? 'kelas' : 'siswa'}{' '}
              <strong>"{deleteConfirmTarget.name}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
