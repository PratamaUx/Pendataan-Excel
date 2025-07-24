// Global Variables
let dataArray = [];
let filteredData = [];
let editingIndex = -1;

// DOM Elements
const dataForm = document.getElementById('dataForm');
const editForm = document.getElementById('editForm');
const dataTableBody = document.getElementById('dataTableBody');
const searchInput = document.getElementById('searchInput');
const filterKategori = document.getElementById('filterKategori');
const filterStatus = document.getElementById('filterStatus');
const dataCount = document.getElementById('dataCount');
const emptyState = document.getElementById('emptyState');
const editModal = document.getElementById('editModal');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    renderTable();
    setupEventListeners();
    updateDataCount();
});

// Setup Event Listeners
function setupEventListeners() {
    // Form submissions
    dataForm.addEventListener('submit', handleAddData);
    editForm.addEventListener('submit', handleEditData);
    
    // Search and filter
    searchInput.addEventListener('input', handleSearch);
    filterKategori.addEventListener('change', handleFilter);
    filterStatus.addEventListener('change', handleFilter);
    
    // Modal close on outside click
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeEditModal();
        }
    });
}

// Data Management Functions
function handleAddData(e) {
    e.preventDefault();
    
    const formData = new FormData(dataForm);
    const newData = {
        id: Date.now(),
        kategori: document.getElementById('kategori').value,
        klien: document.getElementById('klien').value,
        pic: document.getElementById('pic').value,
        jumlah: parseInt(document.getElementById('jumlah').value),
        noHp: document.getElementById('noHp').value,
        daerah: document.getElementById('daerah').value,
        status: document.getElementById('status').value,
        jamReservasi: document.getElementById('jamReservasi').value,
        show: document.getElementById('show').checked,
        createdAt: new Date().toISOString()
    };
    
    // Validate phone number
    if (!validatePhoneNumber(newData.noHp)) {
        showNotification('Nomor HP tidak valid! Gunakan format 08xxxxxxxxxx', 'error');
        return;
    }
    
    dataArray.push(newData);
    saveDataToStorage();
    renderTable();
    resetForm();
    updateDataCount();
    showNotification('Data berhasil ditambahkan!', 'success');
    
    // Scroll to table
    document.querySelector('.table-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function handleEditData(e) {
    e.preventDefault();
    
    const index = parseInt(document.getElementById('editIndex').value);
    const updatedData = {
        ...dataArray[index],
        kategori: document.getElementById('editKategori').value,
        klien: document.getElementById('editKlien').value,
        pic: document.getElementById('editPic').value,
        jumlah: parseInt(document.getElementById('editJumlah').value),
        noHp: document.getElementById('editNoHp').value,
        daerah: document.getElementById('editDaerah').value,
        status: document.getElementById('editStatus').value,
        jamReservasi: document.getElementById('editJamReservasi').value,
        show: document.getElementById('editShow').checked,
        updatedAt: new Date().toISOString()
    };
    
    // Validate phone number
    if (!validatePhoneNumber(updatedData.noHp)) {
        showNotification('Nomor HP tidak valid! Gunakan format 08xxxxxxxxxx', 'error');
        return;
    }
    
    dataArray[index] = updatedData;
    saveDataToStorage();
    renderTable();
    closeEditModal();
    updateDataCount();
    showNotification('Data berhasil diupdate!', 'success');
}

function deleteData(index) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        const deletedItem = dataArray[index];
        dataArray.splice(index, 1);
        saveDataToStorage();
        renderTable();
        updateDataCount();
        showNotification(`Data ${deletedItem.klien} berhasil dihapus!`, 'success');
    }
}

function editData(index) {
    const data = dataArray[index];
    
    // Populate edit form
    document.getElementById('editIndex').value = index;
    document.getElementById('editKategori').value = data.kategori;
    document.getElementById('editKlien').value = data.klien;
    document.getElementById('editPic').value = data.pic;
    document.getElementById('editJumlah').value = data.jumlah;
    document.getElementById('editNoHp').value = data.noHp;
    document.getElementById('editDaerah').value = data.daerah;
    document.getElementById('editStatus').value = data.status;
    document.getElementById('editJamReservasi').value = data.jamReservasi;
    document.getElementById('editShow').checked = data.show;
    
    // Show modal
    editModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function toggleShow(index) {
    dataArray[index].show = !dataArray[index].show;
    dataArray[index].updatedAt = new Date().toISOString();
    saveDataToStorage();
    renderTable();
    
    const status = dataArray[index].show ? 'ditampilkan' : 'disembunyikan';
    showNotification(`Data ${dataArray[index].klien} ${status}!`, 'info');
}

// Render Functions
function renderTable() {
    // Apply current filters
    applyFilters();
    
    if (filteredData.length === 0) {
        dataTableBody.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.table-container').style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    document.querySelector('.table-container').style.display = 'block';
    
    dataTableBody.innerHTML = filteredData.map((data, index) => {
        const originalIndex = dataArray.findIndex(item => item.id === data.id);
        return `
            <tr class="fade-in">
                <td>${index + 1}</td>
                <td>
                    <span class="category-badge category-${data.kategori.toLowerCase()}">
                        ${data.kategori}
                    </span>
                </td>
                <td>${data.klien}</td>
                <td>${data.pic}</td>
                <td>${data.jumlah} orang</td>
                <td>${formatPhoneNumber(data.noHp)}</td>
                <td>
                    <a href="${generateWhatsAppLink(data.noHp)}" 
                       target="_blank" 
                       class="whatsapp-btn"
                       title="Chat WhatsApp">
                        <i class="fab fa-whatsapp"></i> Chat
                    </a>
                </td>
                <td>${data.daerah}</td>
                <td>
                    <span class="status-badge status-${data.status.toLowerCase()}">
                        ${data.status}
                    </span>
                </td>
                <td>${formatDateTime(data.jamReservasi)}</td>
                <td>
                    <div class="show-toggle ${data.show ? 'active' : ''}" 
                         onclick="toggleShow(${originalIndex})"
                         title="${data.show ? 'Klik untuk sembunyikan' : 'Klik untuk tampilkan'}">
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-primary" 
                                onclick="editData(${originalIndex})"
                                title="Edit data">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn btn-danger" 
                                onclick="deleteData(${originalIndex})"
                                title="Hapus data">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Search and Filter Functions
function handleSearch() {
    applyFilters();
    renderTable();
    updateDataCount();
}

function handleFilter() {
    applyFilters();
    renderTable();
    updateDataCount();
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const kategoriFilter = filterKategori.value;
    const statusFilter = filterStatus.value;
    
    filteredData = dataArray.filter(data => {
        const matchesSearch = !searchTerm || 
            data.klien.toLowerCase().includes(searchTerm) ||
            data.pic.toLowerCase().includes(searchTerm) ||
            data.daerah.toLowerCase().includes(searchTerm) ||
            data.noHp.includes(searchTerm);
            
        const matchesKategori = !kategoriFilter || data.kategori === kategoriFilter;
        const matchesStatus = !statusFilter || data.status === statusFilter;
        
        return matchesSearch && matchesKategori && matchesStatus;
    });
}

// Utility Functions
function validatePhoneNumber(phone) {
    // Indonesian phone number validation
    const phoneRegex = /^(\+62|62|0)[8][1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

function formatPhoneNumber(phone) {
    // Format phone number for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('62')) {
        return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
        return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return phone;
}

function generateWhatsAppLink(phone) {
    // Clean phone number and convert to international format
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
        cleanPhone = '62' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('62')) {
        cleanPhone = '62' + cleanPhone;
    }
    
    const message = encodeURIComponent('Halo, saya ingin menanyakan tentang reservasi JCS.');
    return `https://wa.me/${cleanPhone}?text=${message}`;
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
    };
    return date.toLocaleDateString('id-ID', options);
}

// Form Functions
function resetForm() {
    dataForm.reset();
    document.getElementById('show').checked = true;
    showNotification('Form berhasil direset!', 'info');
}

function toggleForm() {
    const formSection = document.querySelector('.form-section');
    const toggleBtn = document.querySelector('.toggle-form-btn i');
    
    formSection.classList.toggle('form-collapsed');
    
    if (formSection.classList.contains('form-collapsed')) {
        toggleBtn.style.transform = 'rotate(180deg)';
    } else {
        toggleBtn.style.transform = 'rotate(0deg)';
    }
}

// Modal Functions
function closeEditModal() {
    editModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    editForm.reset();
}

// Storage Functions
function saveDataToStorage() {
    try {
        localStorage.setItem('jcsDataApp', JSON.stringify(dataArray));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showNotification('Gagal menyimpan data ke storage!', 'error');
    }
}

function loadDataFromStorage() {
    try {
        const savedData = localStorage.getItem('jcsDataApp');
        if (savedData) {
            dataArray = JSON.parse(savedData);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        showNotification('Gagal memuat data dari storage!', 'error');
        dataArray = [];
    }
}

// Export Functions

// Export Functions
async function exportData() {
    if (dataArray.length === 0) {
        showNotification("Tidak ada data untuk diekspor!", "warning");
        return;
    }

    try {
        showNotification("Mengekspor data ke Excel...", "info");
        const response = await fetch("http://localhost:5000/export-excel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataArray),
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "data-pendaftaran-jcs.xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            showNotification("Data berhasil diekspor ke Excel!", "success");
        } else {
            const errorText = await response.text();
            showNotification(`Gagal mengekspor data: ${errorText}`, "error");
        }
    } catch (error) {
        console.error("Error exporting data:", error);
        showNotification(`Terjadi kesalahan saat mengekspor data: ${error.message}`, "error");
    }
}


// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#38a169',
        error: '#e53e3e',
        warning: '#d69e2e',
        info: '#3182ce'
    };
    return colors[type] || '#3182ce';
}

// Update Data Count
function updateDataCount() {
    const totalData = filteredData.length;
    dataCount.textContent = totalData;
    
    // Update table header info
    const tableHeader = document.querySelector('.table-header h3');
    if (searchInput.value || filterKategori.value || filterStatus.value) {
        tableHeader.innerHTML = `<i class="fas fa-table"></i> Data Pendaftaran (${totalData} dari ${dataArray.length} data)`;
    } else {
        tableHeader.innerHTML = `<i class="fas fa-table"></i> Data Pendaftaran`;
    }
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        margin-left: auto;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Sample Data for Testing (uncomment to add sample data)
/*
function addSampleData() {
    const sampleData = [
        {
            id: 1,
            kategori: 'VIP',
            klien: 'PT. Maju Jaya',
            pic: 'Budi Santoso',
            jumlah: 5,
            noHp: '081234567890',
            daerah: 'Jakarta',
            status: 'Confirmed',
            jamReservasi: '2024-01-15T10:00',
            show: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            kategori: 'Regular',
            klien: 'CV. Berkah',
            pic: 'Siti Aminah',
            jumlah: 3,
            noHp: '082345678901',
            daerah: 'Bandung',
            status: 'Pending',
            jamReservasi: '2024-01-16T14:30',
            show: true,
            createdAt: new Date().toISOString()
        }
    ];
    
    dataArray = sampleData;
    saveDataToStorage();
    renderTable();
    updateDataCount();
}
*/

