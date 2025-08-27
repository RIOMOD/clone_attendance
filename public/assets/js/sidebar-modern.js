// Modern Sidebar JavaScript - Shared functionality
class ModernSidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.isCollapsed = false;
        this.isMobile = window.innerWidth <= 1024;

        this.init();
    }

    init() {
        this.bindEvents();
        this.handleResize();
        this.setActiveNavItem();

        // Set initial state based on localStorage
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true' && !this.isMobile) {
            this.toggleSidebar();
        }
    }

    bindEvents() {
        // Sidebar toggle button
        if (this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Mobile menu button
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileSidebar());
        }

        // Overlay click to close sidebar on mobile
        if (this.sidebarOverlay) {
            this.sidebarOverlay.addEventListener('click', () => this.closeMobileSidebar());
        }

        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());

        // Escape key to close mobile sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobile && this.sidebar?.classList.contains('active')) {
                this.closeMobileSidebar();
            }
        });

        // Navigation link hover effects
        this.setupNavLinkEffects();
    }

    toggleSidebar() {
        if (this.isMobile) {
            this.toggleMobileSidebar();
            return;
        }

        this.isCollapsed = !this.isCollapsed;

        if (this.sidebar) {
            this.sidebar.classList.toggle('collapsed');
        }

        // Rotate toggle icon
        if (this.sidebarToggle) {
            const icon = this.sidebarToggle.querySelector('i');
            if (icon) {
                icon.style.transform = this.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }

        // Save state to localStorage
        localStorage.setItem('sidebarCollapsed', this.isCollapsed);

        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('sidebarToggle', {
            detail: { collapsed: this.isCollapsed }
        }));
    }

    toggleMobileSidebar() {
        if (!this.sidebar) return;

        const isActive = this.sidebar.classList.contains('active');

        if (isActive) {
            this.closeMobileSidebar();
        } else {
            this.openMobileSidebar();
        }
    }

    openMobileSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.add('active');
        }
        if (this.sidebarOverlay) {
            this.sidebarOverlay.classList.add('active');
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeMobileSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.remove('active');
        }
        if (this.sidebarOverlay) {
            this.sidebarOverlay.classList.remove('active');
        }

        // Restore body scroll
        document.body.style.overflow = '';
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 1024;

        // If switching from mobile to desktop
        if (wasMobile && !this.isMobile) {
            this.closeMobileSidebar();

            // Restore collapsed state from localStorage
            const savedState = localStorage.getItem('sidebarCollapsed');
            if (savedState === 'true' && this.sidebar) {
                this.sidebar.classList.add('collapsed');
                this.isCollapsed = true;
            }
        }

        // If switching from desktop to mobile
        if (!wasMobile && this.isMobile) {
            if (this.sidebar) {
                this.sidebar.classList.remove('collapsed');
            }
            this.isCollapsed = false;
        }
    }

    setActiveNavItem() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            const navItem = link.closest('.nav-item');

            if (navItem) {
                navItem.classList.remove('active');
            }

            // Check if current path matches link path
            if (linkPath && (currentPath.includes(linkPath) ||
                (linkPath.includes('dashboard') && currentPath.includes('dashboard')) ||
                (linkPath.includes('operations') && currentPath.includes('operations')) ||
                (linkPath.includes('statistics') && currentPath.includes('statistics')) ||
                (linkPath.includes('calendar') && currentPath.includes('calendar')) ||
                (linkPath.includes('profile') && currentPath.includes('profile')) ||
                (linkPath.includes('CLB') && currentPath.includes('CLB')))) {
                navItem?.classList.add('active');
            }
        });
    }

    setupNavLinkEffects() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                if (!this.isCollapsed) return;

                const tooltip = this.createTooltip(e.target.querySelector('.nav-text')?.textContent || '');
                document.body.appendChild(tooltip);

                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.right + 10}px`;
                tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltip.offsetHeight / 2)}px`;

                setTimeout(() => tooltip.classList.add('show'), 10);
            });

            link.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.sidebar-tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    createTooltip(text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'sidebar-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: fixed;
            background: var(--text-primary);
            color: var(--text-white);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1001;
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.2s ease;
            pointer-events: none;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        return tooltip;
    }

    // Public methods for external use
    collapse() {
        if (!this.isCollapsed && !this.isMobile) {
            this.toggleSidebar();
        }
    }

    expand() {
        if (this.isCollapsed && !this.isMobile) {
            this.toggleSidebar();
        }
    }

    isOpen() {
        return this.isMobile ?
            this.sidebar?.classList.contains('active') :
            !this.isCollapsed;
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('sidebar')) {
        window.modernSidebar = new ModernSidebar();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernSidebar;
}

// Add CSS for tooltip if not already added
const addTooltipCSS = () => {
    const style = document.createElement('style');
    style.textContent = `
        .sidebar-tooltip.show {
            opacity: 1 !important;
            transform: translateX(0) !important;
        }
    `;
    document.head.appendChild(style);
};

// Add tooltip CSS when script loads
addTooltipCSS();
