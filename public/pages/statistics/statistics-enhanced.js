/* Statistics Enhanced JavaScript - Enhanced functionality for Statistics page */

class StatisticsDashboard {
    constructor() {
        this.charts = {};
        this.statsData = {
            attendanceRate: 96.5,
            workHours: 8.2,
            eventsParticipated: 15,
            performanceScore: 9.2
        };
        this.timeRange = 'month';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCharts();
        this.loadStatistics();
        this.setupAutoRefresh();
        this.animateStats();
    }

    setupEventListeners() {
        // Time range selector
        const timeRangeSelect = document.getElementById('timeRange');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', (e) => {
                this.timeRange = e.target.value;
                this.updateStatistics();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshStatistics();
            });
        }

        // Export buttons
        const exportBtns = document.querySelectorAll('.export-btn');
        exportBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = btn.dataset.type;
                this.exportReport(type);
            });
        });

        // Main export button
        const mainExportBtn = document.getElementById('exportBtn');
        if (mainExportBtn) {
            mainExportBtn.addEventListener('click', () => {
                this.exportDetailedReport();
            });
        }

        // Quick actions
        const exportDetailedBtn = document.getElementById('exportDetailedReport');
        if (exportDetailedBtn) {
            exportDetailedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportDetailedReport();
            });
        }

        const shareStatsBtn = document.getElementById('shareStatistics');
        if (shareStatsBtn) {
            shareStatsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.shareStatistics();
            });
        }

        // Chart controls
        this.setupChartControls();
    }

    setupChartControls() {
        const filterBtns = document.querySelectorAll('.btn-filter');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showChartFilters();
            });
        });

        const refreshBtns = document.querySelectorAll('.btn-refresh');
        refreshBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.refreshCharts();
            });
        });
    }

    initializeCharts() {
        this.initAttendanceChart();
        this.initPerformanceChart();
    }

    initAttendanceChart() {
        const canvas = document.getElementById('attendanceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        this.charts.attendance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                datasets: [{
                    label: 'Giờ làm việc',
                    data: [8.5, 7.8, 9.2, 8.0, 7.5, 6.2, 0],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: (context) => {
                                return `Giờ làm việc: ${context.parsed.y} giờ`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#6b7280',
                            callback: (value) => value + 'h'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    initPerformanceChart() {
        const canvas = document.getElementById('performanceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        this.charts.performance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Đúng giờ', 'Tương tác', 'Chất lượng', 'Hoàn thành'],
                datasets: [{
                    data: [95, 88, 96, 92],
                    backgroundColor: [
                        '#10b981',
                        '#3b82f6',
                        '#f59e0b',
                        '#06b6d4'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    loadStatistics() {
        this.showLoading();

        // Simulate API call
        setTimeout(() => {
            this.updateStatsDisplay();
            this.hideLoading();
            this.showSuccessNotification('Đã tải thống kê thành công');
        }, 1000);
    }

    updateStatistics() {
        this.showLoading();

        // Simulate updating based on time range
        setTimeout(() => {
            // Update stats based on time range
            switch (this.timeRange) {
                case 'week':
                    this.statsData.attendanceRate = 94.2;
                    this.statsData.workHours = 7.8;
                    this.statsData.eventsParticipated = 3;
                    this.statsData.performanceScore = 8.9;
                    break;
                case 'month':
                    this.statsData.attendanceRate = 96.5;
                    this.statsData.workHours = 8.2;
                    this.statsData.eventsParticipated = 15;
                    this.statsData.performanceScore = 9.2;
                    break;
                case 'quarter':
                    this.statsData.attendanceRate = 97.1;
                    this.statsData.workHours = 8.4;
                    this.statsData.eventsParticipated = 42;
                    this.statsData.performanceScore = 9.4;
                    break;
                case 'year':
                    this.statsData.attendanceRate = 95.8;
                    this.statsData.workHours = 8.1;
                    this.statsData.eventsParticipated = 165;
                    this.statsData.performanceScore = 9.1;
                    break;
            }

            this.updateStatsDisplay();
            this.updateCharts();
            this.hideLoading();
            this.showSuccessNotification(`Đã cập nhật thống kê cho ${this.getTimeRangeLabel()}`);
        }, 800);
    }

    refreshStatistics() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync fa-spin"></i> Đang làm mới...';
            refreshBtn.disabled = true;
        }

        setTimeout(() => {
            this.loadStatistics();

            if (refreshBtn) {
                refreshBtn.innerHTML = '<i class="fas fa-sync"></i> Làm mới';
                refreshBtn.disabled = false;
            }
        }, 1500);
    }

    updateStatsDisplay() {
        // Update stat cards
        const cards = document.querySelectorAll('.stat-card');
        cards.forEach((card, index) => {
            const statInfo = card.querySelector('.stat-info h3');
            const trendSpan = card.querySelector('.stat-trend span');

            switch (card.dataset.stat) {
                case 'attendanceRate':
                    if (statInfo) statInfo.textContent = this.statsData.attendanceRate + '%';
                    break;
                case 'workHours':
                    if (statInfo) statInfo.textContent = this.statsData.workHours + ' giờ';
                    break;
                case 'eventsParticipated':
                    if (statInfo) statInfo.textContent = this.statsData.eventsParticipated;
                    break;
                case 'performanceScore':
                    if (statInfo) statInfo.textContent = this.statsData.performanceScore + '/10';
                    break;
            }

            // Animate the update
            card.classList.add('stats-success');
            setTimeout(() => {
                card.classList.remove('stats-success');
            }, 2000);
        });
    }

    updateCharts() {
        if (this.charts.attendance) {
            // Update attendance chart data based on time range
            const newData = this.generateAttendanceData();
            this.charts.attendance.data.datasets[0].data = newData;
            this.charts.attendance.update('active');
        }

        if (this.charts.performance) {
            // Update performance chart
            const newPerfData = this.generatePerformanceData();
            this.charts.performance.data.datasets[0].data = newPerfData;
            this.charts.performance.update('active');
        }
    }

    generateAttendanceData() {
        // Generate sample data based on time range
        switch (this.timeRange) {
            case 'week':
                return [8.5, 7.8, 9.2, 8.0, 7.5, 6.2, 0];
            case 'month':
                return [8.2, 8.0, 8.5, 7.8, 8.1, 7.9, 6.5];
            case 'quarter':
                return [8.4, 8.2, 8.6, 8.1, 8.3, 8.0, 7.2];
            case 'year':
                return [8.1, 7.9, 8.3, 8.0, 8.2, 7.8, 7.0];
            default:
                return [8.2, 8.0, 8.5, 7.8, 8.1, 7.9, 6.5];
        }
    }

    generatePerformanceData() {
        switch (this.timeRange) {
            case 'week':
                return [92, 85, 94, 89];
            case 'month':
                return [95, 88, 96, 92];
            case 'quarter':
                return [97, 91, 98, 95];
            case 'year':
                return [94, 87, 95, 91];
            default:
                return [95, 88, 96, 92];
        }
    }

    animateStats() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 200);
        });
    }

    showLoading() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.classList.add('stats-loading');
        });
    }

    hideLoading() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.classList.remove('stats-loading');
        });
    }

    exportReport(type) {
        this.showNotification(`Đang xuất báo cáo ${type.toUpperCase()}...`, 'info');

        setTimeout(() => {
            // Simulate export
            this.showSuccessNotification(`Đã xuất báo cáo ${type.toUpperCase()} thành công`);

            // Create download link simulation
            const link = document.createElement('a');
            link.href = '#';
            link.download = `bao-cao-thong-ke-${this.timeRange}.${type}`;
            link.click();
        }, 2000);
    }

    exportDetailedReport() {
        this.showNotification('Đang tạo báo cáo chi tiết...', 'info');

        setTimeout(() => {
            this.showSuccessNotification('Báo cáo chi tiết đã được tạo và tải xuống');
        }, 3000);
    }

    shareStatistics() {
        if (navigator.share) {
            navigator.share({
                title: 'Thống kê cá nhân CTSV',
                text: `Tỷ lệ chấm công: ${this.statsData.attendanceRate}%, Điểm hiệu suất: ${this.statsData.performanceScore}/10`,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                this.showSuccessNotification('Đã sao chép liên kết thống kê vào clipboard');
            });
        }
    }

    showChartFilters() {
        this.showNotification('Tính năng bộ lọc biểu đồ đang được phát triển', 'info');
    }

    refreshCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.update('active');
            }
        });
        this.showSuccessNotification('Đã làm mới tất cả biểu đồ');
    }

    setupAutoRefresh() {
        const autoRefreshEnabled = localStorage.getItem('autoRefreshStats') !== 'false';

        if (autoRefreshEnabled) {
            setInterval(() => {
                this.updateStatistics();
            }, 300000); // 5 minutes
        }
    }

    getTimeRangeLabel() {
        const labels = {
            'week': '7 ngày qua',
            'month': '30 ngày qua',
            'quarter': '3 tháng qua',
            'year': '12 tháng qua'
        };
        return labels[this.timeRange] || '30 ngày qua';
    }

    showNotification(message, type = 'info') {
        // Use dashboard notification system if available
        if (window.dashboard && window.dashboard.showNotification) {
            window.dashboard.showNotification(message, type);
        } else {
            // Fallback notification
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    showSuccessNotification(message) {
        this.showNotification(message, 'success');
    }
}

// Initialize Statistics Dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize only if we're on the statistics page
    if (document.querySelector('.dashboard-stats')) {
        window.statisticsDashboard = new StatisticsDashboard();
    }
});

// Export for global use
window.StatisticsDashboard = StatisticsDashboard;
