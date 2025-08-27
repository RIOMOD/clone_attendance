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
        let spinner = document.getElementById('loadingSpinner');
        if (show) {
            if (spinner) {
                spinner.style.display = 'flex';
            }
        } else {
            if (spinner) {
                spinner.style.display = 'none';
            }
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
            ]);

// Update components with animation
await this.updateStatsAnimated(statsData);
await this.updateChartsAnimated(chartsData);
await this.updateActivitiesAnimated(activitiesData);

this.showNotification('✅ Dữ liệu dashboard đã được cập nhật', 'success');

        } catch (error) {
    console.error('Error loading dashboard data:', error);
    this.showNotification('❌ Lỗi tải dữ liệu dashboard', 'error');
} finally {
    this.isLoading = false;
    this.showLoading(false);
}
    }

    async loadWithProgress() {
    const progressBar = document.querySelector('.loading-progress');
    if (!progressBar) return;

    for (let i = 0; i <= 100; i += 20) {
        progressBar.style.width = `${i}%`;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

    async fetchStats() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                totalStudents: Math.floor(Math.random() * 500) + 1000,
                todayEvents: Math.floor(Math.random() * 15) + 10,
                activeClubs: Math.floor(Math.random() * 10) + 15,
                pendingTasks: Math.floor(Math.random() * 5) + 3,
                todayAttendance: Math.floor(Math.random() * 200) + 300,
                systemHealth: Math.floor(Math.random() * 20) + 80
            });
        }, 800);
    });
}

    async fetchChartData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
            const attendanceData = days.map(() => Math.floor(Math.random() * 300) + 100);

            resolve({
                attendance: {
                    labels: days,
                    data: attendanceData
                },
                clubActivity: {
                    labels: ['Hoạt động tích cực', 'Hoạt động ít', 'Mới tạo', 'Tạm dừng'],
                    data: [12, 8, 5, 2]
                },
                eventTypes: {
                    labels: ['Hội thảo', 'Workshop', 'Thi đấu', 'Giao lưu'],
                    data: [35, 25, 20, 20]
                }
            });
        }, 1000);
    });
}

    async fetchActivities() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const activities = [
                {
                    id: 1,
                    type: 'success',
                    icon: 'user-check',
                    title: 'Check-in thành công',
                    description: 'Nguyễn Văn A đã check-in vào CLB IT',
                    time: '2 phút trước',
                    avatar: '../../assets/images/avatars/user1.jpg'
                },
                {
                    id: 2,
                    type: 'info',
                    icon: 'calendar-plus',
                    title: 'Sự kiện mới',
                    description: 'Workshop "AI trong giáo dục" đã được tạo',
                    time: '15 phút trước',
                    avatar: '../../assets/images/avatars/event.jpg'
                },
                {
                    id: 3,
                    type: 'warning',
                    icon: 'exclamation-triangle',
                    title: 'Cảnh báo hệ thống',
                    description: 'Tải CPU đang ở mức cao (85%)',
                    time: '30 phút trước'
                },
                {
                    id: 4,
                    type: 'success',
                    icon: 'users',
                    title: 'Thành viên mới',
                    description: 'CLB Nhiếp ảnh có 5 thành viên mới',
                    time: '1 giờ trước'
                }
            ];
            resolve(activities);
        }, 600);
    });
}

    // Enhanced Stats Update with Animation
    async updateStatsAnimated(data) {
    this.stats = data;

    const statMappings = {
        'totalStudents': data.totalStudents,
        'todayEvents': data.todayEvents,
        'activeClubs': data.activeClubs,
        'pendingTasks': data.pendingTasks,
        'todayAttendance': data.todayAttendance,
        'systemHealth': data.systemHealth
    };

    // Animate each stat card
    const promises = Object.entries(statMappings).map(([key, value]) => {
        const element = document.querySelector(`[data-stat="${key}"] .stat-value`);
        if (element) {
            return this.animateCountUp(element, value);
        }
    });

    await Promise.all(promises.filter(Boolean));
}

animateCountUp(element, targetValue) {
    return new Promise((resolve) => {
        const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutCubic);

            element.textContent = currentValue.toLocaleString('vi-VN');

            // Add glow effect during animation
            element.style.textShadow = `0 0 ${10 * (1 - progress)}px var(--stat-color, #3b82f6)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.textShadow = 'none';
                resolve();
            }
        };

        requestAnimationFrame(animate);
    });
}

// Enhanced Charts
initCharts() {
    this.initAttendanceChart();
    this.initClubActivityChart();
    this.initEventTypesChart();
}

initAttendanceChart() {
    const canvas = document.getElementById('attendanceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (this.charts.attendance) {
        this.charts.attendance.destroy();
    }

    this.charts.attendance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Số lượng chấm công',
                data: [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#1d4ed8',
                pointHoverBorderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        color: '#6b7280'
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
            },
            animation: {
                duration: 1500,
                easing: 'easeOutCubic'
            }
        }
    });
}

initClubActivityChart() {
    const canvas = document.getElementById('clubActivityChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (this.charts.clubActivity) {
        this.charts.clubActivity.destroy();
    }

    this.charts.clubActivity = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#10b981',
                    '#f59e0b',
                    '#3b82f6',
                    '#ef4444'
                ],
                borderWidth: 3,
                borderColor: '#ffffff',
                hoverBorderWidth: 4,
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
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white'
                }
            },
            cutout: '60%',
            animation: {
                animateRotate: true,
                duration: 2000
            }
        }
    });
}

initEventTypesChart() {
    const canvas = document.getElementById('eventTypesChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (this.charts.eventTypes) {
        this.charts.eventTypes.destroy();
    }

    this.charts.eventTypes = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Số lượng sự kiện',
                data: [],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
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
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutBounce'
            }
        }
    });
}

    async updateChartsAnimated(data) {
    const updatePromises = [];

    // Update attendance chart
    if (this.charts.attendance && data.attendance) {
        updatePromises.push(new Promise(resolve => {
            this.charts.attendance.data.labels = data.attendance.labels;
            this.charts.attendance.data.datasets[0].data = data.attendance.data;
            this.charts.attendance.update('active');
            setTimeout(resolve, 1500);
        }));
    }

    // Update club activity chart
    if (this.charts.clubActivity && data.clubActivity) {
        updatePromises.push(new Promise(resolve => {
            this.charts.clubActivity.data.labels = data.clubActivity.labels;
            this.charts.clubActivity.data.datasets[0].data = data.clubActivity.data;
            this.charts.clubActivity.update('active');
            setTimeout(resolve, 2000);
        }));
    }

    // Update event types chart
    if (this.charts.eventTypes && data.eventTypes) {
        updatePromises.push(new Promise(resolve => {
            this.charts.eventTypes.data.labels = data.eventTypes.labels;
            this.charts.eventTypes.data.datasets[0].data = data.eventTypes.data;
            this.charts.eventTypes.update('active');
            setTimeout(resolve, 1500);
        }));
    }

    await Promise.all(updatePromises);
}

    async updateActivitiesAnimated(activities) {
    const container = document.getElementById('activitiesList');
    if (!container) return;

    // Clear existing activities with fade out
    const existingItems = container.querySelectorAll('.activity-item');
    existingItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
        }, index * 100);
    });

    // Wait for fade out
    await new Promise(resolve => setTimeout(resolve, existingItems.length * 100 + 300));

    // Clear container
    container.innerHTML = '';

    // Add new activities with fade in
    activities.forEach((activity, index) => {
        setTimeout(() => {
            const activityElement = this.createActivityElement(activity);
            container.appendChild(activityElement);

            // Animate in
            requestAnimationFrame(() => {
                activityElement.style.opacity = '1';
                activityElement.style.transform = 'translateX(0)';
            });
        }, index * 150);
    });
}

createActivityElement(activity) {
    const element = document.createElement('div');
    element.className = `activity-item activity-${activity.type}`;
    element.style.opacity = '0';
    element.style.transform = 'translateX(20px)';
    element.style.transition = 'all 0.3s ease';

    element.innerHTML = `
            <div class="activity-icon">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
            ${activity.avatar ? `<div class="activity-avatar"><img src="${activity.avatar}" alt="Avatar"></div>` : ''}
        `;

    return element;
}

// Enhanced UI Functions
showLoading(show) {
    const loader = document.getElementById('dashboardLoader');
    if (loader) {
        if (show) {
            loader.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            loader.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
}

showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type} show`;

    notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            </div>
            <div class="notification-content">
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

    container.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'times-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

    // Enhanced Functions
    async handleRefresh() {
    const button = document.getElementById('refreshDashboard');
    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang làm mới...';
    }

    await this.loadDashboardData();

    if (button) {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-sync"></i> Làm mới';
    }
}

setupAnimations() {
    // Add entrance animations to existing elements
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

setupTheme() {
    const savedTheme = localStorage.getItem('dashboard-theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
}

toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('dashboard-theme', newTheme);

    this.showNotification(`🎨 Đã chuyển sang giao diện ${newTheme === 'dark' ? 'tối' : 'sáng'}`, 'info');
}

handleResize() {
    // Redraw charts on resize
    Object.values(this.charts).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            chart.resize();
        }
    });
}

// Export Functions
handleExport(type) {
    switch (type) {
        case 'pdf':
            this.exportToPDF();
            break;
        case 'excel':
            this.exportToExcel();
            break;
        case 'image':
            this.exportToImage();
            break;
        default:
            this.showNotification('Loại xuất dữ liệu không được hỗ trợ', 'warning');
    }
}

exportToPDF() {
    this.showNotification('📄 Đang chuẩn bị xuất PDF...', 'info');
    setTimeout(() => {
        this.showNotification('✅ Xuất PDF thành công!', 'success');
    }, 2000);
}

exportToExcel() {
    this.showNotification('📊 Đang chuẩn bị xuất Excel...', 'info');
    setTimeout(() => {
        this.showNotification('✅ Xuất Excel thành công!', 'success');
    }, 2000);
}

exportToImage() {
    this.showNotification('🖼️ Đang chuẩn bị xuất hình ảnh...', 'info');
    setTimeout(() => {
        this.showNotification('✅ Xuất hình ảnh thành công!', 'success');
    }, 2000);
}

// Auto Refresh
startAutoRefresh() {
    this.refreshInterval = setInterval(() => {
        this.loadDashboardData();
    }, 300000); // Refresh every 5 minutes
}

stopAutoRefresh() {
    if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
    }
}

updateDateRange() {
    const dateRange = document.getElementById('dateRange');
    if (dateRange) {
        this.showNotification(`📅 Đã cập nhật khoảng thời gian: ${dateRange.value}`, 'info');
        this.loadDashboardData();
    }
}

// Cleanup
destroy() {
    this.stopAutoRefresh();
    Object.values(this.charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });

    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
}
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Dashboard page loaded, initializing enhanced interface...');
    window.dashboardModule = new DashboardModule();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.dashboardModule) {
        window.dashboardModule.destroy();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DashboardModule };
}
