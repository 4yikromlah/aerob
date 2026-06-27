import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Video, 
  Award, 
  Search, 
  Download, 
  CheckCircle, 
  ChevronRight, 
  Play, 
  Pause, 
  SkipForward, 
  Clock, 
  BookMarked,
  RotateCcw,
  Check,
  AlertCircle,
  Trophy,
  Calendar,
  User,
  ShieldAlert,
  FileDown,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Lock,
  AlertTriangle
} from 'lucide-react';

export interface Module {
  id: string;
  title: string;
  difficulty: 'Pemula' | 'Menengah' | 'Mahir';
  category: string;
  size: string;
  pages: number;
  description: string;
  chapters: string[];
  pdfSimContent: { chapter: string; body: string }[];
  isActive?: boolean;
  pdfFileName?: string;
}

export interface LearningVideo {
  id: string;
  title: string;
  duration: string;
  category: string;
  narrator: string;
  description: string;
  youtubeId?: string; // Optional real fallback
  chapters: { time: string; title: string }[];
  isActive?: boolean;
  videoFileName?: string;
  localVideoUrl?: string;
  difficulty?: 'Pemula' | 'Menengah' | 'Mahir';
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
}

export const MODULES_DATA: Module[] = [
  {
    id: 'mod-1',
    title: 'Pengenalan Arduino & Elektronika Dasar (Anggota)',
    difficulty: 'Pemula',
    category: 'Elektronika',
    size: '4.2 MB',
    pages: 24,
    description: 'Panduan fundamental mengenai mikrokontroler Arduino Uno, sirkuit roti LED, hukum Ohm, resistor dan pin input/output digital khusus Anggota reguler.',
    chapters: [
      'Bab I: Mengenal Papan Arduino Uno R3',
      'Bab II: Hukum Ohm & Komponen Elektronika Pasif',
      'Bab III: Menggunakan Breadboard & Sirkuit LED pertama',
      'Bab IV: Logika Pemrograman void setup() dan void loop()'
    ],
    pdfSimContent: [
      {
        chapter: 'Bab I: Mengenal Papan Arduino Uno R3',
        body: 'Arduino Uno adalah papan mikrokontroler berbasis ATmega328P. Papan ini memiliki 14 pin input/output digital (di mana 6 pin dapat digunakan sebagai output PWM), 6 input analog, resonator keramik 16 MHz, koneksi USB, jack daya, header ICSP, dan tombol reset. Mikrokontroler ini merupakan otak dari sasis robot pintar kita.'
      },
      {
        chapter: 'Bab II: Hukum Ohm & Komponen Elektronika Pasif',
        body: 'Hukum Ohm merumuskan hubungan V = I x R. Tegangan (V) dalam Volt, Arus (I) dalam Ampere, dan Hambatan (R) dalam Ohm. Sangat krusial menggunakan resistor pembatas arus (minimum 220 Ohm) saat menghidupkan LED merah standar dari suplai daya 5V Arduino agar LED tidak terbakar akibat arus berlebih.'
      },
      {
        chapter: 'Bab III: Menggunakan Breadboard & Sirkuit LED pertama',
        body: 'Breadboard (Project Board) memiliki baris horizontal yang saling terhubung di bagian tengah untuk komponen, dan jalur bus vertikal di bagian samping untuk distribusi daya (+ dan -). Sambungkan katode LED (kaki pendek) ke GND melaui resistor and anode LED (kaki panjang) ke pin Digital 13 Arduino.'
      },
      {
        chapter: 'Bab IV: Logika Pemrograman void setup() dan void loop()',
        body: 'Fungsi void setup() dijalankan hanya sekali saat Arduino pertama kali dinyalakan. Digunakan untuk inisialisasi pin, seperti pinMode(13, OUTPUT). Fungsi void loop() berjalan berulang terus menerus secara sekuensial. Kita menempatkan perintah utama seperti digitalWrite(13, HIGH) and delay(1000) di dalam loop untuk mengedipkan LED.'
      }
    ]
  },
  {
    id: 'mod-1-mitra',
    title: 'Otomasi Sensor & Aplikasi IoT Industri (Mitra)',
    difficulty: 'Pemula',
    category: 'Otomasi Industri',
    size: '4.5 MB',
    pages: 20,
    description: 'Modul dasar mengenai implementasi sensor deteksi benda, konfigurasi relay tegangan tinggi, serta integrasi dashboard IoT industri untuk pangkalan data mitra.',
    chapters: [
      'Bab I: Pengenalan Sensor Proximity & Limit Switch',
      'Bab II: Konfigurasi Relay & Beban Listrik AC',
      'Bab III: Pengenalan Protokol Komunikasi Modbus Dasar',
      'Bab IV: Pemantauan Keadaan Mesin via Dashboard Internet'
    ],
    pdfSimContent: [
      {
        chapter: 'Bab I: Pengenalan Sensor Proximity & Limit Switch',
        body: 'Sensor proximity mendeteksi keberadaan objek logam atau non-logam di depannya tanpa sentuhan fisik. Sensor ini sangat penting di industri perakitan mitra untuk mendeteksi posisi sasis produk pada ban konveyor sebelum diproses lebih lanjut.'
      },
      {
        chapter: 'Bab II: Konfigurasi Relay & Beban Listrik AC',
        body: 'Relay adalah sakelar elektromagnetik yang diaktifkan oleh arus listrik kecil dari mikrokontroler (5V/3.3V) untuk mengontrol sirkuit dengan arus atau tegangan yang jauh lebih besar (seperti motor konveyor AC 220V).'
      },
      {
        chapter: 'Bab III: Pengenalan Protokol Komunikasi Modbus Dasar',
        body: 'Modbus adalah protokol komunikasi serial industri yang andal untuk menghubungkan sensor, aktuator, PLC, dan mikrokontroler. Menggunakan arsitektur master-slave di mana satu master dapat membaca puluhan register data dari banyak slave secara berurutan.'
      },
      {
        chapter: 'Bab IV: Pemantauan Keadaan Mesin via Dashboard Internet',
        body: 'Melalui modul komunikasi nirkabel, data downtime mesin, jumlah produksi harian, dan suhu sasis motor dapat dikirimkan ke server cloud mitra untuk pemantauan langsung secara real-time dari jarak jauh.'
      }
    ]
  },
  {
    id: 'mod-2',
    title: 'Pemrograman Gerak & Driver Motor L298N',
    difficulty: 'Menengah',
    category: 'Mekanik & Aktuator',
    size: '5.1 MB',
    pages: 32,
    description: 'Pelajari integrasi motor DC, teknik Pulse Width Modulation (PWM), sasis roda diferensial, serta sirkuit jembatan H-Bridge L298N.',
    chapters: [
      'Bab I: Memahami Cara Kerja Motor DC Arus Searah',
      'Bab II: Sirkuit Jembatan H-Bridge pada L298N',
      'Bab III: Kontrol Kecepatan Menggunakan Sinyal PWM Arduino',
      'Bab IV: Algoritma Kendali Arah Belok Sasis Roda'
    ],
    pdfSimContent: [
      {
        chapter: 'Bab I: Memahami Cara Kerja Motor DC Arus Searah',
        body: 'Motor DC mengubah energi listrik menjadi energi kinetik rotasi melalui induksi elektromagnetik. Arah putaran motor ditentukan oleh polaritas arus listrik yang diberikan ke terminalnya. Kecepatan putaran sebanding dengan tegangan rata-rata yang mengalir.'
      },
      {
        chapter: 'Bab II: Sirkuit Jembatan H-Bridge pada L298N',
        body: 'Modul L298N menggunakan chip sirkuit terpadu Bridge ganda untuk menangani arus motor yang besar (hingga 2A per motor). Dengan 4 sakelar internal (transistor), jembatan H memungkinkan kita membalik polaritas arus kontrol sehingga motor DC dapat berputar maju maupun mundur dari satu suplai baterai eksternal.'
      },
      {
        chapter: 'Bab III: Kontrol Kecepatan Menggunakan Sinyal PWM Arduino',
        body: 'PWM (Pulse Width Modulation) memodulasi lebar pulsa aktif untuk menghasilkan tegangan analog semu dari output digital biner. Nilai PWM berkisar dari 0 (mati total) hingga 255 (daya penuh). Pada driver L298N, pin ENA dan ENB dihubungkan ke pin PWM Arduino untuk menskala kecepatan roda.'
      },
      {
        chapter: 'Bab IV: Algoritma Kendali Arah Belok Sasis Roda',
        body: 'Untuk berbelok kanan secara diferensial: Matikan atau putar balik roda kanan (IN3=LOW, IN4=HIGH) sambil memutar maju roda kiri (IN1=HIGH, IN2=LOW). Untuk gerakan lurus presisi, kedua driver harus disuplai dengan nilai PWM yang seimbang untuk mengkompensasi deviasi gesekan motor mekanik.'
      }
    ]
  },
  {
    id: 'mod-3',
    title: 'Sensor Navigasi & Algoritma Line Follower',
    difficulty: 'Menengah',
    category: 'Navigasi Robot',
    size: '6.8 MB',
    pages: 45,
    description: 'Dasar sasis pelacak garis otomatis. Mulai dari sensor infrared biner hingga formulasi kontrol Proportional-Integral-Derivative (PID).',
    chapters: [
      'Bab I: Prinsip Kerja Sensor Spektrum Infrared',
      'Bab II: Konfigurasi Array Sensor Garis Sasis Pintar',
      'Bab III: Logika Dasar Algoritma Threshold Biner',
      'Bab IV: Pengenalan Sederhana Kontrol PID Terintegrasi'
    ],
    pdfSimContent: [
      {
        chapter: 'Bab I: Prinsip Kerja Sensor Spektrum Infrared',
        body: 'Sensor inframerah terdiri dari IR Transmitter (LED pemancar) dan Photodiode/Phototransistor (penerima). Permukaan putih memantulkan sebagian besar cahaya IR (Photodiode mendeteksi peningkatan arus), sedangkan cat hitam menyerap cahaya IR sehingga pantulan minimal.'
      },
      {
        chapter: 'Bab II: Konfigurasi Array Sensor Garis Sasis Pintar',
        body: 'Sasis line follower umumnya menggunakan minimal 4 hingga 8 sensor IR yang disusun sejajar horizontal di bagian moncong bawah sasis. Posisi robot relatif terhadap trek garis hitam dihitung berdasarkan sensor mana yang mendeteksi warna gelap saat itu.'
      },
      {
        chapter: 'Bab III: Logika Dasar Algoritma Threshold Biner',
        body: 'Algoritma biner menetapkan nilai ambang batas (threshold) pembacaan analog. Nilai di atas threshold diartikan sebagai 1 (gelap) dan di bawah diartikan sebagai 0 (terang). Logika robot: jika sensor paling kiri mendeteksi gelap, putar kemudi ke kiri keras segera.'
      },
      {
        chapter: 'Bab IV: Pengenalan Sederhana Kontrol PID Terintegrasi',
        body: 'Kontrol PID menghitung nilai Error (jarak pusat robot ke garis). U_kontrol = Kp * Error + Ki * ΣError + Kd * (Error - Error_sebelumnya). Nilai U_kontrol ini kemudian dikurangi dari kecepatan motor satu sisi dan ditambahkan ke motor sisi lain untuk koreksi belokan super mulus.'
      }
    ]
  },
  {
    id: 'mod-4',
    title: 'Computer Vision & Kecerdasan Buatan (AI) Robotika',
    difficulty: 'Mahir',
    category: 'Computer Vision',
    size: '7.4 MB',
    pages: 50,
    description: 'Panduan tingkat lanjut mengenai implementasi pengenalan objek, pengolahan citra digital dengan OpenCV, sensor fusion, serta algoritma navigasi otonom.',
    chapters: [
      'Bab I: Pengenalan Kamera Pintar & Citra Digital',
      'Bab II: Pengolahan Thresholding Warna dengan OpenCV',
      'Bab III: Deteksi Bentuk & Pengenalan Rambu Lalu Lintas',
      'Bab IV: Implementasi Model Object Detection Edge AI'
    ],
    pdfSimContent: [
      {
        chapter: 'Bab I: Pengenalan Kamera Pintar & Citra Digital',
        body: 'Kamera pintar (smart camera) menangkap matriks piksel warna (RGB). Dalam robotika, citra digital ini diolah frame-by-frame untuk mengidentifikasi lintasan atau objek rintangan. Pemrosesan awal biasanya berupa resizing dan konversi ruang warna ke HSV yang lebih stabil terhadap perubahan cahaya ruangan.'
      },
      {
        chapter: 'Bab II: Pengolahan Thresholding Warna dengan OpenCV',
        body: 'Menggunakan pustaka OpenCV, kita menerapkan teknik thresholding dengan filter inRange() dalam ruang warna HSV. Ini memungkinkan robot menyaring piksel berwarna spesifik (misalnya garis kuning atau rambu merah) dan mengubahnya menjadi gambar biner hitam-putih untuk pelacakan kontur.'
      },
      {
        chapter: 'Bab III: Deteksi Bentuk & Pengenalan Rambu Lalu Lintas',
        body: 'Setelah binerisasi, algoritma findContours() dan approxPolyDP() digunakan untuk mengenali bentuk geometri. Rambu lingkaran diidentifikasi untuk perintah "STOP", sedangkan rambu segitiga/panah digunakan untuk memandu arah belok robot secara otonom tanpa bantuan garis penuntun.'
      },
      {
        chapter: 'Bab IV: Implementasi Model Object Detection Edge AI',
        body: 'Untuk tingkat mahir, sasis robot diintegrasikan dengan modul akselerator Edge AI seperti Google Coral atau Raspberry Pi. Model deep learning ringan (seperti MobileNet-SSD) melakukan inferensi real-time langsung di robot untuk mendeteksi rintangan dinamis seperti pejalan kaki atau robot lain.'
      }
    ]
  }
];

export const VIDEOS_DATA: LearningVideo[] = [
  {
    id: 'vid-1',
    title: 'Mekanik Robot: Merakit Sasis Pintar Roda 2 & Roda 4 (Anggota)',
    duration: '12 Mnt 45 Detik',
    category: 'Mekanik & Sasis',
    narrator: 'Fadhil Muhammad Nur (Ketua Lab)',
    description: 'Langkah praktis merakit sasis akrilik robotika, memasang motor DC kuning gear, roda kastor depan, dan penempatan papan Arduino agar gravitasi robot seimbang khusus Anggota reguler.',
    chapters: [
      { time: '00:00', title: 'Unboxing Part & Persiapan Alat Solder' },
      { time: '02:30', title: 'Pemasangan Braket Motor DC pada Sasis Utama' },
      { time: '06:15', title: 'Kombinasi Roda Belakang & Roda Bebas Kastor' },
      { time: '10:00', title: 'Uji Keseimbangan Berat & Pemasangan Kompartemen Baterai' }
    ],
    difficulty: 'Pemula'
  },
  {
    id: 'vid-1-mitra',
    title: 'Implementasi Sasis Robotik pada Jalur Konveyor Otomasi (Mitra)',
    duration: '10 Mnt 15 Detik',
    category: 'Otomasi & Konveyor',
    narrator: 'Hendra Wijaya (Aplikasi Insinyur)',
    description: 'Video panduan integrasi sasis robot pintar dengan sistem konveyor industri. Mempelajari penataan sensor infra merah dan mekanik stopper robot khusus Anggota Mitra.',
    chapters: [
      { time: '00:00', title: 'Prinsip Kerja Ban Konveyor & Stopper Pneumatik' },
      { time: '02:15', title: 'Pemasangan Sensor Proximity Pendeteksi Sasis Robot' },
      { time: '05:40', title: 'Menulis Logika Interlock Arduino dengan Relay Konveyor' },
      { time: '08:00', title: 'Uji Coba Sinkronisasi Laju Robot di Atas Trek Konveyor' }
    ],
    difficulty: 'Pemula'
  },
  {
    id: 'vid-2',
    title: 'Logika Pemrograman Algoritma Line Follower Sederhana',
    duration: '15 Mnt 30 Detik',
    category: 'Logika & Koding',
    narrator: 'Siti Rahmawati, M.Cs. (Mentor Vision)',
    description: 'Panduan menulis sintaks if-else di sketch Arduino IDE untuk menggerakkan sasis robot menyusuri lintasan berbentuk oval dan mengatasi persimpangan siku.',
    chapters: [
      { time: '00:00', title: 'Logika Boolean Array Sensor IR' },
      { time: '04:10', title: 'Koding Fungsi Gerak Maju, Belok Kanan & Kiri' },
      { time: '09:40', title: 'Simulasi Pemecahan Masalah Garis Putus-Putus' },
      { time: '13:15', title: 'Uji Coba Lintasan Fisik & Modifikasi Delay Kompensasi' }
    ],
    difficulty: 'Menengah'
  },
  {
    id: 'vid-3',
    title: 'Integrasi IoT: Mengirim Data Sensor Suhu ke MQTT Broker via ESP32',
    duration: '18 Mnt 20 Detik',
    category: 'IoT & Komunikasi',
    narrator: 'Ir. Hermawan Prasetyo, M.T. (Pembina Utama)',
    description: 'Tutorial mendalam tentang protokol internet ringan MQTT. Bagaimana mengkonfigurasi WiFi bawaan ESP32 dan melakukan publish pesan telemetri sensor.',
    chapters: [
      { time: '00:00', title: 'Topologi Jaringan Broker Shading MQTT' },
      { time: '03:50', title: 'Instalasi Driver Board ESP32 di Arduino IDE' },
      { time: '08:20', title: 'Menulis Kredensial WiFi SSID & Alamat Broker IP' },
      { time: '14:10', title: 'Monitoring Telemetri Live Menggunakan Monitor Serial' }
    ],
    difficulty: 'Mahir'
  }
];
export const PEMULA_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Manakah set pin Arduino Uno yang menyokong modulasi lebar pulsa (PWM) secara bawaan (ditandai dengan simbol tilde)?",
    options: [
      "Pin 0, 1, 2, 4, 7, 8",
      "Pin 3, 5, 6, 9, 10, 11",
      "Pin A0, A1, A2, A3, A4, A5",
      "Pin RESET, VCC, GND, AREF"
    ],
    correctAnswer: 1,
    explanation: "Pada Arduino Uno, pin PWM ditandai dengan simbol tilde (~), yaitu pin digital 3, 5, 6, 9, 10, dan 11. Sinyal ini dapat menghasilkan output analog semu menggunakan fungsi analogWrite()."
  },
  {
    id: 2,
    text: "Apa fungsi utama void setup() pada pemrograman sketch Arduino?",
    options: [
      "Menjalankan instruksi secara berulang terus menerus",
      "Melakukan inisialisasi pin dan konfigurasi awal hanya sekali saat start-up",
      "Menghapus seluruh memori flash pada chip mikrokontroler",
      "Mengirim sinyal analog PWM ke driver motor"
    ],
    correctAnswer: 1,
    explanation: "Fungsi void setup() dipanggil satu kali saat papan Arduino pertama kali dinyalakan atau setelah tombol reset ditekan, sangat cocok untuk konfigurasi pinMode atau inisialisasi serial."
  },
  {
    id: 3,
    text: "Berapakah nilai resistor pembatas arus minimal yang disarankan saat menyalakan LED standar dari tegangan 5V Arduino?",
    options: [
      "10 Ohm",
      "220 Ohm",
      "10k Ohm (10.000 Ohm)",
      "1M Ohm (1.000.000 Ohm)"
    ],
    correctAnswer: 1,
    explanation: "Sesuai hukum Ohm, resistor 220 Ohm atau 330 Ohm sangat ideal untuk membatasi arus LED sekitar 15-20mA dari suplai 5V agar LED tidak mengalami kerusakan."
  },
  {
    id: 4,
    text: "Pada papan breadboard standar, bagaimana hubungan jalur lubang bus di bagian pinggir (jalur daya merah & biru)?",
    options: [
      "Saling terhubung secara horizontal/baris",
      "Saling terhubung secara vertikal/kolom memanjang",
      "Tidak terhubung sama sekali",
      "Terhubung silang secara diagonal"
    ],
    correctAnswer: 1,
    explanation: "Jalur bus di bagian pinggir breadboard terhubung secara vertikal memanjang sepanjang papan untuk mendistribusikan jalur daya VCC (+) dan GND (-) ke komponen."
  },
  {
    id: 5,
    text: "Apa urgensi utama memasang resistor Pull-up atau Pull-down eksternal ketika menghubungkan tombol push-button ke input Arduino?",
    options: [
      "Agar tidak terjadi percikan api listrik saat ditekan",
      "Mencegah kondisi melayang (floating state) dari pin akibat derau medan magnetik luar",
      "Menurunkan hambatan total kawat logam kuningan",
      "Membatasi arus agar lampu LED internal tidak cepat putus"
    ],
    correctAnswer: 1,
    explanation: "Tanpa resistor pull-up/pull-down, pin input digital akan melayang (floating state) saat tombol tidak ditekan, menyebabkan pembacaan logika acak akibat gangguan elektrostatik sekitar."
  }
];

export const JUNIOR_QUESTIONS: Question[] = [
  {
    id: 11,
    text: "Komponen driver motor L298N menggunakan konfigurasi internal berupa rangkaian elektronika apa untuk merubah arah putaran motor DC?",
    options: [
      "Voltage Divider (Pembagi Tegangan)",
      "Schmitt Trigger (Pemicu Schmitt)",
      "H-Bridge (Jembatan Sirkuit Transistor ganda)",
      "Operational Amplifier (Op-Amp Integrator)"
    ],
    correctAnswer: 2,
    explanation: "Konfigurasi H-Bridge menggunakan empat sakelar transistor internal yang mengizinkan polaritas arus listrik melewati beban (motor DC) dibalik, sehingga arah putaran dapat bergerak maju atau mundur."
  },
  {
    id: 12,
    text: "Untuk memicu modul sensor ultrasonik HC-SR04 mulai memancarkan gelombang sonik berdaya tinggi, berapa lama pulsa digital HIGH harus disuplai ke pin Trigger?",
    options: [
      "10 mikrosekon (µs)",
      "10 milisekon (ms)",
      "1 detik penuh (s)",
      "250 nanosekon (ns)"
    ],
    correctAnswer: 0,
    explanation: "Sesuai dengan datasheet HC-SR04, modul pengukur jarak ini memerlukan pulsa trigger berkondisi HIGH minimal selama 10 mikroskon (µs) untuk memulai emisi 8 siklus sonik."
  },
  {
    id: 13,
    text: "Jika sensor penjelajah sasis line follower bagian paling KANAN mendeteksi garis hitam (gelap) sedangkan bagian KIRI mendeteksi warna putih, tindakan koreksi kemudi apa yang harus diambil robot?",
    options: [
      "Berputar belok ke Kiri",
      "Berputar belok ke Kanan",
      "Melanjutkan jalur lurus dengan kecepatan konstan maksimal",
      "Mundur ke belakang untuk mencari kalibrasi sensor ulang"
    ],
    correctAnswer: 1,
    explanation: "Agar sasis robot kembali seimbang di atas garis hitam tengah, robot harus melakukan koreksi dengan membelokkan arah kemudi ke Kanan mengikuti sensor yang menyentuh hitam."
  },
  {
    id: 14,
    text: "Berapakah batas ambang tegangan level logika pengoperasian input/output (I/O) yang aman pada pin mikrokontroler ESP32?",
    options: [
      "5.0 V DC",
      "9.0 V DC",
      "3.3 V DC",
      "12.0 V DC"
    ],
    correctAnswer: 2,
    explanation: "Chip ESP32 bekerja pada level logika 3.3V. Menyuplai 5V langsung ke pin digital ESP32 dapat membakar sirkuit internalnya."
  },
  {
    id: 15,
    text: "Sensor inersia IMU (seperti MPU6050) menangkap akselerasi dan koordinat giroskop robot menggunakan bus komunikasi standar industri apa?",
    options: [
      "I2C (Inter-Integrated Circuit)",
      "Analog ADC tunggal",
      "SPI Master-Slave Paralel",
      "Universal Serial Bus (USB 3.0)"
    ],
    correctAnswer: 0,
    explanation: "Sensor MPU6050 memanfaatkan jalur komunikasi dua-kabel I2C (Serial Data SDA dan Serial Clock SCL) demi efisiensi kabel pin."
  }
];

export const SENIOR_QUESTIONS: Question[] = [
  {
    id: 21,
    text: "Dalam struktur kontrol PID sasis robot, komponen konstanta manakah yang aktif mengakumulasi sisa error sepanjang waktu untuk mengeliminasi offset nirkabel sistem?",
    options: [
      "Kp (Proportional)",
      "Kd (Derivative)",
      "Ki (Integral)",
      "Kf (Feed-Forward)"
    ],
    correctAnswer: 2,
    explanation: "Faktor Ki (Integral) berfungsi menjumlahkan atau mengintegrasikan nilai error seiring waktu demi mengoreksi offset statis."
  },
  {
    id: 22,
    text: "Protokol komparatif manakah yang paling pas digunakan untuk mentransfer telemetri robot secara real-time ke web server karena berstruktur sangat ringan serta memakai arsitektur Publish & Subscribe?",
    options: [
      "HyperText Transfer Protocol (HTTP)",
      "File Transfer Protocol (FTP)",
      "Message Queuing Telemetry Transport (MQTT)",
      "Simple Mail Transfer Protocol (SMTP)"
    ],
    correctAnswer: 2,
    explanation: "MQTT adalah protokol pesan ultra-ringan yang berbasis Publish/Subscribe, dirancang ideal untuk konektivitas nirkabel modul mikro IoT dengan bandwidth internet terbatas."
  },
  {
    id: 23,
    text: "Pustaka pemrograman open-source manakah yang paling dominan digunakan dalam robotika pintar AI untuk mendeteksi kontur jalur ataupun objek warna memanfaatkan masukan kamera secara real-time?",
    options: [
      "Bootstrap UI Library",
      "OpenCV (Open Source Computer Vision)",
      "ExpressJS Backend Framework",
      "Drizzle ORM Engine"
    ],
    correctAnswer: 1,
    explanation: "OpenCV (Open Source Computer Vision) merupakan pustaka serbaguna berkinerja tinggi untuk pemrosesan citra digital, computer vision, serta kecerdasan buatan pengenalan objek visual."
  },
  {
    id: 24,
    text: "Apakah kegunaan utama dari Robot Operating System (ROS) dalam pengembangan robotika otonom tingkat lanjut?",
    options: [
      "Sistem operasi khusus untuk menginstal Microsoft Windows di mikrokontroler",
      "Framework middleware yang menyediakan abstraksi hardware, komunikasi pesan antar-proses (nodes), dan pustaka navigasi",
      "Aplikasi emulator sirkuit 3D gratis untuk menggambar skema PCB",
      "Software untuk melakukan kompilasi koding C++ menjadi biner hex Arduino"
    ],
    correctAnswer: 1,
    explanation: "ROS adalah kumpulan software framework, pustaka, dan tool kolaboratif yang menyederhanakan pembuatan perilaku robot kompleks melalui perpesanan (publisher/subscriber) antar-node."
  },
  {
    id: 25,
    text: "Mengapa algoritma Sensor Fusion (seperti Filter Complementary atau Filter Kalman) sangat penting saat mengolah pembacaan IMU (MPU6050)?",
    options: [
      "Untuk meningkatkan tegangan baterai sasis robot secara otomatis",
      "Menggabungkan data akselerometer (sensitif noise jangka pendek) dan giroskop (mengalami drift jangka panjang) demi estimasi sudut orientasi yang presisi",
      "Mengurangi konsumsi memori flash Arduino Uno hingga 90%",
      "Mengubah komunikasi I2C menjadi komunikasi Bluetooth nirkabel"
    ],
    correctAnswer: 1,
    explanation: "Akselerometer memiliki derau tinggi jangka pendek akibat getaran mekanik motor, sedangkan giroskop mengalami penyimpangan (drift) jangka panjang. Sensor fusion menggabungkan keduanya untuk mendapatkan sudut orientasi yang akurat."
  }
];

export const MITRA_PEMULA_QUESTIONS: Question[] = [
  {
    id: 101,
    text: "Manakah jenis sensor proximity yang paling tepat digunakan untuk mendeteksi benda logam pada ban konveyor industri?",
    options: [
      "Sensor Proximity Induktif",
      "Sensor Proximity Kapasitif",
      "Sensor Ultrasonik HC-SR04",
      "Sensor Inframerah Biner"
    ],
    correctAnswer: 0,
    explanation: "Sensor proximity induktif bekerja berdasarkan induksi elektromagnetik dan sangat sensitif untuk mendeteksi objek logam, sehingga sangat ideal untuk industri perakitan sasis logam."
  },
  {
    id: 102,
    text: "Apa fungsi utama dari komponen Relay di sirkuit otomasi industri?",
    options: [
      "Meningkatkan tegangan baterai DC secara instan",
      "Berfungsi sebagai sakelar elektromagnetik untuk mengendalikan arus/tegangan besar dengan daya kecil",
      "Menerjemahkan bahasa pemrograman C++ ke assembly",
      "Menyimpan program sketch Arduino secara permanen"
    ],
    correctAnswer: 1,
    explanation: "Relay memungkinkan mikrokontroler bertegangan rendah (seperti Arduino) untuk menyalakan atau mematikan beban besar bertegangan tinggi (seperti motor AC konveyor) secara aman."
  },
  {
    id: 103,
    text: "Protokol komunikasi serial industri manakah yang sangat populer untuk menghubungkan sensor dan PLC pada pabrik mitra?",
    options: [
      "HTTP/REST API",
      "Modbus RTU/TCP",
      "Bluetooth BLE",
      "Wi-Fi Direct"
    ],
    correctAnswer: 1,
    explanation: "Modbus (RTU atau TCP) merupakan protokol standar industri yang sangat andal untuk komunikasi data antar-perangkat industri seperti PLC dan sensor cerdas."
  },
  {
    id: 104,
    text: "Apa kegunaan dari Limit Switch yang dipasang di ujung lintasan gerak sasis robot?",
    options: [
      "Membatasi jumlah program yang diunggah",
      "Sebagai sakelar pembatas fisik untuk menghentikan motor saat menyentuh ujung lintasan",
      "Mengukur jarak benda menggunakan gelombang suara",
      "Mengatur warna pencahayaan LED indikator"
    ],
    correctAnswer: 1,
    explanation: "Limit switch bertindak sebagai kontak mekanik yang mendeteksi batas fisik pergerakan mesin/sasis untuk mencegah benturan berlebih."
  },
  {
    id: 105,
    text: "Di ruang industri, apa keuntungan utama menggunakan sensor proximity tipe Kapasitif dibanding Induktif?",
    options: [
      "Hanya bisa mendeteksi logam besi saja",
      "Dapat mendeteksi objek logam maupun non-logam seperti plastik, air, dan kayu",
      "Tidak membutuhkan suplai daya listrik sama sekali",
      "Ukurannya selalu lebih kecil dan lebih murah"
    ],
    correctAnswer: 1,
    explanation: "Sensor proximity kapasitif mendeteksi perubahan nilai kapasitansi, sehingga dapat mendeteksi berbagai jenis material baik logam maupun non-logam."
  }
];

export const CBT_QUESTIONS: Question[] = [...PEMULA_QUESTIONS, ...MITRA_PEMULA_QUESTIONS, ...JUNIOR_QUESTIONS, ...SENIOR_QUESTIONS];

export interface Exam {
  id: string;
  title: string;
  duration: number; // in minutes
  passingGrade: number; // e.g., 70
  isActive: boolean;
  questions: Question[];
  difficulty?: 'Pemula' | 'Menengah' | 'Mahir';
}

export const DEFAULT_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    title: 'CBT Evaluasi Kelayakan Robotika Dasar (Anggota)',
    duration: 10,
    passingGrade: 70,
    isActive: true,
    questions: PEMULA_QUESTIONS,
    difficulty: 'Pemula'
  },
  {
    id: 'exam-1-mitra',
    title: 'CBT Sertifikasi Otomasi & Logika Industri Dasar (Mitra)',
    duration: 10,
    passingGrade: 70,
    isActive: true,
    questions: MITRA_PEMULA_QUESTIONS,
    difficulty: 'Pemula'
  },
  {
    id: 'exam-2',
    title: 'CBT Sertifikasi Elektronika & Mikrokontroler',
    duration: 15,
    passingGrade: 75,
    isActive: true,
    questions: JUNIOR_QUESTIONS,
    difficulty: 'Menengah'
  },
  {
    id: 'exam-3',
    title: 'CBT Sertifikasi AI & Sistem Robotika Lanjut',
    duration: 20,
    passingGrade: 80,
    isActive: true,
    questions: SENIOR_QUESTIONS,
    difficulty: 'Mahir'
  }
];

interface LearningHubProps {
  userData?: {
    username?: string;
    name?: string;
    role?: string;
    memberType?: 'Pemula' | 'Junior' | 'Senior';
  } | null;
}

export default function LearningHub({ userData }: LearningHubProps = {}) {
  const [activeSubTab, setActiveSubTab] = useState<'modules' | 'media' | 'cbt'>('modules');
  
  // Custom Editable Learning Data State
  const [modules, setModules] = useState<Module[]>(() => {
    try {
      const saved = localStorage.getItem('robo_learning_modules');
      return saved ? JSON.parse(saved) : MODULES_DATA;
    } catch {
      return MODULES_DATA;
    }
  });

  const [videos, setVideos] = useState<LearningVideo[]>(() => {
    try {
      const saved = localStorage.getItem('robo_learning_videos');
      return saved ? JSON.parse(saved) : VIDEOS_DATA;
    } catch {
      return VIDEOS_DATA;
    }
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('robo_learning_questions');
      return saved ? JSON.parse(saved) : CBT_QUESTIONS;
    } catch {
      return CBT_QUESTIONS;
    }
  });

  // CBT Settings State
  const [cbtSettings, setCbtSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('robo_cbt_settings');
      return saved ? JSON.parse(saved) : { duration: 10, passingGrade: 70, examActive: true };
    } catch {
      return { duration: 10, passingGrade: 70, examActive: true };
    }
  });

  // Exams list state
  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem('robo_cbt_exams');
      return saved ? JSON.parse(saved) : DEFAULT_EXAMS;
    } catch {
      return DEFAULT_EXAMS;
    }
  });

  const [selectedExam, setSelectedExam] = useState<Exam>(() => {
    try {
      const saved = localStorage.getItem('robo_cbt_exams');
      const list = saved ? JSON.parse(saved) : DEFAULT_EXAMS;
      const activeOnes = list.filter((e: Exam) => e.isActive !== false);
      
      const defaultRole = userData?.role === 'Anggota Mitra' ? 'Anggota Mitra' : 'Anggota';
      const isMitraDefault = defaultRole === 'Anggota Mitra';
      const filteredByRole = activeOnes.filter((e: Exam) => {
        if (e.difficulty !== 'Pemula') return true;
        return isMitraDefault ? e.id.endsWith('-mitra') : !e.id.endsWith('-mitra');
      });

      return filteredByRole[0] || activeOnes[0] || list[0] || DEFAULT_EXAMS[0];
    } catch {
      return DEFAULT_EXAMS[0];
    }
  });

  const [filterByLevel, setFilterByLevel] = useState(true);

  const userTier = userData?.memberType || 'Pemula';

  const [pemulaTrack, setPemulaTrack] = useState<'Anggota' | 'Anggota Mitra'>(() => {
    return userData?.role === 'Anggota Mitra' ? 'Anggota Mitra' : 'Anggota';
  });

  const isRoleCompatible = (item: { id: string; difficulty?: 'Pemula' | 'Menengah' | 'Mahir' }) => {
    if (item.difficulty !== 'Pemula') return true;
    const isMitraItem = item.id.endsWith('-mitra');
    if (pemulaTrack === 'Anggota Mitra') {
      return isMitraItem;
    } else {
      return !isMitraItem;
    }
  };

  const isLevelCompatible = (itemDifficulty: 'Pemula' | 'Menengah' | 'Mahir' | undefined) => {
    if (!itemDifficulty) return true;
    if (userTier === 'Pemula') {
      return itemDifficulty === 'Pemula';
    } else if (userTier === 'Junior') {
      return itemDifficulty === 'Menengah';
    } else if (userTier === 'Senior') {
      return itemDifficulty === 'Mahir';
    }
    return true;
  };

  useEffect(() => {
    const compatibleExams = exams
      .filter(e => e.isActive !== false)
      .filter(e => !filterByLevel || isLevelCompatible(e.difficulty))
      .filter(e => isRoleCompatible(e));
    
    if (compatibleExams.length > 0 && !compatibleExams.some(e => e.id === selectedExam.id)) {
      setSelectedExam(compatibleExams[0]);
    }
  }, [filterByLevel, userData, exams, pemulaTrack]);

  // Sync state with localstorage updates (admin changes)
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const savedModules = localStorage.getItem('robo_learning_modules');
        if (savedModules) setModules(JSON.parse(savedModules));
        
        const savedVideos = localStorage.getItem('robo_learning_videos');
        if (savedVideos) {
          const parsed = JSON.parse(savedVideos);
          setVideos(parsed);
        }
        
        const savedQuestions = localStorage.getItem('robo_learning_questions');
        if (savedQuestions) setQuestions(JSON.parse(savedQuestions));

        const savedCbt = localStorage.getItem('robo_cbt_settings');
        if (savedCbt) setCbtSettings(JSON.parse(savedCbt));

        const savedExams = localStorage.getItem('robo_cbt_exams');
        if (savedExams) {
          const parsed = JSON.parse(savedExams);
          setExams(parsed);
          setSelectedExam(prev => {
            const found = parsed.find((e: Exam) => e.id === prev.id);
            return found || parsed[0] || DEFAULT_EXAMS[0];
          });
        }

        const savedHistory = localStorage.getItem('robo_cbt_history');
        setTestLog(savedHistory ? JSON.parse(savedHistory) : []);
      } catch (e) {
        console.error("Failed to load custom learning data in hub:", e);
      }
    };
    
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('robo_learning_updated', handleUpdate);
    window.addEventListener('robo_cbt_settings_updated', handleUpdate);
    window.addEventListener('robo_cbt_exams_updated', handleUpdate);
    window.addEventListener('robo_cbt_history_reset', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('robo_learning_updated', handleUpdate);
      window.removeEventListener('robo_cbt_settings_updated', handleUpdate);
      window.removeEventListener('robo_cbt_exams_updated', handleUpdate);
      window.removeEventListener('robo_cbt_history_reset', handleUpdate);
    };
  }, []);

  // Modules state
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [moduleSearch, setModuleSearch] = useState('');
  const [readingPage, setReadingPage] = useState(0); // Index of pdfSimContent

  // Media state
  const [selectedVideo, setSelectedVideo] = useState<LearningVideo>(() => {
    try {
      const saved = localStorage.getItem('robo_learning_videos');
      const list = saved ? JSON.parse(saved) : VIDEOS_DATA;
      return list[0] || VIDEOS_DATA[0];
    } catch {
      return VIDEOS_DATA[0];
    }
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0); // 0 to 100
  const [videoNotes, setVideoNotes] = useState<string>('');
  const [savedNotes, setSavedNotes] = useState<{ [key: string]: string }>(() => {
    try {
      const saved = localStorage.getItem('robo_video_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // CBT Test State
  const [testState, setTestState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [flags, setFlags] = useState<{ [key: number]: boolean }>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [quizScore, setQuizScore] = useState(0);
  const [testLog, setTestLog] = useState<{ timestamp: string; score: number; passed: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem('robo_cbt_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Custom confirmation modal state for premium UI
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    type?: 'danger' | 'info' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Konfirmasi',
    type: 'danger'
  });

  const confirmAction = (params: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    type?: 'danger' | 'info' | 'success';
  }) => {
    setConfirmModal({
      isOpen: true,
      title: params.title,
      message: params.message,
      onConfirm: () => {
        params.onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      confirmText: params.confirmText || 'Ya, Lanjutkan',
      type: params.type || 'danger'
    });
  };

  // Timer Effect for CBT
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testState === 'running' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testState, timeLeft]);

  // Load / Save video notes
  useEffect(() => {
    if (selectedVideo) {
      setVideoNotes(savedNotes[selectedVideo.id] || '');
    }
  }, [selectedVideo]);

  const handleSaveNotes = () => {
    const updated = { ...savedNotes, [selectedVideo.id]: videoNotes };
    setSavedNotes(updated);
    localStorage.setItem('robo_video_notes', JSON.stringify(updated));
  };

  // Video progress simulator loop
  useEffect(() => {
    let playInterval: NodeJS.Timeout;
    if (isPlaying) {
      playInterval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
      }, 500);
    }
    return () => clearInterval(playInterval);
  }, [isPlaying]);

  const handleStartTest = () => {
    setAnswers({});
    setFlags({});
    setCurrentQuestionIndex(0);
    setTimeLeft((selectedExam.duration || 10) * 60); // 10 mins dynamic
    setTestState('running');
  };

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const toggleFlagQuestion = (idx: number) => {
    setFlags((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSubmitTest = () => {
    let correctCount = 0;
    const currentQuestions = selectedExam.questions || [];
    currentQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const score = currentQuestions.length > 0 ? Math.round((correctCount / currentQuestions.length) * 100) : 0;
    setQuizScore(score);
    setTestState('completed');

    const isPassed = score >= (selectedExam.passingGrade || 70);
    const newRecord = {
      examId: selectedExam.id,
      examTitle: selectedExam.title,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      score,
      passed: isPassed
    };

    const updatedLog = [newRecord, ...testLog];
    setTestLog(updatedLog);
    localStorage.setItem('robo_cbt_history', JSON.stringify(updatedLog));
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredModules = modules
    .filter(m => m.isActive !== false)
    .filter(m => !filterByLevel || isLevelCompatible(m.difficulty))
    .filter(m => isRoleCompatible(m))
    .filter(m => 
      m.title.toLowerCase().includes(moduleSearch.toLowerCase()) || 
      m.description.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      m.category.toLowerCase().includes(moduleSearch.toLowerCase())
    );

  const activeVideos = videos
    .filter(v => v.isActive !== false)
    .filter(v => !filterByLevel || isLevelCompatible(v.difficulty))
    .filter(v => isRoleCompatible(v));

  return (
    <div id="learning-hub" className="space-y-6">
      
      {/* Primary header widget */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-blue/30 via-brand-cyan/10 to-transparent border border-brand-cyan/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="p-1 px-2.5 bg-brand-cyan/25 border border-brand-cyan/30 text-brand-cyan font-mono text-[9px] font-bold rounded-full uppercase">
            Sistem Pembelajaran Elektronik
          </span>
          <h2 className="text-lg font-display font-extrabold text-white">Akademi Pembelajaran Sasis ROBO-CORE</h2>
          <p className="text-xs text-slate-300 font-light max-w-2xl">
            Modul kurikulum bimbingan, video simulator demonstrasi, dan Computer Based Test (CBT) standar sertifikasi e-learning ekstrakurikuler robotika secara live.
          </p>
        </div>
        
        {/* Navigation buttons inside Hub */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-white/5 space-x-1 shrink-0 self-start md:self-center">
          <button
            onClick={() => { setActiveSubTab('modules'); setSelectedModule(null); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${activeSubTab === 'modules' ? 'bg-brand-cyan text-slate-950 shadow-md shadow-brand-cyan/25' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Modul</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('media')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${activeSubTab === 'media' ? 'bg-brand-cyan text-slate-950 shadow-md shadow-brand-cyan/25' : 'text-slate-400 hover:text-white'}`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Media Video</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('cbt')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${activeSubTab === 'cbt' ? 'bg-brand-cyan text-slate-950 shadow-md shadow-brand-cyan/25' : 'text-slate-400 hover:text-white'}`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Ujian CBT</span>
          </button>
        </div>
      </div>

      {/* Personalized Tier Customization Panel */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg flex items-center justify-center ${
              userTier === 'Senior' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
              userTier === 'Junior' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
              'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              <Award className="w-5 h-5 animate-pulse text-brand-cyan" />
            </div>
            <div className="space-y-0.5 text-left">
              <span className="text-[9px] font-mono text-slate-400 uppercase block leading-none">Rekomendasi Konten Pembelajaran</span>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-white">Akun Anda: <span className="text-brand-cyan">{userData?.name || 'Siswa Tamu'}</span></p>
                <span className="text-slate-600">•</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                  userTier === 'Senior' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                  userTier === 'Junior' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {userTier}
                </span>
              </div>
            </div>
          </div>

          {/* Differentiator Toggle for Pemula (Anggota vs Anggota Mitra) */}
          {(userTier === 'Pemula' || !filterByLevel) && (
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-white/5 space-x-1">
              <button
                onClick={() => setPemulaTrack('Anggota')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${pemulaTrack === 'Anggota' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
              >
                Jalur Anggota
              </button>
              <button
                onClick={() => setPemulaTrack('Anggota Mitra')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${pemulaTrack === 'Anggota Mitra' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'text-slate-400 hover:text-white'}`}
              >
                Jalur Anggota Mitra
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 bg-slate-950 p-2 px-4 rounded-xl border border-white/5 w-full md:w-auto justify-between sm:justify-start shrink-0">
          <div className="flex items-center gap-2">
            <input
              id="filter-by-level-toggle-hub"
              type="checkbox"
              checked={filterByLevel}
              onChange={(e) => setFilterByLevel(e.target.checked)}
              className="w-3.5 h-3.5 accent-brand-cyan rounded border-white/10 bg-slate-950 text-brand-cyan focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <label 
              htmlFor="filter-by-level-toggle-hub" 
              className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider cursor-pointer whitespace-nowrap"
            >
              Saring Sesuai Tingkatan Saya
            </label>
          </div>
          <span className="text-[10px] text-slate-500 font-sans hidden xl:inline">
            {filterByLevel ? '(Hanya tingkat ' + (userTier === 'Pemula' ? 'Pemula' : userTier === 'Junior' ? 'Menengah' : 'Mahir') + ')' : '(Seluruh materi)'}
          </span>
        </div>
      </div>

      {/* --- CONTENT FRAMER --- */}
      <AnimatePresence mode="wait">
        
        {/* SECTION 1: LEARNING MODULES */}
        {activeSubTab === 'modules' && (
          <motion.div
            key="pembelajaran-modul"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {selectedModule ? (
              // Immersive E-Reader simulation interface
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Chapter Navigation Outline */}
                <div className="lg:col-span-4 bg-slate-950 border border-white/5 rounded-2xl p-5 space-y-4">
                  <button 
                    onClick={() => setSelectedModule(null)}
                    className="text-[10px] font-mono text-brand-cyan hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
                  >
                    ← Kembali ke Daftar Modul
                  </button>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">{selectedModule.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="p-0.5 px-2 bg-brand-cyan/15 rounded text-[9px] font-mono text-brand-cyan font-bold">
                        {selectedModule.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {selectedModule.pages} Halaman
                      </span>
                    </div>
                  </div>

                  <hr className="border-white/5" />

                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Silabus Pembahasan</p>
                    <div className="space-y-1.5">
                      {selectedModule.chapters.map((ch, idx) => (
                        <button
                          key={idx}
                          onClick={() => setReadingPage(idx)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer border ${readingPage === idx ? 'bg-brand-cyan/15 border-brand-cyan/30 text-brand-cyan font-bold' : 'bg-transparent border-white/5 text-slate-400 hover:text-white'}`}
                        >
                          <span className="truncate pr-2">{ch}</span>
                          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-brand-blue/5 rounded-xl border border-brand-blue/15 flex items-center gap-2.5">
                    <BookMarked className="w-4 h-4 text-brand-blue" />
                    <div className="text-[10px] text-slate-400 leading-tight">
                      Pembina: <span className="text-white font-medium">Ayik Romlah</span><br />
                      Materi bersertifikat kurikulum nasional.
                    </div>
                  </div>
                </div>

                {/* Right Side: Immersive Document Reading glass panel */}
                <div className="lg:col-span-8 bg-gradient-to-b from-slate-900/40 to-transparent border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full filter blur-xl pointer-events-none" />
                  
                  {/* Status Bar */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 text-[10px] font-mono text-slate-400">
                    <span>E-READER MODE ONLINE</span>
                    <span className="p-0.5 px-2 bg-slate-950 rounded text-slate-300">
                      Bagian {readingPage + 1} dari {selectedModule.pdfSimContent.length}
                    </span>
                  </div>

                  {/* Simulated PDF Page Document visual */}
                  <div className="bg-slate-950/80 p-6 md:p-8 rounded-2xl border border-white/5 space-y-4 shadow-2xl relative min-h-[280px] flex flex-col justify-between">
                    <div className="space-y-4">
                      <h4 className="text-sm font-mono font-bold text-brand-cyan uppercase tracking-wider">
                        {selectedModule.pdfSimContent[readingPage].chapter}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-light text-justify font-sans whitespace-pre-line decoration-white/5">
                        {selectedModule.pdfSimContent[readingPage].body}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 text-[9px] font-mono text-slate-500 text-center flex items-center justify-between">
                      <span>Hak Cipta © Kelompok Robotika Pintar SMK</span>
                      <span>Materi Cetak digital_enclave_key_v1</span>
                    </div>
                  </div>

                  {/* Reading Pagination controls */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setReadingPage(prev => Math.max(0, prev - 1))}
                      disabled={readingPage === 0}
                      className={`px-4 py-2 text-xs font-mono rounded-xl border border-white/10 transition-all ${readingPage === 0 ? 'text-slate-600 bg-transparent cursor-not-allowed border-white/5' : 'text-slate-300 bg-slate-950 hover:text-white cursor-pointer'}`}
                    >
                      ← Bab Belakang
                    </button>

                    <div className="flex items-center gap-1.5">
                      {selectedModule.pdfSimContent.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`w-1.5 h-1.5 rounded-full transition-all ${readingPage === idx ? 'bg-brand-cyan w-4' : 'bg-slate-700'}`}
                        />
                      ))}
                    </div>

                    {readingPage === selectedModule.pdfSimContent.length - 1 ? (
                      <button
                        onClick={() => {
                          setSelectedModule(null);
                        }}
                        className="px-4 py-2 text-xs font-mono font-bold rounded-xl bg-brand-cyan text-slate-950 cursor-pointer hover:bg-brand-sky shadow-lg shadow-brand-cyan/25"
                      >
                        Selesai Membaca ✓
                      </button>
                    ) : (
                      <button
                        onClick={() => setReadingPage(prev => Math.min(selectedModule.pdfSimContent.length - 1, prev + 1))}
                        className="px-4 py-2 text-xs font-mono text-slate-300 bg-slate-950 hover:text-white rounded-xl border border-white/10 cursor-pointer"
                      >
                        Berikutnya →
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              // Modules Grid Catalog
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={moduleSearch}
                      onChange={(e) => setModuleSearch(e.target.value)}
                      placeholder="Cari kata kunci modul (e.g. Arduino, L298N)..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand-cyan font-sans"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-slate-400">
                    Menampilkan <span className="text-brand-cyan font-bold">{filteredModules.length}</span> modul aktif terverifikasi.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredModules.map((mod) => (
                    <div 
                      key={mod.id}
                      className="bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-brand-cyan/35 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:scale-[1.01] shadow-xl group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="p-0.5 px-2 bg-brand-purple/15 text-brand-purple rounded border border-brand-purple/20 text-[8px] font-mono font-bold">
                            {mod.category}
                          </span>
                          <span className={`p-0.5 px-2 rounded text-[8px] font-mono font-bold ${mod.difficulty === 'Pemula' ? 'bg-green-500/10 text-green-400' : mod.difficulty === 'Menengah' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-500'}`}>
                            {mod.difficulty}
                          </span>
                        </div>

                        <h3 className="text-xs font-display font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-1">
                          {mod.title}
                        </h3>

                        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                          {mod.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-white/5 font-mono text-[9px] text-slate-500">
                        <div className="flex items-center justify-between text-[10px]">
                          <span>Berkas Buku: <strong className="text-slate-300 font-normal">{mod.size}</strong></span>
                          <span>{mod.pages} Halaman</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 pt-1.5">
                          <button
                            onClick={() => {
                              setSelectedModule(mod);
                              setReadingPage(0);
                            }}
                            className="py-1 px-2 text-center bg-brand-cyan/15 text-brand-cyan hover:bg-brand-cyan hover:text-slate-950 text-[10px] font-bold rounded-lg transition-all cursor-pointer border border-brand-cyan/25 flex items-center justify-center gap-1.5"
                          >
                            <BookOpen className="w-3 h-3" /> Baca Sekarang
                          </button>
                          
                          <a
                            href={`https://example.com/download/${mod.id}.pdf`}
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Simulasi Download Berkas PDF: "${mod.title}" berkuran ${mod.size} telah masuk ke dalam unduhan Anda!`);
                            }}
                            className="py-1 px-2 text-center bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-[10px] rounded-lg transition-all cursor-pointer border border-white/5 flex items-center justify-center gap-1.5"
                          >
                            <Download className="w-3 h-3" /> Ambil PDF
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredModules.length === 0 && (
                    <div className="col-span-full p-12 text-center bg-slate-950 border border-white/5 rounded-2xl space-y-2">
                      <p className="text-xs text-slate-400 font-mono">Modul pencarian tidak ditemukan di pangkalan data.</p>
                      <button 
                        onClick={() => setModuleSearch('')} 
                        className="text-xs text-brand-cyan font-bold hover:underline bg-transparent border-0 cursor-pointer"
                      >
                        Reset Pencarian
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* SECTION 2: VIDEO MEDIA LEARNING RESOURCES */}
        {activeSubTab === 'media' && (
          <motion.div
            key="pembelajaran-video"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            
            {/* Left: Interactive Simulated Video Player Interface */}
            <div className="lg:col-span-8 bg-slate-950 border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
              
              {/* Virtual Video Screen Frame */}
              <div className="w-full bg-[#03060c] aspect-video relative group border-b border-white/5">
                
                {/* Custom simulated video output rendering */}
                <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden p-6 text-center">
                  {selectedVideo?.localVideoUrl ? (
                    <video 
                      src={selectedVideo.localVideoUrl}
                      controls
                      className="w-full h-full object-contain bg-black rounded-lg z-10"
                    />
                  ) : (
                    <>
                      {/* Grid Lines Overlay representing cyber camera feedback */}
                      <div className="absolute inset-0 border border-brand-cyan/5 pointer-events-none bg-[linear-gradient(to_right,rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
                  
                  {/* Virtual Graphic Content based on active video */}
                  {isPlaying ? (
                    <motion.div 
                      key="live-playing-graphic"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="space-y-4 text-brand-cyan relative z-10"
                    >
                      <div className="flex items-center justify-center gap-2 text-xs font-mono bg-brand-cyan/10 p-2 rounded-xl text-brand-cyan tracking-wider max-w-xs mx-auto animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span>VIDEO DIAL: MEMUTAR... {Math.floor(videoProgress)}%</span>
                      </div>
                      
                      <div className="w-32 h-32 rounded-full border-4 border-brand-cyan/20 border-t-brand-cyan flex items-center justify-center animate-spin relative mx-auto">
                        <Video className="w-10 h-10 animate-bounce text-brand-cyan" />
                      </div>
                      
                      <p className="text-[10px] text-slate-400 font-mono tracking-wide">
                        Modul Simulasi Aktif: <strong className="text-white">{selectedVideo.title}</strong>
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4 text-center z-10">
                      <button
                        onClick={() => {
                          if (videoProgress >= 100) setVideoProgress(0);
                          setIsPlaying(true);
                        }}
                        className="w-16 h-16 rounded-full bg-brand-cyan hover:bg-brand-sky text-slate-950 flex items-center justify-center shadow-lg hover:shadow-brand-cyan/35 cursor-pointer transform active:scale-95 transition-all text-center mx-auto"
                      >
                        <Play className="w-7 h-7 fill-slate-950 pl-1" />
                      </button>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-white font-bold">{selectedVideo.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Klik Tombol Di Atas Untuk Mempersiapkan Pemutar</p>
                      </div>
                    </div>
                  )}
                    </>
                  )}
                </div>

                {/* Timeline overlay bar along bottom */}
                <div className="absolute bottom-12 inset-x-4 h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#06b6d4] transition-all duration-300" 
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>

                {/* Subtitle / Transcript dynamic strip */}
                <div className="absolute bottom-3 inset-x-4 bg-black/70 p-1.5 px-3 rounded-lg border border-white/5 text-center text-[10px] font-mono text-slate-300 pointer-events-none">
                  {videoProgress >= 100 ? (
                    <span className="text-green-400 font-bold">✓ Pembelajaran Selesai. Lanjutkan mengambil Catatan.</span>
                  ) : isPlaying ? (
                    <span>Narrator [{selectedVideo.narrator}]: "Selamat belajar rekan-rekan. Perhatikan detail langkah-langkah robotik ini..."</span>
                  ) : (
                    <span>[ Pemutar Berhenti Sementara ]</span>
                  )}
                </div>
              </div>

              {/* Dynamic playlist / controls bar */}
              <div className="p-4 bg-slate-950 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 bg-brand-cyan rounded-xl text-slate-950 hover:bg-brand-sky font-bold cursor-pointer flex-shrink-0 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
                  </button>

                  <button
                    onClick={() => setVideoProgress(0)}
                    className="p-2 bg-slate-900 border border-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer flex-shrink-0 transition-all text-center"
                    title="Ulang dari Awal"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{selectedVideo.title}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Pengisi Suara: {selectedVideo.narrator}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 shrink-0 select-none bg-slate-900/60 p-2 rounded-xl border border-white/5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedVideo.duration}</span>
                  <span className="text-slate-700">|</span>
                  <span className="p-0.5 px-1.5 bg-slate-950 rounded text-brand-cyan font-bold">
                    {selectedVideo.category}
                  </span>
                </div>
              </div>

              {/* Video Bio details and description fold */}
              <div className="p-5 border-t border-white/5 space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">Informasi Bab Rekaman</p>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">{selectedVideo.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[10px]">
                  {selectedVideo.chapters.map((chap, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const targetTime = (idx / selectedVideo.chapters.length) * 100;
                        setVideoProgress(targetTime);
                        setIsPlaying(true);
                      }}
                      className="p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-white/5 hover:border-brand-cyan/20 text-left transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="text-slate-400 tracking-wider">[{chap.time}]</span>
                      <span className="text-slate-200 truncate pr-2 text-[10px]">{chap.title}</span>
                      <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Personal Video Lecture Notepad and Quiz trigger */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Scratchpad and notes */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-brand-cyan" />
                    Catatan Pembelajaran Ke-1
                  </h4>
                  <span className="text-[9px] font-mono text-slate-500">Auto-save aktif</span>
                </div>

                <p className="text-[10px] text-slate-400 leading-snug">
                  Tuliskan poin-per-poin penting, formula, pemicu debug, atau instruksi koding yang diterangkan oleh mentor di panel editor berikut ini.
                </p>

                <textarea
                  value={videoNotes}
                  onChange={(e) => setVideoNotes(e.target.value)}
                  placeholder="Ketik ide draf / ringkasan Anda di sini... (e.g. ESP32 I/O level beroperasi 3.3V, dilarang langsung menyuplai driver 5V murni)"
                  rows={6}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white leading-relaxed placeholder-slate-600 focus:outline-none focus:border-brand-cyan"
                />

                <button
                  onClick={handleSaveNotes}
                  className="w-full py-2 bg-brand-cyan hover:bg-brand-sky text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-md transition-all active:scale-95 text-center mt-2 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Catatan Pertemuan</span>
                </button>
              </div>

              {/* Videos Playlist Selection Column */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/5 space-y-3 shadow-xl">
                <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">
                  Daftar Putar Video
                </p>
                <div className="space-y-2">
                  {activeVideos.map((vid) => (
                    <button
                      key={vid.id}
                      onClick={() => {
                        setSelectedVideo(vid);
                        setVideoProgress(0);
                        setIsPlaying(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all border block cursor-pointer ${selectedVideo.id === vid.id ? 'bg-brand-cyan/20 border-brand-cyan/35 text-brand-cyan' : 'bg-transparent border-white/5 text-slate-300 hover:text-white'}`}
                    >
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#a855f7] block mb-1">
                        {vid.category}
                      </span>
                      <p className="text-xs font-sans font-bold leading-normal truncate">{vid.title}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2">
                        <span>Oleh: {vid.narrator.split(' (')[0]}</span>
                        <span>{vid.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* SECTION 3: COMPUTER BASED TEST (CBT) */}
        {activeSubTab === 'cbt' && (() => {
          const currentQuestions = selectedExam.questions || [];
          return (
            <motion.div
              key="pembelajaran-cbt"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {testState === 'idle' ? (
                // CBT Intake Portal / Pre-Test screen
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left: General Rules and Start Exam trigger Card */}
                  <div className="lg:col-span-8 p-6 md:p-8 bg-slate-950 border border-white/5 rounded-3xl flex flex-col justify-between space-y-6">
                    {cbtSettings.examActive === false ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                          <Lock className="w-8 h-8" />
                        </div>
                        <div className="space-y-1.5 max-w-md">
                          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Ujian CBT Ditutup</h3>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans">
                            Sesi ujian CBT untuk saat ini dinonaktifkan oleh Pembina / Administrator. Silakan hubungi Pembimbing untuk mendapatkan info jadwal pengerjaan aktif.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-5">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan rounded-2xl">
                              <Trophy className="w-8 h-8" />
                            </div>
                            <div>
                              <h3 className="text-base font-display font-bold text-white tracking-tight">{selectedExam.title}</h3>
                              <p className="text-xs text-brand-cyan font-mono mt-0.5">Disusun Resmi Oleh: Pembina Ayik Romlah</p>
                            </div>
                          </div>

                          {/* EXAM LIST SELECTION */}
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Daftar Paket Ujian Tersedia ({exams.filter(e => e.isActive !== false).filter(e => !filterByLevel || isLevelCompatible(e.difficulty)).filter(e => isRoleCompatible(e)).length}):</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {exams.filter(e => e.isActive !== false).filter(e => !filterByLevel || isLevelCompatible(e.difficulty)).filter(e => isRoleCompatible(e)).map((exam) => (
                                <button
                                  key={exam.id}
                                  onClick={() => setSelectedExam(exam)}
                                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden ${selectedExam.id === exam.id ? 'bg-gradient-to-br from-brand-cyan/20 to-brand-blue/10 border-brand-cyan/50 text-white shadow-lg shadow-brand-cyan/5' : 'bg-slate-900/40 border-white/5 hover:border-white/10 text-slate-300'}`}
                                >
                                  {selectedExam.id === exam.id && (
                                    <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                                  )}
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <h4 className="text-[11px] font-bold leading-snug line-clamp-1 flex-1">{exam.title}</h4>
                                      {exam.difficulty && (
                                        <span className={`text-[7px] font-mono font-bold px-1 rounded ${
                                          exam.difficulty === 'Mahir' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                                          exam.difficulty === 'Menengah' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        }`}>
                                          {exam.difficulty}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[9px] text-slate-500 font-mono">Paket CBT Resmi</p>
                                  </div>
                                  <div className="flex items-center justify-between text-[9px] font-mono text-brand-cyan pt-1.5 border-t border-white/5">
                                    <span>⏱ {exam.duration} Mnt</span>
                                    <span>📝 {exam.questions ? exam.questions.length : 0} Soal</span>
                                    <span>🎯 KKM {exam.passingGrade}%</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 space-y-2 font-light text-slate-300 text-xs leading-relaxed font-sans">
                            <p className="font-bold text-white font-mono text-[10px] uppercase tracking-wider text-brand-blue mb-1">Tata Tertib Ujian Simulasi:</p>
                            <p>✓ Terdiri dari <strong className="text-white">{currentQuestions.length} Pertanyaan Pilihan Ganda</strong> multi-topik terkait materi Robotika.</p>
                            <p>✓ Batas waktu pengerjaan terhitung mundur selama <strong className="text-white">{selectedExam.duration} Menit ({selectedExam.duration * 60} Detik)</strong>.</p>
                            <p>✓ Batas ambang kelulusan standar kompetensi kejuaraan adalah <strong className="text-white">{selectedExam.passingGrade}%</strong>.</p>
                            <p>✓ Ujian dilakukan secara mandiri & tertutup. Dilarang membuka referensi dari tab luar.</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                            <div className="p-3.5 bg-slate-900/45 border border-white/5 rounded-xl space-y-1">
                              <span className="text-slate-500">Nama Peserta Logged In</span>
                              <p className="text-white font-bold">{userData?.name || 'Siswa Tamu'}</p>
                            </div>
                            <div className="p-3.5 bg-slate-900/45 border border-white/5 rounded-xl space-y-1">
                              <span className="text-slate-500">Masa Berlaku Tes</span>
                              <p className="text-brand-cyan font-bold">Juli 2026 Season 1</p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleStartTest}
                          className="w-full py-3.5 bg-gradient-to-r from-brand-blue to-brand-cyan hover:shadow-cyan-glow text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer hover:scale-[1.005] active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span>Mulai Sistem Ujian CBT Sekarang</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                {/* Right: Historic Test Score Logs Dashboard Card */}
                <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-950 border border-white/5 flex flex-col justify-between space-y-4 shadow-xl">
                  <div className="space-y-3">
                    <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-2">
                      Riwayat Hasil Ujian
                    </p>

                    {testLog.length === 0 ? (
                      <div className="p-8 text-center bg-slate-900/40 border border-white/5 rounded-xl space-y-1">
                        <p className="text-[11px] text-slate-500 font-mono">Belum ada rekaman ujian.</p>
                        <p className="text-[9px] text-slate-600 font-mono">Hasil evaluasi Anda akan terekam aman di sini.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {testLog.map((log, idx) => (
                          <div 
                            key={idx}
                            className="p-3 bg-slate-900/60 border border-white/5 rounded-xl flex items-center justify-between font-mono gap-2"
                          >
                            <div className="space-y-1 flex-1 min-w-0">
                              <span className="text-[8px] text-slate-500 block">{log.timestamp}</span>
                              <p className="text-[10px] text-slate-300 font-sans truncate font-bold leading-tight">{(log as any).examTitle || 'CBT Robotika Dasar'}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[11px] text-white font-bold">Skor: {log.score}%</span>
                                <span className={`text-[8px] p-0.5 px-1.5 rounded font-bold ${log.passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                  {log.passed ? 'LULUS' : 'GAGAL'}
                                </span>
                              </div>
                            </div>
                            
                            {log.passed && (
                              <Award className="w-5 h-5 text-yellow-500 animate-pulse shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-brand-purple/5 font-mono text-[9px] text-slate-400 leading-relaxed border border-brand-purple/15 rounded-xl">
                    Sertifikat Kredensial digital akan diterbitkan otomatis jika Anda berhasil menembus skor di atas <strong className="text-white">70%</strong>. Ambil peluang!
                  </div>
                </div>

              </div>
            ) : testState === 'running' ? (
              // Active Test Interface
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Active Question Panel */}
                <div className="lg:col-span-8 bg-slate-950 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                  
                  {/* Test Top Metadata strip */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="p-0.5 px-2 bg-brand-blue/20 text-brand-blue rounded font-bold">
                        SOAL {currentQuestionIndex + 1} DARI {currentQuestions.length}
                      </span>
                      {currentQuestions[currentQuestionIndex] && flags[currentQuestions[currentQuestionIndex].id] && (
                        <span className="p-0.5 px-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/15 rounded text-[10px] font-bold">
                          ★ DITANDAI UNTUK REVIEW
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-red-400 font-bold bg-red-500/10 p-1.5 px-3 rounded-lg border border-red-500/15">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>{formatTime(timeLeft)}</span>
                    </div>
                  </div>

                  {/* Question Prompt */}
                  {currentQuestions[currentQuestionIndex] && (
                    <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 space-y-2">
                      <p className="text-xs font-sans text-white font-medium leading-relaxed">
                        {currentQuestions[currentQuestionIndex].text}
                      </p>
                    </div>
                  )}

                  {/* Multiple Choice Answers Grid */}
                  {currentQuestions[currentQuestionIndex] && (
                    <div className="grid grid-cols-1 gap-3 font-sans">
                      {currentQuestions[currentQuestionIndex].options.map((option, idx) => {
                        const isSelected = answers[currentQuestions[currentQuestionIndex].id] === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectAnswer(currentQuestions[currentQuestionIndex].id, idx)}
                            className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan font-bold shadow-lg shadow-brand-cyan/10' : 'bg-transparent border-white/5 text-slate-300 hover:text-white hover:bg-white/5'}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center border ${isSelected ? 'bg-brand-cyan text-slate-950 border-brand-cyan' : 'border-slate-700 bg-slate-900 text-slate-400'}`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="text-xs font-light">{option}</span>
                            </div>
                            
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center p-0.5 shrink-0 ${isSelected ? 'border-brand-cyan' : 'border-slate-800 bg-slate-900'}`}>
                              {isSelected && <div className="w-full h-full bg-brand-cyan rounded-full" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Test Navigation Lower Bar */}
                  {currentQuestions[currentQuestionIndex] && (
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 font-mono text-xs">
                      <button
                        onClick={() => toggleFlagQuestion(currentQuestions[currentQuestionIndex].id)}
                        className={`px-4 py-2.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer ${flags[currentQuestions[currentQuestionIndex].id] ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}`}
                      >
                        ★ Ragu-Ragu
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                          disabled={currentQuestionIndex === 0}
                          className={`px-3.5 py-2 rounded-xl transition-all ${currentQuestionIndex === 0 ? 'text-slate-600 bg-transparent border border-white/5 cursor-not-allowed' : 'text-slate-300 bg-slate-900 border border-white/5 hover:text-white cursor-pointer'}`}
                        >
                          Sebelumnya
                        </button>

                        {currentQuestionIndex === currentQuestions.length - 1 ? (
                          <button
                            onClick={() => {
                              confirmAction({
                                title: 'Konfirmasi Pengumpulan Ujian',
                                message: 'Apakah Anda yakin ingin mengakhiri sesi CBT dan mengumpulkan lembar jawaban Anda sekarang?',
                                onConfirm: () => {
                                  handleSubmitTest();
                                },
                                confirmText: 'Ya, Kumpulkan',
                                type: 'success'
                              });
                            }}
                            className="px-5 py-2.5 bg-green-500 hover:bg-green-400 text-slate-950 font-extrabold rounded-xl transition-all cursor-pointer shadow-lg shadow-green-500/20"
                          >
                            Kumpulkan Berkas Ujian ✓
                          </button>
                        ) : (
                          <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(currentQuestions.length - 1, prev + 1))}
                            className="px-5 py-2.5 bg-brand-cyan hover:bg-brand-sky text-slate-950 font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-brand-cyan/25"
                          >
                            Berikutnya
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Right: Question Navigation Matrix Column */}
                <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-950 border border-white/5 space-y-4 shadow-xl">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                      Roster Peta Jawaban
                    </h4>
                    <p className="text-[10px] text-slate-400 font-light mt-1.5 leading-snug">
                      Klik nomor soal di bawah untuk melakukan lompatan navigasi visual secara cerdas.
                    </p>
                  </div>

                  <div className="grid grid-cols-5 gap-2 font-mono">
                    {currentQuestions.map((q, idx) => {
                      const isSelected = currentQuestionIndex === idx;
                      const hasAnswered = answers[q.id] !== undefined;
                      const isFlagged = flags[q.id];

                      let btnStyle = 'bg-slate-900 border-white/5 text-slate-400 hover:text-white';
                      if (isSelected) {
                        btnStyle = 'ring-2 ring-brand-cyan bg-brand-cyan/10 border-brand-cyan text-brand-cyan';
                      } else if (isFlagged) {
                        btnStyle = 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500';
                      } else if (hasAnswered) {
                        btnStyle = 'bg-brand-blue/20 border-brand-blue/30 text-brand-blue';
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`h-9 rounded-lg border-2 text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${btnStyle}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5 text-[9px] font-mono text-slate-400 leading-tight">
                    <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-blue" /> Sudah dijawab</p>
                    <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Ditandai ragu-ragu</p>
                    <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-800" /> Belum dikerjakan</p>
                  </div>

                  <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10 text-[9px] text-red-400 flex items-start gap-2 leading-relaxed font-sans">
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>DILARANG MENYERET FRAME: Meninggalkan area ujian ini akan mencatat aktivitas sirkuit yang dicurigai curang di pangkalan data Pembina.</span>
                  </div>
                </div>

              </div>
            ) : (
              // CBT Completed / Results Page with printed PDF Certificate Simulation
              <div className="space-y-6">
                
                {/* Score Summary Banner Card */}
                <div className="p-6 md:p-8 bg-slate-950 border border-white/5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 rounded-full filter blur-3xl pointer-events-none" />
                  
                  <div className="space-y-3 relative z-10 text-center md:text-left">
                    <span className="p-1 px-2.5 bg-brand-cyan/20 text-brand-cyan font-mono text-[9px] font-bold rounded-full uppercase tracking-wider">
                      Evaluasi Selesai Direkam
                    </span>
                    <h3 className="text-base font-display font-bold text-white">Sesi Ujian Selesai Dikomputasi!</h3>
                    <p className="text-xs text-slate-300 font-light max-w-md">
                      Hasil lembar komparasi Anda telah diunggah ke server database. Nilai evaluasi kelayakan robotika Anda berhasil dideklarasikan.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 relative z-10 bg-slate-900 border border-white/10 p-4 rounded-2xl">
                    <div className="text-center">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Skor Nilai</span>
                      <p className={`text-3xl font-mono font-black ${quizScore >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                        {quizScore}
                      </p>
                    </div>
                    <div className="h-10 w-px bg-slate-800" />
                    <div className="text-center">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Status Kelayakan</span>
                      <p className={`text-xs font-mono font-bold ${quizScore >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                        {quizScore >= 70 ? '✓ BERHASIL/LULUS' : '❌ TIDAK LULUS'}
                      </p>
                    </div>
                  </div>
                </div>

                {quizScore >= 70 && (
                  // CERTIFICATE GENERATOR WIDGET
                  <div className="p-6 bg-[#0c1424] border-2 border-amber-500/20 rounded-3xl space-y-6 relative overflow-hidden shadow-amber-500/5 shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.03)_0%,transparent_70%)] pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-4 gap-4">
                      <div className="flex items-center gap-2.5">
                        <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
                        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Sertifikat Kelayakan Digital Terintegrasi</h4>
                      </div>
                      
                      <button
                        onClick={() => alert('Sertifikat kelayakan robotika Anda sedang dicetak dan file format PDF beresolusi tinggi berhasil disiapkan untuk diunduh otomatis!')}
                        className="py-1 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-[10px] rounded-lg cursor-pointer transition-colors flex items-center gap-1 shadow-md shadow-amber-500/10"
                      >
                        <FileDown className="w-3.5 h-3.5" /> Ambil Sertifikat (PDF)
                      </button>
                    </div>

                    {/* Certificate Visual layout */}
                    <div className="border border-amber-500/30 bg-[#050912] p-6 md:p-8 rounded-2xl relative text-center space-y-4 max-w-xl mx-auto shadow-2xl">
                      {/* Visual border accents */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500/30" />
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500/30" />
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500/30" />
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500/30" />

                      <span className="text-[10px] font-mono tracking-widest text-amber-500/80 uppercase block">SERTIFIKAT KELAYAKAN ROBOTIKA</span>
                      
                      <div className="space-y-1">
                        <p className="text-lg font-display font-black text-white uppercase tracking-tight">AYIK ROMLAH</p>
                        <div className="w-12 h-0.5 bg-amber-500/40 mx-auto" />
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed font-light max-w-sm mx-auto">
                        Dinyatakan BERKOMPETENSI dan LULUS secara mandiri dalam Ujian Evaluasi Rekayasa Sasis ROBO-CORE dengan skor pencapaian bernilai <strong className="text-white">{quizScore}%</strong>.
                      </p>

                      <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4 font-mono text-[9px] text-slate-500 max-w-xs mx-auto">
                        <div>
                          <span>Tanggal Terbit</span>
                          <p className="text-slate-300 font-bold mt-0.5">{new Date().toLocaleDateString('id-ID')}</p>
                        </div>
                        <div>
                          <span>Pembina Utama</span>
                          <p className="text-slate-300 font-bold mt-0.5">Ayik Romlah</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed answers evaluation with explanations */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/5 space-y-4 shadow-xl">
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">
                    Bahasan Koreksi Soal Evaluasi
                  </p>

                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                    {currentQuestions.map((q, idx) => {
                      const userAnsIdx = answers[q.id];
                      const isCorrect = userAnsIdx === q.correctAnswer;
                      return (
                        <div key={q.id} className="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-2.5">
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-xs font-mono text-slate-500 tracking-wider">SOAL #{idx + 1}</span>
                            <span className={`text-[9px] p-0.5 px-2 rounded-md font-bold ${isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              {isCorrect ? '✓ BETUL' : '❌ SALAH'}
                            </span>
                          </div>

                          <p className="text-xs font-sans text-white font-medium leading-relaxed">{q.text}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono leading-relaxed text-slate-400">
                            <p>Jawaban Anda: <strong className={isCorrect ? 'text-green-400' : 'text-red-400'}>{q.options[userAnsIdx] || 'Tidak Menjawab'}</strong></p>
                            <p>Koreksi Kunci: <strong className="text-green-400">{q.options[q.correctAnswer]}</strong></p>
                          </div>

                          <div className="p-3 bg-slate-950/60 rounded-lg text-[10px] text-slate-400 leading-relaxed font-sans font-light flex items-start gap-2 border border-white/5">
                            <AlertCircle className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                            <span><strong>Keterangan Ringkas:</strong> {q.explanation}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={handleStartTest}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 font-mono font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Mulai Uji Ulang Tes Baru
                    </button>
                  </div>
                </div>

              </div>
            )}
          </motion.div>
          );
        })()}

      </AnimatePresence>

      <AnimatePresence>
        {confirmModal.isOpen && (
          <motion.div
            key="confirm-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4"
            onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
          >
            <motion.div
              key="confirm-modal-box"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-md bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-2xl relative overflow-hidden space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative glow border */}
              <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${
                confirmModal.type === 'danger' ? 'from-red-500 via-pink-500 to-red-500' :
                confirmModal.type === 'info' ? 'from-blue-500 via-cyan-500 to-blue-500' :
                'from-green-500 via-emerald-500 to-green-500'
              }`} />

              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${
                  confirmModal.type === 'danger' ? 'bg-red-500/10 text-red-400' :
                  confirmModal.type === 'info' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-green-500/10 text-green-400'
                }`}>
                  {confirmModal.type === 'danger' ? (
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  ) : confirmModal.type === 'info' ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <CheckCircle className="w-6 h-6" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    {confirmModal.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {confirmModal.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className={`px-4 py-2 font-bold font-mono text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer text-white ${
                    confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20' :
                    confirmModal.type === 'info' ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20' :
                    'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-600/20'
                  }`}
                >
                  {confirmModal.confirmText || 'Ya, Lanjutkan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
