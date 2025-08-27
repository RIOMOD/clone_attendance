// ===== ENHANCED MAIN APPLICATION SCRIPT =====
// Fixed calendar, time tracking, and all interactive features

// Global variables
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let workData = JSON.parse(localStorage.getItem('workData')) || {};
let timeData = JSON.parse(localStorage.getItem('timeData')) || {};
let isCheckedIn = false;
let checkinTime = null;
let checkoutTime = null;
let breakStartTime = null;
let totalBreakTime = 0;
let isOnBreak = false;

// Vietnamese month names
const vietnameseMonths = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 DOM Content Loaded - Starting initialization...');

    try {
        // Check authentication status first
        checkAuthenticationStatus();

        initializeComponents();
        console.log('✅ All components initialized successfully');
    } catch (error) {
        console.error('❌ Error during initialization:', error);
    }
});

// Check if user is authenticated
function checkAuthenticationStatus() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const authButtons = document.getElementById('authButtons');
    const userProfileDropdown = document.getElementById('userProfileDropdown');

    if (authButtons && userProfileDropdown) {
        if (isAuthenticated) {
            authButtons.style.display = 'none';
            userProfileDropdown.style.display = 'block';
        } else {
            authButtons.style.display = 'flex';
            userProfileDropdown.style.display = 'none';
        }
    }
}

// Main initialization function
function initializeComponents() {
    // Initialize all major components
    initializeCalendar();
    initializeTimeTracking();
    initializeWorkflow();
    initializeDropdowns();
    initializeSidebar();
    initializeSearch();
    initializeModals();
    initializeUserProfile();

    // Update displays
    updateTodayInfo();
    updateTasksSummary();
    displayTasksTimeline();

    // Start real-time clock
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 1000);

    console.log('✅ Main application initialized');
}

// ===== CALENDAR FUNCTIONALITY =====
function initializeCalendar() {
    console.log('📅 Initializing calendar...');

    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) {
        console.error('❌ Calendar grid element not found!');
        return;
    }

    renderCalendar();
    updateMonthYear();
    initializeCalendarNavigation();

    console.log('✅ Calendar initialized successfully');
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;

    console.log(`📅 Rendering calendar for ${currentMonth + 1}/${currentYear}`);
    calendarGrid.innerHTML = '';

    // Calculate calendar dates
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const dayElement = createDayElement(date);
        calendarGrid.appendChild(dayElement);
    }

    console.log('✅ Calendar rendered with 42 days');
}

function createDayElement(date) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';

    const isToday = isDateToday(date);
    const isCurrentMonth = date.getMonth() === currentMonth;
    const dateKey = formatDateKey(date);
    const hasWork = workData[dateKey] && workData[dateKey].length > 0;

    // Add CSS classes
    if (!isCurrentMonth) dayDiv.classList.add('other-month');
    if (isToday) dayDiv.classList.add('today');
    if (hasWork) dayDiv.classList.add('has-work');

    // Create day number
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    dayDiv.appendChild(dayNumber);

    // Create events container
    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'day-events';

    if (hasWork) {
        workData[dateKey].forEach(work => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.textContent = work.title;
            eventsContainer.appendChild(eventItem);
        });
    }

    dayDiv.appendChild(eventsContainer);

    // Add click handler
    dayDiv.addEventListener('click', () => {
        console.log('📅 Day clicked:', date.toDateString());
        openWorkModal(date);
    });

    return dayDiv;
}

function initializeCalendarNavigation() {
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
            updateMonthYear();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
            updateMonthYear();
        });
    }
}

function updateMonthYear() {
    const monthYearElement = document.getElementById('current-month-year');
    if (monthYearElement) {
        monthYearElement.textContent = `${vietnameseMonths[currentMonth]} ${currentYear}`;
    }
}

// ===== TIME TRACKING FUNCTIONALITY =====
function initializeTimeTracking() {
    console.log('⏰ Initializing time tracking...');

    loadTimeData();
    initializeTimeButtons();
    initializeTimeWidgets();

    console.log('✅ Time tracking initialized');
}

function initializeTimeButtons() {
    const checkinBtn = document.getElementById('checkinBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const breakBtn = document.getElementById('breakBtn');

    if (checkinBtn) {
        checkinBtn.addEventListener('click', handleCheckin);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    if (breakBtn) {
        breakBtn.addEventListener('click', handleBreak);
    }
}

function initializeTimeWidgets() {
    const trigger = document.getElementById('timeWidgetsTrigger');
    const popup = document.getElementById('timeWidgetsPopup');
    const closeBtn = document.getElementById('timeWidgetsClose');

    if (trigger && popup) {
        trigger.addEventListener('click', () => {
            popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
        });
    }

    if (closeBtn && popup) {
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (popup && !popup.contains(e.target) && e.target !== trigger) {
            popup.style.display = 'none';
        }
    });
}

function handleCheckin() {
    if (!isCheckedIn) {
        const now = new Date();
        checkinTime = now;
        isCheckedIn = true;

        updateTimeData('checkin', formatTime(now));
        showNotification('✅ Check-in thành công!', 'success');
        updateWorkStatus('Đang làm việc');
        updateTimeDisplays();

        console.log('✅ Checked in at:', formatTime(now));
    } else {
        showNotification('⚠️ Bạn đã check-in rồi!', 'warning');
    }
}

function handleCheckout() {
    if (isCheckedIn) {
        const now = new Date();
        checkoutTime = now;
        isCheckedIn = false;

        updateTimeData('checkout', formatTime(now));
        calculateWorkDuration();
        showNotification('✅ Check-out thành công!', 'success');
        updateWorkStatus('Đã kết thúc');
        updateTimeDisplays();

        console.log('✅ Checked out at:', formatTime(now));
    } else {
        showNotification('⚠️ Bạn chưa check-in!', 'warning');
    }
}

function handleBreak() {
    if (!isCheckedIn) {
        showNotification('⚠️ Bạn cần check-in trước!', 'warning');
        return;
    }

    const now = new Date();

    if (!isOnBreak) {
        breakStartTime = now;
        isOnBreak = true;
        updateTimeData('breakStart', formatTime(now));
        showNotification('☕ Bắt đầu nghỉ giải lao', 'info');
        updateWorkStatus('Đang nghỉ giải lao');
    } else {
        const breakDuration = (now - breakStartTime) / (1000 * 60); // minutes
        totalBreakTime += breakDuration;
        isOnBreak = false;
        updateTimeData('breakEnd', formatTime(now));
        updateTimeData('totalBreakTime', Math.round(totalBreakTime));
        showNotification('✅ Kết thúc nghỉ giải lao', 'success');
        updateWorkStatus('Đang làm việc');
    }

    updateTimeDisplays();
}

// ===== WORKFLOW AND TASKS =====
function initializeWorkflow() {
    console.log('📋 Initializing workflow...');

    const refreshTasksBtn = document.getElementById('refresh-tasks');
    const exportTasksBtn = document.getElementById('export-tasks');
    const addTodoBtn = document.getElementById('add-todo');

    if (refreshTasksBtn) {
        refreshTasksBtn.addEventListener('click', () => {
            displayTasksTimeline();
            updateTasksSummary();
            showNotification('🔄 Đã làm mới danh sách công việc', 'info');
        });
    }

    if (exportTasksBtn) {
        exportTasksBtn.addEventListener('click', exportTasks);
    }

    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', addNewTodo);
    }

    console.log('✅ Workflow initialized');
}

function updateTasksSummary() {
    const today = new Date();
    const currentMonthKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;

    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;
    let overdueTasks = 0;

    // Count tasks for current month
    Object.keys(workData).forEach(dateKey => {
        if (dateKey.startsWith(currentMonthKey)) {
            const dayTasks = workData[dateKey] || [];
            totalTasks += dayTasks.length;

            dayTasks.forEach(task => {
                if (task.completed) {
                    completedTasks++;
                } else {
                    const taskDate = new Date(dateKey);
                    if (taskDate < today) {
                        overdueTasks++;
                    } else {
                        pendingTasks++;
                    }
                }
            });
        }
    });

    // Update UI
    updateElementText('total-tasks', totalTasks);
    updateElementText('completed-tasks', completedTasks);
    updateElementText('pending-tasks', pendingTasks);
    updateElementText('overdue-tasks', overdueTasks);
}

function displayTasksTimeline() {
    const timeline = document.getElementById('tasks-timeline');
    if (!timeline) return;

    const today = new Date();
    const currentMonthKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;

    timeline.innerHTML = '';

    let hasAnyTasks = false;

    // Get all dates with tasks in current month
    const datesWithTasks = Object.keys(workData)
        .filter(dateKey => dateKey.startsWith(currentMonthKey) && workData[dateKey].length > 0)
        .sort();

    datesWithTasks.forEach(dateKey => {
        hasAnyTasks = true;
        const dayTasks = workData[dateKey];
        const date = new Date(dateKey);

        const dayGroup = document.createElement('div');
        dayGroup.className = 'timeline-day-group';

        const dayHeader = document.createElement('div');
        dayHeader.className = 'timeline-day-header';
        dayHeader.textContent = formatDateVietnamese(date);
        dayGroup.appendChild(dayHeader);

        const tasksList = document.createElement('div');
        tasksList.className = 'timeline-tasks-list';

        dayTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `timeline-task-item ${task.completed ? 'completed' : ''}`;

            taskItem.innerHTML = `
                <div class="task-time">${task.startTime || '09:00'}</div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-type">${task.type || 'Công việc'}</div>
                </div>
                <div class="task-status ${task.completed ? 'completed' : 'pending'}">
                    ${task.completed ? '✅' : '⏳'}
                </div>
            `;

            tasksList.appendChild(taskItem);
        });

        dayGroup.appendChild(tasksList);
        timeline.appendChild(dayGroup);
    });

    if (!hasAnyTasks) {
        timeline.innerHTML = `
            <div class="no-tasks-message">
                <i class="fas fa-calendar-plus"></i>
                <p>Chưa có công việc nào trong tháng này</p>
                <small>Click vào ngày trong lịch để thêm công việc mới</small>
            </div>
        `;
    }
}

// ===== DROPDOWNS AND NAVIGATION =====
function initializeDropdowns() {
    console.log('📂 Initializing dropdowns...');

    // User profile dropdown
    const userProfileBtn = document.getElementById('userProfileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    if (userProfileBtn && profileDropdown) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown(profileDropdown);
        });
    }

    // Settings dropdown
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsDropdown = document.getElementById('settingsDropdown');

    if (settingsBtn && settingsDropdown) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown(settingsDropdown);
        });
    }

    // Navigation dropdowns
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = toggle.nextElementSibling;
            if (dropdown) {
                toggleDropdown(dropdown);
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        document.querySelectorAll('.dropdown-menu, .profile-dropdown-menu, .settings-dropdown-menu').forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active', 'show');
            }
        });
    });

    console.log('✅ Dropdowns initialized');
}

function toggleDropdown(dropdown) {
    // Close all other dropdowns first
    document.querySelectorAll('.dropdown-menu, .profile-dropdown-menu, .settings-dropdown-menu').forEach(d => {
        if (d !== dropdown) {
            d.classList.remove('active', 'show');
        }
    });

    // Toggle current dropdown
    dropdown.classList.toggle('active');
    dropdown.classList.toggle('show');
}

// ===== SIDEBAR FUNCTIONALITY =====
function initializeSidebar() {
    console.log('📋 Initializing sidebar...');

    // Section headers
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            const submenu = section.querySelector('.nav-submenu');
            const arrow = header.querySelector('.section-arrow');

            if (submenu && arrow) {
                const isExpanded = submenu.style.display === 'block';
                submenu.style.display = isExpanded ? 'none' : 'block';
                arrow.style.transform = isExpanded ? '' : 'rotate(180deg)';
            }
        });
    });

    // Mobile sidebar overlay
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            document.body.classList.remove('sidebar-open');
        });
    }

    console.log('✅ Sidebar initialized');
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    console.log('🔍 Initializing search...');

    const searchInput = document.getElementById('headerSearchInput');
    const searchDropdown = document.getElementById('searchDropdown');
    const searchClearBtn = document.getElementById('searchClearBtn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.length > 0) {
                showSearchDropdown();
                searchClearBtn.style.display = 'block';
            } else {
                hideSearchDropdown();
                searchClearBtn.style.display = 'none';
            }
        });

        searchInput.addEventListener('focus', () => {
            if (searchInput.value.length > 0) {
                showSearchDropdown();
            }
        });
    }

    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            hideSearchDropdown();
            searchClearBtn.style.display = 'none';
            searchInput.focus();
        });
    }

    // Search suggestions
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.getAttribute('data-action');
            const search = item.getAttribute('data-search');

            if (action) {
                handleSearchAction(action);
            } else if (search) {
                searchInput.value = search;
                // Perform search
                performSearch(search);
            }

            hideSearchDropdown();
        });
    });

    console.log('✅ Search initialized');
}

function showSearchDropdown() {
    const searchDropdown = document.getElementById('searchDropdown');
    if (searchDropdown) {
        searchDropdown.style.display = 'block';
    }
}

function hideSearchDropdown() {
    const searchDropdown = document.getElementById('searchDropdown');
    if (searchDropdown) {
        searchDropdown.style.display = 'none';
    }
}

function handleSearchAction(action) {
    switch (action) {
        case 'checkin':
            handleCheckin();
            break;
        case 'profile':
            openProfileModal('profileModal');
            break;
        case 'settings':
            toggleDropdown(document.getElementById('settingsDropdown'));
            break;
    }
}

function performSearch(query) {
    console.log('🔍 Performing search for:', query);
    // Implement search logic here
}

// ===== MODAL FUNCTIONALITY =====
function initializeModals() {
    console.log('🔧 Initializing modals...');

    // Work log modal
    initializeWorkModal();

    // Profile modals
    initializeProfileModals();

    console.log('✅ Modals initialized');
}

function initializeWorkModal() {
    const modal = document.getElementById('workLogModal');
    const form = document.getElementById('workLogForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveWorkLog();
        });
    }

    // Modal close functionality
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

function initializeProfileModals() {
    // Profile modal form handlers
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProfile();
        });
    }

    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveEditedProfile();
        });
    }

    // Avatar upload
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }
}

function openWorkModal(date) {
    const modal = document.getElementById('workLogModal');
    const form = document.getElementById('workLogForm');

    if (modal && form) {
        // Pre-fill date
        const dateInput = form.querySelector('#workDate');
        if (dateInput) {
            dateInput.value = formatDateForInput(date);
        }

        modal.style.display = 'block';
        modal.setAttribute('data-date', formatDateKey(date));
    }
}

function closeModal() {
    const modal = document.getElementById('workLogModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===== USER PROFILE FUNCTIONALITY =====
function initializeUserProfile() {
    console.log('👤 Initializing user profile...');

    // Set default avatar fallback
    const avatars = document.querySelectorAll('img[src*="avata_admin.jpg"]');
    avatars.forEach(img => {
        img.onerror = () => {
            const fallbackIcon = img.nextElementSibling;
            if (fallbackIcon) {
                img.style.display = 'none';
                fallbackIcon.style.display = 'block';
            }
        };
    });

    console.log('✅ User profile initialized');
}

// ===== UTILITY FUNCTIONS =====
function isDateToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function formatDateKey(date) {
    return date.toISOString().split('T')[0];
}

function formatDateForInput(date) {
    return formatDateKey(date);
}

function formatDateVietnamese(date) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('vi-VN', options);
}

function formatTime(date) {
    return date.toTimeString().substr(0, 5);
}

function updateTimeDisplay() {
    const now = new Date();

    // Update current time
    const currentTimeElement = document.getElementById('currentTime');
    if (currentTimeElement) {
        currentTimeElement.textContent = now.toTimeString().substr(0, 8);
    }

    // Update current date
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = now.toLocaleDateString('vi-VN');
    }

    // Update work duration if checked in
    if (isCheckedIn && checkinTime) {
        const duration = Math.floor((now - checkinTime) / 1000);
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;

        const workDurationElement = document.getElementById('workDuration');
        if (workDurationElement) {
            workDurationElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        const totalTimeElement = document.getElementById('totalTime');
        if (totalTimeElement) {
            totalTimeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}

function updateTodayInfo() {
    const today = new Date();
    const todayDateElement = document.getElementById('today-date');
    if (todayDateElement) {
        todayDateElement.textContent = `Hôm nay, ${formatDateVietnamese(today)}`;
    }
}

function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function updateTimeData(key, value) {
    const today = formatDateKey(new Date());
    if (!timeData[today]) {
        timeData[today] = {};
    }
    timeData[today][key] = value;
    localStorage.setItem('timeData', JSON.stringify(timeData));
}

function loadTimeData() {
    const today = formatDateKey(new Date());
    const todayData = timeData[today];

    if (todayData) {
        if (todayData.checkin && !todayData.checkout) {
            isCheckedIn = true;
            checkinTime = new Date(today + 'T' + todayData.checkin);
            updateWorkStatus('Đang làm việc');
        }

        updateTimeDisplays();
    }
}

function updateTimeDisplays() {
    // Update check-in time display
    const checkinTimeElement = document.getElementById('checkinTime');
    if (checkinTimeElement) {
        checkinTimeElement.textContent = checkinTime ? formatTime(checkinTime) : '--:--';
    }

    // Update check-out time display
    const checkoutTimeElement = document.getElementById('checkoutTime');
    if (checkoutTimeElement) {
        checkoutTimeElement.textContent = checkoutTime ? formatTime(checkoutTime) : '--:--';
    }
}

function updateWorkStatus(status) {
    const workStatusElement = document.getElementById('workStatus');
    if (workStatusElement) {
        workStatusElement.textContent = status;
    }
}

function calculateWorkDuration() {
    if (checkinTime && checkoutTime) {
        const duration = (checkoutTime - checkinTime) / (1000 * 60 * 60); // hours
        const totalHours = Math.max(0, duration - (totalBreakTime / 60));

        updateTimeData('totalWorkHours', totalHours.toFixed(2));
        console.log('✅ Work duration calculated:', totalHours.toFixed(2), 'hours');
    }
}

function saveWorkLog() {
    const form = document.getElementById('workLogForm');
    const modal = document.getElementById('workLogModal');

    if (!form || !modal) return;

    const formData = new FormData(form);
    const date = modal.getAttribute('data-date');

    const workLog = {
        title: formData.get('workTitle'),
        type: formData.get('workType'),
        date: formData.get('workDate'),
        startTime: formData.get('workStartTime'),
        endTime: formData.get('workEndTime'),
        location: formData.get('workLocation'),
        description: formData.get('workDescription'),
        completed: false
    };

    if (!workData[date]) {
        workData[date] = [];
    }

    workData[date].push(workLog);
    localStorage.setItem('workData', JSON.stringify(workData));

    showNotification('✅ Lưu lịch công tác thành công!', 'success');
    closeModal();
    renderCalendar();
    updateTasksSummary();
    displayTasksTimeline();
}

function exportTasks() {
    const data = JSON.stringify(workData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `cong-viec-${formatDateKey(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('📁 Đã xuất dữ liệu công việc!', 'success');
}

function addNewTodo() {
    // Implement todo functionality
    showNotification('➕ Tính năng đang được phát triển!', 'info');
}

function showNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
}

// ===== PROFILE MODAL FUNCTIONS =====
function openProfileModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');

    if (modal && overlay) {
        modal.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeProfileModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');

    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function saveProfile() {
    showNotification('✅ Đã lưu thông tin cá nhân!', 'success');
    closeProfileModal('profileModal');
}

function saveEditedProfile() {
    showNotification('✅ Đã cập nhật thông tin cá nhân!', 'success');
    closeProfileModal('editProfileModal');
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const avatarPreview = document.getElementById('avatarPreview');
            if (avatarPreview) {
                avatarPreview.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}

function savePersonalSettings() {
    showNotification('✅ Đã lưu cài đặt cá nhân!', 'success');
    closeProfileModal('personalSettingsModal');
}

function saveToolbarSettings() {
    showNotification('✅ Đã lưu cài đặt thanh công cụ!', 'success');
    closeProfileModal('toolbarSettingsModal');
}

function resetToolbarSettings() {
    showNotification('🔄 Đã khôi phục cài đặt mặc định!', 'info');
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showNotification('❌ Mật khẩu xác nhận không khớp!', 'error');
        return;
    }

    showNotification('✅ Đã thay đổi mật khẩu thành công!', 'success');
    closeProfileModal('loginManagementModal');
}

function handleLogout() {
    if (confirm('Bạn có chắc chắn muốn thoát?')) {
        showNotification('👋 Đã đăng xuất thành công!', 'info');
        // Redirect to login page
        window.location.href = 'pages/authen/login.html';
    }
}

function handleCompleteLogout() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu và thoát?')) {
        localStorage.clear();
        showNotification('🗑️ Đã xóa dữ liệu và đăng xuất!', 'info');
        // Redirect to login page
        window.location.href = 'pages/authen/login.html';
    }
}

// Global function for backward compatibility
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.handleLogout = handleLogout;
window.handleCompleteLogout = handleCompleteLogout;

console.log('📚 Enhanced main application script loaded successfully!');
