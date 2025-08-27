/**
 * CLB CLUBS PAGE - DASHBOARD SYNCHRONIZED JAVASCRIPT
 * Enhanced with dashboard functionality and CLB-specific features for clubs management
 */

// Import dashboard utilities if available
if (typeof dashboard === 'undefined') {
    window.dashboard = {};
}

class CLBClubsManager {
    constructor() {
        this.clubs = [];
        this.categories = [];
        this.events = [];
        this.topClubs = [];
        this.currentFilter = 'all';
        this.currentView = 'list';
        this.currentUser = {
            id: 'user001',
            name: 'Admin User',
            role: 'admin'
        };

        this.init();
    }

    init() {
        this.loadData();
        this.initEventListeners();
        this.initSearch();
        this.updateStats();
        this.initCharts();
        this.startAutoRefresh();
    }

    // Dashboard Integration Functions
    initEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Quick add button
        const quickAdd = document.getElementById('quickAdd');
        if (quickAdd) {
            quickAdd.addEventListener('click', () => this.showQuickAddMenu());
        }

        // Notification button
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.toggleNotifications());
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshClubs');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        // Export buttons
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.closest('.export-btn').dataset.type;
                this.exportData(type);
            });
        });

        // Category filters
        document.querySelectorAll('[data-category]').forEach(item => {
            item.addEventListener('click', (e) => {
                const category = e.target.closest('[data-category]').dataset.category;
                this.filterByCategory(category);
            });
        });

        // Tab filters
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterByStatus(filter);
            });
        });

        // View toggle
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Date range selector
        const dateRange = document.getElementById('dateRange');
        if (dateRange) {
            dateRange.addEventListener('change', (e) => this.updateDateRange(e.target.value));
        }

        // Club category selector
        const clubCategory = document.getElementById('clubCategory');
        if (clubCategory) {
            clubCategory.addEventListener('change', (e) => this.filterByCategory(e.target.value));
        }
    }

    // Search functionality
    initSearch() {
        const searchInput = document.getElementById('globalSearch');
        const searchResults = document.getElementById('searchResults');

        if (searchInput && searchResults) {
            let searchTimeout;

            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();

                if (query.length >= 2) {
                    searchTimeout = setTimeout(() => {
                        this.performSearch(query, searchResults);
                    }, 300);
                } else {
                    searchResults.style.display = 'none';
                }
            });

            // Close search results when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-box')) {
                    searchResults.style.display = 'none';
                }
            });
        }
    }

    performSearch(query, resultsContainer) {
        const results = [];

        // Search clubs
        this.clubs.forEach(club => {
            if (club.name.toLowerCase().includes(query.toLowerCase()) ||
                club.description.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    type: 'club',
                    title: club.name,
                    subtitle: club.description,
                    url: `#club-${club.id}`,
                    icon: 'fas fa-users'
                });
            }
        });

        // Search events
        this.events.forEach(event => {
            if (event.title.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    type: 'event',
                    title: event.title,
                    subtitle: event.club,
                    url: `club-events.html#${event.id}`,
                    icon: 'fas fa-calendar'
                });
            }
        });

        this.displaySearchResults(results, resultsContainer);
    }

    displaySearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="search-no-results">Không tìm thấy kết quả</div>';
        } else {
            container.innerHTML = results.map(result => `
                <a href="${result.url}" class="search-result-item">
                    <i class="${result.icon}"></i>
                    <div class="search-result-content">
                        <div class="search-result-title">${result.title}</div>
                        <div class="search-result-subtitle">${result.subtitle}</div>
                    </div>
                </a>
            `).join('');
        }

        container.style.display = 'block';
    }

    // Data loading and management
    loadData() {
        // Mock data - Replace with actual API calls
        this.clubs = [
            {
                id: 'codeking',
                name: 'CodeKing Club',
                code: 'CLB-001',
                description: 'Câu lạc bộ lập trình và phát triển ứng dụng',
                category: 'technology',
                members: 156,
                maxMembers: 200,
                events: 12,
                status: 'active',
                president: 'Nguyễn Văn A',
                foundedDate: '2023-01-15',
                email: 'codeking@ctsv.edu.vn'
            },
            {
                id: 'music',
                name: 'Music & Art Club',
                code: 'CLB-002',
                description: 'Câu lạc bộ âm nhạc và nghệ thuật sáng tạo',
                category: 'culture',
                members: 89,
                maxMembers: 150,
                events: 8,
                status: 'active',
                president: 'Trần Thị B',
                foundedDate: '2023-02-20',
                email: 'music@ctsv.edu.vn'
            },
            {
                id: 'sports',
                name: 'Sports Club',
                code: 'CLB-003',
                description: 'Câu lạc bộ thể thao và rèn luyện sức khỏe',
                category: 'sports',
                members: 234,
                maxMembers: 300,
                events: 15,
                status: 'active',
                president: 'Lê Văn C',
                foundedDate: '2022-12-10',
                email: 'sports@ctsv.edu.vn'
            },
            {
                id: 'green',
                name: 'Green Environment Club',
                code: 'CLB-004',
                description: 'Câu lạc bộ bảo vệ môi trường xanh',
                category: 'social',
                members: 67,
                maxMembers: 100,
                events: 6,
                status: 'pending',
                president: 'Phạm Thị D',
                foundedDate: '2024-01-05',
                email: 'green@ctsv.edu.vn'
            }
        ];

        this.events = [
            {
                id: 'event1',
                title: 'Workshop AI & Machine Learning',
                club: 'CodeKing Club',
                date: '2024-12-20',
                status: 'upcoming',
                participants: 45
            },
            {
                id: 'event2',
                title: 'Concert Âm nhạc tháng 12',
                club: 'Music & Art Club',
                date: '2024-12-15',
                status: 'ongoing',
                participants: 120
            },
            {
                id: 'event3',
                title: 'Giải bóng đá sinh viên',
                club: 'Sports Club',
                date: '2024-12-10',
                status: 'completed',
                participants: 200
            }
        ];

        this.topClubs = this.clubs
            .sort((a, b) => b.members - a.members)
            .slice(0, 5)
            .map((club, index) => ({
                ...club,
                rank: index + 1,
                growth: Math.floor(Math.random() * 20) + 5
            }));

        this.renderClubsList();
        this.renderEventsTimeline();
        this.renderTopClubs();
    }

    // Render functions
    renderClubsList() {
        const container = document.getElementById('clubsList');
        if (!container) return;

        const filteredClubs = this.getFilteredClubs();

        if (filteredClubs.length === 0) {
            container.innerHTML = '<div class="empty-state">Không có câu lạc bộ nào phù hợp</div>';
            return;
        }

        container.innerHTML = filteredClubs.map(club => `
            <div class="club-list-item" data-club-id="${club.id}">
                <div class="club-info">
                    <div class="club-avatar ${club.category}">
                        <i class="fas ${this.getCategoryIcon(club.category)}"></i>
                    </div>
                    <div class="club-details">
                        <h4>${club.name}</h4>
                        <p>${club.description}</p>
                        <div class="club-meta">
                            <span class="club-code">${club.code}</span>
                            <span class="club-category">${this.getCategoryName(club.category)}</span>
                            <span class="club-status ${club.status}">${this.getStatusName(club.status)}</span>
                        </div>
                    </div>
                </div>
                <div class="club-stats">
                    <div class="stat">
                        <i class="fas fa-users"></i>
                        <span>${club.members}/${club.maxMembers}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-calendar"></i>
                        <span>${club.events}</span>
                    </div>
                </div>
                <div class="club-actions">
                    <button class="btn-action" onclick="clubsManager.viewClubDetails('${club.id}')" title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action" onclick="clubsManager.editClub('${club.id}')" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action danger" onclick="clubsManager.deleteClub('${club.id}')" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderEventsTimeline() {
        const container = document.getElementById('eventsTimeline');
        if (!container) return;

        container.innerHTML = this.events.map(event => `
            <div class="event-item ${event.status}">
                <div class="event-date">
                    <div class="event-day">${new Date(event.date).getDate()}</div>
                    <div class="event-month">${this.getMonthName(new Date(event.date).getMonth())}</div>
                </div>
                <div class="event-content">
                    <h5>${event.title}</h5>
                    <p>${event.club}</p>
                    <div class="event-meta">
                        <span class="event-participants">
                            <i class="fas fa-users"></i> ${event.participants}
                        </span>
                        <span class="event-status ${event.status}">
                            ${this.getEventStatusName(event.status)}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderTopClubs() {
        const container = document.getElementById('topClubsList');
        if (!container) return;

        container.innerHTML = this.topClubs.map(club => `
            <div class="top-club-item">
                <div class="club-rank">${club.rank}</div>
                <div class="club-info">
                    <h5>${club.name}</h5>
                    <div class="club-metrics">
                        <span>${club.members} thành viên</span>
                        <span class="growth">+${club.growth}%</span>
                    </div>
                </div>
                <div class="club-category-badge ${club.category}">
                    <i class="fas ${this.getCategoryIcon(club.category)}"></i>
                </div>
            </div>
        `).join('');
    }

    // Utility functions
    getCategoryIcon(category) {
        const icons = {
            technology: 'fa-laptop-code',
            culture: 'fa-music',
            sports: 'fa-running',
            social: 'fa-hands-helping',
            academic: 'fa-graduation-cap'
        };
        return icons[category] || 'fa-users';
    }

    getCategoryName(category) {
        const names = {
            technology: 'Công nghệ',
            culture: 'Văn hóa',
            sports: 'Thể thao',
            social: 'Xã hội',
            academic: 'Học thuật'
        };
        return names[category] || 'Khác';
    }

    getStatusName(status) {
        const names = {
            active: 'Hoạt động',
            pending: 'Chờ duyệt',
            inactive: 'Tạm dừng'
        };
        return names[status] || status;
    }

    getEventStatusName(status) {
        const names = {
            upcoming: 'Sắp diễn ra',
            ongoing: 'Đang diễn ra',
            completed: 'Đã hoàn thành'
        };
        return names[status] || status;
    }

    getMonthName(month) {
        const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        return months[month];
    }

    // Filter and view functions
    getFilteredClubs() {
        let filtered = [...this.clubs];

        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(club => club.status === this.currentFilter);
        }

        return filtered;
    }

    filterByCategory(category) {
        // Update active category
        document.querySelectorAll('[data-category]').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`)?.classList.add('active');

        if (category === 'all') {
            this.renderClubsList();
        } else {
            const filtered = this.clubs.filter(club => club.category === category);
            this.renderFilteredClubs(filtered);
        }
    }

    filterByStatus(status) {
        this.currentFilter = status;

        // Update active tab
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${status}"]`)?.classList.add('active');

        this.renderClubsList();
    }

    switchView(view) {
        this.currentView = view;

        // Update active view button
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`)?.classList.add('active');

        // Apply view class to container
        const container = document.getElementById('clubsList');
        if (container) {
            container.className = `clubs-list view-${view}`;
        }
    }

    // Dashboard functions
    updateStats() {
        const stats = {
            totalClubs: this.clubs.length,
            activeMembers: this.clubs.reduce((sum, club) => sum + club.members, 0),
            monthlyEvents: this.events.filter(event =>
                new Date(event.date).getMonth() === new Date().getMonth()
            ).length,
            engagement: Math.round((this.clubs.filter(club => club.status === 'active').length / this.clubs.length) * 100)
        };

        // Update stat cards
        this.updateStatCard('totalClubs', stats.totalClubs);
        this.updateStatCard('activeMembers', stats.activeMembers);
        this.updateStatCard('monthlyEvents', stats.monthlyEvents);
        this.updateStatCard('engagement', `${stats.engagement}%`);
    }

    updateStatCard(statType, value) {
        const card = document.querySelector(`[data-stat="${statType}"] .stat-info h3`);
        if (card) {
            card.textContent = typeof value === 'string' ? value : value.toLocaleString();
        }
    }

    initCharts() {
        const chartCanvas = document.getElementById('analyticsChart');
        if (chartCanvas && typeof Chart !== 'undefined') {
            new Chart(chartCanvas, {
                type: 'doughnut',
                data: {
                    labels: ['Học thuật', 'Thể thao', 'Văn hóa', 'Xã hội', 'Công nghệ'],
                    datasets: [{
                        data: [8, 6, 5, 3, 2],
                        backgroundColor: [
                            '#9b59b6',
                            '#e74c3c',
                            '#f39c12',
                            '#27ae60',
                            '#3498db'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    // Modal functions
    openCreateClubModal() {
        const modal = document.getElementById('createClubModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Club actions
    viewClubDetails(clubId) {
        window.location.href = `clubs-list.html#${clubId}`;
    }

    editClub(clubId) {
        const club = this.clubs.find(c => c.id === clubId);
        if (club) {
            this.showNotification(`Chỉnh sửa câu lạc bộ: ${club.name}`, 'info');
        }
    }

    deleteClub(clubId) {
        const club = this.clubs.find(c => c.id === clubId);
        if (club && confirm(`Bạn có chắc chắn muốn xóa câu lạc bộ "${club.name}"?`)) {
            this.clubs = this.clubs.filter(c => c.id !== clubId);
            this.renderClubsList();
            this.updateStats();
            this.showNotification(`Đã xóa câu lạc bộ: ${club.name}`, 'success');
        }
    }

    // Dashboard integration functions
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        this.showNotification('Chế độ light mode đã được kích hoạt', 'success');
    }

    showQuickAddMenu() {
        this.openCreateClubModal();
    }

    toggleNotifications() {
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        }
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    }

    refreshData() {
        this.showNotification('Đang làm mới dữ liệu...', 'info');

        setTimeout(() => {
            this.loadData();
            this.updateStats();
            this.showNotification('Dữ liệu đã được cập nhật', 'success');
        }, 1000);
    }

    exportData(type) {
        this.showNotification(`Đang xuất dữ liệu ${type.toUpperCase()}...`, 'info');

        setTimeout(() => {
            this.showNotification(`Xuất ${type.toUpperCase()} thành công`, 'success');
        }, 2000);
    }

    updateDateRange(range) {
        this.showNotification(`Cập nhật khoảng thời gian: ${range}`, 'info');
    }

    startAutoRefresh() {
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.updateStats();
            }
        }, 60000);
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }
}

// Global functions for HTML onclick events
window.clubsManager = null;

// Dashboard integration functions
window.dashboard = window.dashboard || {};

window.dashboard.openSettings = function () {
    window.clubsManager?.showNotification('Mở cài đặt tài khoản', 'info');
};

window.dashboard.viewNotifications = function () {
    window.clubsManager?.showNotification('Mở quản lý thông báo', 'info');
};

window.dashboard.openHelp = function () {
    window.clubsManager?.showNotification('Mở trợ giúp', 'info');
};

window.dashboard.switchAccount = function () {
    window.clubsManager?.showNotification('Chuyển tài khoản', 'info');
};

window.dashboard.closeNotificationPanel = function () {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.style.display = 'none';
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.clubsManager = new CLBClubsManager();

    // Set page title
    document.title = 'Quản lý Câu lạc bộ - CTSV Dashboard';

    console.log('✅ CLB Clubs Manager initialized successfully');
});
