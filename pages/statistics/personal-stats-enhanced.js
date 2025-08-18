// Personal Stats Manager
class PersonalStatsManager {
    constructor() {
        this.currentView = 'chart';
        this.currentTimeRange = 'month';
        this.init();
    }

    init() {
        this.initCharts();
        this.initCalendar();
        this.setupEventListeners();
        this.animateProgressBars();
        this.generateActivities();
    }

    initCharts() {
        this.initAttendanceChart();
    }

    initAttendanceChart() {
        const ctx = document.getElementById('attendanceChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.getDateLabels(),
                datasets: [
                    {
                        label: 'Giờ làm việc',
                        data: [8.5, 8.2, 8.0, 8.3, 8.1, 8.4, 8.2, 8.6, 8.0, 8.5, 8.3, 8.2, 8.4, 8.2],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#6366f1',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Mục tiêu',
                        data: Array(14).fill(8),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0,
                        pointHoverRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#6b7280',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        callbacks: {
                            title: function(context) {
                                return `Ngày ${context[0].label}`;
                            },
                            label: function(context) {
                                if (context.datasetIndex === 0) {
                                    return `Giờ làm việc: ${context.parsed.y} giờ`;
                                } else {
                                    return `Mục tiêu: ${context.parsed.y} giờ`;
                                }
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
                            color: '#6b7280',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(229, 231, 235, 0.5)',
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return value + 'h';
                            }
                        },
                        suggestedMin: 6,
                        suggestedMax: 10
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    getDateLabels() {
        const labels = [];
        const today = new Date();
        
        for (let i = 13; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(`${date.getDate()}/${date.getMonth() + 1}`);
        }
        
        return labels;
    }

    initCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        if (!calendarGrid) return;

        // Clear existing content
        calendarGrid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-header';
            header.textContent = day;
            header.style.cssText = `
                font-weight: 600;
                font-size: 0.8rem;
                color: #6b7280;
                text-align: center;
                padding: 0.5rem;
            `;
            calendarGrid.appendChild(header);
        });

        // Generate calendar days for current month
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // Add empty cells for previous month
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of current month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // Random attendance status for demo
            const random = Math.random();
            if (random > 0.1) {
                dayElement.classList.add('present');
                dayElement.title = `${day}/${today.getMonth() + 1} - Có mặt`;
            } else {
                dayElement.classList.add('absent');
                dayElement.title = `${day}/${today.getMonth() + 1} - Vắng mặt`;
            }

            // Mark today
            if (day === today.getDate()) {
                dayElement.classList.add('today');
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    setupEventListeners() {
        // View toggle buttons
        const toggleButtons = document.querySelectorAll('.btn-toggle');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleViewToggle(e.target.closest('.btn-toggle'));
            });
        });

        // Time range filter
        const timeRangeSelect = document.getElementById('timeRange');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', (e) => {
                this.handleTimeRangeChange(e.target.value);
            });
        }

        // Goal progress animations on scroll
        const goalItems = document.querySelectorAll('.goal-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateGoalProgress(entry.target);
                }
            });
        }, { threshold: 0.5 });

        goalItems.forEach(item => observer.observe(item));
    }

    handleViewToggle(button) {
        const viewType = button.dataset.view;
        
        // Update button states
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Toggle views
        const chartView = document.getElementById('attendanceChartView');
        const calendarView = document.getElementById('attendanceCalendarView');

        if (viewType === 'chart') {
            chartView.style.display = 'block';
            calendarView.style.display = 'none';
            this.currentView = 'chart';
        } else {
            chartView.style.display = 'none';
            calendarView.style.display = 'block';
            this.currentView = 'calendar';
            this.initCalendar(); // Refresh calendar
        }
    }

    handleTimeRangeChange(timeRange) {
        this.currentTimeRange = timeRange;
        
        // Show loading state
        this.showLoadingState();

        // Simulate API call
        setTimeout(() => {
            this.hideLoadingState();
            this.refreshData(timeRange);
        }, 1000);
    }

    refreshData(timeRange) {
        // Update overview cards with new data
        this.updateOverviewCards(timeRange);
        
        // Refresh chart
        this.initAttendanceChart();
        
        // Refresh calendar if in calendar view
        if (this.currentView === 'calendar') {
            this.initCalendar();
        }

        // Show success message
        this.showToast(`Đã cập nhật dữ liệu cho ${this.getTimeRangeLabel(timeRange)}`, 'success');
    }

    getTimeRangeLabel(timeRange) {
        const labels = {
            'week': '7 ngày qua',
            'month': '30 ngày qua',
            'quarter': '3 tháng qua',
            'year': '1 năm qua'
        };
        return labels[timeRange] || '30 ngày qua';
    }

    updateOverviewCards(timeRange) {
        // Simulate different data based on time range
        const data = {
            week: {
                attendanceRate: '98.5%',
                averageHours: '8.4 giờ',
                eventsParticipated: '3',
                performanceScore: '9.3/10'
            },
            month: {
                attendanceRate: '96.5%',
                averageHours: '8.2 giờ',
                eventsParticipated: '15',
                performanceScore: '9.2/10'
            },
            quarter: {
                attendanceRate: '94.8%',
                averageHours: '8.1 giờ',
                eventsParticipated: '42',
                performanceScore: '9.0/10'
            },
            year: {
                attendanceRate: '93.2%',
                averageHours: '8.0 giờ',
                eventsParticipated: '178',
                performanceScore: '8.9/10'
            }
        };

        const currentData = data[timeRange] || data.month;
        
        // Update cards with animation
        this.animateCardUpdate('.attendance-rate h3', currentData.attendanceRate);
        this.animateCardUpdate('.average-hours h3', currentData.averageHours);
        this.animateCardUpdate('.events-participated h3', currentData.eventsParticipated);
        this.animateCardUpdate('.performance-score h3', currentData.performanceScore);
    }

    animateCardUpdate(selector, newValue) {
        const element = document.querySelector(selector);
        if (!element) return;

        // Fade out
        element.style.opacity = '0.5';
        element.style.transform = 'scale(0.95)';

        setTimeout(() => {
            element.textContent = newValue;
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 300);
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill, .bar-fill');
        
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        });

        // Animate circular progress
        const progressCircles = document.querySelectorAll('.progress-circle');
        progressCircles.forEach(circle => {
            const percent = circle.dataset.percent;
            if (percent) {
                this.animateCircularProgress(circle, percent);
            }
        });
    }

    animateCircularProgress(element, percent) {
        const circle = element.querySelector('circle:last-child');
        if (!circle) return;

        const radius = 25;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;

        setTimeout(() => {
            circle.style.strokeDashoffset = offset;
        }, 500);
    }

    animateGoalProgress(goalItem) {
        const progressBar = goalItem.querySelector('.progress-fill');
        if (!progressBar) return;

        const width = progressBar.style.width;
        progressBar.style.width = '0%';
        
        setTimeout(() => {
            progressBar.style.width = width;
        }, 200);
    }

    generateActivities() {
        // This would typically come from an API
        const activities = [
            {
                time: '08:00',
                date: 'Hôm nay',
                type: 'checkin',
                title: 'Check-in',
                description: 'Bắt đầu ngày làm việc'
            },
            {
                time: '09:30',
                date: 'Hôm nay',
                type: 'meeting',
                title: 'Họp team',
                description: 'Họp standup với team phát triển'
            },
            {
                time: '14:00',
                date: 'Hôm nay',
                type: 'task',
                title: 'Hoàn thành task',
                description: 'Cập nhật tính năng báo cáo'
            },
            {
                time: '16:30',
                date: 'Hôm nay',
                type: 'event',
                title: 'Tham gia sự kiện',
                description: 'Workshop "Quản lý thời gian hiệu quả"'
            }
        ];

        // Update activities timeline with real-time data
        this.updateActivitiesTimeline(activities);
    }

    updateActivitiesTimeline(activities) {
        const timeline = document.querySelector('.activities-timeline');
        if (!timeline) return;

        // Clear existing activities except static ones
        const existingActivities = timeline.querySelectorAll('.activity-item');
        existingActivities.forEach((item, index) => {
            if (index >= 4) { // Keep first 4 static activities
                item.remove();
            }
        });

        // Add new activities if needed (this would be real-time updates)
        // For demo purposes, we'll just animate existing ones
        const activityItems = timeline.querySelectorAll('.activity-item');
        activityItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    showLoadingState() {
        const cards = document.querySelectorAll('.stats-card, .overview-card');
        cards.forEach(card => {
            card.classList.add('loading');
        });
    }

    hideLoadingState() {
        const cards = document.querySelectorAll('.stats-card, .overview-card');
        cards.forEach(card => {
            card.classList.remove('loading');
        });
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            top: '90px',
            right: '20px',
            background: type === 'success' ? '#10b981' : '#3b82f6',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        });
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Export functionality
    exportReport() {
        const reportData = this.generateReportData();
        this.downloadReport(reportData);
    }

    generateReportData() {
        return {
            period: this.getTimeRangeLabel(this.currentTimeRange),
            attendanceRate: '96.5%',
            averageHours: '8.2 giờ',
            eventsParticipated: 15,
            performanceScore: '9.2/10',
            goalsCompleted: 1,
            goalsInProgress: 1,
            goalsPending: 1
        };
    }

    downloadReport(data) {
        // Create CSV content
        const csvContent = [
            ['Chỉ số', 'Giá trị'],
            ['Thời gian', data.period],
            ['Tỷ lệ chấm công', data.attendanceRate],
            ['Giờ làm việc trung bình', data.averageHours],
            ['Sự kiện tham gia', data.eventsParticipated],
            ['Điểm hiệu suất', data.performanceScore],
            ['Mục tiêu hoàn thành', data.goalsCompleted],
            ['Mục tiêu đang thực hiện', data.goalsInProgress],
            ['Mục tiêu chưa bắt đầu', data.goalsPending]
        ].map(row => row.join(',')).join('\n');

        // Create and download file
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `thong-ke-ca-nhan-${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Báo cáo đã được tải xuống', 'success');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.personalStatsManager = new PersonalStatsManager();
    
    // Set up export button if it exists
    const exportBtn = document.querySelector('.btn-primary');
    if (exportBtn && exportBtn.textContent.includes('Xuất báo cáo')) {
        exportBtn.addEventListener('click', () => {
            window.personalStatsManager.exportReport();
        });
    }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalStatsManager;
}
