// Operations Page JavaScript
class OperationsManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.tasks = this.loadTasks();
        this.departments = this.loadDepartments();
        this.activities = this.loadActivities();
        this.performanceChart = null;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadDashboardData();
        this.renderQuickStats();
        this.renderDepartments();
        this.renderTasks();
        this.renderActivities();
        this.initializeChart();
        this.startRealtimeUpdates();
    }

    // Event Listeners
    initializeEventListeners() {
        // Task filter tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterTasks(filter);
            });
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Department selection
        document.querySelectorAll('.department-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectDepartment(item);
            });
        });

        // Task checkbox changes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.closest('.task-item')) {
                this.toggleTaskCompletion(e.target);
            }
        });

        // Modal events
        this.initializeModalEvents();

        // Chart period change
        const chartPeriodSelect = document.getElementById('chartPeriod');
        if (chartPeriodSelect) {
            chartPeriodSelect.addEventListener('change', (e) => {
                this.updateChart(e.target.value);
            });
        }

        // Department actions
        document.querySelectorAll('.btn-icon').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const deptId = btn.closest('.department-item').dataset.deptId;
                this.handleDepartmentAction(action, deptId);
            });
        });
    }

    initializeModalEvents() {
        // Close modal events
        document.querySelectorAll('.modal-close, .modal').forEach(element => {
            element.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
                    this.closeModal(e.target.closest('.modal').id);
                }
            });
        });

        // Create task form submission
        const createTaskForm = document.getElementById('createTaskForm');
        if (createTaskForm) {
            createTaskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createTask(new FormData(createTaskForm));
            });
        }

        // Task management actions
        document.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'edit-task') {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                this.editTask(taskId);
            } else if (e.target.dataset.action === 'delete-task') {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                this.deleteTask(taskId);
            }
        });
    }

    // Data Loading
    loadTasks() {
        const defaultTasks = [
            {
                id: 'task-1',
                title: 'Kiểm tra điểm danh tuần này',
                description: 'Xem xét và phê duyệt báo cáo điểm danh của tất cả phòng ban',
                priority: 'high',
                status: 'pending',
                assignee: 'Admin CTSV',
                department: 'ctsv',
                deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                createdAt: new Date()
            },
            {
                id: 'task-2',
                title: 'Cập nhật danh sách CTV mới',
                description: 'Thêm thông tin và phân quyền cho các CTV vừa được tuyển dụng',
                priority: 'medium',
                status: 'in-progress',
                assignee: 'Trưởng phòng CTV',
                department: 'ctv',
                deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            },
            {
                id: 'task-3',
                title: 'Bảo trì hệ thống',
                description: 'Thực hiện bảo trì định kỳ server và cơ sở dữ liệu',
                priority: 'high',
                status: 'pending',
                assignee: 'IT Support',
                department: 'support',
                deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
            },
            {
                id: 'task-4',
                title: 'Tổng kết tháng',
                description: 'Lập báo cáo tổng kết hoạt động tháng và đánh giá hiệu suất',
                priority: 'medium',
                status: 'completed',
                assignee: 'Admin CTSV',
                department: 'ctsv',
                deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        ];
        
        return JSON.parse(localStorage.getItem('operations_tasks')) || defaultTasks;
    }

    loadDepartments() {
        const defaultDepartments = [
            {
                id: 'ctsv',
                name: 'Công tác sinh viên',
                code: 'CTSV',
                description: 'Quản lý hoạt động và điểm danh sinh viên',
                members: 45,
                attendanceRate: 92,
                status: 'active',
                head: 'Nguyễn Văn A',
                contact: 'ctsv@university.edu.vn'
            },
            {
                id: 'ctv',
                name: 'Cộng tác viên',
                code: 'CTV',
                description: 'Hỗ trợ các hoạt động và sự kiện',
                members: 128,
                attendanceRate: 87,
                status: 'active',
                head: 'Trần Thị B',
                contact: 'ctv@university.edu.vn'
            },
            {
                id: 'support',
                name: 'Hỗ trợ kỹ thuật',
                code: 'IT',
                description: 'Quản trị hệ thống và hỗ trợ kỹ thuật',
                members: 12,
                attendanceRate: 95,
                status: 'active',
                head: 'Lê Văn C',
                contact: 'support@university.edu.vn'
            }
        ];
        
        return JSON.parse(localStorage.getItem('operations_departments')) || defaultDepartments;
    }

    loadActivities() {
        const defaultActivities = [
            {
                id: 'activity-1',
                title: 'Điểm danh hoàn tất',
                description: 'Phòng CTSV đã hoàn thành điểm danh buổi sáng',
                type: 'success',
                time: new Date(Date.now() - 10 * 60 * 1000),
                department: 'ctsv',
                user: 'Admin CTSV'
            },
            {
                id: 'activity-2',
                title: 'Nhiệm vụ mới được tạo',
                description: 'Đã tạo nhiệm vụ kiểm tra điểm danh tuần này',
                type: 'info',
                time: new Date(Date.now() - 25 * 60 * 1000),
                department: 'ctsv',
                user: 'Admin CTSV'
            },
            {
                id: 'activity-3',
                title: 'Cảnh báo hệ thống',
                description: 'Phát hiện lỗi nhỏ trong module báo cáo',
                type: 'warning',
                time: new Date(Date.now() - 45 * 60 * 1000),
                department: 'support',
                user: 'IT Support'
            },
            {
                id: 'activity-4',
                title: 'CTV mới tham gia',
                description: '5 CTV mới đã được thêm vào hệ thống',
                type: 'success',
                time: new Date(Date.now() - 2 * 60 * 60 * 1000),
                department: 'ctv',
                user: 'Trưởng phòng CTV'
            }
        ];
        
        return JSON.parse(localStorage.getItem('operations_activities')) || defaultActivities;
    }

    // Dashboard Data
    loadDashboardData() {
        // Simulate real-time data loading
        this.updateLastRefresh();
    }

    renderQuickStats() {
        const stats = this.calculateStats();
        
        // Update CTSV stats
        const ctsvCard = document.querySelector('.stat-card.ctsv');
        if (ctsvCard) {
            ctsvCard.querySelector('h3').textContent = stats.ctsv.members;
            ctsvCard.querySelector('p').textContent = `${stats.ctsv.present} có mặt`;
            ctsvCard.querySelector('small').textContent = `${stats.ctsv.attendanceRate}% tỷ lệ điểm danh`;
            this.updateTrend(ctsvCard.querySelector('.stat-trend'), stats.ctsv.trend);
        }

        // Update CTV stats
        const ctvCard = document.querySelector('.stat-card.ctv');
        if (ctvCard) {
            ctvCard.querySelector('h3').textContent = stats.ctv.members;
            ctvCard.querySelector('p').textContent = `${stats.ctv.present} có mặt`;
            ctvCard.querySelector('small').textContent = `${stats.ctv.attendanceRate}% tỷ lệ điểm danh`;
            this.updateTrend(ctvCard.querySelector('.stat-trend'), stats.ctv.trend);
        }

        // Update Tasks stats
        const tasksCard = document.querySelector('.stat-card.tasks');
        if (tasksCard) {
            tasksCard.querySelector('h3').textContent = stats.tasks.total;
            tasksCard.querySelector('p').textContent = `${stats.tasks.pending} đang thực hiện`;
            tasksCard.querySelector('small').textContent = `${stats.tasks.completed} đã hoàn thành`;
            this.updateTrend(tasksCard.querySelector('.stat-trend'), stats.tasks.trend);
        }

        // Update Efficiency stats
        const efficiencyCard = document.querySelector('.stat-card.efficiency');
        if (efficiencyCard) {
            efficiencyCard.querySelector('h3').textContent = `${stats.efficiency.rate}%`;
            efficiencyCard.querySelector('p').textContent = 'Hiệu suất chung';
            efficiencyCard.querySelector('small').textContent = stats.efficiency.status;
            this.updateTrend(efficiencyCard.querySelector('.stat-trend'), stats.efficiency.trend);
        }
    }

    calculateStats() {
        const ctsvDept = this.departments.find(d => d.id === 'ctsv');
        const ctvDept = this.departments.find(d => d.id === 'ctv');
        
        const totalTasks = this.tasks.length;
        const pendingTasks = this.tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
        const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
        
        const avgAttendance = Math.round((ctsvDept.attendanceRate + ctvDept.attendanceRate) / 2);
        
        return {
            ctsv: {
                members: ctsvDept.members,
                present: Math.round(ctsvDept.members * ctsvDept.attendanceRate / 100),
                attendanceRate: ctsvDept.attendanceRate,
                trend: ctsvDept.attendanceRate >= 90 ? 'up' : 'down'
            },
            ctv: {
                members: ctvDept.members,
                present: Math.round(ctvDept.members * ctvDept.attendanceRate / 100),
                attendanceRate: ctvDept.attendanceRate,
                trend: ctvDept.attendanceRate >= 85 ? 'up' : 'down'
            },
            tasks: {
                total: totalTasks,
                pending: pendingTasks,
                completed: completedTasks,
                trend: completedTasks > pendingTasks ? 'up' : 'down'
            },
            efficiency: {
                rate: avgAttendance,
                status: avgAttendance >= 90 ? 'Xuất sắc' : avgAttendance >= 80 ? 'Tốt' : 'Cần cải thiện',
                trend: avgAttendance >= 85 ? 'up' : 'down'
            }
        };
    }

    updateTrend(trendElement, direction) {
        if (!trendElement) return;
        
        trendElement.className = `stat-trend ${direction}`;
        const icon = trendElement.querySelector('i');
        if (icon) {
            icon.className = direction === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
        }
    }

    // Department Management
    renderDepartments() {
        const departmentList = document.querySelector('.department-list');
        if (!departmentList) return;

        departmentList.innerHTML = this.departments.map(dept => this.createDepartmentItem(dept)).join('');
    }

    createDepartmentItem(dept) {
        const attendanceClass = dept.attendanceRate >= 90 ? 'high' : dept.attendanceRate >= 80 ? 'medium' : 'low';
        
        return `
            <div class="department-item ${dept.status}" data-dept-id="${dept.id}">
                <div class="dept-info">
                    <div class="dept-icon ${dept.id}">
                        <i class="fas ${this.getDepartmentIcon(dept.id)}"></i>
                    </div>
                    <div class="dept-details">
                        <h4>${dept.name}</h4>
                        <p>${dept.description}</p>
                        <small>Trưởng phòng: ${dept.head}</small>
                    </div>
                </div>
                <div class="dept-stats">
                    <div class="attendance-rate ${attendanceClass}">
                        ${dept.attendanceRate}%
                    </div>
                    <div class="member-count">
                        <i class="fas fa-users"></i>
                        <span>${dept.members}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-icon" data-action="edit" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" data-action="view" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getDepartmentIcon(deptId) {
        const icons = {
            'ctsv': 'fa-graduation-cap',
            'ctv': 'fa-users',
            'support': 'fa-tools'
        };
        return icons[deptId] || 'fa-building';
    }

    selectDepartment(deptElement) {
        // Remove active class from all departments
        document.querySelectorAll('.department-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to selected department
        deptElement.classList.add('active');
        
        // Filter tasks by department
        const deptId = deptElement.dataset.deptId;
        this.filterTasksByDepartment(deptId);
    }

    handleDepartmentAction(action, deptId) {
        const dept = this.departments.find(d => d.id === deptId);
        if (!dept) return;

        switch (action) {
            case 'edit':
                this.editDepartment(dept);
                break;
            case 'view':
                this.viewDepartmentDetails(dept);
                break;
        }
    }

    // Task Management
    renderTasks() {
        this.filterTasks(this.currentFilter);
    }

    filterTasks(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Filter and render tasks
        let filteredTasks = this.tasks;
        
        if (filter !== 'all') {
            filteredTasks = this.tasks.filter(task => {
                switch (filter) {
                    case 'pending': return task.status === 'pending';
                    case 'progress': return task.status === 'in-progress';
                    case 'completed': return task.status === 'completed';
                    case 'high': return task.priority === 'high';
                    default: return true;
                }
            });
        }
        
        this.renderTaskList(filteredTasks);
    }

    filterTasksByDepartment(deptId) {
        const filteredTasks = this.tasks.filter(task => task.department === deptId);
        this.renderTaskList(filteredTasks);
    }

    renderTaskList(tasks) {
        const taskList = document.querySelector('.task-list');
        if (!taskList) return;
        
        if (tasks.length === 0) {
            taskList.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fas fa-tasks" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>Không có nhiệm vụ nào</p>
                </div>
            `;
            return;
        }

        taskList.innerHTML = tasks.map(task => this.createTaskItem(task)).join('');
    }

    createTaskItem(task) {
        const deadlineDate = new Date(task.deadline);
        const isOverdue = deadlineDate < new Date() && task.status !== 'completed';
        const deadlineText = this.formatDeadline(deadlineDate);
        
        return `
            <div class="task-item ${task.priority}-priority" data-task-id="${task.id}">
                <div class="task-checkbox">
                    <input type="checkbox" ${task.status === 'completed' ? 'checked' : ''}>
                </div>
                <div class="task-info">
                    <h4>${task.title}</h4>
                    <p>${task.description}</p>
                    <div class="task-meta">
                        <div class="task-assignee">
                            <i class="fas fa-user"></i>
                            <span>${task.assignee}</span>
                        </div>
                        <div class="task-deadline ${isOverdue ? 'overdue' : ''}">
                            <i class="fas fa-calendar"></i>
                            <span>${deadlineText}</span>
                        </div>
                    </div>
                </div>
                <div class="task-priority ${task.priority}">
                    ${this.getPriorityText(task.priority)}
                </div>
                <div class="task-actions">
                    <button class="btn-icon" data-action="edit-task" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" data-action="delete-task" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    getPriorityText(priority) {
        const priorities = {
            'high': 'Cao',
            'medium': 'Trung bình',
            'low': 'Thấp'
        };
        return priorities[priority] || priority;
    }

    formatDeadline(date) {
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return `Quá hạn ${Math.abs(diffDays)} ngày`;
        } else if (diffDays === 0) {
            return 'Hôm nay';
        } else if (diffDays === 1) {
            return 'Ngày mai';
        } else {
            return `${diffDays} ngày nữa`;
        }
    }

    toggleTaskCompletion(checkbox) {
        const taskItem = checkbox.closest('.task-item');
        const taskId = taskItem.dataset.taskId;
        const task = this.tasks.find(t => t.id === taskId);
        
        if (task) {
            task.status = checkbox.checked ? 'completed' : 'pending';
            if (checkbox.checked) {
                task.completedAt = new Date();
            } else {
                delete task.completedAt;
            }
            
            this.saveTasks();
            this.renderQuickStats();
            this.addActivity({
                title: checkbox.checked ? 'Nhiệm vụ hoàn thành' : 'Nhiệm vụ được mở lại',
                description: `${task.title} đã được ${checkbox.checked ? 'hoàn thành' : 'mở lại'}`,
                type: checkbox.checked ? 'success' : 'info',
                time: new Date(),
                department: task.department,
                user: this.currentUser?.name || 'Người dùng'
            });
        }
    }

    createTask(formData) {
        const task = {
            id: `task-${Date.now()}`,
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            status: 'pending',
            assignee: formData.get('assignee'),
            department: formData.get('department'),
            deadline: new Date(formData.get('deadline')),
            createdAt: new Date()
        };
        
        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.renderQuickStats();
        this.closeModal('createTaskModal');
        
        // Clear form
        document.getElementById('createTaskForm').reset();
        
        // Add activity
        this.addActivity({
            title: 'Nhiệm vụ mới được tạo',
            description: `Đã tạo nhiệm vụ: ${task.title}`,
            type: 'info',
            time: new Date(),
            department: task.department,
            user: this.currentUser?.name || 'Người dùng'
        });
        
        this.showNotification('Tạo nhiệm vụ thành công!', 'success');
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        // Populate form with task data
        const form = document.getElementById('createTaskForm');
        form.title.value = task.title;
        form.description.value = task.description;
        form.priority.value = task.priority;
        form.assignee.value = task.assignee;
        form.department.value = task.department;
        form.deadline.value = task.deadline.toISOString().split('T')[0];
        
        // Change modal title
        document.querySelector('#createTaskModal .modal-header h3').innerHTML = 
            '<i class="fas fa-edit"></i> Chỉnh sửa nhiệm vụ';
        
        // Update form submission
        form.dataset.editId = taskId;
        
        this.openModal('createTaskModal');
    }

    deleteTask(taskId) {
        if (!confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) return;
        
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            const task = this.tasks[taskIndex];
            this.tasks.splice(taskIndex, 1);
            this.saveTasks();
            this.renderTasks();
            this.renderQuickStats();
            
            this.addActivity({
                title: 'Nhiệm vụ bị xóa',
                description: `Đã xóa nhiệm vụ: ${task.title}`,
                type: 'warning',
                time: new Date(),
                department: task.department,
                user: this.currentUser?.name || 'Người dùng'
            });
            
            this.showNotification('Xóa nhiệm vụ thành công!', 'success');
        }
    }

    // Activities
    renderActivities() {
        const activityTimeline = document.querySelector('.activity-timeline');
        if (!activityTimeline) return;
        
        const sortedActivities = this.activities
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 10); // Show only latest 10 activities
        
        activityTimeline.innerHTML = sortedActivities.map(activity => this.createActivityItem(activity)).join('');
    }

    createActivityItem(activity) {
        const timeText = this.formatActivityTime(new Date(activity.time));
        
        return `
            <div class="activity-item">
                <div class="activity-time">${timeText}</div>
                <div class="activity-icon ${activity.type}">
                    <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
            </div>
        `;
    }

    getActivityIcon(type) {
        const icons = {
            'success': 'fa-check',
            'info': 'fa-info',
            'warning': 'fa-exclamation-triangle',
            'primary': 'fa-bell'
        };
        return icons[type] || 'fa-circle';
    }

    formatActivityTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins}p`;
        if (diffHours < 24) return `${diffHours}h`;
        
        return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
    }

    addActivity(activity) {
        activity.id = `activity-${Date.now()}`;
        this.activities.unshift(activity);
        
        // Keep only latest 50 activities
        if (this.activities.length > 50) {
            this.activities = this.activities.slice(0, 50);
        }
        
        this.saveActivities();
        this.renderActivities();
    }

    // Charts
    initializeChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;
        
        const chartData = this.getChartData('week');
        
        this.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'CTSV',
                        data: chartData.ctsv,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'CTV',
                        data: chartData.ctv,
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Support',
                        data: chartData.support,
                        borderColor: '#9b59b6',
                        backgroundColor: 'rgba(155, 89, 182, 0.1)',
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
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
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

    getChartData(period) {
        // Generate sample data based on period
        let labels, data;
        
        switch (period) {
            case 'day':
                labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
                data = {
                    ctsv: [85, 88, 92, 94, 91, 89],
                    ctv: [82, 85, 87, 89, 86, 84],
                    support: [90, 93, 95, 97, 94, 92]
                };
                break;
            case 'month':
                labels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
                data = {
                    ctsv: [88, 91, 93, 92],
                    ctv: [85, 87, 89, 87],
                    support: [92, 94, 96, 95]
                };
                break;
            default: // week
                labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
                data = {
                    ctsv: [88, 92, 90, 94, 91, 89, 85],
                    ctv: [85, 87, 84, 89, 86, 82, 80],
                    support: [92, 95, 93, 97, 94, 91, 88]
                };
        }
        
        return { labels, ...data };
    }

    updateChart(period) {
        if (!this.performanceChart) return;
        
        const chartData = this.getChartData(period);
        
        this.performanceChart.data.labels = chartData.labels;
        this.performanceChart.data.datasets[0].data = chartData.ctsv;
        this.performanceChart.data.datasets[1].data = chartData.ctv;
        this.performanceChart.data.datasets[2].data = chartData.support;
        
        this.performanceChart.update();
    }

    // Quick Actions
    handleQuickAction(action) {
        switch (action) {
            case 'create-task':
                this.openModal('createTaskModal');
                break;
            case 'attendance-report':
                this.generateAttendanceReport();
                break;
            case 'export-data':
                this.exportData();
                break;
            case 'system-settings':
                this.openSystemSettings();
                break;
        }
    }

    generateAttendanceReport() {
        this.showNotification('Đang tạo báo cáo điểm danh...', 'info');
        
        // Simulate report generation
        setTimeout(() => {
            this.showNotification('Báo cáo điểm danh đã được tạo thành công!', 'success');
            this.addActivity({
                title: 'Báo cáo được tạo',
                description: 'Đã tạo báo cáo điểm danh tuần này',
                type: 'success',
                time: new Date(),
                department: 'ctsv',
                user: this.currentUser?.name || 'Người dùng'
            });
        }, 2000);
    }

    exportData() {
        const data = {
            departments: this.departments,
            tasks: this.tasks,
            activities: this.activities,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `operations-data-${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Dữ liệu đã được xuất thành công!', 'success');
    }

    openSystemSettings() {
        this.showNotification('Mở cài đặt hệ thống...', 'info');
        // Implement system settings modal
    }

    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset form if it's the create task modal
            if (modalId === 'createTaskModal') {
                const form = document.getElementById('createTaskForm');
                form.reset();
                delete form.dataset.editId;
                document.querySelector('#createTaskModal .modal-header h3').innerHTML = 
                    '<i class="fas fa-plus"></i> Tạo nhiệm vụ mới';
            }
        }
    }

    // Utility Functions
    updateLastRefresh() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const refreshElements = document.querySelectorAll('.last-refresh');
        refreshElements.forEach(element => {
            element.textContent = `Cập nhật lần cuối: ${timeString}`;
        });
    }

    startRealtimeUpdates() {
        // Update every 30 seconds
        setInterval(() => {
            this.updateLastRefresh();
            this.renderQuickStats();
        }, 30000);
        
        // Update activities every 2 minutes
        setInterval(() => {
            this.simulateNewActivity();
        }, 120000);
    }

    simulateNewActivity() {
        const randomActivities = [
            {
                title: 'Điểm danh tự động',
                description: 'Hệ thống đã ghi nhận điểm danh tự động',
                type: 'info',
                department: 'ctsv'
            },
            {
                title: 'Cập nhật dữ liệu',
                description: 'Dữ liệu hệ thống đã được đồng bộ',
                type: 'success',
                department: 'support'
            },
            {
                title: 'Hoạt động mới',
                description: 'CTV đã tham gia hoạt động mới',
                type: 'info',
                department: 'ctv'
            }
        ];
        
        const randomActivity = randomActivities[Math.floor(Math.random() * randomActivities.length)];
        this.addActivity({
            ...randomActivity,
            time: new Date(),
            user: 'Hệ thống'
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Position and show
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || 'fa-bell';
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Data Persistence
    saveTasks() {
        localStorage.setItem('operations_tasks', JSON.stringify(this.tasks));
    }

    saveDepartments() {
        localStorage.setItem('operations_departments', JSON.stringify(this.departments));
    }

    saveActivities() {
        localStorage.setItem('operations_activities', JSON.stringify(this.activities));
    }
}

// Notification Styles (add to CSS)
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 10001;
        border-left: 4px solid;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left-color: var(--success-color);
        color: var(--success-color);
    }
    
    .notification-error {
        border-left-color: var(--danger-color);
        color: var(--danger-color);
    }
    
    .notification-warning {
        border-left-color: var(--warning-color);
        color: var(--warning-color);
    }
    
    .notification-info {
        border-left-color: var(--info-color);
        color: var(--info-color);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
    }
    
    .notification-close:hover {
        color: var(--text-primary);
    }
`;

// Add notification styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize Operations Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the operations page
    if (document.querySelector('.operations-main')) {
        window.operationsManager = new OperationsManager();
    }
});

// Export for global access
window.OperationsManager = OperationsManager;
