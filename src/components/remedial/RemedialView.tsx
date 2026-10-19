import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Trash2,
  BookOpen,
  ArrowRight,
  X
} from 'lucide-react';
import { storage } from '../../services/storage';
import { sound } from '../../services/audio';
import { RemedialTask, Subject, GradeLevel } from '../../types';

export const RemedialView: React.FC = () => {
  const classrooms = storage.getClassrooms();
  const allStudents = storage.getStudents();
  const [tasks, setTasks] = useState<RemedialTask[]>(storage.getRemedials());

  // Filter
  const [filterType, setFilterType] = useState<'all' | 'remedial' | 'enrichment'>('all');

  // Modal create
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<Subject>('Matematika');
  const [grade, setGrade] = useState<GradeLevel>(5);
  const [classId, setClassId] = useState<string>(classrooms[0]?.id || '');
  const [taskType, setTaskType] = useState<'remedial' | 'enrichment'>('remedial');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const refreshList = () => {
    setTasks(storage.getRemedials());
  };

  const filteredTasks = tasks.filter(t => {
    if (filterType === 'all') return true;
    return t.taskType === filterType;
  });

  const studentsInSelectedClass = allStudents.filter(s => s.classId === classId);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTask: RemedialTask = {
      id: `task_${Date.now()}`,
      title: title.trim(),
      subject,
      grade,
      classId,
      studentIds: selectedStudentIds,
      taskType,
      description: description.trim(),
      learningMaterials: materials.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    storage.saveRemedial(newTask);
    sound.playVictory();
    setShowCreateModal(false);
    refreshList();
    setTitle('');
    setDescription('');
    setMaterials('');
    setSelectedStudentIds([]);
  };

  const handleToggleStatus = (task: RemedialTask) => {
    sound.playClick();
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updated: RemedialTask = {
      ...task,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
    };
    storage.saveRemedial(updated);
    refreshList();
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus aktivitas ini?')) {
      sound.playClick();
      storage.deleteRemedial(id);
      refreshList();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900">
            Diferensiasi: Remedial & Pengayaan
          </h2>
          <p className="text-xs text-slate-500">
            Rancang pendampingan bertahap dan tantangan eksplorasi yang fleksibel tanpa melabeli siswa
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Program Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Program ({tasks.length})
        </button>

        <button
          onClick={() => setFilterType('remedial')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === 'remedial'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Remedial (Pendampingan Khusus)
        </button>

        <button
          onClick={() => setFilterType('enrichment')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filterType === 'enrichment'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Pengayaan (Tantangan Kreatif)
        </button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Target className="w-12 h-12 mx-auto mb-2 opacity-40" />
          <h4 className="text-sm font-bold text-slate-700 mb-1">
            Belum Ada Program Diferensiasi
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Gunakan tombol "Buat Program Baru" untuk menetapkan rencana penguatan atau proyek pengayaan bagi siswa.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map(t => {
            const cls = classrooms.find(c => c.id === t.classId);
            const targetStudents = allStudents.filter(s => t.studentIds?.includes(s.id));
            const isCompleted = t.status === 'completed';

            return (
              <div
                key={t.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-3 ${
                  isCompleted ? 'border-slate-200 opacity-80' : 'border-slate-200/90 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    t.taskType === 'remedial'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {t.taskType === 'remedial' ? '💡 Remedial Konkret' : '🚀 Pengayaan Eksplorasi'}
                  </span>

                  <span className="text-xs text-slate-400">
                    {cls?.name || `Kelas ${t.grade} SD`} • {t.subject}
                  </span>
                </div>

                <h3 className={`font-heading font-bold text-base text-slate-900 ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                  {t.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.description}
                </p>

                {t.learningMaterials && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                    <strong>Alat & Media Pembelajaran:</strong> {t.learningMaterials}
                  </div>
                )}

                {/* Target students chips */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">
                    Siswa Sasaran ({targetStudents.length}):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {targetStudents.length === 0 ? (
                      <span className="text-[11px] text-slate-400 italic">Terbuka untuk semua siswa kelas</span>
                    ) : (
                      targetStudents.map(s => (
                        <span key={s.id} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-100">
                          {s.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStatus(t)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span>{isCompleted ? 'Telah Selesai Dilaksanakan' : 'Tandai Selesai'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    title="Hapus Program"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Rancang Rencana Remedial / Pengayaan
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTaskType('remedial')}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    taskType === 'remedial'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  💡 Remedial (Penguatan)
                </button>
                <button
                  type="button"
                  onClick={() => setTaskType('enrichment')}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    taskType === 'enrichment'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  🚀 Pengayaan (Eksplorasi)
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Aktivitas
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Praktik Lipat Kertas Pecahan Senilai"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kelas
                  </label>
                  <select
                    value={classId}
                    onChange={e => {
                      setClassId(e.target.value);
                      setSelectedStudentIds([]);
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    {classrooms.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mata Pelajaran
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value as Subject)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                    <option value="IPAS">IPAS</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Seni Rupa">Seni Rupa</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Pendidikan Agama">Pendidikan Agama</option>
                    <option value="Seni dan Prakarya">Seni dan Prakarya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Langkah Instruksi & Kegiatan
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Jelaskan instruksi pendampingan konkret..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alat Peraga / Media Pendukung
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kertas origami warna-warni, gambar diagram, kartu soal"
                  value={materials}
                  onChange={e => setMaterials(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Student Target Picker */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Siswa Sasaran (Boleh lebih dari 1):
                </label>
                <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1 bg-slate-50">
                  {studentsInSelectedClass.map(st => {
                    const isChecked = selectedStudentIds.includes(st.id);
                    return (
                      <label key={st.id} className="flex items-center space-x-2 p-1 rounded hover:bg-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedStudentIds([...selectedStudentIds, st.id]);
                            } else {
                              setSelectedStudentIds(selectedStudentIds.filter(id => id !== st.id));
                            }
                          }}
                        />
                        <span className="text-slate-800">{st.name} ({st.xp} XP)</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Simpan Program
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
