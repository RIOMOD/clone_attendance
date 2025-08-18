/**
 * Dashboard Module - Clean and Optimized
 * Hệ thống dashboard tối ưu - Không có code thừa
 */

class DashboardModule {
    constructor() {
        this.charts = {};
        this.isLoading = false;
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

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    initializeComponents() {
        this.initCharts();
        this.setupAnimations();
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

    handleExport(type) {
        this.showNotification(`Đang xuất báo cáo ${type.toUpperCase()}...`, 'info');
        // Simulate export process
        setTimeout(() => {
            this.showNotification(`Xuất báo cáo ${type.toUpperCase()} thành công!`, 'success');
        }, 1000);
    }

    updateDateRange() {
        const dateRange = document.getElementById('dateRange');
        if (dateRange) {
            this.showNotification(`Cập nhật thời gian: ${dateRange.options[dateRange.selectedIndex].text}`, 'info');
            this.loadDashboardData();
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
        }
        this.showNotification('Đã thay đổi giao diện', 'success');
    }

    setupTheme() {
        // Initialize theme based on system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
            const icon = document.querySelector('#themeToggle i');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
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
    }

    handleResize() {
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
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new DashboardModule();
});

// Export for global access
window.DashboardModule = DashboardModule;
