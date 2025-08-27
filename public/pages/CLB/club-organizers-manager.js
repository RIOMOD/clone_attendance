/**
 * Club Organizers Manager - Quản lý ban tổ chức CLB
 * Version: 2.0
 * Author: CTSV Development Team
 */

class OrganizersManager {
    constructor() {
        this.organizers = [];
        this.currentOrganizerId = null;
        this.init();
    }

    init() {
        this.loadOrganizers();
        this.setupEventListeners();
        this.initializeDashboard();
        console.log('OrganizersManager initialized');
    }

    // Dashboard Initialization
    initializeDashboard() {
        this.setupMobileMenu();
        this.setupSearch();
        this.setupUserMenu();
        this.setupFilters();
        this.setupExportButtons();
        this.loadStatistics();
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.querySelector('.sidebar');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('globalSearch');
        const searchBtn = document.getElementById('searchBtn');
        const searchResults = document.getElementById('searchResults');

        if (searchInput && searchBtn) {
            let searchTimeout;

            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();

                if (query.length < 2) {
                    this.hideSearchResults();
                    return;
                }

                searchTimeout = setTimeout(() => {
                    this.performSearch(query);
                }, 300);
            });

            searchBtn.addEventListener('click', () => {
                const query = searchInput.value.trim();
                if (query) {
                    this.performSearch(query);
                }
            });

            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                    this.hideSearchResults();
                }
            });
        }
    }

    setupUserMenu() {
        const userMenu = document.getElementById('userMenu');
        const userDropdown = document.getElementById('userDropdown');

        if (userMenu && userDropdown) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                userDropdown.classList.remove('show');
            });
        }
    }

    setupFilters() {
        const filterBtn = document.getElementById('organizersFilter');
        const filterSection = document.getElementById('organizersFilterSection');

        if (filterBtn && filterSection) {
            filterBtn.addEventListener('click', () => {
                filterSection.style.display = filterSection.style.display === 'none' ? 'block' : 'none';
            });
        }

        // Filter event listeners
        const positionFilter = document.getElementById('positionFilter');
        const statusFilter = document.getElementById('statusFilter');

        if (positionFilter) {
            positionFilter.addEventListener('change', () => this.applyFilters());
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    setupExportButtons() {
        const exportBtns = document.querySelectorAll('.export-btn');
        exportBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                this.exportData(type);
            });
        });
    }

    setupEventListeners() {
        // Stats cards click events
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', () => {
                const statType = card.dataset.stat;
                this.showStatDetail(statType);
            });
        });

        // Refresh buttons
        const refreshBtn = document.getElementById('refreshOrganizers');
        const refreshListBtn = document.getElementById('refreshOrganizersList');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }
        if (refreshListBtn) {
            refreshListBtn.addEventListener('click', () => this.refreshData());
        }

        // Tab functionality for detail modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.switchTab(e.target.dataset.tab);
            }
        });
    }

    // Data Management
    loadOrganizers() {
        // Simulate loading organizers data
        this.organizers = [
            {
                id: 'org1',
                name: 'Nguyễn Văn A',
                studentId: 'SV2024001',
                email: 'nguyenvana@ctsv.edu.vn',
                phone: '0123456789',
                class: 'CNTT2024A',
                club: 'tech',
                clubName: 'CLB Công nghệ',
                position: 'president',
                positionName: 'Chủ tịch',
                status: 'active',
                startDate: '2024-09-01',
                endDate: '2025-08-31',
                avatar: '../../assets/images/avata/avata_admin.jpg',
                description: 'Lãnh đạo và điều hành hoạt động của CLB',
                responsibilities: [
                    'Lãnh đạo và điều hành hoạt động của CLB',
                    'Chủ trì các cuộc họp ban tổ chức',
                    'Đại diện CLB trong các hoạt động chính thức'
                ],
                activities: [
                    {
                        date: '2024-11-15',
                        title: 'Tổ chức Hackathon 2024',
                        description: 'Chủ trì tổ chức sự kiện lập trình lớn nhất trong năm'
                    },
                    {
                        date: '2024-11-01',
                        title: 'Họp ban tổ chức tháng 11',
                        description: 'Điều hành cuộc họp định kỳ hàng tháng'
                    }
                ],
                performance: {
                    meetingAttendance: 95,
                    eventsOrganized: 12,
                    rating: 5
                }
            },
            // Add more organizers data...
        ];
    }

    loadStatistics() {
        // Update statistics display
        const stats = {
            presidents: 18,
            organizers: 72,
            candidates: 8,
            vacantPositions: 3
        };

        // Update stat cards would go here
    }

    // Search Functionality
    performSearch(query) {
        const results = this.organizers.filter(org =>
            org.name.toLowerCase().includes(query.toLowerCase()) ||
            org.studentId.toLowerCase().includes(query.toLowerCase()) ||
            org.clubName.toLowerCase().includes(query.toLowerCase()) ||
            org.positionName.toLowerCase().includes(query.toLowerCase())
        );

        this.showSearchResults(results);
    }

    showSearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">Không tìm thấy kết quả</div>';
        } else {
            searchResults.innerHTML = results.map(org => `
                <div class="search-result-item" onclick="organizersManager.viewOrganizer('${org.id}')">
                    <img src="${org.avatar}" alt="${org.name}">
                    <div class="result-info">
                        <div class="result-name">${org.name}</div>
                        <div class="result-details">${org.positionName} - ${org.clubName}</div>
                    </div>
                </div>
            `).join('');
        }

        searchResults.style.display = 'block';
    }

    hideSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    // Filter Functionality
    applyFilters() {
        const positionFilter = document.getElementById('positionFilter')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';

        let filteredOrganizers = this.organizers;

        if (positionFilter) {
            filteredOrganizers = filteredOrganizers.filter(org => org.position === positionFilter);
        }

        if (statusFilter) {
            filteredOrganizers = filteredOrganizers.filter(org => org.status === statusFilter);
        }

        this.displayFilteredOrganizers(filteredOrganizers);
    }

    displayFilteredOrganizers(organizers) {
        // Update the display with filtered organizers
        console.log('Displaying filtered organizers:', organizers.length);
    }

    // Modal Management
    openAppointModal(clubId = '') {
        const modal = document.getElementById('appointModal');
        const clubSelect = document.getElementById('appointClub');

        if (clubId && clubSelect) {
            clubSelect.value = clubId;
        }

        this.showModal('appointModal');
    }

    openPermissionsModal() {
        this.showModal('permissionsModal');
    }

    viewOrganizer(organizerId) {
        const organizer = this.organizers.find(org => org.id === organizerId);
        if (!organizer) return;

        this.currentOrganizerId = organizerId;
        this.populateOrganizerDetail(organizer);
        this.showModal('organizerDetailModal');
    }

    editOrganizer(organizerId) {
        const organizer = this.organizers.find(org => org.id === organizerId);
        if (!organizer) return;

        this.currentOrganizerId = organizerId;
        this.populateEditForm(organizer);
        this.showModal('editOrganizerModal');
    }

    removeOrganizer(organizerId) {
        const organizer = this.organizers.find(org => org.id === organizerId);
        if (!organizer) return;

        if (confirm(`Bạn có chắc chắn muốn miễn nhiệm ${organizer.name} khỏi chức vụ ${organizer.positionName}?`)) {
            this.processRemoval(organizerId);
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Form Handlers
    populateOrganizerDetail(organizer) {
        document.getElementById('detailName').textContent = organizer.name;
        document.getElementById('detailStudentId').textContent = organizer.studentId;
        document.getElementById('detailEmail').textContent = organizer.email;
        document.getElementById('detailPhone').textContent = organizer.phone;
        document.getElementById('detailClass').textContent = organizer.class;
        document.getElementById('detailClub').textContent = organizer.clubName;
        document.getElementById('detailStartDate').textContent = new Date(organizer.startDate).toLocaleDateString('vi-VN');
        document.getElementById('detailEndDate').textContent = new Date(organizer.endDate).toLocaleDateString('vi-VN');

        // Populate role badge
        const roleElement = document.getElementById('detailRole');
        roleElement.innerHTML = `<span class="role-badge ${organizer.position}">${organizer.positionName}</span>`;

        // Populate responsibilities
        const responsibilitiesContainer = document.getElementById('detailResponsibilities');
        responsibilitiesContainer.innerHTML = organizer.responsibilities.map(resp => `
            <div class="responsibility-item">
                <i class="fas fa-check-circle"></i>
                <span>${resp}</span>
            </div>
        `).join('');

        // Populate activities
        const activitiesContainer = document.getElementById('detailActivities');
        activitiesContainer.innerHTML = organizer.activities.map(activity => `
            <div class="activity-item">
                <div class="activity-date">${new Date(activity.date).toLocaleDateString('vi-VN')}</div>
                <div class="activity-content">
                    <h5>${activity.title}</h5>
                    <p>${activity.description}</p>
                </div>
            </div>
        `).join('');
    }

    populateEditForm(organizer) {
        document.getElementById('editOrgName').value = organizer.name;
        document.getElementById('editOrgStudentId').value = organizer.studentId;
        document.getElementById('editOrgPosition').value = organizer.position;
        document.getElementById('editOrgStatus').value = organizer.status;
        document.getElementById('editOrgStartDate').value = organizer.startDate;
        document.getElementById('editOrgEndDate').value = organizer.endDate;
        document.getElementById('editOrgDescription').value = organizer.description || '';
    }

    processAppointment() {
        const form = document.getElementById('appointForm');
        const formData = new FormData(form);

        this.showLoading();

        // Simulate API call
        setTimeout(() => {
            this.hideLoading();
            this.showToast('Bổ nhiệm thành công!', 'success');
            this.closeModal('appointModal');
            this.refreshData();
        }, 2000);
    }

    updateOrganizer() {
        const form = document.getElementById('editOrganizerForm');
        const formData = new FormData(form);

        this.showLoading();

        // Simulate API call
        setTimeout(() => {
            this.hideLoading();
            this.showToast('Cập nhật thành công!', 'success');
            this.closeModal('editOrganizerModal');
            this.refreshData();
        }, 2000);
    }

    processRemoval(organizerId) {
        this.showLoading();

        // Simulate API call
        setTimeout(() => {
            this.hideLoading();
            this.showToast('Miễn nhiệm thành công!', 'success');
            this.refreshData();
        }, 2000);
    }

    savePermissions() {
        this.showLoading();

        // Simulate API call
        setTimeout(() => {
            this.hideLoading();
            this.showToast('Lưu quyền thành công!', 'success');
            this.closeModal('permissionsModal');
        }, 2000);
    }

    // Tab Management
    switchTab(tabName) {
        // Hide all tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab pane
        const targetPane = document.getElementById(tabName + 'Tab');
        if (targetPane) {
            targetPane.classList.add('active');
        }

        // Set active tab button
        const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
    }

    // Utility Functions
    refreshData() {
        this.showLoading();

        setTimeout(() => {
            this.loadOrganizers();
            this.loadStatistics();
            this.hideLoading();
            this.showToast('Dữ liệu đã được làm mới!', 'info');
        }, 1000);
    }

    exportData(type) {
        this.showLoading();

        setTimeout(() => {
            this.hideLoading();
            this.showToast(`Xuất dữ liệu ${type.toUpperCase()} thành công!`, 'success');
        }, 2000);
    }

    showStatDetail(statType) {
        // Handle stat card click - could open detail modal or navigate
        console.log(`Show detail for ${statType}`);
    }

    viewOrgChart() {
        // Open organizational chart view
        this.showToast('Chức năng sơ đồ tổ chức đang được phát triển!', 'info');
    }

    manageTerms() {
        // Open term management
        this.showToast('Chức năng quản lý nhiệm kỳ đang được phát triển!', 'info');
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.organizersManager = new OrganizersManager();
});

// Global functions for backward compatibility
function openAppointModal(clubId) {
    window.organizersManager?.openAppointModal(clubId);
}

function closeModal(modalId) {
    window.organizersManager?.closeModal(modalId);
}
