/**
 * Dashboard Module - Clean and Optimized
 * Hệ thống dashboard tối ưu - Không có code thừa
 */

class DashboardModule {
    constructor() {
        this.charts = {};
        this.isLoading = false;
        this.settings = {
            autoRefresh: 60,
            defaultView: 'stats',
            enableNotifications: true,
            soundNotifications: false
        };
        this.searchData = [];
        this.autoRefreshInterval = null;
        this.init();
    }

    init() {
        console.log('🚀 Initializing Dashboard Module...');
        this.setupEventListeners();
        this.initializeComponents();
        this.loadDashboardData();
        this.setupTheme();
    }

    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshDashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.handleRefresh());
        }

        // Export buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('export-btn')) {
                e.preventDefault();
                this.handleExport(e.target.dataset.type);
            }
        });

        // Date range selector
        const dateRange = document.getElementById('dateRange');
        if (dateRange) {
            dateRange.addEventListener('change', () => this.updateDateRange());
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Create Report Button
        const createReportBtn = document.getElementById('createReportBtn');
        if (createReportBtn) {
            createReportBtn.addEventListener('click', () => this.openModal('createReportModal'));
        }

        // User Menu Toggle
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.addEventListener('click', () => this.toggleUserMenu());
        }

        // Search functionality
        const searchInput = document.getElementById('globalSearch');
        const searchBtn = document.getElementById('searchBtn');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        }
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchValue = document.getElementById('globalSearch').value;
                this.performSearch(searchValue);
            });
        }

        // Report form submission
        const reportForm = document.getElementById('reportForm');
        if (reportForm) {
            reportForm.addEventListener('submit', (e) => this.handleReportSubmit(e));
        }

        // Report period change
        const reportPeriod = document.getElementById('reportPeriod');
        if (reportPeriod) {
            reportPeriod.addEventListener('change', (e) => this.toggleCustomDateRange(e.target.value));
        }

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Window resize
        window.addEventListener('resize', () => this.handleResize());

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                this.closeUserMenu();
            }
            if (!e.target.closest('.search-box')) {
                this.hideSearchResults();
            }
        });
    }

    initializeComponents() {
        this.initCharts();
        this.setupAnimations();
        this.loadSearchData();
        this.setupAutoRefresh();
        this.loadSettings();
    }

    // Data Loading
    async loadDashboardData() {
        if (this.isLoading) return;

        try {
            this.isLoading = true;
            this.showLoading(true);

            // Simulate loading
            await new Promise(resolve => setTimeout(resolve, 1000));

            const [statsData, chartsData] = await Promise.all([
                this.fetchStats(),
                this.fetchChartData()
            ]);

            this.updateStats(statsData);
            this.updateCharts(chartsData);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showNotification('Có lỗi khi tải dữ liệu dashboard', 'error');
        } finally {
            this.isLoading = false;
            this.showLoading(false);
        }
    }

    async fetchStats() {
        // Simulate API call
        return {
            totalStudents: 1234,
            todayAttendance: 856,
            activeClubs: 25,
            pendingTasks: 7
        };
    }

    async fetchChartData() {
        // Simulate chart data
        return {
            attendance: {
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                data: [820, 932, 901, 934, 1290, 1330, 1320]
            },
            clubActivity: {
                labels: ['Đang hoạt động', 'Tạm dừng', 'Đang chuẩn bị', 'Hoàn thành'],
                data: [15, 3, 5, 2]
            }
        };
    }

    updateStats(data) {
        const cards = document.querySelectorAll('[data-stat]');
        cards.forEach(card => {
            const stat = card.dataset.stat;
            const valueEl = card.querySelector('.stat-value');
            if (valueEl && data[stat]) {
                this.animateNumber(valueEl, data[stat]);
            }
        });
    }

    animateNumber(element, targetValue) {
        const startValue = 0;
        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);

            element.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    initCharts() {
        this.createAttendanceChart();
        this.createClubActivityChart();
    }

    createAttendanceChart() {
        const ctx = document.getElementById('attendanceChart');
        if (!ctx) return;

        this.charts.attendance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                datasets: [{
                    label: 'Lượt chấm công',
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
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

    createClubActivityChart() {
        const ctx = document.getElementById('clubActivityChart');
        if (!ctx) return;

        this.charts.clubActivity = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Đang hoạt động', 'Tạm dừng', 'Đang chuẩn bị', 'Hoàn thành'],
                datasets: [{
                    data: [15, 3, 5, 2],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#3b82f6',
                        '#6b7280'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    updateCharts(data) {
        // Update attendance chart
        if (this.charts.attendance && data.attendance) {
            this.charts.attendance.data.labels = data.attendance.labels;
            this.charts.attendance.data.datasets[0].data = data.attendance.data;
            this.charts.attendance.update();
        }

        // Update club activity chart
        if (this.charts.clubActivity && data.clubActivity) {
            this.charts.clubActivity.data.labels = data.clubActivity.labels;
            this.charts.clubActivity.data.datasets[0].data = data.clubActivity.data;
            this.charts.clubActivity.update();
        }
    }

    handleRefresh() {
        this.showNotification('Đang làm mới dữ liệu...', 'info');
        this.loadDashboardData();
    }

    updateDateRange() {
        const dateRange = document.getElementById('dateRange');
        if (dateRange) {
            this.showNotification(`Cập nhật thời gian: ${dateRange.options[dateRange.selectedIndex].text}`, 'info');
            this.loadDashboardData();
        }
    }

    setupAnimations() {
        // Add entrance animations to cards
        const cards = document.querySelectorAll('.stat-card, .chart-card, .section-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    } handleResize() {
        // Resize charts on window resize
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = show ? 'flex' : 'none';
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications') || this.createNotificationContainer();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notifications';
        container.className = 'notifications-container';
        document.body.appendChild(container);
        return container;
    }

    // ===== NEW FEATURES =====

    // User Menu Functions
    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    closeUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    // Modal Functions
    openModal(modalId) {
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

    // Search Functions
    async loadSearchData() {
        // Simulate loading search data
        this.searchData = [
            { type: 'student', title: 'Nguyễn Văn A', subtitle: 'MSSV: 2021001', id: 'student_1' },
            { type: 'student', title: 'Trần Thị B', subtitle: 'MSSV: 2021002', id: 'student_2' },
            { type: 'club', title: 'CLB Công nghệ thông tin', subtitle: '125 thành viên', id: 'club_1' },
            { type: 'club', title: 'CLB Nhiếp ảnh', subtitle: '89 thành viên', id: 'club_2' },
            { type: 'event', title: 'Workshop AI trong Giáo dục', subtitle: '15/08/2025', id: 'event_1' },
            { type: 'event', title: 'Hội thảo Khởi nghiệp', subtitle: '20/08/2025', id: 'event_2' }
        ];
    }

    handleSearch(query) {
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }

        const results = this.searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(query.toLowerCase())
        );

        this.showSearchResults(results);
    }

    showSearchResults(results) {
        const container = document.getElementById('searchResults');
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = '<div class="search-result-item">Không tìm thấy kết quả nào</div>';
        } else {
            container.innerHTML = results.map(result => `
                <div class="search-result-item" onclick="dashboard.selectSearchResult('${result.id}', '${result.type}')">
                    <div class="search-result-icon ${result.type}">
                        <i class="fas fa-${this.getSearchIcon(result.type)}"></i>
                    </div>
                    <div class="search-result-info">
                        <div class="search-result-title">${result.title}</div>
                        <div class="search-result-subtitle">${result.subtitle}</div>
                    </div>
                </div>
            `).join('');
        }

        container.style.display = 'block';
    }

    hideSearchResults() {
        const container = document.getElementById('searchResults');
        if (container) {
            container.style.display = 'none';
        }
    }

    getSearchIcon(type) {
        const icons = {
            student: 'user',
            club: 'users',
            event: 'calendar-alt'
        };
        return icons[type] || 'search';
    }

    selectSearchResult(id, type) {
        this.hideSearchResults();
        document.getElementById('globalSearch').value = '';

        // Navigate based on type
        switch (type) {
            case 'student':
                this.showNotification(`Đang chuyển đến hồ sơ sinh viên ${id}`, 'info');
                break;
            case 'club':
                this.showNotification(`Đang chuyển đến CLB ${id}`, 'info');
                setTimeout(() => {
                    window.location.href = '../CLB/index.html';
                }, 1000);
                break;
            case 'event':
                this.showNotification(`Đang chuyển đến sự kiện ${id}`, 'info');
                break;
        }
    }

    performSearch(query) {
        if (!query.trim()) return;

        this.showNotification(`Đang tìm kiếm: "${query}"`, 'info');
        // Simulate search process
        setTimeout(() => {
            this.showNotification(`Tìm thấy kết quả cho "${query}"`, 'success');
        }, 1000);
    }

    // Report Functions
    handleReportSubmit(e) {
        e.preventDefault();

        const formData = {
            type: document.getElementById('reportType').value,
            name: document.getElementById('reportName').value,
            period: document.getElementById('reportPeriod').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value
        };

        if (!formData.type || !formData.name) {
            this.showNotification('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        this.showNotification('Đang tạo báo cáo...', 'info');

        // Simulate report creation
        setTimeout(() => {
            this.showNotification(`Tạo báo cáo "${formData.name}" thành công!`, 'success');
            this.closeModal('createReportModal');
            document.getElementById('reportForm').reset();
        }, 2000);
    }

    toggleCustomDateRange(period) {
        const customDateRange = document.getElementById('customDateRange');
        if (customDateRange) {
            customDateRange.style.display = period === 'custom' ? 'grid' : 'none';
        }
    }

    // Settings Functions
    openSettings() {
        this.closeUserMenu();
        this.openModal('settingsModal');
        this.populateSettings();
    }

    populateSettings() {
        document.getElementById('autoRefresh').value = this.settings.autoRefresh;
        document.getElementById('defaultView').value = this.settings.defaultView;
        document.getElementById('enableNotifications').checked = this.settings.enableNotifications;
        document.getElementById('soundNotifications').checked = this.settings.soundNotifications;
    }

    saveSettings() {
        this.settings = {
            autoRefresh: parseInt(document.getElementById('autoRefresh').value),
            defaultView: document.getElementById('defaultView').value,
            enableNotifications: document.getElementById('enableNotifications').checked,
            soundNotifications: document.getElementById('soundNotifications').checked
        };

        // Save to localStorage
        localStorage.setItem('dashboardSettings', JSON.stringify(this.settings));

        this.setupAutoRefresh();
        this.showNotification('Cài đặt đã được lưu!', 'success');
        this.closeModal('settingsModal');
    }

    loadSettings() {
        const saved = localStorage.getItem('dashboardSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    viewNotifications() {
        this.closeUserMenu();
        this.showNotification('Tính năng thông báo đang được phát triển', 'info');
    }

    // Auto Refresh Functions
    setupAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }

        if (this.settings.autoRefresh > 0) {
            this.autoRefreshInterval = setInterval(() => {
                this.loadDashboardData();
            }, this.settings.autoRefresh * 1000);
        }
    }

    // Enhanced Export with Progress
    async handleExport(type) {
        this.showNotification(`Đang chuẩn bị xuất ${type.toUpperCase()}...`, 'info');

        try {
            // Simulate export process with progress
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create download link simulation
            const fileName = `dashboard_report_${new Date().toISOString().split('T')[0]}.${type}`;
            this.showNotification(`Tải xuống ${fileName} thành công!`, 'success');

            // In a real app, you would trigger actual download here
            console.log(`Exporting dashboard data as ${type}`);

        } catch (error) {
            this.showNotification(`Lỗi khi xuất ${type}: ${error.message}`, 'error');
        }
    }

    // Enhanced Theme with Persistence
    toggleTheme() {
        const body = document.body;
        const icon = document.querySelector('#themeToggle i');

        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');

        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }

        // Save theme preference
        localStorage.setItem('dashboardTheme', isDark ? 'dark' : 'light');

        this.showNotification(`Chuyển sang chế độ ${isDark ? 'tối' : 'sáng'}`, 'success');
    }

    setupTheme() {
        // Load saved theme
        const savedTheme = localStorage.getItem('dashboardTheme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

        if (shouldUseDark) {
            document.body.classList.add('dark-theme');
            const icon = document.querySelector('#themeToggle i');
            if (icon) {
                icon.className = 'fas fa-sun';
            }
        }
    }

    // Quick Actions Management
    toggleQuickActionsView() {
        const quickActions = document.getElementById('quickActions');
        const toggleBtn = document.getElementById('quickActionsToggle');

        if (quickActions.classList.contains('grid-view')) {
            quickActions.classList.remove('grid-view');
            toggleBtn.innerHTML = '<i class="fas fa-th-large"></i>';
        } else {
            quickActions.classList.add('grid-view');
            toggleBtn.innerHTML = '<i class="fas fa-list"></i>';
        }
    }

    createClub() {
        this.showActionModal('Tạo CLB mới', 'Bạn có muốn tạo CLB mới không?', () => {
            window.location.href = '../CLB/clubs-list-new.html';
        });
    }

    createEvent() {
        this.showActionModal('Tạo sự kiện', 'Bạn có muốn tạo sự kiện mới không?', () => {
            window.location.href = '../operations/operations.html';
        });
    }

    viewReports() {
        this.showActionModal('Xem báo cáo', 'Bạn có muốn xem báo cáo thống kê không?', () => {
            window.location.href = '../statistics/personal-stats.html';
        });
    }

    exportData() {
        this.showNotification('Đang xuất dữ liệu...', 'info');
        // Simulate export process
        setTimeout(() => {
            this.showNotification('Xuất dữ liệu thành công!', 'success');
        }, 2000);
    }

    openSettings() {
        this.showActionModal('Cài đặt', 'Bạn có muốn mở trang cài đặt không?', () => {
            window.location.href = '../profile/profile.html';
        });
    }

    manageUsers() {
        this.showActionModal('Quản lý người dùng', 'Bạn có muốn quản lý người dùng không?', () => {
            this.showNotification('Tính năng quản lý người dùng đang được phát triển', 'info');
        });
    }

    bulkAttendance() {
        this.showActionModal('Chấm công hàng loạt', 'Bạn có muốn thực hiện chấm công hàng loạt không?', () => {
            this.showNotification('Tính năng chấm công hàng loạt đang được phát triển', 'info');
        });
    }

    sendNotification() {
        this.showActionModal('Gửi thông báo', 'Bạn có muốn gửi thông báo không?', () => {
            this.showNotification('Thông báo đã được gửi!', 'success');
        });
    }

    backupData() {
        this.showNotification('Đang sao lưu dữ liệu...', 'info');
        setTimeout(() => {
            this.showNotification('Sao lưu dữ liệu thành công!', 'success');
        }, 3000);
    }

    systemHealth() {
        this.showNotification('Kiểm tra hệ thống...', 'info');
        setTimeout(() => {
            this.showNotification('Hệ thống hoạt động bình thường', 'success');
        }, 2000);
    }

    repeatAction(actionType) {
        const actions = {
            'create_event': () => this.createEvent(),
            'export_report': () => this.exportData(),
            'manage_club': () => this.showNotification('Đang mở quản lý CLB...', 'info')
        };

        if (actions[actionType]) {
            actions[actionType]();
        }
    }

    showActionModal(title, message, callback) {
        if (confirm(`${title}\n\n${message}`)) {
            callback();
        }
    }

    // Activity Management
    filterActivities(type) {
        const activities = document.querySelectorAll('.activity-item');
        const buttons = document.querySelectorAll('.activity-filters .filter-btn');

        // Update active button
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        activities.forEach(activity => {
            if (type === 'all' || activity.dataset.type === type) {
                activity.style.display = 'flex';
            } else {
                activity.style.display = 'none';
            }
        });

        this.showNotification(`Hiển thị hoạt động: ${type === 'all' ? 'Tất cả' : type}`, 'info');
    }

    filterByTime(period) {
        const buttons = document.querySelectorAll('.time-filters .filter-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        // Simulate time-based filtering
        this.showNotification(`Lọc theo thời gian: ${period}`, 'info');
    }

    searchActivities() {
        const searchInput = document.querySelector('.activity-search input');
        const searchTerm = searchInput.value.toLowerCase();
        const activities = document.querySelectorAll('.activity-item');

        activities.forEach(activity => {
            const text = activity.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                activity.style.display = 'flex';
            } else {
                activity.style.display = 'none';
            }
        });

        if (searchTerm) {
            this.showNotification(`Tìm kiếm: "${searchTerm}"`, 'info');
        }
    }

    clearSearch() {
        const searchInput = document.querySelector('.activity-search input');
        searchInput.value = '';

        // Show all activities
        const activities = document.querySelectorAll('.activity-item');
        activities.forEach(activity => {
            activity.style.display = 'flex';
        });

        this.showNotification('Đã xóa tìm kiếm', 'success');
    }

    refreshActivities() {
        this.showNotification('Đang làm mới hoạt động...', 'info');

        // Simulate refresh
        setTimeout(() => {
            this.showNotification('Đã cập nhật hoạt động mới nhất', 'success');
        }, 1500);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new DashboardModule();
});

// Export for global access
window.DashboardModule = DashboardModule;
