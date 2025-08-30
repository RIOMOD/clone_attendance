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

        // Enhanced Notifications
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotificationPanel();
            });
        }

        // Enhanced Messages
        const messageBtn = document.getElementById('messageBtn');
        if (messageBtn) {
            messageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMessagePanel();
            });
        }

        // Enhanced Settings
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSettingsPanel();
            });
        }

        // Setup panel event listeners
        this.setupPanelEvents();
    }

    setupPanelEvents() {
        // Global click handler to close panels
        document.addEventListener('click', (e) => {
            const notificationPanel = document.getElementById('notificationPanel');
            const messagePanel = document.getElementById('messagePanel');
            const settingsPanel = document.getElementById('settingsPanel');

            if (notificationPanel && !notificationPanel.contains(e.target) &&
                !document.getElementById('notificationBtn').contains(e.target)) {
                this.closeNotificationPanel();
            }

            if (messagePanel && !messagePanel.contains(e.target) &&
                !document.getElementById('messageBtn').contains(e.target)) {
                this.closeMessagePanel();
            }

            if (settingsPanel && !settingsPanel.contains(e.target) &&
                !document.getElementById('settingsBtn').contains(e.target)) {
                this.closeSettingsPanel();
            }
        });

        // Setup notification panel events
        this.setupNotificationPanelEvents();

        // Setup message panel events
        this.setupMessagePanelEvents();

        // Setup settings panel events
        this.setupSettingsPanelEvents();
    }

    setupNotificationPanelEvents() {
        // Mark all as read
        const markAllReadBtn = document.getElementById('markAllReadBtn');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                this.markAllNotificationsAsRead();
            });
        }

        // Clear all notifications
        const clearAllNotificationsBtn = document.getElementById('clearAllNotificationsBtn');
        if (clearAllNotificationsBtn) {
            clearAllNotificationsBtn.addEventListener('click', () => {
                this.clearAllNotifications();
            });
        }

        // Filter buttons
        const filterBtns = document.querySelectorAll('.notification-filters .filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterNotifications(btn.dataset.filter);
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Individual notification actions
        this.setupNotificationItemEvents();
    }

    setupNotificationItemEvents() {
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            // Mark as read when clicked
            item.addEventListener('click', () => {
                item.classList.remove('unread');
                this.updateNotificationBadge();
            });

            // Quick action buttons
            const quickActions = item.querySelectorAll('.btn-quick-action');
            quickActions.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleNotificationAction(btn, item);
                });
            });
        });
    }

    setupMessagePanelEvents() {
        // Enhanced Compose message
        const composeMessageBtn = document.getElementById('composeMessageBtn');
        if (composeMessageBtn) {
            composeMessageBtn.addEventListener('click', () => {
                this.openComposeMessage();
            });
        }

        // Mark all messages as read
        const markAllReadMessagesBtn = document.getElementById('markAllReadMessagesBtn');
        if (markAllReadMessagesBtn) {
            markAllReadMessagesBtn.addEventListener('click', () => {
                this.markAllMessagesAsRead();
            });
        }

        // Refresh messages
        const refreshMessagesBtn = document.getElementById('refreshMessagesBtn');
        if (refreshMessagesBtn) {
            refreshMessagesBtn.addEventListener('click', () => {
                this.refreshMessages();
            });
        }

        // Enhanced Message search
        const messageSearchInput = document.getElementById('messageSearchInput');
        const messageSearchBtn = document.getElementById('messageSearchBtn');
        const advancedSearchBtn = document.getElementById('advancedSearchBtn');

        if (messageSearchInput) {
            messageSearchInput.addEventListener('input', (e) => {
                this.searchMessages(e.target.value);
            });

            messageSearchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.searchMessages(e.target.value);
                }
            });
        }

        if (messageSearchBtn) {
            messageSearchBtn.addEventListener('click', () => {
                const query = messageSearchInput ? messageSearchInput.value : '';
                this.searchMessages(query);
            });
        }

        if (advancedSearchBtn) {
            advancedSearchBtn.addEventListener('click', () => {
                this.showNotification('Tính năng tìm kiếm nâng cao đang được phát triển', 'info');
            });
        }

        // Message filter buttons
        const messageFilterBtns = document.querySelectorAll('.message-filters .filter-btn');
        messageFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterMessages(btn.dataset.filter);
                // Update active state
                messageFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Compose Modal Events
        this.setupComposeModalEvents();

        // Individual message actions
        this.setupMessageItemEvents();
    }

    setupComposeModalEvents() {
        const composeModal = document.getElementById('composeMessageModal');
        const composeForm = document.getElementById('composeForm');
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        const fileInput = document.getElementById('fileInput');
        const attachFileBtn = document.getElementById('attachFileBtn');
        const composeTo = document.getElementById('composeTo');

        if (composeForm) {
            composeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }

        if (sendMessageBtn) {
            sendMessageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }

        if (attachFileBtn && fileInput) {
            attachFileBtn.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                this.handleFileAttachment(e.target.files);
            });
        }

        if (composeTo) {
            composeTo.addEventListener('input', (e) => {
                this.showRecipientSuggestions(e.target.value);
            });

            composeTo.addEventListener('focus', () => {
                const suggestions = document.getElementById('recipientSuggestions');
                if (suggestions) suggestions.style.display = 'block';
            });

            composeTo.addEventListener('blur', () => {
                setTimeout(() => {
                    const suggestions = document.getElementById('recipientSuggestions');
                    if (suggestions) suggestions.style.display = 'none';
                }, 200);
            });
        }

        // Close modal when clicking outside
        if (composeModal) {
            composeModal.addEventListener('click', (e) => {
                if (e.target === composeModal) {
                    this.closeComposeMessage();
                }
            });
        }

        // Compose tools
        const composeTools = document.querySelectorAll('.compose-tool');
        composeTools.forEach(tool => {
            tool.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleComposeTool(tool.id);
            });
        });
    }

    setupMessageItemEvents() {
        const messageItems = document.querySelectorAll('.message-item');
        messageItems.forEach(item => {
            // Mark as read when clicked
            item.addEventListener('click', () => {
                item.classList.remove('unread');
                this.updateMessageBadge();
                this.openMessage(item);
            });

            // Quick action buttons
            const quickActions = item.querySelectorAll('.btn-quick-action');
            quickActions.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleMessageAction(btn, item);
                });
            });
        });
    }

    setupSettingsPanelEvents() {
        // Settings toggles
        const toggles = document.querySelectorAll('.settings-panel input[type="checkbox"]');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.handleSettingToggle(e.target);
            });
        });

        // Settings selects
        const selects = document.querySelectorAll('.settings-panel select');
        selects.forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleSettingSelect(e.target);
            });
        });

        // Quick settings buttons
        const quickSettingBtns = document.querySelectorAll('.quick-setting-btn');
        quickSettingBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleQuickSetting(btn);
            });
        });

        // Save settings button
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettings();
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
                url: '../statistics/index.html'
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

    // Enhanced Notification Panel Management
    toggleNotificationPanel() {
        const panel = document.getElementById('notificationPanel');
        const messagePanel = document.getElementById('messagePanel');
        const settingsPanel = document.getElementById('settingsPanel');

        // Close other panels
        if (messagePanel) messagePanel.classList.remove('show');
        if (settingsPanel) settingsPanel.classList.remove('show');

        if (panel) {
            panel.classList.toggle('show');
            if (panel.classList.contains('show')) {
                this.loadNotifications();
                this.updateNotificationBadge();
            }
        }
    }

    closeNotificationPanel() {
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.classList.remove('show');
        }
    }

    loadNotifications() {
        // Simulate loading notifications from API
        console.log('Loading notifications...');
        // In a real app, this would fetch from an API
    }

    markAllNotificationsAsRead() {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        unreadItems.forEach(item => {
            item.classList.remove('unread');
        });
        this.updateNotificationBadge();
        this.showNotification('Đã đánh dấu tất cả thông báo là đã đọc', 'success');
    }

    clearAllNotifications() {
        if (confirm('Bạn có chắc chắn muốn xóa tất cả thông báo?')) {
            const notificationList = document.querySelector('.notification-list');
            if (notificationList) {
                notificationList.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-tertiary);">Không có thông báo nào</div>';
            }
            this.updateNotificationBadge(0);
            this.showNotification('Đã xóa tất cả thông báo', 'success');
        }
    }

    filterNotifications(filter) {
        const items = document.querySelectorAll('.notification-item');
        items.forEach(item => {
            let show = true;

            switch (filter) {
                case 'unread':
                    show = item.classList.contains('unread');
                    break;
                case 'important':
                    show = item.classList.contains('important');
                    break;
                case 'system':
                    show = item.dataset.type === 'system';
                    break;
                case 'all':
                default:
                    show = true;
                    break;
            }

            item.style.display = show ? 'flex' : 'none';
        });
    }

    handleNotificationAction(btn, item) {
        const action = btn.title.toLowerCase();
        const itemTitle = item.querySelector('.notification-item-title').textContent;

        switch (action) {
            case 'phê duyệt':
                this.approveNotification(item);
                break;
            case 'xem chi tiết':
                this.viewNotificationDetails(item);
                break;
            case 'xem danh sách':
                this.viewNotificationList(item);
                break;
            case 'xử lý ngay':
                this.handleNotificationImmediately(item);
                break;
            case 'tải xuống':
                this.downloadNotificationAttachment(item);
                break;
        }
    }

    approveNotification(item) {
        item.style.opacity = '0.6';
        this.showNotification('Đã phê duyệt thành công', 'success');
        setTimeout(() => {
            item.remove();
            this.updateNotificationBadge();
        }, 1000);
    }

    viewNotificationDetails(item) {
        const title = item.querySelector('.notification-item-title').textContent;
        this.showNotification(`Đang mở chi tiết: ${title}`, 'info');
        // In a real app, this would navigate to a details page
    }

    // Enhanced Message Panel Management
    toggleMessagePanel() {
        const panel = document.getElementById('messagePanel');
        const notificationPanel = document.getElementById('notificationPanel');
        const settingsPanel = document.getElementById('settingsPanel');

        // Close other panels
        if (notificationPanel) notificationPanel.classList.remove('show');
        if (settingsPanel) settingsPanel.classList.remove('show');

        if (panel) {
            panel.classList.toggle('show');
            if (panel.classList.contains('show')) {
                this.loadMessages();
                this.updateMessageCounter();
                // Focus on search input when panel opens
                setTimeout(() => {
                    const searchInput = document.getElementById('messageSearchInput');
                    if (searchInput) searchInput.focus();
                }, 300);
            }
        }
    }

    closeMessagePanel() {
        const panel = document.getElementById('messagePanel');
        if (panel) {
            panel.classList.remove('show');
        }
    }

    loadMessages() {
        console.log('Loading enhanced messages...');
        this.updateMessageCounter();
        this.loadMessageStats();
        // Simulate real-time message loading
        setTimeout(() => {
            this.checkNewMessages();
        }, 2000);
    }

    updateMessageCounter() {
        const unreadCount = document.querySelectorAll('.message-item.unread').length;
        const totalCount = document.querySelectorAll('.message-item').length;

        const counterText = document.getElementById('messageCounterText');
        const messageCount = document.querySelector('.message-count');

        if (counterText) {
            if (unreadCount > 0) {
                counterText.textContent = `${unreadCount} tin nhắn mới`;
                counterText.parentElement.style.background = 'var(--bg-gradient-2)';
            } else {
                counterText.textContent = 'Tất cả tin nhắn đã đọc';
                counterText.parentElement.style.background = 'var(--success)';
            }
        }

        if (messageCount) {
            messageCount.textContent = unreadCount;
            messageCount.style.display = unreadCount > 0 ? 'flex' : 'none';
        }

        // Update filter counts
        this.updateFilterCounts();
    }

    updateFilterCounts() {
        const unreadCount = document.querySelectorAll('.message-item.unread').length;
        const importantCount = document.querySelectorAll('.message-item.important, .message-item.priority-high').length;
        const archivedCount = document.querySelectorAll('.message-item.archived').length;

        const filters = document.querySelectorAll('.message-filters .filter-btn');
        filters.forEach(filter => {
            const countSpan = filter.querySelector('.filter-count');
            if (countSpan) countSpan.remove();

            let count = 0;
            const filterType = filter.dataset.filter;

            switch (filterType) {
                case 'unread':
                    count = unreadCount;
                    break;
                case 'important':
                    count = importantCount;
                    break;
                case 'archived':
                    count = archivedCount;
                    break;
            }

            if (count > 0 && filterType !== 'all') {
                const countElement = document.createElement('span');
                countElement.className = 'filter-count';
                countElement.textContent = count;
                filter.appendChild(countElement);
            }
        });
    }

    loadMessageStats() {
        const footerStats = document.querySelector('.message-footer-stats span');
        if (footerStats) {
            const visibleCount = document.querySelectorAll('.message-item:not([style*="display: none"])').length;
            const totalCount = document.querySelectorAll('.message-item').length;
            footerStats.textContent = `Hiển thị ${visibleCount}/${totalCount} tin nhắn`;
        }
    }

    checkNewMessages() {
        // Simulate checking for new messages
        console.log('Checking for new messages...');
        // In real implementation, this would make API calls
    }

    refreshMessages() {
        this.showNotification('Đang làm mới tin nhắn...', 'info');
        // Simulate refresh animation
        const refreshBtn = document.getElementById('refreshMessagesBtn');
        if (refreshBtn) {
            refreshBtn.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                refreshBtn.style.transform = 'rotate(0deg)';
                this.loadMessages();
                this.showNotification('Đã cập nhật tin nhắn', 'success');
            }, 1000);
        }
    }

    openComposeMessage() {
        const modal = document.getElementById('composeMessageModal');
        if (modal) {
            modal.classList.add('show');
            // Focus on recipient input
            setTimeout(() => {
                const toInput = document.getElementById('composeTo');
                if (toInput) toInput.focus();
            }, 300);
        }
        this.showNotification('Đang mở trình soạn tin nhắn...', 'info');
    }

    closeComposeMessage() {
        const modal = document.getElementById('composeMessageModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    markAllMessagesAsRead() {
        const unreadItems = document.querySelectorAll('.message-item.unread');
        let count = 0;

        unreadItems.forEach(item => {
            setTimeout(() => {
                item.classList.remove('unread');
                const indicator = item.querySelector('.message-status-indicator');
                if (indicator) indicator.remove();
                count++;

                if (count === unreadItems.length) {
                    this.updateMessageCounter();
                    this.showNotification(`Đã đánh dấu ${count} tin nhắn là đã đọc`, 'success');
                }
            }, count * 100); // Stagger the animation
        });
    }

    searchMessages(query) {
        const items = document.querySelectorAll('.message-item');
        let visibleCount = 0;

        items.forEach(item => {
            const content = item.textContent.toLowerCase();
            const sender = item.querySelector('.sender-name')?.textContent.toLowerCase() || '';
            const subject = item.querySelector('.message-subject')?.textContent.toLowerCase() || '';

            const matches = content.includes(query.toLowerCase()) ||
                sender.includes(query.toLowerCase()) ||
                subject.includes(query.toLowerCase()) ||
                query === '';

            item.style.display = matches ? 'flex' : 'none';
            if (matches) visibleCount++;
        });

        // Update footer stats
        this.loadMessageStats();

        // Show search results info
        if (query) {
            this.showNotification(`Tìm thấy ${visibleCount} tin nhắn phù hợp`, 'info');
        }
    }

    filterMessages(filter) {
        const items = document.querySelectorAll('.message-item');
        let visibleCount = 0;

        items.forEach(item => {
            let show = true;

            switch (filter) {
                case 'unread':
                    show = item.classList.contains('unread');
                    break;
                case 'important':
                    show = item.classList.contains('important') ||
                        item.classList.contains('priority-high') ||
                        item.classList.contains('priority-medium');
                    break;
                case 'archived':
                    show = item.classList.contains('archived');
                    break;
                case 'sent':
                    show = item.dataset.type === 'sent';
                    break;
                case 'all':
                default:
                    show = true;
                    break;
            }

            item.style.display = show ? 'flex' : 'none';
            if (show) visibleCount++;
        });

        // Update active filter button
        document.querySelectorAll('.message-filters .filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.loadMessageStats();
        this.showNotification(`Hiển thị ${visibleCount} tin nhắn`, 'info');
    }

    openMessage(item) {
        // Mark as read
        item.classList.remove('unread');
        const indicator = item.querySelector('.message-status-indicator');
        if (indicator) indicator.remove();

        const subject = item.querySelector('.message-subject').textContent;
        this.showNotification(`Đang mở tin nhắn: ${subject}`, 'info');
        this.updateMessageCounter();
    }

    replyToMessage(messageId) {
        const messageItem = document.querySelector(`[data-id="${messageId}"]`);
        if (messageItem) {
            // Toggle quick reply section
            const quickReply = messageItem.querySelector('.message-quick-reply');
            const isActive = messageItem.classList.contains('active');

            // Close all other active replies
            document.querySelectorAll('.message-item.active').forEach(item => {
                item.classList.remove('active');
            });

            if (!isActive) {
                messageItem.classList.add('active');
                setTimeout(() => {
                    const replyInput = quickReply.querySelector('.quick-reply-input');
                    if (replyInput) replyInput.focus();
                }, 300);
            }
        }
    }

    sendReply(messageId) {
        const messageItem = document.querySelector(`[data-id="${messageId}"]`);
        const replyInput = messageItem.querySelector('.quick-reply-input');
        const replyText = replyInput.value.trim();

        if (!replyText) {
            this.showNotification('Vui lòng nhập nội dung phản hồi', 'warning');
            replyInput.focus();
            return;
        }

        // Simulate sending reply
        this.showNotification('Đang gửi phản hồi...', 'info');

        setTimeout(() => {
            replyInput.value = '';
            messageItem.classList.remove('active');
            this.showNotification('Đã gửi phản hồi thành công', 'success');

            // Mark original message as read
            messageItem.classList.remove('unread');
            this.updateMessageCounter();
        }, 1500);
    }

    cancelReply(messageId) {
        const messageItem = document.querySelector(`[data-id="${messageId}"]`);
        if (messageItem) {
            messageItem.classList.remove('active');
            const replyInput = messageItem.querySelector('.quick-reply-input');
            if (replyInput) replyInput.value = '';
        }
    }

    toggleMessageExpand(contentElement) {
        const messageItem = contentElement.closest('.message-item');
        const preview = contentElement.querySelector('.message-preview');
        const expandBtn = contentElement.querySelector('.message-expand-btn');

        if (preview && expandBtn) {
            const isCollapsed = preview.classList.contains('message-content-collapsed');

            if (isCollapsed) {
                preview.classList.remove('message-content-collapsed');
                preview.classList.add('message-content-expanded');
                expandBtn.innerHTML = '<span>Thu gọn</span><i class="fas fa-chevron-up"></i>';
            } else {
                preview.classList.add('message-content-collapsed');
                preview.classList.remove('message-content-expanded');
                expandBtn.innerHTML = '<span>Xem thêm</span><i class="fas fa-chevron-down"></i>';
            }
        }

        // Mark as read when expanded
        if (!messageItem.classList.contains('unread')) {
            this.openMessage(messageItem);
        }
    }

    toggleImportant(messageId) {
        const messageItem = document.querySelector(`[data-id="${messageId}"]`);
        if (messageItem) {
            const isImportant = messageItem.classList.contains('important') ||
                messageItem.classList.contains('priority-high');

            if (isImportant) {
                messageItem.classList.remove('important', 'priority-high');
                messageItem.querySelector('.message-star')?.classList.remove('active');
                this.showNotification('Đã bỏ đánh dấu quan trọng', 'info');
            } else {
                messageItem.classList.add('important');
                const star = messageItem.querySelector('.message-star');
                if (star) star.classList.add('active');
                this.showNotification('Đã đánh dấu quan trọng', 'success');
            }

            this.updateFilterCounts();
        }
    }

    archiveMessage(messageId) {
        const messageItem = document.querySelector(`[data-id="${messageId}"]`);
        if (messageItem) {
            messageItem.classList.add('archived');
            messageItem.style.opacity = '0.6';

            this.showNotification('Đã lưu trữ tin nhắn', 'success');

            setTimeout(() => {
                messageItem.style.display = 'none';
                this.updateMessageCounter();
                this.loadMessageStats();
            }, 1000);
        }
    }

    forwardMessage(messageId) {
        const messageItem = document.querySelector(`[data-id="${messageId}"]`);
        if (messageItem) {
            const subject = messageItem.querySelector('.message-subject').textContent;

            // Open compose modal with forwarded content
            this.openComposeMessage();

            setTimeout(() => {
                const subjectInput = document.getElementById('composeSubject');
                const messageContent = document.getElementById('composeMessage');

                if (subjectInput) subjectInput.value = `Fwd: ${subject}`;
                if (messageContent) {
                    const originalContent = messageItem.querySelector('.message-preview').textContent;
                    messageContent.value = `\n\n--- Tin nhắn được chuyển tiếp ---\n${originalContent}`;
                }
            }, 500);
        }
    }

    deleteMessage(messageId) {
        if (confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) {
            const messageItem = document.querySelector(`[data-id="${messageId}"]`);
            if (messageItem) {
                messageItem.style.transition = 'all 0.3s ease';
                messageItem.style.opacity = '0';
                messageItem.style.transform = 'translateX(-100%)';

                this.showNotification('Đã xóa tin nhắn', 'success');

                setTimeout(() => {
                    messageItem.remove();
                    this.updateMessageCounter();
                    this.loadMessageStats();
                }, 300);
            }
        }
    }

    markResolved(messageId) {
        const messageItem = document.querySelector(`[data-id="${messageId}"]`);
        if (messageItem) {
            messageItem.classList.add('resolved');
            messageItem.style.opacity = '0.7';

            // Add resolved badge
            const badge = document.createElement('span');
            badge.className = 'message-type-badge resolved';
            badge.innerHTML = '<i class="fas fa-check"></i> Đã giải quyết';

            const meta = messageItem.querySelector('.message-meta');
            if (meta) meta.appendChild(badge);

            this.showNotification('Đã đánh dấu tin nhắn là đã giải quyết', 'success');
        }
    }

    downloadAttachment(filename) {
        this.showNotification(`Đang tải xuống: ${filename}`, 'info');

        // Simulate download
        setTimeout(() => {
            this.showNotification(`Đã tải xuống thành công: ${filename}`, 'success');
        }, 2000);
    }

    // Compose Message Functions
    selectRecipient(email, name) {
        const toInput = document.getElementById('composeTo');
        if (toInput) {
            toInput.value = `${name} <${email}>`;
        }

        const suggestions = document.getElementById('recipientSuggestions');
        if (suggestions) {
            suggestions.style.display = 'none';
        }
    }

    closeComposeModal() {
        this.closeComposeMessage();
    }

    sendMessage() {
        const to = document.getElementById('composeTo').value;
        const subject = document.getElementById('composeSubject').value;
        const message = document.getElementById('composeMessage').value;
        const priority = document.getElementById('composePriority').value;

        if (!to || !subject || !message) {
            this.showNotification('Vui lòng điền đầy đủ thông tin', 'warning');
            return;
        }

        this.showNotification('Đang gửi tin nhắn...', 'info');

        setTimeout(() => {
            this.closeComposeMessage();
            this.showNotification('Đã gửi tin nhắn thành công', 'success');

            // Clear form
            document.getElementById('composeForm').reset();
        }, 1500);
    }

    // Additional Message Panel Helper Methods
    handleFileAttachment(files) {
        if (!files || files.length === 0) return;

        const attachmentPreview = document.getElementById('attachmentPreview');
        const attachmentList = document.getElementById('attachmentList');

        if (!attachmentList) return;

        Array.from(files).forEach(file => {
            const attachmentItem = document.createElement('div');
            attachmentItem.className = 'attachment-preview-item';
            attachmentItem.innerHTML = `
                <div class="attachment-info">
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                    <small>(${this.formatFileSize(file.size)})</small>
                </div>
                <button class="remove-attachment" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;

            attachmentList.appendChild(attachmentItem);
        });

        if (attachmentPreview) {
            attachmentPreview.style.display = 'block';
        }

        this.showNotification(`Đã đính kèm ${files.length} tệp`, 'success');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showRecipientSuggestions(query) {
        const suggestions = document.getElementById('recipientSuggestions');
        if (!suggestions) return;

        if (query.length < 2) {
            suggestions.style.display = 'none';
            return;
        }

        // In a real app, this would search through a user database
        const mockUsers = [
            { name: 'Admin User', email: 'admin@ctsv.edu.vn' },
            { name: 'Dr. Nguyễn Văn A', email: 'nguyen.vana@ctsv.edu.vn' },
            { name: 'Trần Thị B', email: 'tran.thib@ctsv.edu.vn' },
            { name: 'Lê Văn C', email: 'le.vanc@ctsv.edu.vn' }
        ];

        const filtered = mockUsers.filter(user =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length > 0) {
            suggestions.innerHTML = filtered.map(user => `
                <div class="suggestion-item" onclick="selectRecipient('${user.email}', '${user.name}')">
                    <img src="../../assets/images/avata/avata_admin.jpg" alt="Avatar">
                    <div>
                        <div class="suggestion-name">${user.name}</div>
                        <div class="suggestion-email">${user.email}</div>
                    </div>
                </div>
            `).join('');

            suggestions.style.display = 'block';
        } else {
            suggestions.style.display = 'none';
        }
    }

    handleComposeTool(toolId) {
        const messageTextarea = document.getElementById('composeMessage');
        if (!messageTextarea) return;

        switch (toolId) {
            case 'attachFileBtn':
                const fileInput = document.getElementById('fileInput');
                if (fileInput) fileInput.click();
                break;

            case 'addEmojiBtn':
                this.showEmojiPicker(messageTextarea);
                break;

            case 'formatBoldBtn':
                this.formatText(messageTextarea, 'bold');
                break;

            case 'formatItalicBtn':
                this.formatText(messageTextarea, 'italic');
                break;

            case 'addImageBtn':
                this.showNotification('Tính năng thêm hình ảnh đang được phát triển', 'info');
                break;

            case 'scheduleBtn':
                this.showScheduleDialog();
                break;

            case 'saveDraftBtn':
                this.saveDraft();
                break;

            case 'templateBtn':
                this.showTemplateSelector();
                break;

            default:
                console.log('Unknown tool:', toolId);
        }
    }

    showEmojiPicker(textarea) {
        const emojis = ['😊', '😂', '😍', '👍', '👎', '❤️', '🔥', '💯', '🎉', '👏'];
        const selection = emojis[Math.floor(Math.random() * emojis.length)];

        const cursorPos = textarea.selectionStart;
        const textBefore = textarea.value.substring(0, cursorPos);
        const textAfter = textarea.value.substring(cursorPos);

        textarea.value = textBefore + selection + textAfter;
        textarea.focus();
        textarea.setSelectionRange(cursorPos + selection.length, cursorPos + selection.length);

        this.showNotification('Đã thêm emoji', 'success');
    }

    formatText(textarea, format) {
        const selected = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        if (!selected) {
            this.showNotification('Vui lòng chọn text để định dạng', 'warning');
            return;
        }

        let formatted = '';
        switch (format) {
            case 'bold':
                formatted = `**${selected}**`;
                break;
            case 'italic':
                formatted = `*${selected}*`;
                break;
        }

        const cursorPos = textarea.selectionStart;
        const textBefore = textarea.value.substring(0, cursorPos);
        const textAfter = textarea.value.substring(textarea.selectionEnd);

        textarea.value = textBefore + formatted + textAfter;
        textarea.focus();

        this.showNotification(`Đã định dạng text ${format}`, 'success');
    }

    showScheduleDialog() {
        this.showNotification('Tính năng lên lịch gửi đang được phát triển', 'info');
    }

    saveDraft() {
        const to = document.getElementById('composeTo').value;
        const subject = document.getElementById('composeSubject').value;
        const message = document.getElementById('composeMessage').value;

        const draft = {
            to, subject, message,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('messageDraft', JSON.stringify(draft));
        this.showNotification('Đã lưu bản nháp', 'success');
    }

    showTemplateSelector() {
        const templates = [
            { name: 'Thông báo sự kiện', content: 'Kính gửi [Tên],\n\nTôi xin thông báo về sự kiện [Tên sự kiện] sẽ diễn ra vào [Thời gian].\n\nTrân trọng,' },
            { name: 'Báo cáo tiến độ', content: 'Kính gửi [Tên],\n\nTôi xin báo cáo tiến độ công việc như sau:\n\n- [Mục 1]\n- [Mục 2]\n\nTrân trọng,' },
            { name: 'Yêu cầu hỗ trợ', content: 'Kính gửi [Tên],\n\nTôi cần hỗ trợ về vấn đề [Mô tả vấn đề].\n\nRất mong nhận được sự giúp đỡ từ bạn.\n\nTrân trọng,' }
        ];

        // In a real app, this would show a template selection modal
        const template = templates[0]; // Use first template for demo
        const messageTextarea = document.getElementById('composeMessage');
        if (messageTextarea) {
            messageTextarea.value = template.content;
        }

        this.showNotification(`Đã áp dụng mẫu: ${template.name}`, 'success');
    }

    // Global functions for HTML onclick events
    selectRecipient(email, name) {
        const toInput = document.getElementById('composeTo');
        if (toInput) {
            toInput.value = `${name} <${email}>`;
        }

        const suggestions = document.getElementById('recipientSuggestions');
        if (suggestions) {
            suggestions.style.display = 'none';
        }
    }

    toggleMessageExpand(contentElement) {
        const messageItem = contentElement.closest('.message-item');
        const preview = contentElement.querySelector('.message-preview');
        const expandBtn = contentElement.querySelector('.message-expand-btn');

        if (preview && expandBtn) {
            const isCollapsed = preview.classList.contains('message-content-collapsed');

            if (isCollapsed) {
                preview.classList.remove('message-content-collapsed');
                preview.classList.add('message-content-expanded');
                expandBtn.innerHTML = '<span>Thu gọn</span><i class="fas fa-chevron-up"></i>';
            } else {
                preview.classList.add('message-content-collapsed');
                preview.classList.remove('message-content-expanded');
                expandBtn.innerHTML = '<span>Xem thêm</span><i class="fas fa-chevron-down"></i>';
            }
        }

        // Mark as read when expanded
        if (messageItem && messageItem.classList.contains('unread')) {
            this.openMessage(messageItem);
        }
    }

    closeComposeModal() {
        this.closeComposeMessage();
    }    // Enhanced Settings Panel Management
    toggleSettingsPanel() {
        const panel = document.getElementById('settingsPanel');
        const notificationPanel = document.getElementById('notificationPanel');
        const messagePanel = document.getElementById('messagePanel');

        // Close other panels
        if (notificationPanel) notificationPanel.classList.remove('show');
        if (messagePanel) messagePanel.classList.remove('show');

        if (panel) {
            panel.classList.toggle('show');
            if (panel.classList.contains('show')) {
                this.loadSettings();
            }
        }
    }

    closeSettingsPanel() {
        const panel = document.getElementById('settingsPanel');
        if (panel) {
            panel.classList.remove('show');
        }
    }

    loadSettings() {
        // Load settings from localStorage
        const settings = JSON.parse(localStorage.getItem('dashboardSettings')) || {};

        // Apply loaded settings to UI
        Object.keys(settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[key];
                } else {
                    element.value = settings[key];
                }
            }
        });
    }

    handleSettingToggle(toggle) {
        const settingKey = toggle.id;
        const isEnabled = toggle.checked;

        switch (settingKey) {
            case 'darkModeToggle':
                this.toggleDarkMode(isEnabled);
                break;
            case 'autoCollapseSidebar':
                this.toggleAutoCollapseSidebar(isEnabled);
                break;
            case 'animationsEnabled':
                this.toggleAnimations(isEnabled);
                break;
            case 'desktopNotifications':
                this.toggleDesktopNotifications(isEnabled);
                break;
            case 'notificationSounds':
                this.toggleNotificationSounds(isEnabled);
                break;
            case 'dataOptimization':
                this.toggleDataOptimization(isEnabled);
                break;
        }

        this.showNotification(`Đã ${isEnabled ? 'bật' : 'tắt'} ${this.getSettingName(settingKey)}`, 'success');
    }

    handleSettingSelect(select) {
        const settingKey = select.id;
        const value = select.value;

        switch (settingKey) {
            case 'notificationFrequency':
                this.setNotificationFrequency(value);
                break;
            case 'autoRefreshInterval':
                this.setAutoRefreshInterval(value);
                break;
        }

        this.showNotification(`Đã cập nhật ${this.getSettingName(settingKey)}`, 'success');
    }

    handleQuickSetting(btn) {
        const action = btn.id;

        switch (action) {
            case 'clearCacheBtn':
                this.clearCache();
                break;
            case 'exportSettingsBtn':
                this.exportSettings();
                break;
            case 'resetSettingsBtn':
                this.resetSettings();
                break;
            case 'fullScreenBtn':
                this.toggleFullScreen();
                break;
        }
    }

    saveSettings() {
        const settings = {};

        // Collect all settings
        const toggles = document.querySelectorAll('.settings-panel input[type="checkbox"]');
        const selects = document.querySelectorAll('.settings-panel select');

        toggles.forEach(toggle => {
            settings[toggle.id] = toggle.checked;
        });

        selects.forEach(select => {
            settings[select.id] = select.value;
        });

        // Save to localStorage
        localStorage.setItem('dashboardSettings', JSON.stringify(settings));

        this.showNotification('Đã lưu cài đặt thành công', 'success');
        this.closeSettingsPanel();
    }

    // Helper methods
    updateNotificationBadge(count = null) {
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            if (count === null) {
                count = document.querySelectorAll('.notification-item.unread').length;
            }
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    updateMessageBadge(count = null) {
        const badge = document.getElementById('messageBadge');
        if (badge) {
            if (count === null) {
                count = document.querySelectorAll('.message-item.unread').length;
            }
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    getSettingName(key) {
        const names = {
            'darkModeToggle': 'chế độ tối',
            'autoCollapseSidebar': 'tự động thu gọn sidebar',
            'animationsEnabled': 'hiệu ứng animation',
            'desktopNotifications': 'thông báo desktop',
            'notificationSounds': 'âm thanh thông báo',
            'dataOptimization': 'tối ưu hóa dữ liệu',
            'notificationFrequency': 'tần suất kiểm tra thông báo',
            'autoRefreshInterval': 'tự động làm mới'
        };
        return names[key] || key;
    }

    toggleDarkMode(enabled) {
        document.documentElement.classList.toggle('dark-mode', enabled);
    }

    toggleAutoCollapseSidebar(enabled) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('auto-collapse', enabled);
        }
    }

    toggleAnimations(enabled) {
        document.documentElement.classList.toggle('no-animations', !enabled);
    }

    toggleDesktopNotifications(enabled) {
        if (enabled && 'Notification' in window) {
            Notification.requestPermission();
        }
    }

    clearCache() {
        if (confirm('Bạn có chắc chắn muốn xóa cache?')) {
            localStorage.clear();
            sessionStorage.clear();
            this.showNotification('Đã xóa cache thành công', 'success');
        }
    }

    exportSettings() {
        const settings = localStorage.getItem('dashboardSettings');
        const blob = new Blob([settings], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dashboard-settings.json';
        a.click();
        URL.revokeObjectURL(url);
        this.showNotification('Đã xuất cài đặt thành công', 'success');
    }

    resetSettings() {
        if (confirm('Bạn có chắc chắn muốn khôi phục cài đặt mặc định?')) {
            localStorage.removeItem('dashboardSettings');
            location.reload();
        }
    }

    toggleFullScreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
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

    // Initialize enhanced panel functionality
    headerManager.updateNotificationBadge();
    headerManager.updateMessageBadge();

    // Close panels when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.header-action') && !e.target.closest('.notification-panel, .message-panel, .settings-panel')) {
            headerManager.closeNotificationPanel();
            headerManager.closeMessagePanel();
            headerManager.closeSettingsPanel();
        }
    });

    // Enhanced keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    headerManager.toggleNotificationPanel();
                    break;
                case '2':
                    e.preventDefault();
                    headerManager.toggleMessagePanel();
                    break;
                case '3':
                    e.preventDefault();
                    headerManager.toggleSettingsPanel();
                    break;
            }
        }

        // Close panels with Escape key
        if (e.key === 'Escape') {
            headerManager.closeNotificationPanel();
            headerManager.closeMessagePanel();
            headerManager.closeSettingsPanel();
        }
    });

    // Auto-refresh notifications and messages
    setInterval(() => {
        const autoRefresh = document.getElementById('autoRefreshInterval');
        if (autoRefresh && autoRefresh.value !== 'never') {
            headerManager.updateNotificationBadge();
            headerManager.updateMessageBadge();
        }
    }, 60000); // Check every minute

    console.log('✅ Enhanced Dashboard Header with comprehensive panel functionality initialized');
});

// Global search function for compatibility
function performSearch(query) {
    if (headerManager) {
        headerManager.performSearch(query);
    }
}

// Global functions for HTML onclick events
function closeNotificationPanel() {
    if (headerManager) {
        headerManager.closeNotificationPanel();
    }
}

function closeMessagePanel() {
    if (headerManager) {
        headerManager.closeMessagePanel();
    }
}

function closeSettingsPanel() {
    if (headerManager) {
        headerManager.closeSettingsPanel();
    }
}

function closeComposeModal() {
    if (headerManager) {
        headerManager.closeComposeMessage();
    }
}

function selectRecipient(email, name) {
    if (headerManager) {
        headerManager.selectRecipient(email, name);
    }
}

function toggleMessageExpand(contentElement) {
    if (headerManager) {
        headerManager.toggleMessageExpand(contentElement);
    }
}

function downloadAttachment(filename) {
    if (headerManager) {
        headerManager.downloadAttachment(filename);
    }
}

function replyToMessage(messageId) {
    if (headerManager) {
        headerManager.replyToMessage(messageId);
    }
}

function sendReply(messageId) {
    if (headerManager) {
        headerManager.sendReply(messageId);
    }
}

function cancelReply(messageId) {
    if (headerManager) {
        headerManager.cancelReply(messageId);
    }
}

function toggleImportant(messageId) {
    if (headerManager) {
        headerManager.toggleImportant(messageId);
    }
}

function archiveMessage(messageId) {
    if (headerManager) {
        headerManager.archiveMessage(messageId);
    }
}

function forwardMessage(messageId) {
    if (headerManager) {
        headerManager.forwardMessage(messageId);
    }
}

function deleteMessage(messageId) {
    if (headerManager) {
        headerManager.deleteMessage(messageId);
    }
}

function markResolved(messageId) {
    if (headerManager) {
        headerManager.markResolved(messageId);
    }
}
