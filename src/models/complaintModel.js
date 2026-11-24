const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/complaints.json');

const INITIAL_SEED_DATA = [
  {
    id: "FAC-2026-001",
    reporterName: "Dimas Pratama",
    reporterEmail: "dimas.pratama@student.president.ac.id",
    building: "Building A (Rectorate & Lecture Halls)",
    room: "Room A-302",
    category: "Electricity & Air Conditioning",
    priority: "Urgent",
    description: "Wall-mounted AC unit shut down completely and is making loud buzzing noises. High room temperature is severely disrupting lectures.",
    photoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
    status: "In Progress",
    assignedTechnician: "Pak Joko (Electrical Crew)",
    staffNotes: "Maintenance technician scheduled to inspect capacitor and freon levels at 14:00.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: "FAC-2026-002",
    reporterName: "Siti Rahmawati",
    reporterEmail: "siti.rahma@student.president.ac.id",
    building: "Building B (Integrated Laboratories)",
    room: "Computer Lab 2 (B-105)",
    category: "IT Equipment & Projectors",
    priority: "Medium",
    description: "Ceiling HDMI projector flickers continuously and display output shifts to purple/green tint during lecture slides presentation.",
    photoUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    status: "Submitted",
    assignedTechnician: "Unassigned",
    staffNotes: "",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: "FAC-2026-003",
    reporterName: "Budi Santoso",
    reporterEmail: "budi.santoso@student.president.ac.id",
    building: "Building C (Student Center & Cafeteria)",
    room: "1st Floor Male Restroom",
    category: "Sanitation & Plumbing",
    priority: "Urgent",
    description: "Washbasin faucet has a severe continuous leak that cannot be shut tightly. Water is overflowing onto the floor creating slip hazards.",
    photoUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    status: "Resolved",
    assignedTechnician: "Budi Santoso (Plumbing Specialist)",
    staffNotes: "Faucet valve replaced with new heavy-duty shutoff valve by campus plumbing crew.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000 * 1).toISOString()
  }
];

let inMemoryList = null;

class ComplaintModel {
  static _getStoragePath() {
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      return '/tmp/complaints.json';
    }
    return DATA_FILE;
  }

  static _ensureStorage() {
    if (inMemoryList && inMemoryList.length > 0) return;

    const targetFile = this._getStoragePath();

    // 1. Try reading from targetFile (/tmp on Vercel or data/ locally)
    try {
      if (fs.existsSync(targetFile)) {
        const data = fs.readFileSync(targetFile, 'utf-8');
        inMemoryList = JSON.parse(data);
        return;
      }
    } catch (e) {}

    // 2. Try reading from original DATA_FILE (data/complaints.json)
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        inMemoryList = JSON.parse(data);
      } else {
        inMemoryList = [...INITIAL_SEED_DATA];
      }
    } catch (e) {
      inMemoryList = [...INITIAL_SEED_DATA];
    }

    // 3. Try seeding to targetFile
    try {
      const dir = path.dirname(targetFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(targetFile, JSON.stringify(inMemoryList, null, 2), 'utf-8');
    } catch (e) {}
  }

  static getAll() {
    this._ensureStorage();
    return inMemoryList || INITIAL_SEED_DATA;
  }

  static getById(id) {
    const list = this.getAll();
    return list.find(item => item.id.toLowerCase() === id.toLowerCase());
  }

  static create(complaintData) {
    this._ensureStorage();
    const list = inMemoryList || INITIAL_SEED_DATA;
    const newId = `FAC-2026-${String(list.length + 1).padStart(3, '0')}`;
    
    const record = {
      id: newId,
      reporterName: complaintData.reporterName,
      reporterEmail: complaintData.reporterEmail || "-",
      building: complaintData.building,
      room: complaintData.room || "-",
      category: complaintData.category,
      priority: complaintData.priority || "Medium",
      description: complaintData.description,
      photoUrl: complaintData.photoUrl || null,
      status: "Submitted",
      assignedTechnician: complaintData.assignedTechnician || "Unassigned",
      staffNotes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    list.unshift(record);
    inMemoryList = list;

    // Safely attempt file write (supports read-only serverless environments like Vercel)
    try {
      const targetFile = this._getStoragePath();
      const dir = path.dirname(targetFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(targetFile, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.warn('File write fallback: using in-memory state on cloud serverless runtime.');
    }

    return record;
  }

  static updateStatus(id, newStatus, staffNotes, assignedTechnician) {
    this._ensureStorage();
    const list = inMemoryList || INITIAL_SEED_DATA;
    const index = list.findIndex(item => item.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    list[index].status = newStatus;
    if (staffNotes !== undefined) {
      list[index].staffNotes = staffNotes;
    }
    if (assignedTechnician !== undefined) {
      list[index].assignedTechnician = assignedTechnician;
    }
    list[index].updatedAt = new Date().toISOString();
    inMemoryList = list;

    try {
      const targetFile = this._getStoragePath();
      const dir = path.dirname(targetFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(targetFile, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.warn('File write fallback: using in-memory state on cloud serverless runtime.');
    }

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
