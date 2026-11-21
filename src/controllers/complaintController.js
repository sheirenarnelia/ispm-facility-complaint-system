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
      message: 'Failed to retrieve facility complaints.',
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
        message: `Complaint report with ID ${id} was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaint details.',
      error: error.message
    });
  }
};

exports.createComplaint = (req, res) => {
  try {
    const { reporterName, reporterEmail, building, room, category, priority, description } = req.body;

    // Validate mandatory fields
    if (!reporterName || !building || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Mandatory fields missing: reporterName, building, category, and description are required.'
      });
    }

    // Photo URL (uploaded via multipart/form-data or provided as string)
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
      priority: priority || 'Medium',
      description: description.trim(),
      photoUrl
    });

    return res.status(201).json({
      success: true,
      message: 'Facility complaint submitted successfully!',
      data: newComplaint
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error while processing complaint submission.',
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
        message: `Invalid status. Choose from: ${validStatuses.join(', ')}`
      });
    }

    const updated = ComplaintModel.updateStatus(id, status, staffNotes);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Complaint ticket ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Status of ticket ${id} updated to ${status}.`,
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update complaint status.',
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
      message: 'Failed to retrieve metrics statistics.',
      error: error.message
    });
  }
};
