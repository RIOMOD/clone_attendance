// Club Events Enhanced JavaScript - Modern Management System
class EventsManager {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentView = 'list'; // 'list' or 'calendar'
        this.currentFilters = {
            period: 'this-week',
            club: '',
            status: '',
            type: '',
            location: '',
            capacity: ''
        };
        this.currentEvent = null;
        this.init();
    }

    init() {
        this.loadEvents();
        this.attachEventListeners();
        this.setupDashboard();
        this.initializeCharts();
        console.log('Events Manager initialized');
    }

    // Dashboard Setup
    setupDashboard() {
        this.updateStats();
        this.setupSearch();
        this.setupFilters();
        this.setupUserMenu();
        this.setupMobileMenu();
        this.setupViewToggle();
    }

    // Event Listeners
    attachEventListeners() {
        // Controls
        document.getElementById('refreshEvents')?.addEventListener('click', () => this.refreshEvents());
        document.getElementById('eventsFilter')?.addEventListener('click', () => this.toggleFilters());
        document.getElementById('eventsSort')?.addEventListener('click', () => this.toggleSort());
        document.getElementById('refreshEventsList')?.addEventListener('click', () => this.refreshEventsList());

        // View toggles
        document.getElementById('calendarView')?.addEventListener('click', () => this.switchView('calendar'));
        document.getElementById('listView')?.addEventListener('click', () => this.switchView('list'));

        // Export buttons
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.exportData(e.target.dataset.type));
        });

        // Filter selectors
        document.getElementById('eventPeriod')?.addEventListener('change', (e) => this.filterByPeriod(e.target.value));
        document.getElementById('clubFilter')?.addEventListener('change', (e) => this.filterByClub(e.target.value));
        document.getElementById('statusFilter')?.addEventListener('change', (e) => this.filterByStatus(e.target.value));
        document.getElementById('eventTypeFilter')?.addEventListener('change', (e) => this.filterByType(e.target.value));
        document.getElementById('locationFilter')?.addEventListener('change', (e) => this.filterByLocation(e.target.value));
        document.getElementById('capacityFilter')?.addEventListener('change', (e) => this.filterByCapacity(e.target.value));

        // Header actions
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('quickAdd')?.addEventListener('click', () => this.openCreateEventModal());
        document.getElementById('notificationBtn')?.addEventListener('click', () => this.showNotifications());
        document.getElementById('messageBtn')?.addEventListener('click', () => this.showMessages());
        document.getElementById('settingsBtn')?.addEventListener('click', () => this.openSettings());

        // Stat cards click events
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleStatCardClick(e.currentTarget));
        });

        // Calendar navigation
        document.getElementById('prevMonth')?.addEventListener('click', () => this.navigateCalendar(-1));
        document.getElementById('nextMonth')?.addEventListener('click', () => this.navigateCalendar(1));

        // Form submission
        document.getElementById('createEventForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateEvent(e.target);
        });
    }

    // Load Events Data
    loadEvents() {
        // Mock data - trong thực tế sẽ load từ API
        this.events = [
            {
                id: 'evt1',
                title: 'Workshop React Advanced',
                club: 'CLB Công nghệ',
                description: 'Học hỏi các kỹ thuật nâng cao trong React: Hooks, Context API, Performance Optimization',
                startDate: '2024-12-25',
                startTime: '14:00',
                endDate: '2024-12-25',
                endTime: '17:00',
                location: 'Phòng 301, Tòa C1',
                type: 'workshop',
                status: 'upcoming',
                capacity: 60,
                registered: 45,
                tags: ['workshop', 'technology'],
                image: '../../assets/images/imageCLB/event1.jpg'
            },
            {
                id: 'evt2',
                title: 'Giải bóng đá CTSV Cup',
                club: 'CLB Thể thao',
                description: 'Giải bóng đá thường niên của CTSV với sự tham gia của các CLB và lớp học',
                startDate: '2024-12-20',
                startTime: '08:00',
                endDate: '2024-12-22',
                endTime: '18:00',
                location: 'Sân bóng CTSV',
                type: 'competition',
                status: 'ongoing',
                capacity: 320,
                registered: 320,
                tags: ['competition', 'sport'],
                image: '../../assets/images/imageCLB/event2.jpg'
            },
            {
                id: 'evt3',
                title: 'Đêm nhạc "Những Khúc Hát Tuổi Trẻ"',
                club: 'CLB Nghệ thuật',
                description: 'Đêm nhạc đầy cảm xúc với sự tham gia của các nghệ sĩ trẻ và sinh viên CTSV',
                startDate: '2024-12-15',
                startTime: '19:00',
                endDate: '2024-12-15',
                endTime: '21:30',
                location: 'Hội trường A',
                type: 'social',
                status: 'completed',
                capacity: 500,
                registered: 500,
                rating: 4.8,
                ratingCount: 124,
                tags: ['social', 'art'],
                image: '../../assets/images/imageCLB/event3.jpg'
            },
            {
                id: 'evt4',
                title: 'Hội thảo "Khởi nghiệp trong kỷ nguyên số"',
                club: 'CLB Kinh doanh',
                description: 'Chia sẻ kinh nghiệm khởi nghiệp từ các doanh nhân thành công',
                startDate: '2024-12-28',
                startTime: '09:00',
                endDate: '2024-12-28',
                endTime: '12:00',
                location: 'Hội trường B',
                type: 'seminar',
                status: 'upcoming',
                capacity: 200,
                registered: 89,
                tags: ['seminar', 'business'],
                image: '../../assets/images/imageCLB/event4.jpg'
            },
            {
                id: 'evt5',
                title: 'Chương trình tình nguyện "Mùa đông ấm áp"',
                club: 'CLB Tình nguyện',
                description: 'Hoạt động từ thiện mang đến niềm vui cho trẻ em vùng cao trong mùa đông',
                startDate: '2024-12-30',
                startTime: '06:00',
                endDate: '2025-01-02',
                endTime: '18:00',
                location: 'Vùng cao Sapa',
                type: 'volunteer',
                status: 'upcoming',
                capacity: 50,
                registered: 38,
                tags: ['volunteer', 'charity'],
                image: '../../assets/images/imageCLB/event5.jpg'
            }
        ];

        this.filteredEvents = [...this.events];
        this.renderEvents();
    }

    // Search Functionality
    setupSearch() {
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchEvents(e.target.value);
                }, 300);
            });
        }
    }

    searchEvents(query) {
        if (!query.trim()) {
            this.filteredEvents = [...this.events];
        } else {
            const lowercaseQuery = query.toLowerCase();
            this.filteredEvents = this.events.filter(event =>
                event.title.toLowerCase().includes(lowercaseQuery) ||
                event.club.toLowerCase().includes(lowercaseQuery) ||
                event.description.toLowerCase().includes(lowercaseQuery) ||
                event.location.toLowerCase().includes(lowercaseQuery) ||
                event.type.toLowerCase().includes(lowercaseQuery)
            );
        }

        this.renderEvents();
        this.updateStats();
    }

    // Filter Functions
    setupFilters() {
        const filtersSection = document.getElementById('eventsFilterSection');
        if (filtersSection) {
            filtersSection.style.display = 'none';
        }
    }

    toggleFilters() {
        const filtersSection = document.getElementById('eventsFilterSection');
        if (filtersSection) {
            const isVisible = filtersSection.style.display !== 'none';
            filtersSection.style.display = isVisible ? 'none' : 'block';

            // Update filter button icon
            const filterBtn = document.getElementById('eventsFilter');
            if (filterBtn) {
                const icon = filterBtn.querySelector('i');
                icon.className = isVisible ? 'fas fa-filter' : 'fas fa-filter-circle-xmark';
            }
        }
    }

    toggleSort() {
        // Toggle between different sort orders
        const sortOptions = ['date-asc', 'date-desc', 'title', 'club'];
        const currentSort = this.currentSort || 'date-asc';
        const currentIndex = sortOptions.indexOf(currentSort);
        const nextIndex = (currentIndex + 1) % sortOptions.length;

        this.currentSort = sortOptions[nextIndex];
        this.sortEvents(this.currentSort);

        this.showNotification(`Sắp xếp theo: ${this.getSortLabel(this.currentSort)}`, 'info');
    }

    getSortLabel(sortType) {
        const labels = {
            'date-asc': 'Ngày tăng dần',
            'date-desc': 'Ngày giảm dần',
            'title': 'Tên sự kiện',
            'club': 'Câu lạc bộ'
        };
        return labels[sortType] || 'Mặc định';
    }

    sortEvents(sortType) {
        switch (sortType) {
            case 'date-asc':
                this.filteredEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                break;
            case 'date-desc':
                this.filteredEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
                break;
            case 'title':
                this.filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'club':
                this.filteredEvents.sort((a, b) => a.club.localeCompare(b.club));
                break;
        }
        this.renderEvents();
    }

    filterByPeriod(period) {
        this.currentFilters.period = period;
        this.applyFilters();
    }

    filterByClub(club) {
        this.currentFilters.club = club;
        this.applyFilters();
    }

    filterByStatus(status) {
        this.currentFilters.status = status;
        this.applyFilters();
    }

    filterByType(type) {
        this.currentFilters.type = type;
        this.applyFilters();
    }

    filterByLocation(location) {
        this.currentFilters.location = location;
        this.applyFilters();
    }

    filterByCapacity(capacity) {
        this.currentFilters.capacity = capacity;
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.events];

        // Apply period filter
        if (this.currentFilters.period && this.currentFilters.period !== 'all') {
            const now = new Date();
            filtered = filtered.filter(event => {
                const eventDate = new Date(event.startDate);
                switch (this.currentFilters.period) {
                    case 'this-week':
                        const weekStart = new Date(now);
                        weekStart.setDate(now.getDate() - now.getDay());
                        const weekEnd = new Date(weekStart);
                        weekEnd.setDate(weekStart.getDate() + 6);
                        return eventDate >= weekStart && eventDate <= weekEnd;
                    case 'this-month':
                        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                    case 'upcoming':
                        return eventDate >= now;
                    case 'past':
                        return eventDate < now;
                    default:
                        return true;
                }
            });
        }

        // Apply other filters
        if (this.currentFilters.club) {
            filtered = filtered.filter(event =>
                event.club.toLowerCase().includes(this.currentFilters.club.toLowerCase())
            );
        }

        if (this.currentFilters.status) {
            filtered = filtered.filter(event => event.status === this.currentFilters.status);
        }

        if (this.currentFilters.type) {
            filtered = filtered.filter(event => event.type === this.currentFilters.type);
        }

        if (this.currentFilters.location) {
            const locationMap = {
                'campus': () => event => !event.location.toLowerCase().includes('online') && !event.location.toLowerCase().includes('trực tuyến'),
                'outside': () => event => !event.location.toLowerCase().includes('phòng') && !event.location.toLowerCase().includes('tòa'),
                'online': () => event => event.location.toLowerCase().includes('online') || event.location.toLowerCase().includes('trực tuyến'),
                'hybrid': () => event => event.location.toLowerCase().includes('kết hợp') || event.location.toLowerCase().includes('hybrid')
            };

            const filterFunc = locationMap[this.currentFilters.location];
            if (filterFunc) {
                filtered = filtered.filter(filterFunc());
            }
        }

        if (this.currentFilters.capacity) {
            filtered = filtered.filter(event => {
                switch (this.currentFilters.capacity) {
                    case 'small':
                        return event.capacity < 50;
                    case 'medium':
                        return event.capacity >= 50 && event.capacity <= 200;
                    case 'large':
                        return event.capacity > 200;
                    default:
                        return true;
                }
            });
        }

        this.filteredEvents = filtered;
        this.renderEvents();
        this.updateStats();
    }

    // View Management
    setupViewToggle() {
        this.switchView('list'); // Default to list view
    }

    switchView(viewType) {
        this.currentView = viewType;

        const listView = document.getElementById('listViewContainer');
        const calendarView = document.getElementById('calendarViewContainer');
        const listBtn = document.getElementById('listView');
        const calendarBtn = document.getElementById('calendarView');

        if (viewType === 'list') {
            listView.style.display = 'block';
            calendarView.style.display = 'none';
            listBtn.classList.add('active');
            calendarBtn.classList.remove('active');
        } else {
            listView.style.display = 'none';
            calendarView.style.display = 'block';
            listBtn.classList.remove('active');
            calendarBtn.classList.add('active');
            this.renderCalendar();
        }
    }

    // Render Events
    renderEvents() {
        if (this.currentView === 'list') {
            this.renderEventsList();
        } else {
            this.renderCalendar();
        }
    }

    renderEventsList() {
        const eventsGrid = document.getElementById('eventsGrid');
        if (!eventsGrid) return;

        if (this.filteredEvents.length === 0) {
            eventsGrid.innerHTML = `
                <div class="no-events" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                    <i class="fas fa-calendar-times" style="font-size: 4rem; color: #ddd; margin-bottom: 1rem;"></i>
                    <h3 style="margin: 0.5rem 0; color: #999;">Không tìm thấy sự kiện</h3>
                    <p style="margin: 0;">Thử điều chỉnh bộ lọc hoặc tạo sự kiện mới</p>
                </div>
            `;
            return;
        }

        eventsGrid.innerHTML = this.filteredEvents.map(event => this.createEventCard(event)).join('');
    }

    createEventCard(event) {
        const eventDate = new Date(event.startDate);
        const day = eventDate.getDate();
        const month = eventDate.toLocaleDateString('vi-VN', { month: 'short' }).toUpperCase();

        const startDate = new Date(`${event.startDate}T${event.startTime}`);
        const endDate = new Date(`${event.endDate}T${event.endTime}`);
        const timeRange = `${startDate.toLocaleDateString('vi-VN')}, ${event.startTime} - ${event.endTime}`;

        const participationRate = event.capacity ? Math.round((event.registered / event.capacity) * 100) : 0;

        const statusInfo = {
            upcoming: { icon: 'clock', text: 'Sắp diễn ra' },
            ongoing: { icon: 'play', text: 'Đang diễn ra' },
            completed: { icon: 'check-circle', text: 'Đã hoàn thành' },
            cancelled: { icon: 'times-circle', text: 'Đã hủy' }
        };

        const status = statusInfo[event.status] || statusInfo.upcoming;

        const tags = event.tags.map(tag => `<span class="tag ${tag}">${this.getTagLabel(tag)}</span>`).join('');

        const ratingSection = event.rating ? `
            <div class="event-rating">
                <div class="rating-stars">
                    ${this.generateStars(event.rating)}
                </div>
                <span class="rating-score">${event.rating}/5.0</span>
                <span class="rating-count">(${event.ratingCount} đánh giá)</span>
            </div>
        ` : '';

        return `
            <div class="event-card ${event.status}">
                <div class="event-header">
                    <div class="event-date">
                        <div class="date-day">${day}</div>
                        <div class="date-month">${month}</div>
                    </div>
                    <div class="event-status ${event.status}">
                        <i class="fas fa-${status.icon}"></i>
                        <span>${status.text}</span>
                    </div>
                </div>

                <div class="event-content">
                    <div class="event-club">
                        <i class="fas fa-users"></i>
                        <span>${event.club}</span>
                    </div>
                    <h4 class="event-title">${event.title}</h4>
                    <p class="event-description">${event.description}</p>

                    <div class="event-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${timeRange}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-users"></i>
                            <span>${event.registered}${event.capacity ? `/${event.capacity}` : ''} người tham gia</span>
                        </div>
                    </div>

                    <div class="event-tags">
                        ${tags}
                    </div>
                    
                    ${ratingSection}
                </div>

                <div class="event-actions">
                    ${this.createEventActions(event)}
                </div>
            </div>
        `;
    }

    createEventActions(event) {
        const commonActions = `
            <button class="btn-action view" onclick="eventsManager.viewEvent('${event.id}')" title="Xem chi tiết">
                <i class="fas fa-eye"></i>
            </button>
        `;

        switch (event.status) {
            case 'upcoming':
                return `
                    ${commonActions}
                    <button class="btn-action edit" onclick="eventsManager.editEvent('${event.id}')" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action participants" onclick="eventsManager.manageParticipants('${event.id}')" title="Quản lý tham gia">
                        <i class="fas fa-user-friends"></i>
                    </button>
                    <button class="btn-action share" onclick="eventsManager.shareEvent('${event.id}')" title="Chia sẻ">
                        <i class="fas fa-share-alt"></i>
                    </button>
                `;

            case 'ongoing':
                return `
                    ${commonActions}
                    <button class="btn-action live" onclick="eventsManager.goLive('${event.id}')" title="Theo dõi trực tiếp">
                        <i class="fas fa-broadcast-tower"></i>
                    </button>
                    <button class="btn-action participants" onclick="eventsManager.manageParticipants('${event.id}')" title="Quản lý tham gia">
                        <i class="fas fa-user-friends"></i>
                    </button>
                    <button class="btn-action share" onclick="eventsManager.shareEvent('${event.id}')" title="Chia sẻ">
                        <i class="fas fa-share-alt"></i>
                    </button>
                `;

            case 'completed':
                return `
                    ${commonActions}
                    <button class="btn-action report" onclick="eventsManager.viewReport('${event.id}')" title="Xem báo cáo">
                        <i class="fas fa-chart-line"></i>
                    </button>
                    <button class="btn-action feedback" onclick="eventsManager.viewFeedback('${event.id}')" title="Phản hồi">
                        <i class="fas fa-comments"></i>
                    </button>
                    <button class="btn-action copy" onclick="eventsManager.duplicateEvent('${event.id}')" title="Tạo bản sao">
                        <i class="fas fa-copy"></i>
                    </button>
                `;

            default:
                return commonActions;
        }
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    getTagLabel(tag) {
        const labels = {
            workshop: 'Workshop',
            seminar: 'Hội thảo',
            competition: 'Thi đấu',
            social: 'Giao lưu',
            volunteer: 'Tình nguyện',
            technology: 'Công nghệ',
            sport: 'Thể thao',
            art: 'Nghệ thuật',
            business: 'Kinh doanh',
            charity: 'Từ thiện'
        };
        return labels[tag] || tag;
    }

    // Calendar Rendering
    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        // Update month display
        const currentMonthElement = document.getElementById('currentMonth');
        if (currentMonthElement) {
            currentMonthElement.textContent = now.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
        }

        // Generate calendar
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        let calendarHTML = '';

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDayWeek; i++) {
            const prevMonthDay = new Date(year, month, -(firstDayWeek - i - 1));
            calendarHTML += `<div class="calendar-day other-month">${prevMonthDay.getDate()}</div>`;
        }

        // Add days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const dayEvents = this.filteredEvents.filter(event => event.startDate === dateString);

            let dayClass = 'calendar-day';
            if (date.toDateString() === now.toDateString()) {
                dayClass += ' today';
            }
            if (dayEvents.length > 0) {
                dayClass += ' has-event';
            }

            const eventsHTML = dayEvents.slice(0, 2).map(event =>
                `<div class="calendar-event" onclick="eventsManager.viewEvent('${event.id}')">${event.title}</div>`
            ).join('');

            const moreEvents = dayEvents.length > 2 ? `<div class="calendar-event more">+${dayEvents.length - 2} khác</div>` : '';

            calendarHTML += `
                <div class="${dayClass}">
                    ${day}
                    ${eventsHTML}
                    ${moreEvents}
                </div>
            `;
        }

        calendarGrid.innerHTML = calendarHTML;
    }

    navigateCalendar(direction) {
        // Calendar navigation logic
        this.showNotification(`Điều hướng lịch ${direction > 0 ? 'tới' : 'trước'}`, 'info');
    }

    // Stats Update
    updateStats() {
        const totalEvents = this.filteredEvents.length;
        const upcomingEvents = this.filteredEvents.filter(e => e.status === 'upcoming').length;
        const ongoingEvents = this.filteredEvents.filter(e => e.status === 'ongoing').length;
        const totalParticipants = this.filteredEvents.reduce((sum, e) => sum + e.registered, 0);

        // Update stat cards
        this.updateStatCard('[data-stat="totalEvents"] h3', totalEvents);
        this.updateStatCard('[data-stat="upcomingEvents"] h3', upcomingEvents);
        this.updateStatCard('[data-stat="ongoingEvents"] h3', ongoingEvents);
        this.updateStatCard('[data-stat="participants"] h3', this.formatNumber(totalParticipants));
    }

    updateStatCard(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Event Actions
    openCreateEventModal() {
        this.showModal('createEventModal');
    }

    viewEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            this.currentEvent = event;
            this.renderEventDetails(event);
            this.showModal('eventDetailsModal');
        }
    }

    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            // Populate form with event data
            this.populateEventForm(event);
            this.showModal('createEventModal');
        }
    }

    duplicateEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            const duplicatedEvent = {
                ...event,
                id: 'evt' + Date.now(),
                title: event.title + ' (Bản sao)',
                status: 'upcoming'
            };
            this.events.push(duplicatedEvent);
            this.applyFilters();
            this.showNotification('Đã tạo bản sao sự kiện!', 'success');
        }
    }

    manageParticipants(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            this.showModal('participantsModal', this.createParticipantsContent(event));
        }
    }

    shareEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            // Share functionality
            this.showNotification(`Đã chia sẻ sự kiện: ${event.title}`, 'success');
        }
    }

    goLive(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            this.showNotification(`Đang theo dõi trực tiếp: ${event.title}`, 'info');
        }
    }

    viewReport(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            this.showNotification(`Đang tạo báo cáo cho: ${event.title}`, 'info');
        }
    }

    viewFeedback(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            this.showNotification(`Xem phản hồi: ${event.title}`, 'info');
        }
    }

    // Modal Functions
    showModal(modalId, content = null) {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (content && modalId !== 'createEventModal' && modalId !== 'eventDetailsModal') {
                const modalBody = modal.querySelector('.modal-body');
                if (modalBody) modalBody.innerHTML = content;
            }

            modal.classList.add('show');
            document.body.style.overflow = 'hidden';

            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modalId);
                }
            });
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    renderEventDetails(event) {
        const content = document.getElementById('eventDetailsContent');
        if (!content) return;

        const startDate = new Date(`${event.startDate}T${event.startTime}`);
        const endDate = new Date(`${event.endDate}T${event.endTime}`);

        content.innerHTML = `
            <div class="event-detail-view">
                <div class="event-detail-header">
                    <h2>${event.title}</h2>
                    <span class="event-status ${event.status}">${this.getStatusLabel(event.status)}</span>
                </div>
                
                <div class="event-detail-info">
                    <div class="detail-section">
                        <h4><i class="fas fa-info-circle"></i> Thông tin cơ bản</h4>
                        <p><strong>Câu lạc bộ:</strong> ${event.club}</p>
                        <p><strong>Loại sự kiện:</strong> ${this.getTagLabel(event.type)}</p>
                        <p><strong>Mô tả:</strong> ${event.description}</p>
                    </div>

                    <div class="detail-section">
                        <h4><i class="fas fa-calendar"></i> Thời gian</h4>
                        <p><strong>Bắt đầu:</strong> ${startDate.toLocaleString('vi-VN')}</p>
                        <p><strong>Kết thúc:</strong> ${endDate.toLocaleString('vi-VN')}</p>
                        <p><strong>Địa điểm:</strong> ${event.location}</p>
                    </div>

                    <div class="detail-section">
                        <h4><i class="fas fa-users"></i> Tham gia</h4>
                        <p><strong>Đã đăng ký:</strong> ${event.registered} người</p>
                        <p><strong>Sức chứa:</strong> ${event.capacity || 'Không giới hạn'} người</p>
                        ${event.capacity ? `<p><strong>Tỷ lệ:</strong> ${Math.round((event.registered / event.capacity) * 100)}%</p>` : ''}
                    </div>

                    ${event.rating ? `
                        <div class="detail-section">
                            <h4><i class="fas fa-star"></i> Đánh giá</h4>
                            <div class="rating-display">
                                <div class="rating-stars">${this.generateStars(event.rating)}</div>
                                <span>${event.rating}/5.0 (${event.ratingCount} đánh giá)</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getStatusLabel(status) {
        const labels = {
            upcoming: 'Sắp diễn ra',
            ongoing: 'Đang diễn ra',
            completed: 'Đã hoàn thành',
            cancelled: 'Đã hủy'
        };
        return labels[status] || 'Không xác định';
    }

    populateEventForm(event) {
        // Populate form fields with event data for editing
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventClub').value = event.club.toLowerCase().replace(' ', '');
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventStartDate').value = event.startDate;
        document.getElementById('eventStartTime').value = event.startTime;
        document.getElementById('eventEndDate').value = event.endDate;
        document.getElementById('eventEndTime').value = event.endTime;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventType').value = event.type;
        document.getElementById('eventCapacity').value = event.capacity;
    }

    handleCreateEvent(form) {
        const formData = new FormData(form);
        const newEvent = {
            id: 'evt' + Date.now(),
            title: formData.get('title'),
            club: this.getClubName(formData.get('club')),
            description: formData.get('description') || '',
            startDate: formData.get('startDate'),
            startTime: formData.get('startTime'),
            endDate: formData.get('endDate') || formData.get('startDate'),
            endTime: formData.get('endTime') || formData.get('startTime'),
            location: formData.get('location'),
            type: formData.get('type'),
            status: 'upcoming',
            capacity: parseInt(formData.get('capacity')) || 0,
            registered: 0,
            tags: [formData.get('type'), formData.get('club')],
            image: null
        };

        this.events.push(newEvent);
        this.applyFilters();
        this.closeModal('createEventModal');
        form.reset();

        this.showNotification('Đã tạo sự kiện thành công!', 'success');
    }

    getClubName(clubKey) {
        const clubs = {
            technology: 'CLB Công nghệ',
            sport: 'CLB Thể thao',
            art: 'CLB Nghệ thuật',
            volunteer: 'CLB Tình nguyện'
        };
        return clubs[clubKey] || 'CLB Khác';
    }

    saveEventDraft() {
        this.showNotification('Đã lưu bản nháp!', 'info');
    }

    editCurrentEvent() {
        if (this.currentEvent) {
            this.closeModal('eventDetailsModal');
            this.editEvent(this.currentEvent.id);
        }
    }

    // Quick Actions
    openEventTemplates() {
        this.showModal('templatesModal', this.createTemplatesContent());
    }

    createTemplatesContent() {
        return `
            <div class="templates-container">
                <h4>Chọn mẫu sự kiện</h4>
                <div class="templates-grid">
                    <div class="template-card" onclick="eventsManager.useTemplate('workshop')">
                        <i class="fas fa-laptop-code"></i>
                        <h5>Workshop Kỹ thuật</h5>
                        <p>Mẫu cho workshop công nghệ</p>
                    </div>
                    <div class="template-card" onclick="eventsManager.useTemplate('seminar')">
                        <i class="fas fa-presentation"></i>
                        <h5>Hội thảo</h5>
                        <p>Mẫu cho hội thảo học thuật</p>
                    </div>
                    <div class="template-card" onclick="eventsManager.useTemplate('competition')">
                        <i class="fas fa-trophy"></i>
                        <h5>Cuộc thi</h5>
                        <p>Mẫu cho các cuộc thi</p>
                    </div>
                    <div class="template-card" onclick="eventsManager.useTemplate('social')">
                        <i class="fas fa-heart"></i>
                        <h5>Giao lưu</h5>
                        <p>Mẫu cho sự kiện giao lưu</p>
                    </div>
                </div>
            </div>
        `;
    }

    useTemplate(templateType) {
        const templates = {
            workshop: {
                title: 'Workshop [Chủ đề]',
                type: 'workshop',
                capacity: 50,
                duration: 3
            },
            seminar: {
                title: 'Hội thảo [Chủ đề]',
                type: 'seminar',
                capacity: 200,
                duration: 2
            },
            competition: {
                title: 'Cuộc thi [Tên cuộc thi]',
                type: 'competition',
                capacity: 100,
                duration: 4
            },
            social: {
                title: 'Giao lưu [Chủ đề]',
                type: 'social',
                capacity: 150,
                duration: 3
            }
        };

        const template = templates[templateType];
        if (template) {
            this.closeModal('templatesModal');
            this.openCreateEventModal();

            // Auto-fill form with template data
            setTimeout(() => {
                document.getElementById('eventTitle').value = template.title;
                document.getElementById('eventType').value = template.type;
                document.getElementById('eventCapacity').value = template.capacity;
            }, 100);
        }
    }

    viewAttendanceReport() {
        this.showNotification('Đang tạo báo cáo tham gia...', 'info');
        // Simulate report generation
        setTimeout(() => {
            this.showNotification('Báo cáo đã được tạo!', 'success');
        }, 2000);
    }

    manageRegistrations() {
        this.showNotification('Mở trang quản lý đăng ký...', 'info');
    }

    // Chart Initialization
    initializeCharts() {
        this.initParticipationChart();
        this.initClubEventsChart();
    }

    initParticipationChart() {
        const ctx = document.getElementById('participationChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                datasets: [{
                    label: 'Lượt tham gia',
                    data: [120, 190, 300, 500, 420, 380, 450],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
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
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    initClubEventsChart() {
        const ctx = document.getElementById('clubEventsChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Công nghệ', 'Thể thao', 'Nghệ thuật', 'Tình nguyện', 'Học thuật'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        '#667eea',
                        '#00b894',
                        '#fdcb6e',
                        '#fd79a8',
                        '#74b9ff'
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

    // Utility Functions
    refreshEvents() {
        this.showLoadingOverlay(true);
        setTimeout(() => {
            this.loadEvents();
            this.showLoadingOverlay(false);
            this.showNotification('Đã làm mới dữ liệu!', 'success');
        }, 1000);
    }

    refreshEventsList() {
        const refreshBtn = document.getElementById('refreshEventsList');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            setTimeout(() => {
                refreshBtn.innerHTML = '<i class="fas fa-sync"></i>';
                this.renderEvents();
                this.showNotification('Đã cập nhật danh sách!', 'success');
            }, 800);
        }
    }

    exportData(type) {
        this.showNotification(`Đang xuất dữ liệu ${type.toUpperCase()}...`, 'info');
        setTimeout(() => {
            this.showNotification(`Đã xuất dữ liệu ${type.toUpperCase()} thành công!`, 'success');
        }, 1500);
    }

    showLoadingOverlay(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('show', show);
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Header Functions
    setupUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.querySelector('.sidebar');

        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            });
        }
    }

    toggleTheme() {
        this.showNotification('Chế độ Light Mode đang được sử dụng!', 'info');
    }

    showNotifications() {
        this.showModal('notificationsModal', `
            <div class="notifications-list">
                <div class="notification-item">
                    <i class="fas fa-calendar-plus"></i>
                    <div>
                        <strong>Sự kiện mới được tạo</strong>
                        <p>Workshop React Advanced đã được thêm vào lịch</p>
                        <small>2 giờ trước</small>
                    </div>
                </div>
                <div class="notification-item">
                    <i class="fas fa-user-check"></i>
                    <div>
                        <strong>Đăng ký tham gia mới</strong>
                        <p>15 người đã đăng ký tham gia Hội thảo Khởi nghiệp</p>
                        <small>1 ngày trước</small>
                    </div>
                </div>
            </div>
        `);
    }

    showMessages() {
        this.showModal('messagesModal', `
            <div class="messages-list">
                <div class="message-item">
                    <img src="../../assets/images/avata/avata_admin.jpg" alt="Avatar">
                    <div>
                        <strong>Nguyễn Văn A</strong>
                        <p>Sự kiện workshop có cần chuẩn bị gì đặc biệt không?</p>
                        <small>30 phút trước</small>
                    </div>
                </div>
            </div>
        `);
    }

    openSettings() {
        this.showModal('settingsModal', `
            <div class="settings-panel">
                <h4>Cài đặt sự kiện</h4>
                <label class="switch">
                    <input type="checkbox" checked>
                    <span class="slider">Thông báo sự kiện mới</span>
                </label>
                <label class="switch">
                    <input type="checkbox" checked>
                    <span class="slider">Nhắc nhở trước sự kiện</span>
                </label>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider">Tự động chia sẻ sự kiện</span>
                </label>
            </div>
        `);
    }

    handleStatCardClick(card) {
        const statType = card.dataset.stat;
        switch (statType) {
            case 'totalEvents':
                this.currentFilters = { period: 'all', club: '', status: '', type: '', location: '', capacity: '' };
                break;
            case 'upcomingEvents':
                this.currentFilters = { ...this.currentFilters, status: 'upcoming' };
                break;
            case 'ongoingEvents':
                this.currentFilters = { ...this.currentFilters, status: 'ongoing' };
                break;
            case 'participants':
                // Show events sorted by participation
                this.sortEvents('participants');
                break;
        }
        this.applyFilters();
        this.showNotification(`Lọc theo ${card.querySelector('p').textContent}`, 'info');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.eventsManager = new EventsManager();
});

// Additional CSS for modals and components
const additionalStyles = `
<style>
.event-detail-view {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.event-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
}

.event-detail-header h2 {
    margin: 0;
    color: #2c3e50;
}

.detail-section {
    margin-bottom: 1.5rem;
}

.detail-section h4 {
    color: #667eea;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.detail-section p {
    margin: 0.5rem 0;
    color: #555;
}

.rating-display {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.template-card {
    background: #f8f9fa;
    border: 2px solid #e0e6ed;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.template-card:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
    transform: translateY(-2px);
}

.template-card i {
    font-size: 2rem;
    color: #667eea;
    margin-bottom: 0.5rem;
}

.template-card h5 {
    margin: 0.5rem 0;
    color: #2c3e50;
}

.template-card p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
}

.notifications-list,
.messages-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.notification-item,
.message-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.notification-item i {
    font-size: 1.2rem;
    color: #667eea;
    margin-top: 0.25rem;
}

.message-item img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.notification-item strong,
.message-item strong {
    color: #2c3e50;
    font-size: 0.9rem;
}

.notification-item p,
.message-item p {
    color: #666;
    margin: 0.25rem 0;
    font-size: 0.85rem;
}

.notification-item small,
.message-item small {
    color: #999;
    font-size: 0.75rem;
}

.settings-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.settings-panel h4 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

.switch {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    padding: 0.5rem 0;
}

.switch input[type="checkbox"] {
    width: auto;
}

.switch .slider {
    color: #555;
    font-weight: 500;
}

.no-events {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: #666;
}

.no-events i {
    font-size: 4rem;
    color: #ddd;
    margin-bottom: 1rem;
}

.no-events h3 {
    margin: 0.5rem 0;
    color: #999;
    font-size: 1.2rem;
}

.no-events p {
    margin: 0;
    color: #888;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
