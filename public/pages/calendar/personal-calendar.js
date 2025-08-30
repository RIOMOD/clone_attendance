// Personal Calendar Manager - Enhanced Task & Event Management
class PersonalCalendarManager {
    constructor() {
        this.calendar = null;
        this.tasks = [];
        this.personalEvents = [];
        this.notes = [];
        this.filters = {
            category: 'all',
            priority: 'all',
            status: 'all'
        };
        this.init();
    }

    init() {
        console.log('🚀 Initializing Personal Calendar Manager...');
        this.setupEventListeners();
        this.initializePersonalCalendar();
        this.loadPersonalData();
        this.updatePersonalStats();
        this.renderTodayTasks();
        this.renderUpcomingDeadlines();
        this.loadQuickNotes();
        console.log('✅ Personal Calendar Manager initialized successfully!');
    }

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

        // Personal calendar controls
        const todayViewBtn = document.getElementById('todayViewBtn');
        const weekViewBtn = document.getElementById('weekViewBtn');
        const addTaskBtn = document.getElementById('addTaskBtn');

        if (todayViewBtn) todayViewBtn.addEventListener('click', () => this.showTodayView());
        if (weekViewBtn) weekViewBtn.addEventListener('click', () => this.showWeekView());
        if (addTaskBtn) addTaskBtn.addEventListener('click', () => this.showTaskModal());

        // Filter control
        const personalFilter = document.getElementById('personalFilter');
        if (personalFilter) {
            personalFilter.addEventListener('change', (e) => this.applyPersonalFilter(e.target.value));
        }

        // Task modal
        this.setupTaskModalEventListeners();

        // Quick actions
        this.setupPersonalQuickActions();

        // Task checkboxes
        this.setupTaskEventListeners();
    }

    setupTaskModalEventListeners() {
        const modal = document.getElementById('personalTaskModal');
        const modalCloseBtn = document.getElementById('taskModalCloseBtn');
        const modalCancelBtn = document.getElementById('taskModalCancelBtn');
        const modalSaveBtn = document.getElementById('taskModalSaveBtn');

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => this.hideTaskModal());
        }

        if (modalCancelBtn) {
            modalCancelBtn.addEventListener('click', () => this.hideTaskModal());
        }

        if (modalSaveBtn) {
            modalSaveBtn.addEventListener('click', () => this.saveTask());
        }

        // Close modal on backdrop click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideTaskModal();
                }
            });
        }
    }

    setupPersonalQuickActions() {
        // Quick actions
        window.addTask = () => this.showTaskModal();
        window.addReminder = () => this.showReminderModal();
        window.viewProductivity = () => this.showProductivityReport();
        window.exportPersonalCalendar = () => this.exportPersonalCalendar();
        window.addQuickNote = () => this.addQuickNote();
    }

    setupTaskEventListeners() {
        // Task checkboxes will be added dynamically
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.closest('.task-item')) {
                const taskItem = e.target.closest('.task-item');
                this.toggleTaskCompletion(taskItem, e.target.checked);
            }
        });
    }

    // Mobile menu toggle
    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
        }
    }

    // Sidebar toggle
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
    }

    // Initialize Personal Calendar
    initializePersonalCalendar() {
        const calendarEl = document.getElementById('personalCalendar');
        if (!calendarEl) return;

        this.calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'vi',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            buttonText: {
                today: 'Hôm nay',
                month: 'Tháng',
                week: 'Tuần',
                day: 'Ngày',
                list: 'Danh sách'
            },
            height: 'auto',
            events: this.personalEvents,
            eventClick: (info) => this.handlePersonalEventClick(info),
            dateClick: (info) => this.handlePersonalDateClick(info),
            eventDidMount: (info) => this.stylePersonalEvent(info),
            datesSet: () => this.updatePersonalStats()
        });

        this.calendar.render();
        console.log('✅ Personal Calendar rendered successfully');
    }

    // Load personal data
    loadPersonalData() {
        // Load tasks
        this.tasks = [
            {
                id: '1',
                title: 'Hoàn thành báo cáo tuần',
                description: 'Viết báo cáo tiến độ công việc tuần này',
                category: 'work',
                priority: 'high',
                date: '2025-08-30',
                time: '09:00',
                duration: 120,
                completed: true,
                location: 'Văn phòng'
            },
            {
                id: '2',
                title: 'Chuẩn bị thuyết trình',
                description: 'Chuẩn bị slide thuyết trình cho cuộc họp',
                category: 'work',
                priority: 'medium',
                date: '2025-08-30',
                time: '14:00',
                duration: 90,
                completed: false,
                location: 'Nhà'
            },
            {
                id: '3',
                title: 'Gửi email khách hàng',
                description: 'Trả lời email của khách hàng về dự án',
                category: 'work',
                priority: 'urgent',
                date: '2025-08-30',
                time: '10:00',
                duration: 30,
                completed: false,
                location: 'Online',
                overdue: true
            },
            {
                id: '4',
                title: 'Họp team 1:1',
                description: 'Cuộc họp 1:1 với team leader',
                category: 'work',
                priority: 'low',
                date: '2025-08-30',
                time: '16:30',
                duration: 60,
                completed: false,
                location: 'Phòng họp'
            }
        ];

        // Load personal events
        this.personalEvents = [
            {
                id: 'p1',
                title: 'Đi tập gym',
                start: '2025-08-30T06:30:00',
                end: '2025-08-30T08:00:00',
                category: 'health',
                priority: 'medium',
                backgroundColor: '#f59e0b'
            },
            {
                id: 'p2',
                title: 'Học tiếng Anh',
                start: '2025-08-30T19:00:00',
                end: '2025-08-30T20:30:00',
                category: 'study',
                priority: 'high',
                backgroundColor: '#06b6d4'
            },
            {
                id: 'p3',
                title: 'Nộp báo cáo tháng',
                start: '2025-08-30T17:00:00',
                end: '2025-08-30T17:00:00',
                category: 'work',
                priority: 'urgent',
                backgroundColor: '#ef4444'
            },
            {
                id: 'p4',
                title: 'Hoàn thành dự án X',
                start: '2025-09-02T23:59:00',
                end: '2025-09-02T23:59:00',
                category: 'work',
                priority: 'high',
                backgroundColor: '#f59e0b'
            }
        ];

        // Load quick notes
        this.notes = [
            {
                id: 'n1',
                content: 'Nhớ mua quà sinh nhật cho mẹ',
                created: new Date()
            },
            {
                id: 'n2',
                content: 'Đặt lịch khám sức khỏe định kỳ',
                created: new Date()
            }
        ];

        // Update calendar with events
        if (this.calendar) {
            this.calendar.removeAllEvents();
            this.calendar.addEventSource(this.personalEvents);
        }

        console.log('✅ Personal data loaded:', {
            tasks: this.tasks.length,
            events: this.personalEvents.length,
            notes: this.notes.length
        });
    }

    // Update personal statistics
    updatePersonalStats() {
        const today = new Date();
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

        // Count today's tasks
        const todayTasks = this.tasks.filter(task => {
            const taskDate = new Date(task.date);
            return this.isSameDay(taskDate, today);
        }).length;

        // Count completed tasks this week
        const completedTasks = this.tasks.filter(task => {
            const taskDate = new Date(task.date);
            return task.completed && taskDate >= startOfWeek && taskDate <= endOfWeek;
        }).length;

        // Count upcoming deadlines
        const upcomingDeadlines = this.personalEvents.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate >= today && eventDate <= endOfWeek;
        }).length;

        // Calculate productivity score
        const totalTasks = this.tasks.length;
        const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Update stat cards
        this.updatePersonalStatCard('todayTasks', todayTasks);
        this.updatePersonalStatCard('completedTasks', completedTasks);
        this.updatePersonalStatCard('upcomingDeadlines', upcomingDeadlines);
        this.updatePersonalStatCard('productivityScore', productivityScore + '%');
    }

    updatePersonalStatCard(statKey, value) {
        const statCard = document.querySelector(`[data-stat="${statKey}"] .stat-info h3`);
        if (statCard) {
            statCard.textContent = value;
        }
    }

    // Render today's tasks
    renderTodayTasks() {
        const today = new Date();
        const todayTasks = this.tasks.filter(task => {
            const taskDate = new Date(task.date);
            return this.isSameDay(taskDate, today);
        });

        const taskListContainer = document.querySelector('.personal-tasks-sidebar .section-card .task-list');
        if (!taskListContainer) return;

        taskListContainer.innerHTML = '';

        todayTasks.forEach(task => {
            const timeStr = task.time || 'Cả ngày';
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''} ${task.overdue ? 'urgent' : ''}`;
            taskElement.dataset.taskId = task.id;

            taskElement.innerHTML = `
                <div class="task-checkbox">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <i class="fas fa-check"></i>
                </div>
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        <span class="task-priority ${task.priority}">${this.getPriorityLabel(task.priority)}</span>
                        <span class="task-time ${task.overdue ? 'overdue' : ''}">
                            <i class="fas ${task.overdue ? 'fa-exclamation-triangle' : 'fa-clock'}"></i>
                            ${task.overdue ? 'Quá hạn' : timeStr}
                        </span>
                    </div>
                </div>
            `;

            taskListContainer.appendChild(taskElement);
        });

        // Update today tasks count badge
        const badge = document.querySelector('.personal-tasks-sidebar .section-card .badge');
        if (badge) {
            badge.textContent = todayTasks.length;
        }
    }

    getPriorityLabel(priority) {
        const labels = {
            'urgent': 'Khẩn cấp',
            'high': 'Cao',
            'medium': 'Trung bình',
            'low': 'Thấp'
        };
        return labels[priority] || 'Khác';
    }

    // Render upcoming deadlines
    renderUpcomingDeadlines() {
        const today = new Date();
        const upcomingDeadlines = this.personalEvents.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate >= today;
        }).sort((a, b) => new Date(a.start) - new Date(b.start)).slice(0, 5);

        const deadlineContainer = document.querySelectorAll('.personal-tasks-sidebar .section-card')[1];
        if (!deadlineContainer) return;

        const deadlineList = deadlineContainer.querySelector('.deadline-list');
        if (!deadlineList) return;

        deadlineList.innerHTML = '';

        upcomingDeadlines.forEach(event => {
            const eventDate = new Date(event.start);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleString('vi-VN', { month: 'short' });
            const daysLeft = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

            const isUrgent = daysLeft <= 2;

            const deadlineElement = document.createElement('div');
            deadlineElement.className = `deadline-item ${isUrgent ? 'urgent' : ''}`;

            deadlineElement.innerHTML = `
                <div class="deadline-date">
                    <div class="date-number">${day}</div>
                    <div class="date-month">${month}</div>
                </div>
                <div class="deadline-info">
                    <div class="deadline-title">${event.title}</div>
                    <div class="deadline-status ${isUrgent ? 'urgent' : ''}">
                        <i class="fas ${isUrgent ? 'fa-exclamation-circle' : 'fa-clock'}"></i>
                        Còn ${daysLeft} ngày
                    </div>
                </div>
            `;

            deadlineList.appendChild(deadlineElement);
        });
    }

    // Load and render quick notes
    loadQuickNotes() {
        const notesContainer = document.querySelector('.notes-list');
        if (!notesContainer) return;

        notesContainer.innerHTML = '';

        this.notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            noteElement.dataset.noteId = note.id;

            noteElement.innerHTML = `
                <div class="note-content">${note.content}</div>
                <div class="note-actions">
                    <button class="note-action-btn" title="Chỉnh sửa" onclick="editNote('${note.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="note-action-btn" title="Xóa" onclick="deleteNote('${note.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            notesContainer.appendChild(noteElement);
        });
    }

    // Add quick note
    addQuickNote() {
        const input = document.getElementById('quickNoteInput');
        if (!input || !input.value.trim()) return;

        const newNote = {
            id: 'n' + Date.now(),
            content: input.value.trim(),
            created: new Date()
        };

        this.notes.push(newNote);
        input.value = '';
        this.loadQuickNotes();

        this.showNotification('Ghi chú đã được thêm!', 'success');
    }

    // Calendar view controls
    showTodayView() {
        if (this.calendar) {
            this.calendar.changeView('timeGridDay');
            this.calendar.today();
        }
    }

    showWeekView() {
        if (this.calendar) {
            this.calendar.changeView('timeGridWeek');
        }
    }

    // Personal filter
    applyPersonalFilter(filterValue) {
        this.filters.category = filterValue;

        if (this.calendar) {
            let filteredEvents = this.personalEvents;

            if (filterValue !== 'all') {
                filteredEvents = this.personalEvents.filter(event => event.category === filterValue);
            }

            this.calendar.removeAllEvents();
            this.calendar.addEventSource(filteredEvents);
        }
    }

    // Task modal management
    showTaskModal(taskData = null) {
        const modal = document.getElementById('personalTaskModal');
        if (!modal) return;

        // Reset form
        const form = document.getElementById('personalTaskForm');
        if (form) {
            form.reset();
        }

        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('taskDate').value = today;

        // If editing, populate form
        if (taskData) {
            this.populateTaskForm(taskData);
            document.getElementById('taskModalTitle').innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa công việc';
        } else {
            document.getElementById('taskModalTitle').innerHTML = '<i class="fas fa-tasks"></i> Thêm công việc mới';
        }

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    hideTaskModal() {
        const modal = document.getElementById('personalTaskModal');
        if (!modal) return;

        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    // Save task
    saveTask() {
        const form = document.getElementById('personalTaskForm');
        if (!form) return;

        const formData = new FormData(form);
        const taskData = {
            id: Date.now().toString(),
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            priority: formData.get('priority'),
            date: formData.get('date'),
            time: formData.get('time'),
            duration: parseInt(formData.get('duration')) || 30,
            location: formData.get('location'),
            completed: false,
            reminder: formData.get('reminder') === 'on',
            recurring: formData.get('recurring') === 'on'
        };

        // Add to tasks array
        this.tasks.push(taskData);

        // Create calendar event
        if (taskData.time) {
            const personalEvent = {
                id: 'task_' + taskData.id,
                title: taskData.title,
                start: `${taskData.date}T${taskData.time}:00`,
                category: taskData.category,
                priority: taskData.priority,
                backgroundColor: this.getCategoryColor(taskData.category),
                extendedProps: {
                    type: 'task',
                    taskId: taskData.id
                }
            };

            if (taskData.duration) {
                const startDate = new Date(personalEvent.start);
                const endDate = new Date(startDate.getTime() + (taskData.duration * 60000));
                personalEvent.end = endDate.toISOString().slice(0, 19);
            }

            this.personalEvents.push(personalEvent);

            if (this.calendar) {
                this.calendar.addEvent(personalEvent);
            }
        }

        // Update displays
        this.updatePersonalStats();
        this.renderTodayTasks();

        // Hide modal
        this.hideTaskModal();

        // Show success notification
        this.showNotification('Công việc đã được thêm thành công!', 'success');

        console.log('✅ Task saved:', taskData);
    }

    getCategoryColor(category) {
        const colors = {
            'work': '#2563eb',
            'personal': '#10b981',
            'study': '#06b6d4',
            'health': '#f59e0b',
            'finance': '#6366f1',
            'family': '#ef4444'
        };
        return colors[category] || '#6b7280';
    }

    // Task completion toggle
    toggleTaskCompletion(taskItem, completed) {
        const taskId = taskItem.dataset.taskId;
        const task = this.tasks.find(t => t.id === taskId);

        if (task) {
            task.completed = completed;

            if (completed) {
                taskItem.classList.add('completing');
                setTimeout(() => {
                    taskItem.classList.remove('completing');
                    taskItem.classList.add('completed');
                }, 600);

                this.showNotification('Công việc đã hoàn thành!', 'success');
            } else {
                taskItem.classList.remove('completed');
            }

            this.updatePersonalStats();
        }
    }

    // Personal calendar actions
    showReminderModal() {
        this.showNotification('Tính năng nhắc nhở đang phát triển!', 'info');
    }

    showProductivityReport() {
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const totalTasks = this.tasks.length;
        const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const reportContent = `
            <div class="productivity-report">
                <h4>Báo cáo hiệu suất</h4>
                <p><strong>Tổng công việc:</strong> ${totalTasks}</p>
                <p><strong>Đã hoàn thành:</strong> ${completedTasks}</p>
                <p><strong>Điểm hiệu suất:</strong> ${productivityScore}%</p>
            </div>
        `;

        this.showModal('Hiệu suất làm việc', reportContent);
    }

    exportPersonalCalendar() {
        const data = {
            tasks: this.tasks,
            events: this.personalEvents,
            notes: this.notes,
            exported: new Date().toISOString()
        };

        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `personal_calendar_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Xuất lịch cá nhân thành công!', 'success');
    }

    // Event handlers
    handlePersonalEventClick(info) {
        const event = info.event;
        console.log('Personal event clicked:', event);
    }

    handlePersonalDateClick(info) {
        document.getElementById('taskDate').value = info.dateStr;
        this.showTaskModal();
    }

    stylePersonalEvent(info) {
        const category = info.event.extendedProps.category;
        if (category) {
            info.el.classList.add(`category-${category}`);
        }
    }

    // Helper methods
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        let container = document.getElementById('notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications';
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary close-btn">Đóng</button>
                </div>
            </div>
        `;

        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());

        document.body.appendChild(modal);
    }
}

// Global functions for note actions
window.editNote = (noteId) => {
    console.log('Edit note:', noteId);
    // Implementation for editing notes
};

window.deleteNote = (noteId) => {
    const personalCalendar = window.personalCalendarManager;
    if (personalCalendar) {
        personalCalendar.notes = personalCalendar.notes.filter(note => note.id !== noteId);
        personalCalendar.loadQuickNotes();
        personalCalendar.showNotification('Ghi chú đã được xóa!', 'success');
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.personalCalendarManager = new PersonalCalendarManager();
});

console.log('📋 Personal Calendar JS loaded successfully!');
