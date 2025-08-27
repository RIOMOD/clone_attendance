/**
 * FORGOT PASSWORD SYSTEM
 * Professional password recovery functionality for CTSV Attendance System
 * Developed by Professional Team - 2024
 */

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Focus management for accessibility
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }

        // Close on Escape key
        document.addEventListener('keydown', handleModalKeydown);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleModalKeydown);
    }
}

function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal-overlay.show');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
}

function acceptTerms() {
    showNotification('Cảm ơn bạn đã đồng ý với điều khoản sử dụng!', 'success');
    closeModal('termsModal');
}

function acceptPrivacy() {
    showNotification('Cảm ơn bạn đã đọc chính sách bảo mật!', 'success');
    closeModal('privacyModal');
}

class ForgotPasswordSystem {
    constructor() {
        this.currentStep = 1;
        this.maxStep = 3;
        this.email = '';
        this.verificationCode = '';
        this.expirationTime = null;
        this.resendTimer = null;
        this.resendCountdown = 60;
        this.attemptCount = 0;
        this.maxAttempts = 5;
        this.isBlocked = false;
        this.blockExpiryTime = null;

        this.initializeComponents();
        this.bindEvents();
        this.setupValidation();
        this.initializeTimers();
        this.startTimeDisplay();
        this.initializeAnimations();
    }

    initializeComponents() {
        // Main elements
        this.processSteps = document.querySelectorAll('.step-item');
        this.formSteps = document.querySelectorAll('.step-form');

        // Form elements
        this.emailForm = document.getElementById('emailForm');
        this.verificationForm = document.getElementById('verificationForm');
        this.newPasswordForm = document.getElementById('newPasswordForm');

        this.emailInput = document.getElementById('forgotEmail');
        this.codeInputs = document.querySelectorAll('.verification-digit');
        this.newPasswordInput = document.getElementById('newPassword');
        this.confirmPasswordInput = document.getElementById('confirmPassword');

        // Demo email buttons
        this.demoEmailButtons = document.querySelectorAll('.demo-email-btn');

        // UI elements
        this.sentToEmailSpan = document.getElementById('sentToEmail');
        this.countdownElement = document.getElementById('countdown');
        this.resendBtn = document.getElementById('resendBtn');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');

        // Password requirements
        this.passwordRequirements = {
            length: document.getElementById('req-length'),
            lowercase: document.getElementById('req-lowercase'),
            uppercase: document.getElementById('req-uppercase'),
            number: document.getElementById('req-number')
        };

        // Buttons
        this.sendCodeBtn = document.getElementById('sendCodeBtn');
        this.verifyCodeBtn = document.getElementById('verifyCodeBtn');
        this.resetPasswordBtn = document.getElementById('resetPasswordBtn');

        // Password toggles
        this.newPasswordToggle = document.getElementById('newPasswordToggle');
        this.confirmPasswordToggle = document.getElementById('confirmPasswordToggle');

        // Time display
        this.currentTimeElement = document.getElementById('currentTime');
        this.currentDateElement = document.getElementById('currentDate');

        // Initialize step display
        this.updateStepDisplay();

        // Initialize brand animations
        this.initializeBrandAnimations();
    }

    initializeBrandAnimations() {
        // Animate features on load
        const features = document.querySelectorAll('.feature-item');
        features.forEach((feature, index) => {
            feature.style.animationDelay = `${0.2 + index * 0.2}s`;
        });

        // Animate stats
        const stats = document.querySelectorAll('.stat-item');
        stats.forEach((stat, index) => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(20px)';

            setTimeout(() => {
                stat.style.transition = 'all 0.6s ease';
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
            }, 1000 + index * 200);
        });
    }

    bindEvents() {
        // Form submissions
        if (this.emailForm) {
            this.emailForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEmailSubmit();
            });
        }

        if (this.verificationForm) {
            this.verificationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleVerificationSubmit();
            });
        }

        if (this.newPasswordForm) {
            this.newPasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePasswordReset();
            });
        }

        // Demo email buttons
        this.demoEmailButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const email = e.target.dataset.email;
                this.selectDemoEmail(email);
            });
        });

        // Email validation
        if (this.emailInput) {
            this.emailInput.addEventListener('input', () => this.validateEmailInput());
            this.emailInput.addEventListener('blur', () => this.validateEmailInput());
        }

        // Verification code inputs
        this.codeInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => this.handleCodeInput(e, index));
            input.addEventListener('keydown', (e) => this.handleCodeKeydown(e, index));
            input.addEventListener('paste', (e) => this.handleCodePaste(e, index));
            input.addEventListener('focus', () => input.select());
        });

        // Password validation and strength checking
        if (this.newPasswordInput) {
            this.newPasswordInput.addEventListener('input', () => {
                this.checkPasswordStrength();
                this.validatePasswordRequirements();
            });
        }

        if (this.confirmPasswordInput) {
            this.confirmPasswordInput.addEventListener('input', () => this.validatePasswordMatch());
        }

        // Password toggle buttons
        if (this.newPasswordToggle) {
            this.newPasswordToggle.addEventListener('click', () => {
                this.togglePasswordVisibility(this.newPasswordInput, this.newPasswordToggle);
            });
        }

        if (this.confirmPasswordToggle) {
            this.confirmPasswordToggle.addEventListener('click', () => {
                this.togglePasswordVisibility(this.confirmPasswordInput, this.confirmPasswordToggle);
            });
        }

        // Resend code
        if (this.resendBtn) {
            this.resendBtn.addEventListener('click', () => this.resendVerificationCode());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Help modal
        const helpBtn = document.getElementById('helpBtn');
        const keyboardHelpModal = document.getElementById('keyboardHelpModal');
        const closeModalBtn = document.querySelector('.close-modal');

        if (helpBtn && keyboardHelpModal) {
            helpBtn.addEventListener('click', () => {
                keyboardHelpModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeModalBtn && keyboardHelpModal) {
            closeModalBtn.addEventListener('click', () => {
                keyboardHelpModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close modal on outside click
        if (keyboardHelpModal) {
            keyboardHelpModal.addEventListener('click', (e) => {
                if (e.target === keyboardHelpModal) {
                    keyboardHelpModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Footer help links
        const helpLinks = document.querySelectorAll('.help-links a');
        helpLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleHelpLink(e));
        });

        // Contact link
        const contactLink = document.querySelector('[href="mailto:support@ctsv.edu.vn"]');
        if (contactLink) {
            contactLink.addEventListener('click', () => this.logInteraction('contact_support'));
        }

        // Back to auth links
        const authLinks = document.querySelectorAll('a[href*="login"], a[href*="register"]');
        authLinks.forEach(link => {
            link.addEventListener('click', () => this.logInteraction('navigate_to_auth'));
        });

        // Network status
        window.addEventListener('online', () => this.updateNetworkStatus(true));
        window.addEventListener('offline', () => this.updateNetworkStatus(false));
    }

    setupValidation() {
        this.validationRules = {
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Vui lòng nhập địa chỉ email hợp lệ'
            },
            verificationCode: {
                required: true,
                length: 6,
                pattern: /^\d{6}$/,
                message: 'Mã xác thực phải có 6 chữ số'
            },
            password: {
                required: true,
                minLength: 8,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
            }
        };
    }

    initializeTimers() {
        // Set expiration time (15 minutes from now)
        this.expirationTime = new Date(Date.now() + 15 * 60 * 1000);

        // Start countdown timer
        this.startCountdown();
    }

    // Step Navigation
    nextStep() {
        if (this.currentStep >= this.maxStep) return;

        // Validate current step
        if (!this.validateCurrentStep()) return;

        // Process step-specific actions
        if (this.currentStep === 1) {
            this.sendVerificationCode();
        } else if (this.currentStep === 2) {
            this.verifyCode();
        }

        this.currentStep++;
        this.updateStep();
        this.updateProgress();
    }

    prevStep() {
        if (this.currentStep <= 1) return;

        this.currentStep--;
        this.updateStep();
        this.updateProgress();
    }

    updateStep() {
        // Update process steps
        this.processSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Update form steps
        this.formSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Add animation
        const activeStep = document.querySelector(`.form-step.active`);
        if (activeStep) {
            activeStep.style.opacity = '0';
            activeStep.style.transform = 'translateY(20px)';

            setTimeout(() => {
                activeStep.style.opacity = '1';
                activeStep.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    updateProgress() {
        const progress = ((this.currentStep - 1) / (this.maxStep - 1)) * 100;
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
    }

    // Validation Methods
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateEmail();
            case 2:
                return this.validateVerificationCode();
            case 3:
                return this.validatePassword() && this.validatePasswordMatch();
            default:
                return true;
        }
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const rule = this.validationRules.email;

        if (!email) {
            this.showFieldError(this.emailInput, 'Vui lòng nhập địa chỉ email');
            return false;
        }

        if (!rule.pattern.test(email)) {
            this.showFieldError(this.emailInput, rule.message);
            return false;
        }

        this.clearFieldError(this.emailInput);
        this.email = email;
        return true;
    }

    clearEmailError() {
        this.clearFieldError(this.emailInput);
    }

    // Enhanced validation methods
    validateVerificationCode() {
        const code = Array.from(this.codeInputs).map(input => input.value).join('');
        const errorDiv = document.getElementById('verification-error');

        if (errorDiv) errorDiv.textContent = '';

        if (code.length !== 6) {
            if (errorDiv) errorDiv.textContent = 'Vui lòng nhập đầy đủ 6 chữ số';
            return false;
        }

        if (!/^\d{6}$/.test(code)) {
            if (errorDiv) errorDiv.textContent = 'Mã xác thực chỉ được chứa số';
            return false;
        }

        this.verificationCode = code;
        return true;
    }

    validateNewPassword() {
        if (!this.newPasswordInput) return false;

        const password = this.newPasswordInput.value;
        const errorDiv = document.getElementById('password-error');

        if (errorDiv) errorDiv.textContent = '';

        if (!password) {
            if (errorDiv) errorDiv.textContent = 'Vui lòng nhập mật khẩu mới';
            return false;
        }

        if (password.length < 8) {
            if (errorDiv) errorDiv.textContent = 'Mật khẩu phải có ít nhất 8 ký tự';
            return false;
        }

        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);

        if (!hasLower || !hasUpper || !hasNumber) {
            if (errorDiv) errorDiv.textContent = 'Mật khẩu phải có chữ hoa, chữ thường và số';
            return false;
        }

        return true;
    }

    validatePasswordMatch() {
        if (!this.newPasswordInput || !this.confirmPasswordInput) return false;

        const password = this.newPasswordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        const errorDiv = document.getElementById('confirm-password-error');

        if (errorDiv) errorDiv.textContent = '';

        if (!confirmPassword) {
            if (errorDiv) errorDiv.textContent = 'Vui lòng xác nhận mật khẩu';
            return false;
        }

        if (password !== confirmPassword) {
            if (errorDiv) errorDiv.textContent = 'Mật khẩu xác nhận không khớp';
            return false;
        }

        return true;
    }

    // Enhanced timer methods
    startExpirationTimer() {
        this.expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        this.startCountdown();
        this.startResendTimer();
    }

    startCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        this.countdownInterval = setInterval(() => {
            const now = new Date();
            const timeLeft = this.expirationTime - now;

            if (timeLeft <= 0) {
                clearInterval(this.countdownInterval);
                this.handleCodeExpiration();
                return;
            }

            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            if (this.countdownElement) {
                this.countdownElement.textContent = timeString;

                // Add warning classes based on time remaining
                this.countdownElement.classList.remove('warning', 'danger');
                if (timeLeft <= 60000) { // Less than 1 minute
                    this.countdownElement.classList.add('danger');
                } else if (timeLeft <= 300000) { // Less than 5 minutes
                    this.countdownElement.classList.add('warning');
                }
            }
        }, 1000);
    }

    startResendTimer() {
        this.resendCountdown = 60;
        if (this.resendBtn) {
            this.resendBtn.disabled = true;
            this.updateResendButton();
        }
    }

    updateResendButton() {
        if (!this.resendBtn) return;

        if (this.resendCountdown > 0) {
            this.resendBtn.innerHTML = `
                <i class="fas fa-clock"></i>
                <span>Gửi lại sau ${this.resendCountdown}s</span>
            `;
            this.resendCountdown--;
            setTimeout(() => this.updateResendButton(), 1000);
        } else {
            this.resendBtn.disabled = false;
            this.resendBtn.innerHTML = `
                <i class="fas fa-redo"></i>
                <span>Gửi lại mã</span>
            `;
        }
    }

    handleCodeExpiration() {
        this.showError('Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.');

        this.codeInputs.forEach(input => {
            input.disabled = true;
            input.classList.add('blocked');
        });

        if (this.verifyCodeBtn) {
            this.verifyCodeBtn.disabled = true;
        }

        // Show resend option
        if (this.resendBtn) {
            this.resendBtn.disabled = false;
            this.resendBtn.innerHTML = `
                <i class="fas fa-redo"></i>
                <span>Yêu cầu mã mới</span>
            `;
        }
    }

    // Enhanced password strength calculation
    checkPasswordStrength() {
        if (!this.newPasswordInput) return;

        const password = this.newPasswordInput.value;
        const strength = this.calculatePasswordStrength(password);

        if (this.strengthFill && this.strengthText) {
            this.updatePasswordStrengthUI(strength);
        }

        this.validatePasswordRequirements();
    }

    calculatePasswordStrength(password) {
        let score = 0;
        let level = 'weak';

        // Length check
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;

        // Character variety
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[@$!%*?&]/.test(password)) score += 1;

        // Common patterns (negative points)
        if (/123456|abcdef|qwerty|password/i.test(password)) score -= 2;

        // Determine level
        if (score >= 5) level = 'strong';
        else if (score >= 4) level = 'good';
        else if (score >= 2) level = 'fair';

        return { level, score: Math.max(0, score) };
    }

    updatePasswordStrengthUI(strength) {
        const levels = ['weak', 'fair', 'good', 'strong'];
        const colors = ['#ef4444', '#f97316', '#eab308', '#10b981'];
        const texts = ['Yếu', 'Trung bình', 'Tốt', 'Mạnh'];
        const widths = [25, 50, 75, 100];

        // Remove all level classes
        levels.forEach(level => {
            this.strengthFill.classList.remove(level);
            this.strengthText.classList.remove(level);
        });

        // Add current level
        this.strengthFill.classList.add(strength.level);
        this.strengthText.classList.add(strength.level);

        // Update UI
        const levelIndex = levels.indexOf(strength.level);
        this.strengthText.textContent = texts[levelIndex];
        this.strengthFill.style.width = `${widths[levelIndex]}%`;
    }

    // Enhanced API methods with better error handling
    async sendVerificationCode() {
        try {
            const response = await this.mockAPICall('/forgot-password/send-code', {
                email: this.email
            });

            if (response.success) {
                this.showSuccess('Mã xác thực đã được gửi đến email của bạn');
                return true;
            } else {
                throw new Error(response.message || 'Không thể gửi mã xác thực');
            }
        } catch (error) {
            throw error;
        }
    }

    async verifyCode() {
        try {
            const response = await this.mockAPICall('/forgot-password/verify-code', {
                email: this.email,
                code: this.verificationCode
            });

            if (response.success) {
                this.showSuccess('Mã xác thực chính xác!');
                return true;
            } else {
                throw new Error('Mã xác thực không chính xác');
            }
        } catch (error) {
            throw error;
        }
    }

    async resetPassword() {
        try {
            const response = await this.mockAPICall('/forgot-password/reset-password', {
                email: this.email,
                code: this.verificationCode,
                newPassword: this.newPasswordInput.value
            });

            if (response.success) {
                return true;
            } else {
                throw new Error(response.message || 'Không thể đặt lại mật khẩu');
            }
        } catch (error) {
            throw error;
        }
    }

    async resendVerificationCode() {
        if (this.resendBtn && this.resendBtn.disabled) return;

        this.setButtonLoading(this.resendBtn, true);

        try {
            const response = await this.mockAPICall('/forgot-password/resend-code', {
                email: this.email
            });

            if (response.success) {
                this.showSuccess('Mã xác thực mới đã được gửi');

                // Reset verification inputs
                this.codeInputs.forEach(input => {
                    input.value = '';
                    input.disabled = false;
                    input.classList.remove('blocked');
                });

                if (this.verifyCodeBtn) {
                    this.verifyCodeBtn.disabled = false;
                }

                // Restart timers
                this.startExpirationTimer();

                // Focus first input
                if (this.codeInputs[0]) {
                    this.codeInputs[0].focus();
                }

            } else {
                throw new Error(response.message || 'Không thể gửi lại mã xác thực');
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setButtonLoading(this.resendBtn, false);
        }
    }

    // Enhanced notification system
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showWarning(message) {
        this.showNotification(message, 'warning');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle'
        };

        notification.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Show with animation
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto hide
        const autoHideTimer = setTimeout(() => {
            this.hideNotification(notification);
        }, type === 'error' ? 8000 : 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoHideTimer);
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Mock API with realistic delays and responses
    mockAPICall(endpoint, data) {
        return new Promise((resolve) => {
            const delay = Math.random() * 1500 + 1000; // 1-2.5 seconds

            setTimeout(() => {
                switch (endpoint) {
                    case '/forgot-password/send-code':
                        // Check if email exists (mock)
                        const validEmails = [
                            'admin@ctsv.edu.vn',
                            'manager@ctsv.edu.vn',
                            'user@ctsv.edu.vn'
                        ];

                        if (validEmails.includes(data.email.toLowerCase())) {
                            resolve({
                                success: true,
                                message: 'Verification code sent',
                                codeExpiry: 15 * 60 * 1000
                            });
                        } else {
                            resolve({
                                success: false,
                                message: 'Email không tồn tại trong hệ thống'
                            });
                        }
                        break;

                    case '/forgot-password/verify-code':
                        // Accept any 6-digit code for demo
                        resolve({
                            success: data.code && data.code.length === 6,
                            message: data.code?.length === 6 ? 'Code verified' : 'Invalid code'
                        });
                        break;

                    case '/forgot-password/reset-password':
                        resolve({
                            success: true,
                            message: 'Password reset successfully'
                        });
                        break;

                    case '/forgot-password/resend-code':
                        resolve({
                            success: true,
                            message: 'New code sent'
                        });
                        break;

                    default:
                        resolve({
                            success: false,
                            message: 'Unknown endpoint'
                        });
                }
            }, delay);
        });
    }

    // Cleanup method
    destroy() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
    }

    // Code Input Handling
    handleCodeInput(event, index) {
        const input = event.target;
        const value = input.value;

        // Only allow digits
        if (!/^\d$/.test(value)) {
            input.value = '';
            return;
        }

        // Move to next input
        if (value && index < this.codeInputs.length - 1) {
            this.codeInputs[index + 1].focus();
        }

        // Check if all codes are entered
        this.checkCodeCompletion();
    }

    handleCodeKeydown(event, index) {
        const input = event.target;

        // Handle backspace
        if (event.key === 'Backspace') {
            if (!input.value && index > 0) {
                this.codeInputs[index - 1].focus();
                this.codeInputs[index - 1].value = '';
            }
        }

        // Handle arrow keys
        if (event.key === 'ArrowLeft' && index > 0) {
            this.codeInputs[index - 1].focus();
        } else if (event.key === 'ArrowRight' && index < this.codeInputs.length - 1) {
            this.codeInputs[index + 1].focus();
        }
    }

    handleCodePaste(event, index) {
        event.preventDefault();
        const paste = (event.clipboardData || window.clipboardData).getData('text');
        const digits = paste.replace(/\D/g, '').slice(0, 6);

        // Fill inputs with pasted digits
        for (let i = 0; i < digits.length && i < this.codeInputs.length; i++) {
            this.codeInputs[i].value = digits[i];
        }

        // Focus last filled input
        const lastIndex = Math.min(digits.length, this.codeInputs.length) - 1;
        if (lastIndex >= 0) {
            this.codeInputs[lastIndex].focus();
        }

        this.checkCodeCompletion();
    }

    checkCodeCompletion() {
        const allFilled = Array.from(this.codeInputs).every(input => input.value);
        const nextButton = document.querySelector('.form-step.active .next-step');

        if (nextButton) {
            nextButton.disabled = !allFilled;
        }
    }

    // Password Strength Checker
    checkPasswordStrength() {
        const password = this.newPasswordInput.value;
        const strength = this.calculatePasswordStrength(password);

        if (this.strengthIndicator && this.strengthText) {
            this.updateStrengthIndicator(strength);
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        const checks = [
            password.length >= 8,
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /\d/.test(password),
            /[@$!%*?&]/.test(password),
            password.length >= 12
        ];

        score = checks.filter(Boolean).length;

        if (score < 3) return { level: 'weak', score };
        if (score < 5) return { level: 'fair', score };
        if (score < 6) return { level: 'good', score };
        return { level: 'strong', score };
    }

    updateStrengthIndicator(strength) {
        const levels = ['weak', 'fair', 'good', 'strong'];
        const colors = ['#ef4444', '#f97316', '#eab308', '#10b981'];
        const texts = ['Yếu', 'Trung bình', 'Tốt', 'Mạnh'];

        // Remove previous classes
        levels.forEach(level => {
            this.strengthIndicator.classList.remove(level);
            this.strengthText.classList.remove(level);
        });

        // Add current level class
        this.strengthIndicator.classList.add(strength.level);
        this.strengthText.classList.add(strength.level);

        // Update text
        const levelIndex = levels.indexOf(strength.level);
        this.strengthText.textContent = `Độ mạnh: ${texts[levelIndex]}`;

        // Update progress bar
        const progress = ((strength.score) / 6) * 100;
        this.strengthIndicator.style.width = `${progress}%`;
        this.strengthIndicator.style.backgroundColor = colors[levelIndex];
    }

    // API Methods
    async sendVerificationCode() {
        try {
            this.showLoading('Đang gửi mã xác thực...');

            // Simulate API call
            const response = await this.mockAPICall('/api/forgot-password/send-code', {
                email: this.email
            });

            if (response.success) {
                this.hideLoading();
                this.showSuccess('Mã xác thực đã được gửi đến email của bạn');
                this.startResendCountdown();
                return true;
            } else {
                throw new Error(response.message || 'Không thể gửi mã xác thực');
            }
        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
            return false;
        }
    }

    async verifyCode() {
        try {
            this.showLoading('Đang xác thực mã...');

            const response = await this.mockAPICall('/api/forgot-password/verify-code', {
                email: this.email,
                code: this.verificationCode
            });

            if (response.success) {
                this.hideLoading();
                this.showSuccess('Mã xác thực chính xác');
                return true;
            } else {
                throw new Error(response.message || 'Mã xác thực không chính xác');
            }
        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
            return false;
        }
    }

    async resetPassword() {
        try {
            if (!this.validatePassword() || !this.validatePasswordMatch()) {
                return;
            }

            this.showLoading('Đang cập nhật mật khẩu...');

            const response = await this.mockAPICall('/api/forgot-password/reset', {
                email: this.email,
                code: this.verificationCode,
                newPassword: this.newPasswordInput.value
            });

            if (response.success) {
                this.hideLoading();
                this.showSuccess('Mật khẩu đã được cập nhật thành công');

                // Redirect after success
                setTimeout(() => {
                    this.redirectToLogin();
                }, 2000);
            } else {
                throw new Error(response.message || 'Không thể cập nhật mật khẩu');
            }
        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
        }
    }

    async resendVerificationCode() {
        try {
            if (this.resendBtn.disabled) return;

            this.showLoading('Đang gửi lại mã xác thực...');

            const response = await this.mockAPICall('/api/forgot-password/resend-code', {
                email: this.email
            });

            if (response.success) {
                this.hideLoading();
                this.showSuccess('Mã xác thực mới đã được gửi');
                this.startResendCountdown();

                // Clear current code inputs
                this.codeInputs.forEach(input => input.value = '');
                this.codeInputs[0].focus();

                // Reset expiration timer
                this.expirationTime = new Date(Date.now() + 15 * 60 * 1000);
                this.startCountdown();
            } else {
                throw new Error(response.message || 'Không thể gửi lại mã xác thực');
            }
        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
        }
    }

    // Timer Methods
    startCountdown() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }

        this.countdownTimer = setInterval(() => {
            const now = new Date();
            const timeLeft = this.expirationTime - now;

            if (timeLeft <= 0) {
                clearInterval(this.countdownTimer);
                this.showError('Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.');
                this.disableCodeInputs();
                return;
            }

            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);

            if (this.timeRemaining) {
                this.timeRemaining.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    startResendCountdown() {
        this.resendCountdown = 60;
        this.resendBtn.disabled = true;

        const updateResendButton = () => {
            if (this.resendCountdown > 0) {
                this.resendBtn.textContent = `Gửi lại (${this.resendCountdown}s)`;
                this.resendCountdown--;
                setTimeout(updateResendButton, 1000);
            } else {
                this.resendBtn.textContent = 'Gửi lại mã';
                this.resendBtn.disabled = false;
            }
        };

        updateResendButton();
    }

    disableCodeInputs() {
        this.codeInputs.forEach(input => {
            input.disabled = true;
            input.classList.add('expired');
        });
    }

    // UI Helper Methods
    showFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);

        // Add error class
        field.classList.add('error');

        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;

        // Insert after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);

        // Focus field
        field.focus();
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        });
    }

    showLoading(message = 'Đang xử lý...') {
        // Remove existing loader
        this.hideLoading();

        // Create loader
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
        if (loader) {
            loader.remove();
        }
    }

    redirectToLogin() {
        window.location.href = 'login-professional.html';
    }

    // Mock API Method
    mockAPICall(endpoint, data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate different responses based on endpoint
                switch (endpoint) {
                    case '/api/forgot-password/send-code':
                        resolve({ success: true, message: 'Code sent successfully' });
                        break;
                    case '/api/forgot-password/verify-code':
                        // Mock code verification (accept any 6-digit code)
                        resolve({ success: data.code && data.code.length === 6 });
                        break;
                    case '/api/forgot-password/reset':
                        resolve({ success: true, message: 'Password reset successfully' });
                        break;
                    case '/api/forgot-password/resend-code':
                        resolve({ success: true, message: 'Code resent successfully' });
                        break;
                    default:
                        resolve({ success: false, message: 'Unknown endpoint' });
                }
            }, Math.random() * 1000 + 500); // Random delay 500-1500ms
        });
    }

    // Modal Methods
    bindModalEvents() {
        // Help modal
        const helpBtn = document.getElementById('helpBtn');
        const helpModal = document.getElementById('helpModal');

        if (helpBtn && helpModal) {
            helpBtn.addEventListener('click', () => this.openModal('helpModal'));
        }

        // Close modals
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }

            if (e.target.classList.contains('modal-close')) {
                const modal = e.target.closest('.modal');
                if (modal) this.closeModal(modal.id);
            }
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) this.closeModal(openModal.id);
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

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // New methods for enhanced functionality

    // Time display
    startTimeDisplay() {
        this.updateTimeDisplay();
        setInterval(() => this.updateTimeDisplay(), 1000);
    }

    updateTimeDisplay() {
        const now = new Date();
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        if (this.currentTimeElement) {
            this.currentTimeElement.textContent = now.toLocaleTimeString('vi-VN', timeOptions);
        }
        if (this.currentDateElement) {
            this.currentDateElement.textContent = now.toLocaleDateString('vi-VN', dateOptions);
        }
    }

    // Demo email selection
    selectDemoEmail(email) {
        if (this.emailInput) {
            this.emailInput.value = email;
            this.validateEmailInput();

            // Update UI
            this.demoEmailButtons.forEach(btn => {
                btn.classList.remove('selected');
                if (btn.dataset.email === email) {
                    btn.classList.add('selected');
                }
            });

            // Add animation
            this.emailInput.focus();
            this.animateInputSuccess(this.emailInput);
        }
    }

    // Enhanced email validation
    validateEmailInput() {
        if (!this.emailInput) return false;

        const email = this.emailInput.value.trim();
        const errorDiv = document.getElementById('email-error');

        // Clear previous states
        this.emailInput.classList.remove('error', 'success');
        if (errorDiv) errorDiv.textContent = '';

        if (!email) {
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.emailInput.classList.add('error');
            if (errorDiv) errorDiv.textContent = 'Vui lòng nhập địa chỉ email hợp lệ';
            return false;
        }

        // Success state
        this.emailInput.classList.add('success');
        this.email = email;
        return true;
    }

    // Password visibility toggle
    togglePasswordVisibility(input, toggleBtn) {
        if (!input || !toggleBtn) return;

        const icon = toggleBtn.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    // Enhanced password requirements validation
    validatePasswordRequirements() {
        if (!this.newPasswordInput) return;

        const password = this.newPasswordInput.value;
        const requirements = [
            { key: 'length', test: password.length >= 8 },
            { key: 'lowercase', test: /[a-z]/.test(password) },
            { key: 'uppercase', test: /[A-Z]/.test(password) },
            { key: 'number', test: /\d/.test(password) }
        ];

        requirements.forEach(req => {
            const element = this.passwordRequirements[req.key];
            if (element) {
                const icon = element.querySelector('i');
                if (req.test) {
                    element.classList.add('valid');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-check');
                    }
                } else {
                    element.classList.remove('valid');
                    if (icon) {
                        icon.classList.remove('fa-check');
                        icon.classList.add('fa-times');
                    }
                }
            }
        });
    }

    // Step management
    updateStepDisplay() {
        // Update process steps in sidebar
        this.processSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            const stepNumber = index + 1;

            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Update form steps
        this.formSteps.forEach((form, index) => {
            form.classList.remove('active');
            if (index + 1 === this.currentStep) {
                form.classList.add('active');

                // Focus first input in active step
                setTimeout(() => {
                    const firstInput = form.querySelector('input:not([disabled])');
                    if (firstInput) firstInput.focus();
                }, 300);
            }
        });
    }

    // Form handlers
    async handleEmailSubmit() {
        if (this.isBlocked) {
            this.showBlockedMessage();
            return;
        }

        if (!this.validateEmailInput()) {
            return;
        }

        this.setButtonLoading(this.sendCodeBtn, true);

        try {
            const success = await this.sendVerificationCode();
            if (success) {
                this.currentStep = 2;
                this.updateStepDisplay();
                this.startExpirationTimer();

                // Update sent email display
                if (this.sentToEmailSpan) {
                    this.sentToEmailSpan.textContent = this.email;
                }
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setButtonLoading(this.sendCodeBtn, false);
        }
    }

    async handleVerificationSubmit() {
        if (!this.validateVerificationCode()) {
            this.attemptCount++;
            this.handleFailedAttempt();
            return;
        }

        this.setButtonLoading(this.verifyCodeBtn, true);

        try {
            const success = await this.verifyCode();
            if (success) {
                this.currentStep = 3;
                this.updateStepDisplay();
                this.resetAttemptCount();
            } else {
                this.attemptCount++;
                this.handleFailedAttempt();
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setButtonLoading(this.verifyCodeBtn, false);
        }
    }

    async handlePasswordReset() {
        if (!this.validateNewPassword() || !this.validatePasswordMatch()) {
            return;
        }

        this.setButtonLoading(this.resetPasswordBtn, true);

        try {
            const success = await this.resetPassword();
            if (success) {
                this.showSuccessModal();
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setButtonLoading(this.resetPasswordBtn, false);
        }
    }

    // Security features
    handleFailedAttempt() {
        if (this.attemptCount >= this.maxAttempts) {
            this.blockUser();
        } else {
            const remaining = this.maxAttempts - this.attemptCount;
            this.showWarning(`Sai mã xác thực. Còn ${remaining} lần thử.`);

            // Add shake animation to verification inputs
            this.codeInputs.forEach(input => {
                input.classList.add('error');
                setTimeout(() => input.classList.remove('error'), 500);
            });
        }
    }

    blockUser() {
        this.isBlocked = true;
        this.blockExpiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        this.codeInputs.forEach(input => {
            input.disabled = true;
            input.classList.add('blocked');
        });

        if (this.verifyCodeBtn) {
            this.verifyCodeBtn.disabled = true;
        }

        this.showError('Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.');
        this.startBlockTimer();
    }

    startBlockTimer() {
        const blockTimer = setInterval(() => {
            const now = new Date();
            const timeLeft = this.blockExpiryTime - now;

            if (timeLeft <= 0) {
                clearInterval(blockTimer);
                this.unblockUser();
            }
        }, 1000);
    }

    unblockUser() {
        this.isBlocked = false;
        this.attemptCount = 0;
        this.blockExpiryTime = null;

        this.codeInputs.forEach(input => {
            input.disabled = false;
            input.classList.remove('blocked');
        });

        if (this.verifyCodeBtn) {
            this.verifyCodeBtn.disabled = false;
        }

        this.showSuccess('Bạn có thể thử lại ngay bây giờ.');
    }

    showBlockedMessage() {
        if (this.blockExpiryTime) {
            const now = new Date();
            const timeLeft = Math.ceil((this.blockExpiryTime - now) / 60000);
            this.showError(`Tài khoản tạm thời bị khóa. Vui lòng thử lại sau ${timeLeft} phút.`);
        }
    }

    resetAttemptCount() {
        this.attemptCount = 0;
    }

    // Enhanced UI helpers
    setButtonLoading(button, loading) {
        if (!button) return;

        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        const btnIcon = button.querySelector('.btn-icon');

        if (loading) {
            button.disabled = true;
            if (btnText) btnText.style.opacity = '0';
            if (btnLoading) btnLoading.style.display = 'flex';
            if (btnIcon) btnIcon.style.opacity = '0';
        } else {
            button.disabled = false;
            if (btnText) btnText.style.opacity = '1';
            if (btnLoading) btnLoading.style.display = 'none';
            if (btnIcon) btnIcon.style.opacity = '1';
        }
    }

    animateInputSuccess(input) {
        input.style.transform = 'scale(1.02)';
        input.style.transition = 'transform 0.2s ease';
        setTimeout(() => {
            input.style.transform = 'scale(1)';
        }, 200);
    }

    // Keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Escape to go back
        if (e.key === 'Escape' && this.currentStep > 1) {
            this.goToPreviousStep();
        }

        // Ctrl+Enter to submit current form
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            const activeForm = document.querySelector('.step-form.active form');
            if (activeForm) {
                activeForm.dispatchEvent(new Event('submit'));
            }
        }
    }

    goToPreviousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    // Success modal
    showSuccessModal() {
        const modal = document.createElement('div');
        modal.className = 'success-modal-overlay';
        modal.innerHTML = `
            <div class="success-modal">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Đặt lại mật khẩu thành công!</h3>
                <p>Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập ngay bây giờ.</p>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="window.location.href='login-professional.html'">
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 100);

        // Auto redirect after 5 seconds
        setTimeout(() => {
            window.location.href = 'login-professional.html';
        }, 5000);
    }

    // Animation initialization
    initializeAnimations() {
        // Animate process steps on load
        this.processSteps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                step.style.transition = 'all 0.5s ease';
                step.style.opacity = '1';
                step.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.forgotPasswordSystem = new ForgotPasswordSystem();

    // Network status monitoring
    window.addEventListener('online', () => {
        window.forgotPasswordSystem.handleNetworkStatusChange(true);
    });

    window.addEventListener('offline', () => {
        window.forgotPasswordSystem.handleNetworkStatusChange(false);
    });
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.forgotPasswordSystem) {
        window.forgotPasswordSystem.destroy();
    }
});

// Add network status and offline support to the class
ForgotPasswordSystem.prototype.handleNetworkStatusChange = function (isOnline) {
    const networkStatus = document.querySelector('.network-status') || this.createNetworkStatusIndicator();

    if (isOnline) {
        networkStatus.classList.remove('offline');
        networkStatus.classList.add('online');
        networkStatus.innerHTML = `
            <i class="fas fa-wifi"></i>
            <span>Đã kết nối</span>
        `;

        // Auto-hide after 3 seconds
        setTimeout(() => {
            networkStatus.style.display = 'none';
        }, 3000);
    } else {
        networkStatus.classList.remove('online');
        networkStatus.classList.add('offline');
        networkStatus.innerHTML = `
            <i class="fas fa-wifi-slash"></i>
            <span>Mất kết nối mạng</span>
        `;
        networkStatus.style.display = 'flex';
    }
};

ForgotPasswordSystem.prototype.createNetworkStatusIndicator = function () {
    const indicator = document.createElement('div');
    indicator.className = 'network-status';
    document.body.appendChild(indicator);
    return indicator;
};

// Enhanced error handling for network issues
ForgotPasswordSystem.prototype.handleAPIError = function (error) {
    if (!navigator.onLine) {
        this.showError('Không có kết nối mạng. Vui lòng kiểm tra và thử lại.');
        return;
    }

    // Handle different types of errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        this.showError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } else if (error.message) {
        this.showError(error.message);
    } else {
        this.showError('Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
    }
};

// Add form persistence for better UX
ForgotPasswordSystem.prototype.saveFormState = function () {
    const state = {
        email: this.email,
        currentStep: this.currentStep,
        timestamp: Date.now()
    };

    try {
        localStorage.setItem('forgotPasswordState', JSON.stringify(state));
    } catch (e) {
        console.warn('Could not save form state:', e);
    }
};

ForgotPasswordSystem.prototype.restoreFormState = function () {
    try {
        const saved = localStorage.getItem('forgotPasswordState');
        if (!saved) return;

        const state = JSON.parse(saved);
        const hourAgo = Date.now() - (60 * 60 * 1000);

        // Only restore if less than 1 hour old
        if (state.timestamp < hourAgo) {
            localStorage.removeItem('forgotPasswordState');
            return;
        }

        if (state.email && this.emailInput) {
            this.emailInput.value = state.email;
            this.email = state.email;
        }

        // Show restore notification
        if (state.currentStep > 1) {
            this.showInfo('Phiên làm việc trước đã được khôi phục.');
        }
    } catch (e) {
        console.warn('Could not restore form state:', e);
        localStorage.removeItem('forgotPasswordState');
    }
};

// Add accessibility enhancements
ForgotPasswordSystem.prototype.initializeAccessibility = function () {
    // Add ARIA labels for screen readers
    const processSteps = document.querySelectorAll('.step-item');
    processSteps.forEach((step, index) => {
        step.setAttribute('aria-label', `Bước ${index + 1}`);
    });

    // Add form progress announcements
    const forms = document.querySelectorAll('.step-form');
    forms.forEach(form => {
        form.setAttribute('role', 'form');
    });

    // Keyboard navigation hints
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'h') {
            this.showKeyboardHelp();
        }
    });
};

ForgotPasswordSystem.prototype.showKeyboardHelp = function () {
    const helpModal = document.createElement('div');
    helpModal.className = 'keyboard-help-modal';
    helpModal.innerHTML = `
        <div class="keyboard-help-content">
            <h3><i class="fas fa-keyboard"></i> Phím tắt</h3>
            <div class="shortcuts">
                <div class="shortcut-item">
                    <kbd>Tab</kbd>
                    <span>Di chuyển giữa các trường</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Enter</kbd>
                    <span>Gửi form hiện tại</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Esc</kbd>
                    <span>Quay lại bước trước</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Ctrl + Enter</kbd>
                    <span>Gửi form nhanh</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Alt + H</kbd>
                    <span>Hiển thị trợ giúp này</span>
                </div>
            </div>
            <button class="close-help">Đóng</button>
        </div>
    `;

    document.body.appendChild(helpModal);
    setTimeout(() => helpModal.classList.add('show'), 100);

    helpModal.querySelector('.close-help').addEventListener('click', () => {
        helpModal.classList.remove('show');
        setTimeout(() => helpModal.remove(), 300);
    });

    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.remove('show');
            setTimeout(() => helpModal.remove(), 300);
        }
    });
};

ForgotPasswordSystem.prototype.handleHelpLink = function (e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');

    switch (href) {
        case '#help':
            this.showHelpModal('Trợ giúp chung', 'Trang quên mật khẩu giúp bạn khôi phục quyền truy cập vào tài khoản. Vui lòng làm theo các bước hướng dẫn.');
            break;
        case '#security':
            this.showHelpModal('Bảo mật tài khoản', 'Chúng tôi sử dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn. Mật khẩu mới phải đáp ứng các tiêu chí bảo mật.');
            break;
        case '#privacy':
            this.showHelpModal('Chính sách bảo mật', 'Thông tin cá nhân của bạn được bảo vệ theo chính sách bảo mật của chúng tôi. Chúng tôi không chia sẻ thông tin với bên thứ ba.');
            break;
        case '#contact':
            this.showHelpModal('Liên hệ hỗ trợ', 'Nếu bạn gặp khó khăn, vui lòng liên hệ: support@ctsv.edu.vn hoặc hotline: 1900-xxxx');
            break;
    }

    this.logInteraction('help_link_click', { link: href });
};

ForgotPasswordSystem.prototype.showHelpModal = function (title, content) {
    const modal = document.getElementById('keyboardHelpModal');
    if (!modal) return;

    const modalTitle = modal.querySelector('.help-header h3');
    const modalContent = modal.querySelector('.help-content');

    if (modalTitle) modalTitle.textContent = title;
    if (modalContent) modalContent.innerHTML = `<p>${content}</p>`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

ForgotPasswordSystem.prototype.logInteraction = function (action, data = {}) {
    console.log('User interaction:', action, {
        ...data,
        timestamp: new Date().toISOString(),
        step: this.currentStep
    });
};
