/**
 * PROFESSIONAL REGISTRATION SYSTEM
 * Advanced registration functionality for CTSV Attendance System
 * Developed by Professional Team - 2024
 */

class ProfessionalRegistrationSystem {
    constructor() {
        this.formData = {};
        this.validationRules = {};
        this.passwordStrength = { level: 'weak', score: 0 };
        this.isSubmitting = false;

        this.initializeComponents();
        this.setupValidationRules();
        this.bindEvents();
        this.loadDepartments();
        this.initializeAnimations();
    }

    initializeComponents() {
        // Form elements
        this.form = document.getElementById('registerForm');
        this.inputs = {
            fullName: document.getElementById('fullName'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            department: document.getElementById('department'),
            password: document.getElementById('password'),
            confirmPassword: document.getElementById('confirmPassword'),
            terms: document.getElementById('terms'),
            newsletter: document.getElementById('newsletter')
        };

        // UI elements
        this.strengthIndicator = document.querySelector('.strength-fill');
        this.strengthText = document.querySelector('.strength-text');
        this.strengthStatus = document.querySelector('.strength-status');
        this.submitButton = document.querySelector('.submit-btn');
        this.progressBar = document.querySelector('.form-progress');
        this.socialButtons = document.querySelectorAll('.social-btn');

        // Validation elements
        this.errorElements = {};
        this.successElements = {};

        // Initialize progress
        this.updateFormProgress();
    }

    setupValidationRules() {
        this.validationRules = {
            fullName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                message: 'Họ tên phải từ 2-50 ký tự và chỉ chứa chữ cái'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Vui lòng nhập địa chỉ email hợp lệ'
            },
            phone: {
                required: true,
                pattern: /^(\+84|0)[3-9]\d{8}$/,
                message: 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 03-09'
            },
            department: {
                required: true,
                message: 'Vui lòng chọn khoa/phòng ban'
            },
            password: {
                required: true,
                minLength: 8,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
            },
            confirmPassword: {
                required: true,
                match: 'password',
                message: 'Mật khẩu xác nhận không khớp'
            },
            terms: {
                required: true,
                message: 'Vui lòng đồng ý với điều khoản sử dụng'
            }
        };
    }

    bindEvents() {
        // Input validation events
        Object.keys(this.inputs).forEach(key => {
            const input = this.inputs[key];
            if (!input) return;

            if (input.type === 'checkbox') {
                input.addEventListener('change', () => this.validateField(key));
            } else {
                input.addEventListener('input', () => this.handleInputChange(key));
                input.addEventListener('blur', () => this.validateField(key));
                input.addEventListener('focus', () => this.clearFieldError(key));
            }
        });

        // Password strength checking
        if (this.inputs.password) {
            this.inputs.password.addEventListener('input', () => {
                this.checkPasswordStrength();
                this.updateFormProgress();
            });
        }

        // Confirm password matching
        if (this.inputs.confirmPassword) {
            this.inputs.confirmPassword.addEventListener('input', () => {
                this.validatePasswordMatch();
            });
        }

        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Password toggle functionality
        this.setupPasswordToggle();

        // Social login
        this.socialButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = btn.classList.contains('google-btn') ? 'google' : 'microsoft';
                this.handleSocialLogin(provider);
            });
        });

        // Modal events
        this.bindModalEvents();

        // Phone number formatting
        if (this.inputs.phone) {
            this.inputs.phone.addEventListener('input', this.formatPhoneNumber.bind(this));
        }

        // Real-time email availability check
        if (this.inputs.email) {
            let emailCheckTimeout;
            this.inputs.email.addEventListener('input', () => {
                clearTimeout(emailCheckTimeout);
                emailCheckTimeout = setTimeout(() => {
                    this.checkEmailAvailability();
                }, 1000);
            });
        }
    }

    // Password Toggle Setup
    setupPasswordToggle() {
        // Setup for main password field
        const passwordToggle = document.getElementById('passwordToggle');
        const passwordInput = document.getElementById('password');

        console.log('Password toggle elements:', { passwordToggle, passwordInput });

        if (passwordToggle && passwordInput) {
            passwordToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.togglePasswordVisibility(passwordInput, passwordToggle);
            });
        }

        // Setup for confirm password field
        const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        console.log('Confirm password toggle elements:', { confirmPasswordToggle, confirmPasswordInput });

        if (confirmPasswordToggle && confirmPasswordInput) {
            confirmPasswordToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);
            });
        }
    }

    // Toggle password visibility
    togglePasswordVisibility(input, toggleBtn) {
        const icon = toggleBtn.querySelector('i');

        if (!input || !toggleBtn || !icon) {
            console.error('Missing elements for password toggle');
            return;
        }

        console.log('Toggling password visibility for:', input.id);

        // Add click animation
        toggleBtn.style.transform = 'translateY(-50%) scale(0.9)';

        setTimeout(() => {
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                toggleBtn.setAttribute('aria-label', 'Hide password');
                toggleBtn.setAttribute('title', 'Ẩn mật khẩu');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                toggleBtn.setAttribute('aria-label', 'Show password');
                toggleBtn.setAttribute('title', 'Hiển thị mật khẩu');
            }

            // Reset position
            toggleBtn.style.transform = 'translateY(-50%) scale(1)';
        }, 100);
    }

    handleInputChange(fieldName) {
        // Clear previous validation states
        this.clearFieldError(fieldName);

        // Update form progress
        this.updateFormProgress();

        // Special handling for specific fields
        switch (fieldName) {
            case 'fullName':
                this.formatFullName();
                break;
            case 'email':
                this.inputs.email.value = this.inputs.email.value.toLowerCase();
                break;
        }
    }

    // Validation Methods
    validateField(fieldName) {
        const input = this.inputs[fieldName];
        const rule = this.validationRules[fieldName];

        if (!input || !rule) return true;

        const value = input.type === 'checkbox' ? input.checked : input.value.trim();

        // Required field check
        if (rule.required) {
            if ((input.type === 'checkbox' && !value) ||
                (input.type !== 'checkbox' && !value)) {
                this.showFieldError(fieldName, `${this.getFieldLabel(fieldName)} là bắt buộc`);
                return false;
            }
        }

        // Skip other validations if field is empty and not required
        if (!value && !rule.required) {
            this.clearFieldError(fieldName);
            return true;
        }

        // Length validation
        if (rule.minLength && value.length < rule.minLength) {
            this.showFieldError(fieldName, `${this.getFieldLabel(fieldName)} phải có ít nhất ${rule.minLength} ký tự`);
            return false;
        }

        if (rule.maxLength && value.length > rule.maxLength) {
            this.showFieldError(fieldName, `${this.getFieldLabel(fieldName)} không được vượt quá ${rule.maxLength} ký tự`);
            return false;
        }

        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
            this.showFieldError(fieldName, rule.message);
            return false;
        }

        // Match validation (for confirm password)
        if (rule.match) {
            const matchValue = this.inputs[rule.match].value;
            if (value !== matchValue) {
                this.showFieldError(fieldName, rule.message);
                return false;
            }
        }

        // Field passed validation
        this.showFieldSuccess(fieldName);
        return true;
    }

    validatePasswordMatch() {
        const password = this.inputs.password.value;
        const confirmPassword = this.inputs.confirmPassword.value;

        if (!confirmPassword) return;

        if (password === confirmPassword) {
            this.showFieldSuccess('confirmPassword');
        } else {
            this.showFieldError('confirmPassword', 'Mật khẩu xác nhận không khớp');
        }
    }

    validateAllFields() {
        let isValid = true;

        Object.keys(this.validationRules).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Password Strength
    checkPasswordStrength() {
        const password = this.inputs.password.value;
        this.passwordStrength = this.calculatePasswordStrength(password);
        this.updatePasswordStrengthUI();
    }

    calculatePasswordStrength(password) {
        let score = 0;
        const checks = [
            password.length >= 8,                    // Minimum length
            /[a-z]/.test(password),                 // Lowercase
            /[A-Z]/.test(password),                 // Uppercase
            /\d/.test(password),                    // Numbers
            /[@$!%*?&]/.test(password),             // Special chars
            password.length >= 12,                   // Good length
            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password), // Mixed case + numbers
            password.length >= 16                    // Excellent length
        ];

        score = checks.filter(Boolean).length;

        if (score < 3) return { level: 'weak', score, percentage: 25 };
        if (score < 5) return { level: 'fair', score, percentage: 50 };
        if (score < 7) return { level: 'good', score, percentage: 75 };
        return { level: 'strong', score, percentage: 100 };
    }

    updatePasswordStrengthUI() {
        if (!this.strengthIndicator) return;

        const { level, percentage } = this.passwordStrength;
        const levels = ['weak', 'fair', 'good', 'strong'];
        const texts = ['Yếu', 'Trung bình', 'Tốt', 'Mạnh'];
        const colors = ['#ef4444', '#f97316', '#eab308', '#10b981'];

        // Remove previous classes from indicator
        levels.forEach(l => {
            this.strengthIndicator.classList.remove(l);
        });

        // Add current level to indicator
        this.strengthIndicator.classList.add(level);
        this.strengthIndicator.style.width = `${percentage}%`;

        // Update strength text (old layout)
        if (this.strengthText) {
            levels.forEach(l => this.strengthText.classList.remove(l));
            this.strengthText.classList.add(level);
            const levelIndex = levels.indexOf(level);
            this.strengthText.textContent = texts[levelIndex];
        }

        // Update strength status (new compact layout)
        if (this.strengthStatus) {
            levels.forEach(l => this.strengthStatus.classList.remove(l));
            this.strengthStatus.classList.add(level);
            const levelIndex = levels.indexOf(level);
            this.strengthStatus.textContent = texts[levelIndex];
        }
    }

    // Form Progress
    updateFormProgress() {
        const totalFields = Object.keys(this.inputs).length - 1; // Exclude newsletter
        let completedFields = 0;

        Object.keys(this.inputs).forEach(key => {
            if (key === 'newsletter') return; // Skip optional field

            const input = this.inputs[key];
            if (!input) return;

            const hasValue = input.type === 'checkbox' ? input.checked : input.value.trim();
            const isValid = hasValue && !input.classList.contains('error');

            if (isValid) completedFields++;
        });

        const progress = (completedFields / totalFields) * 100;
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
    }

    // Email Availability Check
    async checkEmailAvailability() {
        const email = this.inputs.email.value.trim();
        if (!email || !this.validationRules.email.pattern.test(email)) return;

        try {
            // Add loading state
            this.inputs.email.classList.add('loading');

            // Mock API call
            const isAvailable = await this.mockEmailCheck(email);

            this.inputs.email.classList.remove('loading');

            if (!isAvailable) {
                this.showFieldError('email', 'Email này đã được sử dụng');
            } else if (!this.inputs.email.classList.contains('error')) {
                this.showFieldSuccess('email');
            }
        } catch (error) {
            this.inputs.email.classList.remove('loading');
            console.error('Email check failed:', error);
        }
    }

    mockEmailCheck(email) {
        // Simulate email availability check
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock some taken emails
                const takenEmails = ['test@example.com', 'admin@ctsv.edu.vn', 'user@test.com'];
                resolve(!takenEmails.includes(email.toLowerCase()));
            }, 1000);
        });
    }

    // Department Loading
    async loadDepartments() {
        try {
            const departments = await this.mockDepartmentLoad();
            this.populateDepartmentSelect(departments);
        } catch (error) {
            console.error('Failed to load departments:', error);
        }
    }

    mockDepartmentLoad() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: '1', name: 'Khoa Công nghệ Thông tin' },
                    { id: '2', name: 'Khoa Kinh tế' },
                    { id: '3', name: 'Khoa Ngoại ngữ' },
                    { id: '4', name: 'Khoa Kỹ thuật' },
                    { id: '5', name: 'Khoa Y học' },
                    { id: '6', name: 'Khoa Luật' },
                    { id: '7', name: 'Phòng Đào tạo' },
                    { id: '8', name: 'Phòng Công tác Sinh viên' },
                    { id: '9', name: 'Phòng Hành chính' },
                    { id: '10', name: 'Khác' }
                ]);
            }, 500);
        });
    }

    populateDepartmentSelect(departments) {
        const select = this.inputs.department;
        if (!select) return;

        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }

        // Add departments
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name;
            select.appendChild(option);
        });
    }

    // Formatting Methods
    formatFullName() {
        const input = this.inputs.fullName;
        let value = input.value;

        // Capitalize first letter of each word
        value = value.replace(/\b\w/g, l => l.toUpperCase());

        // Remove extra spaces
        value = value.replace(/\s+/g, ' ');

        input.value = value;
    }

    formatPhoneNumber() {
        const input = this.inputs.phone;
        let value = input.value.replace(/\D/g, ''); // Remove non-digits

        // Format as Vietnamese phone number
        if (value.startsWith('84')) {
            value = '+84' + value.slice(2);
        } else if (value.startsWith('0') && value.length <= 10) {
            // Keep as is for domestic format
        } else if (value.length > 10) {
            value = value.slice(0, 10);
        }

        input.value = value;
    }

    // Form Submission
    async handleFormSubmit() {
        if (this.isSubmitting) return;

        // Validate all fields
        if (!this.validateAllFields()) {
            this.showError('Vui lòng kiểm tra lại thông tin đã nhập');
            return;
        }

        // Check password strength
        if (this.passwordStrength.level === 'weak') {
            this.showError('Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn');
            return;
        }

        try {
            this.isSubmitting = true;
            this.showSubmitLoading();

            // Collect form data
            this.collectFormData();

            // Submit registration
            const result = await this.submitRegistration(this.formData);

            if (result.success) {
                this.handleRegistrationSuccess(result);
            } else {
                throw new Error(result.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            this.handleRegistrationError(error);
        } finally {
            this.isSubmitting = false;
            this.hideSubmitLoading();
        }
    }

    collectFormData() {
        this.formData = {
            fullName: this.inputs.fullName.value.trim(),
            email: this.inputs.email.value.trim().toLowerCase(),
            phone: this.inputs.phone.value.trim(),
            department: this.inputs.department.value,
            password: this.inputs.password.value,
            newsletter: this.inputs.newsletter.checked,
            timestamp: new Date().toISOString()
        };
    }

    async submitRegistration(data) {
        // Mock API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({
                        success: true,
                        message: 'Đăng ký thành công',
                        userId: Date.now(),
                        verificationSent: true
                    });
                } else {
                    reject(new Error('Lỗi server. Vui lòng thử lại sau.'));
                }
            }, 2000);
        });
    }

    handleRegistrationSuccess(result) {
        this.showSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');

        // Show success modal or redirect
        this.showSuccessModal(result);

        // Clear form
        this.clearForm();
    }

    handleRegistrationError(error) {
        this.showError(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }

    clearForm() {
        Object.keys(this.inputs).forEach(key => {
            const input = this.inputs[key];
            if (input.type === 'checkbox') {
                input.checked = key === 'terms' ? false : input.checked;
            } else {
                input.value = '';
            }
            this.clearFieldError(key);
        });

        this.updateFormProgress();
        this.updatePasswordStrengthUI();
    }

    // Social Login
    handleSocialLogin(provider) {
        this.showLoading(`Đang chuyển hướng đến ${provider === 'google' ? 'Google' : 'Microsoft'}...`);

        // Mock social login redirect
        setTimeout(() => {
            this.hideLoading();
            this.showInfo(`Tính năng đăng nhập với ${provider === 'google' ? 'Google' : 'Microsoft'} sẽ sớm được cập nhật.`);
        }, 1500);
    }

    // UI Helper Methods
    showFieldError(fieldName, message) {
        const input = this.inputs[fieldName];
        if (!input) return;

        // Clear previous states
        this.clearFieldError(fieldName);

        // Add error class
        input.classList.add('error');
        input.classList.remove('valid');

        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

        // Insert error element
        const container = input.parentNode;
        container.appendChild(errorElement);

        this.errorElements[fieldName] = errorElement;
    }

    showFieldSuccess(fieldName) {
        const input = this.inputs[fieldName];
        if (!input) return;

        // Clear previous states
        this.clearFieldError(fieldName);

        // Add success class
        input.classList.add('valid');
        input.classList.remove('error');

        // Create success element
        const successElement = document.createElement('div');
        successElement.className = 'success-message show';
        successElement.innerHTML = `<i class="fas fa-check-circle"></i> Hợp lệ`;

        // Insert success element
        const container = input.parentNode;
        container.appendChild(successElement);

        this.successElements[fieldName] = successElement;
    }

    clearFieldError(fieldName) {
        const input = this.inputs[fieldName];
        if (!input) return;

        input.classList.remove('error', 'valid');

        // Remove error element
        if (this.errorElements[fieldName]) {
            this.errorElements[fieldName].remove();
            delete this.errorElements[fieldName];
        }

        // Remove success element
        if (this.successElements[fieldName]) {
            this.successElements[fieldName].remove();
            delete this.successElements[fieldName];
        }
    }

    getFieldLabel(fieldName) {
        const labels = {
            fullName: 'Họ và tên',
            email: 'Email',
            phone: 'Số điện thoại',
            department: 'Khoa/Phòng ban',
            password: 'Mật khẩu',
            confirmPassword: 'Xác nhận mật khẩu',
            terms: 'Điều khoản sử dụng'
        };
        return labels[fieldName] || fieldName;
    }

    // Loading States
    showSubmitLoading() {
        if (this.submitButton) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                Đang đăng ký...
            `;
        }
    }

    hideSubmitLoading() {
        if (this.submitButton) {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = `
                Đăng ký tài khoản
                <i class="fas fa-arrow-right"></i>
            `;
        }
    }

    showLoading(message = 'Đang xử lý...') {
        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loader);
    }

    hideLoading() {
        const loader = document.querySelector('.loading-overlay');
        if (loader) loader.remove();
    }

    // Notification Methods
    showNotification(message, type, duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.closeNotification(notification));

        if (duration > 0) {
            setTimeout(() => this.closeNotification(notification), duration);
        }
    }

    closeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
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

    showSuccess(message) { this.showNotification(message, 'success'); }
    showError(message) { this.showNotification(message, 'error'); }
    showWarning(message) { this.showNotification(message, 'warning'); }
    showInfo(message) { this.showNotification(message, 'info'); }

    // Success Modal
    showSuccessModal(result) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-check-circle text-success"></i> Đăng ký thành công!</h3>
                </div>
                <div class="modal-body">
                    <p>Chúc mừng! Tài khoản của bạn đã được tạo thành công.</p>
                    <p>Chúng tôi đã gửi email xác thực đến <strong>${this.formData.email}</strong>.</p>
                    <p>Vui lòng kiểm tra hộp thư và nhấp vào liên kết xác thực để hoàn tất đăng ký.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="window.location.href='login-professional.html'">
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }

    // Modal Management
    bindModalEvents() {
        // Terms modal
        const termsLink = document.getElementById('termsLink');
        const privacyLink = document.getElementById('privacyLink');

        if (termsLink) {
            termsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('termsModal');
            });
        }

        if (privacyLink) {
            privacyLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('privacyModal');
            });
        }

        // Close modals
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }

            if (e.target.classList.contains('modal-close')) {
                const modal = e.target.closest('.modal');
                this.closeModal(modal);
            }
        });

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) this.closeModal(openModal);
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Animation Initialization
    initializeAnimations() {
        // Animate benefits on scroll
        const benefitItems = document.querySelectorAll('.benefit-item');
        const trustItems = document.querySelectorAll('.trust-item');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        [...benefitItems, ...trustItems].forEach(item => {
            observer.observe(item);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.registrationSystem = new ProfessionalRegistrationSystem();
});

// Export for potential external use
window.ProfessionalRegistrationSystem = ProfessionalRegistrationSystem;
