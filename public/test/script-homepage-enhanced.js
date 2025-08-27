/* ===== ENHANCED HOMEPAGE INTERACTIVITY ===== */

// Enhanced Homepage Dashboard Manager
class EnhancedHomepageDashboard {
    constructor() {
        this.charts = {};
        this.realTimeData = {
            attendance: [65, 78, 66, 85, 92, 45, 23],
            clubs: [15, 8, 2],
            stats: {
                totalStudents: 1247,
                presentToday: 892,
                averageAttendance: 85.4,
                activeSessions: 24
            }
        };

        this.init();
    }

    init() {
        this.initializeFilters();
        this.initializeAnimations();
        this.initializeChartInteractions();
        this.initializeRealTimeUpdates();
        this.initializeActivityFilters();

        console.log('✅ Enhanced Homepage Dashboard initialized');
    }

    // Filter functionality
    initializeFilters() {
        // Activity filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Remove active from all tabs
                filterTabs.forEach(t => t.classList.remove('active'));

                // Add active to clicked tab
                e.target.classList.add('active');

                // Filter activities
                this.filterActivities(e.target.dataset.filter);
            });
        });

        // Advanced filter toggle
        const filterBtn = document.getElementById('activityFilter');
        const filterPanel = document.getElementById('activityFilters');

        if (filterBtn && filterPanel) {
            filterBtn.addEventListener('click', () => {
                const isVisible = filterPanel.style.display === 'block';
                filterPanel.style.display = isVisible ? 'none' : 'block';

                if (!isVisible) {
                    filterPanel.classList.add('slide-down');
                }
            });
        }
    }

    filterActivities(filter) {
        const activities = document.querySelectorAll('.activity-item');

        activities.forEach(activity => {
            if (filter === 'all') {
                activity.style.display = 'flex';
                activity.classList.add('fade-in');
            } else {
                const activityType = activity.dataset.type;
                if (activityType === filter) {
                    activity.style.display = 'flex';
                    activity.classList.add('fade-in');
                } else {
                    activity.style.display = 'none';
                }
            }
        });

        // Update activity count
        this.updateActivityCount(filter);
    }

    updateActivityCount(filter) {
        const visibleActivities = document.querySelectorAll(
            filter === 'all'
                ? '.activity-item'
                : `.activity-item[data-type="${filter}"]`
        );

        console.log(`Showing ${visibleActivities.length} activities for filter: ${filter}`);
    }

    // Animations
    initializeAnimations() {
        // Animate stats cards on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');

                    // Animate counter if it's a stat card
                    if (entry.target.classList.contains('stat-card')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all stat cards and chart cards
        document.querySelectorAll('.stat-card, .chart-card, .quick-action-card').forEach(card => {
            observer.observe(card);
        });
    }

    animateCounter(statCard) {
        const valueElement = statCard.querySelector('h3');
        if (!valueElement) return;

        const finalValue = valueElement.textContent;
        const isPercentage = finalValue.includes('%');
        const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));

        if (isNaN(numericValue)) return;

        let currentValue = 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            currentValue = numericValue * easeOutQuart;

            if (isPercentage) {
                valueElement.textContent = currentValue.toFixed(1) + '%';
            } else {
                valueElement.textContent = Math.floor(currentValue).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Chart interactions
    initializeChartInteractions() {
        // Chart period selector
        const periodSelect = document.getElementById('chartPeriod');
        if (periodSelect) {
            periodSelect.addEventListener('change', (e) => {
                const period = e.target.value;
                this.updateChartData(period);
            });
        }

        // Chart action buttons
        document.querySelectorAll('.btn-chart-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.title.toLowerCase();
                this.handleChartAction(action, btn);
            });
        });
    }

    updateChartData(period) {
        // Simulate different data based on period
        let newData, newLabels;

        switch (period) {
            case '7':
                newLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
                newData = [65, 78, 66, 85, 92, 45, 23];
                break;
            case '30':
                newLabels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
                newData = [320, 380, 350, 420];
                break;
            case '90':
                newLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3'];
                newData = [1200, 1350, 1180];
                break;
        }

        // Update chart if it exists
        if (this.charts.attendance) {
            this.charts.attendance.data.labels = newLabels;
            this.charts.attendance.data.datasets[0].data = newData;
            this.charts.attendance.update('active');
        }
    }

    handleChartAction(action, button) {
        switch (action) {
            case 'tải xuống':
                this.downloadChart(button);
                break;
            case 'toàn màn hình':
                this.toggleFullscreen(button);
                break;
            case 'làm mới':
                this.refreshChart(button);
                break;
        }
    }

    downloadChart(button) {
        // Create loading state
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        // Simulate download
        setTimeout(() => {
            this.showNotification('Biểu đồ đã được tải xuống thành công!', 'success');
            button.innerHTML = originalIcon;
            button.disabled = false;
        }, 1500);
    }

    toggleFullscreen(button) {
        const chartCard = button.closest('.chart-card');

        if (chartCard.classList.contains('fullscreen')) {
            chartCard.classList.remove('fullscreen');
            document.body.classList.remove('chart-fullscreen');
            button.innerHTML = '<i class="fas fa-expand"></i>';
        } else {
            chartCard.classList.add('fullscreen');
            document.body.classList.add('chart-fullscreen');
            button.innerHTML = '<i class="fas fa-compress"></i>';
        }
    }

    refreshChart(button) {
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        // Simulate refresh
        setTimeout(() => {
            // Update with new random data
            this.realTimeData.attendance = this.realTimeData.attendance.map(() =>
                Math.floor(Math.random() * 100)
            );

            if (this.charts.attendance) {
                this.charts.attendance.data.datasets[0].data = this.realTimeData.attendance;
                this.charts.attendance.update('active');
            }

            this.showNotification('Biểu đồ đã được cập nhật!', 'info');
            button.innerHTML = originalIcon;
            button.disabled = false;
        }, 1000);
    }

    // Real-time updates
    initializeRealTimeUpdates() {
        // Update stats every 30 seconds
        setInterval(() => {
            this.updateStatsWithAnimation();
        }, 30000);

        // Update activity timeline every 60 seconds
        setInterval(() => {
            this.addNewActivity();
        }, 60000);
    }

    updateStatsWithAnimation() {
        const stats = document.querySelectorAll('.stat-card h3');
        stats.forEach(stat => {
            // Add pulse animation
            stat.style.animation = 'pulse 0.5s ease-in-out';

            setTimeout(() => {
                // Update value with slight variation
                const currentValue = parseFloat(stat.textContent.replace(/[^\d.]/g, ''));
                const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
                const newValue = currentValue * (1 + variation);

                if (stat.textContent.includes('%')) {
                    stat.textContent = newValue.toFixed(1) + '%';
                } else {
                    stat.textContent = Math.floor(newValue).toLocaleString();
                }

                stat.style.animation = '';
            }, 250);
        });
    }

    addNewActivity() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;

        // Sample new activities
        const newActivities = [
            {
                type: 'attendance',
                icon: 'fas fa-user-check',
                iconClass: 'success',
                title: 'Điểm danh mới',
                description: '<strong>Sinh viên mới</strong> đã điểm danh cho sự kiện "Workshop AI"',
                badge: { text: 'Mới', class: 'new' },
                time: 'Vừa xong'
            },
            {
                type: 'events',
                icon: 'fas fa-calendar-plus',
                iconClass: 'info',
                title: 'Sự kiện được duyệt',
                description: 'Sự kiện <strong>"Hackathon 2024"</strong> đã được phê duyệt',
                badge: { text: 'Đã duyệt', class: 'success' },
                time: 'Vừa xong'
            }
        ];

        const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];

        // Create new activity element
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item new-activity';
        activityElement.dataset.type = randomActivity.type;

        activityElement.innerHTML = `
            <div class="activity-icon ${randomActivity.iconClass} pulse">
                <i class="${randomActivity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-header">
                    <div class="activity-title">${randomActivity.title}</div>
                    <div class="activity-badge ${randomActivity.badge.class}">${randomActivity.badge.text}</div>
                </div>
                <div class="activity-description">${randomActivity.description}</div>
                <div class="activity-meta">
                    <span class="activity-time">
                        <i class="fas fa-clock"></i>
                        ${randomActivity.time}
                    </span>
                </div>
            </div>
        `;

        // Insert at the beginning
        activityList.insertBefore(activityElement, activityList.firstChild);

        // Add entrance animation
        setTimeout(() => {
            activityElement.classList.add('fade-in');
        }, 100);

        // Remove the last activity if there are too many
        const activities = activityList.querySelectorAll('.activity-item');
        if (activities.length > 6) {
            activities[activities.length - 1].remove();
        }
    }

    // Activity filters
    initializeActivityFilters() {
        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreActivities');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreActivities();
            });
        }

        // Refresh activity button
        const refreshBtn = document.getElementById('refreshActivity');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshActivities();
            });
        }
    }

    loadMoreActivities() {
        const button = document.getElementById('loadMoreActivities');
        const originalText = button.innerHTML;

        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';
        button.disabled = true;

        // Simulate loading
        setTimeout(() => {
            // Add 3 more activities
            for (let i = 0; i < 3; i++) {
                this.addNewActivity();
            }

            this.showNotification('Đã tải thêm hoạt động!', 'success');
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
    }

    refreshActivities() {
        const button = document.getElementById('refreshActivity');
        const originalIcon = button.innerHTML;

        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        // Simulate refresh
        setTimeout(() => {
            // Add one new activity at the top
            this.addNewActivity();

            this.showNotification('Hoạt động đã được cập nhật!', 'info');
            button.innerHTML = originalIcon;
            button.disabled = false;
        }, 1000);
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to container
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'warning': return 'exclamation-triangle';
            case 'error': return 'times-circle';
            default: return 'info-circle';
        }
    }
}

// Initialize enhanced dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedHomepage = new EnhancedHomepageDashboard();
});

// Add CSS for new features
const enhancedStyles = `
    <style>
        .animate-in {
            animation: slideInUp 0.6s ease-out;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .new-activity {
            border-left: 4px solid var(--success);
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }
        
        .slide-down {
            animation: slideDown 0.3s ease-out;
        }
        
        .chart-card.fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 9999;
            background: white;
            border-radius: 0;
        }
        
        .chart-fullscreen {
            overflow: hidden;
        }
        
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .notification {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(400px);
            animation: slideInRight 0.3s ease-out forwards;
            max-width: 400px;
        }
        
        .notification.success {
            background: linear-gradient(135deg, #10b981, #059669);
        }
        
        .notification.info {
            background: linear-gradient(135deg, #06b6d4, #0891b2);
        }
        
        .notification.warning {
            background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        
        .notification.error {
            background: linear-gradient(135deg, #ef4444, #dc2626);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background 0.2s;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .fade-out {
            animation: slideOutRight 0.3s ease-in forwards;
        }
        
        @keyframes slideInRight {
            to {
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', enhancedStyles);
