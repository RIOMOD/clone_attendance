// Modern Personal Statistics Manager - Dashboard Synchronized
class PersonalStatisticsManager {
    constructor() {
        this.charts = {};
        this.currentTimeRange = 'month';
        this.currentView = 'chart';
        this.init();
    }

    init() {
        console.log('🚀 Initializing Personal Statistics Manager...');
        this.setupEventListeners();
        this.initializeCharts();
        this.generateCalendar();
        this.animateElements();
        this.loadStatistics();
        console.log('✅ Personal Statistics Manager initialized successfully!');
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Time range filter
        const timeRangeSelect = document.getElementById('timeRange');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', (e) => {
                this.updateTimeRange(e.target.value);
            });
        }

        // View toggles
        const toggleButtons = document.querySelectorAll('.toggle-btn');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view');
                this.switchView(view, btn);
            });
        });

        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportReport());
        }

        // Calendar navigation
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        if (prevMonth) {
            prevMonth.addEventListener('click', () => this.navigateCalendar(-1));
        }
        if (nextMonth) {
            nextMonth.addEventListener('click', () => this.navigateCalendar(1));
        }

        // Add goal button
        const addGoalBtn = document.getElementById('addGoalBtn');
        if (addGoalBtn) {
            addGoalBtn.addEventListener('click', () => this.showAddGoalModal());
        }

        // User menu dropdown
        this.setupUserMenu();

        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());

        // Search functionality
        this.setupSearch();
    }

    setupUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserDropdown();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.hideUserDropdown();
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    // Mobile Menu Management
    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
    }

    // User Menu Management
    toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    hideUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    // Chart Initialization
    initializeCharts() {
        this.initAttendanceChart();
    }

    initAttendanceChart() {
        const ctx = document.getElementById('attendanceChart');
        if (!ctx) return;

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0.05)');

        this.charts.attendance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.getTimeLabels(),
                datasets: [{
                    label: 'Giờ làm việc',
                    data: [8.2, 8.5, 7.8, 8.0, 8.3, 8.1, 8.4, 8.2, 8.6, 8.0, 8.5, 8.3, 8.2, 8.4],
                    borderColor: '#2563eb',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2563eb',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#1d4ed8',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                }, {
                    label: 'Mục tiêu',
                    data: Array(14).fill(8),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    borderDash: [8, 4],
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        align: 'start',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 12,
                                family: 'Inter'
                            },
                            color: '#64748b'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#475569',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 12,
                        padding: 16,
                        displayColors: true,
                        usePointStyle: true,
                        callbacks: {
                            title: function (context) {
                                return `Ngày ${context[0].label}`;
                            },
                            label: function (context) {
                                return `${context.dataset.label}: ${context.parsed.y} giờ`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                size: 11,
                                family: 'Inter'
                            }
                        }
                    },
                    y: {
                        beginAtZero: false,
                        min: 6,
                        max: 10,
                        grid: {
                            color: 'rgba(226, 232, 240, 0.5)',
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                size: 11,
                                family: 'Inter'
                            },
                            callback: function (value) {
                                return value + 'h';
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
    }

    getTimeLabels() {
        const labels = [];
        const today = new Date();

        for (let i = 13; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.getDate() + '/' + (date.getMonth() + 1));
        }

        return labels;
    }

    // View Management
    switchView(view, button) {
        const chartView = document.getElementById('attendanceChartView');
        const calendarView = document.getElementById('attendanceCalendarView');
        const toggles = document.querySelectorAll('.toggle-btn');

        // Update active states
        toggles.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Switch views with animation
        if (view === 'chart') {
            this.showView(chartView, calendarView);
        } else if (view === 'calendar') {
            this.showView(calendarView, chartView);
            this.generateCalendar();
        }

        this.currentView = view;
    }

    showView(showElement, hideElement) {
        if (hideElement) {
            hideElement.style.opacity = '0';
            setTimeout(() => {
                hideElement.style.display = 'none';
                if (showElement) {
                    showElement.style.display = 'block';
                    showElement.style.opacity = '0';
                    setTimeout(() => {
                        showElement.style.opacity = '1';
                    }, 50);
                }
            }, 200);
        }
    }

    // Calendar Generation
    generateCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Update month header
        const monthHeader = document.getElementById('currentMonth');
        if (monthHeader) {
            monthHeader.textContent = `${this.getMonthName(currentMonth)} ${currentYear}`;
        }

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        let calendarHTML = '';

        // Day headers
        const dayHeaders = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        dayHeaders.forEach(day => {
            calendarHTML += `<div class="calendar-header-day">${day}</div>`;
        });

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === currentDate.getDate();
            const hasAttendance = Math.random() > 0.15; // Simulate attendance data
            const attendanceClass = hasAttendance ? 'present' : 'absent';
            const todayClass = isToday ? 'today' : '';

            calendarHTML += `
                <div class="calendar-day ${attendanceClass} ${todayClass}" 
                     data-day="${day}" 
                     title="${hasAttendance ? 'Có mặt' : 'Vắng mặt'} - Ngày ${day}/${currentMonth + 1}">
                    ${day}
                </div>
            `;
        }

        calendarGrid.innerHTML = calendarHTML;

        // Add click events
        const calendarDays = calendarGrid.querySelectorAll('.calendar-day:not(.empty)');
        calendarDays.forEach(day => {
            day.addEventListener('click', () => {
                const dayNumber = day.getAttribute('data-day');
                this.showDayDetails(dayNumber);
            });
        });
    }

    navigateCalendar(direction) {
        // Implementation for calendar navigation
        console.log(`Navigating calendar: ${direction > 0 ? 'next' : 'previous'} month`);
        this.generateCalendar();
    }

    getMonthName(monthIndex) {
        const months = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
            'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
            'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];
        return months[monthIndex];
    }

    showDayDetails(day) {
        this.showNotification(`Chi tiết cho ngày ${day}`, 'info');
        // Here you would typically show a modal with detailed information
    }

    // Time Range Management
    updateTimeRange(range) {
        this.currentTimeRange = range;
        this.showLoadingState();

        setTimeout(() => {
            this.updateChartData(range);
            this.updateOverviewCards(range);
            this.hideLoadingState();
            this.showNotification('Dữ liệu đã được cập nhật', 'success');
        }, 1000);
    }

    updateChartData(range) {
        if (!this.charts.attendance) return;

        let newData, newLabels;

        switch (range) {
            case 'week':
                newLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
                newData = [8.2, 8.5, 7.8, 8.0, 8.3, 0, 0];
                break;
            case 'month':
                newLabels = this.getTimeLabels();
                newData = [8.2, 8.5, 7.8, 8.0, 8.3, 8.1, 8.4, 8.2, 8.6, 8.0, 8.5, 8.3, 8.2, 8.4];
                break;
            case 'quarter':
                newLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
                newData = [165, 158, 147, 162, 159, 148, 155, 161, 153, 159, 164, 158];
                break;
            case 'year':
                newLabels = ['2020', '2021', '2022', '2023', '2024'];
                newData = [1850, 1920, 1880, 1950, 1980];
                break;
            default:
                return;
        }

        this.charts.attendance.data.labels = newLabels;
        this.charts.attendance.data.datasets[0].data = newData;
        this.charts.attendance.update('active');
    }

    updateOverviewCards(range) {
        const updates = {
            week: { attendance: '95.5%', hours: '8.1 giờ', events: '3', performance: '9.3' },
            month: { attendance: '96.5%', hours: '8.2 giờ', events: '15', performance: '9.2' },
            quarter: { attendance: '94.2%', hours: '8.0 giờ', events: '42', performance: '9.1' },
            year: { attendance: '95.8%', hours: '8.1 giờ', events: '156', performance: '9.2' }
        };

        const data = updates[range] || updates.month;

        this.animateValueUpdate('.attendance-rate .stat-value', data.attendance);
        this.animateValueUpdate('.work-hours .stat-value', data.hours);
        this.animateValueUpdate('.events-participated .stat-value', data.events);
        this.animateValueUpdate('.performance-score .stat-value', data.performance + '/10');
    }

    animateValueUpdate(selector, newValue) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.style.opacity = '0.5';
        element.style.transform = 'scale(0.9)';

        setTimeout(() => {
            element.innerHTML = newValue;
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 200);
    }

    // Animation Management
    animateElements() {
        // Animate overview cards
        const overviewCards = document.querySelectorAll('.overview-card');
        overviewCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150 + 300);
        });

        // Animate progress bars
        setTimeout(() => {
            this.animateProgressBars();
        }, 800);

        // Animate stats cards
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100 + 1000);
        });
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            const width = bar.style.width;
            bar.style.width = '0%';
            bar.style.transition = 'none';

            setTimeout(() => {
                bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                bar.style.width = width;
            }, index * 100);
        });
    }

    // Data Management
    loadStatistics() {
        this.showLoadingState();

        // Simulate API call
        setTimeout(() => {
            this.hideLoadingState();
            console.log('📊 Statistics loaded successfully');
        }, 1500);
    }

    refreshData() {
        const refreshBtn = document.getElementById('refreshBtn');
        const icon = refreshBtn.querySelector('i');

        icon.style.animation = 'spin 1s linear infinite';
        refreshBtn.disabled = true;

        setTimeout(() => {
            this.updateTimeRange(this.currentTimeRange);
            icon.style.animation = '';
            refreshBtn.disabled = false;
            this.showNotification('Dữ liệu đã được làm mới', 'success');
        }, 2000);
    }

    // Export Functionality
    exportReport() {
        const exportBtn = document.getElementById('exportBtn');
        const originalText = exportBtn.innerHTML;

        exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Đang xuất...</span>';
        exportBtn.disabled = true;

        setTimeout(() => {
            // Create report data
            const reportData = {
                period: this.currentTimeRange,
                attendanceRate: '96.5%',
                averageHours: '8.2 hours',
                eventsParticipated: 15,
                performanceScore: '9.2/10',
                exportDate: new Date().toISOString(),
                detailedData: this.getDetailedReportData()
            };

            this.downloadReport(reportData);

            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
            this.showNotification('Báo cáo đã được xuất thành công!', 'success');
        }, 3000);
    }

    getDetailedReportData() {
        return {
            dailyAttendance: this.charts.attendance?.data?.datasets[0]?.data || [],
            performanceMetrics: {
                onTimeCompletion: '95.2%',
                workQuality: '9.1/10',
                teamwork: '8.8/10',
                innovation: '8.7/10'
            },
            goals: [
                { name: 'Chấm công hoàn hảo', progress: '98.5%', status: 'Gần hoàn thành' },
                { name: 'Sự kiện tham gia', progress: '75%', status: 'Đang thực hiện' },
                { name: 'Điểm hiệu suất', progress: '92%', status: 'Đang thực hiện' }
            ]
        };
    }

    downloadReport(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `thong-ke-ca-nhan-${this.currentTimeRange}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    // Search Functionality
    handleSearch(query) {
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }

        // Simulate search results
        const results = [
            { type: 'metric', title: 'Tỷ lệ chấm công', value: '96.5%' },
            { type: 'goal', title: 'Sự kiện tham gia', value: '15/20' },
            { type: 'activity', title: 'Hoàn thành dự án Website CLB', date: '2 giờ trước' }
        ];

        this.showSearchResults(results.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
        ));
    }

    showSearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">Không tìm thấy kết quả</div>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item">
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-value">${result.value || result.date}</div>
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

    // Goal Management
    showAddGoalModal() {
        this.showNotification('Chức năng thêm mục tiêu sẽ có trong phiên bản tiếp theo', 'info');
    }

    // Loading States
    showLoadingState() {
        const cards = document.querySelectorAll('.overview-card, .stats-card');
        cards.forEach(card => {
            card.classList.add('loading');
        });
    }

    hideLoadingState() {
        const cards = document.querySelectorAll('.overview-card, .stats-card');
        cards.forEach(card => {
            card.classList.remove('loading');
        });
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
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

    // Responsive Handling
    handleResize() {
        if (this.charts.attendance) {
            this.charts.attendance.resize();
        }

        // Hide sidebar on mobile when clicking outside
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                setTimeout(() => {
                    sidebar.classList.remove('active');
                }, 100);
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.personalStatisticsManager = new PersonalStatisticsManager();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC key to close modals and dropdowns
    if (e.key === 'Escape') {
        const manager = window.personalStatisticsManager;
        if (manager) {
            manager.hideUserDropdown();
            manager.hideSearchResults();
        }
    }

    // Ctrl/Cmd + R to refresh data
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        const manager = window.personalStatisticsManager;
        if (manager) {
            manager.refreshData();
        }
    }
});

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-container {
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
        pointer-events: none;
    }

    .notification {
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        border-left: 4px solid;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideInRight 0.3s ease;
        pointer-events: auto;
    }

    .notification.success {
        border-left-color: #10b981;
        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    }

    .notification.error {
        border-left-color: #ef4444;
        background: linear-gradient(135deg, #fef2f2, #fee2e2);
    }

    .notification.warning {
        border-left-color: #f59e0b;
        background: linear-gradient(135deg, #fffbeb, #fef3c7);
    }

    .notification.info {
        border-left-color: #2563eb;
        background: linear-gradient(135deg, #eff6ff, #dbeafe);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        font-size: 14px;
        font-weight: 500;
    }

    .notification-close {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.15s ease;
    }

    .notification-close:hover {
        background: rgba(0,0,0,0.1);
        color: #374151;
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

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* Calendar header styling */
    .calendar-header-day {
        background: #f1f5f9;
        padding: 12px;
        text-align: center;
        font-weight: 600;
        font-size: 12px;
        color: #64748b;
        text-transform: uppercase;
    }

    /* Search results styling */
    .search-result-item {
        padding: 12px 16px;
        border-bottom: 1px solid #f1f5f9;
        cursor: pointer;
        transition: background-color 0.15s ease;
    }

    .search-result-item:hover {
        background: #f8fafc;
    }

    .search-result-title {
        font-weight: 500;
        color: #1e293b;
        margin-bottom: 2px;
    }

    .search-result-value {
        font-size: 12px;
        color: #64748b;
    }

    .search-no-results {
        padding: 16px;
        text-align: center;
        color: #64748b;
        font-size: 14px;
    }
`;

document.head.appendChild(notificationStyles);

console.log('📊 Personal Statistics Manager loaded successfully!');

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalStatisticsManager;
}
