// Main Application JavaScript
// Entry point for the CTSV Attendance System

// Application state
const App = {
    // Configuration
    config: {
        version: '1.0.0',
        apiBaseUrl: '/api',
        localStoragePrefix: 'ctsv_attendance_',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        language: 'vi',
        theme: 'light',
        autoSave: true,
        debugMode: false
    },

    // Current user
    currentUser: null,

    // Application state
    state: {
        isLoading: false,
        currentView: 'dashboard',
        sidebarCollapsed: false,
        notifications: [],
        tasks: [],
        settings: {}
    },

    // Initialize application
    init() {
        console.log('Initializing CTSV Attendance System v' + this.config.version);
        
        this.loadSettings();
        this.loadUser();
        this.bindGlobalEvents();
        this.initializeModules();
        this.setupErrorHandling();
        
        console.log('Application initialized successfully');
    },

    // Load user settings
    loadSettings() {
        const savedSettings = localStorage.getItem(this.config.localStoragePrefix + 'settings');
        if (savedSettings) {
            this.state.settings = { ...this.config, ...JSON.parse(savedSettings) };
        } else {
            this.state.settings = { ...this.config };
        }
        
        // Apply theme
        this.applyTheme(this.state.settings.theme);
    },

    // Save user settings
    saveSettings() {
        localStorage.setItem(
            this.config.localStoragePrefix + 'settings', 
            JSON.stringify(this.state.settings)
        );
    },

    // Load current user
    loadUser() {
        const userData = localStorage.getItem(this.config.localStoragePrefix + 'currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUserInterface();
        } else {
            // Redirect to login if no user data
            if (!window.location.pathname.includes('login') && 
                !window.location.pathname.includes('register')) {
                // Check if we're already in pages directory
                const loginPath = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
                window.location.href = loginPath;
            }
        }
    },

    // Save current user
    saveUser(userData) {
        this.currentUser = userData;
        localStorage.setItem(
            this.config.localStoragePrefix + 'currentUser', 
            JSON.stringify(userData)
        );
        this.updateUserInterface();
    },

    // Update user interface elements
    updateUserInterface() {
        if (!this.currentUser) return;

        // Update user name in header
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            el.textContent = this.currentUser.fullName || this.currentUser.email;
        });

        // Update user avatar
        const userAvatarElements = document.querySelectorAll('.user-avatar');
        userAvatarElements.forEach(el => {
            if (this.currentUser.avatar) {
                el.src = this.currentUser.avatar;
            } else {
                el.style.display = 'none';
                // Show initials instead
                const initialsEl = el.nextElementSibling;
                if (initialsEl && initialsEl.classList.contains('user-initials')) {
                    initialsEl.textContent = this.getUserInitials();
                    initialsEl.style.display = 'flex';
                }
            }
        });

        // Update user role
        const userRoleElements = document.querySelectorAll('.user-role');
        userRoleElements.forEach(el => {
            el.textContent = this.getUserRoleText();
        });

        // Update user department
        const userDepartmentElements = document.querySelectorAll('.user-department');
        userDepartmentElements.forEach(el => {
            el.textContent = this.currentUser.department || 'Chưa xác định';
        });
    },

    // Get user initials
    getUserInitials() {
        if (!this.currentUser) return '';
        
        const name = this.currentUser.fullName || this.currentUser.email;
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[words.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    },

    // Get user role text
    getUserRoleText() {
        const roles = {
            admin: 'Quản trị viên',
            manager: 'Quản lý',
            employee: 'Nhân viên',
            intern: 'Thực tập sinh'
        };
        return roles[this.currentUser?.role] || 'Người dùng';
    },

    // Apply theme
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle buttons
        const themeToggles = document.querySelectorAll('.theme-toggle');
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    },

    // Toggle theme
    toggleTheme() {
        const currentTheme = this.state.settings.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.state.settings.theme = newTheme;
        this.applyTheme(newTheme);
        this.saveSettings();
        
        this.showNotification('Đã chuyển sang chủ đề ' + (newTheme === 'dark' ? 'tối' : 'sáng'));
    },

    // Bind global event listeners
    bindGlobalEvents() {
        // Theme toggle
        document.addEventListener('click', (e) => {
            if (e.target.matches('.theme-toggle') || e.target.closest('.theme-toggle')) {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        // Sidebar toggle
        document.addEventListener('click', (e) => {
            if (e.target.matches('.sidebar-toggle') || e.target.closest('.sidebar-toggle')) {
                e.preventDefault();
                this.toggleSidebar();
            }
        });

        // Logout handler
        document.addEventListener('click', (e) => {
            if (e.target.matches('.logout-btn') || e.target.closest('.logout-btn')) {
                e.preventDefault();
                this.logout();
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown.open').forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });

        // Dropdown toggles
        document.addEventListener('click', (e) => {
            const dropdownToggle = e.target.closest('.dropdown-toggle');
            if (dropdownToggle) {
                e.preventDefault();
                const dropdown = dropdownToggle.closest('.dropdown');
                dropdown.classList.toggle('open');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+K for search
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Escape to close modals/dropdowns
            if (e.key === 'Escape') {
                this.closeAllModals();
                this.closeAllDropdowns();
            }
        });

        // Auto-save functionality
        if (this.config.autoSave) {
            setInterval(() => {
                this.autoSave();
            }, 30000); // Auto-save every 30 seconds
        }

        // Online/offline status
        window.addEventListener('online', () => {
            this.updateConnectionStatus(true);
        });

        window.addEventListener('offline', () => {
            this.updateConnectionStatus(false);
        });

        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.handlePageVisible();
            }
        });
    },

    // Initialize modules
    initializeModules() {
        // Initialize calendar if present
        if (typeof Calendar !== 'undefined' && document.querySelector('.calendar-container')) {
            Calendar.init();
        }

        // Initialize task manager if present
        if (typeof TaskManager !== 'undefined' && document.querySelector('.task-container')) {
            TaskManager.init();
        }

        // Initialize notification system
        if (typeof NotificationManager !== 'undefined') {
            NotificationManager.init();
        }

        // Initialize dashboard if present
        if (typeof Dashboard !== 'undefined' && document.querySelector('.dashboard-container')) {
            Dashboard.init();
        }
    },

    // Setup global error handling
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.handleError('Đã xảy ra lỗi không mong muốn', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.handleError('Đã xảy ra lỗi trong xử lý dữ liệu', e.reason);
        });
    },

    // Toggle sidebar
    toggleSidebar() {
        this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
        document.body.classList.toggle('sidebar-collapsed', this.state.sidebarCollapsed);
        
        // Save preference
        localStorage.setItem(
            this.config.localStoragePrefix + 'sidebarCollapsed',
            this.state.sidebarCollapsed
        );
    },

    // Show notification
    showNotification(message, type = 'info', duration = 3000) {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date()
        };

        this.state.notifications.push(notification);

        // Create notification element
        const notificationEl = this.createNotificationElement(notification);
        const container = document.querySelector('.notification-container') || 
                         this.createNotificationContainer();
        
        container.appendChild(notificationEl);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification.id);
            }, duration);
        }

        return notification.id;
    },

    // Create notification element
    createNotificationElement(notification) {
        const div = document.createElement('div');
        div.className = `notification notification-${notification.type}`;
        div.dataset.id = notification.id;
        
        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        div.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${iconMap[notification.type] || iconMap.info}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
            </div>
            <button class="notification-close" onclick="App.removeNotification(${notification.id})">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add animation
        setTimeout(() => {
            div.classList.add('notification-show');
        }, 10);

        return div;
    },

    // Create notification container
    createNotificationContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    },

    // Remove notification
    removeNotification(id) {
        const notificationEl = document.querySelector(`[data-id="${id}"]`);
        if (notificationEl) {
            notificationEl.classList.add('notification-hide');
            setTimeout(() => {
                notificationEl.remove();
            }, 300);
        }

        this.state.notifications = this.state.notifications.filter(n => n.id !== id);
    },

    // Handle errors
    handleError(message, error = null) {
        console.error(message, error);
        this.showNotification(message, 'error', 5000);
    },

    // Auto-save functionality
    autoSave() {
        try {
            // Save current state
            this.saveSettings();
            
            // Trigger auto-save in modules
            if (typeof TaskManager !== 'undefined') {
                TaskManager.autoSave();
            }
            
            if (typeof Calendar !== 'undefined') {
                Calendar.autoSave();
            }
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    },

    // Update connection status
    updateConnectionStatus(isOnline) {
        const statusElements = document.querySelectorAll('.connection-status');
        statusElements.forEach(el => {
            el.className = `connection-status ${isOnline ? 'online' : 'offline'}`;
            el.innerHTML = `
                <i class="fas fa-circle"></i>
                ${isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
            `;
        });

        this.showNotification(
            isOnline ? 'Đã kết nối internet' : 'Mất kết nối internet',
            isOnline ? 'success' : 'warning'
        );
    },

    // Handle page becoming visible
    handlePageVisible() {
        // Refresh data when page becomes visible
        if (typeof Dashboard !== 'undefined') {
            Dashboard.refresh();
        }
        
        if (typeof TaskManager !== 'undefined') {
            TaskManager.refresh();
        }
    },

    // Close all modals
    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.style.display = 'none';
        });
    },

    // Close all dropdowns
    closeAllDropdowns() {
        document.querySelectorAll('.dropdown.open').forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    },

    // Logout user
    logout() {
        // Clear user data
        localStorage.removeItem(this.config.localStoragePrefix + 'currentUser');
        this.currentUser = null;

        // Show logout message
        this.showNotification('Đã đăng xuất thành công', 'success');

        // Redirect to login page
        setTimeout(() => {
            // Check if we're already in pages directory
            const loginPath = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
            window.location.href = loginPath;
        }, 1000);
    },

    // Utility functions
    formatDate(date, format = null) {
        if (!date) return '';
        
        const d = new Date(date);
        const fmt = format || this.state.settings.dateFormat;
        
        if (fmt === 'DD/MM/YYYY') {
            return d.toLocaleDateString('vi-VN');
        } else if (fmt === 'MM/DD/YYYY') {
            return d.toLocaleDateString('en-US');
        } else if (fmt === 'YYYY-MM-DD') {
            return d.toISOString().split('T')[0];
        }
        
        return d.toLocaleDateString();
    },

    formatTime(date, format = null) {
        if (!date) return '';
        
        const d = new Date(date);
        const fmt = format || this.state.settings.timeFormat;
        
        if (fmt === 'HH:mm') {
            return d.toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else if (fmt === 'hh:mm A') {
            return d.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        }
        
        return d.toLocaleTimeString();
    },

    formatDateTime(date) {
        return this.formatDate(date) + ' ' + this.formatTime(date);
    },

    // Generate unique ID
    generateId() {
        return Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for use in other modules
window.App = App;
