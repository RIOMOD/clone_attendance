// Modern Profile Manager - Dashboard Synchronized
class ModernProfileManager {
    constructor() {
        this.currentUser = {
            firstName: 'Nguyễn Văn',
            lastName: 'Admin',
            email: 'admin@ctsv.edu.vn',
            role: 'Quản trị hệ thống',
            avatar: '../../assets/images/avata/avata_admin.jpg'
        };

        this.init();
    }

    init() {
        console.log('🚀 Initializing Modern Profile Manager...');
        this.setupEventListeners();
        this.initTabNavigation();
        this.initAvatarUpload();
        this.initPasswordStrength();
        this.initFormValidation();
        this.initThemeToggle();
        this.initToggleSwitches();
        this.initConfirmModal();
        this.loadUserData();
        console.log('✅ Modern Profile Manager initialized successfully!');
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleSidebar());
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.collapseSidebar());
        }

        // Search functionality
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // User menu dropdown
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.addEventListener('click', () => this.toggleUserDropdown());
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Notification button
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }

        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showQuickSettings());
        }

        // Page action buttons
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetAllSettings());
        }

        const saveAllBtn = document.getElementById('saveAllBtn');
        if (saveAllBtn) {
            saveAllBtn.addEventListener('click', () => this.saveAllData());
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                this.hideUserDropdown();
            }
        });
    }

    // Tab Navigation System
    initTabNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[data-tab]');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = link.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const hash = window.location.hash.slice(1);
            if (hash) {
                this.switchTab(hash);
            }
        });

        // Check for initial hash
        const hash = window.location.hash.slice(1);
        if (hash) {
            this.switchTab(hash);
        }
    }

    switchTab(tabId) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

        // Activate new tab
        const navItem = document.querySelector(`[data-tab="${tabId}"]`)?.closest('.nav-item');
        const tabContent = document.getElementById(tabId);

        if (navItem && tabContent) {
            navItem.classList.add('active');
            tabContent.classList.add('active');

            // Update URL
            window.history.replaceState(null, null, `#${tabId}`);

            // Add fade-in animation
            tabContent.classList.add('fade-in');

            // Update page title
            const tabTitle = navItem.querySelector('.nav-text')?.textContent || 'Hồ sơ cá nhân';
            document.title = `${tabTitle} - Hệ thống Chấm Công CTSV`;

            console.log(`📑 Switched to tab: ${tabId}`);
        }
    }

    // Sidebar Management
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    }

    collapseSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
    }

    // Search Functionality
    handleSearch(query) {
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }

        console.log('🔍 Searching for:', query);

        // Search through tabs and settings
        const searchableItems = [
            { title: 'Thông tin cá nhân', tab: 'personal-info', keywords: ['thông tin', 'cá nhân', 'hồ sơ', 'tên', 'email'] },
            { title: 'Bảo mật tài khoản', tab: 'security', keywords: ['bảo mật', 'mật khẩu', '2fa', 'đăng nhập'] },
            { title: 'Tùy chọn giao diện', tab: 'preferences', keywords: ['tùy chọn', 'giao diện', 'theme', 'ngôn ngữ'] },
            { title: 'Cài đặt thông báo', tab: 'notifications', keywords: ['thông báo', 'email', 'push', 'notification'] },
            { title: 'Quyền riêng tư', tab: 'privacy', keywords: ['quyền riêng tư', 'privacy', 'dữ liệu', 'hiển thị'] }
        ];

        const results = searchableItems.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
        );

        this.showSearchResults(results);
    }

    showSearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.style.display = 'none';
            return;
        }

        const html = results.map(result => `
            <div class="search-result-item" onclick="profileManager.switchTab('${result.tab}')">
                <i class="fas fa-search"></i>
                <div class="result-content">
                    <div class="result-title">${result.title}</div>
                    <div class="result-meta">Cài đặt hồ sơ</div>
                </div>
            </div>
        `).join('');

        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }

    hideSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    // User Menu Management
    toggleUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    hideUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    // Avatar Upload Management
    initAvatarUpload() {
        const avatarInput = document.getElementById('avatarInput');
        const avatarPreview = document.getElementById('avatarPreview');
        const avatarOverlay = document.querySelector('.avatar-overlay');
        const uploadBtn = document.getElementById('uploadAvatar');
        const removeBtn = document.getElementById('removeAvatar');

        // Click to upload
        if (avatarOverlay) {
            avatarOverlay.addEventListener('click', () => avatarInput?.click());
        }

        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => avatarInput?.click());
        }

        // Handle file selection
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleAvatarUpload(file, avatarPreview);
                }
            });
        }

        // Remove avatar
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.showConfirmModal(
                    'Xóa ảnh đại diện',
                    'Bạn có chắc chắn muốn xóa ảnh đại diện hiện tại?',
                    () => this.removeAvatar(avatarPreview)
                );
            });
        }
    }

    handleAvatarUpload(file, previewElement) {
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            this.showMessage('Kích thước file không được vượt quá 2MB', 'error');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showMessage('Vui lòng chọn file hình ảnh hợp lệ', 'error');
            return;
        }

        // Read and preview file
        const reader = new FileReader();
        reader.onload = (e) => {
            if (previewElement) {
                previewElement.src = e.target.result;
                this.showMessage('Ảnh đại diện đã được cập nhật thành công', 'success');
            }
        };
        reader.readAsDataURL(file);
    }

    removeAvatar(previewElement) {
        if (previewElement) {
            previewElement.src = '../../assets/images/avata/avata_admin.jpg';
            const avatarInput = document.getElementById('avatarInput');
            if (avatarInput) avatarInput.value = '';
            this.showMessage('Ảnh đại diện đã được xóa', 'success');
        }
    }

    // Password Strength Indicator
    initPasswordStrength() {
        const newPasswordInput = document.getElementById('newPassword');
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', (e) => {
                const password = e.target.value;
                this.updatePasswordStrength(password);
            });
        }
    }

    updatePasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        if (!strengthBar || !strengthText) return;

        const strength = this.calculatePasswordStrength(password);

        strengthBar.style.width = strength.percentage + '%';
        strengthBar.style.backgroundColor = strength.color;
        strengthText.textContent = strength.text;
        strengthText.style.color = strength.color;
    }

    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        if (password.length >= 8) score += 25;
        else feedback.push('ít nhất 8 ký tự');

        if (/[A-Z]/.test(password)) score += 25;
        else feedback.push('chữ hoa');

        if (/[a-z]/.test(password)) score += 25;
        else feedback.push('chữ thường');

        if (/[\d\W]/.test(password)) score += 25;
        else feedback.push('số hoặc ký tự đặc biệt');

        let result = { percentage: score, color: '#ef4444', text: 'Rất yếu' };

        if (score >= 100) {
            result = { percentage: score, color: '#22c55e', text: 'Rất mạnh' };
        } else if (score >= 75) {
            result = { percentage: score, color: '#84cc16', text: 'Mạnh' };
        } else if (score >= 50) {
            result = { percentage: score, color: '#f59e0b', text: 'Trung bình' };
        } else if (score >= 25) {
            result = { percentage: score, color: '#f97316', text: 'Yếu' };
        }

        if (feedback.length > 0 && password.length > 0) {
            result.text += ` (Cần: ${feedback.join(', ')})`;
        }

        return result;
    }

    // Form Validation
    initFormValidation() {
        const personalInfoForm = document.getElementById('personalInfoForm');
        const passwordForm = document.getElementById('passwordChangeForm');

        if (personalInfoForm) {
            personalInfoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePersonalInfoSubmit(personalInfoForm);
            });
        }

        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePasswordChangeSubmit(passwordForm);
            });
        }

        // Password toggle buttons
        document.querySelectorAll('.password-toggle').forEach(btn => {
            btn.addEventListener('click', () => this.togglePasswordVisibility(btn));
        });
    }

    togglePasswordVisibility(button) {
        const input = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    }

    handlePersonalInfoSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email'];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (!input?.value?.trim()) {
                this.showFieldError(input, 'Trường này là bắt buộc');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });

        // Validate email format
        const emailInput = form.querySelector('[name="email"]');
        if (emailInput?.value && !this.isValidEmail(emailInput.value)) {
            this.showFieldError(emailInput, 'Địa chỉ email không hợp lệ');
            isValid = false;
        }

        if (isValid) {
            this.showLoadingButton(form.querySelector('button[type="submit"]'));

            // Simulate API call
            setTimeout(() => {
                this.hideLoadingButton(form.querySelector('button[type="submit"]'));
                this.saveUserData(data);
                this.showMessage('Thông tin cá nhân đã được cập nhật thành công!', 'success');
            }, 1500);
        }
    }

    handlePasswordChangeSubmit(form) {
        const currentPassword = form.querySelector('[name="currentPassword"]')?.value;
        const newPassword = form.querySelector('[name="newPassword"]')?.value;
        const confirmPassword = form.querySelector('[name="confirmPassword"]')?.value;

        let isValid = true;

        // Validate inputs
        if (!currentPassword) {
            this.showFieldError(form.querySelector('[name="currentPassword"]'), 'Vui lòng nhập mật khẩu hiện tại');
            isValid = false;
        }

        if (!newPassword || newPassword.length < 8) {
            this.showFieldError(form.querySelector('[name="newPassword"]'), 'Mật khẩu mới phải có ít nhất 8 ký tự');
            isValid = false;
        }

        if (newPassword !== confirmPassword) {
            this.showFieldError(form.querySelector('[name="confirmPassword"]'), 'Mật khẩu xác nhận không khớp');
            isValid = false;
        }

        if (isValid) {
            this.showLoadingButton(form.querySelector('button[type="submit"]'));

            setTimeout(() => {
                this.hideLoadingButton(form.querySelector('button[type="submit"]'));
                form.reset();
                this.updatePasswordStrength(''); // Reset strength indicator
                this.showMessage('Mật khẩu đã được thay đổi thành công!', 'success');
            }, 1500);
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showFieldError(input, message) {
        this.clearFieldError(input);

        if (input) {
            input.style.borderColor = '#ef4444';
            input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';

            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                font-weight: 500;
            `;
            errorElement.textContent = message;

            input.parentNode.appendChild(errorElement);
        }
    }

    clearFieldError(input) {
        if (input) {
            input.style.borderColor = '';
            input.style.boxShadow = '';

            const existingError = input.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
        }
    }

    showLoadingButton(button) {
        if (button) {
            button.disabled = true;
            const originalText = button.innerHTML;
            button.dataset.originalText = originalText;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        }
    }

    hideLoadingButton(button) {
        if (button) {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || button.innerHTML;
        }
    }

    // Theme Management
    initThemeToggle() {
        const themeOptions = document.querySelectorAll('input[name="theme"]');

        themeOptions.forEach(option => {
            option.addEventListener('change', () => {
                if (option.checked) {
                    this.applyTheme(option.value);
                    this.saveThemePreference(option.value);
                }
            });
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.applyTheme(savedTheme);

        const themeOption = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
        if (themeOption) {
            themeOption.checked = true;
        }
    }

    toggleTheme() {
        const currentTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
        this.applyTheme(currentTheme);
        this.saveThemePreference(currentTheme);

        // Update theme selector
        const themeOption = document.querySelector(`input[name="theme"][value="${currentTheme}"]`);
        if (themeOption) {
            themeOption.checked = true;
        }
    }

    applyTheme(theme) {
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
        document.body.classList.add(`theme-${theme}`);

        // Update theme toggle button
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (theme === 'dark') {
                icon.classList.replace('fa-sun', 'fa-moon');
                themeToggle.title = 'Chế độ tối';
            } else {
                icon.classList.replace('fa-moon', 'fa-sun');
                themeToggle.title = 'Chế độ sáng';
            }
        }

        console.log(`🎨 Applied theme: ${theme}`);
    }

    saveThemePreference(theme) {
        localStorage.setItem('theme', theme);
        this.showMessage(`Đã chuyển sang chế độ ${theme === 'dark' ? 'tối' : 'sáng'}`, 'success');
    }

    // Toggle Switches Management
    initToggleSwitches() {
        const toggleSwitches = document.querySelectorAll('.toggle-switch input');

        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('change', () => {
                const settingName = toggle.closest('.notification-item, .privacy-item')
                    ?.querySelector('h4')?.textContent || 'Cài đặt';

                const status = toggle.checked ? 'bật' : 'tắt';
                this.showMessage(`${settingName} đã được ${status}`, 'success');

                this.saveSetting(toggle.id, toggle.checked);
            });
        });
    }

    // Confirmation Modal
    initConfirmModal() {
        const modal = document.getElementById('confirmModal');
        const closeBtn = modal?.querySelector('.close');
        const cancelBtn = document.getElementById('confirmCancel');
        const okBtn = document.getElementById('confirmOk');

        [closeBtn, cancelBtn].forEach(btn => {
            btn?.addEventListener('click', () => this.hideConfirmModal());
        });

        modal?.addEventListener('click', (e) => {
            if (e.target === modal) this.hideConfirmModal();
        });

        okBtn?.addEventListener('click', () => {
            if (this.confirmCallback) this.confirmCallback();
            this.hideConfirmModal();
        });

        // ESC key support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('show')) {
                this.hideConfirmModal();
            }
        });
    }

    showConfirmModal(title, message, callback) {
        const modal = document.getElementById('confirmModal');
        const titleElement = document.getElementById('confirmTitle');
        const messageElement = document.getElementById('confirmMessage');

        if (titleElement) titleElement.textContent = title;
        if (messageElement) messageElement.textContent = message;

        this.confirmCallback = callback;

        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideConfirmModal() {
        const modal = document.getElementById('confirmModal');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        this.confirmCallback = null;
    }

    // Notification System
    showMessage(message, type = 'success') {
        const container = document.getElementById('messageContainer');
        if (!container) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${type} slide-in-right`;
        messageElement.innerHTML = `
            <div class="message-content">
                <i class="fas ${this.getMessageIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="message-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(messageElement);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => messageElement.remove(), 300);
            }
        }, 5000);
    }

    getMessageIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    showNotifications() {
        this.showMessage('📢 Bạn có 2 thông báo mới!', 'info');
        console.log('📢 Showing notifications...');
    }

    showQuickSettings() {
        this.showMessage('⚙️ Mở cài đặt nhanh...', 'info');
        console.log('⚙️ Opening quick settings...');
    }

    // Data Management
    saveUserData(data) {
        try {
            const userData = { ...this.currentUser, ...data };
            localStorage.setItem('userData', JSON.stringify(userData));
            this.currentUser = userData;
            console.log('💾 User data saved:', userData);
        } catch (error) {
            console.error('❌ Error saving user data:', error);
            this.showMessage('Lỗi khi lưu dữ liệu người dùng', 'error');
        }
    }

    loadUserData() {
        const savedData = localStorage.getItem('userData');
        if (savedData) {
            try {
                this.currentUser = { ...this.currentUser, ...JSON.parse(savedData) };
                this.populateFormData();
            } catch (error) {
                console.error('❌ Error loading user data:', error);
            }
        }

        this.loadSettings();
    }

    populateFormData() {
        Object.keys(this.currentUser).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = this.currentUser[key];
            }
        });
    }

    saveSetting(settingId, value) {
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        settings[settingId] = value;
        localStorage.setItem('userSettings', JSON.stringify(settings));
        console.log(`⚙️ Saved setting: ${settingId} = ${value}`);
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');

        Object.keys(settings).forEach(settingId => {
            const toggle = document.getElementById(settingId);
            if (toggle) {
                toggle.checked = settings[settingId];
            }
        });
    }

    // Bulk Operations
    resetAllSettings() {
        this.showConfirmModal(
            'Khôi phục cài đặt mặc định',
            'Bạn có chắc chắn muốn khôi phục tất cả cài đặt về mặc định? Hành động này không thể hoàn tác.',
            () => {
                localStorage.removeItem('userSettings');
                localStorage.removeItem('theme');
                this.showMessage('Đã khôi phục tất cả cài đặt về mặc định', 'success');
                setTimeout(() => window.location.reload(), 1000);
            }
        );
    }

    saveAllData() {
        this.showMessage('Đang lưu tất cả thay đổi...', 'info');

        // Simulate saving all forms
        setTimeout(() => {
            this.showMessage('Tất cả thay đổi đã được lưu thành công!', 'success');
        }, 1000);
    }

    // Export Data
    exportUserData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');

        const exportData = {
            userData,
            settings,
            theme: localStorage.getItem('theme') || 'light',
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `profile-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        this.showMessage('Dữ liệu đã được tải xuống thành công', 'success');
    }

    // Delete Account
    deleteAccount() {
        this.showConfirmModal(
            'Xóa tài khoản',
            'CẢNH BÁO: Bạn có chắc chắn muốn xóa tài khoản? Tất cả dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.',
            () => {
                localStorage.clear();
                this.showMessage('Tài khoản đã được xóa', 'success');
                setTimeout(() => {
                    window.location.href = '../authen/login-professional.html';
                }, 2000);
            }
        );
    }

    // Test Modal Function (for debugging)
    testModal() {
        this.showConfirmModal(
            'Test Modal',
            'Đây là modal test để kiểm tra xem modal có hoạt động không?',
            () => {
                console.log('✅ Modal confirmed!');
                this.showMessage('Modal test thành công!', 'success');
            }
        );
    }
}

// Initialize Profile Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ModernProfileManager();

    // Add event listeners for data actions
    const exportBtn = document.querySelector('.btn:has(.fa-download)');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            profileManager.exportUserData();
        });
    }

    const deleteBtn = document.querySelector('.btn-outline-danger:has(.fa-trash)');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            profileManager.deleteAccount();
        });
    }
});

// Add custom CSS for messages and animations
const customStyles = document.createElement('style');
customStyles.textContent = `
    .message-container {
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
    }

    .message {
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border-left: 4px solid;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideInRight 0.3s ease;
    }

    .message.success {
        border-left-color: #22c55e;
        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    }

    .message.error {
        border-left-color: #ef4444;
        background: linear-gradient(135deg, #fef2f2, #fee2e2);
    }

    .message.warning {
        border-left-color: #f59e0b;
        background: linear-gradient(135deg, #fffbeb, #fef3c7);
    }

    .message.info {
        border-left-color: #3b82f6;
        background: linear-gradient(135deg, #eff6ff, #dbeafe);
    }

    .message-content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
    }

    .message-content i {
        font-size: 1.1rem;
    }

    .message.success .message-content i { color: #22c55e; }
    .message.error .message-content i { color: #ef4444; }
    .message.warning .message-content i { color: #f59e0b; }
    .message.info .message-content i { color: #3b82f6; }

    .message-close {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.15s ease;
    }

    .message-close:hover {
        background: rgba(0,0,0,0.1);
        color: #374151;
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    /* Search Results Styling */
    .search-result-item {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        border-radius: 8px;
        margin: 4px;
        transition: background-color 0.15s ease;
    }

    .search-result-item:hover {
        background: var(--bg-tertiary);
    }

    .search-result-item i {
        color: var(--text-muted);
        width: 16px;
        text-align: center;
    }

    .result-content {
        flex: 1;
    }

    .result-title {
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 2px;
    }

    .result-meta {
        font-size: 0.875rem;
        color: var(--text-muted);
    }

    /* Additional form styling */
    .notification-item, .privacy-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        background: white;
        border-radius: 12px;
        margin-bottom: 12px;
        border: 1px solid var(--border-light);
        transition: all 0.15s ease;
    }

    .notification-item:hover, .privacy-item:hover {
        box-shadow: var(--shadow-md);
        border-color: var(--primary-200);
    }

    .notification-info h4, .privacy-info h4 {
        margin: 0 0 4px 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .notification-info p, .privacy-info p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .toggle-switch {
        position: relative;
        width: 48px;
        height: 24px;
        display: inline-block;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--gray-300);
        transition: .3s;
        border-radius: 24px;
    }

    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .3s;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .toggle-switch input:checked + .toggle-slider {
        background-color: var(--primary-500);
    }

    .toggle-switch input:checked + .toggle-slider:before {
        transform: translateX(24px);
    }

    /* Theme preview styling */
    .theme-options {
        display: flex;
        gap: 16px;
        margin-top: 8px;
    }

    .theme-option {
        flex: 1;
        cursor: pointer;
        text-align: center;
    }

    .theme-option input[type="radio"] {
        display: none;
    }

    .theme-preview {
        width: 100%;
        height: 80px;
        border-radius: 8px;
        border: 2px solid var(--border-light);
        margin-bottom: 8px;
        transition: all 0.15s ease;
        position: relative;
        overflow: hidden;
    }

    .theme-preview.light {
        background: #ffffff;
    }

    .theme-preview.light .preview-header {
        height: 20px;
        background: #f8f9fa;
        border-bottom: 1px solid #e5e7eb;
    }

    .theme-preview.dark {
        background: #1f2937;
    }

    .theme-preview.dark .preview-header {
        height: 20px;
        background: #374151;
        border-bottom: 1px solid #4b5563;
    }

    .theme-option input:checked + .theme-preview {
        border-color: var(--primary-500);
        box-shadow: 0 0 0 2px var(--primary-100);
    }

    .theme-option span {
        font-size: 0.875rem;
        color: var(--text-secondary);
        font-weight: 500;
    }

    /* Data actions styling */
    .data-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 16px;
    }

    .data-info {
        margin-top: 20px;
        padding: 16px;
        background: var(--bg-secondary);
        border-radius: 8px;
        border-left: 4px solid var(--warning-500);
    }

    .data-info p {
        margin: 8px 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
        line-height: 1.5;
    }

    /* Password input styling */
    .password-input {
        position: relative;
    }

    .password-toggle {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.15s ease;
    }

    .password-toggle:hover {
        color: var(--primary-600);
        background: var(--primary-50);
    }

    /* Password strength indicator */
    .password-strength {
        margin-top: 8px;
    }

    .strength-bar {
        height: 4px;
        background: var(--gray-200);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 4px;
    }

    .strength-fill {
        height: 100%;
        width: 0%;
        background: #ef4444;
        transition: all 0.3s ease;
        border-radius: 2px;
    }

    .strength-text {
        font-size: 0.875rem;
        color: var(--text-muted);
        font-weight: 500;
    }
`;

document.head.appendChild(customStyles);

console.log('🎨 Modern Profile Manager styles loaded successfully!');
