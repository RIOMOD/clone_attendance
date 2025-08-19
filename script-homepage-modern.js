/* ===== MODERN HOMEPAGE FUNCTIONALITY - DASHBOARD SYNCHRONIZED ===== */

class ModernHomepage {
    constructor() {
        this.currentUser = {
            name: 'Nguyễn Văn A',
            email: 'user@example.com',
            role: 'Sinh viên',
            avatar: './assets/images/avata/avata_admin.jpg',
            isOnline: true
        };

        this.currentSession = {
            isActive: false,
            startTime: null,
            duration: 0,
            type: 'study' // 'study', 'break', 'work'
        };

        this.stats = {
            totalHours: 0,
            sessionsToday: 0,
            weekProgress: 75,
            monthlyGoal: 160
        };

        this.init();
    }

    init() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadUserData();
        this.startTimeUpdates();
        this.initializeCharts();
        this.loadNotifications();
        this.setupSearchFunctionality();
        this.setupResponsiveNavigation();
        
        // Initialize animations
        this.animateElements();
        
        console.log('✅ Modern Homepage initialized successfully');
    }

    initializeElements() {
        // Cache frequently used elements
        this.elements = {
            // Header elements
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            sidebar: document.getElementById('sidebar'),
            sidebarOverlay: document.getElementById('sidebarOverlay'),
            searchInput: document.getElementById('searchInput'),
            searchResults: document.getElementById('searchResults'),
            userMenu: document.querySelector('.user-menu'),
            userDropdown: document.querySelector('.user-dropdown'),
            notificationBtn: document.getElementById('notificationBtn'),
            notificationPanel: document.getElementById('notificationPanel'),
            notificationBadge: document.querySelector('.notification-badge'),

            // Time tracking elements
            sessionTimer: document.getElementById('sessionTimer'),
            sessionLabel: document.getElementById('sessionLabel'),
            statusIndicator: document.getElementById('statusIndicator'),
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            stopBtn: document.getElementById('stopBtn'),
            todayHours: document.getElementById('todayHours'),
            weekHours: document.getElementById('weekHours'),
            monthHours: document.getElementById('monthHours'),

            // Stats elements
            totalStudentsEl: document.getElementById('totalStudents'),
            presentTodayEl: document.getElementById('presentToday'),
            averageAttendanceEl: document.getElementById('averageAttendance'),
            activeSessionsEl: document.getElementById('activeSessions'),

            // Activity elements
            activityList: document.getElementById('activityList'),
            scheduleList: document.getElementById('scheduleList'),

            // Modals
            clockInModal: document.getElementById('clockInModal'),
            quickStatsModal: document.getElementById('quickStatsModal'),
            settingsModal: document.getElementById('settingsModal')
        };
    }

    setupEventListeners() {
        // Mobile menu toggle
        if (this.elements.mobileMenuBtn) {
            this.elements.mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Sidebar overlay
        if (this.elements.sidebarOverlay) {
            this.elements.sidebarOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Search functionality
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            this.elements.searchInput.addEventListener('focus', () => {
                this.showSearchResults();
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-box')) {
                    this.hideSearchResults();
                }
            });
        }

        // Time tracking controls
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.startSession());
        }
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.addEventListener('click', () => this.pauseSession());
        }
        if (this.elements.stopBtn) {
            this.elements.stopBtn.addEventListener('click', () => this.stopSession());
        }

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Notification panel toggle
        if (this.elements.notificationBtn) {
            this.elements.notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotificationPanel();
            });
        }

        // Close notification panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-panel') && !e.target.closest('#notificationBtn')) {
                this.closeNotificationPanel();
            }
        });

        // Modal functionality
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modal;
                this.openModal(modalId);
            });
        });

        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Close modal on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeAllModals();
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    // Mobile Navigation
    toggleMobileMenu() {
        const sidebar = this.elements.sidebar;
        const overlay = this.elements.sidebarOverlay;
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show');
            document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
        }
    }

    closeMobileMenu() {
        const sidebar = this.elements.sidebar;
        const overlay = this.elements.sidebarOverlay;
        
        if (sidebar && overlay) {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Search Functionality
    setupSearchFunctionality() {
        this.searchData = [
            { title: 'Dashboard', url: './pages/dashboard/dashboard.html', category: 'Navigation', icon: 'fas fa-tachometer-alt' },
            { title: 'Lịch học', url: './pages/calendar/index.html', category: 'Navigation', icon: 'fas fa-calendar-alt' },
            { title: 'Hoạt động CLB', url: './pages/CLB/index.html', category: 'Navigation', icon: 'fas fa-users' },
            { title: 'Thống kê', url: './pages/statistics/index.html', category: 'Navigation', icon: 'fas fa-chart-bar' },
            { title: 'Hồ sơ', url: './pages/profile/profile.html', category: 'Navigation', icon: 'fas fa-user' },
            { title: 'Đăng xuất', url: './pages/authen/login-professional.html', category: 'Action', icon: 'fas fa-sign-out-alt' },
            { title: 'Điểm danh nhanh', category: 'Quick Action', icon: 'fas fa-clock' },
            { title: 'Xem thống kê', category: 'Quick Action', icon: 'fas fa-chart-line' },
            { title: 'Quản lý lịch', category: 'Quick Action', icon: 'fas fa-calendar-check' },
        ];
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.hideSearchResults();
            return;
        }

        const results = this.searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);

        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query) {
        const resultsContainer = this.elements.searchResults;
        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-empty">
                    <i class="fas fa-search text-tertiary"></i>
                    <p>Không tìm thấy kết quả cho "${query}"</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = results.map(item => `
                <div class="search-result-item" data-url="${item.url || ''}" data-action="${item.category}">
                    <div class="search-result-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="search-result-content">
                        <div class="search-result-title">${this.highlightText(item.title, query)}</div>
                        <div class="search-result-category">${item.category}</div>
                    </div>
                </div>
            `).join('');

            // Add click handlers for search results
            resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const url = item.dataset.url;
                    const action = item.dataset.action;
                    
                    if (url) {
                        window.location.href = url;
                    } else if (action === 'Quick Action') {
                        this.handleQuickAction(item.querySelector('.search-result-title').textContent.trim());
                    }
                    
                    this.hideSearchResults();
                    this.elements.searchInput.blur();
                });
            });
        }

        this.showSearchResults();
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    showSearchResults() {
        if (this.elements.searchResults) {
            this.elements.searchResults.style.display = 'block';
        }
    }

    hideSearchResults() {
        if (this.elements.searchResults) {
            this.elements.searchResults.style.display = 'none';
        }
    }

    // Time Tracking System
    startSession(type = 'study') {
        if (this.currentSession.isActive) {
            this.showNotification('Phiên làm việc đang hoạt động', 'warning');
            return;
        }

        this.currentSession = {
            isActive: true,
            startTime: new Date(),
            duration: 0,
            type: type
        };

        this.updateSessionDisplay();
        this.showNotification('Đã bắt đầu phiên làm việc', 'success');
        
        // Update UI
        if (this.elements.startBtn) this.elements.startBtn.style.display = 'none';
        if (this.elements.pauseBtn) this.elements.pauseBtn.style.display = 'inline-flex';
        if (this.elements.stopBtn) this.elements.stopBtn.style.display = 'inline-flex';
        
        // Start timer interval
        this.sessionInterval = setInterval(() => {
            this.updateSessionTimer();
        }, 1000);
    }

    pauseSession() {
        if (!this.currentSession.isActive) return;

        this.currentSession.isActive = false;
        clearInterval(this.sessionInterval);
        
        this.showNotification('Phiên làm việc đã tạm dừng', 'info');
        
        // Update UI
        if (this.elements.startBtn) this.elements.startBtn.style.display = 'inline-flex';
        if (this.elements.pauseBtn) this.elements.pauseBtn.style.display = 'none';
    }

    stopSession() {
        if (!this.currentSession.startTime) return;

        const duration = this.currentSession.duration + 
            (this.currentSession.isActive ? Date.now() - this.currentSession.startTime : 0);
        
        // Save session data
        this.stats.totalHours += Math.round(duration / (1000 * 60 * 60) * 100) / 100;
        this.stats.sessionsToday += 1;
        
        // Reset session
        this.currentSession = {
            isActive: false,
            startTime: null,
            duration: 0,
            type: 'study'
        };
        
        clearInterval(this.sessionInterval);
        
        this.updateSessionDisplay();
        this.updateStatsDisplay();
        this.showNotification(`Hoàn thành phiên làm việc (${this.formatDuration(duration)})`, 'success');
        
        // Update UI
        if (this.elements.startBtn) this.elements.startBtn.style.display = 'inline-flex';
        if (this.elements.pauseBtn) this.elements.pauseBtn.style.display = 'none';
        if (this.elements.stopBtn) this.elements.stopBtn.style.display = 'none';
    }

    updateSessionTimer() {
        if (!this.currentSession.isActive) return;
        
        const elapsed = Date.now() - this.currentSession.startTime + this.currentSession.duration;
        this.updateSessionDisplay(elapsed);
    }

    updateSessionDisplay(elapsed = 0) {
        const timer = this.elements.sessionTimer;
        const label = this.elements.sessionLabel;
        const status = this.elements.statusIndicator;
        
        if (timer) {
            timer.textContent = this.formatDuration(elapsed);
        }
        
        if (label) {
            if (this.currentSession.isActive) {
                label.textContent = 'Đang học tập';
                label.className = 'session-label active';
            } else {
                label.textContent = 'Chưa bắt đầu';
                label.className = 'session-label';
            }
        }
        
        if (status) {
            if (this.currentSession.isActive) {
                status.innerHTML = '<i class="fas fa-circle"></i> Đang hoạt động';
                status.className = 'status-indicator working';
            } else {
                status.innerHTML = '<i class="fas fa-pause-circle"></i> Tạm nghỉ';
                status.className = 'status-indicator paused';
            }
        }
    }

    formatDuration(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Quick Actions
    handleQuickAction(action) {
        const actions = {
            'clock-in': () => this.openModal('clockInModal'),
            'quick-stats': () => this.openModal('quickStatsModal'),
            'calendar': () => window.location.href = './pages/calendar/index.html',
            'clubs': () => window.location.href = './pages/CLB/index.html',
            'profile': () => window.location.href = './pages/profile/profile.html',
            'settings': () => this.openModal('settingsModal'),
            'Điểm danh nhanh': () => this.startQuickAttendance(),
            'Xem thống kê': () => window.location.href = './pages/statistics/index.html',
            'Quản lý lịch': () => window.location.href = './pages/calendar/index.html'
        };

        const actionFn = actions[action];
        if (actionFn) {
            actionFn();
        } else {
            this.showNotification(`Chức năng "${action}" đang được phát triển`, 'info');
        }
    }

    startQuickAttendance() {
        // Simulate quick attendance
        this.showNotification('Đang thực hiện điểm danh...', 'info');
        
        setTimeout(() => {
            this.showNotification('Điểm danh thành công! ✓', 'success');
            this.stats.sessionsToday += 1;
            this.updateStatsDisplay();
        }, 2000);
    }

    // Notification System
    toggleNotificationPanel() {
        const panel = this.elements.notificationPanel;
        if (panel) {
            panel.classList.toggle('show');
        }
    }

    closeNotificationPanel() {
        const panel = this.elements.notificationPanel;
        if (panel) {
            panel.classList.remove('show');
        }
    }

    loadNotifications() {
        const notifications = [
            {
                id: 1,
                title: 'Lớp học mới',
                message: 'Bạn có lớp học Toán cao cấp lúc 14:00',
                time: '10 phút trước',
                type: 'info',
                unread: true
            },
            {
                id: 2,
                title: 'Điểm danh thành công',
                message: 'Bạn đã điểm danh thành công cho môn Lập trình Java',
                time: '1 giờ trước',
                type: 'success',
                unread: false
            },
            {
                id: 3,
                title: 'Nhắc nhở',
                message: 'Hạn nộp bài tập sắp đến (2 ngày nữa)',
                time: '3 giờ trước',
                type: 'warning',
                unread: true
            }
        ];

        this.renderNotifications(notifications);
        this.updateNotificationBadge(notifications.filter(n => n.unread).length);
    }

    renderNotifications(notifications) {
        const container = document.querySelector('.notification-list');
        if (!container) return;

        container.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.unread ? 'unread' : ''}" data-id="${notif.id}">
                <div class="notification-icon ${notif.type}">
                    <i class="fas ${this.getNotificationIcon(notif.type)}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notif.title}</h4>
                    <p>${notif.message}</p>
                    <span class="notification-time">${notif.time}</span>
                </div>
            </div>
        `).join('');

        // Add click handlers
        container.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                this.markNotificationAsRead(item.dataset.id);
            });
        });
    }

    getNotificationIcon(type) {
        const icons = {
            'info': 'fa-info-circle',
            'success': 'fa-check-circle',
            'warning': 'fa-exclamation-triangle',
            'error': 'fa-times-circle'
        };
        return icons[type] || 'fa-bell';
    }

    markNotificationAsRead(notificationId) {
        const item = document.querySelector(`[data-id="${notificationId}"]`);
        if (item) {
            item.classList.remove('unread');
            this.updateNotificationBadge();
        }
    }

    updateNotificationBadge(count = null) {
        const badge = this.elements.notificationBadge;
        if (!badge) return;

        if (count === null) {
            count = document.querySelectorAll('.notification-item.unread').length;
        }

        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        // Create notification toast
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Position notification
        const existingToasts = document.querySelectorAll('.notification-toast');
        const offset = (existingToasts.length - 1) * 70;
        notification.style.top = `${20 + offset}px`;

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        const removeNotification = () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                // Reposition remaining notifications
                this.repositionNotifications();
            }, 300);
        };

        // Close button handler
        const closeBtn = notification.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', removeNotification);
        }

        // Auto remove after duration
        setTimeout(removeNotification, duration);
    }

    repositionNotifications() {
        const toasts = document.querySelectorAll('.notification-toast');
        toasts.forEach((toast, index) => {
            toast.style.top = `${20 + (index * 70)}px`;
        });
    }

    // Modal System
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = '';
    }

    // Data Loading and Updates
    loadUserData() {
        // Simulate loading user data
        this.updateUserDisplay();
        this.updateStatsDisplay();
        this.loadRecentActivity();
        this.loadTodaySchedule();
    }

    updateUserDisplay() {
        // Update user info in header
        const userAvatar = document.querySelector('.user-avatar img');
        const userName = document.querySelector('.user-name');
        const userRole = document.querySelector('.user-role');
        const statusIndicator = document.querySelector('.status-indicator');

        if (userAvatar) userAvatar.src = this.currentUser.avatar;
        if (userName) userName.textContent = this.currentUser.name;
        if (userRole) userRole.textContent = this.currentUser.role;
        if (statusIndicator) {
            statusIndicator.classList.add(this.currentUser.isOnline ? 'online' : 'offline');
        }
    }

    updateStatsDisplay() {
        // Update stats cards
        const statsElements = {
            totalStudents: { value: 1247, trend: '+5.2%', positive: true },
            presentToday: { value: 892, trend: '+12%', positive: true },
            averageAttendance: { value: '85.4%', trend: '-2.1%', positive: false },
            activeSessions: { value: this.stats.sessionsToday, trend: '+15%', positive: true }
        };

        Object.entries(statsElements).forEach(([key, data]) => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = data.value;
                
                const trendEl = element.parentNode.querySelector('.stat-trend');
                if (trendEl) {
                    trendEl.className = `stat-trend ${data.positive ? 'positive' : 'negative'}`;
                    trendEl.innerHTML = `
                        <i class="fas ${data.positive ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                        ${data.trend}
                    `;
                }
            }
        });

        // Update time stats
        if (this.elements.todayHours) {
            this.elements.todayHours.textContent = this.stats.totalHours.toFixed(1) + 'h';
        }
        if (this.elements.weekHours) {
            this.elements.weekHours.textContent = (this.stats.totalHours * 5).toFixed(1) + 'h';
        }
        if (this.elements.monthHours) {
            this.elements.monthHours.textContent = (this.stats.totalHours * 20).toFixed(1) + 'h';
        }
    }

    loadRecentActivity() {
        const activities = [
            {
                type: 'success',
                title: 'Điểm danh thành công',
                description: 'Lớp Toán cao cấp A1 - Phòng 101',
                time: '5 phút trước',
                icon: 'fa-check-circle'
            },
            {
                type: 'primary',
                title: 'Bài tập mới',
                description: 'Bài tập Lập trình Java đã được giao',
                time: '15 phút trước',
                icon: 'fa-file-alt'
            },
            {
                type: 'info',
                title: 'Thông báo lớp học',
                description: 'Lớp Cơ sở dữ liệu chuyển sang phòng 205',
                time: '30 phút trước',
                icon: 'fa-info-circle'
            },
            {
                type: 'warning',
                title: 'Nhắc nhở deadline',
                description: 'Bài tập lớn môn Web sắp đến hạn',
                time: '1 giờ trước',
                icon: 'fa-clock'
            }
        ];

        this.renderActivityList(activities);
    }

    renderActivityList(activities) {
        const container = this.elements.activityList;
        if (!container) return;

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    loadTodaySchedule() {
        const schedule = [
            {
                time: '08:00',
                duration: '90 phút',
                title: 'Toán cao cấp A1',
                description: 'Phòng 101 - GV: Nguyễn Văn A',
                type: 'primary',
                status: 'completed'
            },
            {
                time: '10:00',
                duration: '90 phút',
                title: 'Lập trình Java',
                description: 'Phòng Lab 201 - GV: Trần Thị B',
                type: 'success',
                status: 'current'
            },
            {
                time: '14:00',
                duration: '90 phút',
                title: 'Cơ sở dữ liệu',
                description: 'Phòng 205 - GV: Lê Văn C',
                type: 'warning',
                status: 'upcoming'
            },
            {
                time: '16:00',
                duration: '60 phút',
                title: 'Seminar CLB',
                description: 'Hội trường A - Chủ đề: AI & Machine Learning',
                type: 'info',
                status: 'upcoming'
            }
        ];

        this.renderScheduleList(schedule);
    }

    renderScheduleList(schedule) {
        const container = this.elements.scheduleList;
        if (!container) return;

        container.innerHTML = schedule.map(item => `
            <div class="schedule-item ${item.status}">
                <div class="schedule-time">
                    <div class="time">${item.time}</div>
                    <div class="duration">${item.duration}</div>
                </div>
                <div class="schedule-content">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <div class="schedule-tags">
                        <span class="tag ${item.type}">${this.getStatusLabel(item.status)}</span>
                    </div>
                </div>
                <div class="schedule-actions">
                    <button class="btn-icon" title="Chi tiết">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="btn-icon" title="Điểm danh">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getStatusLabel(status) {
        const labels = {
            'completed': 'Đã hoàn thành',
            'current': 'Đang diễn ra',
            'upcoming': 'Sắp diễn ra',
            'cancelled': 'Đã hủy'
        };
        return labels[status] || status;
    }

    // Charts and Analytics
    initializeCharts() {
        this.initAttendanceChart();
        this.initProgressChart();
    }

    initAttendanceChart() {
        const chartContainer = document.getElementById('attendanceChart');
        if (!chartContainer) return;

        // Sample data for attendance chart
        const ctx = chartContainer.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                datasets: [{
                    label: 'Điểm danh trong tuần',
                    data: [85, 92, 78, 88, 95, 67, 89],
                    borderColor: 'rgb(37, 99, 235)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: '#f1f5f9'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    initProgressChart() {
        const chartContainer = document.getElementById('progressChart');
        if (!chartContainer) return;

        const ctx = chartContainer.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Hoàn thành', 'Còn lại'],
                datasets: [{
                    data: [this.stats.weekProgress, 100 - this.stats.weekProgress],
                    backgroundColor: [
                        'rgb(37, 99, 235)',
                        '#e2e8f0'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '80%',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Utility Functions
    startTimeUpdates() {
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Update time displays
        document.querySelectorAll('.current-time').forEach(el => {
            el.textContent = timeString;
        });
        document.querySelectorAll('.current-date').forEach(el => {
            el.textContent = dateString;
        });
    }

    handleKeyboardShortcuts(e) {
        // Global shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    if (this.elements.searchInput) {
                        this.elements.searchInput.focus();
                    }
                    break;
                case 'n':
                    e.preventDefault();
                    this.toggleNotificationPanel();
                    break;
                case 'm':
                    e.preventDefault();
                    this.toggleMobileMenu();
                    break;
            }
        }

        // Escape key handlers
        if (e.key === 'Escape') {
            this.closeAllModals();
            this.hideSearchResults();
            this.closeNotificationPanel();
            this.closeMobileMenu();
        }
    }

    handleResize() {
        // Handle responsive layout changes
        if (window.innerWidth > 1024) {
            this.closeMobileMenu();
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, pause non-essential updates
            if (this.sessionInterval && !this.currentSession.isActive) {
                clearInterval(this.sessionInterval);
            }
        } else {
            // Page is visible, resume updates
            if (this.currentSession.isActive && !this.sessionInterval) {
                this.sessionInterval = setInterval(() => {
                    this.updateSessionTimer();
                }, 1000);
            }
        }
    }

    animateElements() {
        // Animate elements on page load
        const animateOnScroll = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(animateOnScroll, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe cards and stats
        document.querySelectorAll('.stat-card, .dashboard-card, .quick-action-btn').forEach(el => {
            observer.observe(el);
        });
    }

    setupResponsiveNavigation() {
        // Handle navigation link active states
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.closest('.nav-item').classList.add('active');
            }
        });
    }
}

// Toast notification styles (add to CSS if not present)
const toastStyles = `
.notification-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    padding: 16px;
    z-index: 1080;
    max-width: 400px;
    min-width: 300px;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 4px solid var(--primary);
}

.notification-toast.show {
    transform: translateX(0);
    opacity: 1;
}

.notification-toast.success {
    border-left-color: var(--success);
}

.notification-toast.warning {
    border-left-color: var(--warning);
}

.notification-toast.error {
    border-left-color: var(--danger);
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-primary);
    font-weight: 500;
    font-size: 14px;
}

.toast-content i {
    color: var(--primary);
    font-size: 16px;
}

.notification-toast.success .toast-content i {
    color: var(--success);
}

.notification-toast.warning .toast-content i {
    color: var(--warning);
}

.notification-toast.error .toast-content i {
    color: var(--danger);
}

.toast-close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    color: var(--text-light);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: all 0.2s;
}

.toast-close:hover {
    background: var(--bg-accent);
    color: var(--text-secondary);
}

.search-empty {
    padding: 20px;
    text-align: center;
    color: var(--text-tertiary);
}

.search-empty i {
    font-size: 32px;
    margin-bottom: 12px;
    display: block;
}

.search-result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid var(--border-light);
    transition: background 0.2s;
}

.search-result-item:hover {
    background: var(--bg-accent);
}

.search-result-item:last-child {
    border-bottom: none;
}

.search-result-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--bg-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
}

.search-result-content {
    flex: 1;
}

.search-result-title {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
}

.search-result-title mark {
    background: rgba(37, 99, 235, 0.2);
    color: var(--primary);
    padding: 0 2px;
    border-radius: 3px;
}

.search-result-category {
    font-size: 12px;
    color: var(--text-tertiary);
}

.animate-in {
    animation: slideInUp 0.6s ease-out forwards;
}
`;

// Add toast styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);

// Initialize homepage when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.homepage = new ModernHomepage();
});

// Handle service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
