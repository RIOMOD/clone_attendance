// ===== HỆ THỐNG ĐIỀU HƯỚNG TRANG - CTSV ATTENDANCE =====
// File cấu hình toàn bộ liên kết và điều hướng giữa các trang

window.NavigationConfig = {
    // ===== MENU ĐIỀU HƯỚNG CHÍNH =====
    // Các trang chính của hệ thống
    mainNav: [
        {
            label: 'Dashboard',
            href: 'dashboard.html',
            icon: 'fas fa-tachometer-alt',
            description: 'Tổng quan hệ thống và thống kê chung'
        },
        {
            label: 'Lịch tổng quan',
            href: 'calendar-overview.html',
            icon: 'fas fa-calendar-alt',
            description: 'Xem lịch tổng quan toàn hệ thống'
        },
        {
            label: 'Lịch cá nhân',
            href: '../index.html',
            icon: 'fas fa-calendar-user',
            description: 'Lịch làm việc và chấm công cá nhân'
        },
        {
            label: 'Thống kê cá nhân',
            href: 'personal-stats.html',
            icon: 'fas fa-chart-line',
            description: 'Báo cáo và phân tích thống kê cá nhân'
        }
    ],

    // ===== MENU QUẢN LÝ HỆ THỐNG =====
    // Các chức năng quản lý và vận hành
    managementDropdown: [
        {
            label: 'Vận hành hệ thống',
            href: 'operations.html',
            icon: 'fas fa-cogs',
            description: 'Quản lý vận hành và cài đặt hệ thống'
        },
        {
            label: 'Tổng quan CLB',
            href: 'clubs.html',
            icon: 'fas fa-users',
            description: 'Dashboard quản lý câu lạc bộ'
        },
        {
            label: 'Danh sách CLB',
            href: 'clubs-list.html',
            icon: 'fas fa-list',
            description: 'Danh sách và tìm kiếm câu lạc bộ'
        },
        {
            label: 'Ban chủ nhiệm',
            href: 'club-organizers.html',
            icon: 'fas fa-user-tie',
            description: 'Quản lý ban chủ nhiệm các CLB'
        },
        {
            label: 'Thành viên CLB',
            href: 'club-members.html',
            icon: 'fas fa-user-friends',
            description: 'Quản lý danh sách thành viên CLB'
        },
        {
            label: 'Sự kiện CLB',
            href: 'club-events.html',
            icon: 'fas fa-calendar-check',
            description: 'Lập lịch và quản lý sự kiện CLB'
        }
    ],

    // ===== MENU THÔNG TIN CÁ NHÂN =====
    // Các tùy chọn liên quan đến tài khoản người dùng
    profileDropdown: [
        {
            label: 'Hồ sơ cá nhân',
            href: 'profile.html',
            icon: 'fas fa-user',
            description: 'Xem và chỉnh sửa thông tin cá nhân'
        },
        {
            label: 'Thống kê cá nhân',
            href: 'personal-stats.html',
            icon: 'fas fa-chart-line',
            description: 'Xem báo cáo hiệu suất làm việc'
        },
        {
            label: 'Dashboard',
            href: 'dashboard.html',
            icon: 'fas fa-tachometer-alt',
            description: 'Về trang bảng điều khiển chính'
        },
        {
            label: 'Cài đặt',
            href: '#',
            icon: 'fas fa-cog',
            description: 'Tùy chỉnh cài đặt tài khoản',
            action: 'openSettingsModal'
        },
        {
            label: 'Trợ giúp',
            href: '#',
            icon: 'fas fa-question-circle',
            description: 'Hướng dẫn sử dụng hệ thống',
            action: 'openHelpModal'
        },
        {
            label: 'Đăng xuất',
            href: 'login.html',
            icon: 'fas fa-sign-out-alt',
            description: 'Thoát khỏi hệ thống',
            action: 'handleLogout'
        }
    ],

    // ===== MENU SIDEBAR =====
    // Menu bên trái cho các trang dashboard và stats
    sidebarNav: [
        {
            label: 'Trang chủ',
            href: '../index.html',
            icon: 'fas fa-home',
            description: 'Về trang chấm công chính'
        },
        {
            label: 'Dashboard',
            href: 'dashboard.html',
            icon: 'fas fa-tachometer-alt',
            description: 'Bảng điều khiển tổng quan'
        },
        {
            label: 'Lịch tổng quan',
            href: 'calendar-overview.html',
            icon: 'fas fa-calendar-alt',
            description: 'Xem lịch toàn hệ thống'
        },
        {
            label: 'Vận hành',
            href: 'operations.html',
            icon: 'fas fa-cogs',
            description: 'Quản lý hệ thống'
        },
        {
            label: 'Thống kê cá nhân',
            href: 'personal-stats.html',
            icon: 'fas fa-chart-line',
            description: 'Báo cáo cá nhân'
        }
    ],

    // ===== CÁC PHẦN SIDEBAR =====
    // Nhóm các menu theo chuyên đề
    sidebarSections: {
        // Phần quản lý câu lạc bộ
        clubs: {
            title: 'Quản lý câu lạc bộ',
            items: [
                {
                    label: 'Tổng quan CLB',
                    href: 'clubs.html',
                    icon: 'fas fa-users',
                    description: 'Dashboard CLB'
                },
                {
                    label: 'Danh sách CLB',
                    href: 'clubs-list.html',
                    icon: 'fas fa-list',
                    description: 'Danh mục CLB'
                },
                {
                    label: 'Ban chủ nhiệm',
                    href: 'club-organizers.html',
                    icon: 'fas fa-user-tie',
                    description: 'Quản lý ban điều hành'
                },
                {
                    label: 'Thành viên CLB',
                    href: 'club-members.html',
                    icon: 'fas fa-user-friends',
                    description: 'Danh sách thành viên'
                },
                {
                    label: 'Sự kiện CLB',
                    href: 'club-events.html',
                    icon: 'fas fa-calendar-check',
                    description: 'Lịch sự kiện CLB'
                }
            ]
        },
        // Phần thống kê và báo cáo
        stats: {
            title: 'Thống kê & Báo cáo',
            items: [
                {
                    label: 'Thống kê cá nhân',
                    href: 'personal-stats.html',
                    icon: 'fas fa-chart-line',
                    description: 'Hiệu suất cá nhân'
                },
                {
                    label: 'Báo cáo tổng quan',
                    href: 'dashboard.html',
                    icon: 'fas fa-chart-bar',
                    description: 'Báo cáo tổng hợp'
                },
                {
                    label: 'Xuất báo cáo',
                    href: '#',
                    icon: 'fas fa-file-alt',
                    description: 'Xuất file báo cáo'
                }
            ]
        },
        // Phần quản trị hệ thống
        system: {
            title: 'Quản trị hệ thống',
            items: [
                {
                    label: 'Cài đặt chung',
                    href: 'operations.html',
                    icon: 'fas fa-cog',
                    description: 'Cấu hình hệ thống'
                },
                {
                    label: 'Phân quyền',
                    href: '#',
                    icon: 'fas fa-users-cog',
                    description: 'Quản lý quyền hạn'
                },
                {
                    label: 'Lịch sử hoạt động',
                    href: '#',
                    icon: 'fas fa-history',
                    description: 'Nhật ký hệ thống'
                }
            ]
        }
    },

    // ===== CẤU HÌNH BREADCRUMB =====
    // Đường dẫn điều hướng cho từng trang
    breadcrumbs: {
        'dashboard.html': ['Trang chủ', 'Dashboard'],
        'personal-stats.html': ['Trang chủ', 'Thống kê cá nhân'],
        'calendar-overview.html': ['Trang chủ', 'Lịch tổng quan'],
        'operations.html': ['Trang chủ', 'Quản lý', 'Vận hành hệ thống'],
        'clubs.html': ['Trang chủ', 'Quản lý', 'Câu lạc bộ', 'Tổng quan'],
        'clubs-list.html': ['Trang chủ', 'Quản lý', 'Câu lạc bộ', 'Danh sách'],
        'club-organizers.html': ['Trang chủ', 'Quản lý', 'Câu lạc bộ', 'Ban chủ nhiệm'],
        'club-members.html': ['Trang chủ', 'Quản lý', 'Câu lạc bộ', 'Thành viên'],
        'club-events.html': ['Trang chủ', 'Quản lý', 'Câu lạc bộ', 'Sự kiện'],
        'profile.html': ['Trang chủ', 'Tài khoản', 'Hồ sơ cá nhân'],
        '../index.html': ['Trang chủ', 'Lịch cá nhân'],
        'login.html': ['Đăng nhập'],
        'register.html': ['Đăng ký tài khoản']
    },

    // ===== CÁC THAO TÁC NHANH =====
    // Menu thao tác nhanh trong header
    quickActions: [
        {
            label: 'Quản lý CLB',
            href: 'clubs.html',
            icon: 'fas fa-users',
            color: 'primary',
            description: 'Quản lý câu lạc bộ'
        },
        {
            label: 'Tạo sự kiện mới',
            href: 'club-events.html',
            icon: 'fas fa-calendar-plus',
            color: 'success',
            description: 'Lập lịch sự kiện CLB'
        },
        {
            label: 'Xem thống kê',
            href: 'personal-stats.html',
            icon: 'fas fa-chart-line',
            color: 'info',
            description: 'Phân tích hiệu suất'
        },
        {
            label: 'Xuất báo cáo',
            href: '#',
            icon: 'fas fa-download',
            color: 'warning',
            description: 'Tải xuống báo cáo',
            action: 'exportReport'
        },
        {
            label: 'Cài đặt hệ thống',
            href: 'operations.html',
            icon: 'fas fa-cogs',
            color: 'secondary',
            description: 'Cấu hình hệ thống'
        }
    ]
};

// ===== CÁC HÀM TIỆN ÍCH ĐIỀU HƯỚNG =====
// Tập hợp các hàm hỗ trợ navigation
window.NavigationUtils = {
    
    // Lấy tên trang hiện tại
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop();
        return page || 'index.html';
    },

    // Kiểm tra trang hiện tại có khớp với href không
    isCurrentPage(href) {
        const currentPage = this.getCurrentPage();
        const targetPage = href.split('/').pop();
        return currentPage === targetPage;
    },

    // Tạo HTML cho menu điều hướng chính
    generateMainNav() {
        let html = '';
        NavigationConfig.mainNav.forEach(item => {
            const isActive = this.isCurrentPage(item.href) ? 'active' : '';
            html += `
                <a href="${item.href}" class="nav-item ${isActive}" title="${item.description}">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </a>
            `;
        });
        return html;
    },

    // Tạo HTML cho dropdown quản lý
    generateManagementDropdown() {
        let html = '';
        NavigationConfig.managementDropdown.forEach(item => {
            const isActive = this.isCurrentPage(item.href) ? 'active' : '';
            html += `
                <a href="${item.href}" class="dropdown-item ${isActive}" title="${item.description}">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </a>
            `;
        });
        return html;
    },

    // Tạo HTML cho sidebar navigation
    generateSidebarNav() {
        let html = '';
        NavigationConfig.sidebarNav.forEach(item => {
            const isActive = this.isCurrentPage(item.href) ? 'active' : '';
            html += `
                <a href="${item.href}" class="menu-item ${isActive}">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </a>
            `;
        });
        return html;
    },

    // Tạo HTML cho sidebar sections
    generateSidebarSections() {
        let html = '';
        Object.keys(NavigationConfig.sidebarSections).forEach(sectionKey => {
            const section = NavigationConfig.sidebarSections[sectionKey];
            html += `
                <div class="menu-section">
                    <h4 class="section-title">${section.title}</h4>
            `;
            section.items.forEach(item => {
                const isActive = this.isCurrentPage(item.href) ? 'active' : '';
                html += `
                    <a href="${item.href}" class="menu-item ${isActive}">
                        <i class="${item.icon}"></i>
                        <span>${item.label}</span>
                    </a>
                `;
            });
            html += '</div>';
        });
        return html;
    },

    // Tạo breadcrumb navigation
    generateBreadcrumb() {
        const currentPage = this.getCurrentPage();
        const breadcrumb = NavigationConfig.breadcrumbs[currentPage];
        
        if (!breadcrumb) return '';
        
        let html = '<nav class="breadcrumb">';
        breadcrumb.forEach((item, index) => {
            if (index === breadcrumb.length - 1) {
                html += `<span class="breadcrumb-current">${item}</span>`;
            } else {
                html += `<span class="breadcrumb-item">${item}</span>`;
                html += '<i class="fas fa-chevron-right breadcrumb-separator"></i>';
            }
        });
        html += '</nav>';
        
        return html;
    },

    // Khởi tạo navigation cho trang
    initNavigation() {
        console.log('🚀 Khởi tạo hệ thống điều hướng...');
        
        // Cập nhật active state cho các menu
        this.updateActiveStates();
        
        // Khởi tạo event listeners
        this.initEventListeners();
        
        console.log('✅ Hệ thống điều hướng đã sẵn sàng!');
    },

    // Cập nhật trạng thái active cho menu
    updateActiveStates() {
        const currentPage = this.getCurrentPage();
        
        // Cập nhật main nav
        document.querySelectorAll('.nav-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href && this.isCurrentPage(href)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Cập nhật sidebar
        document.querySelectorAll('.menu-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href && this.isCurrentPage(href)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },

    // Khởi tạo event listeners
    initEventListeners() {
        // Xử lý click cho các liên kết
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-action]');
            if (link) {
                e.preventDefault();
                const action = link.dataset.action;
                this.handleAction(action);
            }
        });

        // Xử lý hover effects
        document.querySelectorAll('.nav-item, .menu-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target);
            });
            
            item.addEventListener('mouseleave', (e) => {
                this.hideTooltip();
            });
        });
    },

    // Xử lý các action đặc biệt
    handleAction(action) {
        switch(action) {
            case 'openSettingsModal':
                console.log('Mở modal cài đặt...');
                // Thêm logic mở modal cài đặt
                break;
            case 'openHelpModal':
                console.log('Mở modal trợ giúp...');
                // Thêm logic mở modal trợ giúp
                break;
            case 'handleLogout':
                console.log('Đăng xuất...');
                this.handleLogout();
                break;
            case 'exportReport':
                console.log('Xuất báo cáo...');
                // Thêm logic xuất báo cáo
                break;
            default:
                console.warn('Action không được hỗ trợ:', action);
        }
    },

    // Xử lý đăng xuất
    handleLogout() {
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            // Xóa dữ liệu đăng nhập
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isAuthenticated');
            
            // Chuyển hướng về trang đăng nhập
            window.location.href = 'login.html';
        }
    },

    // Hiển thị tooltip
    showTooltip(element) {
        const description = element.getAttribute('title') || element.dataset.description;
        if (description) {
            // Logic hiển thị tooltip
            console.log('Tooltip:', description);
        }
    },

    // Ẩn tooltip
    hideTooltip() {
        // Logic ẩn tooltip
    },

    // Điều hướng đến trang
    navigateTo(href, newTab = false) {
        if (newTab) {
            window.open(href, '_blank');
        } else {
            window.location.href = href;
        }
    },

    // Lấy URL tương đối từ trang hiện tại
    getRelativeUrl(targetPage) {
        const currentPage = this.getCurrentPage();
        const currentDir = window.location.pathname.split('/').slice(0, -1).join('/');
        
        // Xử lý các trường hợp đặc biệt
        if (targetPage.startsWith('../')) {
            return targetPage;
        }
        
        return targetPage;
    }
};

// ===== KHỞI TẠO KHI DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo hệ thống navigation
    if (window.NavigationUtils) {
        window.NavigationUtils.initNavigation();
    }
    
    // Log thông tin trang hiện tại
    const currentPage = window.NavigationUtils?.getCurrentPage() || 'unknown';
    console.log(`📍 Trang hiện tại: ${currentPage}`);
});

// ===== EXPORT CHO SỬ DỤNG TOÀN CỤC =====
window.Navigation = {
    Config: window.NavigationConfig,
    Utils: window.NavigationUtils
};
