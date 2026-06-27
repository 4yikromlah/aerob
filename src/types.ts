/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Member {
  id: string;
  name: string;
  class: string;
  role: 'Pembina' | 'Ketua' | 'Wakil Ketua' | 'Anggota' | 'Calon Anggota' | 'Admin' | 'Pengurus' | 'Anggota Mitra';
  email: string;
  joinedDate: string;
  interests: string[];
  username?: string;
  password?: string;
  memberType?: 'Pemula' | 'Junior' | 'Senior';
}

export interface Achievement {
  id: string;
  title: string;
  year: string;
  rank: string;
  level: 'Nasional' | 'Internasional' | 'Regional';
  description: string;
}

export interface Program {
  id: string;
  title: string;
  iconName: string;
  description: string;
  detailedInfo: string;
  difficulty: 'Pemula' | 'Menengah' | 'Mahir';
  duration: string;
  imageUrl?: string;
}

export interface ActivityImage {
  id: string;
  title: string;
  category: 'Workshop' | 'Lomba' | 'Pelatihan' | 'Kunjungan Industri' | 'Seminar' | 'Praktikum';
  imageUrl: string;
  description: string;
  date: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Pengumuman' | 'Jadwal Latihan' | 'Agenda' | 'Prestasi' | 'Event';
  summary: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
  imageUrl?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  specs: string[];
  technologies: string[];
  imageUrl: string;
  creator: string;
  year: string;
  status: 'Prototype' | 'Ready' | 'Development';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Microcontroller' | 'Sensor' | 'Actuator' | 'Power' | 'Tools' | 'Chassis';
  quantity: number;
  unit: string;
  status: 'Tersedia' | 'Dipakai' | 'Habis';
  location: string;
}
