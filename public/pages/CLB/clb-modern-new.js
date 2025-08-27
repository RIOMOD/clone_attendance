// CLB Modern Dashboard - JavaScript Functionality
// Synchronized with dashboard-modern.js for consistency

// Global CLB Manager Object
const clubsManager = {
    // Initialize the CLB page
    init() {
        console.log('🏛️ Initializing CLB Modern Dashboard...');
        this.initEventListeners();
        this.loadClubData();
        this.initCharts();
        this.initSearchFunctionality();
        this.initModals();
        this.startAutoRefresh();
        console.log('✅ CLB Dashboard initialized successfully!');
    },

    // Initialize all event listeners
    initEventListeners() {
        // Category filter listeners
        this.initCategoryFilters();

        // View controls
        this.initViewControls();

        // Dashboard controls
        this.initDashboardControls();

        // Activity filters
        this.initActivityFilters();

        // Export buttons
        this.initExportButtons();

        // Mobile menu
        this.initMobileMenu();
    },

    // Initialize category filter functionality
    initCategoryFilters() {
        const categoryItems = document.querySelectorAll('.category-item');

        categoryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Remove active class from all items
                categoryItems.forEach(cat => cat.classList.remove('active'));

                // Add active class to clicked item
                item.classList.add('active');

                // Get category and filter clubs
                const category = item.dataset.category;
                this.filterClubs(category);
            });
        });
    },

    // Initialize view control buttons
    initViewControls() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const viewBtns = document.querySelectorAll('.view-btn');

        // Tab buttons
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                this.filterClubsByStatus(filter);
            });
        });

        // View buttons
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const view = btn.dataset.view;
                this.changeView(view);
            });
        });
    },

    // Initialize dashboard controls
    initDashboardControls() {
        // Date range selector
        const dateRange = document.getElementById('dateRange');
        if (dateRange) {
            dateRange.addEventListener('change', (e) => {
                this.updateDataByDateRange(e.target.value);
            });
        }

        // Category filter
        const clubCategory = document.getElementById('clubCategory');
        if (clubCategory) {
            clubCategory.addEventListener('change', (e) => {
                this.filterClubsByCategory(e.target.value);
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshClubs');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshData();
            });
        }
    },

    // Initialize activity filters
    initActivityFilters() {
        const filterBtn = document.getElementById('activityFilter');
        const filtersContainer = document.getElementById('activityFilters');

        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                const isVisible = filtersContainer.style.display !== 'none';
                filtersContainer.style.display = isVisible ? 'none' : 'block';
            });
        }

        // Filter dropdowns
        const typeFilter = document.getElementById('activityTypeFilter');
        const timeFilter = document.getElementById('activityTimeFilter');

        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.filterActivities();
            });
        }

        if (timeFilter) {
            timeFilter.addEventListener('change', () => {
                this.filterActivities();
            });
        }
    },

    // Initialize export buttons
    initExportButtons() {
        const exportBtns = document.querySelectorAll('.export-btn');
        exportBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = btn.dataset.type;
                this.exportData(type);
            });
        });
    },

    // Initialize mobile menu
    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.querySelector('.sidebar');

        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
    },

    // Initialize search functionality
    initSearchFunctionality() {
        const searchInput = document.getElementById('globalSearch');
        const searchBtn = document.getElementById('searchBtn');
        const searchResults = document.getElementById('searchResults');

        if (!searchInput) return;

        // Debounced search
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            if (query.length === 0) {
                searchResults.style.display = 'none';
                return;
            }

            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        // Search button click
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput.value.trim();
                if (query.length > 0) {
                    this.performSearch(query);
                }
            });
        }

        // Hide search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box')) {
                searchResults.style.display = 'none';
            }
        });
    },

    // Initialize modals
    initModals() {
        // Modal close buttons
        const modalCloses = document.querySelectorAll('.modal-close');
        modalCloses.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Click outside modal to close
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Create club form
        const createClubForm = document.getElementById('createClubForm');
        if (createClubForm) {
            createClubForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreateClub(new FormData(createClubForm));
            });
        }
    },

    // Perform search operation
    performSearch(query) {
        const searchResults = document.getElementById('searchResults');

        // Mock search results - replace with actual API call
        const results = this.mockSearchResults(query);

        this.displaySearchResults(results);
        searchResults.style.display = 'block';
    },

    // Mock search results
    mockSearchResults(query) {
        const mockData = [
            { type: 'club', title: 'Code King Club', subtitle: 'Câu lạc bộ lập trình', url: '#' },
            { type: 'student', title: 'Nguyễn Văn A', subtitle: 'Sinh viên CNTT', url: '#' },
            { type: 'event', title: 'Workshop React', subtitle: 'Sự kiện sắp tới', url: '#' },
            { type: 'club', title: 'IT Innovation', subtitle: 'Câu lạc bộ đổi mới sáng tạo', url: '#' }
        ];

        return mockData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(query.toLowerCase())
        );
    },

    // Display search results
    displaySearchResults(results) {
        const searchResults = document.getElementById('searchResults');

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>Không tìm thấy kết quả nào</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(result => `
            <div class="search-result-item" onclick="window.location.href='${result.url}'">
                <div class="search-result-icon ${result.type}">
                    <i class="fas fa-${this.getSearchIcon(result.type)}"></i>
                </div>
                <div class="search-result-content">
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-subtitle">${result.subtitle}</div>
                </div>
            </div>
        `).join('');

        searchResults.innerHTML = resultsHTML;
    },

    // Get icon for search result type
    getSearchIcon(type) {
        const icons = {
            club: 'users',
            student: 'user',
            event: 'calendar',
            teacher: 'chalkboard-teacher'
        };
        return icons[type] || 'search';
    },

    // Modal functions
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    },

    openCreateClubModal() {
        this.openModal('createClubModal');
    },

    // Handle create club form submission
    handleCreateClub(formData) {
        const clubData = {
            name: formData.get('name'),
            code: formData.get('code'),
            category: formData.get('category'),
            status: formData.get('status'),
            description: formData.get('description'),
            president: formData.get('president'),
            email: formData.get('email'),
            maxMembers: formData.get('maxMembers'),
            foundedDate: formData.get('foundedDate')
        };

        console.log('Creating new club:', clubData);

        // Mock API call - replace with actual API
        this.showNotification('Câu lạc bộ đã được tạo thành công!', 'success');
        this.closeModal('createClubModal');
        this.refreshData();
    },

    // Load club data
    loadClubData() {
        console.log('Loading club data...');
        this.renderClubs(this.getMockClubs());
        this.renderTopClubs(this.getMockTopClubs());
        this.renderRecentEvents(this.getMockRecentEvents());
    },

    // Get mock clubs data
    getMockClubs() {
        return [
            {
                id: 1,
                name: 'Code King Club',
                category: 'technology',
                status: 'active',
                members: 45,
                events: 12,
                description: 'Câu lạc bộ lập trình và phát triển phần mềm',
                president: 'Nguyễn Văn A',
                founded: '2023-09-01'
            },
            {
                id: 2,
                name: 'CLB Thể thao',
                category: 'sports',
                status: 'active',
                members: 67,
                events: 8,
                description: 'Câu lạc bộ thể thao và rèn luyện sức khỏe',
                president: 'Trần Thị B',
                founded: '2023-08-15'
            },
            {
                id: 3,
                name: 'CLB Học thuật',
                category: 'academic',
                status: 'pending',
                members: 23,
                events: 5,
                description: 'Câu lạc bộ nghiên cứu khoa học và học thuật',
                president: 'Lê Văn C',
                founded: '2023-10-01'
            }
        ];
    },

    // Get mock top clubs
    getMockTopClubs() {
        return [
            { rank: 1, name: 'Code King Club', score: 95 },
            { rank: 2, name: 'CLB Thể thao', score: 87 },
            { rank: 3, name: 'CLB Văn hóa', score: 82 },
            { rank: 4, name: 'CLB Xã hội', score: 78 },
            { rank: 5, name: 'CLB Học thuật', score: 75 }
        ];
    },

    // Get mock recent events
    getMockRecentEvents() {
        return [
            {
                date: '19',
                month: 'Aug',
                title: 'Workshop React Advanced',
                club: 'Code King Club',
                type: 'workshop'
            },
            {
                date: '20',
                month: 'Aug',
                title: 'Giải bóng đá CLB',
                club: 'CLB Thể thao',
                type: 'tournament'
            },
            {
                date: '21',
                month: 'Aug',
                title: 'Hội thảo khoa học',
                club: 'CLB Học thuật',
                type: 'seminar'
            }
        ];
    },

    // Render functions
    renderClubs(clubs) {
        const clubsList = document.getElementById('clubsList');
        if (!clubsList) return;

        const clubsHTML = clubs.map(club => `
            <div class="club-item" data-category="${club.category}" data-status="${club.status}">
                <div class="club-header">
                    <div class="club-title">
                        <i class="fas fa-${this.getCategoryIcon(club.category)}"></i>
                        ${club.name}
                    </div>
                    <div class="club-status ${club.status}">
                        ${this.getStatusText(club.status)}
                    </div>
                </div>
                <div class="club-info">
                    <p class="club-description">${club.description}</p>
                    <div class="club-stats">
                        <div class="club-stat">
                            <i class="fas fa-users"></i>
                            <span>${club.members} thành viên</span>
                        </div>
                        <div class="club-stat">
                            <i class="fas fa-calendar"></i>
                            <span>${club.events} sự kiện</span>
                        </div>
                        <div class="club-stat">
                            <i class="fas fa-user-tie"></i>
                            <span>${club.president}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        clubsList.innerHTML = clubsHTML;
    },

    renderTopClubs(clubs) {
        const topClubsList = document.getElementById('topClubsList');
        if (!topClubsList) return;

        const clubsHTML = clubs.map(club => `
            <div class="top-club-item">
                <div class="club-rank">${club.rank}</div>
                <div class="top-club-info">
                    <h5>${club.name}</h5>
                    <p>Điểm hoạt động: ${club.score}</p>
                </div>
            </div>
        `).join('');

        topClubsList.innerHTML = clubsHTML;
    },

    renderRecentEvents(events) {
        const eventsTimeline = document.getElementById('eventsTimeline');
        if (!eventsTimeline) return;

        const eventsHTML = events.map(event => `
            <div class="event-item">
                <div class="event-date">
                    <div class="event-day">${event.date}</div>
                    <div class="event-month">${event.month}</div>
                </div>
                <div class="event-details">
                    <h4>${event.title}</h4>
                    <p>${event.club} • ${this.getEventTypeText(event.type)}</p>
                </div>
            </div>
        `).join('');

        eventsTimeline.innerHTML = eventsHTML;
    },

    // Initialize charts
    initCharts() {
        this.initAnalyticsChart();
    },

    initAnalyticsChart() {
        const ctx = document.getElementById('analyticsChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Học thuật', 'Thể thao', 'Văn hóa', 'Xã hội'],
                datasets: [{
                    data: [8, 6, 5, 3],
                    backgroundColor: [
                        '#2563eb',
                        '#10b981',
                        '#f59e0b',
                        '#06b6d4'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    },

    // Filter functions
    filterClubs(category) {
        const clubs = document.querySelectorAll('.club-item');
        clubs.forEach(club => {
            if (category === 'all' || club.dataset.category === category) {
                club.style.display = 'block';
            } else {
                club.style.display = 'none';
            }
        });
    },

    filterClubsByStatus(status) {
        const clubs = document.querySelectorAll('.club-item');
        clubs.forEach(club => {
            if (status === 'all' || club.dataset.status === status) {
                club.style.display = 'block';
            } else {
                club.style.display = 'none';
            }
        });
    },

    filterClubsByCategory(category) {
        if (category === 'all' || !category) {
            this.filterClubs('all');
        } else {
            this.filterClubs(category);
        }
    },

    changeView(view) {
        const clubsList = document.getElementById('clubsList');
        if (!clubsList) return;
        clubsList.className = `clubs-list view-${view}`;
    },

    filterActivities() {
        const typeFilter = document.getElementById('activityTypeFilter');
        const timeFilter = document.getElementById('activityTimeFilter');

        const type = typeFilter ? typeFilter.value : '';
        const time = timeFilter ? timeFilter.value : '';

        console.log(`Filtering activities by type: ${type}, time: ${time}`);
    },

    // Utility functions
    getCategoryIcon(category) {
        const icons = {
            academic: 'book',
            sports: 'running',
            culture: 'music',
            social: 'hands-helping',
            technology: 'laptop-code'
        };
        return icons[category] || 'users';
    },

    getStatusText(status) {
        const statusTexts = {
            active: 'Hoạt động',
            pending: 'Chờ duyệt',
            inactive: 'Tạm dừng'
        };
        return statusTexts[status] || status;
    },

    getEventTypeText(type) {
        const typeTexts = {
            workshop: 'Workshop',
            tournament: 'Giải đấu',
            seminar: 'Hội thảo',
            meeting: 'Họp mặt'
        };
        return typeTexts[type] || type;
    },

    // Data management functions
    updateDataByDateRange(range) {
        console.log(`Updating data for range: ${range}`);
        this.refreshData();
    },

    refreshData() {
        console.log('Refreshing CLB data...');
        this.showLoadingSpinner(true);

        setTimeout(() => {
            this.loadClubData();
            this.showLoadingSpinner(false);
            this.showNotification('Dữ liệu đã được làm mới!', 'success');
        }, 1000);
    },

    exportData(type) {
        console.log(`Exporting data as ${type}`);
        this.showNotification(`Đang xuất dữ liệu ${type.toUpperCase()}...`, 'info');

        setTimeout(() => {
            this.showNotification(`Xuất ${type.toUpperCase()} thành công!`, 'success');
        }, 2000);
    },

    // UI helper functions
    showLoadingSpinner(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = show ? 'flex' : 'none';
        }
    },

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications') || this.createNotificationContainer();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notifications';
        container.className = 'notifications-container';
        document.body.appendChild(container);
        return container;
    },

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    },

    // Auto refresh functionality
    startAutoRefresh() {
        setInterval(() => {
            this.refreshData();
        }, 5 * 60 * 1000);
    }
};

// Dashboard integration
if (typeof dashboard !== 'undefined') {
    Object.assign(dashboard, {
        openCreateClubModal: () => clubsManager.openCreateClubModal(),
        refreshClubData: () => clubsManager.refreshData(),
        exportClubData: (type) => clubsManager.exportData(type)
    });
} else {
    window.dashboard = {
        openSettings: () => clubsManager.openModal('settingsModal'),
        closeModal: (modalId) => clubsManager.closeModal(modalId),
        saveSettings: () => {
            clubsManager.showNotification('Cài đặt đã được lưu!', 'success');
            clubsManager.closeModal('settingsModal');
        },
        viewNotifications: () => {
            const panel = document.getElementById('notificationPanel');
            if (panel) {
                panel.classList.toggle('active');
            }
        },
        closeNotificationPanel: () => {
            const panel = document.getElementById('notificationPanel');
            if (panel) {
                panel.classList.remove('active');
            }
        },
        openHelp: () => {
            clubsManager.showNotification('Tính năng trợ giúp sẽ sớm được cập nhật!', 'info');
        },
        switchAccount: () => {
            clubsManager.showNotification('Chuyển tài khoản...', 'info');
        }
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    clubsManager.init();
});

// Make clubsManager globally available
window.clubsManager = clubsManager;
