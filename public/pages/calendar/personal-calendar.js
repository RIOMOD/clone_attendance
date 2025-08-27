/* ===== PERSONAL CALENDAR - COMPREHENSIVE JAVASCRIPT ===== */

// Personal Calendar Manager - Advanced Features
class PersonalCalendarManager {
    constructor() {
        this.calendar = null;
        this.currentDate = new Date();
        this.events = JSON.parse(localStorage.getItem('personalEvents')) || [];
        this.tasks = JSON.parse(localStorage.getItem('personalTasks')) || [];
        this.notes = localStorage.getItem('personalNotes') || '';
        this.categories = JSON.parse(localStorage.getItem('personalCategories')) || [
            { id: 'personal', name: 'Cá nhân', color: '#3b82f6', active: true },
            { id: 'study', name: 'Học tập', color: '#10b981', active: true },
            { id: 'work', name: 'Công việc', color: '#f59e0b', active: true },
            { id: 'health', name: 'Sức khỏe', color: '#ef4444', active: true },
            { id: 'hobby', name: 'Sở thích', color: '#8b5cf6', active: true }
        ];

        // Timer
        this.timer = {
            minutes: 25,
            seconds: 0,
            isRunning: false,
            interval: null,
            mode: 'pomodoro'
        };

        // Initialize Vietnamese locale for moment.js
        if (typeof moment !== 'undefined') {
            moment.locale('vi');
        }

        this.init();
    }

    init() {
        this.initializeFullCalendar();
        this.setupEventListeners();
        this.loadPersonalData();
        this.updateUI();
        this.initializeClock();
        this.initializeChart();
        this.generateSampleData();
    }

    // Initialize FullCalendar
    initializeFullCalendar() {
        const calendarEl = document.getElementById('personalCalendar');
        if (!calendarEl) return;

        this.calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'vi',
            headerToolbar: false, // We use custom header
            height: 'auto',
            expandRows: true,
            events: this.getFilteredEvents(),

            // Event styling
            eventDisplay: 'block',
            eventBackgroundColor: '#3b82f6',
            eventBorderColor: '#2563eb',
            eventTextColor: '#ffffff',

            // Event handlers
            eventClick: this.handleEventClick.bind(this),
            dateClick: this.handleDateClick.bind(this),
            eventMouseEnter: this.showEventTooltip.bind(this),
            eventMouseLeave: this.hideEventTooltip.bind(this),

            // Custom rendering
            eventClassNames: (arg) => {
                const category = this.getCategoryById(arg.event.extendedProps.category);
                return [`event-${arg.event.extendedProps.category}`, `priority-${arg.event.extendedProps.priority}`];
            },

            dayCellClassNames: (arg) => {
                const today = new Date();
                if (arg.date.toDateString() === today.toDateString()) {
                    return ['fc-day-today'];
                }
                return [];
            }
        });

        this.calendar.render();
    }

    // Setup event listeners
    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');

        if (sidebarToggle && sidebar && mainContent) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');

                // Save state to localStorage
                const isCollapsed = sidebar.classList.contains('collapsed');
                localStorage.setItem('sidebarCollapsed', isCollapsed);
            });

            // Restore sidebar state from localStorage
            const savedState = localStorage.getItem('sidebarCollapsed');
            if (savedState === 'true') {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            }
        }

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('show');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.toggle('show');
                }
            });
        }

        // Close mobile sidebar when clicking overlay
        if (sidebarOverlay && sidebar) {
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('show');
                sidebarOverlay.classList.remove('show');
            });
        }

        // View controls
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.changeView(view, e.currentTarget);
            });
        });

        // Navigation controls
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const todayBtn = document.getElementById('todayBtn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.navigateCalendar('prev'));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigateCalendar('next'));
        if (todayBtn) todayBtn.addEventListener('click', () => this.goToToday());

        // Modal controls
        this.setupModalEventListeners();

        // Task management
        this.setupTaskEventListeners();

        // Timer controls
        this.setupTimerEventListeners();

        // Notes
        this.setupNotesEventListeners();

        // Category controls
        this.setupCategoryEventListeners();

        // Search functionality
        this.setupSearchEventListeners();

        // Add event button
        const addEventBtn = document.getElementById('addPersonalEventBtn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => this.openEventModal());
        }

        // Quick actions
        this.setupQuickActions();
    }

    // Setup modal event listeners
    setupModalEventListeners() {
        // Personal Event Modal
        const personalEventModal = document.getElementById('personalEventModal');
        const personalModalCloseBtn = document.getElementById('personalModalCloseBtn');
        const personalModalCancelBtn = document.getElementById('personalModalCancelBtn');
        const personalModalSaveBtn = document.getElementById('personalModalSaveBtn');

        if (personalModalCloseBtn) {
            personalModalCloseBtn.addEventListener('click', () => this.closeEventModal());
        }

        if (personalModalCancelBtn) {
            personalModalCancelBtn.addEventListener('click', () => this.closeEventModal());
        }

        if (personalModalSaveBtn) {
            personalModalSaveBtn.addEventListener('click', () => this.saveEvent());
        }

        // Close modal on overlay click
        if (personalEventModal) {
            personalEventModal.addEventListener('click', (e) => {
                if (e.target === personalEventModal) {
                    this.closeEventModal();
                }
            });
        }

        // All day checkbox handler
        const allDayCheckbox = document.getElementById('personalEventAllDay');
        if (allDayCheckbox) {
            allDayCheckbox.addEventListener('change', (e) => {
                const timeInput = document.getElementById('personalEventTime');
                const durationInput = document.getElementById('personalEventDuration');

                if (e.target.checked) {
                    timeInput.disabled = true;
                    durationInput.disabled = true;
                } else {
                    timeInput.disabled = false;
                    durationInput.disabled = false;
                }
            });
        }
    }

    // Setup task event listeners
    setupTaskEventListeners() {
        const addTaskBtn = document.getElementById('addTaskBtn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => this.openTaskModal());
        }

        // Task modal controls
        const taskModal = document.getElementById('taskModal');
        const taskModalCloseBtn = document.getElementById('taskModalCloseBtn');
        const taskModalCancelBtn = document.getElementById('taskModalCancelBtn');
        const taskModalSaveBtn = document.getElementById('taskModalSaveBtn');

        if (taskModalCloseBtn) {
            taskModalCloseBtn.addEventListener('click', () => this.closeTaskModal());
        }

        if (taskModalCancelBtn) {
            taskModalCancelBtn.addEventListener('click', () => this.closeTaskModal());
        }

        if (taskModalSaveBtn) {
            taskModalSaveBtn.addEventListener('click', () => this.saveTask());
        }

        if (taskModal) {
            taskModal.addEventListener('click', (e) => {
                if (e.target === taskModal) {
                    this.closeTaskModal();
                }
            });
        }
    }

    // Setup timer event listeners
    setupTimerEventListeners() {
        const startTimerBtn = document.getElementById('startTimerBtn');
        const pauseTimerBtn = document.getElementById('pauseTimerBtn');
        const resetTimerBtn = document.getElementById('resetTimerBtn');

        if (startTimerBtn) {
            startTimerBtn.addEventListener('click', () => this.startTimer());
        }

        if (pauseTimerBtn) {
            pauseTimerBtn.addEventListener('click', () => this.pauseTimer());
        }

        if (resetTimerBtn) {
            resetTimerBtn.addEventListener('click', () => this.resetTimer());
        }

        // Timer mode selection
        document.querySelectorAll('input[name="timerMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.setTimerMode(e.target.value);
            });
        });
    }

    // Setup notes event listeners
    setupNotesEventListeners() {
        const quickNotes = document.getElementById('quickNotes');
        const saveNotesBtn = document.getElementById('saveNotesBtn');

        if (quickNotes) {
            quickNotes.value = this.notes;
        }

        if (saveNotesBtn) {
            saveNotesBtn.addEventListener('click', () => this.saveNotes());
        }
    }

    // Setup category event listeners
    setupCategoryEventListeners() {
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const categoryId = e.currentTarget.dataset.category;
                this.toggleCategory(categoryId);
            });
        });
    }

    // Setup search event listeners
    setupSearchEventListeners() {
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    // Setup quick actions
    setupQuickActions() {
        // Quick add event
        const quickAddBtn = document.getElementById('quickAddEvent');
        if (quickAddBtn) {
            quickAddBtn.addEventListener('click', () => this.openEventModal());
        }

        // Sync calendar
        const syncBtn = document.getElementById('syncCalendar');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => this.syncCalendar());
        }

        // Export/Import
        const exportBtn = document.getElementById('exportImport');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.showExportImportOptions());
        }
    }

    // Load personal data
    loadPersonalData() {
        this.loadEvents();
        this.loadTasks();
        this.loadNotes();
        this.updateStats();
        this.renderUpcomingEvents();
        this.renderTodayTasks();
    }

    // Load events
    loadEvents() {
        if (this.calendar) {
            this.calendar.removeAllEvents();
            this.calendar.addEventSource(this.getFilteredEvents());
        }
    }

    // Get filtered events
    getFilteredEvents() {
        return this.events.filter(event => {
            const category = this.getCategoryById(event.category);
            return category && category.active;
        }).map(event => ({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            allDay: event.allDay,
            backgroundColor: this.getCategoryColor(event.category),
            borderColor: this.getCategoryColor(event.category, true),
            textColor: '#ffffff',
            extendedProps: {
                description: event.description,
                location: event.location,
                category: event.category,
                priority: event.priority,
                reminders: event.reminders
            }
        }));
    }

    // Event handlers
    handleEventClick(info) {
        this.openEventModal(info.event);
    }

    handleDateClick(info) {
        this.openEventModal(null, info.date);
    }

    showEventTooltip(info) {
        // Create and show tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'event-tooltip';
        tooltip.innerHTML = this.createEventTooltipContent(info.event);

        document.body.appendChild(tooltip);

        // Position tooltip
        const rect = info.el.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = rect.right + 10 + 'px';
        tooltip.style.top = rect.top + 'px';
        tooltip.style.zIndex = '9999';

        this.currentTooltip = tooltip;
    }

    hideEventTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    createEventTooltipContent(event) {
        const startTime = moment(event.start).format('HH:mm');
        const endTime = event.end ? moment(event.end).format('HH:mm') : '';
        const category = this.getCategoryById(event.extendedProps.category);

        return `
            <div class="tooltip-content">
                <div class="tooltip-header">
                    <div class="tooltip-category" style="background: ${category.color}"></div>
                    <h4>${event.title}</h4>
                </div>
                <div class="tooltip-time">${startTime}${endTime ? ' - ' + endTime : ''}</div>
                ${event.extendedProps.location ? `<div class="tooltip-location"><i class="fas fa-map-marker-alt"></i> ${event.extendedProps.location}</div>` : ''}
                ${event.extendedProps.description ? `<div class="tooltip-description">${event.extendedProps.description}</div>` : ''}
            </div>
        `;
    }

    // Navigation
    navigateCalendar(direction) {
        if (this.calendar) {
            if (direction === 'prev') {
                this.calendar.prev();
            } else if (direction === 'next') {
                this.calendar.next();
            }
            this.updateCurrentMonthDisplay();
        }
    }

    goToToday() {
        if (this.calendar) {
            this.calendar.today();
            this.updateCurrentMonthDisplay();
        }
    }

    changeView(viewName, button) {
        if (this.calendar) {
            this.calendar.changeView(viewName);

            // Update active button
            document.querySelectorAll('[data-view]').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            this.updateCurrentMonthDisplay();
        }
    }

    updateCurrentMonthDisplay() {
        const currentMonth = document.getElementById('currentMonth');
        if (currentMonth && this.calendar) {
            const date = this.calendar.getDate();
            currentMonth.textContent = moment(date).format('MMMM YYYY');
        }
    }

    // Modal management
    openEventModal(event = null, date = null) {
        const modal = document.getElementById('personalEventModal');
        const form = document.getElementById('personalEventForm');
        const title = document.getElementById('personalModalTitle');

        if (!modal || !form) return;

        // Reset form
        form.reset();

        if (event) {
            // Edit mode
            title.textContent = 'Chỉnh sửa lịch trình';
            this.populateEventForm(event);
        } else {
            // Add mode
            title.textContent = 'Thêm lịch trình mới';
            if (date) {
                document.getElementById('personalEventDate').value = moment(date).format('YYYY-MM-DD');
            }
        }

        modal.classList.add('show');
        this.currentEditingEvent = event;
    }

    closeEventModal() {
        const modal = document.getElementById('personalEventModal');
        if (modal) {
            modal.classList.remove('show');
            this.currentEditingEvent = null;
        }
    }

    populateEventForm(event) {
        const form = document.getElementById('personalEventForm');
        if (!form) return;

        // Basic info
        form.elements.title.value = event.title;
        form.elements.category.value = event.extendedProps.category;
        form.elements.description.value = event.extendedProps.description || '';

        // Time
        form.elements.date.value = moment(event.start).format('YYYY-MM-DD');
        if (!event.allDay) {
            form.elements.time.value = moment(event.start).format('HH:mm');
            if (event.end) {
                const duration = moment(event.end).diff(moment(event.start), 'minutes');
                form.elements.duration.value = duration;
            }
        }
        form.elements.allDay.checked = event.allDay;

        // Options
        form.elements.location.value = event.extendedProps.location || '';
        form.elements.priority.value = event.extendedProps.priority || 'normal';

        // Reminders
        if (event.extendedProps.reminders) {
            event.extendedProps.reminders.forEach(reminder => {
                const checkbox = form.querySelector(`input[name="reminder"][value="${reminder}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
    }

    saveEvent() {
        const form = document.getElementById('personalEventForm');
        if (!form) return;

        const formData = new FormData(form);
        const eventData = {
            id: this.currentEditingEvent ? this.currentEditingEvent.id : Date.now().toString(),
            title: formData.get('title'),
            category: formData.get('category'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            duration: parseInt(formData.get('duration')) || 60,
            allDay: formData.has('allDay'),
            location: formData.get('location'),
            priority: formData.get('priority'),
            reminders: Array.from(formData.getAll('reminder'))
        };

        // Validation
        if (!eventData.title || !eventData.date) {
            this.showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }

        // Create event object
        const startDateTime = eventData.allDay ?
            eventData.date :
            `${eventData.date}T${eventData.time || '00:00'}`;

        const endDateTime = eventData.allDay ?
            null :
            moment(startDateTime).add(eventData.duration, 'minutes').format();

        const event = {
            id: eventData.id,
            title: eventData.title,
            start: startDateTime,
            end: endDateTime,
            allDay: eventData.allDay,
            category: eventData.category,
            description: eventData.description,
            location: eventData.location,
            priority: eventData.priority,
            reminders: eventData.reminders
        };

        // Save event
        if (this.currentEditingEvent) {
            // Update existing event
            const index = this.events.findIndex(e => e.id === event.id);
            if (index !== -1) {
                this.events[index] = event;
            }
        } else {
            // Add new event
            this.events.push(event);
        }

        // Save to localStorage
        localStorage.setItem('personalEvents', JSON.stringify(this.events));

        // Refresh calendar
        this.loadEvents();
        this.updateStats();
        this.renderUpcomingEvents();

        // Close modal
        this.closeEventModal();

        // Show success message
        this.showToast('Lịch trình đã được lưu thành công!', 'success');
    }

    // Task management
    openTaskModal(task = null) {
        const modal = document.getElementById('taskModal');
        const form = document.getElementById('taskForm');
        const title = document.getElementById('taskModalTitle');

        if (!modal || !form) return;

        form.reset();

        if (task) {
            title.textContent = 'Chỉnh sửa nhiệm vụ';
            this.populateTaskForm(task);
        } else {
            title.textContent = 'Thêm nhiệm vụ mới';
        }

        modal.classList.add('show');
        this.currentEditingTask = task;
    }

    closeTaskModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.classList.remove('show');
            this.currentEditingTask = null;
        }
    }

    populateTaskForm(task) {
        const form = document.getElementById('taskForm');
        if (!form) return;

        form.elements.title.value = task.title;
        form.elements.description.value = task.description || '';
        form.elements.priority.value = task.priority || 'normal';
        if (task.dueDate) {
            form.elements.dueDate.value = moment(task.dueDate).format('YYYY-MM-DD');
        }
    }

    saveTask() {
        const form = document.getElementById('taskForm');
        if (!form) return;

        const formData = new FormData(form);
        const taskData = {
            id: this.currentEditingTask ? this.currentEditingTask.id : Date.now().toString(),
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            dueDate: formData.get('dueDate'),
            completed: this.currentEditingTask ? this.currentEditingTask.completed : false,
            createdAt: this.currentEditingTask ? this.currentEditingTask.createdAt : new Date().toISOString()
        };

        if (!taskData.title) {
            this.showToast('Vui lòng nhập tiêu đề nhiệm vụ', 'error');
            return;
        }

        if (this.currentEditingTask) {
            const index = this.tasks.findIndex(t => t.id === taskData.id);
            if (index !== -1) {
                this.tasks[index] = taskData;
            }
        } else {
            this.tasks.push(taskData);
        }

        localStorage.setItem('personalTasks', JSON.stringify(this.tasks));

        this.renderTodayTasks();
        this.updateStats();
        this.closeTaskModal();
        this.showToast('Nhiệm vụ đã được lưu!', 'success');
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            localStorage.setItem('personalTasks', JSON.stringify(this.tasks));
            this.renderTodayTasks();
            this.updateStats();
        }
    }

    // Timer management
    startTimer() {
        this.timer.isRunning = true;
        this.timer.interval = setInterval(() => {
            if (this.timer.seconds === 0) {
                if (this.timer.minutes === 0) {
                    this.timerComplete();
                    return;
                }
                this.timer.minutes--;
                this.timer.seconds = 59;
            } else {
                this.timer.seconds--;
            }
            this.updateTimerDisplay();
        }, 1000);

        document.getElementById('startTimerBtn').style.display = 'none';
        document.getElementById('pauseTimerBtn').style.display = 'flex';
    }

    pauseTimer() {
        this.timer.isRunning = false;
        clearInterval(this.timer.interval);

        document.getElementById('startTimerBtn').style.display = 'flex';
        document.getElementById('pauseTimerBtn').style.display = 'none';
    }

    resetTimer() {
        this.timer.isRunning = false;
        clearInterval(this.timer.interval);
        this.setTimerMode(this.timer.mode);

        document.getElementById('startTimerBtn').style.display = 'flex';
        document.getElementById('pauseTimerBtn').style.display = 'none';
    }

    setTimerMode(mode) {
        this.timer.mode = mode;
        switch (mode) {
            case 'pomodoro':
                this.timer.minutes = 25;
                break;
            case 'shortBreak':
                this.timer.minutes = 5;
                break;
            case 'longBreak':
                this.timer.minutes = 15;
                break;
        }
        this.timer.seconds = 0;
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const display = document.getElementById('timerTime');
        if (display) {
            const minutes = String(this.timer.minutes).padStart(2, '0');
            const seconds = String(this.timer.seconds).padStart(2, '0');
            display.textContent = `${minutes}:${seconds}`;
        }
    }

    timerComplete() {
        this.resetTimer();
        this.showToast('Thời gian đã kết thúc!', 'success');

        // Play notification sound if available
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Pomodoro Timer', {
                body: 'Thời gian tập trung đã kết thúc!',
                icon: '../../assets/images/imageCLB/LOGO_CODEKING/LOGO CODEKING.png'
            });
        }
    }

    // Notes management
    saveNotes() {
        const notesTextarea = document.getElementById('quickNotes');
        if (notesTextarea) {
            this.notes = notesTextarea.value;
            localStorage.setItem('personalNotes', this.notes);
            this.showToast('Ghi chú đã được lưu!', 'success');
        }
    }

    // Category management
    toggleCategory(categoryId) {
        const category = this.getCategoryById(categoryId);
        if (category) {
            category.active = !category.active;
            localStorage.setItem('personalCategories', JSON.stringify(this.categories));
            this.loadEvents();
            this.updateCategoryUI();
        }
    }

    getCategoryById(categoryId) {
        return this.categories.find(cat => cat.id === categoryId);
    }

    getCategoryColor(categoryId, darker = false) {
        const category = this.getCategoryById(categoryId);
        if (!category) return '#3b82f6';

        if (darker) {
            // Return a darker version of the color
            const color = category.color;
            if (color.startsWith('#')) {
                const hex = color.slice(1);
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                return `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`;
            }
        }

        return category.color;
    }

    updateCategoryUI() {
        document.querySelectorAll('.category-item').forEach(item => {
            const categoryId = item.dataset.category;
            const category = this.getCategoryById(categoryId);
            if (category) {
                item.classList.toggle('active', category.active);
            }
        });
    }

    // UI Updates
    updateUI() {
        this.updateStats();
        this.updateCurrentMonthDisplay();
        this.renderUpcomingEvents();
        this.renderTodayTasks();
        this.updateCategoryUI();
    }

    updateStats() {
        // Total events this month
        const thisMonth = moment().startOf('month');
        const nextMonth = moment().add(1, 'month').startOf('month');
        const monthlyEvents = this.events.filter(event => {
            const eventDate = moment(event.start);
            return eventDate.isSameOrAfter(thisMonth) && eventDate.isBefore(nextMonth);
        });

        // Today's events
        const today = moment().startOf('day');
        const todayEvents = this.events.filter(event => {
            const eventDate = moment(event.start);
            return eventDate.isSame(today, 'day');
        });

        // Pending reminders
        const now = moment();
        const upcomingEvents = this.events.filter(event => {
            const eventDate = moment(event.start);
            return eventDate.isAfter(now) && eventDate.isBefore(moment().add(1, 'day'));
        });

        // Completion rate
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const totalTasks = this.tasks.length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Update DOM
        const totalEventsEl = document.getElementById('totalEvents');
        const todayEventsEl = document.getElementById('todayEvents');
        const pendingRemindersEl = document.getElementById('pendingReminders');
        const completionRateEl = document.getElementById('completionRate');

        if (totalEventsEl) totalEventsEl.textContent = monthlyEvents.length;
        if (todayEventsEl) todayEventsEl.textContent = todayEvents.length;
        if (pendingRemindersEl) pendingRemindersEl.textContent = upcomingEvents.length;
        if (completionRateEl) completionRateEl.textContent = `${completionRate}%`;
    }

    renderUpcomingEvents() {
        const container = document.getElementById('upcomingEventsList');
        if (!container) return;

        const upcomingEvents = this.events
            .filter(event => moment(event.start).isAfter(moment()))
            .sort((a, b) => moment(a.start).diff(moment(b.start)))
            .slice(0, 5);

        if (upcomingEvents.length === 0) {
            container.innerHTML = '<div class="no-events">Không có sự kiện sắp tới</div>';
            return;
        }

        container.innerHTML = upcomingEvents.map(event => {
            const category = this.getCategoryById(event.category);
            const eventTime = moment(event.start).format('HH:mm');
            const eventDate = moment(event.start).calendar();

            return `
                <div class="event-item" onclick="personalCalendar.handleEventClick({event: ${JSON.stringify(event)}})">
                    <div class="event-time">${eventTime}</div>
                    <div class="event-info">
                        <div class="event-title">${event.title}</div>
                        <div class="event-desc">${eventDate}</div>
                    </div>
                    <div class="event-category" style="background: ${category.color}"></div>
                </div>
            `;
        }).join('');
    }

    renderTodayTasks() {
        const container = document.getElementById('todayTasksList');
        if (!container) return;

        const todayTasks = this.tasks
            .filter(task => !task.dueDate || moment(task.dueDate).isSameOrBefore(moment(), 'day'))
            .sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                return moment(a.createdAt).diff(moment(b.createdAt));
            })
            .slice(0, 8);

        if (todayTasks.length === 0) {
            container.innerHTML = '<div class="no-tasks">Không có nhiệm vụ nào</div>';
            return;
        }

        container.innerHTML = todayTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="personalCalendar.toggleTask('${task.id}')">
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    ${task.dueDate ? `<div class="task-due">${moment(task.dueDate).fromNow()}</div>` : ''}
                </div>
                <div class="task-priority ${task.priority}"></div>
            </div>
        `).join('');
    }

    // Clock
    initializeClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const timeEl = document.getElementById('currentTime');
        const dateEl = document.getElementById('currentDate');

        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        if (dateEl) {
            const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            const weekday = weekdays[now.getDay()];
            const date = now.getDate().toString().padStart(2, '0');
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            dateEl.textContent = `${weekday}, ${date}/${month}`;
        }
    }

    // Chart initialization
    initializeChart() {
        const canvas = document.getElementById('weeklyChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        // Generate sample data for the past week
        const labels = [];
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = moment().subtract(i, 'days');
            labels.push(date.format('ddd'));

            // Count events for this day
            const dayEvents = this.events.filter(event =>
                moment(event.start).isSame(date, 'day')
            ).length;
            data.push(dayEvents);
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sự kiện',
                    data: data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
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
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // Search functionality
    handleSearch(query) {
        if (!query) {
            this.hideSearchResults();
            return;
        }

        const results = [
            ...this.events.filter(event =>
                event.title.toLowerCase().includes(query.toLowerCase()) ||
                (event.description && event.description.toLowerCase().includes(query.toLowerCase()))
            ).map(event => ({
                type: 'event',
                title: event.title,
                subtitle: moment(event.start).format('DD/MM/YYYY HH:mm'),
                data: event
            })),
            ...this.tasks.filter(task =>
                task.title.toLowerCase().includes(query.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
            ).map(task => ({
                type: 'task',
                title: task.title,
                subtitle: task.dueDate ? moment(task.dueDate).format('DD/MM/YYYY') : 'Không có hạn cuối',
                data: task
            }))
        ].slice(0, 8);

        this.showSearchResults(results);
    }

    showSearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">Không tìm thấy kết quả</div>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" onclick="personalCalendar.selectSearchResult('${result.type}', '${result.data.id}')">
                    <div class="search-result-icon">
                        <i class="fas fa-${result.type === 'event' ? 'calendar' : 'tasks'}"></i>
                    </div>
                    <div class="search-result-content">
                        <div class="search-result-title">${result.title}</div>
                        <div class="search-result-subtitle">${result.subtitle}</div>
                    </div>
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

    selectSearchResult(type, id) {
        if (type === 'event') {
            const event = this.events.find(e => e.id === id);
            if (event) {
                this.openEventModal(event);
            }
        } else if (type === 'task') {
            const task = this.tasks.find(t => t.id === id);
            if (task) {
                this.openTaskModal(task);
            }
        }
        this.hideSearchResults();
    }

    // Generate sample data for demonstration
    generateSampleData() {
        if (this.events.length === 0) {
            const sampleEvents = [
                {
                    id: '1',
                    title: 'Học Java Spring Boot',
                    start: moment().add(1, 'hour').format(),
                    end: moment().add(3, 'hours').format(),
                    allDay: false,
                    category: 'study',
                    description: 'Học về REST API và JPA',
                    location: 'Phòng học 301',
                    priority: 'high',
                    reminders: ['15', '60']
                },
                {
                    id: '2',
                    title: 'Meeting với team',
                    start: moment().add(1, 'day').hour(14).minute(0).format(),
                    end: moment().add(1, 'day').hour(15).minute(30).format(),
                    allDay: false,
                    category: 'work',
                    description: 'Thảo luận về dự án mới',
                    location: 'Phòng họp A',
                    priority: 'medium',
                    reminders: ['30']
                },
                {
                    id: '3',
                    title: 'Tập gym',
                    start: moment().add(2, 'days').hour(18).minute(0).format(),
                    end: moment().add(2, 'days').hour(19).minute(30).format(),
                    allDay: false,
                    category: 'health',
                    description: 'Tập cardio và weights',
                    location: 'California Fitness',
                    priority: 'normal',
                    reminders: ['60']
                },
                {
                    id: '4',
                    title: 'Sinh nhật bạn',
                    start: moment().add(5, 'days').format('YYYY-MM-DD'),
                    allDay: true,
                    category: 'personal',
                    description: 'Tiệc sinh nhật An',
                    location: 'Nhà hàng ABC',
                    priority: 'high',
                    reminders: ['1440']
                },
                {
                    id: '5',
                    title: 'Học guitar',
                    start: moment().add(3, 'days').hour(20).minute(0).format(),
                    end: moment().add(3, 'days').hour(21).minute(0).format(),
                    allDay: false,
                    category: 'hobby',
                    description: 'Luyện tập bài mới',
                    location: 'Nhà',
                    priority: 'low',
                    reminders: []
                }
            ];

            this.events = sampleEvents;
            localStorage.setItem('personalEvents', JSON.stringify(this.events));
        }

        if (this.tasks.length === 0) {
            const sampleTasks = [
                {
                    id: '1',
                    title: 'Hoàn thành bài tập Java',
                    description: 'Làm exercise về Collections và Streams',
                    priority: 'high',
                    dueDate: moment().add(1, 'day').format('YYYY-MM-DD'),
                    completed: false,
                    createdAt: moment().subtract(1, 'day').toISOString()
                },
                {
                    id: '2',
                    title: 'Đọc tài liệu Spring Security',
                    description: 'Nghiên cứu authentication và authorization',
                    priority: 'medium',
                    dueDate: moment().add(3, 'days').format('YYYY-MM-DD'),
                    completed: false,
                    createdAt: moment().subtract(2, 'hours').toISOString()
                },
                {
                    id: '3',
                    title: 'Mua quà sinh nhật',
                    description: 'Tìm quà phù hợp cho An',
                    priority: 'normal',
                    dueDate: moment().add(4, 'days').format('YYYY-MM-DD'),
                    completed: false,
                    createdAt: moment().subtract(1, 'hour').toISOString()
                },
                {
                    id: '4',
                    title: 'Backup dữ liệu laptop',
                    description: 'Sao lưu tất cả file quan trọng',
                    priority: 'low',
                    dueDate: null,
                    completed: true,
                    createdAt: moment().subtract(1, 'week').toISOString()
                },
                {
                    id: '5',
                    title: 'Lên kế hoạch học tập',
                    description: 'Xây dựng lộ trình học cho tháng tới',
                    priority: 'high',
                    dueDate: moment().format('YYYY-MM-DD'),
                    completed: false,
                    createdAt: moment().subtract(3, 'hours').toISOString()
                }
            ];

            this.tasks = sampleTasks;
            localStorage.setItem('personalTasks', JSON.stringify(this.tasks));
        }
    }

    // Utility functions
    syncCalendar() {
        this.showToast('Đang đồng bộ lịch...', 'info');

        // Simulate sync process
        setTimeout(() => {
            this.loadPersonalData();
            this.showToast('Đồng bộ lịch thành công!', 'success');
        }, 2000);
    }

    showExportImportOptions() {
        // Show export/import modal or options
        const options = [
            'Xuất lịch ra file ICS',
            'Xuất lịch ra Excel',
            'Nhập lịch từ Google Calendar',
            'Nhập lịch từ file ICS'
        ];

        // For now, just show available options
        this.showToast('Tính năng xuất/nhập sẽ được phát triển trong phiên bản tới', 'info');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-message">${message}</div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        container.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
}

// Initialize Personal Calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.personalCalendar = new PersonalCalendarManager();
    console.log('✅ Personal Calendar initialized successfully!');
});

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalCalendarManager;
}

// Add custom CSS for tooltips and search results
const customStyles = `
<style>
.event-tooltip {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    max-width: 300px;
    z-index: 9999;
}

.tooltip-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.tooltip-category {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.tooltip-header h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
}

.tooltip-time {
    font-size: 12px;
    color: #6366f1;
    font-weight: 500;
    margin-bottom: 4px;
}

.tooltip-location {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 4px;
}

.tooltip-description {
    font-size: 12px;
    color: #475569;
    line-height: 1.4;
}

.search-results {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e2e8f0;
    border-top: none;
    background: white;
    border-radius: 0 0 12px 12px;
}

.search-result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.15s ease;
}

.search-result-item:hover {
    background: #f1f5f9;
}

.search-result-icon {
    width: 32px;
    height: 32px;
    background: #f1f5f9;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6366f1;
}

.search-result-content {
    flex: 1;
}

.search-result-title {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    margin-bottom: 2px;
}

.search-result-subtitle {
    font-size: 12px;
    color: #64748b;
}

.no-events,
.no-tasks {
    text-align: center;
    padding: 24px 16px;
    color: #64748b;
    font-size: 14px;
}

.task-item.completed .task-title {
    text-decoration: line-through;
    opacity: 0.6;
}

.fc-day-today {
    background-color: rgba(59, 130, 246, 0.1) !important;
}

.event-personal {
    background-color: #3b82f6 !important;
    border-color: #2563eb !important;
}

.event-study {
    background-color: #10b981 !important;
    border-color: #059669 !important;
}

.event-work {
    background-color: #f59e0b !important;
    border-color: #d97706 !important;
}

.event-health {
    background-color: #ef4444 !important;
    border-color: #dc2626 !important;
}

.event-hobby {
    background-color: #8b5cf6 !important;
    border-color: #7c3aed !important;
}

.priority-high {
    border-left: 4px solid #ef4444 !important;
}

.priority-medium {
    border-left: 4px solid #f59e0b !important;
}

.priority-low {
    border-left: 4px solid #10b981 !important;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', customStyles);

console.log('🎉 Personal Calendar script loaded successfully!');
