// Operations Enhanced JavaScript - Tính năng và chức năng cho dashboard-charts

class OperationsManager {
    constructor() {
        this.currentTab = 'pending';
        this.performanceChart = null;
        this.tasks = {
            pending: [
                {
                    id: 1,
                    title: "Cập nhật hệ thống chấm công",
                    description: "Nâng cấp tính năng báo cáo và thống kê",
                    assignee: "Nguyễn Văn A",
                    deadline: "2 ngày",
                    priority: "high",
                    department: "ctsv"
                },
                {
                    id: 2,
                    title: "Đào tạo CTV mới",
                    description: "Tổ chức khóa đào tạo cho 15 CTV mới",
                    assignee: "Trần Thị B",
                    deadline: "5 ngày",
                    priority: "medium",
                    department: "ctv"
                },
                {
                    id: 3,
                    title: "Kiểm tra thiết bị",
                    description: "Bảo trì máy chấm công tại các điểm",
                    assignee: "Lê Văn C",
                    deadline: "1 tuần",
                    priority: "low",
                    department: "support"
                }
            ],
            completed: [
                {
                    id: 4,
                    title: "Backup dữ liệu hệ thống",
                    description: "Sao lưu toàn bộ dữ liệu tuần này",
                    assignee: "Admin",
                    completedDate: "Hôm qua",
                    priority: "high",
                    department: "ctsv"
                }
            ],
            overdue: [
                {
                    id: 5,
                    title: "Cập nhật tài liệu hướng dẫn",
                    description: "Chỉnh sửa và bổ sung tài liệu cho người dùng",
                    assignee: "Phạm Thị D",
                    overdueBy: "3 ngày",
                    priority: "medium",
                    department: "ctv"
                }
            ]
        };
        this.departments = [
            { id: 'ctsv', name: 'CTSV', fullName: 'Công tác sinh viên', members: 45, rate: 98, status: 'active' },
            { id: 'ctv', name: 'CTV', fullName: 'Cộng tác viên', members: 128, rate: 85, status: 'active' },
            { id: 'support', name: 'Hỗ trợ kỹ thuật', fullName: 'Technical Support', members: 12, rate: 96, status: 'active' }
        ];
    }

    init() {
        console.log('🚀 Operations Manager initialized');
        this.bindEvents();
        this.initCharts();
        this.updateTaskDisplay();
        this.startRealTimeUpdates();
        this.addAnimations();
    }

    bindEvents() {
        // Task tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTaskTab(tab);
            });
        });

        // Quick action buttons
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickAction(e.target.closest('.quick-action-btn'));
            });
        });

        // Department items
        const deptItems = document.querySelectorAll('.department-item');
        deptItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectDepartment(e.target.closest('.department-item'));
            });
        });

        // Chart period selector
        const chartPeriod = document.getElementById('chartPeriod');
        if (chartPeriod) {
            chartPeriod.addEventListener('change', (e) => {
                this.updateChart(e.target.value);
            });
        }

        // Task checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.matches('.task-checkbox input[type="checkbox"]')) {
                this.handleTaskCompletion(e.target);
            }
        });

        // Create task modal
        const createTaskBtn = document.getElementById('createTaskBtn');
        if (createTaskBtn) {
            createTaskBtn.addEventListener('click', () => {
                this.openCreateTaskModal();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshOperations');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshData();
            });
        }

        // Export buttons
        const exportBtns = document.querySelectorAll('.export-btn');
        exportBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.exportData(type);
            });
        });

        // Modal handlers
        this.bindModalEvents();
    }

    bindModalEvents() {
        // Modal close buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal-close')) {
                this.closeModal(e.target.closest('.modal'));
            }
            if (e.target.matches('.modal') && !e.target.matches('.modal-content')) {
                this.closeModal(e.target);
            }
        });

        // Form submissions
        const addTaskForm = document.getElementById('addTaskForm');
        if (addTaskForm) {
            addTaskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createTask(new FormData(addTaskForm));
            });
        }
    }

    switchTaskTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update current tab
        this.currentTab = tabName;

        // Update task display
        this.updateTaskDisplay();

        // Add animation
        const taskList = document.querySelector('.task-list');
        taskList.classList.add('fade-in');
        setTimeout(() => taskList.classList.remove('fade-in'), 300);
    }

    updateTaskDisplay() {
        const taskList = document.querySelector('.task-list');
        const tasks = this.tasks[this.currentTab] || [];

        taskList.innerHTML = tasks.map(task => this.generateTaskHTML(task)).join('');
    }

    generateTaskHTML(task) {
        const priorityClass = `${task.priority}-priority`;
        const priorityLabel = {
            high: 'Cao',
            medium: 'Trung bình',
            low: 'Thấp'
        };

        let metaInfo = '';
        if (this.currentTab === 'pending') {
            metaInfo = `
                <span class="task-assignee">
                    <i class="fas fa-user"></i> ${task.assignee}
                </span>
                <span class="task-deadline">
                    <i class="fas fa-clock"></i> ${task.deadline}
                </span>
            `;
        } else if (this.currentTab === 'completed') {
            metaInfo = `
                <span class="task-assignee">
                    <i class="fas fa-user"></i> ${task.assignee}
                </span>
                <span class="task-deadline">
                    <i class="fas fa-check"></i> ${task.completedDate}
                </span>
            `;
        } else if (this.currentTab === 'overdue') {
            metaInfo = `
                <span class="task-assignee">
                    <i class="fas fa-user"></i> ${task.assignee}
                </span>
                <span class="task-deadline">
                    <i class="fas fa-exclamation-triangle"></i> Quá hạn ${task.overdueBy}
                </span>
            `;
        }

        return `
            <div class="task-item ${priorityClass}" data-task-id="${task.id}">
                ${this.currentTab === 'pending' ? `
                    <div class="task-checkbox">
                        <input type="checkbox" id="task${task.id}">
                        <label for="task${task.id}"></label>
                    </div>
                ` : ''}
                <div class="task-info">
                    <h4>${task.title}</h4>
                    <p>${task.description}</p>
                    <div class="task-meta">
                        ${metaInfo}
                    </div>
                </div>
                <div class="task-priority ${task.priority}">
                    <span>${priorityLabel[task.priority]}</span>
                </div>
            </div>
        `;
    }

    handleTaskCompletion(checkbox) {
        const taskItem = checkbox.closest('.task-item');
        const taskId = parseInt(taskItem.dataset.taskId);

        if (checkbox.checked) {
            // Add completion animation
            taskItem.style.opacity = '0.5';
            taskItem.style.transform = 'scale(0.95)';

            setTimeout(() => {
                // Move task from pending to completed
                const taskIndex = this.tasks.pending.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    const task = this.tasks.pending.splice(taskIndex, 1)[0];
                    task.completedDate = 'Vừa xong';
                    this.tasks.completed.unshift(task);

                    // Update display
                    this.updateTaskDisplay();
                    this.showNotification('Nhiệm vụ đã được hoàn thành!', 'success');
                    this.updateStats();
                }
            }, 300);
        }
    }

    selectDepartment(deptItem) {
        // Remove active from all departments
        document.querySelectorAll('.department-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active to selected department
        deptItem.classList.add('active');

        // Add pulse animation
        deptItem.classList.add('bounce-in');
        setTimeout(() => deptItem.classList.remove('bounce-in'), 500);

        // You could filter tasks or update charts based on selected department
        console.log('Department selected:', deptItem.querySelector('h4').textContent);
    }

    handleQuickAction(btn) {
        const icon = btn.querySelector('i').className;

        // Add click animation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);

        // Handle different actions
        if (icon.includes('fa-user-plus')) {
            this.showNotification('Đang mở form thêm nhân viên...', 'info');
        } else if (icon.includes('fa-tasks')) {
            this.openCreateTaskModal();
        } else if (icon.includes('fa-chart-bar')) {
            this.showNotification('Đang tạo báo cáo...', 'info');
        } else if (icon.includes('fa-cog')) {
            this.showNotification('Đang mở cài đặt hệ thống...', 'info');
        }
    }

    initCharts() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) {
            console.warn('⚠️ Performance chart canvas not found');
            return;
        }

        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js not loaded! Please check CDN connection.');
            return;
        }

        try {
            this.performanceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                    datasets: [
                        {
                            label: 'CTSV',
                            data: [95, 98, 92, 99, 96, 98, 94],
                            borderColor: 'rgba(102, 126, 234, 1)',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'CTV',
                            data: [88, 85, 90, 87, 89, 85, 88],
                            borderColor: 'rgba(240, 147, 251, 1)',
                            backgroundColor: 'rgba(240, 147, 251, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Hỗ trợ',
                            data: [96, 94, 98, 95, 97, 96, 99],
                            borderColor: 'rgba(79, 172, 254, 1)',
                            backgroundColor: 'rgba(79, 172, 254, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
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
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            borderWidth: 1,
                            cornerRadius: 8,
                            displayColors: true,
                            callbacks: {
                                label: function (context) {
                                    return `${context.dataset.label}: ${context.parsed.y}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 80,
                            max: 100,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            ticks: {
                                color: '#6b7280',
                                callback: function (value) {
                                    return value + '%';
                                }
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
                    animation: {
                        duration: 1000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
            console.log('✅ Performance chart initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing chart:', error);
        }
    } updateChart(period) {
        if (!this.performanceChart) return;

        // Simulate different data for different periods
        let data = {};
        if (period === 'week') {
            data = {
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                datasets: [
                    { data: [95, 98, 92, 99, 96, 98, 94] },
                    { data: [88, 85, 90, 87, 89, 85, 88] },
                    { data: [96, 94, 98, 95, 97, 96, 99] }
                ]
            };
        } else if (period === 'month') {
            data = {
                labels: ['T1', 'T2', 'T3', 'T4'],
                datasets: [
                    { data: [96, 97, 95, 98] },
                    { data: [87, 88, 86, 89] },
                    { data: [95, 97, 94, 98] }
                ]
            };
        } else if (period === 'quarter') {
            data = {
                labels: ['Q1', 'Q2', 'Q3'],
                datasets: [
                    { data: [95, 97, 96] },
                    { data: [86, 88, 87] },
                    { data: [94, 96, 95] }
                ]
            };
        }

        // Update chart data
        this.performanceChart.data.labels = data.labels;
        data.datasets.forEach((dataset, index) => {
            this.performanceChart.data.datasets[index].data = dataset.data;
        });

        this.performanceChart.update('active');
    }

    openCreateTaskModal() {
        const modal = document.getElementById('addTaskModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            setTimeout(() => {
                modal.querySelector('.modal-content').classList.add('bounce-in');
            }, 100);
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    createTask(formData) {
        const newTask = {
            id: Date.now(),
            title: formData.get('taskTitle'),
            description: formData.get('taskDescription'),
            assignee: formData.get('taskAssignee'),
            deadline: this.formatDeadline(formData.get('taskDeadline')),
            priority: formData.get('taskPriority'),
            department: formData.get('taskDepartment')
        };

        // Add to pending tasks
        this.tasks.pending.unshift(newTask);

        // Update display if currently viewing pending
        if (this.currentTab === 'pending') {
            this.updateTaskDisplay();
        }

        // Close modal
        this.closeModal(document.getElementById('addTaskModal'));

        // Show success notification
        this.showNotification('Nhiệm vụ mới đã được tạo thành công!', 'success');

        // Update stats
        this.updateStats();

        // Reset form
        document.getElementById('addTaskForm').reset();
    }

    formatDeadline(dateTimeString) {
        const deadline = new Date(dateTimeString);
        const now = new Date();
        const diffTime = deadline - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hôm nay';
        if (diffDays === 1) return 'Ngày mai';
        if (diffDays < 7) return `${diffDays} ngày`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} tuần`;
        return `${Math.ceil(diffDays / 30)} tháng`;
    }

    refreshData() {
        const refreshBtn = document.getElementById('refreshOperations');
        const icon = refreshBtn.querySelector('i');

        // Add spinning animation
        icon.classList.add('fa-spin');
        refreshBtn.disabled = true;

        // Simulate data refresh
        setTimeout(() => {
            // Update task display
            this.updateTaskDisplay();

            // Update chart with new data
            if (this.performanceChart) {
                this.updateChart(document.getElementById('chartPeriod').value);
            }

            // Update stats
            this.updateStats();

            // Remove spinning animation
            icon.classList.remove('fa-spin');
            refreshBtn.disabled = false;

            this.showNotification('Dữ liệu đã được cập nhật!', 'success');
        }, 1500);
    }

    exportData(type) {
        const btn = document.querySelector(`[data-type="${type}"]`);
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xuất...';
        btn.disabled = true;

        setTimeout(() => {
            if (type === 'pdf') {
                this.showNotification('Đã xuất báo cáo PDF thành công!', 'success');
            } else if (type === 'excel') {
                this.showNotification('Đã xuất báo cáo Excel thành công!', 'success');
            }

            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
    }

    updateStats() {
        // Update stat cards
        const ctsvStat = document.querySelector('[data-stat="ctsvMembers"] h3');
        const ctvStat = document.querySelector('[data-stat="ctvMembers"] h3');
        const pendingStat = document.querySelector('[data-stat="pendingTasks"] h3');

        if (ctsvStat) ctsvStat.textContent = this.departments.find(d => d.id === 'ctsv').members;
        if (ctvStat) ctvStat.textContent = this.departments.find(d => d.id === 'ctv').members;
        if (pendingStat) pendingStat.textContent = this.tasks.pending.length;
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.addRandomActivity();
        }, 30000);

        // Update time stamps every minute
        setInterval(() => {
            this.updateTimeStamps();
        }, 60000);
    }

    addRandomActivity() {
        const activities = [
            {
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                icon: 'success',
                iconClass: 'fas fa-check',
                title: 'Nhiệm vụ hoàn thành',
                description: 'Một nhiệm vụ vừa được hoàn thành bởi thành viên'
            },
            {
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                icon: 'info',
                iconClass: 'fas fa-user-plus',
                title: 'Thành viên mới',
                description: 'Có thành viên mới tham gia vào hệ thống'
            }
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        this.addActivityToTimeline(randomActivity);
    }

    addActivityToTimeline(activity) {
        const timeline = document.querySelector('.activity-timeline');
        const activityHTML = `
            <div class="activity-item fade-in">
                <div class="activity-time">${activity.time}</div>
                <div class="activity-icon ${activity.icon}">
                    <i class="${activity.iconClass}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
            </div>
        `;

        timeline.insertAdjacentHTML('afterbegin', activityHTML);

        // Remove oldest activity if more than 5
        const activities = timeline.querySelectorAll('.activity-item');
        if (activities.length > 5) {
            activities[activities.length - 1].remove();
        }
    }

    updateTimeStamps() {
        // This would update relative time stamps like "5 minutes ago"
        console.log('Updating time stamps...');
    }

    addAnimations() {
        // Add intersection observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe all section cards
        document.querySelectorAll('.section-card').forEach(card => {
            observer.observe(card);
        });
    }

    showNotification(message, type = 'info') {
        let iconClass;
        if (type === 'success') {
            iconClass = 'check-circle';
        } else if (type === 'warning') {
            iconClass = 'exclamation-triangle';
        } else {
            iconClass = 'info-circle';
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${iconClass}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        const container = document.getElementById('notifications');
        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize Operations Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔧 DOM loaded, initializing Operations Manager...');

    try {
        window.operationsManager = new OperationsManager();
        window.operationsManager.init();
        console.log('✅ Operations Manager initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing Operations Manager:', error);

        // Show user-friendly error
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #ef4444; color: white; padding: 16px; border-radius: 8px; z-index: 9999;">
                <strong>Lỗi khởi tạo:</strong> ${error.message}
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
});

// Global helper functions
window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal && window.operationsManager) {
        window.operationsManager.closeModal(modal);
    }
};

window.closeNotificationPanel = function () {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.classList.remove('active');
    }
};

window.closeMessagePanel = function () {
    const panel = document.getElementById('messagePanel');
    if (panel) {
        panel.classList.remove('active');
    }
};

window.closeSettingsPanel = function () {
    const panel = document.getElementById('settingsPanel');
    if (panel) {
        panel.classList.remove('active');
    }
};

window.closeComposeModal = function () {
    const modal = document.getElementById('composeMessageModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
};
