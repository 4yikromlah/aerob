/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Program, ActivityImage, NewsItem, ProductItem, InventoryItem, Member, Achievement } from '../types';

export const EXTRACURRICULAR_PROFILE = {
  name: "Ekstrakurikuler Robotika",
  school: "SMK / SMA Unggulan Teknologi",
  foundedYear: 2016,
  philosophy: "Inovasi Tanpa Batas, Solusi untuk Dunia Virtual dan Nyata",
  whatsapp: "628123456789",
  description: "Ekstrakurikuler Robotika merupakan wadah eksplorasi teknologi, mekanika, elektronika, dan pemrograman bagi siswa untuk merancang sistem mekanis cerdas yang solutif. Kami mengintegrasikan kurikulum berbasis industri, eksperimen langsung, dan pengembangan karakter untuk mencetak talenta pembuat (creators) masa depan yang handal di era Industri 4.0 dan AI.",
  history: "Didirikan pada bulan Juni 2016 di bawah naungan Laboratorium Teknik Elektronika dan Komputer, Ekstrakurikuler Robotika awalnya hanya memiliki 10 anggota aktif dengan fokus pada Robot Line Follower analog. Berkat dedikasi pembina dan kerja keras para siswa, dalam waktu 3 tahun divisi kami berkembang menjadi 3 bidang konsentrasi meliputi Mobile Robotics, Internet of Things (IoT), dan Drone. Melalui kerja sama dengan berbagai institusi riset dan universitas ternama, saat ini kami bangga telah mengoleksi lebih dari 25 medali nasional dan internasional, melatih ratusan siswa kreatif, dan terus berinovasi memanfaatkan teknologi Artificial Intelligence (AI) dan Computer Vision.",
  instructors: [
    {
      id: "i1",
      name: "Ir. Hermawan Prasetyo, M.T.",
      role: "Pembina Utama & Kurikulum",
      specialty: "Sistem Terbenam & Elektronika Daya",
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300",
      bio: "Lebih dari 15 tahun berkecimpung di bidang teknik kontrol komputer dan otomasi industri. Rutin mementor tim robotika dalam berbagai ajang kompetisi nasional."
    },
    {
      id: "i2",
      name: "Siti Rahmawati, S.Kom., M.Cs.",
      role: "Instruktur Pemrograman & AI",
      specialty: "Computer Vision & IoT",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      bio: "Lulusan S2 Ilmu Komputer dengan fokus pada Machine Learning. Bertanggung jawab atas materi kecerdasan buatan, visual data, dan sistem automasi awan."
    }
  ]
};

export const STATISTICS_DATA = [
  { label: "Anggota Aktif", value: 150, suffix: "+", desc: "Siswa-siswi berbakat" },
  { label: "Prestasi Juara", value: 25, suffix: "+", desc: "Tingkat regional hingga global" },
  { label: "Tahun Berdiri", value: 10, suffix: " Tahun", desc: "Membina inovator teknologi" },
  { label: "Karya Produk", value: 50, suffix: "+", desc: "Prototipe siap guna" }
];

export const GENERAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ac1",
    title: "Juara 1 National Robotics Olympiad (NRO)",
    year: "2025",
    rank: "Medali Emas",
    level: "Nasional",
    description: "Meraih podium pertama dalam kategori Autonomous Obstacle Avoidance Drone menggunakan computer vision terintegrasi."
  },
  {
    id: "ac2",
    title: "Juara 2 Indonesia Robot Contest (IRC)",
    year: "2024",
    rank: "Medali Perak",
    level: "Nasional",
    description: "Kategori Robot Pemilah Sampah Berbasis Artificial Intelligence menggunakan klasifikasi gambar real-time."
  },
  {
    id: "ac3",
    title: "Best Innovation Award Singapore Tech Challenge",
    year: "2023",
    rank: "Juara Harapan & Inovasi Terbaik",
    level: "Internasional",
    description: "Sistem mitigasi kebakaran hutan dengan menggunakan kawanan Drone dan IoT Sensor Node nirkabel."
  },
  {
    id: "ac4",
    title: "Juara 1 Kontes Robot Sepak Bola Regional",
    year: "2025",
    rank: "Juara Utama",
    level: "Regional",
    description: "Dominasi mutlak robot roda penggerak Omni dengan algoritma penentu posisi koordinat taktis."
  }
];

export const PROGRAMS_DATA: Program[] = [
  {
    id: "prog1",
    title: "Robot Line Follower",
    iconName: "Maximize",
    description: "Pondasi utama mekanika robotika, sensor inframerah pembaca garis jalan, dan algoritma kendali PID presisi.",
    detailedInfo: "Mempelajari dasar sirkuit komparator analog, pengembangan ke sistem mikrokontroler digital, kalibrasi sensor, penggerak motor DC, serta penyetelan koefisien Proportional-Integral-Derivative (PID) agar robot melaju kencang tanpa keluar garis.",
    difficulty: "Pemula",
    duration: "4 Bulan"
  },
  {
    id: "prog2",
    title: "Robot Soccer (Roda)",
    iconName: "Dribbble",
    description: "Perancangan robot sepak bola mobile beroda omni-directional dengan koordinasi nirkabel dan strategi taktis.",
    detailedInfo: "Meliputi desain sasis tri-omni / quad-omni wheel, kalkulasi kinematika pergerakan robot ke segala arah, modulasi nirkabel nRF24L01 atau Wi-Fi untuk koordinasi tim, serta mekanisme kick and dribble bola golf elektrik.",
    difficulty: "Mahir",
    duration: "6 Bulan"
  },
  {
    id: "prog3",
    title: "Internet of Things (IoT)",
    iconName: "Wifi",
    description: "Menghubungkan dunia nyata ke internet menggunakan Microcontroller ESP32, Firebase Cloud, dan Dashboard Blynk.",
    detailedInfo: "Peserta diajarkan mengambil data sensor lingkungan (kelembaban tanah, suhu, gas), mengirimnya ke cloud database, membuat notifikasi pintar pada ponsel pintar, serta mengendalikan aktuator listrik dari jarak jauh melalui web server.",
    difficulty: "Menengah",
    duration: "3 Bulan"
  },
  {
    id: "prog4",
    title: "Arduino Programming",
    iconName: "Cpu",
    description: "Gerbang utama sistem terbenam belajar sirkuit elektronika, logika pemrograman C++, dan interfacing sensor.",
    detailedInfo: "Fokus pada struktur kode pemrograman (looping, conditional, function), manipulasi pin I/O, pembacaan sinyal analog-to-digital, interfacing LCD, keypad, sensor ultrasonik, servo motor, dan troubleshooting skematik sirkuit prototyping breadboard.",
    difficulty: "Pemula",
    duration: "3 Bulan"
  },
  {
    id: "prog5",
    title: "Embedded System Design",
    iconName: "Workflow",
    description: "Perancangan jalur PCB khusus dengan software CAD, perakitan sirkuit mandiri, serta integrasi komponen mandiri.",
    detailedInfo: "Membahas pembuatan layout PCB menggunakan Eagle CAD atau EasyEDA, teknik soldering komponen SMD/DIP, regulasi tegangan DC-DC, isolasi noise sinyal analog-digital, serta optimasi manajemen daya baterai LiPo.",
    difficulty: "Menengah",
    duration: "4 Bulan"
  },
  {
    id: "prog6",
    title: "AI Robotics & Computer Vision",
    iconName: "Eye",
    description: "Memasukkan mata cerdas pada robot menggunakan Raspberry Pi, modul kamera, pengolahan citra OpenCV, dan TensorFlow.",
    detailedInfo: "Mengajarkan konsep pemrosesan citra digital, deteksi warna (color tracking) bola secara real-time, pengenalan rupa wajah (face recognition), deteksi lingkaran, serta operasi klasifikasi objek ringan menggunakan machine learning terbenam.",
    difficulty: "Mahir",
    duration: "6 Bulan"
  },
  {
    id: "prog7",
    title: "Drone Programming",
    iconName: "Navigation",
    description: "Merakit dan memprogram quadcopter otonom, kendali terbang telemetri, dan navigasi GPS waypoint digital.",
    detailedInfo: "Siswa belajar aerodinamika drone, konfigurasi flight controller (APM/Pixhawk), kalibrasi kompas internal-eksternal, serta penulisan misi terbang otonom berbasis lintasan koordinat GPS MAVLink API.",
    difficulty: "Mahir",
    duration: "5 Bulan"
  },
  {
    id: "prog8",
    title: "3D Printing & CAD Design",
    iconName: "Layers",
    description: "Merancang suku cadang sasis mekanis robot 3D menggunakan Autodesk Fusion 360 dan mencetaknya presisi.",
    detailedInfo: "Pemahaman modeling parametrik 3D, fitting toleransi ukuran baut dan motor, konversi ke gcode slicer (Cura), analisis pengisian (infill), pemilihan material filamen PLA/ABS, serta operasi perawatan printer 3D FDM.",
    difficulty: "Pemula",
    duration: "2 Bulan"
  }
];

export const GALLERY_IMGS: ActivityImage[] = [
  {
    id: "gal1",
    title: "Inspeksi Teknis Lomba Robot Soccer",
    category: "Lomba",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600",
    description: "Uji kelayakan sasis dan konektivitas nirkabel robot sepak bola sebelum memasuki arena pertandingan kontes robot nasional.",
    date: "2025-11-12"
  },
  {
    id: "gal2",
    title: "Workshop Desain PCB IoT untuk Pemula",
    category: "Workshop",
    imageUrl: "https://images.unsplash.com/photo-1517420784537-d3c1750b2f5f?auto=format&fit=crop&q=80&w=600",
    description: "Praktikum interaktif membuat desain sirkuit minimum sistem mikrokontroler menggunakan software CAD elektronika.",
    date: "2026-02-18"
  },
  {
    id: "gal3",
    title: "Pelatihan Dasar Robot Line Follower",
    category: "Pelatihan",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600",
    description: "Siswa angkatan baru antusias merakit sasis akrilik dan memasang komponen optosensor pemisah hitam putih.",
    date: "2026-03-05"
  },
  {
    id: "gal4",
    title: "Kunjungan Industri ke Pabrik Otomasi",
    category: "Kunjungan Industri",
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600",
    description: "Mempelajari integrasi robot lengan pembuat mobil (Scara Robot Hand) langsung dari industri perakitan modern.",
    date: "2025-08-20"
  },
  {
    id: "gal5",
    title: "Seminar AI and Future of Humanity",
    category: "Seminar",
    imageUrl: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=600",
    description: "Diskus panel dengan pakar kecerdasan buatan nasional membicarakan pemanfaatan AI pada robot otonom penyelamat.",
    date: "2026-01-10"
  },
  {
    id: "gal6",
    title: "Praktikum Pemrograman Mikrokontroler Arduino",
    category: "Praktikum",
    imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=600",
    description: "Peserta bereksperimen menguji algoritma pemisah filter analog ultrasonik pada sasis robot tank otonom.",
    date: "2026-04-22"
  },
  {
    id: "gal7",
    title: "Lomba Konstruksi Roda Gigi Mekanis",
    category: "Lomba",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600",
    description: "Kombinasi mekanika gigi presisi tinggi untuk mengangkat beban torsi berat pada robot eksplorasi medan lumpur.",
    date: "2025-10-05"
  },
  {
    id: "gal8",
    title: "Workshop Perakitan Quadcopter & GPS",
    category: "Workshop",
    imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=600",
    description: "Analisis telemetri sinyal, penyetelan motor brushless, dan orientasi sudut kompas navigasi waypoint.",
    date: "2026-05-14"
  }
];

export const NEWS_DATA: NewsItem[] = [
  {
    id: "news1",
    title: "Pendaftaran Anggota Baru Ekstrakurikuler Robotika T.A. 2026/2027 Resmi Dibuka!",
    category: "Pengumuman",
    summary: "Bagi seluruh siswa yang antusias mengeksplorasi pembuatan robot, pemrograman, IoT, dan 3D CAD, segera daftarkan diri Anda.",
    content: "Telah dibuka pendaftaran angkatan ke-11 dari Ekstrakurikuler Robotika Sekolah. Tidak diperlukan dasar pemrograman maupun elektro karena kami mengadopsi modul pembelajaran bertahap dari level nol. Tersedia ruang laboratorium eksklusif dengan fasilitas printer 3D, mesin CNC mini, komputer GPU tinggi, serta ratusan kit mikrokontroler. Pendaftaran ditutup pada akhir bulan Juni 2026. Alur pendaftaran dapat dilakukan daring melalui website ini dengan login atau via formulir Pembina Robotika.",
    date: "2026-06-15",
    author: "Ir. Hermawan Prasetyo",
    readTime: "3 Menit Baca",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "news2",
    title: "Tim Robotika 'RoboSoldier' Meraih Medali Emas di National Robotics Cup 2026",
    category: "Prestasi",
    summary: "Selamat untuk tim atas keberhasilan menyabet piala utama kategori Search and Rescue Robot berkat deteksi citra berbasis AI.",
    content: "Kompetisi nasional yang diselenggarakan di Bandung ini diikuti oleh 48 sekolah terbaik. Robot kami, 'RoboSoldier Gen-3', melibas jalur rintangan puing-puing bencana alam tercepat, menyelamatkan 5 objek vital, serta mendeteksi korban melalui thermal kamera yang diprogram di atas Python OpenCV. Kemenangan ini sekaligus mengamankan tiket menuju kompetisi robot internasional tahun depan di Tokyo.",
    date: "2026-05-28",
    author: "Tim Humas Robotika",
    readTime: "4 Menit Baca",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "news3",
    title: "Penyesuaian Jadwal Latihan Intensif Menyambut Kejuaraan Robot Regional",
    category: "Jadwal Latihan",
    summary: "Mengingat semakin dekatnya laga lomba robot soccer dan line follower, berikut jadwal terbaru penggunaan laboratorium.",
    content: "Untuk semua divisi kompetisi olahraga robot, latihan intensif akan diadakan tiga kali seminggu: Selasa pukul 15.00 - 17.30 (Divisi Line Follower & Embedded), Kamis pukul 15.00 - 17.30 (Divisi Soccer & Drone), serta Sabtu pukul 09.00 - 14.00 (Simulasi Pertandingan Lapangan & Coding Lab). Kehadiran dicatat untuk penilaian beasiswa prestasi siswa.",
    date: "2026-06-10",
    author: "Siti Rahmawati, M.Cs.",
    readTime: "2 Menit Baca",
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "news4",
    title: "Agenda Workshop Terdekat: Pengenalan Robot Otonom Berbasis ROS",
    category: "Agenda",
    summary: "Robot Operating System (ROS) mulai diperkenalkan di tingkat sekolah. Kuota terbatas 30 siswa.",
    content: "Kami mengundang narasumber praktisi robotika dari salah satu startup logistik pergudangan otomatis untuk membagikan fundamental pengoperasian ROS (Robot Operating System) dasar, simulasi Gazebo, rute navigasi lidar (SLAM), dan pertukaran pesan node. Workshop dilaksanakan serentak di Aula Multimedia tanggal 25 Juni 2026. Registrasi di menu pelaporan internal dashboard.",
    date: "2026-06-05",
    author: "Sekretariat Robotika",
    readTime: "3 Menit Baca",
    imageUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=500"
  }
];

export const PUBLIC_SERVICES = [
  {
    id: "ps1",
    title: "Pelatihan Robotika SD/SMP",
    description: "Menyelenggarakan kelas belajar robotika dasar, pemrograman visual seret-lepas (Scratch/Blockly), serta perakitan sirkuit modular bagi siswa tingkat dasar sebagai regenerasi dini.",
    badge: "Edukasi Dasar",
    duration: "Sertifikat + Kit Modul"
  },
  {
    id: "ps2",
    title: "Workshop Microcontroller Arduino",
    description: "Kegiatan pengabdian masyarakat mingguan berupa pelatihan intensif pemrograman mikrokontroler bagi guru, siswa SMK luar, dan mahasiswa pemula untuk riset sekolah.",
    badge: "Pengabdian Guru & Siswa",
    duration: "Gratis & Fleksibel"
  },
  {
    id: "ps3",
    title: "Seminar Teknologi Otomasi",
    description: "Edukasi publik mengenai tren industri, internet of things, dampak otomatisasi robot pada pekerjaan masa depan, serta inovasi robot medis bagi kesejahteraan sosial.",
    badge: "Disseminasi IPTEK",
    duration: "Pertemuan hybrid"
  },
  {
    id: "ps4",
    title: "Pembuatan Prototype Industri",
    description: "Membantu UMKM, petani lokal, dan wirausahawan merancang prototipe sistem pemantauan kelembapan otomatis, pengering berbasis IoT, atau penyiram otomatis berdaya murah.",
    badge: "Solusi Teknik Lokal",
    duration: "Kerja Sama Kemitraan"
  },
  {
    id: "ps5",
    title: "Konsultasi Robotika & Riset",
    description: "Layanan tanya-jawab gratis bagi siswa, komunitas pehobi, atau calon pencipta karya ilmiah remaja terkait pemilihan sensor, mekanika gear, atau debugging program sirkuit.",
    badge: "Pusat Bantuan Teknis",
    duration: "Online / Offline Lab"
  },
  {
    id: "ps6",
    title: "Service Robot Edukasi",
    description: "Klinik perbaikan instrumen robotika yang rusak, motor servo macet, IC mikrokontroler terbakar, atau penggantian baterai bagi sekolah mitra yang mengalami masalah peralatan.",
    badge: "Klinik Servis Elektro",
    duration: "Cepat & Ekonomis"
  }
];

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: "p1",
    name: "Robot Line Follower Microcontroller - RoboSpeed v2",
    category: "Mobile Robotics",
    description: "Robot balap penelusur garis jalan bersasis serat karbon ringan dengan 14 optosensor fototransistor presisi tinggi, terintegrasi sirkuit driver MOSFET arus besar dan LCD pemantau kecepatan.",
    specs: [
      "Microcontroller: STM32 ARM Cortex-M4",
      "Power Rating: LiPo 11.1V 2200mAh",
      "Sensor: 14 Array Optosensor ADC",
      "Chassis: Carbon Fiber 2mm CNC Cut",
      "Algorithm: High-speed PID Loop (1kHz)"
    ],
    technologies: ["STM32", "PID Algorithm", "C++ Programming", "Carbon Fiber CAD"],
    imageUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=400",
    creator: "Fadhil & Rian (Divisi Speedster)",
    year: "2025",
    status: "Ready"
  },
  {
    id: "p2",
    name: "Robot Pemilah Sampah Berbasis AI - RoboScrap v3",
    category: "Artificial Intelligence",
    description: "Lengan robot 5 sumbu (5 DOF Arm) yang terpasang di atas platform roda omni, menggunakan kamera cerdas untuk mengenali jenis sampah (organik, kertas, plastik, logam) secara langsung.",
    specs: [
      "Processor: Raspberry Pi 4 Model B (4GB)",
      "Co-Processor: Google Coral USB Accelerator",
      "Servo Actuator: MG996R Metal Gear Servo",
      "Frame Model: 3D Printed PETG Structure",
      "Dataset: 12,000+ Sampah Klasifikasi"
    ],
    technologies: ["Raspberry Pi", "TensorFlow Lite", "Python OpenCV", "3D Modeling"],
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=400",
    creator: "Siska & Adrian (Divisi AI)",
    year: "2025",
    status: "Ready"
  },
  {
    id: "p3",
    name: "Sistem Manajemen Pintu Pintar - Smart Door Lock RFID",
    category: "Internet of Things",
    description: "Keamanan ruangan tingkat lanjut berbasis RFID, keypad anti-maling, serta pemindaian sidik jari nirkabel terintegrasi notifikasi obrolan Telegram dan log login awan.",
    specs: [
      "Microcontroller: ESP32-WROOM-32D",
      "Security: RC522 RFID & Fingerprint FPM10A",
      "Communication: Wi-Fi HTTP Secure",
      "Feedback: Solenoid 12V & I2C LCD",
      "Auth Method: OAuth JWT Sync"
    ],
    technologies: ["ESP32", "RFID Security", "NodeJS Database", "Cloud IoT Gateway"],
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=400",
    creator: "Budi & Maya (Divisi Smart Devices)",
    year: "2024",
    status: "Prototype"
  },
  {
    id: "p4",
    name: "Sistem Otomasi Monitor Smart Greenhouse",
    category: "Internet of Things",
    description: "Kubah pertanian futuristik berpemanas otomatis, penyesuai kelembapan tanah cerdas, sirkulasi kipas, serta panel pemantau aplikasi Android berbasis sensor NPK gas karbon.",
    specs: [
      "Microcontroller: ESP8266 NodeMCU",
      "Sensors: DHT22, LDR, Soil Moisture Analog",
      "Actuators: 12V Water Pump, Exhaust Fan",
      "IoT Platform: Blynk IoT Server",
      "Battery: DC 5V USB Direct"
    ],
    technologies: ["ESP8266 NodeMCU", "Blynk IoT", "Analog Interfacing", "Kelistrikan DC"],
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=400",
    creator: "Gilang & Tim IoT",
    year: "2025",
    status: "Ready"
  },
  {
    id: "p5",
    name: "Sistem Parkir Otomatis - Smart Parking IoT",
    category: "Smart City",
    description: "Gerbang parkir pintar berbasis sensor ultrasonik pendeteksi ketersediaan slot kendaraan, penghitung otomatis dengan layar matriks LED, serta sistem pembayaran non-tunai.",
    specs: [
      "Processor: Arduino Mega 2560",
      "Display: 16x2 I2C Display & LED Matrix",
      "Mechanism: SG90 Servo Gate Barriers",
      "Sensors: Ultrasonic HC-SR04 & IR Obstacle",
      "Logging: MicroSD Card Logger"
    ],
    technologies: ["Arduino Mega", "Interfacing Display", "Sensor Integrasi", "Bahan Akrilik"],
    imageUrl: "https://images.unsplash.com/photo-1506521788701-1e13a4e83000?auto=format&fit=crop&q=80&w=400",
    creator: "Dimas & Alvin",
    year: "2024",
    status: "Prototype"
  },
  {
    id: "p6",
    name: "Robot Otonom Pemadam Kebakaran - RoboFire Fighter",
    category: "Rescue Robotics",
    description: "Robot beroda tank dengan motor DC bertorsi besar, sensor UVtron penemu api ultraviolet, serta tangki pemadam mini bertekanan kompresor penyembur air otomatis.",
    specs: [
      "Contoller: ESP32 + Arduino Uno",
      "Sensors: UVtron Flame Detector, Thermal Grid",
      "Actuators: Water Pump DC, Motor Driver Dual-Channel",
      "Drive System: Crawler Tank Track Gearbox",
      "Fire Exit Strategy: Autonomous Grid Finding"
    ],
    technologies: ["Double IC System", "Flame Sensor UVtron", "High-Torque DC Motor", "Piping System"],
    imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=400",
    creator: "Geraldi & Rizaldi",
    year: "2025",
    status: "Development"
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "inv1", name: "Arduino Uno R3 DIP clone", category: "Microcontroller", quantity: 24, unit: "Pcs", status: "Tersedia", location: "Loker A-1" },
  { id: "inv2", name: "ESP32 DevKit v1 30-Pin", category: "Microcontroller", quantity: 15, unit: "Pcs", status: "Tersedia", location: "Loker A-2" },
  { id: "inv3", name: "Raspberry Pi 4 Model B 4GB", category: "Microcontroller", quantity: 4, unit: "Pcs", status: "Dipakai", location: "Lab AI Server" },
  { id: "inv4", name: "Sensor Ultrasonik HC-SR04", category: "Sensor", quantity: 38, unit: "Pcs", status: "Tersedia", location: "Loker B-1" },
  { id: "inv5", name: "Sensor Suhu Kelembaban DHT22", category: "Sensor", quantity: 18, unit: "Pcs", status: "Tersedia", location: "Loker B-2" },
  { id: "inv6", name: "Motor Servo TowerPro MG996R", category: "Actuator", quantity: 12, unit: "Pcs", status: "Dipakai", location: "Rak Divisi AI" },
  { id: "inv7", name: "Baterai LiPo 3S 2200mAh 35C", category: "Power", quantity: 8, unit: "Pcs", status: "Tersedia", location: "Loker Batas" },
  { id: "inv8", name: "Printer 3D Ender-3 V2 FDM", category: "Tools", quantity: 2, unit: "Pcs", status: "Tersedia", location: "Pojok CAD 3D" },
  { id: "inv9", name: "Filament PLA+ Esun 1.75mm Black", category: "Tools", quantity: 0, unit: "Roll", status: "Habis", location: "Pojok CAD 3D" }
];

export const INITIAL_MEMBERS: Member[] = [
  { id: "m0", name: "Ayik Romlah", class: "Guru - Staf", role: "Pembina", email: "4yik.romlah@gmail.com", joinedDate: "2016-06-15", interests: ["Embedded", "IoT", "Computer Vision"], username: "romlah", password: "password", memberType: "Senior" },
  { id: "m1", name: "Ir. Hermawan Prasetyo, M.T.", class: "Guru - Staf", role: "Pembina", email: "hermawan.pras@sekolah.sch.id", joinedDate: "2016-06-15", interests: ["Embedded", "IoT", "Aerodinamika"], memberType: "Senior" },
  { id: "m2", name: "Siti Rahmawati, M.Cs.", class: "Guru - Staf", role: "Pembina", email: "siti.rahma@sekolah.sch.id", joinedDate: "2019-09-01", interests: ["AI", "Computer Vision", "Python"], memberType: "Senior" },
  { id: "m3", name: "Fadhil Muhammad Nur", class: "XII Elektronika 1", role: "Ketua", email: "fadhil.mn@student.sch.id", joinedDate: "2024-07-20", interests: ["Line Follower", "PCB Design", "PID"], memberType: "Senior" },
  { id: "m4", name: "Siska Amelia Putri", class: "XI RPL 2", role: "Wakil Ketua", email: "siska.amelia@student.sch.id", joinedDate: "2025-07-21", interests: ["AI", "Computer Vision", "Raspberry Pi"], memberType: "Junior" },
  { id: "m5", name: "Rian Hidayatullah", class: "XII Elektronika 2", role: "Anggota", email: "rian.hidayat@student.sch.id", joinedDate: "2024-07-20", interests: ["Line Follower", "Soldering", "Mekanika sasis"], memberType: "Junior" },
  { id: "m6", name: "Budi Santoso", class: "XI TKJ 1", role: "Anggota", email: "budi.s@student.sch.id", joinedDate: "2025-07-21", interests: ["IoT", "Web Development", "ESP32"], memberType: "Pemula" },
  { id: "m7", name: "Maya Rosita", class: "X RPL 1", role: "Calon Anggota", email: "maya.rosita@student.sch.id", joinedDate: "2026-06-16", interests: ["Arduino", "Sirkuit Dasar"], memberType: "Pemula" }
];
