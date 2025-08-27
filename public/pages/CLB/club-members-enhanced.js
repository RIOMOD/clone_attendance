// Club Members Enhanced JavaScript - Modern Management System
class MembersManager {
    constructor() {
        this.members = [];
        this.filteredMembers = [];
        this.currentFilters = {
            club: '',
            status: '',
            role: '',
            joinDate: ''
        };
        this.init();
    }

    init() {
        this.loadMembers();
        this.attachEventListeners();
        this.setupDashboard();
        console.log('Members Manager initialized');
    }

    // Dashboard Setup
    setupDashboard() {
        this.updateStats();
        this.setupSearch();
        this.setupFilters();
        this.setupUserMenu();
        this.setupMobileMenu();
    }

    // Event Listeners
    attachEventListeners() {
        // Controls
        document.getElementById('refreshMembers')?.addEventListener('click', () => this.refreshMembers());
        document.getElementById('membersFilter')?.addEventListener('click', () => this.toggleFilters());
        document.getElementById('refreshMembersList')?.addEventListener('click', () => this.refreshMembersList());

        // Export buttons
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.exportData(e.target.dataset.type));
        });

        // Filter selectors
        document.getElementById('academicYear')?.addEventListener('change', (e) => this.filterByYear(e.target.value));
        document.getElementById('clubFilter')?.addEventListener('change', (e) => this.filterByClub(e.target.value));
        document.getElementById('roleFilter')?.addEventListener('change', (e) => this.filterByRole(e.target.value));
        document.getElementById('statusFilter')?.addEventListener('change', (e) => this.filterByStatus(e.target.value));
        document.getElementById('joinDateFilter')?.addEventListener('change', (e) => this.filterByJoinDate(e.target.value));

        // Header actions
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('quickAdd')?.addEventListener('click', () => this.openQuickAdd());
        document.getElementById('notificationBtn')?.addEventListener('click', () => this.showNotifications());
        document.getElementById('messageBtn')?.addEventListener('click', () => this.showMessages());
        document.getElementById('settingsBtn')?.addEventListener('click', () => this.openSettings());

        // Stat cards click events
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleStatCardClick(e.currentTarget));
        });
    }

    // Load Members Data
    loadMembers() {
        // Mock data - trong thực tế sẽ load từ API
        this.members = [
            {
                id: 'mem1',
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@ctsv.edu.vn',
                studentId: 'SV2024001',
                club: 'CLB Công nghệ',
                role: 'member',
                status: 'active',
                joinDate: '2024-01-15',
                eventsAttended: 12,
                participationRate: 85,
                avatar: '../../assets/images/avata/avata_admin.jpg'
            },
            {
                id: 'mem2',
                name: 'Trần Thị B',
                email: 'tranthib@ctsv.edu.vn',
                studentId: 'SV2024002',
                club: 'CLB Thể thao',
                role: 'admin',
                status: 'active',
                joinDate: '2024-01-10',
                eventsAttended: 18,
                participationRate: 92,
                avatar: '../../assets/images/avata/avata_admin.jpg'
            },
            {
                id: 'mem3',
                name: 'Lê Văn C',
                email: 'levanc@ctsv.edu.vn',
                studentId: 'SV2024003',
                club: 'CLB Nghệ thuật',
                role: 'member',
                status: 'pending',
                joinDate: '2024-11-20',
                eventsAttended: 0,
                participationRate: 0,
                avatar: '../../assets/images/avata/avata_admin.jpg'
            }
        ];

        this.filteredMembers = [...this.members];
        this.renderMembersGrid();
    }

    // Search Functionality
    setupSearch() {
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchMembers(e.target.value);
                }, 300);
            });
        }
    }

    searchMembers(query) {
        if (!query.trim()) {
            this.filteredMembers = [...this.members];
        } else {
            const lowercaseQuery = query.toLowerCase();
            this.filteredMembers = this.members.filter(member =>
                member.name.toLowerCase().includes(lowercaseQuery) ||
                member.email.toLowerCase().includes(lowercaseQuery) ||
                member.studentId.toLowerCase().includes(lowercaseQuery) ||
                member.club.toLowerCase().includes(lowercaseQuery)
            );
        }

        this.renderMembersGrid();
        this.updateStats();
    }

    // Filter Functions
    setupFilters() {
        const filtersSection = document.getElementById('membersFilterSection');
        if (filtersSection) {
            filtersSection.style.display = 'none';
        }
    }

    toggleFilters() {
        const filtersSection = document.getElementById('membersFilterSection');
        if (filtersSection) {
            const isVisible = filtersSection.style.display !== 'none';
            filtersSection.style.display = isVisible ? 'none' : 'block';

            // Update filter button icon
            const filterBtn = document.getElementById('membersFilter');
            if (filterBtn) {
                const icon = filterBtn.querySelector('i');
                icon.className = isVisible ? 'fas fa-filter' : 'fas fa-filter-circle-xmark';
            }
        }
    }

    filterByYear(year) {
        this.currentFilters.year = year;
        this.applyFilters();
    }

    filterByClub(club) {
        this.currentFilters.club = club;
        this.applyFilters();
    }

    filterByRole(role) {
        this.currentFilters.role = role;
        this.applyFilters();
    }

    filterByStatus(status) {
        this.currentFilters.status = status;
        this.applyFilters();
    }

    filterByJoinDate(period) {
        this.currentFilters.joinDate = period;
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.members];

        // Apply club filter
        if (this.currentFilters.club) {
            filtered = filtered.filter(member =>
                member.club.toLowerCase().includes(this.currentFilters.club.toLowerCase())
            );
        }

        // Apply status filter
        if (this.currentFilters.status) {
            filtered = filtered.filter(member => member.status === this.currentFilters.status);
        }

        // Apply role filter
        if (this.currentFilters.role) {
            filtered = filtered.filter(member => member.role === this.currentFilters.role);
        }

        // Apply join date filter
        if (this.currentFilters.joinDate) {
            const now = new Date();
            filtered = filtered.filter(member => {
                const joinDate = new Date(member.joinDate);
                switch (this.currentFilters.joinDate) {
                    case 'this-month':
                        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
                    case 'this-semester':
                        const semesterStart = new Date(now.getFullYear(), now.getMonth() >= 8 ? 8 : 1, 1);
                        return joinDate >= semesterStart;
                    case 'this-year':
                        return joinDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }

        this.filteredMembers = filtered;
        this.renderMembersGrid();
        this.updateStats();
    }

    // Render Members
    renderMembersGrid() {
        const membersGrid = document.getElementById('membersGrid');
        if (!membersGrid) return;

        if (this.filteredMembers.length === 0) {
            membersGrid.innerHTML = `
                <div class="no-members">
                    <i class="fas fa-users-slash"></i>
                    <h3>Không tìm thấy thành viên</h3>
                    <p>Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
                </div>
            `;
            return;
        }

        membersGrid.innerHTML = this.filteredMembers.map(member => this.createMemberCard(member)).join('');
    }

    createMemberCard(member) {
        const statusClass = member.status === 'active' ? 'active' :
            member.status === 'pending' ? 'pending' : 'inactive';

        const roleClass = member.role === 'admin' ? 'admin' :
            member.role === 'moderator' ? 'moderator' : 'member';

        const roleName = member.role === 'admin' ? 'Quản trị viên' :
            member.role === 'moderator' ? 'Điều hành viên' : 'Thành viên';

        const joinDateFormatted = new Date(member.joinDate).toLocaleDateString('vi-VN');
        const joinLabel = member.status === 'pending' ? 'Đăng ký:' : 'Gia nhập:';

        return `
            <div class="member-card">
                <div class="member-header">
                    <div class="member-avatar">
                        <img src="${member.avatar}" alt="${member.name}">
                        <div class="status-indicator ${statusClass}"></div>
                    </div>
                    <div class="member-info">
                        <div class="member-name">${member.name}</div>
                        <div class="member-email">${member.email}</div>
                        <div class="member-id">${member.studentId}</div>
                    </div>
                </div>
                
                <div class="member-details">
                    <div class="member-club">
                        <i class="fas fa-users"></i>
                        <span>${member.club}</span>
                    </div>
                    <div class="member-role">
                        <span class="role-badge ${member.status === 'pending' ? 'pending' : roleClass}">${member.status === 'pending' ? 'Chờ duyệt' : roleName}</span>
                    </div>
                    <div class="member-join-date">
                        <i class="fas fa-calendar"></i>
                        <span>${joinLabel} ${joinDateFormatted}</span>
                    </div>
                </div>

                <div class="member-stats">
                    <div class="stat-item">
                        <span class="stat-label">Sự kiện tham gia:</span>
                        <span class="stat-value">${member.eventsAttended}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Điểm tham gia:</span>
                        <span class="stat-value">${member.participationRate > 0 ? member.participationRate + '%' : '--'}</span>
                    </div>
                </div>

                <div class="member-actions">
                    ${this.createMemberActions(member)}
                </div>
            </div>
        `;
    }

    createMemberActions(member) {
        if (member.status === 'pending') {
            return `
                <button class="btn-action approve" onclick="membersManager.approveMember('${member.id}')" title="Phê duyệt">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn-action reject" onclick="membersManager.rejectMember('${member.id}')" title="Từ chối">
                    <i class="fas fa-times"></i>
                </button>
                <button class="btn-action view" onclick="membersManager.viewMember('${member.id}')" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
            `;
        }

        return `
            <button class="btn-action view" onclick="membersManager.viewMember('${member.id}')" title="Xem chi tiết">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-action edit" onclick="membersManager.editMember('${member.id}')" title="Chỉnh sửa">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-action message" onclick="membersManager.sendMessage('${member.id}')" title="Gửi tin nhắn">
                <i class="fas fa-envelope"></i>
            </button>
            <button class="btn-action delete" onclick="membersManager.removeMember('${member.id}')" title="Xóa thành viên">
                <i class="fas fa-user-minus"></i>
            </button>
        `;
    }

    // Stats Update
    updateStats() {
        const totalMembers = this.filteredMembers.length;
        const activeMembers = this.filteredMembers.filter(m => m.status === 'active').length;
        const pendingMembers = this.filteredMembers.filter(m => m.status === 'pending').length;
        const inactiveMembers = this.filteredMembers.filter(m => m.status === 'inactive').length;

        // Update stat cards
        this.updateStatCard('[data-stat="totalMembers"] h3', totalMembers);
        this.updateStatCard('[data-stat="activeMembers"] h3', activeMembers);
        this.updateStatCard('[data-stat="pendingApplications"] h3', pendingMembers);
        this.updateStatCard('[data-stat="inactiveMembers"] h3', inactiveMembers);

        // Update participation rate
        if (activeMembers > 0) {
            const participationRate = ((activeMembers / totalMembers) * 100).toFixed(1);
            this.updateStatCard('[data-stat="activeMembers"] .stat-trend span', `${participationRate}% tham gia`);
        }
    }

    updateStatCard(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    }

    // Member Actions
    openAddMemberModal() {
        this.showModal('Thêm thành viên mới', this.createAddMemberForm());
    }

    viewMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (member) {
            this.showModal(`Chi tiết thành viên - ${member.name}`, this.createMemberDetailView(member));
        }
    }

    editMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (member) {
            this.showModal(`Chỉnh sửa thông tin - ${member.name}`, this.createEditMemberForm(member));
        }
    }

    approveMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (member) {
            if (confirm(`Phê duyệt thành viên ${member.name}?`)) {
                member.status = 'active';
                this.renderMembersGrid();
                this.updateStats();
                this.showNotification('Đã phê duyệt thành viên thành công!', 'success');
            }
        }
    }

    rejectMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (member) {
            if (confirm(`Từ chối thành viên ${member.name}?`)) {
                this.members = this.members.filter(m => m.id !== memberId);
                this.filteredMembers = this.filteredMembers.filter(m => m.id !== memberId);
                this.renderMembersGrid();
                this.updateStats();
                this.showNotification('Đã từ chối thành viên!', 'warning');
            }
        }
    }

    removeMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (member) {
            if (confirm(`Xóa thành viên ${member.name} khỏi hệ thống?`)) {
                this.members = this.members.filter(m => m.id !== memberId);
                this.filteredMembers = this.filteredMembers.filter(m => m.id !== memberId);
                this.renderMembersGrid();
                this.updateStats();
                this.showNotification('Đã xóa thành viên!', 'success');
            }
        }
    }

    sendMessage(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (member) {
            this.showModal(`Gửi tin nhắn - ${member.name}`, this.createMessageForm(member));
        }
    }

    // Modal Functions
    showModal(title, content) {
        // Remove existing modal
        const existingModal = document.getElementById('memberModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'memberModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    createAddMemberForm() {
        return `
            <form class="member-form" onsubmit="event.preventDefault(); membersManager.handleAddMember(this);">
                <div class="form-group">
                    <label for="memberName">Họ và tên</label>
                    <input type="text" id="memberName" name="name" required>
                </div>
                <div class="form-group">
                    <label for="memberEmail">Email</label>
                    <input type="email" id="memberEmail" name="email" required>
                </div>
                <div class="form-group">
                    <label for="memberStudentId">Mã sinh viên</label>
                    <input type="text" id="memberStudentId" name="studentId" required>
                </div>
                <div class="form-group">
                    <label for="memberClub">Câu lạc bộ</label>
                    <select id="memberClub" name="club" required>
                        <option value="">Chọn CLB</option>
                        <option value="CLB Công nghệ">CLB Công nghệ</option>
                        <option value="CLB Thể thao">CLB Thể thao</option>
                        <option value="CLB Nghệ thuật">CLB Nghệ thuật</option>
                        <option value="CLB Tình nguyện">CLB Tình nguyện</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="memberRole">Vai trò</label>
                    <select id="memberRole" name="role" required>
                        <option value="member">Thành viên</option>
                        <option value="moderator">Điều hành viên</option>
                        <option value="admin">Quản trị viên</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" onclick="this.closest('.modal-overlay').remove()">Hủy</button>
                    <button type="submit" class="btn-primary">Thêm thành viên</button>
                </div>
            </form>
        `;
    }

    createMemberDetailView(member) {
        const joinDate = new Date(member.joinDate).toLocaleDateString('vi-VN');
        const roleName = member.role === 'admin' ? 'Quản trị viên' :
            member.role === 'moderator' ? 'Điều hành viên' : 'Thành viên';
        const statusName = member.status === 'active' ? 'Hoạt động' :
            member.status === 'pending' ? 'Chờ duyệt' : 'Không hoạt động';

        return `
            <div class="member-detail">
                <div class="member-detail-avatar">
                    <img src="${member.avatar}" alt="${member.name}">
                    <div class="status-indicator ${member.status}"></div>
                </div>
                <div class="member-detail-info">
                    <h4>${member.name}</h4>
                    <p><strong>Email:</strong> ${member.email}</p>
                    <p><strong>Mã sinh viên:</strong> ${member.studentId}</p>
                    <p><strong>Câu lạc bộ:</strong> ${member.club}</p>
                    <p><strong>Vai trò:</strong> ${roleName}</p>
                    <p><strong>Trạng thái:</strong> ${statusName}</p>
                    <p><strong>Ngày gia nhập:</strong> ${joinDate}</p>
                    <p><strong>Sự kiện tham gia:</strong> ${member.eventsAttended}</p>
                    <p><strong>Tỷ lệ tham gia:</strong> ${member.participationRate}%</p>
                </div>
            </div>
        `;
    }

    handleAddMember(form) {
        const formData = new FormData(form);
        const newMember = {
            id: 'mem' + Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            studentId: formData.get('studentId'),
            club: formData.get('club'),
            role: formData.get('role'),
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0],
            eventsAttended: 0,
            participationRate: 0,
            avatar: '../../assets/images/avata/avata_admin.jpg'
        };

        this.members.push(newMember);
        this.filteredMembers.push(newMember);
        this.renderMembersGrid();
        this.updateStats();

        // Close modal
        document.getElementById('memberModal').remove();

        this.showNotification('Đã thêm thành viên thành công!', 'success');
    }

    // Utility Functions
    refreshMembers() {
        this.showNotification('Đang làm mới dữ liệu...', 'info');
        // Simulate API call
        setTimeout(() => {
            this.loadMembers();
            this.showNotification('Đã làm mới dữ liệu thành công!', 'success');
        }, 1000);
    }

    refreshMembersList() {
        const refreshBtn = document.getElementById('refreshMembersList');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            setTimeout(() => {
                refreshBtn.innerHTML = '<i class="fas fa-sync"></i>';
                this.renderMembersGrid();
                this.showNotification('Đã cập nhật danh sách!', 'success');
            }, 800);
        }
    }

    exportData(type) {
        this.showNotification(`Đang xuất dữ liệu ${type.toUpperCase()}...`, 'info');
        // Simulate export
        setTimeout(() => {
            this.showNotification(`Đã xuất dữ liệu ${type.toUpperCase()} thành công!`, 'success');
        }, 1500);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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

    // Header Functions
    setupUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.querySelector('.sidebar');

        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });

            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            });
        }
    }

    toggleTheme() {
        this.showNotification('Chế độ Light Mode đang được sử dụng!', 'info');
    }

    openQuickAdd() {
        this.openAddMemberModal();
    }

    showNotifications() {
        this.showModal('Thông báo', `
            <div class="notifications-list">
                <div class="notification-item">
                    <i class="fas fa-user-plus"></i>
                    <div>
                        <strong>Đơn gia nhập mới</strong>
                        <p>Lê Văn C đã đăng ký gia nhập CLB Nghệ thuật</p>
                        <small>2 giờ trước</small>
                    </div>
                </div>
                <div class="notification-item">
                    <i class="fas fa-calendar"></i>
                    <div>
                        <strong>Sự kiện sắp tới</strong>
                        <p>Họp định kỳ CLB Công nghệ vào ngày mai</p>
                        <small>1 ngày trước</small>
                    </div>
                </div>
            </div>
        `);
    }

    showMessages() {
        this.showModal('Tin nhắn', `
            <div class="messages-list">
                <div class="message-item">
                    <img src="../../assets/images/avata/avata_admin.jpg" alt="Avatar">
                    <div>
                        <strong>Nguyễn Văn A</strong>
                        <p>Xin chào, tôi có thể tham gia sự kiện tuần tới không?</p>
                        <small>30 phút trước</small>
                    </div>
                </div>
            </div>
        `);
    }

    openSettings() {
        this.showModal('Cài đặt nhanh', `
            <div class="settings-panel">
                <h4>Tùy chọn hiển thị</h4>
                <label class="switch">
                    <input type="checkbox" checked>
                    <span class="slider">Hiển thị avatar thành viên</span>
                </label>
                <label class="switch">
                    <input type="checkbox" checked>
                    <span class="slider">Tự động làm mới</span>
                </label>
                <h4>Thông báo</h4>
                <label class="switch">
                    <input type="checkbox" checked>
                    <span class="slider">Thông báo đơn gia nhập mới</span>
                </label>
            </div>
        `);
    }

    handleStatCardClick(card) {
        const statType = card.dataset.stat;
        switch (statType) {
            case 'totalMembers':
                this.currentFilters = { club: '', status: '', role: '', joinDate: '' };
                break;
            case 'activeMembers':
                this.currentFilters = { ...this.currentFilters, status: 'active' };
                break;
            case 'pendingApplications':
                this.currentFilters = { ...this.currentFilters, status: 'pending' };
                break;
            case 'inactiveMembers':
                this.currentFilters = { ...this.currentFilters, status: 'inactive' };
                break;
        }
        this.applyFilters();
        this.showNotification(`Lọc theo ${card.querySelector('p').textContent}`, 'info');
    }

    // Quick Actions
    openPermissionsModal() {
        this.showModal('Quản lý quyền', `
            <div class="permissions-panel">
                <h4>Phân quyền thành viên</h4>
                <p>Chọn thành viên để thay đổi quyền hạn</p>
                <div class="permissions-list">
                    ${this.members.map(member => `
                        <div class="permission-item">
                            <img src="${member.avatar}" alt="${member.name}">
                            <span>${member.name}</span>
                            <select onchange="membersManager.updateMemberRole('${member.id}', this.value)">
                                <option value="member" ${member.role === 'member' ? 'selected' : ''}>Thành viên</option>
                                <option value="moderator" ${member.role === 'moderator' ? 'selected' : ''}>Điều hành viên</option>
                                <option value="admin" ${member.role === 'admin' ? 'selected' : ''}>Quản trị viên</option>
                            </select>
                        </div>
                    `).join('')}
                </div>
            </div>
        `);
    }

    updateMemberRole(memberId, newRole) {
        const member = this.members.find(m => m.id === memberId);
        if (member) {
            member.role = newRole;
            this.renderMembersGrid();
            this.showNotification(`Đã cập nhật quyền cho ${member.name}!`, 'success');
        }
    }

    viewStatistics() {
        this.showModal('Thống kê hoạt động', `
            <div class="statistics-panel">
                <div class="stat-summary">
                    <h4>Tổng quan</h4>
                    <p>Tổng thành viên: ${this.members.length}</p>
                    <p>Hoạt động: ${this.members.filter(m => m.status === 'active').length}</p>
                    <p>Tỷ lệ tham gia trung bình: ${(this.members.reduce((sum, m) => sum + m.participationRate, 0) / this.members.length).toFixed(1)}%</p>
                </div>
                <div class="club-breakdown">
                    <h4>Phân bố theo CLB</h4>
                    ${this.getClubStatistics().map(club => `
                        <div class="club-stat">
                            <span>${club.name}</span>
                            <span>${club.count} thành viên</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `);
    }

    getClubStatistics() {
        const clubs = {};
        this.members.forEach(member => {
            clubs[member.club] = (clubs[member.club] || 0) + 1;
        });
        return Object.entries(clubs).map(([name, count]) => ({ name, count }));
    }

    exportReport() {
        this.exportData('excel');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.membersManager = new MembersManager();
});

// Additional CSS for modals and notifications
const additionalStyles = `
<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    backdrop-filter: blur(5px);
}

.modal-content {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    position: relative;
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
}

.modal-header h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.3rem;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #666;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: #f0f0f0;
    color: #333;
}

.member-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 500;
    color: #555;
}

.form-group input,
.form-group select {
    padding: 0.75rem;
    border: 2px solid #e0e6ed;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
}

.form-actions button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.form-actions button[type="button"] {
    background: #f8f9fa;
    color: #666;
    border: 2px solid #e0e6ed;
}

.form-actions button[type="button"]:hover {
    background: #e9ecef;
}

.form-actions .btn-primary {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
}

.form-actions .btn-primary:hover {
    background: linear-gradient(135deg, #5a67d8, #6b46c1);
    transform: translateY(-2px);
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 3000;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s ease;
    min-width: 300px;
}

.notification.show {
    transform: translateX(0);
    opacity: 1;
}

.notification.success { border-left: 4px solid #00b894; }
.notification.error { border-left: 4px solid #fd79a8; }
.notification.warning { border-left: 4px solid #fdcb6e; }
.notification.info { border-left: 4px solid #667eea; }

.notification i {
    font-size: 1.2rem;
}

.notification.success i { color: #00b894; }
.notification.error i { color: #fd79a8; }
.notification.warning i { color: #fdcb6e; }
.notification.info i { color: #667eea; }

.member-detail {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
}

.member-detail-avatar {
    position: relative;
    flex-shrink: 0;
}

.member-detail-avatar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #e0e6ed;
}

.member-detail-info h4 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
    font-size: 1.3rem;
}

.member-detail-info p {
    margin: 0.5rem 0;
    color: #666;
}

.no-members {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: #666;
}

.no-members i {
    font-size: 4rem;
    color: #ddd;
    margin-bottom: 1rem;
}

.no-members h3 {
    margin: 0.5rem 0;
    color: #999;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
