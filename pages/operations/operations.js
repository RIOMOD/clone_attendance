// Modern Operations Manager - Clean & Optimized Version
class OperationsManager {
    constructor() {
        this.currentUser = {
            name: 'Operations Manager',
            role: 'Quản lý vận hành',
            email: 'ops@ctsv.edu.vn'
        };

        this.stats = {
            ctsvMembers: 45,
            ctvMembers: 128,
            pendingTasks: 12,
            systemAlerts: 3,
            efficiency: 94.2
        };

        this.tasks = [
            {
                id: 1,
                title: 'Cập nhật hệ thống chấm công',
                description: 'Nâng cấp tính năng báo cáo và thống kê',
                assignee: 'Nguyễn Văn A',
                deadline: '2 ngày',
                priority: 'high',
                completed: false
            },
            {
                id: 2,
                title: 'Đào tạo CTV mới',
                description: 'Tổ chức khóa đào tạo cho 15 CTV mới',
                assignee: 'Trần Thị B',
                deadline: '5 ngày',
                priority: 'medium',
                completed: false
            },
            {
                id: 3,
                title: 'Kiểm tra thiết bị',
                description: 'Bảo trì máy chấm công tại các điểm',
                assignee: 'Lê Văn C',
                deadline: '1 tuần',
                priority: 'low',
                completed: false
            }
        ];

        this.departments = [
            {
                name: 'CTSV',
                fullName: 'Công tác sinh viên',
                members: 45,
                attendanceRate: 98,
                type: 'ctsv'
            },
            {
                name: 'CTV',
                fullName: 'Cộng tác viên',
                members: 128,
                attendanceRate: 85,
                type: 'ctv'
            },
            {
                name: 'Hỗ trợ kỹ thuật',
                fullName: 'Technical Support',
                members: 12,
                attendanceRate: 96,
                type: 'support'
            }
        ];

        this.chart = null;
    }

    init() {
        console.log('🚀 Initializing Operations Manager...');
        this.setupEventListeners();
        this.initializeChart();
        this.loadStats();
        this.renderDashboard();
        console.log('✅ Operations Manager initialized successfully!');
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileSidebar());
        }

        // Search functionality
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // User menu dropdown
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.addEventListener('click', () => this.toggleUserDropdown());
        }

        // Notification button
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }

        // Export buttons
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.exportData(type);
            });
        });

        // Create task button
        const createTaskBtn = document.getElementById('createTaskBtn');
        if (createTaskBtn) {
            createTaskBtn.addEventListener('click', () => this.openAddTaskModal());
        }

        // Task tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTaskTab(tab);
            });
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e));
        });

        // Date range selector
        const dateRange = document.getElementById('dateRange');
        if (dateRange) {
            dateRange.addEventListener('change', (e) => this.changeTimeRange(e.target.value));
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshOperations');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        // Modal close functionality
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.currentTarget.closest('.modal');
                if (modal) modal.style.display = 'none';
            });
        });

        // Task form submission
        const taskForm = document.getElementById('addTaskForm');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        }

        // Chart period selector
        const chartPeriod = document.getElementById('chartPeriod');
        if (chartPeriod) {
            chartPeriod.addEventListener('change', (e) => this.updateChartData(e.target.value));
        }
    }

    // Dashboard Rendering
    renderDashboard() {
        this.updateStatsCards();
        this.renderDepartmentList();
        this.renderTaskList();
        this.renderActivityTimeline();
    }

    updateStatsCards() {
        const cards = {
            'ctsvMembers': { value: this.stats.ctsvMembers, trend: '+2.5%' },
            'ctvMembers': { value: this.stats.ctvMembers, trend: '+8.2%' },
            'pendingTasks': { value: this.stats.pendingTasks, trend: 'Ổn định' },
            'systemAlerts': { value: this.stats.systemAlerts, trend: 'Cần chú ý' }
        };

        Object.entries(cards).forEach(([key, data]) => {
            const card = document.querySelector(`[data-stat="${key}"]`);
            if (card) {
                const valueEl = card.querySelector('h3');
                const trendEl = card.querySelector('.stat-trend span');

                if (valueEl) valueEl.textContent = data.value;
                if (trendEl) trendEl.textContent = data.trend;
            }
        });
    }

    renderDepartmentList() {
        const container = document.querySelector('.department-list');
        if (!container) return;

        // Department list is static in HTML, just update stats if needed
        this.departments.forEach((dept, index) => {
            const deptElement = container.children[index];
            if (deptElement) {
                const rateElement = deptElement.querySelector('.attendance-rate');
                if (rateElement) {
                    rateElement.textContent = `${dept.attendanceRate}%`;
                }
            }
        });
    }

    renderTaskList() {
        const container = document.getElementById('pendingTasks');
        if (!container) return;

        // Task list is static in HTML - could be made dynamic
        const taskElements = container.querySelectorAll('.task-item');
        taskElements.forEach((taskEl, index) => {
            if (this.tasks[index]) {
                const checkbox = taskEl.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = this.tasks[index].completed;
                    checkbox.addEventListener('change', () => {
                        this.toggleTask(this.tasks[index].id);
                    });
                }
            }
        });
    }

    renderActivityTimeline() {
        const timeline = document.querySelector('.activity-timeline');
        if (timeline) {
            // Timeline is static in HTML - already rendered
            // Activities data available in HTML structure
        }
    }

    // Chart Initialization
    initializeChart() {
        const canvas = document.getElementById('performanceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                datasets: [
                    {
                        label: 'CTSV',
                        data: [95, 97, 94, 98, 96, 99, 92],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'CTV',
                        data: [82, 85, 87, 84, 89, 86, 88],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Hỗ trợ',
                        data: [94, 96, 95, 97, 93, 98, 96],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
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
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#475569',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function (context) {
                                return context.dataset.label + ': ' + context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: false,
                        min: 70,
                        max: 100,
                        grid: {
                            color: '#f1f5f9',
                            borderDash: [5, 5]
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            },
                            callback: function (value) {
                                return value + '%';
                            }
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

    // Event Handlers
    toggleMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    }

    handleSearch(query) {
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }

        console.log('Searching for:', query);
        // Implement search functionality
        const results = this.tasks.filter(task =>
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.assignee.toLowerCase().includes(query.toLowerCase())
        );

        this.showSearchResults(results);
    }

    showSearchResults(results = []) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.style.display = 'none';
            return;
        }

        const html = results.map(result => `
            <div class="search-result-item" onclick="operationsManager.selectSearchResult('${result.id}')">
                <i class="fas fa-tasks"></i>
                <div>
                    <div class="result-title">${result.title}</div>
                    <div class="result-meta">${result.assignee} - ${result.deadline}</div>
                </div>
            </div>
        `).join('');

        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }

    hideSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    selectSearchResult(taskId) {
        console.log('Selected task:', taskId);
        this.hideSearchResults();
        // Implement task selection logic
    }

    toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    showNotifications() {
        console.log('📢 Showing notifications...');
        alert('📢 Bạn có 3 thông báo mới!\n\n1. Nhiệm vụ sắp hết hạn\n2. CTV mới tham gia\n3. Báo cáo tuần cần duyệt');
    }

    exportData(type) {
        console.log(`📊 Exporting data as ${type}...`);

        if (type === 'pdf') {
            this.exportToPDF();
        } else if (type === 'excel') {
            this.exportToExcel();
        }
    }

    exportToPDF() {
        console.log('📄 Exporting to PDF...');
        alert('📄 Tính năng xuất PDF đang được phát triển!\n\nSẽ bao gồm:\n- Thống kê tổng quan\n- Danh sách nhiệm vụ\n- Biểu đồ hiệu suất\n- Hoạt động gần đây');
    }

    exportToExcel() {
        console.log('📊 Exporting to Excel...');
        alert('📊 Tính năng xuất Excel đang được phát triển!\n\nSẽ bao gồm:\n- Dữ liệu phòng ban\n- Chi tiết nhiệm vụ\n- Thống kê hiệu suất\n- Lịch sử hoạt động');
    }

    openAddTaskModal() {
        const modal = document.getElementById('addTaskModal');
        if (modal) {
            modal.style.display = 'block';

            // Focus on first input
            const firstInput = modal.querySelector('input[type="text"]');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    switchTaskTab(tab) {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        const activeTab = document.querySelector(`[data-tab="${tab}"]`);
        if (activeTab) activeTab.classList.add('active');

        // Filter tasks based on tab
        this.filterTasks(tab);
    }

    filterTasks(filter) {
        console.log(`🔍 Filtering tasks by: ${filter}`);

        const container = document.getElementById('pendingTasks');
        if (!container) return;

        const taskItems = container.querySelectorAll('.task-item');

        taskItems.forEach(item => {
            let isCompleted, isOverdue;

            switch (filter) {
                case 'completed':
                    isCompleted = item.querySelector('input[type="checkbox"]').checked;
                    item.style.display = isCompleted ? 'flex' : 'none';
                    break;
                case 'overdue':
                    // Show high priority tasks as "overdue" for demo
                    isOverdue = item.classList.contains('high-priority');
                    item.style.display = isOverdue ? 'flex' : 'none';
                    break;
                default: // pending
                    item.style.display = 'flex';
                    break;
            }
        });
    }

    handleQuickAction(e) {
        const btn = e.currentTarget;
        const text = btn.querySelector('span').textContent;
        console.log(`⚡ Quick action: ${text}`);

        // Handle different quick actions
        switch (text) {
            case 'Thêm nhân viên':
                this.showAddEmployeeModal();
                break;
            case 'Tạo nhiệm vụ':
                this.openAddTaskModal();
                break;
            case 'Xem báo cáo':
                this.showReports();
                break;
            case 'Cài đặt hệ thống':
                this.showSystemSettings();
                break;
        }
    }

    changeTimeRange(range) {
        console.log(`📅 Changing time range to: ${range}`);
        this.updateChartData(range);
        this.updateStatsForRange(range);
    }

    updateStatsForRange(range) {
        // Simulate different stats for different time ranges
        const statsVariations = {
            today: { ctsvMembers: 42, ctvMembers: 120, pendingTasks: 8, systemAlerts: 1 },
            week: { ctsvMembers: 45, ctvMembers: 128, pendingTasks: 12, systemAlerts: 3 },
            month: { ctsvMembers: 48, ctvMembers: 135, pendingTasks: 15, systemAlerts: 2 },
            quarter: { ctsvMembers: 52, ctvMembers: 142, pendingTasks: 18, systemAlerts: 4 },
            year: { ctsvMembers: 58, ctvMembers: 156, pendingTasks: 22, systemAlerts: 6 }
        };

        const newStats = statsVariations[range] || statsVariations.week;
        this.stats = { ...this.stats, ...newStats };
        this.updateStatsCards();
    }

    refreshData() {
        console.log('🔄 Refreshing data...');

        // Show loading state
        const refreshBtn = document.getElementById('refreshOperations');
        const originalHtml = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';
        refreshBtn.disabled = true;

        // Simulate data refresh
        setTimeout(() => {
            this.loadStats();
            this.renderDashboard();

            // Update chart with fresh data
            if (this.chart) {
                this.chart.update();
            }

            // Reset button
            refreshBtn.innerHTML = originalHtml;
            refreshBtn.disabled = false;

            // Show success feedback
            this.showToast('✅ Dữ liệu đã được cập nhật!', 'success');

            console.log('✅ Data refreshed successfully!');
        }, 1500);
    }

    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    handleTaskSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const taskData = {
            title: formData.get('taskTitle'),
            description: formData.get('taskDescription'),
            assignee: formData.get('taskAssignee'),
            priority: formData.get('taskPriority'),
            deadline: formData.get('taskDeadline'),
            department: formData.get('taskDepartment')
        };

        console.log('📝 Creating new task:', taskData);

        // Validate required fields
        if (!taskData.title || !taskData.assignee) {
            alert('❌ Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        // Add task to list
        this.addTask(taskData);

        // Close modal
        document.getElementById('addTaskModal').style.display = 'none';

        // Reset form
        e.target.reset();

        // Show success message
        this.showToast('✅ Nhiệm vụ đã được tạo thành công!', 'success');
    }

    // Data Management
    loadStats() {
        // Simulate loading stats from API
        console.log('📊 Loading stats...');
        this.stats = {
            ctsvMembers: 45 + Math.floor(Math.random() * 5),
            ctvMembers: 128 + Math.floor(Math.random() * 10),
            pendingTasks: 12 + Math.floor(Math.random() * 6),
            systemAlerts: Math.floor(Math.random() * 5),
            efficiency: 90 + Math.random() * 10
        };
    }

    addTask(taskData) {
        const newTask = {
            id: Date.now(),
            ...taskData,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(newTask);
        this.stats.pendingTasks++;

        this.renderTaskList();
        this.updateStatsCards();

        console.log('✅ Task added successfully:', newTask);
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;

            // Update pending tasks count
            if (task.completed) {
                this.stats.pendingTasks--;
            } else {
                this.stats.pendingTasks++;
            }

            this.updateStatsCards();
            console.log(`✅ Task ${taskId} marked as ${task.completed ? 'completed' : 'pending'}`);
        }
    }

    updateChartData(range) {
        if (!this.chart) return;

        // Update chart based on selected range
        const data = this.getChartData(range);
        this.chart.data = data;
        this.chart.update('active');
    }

    getChartData(range) {
        // Return different data based on time range
        const dataSet = {
            week: {
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                ctsv: [95, 97, 94, 98, 96, 99, 92],
                ctv: [82, 85, 87, 84, 89, 86, 88],
                support: [94, 96, 95, 97, 93, 98, 96]
            },
            month: {
                labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
                ctsv: [96, 94, 97, 95],
                ctv: [85, 87, 84, 86],
                support: [95, 96, 94, 97]
            },
            quarter: {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3'],
                ctsv: [95, 96, 94],
                ctv: [85, 86, 87],
                support: [95, 96, 95]
            }
        };

        const selectedData = dataSet[range] || dataSet.week;

        return {
            labels: selectedData.labels,
            datasets: [
                {
                    label: 'CTSV',
                    data: selectedData.ctsv,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'CTV',
                    data: selectedData.ctv,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Hỗ trợ',
                    data: selectedData.support,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    }

    // Modal Functions
    showAddEmployeeModal() {
        console.log('👥 Opening Add Employee modal...');
        alert('👥 Chức năng thêm nhân viên đang được phát triển!\n\nSẽ bao gồm:\n- Thông tin cá nhân\n- Phòng ban\n- Chức vụ\n- Quyền hạn');
    }

    showReports() {
        console.log('📊 Opening Reports...');
        alert('📊 Chức năng báo cáo đang được phát triển!\n\nCác báo cáo có sẵn:\n- Báo cáo hiệu suất\n- Báo cáo nhiệm vụ\n- Báo cáo chấm công\n- Báo cáo tổng hợp');
    }

    showSystemSettings() {
        console.log('⚙️ Opening System Settings...');
        alert('⚙️ Chức năng cài đặt hệ thống đang được phát triển!\n\nCài đặt có sẵn:\n- Cấu hình phòng ban\n- Quyền hạn người dùng\n- Thông báo hệ thống\n- Tích hợp API');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.operationsManager = new OperationsManager();
});
