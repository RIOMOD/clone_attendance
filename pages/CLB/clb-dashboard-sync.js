/**
 * CLB MODERN PAGE - DASHBOARD SYNCHRONIZED JAVASCRIPT
 * Enhanced with dashboard functionality and CLB-specific features
 */

// Import dashboard utilities if available
if (typeof dashboard === 'undefined') {
    window.dashboard = {};
}

class CLBModernPage {
    constructor() {
        this.clubs = [];
        this.filteredClubs = [];
        this.activities = [];
        this.currentUser = {
            id: 'user001',
            name: 'Admin User',
            role: 'admin',
            clubs: ['codeking', 'music']
        };
        
        this.init();
    }

    init() {
        this.loadData();
        this.initEventListeners();
        this.initSearch();
        this.updateStats();
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

        // Refresh dashboard
        const refreshBtn = document.getElementById('refreshDashboard');
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

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => this.filterByCategory(e.target.value));
        }

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
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
                    url: `clubs.html#${club.id}`,
                    icon: 'fas fa-users'
                });
            }
        });

        // Search events
        this.activities.forEach(activity => {
            if (activity.title.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    type: 'event',
                    title: activity.title,
                    subtitle: activity.description,
                    url: `club-events.html#${activity.id}`,
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
                description: 'Câu lạc bộ lập trình và phát triển ứng dụng',
                category: 'technology',
                members: 156,
                events: 12,
                isActive: true
            },
            {
                id: 'music',
                name: 'Music & Art Club',
                description: 'Câu lạc bộ âm nhạc và nghệ thuật',
                category: 'culture',
                members: 89,
                events: 8,
                isActive: true
            },
            {
                id: 'sports',
                name: 'Sports Club',
                description: 'Câu lạc bộ thể thao và rèn luyện sức khỏe',
                category: 'sports',
                members: 234,
                events: 15,
                isActive: true
            }
        ];

        this.activities = [
            {
                id: 'act1',
                title: 'Thành viên mới tham gia',
                description: 'CodeKing Club đã chấp nhận yêu cầu tham gia của bạn',
                time: '10 phút trước',
                type: 'success',
                icon: 'fas fa-user-plus'
            },
            {
                id: 'act2',
                title: 'Sự kiện mới được tạo',
                description: 'Workshop AI & Machine Learning - 20/12/2024',
                time: '2 giờ trước',
                type: 'info',
                icon: 'fas fa-calendar-plus'
            },
            {
                id: 'act3',
                title: 'Cảnh báo tham gia thấp',
                description: 'Sự kiện "Meeting tuần" có tỷ lệ tham gia thấp (45%)',
                time: '1 ngày trước',
                type: 'warning',
                icon: 'fas fa-exclamation-triangle'
            }
        ];

        this.filteredClubs = [...this.clubs];
        this.renderFeaturedClubs();
        this.renderRecentActivities();
    }

    // Render functions
    renderFeaturedClubs() {
        const container = document.querySelector('.featured-clubs-grid');
        if (!container) return;

        container.innerHTML = this.filteredClubs.map(club => `
            <div class="club-card ${club.category}" data-club-id="${club.id}">
                <div class="club-header">
                    <div class="club-avatar">
                        <i class="fas ${this.getCategoryIcon(club.category)}"></i>
                    </div>
                    <div class="club-category">${this.getCategoryName(club.category)}</div>
                </div>
                <div class="club-content">
                    <h4>${club.name}</h4>
                    <p>${club.description}</p>
                    <div class="club-stats">
                        <span><i class="fas fa-users"></i> ${club.members} thành viên</span>
                        <span><i class="fas fa-calendar"></i> ${club.events} sự kiện</span>
                    </div>
                </div>
                <div class="club-actions">
                    <button class="btn-join" onclick="joinClub('${club.id}')">
                        ${this.currentUser.clubs.includes(club.id) ? 'Đã tham gia' : 'Tham gia'}
                    </button>
                    <button class="btn-view" onclick="viewClub('${club.id}')">Xem chi tiết</button>
                </div>
            </div>
        `).join('');
    }

    renderRecentActivities() {
        const container = document.querySelector('.activity-list');
        if (!container) return;

        container.innerHTML = this.activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-meta">
                        <span class="activity-time">
                            <i class="fas fa-clock"></i>
                            ${activity.time}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Utility functions
    getCategoryIcon(category) {
        const icons = {
            technology: 'fa-code',
            culture: 'fa-music',
            sports: 'fa-futbol',
            social: 'fa-handshake',
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

    // Dashboard functions
    updateStats() {
        const stats = {
            totalClubs: this.clubs.length,
            totalMembers: this.clubs.reduce((sum, club) => sum + club.members, 0),
            monthlyEvents: this.clubs.reduce((sum, club) => sum + club.events, 0),
            activeClubs: this.clubs.filter(club => club.isActive).length
        };

        // Update stat cards
        this.updateStatCard('totalClubs', stats.totalClubs);
        this.updateStatCard('totalMembers', stats.totalMembers);
        this.updateStatCard('monthlyEvents', stats.monthlyEvents);
        this.updateStatCard('activeClubs', stats.activeClubs);
    }

    updateStatCard(statType, value) {
        const card = document.querySelector(`[data-stat="${statType}"] h3`);
        if (card) {
            card.textContent = value.toLocaleString();
        }
    }

    // Filter functions
    filterByCategory(category) {
        if (category === 'all') {
            this.filteredClubs = [...this.clubs];
        } else {
            this.filteredClubs = this.clubs.filter(club => club.category === category);
        }
        this.renderFeaturedClubs();
    }

    // Dashboard integration functions
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        this.showNotification('Chế độ sáng đã được kích hoạt', 'success');
    }

    showQuickAddMenu() {
        // Show quick add menu
        this.showNotification('Menu thêm nhanh', 'info');
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
        
        // Simulate API refresh
        setTimeout(() => {
            this.loadData();
            this.updateStats();
            this.showNotification('Dữ liệu đã được cập nhật', 'success');
        }, 1000);
    }

    exportData(type) {
        this.showNotification(`Đang xuất dữ liệu ${type.toUpperCase()}...`, 'info');
        
        // Simulate export
        setTimeout(() => {
            this.showNotification(`Xuất ${type.toUpperCase()} thành công`, 'success');
        }, 2000);
    }

    startAutoRefresh() {
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.updateStats();
            }
        }, 60000); // Refresh every minute
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

        // Auto remove after 3 seconds
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
window.joinClub = function(clubId) {
    const clbPage = window.clbModernPage;
    if (clbPage) {
        const club = clbPage.clubs.find(c => c.id === clubId);
        if (club) {
            if (clbPage.currentUser.clubs.includes(clubId)) {
                clbPage.showNotification(`Bạn đã là thành viên của ${club.name}`, 'info');
            } else {
                clbPage.currentUser.clubs.push(clubId);
                clbPage.showNotification(`Tham gia ${club.name} thành công!`, 'success');
                clbPage.renderFeaturedClubs();
            }
        }
    }
};

window.viewClub = function(clubId) {
    window.location.href = `clubs.html#${clubId}`;
};

window.closeNotificationPanel = function() {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.style.display = 'none';
    }
};

// Dashboard integration functions
window.dashboard = window.dashboard || {};

window.dashboard.openSettings = function() {
    window.clbModernPage?.showNotification('Mở cài đặt tài khoản', 'info');
};

window.dashboard.viewNotifications = function() {
    window.clbModernPage?.showNotification('Mở quản lý thông báo', 'info');
};

window.dashboard.openHelp = function() {
    window.clbModernPage?.showNotification('Mở trợ giúp', 'info');
};

window.dashboard.switchAccount = function() {
    window.clbModernPage?.showNotification('Chuyển tài khoản', 'info');
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.clbModernPage = new CLBModernPage();
    
    // Set page title
    document.title = 'Hoạt động Câu lạc bộ - CTSV Dashboard';
    
    console.log('✅ CLB Modern Page initialized successfully');
});
