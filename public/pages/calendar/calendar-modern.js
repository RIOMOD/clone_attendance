// Modern Calendar Manager - Dashboard Synchronized
class CalendarManager {
    // Track editing event
    editingEventId = null;
    constructor() {
        console.log('🏗️ CalendarManager constructor called');
        this.calendar = null;
        this.currentView = 'dayGridMonth';
        this.events = [];
        this.filters = {
            type: 'all',
            club: 'all',
            priority: 'all'
        };

        // Setup basic functionality immediately (synchronous only)
        this.setupEventListeners();

        console.log('✅ CalendarManager constructor completed');
    } async initialize() {
        await this.init();
    }

    async init() {
        console.log('🚀 Initializing Calendar Manager...');
        this.initializeCalendar();
        await this.loadEvents(); // Wait for events to load
        this.updateStats();
        this.renderTodayEvents();
        this.renderUpcomingEvents();
        this.setupNotificationSystem();
        this.setupGlobalSearch();
        this.setupKeyboardShortcuts();
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

        // Calendar controls
        const todayBtn = document.getElementById('todayBtn');
        const syncBtn = document.getElementById('syncBtn');
        const addEventBtn = document.getElementById('addEventBtn');

        if (todayBtn) todayBtn.addEventListener('click', () => this.goToToday());
        if (syncBtn) syncBtn.addEventListener('click', () => this.syncCalendar());
        if (addEventBtn) addEventBtn.addEventListener('click', () => this.showEventModal());

        // Filter control
        const calendarFilter = document.getElementById('calendarFilter');
        if (calendarFilter) {
            calendarFilter.addEventListener('change', (e) => this.applyFilter(e.target.value));
        }

        // Modal controls
        this.setupModalEventListeners();

        // Quick action buttons
        this.setupQuickActions();
    }

    setupModalEventListeners() {
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

        // Close modal on backdrop click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideEventModal();
                }
            });
        }
    }

    setupQuickActions() {
        // Add event action
        window.addEvent = () => this.showEventModal();

        // Import calendar action
        window.importCalendar = () => this.importCalendar();

        // Export calendar action
        window.exportCalendar = () => this.exportCalendar();

        // Sync calendar action
        window.syncCalendar = () => this.syncCalendar();
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

    // Initialize FullCalendar
    initializeCalendar() {
        const calendarEl = document.getElementById('calendar');
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
            events: this.events,
            eventClick: (info) => this.handleEventClick(info),
            dateClick: (info) => this.handleDateClick(info),
            eventDidMount: (info) => this.styleEvent(info),
            datesSet: () => this.updateStats()
        });

        this.calendar.render();
        console.log('✅ Calendar rendered successfully');
    }

    // Load sample events from JSON file or use embedded data
    async loadEvents() {
        try {
            // Try to load from JSON file first
            const response = await fetch('../../calendar_export_1756551450459.json');
            if (response.ok) {
                this.events = await response.json();
                console.log('✅ Events loaded from JSON file:', this.events.length);
            } else {
                throw new Error('Failed to load JSON file');
            }
        } catch (error) {
            console.warn('⚠️ Failed to load external JSON file:', error.message);
            console.log('🔄 Using embedded sample data instead');
            // Fallback to embedded data with many more events
            this.events = [
                {
                    id: '1',
                    title: 'Họp CLB Code King',
                    start: '2025-08-30T09:00:00',
                    end: '2025-08-30T11:00:00',
                    description: 'Họp định kỳ hàng tuần của CLB Code King',
                    location: 'Phòng 301',
                    type: 'meeting',
                    priority: 'high',
                    organizer: 'CLB Code King',
                    backgroundColor: '#2563eb'
                },
                {
                    id: '2',
                    title: 'Workshop React',
                    start: '2025-08-30T14:30:00',
                    end: '2025-08-30T17:00:00',
                    description: 'Workshop học React cho thành viên mới',
                    location: 'Lab 205',
                    type: 'workshop',
                    priority: 'medium',
                    organizer: 'CLB Code King',
                    backgroundColor: '#10b981'
                },
                {
                    id: '3',
                    title: 'Hackathon 2024',
                    start: '2025-08-31T08:00:00',
                    end: '2025-08-31T20:00:00',
                    description: 'Cuộc thi lập trình Hackathon 2024',
                    location: 'Hội trường A',
                    type: 'event',
                    priority: 'urgent',
                    organizer: 'Khoa CNTT',
                    backgroundColor: '#ef4444'
                },
                {
                    id: '4',
                    title: 'Seminar AI/ML',
                    start: '2025-09-02T13:30:00',
                    end: '2025-09-02T16:30:00',
                    description: 'Hội thảo về AI và Machine Learning',
                    location: 'Hội trường B',
                    type: 'seminar',
                    priority: 'high',
                    organizer: 'Khoa CNTT',
                    backgroundColor: '#f59e0b'
                },
                {
                    id: '5',
                    title: 'Báo cáo tiến độ',
                    start: '2025-08-30T16:00:00',
                    end: '2025-08-30T17:30:00',
                    description: 'Báo cáo tiến độ dự án',
                    location: 'Online',
                    type: 'meeting',
                    priority: 'medium',
                    organizer: 'Team Dev',
                    backgroundColor: '#06b6d4'
                },
                {
                    id: '6',
                    title: 'Họp CLB English Club',
                    start: '2025-09-01T08:00:00',
                    end: '2025-09-01T10:00:00',
                    description: 'Họp định kỳ CLB tiếng Anh, thảo luận kế hoạch hoạt động tháng 9',
                    location: 'Phòng 203',
                    type: 'meeting',
                    priority: 'medium',
                    organizer: 'CLB English Club',
                    backgroundColor: '#2563eb'
                },
                {
                    id: '7',
                    title: 'Workshop Git/GitHub',
                    start: '2025-09-01T14:00:00',
                    end: '2025-09-01T17:00:00',
                    description: 'Hướng dẫn sử dụng Git và GitHub cho người mới bắt đầu',
                    location: 'Lab 301',
                    type: 'workshop',
                    priority: 'high',
                    organizer: 'CLB Code King',
                    backgroundColor: '#10b981'
                },
                {
                    id: '8',
                    title: 'Buổi thuyết trình dự án cuối kỳ',
                    start: '2025-09-03T09:00:00',
                    end: '2025-09-03T12:00:00',
                    description: 'Các nhóm sinh viên thuyết trình dự án cuối kỳ môn Phát triển ứng dụng Web',
                    location: 'Hội trường C',
                    type: 'presentation',
                    priority: 'urgent',
                    organizer: 'Khoa CNTT',
                    backgroundColor: '#ef4444'
                },
                {
                    id: '9',
                    title: 'CLB Photography - Chụp ảnh outdoor',
                    start: '2025-09-03T15:30:00',
                    end: '2025-09-03T18:00:00',
                    description: 'Buổi chụp ảnh ngoại cảnh tại công viên Thống Nhất',
                    location: 'Công viên Thống Nhất',
                    type: 'activity',
                    priority: 'medium',
                    organizer: 'CLB Photography',
                    backgroundColor: '#8b5cf6'
                },
                {
                    id: '10',
                    title: 'Seminar Blockchain Technology',
                    start: '2025-09-04T10:00:00',
                    end: '2025-09-04T12:30:00',
                    description: 'Hội thảo về công nghệ Blockchain và ứng dụng trong thực tế',
                    location: 'Phòng hội thảo 401',
                    type: 'seminar',
                    priority: 'high',
                    organizer: 'Khoa CNTT',
                    backgroundColor: '#f59e0b'
                }
            ];
        }

        if (this.calendar) {
            this.calendar.removeAllEvents();
            this.calendar.addEventSource(this.events);
        }

        console.log('✅ Total events loaded:', this.events.length);
    }

    // Update statistics
    updateStats() {
        const today = new Date();
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

        // Count events
        const todayEvents = this.events.filter(event => {
            const eventDate = new Date(event.start);
            return this.isSameDay(eventDate, today);
        }).length;

        const weekEvents = this.events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate >= startOfWeek && eventDate <= endOfWeek;
        }).length;

        const upcomingDeadlines = this.events.filter(event => {
            const eventDate = new Date(event.start);
            return event.type === 'deadline' && eventDate >= today;
        }).length;

        // Calculate attendance rate (mock data)
        const attendanceRate = 87;

        // Update stat cards
        this.updateStatCard('todayEvents', todayEvents);
        this.updateStatCard('weekEvents', weekEvents);
        this.updateStatCard('upcomingDeadlines', upcomingDeadlines);
        this.updateStatCard('attendanceRate', attendanceRate + '%');
    }

    updateStatCard(statKey, value) {
        const statCard = document.querySelector(`[data-stat="${statKey}"] .stat-info h3`);
        if (statCard) {
            statCard.textContent = value;
        }
    }

    // Render today's events
    renderTodayEvents() {
        const today = new Date();
        const todayEvents = this.events.filter(event => {
            const eventDate = new Date(event.start);
            return this.isSameDay(eventDate, today);
        });

        const eventListContainer = document.querySelector('.events-sidebar .section-card .event-list');
        if (!eventListContainer) return;

        eventListContainer.innerHTML = '';

        todayEvents.forEach(event => {
            const eventStart = new Date(event.start);
            const timeStr = eventStart.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });

            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.innerHTML = `
                <div class="event-time">${timeStr}</div>
                <div class="event-info">
                    <div class="event-title">${event.title}</div>
                    <div class="event-location">
                        <i class="fas ${event.location === 'Online' ? 'fa-video' : 'fa-map-marker-alt'}"></i>
                        ${event.location}
                    </div>
                </div>
                <div class="event-status pending">
                    <i class="fas fa-clock"></i>
                </div>
            `;

            eventElement.addEventListener('click', () => this.viewEvent(event.id));
            eventListContainer.appendChild(eventElement);
        });

        // Update today events count badge
        const badge = document.querySelector('.events-sidebar .section-card .badge');
        if (badge) {
            badge.textContent = todayEvents.length;
        }
    }

    // Render upcoming events
    renderUpcomingEvents() {
        const today = new Date();
        const upcomingEvents = this.events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate > today;
        }).sort((a, b) => new Date(a.start) - new Date(b.start)).slice(0, 5);

        const upcomingContainer = document.querySelectorAll('.events-sidebar .section-card')[1];
        if (!upcomingContainer) return;

        const eventList = upcomingContainer.querySelector('.event-list');
        if (!eventList) return;

        eventList.innerHTML = '';

        upcomingEvents.forEach(event => {
            const eventDate = new Date(event.start);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleString('vi-VN', { month: 'short' });

            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.innerHTML = `
                <div class="event-date">
                    <div class="date-number">${day}</div>
                    <div class="date-month">${month}</div>
                </div>
                <div class="event-info">
                    <div class="event-title">${event.title}</div>
                    <div class="event-meta">
                        <span class="event-type">${this.getEventTypeLabel(event.type)}</span>
                        <span class="event-participants">
                            <i class="fas fa-users"></i>
                            ${this.getRandomParticipants()} người
                        </span>
                    </div>
                </div>
            `;

            eventElement.addEventListener('click', () => this.viewEvent(event.id));
            eventList.appendChild(eventElement);
        });
    }

    // Helper methods
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    getEventTypeLabel(type) {
        const labels = {
            'meeting': 'Cuộc họp',
            'workshop': 'Workshop',
            'event': 'Sự kiện',
            'seminar': 'Hội thảo',
            'deadline': 'Deadline'
        };
        return labels[type] || 'Khác';
    }

    getRandomParticipants() {
        return Math.floor(Math.random() * 150) + 10;
    }

    // Calendar navigation
    goToToday() {
        if (this.calendar) {
            this.calendar.today();
            this.updateStats();
        }
    }

    // Apply filters
    applyFilter(filterValue) {
        this.filters.type = filterValue;

        if (this.calendar) {
            let filteredEvents = this.events;

            if (filterValue !== 'all') {
                filteredEvents = this.events.filter(event => event.type === filterValue);
            }

            this.calendar.removeAllEvents();
            this.calendar.addEventSource(filteredEvents);
        }
    }

    // Event modal management
    showEventModal(eventData = null) {
        const modal = document.getElementById('eventModal');
        if (!modal) return;

        // Reset form
        const form = document.getElementById('eventForm');
        if (form) {
            form.reset();
        }

        if (eventData) {
            this.editingEventId = eventData.id;
            this.populateEventForm(eventData);
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa sự kiện';
        } else {
            this.editingEventId = null;
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-calendar-plus"></i> Thêm sự kiện mới';
        }

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    hideEventModal() {
        const modal = document.getElementById('eventModal');
        if (!modal) return;

        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    // Save event (add or edit)
    saveEvent() {
        const form = document.getElementById('eventForm');
        if (!form) return;

        const dateValue = form.elements['date'].value;
        const timeValue = form.elements['time'].value;
        const titleValue = form.elements['title'].value;
        const descriptionValue = form.elements['description'].value;
        const locationValue = form.elements['location'].value;
        const typeValue = form.elements['type'].value;
        const priorityValue = form.elements['priority'].value;
        const organizerValue = form.elements['organizer'].value;
        const durationValue = form.elements['duration'].value;

        // Validate required fields
        if (!titleValue || !dateValue || !timeValue || !typeValue) {
            this.showNotification('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
            return;
        }

        // If editing, update existing event
        if (this.editingEventId) {
            const idx = this.events.findIndex(ev => ev.id === this.editingEventId);
            if (idx !== -1) {
                // Update event object
                const updatedEvent = {
                    ...this.events[idx],
                    title: titleValue,
                    start: `${dateValue}T${timeValue}:00`,
                    description: descriptionValue || '',
                    location: locationValue || '',
                    type: typeValue,
                    priority: priorityValue || 'medium',
                    organizer: organizerValue || 'Không xác định',
                    backgroundColor: this.getPriorityColor(priorityValue || 'medium')
                };
                // Add duration if specified
                if (durationValue && !isNaN(parseInt(durationValue))) {
                    const startDate = new Date(updatedEvent.start);
                    const endDate = new Date(startDate.getTime() + (parseInt(durationValue) * 60000));
                    updatedEvent.end = endDate.toISOString().slice(0, 19);
                } else {
                    updatedEvent.end = undefined;
                }
                this.events[idx] = updatedEvent;

                // Update event in FullCalendar
                if (this.calendar) {
                    const calEvent = this.calendar.getEventById(this.editingEventId);
                    if (calEvent) {
                        calEvent.setProp('title', updatedEvent.title);
                        calEvent.setStart(updatedEvent.start);
                        if (updatedEvent.end) {
                            calEvent.setEnd(updatedEvent.end);
                        } else {
                            calEvent.setEnd(null);
                        }
                        calEvent.setExtendedProp('description', updatedEvent.description);
                        calEvent.setExtendedProp('location', updatedEvent.location);
                        calEvent.setExtendedProp('type', updatedEvent.type);
                        calEvent.setExtendedProp('priority', updatedEvent.priority);
                        calEvent.setExtendedProp('organizer', updatedEvent.organizer);
                        calEvent.setProp('backgroundColor', updatedEvent.backgroundColor);
                    }
                }

                // Update displays
                this.updateStats();
                this.renderTodayEvents();
                this.renderUpcomingEvents();

                // Hide modal
                this.hideEventModal();

                // Show success notification
                this.showNotification('Sự kiện đã được cập nhật!', 'success');
                this.editingEventId = null;
                return;
            }
        }

        // Otherwise, add new event
        const eventData = {
            id: Date.now().toString(),
            title: titleValue,
            start: `${dateValue}T${timeValue}:00`,
            description: descriptionValue || '',
            location: locationValue || '',
            type: typeValue,
            priority: priorityValue || 'medium',
            organizer: organizerValue || 'Không xác định',
            backgroundColor: this.getPriorityColor(priorityValue || 'medium')
        };

        // Add duration if specified
        if (durationValue && !isNaN(parseInt(durationValue))) {
            const startDate = new Date(eventData.start);
            const endDate = new Date(startDate.getTime() + (parseInt(durationValue) * 60000));
            eventData.end = endDate.toISOString().slice(0, 19);
        }

        // Add to events array
        this.events.push(eventData);

        // Add to calendar
        if (this.calendar) {
            this.calendar.addEvent(eventData);
        }

        // Update displays
        this.updateStats();
        this.renderTodayEvents();
        this.renderUpcomingEvents();

        // Hide modal
        this.hideEventModal();

        // Show success notification
        this.showNotification('Sự kiện đã được thêm thành công!', 'success');

        console.log('✅ Event saved:', eventData);
    }
    // Populate form fields for editing
    populateEventForm(eventData) {
        const form = document.getElementById('eventForm');
        if (!form) return;
        form.reset();
        form.elements['title'].value = eventData.title || '';
        if (eventData.start) {
            const dt = new Date(eventData.start);
            form.elements['date'].value = dt.toISOString().slice(0, 10);
            form.elements['time'].value = dt.toTimeString().slice(0, 5);
        }
        form.elements['type'].value = eventData.type || '';
        form.elements['priority'].value = eventData.priority || 'medium';
        form.elements['location'].value = eventData.location || '';
        form.elements['description'].value = eventData.description || '';
        form.elements['organizer'].value = eventData.organizer || '';
        // Duration: calculate from start/end if available
        if (eventData.start && eventData.end) {
            const start = new Date(eventData.start);
            const end = new Date(eventData.end);
            const duration = Math.round((end - start) / 60000);
            form.elements['duration'].value = duration;
        } else {
            form.elements['duration'].value = 60;
        }
        // Reminder checkbox (default checked)
        if (form.elements['reminder']) {
            form.elements['reminder'].checked = true;
        }
    }

    getPriorityColor(priority) {
        const colors = {
            'urgent': '#ef4444',
            'high': '#f59e0b',
            'medium': '#06b6d4',
            'low': '#10b981'
        };
        return colors[priority] || '#6366f1';
    }

    // Calendar actions
    syncCalendar() {
        this.showNotification('Đang đồng bộ lịch...', 'info');

        // Simulate sync delay
        setTimeout(() => {
            this.loadEvents();
            this.showNotification('Đồng bộ lịch thành công!', 'success');
        }, 1500);
    }

    importCalendar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.ics,.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.showNotification(`Đang import file: ${file.name}`, 'info');
                // Simulate import
                setTimeout(() => {
                    this.showNotification('Import lịch thành công!', 'success');
                }, 2000);
            }
        };
        input.click();
    }

    exportCalendar() {
        const data = JSON.stringify(this.events, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `calendar_export_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Xuất lịch thành công!', 'success');
    }

    // Event handlers
    handleEventClick(info) {
        const event = info.event;
        const eventData = {
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            description: event.extendedProps.description,
            location: event.extendedProps.location,
            type: event.extendedProps.type,
            priority: event.extendedProps.priority,
            organizer: event.extendedProps.organizer
        };

        this.viewEventDetails(eventData);
    }

    handleDateClick(info) {
        // Set date in form and show modal
        document.getElementById('eventDate').value = info.dateStr;
        this.showEventModal();
    }

    viewEventDetails(eventData) {
        // Create and show event details modal
        const detailsModal = this.createEventDetailsModal(eventData);
        document.body.appendChild(detailsModal);
    }

    createEventDetailsModal(eventData) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-calendar-alt"></i> Chi tiết sự kiện</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <h4>${eventData.title}</h4>
                    <p><strong>Thời gian:</strong> ${new Date(eventData.start).toLocaleString('vi-VN')}</p>
                    <p><strong>Địa điểm:</strong> ${eventData.location}</p>
                    <p><strong>Người tổ chức:</strong> ${eventData.organizer}</p>
                    <p><strong>Mô tả:</strong> ${eventData.description}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary close-btn">Đóng</button>
                    <button class="btn-primary edit-btn">Chỉnh sửa</button>
                </div>
            </div>
        `;

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.edit-btn').addEventListener('click', () => {
            modal.remove();
            this.showEventModal(eventData);
        });

        return modal;
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Add to container or create one
        let container = document.getElementById('notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications';
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Auto remove after 5 seconds
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

    styleEvent(info) {
        const priority = info.event.extendedProps.priority;
        if (priority) {
            info.el.classList.add(`priority-${priority}`);
        }
    }

    // Additional utility methods for enhanced functionality
    setupNotificationSystem() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notifications')) {
            const container = document.createElement('div');
            container.id = 'notifications';
            container.className = 'notifications-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 350px;
            `;
            document.body.appendChild(container);
        }
    }

    // Enhanced search functionality
    setupGlobalSearch() {
        const searchInput = document.getElementById('globalSearch');
        const searchResults = document.getElementById('searchResults');

        if (searchInput && searchResults) {
            let searchTimeout;

            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });

            // Close results when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                    searchResults.style.display = 'none';
                }
            });
        }
    }

    performSearch(query) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults || !query.trim()) {
            searchResults.style.display = 'none';
            return;
        }

        const results = this.events.filter(event =>
            event.title.toLowerCase().includes(query.toLowerCase()) ||
            event.description?.toLowerCase().includes(query.toLowerCase()) ||
            event.location?.toLowerCase().includes(query.toLowerCase()) ||
            event.organizer?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5); // Limit to 5 results

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">Không tìm thấy kết quả</div>';
        } else {
            searchResults.innerHTML = results.map(event => `
                <div class="search-result-item" data-event-id="${event.id}">
                    <div class="search-result-title">${event.title}</div>
                    <div class="search-result-meta">
                        <span>${new Date(event.start).toLocaleDateString('vi-VN')}</span>
                        <span>${event.location}</span>
                    </div>
                </div>
            `).join('');

            // Add click handlers for search results
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const eventId = item.dataset.eventId;
                    this.goToEvent(eventId);
                    searchResults.style.display = 'none';
                    document.getElementById('globalSearch').value = '';
                });
            });
        }

        searchResults.style.display = 'block';
    }

    goToEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event && this.calendar) {
            const eventDate = new Date(event.start);
            this.calendar.gotoDate(eventDate);

            // Highlight the event briefly
            setTimeout(() => {
                const eventEl = document.querySelector(`[data-event-id="${eventId}"]`);
                if (eventEl) {
                    eventEl.style.animation = 'pulse 2s';
                    setTimeout(() => {
                        eventEl.style.animation = '';
                    }, 2000);
                }
            }, 100);

            this.showNotification(`Đã chuyển đến sự kiện: ${event.title}`, 'info');
        }
    }

    // Export functionality with better formatting
    exportToICS() {
        let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Calendar//Calendar//EN\n';

        this.events.forEach(event => {
            const startDate = new Date(event.start);
            const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 3600000); // 1 hour default

            icsContent += 'BEGIN:VEVENT\n';
            icsContent += `UID:${event.id}@calendar.ctsv.edu.vn\n`;
            icsContent += `DTSTART:${this.formatDateForICS(startDate)}\n`;
            icsContent += `DTEND:${this.formatDateForICS(endDate)}\n`;
            icsContent += `SUMMARY:${event.title}\n`;
            icsContent += `DESCRIPTION:${event.description || ''}\n`;
            icsContent += `LOCATION:${event.location || ''}\n`;
            icsContent += `ORGANIZER:${event.organizer || ''}\n`;
            icsContent += 'END:VEVENT\n';
        });

        icsContent += 'END:VCALENDAR';

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `calendar_${new Date().toISOString().slice(0, 10)}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Xuất lịch ICS thành công!', 'success');
    }

    formatDateForICS(date) {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N: New event
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.showEventModal();
            }

            // Ctrl/Cmd + T: Go to today
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.goToToday();
            }

            // Ctrl/Cmd + S: Sync calendar
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.syncCalendar();
            }

            // Escape: Close modal
            if (e.key === 'Escape') {
                this.hideEventModal();
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing Calendar Manager...');
    window.calendarManager = new CalendarManager();
    window.calendarManager.initialize(); // Call initialize after creation
});

console.log('📅 Calendar Modern JS loaded successfully!');
