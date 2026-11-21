const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/complaints.json');

const INITIAL_SEED_DATA = [
  {
    id: "FAC-2026-001",
    reporterName: "Dimas Pratama",
    reporterEmail: "dimas.pratama@student.president.ac.id",
    building: "Gedung A (Rektorat & Kelas Teori)",
    room: "Ruang A-302",
    category: "Kelistrikan & AC",
    priority: "Mendesak",
    description: "AC split di dinding utara mati total dan mengeluarkan suara berdengung keras. Suhu ruangan sangat panas mengganggu perkuliahan.",
    photoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
    status: "In Progress",
    staffNotes: "Teknisi AC dijadwalkan cek kapasitor & freon jam 14.00 WIB.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: "FAC-2026-002",
    reporterName: "Siti Rahmawati",
    reporterEmail: "siti.rahma@student.president.ac.id",
    building: "Gedung B (Laboratorium Terpadu)",
    room: "Lab Komputer 2 (B-105)",
    category: "Peralatan IT & Proyektor",
    priority: "Sedang",
    description: "Proyektor HDMI sering berkedip dan warna tampilan berubah menjadi ungu/hijau saat dosen mempresentasikan materi.",
    photoUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    status: "Submitted",
    staffNotes: "",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: "FAC-2026-003",
    reporterName: "Budi Santoso",
    reporterEmail: "budi.santoso@student.president.ac.id",
    building: "Gedung C (Fasilitas Mahasiswa)",
    room: "Toilet Pria Lantai 1",
    category: "Sanitasi & Saluran Air",
    priority: "Mendesak",
    description: "Kran wastafel bocor deras tidak bisa ditutup rapat, air meluap ke lantai dan berpotensi licin.",
    photoUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    status: "Resolved",
    staffNotes: "Kran telah diganti dengan valve baru oleh tim pemeliharaan sanitasi.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 1).toISOString()
  }
];

class ComplaintModel {
  static _ensureStorage() {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SEED_DATA, null, 2), 'utf-8');
    }
  }

  static getAll() {
    this._ensureStorage();
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return INITIAL_SEED_DATA;
    }
  }

  static getById(id) {
    const list = this.getAll();
    return list.find(item => item.id.toLowerCase() === id.toLowerCase());
  }

  static create(complaintData) {
    const list = this.getAll();
    const newId = `FAC-2026-${String(list.length + 1).padStart(3, '0')}`;
    
    const record = {
      id: newId,
      reporterName: complaintData.reporterName,
      reporterEmail: complaintData.reporterEmail || "-",
      building: complaintData.building,
      room: complaintData.room || "-",
      category: complaintData.category,
      priority: complaintData.priority || "Sedang",
      description: complaintData.description,
      photoUrl: complaintData.photoUrl || null,
      status: "Submitted",
      staffNotes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    list.unshift(record);
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return record;
  }

  static updateStatus(id, newStatus, staffNotes) {
    const list = this.getAll();
    const index = list.findIndex(item => item.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    list[index].status = newStatus;
    if (staffNotes !== undefined) {
      list[index].staffNotes = staffNotes;
    }
    list[index].updatedAt = new Date().toISOString();

    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return list[index];
  }

  static getStats() {
    const list = this.getAll();
    return {
      total: list.length,
      submitted: list.filter(c => c.status === 'Submitted').length,
      inProgress: list.filter(c => c.status === 'In Progress').length,
      resolved: list.filter(c => c.status === 'Resolved').length
    };
  }
}

module.exports = ComplaintModel;
