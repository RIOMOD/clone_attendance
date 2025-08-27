# Modern Sidebar System - Hướng dẫn sử dụng

## Tổng quan

Hệ thống sidebar hiện đại đã được đồng bộ hóa cho tất cả các trang trong ứng dụng CTSV Attendance. Sidebar có thiết kế responsive, hỗ trợ animation mượt mà và navigation thông minh.

## Cấu trúc files

```
assets/
├── css/
│   └── sidebar-modern.css      # CSS chung cho sidebar
├── js/
│   └── sidebar-modern.js       # JavaScript chung cho sidebar
└── templates/
    └── sidebar-template.html   # Template HTML cho sidebar
```

## Cách tích hợp vào trang mới

### 1. Thêm CSS

```html
<head>
    <!-- CSS khác của trang -->
    <link rel="stylesheet" href="../../assets/css/sidebar-modern.css">
</head>
```

### 2. Thêm HTML

Copy nội dung từ `assets/templates/sidebar-template.html` và paste vào trang, sau thẻ `<header>`:

```html
<header class="dashboard-header">
    <!-- Header content -->
</header>

<!-- Sidebar - Copy from template -->
<aside class="sidebar" id="sidebar">
    <!-- Sidebar content -->
</aside>

<div class="sidebar-overlay" id="sidebarOverlay"></div>
```

### 3. Thêm JavaScript

```html
<body>
    <!-- Page content -->
    
    <script src="../../assets/js/sidebar-modern.js"></script>
</body>
```

### 4. Tùy chỉnh cho từng trang

#### Thay đổi logo sidebar

```html
<div class="sidebar-logo">
    <i class="fas fa-chart-line"></i> <!-- Icon phù hợp với trang -->
    <span>Tên trang</span>           <!-- Tên trang -->
</div>
```

#### Đánh dấu trang hiện tại

```html
<li class="nav-item active"> <!-- Thêm class 'active' -->
    <a href="current-page.html" class="nav-link">
        <i class="fas fa-home"></i>
        <span class="nav-text">Trang hiện tại</span>
        <i class="fas fa-angle-right nav-arrow"></i>
    </a>
</li>
```

## Tính năng

### Desktop

- ✅ Sidebar có thể thu gọn/mở rộng
- ✅ Animation mượt mà khi hover
- ✅ Tooltip hiển thị khi sidebar thu gọn
- ✅ Lưu trạng thái sidebar vào localStorage
- ✅ Navigation sections có tổ chức

### Mobile

- ✅ Sidebar ẩn mặc định
- ✅ Slide-in/out animation
- ✅ Overlay backdrop
- ✅ Đóng bằng ESC hoặc click overlay
- ✅ Prevent body scroll khi sidebar mở

### Responsive Breakpoints

- Desktop: > 1024px
- Tablet: 768px - 1024px  
- Mobile: < 768px

## API JavaScript

```javascript
// Truy cập instance sidebar
const sidebar = window.modernSidebar;

// Methods có sẵn
sidebar.collapse();    // Thu gọn sidebar
sidebar.expand();      // Mở rộng sidebar
sidebar.isOpen();      // Kiểm tra trạng thái

// Events
document.addEventListener('sidebarToggle', (e) => {
    console.log('Sidebar toggled:', e.detail.collapsed);
});
```

## Các trang đã được đồng bộ

- ✅ Statistics (`/pages/statistics/index.html`)
- ✅ Dashboard (`/pages/dashboard/dashboard.html`)
- ✅ Operations (`/pages/operations/operations.html`)
- ✅ CLB (`/pages/CLB/clb-modern.html`)
- ✅ Calendar (`/pages/calendar/index.html`)
- ✅ Profile (`/pages/profile/profile.html`)

## Navigation Structure

```
Dashboard
├── Trang chủ (Dashboard)
└── Vận hành (Operations)

CLB & Sự kiện  
├── Hoạt động CLB
├── Danh sách CLB
├── Sự kiện CLB
└── Quản lý thành viên

Thống kê & Báo cáo
├── Thống kê cá nhân
├── Báo cáo tổng quan
└── Xuất báo cáo

Lịch trình
└── Lịch học

Cá nhân
├── Hồ sơ cá nhân
└── Cài đặt
```

## Lưu ý khi phát triển

1. **CSS Variables**: Sidebar sử dụng CSS variables từ theme chung. Đảm bảo các variables như `--primary`, `--bg-primary` được định nghĩa.

2. **Z-index**: Sidebar có z-index 999, overlay có 998. Tránh conflicts với modals khác.

3. **Performance**: JavaScript sidebar chỉ init khi có element `#sidebar` trong DOM.

4. **Accessibility**: Sidebar hỗ trợ keyboard navigation (ESC để đóng).

5. **Browser Support**: Hỗ trợ tất cả browsers hiện đại, IE11+.

## Troubleshooting

### Sidebar không hiển thị đúng

- Kiểm tra CSS variables đã được define
- Đảm bảo CSS được load đúng thứ tự
- Kiểm tra z-index conflicts

### JavaScript không hoạt động

- Đảm bảo DOM đã loaded trước khi init
- Kiểm tra console errors
- Verify element IDs (`sidebar`, `sidebarToggle`, etc.)

### Responsive issues

- Kiểm tra viewport meta tag
- Test trên multiple screen sizes
- Verify media queries

## Credits

Developed by CodeKing Team for CTSV Attendance System
Version: 1.0.0
Last Updated: December 2024
