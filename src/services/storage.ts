import { Classroom, Student, QuestionSet, GameSession, RemedialTask, AppSettings, Badge } from '../types';
import { sound } from './audio';

const STORAGE_KEYS = {
  CLASSROOMS: 'rsp_classrooms',
  STUDENTS: 'rsp_students',
  QUESTION_SETS: 'rsp_questionsets',
  SESSIONS: 'rsp_sessions',
  REMEDIALS: 'rsp_remedials',
  SETTINGS: 'rsp_settings',
};

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'badge_explorer',
    name: 'Penjelajah Ilmu',
    description: 'Menyelesaikan kuis pertama dengan rasa ingin tahu tinggi',
    icon: '🧭',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    criteria: 'Selesaikan 1 sesi permainan pembelajaran'
  },
  {
    id: 'badge_math',
    name: 'Ahli Numerasi',
    description: 'Mencapai akurasi di atas 80% pada topik Matematika',
    icon: '➗',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    criteria: 'Skor 80%+ di kuis Matematika'
  },
  {
    id: 'badge_reader',
    name: 'Pembaca Hebat',
    description: 'Teliti membaca teks dan memahami inti cerita',
    icon: '📖',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    criteria: 'Selesaikan soal Bahasa Indonesia tanpa tergesa-gesa'
  },
  {
    id: 'badge_challenger',
    name: 'Pemecah Tantangan',
    description: 'Berani mencoba tantangan roda dan berpikir kritis',
    icon: '⚡',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    criteria: 'Putar roda tantangan dan selesaikan misi'
  },
  {
    id: 'badge_team',
    name: 'Sahabat Tim',
    description: 'Mendukung teman dan aktif dalam mode kelompok',
    icon: '🤝',
    color: 'bg-pink-100 text-pink-700 border-pink-300',
    criteria: 'Bermain dalam mode kelompok atau proyektor'
  },
  {
    id: 'badge_perseverance',
    name: 'Pantang Menyerah',
    description: 'Terus mencoba dan belajar dari kesalahan dengan senyum',
    icon: '🌟',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    criteria: 'Mengulang kuis untuk memperbaiki pemahaman'
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  schoolName: 'SDN 32 Rantau Bayur',
  teacherName: 'Muhammad Mukhlis, S.Pd',
  soundEffects: true,
  themeColor: 'blue',
  autoReadAloud: false,
  showLeaderboardInStudentArena: false,
};

// Seed demo data for SDN 32 Rantau Bayur
const INITIAL_CLASSES: Classroom[] = [
  { id: 'c_4a', name: 'Kelas IV-A', grade: 4, academicYear: '2025/2026', teacherName: 'Guru Kelas IV' },
  { id: 'c_5a', name: 'Kelas V-A', grade: 5, academicYear: '2025/2026', teacherName: 'Muhammad Mukhlis, S.Pd' },
  { id: 'c_6a', name: 'Kelas VI-A', grade: 6, academicYear: '2025/2026', teacherName: 'Guru Kelas VI' },
];

const INITIAL_STUDENTS: Student[] = [
  { id: 's_1', name: 'Ahmad Faiz (Demo)', classId: 'c_5a', isActive: true, xp: 240, level: 2, badges: ['badge_explorer', 'badge_math'], completedSessionsCount: 3 },
  { id: 's_2', name: 'Nurul Aini (Demo)', classId: 'c_5a', isActive: true, xp: 310, level: 3, badges: ['badge_explorer', 'badge_reader'], completedSessionsCount: 4 },
  { id: 's_3', name: 'Rizky Pratama (Demo)', classId: 'c_5a', isActive: true, xp: 180, level: 2, badges: ['badge_explorer'], completedSessionsCount: 2 },
  { id: 's_4', name: 'Siti Rahma (Demo)', classId: 'c_5a', isActive: true, xp: 260, level: 2, badges: ['badge_explorer', 'badge_perseverance'], completedSessionsCount: 3 },
  { id: 's_5', name: 'Bayu Saputra (Demo)', classId: 'c_5a', isActive: true, xp: 120, level: 1, badges: ['badge_challenger'], completedSessionsCount: 1 },
  { id: 's_6', name: 'Dian Permata (Demo)', classId: 'c_4a', isActive: true, xp: 150, level: 2, badges: ['badge_explorer'], completedSessionsCount: 2 },
  { id: 's_7', name: 'Ilham Akbar (Demo)', classId: 'c_6a', isActive: true, xp: 290, level: 2, badges: ['badge_reader', 'badge_challenger'], completedSessionsCount: 3 },
];

const INITIAL_QUESTION_SETS: QuestionSet[] = [
  // --- 1. PENDIDIKAN PANCASILA ---
  {
    id: 'qs_pancasila_4',
    title: 'Makna Sila-Sila Pancasila dan Simbol Garuda',
    subject: 'Pendidikan Pancasila',
    grade: 4,
    topic: 'Nilai dan Simbol Garuda Pancasila',
    createdAt: new Date().toISOString(),
    isDemo: true,
    questions: [
      {
        id: 'q_pan_1',
        type: 'multiple_choice',
        question: 'Simbol Bintang bersudut lima pada burung Garuda melambangkan sila ke-...',
        options: ['Sila Pertama (Ketuhanan Yang Maha Esa)', 'Sila Kedua (Kemanusiaan yang Adil dan Beradab)', 'Sila Ketiga (Persatuan Indonesia)', 'Sila Kelima (Keadilan Sosial)'],
        correctAnswer: 0,
        explanation: 'Simbol Bintang emas berlatar perisai hitam melambangkan sila pertama, yaitu Ketuhanan Yang Maha Esa sebagai cahaya bagi seluruh rakyat Indonesia.',
        difficulty: 'easy'
      },
      {
        id: 'q_pan_2',
        type: 'multiple_choice',
        question: 'Kegiatan gotong royong membersihkan kelas atau lingkungan sekolah mencerminkan pengamalan sila...',
        options: ['Kedua dan Kelima', 'Ketiga (Persatuan Indonesia)', 'Pertama saja', 'Keempat saja'],
        correctAnswer: 1,
        explanation: 'Gotong royong mempererat kerukunan dan persatuan warga sekolah, yang sesuai dengan nilai luhur sila ke-3: Persatuan Indonesia.',
        difficulty: 'medium'
      },
      {
        id: 'q_pan_3',
        type: 'true_false',
        question: 'Menghargai teman yang sedang menjalankan ibadah sesuai agamanya merupakan bentuk pengamalan sila pertama Pancasila.',
        options: ['Benar', 'Salah'],
        correctAnswer: 0,
        explanation: 'Benar! Sikap toleransi dan saling menghormati antarumat beragama adalah wujud nyata nilai Ketuhanan Yang Maha Esa.',
        difficulty: 'easy'
      },
      {
        id: 'q_pan_4',
        type: 'multiple_choice',
        question: 'Simbol Kepala Banteng pada perisai Garuda melambangkan sila keempat karena banteng merupakan hewan yang...',
        options: ['Suka menyendiri dan berlari kencang', 'Suka berkumpul dan berjiwa sosial kuat', 'Berukuran sangat besar dan kuat', 'Memiliki tanduk yang tajam'],
        correctAnswer: 1,
        explanation: 'Banteng adalah hewan sosial yang suka berkumpul. Hal ini melambangkan musyawarah di mana orang-orang berkumpul untuk mendiskusikan suatu mufakat.',
        difficulty: 'medium'
      },
      {
        id: 'q_pan_5',
        type: 'multiple_choice',
        question: 'Padi dan Kapas sebagai simbol sila ke-5 melambangkan kebutuhan dasar seluruh rakyat Indonesia, yaitu...',
        options: ['Kendaraan dan tempat hiburan', 'Pangan (makanan) dan Sandang (pakaian)', 'Gedung sekolah bertingkat', 'Alat komunikasi canggih'],
        correctAnswer: 1,
        explanation: 'Padi melambangkan ketersediaan makanan pokok (pangan) dan kapas melambangkan bahan pakaian (sandang) untuk mewujudkan kemakmuran yang merata.',
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 'qs_pancasila_5',
    title: 'Hak dan Kewajiban Siswa di Sekolah & Rumah',
    subject: 'Pendidikan Pancasila',
    grade: 5,
    topic: 'Norma, Hak, dan Kewajiban',
    createdAt: new Date().toISOString(),
    isDemo: true,
    questions: [
      {
        id: 'q_pan5_1',
        type: 'multiple_choice',
        question: 'Manakah di bawah ini yang merupakan KEWAJIBAN utama seorang siswa saat berada di sekolah?',
        options: [
          'Mendengarkan penjelasan guru dan mematuhi tata tertib sekolah',
          'Mendapatkan ruang kelas yang bersih dan nyaman',
          'Meminjam buku pelajaran di perpustakaan',
          'Bermain bola di halaman saat jam istirahat'
        ],
        correctAnswer: 0,
        explanation: 'Kewajiban adalah hal yang harus kita lakukan dengan penuh tanggung jawab, seperti mematuhi aturan dan menghormati bapak/ibu guru.',
        difficulty: 'easy'
      },
      {
        id: 'q_pan5_2',
        type: 'multiple_choice',
        question: 'Setiap anak berhak mendapatkan kasih sayang dan perlindungan. Contoh HAK anak di lingkungan keluarga adalah...',
        options: [
          'Membantu merapikan tempat tidur sendiri',
          'Mendapatkan makanan bergizi dan bimbingan belajar dari orang tua',
          'Mencuci piring setelah makan malam',
          'Menjaga ketenangan saat adik tidur'
        ],
        correctAnswer: 1,
        explanation: 'Mendapatkan makanan sehat, tempat tinggal aman, dan kasih sayang adalah hak anak yang harus dipenuhi oleh orang tua.',
        difficulty: 'medium'
      },
      {
        id: 'q_pan5_3',
        type: 'true_false',
        question: 'Kita boleh menuntut hak kita terpenuhi terlebih dahulu tanpa melaksanakan kewajiban kita sama sekali.',
        options: ['Benar', 'Salah'],
        correctAnswer: 1,
        explanation: 'Salah. Hak dan kewajiban harus dilaksanakan secara seimbang. Kita wajib menunaikan tanggung jawab kita dengan baik sebelum menikmati hak.',
        difficulty: 'easy'
      },
      {
        id: 'q_pan5_4',
        type: 'multiple_choice',
        question: 'Ketika hasil musyawarah pemilihan ketua kelas tidak sesuai dengan calon yang kita pilih, sikap terpuji yang harus kita ambil adalah...',
        options: [
          'Menolak hasil keputusan dan tidak mau masuk kelas',
          'Menerima dengan lapang dada dan mendukung ketua kelas terpilih',
          'Mengejek teman yang memilih calon lain',
          'Meminta pemilihan diulang sampai calon kita menang'
        ],
        correctAnswer: 1,
        explanation: 'Menghargai hasil mufakat bersama secara ikhlas adalah bentuk kedewasaan bermusyawarah sesuai sila ke-4.',
        difficulty: 'challenging'
      }
    ]
  },

  // --- 2. IPAS (ILMU PENGETAHUAN ALAM & SOSIAL) ---
  {
    id: 'qs_ipas_4',
    title: 'Bagian Tumbuhan dan Fungsinya',
    subject: 'IPAS',
    grade: 4,
    topic: 'Struktur Tumbuhan',
    createdAt: new Date().toISOString(),
    isDemo: true,
    questions: [
      {
        id: 'q_ipas_1',
        type: 'multiple_choice',
        question: 'Bagian tumbuhan yang berfungsi menyerap air dan zat hara dari dalam tanah adalah...',
        options: ['Daun', 'Akar', 'Batang', 'Bunga'],
        correctAnswer: 1,
        explanation: 'Akar bertugas menancap ke tanah dan menyerap air serta mineral hara untuk disalurkan ke seluruh bagian tumbuhan.',
        difficulty: 'easy'
      },
      {
        id: 'q_ipas_2',
        type: 'multiple_choice',
        question: 'Proses fotosintesis pada tumbuhan hijau sebagian besar terjadi pada bagian...',
        options: ['Batang berkayu', 'Daun yang mengandung klorofil', 'Akar serabut', 'Biji berkeping'],
        correctAnswer: 1,
        explanation: 'Daun memiliki zat hijau daun (klorofil) yang menangkap energi cahaya matahari untuk proses pembuatan makanan (fotosintesis).',
        difficulty: 'easy'
      },
      {
        id: 'q_ipas_3',
        type: 'true_false',
        question: 'Gas yang dihasilkan oleh tumbuhan saat proses fotosintesis adalah Karbondioksida.',
        options: ['Benar', 'Salah'],
        correctAnswer: 1,
        explanation: 'Salah, fotosintesis menyerap Karbondioksida dan MENGHASILKAN Oksigen (O2) yang sangat bermanfaat bagi pernapasan makhluk hidup.',
        difficulty: 'medium'
      },
      {
        id: 'q_ipas_4',
        type: 'multiple_choice',
        question: 'Zat pembuluh pada tumbuhan yang bertugas mengangkut hasil fotosintesis dari daun ke seluruh tubuh tanaman adalah...',
        options: ['Xilem', 'Floem', 'Stomata', 'Epidermis'],
        correctAnswer: 1,
        explanation: 'Floem (pembuluh tapis) bertugas menyebarkan zat makanan hasil fotosintesis dari daun ke seluruh bagian tumbuhan.',
        difficulty: 'challenging'
      },
      {
        id: 'q_ipas_5',
        type: 'multiple_choice',
        question: 'Mengapa tumbuhan membutuhkan sinar matahari?',
        options: [
          'Agar daun berubah menjadi warna merah',
          'Sebagai sumber energi dalam mengolah makanan (fotosintesis)',
          'Untuk mempercepat pengguguran bunga',
          'Supaya tanah di sekitar menjadi kering'
        ],
        correctAnswer: 1,
        explanation: 'Sinar matahari menyediakan energi utama yang dibutuhkan klorofil untuk mengubah air dan CO2 menjadi glukosa/energi bagi tumbuhan.',
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 'qs_ipas_5',
    title: 'Rantai Makanan dan Ekosistem Alam',
    subject: 'IPAS',
    grade: 5,
    topic: 'Ekosistem dan Jaring Makanan',
    createdAt: new Date().toISOString(),
    isDemo: true,
    questions: [
      {
        id: 'q_ipas5_1',
        type: 'multiple_choice',
        question: 'Pada ekosistem sawah: Padi -> Belalang -> Katak -> Ular -> Elang. Makhluk hidup yang bertindak sebagai produsen adalah...',
        options: ['Belalang', 'Padi', 'Katak', 'Elang'],
        correctAnswer: 1,
        explanation: 'Tumbuhan hijau (padi) disebut produsen karena mampu memproduksi makanannya sendiri melalui fotosintesis.',
        difficulty: 'easy'
      },
      {
        id: 'q_ipas5_2',
        type: 'multiple_choice',
        question: 'Organisme seperti jamur dan bakteri yang menguraikan sisa-sisa makhluk hidup yang mati disebut...',
        options: ['Konsumen puncak', 'Herbivora', 'Pengurai (Dekomposer)', 'Parasit'],
        correctAnswer: 2,
        explanation: 'Pengurai (dekomposer) menguraikan zat organik bangkai menjadi unsur hara yang menyuburkan kembali tanah.',
        difficulty: 'medium'
      },
      {
        id: 'q_ipas5_3',
        type: 'true_false',
        question: 'Jika populasi ular sawah diburu hingga punah, maka jumlah hama tikus sawah akan semakin berkurang.',
        options: ['Benar', 'Salah'],
        correctAnswer: 1,
        explanation: 'Salah! Ular adalah pemangsa alami tikus. Jika ular punah, populasi hama tikus justru akan meledak dan merusak panen padi petani.',
        difficulty: 'medium'
      },
      {
        id: 'q_ipas5_4',
        type: 'multiple_choice',
        question: 'Hubungan timbal balik antara makhluk hidup dengan lingkungan tempat tinggalnya disebut...',
        options: ['Populasi', 'Komunitas', 'Ekosistem', 'Habitat'],
        correctAnswer: 2,
        explanation: 'Ekosistem adalah kesatuan interaksi antara komponen biotik (makhluk hidup) dan abiotik (benda mati seperti tanah, air, udara).',
        difficulty: 'easy'
      }
    ]
  },

  // --- 3. MATEMATIKA ---
  {
    id: 'qs_math_4',
    title: 'Keliling dan Luas Bangun Datar',
    subject: 'Matematika',
    grade: 4,
    topic: 'Geometri Bangun Datar Sederhana',
    createdAt: new Date().toISOString(),
    isDemo: true,
    questions: [
      {
        id: 'q_m4_1',
        type: 'multiple_choice',
        question: 'Sebuah taman berbentuk persegi memiliki panjang sisi 6 meter. Berapakah keliling taman tersebut?',
        options: ['12 meter', '24 meter', '36 meter', '18 meter'],
        correctAnswer: 1,
        explanation: 'Keliling persegi = 4 x sisi = 4 x 6 meter = 24 meter.',
        difficulty: 'easy'
      },
      {
        id: 'q_m4_2',
        type: 'multiple_choice',
        question: 'Sebuah papan tulis berbentuk persegi panjang dengan panjang 8 meter dan lebar 3 meter. Luas papan tulis adalah...',
        options: ['22 meter persegi', '24 meter persegi', '11 meter persegi', '48 meter persegi'],
        correctAnswer: 1,
        explanation: 'Luas persegi panjang = panjang x lebar = 8 x 3 = 24 meter persegi.',
        difficulty: 'easy'
      },
      {
        id: 'q_m4_3',
        type: 'true_false',
        question: 'Rumus untuk menghitung luas bangun segitiga adalah (Alas x Tinggi) dibagi 2.',
        options: ['Benar', 'Salah'],
        correctAnswer: 0,
        explanation: 'Benar! Luas segitiga = 1/2 x alas x tinggi.',
        difficulty: 'easy'
      },
      {
        id: 'q_m4_4',
        type: 'multiple_choice',
        question: 'Persegi ABCD mempunyai luas 49 cm persegi. Berapakah panjang masing-masing sisinya?',
        options: ['6 cm', '7 cm', '8 cm', '14 cm'],
        correctAnswer: 1,
        explanation: 'Luas persegi = sisi x sisi. Karena 7 x 7 = 49, maka panjang sisinya adalah 7 cm.',
        difficulty: 'challenging'
      }
    ]
  },
  {
    id: 'qs_math_5',
    title: 'Operasi Hitung Pecahan Sederhana',
    subject: 'Matematika',
    grade: 5,
    topic: 'Penjumlahan dan Pengurangan Pecahan',
    createdAt: new Date().toISOString(),
    isDemo: true,
    questions: [
      {
        id: 'q_math_1',
        type: 'multiple_choice',
        question: 'Berapakah hasil dari 1/4 + 2/4 ?',
        options: ['3/8', '3/4', '2/8', '1/2'],
        correctAnswer: 1,
        explanation: 'Karena penyebutnya sudah sama (yaitu 4), kita cukup menjumlahkan pembilangnya: 1 + 2 = 3. Jadi hasilnya 3/4.',
        difficulty: 'easy'
      },
      {
        id: 'q_math_2',
        type: 'multiple_choice',
        question: 'Berapakah hasil penjumlahan 1/2 + 1/3 ?',
        options: ['2/5', '5/6', '3/6', '4/5'],
        correctAnswer: 1,
        explanation: 'Samakan penyebut dengan KPK dari 2 dan 3, yaitu 6. Maka 3/6 + 2/6 = 5/6.',
        difficulty: 'medium'
      },
      {
        id: 'q_math_3',
        type: 'multiple_choice',
        question: 'Ibu memiliki 3/4 kg gula. Digunakan 1/4 kg untuk membuat teh manis. Sisa gula ibu sekarang adalah...',
        options: ['2/4 kg (atau 1/2 kg)', '1/4 kg', '4/4 kg', '3/8 kg'],
        correctAnswer: 0,
        explanation: '3/4 - 1/4 = 2/4 kg. Jika disederhanakan, 2/4 sama nilainya dengan 1/2 kg.',
        difficulty: 'medium'
      },
      {
        id: 'q_math_4',
        type: 'true_false',
        question: 'Pecahan 2/4 nilainya sama besar dengan pecahan 1/2.',
        options: ['Benar', 'Salah'],
        correctAnswer: 0,
        explanation: 'Benar! Jika pembilang dan penyebut 2/4 sama-sama dibagi 2, maka akan menjadi 1/2 (pecahan senilai).',
        difficulty: 'easy'
      },
      {
        id: 'q_math_5',
        type: 'multiple_choice',
        question: 'Manakah di bawah ini pecahan yang nilainya paling besar?',
        options: ['1/2', '1/3', '1/4', '1/8'],
        correctAnswer: 0,
        explanation: 'Pada pecahan dengan pembilang sama (1), semakin kecil nilai penyebutnya, maka semakin besar nilai pecahannya.',
        difficulty: 'challenging'
      }
    ]
  },

  // --- 4. SENI RUPA ---
  {
    id: 'qs_senirupa_4',
    title: 'Unsur Seni Rupa dan Lingkaran Warna',
    subject: 'Seni Rupa',
    grade: 4,
    topic: 'Warna Primer, Sekunder, dan Bentuk',
    createdAt: new Date().toISOString(),
    isDemo: true,
    questions: [
      {
        id: 'q_sr_1',
        type: 'multiple_choice',
        question: 'Manakah di bawah ini yang merupakan 3 warna primer (warna pokok)?',
        options: [
          'Merah, Kuning, dan Biru',
          'Hijau, Jingga, dan Ungu',
          'Hitam, Putih, dan Abu-abu',
          'Merah muda, Cokelat, dan Emas'
        ],
        correctAnswer: 0,
        explanation: 'Warna primer adalah warna dasar yang tidak dapat dihasilkan dari campuran warna lain, yaitu Merah, Kuning, dan Biru.',
        difficulty: 'easy'
      },
      {
        id: 'q_sr_2',
        type: 'multiple_choice',
        question: 'Jika warna Merah dicampur dengan warna Kuning dalam perbandingan seimbang, akan menghasilkan warna sekunder...',
        options: ['Hijau', 'Jingga (Oranye)', 'Ungu', 'Cokelat'],
        correctAnswer: 1,
        explanation: 'Percampuran warna primer Merah + Kuning akan menghasilkan warna sekunder Jingga (Oranye).',
        difficulty: 'easy'
      },
      {
        id: 'q_sr_3',
        type: 'multiple_choice',
        question: 'Warna Hijau diperoleh dari percampuran dua warna primer, yaitu...',
        options: [
          'Merah dan Biru',
          'Kuning dan Biru',
          'Merah dan Kuning',
          'Hitam dan Putih'
        ],
        correctAnswer: 1,
        explanation: 'Warna Kuning dicampur dengan Biru akan menghasilkan warna Hijau.',
        difficulty: 'medium'
      },
      {
        id: 'q_sr_4',
        type: 'true_false',
        question: 'Tekstur adalah sifat dan keadaan suatu permukaan bidang yang dapat dirasakan halus atau kasarnya melalui indra peraba atau penglihatan.',
        options: ['Benar', 'Salah'],
        correctAnswer: 0,
        explanation: 'Benar! Tekstur merupakan salah satu unsur utama seni rupa yang membedakan permukaan halus, kasar, licin, atau bergelombang.',
        difficulty: 'easy'
      },
      {
        id: 'q_sr_5',
        type: 'multiple_choice',
        question: 'Karya seni dua dimensi yang dibuat dengan menempelkan potongan kertas atau bahan alam pada suatu bidang gambar disebut teknik...',
        options: ['Kolase', 'Memahat', 'Menenun', 'Membatik celup'],
        correctAnswer: 0,
        explanation: 'Kolase adalah teknik karya seni rupa dua dimensi yang dibuat dengan menempelkan berbagai bahan (kertas, daun, biji-bijian) pada pola gambar.',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'qs_senirupa_5',
    title: 'Ragam Hias Nusantara dan Motif Tradisional',
    subject: 'Seni Rupa',
    grade: 5,
    topic: 'Pola Ragam Hias Tradisional',
    createdAt: new Date().toISOString(),
    isDemo: true,
    questions: [
      {
        id: 'q_sr5_1',
        type: 'multiple_choice',
        question: 'Ragam hias yang menggunakan inspirasi bentuk bunga, daun, dan sulur tanaman disebut ragam hias motif...',
        options: ['Fauna', 'Flora', 'Geometris', 'Figuratif'],
        correctAnswer: 1,
        explanation: 'Flora adalah ragam hias bertema tumbuhan, sedangkan fauna bertema hewan.',
        difficulty: 'easy'
      },
      {
        id: 'q_sr5_2',
        type: 'multiple_choice',
        question: 'Motif batik Mega Mendung yang berbentuk gumpalan awan indah berasal dari daerah...',
        options: ['Cirebon', 'Yogyakarta', 'Pekalongan', 'Solo'],
        correctAnswer: 0,
        explanation: 'Mega Mendung merupakan motif khas legendaris daerah Cirebon yang melambangkan awan pembawa kesejukan dan kesabaran.',
        difficulty: 'medium'
      },
      {
        id: 'q_sr5_3',
        type: 'true_false',
        question: 'Pola ragam hias geometris dibuat menggunakan bidang bentuk seperti segitiga, lingkaran, dan garis sejajar.',
        options: ['Benar', 'Salah'],
        correctAnswer: 0,
        explanation: 'Benar! Ragam hias geometris memanfaatkan bentuk-bentuk keteraturan matematika seperti tumpal (segitiga), pilin, dan kawung.',
        difficulty: 'easy'
      }
    ]
  },

  // --- 5. BAHASA INGGRIS ---
  {
    id: 'qs_binggris_4',
    title: 'Things in the Classroom and School Environment',
    subject: 'Bahasa Inggris',
    grade: 4,
    topic: 'School Objects and Prepositions',
    createdAt: new Date().toISOString(),
    isDemo: true,
    questions: [
      {
        id: 'q_en4_1',
        type: 'multiple_choice',
        question: 'What is the English word for "Papan Tulis"?',
        options: ['Whiteboard', 'Pencil case', 'Eraser', 'Ruler'],
        correctAnswer: 0,
        explanation: '"Whiteboard" artinya papan tulis putih. "Pencil case" = kotak pensil, "Eraser" = penghapus, "Ruler" = penggaris.',
        difficulty: 'easy'
      },
      {
        id: 'q_en4_2',
        type: 'multiple_choice',
        question: 'Complete the sentence: "The book is ... the table." (Buku itu ada DI ATAS meja)',
        options: ['in', 'on', 'under', 'between'],
        correctAnswer: 1,
        explanation: 'Kata depan (preposition) "on" digunakan untuk menunjukkan benda yang berada tepat di atas permukaan meja.',
        difficulty: 'easy'
      },
      {
        id: 'q_en4_3',
        type: 'true_false',
        question: '"Ruler" in Indonesian means "Buku Gambar".',
        options: ['Benar', 'Salah'],
        correctAnswer: 1,
        explanation: 'Salah. "Ruler" artinya "Penggaris". Buku gambar adalah "Drawing book".',
        difficulty: 'easy'
      },
      {
        id: 'q_en4_4',
        type: 'multiple_choice',
        question: 'Which of the following items is used to sharpen pencils?',
        options: ['Sharpener', 'Scissors', 'Glue', 'Backpack'],
        correctAnswer: 0,
        explanation: '"Sharpener" adalah rautan pensil. "Scissors" = gunting, "Glue" = lem.',
        difficulty: 'medium'
      },
      {
        id: 'q_en4_5',
        type: 'multiple_choice',
        question: 'A: "Where do students borrow books?" B: "They borrow books in the ..."',
        options: ['Canteen', 'Library', 'School yard', 'Laboratory'],
        correctAnswer: 1,
        explanation: '"Library" artinya perpustakaan sekolah, tempat meminjam dan membaca buku.',
        difficulty: 'easy'
      }
    ]
  },
  {
    id: 'qs_binggris_5',
    title: 'Daily Activities and Telling Time',
    subject: 'Bahasa Inggris',
    grade: 5,
    topic: 'Daily Routine & Time Expression',
    createdAt: new Date().toISOString(),
    isDemo: true,
    questions: [
      {
        id: 'q_en5_1',
        type: 'multiple_choice',
        question: 'What time is "It is seven o\'clock"?',
        options: ['Pukul 07.00 tepat', 'Pukul 07.30', 'Pukul 06.45', 'Pukul 08.00 tepat'],
        correctAnswer: 0,
        explanation: '"Seven o\'clock" berarti pukul tujuh tepat.',
        difficulty: 'easy'
      },
      {
        id: 'q_en5_2',
        type: 'multiple_choice',
        question: 'Rian usually ... his teeth before going to sleep.',
        options: ['washes', 'brushes', 'reads', 'cooks'],
        correctAnswer: 1,
        explanation: '"Brushes his teeth" artinya menggosok gigi.',
        difficulty: 'medium'
      },
      {
        id: 'q_en5_3',
        type: 'true_false',
        question: '"Breakfast" is the meal that we eat in the evening before sleeping.',
        options: ['Benar', 'Salah'],
        correctAnswer: 1,
        explanation: 'Salah. "Breakfast" artinya sarapan pagi. Makanan di malam hari disebut "Dinner".',
        difficulty: 'easy'
      },
      {
        id: 'q_en5_4',
        type: 'multiple_choice',
        question: 'A: "What is your hobby?" B: "My hobby is ... football on Sunday."',
        options: ['playing', 'eating', 'sleeping', 'singing'],
        correctAnswer: 0,
        explanation: 'Olahraga sepak bola menggunakan kata kerja "playing football" (bermain sepak bola).',
        difficulty: 'easy'
      }
    ]
  },

  // --- 6. BAHASA INDONESIA ---
  {
    id: 'qs_bindo_6',
    title: 'Gagasan Pokok dan Teks Eksplanasi',
    subject: 'Bahasa Indonesia',
    grade: 6,
    topic: 'Teks Informasi & Ide Pokok',
    createdAt: new Date().toISOString(),
    isDemo: true,
    questions: [
      {
        id: 'q_bi_1',
        type: 'multiple_choice',
        question: 'Gagasan utama yang menjadi dasar pengembangan sebuah paragraf disebut...',
        options: ['Ide pokok / gagasan pokok', 'Kalimat penjelas', 'Judul karangan', 'Kesimpulan akhir'],
        correctAnswer: 0,
        explanation: 'Ide pokok adalah inti sari masalah atau pikiran utama yang mendasari sebuah paragraf.',
        difficulty: 'easy'
      },
      {
        id: 'q_bi_2',
        type: 'multiple_choice',
        question: 'Paragraf yang kalimat utamanya terletak di awal paragraf disebut paragraf...',
        options: ['Deduktif', 'Induktif', 'Campuran', 'Naratif'],
        correctAnswer: 0,
        explanation: 'Paragraf Deduktif menempatkan gagasan utama di awal (Depan = Deduktif).',
        difficulty: 'medium'
      },
      {
        id: 'q_bi_3',
        type: 'true_false',
        question: 'Teks eksplanasi bertujuan menjelaskan proses terjadinya suatu fenomena alam atau sosial secara ilmiah.',
        options: ['Benar', 'Salah'],
        correctAnswer: 0,
        explanation: 'Benar. Teks eksplanasi memaparkan hubungan sebab-akibat terjadinya peristiwa ilmiah atau sosial.',
        difficulty: 'easy'
      },
      {
        id: 'q_bi_4',
        type: 'multiple_choice',
        question: 'Bagian struktur teks eksplanasi yang berisi ulasan atau kesimpulan penulis terhadap topik bahasan adalah...',
        options: ['Interpretasi / Ulasan', 'Pernyataan umum', 'Deretan penjelas', 'Daftar pustaka'],
        correctAnswer: 0,
        explanation: 'Struktur teks eksplanasi terdiri atas pernyataan umum, urutan sebab-akibat (deretan penjelas), dan interpretasi (penutup/kesimpulan).',
        difficulty: 'challenging'
      }
    ]
  }
];

// Realistic demo sessions clearly flagged as demo data
const INITIAL_SESSIONS: GameSession[] = [
  {
    id: 'sess_demo_1',
    sessionCode: 'RSP-501',
    gameType: 'quiz_adventure',
    gameTitle: 'Operasi Hitung Pecahan Sederhana',
    subject: 'Matematika',
    grade: 5,
    classId: 'c_5a',
    className: 'Kelas V-A',
    studentId: 's_1',
    studentName: 'Ahmad Faiz (Demo)',
    playMode: 'individual',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    totalQuestions: 5,
    correctCount: 4,
    wrongCount: 1,
    scorePercentage: 80,
    answers: [
      { questionId: 'q_math_1', questionText: 'Berapakah hasil dari 1/4 + 2/4 ?', userAnswer: 1, correctAnswer: 1, isCorrect: true },
      { questionId: 'q_math_2', questionText: 'Berapakah hasil penjumlahan 1/2 + 1/3 ?', userAnswer: 1, correctAnswer: 1, isCorrect: true },
      { questionId: 'q_math_3', questionText: 'Ibu memiliki 3/4 kg gula...', userAnswer: 0, correctAnswer: 0, isCorrect: true },
      { questionId: 'q_math_4', questionText: 'Pecahan 2/4 nilainya sama...', userAnswer: 0, correctAnswer: 0, isCorrect: true },
      { questionId: 'q_math_5', questionText: 'Manakah pecahan yang paling besar?', userAnswer: 2, correctAnswer: 0, isCorrect: false },
    ],
    xpEarned: 80,
    badgesAwarded: ['badge_math'],
    isCompleted: true
  },
  {
    id: 'sess_demo_2',
    sessionCode: 'RSP-502',
    gameType: 'quiz_adventure',
    gameTitle: 'Operasi Hitung Pecahan Sederhana',
    subject: 'Matematika',
    grade: 5,
    classId: 'c_5a',
    className: 'Kelas V-A',
    studentId: 's_2',
    studentName: 'Nurul Aini (Demo)',
    playMode: 'individual',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    totalQuestions: 5,
    correctCount: 5,
    wrongCount: 0,
    scorePercentage: 100,
    answers: [
      { questionId: 'q_math_1', questionText: 'Berapakah hasil dari 1/4 + 2/4 ?', userAnswer: 1, correctAnswer: 1, isCorrect: true },
      { questionId: 'q_math_2', questionText: 'Berapakah hasil penjumlahan 1/2 + 1/3 ?', userAnswer: 1, correctAnswer: 1, isCorrect: true },
      { questionId: 'q_math_3', questionText: 'Ibu memiliki 3/4 kg gula...', userAnswer: 0, correctAnswer: 0, isCorrect: true },
      { questionId: 'q_math_4', questionText: 'Pecahan 2/4 nilainya sama...', userAnswer: 0, correctAnswer: 0, isCorrect: true },
      { questionId: 'q_math_5', questionText: 'Manakah pecahan yang paling besar?', userAnswer: 0, correctAnswer: 0, isCorrect: true },
    ],
    xpEarned: 100,
    badgesAwarded: ['badge_math', 'badge_explorer'],
    isCompleted: true
  },
  {
    id: 'sess_demo_3',
    sessionCode: 'RSP-503',
    gameType: 'quiz_adventure',
    gameTitle: 'Operasi Hitung Pecahan Sederhana',
    subject: 'Matematika',
    grade: 5,
    classId: 'c_5a',
    className: 'Kelas V-A',
    studentId: 's_5',
    studentName: 'Bayu Saputra (Demo)',
    playMode: 'individual',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    totalQuestions: 5,
    correctCount: 2,
    wrongCount: 3,
    scorePercentage: 40,
    answers: [
      { questionId: 'q_math_1', questionText: 'Berapakah hasil dari 1/4 + 2/4 ?', userAnswer: 1, correctAnswer: 1, isCorrect: true },
      { questionId: 'q_math_2', questionText: 'Berapakah hasil penjumlahan 1/2 + 1/3 ?', userAnswer: 0, correctAnswer: 1, isCorrect: false },
      { questionId: 'q_math_3', questionText: 'Ibu memiliki 3/4 kg gula...', userAnswer: 1, correctAnswer: 0, isCorrect: false },
      { questionId: 'q_math_4', questionText: 'Pecahan 2/4 nilainya sama...', userAnswer: 0, correctAnswer: 0, isCorrect: true },
      { questionId: 'q_math_5', questionText: 'Manakah pecahan yang paling besar?', userAnswer: 3, correctAnswer: 0, isCorrect: false },
    ],
    xpEarned: 40,
    badgesAwarded: ['badge_perseverance'],
    isCompleted: true
  }
];

class StorageService {
  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.CLASSROOMS)) {
        localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(INITIAL_CLASSES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.QUESTION_SETS)) {
        localStorage.setItem(STORAGE_KEYS.QUESTION_SETS, JSON.stringify(INITIAL_QUESTION_SETS));
      } else {
        try {
          const currentSets: QuestionSet[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTION_SETS) || '[]');
          const currentIds = new Set(currentSets.map(q => q.id));
          const missing = INITIAL_QUESTION_SETS.filter(q => !currentIds.has(q.id));
          if (missing.length > 0) {
            localStorage.setItem(STORAGE_KEYS.QUESTION_SETS, JSON.stringify([...currentSets, ...missing]));
          }
        } catch {
          localStorage.setItem(STORAGE_KEYS.QUESTION_SETS, JSON.stringify(INITIAL_QUESTION_SETS));
        }
      }
      if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.REMEDIALS)) {
        localStorage.setItem(STORAGE_KEYS.REMEDIALS, JSON.stringify([]));
      }
    } catch (e) {
      console.warn('Storage initialisation error:', e);
    }
  }

  // --- Classrooms ---
  public getClassrooms(): Classroom[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLASSROOMS);
      const classes: Classroom[] = data ? JSON.parse(data) : [];
      const students = this.getStudents();
      return classes.map(c => ({
        ...c,
        studentCount: students.filter(s => s.classId === c.id).length
      }));
    } catch {
      return [];
    }
  }

  public saveClassroom(cls: Classroom): void {
    const list = this.getClassrooms().map(({ studentCount, ...rest }) => rest);
    const idx = list.findIndex(c => c.id === cls.id);
    if (idx >= 0) {
      list[idx] = cls;
    } else {
      list.push(cls);
    }
    localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(list));
  }

  public deleteClassroom(id: string): void {
    const list = this.getClassrooms().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(list));
    // Also clean students associated
    const students = this.getStudents().filter(s => s.classId !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }

  // --- Students ---
  public getStudents(classId?: string): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      const list: Student[] = data ? JSON.parse(data) : [];
      if (classId) {
        return list.filter(s => s.classId === classId);
      }
      return list;
    } catch {
      return [];
    }
  }

  public saveStudent(student: Student): void {
    const list = this.getStudents();
    const idx = list.findIndex(s => s.id === student.id);
    if (idx >= 0) {
      list[idx] = student;
    } else {
      list.push(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(list));
  }

  public deleteStudent(id: string): void {
    const list = this.getStudents().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(list));
  }

  // --- Question Sets ---
  public getQuestionSets(subject?: string, grade?: number): QuestionSet[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTION_SETS);
      let list: QuestionSet[] = data ? JSON.parse(data) : [];
      if (subject && subject !== 'all') {
        list = list.filter(q => q.subject === subject);
      }
      if (grade) {
        list = list.filter(q => q.grade === grade);
      }
      return list;
    } catch {
      return [];
    }
  }

  public saveQuestionSet(qs: QuestionSet): void {
    const list = this.getQuestionSets();
    const idx = list.findIndex(q => q.id === qs.id);
    if (idx >= 0) {
      list[idx] = qs;
    } else {
      list.unshift(qs); // Place newest first
    }
    localStorage.setItem(STORAGE_KEYS.QUESTION_SETS, JSON.stringify(list));
  }

  public deleteQuestionSet(id: string): void {
    const list = this.getQuestionSets().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUESTION_SETS, JSON.stringify(list));
  }

  // --- Sessions & Results ---
  public getSessions(classId?: string, studentId?: string): GameSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      let list: GameSession[] = data ? JSON.parse(data) : [];
      if (classId) {
        list = list.filter(s => s.classId === classId);
      }
      if (studentId) {
        list = list.filter(s => s.studentId === studentId);
      }
      // Sort newest first
      return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      return [];
    }
  }

  public saveSession(session: GameSession): void {
    const list = this.getSessions();
    list.unshift(session);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(list));

    // Update student XP, level, and sessions count if attached to a registered student
    if (session.studentId) {
      const students = this.getStudents();
      const st = students.find(s => s.id === session.studentId);
      if (st) {
        st.xp = (st.xp || 0) + (session.xpEarned || 0);
        st.completedSessionsCount = (st.completedSessionsCount || 0) + 1;
        // Level calculation formula: Level 1 (0-100), Level 2 (101-250), Level 3 (251-450), Level 4 (451-700), Level 5 (701+)
        if (st.xp >= 700) st.level = 5;
        else if (st.xp >= 450) st.level = 4;
        else if (st.xp >= 250) st.level = 3;
        else if (st.xp >= 100) st.level = 2;
        else st.level = 1;

        // Auto award badges based on achievements
        if (!st.badges) st.badges = [];
        if (!st.badges.includes('badge_explorer') && st.completedSessionsCount >= 1) {
          st.badges.push('badge_explorer');
        }
        if (!st.badges.includes('badge_math') && session.subject === 'Matematika' && session.scorePercentage >= 80) {
          st.badges.push('badge_math');
        }
        if (!st.badges.includes('badge_reader') && session.subject === 'Bahasa Indonesia' && session.scorePercentage >= 70) {
          st.badges.push('badge_reader');
        }
        if (!st.badges.includes('badge_team') && (session.playMode === 'group' || session.playMode === 'projector')) {
          st.badges.push('badge_team');
        }
        if (!st.badges.includes('badge_perseverance') && session.scorePercentage < 60) {
          st.badges.push('badge_perseverance');
        }

        this.saveStudent(st);
      }
    }
  }

  // --- Remedial & Enrichment ---
  public getRemedials(): RemedialTask[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMEDIALS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveRemedial(task: RemedialTask): void {
    const list = this.getRemedials();
    const idx = list.findIndex(r => r.id === task.id);
    if (idx >= 0) {
      list[idx] = task;
    } else {
      list.unshift(task);
    }
    localStorage.setItem(STORAGE_KEYS.REMEDIALS, JSON.stringify(list));
  }

  public deleteRemedial(id: string): void {
    const list = this.getRemedials().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REMEDIALS, JSON.stringify(list));
  }

  // --- Settings ---
  public getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const parsed = data ? JSON.parse(data) : INITIAL_SETTINGS;
      sound.enabled = parsed.soundEffects ?? true;
      return parsed;
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  public saveSettings(settings: AppSettings): void {
    sound.enabled = settings.soundEffects;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // --- Backup Export / Import ---
  public exportBackup(): string {
    const backup = {
      app: 'RANTAU SMART PLAY',
      school: 'SDN 32 Rantau Bayur',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      classrooms: this.getClassrooms(),
      students: this.getStudents(),
      questionSets: this.getQuestionSets(),
      sessions: this.getSessions(),
      remedials: this.getRemedials(),
      settings: this.getSettings()
    };
    return JSON.stringify(backup, null, 2);
  }

  public importBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        throw new Error('Format file JSON tidak valid.');
      }
      if (Array.isArray(data.classrooms)) {
        localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(data.classrooms));
      }
      if (Array.isArray(data.students)) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
      }
      if (Array.isArray(data.questionSets)) {
        localStorage.setItem(STORAGE_KEYS.QUESTION_SETS, JSON.stringify(data.questionSets));
      }
      if (Array.isArray(data.sessions)) {
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data.sessions));
      }
      if (Array.isArray(data.remedials)) {
        localStorage.setItem(STORAGE_KEYS.REMEDIALS, JSON.stringify(data.remedials));
      }
      if (data.settings && typeof data.settings === 'object') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      }
      return { success: true, message: 'Data cadangan berhasil dipulihkan.' };
    } catch (err: any) {
      return { success: false, message: 'Gagal mengimpor file: ' + err.message };
    }
  }

  public resetDemo(): void {
    localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(INITIAL_CLASSES));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.QUESTION_SETS, JSON.stringify(INITIAL_QUESTION_SETS));
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.REMEDIALS, JSON.stringify([]));
  }
}

export const storage = new StorageService();
