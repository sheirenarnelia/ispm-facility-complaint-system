const ComplaintModel = require('../models/complaintModel');

exports.getAllComplaints = (req, res) => {
  try {
    let complaints = ComplaintModel.getAll();
    const { status, category, search } = req.query;

    if (status && status !== 'all') {
      complaints = complaints.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    if (category && category !== 'all') {
      complaints = complaints.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      complaints = complaints.filter(c => 
        c.id.toLowerCase().includes(q) ||
        c.reporterName.toLowerCase().includes(q) ||
        c.building.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data keluhan fasilitas.',
      error: error.message
    });
  }
};

exports.getComplaintById = (req, res) => {
  try {
    const { id } = req.params;
    const complaint = ComplaintModel.getById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Laporan dengan ID ${id} tidak ditemukan.`
      });
    }

    return res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail keluhan.',
      error: error.message
    });
  }
};

exports.createComplaint = (req, res) => {
  try {
    const { reporterName, reporterEmail, building, room, category, priority, description } = req.body;

    // Validasi field wajib
    if (!reporterName || !building || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib belum lengkap: reporterName, building, category, dan description harus diisi.'
      });
    }

    // URL foto (jika file diupload lewat multipart/form-data)
    let photoUrl = null;
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.photoUrl) {
      photoUrl = req.body.photoUrl;
    }

    const newComplaint = ComplaintModel.create({
      reporterName: reporterName.trim(),
      reporterEmail: (reporterEmail || '').trim(),
      building: building.trim(),
      room: (room || '').trim(),
      category: category.trim(),
      priority: priority || 'Sedang',
      description: description.trim(),
      photoUrl
    });

    return res.status(201).json({
      success: true,
      message: 'Laporan keluhan fasilitas berhasil dikirimkan!',
      data: newComplaint
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memproses laporan.',
      error: error.message
    });
  }
};

exports.updateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, staffNotes } = req.body;

    const validStatuses = ['Submitted', 'In Progress', 'Resolved', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status tidak valid. Pilih dari: ${validStatuses.join(', ')}`
      });
    }

    const updated = ComplaintModel.updateStatus(id, status, staffNotes);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Laporan dengan ID ${id} tidak ditemukan.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Status laporan ${id} berhasil diperbarui menjadi ${status}.`,
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status laporan.',
      error: error.message
    });
  }
};

exports.getStats = (req, res) => {
  try {
    const stats = ComplaintModel.getStats();
    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik.',
      error: error.message
    });
  }
};
