let currentComplaints = [];
let activeTicketId = null;
let currentSelectedStatus = null;

document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadComplaints();
});

// Switch between Form and List tabs
function switchView(viewName) {
  const formView = document.getElementById('viewForm');
  const listView = document.getElementById('viewList');
  const navTabForm = document.getElementById('navTabForm');
  const navTabList = document.getElementById('navTabList');

  if (viewName === 'form') {
    formView.classList.remove('hidden');
    listView.classList.add('hidden');

    navTabForm.className = 'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all bg-blue-600 text-white shadow-sm';
    navTabList.className = 'px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all';
  } else {
    formView.classList.add('hidden');
    listView.classList.remove('hidden');

    navTabList.className = 'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all bg-blue-600 text-white shadow-sm';
    navTabForm.className = 'px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all';
    loadComplaints();
  }
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
  tbody.innerHTML = complaints.map(c => {
    let statusClass = 'badge-submitted';
    if (c.status === 'In Progress') statusClass = 'badge-inprogress';
    if (c.status === 'Resolved') statusClass = 'badge-resolved';

    let priorityBadge = '';
    if (c.priority === 'Urgent' || c.priority === 'Mendesak') {
      priorityBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">Urgent</span>';
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
      showToast(`Success! Complaint ticket ${result.data.id} has been submitted.`);
      form.reset();
      resetImagePreview();
      loadStats();
      setTimeout(() => {
        switchView('list');
      }, 1000);
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

  try {
    const res = await fetch(`/api/complaints/${activeTicketId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: currentSelectedStatus,
        staffNotes
      })
    });

    const result = await res.json();
    if (result.success) {
      showToast(`Ticket ${activeTicketId} status updated to ${currentSelectedStatus}!`);
      closeModal();
      loadComplaints();
    } else {
      showToast(result.message || 'Failed to update status.', 'error');
    }
  } catch (err) {
    showToast('Failed to connect to server.', 'error');
  }
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
