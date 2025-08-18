/**
 * ===============================================
 * PROFESSIONAL LOGIN SYSTEM - CTSV ATTENDANCE
 * Modern JavaScript with ES6+ features and smooth UX
 * ===============================================
 */

class ProfessionalLoginSystem {
    constructor() {
        // DOM Elements
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberCheckbox = document.getElementById('remember');
        this.loginBtn = document.getElementById('loginBtn');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.notification = document.getElementById('notification');

        // State management
        this.isLoading = false;
        this.currentUser = null;
        this.loginAttempts = 0;
        this.maxAttempts = 5;

        // Animation configurations
        this.animationConfig = {
            duration: {
                fast: 200,
                normal: 300,
                slow: 500
            },
            easing: {
                smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }
        };

        // Demo accounts database
        this.demoAccounts = [
            {
                email: 'admin@ctsv.edu.vn',
                password: 'admin123',
                role: 'admin',
                name: 'Administrator',
                permissions: ['all'],
                avatar: 'fas fa-user-shield'
            },
            {
                email: 'manager@ctsv.edu.vn',
                password: 'manager123',
                role: 'manager',
                name: 'Manager',
                permissions: ['read', 'write', 'manage_users'],
                avatar: 'fas fa-user-tie'
            },
            {
                email: 'user@ctsv.edu.vn',
                password: 'user123',
                role: 'user',
                name: 'User',
                permissions: ['read'],
                avatar: 'fas fa-user'
            }
        ];

        // Initialize system
        this.init();
    }

    /**
     * Initialize the login system
     */
    init() {
        this.setupEventListeners();
        this.setupTimeDisplay();
        this.loadSavedCredentials();
        this.setupDemoAccounts();
        this.checkLoginAttempts();
        this.preloadNextPage();

        // Add entrance animation
        this.animateEntrance();

        // Setup modal ESC key handler
        this.setupModalKeyboardHandlers();

        console.log('🚀 Professional Login System initialized');
    }

    /**
     * Setup modal keyboard handlers
     */
    setupModalKeyboardHandlers() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modal
                const openModals = document.querySelectorAll('.modal.show');
                openModals.forEach(modal => {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                });
            }
        });
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Form submission
        this.form?.addEventListener('submit', this.handleSubmit.bind(this));

        // Real-time validation
        this.emailInput?.addEventListener('input', this.handleEmailInput.bind(this));
        this.emailInput?.addEventListener('blur', this.validateEmail.bind(this));

        this.passwordInput?.addEventListener('input', this.handlePasswordInput.bind(this));
        this.passwordInput?.addEventListener('blur', this.validatePassword.bind(this));

        // Password toggle
        this.passwordToggle?.addEventListener('click', this.togglePassword.bind(this));

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

        // Page visibility change (detect when user comes back to tab)
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        // Connection status
        window.addEventListener('online', () => this.showNotification('Đã kết nối internet', 'success'));
        window.addEventListener('offline', () => this.showNotification('Mất kết nối internet', 'warning'));
    }

    /**
     * Setup real-time clock display
     */
    setupTimeDisplay() {
        const timeElement = document.getElementById('currentTime');
        const dateElement = document.getElementById('currentDate');

        const updateTime = () => {
            const now = new Date();

            // Format time
            const timeOptions = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };

            // Format date
            const dateOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };

            if (timeElement) {
                timeElement.textContent = now.toLocaleTimeString('vi-VN', timeOptions);
            }

            if (dateElement) {
                dateElement.textContent = now.toLocaleDateString('vi-VN', dateOptions);
            }
        };

        // Update immediately and then every second
        updateTime();
        setInterval(updateTime, 1000);
    }

    /**
     * Setup demo account interactions
     */
    setupDemoAccounts() {
        const demoAccounts = document.querySelectorAll('.demo-account');
        const demoToggleBtn = document.getElementById('demoToggleBtn');
        const demoAccountsContainer = document.getElementById('demoAccounts');

        // Setup demo accounts click handlers
        demoAccounts.forEach((account, index) => {
            account.addEventListener('click', () => this.fillDemoAccount(account));

            // Add stagger animation
            account.style.animationDelay = `${1.2 + (index * 0.2)}s`;
        });

        // Setup demo toggle button
        if (demoToggleBtn && demoAccountsContainer) {
            demoToggleBtn.addEventListener('click', () => {
                this.toggleDemoAccounts(demoToggleBtn, demoAccountsContainer);
            });
        }
    }

    /**
     * Toggle demo accounts visibility
     */
    toggleDemoAccounts(toggleBtn, accountsContainer) {
        const isVisible = accountsContainer.classList.contains('show');

        if (isVisible) {
            // Hide demo accounts
            accountsContainer.classList.remove('show');
            toggleBtn.classList.remove('active');

            // Update button text and icon
            const buttonText = toggleBtn.querySelector('span');
            if (buttonText) buttonText.textContent = 'Tài khoản demo';

        } else {
            // Show demo accounts
            accountsContainer.style.display = 'flex';
            setTimeout(() => {
                accountsContainer.classList.add('show');
                toggleBtn.classList.add('active');
            }, 10);

            // Update button text and icon
            const buttonText = toggleBtn.querySelector('span');
            if (buttonText) buttonText.textContent = 'Ẩn tài khoản demo';
        }

        // Add click animation
        toggleBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            toggleBtn.style.transform = 'scale(1)';
        }, 150);
    }

    /**
     * Fill demo account credentials
     */
    fillDemoAccount(accountElement) {
        const email = accountElement.dataset.email;
        const password = accountElement.dataset.password;

        // Clear previous selections
        document.querySelectorAll('.demo-account').forEach(acc => {
            acc.classList.remove('selected');
        });

        // Select current account
        accountElement.classList.add('selected');

        // Fill form with animation
        this.fillFormWithAnimation(email, password);

        // Clear any existing errors
        this.clearAllErrors();

        // Show success feedback
        this.showNotification('Đã chọn tài khoản demo', 'success');

        // Auto-focus login button after a short delay
        setTimeout(() => {
            this.loginBtn?.focus();
        }, 500);
    }

    /**
     * Fill form fields with smooth animation
     */
    async fillFormWithAnimation(email, password) {
        // Clear current values
        this.emailInput.value = '';
        this.passwordInput.value = '';

        // Type email
        await this.typeText(this.emailInput, email);

        // Small delay between fields
        await this.delay(300);

        // Type password
        await this.typeText(this.passwordInput, password);

        // Trigger validation
        this.validateEmail();
        this.validatePassword();
    }

    /**
     * Simulate typing animation
     */
    async typeText(input, text) {
        const typingSpeed = 50; // ms per character

        for (let i = 0; i <= text.length; i++) {
            input.value = text.substring(0, i);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            await this.delay(typingSpeed);
        }
    }

    /**
     * Handle form submission
     */
    async handleSubmit(event) {
        event.preventDefault();

        if (this.isLoading) return;

        // Validate all fields
        const isValid = this.validateAllFields();
        if (!isValid) return;

        // Check login attempts
        if (this.loginAttempts >= this.maxAttempts) {
            this.showNotification('Quá nhiều lần thử. Vui lòng thử lại sau 5 phút', 'error');
            return;
        }

        try {
            this.setLoadingState(true);

            // Simulate API call with realistic delay
            const result = await this.authenticateUser();

            if (result.success) {
                await this.handleLoginSuccess(result.user);
            } else {
                this.handleLoginError(result.message);
            }

        } catch (error) {
            console.error('Login error:', error);
            this.handleLoginError('Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Authenticate user credentials
     */
    async authenticateUser() {
        // Simulate network delay
        await this.delay(1500);

        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;

        // Find matching account
        const account = this.demoAccounts.find(acc =>
            acc.email === email && acc.password === password
        );

        if (account) {
            return {
                success: true,
                user: {
                    ...account,
                    loginTime: new Date().toISOString(),
                    sessionId: this.generateSessionId()
                }
            };
        } else {
            this.loginAttempts++;
            return {
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            };
        }
    }

    /**
     * Handle successful login
     */
    async handleLoginSuccess(user) {
        // Save user session
        this.saveUserSession(user);

        // Save credentials if remember me is checked
        if (this.rememberCheckbox?.checked) {
            this.saveCredentials(user.email);
        }

        // Reset login attempts
        this.loginAttempts = 0;
        localStorage.removeItem('loginAttempts');

        // Show success message
        this.showNotification(`Chào mừng ${user.name}!`, 'success');

        // Add success animation to form
        this.form.style.transform = 'scale(0.95)';
        this.form.style.opacity = '0.8';

        // Redirect after animation
        setTimeout(() => {
            this.redirectToDashboard(user.role);
        }, 2000);
    }

    /**
     * Handle login error
     */
    handleLoginError(message) {
        // Show error message
        this.showNotification(message, 'error');

        // Focus on password field
        this.passwordInput?.focus();
        this.passwordInput?.select();

        // Add shake animation to form
        this.form.classList.add('shake');
        setTimeout(() => {
            this.form.classList.remove('shake');
        }, 600);

        // Save login attempts
        localStorage.setItem('loginAttempts', this.loginAttempts.toString());
        localStorage.setItem('lastAttemptTime', new Date().getTime().toString());
    }

    /**
     * Validate all form fields
     */
    validateAllFields() {
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();

        return isEmailValid && isPasswordValid;
    }

    /**
     * Validate email field
     */
    validateEmail() {
        const email = this.emailInput?.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            this.showFieldError('email', 'Vui lòng nhập địa chỉ email');
            return false;
        }

        if (!emailRegex.test(email)) {
            this.showFieldError('email', 'Địa chỉ email không hợp lệ');
            return false;
        }

        this.clearFieldError('email');
        return true;
    }

    /**
     * Validate password field
     */
    validatePassword() {
        const password = this.passwordInput?.value;

        if (!password) {
            this.showFieldError('password', 'Vui lòng nhập mật khẩu');
            return false;
        }

        if (password.length < 6) {
            this.showFieldError('password', 'Mật khẩu phải có ít nhất 6 ký tự');
            return false;
        }

        this.clearFieldError('password');
        return true;
    }

    /**
     * Show field error
     */
    showFieldError(fieldName, message) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);

        if (input) {
            input.classList.add('error');
        }

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    /**
     * Clear field error
     */
    clearFieldError(fieldName) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);

        if (input) {
            input.classList.remove('error');
        }

        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    /**
     * Clear all field errors
     */
    clearAllErrors() {
        this.clearFieldError('email');
        this.clearFieldError('password');
    }

    /**
     * Handle email input changes
     */
    handleEmailInput() {
        if (this.emailInput?.value) {
            this.clearFieldError('email');
        }
    }

    /**
     * Handle password input changes
     */
    handlePasswordInput() {
        if (this.passwordInput?.value) {
            this.clearFieldError('password');
        }
    }

    /**
     * Toggle password visibility
     */
    togglePassword() {
        const isPassword = this.passwordInput.type === 'password';
        const icon = this.passwordToggle?.querySelector('i');

        this.passwordInput.type = isPassword ? 'text' : 'password';

        if (icon) {
            icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        }

        // Add animation
        this.passwordToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.passwordToggle.style.transform = 'scale(1)';
        }, 150);
    }

    /**
     * Set loading state
     */
    setLoadingState(loading) {
        this.isLoading = loading;

        if (this.loginBtn) {
            if (loading) {
                this.loginBtn.classList.add('loading');
                this.loginBtn.disabled = true;
            } else {
                this.loginBtn.classList.remove('loading');
                this.loginBtn.disabled = false;
            }
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info', duration = 4000) {
        if (!this.notification) return;

        // Clear existing notification
        this.notification.className = 'notification';
        this.notification.textContent = message;

        // Add type class
        this.notification.classList.add(type);

        // Show notification
        setTimeout(() => {
            this.notification.classList.add('show');
        }, 100);

        // Auto hide
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, duration);
    }

    /**
     * Save user session
     */
    saveUserSession(user) {
        const session = {
            user: user,
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };

        localStorage.setItem('userSession', JSON.stringify(session));
        sessionStorage.setItem('isLoggedIn', 'true');
    }

    /**
     * Save login credentials
     */
    saveCredentials(email) {
        localStorage.setItem('savedEmail', email);
        localStorage.setItem('rememberMe', 'true');
    }

    /**
     * Load saved credentials
     */
    loadSavedCredentials() {
        const savedEmail = localStorage.getItem('savedEmail');
        const rememberMe = localStorage.getItem('rememberMe');

        if (savedEmail && rememberMe === 'true') {
            if (this.emailInput) this.emailInput.value = savedEmail;
            if (this.rememberCheckbox) this.rememberCheckbox.checked = true;
        }
    }

    /**
     * Check login attempts
     */
    checkLoginAttempts() {
        const attempts = localStorage.getItem('loginAttempts');
        const lastAttemptTime = localStorage.getItem('lastAttemptTime');

        if (attempts && lastAttemptTime) {
            const timeDiff = new Date().getTime() - parseInt(lastAttemptTime);
            const fiveMinutes = 5 * 60 * 1000;

            if (timeDiff < fiveMinutes) {
                this.loginAttempts = parseInt(attempts);
            } else {
                // Reset attempts after 5 minutes
                localStorage.removeItem('loginAttempts');
                localStorage.removeItem('lastAttemptTime');
                this.loginAttempts = 0;
            }
        }
    }

    /**
     * Generate session ID
     */
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Redirect to dashboard based on user role
     */
    redirectToDashboard(role) {
        // Set authentication status
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', role);

        const dashboards = {
            'admin': '../../pages/dashboard/dashboard.html',
            'manager': '../../pages/dashboard/dashboard.html',
            'user': '../../index.html'
        };

        const redirectUrl = dashboards[role] || '../../index.html';

        // Add page transition effect
        document.body.style.opacity = '0';
        document.body.style.transform = 'scale(0.95)';

        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 500);
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Ctrl+Enter to submit form
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            this.handleSubmit(new Event('submit'));
        }

        // Escape to clear form
        if (event.key === 'Escape') {
            this.clearForm();
        }

        // F1 for help
        if (event.key === 'F1') {
            event.preventDefault();
            this.showHelpModal();
        }
    }

    /**
     * Handle page visibility change
     */
    handleVisibilityChange() {
        if (!document.hidden) {
            // User returned to tab, refresh time display
            this.setupTimeDisplay();

            // Check if session is still valid
            this.checkSessionValidity();
        }
    }

    /**
     * Check session validity
     */
    checkSessionValidity() {
        const session = localStorage.getItem('userSession');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const now = new Date().getTime();
                const expiresAt = new Date(sessionData.expiresAt).getTime();

                if (now > expiresAt) {
                    localStorage.removeItem('userSession');
                    sessionStorage.removeItem('isLoggedIn');
                    this.showNotification('Phiên đăng nhập đã hết hạn', 'warning');
                }
            } catch (error) {
                console.error('Session validation error:', error);
            }
        }
    }

    /**
     * Clear form
     */
    clearForm() {
        if (this.emailInput) this.emailInput.value = '';
        if (this.passwordInput) this.passwordInput.value = '';
        if (this.rememberCheckbox) this.rememberCheckbox.checked = false;

        this.clearAllErrors();

        // Clear demo selection
        document.querySelectorAll('.demo-account').forEach(acc => {
            acc.classList.remove('selected');
        });

        this.showNotification('Đã xóa thông tin form', 'info');
    }

    /**
     * Preload next page for faster navigation
     */
    preloadNextPage() {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = '../../index.html';
        document.head.appendChild(link);
    }

    /**
     * Advanced entrance animations with staggered effects
     */
    animateEntrance() {
        // Professional staggered entrance animations
        const animationSequence = [
            { selector: '.breadcrumb-nav', delay: 0 },
            { selector: '.brand-content h1', delay: 200 },
            { selector: '.brand-content p', delay: 400 },
            { selector: '.feature-item', delay: 600, stagger: 100 },
            { selector: '.stat-item', delay: 800, stagger: 150 },
            { selector: '.login-form-wrapper', delay: 1000 },
            { selector: '.form-input', delay: 1200, stagger: 100 },
            { selector: '.login-btn', delay: 1400 },
            { selector: '.demo-accounts', delay: 1600 }
        ];

        animationSequence.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            elements.forEach((element, index) => {
                const delay = item.delay + (item.stagger ? index * item.stagger : 0);
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';

                setTimeout(() => {
                    element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay);
            });
        });

        // Setup interactive animations after entrance
        setTimeout(() => this.setupInteractiveAnimations(), 2000);
    }

    /**
     * Setup interactive animations for form elements
     */
    setupInteractiveAnimations() {
        // Enhanced input focus animations
        const formInputs = document.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                const container = input.closest('.input-container') || input.parentElement;
                container.style.transform = 'translateY(-3px)';
                container.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.15)';
                container.style.borderColor = 'var(--primary-color)';
            });

            input.addEventListener('blur', () => {
                const container = input.closest('.input-container') || input.parentElement;
                container.style.transform = 'translateY(0)';
                container.style.boxShadow = 'var(--shadow-md)';
                container.style.borderColor = 'var(--gray-200)';
            });
        });

        // Button pulse animation when form is ready
        this.setupButtonAnimations();

        // Feature items hover effects
        this.setupFeatureAnimations();

        // Stats counter animation
        this.setupStatsAnimation();
    }

    /**
     * Setup button animations
     */
    setupButtonAnimations() {
        const loginBtn = this.loginBtn;
        if (!loginBtn) return;

        const updateButtonState = () => {
            const isValid = this.emailInput?.value && this.passwordInput?.value;
            if (isValid && !this.isLoading) {
                loginBtn.style.animation = 'pulseGlow 2s infinite';
                loginBtn.style.background = 'var(--gradient-button)';
            } else {
                loginBtn.style.animation = 'none';
            }
        };

        this.emailInput?.addEventListener('input', updateButtonState);
        this.passwordInput?.addEventListener('input', updateButtonState);

        // Login button hover effect
        loginBtn.addEventListener('mouseenter', () => {
            if (!this.isLoading) {
                loginBtn.style.transform = 'translateY(-2px) scale(1.02)';
                loginBtn.style.boxShadow = 'var(--shadow-glow), var(--shadow-xl)';
            }
        });

        loginBtn.addEventListener('mouseleave', () => {
            if (!this.isLoading) {
                loginBtn.style.transform = 'translateY(0) scale(1)';
                loginBtn.style.boxShadow = 'var(--shadow-lg)';
            }
        });
    }

    /**
     * Setup feature animations
     */
    setupFeatureAnimations() {
        const featureItems = document.querySelectorAll('.feature-item');
        featureItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-8px) scale(1.03)';
                item.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.2)';

                // Add ripple effect
                this.createRippleEffect(item);
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
                item.style.boxShadow = 'var(--shadow-md)';
            });
        });
    }

    /**
     * Setup stats animation
     */
    setupStatsAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            if (isNaN(finalValue)) return;

            let currentValue = 0;
            const increment = finalValue / 30; // 30 frames
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    currentValue = finalValue;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(currentValue).toLocaleString();
            }, 50);
        });
    }

    /**
     * Create ripple effect on element
     */
    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(102, 126, 234, 0.3);
            transform: scale(0);
            animation: rippleEffect 0.6s linear;
            pointer-events: none;
            left: 50%;
            top: 50%;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Utility function for delays
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Modal Management Functions - Properly Centered
 */
function showHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        // Ensure modal is hidden first
        modal.style.display = 'none';
        modal.classList.remove('show');

        // Reset all positioning
        modal.style.cssText = `
            display: flex !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 9999 !important;
            background: rgba(0, 0, 0, 0.5) !important;
            backdrop-filter: blur(10px);
            opacity: 1 !important;
            visibility: visible !important;
        `;

        // Add show class
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Center modal content
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.cssText = `
                position: relative !important;
                margin: 0 !important;
                transform: none !important;
                max-width: min(600px, 90vw) !important;
                max-height: 90vh !important;
                overflow-y: auto !important;
            `;
        }

        // Focus management
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();

        // Close on outside click
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal('helpModal');
            }
        });
    }
}

function showContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        // Ensure modal is hidden first
        modal.style.display = 'none';
        modal.classList.remove('show');

        // Reset all positioning
        modal.style.cssText = `
            display: flex !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 9999 !important;
            background: rgba(0, 0, 0, 0.5) !important;
            backdrop-filter: blur(10px);
            opacity: 1 !important;
            visibility: visible !important;
        `;

        // Add show class
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Center modal content
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.cssText = `
                position: relative !important;
                margin: 0 !important;
                transform: none !important;
                max-width: min(600px, 90vw) !important;
                max-height: 90vh !important;
                overflow-y: auto !important;
            `;
        }

        // Focus management
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();

        // Close on outside click
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal('contactModal');
            }
        });
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.cssText = 'display: none !important;';
        document.body.style.overflow = '';

        // Return focus to page
        document.body.focus();
    }
}

/**
 * Service Worker Registration
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('../../sw.js');
                console.log('✅ Service Worker registered successfully');

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    console.log('🔄 Service Worker update found');
                });

            } catch (error) {
                console.log('❌ Service Worker registration failed:', error);
            }
        });
    }
}

/**
 * Initialize Application with Smooth Animations
 */
document.addEventListener('DOMContentLoaded', () => {
    // Hide all modals on page load
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
        modal.style.cssText = 'display: none !important;';
    });

    // Initialize smooth animations
    initSmoothAnimations();

    // Initialize login system
    window.loginSystem = new ProfessionalLoginSystem();

    // Register service worker
    registerServiceWorker();

    // Setup modal click handlers
    document.addEventListener('click', (event) => {
        // Close modal when clicking outside
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
            event.target.style.cssText = 'display: none !important;';
            document.body.style.overflow = '';
        }
    });

    // Setup accessibility improvements
    document.addEventListener('keydown', (event) => {
        // Close modal with Escape key
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                openModal.classList.remove('show');
                openModal.style.cssText = 'display: none !important;';
                document.body.style.overflow = '';
            }
        }
    });

    console.log('🎉 Professional Login System fully loaded and ready!');
});

/**
 * Initialize Smooth Animations and Interactions
 */
function initSmoothAnimations() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Animate elements on scroll (intersection observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
        '.feature-item, .form-group, .login-btn, .demo-account'
    );

    animatableElements.forEach(el => {
        observer.observe(el);
    });

    // Add smooth hover effects to all interactive elements
    addSmoothHoverEffects();

    // Add particle effects
    initParticleEffects();

    // Add smooth loading transitions
    initLoadingTransitions();
}

/**
 * Add Smooth Hover Effects
 */
function addSmoothHoverEffects() {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.login-btn, .demo-toggle-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced input focus effects
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Feature item magnetic effect
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / 10;
            const deltaY = (y - centerY) / 10;

            this.style.transform = `translateY(-8px) scale(1.02) rotateX(${-deltaY}deg) rotateY(${deltaX}deg)`;
        });

        item.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg)';
        });
    });
}

/**
 * Initialize Particle Effects
 */
function initParticleEffects() {
    // Create floating particles in background
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -2;
        overflow: hidden;
    `;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        particleContainer.appendChild(particle);
    }

    document.body.appendChild(particleContainer);

    // Add particle animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize Loading Transitions
 */
function initLoadingTransitions() {
    // Stagger animation delays for form elements
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${0.8 + (index * 0.1)}s`;
    });

    // Add smooth page transition
    window.addEventListener('beforeunload', function () {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease-out';
    });

    // Add ripple effect to buttons
    const rippleButtons = document.querySelectorAll('.login-btn');
    rippleButtons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

/**
 * Create Ripple Effect
 */
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.cssText = `
        width: ${diameter}px;
        height: ${diameter}px;
        left: ${event.clientX - rect.left - radius}px;
        top: ${event.clientY - rect.top - radius}px;
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;

    const ripple = button.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }

    circle.classList.add('ripple');
    button.appendChild(circle);

    // Add ripple animation keyframes if not exists
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Performance Monitoring
 */
window.addEventListener('load', () => {
    // Log performance metrics
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`📊 Page load time: ${loadTime}ms`);
    }

    // Check for slow connections
    if (navigator.connection) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            console.log('⚠️ Slow connection detected, optimizing...');
            // Could implement progressive loading here
        }
    }
});

/**
 * Error Handling
 */
window.addEventListener('error', (event) => {
    console.error('🚨 Global error:', event.error);

    // Show user-friendly error message
    if (window.loginSystem) {
        window.loginSystem.showNotification(
            'Có lỗi xảy ra. Vui lòng tải lại trang.',
            'error'
        );
    }
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProfessionalLoginSystem };
}
