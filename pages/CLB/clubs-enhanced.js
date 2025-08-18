// Clubs Page JavaScript
class ClubsManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.clubs = this.loadClubs();
        this.events = this.loadEvents();
        this.categories = this.loadCategories();
        this.analyticsChart = null;
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        this.currentView = 'list';
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadDashboardData();
        this.renderQuickStats();
        this.renderCategories();
        this.renderClubs();
        this.renderEvents();
        this.renderTopClubs();
        this.initializeChart();
        this.startRealtimeUpdates();
    }

    // Event Listeners
    initializeEventListeners() {
        // Category filters
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectCategory(item);
            });
        });

        // Filter tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterClubs(filter);
            });
        });

        // View toggles
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.toggleView(view);
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

        // Modal events
        this.initializeModalEvents();

        // Chart period change
        const chartPeriodSelect = document.getElementById('analyticsChartPeriod');
        if (chartPeriodSelect) {
            chartPeriodSelect.addEventListener('change', (e) => {
                this.updateChart(e.target.value);
            });
        }

        // Search functionality
        const searchInput = document.querySelector('.search-container input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchClubs(e.target.value);
            });
        }
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

        // Create club form submission
        const createClubForm = document.getElementById('createClubForm');
        if (createClubForm) {
            createClubForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createClub(new FormData(createClubForm));
            });
        }

        // Club actions
        document.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'view-club') {
                const clubId = e.target.closest('.club-item, .club-card').dataset.clubId;
                this.viewClubDetails(clubId);
            } else if (e.target.dataset.action === 'edit-club') {
                const clubId = e.target.closest('.club-item, .club-card').dataset.clubId;
                this.editClub(clubId);
            } else if (e.target.dataset.action === 'delete-club') {
                const clubId = e.target.closest('.club-item, .club-card').dataset.clubId;
                this.deleteClub(clubId);
            }
        });
    }

    // Data Loading
    loadClubs() {
        const defaultClubs = [
            {
                id: 'club-1',
                name: 'Câu lạc bộ Tin học',
                code: 'CLB-TH',
                category: 'technology',
                description: 'Câu lạc bộ dành cho những sinh viên yêu thích lập trình và công nghệ thông tin',
                status: 'active',
                president: 'Nguyễn Văn A',
                email: 'tinhoc@club.edu.vn',
                members: 45,
                maxMembers: 60,
                foundedDate: new Date('2020-09-01'),
                avatar: 'TH',
                events: 12,
                engagement: 92
            },
            {
                id: 'club-2',
                name: 'Câu lạc bộ Bóng đá',
                code: 'CLB-BD',
                category: 'sports',
                description: 'Câu lạc bộ thể thao dành cho những sinh viên đam mê bóng đá',
                status: 'active',
                president: 'Trần Thị B',
                email: 'bongda@club.edu.vn',
                members: 38,
                maxMembers: 50,
                foundedDate: new Date('2019-03-15'),
                avatar: 'BD',
                events: 8,
                engagement: 88
            },
            {
                id: 'club-3',
                name: 'Câu lạc bộ Âm nhạc',
                code: 'CLB-AN',
                category: 'culture',
                description: 'Nơi giao lưu và phát triển tài năng âm nhạc của sinh viên',
                status: 'active',
                president: 'Lê Văn C',
                email: 'amnhac@club.edu.vn',
                members: 32,
                maxMembers: 40,
                foundedDate: new Date('2020-01-10'),
                avatar: 'AN',
                events: 15,
                engagement: 94
            },
            {
                id: 'club-4',
                name: 'Câu lạc bộ Tình nguyện',
                code: 'CLB-TN',
                category: 'social',
                description: 'Hoạt động xã hội và tình nguyện vì cộng đồng',
                status: 'active',
                president: 'Phạm Thị D',
                email: 'tinhnguyenvien@club.edu.vn',
                members: 67,
                maxMembers: 80,
                foundedDate: new Date('2018-05-20'),
                avatar: 'TN',
                events: 20,
                engagement: 96
            },
            {
                id: 'club-5',
                name: 'Câu lạc bộ Nghiên cứu khoa học',
                code: 'CLB-NCKH',
                category: 'academic',
                description: 'Nghiên cứu và phát triển các dự án khoa học của sinh viên',
                status: 'active',
                president: 'Hoàng Văn E',
                email: 'nckh@club.edu.vn',
                members: 28,
                maxMembers: 35,
                foundedDate: new Date('2019-09-01'),
                avatar: 'NCKH',
                events: 10,
                engagement: 90
            },
            {
                id: 'club-6',
                name: 'Câu lạc bộ Cầu lông',
                code: 'CLB-CL',
                category: 'sports',
                description: 'Câu lạc bộ thể thao cầu lông cho sinh viên',
                status: 'pending',
                president: 'Vũ Thị F',
                email: 'caulong@club.edu.vn',
                members: 0,
                maxMembers: 30,
                foundedDate: new Date(),
                avatar: 'CL',
                events: 0,
                engagement: 0
            }
        ];
        
        return JSON.parse(localStorage.getItem('clubs_data')) || defaultClubs;
    }

    loadEvents() {
        const defaultEvents = [
            {
                id: 'event-1',
                title: 'Hội thảo Lập trình AI',
                description: 'Hội thảo về trí tuệ nhân tạo và machine learning',
                club: 'club-1',
                category: 'technology',
                date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                location: 'Phòng hội thảo A',
                participants: 45,
                maxParticipants: 60,
                status: 'upcoming'
            },
            {
                id: 'event-2',
                title: 'Giải bóng đá sinh viên',
                description: 'Giải đấu bóng đá thường niên của trường',
                club: 'club-2',
                category: 'sports',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                location: 'Sân bóng trường',
                participants: 120,
                maxParticipants: 150,
                status: 'upcoming'
            },
            {
                id: 'event-3',
                title: 'Đêm nhạc từ thiện',
                description: 'Chương trình âm nhạc gây quỹ từ thiện',
                club: 'club-3',
                category: 'culture',
                date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                location: 'Hội trường lớn',
                participants: 200,
                maxParticipants: 300,
                status: 'upcoming'
            },
            {
                id: 'event-4',
                title: 'Hoạt động tình nguyện',
                description: 'Chăm sóc trẻ em tại trung tâm bảo trợ',
                club: 'club-4',
                category: 'social',
                date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                location: 'Trung tâm bảo trợ XYZ',
                participants: 30,
                maxParticipants: 40,
                status: 'upcoming'
            },
            {
                id: 'event-5',
                title: 'Hội nghị NCKH sinh viên',
                description: 'Trình bày các đề tài nghiên cứu của sinh viên',
                club: 'club-5',
                category: 'academic',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                location: 'Phòng hội nghị B',
                participants: 80,
                maxParticipants: 100,
                status: 'completed'
            }
        ];
        
        return JSON.parse(localStorage.getItem('clubs_events')) || defaultEvents;
    }

    loadCategories() {
        return {
            all: { name: 'Tất cả', color: '#8e44ad', icon: 'fa-th-large' },
            academic: { name: 'Học thuật', color: '#3498db', icon: 'fa-book' },
            sports: { name: 'Thể thao', color: '#e74c3c', icon: 'fa-running' },
            culture: { name: 'Văn hóa', color: '#f39c12', icon: 'fa-music' },
            social: { name: 'Xã hội', color: '#27ae60', icon: 'fa-hands-helping' },
            technology: { name: 'Công nghệ', color: '#34495e', icon: 'fa-laptop-code' }
        };
    }

    // Dashboard Data
    loadDashboardData() {
        this.updateLastRefresh();
    }

    renderQuickStats() {
        const stats = this.calculateStats();
        
        // Update Total Clubs
        const totalClubsCard = document.querySelector('.stat-card.total-clubs');
        if (totalClubsCard) {
            totalClubsCard.querySelector('h3').textContent = stats.totalClubs;
            totalClubsCard.querySelector('p').textContent = 'Tổng câu lạc bộ';
            totalClubsCard.querySelector('small').textContent = 'Đang hoạt động';
            this.updateTrend(totalClubsCard.querySelector('.stat-trend'), stats.clubsTrend);
        }

        // Update Active Members
        const activeMembersCard = document.querySelector('.stat-card.active-members');
        if (activeMembersCard) {
            activeMembersCard.querySelector('h3').textContent = stats.totalMembers.toLocaleString();
            activeMembersCard.querySelector('p').textContent = 'Thành viên tham gia';
            activeMembersCard.querySelector('small').textContent = 'Hoạt động tích cực';
            this.updateTrend(activeMembersCard.querySelector('.stat-trend'), stats.membersTrend);
        }

        // Update Events
        const eventsCard = document.querySelector('.stat-card.events');
        if (eventsCard) {
            eventsCard.querySelector('h3').textContent = stats.totalEvents;
            eventsCard.querySelector('p').textContent = 'Sự kiện tháng này';
            eventsCard.querySelector('small').textContent = `${stats.upcomingEvents} đang diễn ra`;
            this.updateTrend(eventsCard.querySelector('.stat-trend'), stats.eventsTrend);
        }

        // Update Engagement
        const engagementCard = document.querySelector('.stat-card.engagement');
        if (engagementCard) {
            engagementCard.querySelector('h3').textContent = `${stats.avgEngagement}%`;
            engagementCard.querySelector('p').textContent = 'Tỷ lệ tham gia';
            engagementCard.querySelector('small').textContent = 'Tháng này';
            this.updateTrend(engagementCard.querySelector('.stat-trend'), stats.engagementTrend);
        }
    }

    calculateStats() {
        const activeClubs = this.clubs.filter(club => club.status === 'active');
        const totalMembers = activeClubs.reduce((sum, club) => sum + club.members, 0);
        const totalEvents = this.events.length;
        const upcomingEvents = this.events.filter(event => event.status === 'upcoming').length;
        const avgEngagement = Math.round(activeClubs.reduce((sum, club) => sum + club.engagement, 0) / activeClubs.length);
        
        return {
            totalClubs: activeClubs.length,
            totalMembers: totalMembers,
            totalEvents: totalEvents,
            upcomingEvents: upcomingEvents,
            avgEngagement: avgEngagement,
            clubsTrend: 'up',
            membersTrend: 'up',
            eventsTrend: 'up',
            engagementTrend: avgEngagement >= 85 ? 'up' : 'down'
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

    // Category Management
    renderCategories() {
        const categoriesList = document.querySelector('.categories-list');
        if (!categoriesList) return;

        const categoryStats = this.calculateCategoryStats();
        
        categoriesList.innerHTML = Object.entries(this.categories).map(([key, category]) => 
            this.createCategoryItem(key, category, categoryStats[key] || 0)
        ).join('');
    }

    calculateCategoryStats() {
        const stats = {};
        Object.keys(this.categories).forEach(key => {
            if (key === 'all') {
                stats[key] = this.clubs.length;
            } else {
                stats[key] = this.clubs.filter(club => club.category === key).length;
            }
        });
        return stats;
    }

    createCategoryItem(key, category, count) {
        return `
            <div class="category-item ${key === this.currentCategory ? 'active' : ''}" data-category="${key}">
                <div class="category-info">
                    <div class="category-icon ${key}">
                        <i class="fas ${category.icon}"></i>
                    </div>
                    <div class="category-details">
                        <h4>${category.name}</h4>
                        <p>${count} câu lạc bộ</p>
                    </div>
                </div>
                <div class="category-count">${count}</div>
            </div>
        `;
    }

    selectCategory(categoryElement) {
        // Remove active class from all categories
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to selected category
        categoryElement.classList.add('active');
        
        // Update current category and filter clubs
        this.currentCategory = categoryElement.dataset.category;
        this.filterClubsByCategory(this.currentCategory);
    }

    // Club Management
    renderClubs() {
        this.filterClubs(this.currentFilter);
    }

    filterClubs(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Filter clubs
        let filteredClubs = this.getFilteredClubs();
        this.renderClubsList(filteredClubs);
    }

    filterClubsByCategory(category) {
        let filteredClubs = this.getFilteredClubs();
        this.renderClubsList(filteredClubs);
    }

    getFilteredClubs() {
        let filteredClubs = this.clubs;
        
        // Filter by category
        if (this.currentCategory !== 'all') {
            filteredClubs = filteredClubs.filter(club => club.category === this.currentCategory);
        }
        
        // Filter by status
        if (this.currentFilter !== 'all') {
            filteredClubs = filteredClubs.filter(club => club.status === this.currentFilter);
        }
        
        return filteredClubs;
    }

    renderClubsList(clubs) {
        const clubsList = document.getElementById('clubsList');
        if (!clubsList) return;
        
        if (clubs.length === 0) {
            clubsList.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p>Không có câu lạc bộ nào</p>
                </div>
            `;
            return;
        }

        if (this.currentView === 'grid') {
            clubsList.className = 'clubs-grid-view';
            clubsList.innerHTML = clubs.map(club => this.createClubCard(club)).join('');
        } else {
            clubsList.className = 'clubs-list';
            clubsList.innerHTML = clubs.map(club => this.createClubItem(club)).join('');
        }
    }

    createClubItem(club) {
        return `
            <div class="club-item" data-club-id="${club.id}">
                <div class="club-avatar" style="background: linear-gradient(135deg, ${this.categories[club.category].color}, ${this.categories[club.category].color}99);">
                    ${club.avatar}
                </div>
                <div class="club-info">
                    <h4>${club.name}</h4>
                    <p>${club.description}</p>
                    <div class="club-meta">
                        <span><i class="fas fa-user"></i> ${club.president}</span>
                        <span><i class="fas fa-envelope"></i> ${club.email}</span>
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(club.foundedDate)}</span>
                    </div>
                </div>
                <div class="club-stats">
                    <div class="member-count">
                        <i class="fas fa-users"></i>
                        <span>${club.members}/${club.maxMembers}</span>
                    </div>
                    <div class="club-status ${club.status}">
                        ${this.getStatusText(club.status)}
                    </div>
                </div>
                <div class="club-actions">
                    <button class="btn-icon" data-action="view-club" title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" data-action="edit-club" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${club.status === 'pending' ? `
                        <button class="btn-icon" data-action="approve-club" title="Duyệt">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    createClubCard(club) {
        return `
            <div class="club-card" data-club-id="${club.id}">
                <div class="club-card-header">
                    <div class="club-card-avatar" style="background: linear-gradient(135deg, ${this.categories[club.category].color}, ${this.categories[club.category].color}99);">
                        ${club.avatar}
                    </div>
                    <div class="club-card-title">
                        <h4>${club.name}</h4>
                        <p>${club.code}</p>
                    </div>
                    <div class="club-status ${club.status}">
                        ${this.getStatusText(club.status)}
                    </div>
                </div>
                <div class="club-card-body">
                    <p>${club.description}</p>
                </div>
                <div class="club-card-footer">
                    <div class="member-count">
                        <i class="fas fa-users"></i>
                        <span>${club.members}/${club.maxMembers}</span>
                    </div>
                    <div class="club-actions">
                        <button class="btn-icon" data-action="view-club" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" data-action="edit-club" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getStatusText(status) {
        const statusTexts = {
            'active': 'Hoạt động',
            'pending': 'Chờ duyệt',
            'inactive': 'Tạm dừng'
        };
        return statusTexts[status] || status;
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    toggleView(view) {
        this.currentView = view;
        
        // Update active view button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Re-render clubs with new view
        const filteredClubs = this.getFilteredClubs();
        this.renderClubsList(filteredClubs);
    }

    searchClubs(query) {
        if (!query.trim()) {
            this.renderClubs();
            return;
        }
        
        const filtered = this.clubs.filter(club => 
            club.name.toLowerCase().includes(query.toLowerCase()) ||
            club.description.toLowerCase().includes(query.toLowerCase()) ||
            club.president.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderClubsList(filtered);
    }

    // Club Actions
    viewClubDetails(clubId) {
        const club = this.clubs.find(c => c.id === clubId);
        if (!club) return;
        
        // Show club details (implement modal or navigation)
        this.showNotification(`Đang xem chi tiết: ${club.name}`, 'info');
    }

    editClub(clubId) {
        const club = this.clubs.find(c => c.id === clubId);
        if (!club) return;
        
        // Populate form with club data
        const form = document.getElementById('createClubForm');
        form.name.value = club.name;
        form.code.value = club.code;
        form.category.value = club.category;
        form.status.value = club.status;
        form.description.value = club.description;
        form.president.value = club.president;
        form.email.value = club.email;
        form.maxMembers.value = club.maxMembers;
        form.foundedDate.value = club.foundedDate.toISOString().split('T')[0];
        
        // Change modal title
        document.querySelector('#createClubModal .modal-header h3').innerHTML = 
            '<i class="fas fa-edit"></i> Chỉnh sửa câu lạc bộ';
        
        // Update form submission
        form.dataset.editId = clubId;
        
        this.openModal('createClubModal');
    }

    deleteClub(clubId) {
        if (!confirm('Bạn có chắc chắn muốn xóa câu lạc bộ này?')) return;
        
        const clubIndex = this.clubs.findIndex(c => c.id === clubId);
        if (clubIndex !== -1) {
            const club = this.clubs[clubIndex];
            this.clubs.splice(clubIndex, 1);
            this.saveClubs();
            this.renderClubs();
            this.renderCategories();
            this.renderQuickStats();
            
            this.showNotification(`Đã xóa câu lạc bộ: ${club.name}`, 'success');
        }
    }

    createClub(formData) {
        const editId = document.getElementById('createClubForm').dataset.editId;
        
        const clubData = {
            name: formData.get('name'),
            code: formData.get('code'),
            category: formData.get('category'),
            status: formData.get('status'),
            description: formData.get('description'),
            president: formData.get('president'),
            email: formData.get('email'),
            maxMembers: parseInt(formData.get('maxMembers')) || 50,
            foundedDate: new Date(formData.get('foundedDate')),
            avatar: formData.get('name').substring(0, 2).toUpperCase(),
            events: 0,
            engagement: 0
        };
        
        if (editId) {
            // Edit existing club
            const clubIndex = this.clubs.findIndex(c => c.id === editId);
            if (clubIndex !== -1) {
                this.clubs[clubIndex] = { ...this.clubs[clubIndex], ...clubData };
                this.showNotification('Cập nhật câu lạc bộ thành công!', 'success');
            }
        } else {
            // Create new club
            const club = {
                id: `club-${Date.now()}`,
                members: 0,
                ...clubData
            };
            
            this.clubs.unshift(club);
            this.showNotification('Tạo câu lạc bộ thành công!', 'success');
        }
        
        this.saveClubs();
        this.renderClubs();
        this.renderCategories();
        this.renderQuickStats();
        this.closeModal('createClubModal');
        
        // Clear form
        document.getElementById('createClubForm').reset();
        delete document.getElementById('createClubForm').dataset.editId;
    }

    openCreateClubModal() {
        // Reset modal title
        document.querySelector('#createClubModal .modal-header h3').innerHTML = 
            '<i class="fas fa-plus"></i> Tạo câu lạc bộ mới';
        
        this.openModal('createClubModal');
    }

    // Events Management
    renderEvents() {
        const eventsTimeline = document.getElementById('eventsTimeline');
        if (!eventsTimeline) return;
        
        const upcomingEvents = this.events
            .filter(event => event.status === 'upcoming')
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);
        
        eventsTimeline.innerHTML = upcomingEvents.map(event => this.createEventItem(event)).join('');
    }

    createEventItem(event) {
        const date = new Date(event.date);
        const club = this.clubs.find(c => c.id === event.club);
        
        return `
            <div class="event-item" data-event-id="${event.id}">
                <div class="event-date">
                    <div class="event-day">${date.getDate()}</div>
                    <div class="event-month">${date.toLocaleDateString('vi-VN', { month: 'short' })}</div>
                </div>
                <div class="event-icon ${event.category}">
                    <i class="fas ${this.categories[event.category].icon}"></i>
                </div>
                <div class="event-content">
                    <h4>${event.title}</h4>
                    <p>${event.description}</p>
                    <div class="event-meta">
                        <span><i class="fas fa-users"></i> ${club ? club.name : 'CLB'}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                        <span><i class="fas fa-user-friends"></i> ${event.participants}/${event.maxParticipants}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Top Clubs
    renderTopClubs() {
        const topClubsList = document.getElementById('topClubsList');
        if (!topClubsList) return;
        
        const topClubs = this.clubs
            .filter(club => club.status === 'active')
            .sort((a, b) => b.engagement - a.engagement)
            .slice(0, 5);
        
        topClubsList.innerHTML = topClubs.map((club, index) => this.createTopClubItem(club, index + 1)).join('');
    }

    createTopClubItem(club, rank) {
        const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
        
        return `
            <div class="top-club-item" data-club-id="${club.id}">
                <div class="club-rank ${rankClass}">${rank}</div>
                <div class="top-club-info">
                    <h5>${club.name}</h5>
                    <p>${club.members} thành viên • ${club.events} sự kiện</p>
                </div>
                <div class="club-score">
                    <div class="score-value">${club.engagement}%</div>
                    <div class="score-label">Tham gia</div>
                </div>
            </div>
        `;
    }

    // Charts
    initializeChart() {
        const ctx = document.getElementById('analyticsChart');
        if (!ctx) return;
        
        const chartData = this.getAnalyticsData('month');
        
        this.analyticsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.data,
                    backgroundColor: chartData.colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
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
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${percentage}%`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    getAnalyticsData(period) {
        const categoryStats = this.calculateCategoryStats();
        
        const labels = [];
        const data = [];
        const colors = [];
        
        Object.entries(this.categories).forEach(([key, category]) => {
            if (key !== 'all' && categoryStats[key] > 0) {
                labels.push(category.name);
                data.push(categoryStats[key]);
                colors.push(category.color);
            }
        });
        
        return { labels, data, colors };
    }

    updateChart(period) {
        if (!this.analyticsChart) return;
        
        const chartData = this.getAnalyticsData(period);
        
        this.analyticsChart.data.labels = chartData.labels;
        this.analyticsChart.data.datasets[0].data = chartData.data;
        this.analyticsChart.data.datasets[0].backgroundColor = chartData.colors;
        
        this.analyticsChart.update();
    }

    // Quick Actions
    handleQuickAction(action) {
        switch (action) {
            case 'create-event':
                this.createEvent();
                break;
            case 'approve-clubs':
                this.approveClubs();
                break;
            case 'send-notification':
                this.sendNotification();
                break;
            case 'analytics-report':
                this.generateAnalyticsReport();
                break;
        }
    }

    createEvent() {
        this.showNotification('Đang mở form tạo sự kiện...', 'info');
        // Implement event creation modal
    }

    approveClubs() {
        const pendingClubs = this.clubs.filter(club => club.status === 'pending');
        if (pendingClubs.length === 0) {
            this.showNotification('Không có câu lạc bộ nào cần duyệt', 'info');
            return;
        }
        
        pendingClubs.forEach(club => {
            club.status = 'active';
        });
        
        this.saveClubs();
        this.renderClubs();
        this.renderQuickStats();
        this.showNotification(`Đã duyệt ${pendingClubs.length} câu lạc bộ`, 'success');
    }

    sendNotification() {
        this.showNotification('Đang gửi thông báo đến các câu lạc bộ...', 'info');
        
        setTimeout(() => {
            this.showNotification('Đã gửi thông báo thành công!', 'success');
        }, 2000);
    }

    generateAnalyticsReport() {
        this.showNotification('Đang tạo báo cáo phân tích...', 'info');
        
        setTimeout(() => {
            const data = {
                clubs: this.clubs,
                events: this.events,
                statistics: this.calculateStats(),
                generatedAt: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `clubs-analytics-${new Date().getTime()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Báo cáo đã được tạo và tải xuống!', 'success');
        }, 2000);
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
            
            // Reset form if it's the create club modal
            if (modalId === 'createClubModal') {
                const form = document.getElementById('createClubForm');
                form.reset();
                delete form.dataset.editId;
                document.querySelector('#createClubModal .modal-header h3').innerHTML = 
                    '<i class="fas fa-plus"></i> Tạo câu lạc bộ mới';
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
        
        // Simulate new events every 5 minutes
        setInterval(() => {
            this.simulateNewActivity();
        }, 300000);
    }

    simulateNewActivity() {
        // Simulate random club activities
        const activities = [
            'Câu lạc bộ có thành viên mới tham gia',
            'Sự kiện mới được tạo',
            'Hoạt động câu lạc bộ được cập nhật',
            'Thành viên tham gia sự kiện'
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        console.log('Hoạt động mới:', randomActivity);
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
    saveClubs() {
        localStorage.setItem('clubs_data', JSON.stringify(this.clubs));
    }

    saveEvents() {
        localStorage.setItem('clubs_events', JSON.stringify(this.events));
    }
}

// Initialize Clubs Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the clubs page
    if (document.querySelector('.clubs-main')) {
        window.clubsManager = new ClubsManager();
    }
});

// Export for global access
window.ClubsManager = ClubsManager;
