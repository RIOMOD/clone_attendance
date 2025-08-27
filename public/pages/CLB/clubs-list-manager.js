// Enhanced Clubs List Manager
class EnhancedClubsManager {
    constructor() {
        this.clubs = [];
        this.filteredClubs = [];
        this.selectedClubs = [];
        this.sortColumn = '';
        this.sortDirection = 'asc';
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.init();
    }

    init() {
        this.loadClubsData();
        this.setupEventListeners();
        this.setupNotificationSystem();
        this.setupModalSystem();
    }

    loadClubsData() {
        // Mock data - replace with API call
        this.clubs = [
            {
                id: 'CK001',
                name: 'Code King',
                description: 'Câu lạc bộ lập trình',
                category: 'technology',
                members: 45,
                president: 'Nguyễn Văn A',
                status: 'active',
                founded: 2020,
                email: 'codeking@club.com',
                phone: '0123456789',
                logo: '../../assets/images/imageCLB/LOGO_CODEKING/LOGO CODEKING.png'
            },
            {
                id: 'MC002',
                name: 'Music Club',
                description: 'Câu lạc bộ âm nhạc',
                category: 'art',
                members: 32,
                president: 'Trần Thị B',
                status: 'active',
                founded: 2019,
                email: 'music@club.com',
                phone: '0123456790',
                logo: '../../assets/images/imageCLB/LOGO_CODEKING/LOGO CODEKING.png'
            },
            {
                id: 'GF003',
                name: 'Green Future',
                description: 'Câu lạc bộ tình nguyện môi trường',
                category: 'volunteer',
                members: 28,
                president: 'Lê Văn C',
                status: 'active',
                founded: 2021,
                email: 'green@club.com',
                phone: '0123456791',
                logo: '../../assets/images/imageCLB/LOGO_CODEKING/LOGO CODEKING.png'
            }
        ];

        this.filteredClubs = [...this.clubs];
        this.updateStats();
        this.renderTable();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchClub');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.filterClubs();
            }, 300));
        }

        // Filter dropdowns
        ['categoryFilter', 'statusFilter', 'membersFilter', 'academicYear'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.filterClubs());
            }
        });

        // Table header click for sorting
        document.querySelectorAll('[onclick*="sortTable"]').forEach(th => {
            th.addEventListener('click', (e) => {
                const column = th.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.sortTable(column);
            });
        });

        // Bulk selection
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.querySelector('.sidebar');
        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // User menu dropdown
        const userMenu = document.getElementById('userMenu');
        const userDropdown = document.getElementById('userDropdown');
        if (userMenu && userDropdown) {
            userMenu.addEventListener('click', () => {
                userDropdown.classList.toggle('show');
                userMenu.classList.toggle('active');
            });
        }

        // Notification panel
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationPanel = document.getElementById('notificationPanel');
        if (notificationBtn && notificationPanel) {
            notificationBtn.addEventListener('click', () => {
                notificationPanel.classList.toggle('show');
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenu?.contains(e.target)) {
                userDropdown?.classList.remove('show');
                userMenu?.classList.remove('active');
            }
            if (!notificationBtn?.contains(e.target) && !notificationPanel?.contains(e.target)) {
                notificationPanel?.classList.remove('show');
            }
        });
    }

    setupNotificationSystem() {
        this.notificationContainer = document.getElementById('notifications') || this.createNotificationContainer();
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notifications';
        container.style.cssText = `
            position: fixed;
            top: var(--space-6);
            right: var(--space-6);
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(container);
        return container;
    }

    setupModalSystem() {
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal(e.target.id);
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay.show');
                if (openModal) {
                    this.closeModal(openModal.id);
                }
            }
        });

        // Form submission
        const createForm = document.getElementById('createClubForm');
        if (createForm) {
            createForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreateClub(new FormData(createForm));
            });
        }
    }

    updateStats() {
        const stats = {
            totalClubs: this.clubs.length,
            activeClubs: this.clubs.filter(club => club.status === 'active').length,
            totalMembers: this.clubs.reduce((sum, club) => sum + club.members, 0),
            newClubs: this.clubs.filter(club => club.founded === new Date().getFullYear()).length
        };

        // Update stat cards
        Object.keys(stats).forEach(key => {
            const element = document.querySelector(`[data-stat="${key}"] h3`);
            if (element) {
                element.textContent = stats[key];
            }
        });
    }

    filterClubs() {
        const searchTerm = document.getElementById('searchClub')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const membersFilter = document.getElementById('membersFilter')?.value || '';

        this.filteredClubs = this.clubs.filter(club => {
            const matchesSearch = club.name.toLowerCase().includes(searchTerm) ||
                club.description.toLowerCase().includes(searchTerm) ||
                club.president.toLowerCase().includes(searchTerm);

            const matchesCategory = !categoryFilter || club.category === categoryFilter;
            const matchesStatus = !statusFilter || club.status === statusFilter;

            let matchesMembers = true;
            if (membersFilter) {
                switch (membersFilter) {
                    case 'small':
                        matchesMembers = club.members < 10;
                        break;
                    case 'medium':
                        matchesMembers = club.members >= 10 && club.members <= 30;
                        break;
                    case 'large':
                        matchesMembers = club.members > 30;
                        break;
                }
            }

            return matchesSearch && matchesCategory && matchesStatus && matchesMembers;
        });

        this.currentPage = 1;
        this.renderTable();
        this.updatePagination();
    }

    sortTable(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.filteredClubs.sort((a, b) => {
            let aValue = a[column];
            let bValue = b[column];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (this.sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        this.renderTable();
        this.updateSortIndicators(column);
    }

    updateSortIndicators(column) {
        // Remove all sort indicators
        document.querySelectorAll('.clubs-table th i').forEach(icon => {
            icon.className = 'fas fa-sort';
        });

        // Add sort indicator to current column
        const th = document.querySelector(`[onclick*="'${column}'"] i`);
        if (th) {
            th.className = `fas fa-sort-${this.sortDirection === 'asc' ? 'up' : 'down'}`;
        }
    }

    renderTable() {
        const tbody = document.querySelector('#clubsTable tbody');
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedClubs = this.filteredClubs.slice(startIndex, endIndex);

        if (paginatedClubs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-state">
                        <div class="empty-state-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <h3>Không tìm thấy câu lạc bộ</h3>
                        <p>Thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = paginatedClubs.map(club => `
            <tr data-club-id="${club.id}">
                <td>
                    <div class="club-name-cell">
                        <img src="${club.logo}" alt="${club.name}" class="club-logo">
                        <div>
                            <div class="club-name">${club.name}</div>
                            <div class="club-description">${club.description}</div>
                        </div>
                    </div>
                </td>
                <td><span class="club-code">${club.id}</span></td>
                <td><span class="category-tag ${club.category}">${this.getCategoryLabel(club.category)}</span></td>
                <td><strong>${club.members}</strong></td>
                <td>${club.president}</td>
                <td><span class="status-badge ${club.status}">${this.getStatusLabel(club.status)}</span></td>
                <td>${club.founded}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action view" onclick="clubsManager.viewClub('${club.id}')" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action edit" onclick="clubsManager.editClub('${club.id}')" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action delete" onclick="clubsManager.deleteClub('${club.id}')" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredClubs.length / this.itemsPerPage);
        const paginationInfo = document.querySelector('.pagination-info');
        const pagination = document.querySelector('.pagination');

        if (paginationInfo) {
            const start = (this.currentPage - 1) * this.itemsPerPage + 1;
            const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredClubs.length);
            paginationInfo.textContent = `Hiển thị ${start}-${end} trong tổng ${this.filteredClubs.length} câu lạc bộ`;
        }

        if (pagination) {
            pagination.innerHTML = `
                <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                        onclick="clubsManager.goToPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </button>
                ${this.generatePageNumbers(totalPages)}
                <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                        onclick="clubsManager.goToPage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }
    }

    generatePageNumbers(totalPages) {
        let pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const half = Math.floor(maxVisible / 2);
            let start = Math.max(1, this.currentPage - half);
            let end = Math.min(totalPages, start + maxVisible - 1);

            if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }

        return pages.map(page =>
            `<button class="pagination-btn ${page === this.currentPage ? 'active' : ''}" 
                     onclick="clubsManager.goToPage(${page})">${page}</button>`
        ).join('');
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredClubs.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderTable();
            this.updatePagination();
        }
    }

    getCategoryLabel(category) {
        const labels = {
            technology: 'Công nghệ',
            sport: 'Thể thao',
            art: 'Nghệ thuật',
            academic: 'Học thuật',
            volunteer: 'Tình nguyện'
        };
        return labels[category] || category;
    }

    getStatusLabel(status) {
        const labels = {
            active: 'Hoạt động',
            inactive: 'Tạm dừng',
            pending: 'Chờ phê duyệt'
        };
        return labels[status] || status;
    }

    // Modal management
    openCreateClubModal() {
        this.showModal('createClubModal');
    }

    viewClub(clubId) {
        const club = this.clubs.find(c => c.id === clubId);
        if (!club) return;

        const content = `
            <div style="text-align: center; margin-bottom: var(--space-6);">
                <img src="${club.logo}" alt="Club Logo" 
                     style="width: 80px; height: 80px; border-radius: var(--radius-xl); object-fit: cover; border: 3px solid var(--border-color);">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                <div>
                    <strong>Tên CLB:</strong> ${club.name}<br>
                    <strong>Mã CLB:</strong> ${club.id}<br>
                    <strong>Loại:</strong> ${this.getCategoryLabel(club.category)}<br>
                    <strong>Thành viên:</strong> ${club.members} người
                </div>
                <div>
                    <strong>Chủ nhiệm:</strong> ${club.president}<br>
                    <strong>Trạng thái:</strong> <span class="status-badge ${club.status}">${this.getStatusLabel(club.status)}</span><br>
                    <strong>Thành lập:</strong> ${club.founded}<br>
                    <strong>Email:</strong> ${club.email}
                </div>
            </div>
            <div style="margin-top: var(--space-4);">
                <strong>Mô tả:</strong><br>
                <p style="margin-top: var(--space-2); color: var(--text-secondary); line-height: 1.6;">
                    ${club.description}
                </p>
            </div>
        `;

        document.getElementById('viewClubContent').innerHTML = content;
        this.showModal('viewClubModal');
    }

    editClub(clubId) {
        console.log('Editing club:', clubId);
        this.showNotification('Chức năng chỉnh sửa đang được phát triển', 'info');
    }

    deleteClub(clubId) {
        if (confirm('Bạn có chắc chắn muốn xóa câu lạc bộ này?')) {
            this.clubs = this.clubs.filter(club => club.id !== clubId);
            this.filterClubs();
            this.updateStats();
            this.showNotification('Xóa CLB thành công!', 'success');
        }
    }

    handleCreateClub(formData) {
        const newClub = {
            id: this.generateClubId(),
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            members: 0,
            president: formData.get('president'),
            status: 'pending',
            founded: new Date().getFullYear(),
            email: formData.get('email'),
            phone: formData.get('phone'),
            logo: '../../assets/images/imageCLB/LOGO_CODEKING/LOGO CODEKING.png'
        };

        this.clubs.unshift(newClub);
        this.filterClubs();
        this.updateStats();
        this.closeModal('createClubModal');
        this.showNotification('Tạo CLB thành công!', 'success');
    }

    generateClubId() {
        const maxId = Math.max(...this.clubs.map(club => parseInt(club.id.slice(-3))));
        return `CLB${String(maxId + 1).padStart(3, '0')}`;
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} show`;
        notification.textContent = message;

        const styles = {
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            color: 'white',
            fontWeight: '600',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            zIndex: '9999',
            transform: 'translateX(0)',
            transition: 'transform 0.3s ease',
            pointerEvents: 'auto'
        };

        const typeColors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#06b6d4'
        };

        Object.assign(notification.style, styles);
        notification.style.background = typeColors[type] || typeColors.info;

        this.notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    clearFilters() {
        document.getElementById('searchClub').value = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('membersFilter').value = '';
        document.getElementById('academicYear').value = '2024-2025';
        this.filterClubs();
    }

    exportData(type) {
        if (type === 'pdf') {
            this.showNotification('Đang xuất PDF...', 'info');
            // Implement PDF export
        } else if (type === 'excel') {
            this.showNotification('Đang xuất Excel...', 'info');
            // Implement Excel export
        }
    }

    refreshData() {
        this.showNotification('Đang tải lại dữ liệu...', 'info');
        setTimeout(() => {
            this.loadClubsData();
            this.showNotification('Dữ liệu đã được cập nhật!', 'success');
        }, 1000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.clubsManager = new EnhancedClubsManager();

    // Global functions for backward compatibility
    window.filterClubs = () => clubsManager.filterClubs();
    window.clearFilters = () => clubsManager.clearFilters();
    window.sortTable = (column) => clubsManager.sortTable(column);
    window.handleKeyPress = (event, column) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            clubsManager.sortTable(column);
        }
    };
    window.toggleView = () => console.log('Toggle view functionality');
    window.editCurrentClub = () => console.log('Edit current club functionality');
});
