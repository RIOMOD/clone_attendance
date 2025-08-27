// Modern Calendar Manager - Dashboard Synchronized
class CalendarManager {
    constructor() {
        this.calendar = null;
        this.currentView = 'dayGridMonth';
        this.events = [];
        this.filters = {
            type: 'all',
            club: 'all',
            priority: 'all'
        };
        this.init();
    }

    init() {
        console.log('🚀 Initializing Calendar Manager...');
        this.setupEventListeners();
        this.initializeCalendar();
        this.loadEvents();
        this.updateStats();
        this.renderTodayEvents();
        this.renderUpcomingEvents();
        console.log('✅ Calendar Manager initialized successfully!');
    }

    // Event Listeners Setup
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

        // Calendar navigation
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const todayBtn = document.getElementById('todayBtn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.navigateCalendar('prev'));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigateCalendar('next'));
        if (todayBtn) todayBtn.addEventListener('click', () => this.goToToday());

        // View toggles
        const toggleButtons = document.querySelectorAll('.toggle-btn');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view');
                this.changeView(view, btn);
            });
        });

        // Filter controls
        const calendarFilter = document.getElementById('calendarFilter');
        if (calendarFilter) {
            calendarFilter.addEventListener('change', (e) => {
                this.applyFilter('type', e.target.value);
            });
        }

        // Add event buttons
        const addEventBtns = document.querySelectorAll('#addEventBtn, .quick-action-btn[id*="quick"]');
        addEventBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = this.getEventTypeFromButton(btn);
                this.showEventModal(type);
            });
        });

        // Sync button
        const syncBtn = document.getElementById('syncBtn');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => this.syncCalendar());
        }

        // Search functionality
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Modal controls
        this.setupModalListeners();

        // User menu
        this.setupUserMenu();

        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    setupModalListeners() {
        const modal = document.getElementById('eventModal');
        const modalCloseBtn = document.getElementById('modalCloseBtn');
        const modalCancelBtn = document.getElementById('modalCancelBtn');
        const modalSaveBtn = document.getElementById('modalSaveBtn');

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => this.hideEventModal());
        }

        if (modalCancelBtn) {
            modalCancelBtn.addEventListener('click', () => this.hideEventModal());
        }

        if (modalSaveBtn) {
            modalSaveBtn.addEventListener('click', () => this.saveEvent());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.hideEventModal();
            });
        }
    }

    setupUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.addEventListener('mouseenter', () => this.showUserDropdown());
            userMenu.addEventListener('mouseleave', () => this.hideUserDropdown());
        }
    }

    // Calendar Initialization
    initializeCalendar() {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;

        this.calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'vi',
            firstDay: 1, // Monday
            height: 'auto',
            headerToolbar: false, // We use custom header

            // Event handling
            eventClick: (info) => this.handleEventClick(info),
            dateClick: (info) => this.handleDateClick(info),
            eventMouseEnter: (info) => this.showEventTooltip(info),
            eventMouseLeave: () => this.hideEventTooltip(),

            // Styling
            dayMaxEvents: 3,
            moreLinkClick: 'popover',

            // Event rendering
            eventDisplay: 'block',
            eventClassNames: (arg) => this.getEventClasses(arg),

            // Date formatting
            dayHeaderFormat: { weekday: 'short' },

            // View configuration
            views: {
                dayGridMonth: {
                    dayMaxEventRows: 3
                },
                timeGridWeek: {
                    slotMinTime: '06:00:00',
                    slotMaxTime: '22:00:00',
                    slotDuration: '00:30:00'
                },
                timeGridDay: {
                    slotMinTime: '06:00:00',
                    slotMaxTime: '22:00:00',
                    slotDuration: '00:30:00'
                }
            },

            // Business hours
            businessHours: {
                daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
                startTime: '08:00',
                endTime: '17:00'
            },

            // Events
            events: (fetchInfo, successCallback, failureCallback) => {
                successCallback(this.getFilteredEvents());
            }
        });

        this.calendar.render();
        this.updateCurrentMonthDisplay();
    }

    // Event Management
    loadEvents() {
        // Sample events data - in production, this would come from API
        this.events = [
            {
                id: '1',
                title: 'Họp Ban Chủ nhiệm',
                start: new Date().toISOString().split('T')[0] + 'T09:00:00',
                end: new Date().toISOString().split('T')[0] + 'T11:00:00',
                type: 'meeting',
                priority: 'high',
                location: 'Phòng 301, Tòa A2',
                description: 'Họp định kỳ ban chủ nhiệm các CLB',
                organizer: 'Ban CTSV',
                backgroundColor: '#3b82f6',
                borderColor: '#2563eb'
            },
            {
                id: '2',
                title: 'Workshop JavaScript',
                start: new Date().toISOString().split('T')[0] + 'T14:00:00',
                end: new Date().toISOString().split('T')[0] + 'T17:00:00',
                type: 'event',
                priority: 'normal',
                location: 'Lab B201',
                description: 'Workshop học JavaScript cơ bản cho thành viên mới',
                organizer: 'CLB CodeKing',
                backgroundColor: '#10b981',
                borderColor: '#059669'
            },
            {
                id: '3',
                title: 'Họp CLB Yume',
                start: new Date().toISOString().split('T')[0] + 'T16:30:00',
                end: new Date().toISOString().split('T')[0] + 'T18:00:00',
                type: 'meeting',
                priority: 'normal',
                location: 'Phòng 205, Tòa C1',
                description: 'Họp team thảo luận kế hoạch tháng tới',
                organizer: 'CLB Yume',
                backgroundColor: '#f59e0b',
                borderColor: '#d97706'
            },
            {
                id: '4',
                title: 'Hackathon 2025',
                start: this.getNextDate(1) + 'T08:00:00',
                end: this.getNextDate(1) + 'T18:00:00',
                type: 'event',
                priority: 'high',
                location: 'Trường Đại học',
                description: 'Cuộc thi lập trình Hackathon năm 2025',
                organizer: 'Ban tổ chức',
                backgroundColor: '#8b5cf6',
                borderColor: '#7c3aed'
            },
            {
                id: '5',
                title: 'Deadline Báo cáo tháng',
                start: this.getNextDate(4) + 'T23:59:00',
                type: 'deadline',
                priority: 'urgent',
                description: 'Hạn cuối nộp báo cáo hoạt động tháng của các CLB',
                organizer: 'Ban CTSV',
                backgroundColor: '#ef4444',
                borderColor: '#dc2626'
            },
            {
                id: '6',
                title: 'Tổng kết CLB CodeKing',
                start: this.getNextDate(7) + 'T19:00:00',
                end: this.getNextDate(7) + 'T21:00:00',
                type: 'meeting',
                priority: 'normal',
                location: 'Hội trường A',
                description: 'Buổi tổng kết và định hướng hoạt động CLB CodeKing',
                organizer: 'CLB CodeKing',
                backgroundColor: '#06b6d4',
                borderColor: '#0891b2'
            }
        ];

        if (this.calendar) {
            this.calendar.refetchEvents();
        }
    }

    getNextDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }

    getFilteredEvents() {
        let filtered = [...this.events];

        // Apply type filter
        if (this.filters.type !== 'all') {
            filtered = filtered.filter(event => event.type === this.filters.type);
        }

        // Apply other filters as needed
        return filtered;
    }

    // Event Handlers
    handleEventClick(info) {
        const event = info.event;
        this.showEventDetails({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            location: event.extendedProps.location,
            description: event.extendedProps.description,
            organizer: event.extendedProps.organizer,
            type: event.extendedProps.type,
            priority: event.extendedProps.priority
        });
    }

    handleDateClick(info) {
        this.showEventModal('event', info.date);
    }

    showEventDetails(eventData) {
        // Create and show event details modal
        console.log('Showing event details:', eventData.title);
        this.showNotification(`Chi tiết sự kiện: ${eventData.title}`, 'info');
    }

    showEventTooltip(info) {
        // Implementation for event tooltip on hover
        const tooltip = this.createTooltip(info.event);
        document.body.appendChild(tooltip);
    }

    hideEventTooltip() {
        const tooltip = document.querySelector('.event-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    createTooltip(event) {
        const tooltip = document.createElement('div');
        tooltip.className = 'event-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <h4>${event.title}</h4>
                <span class="tooltip-time">${this.formatEventTime(event)}</span>
            </div>
            <div class="tooltip-body">
                ${event.extendedProps.location ? `<p><i class="fas fa-map-marker-alt"></i> ${event.extendedProps.location}</p>` : ''}
                ${event.extendedProps.organizer ? `<p><i class="fas fa-user"></i> ${event.extendedProps.organizer}</p>` : ''}
                ${event.extendedProps.description ? `<p>${event.extendedProps.description}</p>` : ''}
            </div>
        `;
        return tooltip;
    }

    formatEventTime(event) {
        const start = new Date(event.start);
        const end = event.end ? new Date(event.end) : null;

        const timeFormat = { hour: '2-digit', minute: '2-digit' };

        if (end && start.toDateString() === end.toDateString()) {
            return `${start.toLocaleTimeString('vi-VN', timeFormat)} - ${end.toLocaleTimeString('vi-VN', timeFormat)}`;
        } else {
            return start.toLocaleTimeString('vi-VN', timeFormat);
        }
    }

    getEventClasses(arg) {
        const classes = ['calendar-event'];
        if (arg.event.extendedProps.type) {
            classes.push(`event-type-${arg.event.extendedProps.type}`);
        }
        if (arg.event.extendedProps.priority) {
            classes.push(`event-priority-${arg.event.extendedProps.priority}`);
        }
        return classes;
    }

    // Navigation
    navigateCalendar(direction) {
        if (!this.calendar) return;

        if (direction === 'prev') {
            this.calendar.prev();
        } else if (direction === 'next') {
            this.calendar.next();
        }

        this.updateCurrentMonthDisplay();
        this.showLoadingState();

        setTimeout(() => {
            this.hideLoadingState();
            this.showNotification('Lịch đã được cập nhật', 'success');
        }, 500);
    }

    goToToday() {
        if (!this.calendar) return;

        this.calendar.today();
        this.updateCurrentMonthDisplay();
        this.showNotification('Đã chuyển đến ngày hôm nay', 'info');
    }

    changeView(viewName, button) {
        if (!this.calendar) return;

        const viewMap = {
            'month': 'dayGridMonth',
            'week': 'timeGridWeek',
            'day': 'timeGridDay',
            'list': 'listWeek'
        };

        const fullCalendarView = viewMap[viewName] || 'dayGridMonth';

        this.calendar.changeView(fullCalendarView);
        this.currentView = fullCalendarView;

        // Update active button
        document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        this.updateCurrentMonthDisplay();
        this.showNotification(`Đã chuyển sang chế độ xem ${this.getViewDisplayName(viewName)}`, 'info');
    }

    getViewDisplayName(viewName) {
        const names = {
            'month': 'Tháng',
            'week': 'Tuần',
            'day': 'Ngày',
            'list': 'Danh sách'
        };
        return names[viewName] || 'Tháng';
    }

    updateCurrentMonthDisplay() {
        if (!this.calendar) return;

        const currentDate = this.calendar.getDate();
        const monthNames = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];

        const displayText = `${monthNames[currentDate.getMonth()]}, ${currentDate.getFullYear()}`;

        const monthDisplay = document.getElementById('currentMonth');
        if (monthDisplay) {
            monthDisplay.textContent = displayText;
        }
    }

    // Filter Management
    applyFilter(filterType, value) {
        this.filters[filterType] = value;

        if (this.calendar) {
            this.calendar.refetchEvents();
        }

        this.updateStats();
        this.renderTodayEvents();
        this.renderUpcomingEvents();

        this.showNotification(`Đã áp dụng bộ lọc: ${this.getFilterDisplayName(value)}`, 'info');
    }

    getFilterDisplayName(value) {
        const names = {
            'all': 'Tất cả sự kiện',
            'meeting': 'Họp/Gặp mặt',
            'event': 'Sự kiện CLB',
            'deadline': 'Deadline',
            'personal': 'Lịch cá nhân'
        };
        return names[value] || value;
    }

    // Stats Management
    updateStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayEvents = this.events.filter(event => event.start.startsWith(today));

        const weekStart = this.getWeekStart();
        const weekEnd = this.getWeekEnd();
        const weekEvents = this.events.filter(event => {
            const eventDate = event.start.split('T')[0];
            return eventDate >= weekStart && eventDate <= weekEnd;
        });

        const upcomingDeadlines = this.events.filter(event =>
            event.type === 'deadline' && new Date(event.start) > new Date()
        );

        // Update stats cards
        this.updateStatCard('today-events', todayEvents.length, '+2 so với hôm qua');
        this.updateStatCard('week-events', weekEvents.length, '-3 so với tuần trước');
        this.updateStatCard('upcoming-deadlines', upcomingDeadlines.length, 'Không đổi');
        this.updateStatCard('attendance-rate', '94.2%', '+1.2% so với tháng trước');
    }

    updateStatCard(cardClass, value, trend) {
        const card = document.querySelector(`.${cardClass}`);
        if (!card) return;

        const numberEl = card.querySelector('.stat-number');
        const trendEl = card.querySelector('.stat-trend span');

        if (numberEl) {
            numberEl.textContent = value;
        }
        if (trendEl) {
            trendEl.textContent = trend;
        }
    }

    getWeekStart() {
        const date = new Date();
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday
        const monday = new Date(date.setDate(diff));
        return monday.toISOString().split('T')[0];
    }

    getWeekEnd() {
        const date = new Date();
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? 0 : 7); // Sunday
        const sunday = new Date(date.setDate(diff));
        return sunday.toISOString().split('T')[0];
    }

    // Event Rendering
    renderTodayEvents() {
        const today = new Date().toISOString().split('T')[0];
        const todayEvents = this.events.filter(event => event.start.startsWith(today));

        const container = document.getElementById('todayEvents');
        if (!container) return;

        container.innerHTML = todayEvents.map(event => this.createEventHTML(event)).join('');
    }

    renderUpcomingEvents() {
        const upcomingEvents = this.events
            .filter(event => new Date(event.start) > new Date())
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 5);

        const container = document.getElementById('upcomingEvents');
        if (!container) return;

        container.innerHTML = upcomingEvents.map(event => this.createUpcomingEventHTML(event)).join('');
    }

    createEventHTML(event) {
        const startTime = new Date(event.start).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const priorityClass = event.priority === 'urgent' ? 'urgent' : '';

        return `
            <div class="event-item ${priorityClass}">
                <div class="event-time">${startTime}</div>
                <div class="event-details">
                    <h4>${event.title}</h4>
                    <p>${event.location || 'Chưa xác định địa điểm'}</p>
                    <div class="event-tags">
                        <span class="tag ${event.priority}">${this.getPriorityLabel(event.priority)}</span>
                        <span class="tag ${event.type}">${this.getTypeLabel(event.type)}</span>
                    </div>
                </div>
                <div class="event-actions">
                    <button class="btn-icon" onclick="calendarManager.editEvent('${event.id}')" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="calendarManager.deleteEvent('${event.id}')" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    createUpcomingEventHTML(event) {
        const eventDate = new Date(event.start);
        const day = eventDate.getDate();
        const month = eventDate.toLocaleDateString('vi-VN', { month: 'short' });

        return `
            <div class="event-item">
                <div class="event-date">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
                <div class="event-details">
                    <h4>${event.title}</h4>
                    <p>${this.formatUpcomingEventTime(event)}</p>
                    <div class="event-tags">
                        <span class="tag ${event.type}">${this.getTypeLabel(event.type)}</span>
                        <span class="tag ${event.priority}">${this.getPriorityLabel(event.priority)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    formatUpcomingEventTime(event) {
        if (event.type === 'deadline') {
            return `23:59 - ${event.description || 'Hạn cuối'}`;
        } else if (event.end) {
            const start = new Date(event.start).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            return `${start} - ${event.location || 'Chưa xác định'}`;
        } else {
            return event.location || 'Cả ngày';
        }
    }

    getPriorityLabel(priority) {
        const labels = {
            'low': 'Thấp',
            'normal': 'Bình thường',
            'high': 'Cao',
            'urgent': 'Khẩn cấp'
        };
        return labels[priority] || 'Bình thường';
    }

    getTypeLabel(type) {
        const labels = {
            'meeting': 'Họp',
            'event': 'Sự kiện',
            'deadline': 'Deadline',
            'personal': 'Cá nhân'
        };
        return labels[type] || 'Sự kiện';
    }

    // Modal Management
    showEventModal(type = 'event', date = null) {
        const modal = document.getElementById('eventModal');
        const form = document.getElementById('eventForm');

        if (!modal || !form) return;

        // Reset form
        form.reset();

        // Set default values
        if (date) {
            const dateStr = date.toISOString().split('T')[0];
            const timeStr = date.toTimeString().slice(0, 5);
            document.getElementById('eventDate').value = dateStr;
            document.getElementById('eventTime').value = timeStr;
        }

        if (type !== 'event') {
            document.getElementById('eventType').value = type;
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus first input
        setTimeout(() => {
            document.getElementById('eventTitle').focus();
        }, 100);
    }

    hideEventModal() {
        const modal = document.getElementById('eventModal');
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    saveEvent() {
        const form = document.getElementById('eventForm');
        if (!form) return;

        const formData = new FormData(form);
        const eventData = Object.fromEntries(formData);

        // Validate required fields
        if (!eventData.title || !eventData.date || !eventData.time) {
            this.showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }

        // Create new event
        const newEvent = {
            id: Date.now().toString(),
            title: eventData.title,
            start: `${eventData.date}T${eventData.time}:00`,
            end: eventData.duration ? this.calculateEndTime(eventData.date, eventData.time, eventData.duration) : null,
            type: eventData.type || 'event',
            priority: eventData.priority || 'normal',
            location: eventData.location || '',
            description: eventData.description || '',
            organizer: eventData.organizer || '',
            backgroundColor: this.getEventColor(eventData.type),
            borderColor: this.getEventBorderColor(eventData.type)
        };

        // Add to events array
        this.events.push(newEvent);

        // Refresh calendar
        if (this.calendar) {
            this.calendar.refetchEvents();
        }

        // Update displays
        this.updateStats();
        this.renderTodayEvents();
        this.renderUpcomingEvents();

        // Hide modal
        this.hideEventModal();

        // Show success message
        this.showNotification(`Đã thêm sự kiện: ${newEvent.title}`, 'success');
    }

    calculateEndTime(date, time, duration) {
        const startDateTime = new Date(`${date}T${time}:00`);
        const endDateTime = new Date(startDateTime.getTime() + (duration * 60000));
        return endDateTime.toISOString();
    }

    getEventColor(type) {
        const colors = {
            'meeting': '#3b82f6',
            'event': '#10b981',
            'deadline': '#ef4444',
            'personal': '#8b5cf6'
        };
        return colors[type] || '#6b7280';
    }

    getEventBorderColor(type) {
        const colors = {
            'meeting': '#2563eb',
            'event': '#059669',
            'deadline': '#dc2626',
            'personal': '#7c3aed'
        };
        return colors[type] || '#4b5563';
    }

    getEventTypeFromButton(button) {
        if (button.id.includes('Meeting')) return 'meeting';
        if (button.id.includes('Event')) return 'event';
        if (button.id.includes('Deadline')) return 'deadline';
        return 'event';
    }

    // Event CRUD Operations
    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Populate modal with event data
        this.showEventModal(event.type);

        // Fill form fields
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventType').value = event.type;
        document.getElementById('eventDate').value = event.start.split('T')[0];
        document.getElementById('eventTime').value = event.start.split('T')[1].slice(0, 5);
        document.getElementById('eventLocation').value = event.location || '';
        document.getElementById('eventDescription').value = event.description || '';
        document.getElementById('eventOrganizer').value = event.organizer || '';
        document.getElementById('eventPriority').value = event.priority || 'normal';

        // Update modal title
        document.getElementById('modalTitle').textContent = 'Chỉnh sửa sự kiện';

        // Store current event ID for updating
        this.editingEventId = eventId;
    }

    deleteEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        if (confirm(`Bạn có chắc chắn muốn xóa sự kiện "${event.title}"?`)) {
            // Remove from events array
            this.events = this.events.filter(e => e.id !== eventId);

            // Refresh calendar
            if (this.calendar) {
                this.calendar.refetchEvents();
            }

            // Update displays
            this.updateStats();
            this.renderTodayEvents();
            this.renderUpcomingEvents();

            this.showNotification(`Đã xóa sự kiện: ${event.title}`, 'success');
        }
    }

    // Utility Functions
    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
    }

    showUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.style.opacity = '1';
            dropdown.style.visibility = 'visible';
            dropdown.style.transform = 'translateY(0)';
        }
    }

    hideUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px)';
        }
    }

    syncCalendar() {
        this.showLoadingState();

        // Simulate API sync
        setTimeout(() => {
            this.loadEvents();
            this.updateStats();
            this.renderTodayEvents();
            this.renderUpcomingEvents();
            this.hideLoadingState();
            this.showNotification('Đã đồng bộ lịch thành công!', 'success');
        }, 2000);
    }

    handleSearch(query) {
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }

        // Filter events based on search query
        const results = this.events.filter(event =>
            event.title.toLowerCase().includes(query.toLowerCase()) ||
            (event.description && event.description.toLowerCase().includes(query.toLowerCase())) ||
            (event.location && event.location.toLowerCase().includes(query.toLowerCase()))
        );

        this.showSearchResults(results);
    }

    showSearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">Không tìm thấy sự kiện nào</div>';
        } else {
            searchResults.innerHTML = results.map(event => `
                <div class="search-result-item" onclick="calendarManager.goToEvent('${event.id}')">
                    <div class="search-result-title">${event.title}</div>
                    <div class="search-result-details">
                        ${new Date(event.start).toLocaleDateString('vi-VN')} - ${event.location || 'Chưa xác định địa điểm'}
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

    goToEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Navigate calendar to event date
        const eventDate = new Date(event.start);
        if (this.calendar) {
            this.calendar.gotoDate(eventDate);
        }

        // Hide search results
        this.hideSearchResults();

        // Clear search input
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.value = '';
        }

        this.showNotification(`Đã chuyển đến sự kiện: ${event.title}`, 'info');
    }

    handleKeyboardShortcuts(e) {
        // ESC key to close modals
        if (e.key === 'Escape') {
            this.hideEventModal();
            this.hideSearchResults();
        }

        // Ctrl/Cmd + N to add new event
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.showEventModal();
        }

        // Ctrl/Cmd + F to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('globalSearch');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Arrow keys for calendar navigation
        if (e.key === 'ArrowLeft' && e.ctrlKey) {
            e.preventDefault();
            this.navigateCalendar('prev');
        }
        if (e.key === 'ArrowRight' && e.ctrlKey) {
            e.preventDefault();
            this.navigateCalendar('next');
        }
    }

    handleResize() {
        if (this.calendar) {
            this.calendar.updateSize();
        }

        // Hide sidebar on mobile when resizing
        if (window.innerWidth <= 968) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                setTimeout(() => {
                    sidebar.classList.remove('active');
                }, 100);
            }
        }
    }

    showLoadingState() {
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach(card => card.classList.add('loading'));
    }

    hideLoadingState() {
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach(card => card.classList.remove('loading'));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calendarManager = new CalendarManager();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalendarManager;
}

console.log('📅 Calendar Modern Script loaded successfully!');
