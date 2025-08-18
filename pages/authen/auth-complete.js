/**
* Auth Module - Complete Authentication System
* Tổng hợp tất cả chức năng authentication
*/

class AuthModule {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.digitalRain = null;
        this.init();
    }

    init() {
        this.initDigitalRain();
        this.initEventListeners();
        this.checkAuthState();
    }

    // Digital Rain Effect
    initDigitalRain() {
        const canvas = document.getElementById('digital-rain');
        if (!canvas) return;

        this.digitalRain = new DigitalRainEffect(canvas);
        this.digitalRain.start();
    }

    // Event Listeners
    initEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }

        // Logout buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('logout-btn')) {
                this.handleLogout(e);
            }
        });
    }

    // Login Handler
    async handleLogin(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            this.showLoading(true);
            const result = await this.authenticateUser(credentials);

            if (result.success) {
                this.setAuthenticatedUser(result.user);
                this.redirectAfterLogin();
                this.showNotification('Đăng nhập thành công!', 'success');
            } else {
                this.showNotification('Thông tin đăng nhập không đúng!', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Lỗi đăng nhập. Vui lòng thử lại!', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Register Handler
    async handleRegister(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Validation
        if (!this.validateRegistration(userData)) {
            return;
        }

        try {
            this.showLoading(true);
            const result = await this.registerUser(userData);

            if (result.success) {
                this.showNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                this.showNotification(result.message || 'Đăng ký thất bại!', 'error');
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showNotification('Lỗi đăng ký. Vui lòng thử lại!', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Logout Handler
    handleLogout(event) {
        event.preventDefault();

        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            this.clearAuthData();
            this.redirectToLogin();
            this.showNotification('Đăng xuất thành công!', 'info');
        }
    }

    // Authentication API calls
    async authenticateUser(credentials) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Demo authentication
                if (credentials.username === 'admin' && credentials.password === 'admin123') {
                    resolve({
                        success: true,
                        user: {
                            id: 1,
                            username: 'admin',
                            email: 'admin@ctsv.edu.vn',
                            role: 'admin',
                            fullName: 'Quản trị viên'
                        }
                    });
                } else {
                    resolve({ success: false });
                }
            }, 1500);
        });
    }

    async registerUser(userData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Đăng ký thành công'
                });
            }, 1500);
        });
    }

    // Validation
    validateRegistration(userData) {
        if (!userData.username || userData.username.length < 3) {
            this.showNotification('Tên đăng nhập phải có ít nhất 3 ký tự!', 'error');
            return false;
        }

        if (!this.isValidEmail(userData.email)) {
            this.showNotification('Email không hợp lệ!', 'error');
            return false;
        }

        if (!userData.password || userData.password.length < 6) {
            this.showNotification('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
            return false;
        }

        if (userData.password !== userData.confirmPassword) {
            this.showNotification('Mật khẩu xác nhận không khớp!', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Auth State Management
    setAuthenticatedUser(user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('loginTime', new Date().toISOString());
    }

    clearAuthData() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('loginTime');
    }

    checkAuthState() {
        const storedUser = localStorage.getItem('currentUser');
        const isAuth = localStorage.getItem('isAuthenticated');

        if (storedUser && isAuth === 'true') {
            this.currentUser = JSON.parse(storedUser);
            this.isAuthenticated = true;
            return true;
        }
        return false;
    }

    // Navigation
    redirectAfterLogin() {
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
        const defaultUrl = '../../index.html';
        window.location.href = returnUrl || defaultUrl;
    }

    redirectToLogin() {
        window.location.href = 'pages/authen/login.html';
    }

    // UI Helpers
    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = show ? 'flex' : 'none';
        }

        const submitBtns = document.querySelectorAll('button[type="submit"]');
        submitBtns.forEach(btn => {
            btn.disabled = show;
            btn.innerHTML = show ?
                '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...' :
                btn.dataset.originalText || btn.innerHTML;

            if (!show && !btn.dataset.originalText) {
                btn.dataset.originalText = btn.innerHTML;
            }
        });
    }

    showNotification(message, type = 'info') {
        // Use existing notification system
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
            }, 100);

            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Public Methods
    getCurrentUser() {
        return this.currentUser;
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    requireAuth() {
        if (!this.isAuthenticated) {
            const currentUrl = encodeURIComponent(window.location.href);
            window.location.href = `pages/authen/login.html?returnUrl=${currentUrl}`;
            return false;
        }
        return true;
    }
}

// Digital Rain Effect Class
class DigitalRainEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        this.drops = [];
        this.animationId = null;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const columns = Math.floor(this.canvas.width / 15);
        this.drops = Array(columns).fill(0);
    }

    start() {
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    animate() {
        // Semi-transparent black background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Green text
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '12px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            const x = i * 15;
            const y = this.drops[i] * 14;

            this.ctx.fillText(text, x, y);

            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.authModule = new AuthModule();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthModule, DigitalRainEffect };
}
