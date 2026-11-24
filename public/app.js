let currentComplaints = [];
let activeTicketId = null;
let currentSelectedStatus = null;
let latestCreatedTicket = null;

document.addEventListener('DOMContentLoaded', () => {
 loadStats();
 loadComplaints();
});

// Switch between Form, Tracker, and Staff List views
function switchView(viewName) {
 const formView = document.getElementById('viewForm');
 const trackerView = document.getElementById('viewTracker');
 const listView = document.getElementById('viewList');
 const navTabForm = document.getElementById('navTabForm');
 const navTabTracker = document.getElementById('navTabTracker');
 const navTabList = document.getElementById('navTabList');

 const inactiveTabClass = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1.5';
 const activeTabClass = 'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-white text-slate-800 shadow-xs flex items-center gap-1.5';
 const staffActiveTabClass = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-900 text-white shadow-xs flex items-center gap-1.5';
 const staffInactiveTabClass = 'px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-white hover:text-slate-900 transition-all flex items-center gap-1.5';

 if (formView) formView.classList.add('hidden');
 if (trackerView) trackerView.classList.add('hidden');
 if (listView) listView.classList.add('hidden');

 if (navTabForm) navTabForm.className = inactiveTabClass;
 if (navTabTracker) navTabTracker.className = inactiveTabClass;
 if (navTabList) navTabList.className = staffInactiveTabClass;

 if (viewName === 'form') {
  if (formView) formView.classList.remove('hidden');
  if (navTabForm) navTabForm.className = activeTabClass;
 } else if (viewName === 'tracker') {
  if (trackerView) trackerView.classList.remove('hidden');
  if (navTabTracker) navTabTracker.className = activeTabClass;
  if (!activeTicketId && currentComplaints.length > 0) {
   showTicketInTracker(currentComplaints[0].id, currentComplaints[0]);
  }
 } else {
  if (listView) listView.classList.remove('hidden');
  if (navTabList) navTabList.className = staffActiveTabClass;
  loadComplaints();
 }
}

// Public Ticket Tracker Logic (Reporter Persona)
function showTicketInTracker(ticketId, data) {
 if (!data && currentComplaints.length > 0) {
  data = currentComplaints.find(c => c.id === ticketId);
 }
 if (!data) {
  data = {
   id: ticketId || 'FAC-2026-013',
   reporterName: 'Sheiren Arnelia',
   category: 'Furniture & Fixtures',
   building: 'Building A (Rectorate & Lecture Halls)',
   room: 'Room A324',
   description: "the door can't be open",
   status: 'Submitted',
   createdAt: new Date().toISOString()
  };
 }

 activeTicketId = data.id;

 const elemId = document.getElementById('trackerTicketId');
 const elemBadge = document.getElementById('trackerStatusBadge');
 const elemCat = document.getElementById('trackerCategoryTitle');
 const elemLoc = document.getElementById('trackerLocationText');
 const elemRep = document.getElementById('trackerReporterName');
 const elemDesc = document.getElementById('trackerDescriptionText');
 const elemSearch = document.getElementById('trackerSearchInput');

 if (elemId) elemId.innerText = data.id;
 if (elemCat) elemCat.innerText = data.category + ' Incident';
 if (elemLoc) elemLoc.innerText = `${data.building} — ${data.room || 'General Area'}`;
 if (elemRep) elemRep.innerText = data.reporterName;
 if (elemDesc) elemDesc.innerText = `"${data.description}"`;
 if (elemSearch) elemSearch.value = data.id;

 if (elemBadge) {
  if (data.status === 'Submitted') {
   elemBadge.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300';
   elemBadge.innerText = 'Submitted (Pending Review)';
  } else if (data.status === 'In Progress') {
   elemBadge.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300';
   elemBadge.innerText = 'In Progress (Technician Active)';
  } else if (data.status === 'Resolved') {
   elemBadge.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
   elemBadge.innerText = 'Resolved (Completed)';
  }
 }

 updateTrackerStepper(data.status, data.technician);

 const formView = document.getElementById('viewForm');
 const trackerView = document.getElementById('viewTracker');
 const listView = document.getElementById('viewList');
 const navTabForm = document.getElementById('navTabForm');
 const navTabTracker = document.getElementById('navTabTracker');
 const navTabList = document.getElementById('navTabList');

 if (formView) formView.classList.add('hidden');
 if (listView) listView.classList.add('hidden');
 if (trackerView) trackerView.classList.remove('hidden');

 if (navTabTracker) navTabTracker.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-white text-slate-800 shadow-xs flex items-center gap-1.5';
 if (navTabForm) navTabForm.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1.5';
 if (navTabList) navTabList.className = 'px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-white hover:text-slate-900 transition-all flex items-center gap-1.5';
}

function updateTrackerStepper(status, technician) {
 const dot1 = document.getElementById('stepDot1');
 const dot2 = document.getElementById('stepDot2');
 const dot3 = document.getElementById('stepDot3');
 const dot4 = document.getElementById('stepDot4');
 const badge2 = document.getElementById('stepBadge2');
 const badge3 = document.getElementById('stepBadge3');
 const badge4 = document.getElementById('stepBadge4');

 const checkIcon = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>';

 if (dot1) {
  dot1.className = 'w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-4 ring-emerald-100 shrink-0 -ml-[15px] sm:-ml-[17px] z-10';
  dot1.innerHTML = checkIcon;
 }

 if (status === 'Submitted') {
  if (dot2) {
   dot2.className = 'w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-4 ring-blue-100 shrink-0 -ml-[15px] sm:-ml-[17px] z-10 animate-pulse';
   dot2.innerText = '2';
  }
  if (badge2) {
   badge2.className = 'inline-block mt-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded';
   badge2.innerText = 'In Triage Review';
  }
  if (dot3) {
   dot3.className = 'w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0 -ml-[15px] sm:-ml-[17px] z-10';
   dot3.innerText = '3';
  }
  if (badge3) {
   badge3.className = 'inline-block mt-1 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded';
   badge3.innerText = 'Pending Dispatch';
  }
  if (dot4) {
   dot4.className = 'w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0 -ml-[15px] sm:-ml-[17px] z-10';
   dot4.innerText = '4';
  }
  if (badge4) {
   badge4.className = 'inline-block mt-1 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded';
   badge4.innerText = 'Pending Completion';
  }
 } else if (status === 'In Progress') {
  if (dot2) {
   dot2.className = 'w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-4 ring-emerald-100 shrink-0 -ml-[15px] sm:-ml-[17px] z-10';
   dot2.innerHTML = checkIcon;
  }
  if (badge2) {
   badge2.className = 'inline-block mt-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded';
   badge2.innerText = 'Triage Completed';
  }
  if (dot3) {
   dot3.className = 'w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-4 ring-blue-100 shrink-0 -ml-[15px] sm:-ml-[17px] z-10 animate-pulse';
   dot3.innerText = '3';
  }
  if (badge3) {
   badge3.className = 'inline-block mt-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded';
   badge3.innerText = technician && technician !== 'Unassigned' ? `Assigned: ${technician}` : 'Technician Dispatched';
  }
  if (dot4) {
   dot4.className = 'w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0 -ml-[15px] sm:-ml-[17px] z-10';
   dot4.innerText = '4';
  }
  if (badge4) {
   badge4.className = 'inline-block mt-1 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded';
   badge4.innerText = 'Repairs in Progress';
  }
 } else if (status === 'Resolved') {
  if (dot2) {
   dot2.className = 'w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-4 ring-emerald-100 shrink-0 -ml-[15px] sm:-ml-[17px] z-10';
   dot2.innerHTML = checkIcon;
  }
  if (badge2) badge2.innerText = 'Triage Completed';
  if (dot3) {
   dot3.className = 'w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-4 ring-emerald-100 shrink-0 -ml-[15px] sm:-ml-[17px] z-10';
   dot3.innerHTML = checkIcon;
  }
  if (badge3) badge3.innerText = technician ? `Completed by: ${technician}` : 'Repairs Completed';
  if (dot4) {
   dot4.className = 'w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-4 ring-emerald-100 shrink-0 -ml-[15px] sm:-ml-[17px] z-10';
   dot4.innerHTML = checkIcon;
  }
  if (badge4) {
   badge4.className = 'inline-block mt-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded';
   badge4.innerText = 'Resolved & Verified';
  }
 }
}

function searchTrackerTicket() {
 const input = document.getElementById('trackerSearchInput');
 const query = (input ? input.value : '').trim().toUpperCase();
 if (!query) {
  showToast('Please enter a Ticket ID to track.', 'error');
  return;
 }
 const found = currentComplaints.find(c => c.id.toUpperCase() === query);
 if (found) {
  showTicketInTracker(found.id, found);
  showToast(`Found tracking record for ${found.id}`);
 } else {
  showToast(`Ticket ${query} not found in live registry.`, 'error');
 }
}

// Modal control functions
function closeSuccessModal() {
 const modal = document.getElementById('submissionSuccessModal');
 if (modal) modal.classList.add('hidden');
}

function goToTrackerFromModal() {
 closeSuccessModal();
 if (latestCreatedTicket) {
  showTicketInTracker(latestCreatedTicket.id, latestCreatedTicket);
 } else {
  switchView('tracker');
 }
}

function submitAnotherFromModal() {
 closeSuccessModal();
 const form = document.getElementById('complaintForm');
 if (form) form.reset();
 resetImagePreview();
 switchView('form');
}

// Fetch stats summary
async function loadStats() {
 try {
  const res = await fetch('/api/complaints/stats/summary');
  const json = await res.json();
  if (json.success) {
   document.getElementById('statTotal').innerText = json.data.total;
   document.getElementById('statSubmitted').innerText = json.data.submitted;
   document.getElementById('statInProgress').innerText = json.data.inProgress;
   document.getElementById('statResolved').innerText = json.data.resolved;
   document.getElementById('navCount').innerText = json.data.total;
  }
 } catch (err) {
  console.error('Error fetching stats:', err);
 }
}

// Fetch all complaints
async function loadComplaints() {
 try {
  const res = await fetch('/api/complaints');
  const json = await res.json();
  if (json.success) {
   currentComplaints = json.data;
   renderTable(currentComplaints);
   loadStats();
  }
 } catch (err) {
  console.error('Error fetching complaints:', err);
 }
}

// Render complaints table
function renderTable(complaints) {
 const tbody = document.getElementById('complaintsTableBody');
 const emptyState = document.getElementById('emptyState');

 if (!complaints || complaints.length === 0) {
  tbody.innerHTML = '';
  emptyState.classList.remove('hidden');
  return;
 }

 emptyState.classList.add('hidden');

 // Update Sprint 2 Emergency Urgent Hazards Count
 const urgentItems = complaints.filter(c => c.priority === 'Urgent');
 const urgentCountElem = document.getElementById('urgentCount');
 if (urgentCountElem) {
  urgentCountElem.innerText = `${urgentItems.length} Active Tickets (${urgentItems.map(u => u.id).join(', ')})`;
 }

 tbody.innerHTML = complaints.map(c => {
  let statusClass = 'badge-submitted';
  if (c.status === 'In Progress') statusClass = 'badge-inprogress';
  if (c.status === 'Resolved') statusClass = 'badge-resolved';

  let priorityBadge = '';
  if (c.priority === 'Urgent' || c.priority === 'Mendesak') {
   priorityBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">Urgent</span>';
  } else if (c.priority === 'Medium' || c.priority === 'Sedang') {
   priorityBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">Medium</span>';
  } else {
   priorityBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">Low</span>';
  }

  const photoThumb = c.photoUrl
   ? `<img src="${c.photoUrl}" alt="Photo" class="w-10 h-10 object-cover rounded-lg border border-slate-200 cursor-pointer mx-auto shadow-xs hover:scale-105 transition-transform" onclick="openDetail('${c.id}')">`
   : `<span class="text-xs text-slate-400 italic">None</span>`;

  const formattedDate = new Date(c.createdAt).toLocaleDateString('en-US', {
   day: 'numeric',
   month: 'short',
   year: 'numeric'
  });

  let techDisplay = '<span class="inline-flex items-center text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-medium">️ Unassigned</span>';
  if (c.assignedTechnician && c.assignedTechnician !== 'Unassigned') {
   techDisplay = `<span class="inline-flex items-center text-xs text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md font-medium">${c.assignedTechnician}</span>`;
  }

  return `
   <tr class="hover:bg-slate-50/80 transition-colors">
    <td class="py-3.5 px-4 font-semibold text-blue-600 font-mono text-xs">
     ${c.id}
     <div class="text-[11px] text-slate-400 font-sans font-normal">${formattedDate}</div>
    </td>
    <td class="py-3.5 px-4">
     <p class="font-medium text-slate-800">${c.reporterName}</p>
     <p class="text-xs text-slate-400">${c.reporterEmail || '-'}</p>
    </td>
    <td class="py-3.5 px-4">
     <p class="text-slate-800 font-medium">${c.building}</p>
     <p class="text-xs text-slate-500">${c.room || '-'}</p>
    </td>
    <td class="py-3.5 px-4">
     <p class="text-slate-700 text-xs font-medium mb-1">${c.category}</p>
     ${priorityBadge}
    </td>
    <td class="py-3.5 px-4">
     <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass}">
      ${c.status}
     </span>
    </td>
    <td class="py-3.5 px-4">
     ${techDisplay}
    </td>
    <td class="py-3.5 px-4 text-center">
     ${photoThumb}
    </td>
    <td class="py-3.5 px-4 text-right">
     <button onclick="openDetail('${c.id}')" class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all">
      Details / Status
     </button>
    </td>
   </tr>
  `;
 }).join('');
}

// Client-side search and filters
function applyFilters() {
 const q = document.getElementById('searchInput').value.toLowerCase();
 const category = document.getElementById('filterCategory').value;
 const status = document.getElementById('filterStatus').value;

 const filtered = currentComplaints.filter(c => {
  const matchQuery = !q || 
   c.id.toLowerCase().includes(q) ||
   c.reporterName.toLowerCase().includes(q) ||
   c.building.toLowerCase().includes(q) ||
   c.description.toLowerCase().includes(q);

  const matchCategory = category === 'all' || c.category === category;
  const matchStatus = status === 'all' || c.status === status;

  return matchQuery && matchCategory && matchStatus;
 });

 renderTable(filtered);
}

// Image upload preview
function previewImage(event) {
 const file = event.target.files[0];
 if (file) {
  const reader = new FileReader();
  reader.onload = function(e) {
   document.getElementById('imagePreview').src = e.target.result;
   document.getElementById('previewContainer').classList.remove('hidden');
  };
  reader.readAsDataURL(file);
 }
}

function resetImagePreview() {
 document.getElementById('previewContainer').classList.add('hidden');
 document.getElementById('imagePreview').src = '';
}

// Submit complaint form
async function submitComplaint(e) {
 e.preventDefault();
 const form = document.getElementById('complaintForm');
 const btn = document.getElementById('btnSubmit');

 btn.disabled = true;
 btn.innerHTML = `<span class="animate-spin mr-2">&#9696;</span> Submitting...`;

 try {
  const formData = new FormData(form);

  const res = await fetch('/api/complaints', {
   method: 'POST',
   body: formData
  });

  const result = await res.json();
  if (result.success) {
   latestCreatedTicket = result.data;
   showToast(`Success! Complaint ticket ${result.data.id} has been submitted.`);

   const popupModal = document.getElementById('submissionSuccessModal');
   if (popupModal) {
    if (document.getElementById('popupTicketId')) document.getElementById('popupTicketId').innerText = result.data.id;
    if (document.getElementById('popupReporter')) document.getElementById('popupReporter').innerText = result.data.reporterName || 'Reporter';
    if (document.getElementById('popupCategory')) document.getElementById('popupCategory').innerText = result.data.category || 'Facility Issue';
    if (document.getElementById('popupLocation')) document.getElementById('popupLocation').innerText = `${result.data.building || ''}${result.data.room ? ', ' + result.data.room : ''}`;
    if (document.getElementById('popupDescription')) document.getElementById('popupDescription').innerText = `"${result.data.description || ''}"`;
    popupModal.classList.remove('hidden');
   } else {
    showTicketInTracker(result.data.id, result.data);
   }

   form.reset();
   resetImagePreview();
   loadStats();
  } else {
   showToast(result.message || 'Failed to submit complaint.', 'error');
  }
 } catch (err) {
  showToast('Network error while submitting complaint.', 'error');
 } finally {
  btn.disabled = false;
  btn.innerHTML = `<span>Submit Complaint</span><svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>`;
 }
}

// Detail & Status Modal
function openDetail(id) {
 const complaint = currentComplaints.find(c => c.id === id);
 if (!complaint) return;

 activeTicketId = complaint.id;
 currentSelectedStatus = complaint.status;

 document.getElementById('modalTicketId').innerText = complaint.id;
 document.getElementById('modalTitle').innerText = complaint.category;
 document.getElementById('modalReporter').innerText = complaint.reporterName;
 document.getElementById('modalEmail').innerText = complaint.reporterEmail || '-';
 document.getElementById('modalBuilding').innerText = complaint.building;
 document.getElementById('modalRoom').innerText = complaint.room || '-';
 document.getElementById('modalDescription').innerText = complaint.description;
 document.getElementById('modalStaffNotes').value = complaint.staffNotes || '';
 
 const techSelect = document.getElementById('modalTechnician');
 if (techSelect) {
  techSelect.value = complaint.assignedTechnician || 'Unassigned';
 }

 const photoWrapper = document.getElementById('modalPhotoWrapper');
 const photoElem = document.getElementById('modalPhoto');
 if (complaint.photoUrl) {
  photoElem.src = complaint.photoUrl;
  photoWrapper.classList.remove('hidden');
 } else {
  photoWrapper.classList.add('hidden');
 }

 document.getElementById('detailModal').classList.remove('hidden');
}

function closeModal() {
 document.getElementById('detailModal').classList.add('hidden');
 activeTicketId = null;
}

function updateStatus(status) {
 currentSelectedStatus = status;
 showToast(`Selected status: ${status}`);
}

async function saveStatusUpdate() {
 if (!activeTicketId) return;

 const staffNotes = document.getElementById('modalStaffNotes').value;
 const assignedTechnician = document.getElementById('modalTechnician').value;

 try {
  const res = await fetch(`/api/complaints/${activeTicketId}/status`, {
   method: 'PATCH',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({
    status: currentSelectedStatus,
    staffNotes,
    assignedTechnician
   })
  });

  const result = await res.json();
  if (result.success) {
   showToast(`Ticket ${activeTicketId} updated (${currentSelectedStatus} | ${assignedTechnician})!`);
   closeModal();
   loadComplaints();
  } else {
   showToast(result.message || 'Failed to update status.', 'error');
  }
 } catch (err) {
  showToast('Failed to connect to server.', 'error');
 }
}

// Sprint 2 Change Request Features
function filterByUrgentOnly() {
 const urgentTickets = currentComplaints.filter(c => c.priority === 'Urgent');
 renderTable(urgentTickets);
 showToast(`Filtered: Displaying ${urgentTickets.length} urgent hazard tickets only.`);
}

function exportToCSV() {
 if (!currentComplaints || currentComplaints.length === 0) {
  showToast('No complaints data available to export.', 'error');
  return;
 }

 const headers = ['Ticket ID', 'Reporter', 'Email', 'Building', 'Room', 'Category', 'Priority', 'Status', 'Assigned Technician', 'Description', 'Submitted Date'];
 const rows = currentComplaints.map(c => [
  `"${c.id}"`,
  `"${c.reporterName}"`,
  `"${c.reporterEmail || ''}"`,
  `"${c.building}"`,
  `"${c.room || ''}"`,
  `"${c.category}"`,
  `"${c.priority}"`,
  `"${c.status}"`,
  `"${c.assignedTechnician || 'Unassigned'}"`,
  `"${c.description.replace(/"/g, '""')}"`,
  `"${new Date(c.createdAt).toISOString()}"`
 ]);

 const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
 const encodedUri = encodeURI(csvContent);
 const link = document.createElement('a');
 link.setAttribute('href', encodedUri);
 link.setAttribute('download', `CampusFix_Maintenance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);

 showToast('Maintenance CSV Report exported successfully!');
}

// Toast notification helper
function showToast(msg, type = 'success') {
 const toast = document.getElementById('toast');
 const toastMsg = document.getElementById('toastMsg');
 const toastIcon = document.getElementById('toastIcon');

 toastMsg.innerText = msg;
 if (type === 'error') {
  toastIcon.innerHTML = '&#9888;';
  toast.className = 'fixed bottom-6 right-6 max-w-sm bg-rose-600 text-white px-5 py-3.5 rounded-xl shadow-xl z-50 flex items-center space-x-3 transition-opacity';
 } else {
  toastIcon.innerHTML = '&#10003;';
  toast.className = 'fixed bottom-6 right-6 max-w-sm bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-xl z-50 flex items-center space-x-3 transition-opacity';
 }

 toast.classList.remove('hidden');
 setTimeout(() => {
  toast.classList.add('hidden');
 }, 3500);
}
