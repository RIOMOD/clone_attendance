// Profile Page JavaScript

class ProfileManager {
    constructor() {
        this.init();
    }

    init() {
        this.initTabs();
        this.initAvatarUpload();
        this.initPasswordStrength();
        this.initPasswordToggle();
        this.initFormValidation();
        this.initNotifications();
        this.initThemeToggle();
        this.initToggleSwitches();
        this.initConfirmModal();
        this.loadUserData();
    }

    // Tab Navigation
    initTabs() {
        const navItems = document.querySelectorAll('.profile-nav-list .nav-item a');
        const tabContents = document.querySelectorAll('.tab-content');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetTab = item.getAttribute('data-tab');
                
                // Remove active class from all nav items and tabs
                navItems.forEach(nav => nav.parentElement.classList.remove('active'));
                tabContents.forEach(tab => tab.classList.remove('active'));
                
                // Add active class to clicked nav item and corresponding tab
                item.parentElement.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Update URL hash without scrolling
                window.history.replaceState(null, null, `#${targetTab}`);
            });
        });

        // Check for hash in URL on load
        const hash = window.location.hash.slice(1);
        if (hash) {
            const targetNav = document.querySelector(`[data-tab="${hash}"]`);
            if (targetNav) {
                targetNav.click();
            }
        }
    }

    // Avatar Upload
    initAvatarUpload() {
        const avatarInput = document.getElementById('avatarInput');
        const avatarPreview = document.getElementById('avatarPreview');
        const removeBtn = document.getElementById('removeAvatar');
        const avatarOverlay = document.querySelector('.avatar-overlay');

        // Handle file upload
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (2MB max)
                if (file.size > 2 * 1024 * 1024) {
                    this.showMessage('Kích thước file không được vượt quá 2MB', 'error');
                    return;
                }

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    this.showMessage('Vui lòng chọn file hình ảnh', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    avatarPreview.src = e.target.result;
                    this.showMessage('Ảnh đại diện đã được cập nhật', 'success');
                };
                reader.readAsDataURL(file);
            }
        });

        // Handle avatar removal
        removeBtn.addEventListener('click', () => {
            this.showConfirmModal(
                'Xóa ảnh đại diện',
                'Bạn có chắc chắn muốn xóa ảnh đại diện hiện tại?',
                () => {
                    avatarPreview.src = 'https://via.placeholder.com/120/4A90E2/ffffff?text=Avatar';
                    avatarInput.value = '';
                    this.showMessage('Ảnh đại diện đã được xóa', 'success');
                }
            );
        });

        // Click on avatar to upload
        avatarOverlay.addEventListener('click', () => {
            avatarInput.click();
        });
    }

    // Password Strength Indicator
    initPasswordStrength() {
        const newPasswordInput = document.getElementById('newPassword');
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', (e) => {
                const password = e.target.value;
                const strength = this.calculatePasswordStrength(password);
                
                strengthBar.style.width = strength.percentage + '%';
                strengthBar.style.background = strength.color;
                strengthText.textContent = strength.text;
            });
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        // Length check
        if (password.length >= 8) score += 25;
        else feedback.push('ít nhất 8 ký tự');

        // Uppercase check
        if (/[A-Z]/.test(password)) score += 25;
        else feedback.push('chữ hoa');

        // Lowercase check
        if (/[a-z]/.test(password)) score += 25;
        else feedback.push('chữ thường');

        // Number or special character check
        if (/[\d\W]/.test(password)) score += 25;
        else feedback.push('số hoặc ký tự đặc biệt');

        let result = {
            percentage: score,
            color: '#e74c3c',
            text: 'Yếu'
        };

        if (score >= 75) {
            result.color = '#27ae60';
            result.text = 'Mạnh';
        } else if (score >= 50) {
            result.color = '#f39c12';
            result.text = 'Trung bình';
        } else if (score >= 25) {
            result.color = '#e67e22';
            result.text = 'Yếu';
        }

        if (feedback.length > 0 && password.length > 0) {
            result.text += ` (Cần: ${feedback.join(', ')})`;
        }

        return result;
    }

    // Password Toggle
    initPasswordToggle() {
        const passwordToggles = document.querySelectorAll('.password-toggle');
        
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const passwordInput = toggle.previousElementSibling;
                const icon = toggle.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        });
    }

    // Form Validation
    initFormValidation() {
        const personalInfoForm = document.getElementById('personalInfoForm');
        const passwordChangeForm = document.getElementById('passwordChangeForm');

        if (personalInfoForm) {
            personalInfoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePersonalInfoSubmit(personalInfoForm);
            });
        }

        if (passwordChangeForm) {
            passwordChangeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePasswordChangeSubmit(passwordChangeForm);
            });
        }

        // Real-time email validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                if (!this.isValidEmail(emailInput.value)) {
                    this.showFieldError(emailInput, 'Email không hợp lệ');
                } else {
                    this.clearFieldError(emailInput);
                }
            });
        }

        // Real-time phone validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                // Remove non-numeric characters except + and spaces
                e.target.value = e.target.value.replace(/[^\d+\s-]/g, '');
            });
        }
    }

    handlePersonalInfoSubmit(form) {
        const formData = new FormData(form);
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (like languages checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email'];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (!input.value.trim()) {
                this.showFieldError(input, 'Trường này là bắt buộc');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });

        // Validate email
        const emailInput = form.querySelector('[name="email"]');
        if (emailInput.value && !this.isValidEmail(emailInput.value)) {
            this.showFieldError(emailInput, 'Email không hợp lệ');
            isValid = false;
        }

        if (isValid) {
            // Simulate API call
            this.showLoadingButton(form.querySelector('button[type="submit"]'));
            
            setTimeout(() => {
                this.hideLoadingButton(form.querySelector('button[type="submit"]'));
                this.saveUserData(data);
                this.showMessage('Thông tin cá nhân đã được cập nhật thành công', 'success');
            }, 1500);
        }
    }

    handlePasswordChangeSubmit(form) {
        const currentPassword = form.querySelector('[name="currentPassword"]').value;
        const newPassword = form.querySelector('[name="newPassword"]').value;
        const confirmPassword = form.querySelector('[name="confirmPassword"]').value;

        let isValid = true;

        // Validate current password (simulate)
        if (!currentPassword) {
            this.showFieldError(form.querySelector('[name="currentPassword"]'), 'Vui lòng nhập mật khẩu hiện tại');
            isValid = false;
        }

        // Validate new password
        if (!newPassword) {
            this.showFieldError(form.querySelector('[name="newPassword"]'), 'Vui lòng nhập mật khẩu mới');
            isValid = false;
        } else if (newPassword.length < 8) {
            this.showFieldError(form.querySelector('[name="newPassword"]'), 'Mật khẩu phải có ít nhất 8 ký tự');
            isValid = false;
        }

        // Validate password confirmation
        if (newPassword !== confirmPassword) {
            this.showFieldError(form.querySelector('[name="confirmPassword"]'), 'Mật khẩu xác nhận không khớp');
            isValid = false;
        }

        if (isValid) {
            this.showLoadingButton(form.querySelector('button[type="submit"]'));
            
            setTimeout(() => {
                this.hideLoadingButton(form.querySelector('button[type="submit"]'));
                form.reset();
                this.showMessage('Mật khẩu đã được thay đổi thành công', 'success');
            }, 1500);
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(input, message) {
        this.clearFieldError(input);
        
        input.style.borderColor = '#e74c3c';
        input.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 0.25rem;
        `;
        errorElement.textContent = message;
        
        input.parentNode.appendChild(errorElement);
    }

    clearFieldError(input) {
        input.style.borderColor = '';
        input.style.boxShadow = '';
        
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    showLoadingButton(button) {
        button.disabled = true;
        const originalText = button.innerHTML;
        button.dataset.originalText = originalText;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    }

    hideLoadingButton(button) {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }

    // Notifications
    initNotifications() {
        // Handle 2FA enable button
        const enable2FABtn = document.getElementById('enable2FA');
        if (enable2FABtn) {
            enable2FABtn.addEventListener('click', () => {
                this.showMessage('Tính năng 2FA sẽ được triển khai trong phiên bản tiếp theo', 'warning');
            });
        }

        // Handle logout buttons in login activity
        const logoutBtns = document.querySelectorAll('.activity-item .btn-outline-danger');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showConfirmModal(
                    'Đăng xuất thiết bị',
                    'Bạn có chắc chắn muốn đăng xuất khỏi thiết bị này?',
                    () => {
                        btn.closest('.activity-item').remove();
                        this.showMessage('Đã đăng xuất khỏi thiết bị', 'success');
                    }
                );
            });
        });
    }

    showMessage(message, type = 'success') {
        const container = document.getElementById('messageContainer');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        container.appendChild(messageElement);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageElement.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 300);
        }, 5000);
    }

    // Theme Toggle
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
        const themeOption = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
        if (themeOption) {
            themeOption.checked = true;
            this.applyTheme(savedTheme);
        }
    }

    applyTheme(theme) {
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
        document.body.classList.add(`theme-${theme}`);
        
        if (theme === 'auto') {
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
        }
    }

    saveThemePreference(theme) {
        localStorage.setItem('theme', theme);
        this.showMessage('Chế độ hiển thị đã được cập nhật', 'success');
    }

    // Toggle Switches
    initToggleSwitches() {
        const toggleSwitches = document.querySelectorAll('.toggle-switch input');
        
        toggleSwitches.forEach(toggle => {
            toggle.addEventListener('change', () => {
                const settingName = toggle.closest('.notification-item, .privacy-item')
                    ?.querySelector('h4')?.textContent || 'Cài đặt';
                
                const status = toggle.checked ? 'bật' : 'tắt';
                this.showMessage(`${settingName} đã được ${status}`, 'success');
                
                // Save setting
                this.saveSetting(toggle.id, toggle.checked);
            });
        });
    }

    saveSetting(settingId, value) {
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        settings[settingId] = value;
        localStorage.setItem('userSettings', JSON.stringify(settings));
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

    // Confirmation Modal
    initConfirmModal() {
        const modal = document.getElementById('confirmModal');
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = document.getElementById('confirmCancel');
        const okBtn = document.getElementById('confirmOk');

        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideConfirmModal();
            });
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideConfirmModal();
            }
        });

        // Store callback for OK button
        okBtn.addEventListener('click', () => {
            if (this.confirmCallback) {
                this.confirmCallback();
            }
            this.hideConfirmModal();
        });
    }

    showConfirmModal(title, message, callback) {
        const modal = document.getElementById('confirmModal');
        const titleElement = document.getElementById('confirmTitle');
        const messageElement = document.getElementById('confirmMessage');

        titleElement.textContent = title;
        messageElement.textContent = message;
        this.confirmCallback = callback;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    hideConfirmModal() {
        const modal = document.getElementById('confirmModal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
        this.confirmCallback = null;
    }

    // Data Management
    saveUserData(data) {
        localStorage.setItem('userData', JSON.stringify(data));
    }

    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        // Populate form fields with saved data
        Object.keys(userData).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    if (Array.isArray(userData[key])) {
                        input.checked = userData[key].includes(input.value);
                    } else {
                        input.checked = userData[key];
                    }
                } else if (input.tagName === 'SELECT') {
                    input.value = userData[key];
                } else {
                    input.value = userData[key];
                }
            }
        });

        // Load other settings
        this.loadSettings();
    }

    // Data Export
    exportUserData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        
        const exportData = {
            userData,
            settings,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `profile-data-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        this.showMessage('Dữ liệu đã được tải xuống', 'success');
    }

    // Account Deletion
    deleteAccount() {
        this.showConfirmModal(
            'Xóa tài khoản',
            'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.',
            () => {
                // Clear all data
                localStorage.removeItem('userData');
                localStorage.removeItem('userSettings');
                localStorage.removeItem('theme');
                
                this.showMessage('Tài khoản đã được xóa', 'success');
                
                // Redirect to login page after delay
                setTimeout(() => {
                    window.location.href = '../pages/login.html';
                }, 2000);
            }
        );
    }
}

// Initialize Profile Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const profileManager = new ProfileManager();
    
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
    
    // Add reset button functionality
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            profileManager.showConfirmModal(
                'Khôi phục mặc định',
                'Bạn có chắc chắn muốn khôi phục tất cả cài đặt về mặc định?',
                () => {
                    // Reset all forms
                    document.querySelectorAll('form').forEach(form => form.reset());
                    
                    // Clear saved data
                    localStorage.removeItem('userSettings');
                    
                    // Reload page to reset everything
                    window.location.reload();
                }
            );
        });
    }
});

// Add slideOut animation for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .theme-dark {
        background: #2c3e50;
        color: #ecf0f1;
    }
    
    .theme-dark .profile-sidebar,
    .theme-dark .profile-main {
        background: #34495e;
        color: #ecf0f1;
    }
    
    .theme-dark .form-section,
    .theme-dark .security-card,
    .theme-dark .preference-card,
    .theme-dark .notification-card,
    .theme-dark .privacy-card {
        background: #3d566e;
    }
    
    .theme-dark input,
    .theme-dark select,
    .theme-dark textarea {
        background: #2c3e50;
        color: #ecf0f1;
        border-color: #4a5f7a;
    }
    
    .theme-dark .btn-outline {
        background: #3d566e;
        color: #ecf0f1;
        border-color: #4a5f7a;
    }
    
    .theme-dark .activity-item,
    .theme-dark .notification-item,
    .theme-dark .privacy-item,
    .theme-dark .two-factor-status {
        background: #2c3e50;
        border-color: #4a5f7a;
    }
`;
document.head.appendChild(style);
