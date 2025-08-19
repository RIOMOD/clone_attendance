/* ===== CLB PAGE FUNCTIONALITY - DASHBOARD SYNCHRONIZED ===== */

class CLBModernPage {
    constructor() {
        this.currentUser = {
            name: 'Nguyễn Văn A',
            role: 'Sinh viên',
            avatar: '../../assets/images/avata/avata_admin.jpg',
            isOnline: true,
            joinedClubs: ['CodeKing Club', 'Music Passion', 'Basketball Team']
        };

        this.clubsData = [];
        this.activitiesData = [];
        this.searchResults = [];
        this.currentFilter = 'all';

        this.init();
    }

    init() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadClubsData();
        this.loadActivitiesData();
        this.setupSearchFunctionality();
        this.setupFilters();
        this.animateElements();
        this.updateStats();
        
        console.log('✅ CLB Modern Page initialized successfully');
    }

    initializeElements() {
        this.elements = {
            // Search elements
            searchInput: document.getElementById('searchInput'),
            searchResults: document.getElementById('searchResults'),
            
            // Filter elements
            categoryFilter: document.getElementById('categoryFilter'),
            statusFilter: document.getElementById('statusFilter'),
            
            // Content containers
            statsGrid: document.querySelector('.clb-stats-grid'),
            actionsGrid: document.querySelector('.clb-actions-grid'),
            featuredClubsGrid: document.querySelector('.featured-clubs-grid'),
            activitiesTimeline: document.querySelector('.activities-timeline'),
            
            // Mobile menu
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            sidebar: document.getElementById('sidebar'),
            sidebarOverlay: document.getElementById('sidebarOverlay'),
            
            // Notification elements
            notificationBtn: document.getElementById('notificationBtn'),
            notificationPanel: document.getElementById('notificationPanel'),
            notificationBadge: document.querySelector('.notification-badge'),
            
            // User menu
            userMenu: document.querySelector('.user-menu'),
            userDropdown: document.querySelector('.user-dropdown')
        };
    }

    setupEventListeners() {
        // Mobile menu toggle
        if (this.elements.mobileMenuBtn) {
            this.elements.mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Sidebar overlay
        if (this.elements.sidebarOverlay) {
            this.elements.sidebarOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Search functionality
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            this.elements.searchInput.addEventListener('focus', () => {
                this.showSearchResults();
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-box')) {
                    this.hideSearchResults();
                }
            });
        }

        // Filter changes
        if (this.elements.categoryFilter) {
            this.elements.categoryFilter.addEventListener('change', (e) => {
                this.handleFilterChange('category', e.target.value);
            });
        }

        if (this.elements.statusFilter) {
            this.elements.statusFilter.addEventListener('change', (e) => {
                this.handleFilterChange('status', e.target.value);
            });
        }

        // Notification panel
        if (this.elements.notificationBtn) {
            this.elements.notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotificationPanel();
            });
        }

        // Action card interactions
        document.querySelectorAll('.clb-action-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const action = card.dataset.action;
                this.handleActionClick(action, card.href);
            });
        });

        // Club card interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.club-btn-primary')) {
                e.preventDefault();
                const clubId = e.target.closest('.featured-club-card').dataset.clubId;
                this.handleJoinClub(clubId);
            }
            
            if (e.target.closest('.club-btn-outline')) {
                e.preventDefault();
                const clubId = e.target.closest('.featured-club-card').dataset.clubId;
                this.handleViewClub(clubId);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    // Mobile Navigation
    toggleMobileMenu() {
        const sidebar = this.elements.sidebar;
        const overlay = this.elements.sidebarOverlay;
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show');
            document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
        }
    }

    closeMobileMenu() {
        const sidebar = this.elements.sidebar;
        const overlay = this.elements.sidebarOverlay;
        
        if (sidebar && overlay) {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Search Functionality
    setupSearchFunctionality() {
        this.searchData = [
            { title: 'CodeKing Club', category: 'technology', type: 'club', url: 'clubs.html', icon: 'fas fa-code' },
            { title: 'Music Passion', category: 'culture', type: 'club', url: 'clubs.html', icon: 'fas fa-music' },
            { title: 'Basketball Team', category: 'sports', type: 'club', url: 'clubs.html', icon: 'fas fa-basketball-ball' },
            { title: 'Volunteer Club', category: 'social', type: 'club', url: 'clubs.html', icon: 'fas fa-hands-helping' },
            { title: 'Danh sách CLB', type: 'page', url: 'clubs.html', icon: 'fas fa-list' },
            { title: 'Quản lý CLB', type: 'page', url: 'clubs-list.html', icon: 'fas fa-cog' },
            { title: 'Sự kiện CLB', type: 'page', url: 'club-events.html', icon: 'fas fa-calendar-plus' },
            { title: 'Thành viên CLB', type: 'page', url: 'club-members.html', icon: 'fas fa-users-cog' }
        ];
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.hideSearchResults();
            return;
        }

        const results = this.searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category?.toLowerCase().includes(query.toLowerCase()) ||
            item.type.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);

        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query) {
        const resultsContainer = this.elements.searchResults;
        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-empty">
                    <i class="fas fa-search text-tertiary"></i>
                    <p>Không tìm thấy kết quả cho "${query}"</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = results.map(item => `
                <div class="search-result-item" data-url="${item.url}" data-type="${item.type}">
                    <div class="search-result-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="search-result-content">
                        <div class="search-result-title">${this.highlightText(item.title, query)}</div>
                        <div class="search-result-category">${this.getTypeLabel(item.type)}</div>
                    </div>
                </div>
            `).join('');

            // Add click handlers
            resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const url = item.dataset.url;
                    if (url) {
                        window.location.href = url;
                    }
                    this.hideSearchResults();
                    this.elements.searchInput.blur();
                });
            });
        }

        this.showSearchResults();
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    getTypeLabel(type) {
        const labels = {
            'club': 'Câu lạc bộ',
            'page': 'Trang',
            'event': 'Sự kiện',
            'member': 'Thành viên'
        };
        return labels[type] || type;
    }

    showSearchResults() {
        if (this.elements.searchResults) {
            this.elements.searchResults.style.display = 'block';
        }
    }

    hideSearchResults() {
        if (this.elements.searchResults) {
            this.elements.searchResults.style.display = 'none';
        }
    }

    // Filter Functionality
    setupFilters() {
        this.filters = {
            category: 'all',
            status: 'all',
            search: ''
        };
    }

    handleFilterChange(filterType, value) {
        this.filters[filterType] = value;
        this.applyFilters();
        this.showNotification(`Đã lọc theo ${this.getFilterLabel(filterType, value)}`, 'info');
    }

    getFilterLabel(type, value) {
        const labels = {
            category: {
                'all': 'tất cả danh mục',
                'academic': 'học thuật',
                'sports': 'thể thao',
                'culture': 'văn hóa',
                'social': 'xã hội',
                'technology': 'công nghệ'
            },
            status: {
                'all': 'tất cả trạng thái',
                'active': 'đang hoạt động',
                'recruiting': 'đang tuyển thành viên',
                'inactive': 'không hoạt động'
            }
        };
        return labels[type]?.[value] || value;
    }

    applyFilters() {
        // Filter clubs based on current filters
        const filteredClubs = this.clubsData.filter(club => {
            const categoryMatch = this.filters.category === 'all' || club.category === this.filters.category;
            const statusMatch = this.filters.status === 'all' || club.status === this.filters.status;
            const searchMatch = !this.filters.search || 
                club.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                club.description.toLowerCase().includes(this.filters.search.toLowerCase());
            
            return categoryMatch && statusMatch && searchMatch;
        });

        this.renderFeaturedClubs(filteredClubs);
    }

    // Data Loading
    loadClubsData() {
        // Simulate API call
        this.clubsData = [
            {
                id: 1,
                name: 'CodeKing Club',
                category: 'technology',
                status: 'active',
                description: 'Câu lạc bộ lập trình cho sinh viên đam mê công nghệ. Học hỏi và chia sẻ kiến thức về lập trình, AI, và các công nghệ mới.',
                members: 142,
                events: 15,
                rating: 4.8,
                established: '2020',
                tags: ['Programming', 'AI', 'Web Development']
            },
            {
                id: 2,
                name: 'Music Passion',
                category: 'culture',
                status: 'recruiting',
                description: 'Câu lạc bộ âm nhạc dành cho những ai yêu thích nghệ thuật. Biểu diễn, sáng tác và thưởng thức âm nhạc cùng nhau.',
                members: 89,
                events: 22,
                rating: 4.6,
                established: '2019',
                tags: ['Music', 'Performance', 'Creative']
            },
            {
                id: 3,
                name: 'Basketball Team',
                category: 'sports',
                status: 'active',
                description: 'Đội bóng rổ của trường với tinh thần thể thao cao. Tham gia các giải đấu và rèn luyện sức khỏe.',
                members: 28,
                events: 8,
                rating: 4.9,
                established: '2018',
                tags: ['Basketball', 'Sports', 'Tournament']
            },
            {
                id: 4,
                name: 'Volunteer Club',
                category: 'social',
                status: 'active',
                description: 'Hoạt động thiện nguyện và cộng đồng. Giúp đỡ những người gặp khó khăn và làm những điều có ý nghĩa.',
                members: 156,
                events: 31,
                rating: 4.7,
                established: '2017',
                tags: ['Volunteer', 'Community', 'Charity']
            },
            {
                id: 5,
                name: 'Business Club',
                category: 'academic',
                status: 'recruiting',
                description: 'Câu lạc bộ kinh doanh cho sinh viên quan tâm đến khởi nghiệp và quản lý. Chia sẻ kinh nghiệm và networking.',
                members: 67,
                events: 12,
                rating: 4.4,
                established: '2021',
                tags: ['Business', 'Startup', 'Networking']
            }
        ];

        this.renderFeaturedClubs(this.clubsData.slice(0, 3));
    }

    loadActivitiesData() {
        this.activitiesData = [
            {
                id: 1,
                title: 'Workshop AI & Machine Learning',
                club: 'CodeKing Club',
                description: 'Hội thảo về trí tuệ nhân tạo và học máy dành cho sinh viên IT. Có các chuyên gia từ Google và Microsoft tham gia.',
                time: '2 giờ trước',
                type: 'event',
                icon: 'fas fa-brain'
            },
            {
                id: 2,
                title: 'Tuyển thành viên mới',
                club: 'Music Passion',
                description: 'Câu lạc bộ âm nhạc đang mở đợt tuyển thành viên mới cho học kỳ này. Chào đón tất cả sinh viên yêu âm nhạc.',
                time: '5 giờ trước',
                type: 'recruitment',
                icon: 'fas fa-user-plus'
            },
            {
                id: 3,
                title: 'Giải đấu Basketball Cup 2024',
                club: 'Basketball Team',
                description: 'Đội bóng rổ đã giành chức vô địch giải đấu Basketball Cup 2024 với tỷ số 89-76 trong trận chung kết.',
                time: '1 ngày trước',
                type: 'achievement',
                icon: 'fas fa-trophy'
            },
            {
                id: 4,
                title: 'Chương trình từ thiện tháng 12',
                club: 'Volunteer Club',
                description: 'Hoạt động thiện nguyện trao quà cho trẻ em vùng cao đã thành công tốt đẹp với sự tham gia của 50 thành viên.',
                time: '3 ngày trước',
                type: 'event',
                icon: 'fas fa-heart'
            }
        ];

        this.renderRecentActivities(this.activitiesData);
    }

    // Rendering Functions
    renderFeaturedClubs(clubs) {
        const container = this.elements.featuredClubsGrid;
        if (!container) return;

        if (clubs.length === 0) {
            container.innerHTML = `
                <div class="clb-empty-state">
                    <i class="fas fa-search"></i>
                    <h3>Không tìm thấy câu lạc bộ</h3>
                    <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác.</p>
                    <button class="btn btn-primary" onclick="window.clbPage.resetFilters()">
                        <i class="fas fa-refresh"></i>
                        Đặt lại bộ lọc
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = clubs.map(club => `
            <div class="featured-club-card" data-club-id="${club.id}">
                <div class="club-card-banner ${club.category}">
                    <i class="${this.getCategoryIcon(club.category)}"></i>
                    <div class="club-status-badge">${this.getStatusLabel(club.status)}</div>
                </div>
                <div class="club-card-content">
                    <div class="club-card-header">
                        <h3 class="club-card-title">${club.name}</h3>
                        <div class="club-card-category">
                            <i class="${this.getCategoryIcon(club.category)}"></i>
                            ${this.getCategoryLabel(club.category)}
                        </div>
                    </div>
                    
                    <p class="club-card-description">${club.description}</p>
                    
                    <div class="club-card-stats">
                        <div class="club-stat-item">
                            <div class="club-stat-value">${club.members}</div>
                            <div class="club-stat-label">Thành viên</div>
                        </div>
                        <div class="club-stat-item">
                            <div class="club-stat-value">${club.events}</div>
                            <div class="club-stat-label">Sự kiện</div>
                        </div>
                        <div class="club-stat-item">
                            <div class="club-stat-value">${club.rating}</div>
                            <div class="club-stat-label">Đánh giá</div>
                        </div>
                    </div>
                    
                    <div class="club-card-actions">
                        <button class="club-btn club-btn-primary">
                            <i class="fas fa-user-plus"></i>
                            Tham gia
                        </button>
                        <button class="club-btn club-btn-outline">
                            <i class="fas fa-eye"></i>
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderRecentActivities(activities) {
        const container = this.elements.activitiesTimeline;
        if (!container) return;

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-header">
                        <div>
                            <h4 class="activity-title">${activity.title}</h4>
                            <div class="activity-club">${activity.club}</div>
                        </div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                    <p class="activity-description">${activity.description}</p>
                    <div class="activity-tags">
                        <span class="activity-tag ${activity.type}">${this.getActivityTypeLabel(activity.type)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Utility Functions
    getCategoryIcon(category) {
        const icons = {
            'technology': 'fas fa-laptop-code',
            'culture': 'fas fa-music',
            'sports': 'fas fa-basketball-ball',
            'social': 'fas fa-hands-helping',
            'academic': 'fas fa-graduation-cap',
            'business': 'fas fa-briefcase'
        };
        return icons[category] || 'fas fa-users';
    }

    getCategoryLabel(category) {
        const labels = {
            'technology': 'Công nghệ',
            'culture': 'Văn hóa',
            'sports': 'Thể thao',
            'social': 'Xã hội',
            'academic': 'Học thuật',
            'business': 'Kinh doanh'
        };
        return labels[category] || category;
    }

    getStatusLabel(status) {
        const labels = {
            'active': 'Hoạt động',
            'recruiting': 'Tuyển thành viên',
            'inactive': 'Tạm nghỉ',
            'pending': 'Chờ duyệt'
        };
        return labels[status] || status;
    }

    getActivityTypeLabel(type) {
        const labels = {
            'event': 'Sự kiện',
            'recruitment': 'Tuyển dụng',
            'achievement': 'Thành tích',
            'announcement': 'Thông báo'
        };
        return labels[type] || type;
    }

    // Action Handlers
    handleActionClick(action, url) {
        const actions = {
            'clubs-list': () => {
                this.showNotification('Đang chuyển đến danh sách CLB...', 'info');
                setTimeout(() => window.location.href = url, 500);
            },
            'clubs-manage': () => {
                this.showNotification('Đang mở trang quản lý CLB...', 'info');
                setTimeout(() => window.location.href = url, 500);
            },
            'clubs-events': () => {
                this.showNotification('Đang xem sự kiện CLB...', 'info');
                setTimeout(() => window.location.href = url, 500);
            },
            'clubs-members': () => {
                this.showNotification('Đang mở quản lý thành viên...', 'info');
                setTimeout(() => window.location.href = url, 500);
            }
        };

        const actionFn = actions[action];
        if (actionFn) {
            actionFn();
        } else {
            window.location.href = url;
        }
    }

    handleJoinClub(clubId) {
        const club = this.clubsData.find(c => c.id == clubId);
        if (!club) return;

        if (this.currentUser.joinedClubs.includes(club.name)) {
            this.showNotification(`Bạn đã là thành viên của ${club.name}`, 'warning');
            return;
        }

        // Simulate join process
        this.showNotification(`Đang gửi yêu cầu tham gia ${club.name}...`, 'info');
        
        setTimeout(() => {
            this.currentUser.joinedClubs.push(club.name);
            club.members += 1;
            this.showNotification(`Đã gửi yêu cầu tham gia ${club.name} thành công! 🎉`, 'success');
            this.updateStats();
            this.renderFeaturedClubs(this.clubsData.slice(0, 3));
        }, 2000);
    }

    handleViewClub(clubId) {
        const club = this.clubsData.find(c => c.id == clubId);
        if (!club) return;

        this.showNotification(`Đang xem chi tiết ${club.name}...`, 'info');
        
        // Simulate navigation
        setTimeout(() => {
            window.location.href = `clubs.html?id=${clubId}`;
        }, 1000);
    }

    // Stats Updates
    updateStats() {
        const statsData = {
            totalClubs: this.clubsData.length,
            totalMembers: this.clubsData.reduce((sum, club) => sum + club.members, 0),
            totalEvents: this.clubsData.reduce((sum, club) => sum + club.events, 0),
            activeClubs: this.clubsData.filter(club => club.status === 'active').length,
            userJoinedClubs: this.currentUser.joinedClubs.length
        };

        // Update stats cards
        document.querySelectorAll('.clb-stat-card').forEach((card, index) => {
            const values = [
                statsData.totalClubs,
                statsData.totalMembers,
                statsData.totalEvents,
                statsData.activeClubs
            ];
            
            const h3 = card.querySelector('h3');
            if (h3 && values[index] !== undefined) {
                this.animateCounter(h3, parseInt(h3.textContent), values[index]);
            }
        });
    }

    animateCounter(element, start, end, duration = 1000) {
        const range = end - start;
        const startTime = Date.now();
        
        const updateCounter = () => {
            const currentTime = Date.now();
            const elapsed = Math.min(currentTime - startTime, duration);
            const progress = elapsed / duration;
            
            const current = Math.floor(start + (range * progress));
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    }

    // Notification System
    toggleNotificationPanel() {
        const panel = this.elements.notificationPanel;
        if (panel) {
            panel.classList.toggle('show');
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        const existingToasts = document.querySelectorAll('.notification-toast');
        const offset = (existingToasts.length - 1) * 70;
        notification.style.top = `${20 + offset}px`;

        setTimeout(() => notification.classList.add('show'), 100);

        const removeNotification = () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                this.repositionNotifications();
            }, 300);
        };

        notification.querySelector('.toast-close').addEventListener('click', removeNotification);
        setTimeout(removeNotification, duration);
    }

    getNotificationIcon(type) {
        const icons = {
            'info': 'fa-info-circle',
            'success': 'fa-check-circle',
            'warning': 'fa-exclamation-triangle',
            'error': 'fa-times-circle'
        };
        return icons[type] || 'fa-bell';
    }

    repositionNotifications() {
        const toasts = document.querySelectorAll('.notification-toast');
        toasts.forEach((toast, index) => {
            toast.style.top = `${20 + (index * 70)}px`;
        });
    }

    // Filter Reset
    resetFilters() {
        this.filters = { category: 'all', status: 'all', search: '' };
        
        if (this.elements.categoryFilter) this.elements.categoryFilter.value = 'all';
        if (this.elements.statusFilter) this.elements.statusFilter.value = 'all';
        if (this.elements.searchInput) this.elements.searchInput.value = '';
        
        this.applyFilters();
        this.showNotification('Đã đặt lại tất cả bộ lọc', 'success');
    }

    // Event Handlers
    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    if (this.elements.searchInput) {
                        this.elements.searchInput.focus();
                    }
                    break;
                case 'n':
                    e.preventDefault();
                    this.toggleNotificationPanel();
                    break;
            }
        }

        if (e.key === 'Escape') {
            this.hideSearchResults();
            this.closeMobileMenu();
        }
    }

    handleResize() {
        if (window.innerWidth > 1024) {
            this.closeMobileMenu();
        }
    }

    handleVisibilityChange() {
        if (!document.hidden) {
            // Refresh data when page becomes visible
            this.loadClubsData();
            this.updateStats();
        }
    }

    animateElements() {
        const animateOnScroll = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(animateOnScroll, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.clb-stat-card, .clb-action-card, .featured-club-card, .activity-item').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize CLB page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.clbPage = new CLBModernPage();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CLBModernPage;
}
