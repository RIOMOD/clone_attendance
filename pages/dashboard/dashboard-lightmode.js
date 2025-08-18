/* Dashboard Light Mode - Enhanced Header Functionality */

// Dashboard Header Management
class DashboardHeader {
    constructor() {
        this.isSearchActive = false;
        this.isUserMenuOpen = false;
        this.isMobileSidebarOpen = false;
        this.searchTimeout = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupSearch();
        this.setupNotifications();
        this.setupTheme();
        this.loadUserData();
    }

    bindEvents() {
        // User Menu Toggle
        const userMenu = document.getElementById('userMenu');
        const userDropdown = document.getElementById('userDropdown');

        if (userMenu) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }

        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileSidebar();
            });
        }

        // Action Buttons
        this.setupActionButtons();

        // Global Click Handler
        document.addEventListener('click', (e) => {
            if (!userMenu.contains(e.target)) {
                this.closeUserMenu();
            }
            if (!document.getElementById('globalSearch').contains(e.target)) {
                this.closeSearch();
            }
        });

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    setupActionButtons() {
        // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.showThemeInfo();
            });
        }

        // Quick Add
        const quickAdd = document.getElementById('quickAdd');
        if (quickAdd) {
            quickAdd.addEventListener('click', () => {
                this.showQuickAddMenu();
            });
        }

        // Notifications
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }

        // Messages
        const messageBtn = document.getElementById('messageBtn');
        if (messageBtn) {
            messageBtn.addEventListener('click', () => {
                this.showMessages();
            });
        }

        // Settings
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showQuickSettings();
            });
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('globalSearch');
        const searchBtn = document.getElementById('searchBtn');
        const searchResults = document.getElementById('searchResults');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });

            searchInput.addEventListener('focus', () => {
                this.showSearchSuggestions();
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
                if (e.key === 'Escape') {
                    this.closeSearch();
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch(searchInput.value);
            });
        }
    }

    setupNotifications() {
        this.updateNotificationBadges();
        this.startNotificationPolling();
    }

    setupTheme() {
        // Force Light Mode - không cho phép thay đổi theme
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('dashboard-theme', 'light');
    }

    loadUserData() {
        // Simulate loading user data
        const userData = {
            name: 'Admin User',
            role: 'Quản trị viên',
            email: 'admin@ctsv.edu.vn',
            avatar: '../../assets/images/avata/avata_admin.jpg'
        };

        this.updateUserDisplay(userData);
    }

    // User Menu Management
    toggleUserMenu() {
        const userMenu = document.getElementById('userMenu');
        const userDropdown = document.getElementById('userDropdown');

        this.isUserMenuOpen = !this.isUserMenuOpen;

        if (this.isUserMenuOpen) {
            userMenu.classList.add('active');
            userDropdown.classList.add('show');
            userDropdown.classList.add('animate-slide-down');
        } else {
            this.closeUserMenu();
        }
    }

    closeUserMenu() {
        const userMenu = document.getElementById('userMenu');
        const userDropdown = document.getElementById('userDropdown');

        this.isUserMenuOpen = false;
        userMenu.classList.remove('active');
        userDropdown.classList.remove('show');
    }

    // Mobile Sidebar Management
    toggleMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        this.isMobileSidebarOpen = !this.isMobileSidebarOpen;

        if (this.isMobileSidebarOpen) {
            sidebar.classList.add('open');
        } else {
            sidebar.classList.remove('open');
        }
    }

    // Search Functionality
    performSearch(query) {
        if (!query.trim()) {
            this.closeSearch();
            return;
        }

        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '<div class="search-loading">Đang tìm kiếm...</div>';
        searchResults.style.display = 'block';

        // Simulate search API call
        setTimeout(() => {
            this.displaySearchResults(this.mockSearchResults(query));
        }, 500);
    }

    mockSearchResults(query) {
        const allResults = [
            {
                type: 'student',
                icon: 'fas fa-user-graduate',
                title: 'Nguyễn Văn A',
                subtitle: 'Sinh viên - MSSV: 20210001',
                url: '#'
            },
            {
                type: 'club',
                icon: 'fas fa-users',
                title: 'CLB Lập trình CODEKING',
                subtitle: 'Câu lạc bộ - 150 thành viên',
                url: '../CLB/clubs.html'
            },
            {
                type: 'event',
                icon: 'fas fa-calendar',
                title: 'Hội thảo công nghệ 2024',
                subtitle: 'Sự kiện - 15/12/2024',
                url: '#'
            },
            {
                type: 'page',
                icon: 'fas fa-chart-bar',
                title: 'Thống kê chấm công',
                subtitle: 'Trang - Báo cáo và phân tích',
                url: '../statistics/personal-stats.html'
            }
        ];

        return allResults.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }

    displaySearchResults(results) {
        const searchResults = document.getElementById('searchResults');

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">Không tìm thấy kết quả nào</div>';
            return;
        }

        const resultsHTML = results.map(result => `
            <div class="search-result-item" onclick="window.location.href='${result.url}'">
                <div class="search-result-icon">
                    <i class="${result.icon}"></i>
                </div>
                <div class="search-result-content">
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-subtitle">${result.subtitle}</div>
                </div>
            </div>
        `).join('');

        searchResults.innerHTML = resultsHTML;
    }

    showSearchSuggestions() {
        const searchResults = document.getElementById('searchResults');
        const suggestions = [
            'Sinh viên mới nhất',
            'CLB hoạt động',
            'Sự kiện tháng này',
            'Báo cáo chấm công'
        ];

        const suggestionsHTML = suggestions.map(suggestion => `
            <div class="search-result-item" onclick="document.getElementById('globalSearch').value='${suggestion}'; dashboard.performSearch('${suggestion}')">
                <div class="search-result-icon">
                    <i class="fas fa-search"></i>
                </div>
                <div class="search-result-content">
                    <div class="search-result-title">${suggestion}</div>
                </div>
            </div>
        `).join('');

        searchResults.innerHTML = suggestionsHTML;
        searchResults.style.display = 'block';
    }

    closeSearch() {
        const searchResults = document.getElementById('searchResults');
        searchResults.style.display = 'none';
        this.isSearchActive = false;
    }

    // Action Button Handlers
    showThemeInfo() {
        this.showNotification('Light Mode đang được sử dụng. Giao diện sáng, chuyên nghiệp!', 'info');
    }

    showQuickAddMenu() {
        const quickActions = [
            { icon: 'fas fa-user-plus', text: 'Thêm sinh viên', action: 'addStudent' },
            { icon: 'fas fa-users', text: 'Tạo CLB mới', action: 'addClub' },
            { icon: 'fas fa-calendar-plus', text: 'Tạo sự kiện', action: 'addEvent' },
            { icon: 'fas fa-file-alt', text: 'Tạo báo cáo', action: 'addReport' }
        ];

        this.showActionMenu(quickActions, 'Thêm nhanh');
    }

    showNotifications() {
        const notifications = [
            {
                id: 1,
                type: 'info',
                title: 'Cập nhật hệ thống',
                message: 'Phiên bản mới đã được cài đặt',
                time: '2 phút trước',
                read: false
            },
            {
                id: 2,
                type: 'warning',
                title: 'CLB CODEKING',
                message: 'Cần phê duyệt hoạt động mới',
                time: '1 giờ trước',
                read: false
            },
            {
                id: 3,
                type: 'success',
                title: 'Chấm công hoàn tất',
                message: 'Báo cáo tháng 12 đã sẵn sàng',
                time: '3 giờ trước',
                read: true
            }
        ];

        this.showNotificationPanel(notifications);
    }

    showMessages() {
        const messages = [
            {
                id: 1,
                sender: 'Nguyễn Văn A',
                message: 'Xin chào, tôi cần hỗ trợ về chấm công',
                time: '5 phút trước',
                avatar: '../../assets/images/avata/avata_admin.jpg',
                read: false
            },
            {
                id: 2,
                sender: 'CLB CODEKING',
                message: 'Đăng ký hoạt động tháng mới',
                time: '1 giờ trước',
                avatar: '../../assets/images/imageCLB/LOGO_CODEKING/LOGO CODEKING.png',
                read: false
            }
        ];

        this.showMessagePanel(messages);
    }

    showQuickSettings() {
        const settings = [
            { icon: 'fas fa-palette', text: 'Light Mode', action: 'theme', active: true },
            { icon: 'fas fa-bell', text: 'Thông báo', action: 'notifications', active: true },
            { icon: 'fas fa-lock', text: 'Bảo mật', action: 'security', active: true },
            { icon: 'fas fa-language', text: 'Tiếng Việt', action: 'language', active: true }
        ];

        this.showSettingsMenu(settings);
    }

    // Notification Management
    updateNotificationBadges() {
        // Update notification badge
        const notificationBadge = document.getElementById('notificationBadge');
        if (notificationBadge) {
            notificationBadge.textContent = '5';
        }

        // Update message badge
        const messageBadge = document.getElementById('messageBadge');
        if (messageBadge) {
            messageBadge.textContent = '3';
        }
    }

    startNotificationPolling() {
        // Poll for new notifications every 30 seconds
        setInterval(() => {
            this.updateNotificationBadges();
        }, 30000);
    }

    // User Display Management
    updateUserDisplay(userData) {
        const userName = document.querySelector('.user-name');
        const userRole = document.querySelector('.user-role');
        const userAvatar = document.querySelector('.user-avatar');

        if (userName) userName.textContent = userData.name;
        if (userRole) userRole.textContent = userData.role;
        if (userAvatar) userAvatar.src = userData.avatar;
    }

    // Keyboard Shortcuts
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('globalSearch').focus();
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            this.closeUserMenu();
            this.closeSearch();
        }
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} animate-fade-up`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'info' ? 'info-circle' : type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showActionMenu(actions, title) {
        console.log(`Showing ${title} menu with actions:`, actions);
        // Implementation would show a dropdown menu
    }

    showNotificationPanel(notifications) {
        console.log('Showing notifications:', notifications);
        // Implementation would show notification panel
    }

    showMessagePanel(messages) {
        console.log('Showing messages:', messages);
        // Implementation would show message panel
    }

    showSettingsMenu(settings) {
        console.log('Showing settings menu:', settings);
        // Implementation would show settings menu
    }
}

// Dashboard Main Functions (for compatibility)
const dashboard = {
    openSettings: function () {
        window.location.href = '../profile/profile.html';
    },

    viewNotifications: function () {
        headerManager.showNotifications();
    },

    openHelp: function () {
        window.open('https://ctsv.edu.vn/help', '_blank');
    },

    switchAccount: function () {
        if (confirm('Bạn có muốn chuyển sang tài khoản khác không?')) {
            window.location.href = '../authen/login-professional.html';
        }
    }
};

// Initialize Dashboard Header when DOM is loaded
let headerManager;

document.addEventListener('DOMContentLoaded', function () {
    headerManager = new DashboardHeader();
    console.log('Dashboard Header Light Mode initialized successfully!');
});

// Global search function for compatibility
function performSearch(query) {
    if (headerManager) {
        headerManager.performSearch(query);
    }
}
