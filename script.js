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

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting initialization...');
    
    try {
        initializeUserProfile();
        console.log('✅ User profile initialized');
        
        initializeSettings();
        console.log('✅ Settings initialized');
        
        initializeUserActions();
        console.log('✅ User actions initialized');
        
        initializeCalendar();
        console.log('✅ Calendar initialized');
        
        initializeEventListeners();
        console.log('✅ Event listeners initialized');
        
        updateTodayInfo();
        console.log('✅ Today info updated');
        
        loadTimeData();
        console.log('✅ Time data loaded');
        
        updateTimeDisplay();
        console.log('✅ Time display updated');
        
        updateTasksSummary();
        console.log('✅ Tasks summary updated');
        
        displayTasksTimeline();
        console.log('✅ Tasks timeline displayed');
        
        setInterval(updateTimeDisplay, 1000);
        console.log('✅ Time update interval started');
        
        console.log('🎉 All initialization completed successfully!');
    } catch (error) {
        console.error('❌ Error during initialization:', error);
    }
});

// Calendar functions
function initializeCalendar() {
    console.log('Initializing calendar...');
    console.log('Current month:', currentMonth, 'Current year:', currentYear);
    
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) {
        console.error('❌ Calendar grid element not found!');
        return;
    }
    console.log('✅ Calendar grid element found');
    
    renderCalendar();
    updateMonthYear();
    initializeCalendarNavigation();
    console.log('✅ Calendar initialization complete');
}

function initializeCalendarNavigation() {
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            console.log('📅 Previous month clicked');
            navigateMonth(-1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            console.log('📅 Next month clicked');
            navigateMonth(1);
        });
    }
    
    console.log('✅ Calendar navigation initialized');
}

function renderCalendar() {
    console.log('🗓️ Rendering calendar for', currentMonth + 1, '/', currentYear);
    
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) {
        console.error('❌ Calendar grid element not found in renderCalendar');
        return;
    }
    
    console.log('📅 Calendar grid found, clearing existing content...');
    calendarGrid.innerHTML = '';
    
    // Create first day of current month
    const firstDay = new Date(currentYear, currentMonth, 1);
    console.log('📅 First day of month:', firstDay);
    
    // Get last day of current month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    console.log('📅 Last day of month:', lastDay);
    
    // Calculate the start date (including previous month days to fill the grid)
    const startDate = new Date(firstDay);
    // Get the day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    console.log('📅 First day of week:', firstDayOfWeek);
    
    // Go back to start of calendar week (Sunday)
    startDate.setDate(startDate.getDate() - firstDayOfWeek);
    console.log('📅 Calendar start date:', startDate);
    
    // Generate 6 weeks (42 days) to ensure complete calendar view
    console.log('📅 Generating 42 calendar days...');
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = createDayElement(date);
        calendarGrid.appendChild(dayElement);
        
        // Debug log for first few days
        if (i < 7) {
            console.log(`Day ${i + 1}:`, date.toDateString(), '- Element created and added');
        }
    }
    
    console.log(`✅ Calendar rendered successfully with 42 days for ${currentMonth + 1}/${currentYear}`);
    
    // Double check the calendar grid has children
    const dayCount = calendarGrid.children.length;
    console.log('📊 Calendar grid now has', dayCount, 'day elements');
    
    if (dayCount === 0) {
        console.error('❌ No day elements were added to calendar grid!');
    } else {
        console.log('✅ Calendar rendering completed successfully');
    }
}

function createDayElement(date) {
    console.log('🔧 Creating day element for:', date.toDateString());
    
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    
    const isToday = isDateToday(date);
    const isCurrentMonth = date.getMonth() === currentMonth;
    const dateKey = formatDateKey(date);
    const hasWork = workData[dateKey] && workData[dateKey].length > 0;
    const isCheckedInToday = timeData[dateKey] && timeData[dateKey].checkin;
    
    // Add appropriate classes
    if (!isCurrentMonth) {
        dayDiv.classList.add('other-month');
    }
    
    if (isToday) {
        dayDiv.classList.add('today');
    }
    
    if (hasWork) {
        dayDiv.classList.add('has-work');
    }
    
    if (isCheckedInToday) {
        dayDiv.classList.add('checked-in');
    }
    
    // Create the day number element
    const dayNumberDiv = document.createElement('div');
    dayNumberDiv.className = 'day-number';
    dayNumberDiv.textContent = date.getDate();
    
    // Create the events container
    const dayEventsDiv = document.createElement('div');
    dayEventsDiv.className = 'day-events';
    
    if (hasWork) {
        const eventList = workData[dateKey].map(work => `<div class="event-item">${work.title}</div>`).join('');
        dayEventsDiv.innerHTML = eventList;
        
        // Add work indicator
        const workIndicator = document.createElement('div');
        workIndicator.className = 'work-indicator';
        dayDiv.appendChild(workIndicator);
    }
    
    // Append elements to day div
    dayDiv.appendChild(dayNumberDiv);
    dayDiv.appendChild(dayEventsDiv);
    
    // Add click event
    dayDiv.addEventListener('click', () => openWorkLogModal(date));
    
    console.log('✅ Day element created for date:', date.getDate());
    return dayDiv;
}

function updateMonthYear() {
    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    
    document.getElementById('current-month-year').textContent = 
        `${String(currentMonth + 1).padStart(2, '0')}/${currentYear}`;
}

function navigateMonth(direction) {
    currentMonth += direction;
    
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    
    renderCalendar();
    updateMonthYear();
    updateTasksSummary();
    displayTasksTimeline();
}

// Date utility functions
function isDateToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDate(date) {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${days[date.getDay()]}`;
}

function formatTime(date) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// Work log modal functions
function openWorkLogModal(date = new Date()) {
    console.log('🔥 Opening work log modal for date:', date.toDateString());
    
    const modal = document.getElementById('workLogModal');
    const form = document.getElementById('workLogForm');
    
    if (!modal || !form) {
        console.error('❌ Modal or form not found');
        return;
    }
    
    // Set default date
    document.getElementById('workDate').value = formatDateKey(date);
    
    // Set default time to current time
    const now = new Date();
    const currentTime = formatTime(now);
    document.getElementById('workStartTime').value = currentTime;
    
    // Set end time to 1 hour later
    const endTime = new Date(now.getTime() + 60 * 60 * 1000);
    document.getElementById('workEndTime').value = formatTime(endTime);
    
    // Auto calculate duration
    calculateDuration();
    
    modal.style.display = 'block';
    
    // Focus on title field
    document.getElementById('workTitle').focus();
    
    console.log('✅ Work log modal opened successfully');
}

function calculateDuration() {
    const startTime = document.getElementById('workStartTime').value;
    const endTime = document.getElementById('workEndTime').value;
    const breakTime = parseInt(document.getElementById('workBreakTime').value) || 0;
    
    if (startTime && endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        
        let duration = (end - start) / (1000 * 60 * 60); // Convert to hours
        duration = Math.max(0, duration - (breakTime / 60)); // Subtract break time
        
        document.getElementById('workDuration').value = duration.toFixed(1);
    }
}

function closeModal() {
    document.getElementById('workLogModal').style.display = 'none';
    document.getElementById('workLogForm').reset();
}

function saveWorkLog(formData) {
    console.log('💾 Saving work log...');
    
    const dateKey = formData.get('workDate');
    const workLog = {
        id: Date.now(),
        title: formData.get('workTitle'),
        type: formData.get('workType'),
        calendar: formData.get('workCalendar'),
        location: formData.get('workLocation'),
        assignee: formData.get('workAssignee'),
        date: formData.get('workDate'),
        startTime: formData.get('workStartTime'),
        endTime: formData.get('workEndTime'),
        duration: parseFloat(formData.get('workDuration')),
        breakTime: parseInt(formData.get('workBreakTime')) || 0,
        priority: formData.get('workPriority'),
        allDay: formData.get('allDay') === 'on',
        participants: formData.get('workParticipants'),
        guest: formData.get('workGuest'),
        category: formData.get('workCategory'),
        permission: formData.get('workPermission'),
        reminder: formData.get('reminder') === 'on',
        note: formData.get('workNote'),
        description: formData.get('workDescription'),
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    // Initialize workData for this date if not exists
    if (!workData[dateKey]) {
        workData[dateKey] = [];
    }
    
    // Add work log to the date
    workData[dateKey].push(workLog);
    
    // Save to localStorage
    localStorage.setItem('workData', JSON.stringify(workData));
    
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
    
    console.log(`📢 Notification: ${message} (${type})`);
}
        createdAt: new Date().toISOString()
    };
    
    if (!workData[dateKey]) {
        workData[dateKey] = [];
    }
    
    workData[dateKey].push(workLog);
    localStorage.setItem('workData', JSON.stringify(workData));
    
    renderCalendar();
    updateTasksSummary();
    displayTasksTimeline();
    closeModal();
    
    showNotification('Lịch công tác đã được lưu thành công!', 'success');
}

// Tasks Summary and Timeline Functions
function updateTasksSummary() {
    const currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;
    let overdueTasks = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    Object.keys(workData).forEach(dateKey => {
        if (dateKey.startsWith(currentMonthKey)) {
            const tasks = workData[dateKey];
            totalTasks += tasks.length;
            
            tasks.forEach(task => {
                if (task.completed) {
                    completedTasks++;
                } else {
                    const taskDate = new Date(task.date);
                    taskDate.setHours(0, 0, 0, 0);
                    
                    if (taskDate < today) {
                        overdueTasks++;
                    } else {
                        pendingTasks++;
                    }
                }
            });
        }
    });
    
    // Update summary display
    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('pending-tasks').textContent = pendingTasks;
    document.getElementById('overdue-tasks').textContent = overdueTasks;
}

function displayTasksTimeline() {
    const timelineContainer = document.getElementById('tasks-timeline');
    const currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    
    // Get all tasks for current month
    const monthTasks = {};
    Object.keys(workData).forEach(dateKey => {
        if (dateKey.startsWith(currentMonthKey) && workData[dateKey].length > 0) {
            monthTasks[dateKey] = workData[dateKey];
        }
    });
    
    if (Object.keys(monthTasks).length === 0) {
        timelineContainer.innerHTML = `
            <div class="no-tasks-message">
                <i class="fas fa-calendar-plus"></i>
                <p>Chưa có công việc nào trong tháng này</p>
                <small>Click vào ngày trong lịch để thêm công việc mới</small>
            </div>
        `;
        return;
    }
    
    // Sort dates
    const sortedDates = Object.keys(monthTasks).sort();
    
    let html = '';
    sortedDates.forEach(dateKey => {
        const tasks = monthTasks[dateKey];
        const date = new Date(dateKey);
        const formattedDate = formatDisplayDate(date);
        
        html += `
            <div class="task-day-group">
                <div class="task-day-header" onclick="toggleDayTasks('${dateKey}')">
                    <span class="task-day-date">${formattedDate}</span>
                    <span class="task-day-count">${tasks.length}</span>
                </div>
                <div class="task-day-tasks" id="tasks-${dateKey}">
        `;
        
        tasks.forEach(task => {
            const timeDisplay = task.time ? formatDisplayTime(task.time) : 'Cả ngày';
            const completedClass = task.completed ? 'task-completed' : '';
            
            html += `
                <div class="task-item ${completedClass}" data-task-id="${task.id}" data-date="${dateKey}">
                    <div class="task-priority ${task.priority || 'medium'}"></div>
                    <div class="task-info">
                        <div class="task-title">${task.title}</div>
                        <div class="task-time">${timeDisplay}</div>
                    </div>
                    <div class="task-actions">
                        <button class="task-action-btn complete" onclick="toggleTaskComplete('${dateKey}', ${task.id})" title="${task.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}">
                            <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                        </button>
                        <button class="task-action-btn edit" onclick="editTask('${dateKey}', ${task.id})" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action-btn delete" onclick="deleteTask('${dateKey}', ${task.id})" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    timelineContainer.innerHTML = html;
}

function formatDisplayDate(date) {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = days[date.getDay()];
    return `${dayName}, ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatDisplayTime(timeString) {
    if (!timeString) return '';
    return timeString;
}

function toggleDayTasks(dateKey) {
    const tasksContainer = document.getElementById(`tasks-${dateKey}`);
    if (tasksContainer.style.display === 'none') {
        tasksContainer.style.display = 'block';
    } else {
        tasksContainer.style.display = 'none';
    }
}

function toggleTaskComplete(dateKey, taskId) {
    const tasks = workData[dateKey];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('workData', JSON.stringify(workData));
        updateTasksSummary();
        displayTasksTimeline();
        renderCalendar();
        showNotification(
            task.completed ? 'Đã đánh dấu hoàn thành!' : 'Đã đánh dấu chưa hoàn thành!', 
            'success'
        );
    }
}

function editTask(dateKey, taskId) {
    const tasks = workData[dateKey];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        // Fill form with task data
        document.getElementById('workTitle').value = task.title || '';
        document.getElementById('workType').value = task.type || '';
        document.getElementById('workCalendar').value = task.calendar || 'personal';
        document.getElementById('workLocation').value = task.location || '';
        document.getElementById('workAssignee').value = task.assignee || '';
        document.getElementById('workDate').value = task.date || '';
        document.getElementById('workTime').value = task.time || '';
        document.getElementById('workDuration').value = task.duration || '1';
        document.getElementById('allDay').checked = task.allDay || false;
        document.getElementById('workParticipants').value = task.participants || '';
        document.getElementById('workGuest').value = task.guest || '';
        document.getElementById('workCategory').value = task.category || 'private';
        document.getElementById('workPermission').value = task.permission || 'edit';
        document.getElementById('reminder').checked = task.reminder || false;
        document.getElementById('workNote').value = task.note || '';
        document.getElementById('workDescription').value = task.description || '';
        
        // Store editing task info
        window.editingTask = { dateKey, taskId };
        
        // Open modal
        openWorkLogModal(new Date(task.date));
    }
}

function deleteTask(dateKey, taskId) {
    if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
        const tasks = workData[dateKey];
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            if (tasks.length === 0) {
                delete workData[dateKey];
            }
            localStorage.setItem('workData', JSON.stringify(workData));
            updateTasksSummary();
            displayTasksTimeline();
            renderCalendar();
            showNotification('Đã xóa công việc!', 'success');
        }
    }
}

function refreshTasks() {
    updateTasksSummary();
    displayTasksTimeline();
    renderCalendar();
    showNotification('Đã làm mới danh sách công việc!', 'info');
}

function exportTasks() {
    const currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const monthTasks = {};
    
    Object.keys(workData).forEach(dateKey => {
        if (dateKey.startsWith(currentMonthKey)) {
            monthTasks[dateKey] = workData[dateKey];
        }
    });
    
    const exportData = {
        month: `${currentMonth + 1}/${currentYear}`,
        tasks: monthTasks,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `cong-viec-thang-${currentMonth + 1}-${currentYear}.json`;
    link.click();
    
    showNotification('Đã xuất dữ liệu công việc!', 'success');
}

// Time tracking functions
function loadTimeData() {
    const today = formatDateKey(new Date());
    const todayData = timeData[today];
    
    if (todayData) {
        if (todayData.checkin && !todayData.checkout) {
            isCheckedIn = true;
            checkinTime = new Date(todayData.checkin);
            document.getElementById('checkinTime').textContent = formatTime(checkinTime);
            updateCheckinButton();
        }
        
        if (todayData.checkout) {
            checkoutTime = new Date(todayData.checkout);
            document.getElementById('checkoutTime').textContent = formatTime(checkoutTime);
            updateCheckoutButton();
        }
        
        if (todayData.totalBreakTime) {
            totalBreakTime = todayData.totalBreakTime;
        }
        
        if (todayData.breakStart && !todayData.breakEnd) {
            isOnBreak = true;
            breakStartTime = new Date(todayData.breakStart);
            updateBreakButton();
        }
    }
}

function saveTimeData() {
    const today = formatDateKey(new Date());
    
    if (!timeData[today]) {
        timeData[today] = {};
    }
    
    const todayData = timeData[today];
    
    if (checkinTime) {
        todayData.checkin = checkinTime.toISOString();
    }
    
    if (checkoutTime) {
        todayData.checkout = checkoutTime.toISOString();
    }
    
    todayData.totalBreakTime = totalBreakTime;
    
    if (breakStartTime && isOnBreak) {
        todayData.breakStart = breakStartTime.toISOString();
        delete todayData.breakEnd;
    } else if (breakStartTime && !isOnBreak) {
        todayData.breakEnd = new Date().toISOString();
        delete todayData.breakStart;
    }
    
    localStorage.setItem('timeData', JSON.stringify(timeData));
}

function handleCheckin() {
    if (!isCheckedIn) {
        checkinTime = new Date();
        isCheckedIn = true;
        document.getElementById('checkinTime').textContent = formatTime(checkinTime);
        updateCheckinButton();
        saveTimeData();
        renderCalendar();
        showNotification('Đã check-in thành công!', 'success');
    }
}

function handleCheckout() {
    if (isCheckedIn && !checkoutTime) {
        if (isOnBreak) {
            handleBreak(); // End break before checkout
        }
        
        checkoutTime = new Date();
        document.getElementById('checkoutTime').textContent = formatTime(checkoutTime);
        updateCheckoutButton();
        saveTimeData();
        renderCalendar();
        showNotification('Đã check-out thành công!', 'success');
    }
}

function handleBreak() {
    if (!isCheckedIn) {
        showNotification('Vui lòng check-in trước khi nghỉ giải lao!', 'warning');
        return;
    }
    
    if (!isOnBreak) {
        // Start break
        breakStartTime = new Date();
        isOnBreak = true;
        updateBreakButton();
        saveTimeData();
        showNotification('Bắt đầu nghỉ giải lao', 'info');
    } else {
        // End break
        const breakEndTime = new Date();
        const breakDuration = breakEndTime - breakStartTime;
        totalBreakTime += breakDuration;
        
        isOnBreak = false;
        breakStartTime = null;
        updateBreakButton();
        saveTimeData();
        showNotification('Kết thúc nghỉ giải lao', 'info');
    }
}

function updateCheckinButton() {
    const btn = document.getElementById('checkinBtn');
    if (isCheckedIn) {
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
}

function updateCheckoutButton() {
    const btn = document.getElementById('checkoutBtn');
    if (checkoutTime) {
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
}

function updateBreakButton() {
    const btn = document.getElementById('breakBtn');
    const span = btn.querySelector('span');
    
    if (isOnBreak) {
        btn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        span.textContent = 'Kết thúc nghỉ';
    } else {
        btn.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
        span.textContent = 'Nghỉ giải lao';
    }
}

function updateTimeDisplay() {
    updateBreakTimeDisplay();
    updateTotalTimeDisplay();
}

function updateBreakTimeDisplay() {
    let displayTime = totalBreakTime;
    
    if (isOnBreak && breakStartTime) {
        const currentBreakTime = new Date() - breakStartTime;
        displayTime += currentBreakTime;
    }
    
    const minutes = Math.floor(displayTime / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    document.getElementById('breakTime').textContent = 
        `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
}

function updateTotalTimeDisplay() {
    if (!isCheckedIn || !checkinTime) {
        document.getElementById('totalTime').textContent = '00:00';
        return;
    }
    
    const endTime = checkoutTime || new Date();
    const totalTime = endTime - checkinTime - totalBreakTime;
    
    if (isOnBreak && breakStartTime) {
        const currentBreakTime = new Date() - breakStartTime;
        const adjustedTotalTime = totalTime - currentBreakTime;
        const minutes = Math.floor(Math.max(0, adjustedTotalTime) / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        document.getElementById('totalTime').textContent = 
            `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
    } else {
        const minutes = Math.floor(Math.max(0, totalTime) / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        document.getElementById('totalTime').textContent = 
            `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
    }
}

// Today info update
function updateTodayInfo() {
    const today = new Date();
    const formattedDate = formatDate(today);
    document.getElementById('today-date').textContent = formattedDate;
}

// Todo functions
function addTodoItem() {
    const todoContent = document.querySelector('.todo-content');
    const newId = 'todo' + Date.now();
    
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';
    todoItem.innerHTML = `
        <input type="checkbox" id="${newId}">
        <label for="${newId}" contenteditable="true">Công việc mới</label>
        <button onclick="removeTodoItem(this)" style="margin-left: auto; background: none; border: none; color: #e74c3c; cursor: pointer;">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    todoContent.appendChild(todoItem);
    
    // Focus on the label for editing
    const label = todoItem.querySelector('label');
    label.focus();
    
    // Select all text
    const range = document.createRange();
    range.selectNodeContents(label);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function removeTodoItem(button) {
    button.parentElement.remove();
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        min-width: 300px;
    `;
    
    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        font-size: 16px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || '#3498db';
}

// Event listeners
function initializeEventListeners() {
    // Calendar navigation
    document.getElementById('prev-month').addEventListener('click', () => navigateMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => navigateMonth(1));
    
    // Time tracking buttons
    document.getElementById('checkinBtn').addEventListener('click', handleCheckin);
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
    document.getElementById('breakBtn').addEventListener('click', handleBreak);
    
    // Modal events
    document.getElementById('add-todo').addEventListener('click', addTodoItem);
    document.querySelector('.close').addEventListener('click', closeModal);
    
    // Tasks management buttons
    document.getElementById('refresh-tasks').addEventListener('click', refreshTasks);
    document.getElementById('export-tasks').addEventListener('click', exportTasks);
    
    // Time calculation listeners for work log form
    const startTimeInput = document.getElementById('workStartTime');
    const endTimeInput = document.getElementById('workEndTime');
    const breakTimeInput = document.getElementById('workBreakTime');
    
    if (startTimeInput) startTimeInput.addEventListener('change', calculateDuration);
    if (endTimeInput) endTimeInput.addEventListener('change', calculateDuration);
    if (breakTimeInput) breakTimeInput.addEventListener('change', calculateDuration);
    
    // Form submission
    document.getElementById('workLogForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        // Check if editing existing task
        if (window.editingTask) {
            updateExistingTask(formData);
            delete window.editingTask;
        } else {
            saveWorkLog(formData);
        }
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('workLogModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Esc to close modal
        if (e.key === 'Escape') {
            closeModal();
        }
        
        // Ctrl+N for new work log
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            openWorkLogModal();
        }
        
        // Ctrl+I for check-in
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            handleCheckin();
        }
        
        // Ctrl+O for check-out
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            handleCheckout();
        }
    });
}

function updateExistingTask(formData) {
    const { dateKey, taskId } = window.editingTask;
    const tasks = workData[dateKey];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        // Update task with new data
        const updatedTask = {
            ...tasks[taskIndex],
            title: formData.get('workTitle'),
            type: formData.get('workType'),
            calendar: formData.get('workCalendar'),
            location: formData.get('workLocation'),
            assignee: formData.get('workAssignee'),
            date: formData.get('workDate'),
            time: formData.get('workTime'),
            duration: formData.get('workDuration'),
            allDay: formData.get('allDay') === 'on',
            participants: formData.get('workParticipants'),
            guest: formData.get('workGuest'),
            category: formData.get('workCategory'),
            permission: formData.get('workPermission'),
            reminder: formData.get('reminder') === 'on',
            note: formData.get('workNote'),
            description: formData.get('workDescription'),
            updatedAt: new Date().toISOString()
        };
        
        // If date changed, move task to new date
        const newDateKey = formData.get('workDate');
        if (newDateKey !== dateKey) {
            // Remove from old date
            tasks.splice(taskIndex, 1);
            if (tasks.length === 0) {
                delete workData[dateKey];
            }
            
            // Add to new date
            if (!workData[newDateKey]) {
                workData[newDateKey] = [];
            }
            workData[newDateKey].push(updatedTask);
        } else {
            // Update in same date
            tasks[taskIndex] = updatedTask;
        }
        
        localStorage.setItem('workData', JSON.stringify(workData));
        
        renderCalendar();
        updateTasksSummary();
        displayTasksTimeline();
        closeModal();
        
        showNotification('Công việc đã được cập nhật!', 'success');
    }
}

// Export/Import functions
function exportData() {
    const data = {
        workData: workData,
        timeData: timeData,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `cham-cong-data-${formatDateKey(new Date())}.json`;
    link.click();
    
    showNotification('Dữ liệu đã được xuất thành công!', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.workData) workData = data.workData;
            if (data.timeData) timeData = data.timeData;
            
            localStorage.setItem('workData', JSON.stringify(workData));
            localStorage.setItem('timeData', JSON.stringify(timeData));
            
            renderCalendar();
            loadTimeData();
            
            showNotification('Dữ liệu đã được nhập thành công!', 'success');
        } catch (error) {
            showNotification('Lỗi khi nhập dữ liệu. Vui lòng kiểm tra file!', 'error');
        }
    };
    reader.readAsText(file);
}

// Statistics functions
function getMonthlyStats(year = currentYear, month = currentMonth) {
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const stats = {
        totalWorkDays: 0,
        totalWorkHours: 0,
        totalBreakTime: 0,
        averageWorkHours: 0,
        onTimeCheckins: 0,
        lateCheckins: 0
    };
    
    Object.keys(timeData).forEach(dateKey => {
        if (dateKey.startsWith(monthKey)) {
            const dayData = timeData[dateKey];
            if (dayData.checkin && dayData.checkout) {
                stats.totalWorkDays++;
                
                const checkin = new Date(dayData.checkin);
                const checkout = new Date(dayData.checkout);
                const workHours = (checkout - checkin - (dayData.totalBreakTime || 0)) / (1000 * 60 * 60);
                
                stats.totalWorkHours += workHours;
                stats.totalBreakTime += (dayData.totalBreakTime || 0) / (1000 * 60 * 60);
                
                // Check if on time (before 9:00 AM)
                if (checkin.getHours() < 9 || (checkin.getHours() === 9 && checkin.getMinutes() === 0)) {
                    stats.onTimeCheckins++;
                } else {
                    stats.lateCheckins++;
                }
            }
        }
    });
    
    stats.averageWorkHours = stats.totalWorkDays > 0 ? stats.totalWorkHours / stats.totalWorkDays : 0;
    
    return stats;
}

function displayStats() {
    const stats = getMonthlyStats();
    
    const statsHtml = `
        <div class="stats-container">
            <h3>Thống kê tháng ${currentMonth + 1}/${currentYear}</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <i class="fas fa-calendar-day"></i>
                    <span class="stat-value">${stats.totalWorkDays}</span>
                    <span class="stat-label">Ngày làm việc</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <span class="stat-value">${stats.totalWorkHours.toFixed(1)}h</span>
                    <span class="stat-label">Tổng giờ làm</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-coffee"></i>
                    <span class="stat-value">${stats.totalBreakTime.toFixed(1)}h</span>
                    <span class="stat-label">Tổng giờ nghỉ</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-chart-line"></i>
                    <span class="stat-value">${stats.averageWorkHours.toFixed(1)}h</span>
                    <span class="stat-label">Trung bình/ngày</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-check"></i>
                    <span class="stat-value">${stats.onTimeCheckins}</span>
                    <span class="stat-label">Đúng giờ</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-exclamation"></i>
                    <span class="stat-value">${stats.lateCheckins}</span>
                    <span class="stat-label">Trễ giờ</span>
                </div>
            </div>
        </div>
    `;
    
    // Create or update stats modal
    let statsModal = document.getElementById('statsModal');
    if (!statsModal) {
        statsModal = document.createElement('div');
        statsModal.id = 'statsModal';
        statsModal.className = 'modal';
        statsModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Thống kê công việc</h3>
                    <span class="close" onclick="document.getElementById('statsModal').style.display='none'">&times;</span>
                </div>
                <div class="modal-body" id="statsContent">
                    ${statsHtml}
                </div>
            </div>
        `;
        document.body.appendChild(statsModal);
        
        // Add stats styles
        const statsStyles = `
            .stats-container { padding: 20px; }
            .stats-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
                gap: 15px; 
                margin-top: 20px; 
            }
            .stat-item { 
                text-align: center; 
                padding: 15px; 
                background: #f8f9fa; 
                border-radius: 8px; 
                border-left: 4px solid #3498db;
            }
            .stat-item i { 
                font-size: 24px; 
                color: #3498db; 
                margin-bottom: 10px; 
            }
            .stat-value { 
                display: block; 
                font-size: 24px; 
                font-weight: bold; 
                color: #2c3e50; 
                margin-bottom: 5px; 
            }
            .stat-label { 
                font-size: 12px; 
                color: #666; 
                text-transform: uppercase; 
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = statsStyles;
        document.head.appendChild(styleSheet);
    } else {
        document.getElementById('statsContent').innerHTML = statsHtml;
    }
    
    statsModal.style.display = 'block';
}

// Add CSS animation keyframes
const animationStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;

const animationStyleSheet = document.createElement('style');
animationStyleSheet.textContent = animationStyles;
document.head.appendChild(animationStyleSheet);

// User Profile Dropdown Functions
function initializeUserProfile() {
    const userProfileBtn = document.getElementById('userProfileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (userProfileBtn && profileDropdown) {
        // Toggle dropdown on user icon click
        userProfileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userProfileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
        
        // Handle profile menu item clicks
        const profileMenuItems = profileDropdown.querySelectorAll('.profile-menu-item');
        profileMenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const text = this.querySelector('span').textContent;
                
                switch(text) {
                    case 'Profile':
                        showProfileModal();
                        break;
                    case 'Chỉnh sửa thông tin cá nhân':
                        showEditProfileModal();
                        break;
                    case 'Thiết lập chức năng cá nhân':
                        showPersonalSettingsModal();
                        break;
                    case 'Thiết lập thanh biểu tượng':
                        showToolbarSettingsModal();
                        break;
                    case 'Quản lý thông tin đăng nhập':
                        showLoginInfoModal();
                        break;
                    case 'Thoát ra':
                        handleLogout();
                        break;
                    case 'Tạn số & Thoát ra':
                        handleCalculatorAndLogout();
                        break;
                }
                
                profileDropdown.classList.remove('show');
            });
        });
    }
}

function showProfileModal() {
    const profileModal = createProfileModal();
    document.body.appendChild(profileModal);
    profileModal.classList.add('show');
}

function createProfileModal() {
    const modal = document.createElement('div');
    modal.className = 'modal profile-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-user"></i> Thông tin Profile</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="profile-details">
                    <div class="profile-avatar-large">
                        <i class="fas fa-user-circle"></i>
                        <button class="change-avatar-btn">
                            <i class="fas fa-camera"></i>
                        </button>
                    </div>
                    <div class="profile-info-detailed">
                        <h4>Nguyễn Văn Admin</h4>
                        <p><strong>Email:</strong> admin@ctsv.edu.vn</p>
                        <p><strong>Chức vụ:</strong> Quản trị viên</p>
                        <p><strong>Phòng ban:</strong> Phòng Công nghệ thông tin</p>
                        <p><strong>Ngày tham gia:</strong> 01/01/2023</p>
                        <p><strong>Trạng thái:</strong> <span class="status-active">Đang hoạt động</span></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-modal">Đóng</button>
                <button type="button" class="btn btn-primary">Chỉnh sửa</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close');
    const closeModalBtn = modal.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    closeModalBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

function showEditProfileModal() {
    alert('Chức năng Chỉnh sửa thông tin cá nhân đang được phát triển...');
}

function showPersonalSettingsModal() {
    alert('Chức năng Thiết lập chức năng cá nhân đang được phát triển...');
}

function showToolbarSettingsModal() {
    alert('Chức năng Thiết lập thanh biểu tượng đang được phát triển...');
}

function showLoginInfoModal() {
    alert('Chức năng Quản lý thông tin đăng nhập đang được phát triển...');
}

function handleLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        // Clear session data
        localStorage.removeItem('userSession');
        localStorage.removeItem('timeData');
        // Show logout animation
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = 'pages/login.html';
        }, 500);
    }
}

function handleCalculatorAndLogout() {
    alert('Chức năng Tạn số & Thoát ra đang được phát triển...');
}

// User Actions (Search & Notifications) Functions
function initializeUserActions() {
    initializeSearchFunction();
    initializeNotifications();
}

function initializeSearchFunction() {
    const searchIcon = document.querySelector('.user-actions .fa-search');
    
    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openSearchModal();
        });
        
        searchIcon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        searchIcon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Add keyboard shortcut for search
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            openSearchModal();
        }
    });
}

function openSearchModal() {
    let searchModal = document.getElementById('searchModal');
    
    if (!searchModal) {
        searchModal = createSearchModal();
        document.body.appendChild(searchModal);
    }
    
    searchModal.style.display = 'block';
    const searchInput = searchModal.querySelector('#searchInput');
    
    // Focus on input and load recent searches
    setTimeout(() => {
        searchInput.focus();
        updateRecentSearchesDisplay();
    }, 100);
    
    searchInput.value = '';
}

function createSearchModal() {
    const modal = document.createElement('div');
    modal.id = 'searchModal';
    modal.className = 'modal search-modal';
    modal.innerHTML = `
        <div class="search-modal-overlay" onclick="closeSearchModal()"></div>
        <div class="search-modal-container">
            <div class="search-modal-header">
                <div class="search-input-wrapper">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" id="searchInput" placeholder="Bạn tìm gì..." autocomplete="off" autofocus>
                    <button class="search-close-btn" onclick="closeSearchModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="search-modal-body">
                <div class="search-filters-section">
                    <div class="search-filters">
                        <button class="search-filter-btn active" data-filter="all">
                            <i class="fas fa-globe"></i>
                            <span>Tất cả</span>
                        </button>
                        <button class="search-filter-btn" data-filter="tasks">
                            <i class="fas fa-tasks"></i>
                            <span>Công việc</span>
                        </button>
                        <button class="search-filter-btn" data-filter="calendar">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Lịch trình</span>
                        </button>
                        <button class="search-filter-btn" data-filter="notes">
                            <i class="fas fa-sticky-note"></i>
                            <span>Ghi chú</span>
                        </button>
                        <button class="search-filter-btn" data-filter="people">
                            <i class="fas fa-users"></i>
                            <span>Người dùng</span>
                        </button>
                    </div>
                </div>
                
                <div class="search-content">
                    <div class="search-results" id="searchResults">
                        <div class="search-empty-state">
                            <div class="search-empty-icon">
                                <i class="fas fa-search"></i>
                            </div>
                            <h4>Tìm kiếm nhanh</h4>
                            <p>Nhập từ khóa để tìm kiếm công việc, lịch trình, ghi chú và nhiều hơn nữa</p>
                            
                            <div class="search-quick-actions">
                                <h5>Tìm kiếm nhanh</h5>
                                <div class="quick-search-grid">
                                    <button class="quick-search-item" onclick="searchSuggestion('họp hôm nay')">
                                        <i class="fas fa-video"></i>
                                        <span>Họp hôm nay</span>
                                    </button>
                                    <button class="quick-search-item" onclick="searchSuggestion('công việc chưa hoàn thành')">
                                        <i class="fas fa-tasks"></i>
                                        <span>Việc chưa xong</span>
                                    </button>
                                    <button class="quick-search-item" onclick="searchSuggestion('deadline tuần này')">
                                        <i class="fas fa-clock"></i>
                                        <span>Deadline tuần này</span>
                                    </button>
                                    <button class="quick-search-item" onclick="searchSuggestion('báo cáo')">
                                        <i class="fas fa-chart-bar"></i>
                                        <span>Báo cáo</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="search-recent">
                                <h5>Tìm kiếm gần đây</h5>
                                <div class="recent-searches" id="recentSearches">
                                    <div class="no-recent">Chưa có tìm kiếm gần đây</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="search-modal-footer">
                <div class="search-shortcuts-info">
                    <span class="shortcut"><kbd>↑↓</kbd> di chuyển</span>
                    <span class="shortcut"><kbd>Enter</kbd> chọn</span>
                    <span class="shortcut"><kbd>Esc</kbd> đóng</span>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const searchInput = modal.querySelector('#searchInput');
    const filterBtns = modal.querySelectorAll('.search-filter-btn');
    
    searchInput.addEventListener('input', function() {
        performSearch(this.value);
        saveRecentSearch(this.value);
    });
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSearchModal();
        } else if (e.key === 'Enter') {
            const firstResult = modal.querySelector('.search-result-item');
            if (firstResult) {
                firstResult.click();
            }
        }
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            performSearch(searchInput.value);
        });
    });
    
    // Close modal when clicking overlay
    const overlay = modal.querySelector('.search-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeSearchModal);
    }
    
    return modal;
}

function closeSearchModal() {
    const searchModal = document.getElementById('searchModal');
    if (searchModal) {
        searchModal.style.display = 'none';
    }
}

function performSearch(query) {
    const resultsContainer = document.getElementById('searchResults');
    const activeFilter = document.querySelector('.search-filter-btn.active')?.dataset.filter || 'all';
    
    if (!query.trim()) {
        resultsContainer.innerHTML = `
            <div class="search-empty-state">
                <div class="search-empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h4>Tìm kiếm nhanh</h4>
                <p>Nhập từ khóa để tìm kiếm công việc, lịch trình, ghi chú và nhiều hơn nữa</p>
                
                <div class="search-quick-actions">
                    <h5>Tìm kiếm nhanh</h5>
                    <div class="quick-search-grid">
                        <button class="quick-search-item" onclick="searchSuggestion('họp hôm nay')">
                            <i class="fas fa-video"></i>
                            <span>Họp hôm nay</span>
                        </button>
                        <button class="quick-search-item" onclick="searchSuggestion('công việc chưa hoàn thành')">
                            <i class="fas fa-tasks"></i>
                            <span>Việc chưa xong</span>
                        </button>
                        <button class="quick-search-item" onclick="searchSuggestion('deadline tuần này')">
                            <i class="fas fa-clock"></i>
                            <span>Deadline tuần này</span>
                        </button>
                        <button class="quick-search-item" onclick="searchSuggestion('báo cáo')">
                            <i class="fas fa-chart-bar"></i>
                            <span>Báo cáo</span>
                        </button>
                    </div>
                </div>
                
                <div class="search-recent">
                    <h5>Tìm kiếm gần đây</h5>
                    <div class="recent-searches" id="recentSearches">
                        <div class="no-recent">Chưa có tìm kiếm gần đây</div>
                    </div>
                </div>
            </div>
        `;
        updateRecentSearchesDisplay();
        return;
    }
    
    const results = searchInData(query, activeFilter);
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search-minus"></i>
                </div>
                <h4>Không tìm thấy kết quả</h4>
                <p>Không tìm thấy kết quả nào cho "<strong>${query}</strong>"</p>
                <div class="search-suggestions">
                    <p>Gợi ý:</p>
                    <ul>
                        <li>Kiểm tra chính tả từ khóa</li>
                        <li>Thử sử dụng từ khóa khác</li>
                        <li>Sử dụng từ khóa tổng quát hơn</li>
                    </ul>
                </div>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = `
        <div class="search-results-header">
            <p>Tìm thấy <strong>${results.length}</strong> kết quả cho "<strong>${query}</strong>"</p>
        </div>
        <div class="search-results-list">
            ${results.map(result => `
                <div class="search-result-item" onclick="selectSearchResult('${result.type}', '${result.id}')">
                    <div class="result-icon">
                        <i class="fas fa-${result.icon}"></i>
                    </div>
                    <div class="result-content">
                        <div class="result-title">${result.title}</div>
                        <div class="result-description">${result.description}</div>
                        <div class="result-meta">
                            <span class="result-type">${result.typeLabel}</span>
                            ${result.date ? `<span class="result-date">${result.date}</span>` : ''}
                        </div>
                    </div>
                    <div class="result-action">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function searchInData(query, filter) {
    const results = [];
    const searchTerm = query.toLowerCase();
    
    // Search in work data
    if (filter === 'all' || filter === 'tasks' || filter === 'calendar') {
        Object.keys(workData).forEach(dateKey => {
            const tasks = workData[dateKey];
            tasks.forEach(task => {
                const matchFields = [
                    task.title,
                    task.location,
                    task.assignee,
                    task.participants,
                    task.note,
                    task.description
                ].filter(field => field).join(' ').toLowerCase();
                
                if (matchFields.includes(searchTerm)) {
                    results.push({
                        type: 'task',
                        icon: 'tasks',
                        typeLabel: 'Công việc',
                        title: task.title,
                        description: task.note || task.location || 'Không có mô tả',
                        date: formatDisplayDate(new Date(dateKey)),
                        id: task.id,
                        relevance: calculateRelevance(matchFields, searchTerm)
                    });
                }
            });
        });
    }
    
    // Search in time data
    if (filter === 'all' || filter === 'tasks') {
        Object.keys(timeData).forEach(dateKey => {
            const timeEntry = timeData[dateKey];
            if (timeEntry.checkin || timeEntry.checkout) {
                const searchableContent = `chấm công ${dateKey}`.toLowerCase();
                if (searchableContent.includes(searchTerm)) {
                    const checkinTime = timeEntry.checkin ? formatTime(new Date(timeEntry.checkin)) : '--:--';
                    const checkoutTime = timeEntry.checkout ? formatTime(new Date(timeEntry.checkout)) : '--:--';
                    
                    results.push({
                        type: 'timecard',
                        icon: 'clock',
                        typeLabel: 'Chấm công',
                        title: `Chấm công ngày ${formatDisplayDate(new Date(dateKey))}`,
                        description: `Check-in: ${checkinTime}, Check-out: ${checkoutTime}`,
                        date: formatDisplayDate(new Date(dateKey)),
                        id: dateKey,
                        relevance: calculateRelevance(searchableContent, searchTerm)
                    });
                }
            }
        });
    }
    
    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance);
}

function calculateRelevance(text, searchTerm) {
    const exactMatch = text.includes(searchTerm);
    const wordCount = searchTerm.split(' ').filter(word => text.includes(word)).length;
    return exactMatch ? 100 + wordCount : wordCount;
}

function selectSearchResult(type, id) {
    if (type === 'task') {
        // Find and open the task
        Object.keys(workData).forEach(dateKey => {
            const tasks = workData[dateKey];
            const task = tasks.find(t => t.id == id);
            if (task) {
                editTask(dateKey, id);
                closeSearchModal();
            }
        });
    } else if (type === 'timecard') {
        // Focus on the date
        const date = new Date(id);
        currentMonth = date.getMonth();
        currentYear = date.getFullYear();
        renderCalendar();
        updateMonthYear();
        closeSearchModal();
        showNotification(`Đã chuyển đến ${formatDisplayDate(date)}`, 'info');
    }
}

function saveRecentSearch(query) {
    if (!query || query.length < 2) return;
    
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    // Remove if already exists
    recentSearches = recentSearches.filter(search => search !== query);
    
    // Add to beginning
    recentSearches.unshift(query);
    
    // Keep only last 5 searches
    recentSearches = recentSearches.slice(0, 5);
    
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    updateRecentSearchesDisplay();
}

function updateRecentSearchesDisplay() {
    const recentContainer = document.getElementById('recentSearches');
    if (!recentContainer) return;
    
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    if (recentSearches.length === 0) {
        recentContainer.innerHTML = '<div class="no-recent">Chưa có tìm kiếm gần đây</div>';
        return;
    }
    
    recentContainer.innerHTML = recentSearches.map(search => `
        <button class="recent-search-item" onclick="searchSuggestion('${search}')">
            <i class="fas fa-history"></i>
            <span>${search}</span>
        </button>
    `).join('');
}

function searchSuggestion(term) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = term;
        performSearch(term);
    }
}

// Notifications System
function initializeNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    
    if (notificationBtn && notificationsDropdown) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationsDropdown.classList.toggle('show');
            if (notificationsDropdown.classList.contains('show')) {
                loadNotifications();
            }
        });
        
        document.addEventListener('click', function(e) {
            if (!notificationBtn.contains(e.target) && !notificationsDropdown.contains(e.target)) {
                notificationsDropdown.classList.remove('show');
            }
        });
        
        // Load notifications on init
        loadNotifications();
        
        // Update notifications periodically
        setInterval(loadNotifications, 30000); // Every 30 seconds
    }
}

function loadNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    const notificationBadge = document.getElementById('notificationBadge');
    
    // Get notifications from localStorage or create default ones
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [
        {
            id: 1,
            type: 'reminder',
            title: 'Nhắc nhở check-in',
            message: 'Đừng quên check-in để ghi nhận thời gian làm việc',
            time: new Date().toISOString(),
            read: false
        },
        {
            id: 2,
            type: 'warning',
            title: 'Deadline sắp tới',
            message: 'Bạn có 2 công việc sắp hết hạn trong tuần này',
            time: new Date(Date.now() - 3600000).toISOString(),
            read: false
        },
        {
            id: 3,
            type: 'info',
            title: 'Cập nhật hệ thống',
            message: 'Hệ thống đã được cập nhật phiên bản mới với nhiều tính năng',
            time: new Date(Date.now() - 86400000).toISOString(),
            read: true
        }
    ];
    
    // Update badge
    const unreadCount = notifications.filter(n => !n.read).length;
    if (notificationBadge) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
    
    // Display notifications
    if (notificationsList) {
        if (notifications.length === 0) {
            notificationsList.innerHTML = '<div class="no-notifications">Không có thông báo mới</div>';
        } else {
            notificationsList.innerHTML = notifications.map(notification => `
                <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                    <div class="notification-icon ${notification.type}">
                        <i class="fas fa-${getNotificationTypeIcon(notification.type)}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-time">${formatNotificationTime(notification.time)}</div>
                    </div>
                    <div class="notification-actions">
                        ${!notification.read ? `<button class="mark-read-btn" onclick="markNotificationRead(${notification.id})" title="Đánh dấu đã đọc">
                            <i class="fas fa-check"></i>
                        </button>` : ''}
                        <button class="delete-notification-btn" onclick="deleteNotification(${notification.id})" title="Xóa">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

function getNotificationTypeIcon(type) {
    const icons = {
        reminder: 'bell',
        warning: 'exclamation-triangle',
        info: 'info-circle',
        success: 'check-circle'
    };
    return icons[type] || 'bell';
}

function formatNotificationTime(timeString) {
    const time = new Date(timeString);
    const now = new Date();
    const diff = now - time;
    
    if (diff < 60000) { // Less than 1 minute
        return 'Vừa xong';
    } else if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        return `${minutes} phút trước`;
    } else if (diff < 86400000) { // Less than 1 day
        const hours = Math.floor(diff / 3600000);
        return `${hours} giờ trước`;
    } else { // More than 1 day
        const days = Math.floor(diff / 86400000);
        return `${days} ngày trước`;
    }
}

function markNotificationRead(id) {
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
        loadNotifications();
    }
}

function deleteNotification(id) {
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications = notifications.filter(n => n.id !== id);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    loadNotifications();
}

function markAllNotificationsRead() {
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.forEach(n => n.read = true);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    loadNotifications();
    showNotification('Đã đánh dấu tất cả thông báo là đã đọc', 'success');
}

function viewAllNotifications() {
    // This could open a dedicated notifications page
    showNotification('Chức năng xem tất cả thông báo đang được phát triển', 'info');
}

// Settings Dropdown Functions
function initializeSettings() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsDropdown = document.getElementById('settingsDropdown');
    
    if (settingsBtn && settingsDropdown) {
        // Toggle dropdown on settings icon click
        settingsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            settingsDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!settingsBtn.contains(e.target) && !settingsDropdown.contains(e.target)) {
                settingsDropdown.classList.remove('show');
            }
        });
        
        // Initialize settings controls
        initializeThemeToggle();
        initializeColorSchemes();
        initializeFontSizeControls();
        initializeSettingsCheckboxes();
        initializeSettingsButtons();
        
        // Load saved settings
        loadSettings();
    }
}

function initializeThemeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            console.log('Dark mode toggled:', this.checked);
            toggleDarkMode(this.checked);
        });
    }
}

function toggleDarkMode(isDark, silent = false) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    }
    
    // Update theme toggle background
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.style.background = isDark ? '#34495e' : '#bdc3c7';
    }
    
    if (!silent) {
        showNotification(
            isDark ? 'Đã chuyển sang chế độ tối' : 'Đã chuyển sang chế độ sáng', 
            'success'
        );
    }
}

function initializeColorSchemes() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.dataset.color;
            console.log('Color scheme selected:', color);
            changeColorScheme(color);
            
            // Update active state
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function changeColorScheme(color, silent = false) {
    const colors = {
        blue: { primary: '#3498db', secondary: '#2980b9' },
        green: { primary: '#27ae60', secondary: '#229954' },
        purple: { primary: '#8e44ad', secondary: '#7d3c98' },
        orange: { primary: '#e67e22', secondary: '#d35400' },
        red: { primary: '#e74c3c', secondary: '#c0392b' }
    };
    
    const selectedColor = colors[color];
    
    if (selectedColor) {
        // Update CSS custom properties
        document.documentElement.style.setProperty('--primary-color', selectedColor.primary);
        document.documentElement.style.setProperty('--primary-dark', selectedColor.secondary);
        document.documentElement.style.setProperty('--primary-light', selectedColor.primary + '80'); // Add opacity
        
        // Update specific elements that might not use CSS variables yet
        const elementsToUpdate = document.querySelectorAll('.logo i, .nav-item.active, .dropdown-item:hover');
        elementsToUpdate.forEach(el => {
            el.style.color = selectedColor.primary;
        });
        
        // Save to localStorage
        localStorage.setItem('colorScheme', color);
        
        if (!silent) {
            showNotification(`Đã đổi màu chủ đạo thành ${getColorName(color)}`, 'success');
        }
    }
}

function getColorName(color) {
    const names = {
        blue: 'xanh dương',
        green: 'xanh lá',
        purple: 'tím',
        orange: 'cam',
        red: 'đỏ'
    };
    return names[color] || 'mặc định';
}

function initializeFontSizeControls() {
    const fontBtns = document.querySelectorAll('.font-btn');
    
    fontBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const size = this.dataset.size;
            console.log('Font size selected:', size);
            changeFontSize(size);
            
            // Update active state
            fontBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function changeFontSize(size, silent = false) {
    const sizes = {
        small: '0.9rem',
        medium: '1rem',
        large: '1.1rem'
    };
    
    if (sizes[size]) {
        document.documentElement.style.setProperty('--base-font-size', sizes[size]);
        
        // Apply font size to all elements that use base font size
        document.body.style.fontSize = sizes[size];
        
        localStorage.setItem('fontSize', size);
        
        if (!silent) {
            showNotification(`Đã đổi cỡ chữ thành ${size === 'small' ? 'nhỏ' : size === 'large' ? 'to' : 'vừa'}`, 'success');
        }
    }
}
    localStorage.setItem('fontSize', size);
    
    showNotification(`Đã đổi cỡ chữ thành ${size === 'small' ? 'nhỏ' : size === 'large' ? 'to' : 'vừa'}`, 'success');
}

function initializeSettingsCheckboxes() {
    const checkboxes = document.querySelectorAll('.setting-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const setting = this.id;
            const value = this.checked;
            
            localStorage.setItem(setting, value.toString());
            
            handleSettingChange(setting, value);
        });
    });
}

function handleSettingChange(setting, value) {
    const messages = {
        emailNotifications: value ? 'Bật thông báo email' : 'Tắt thông báo email',
        soundNotifications: value ? 'Bật âm thanh thông báo' : 'Tắt âm thanh thông báo',
        desktopNotifications: value ? 'Bật thông báo desktop' : 'Tắt thông báo desktop',
        autoCheckin: value ? 'Bật tự động check-in' : 'Tắt tự động check-in',
        breakReminder: value ? 'Bật nhắc nhở nghỉ giải lao' : 'Tắt nhắc nhở nghỉ giải lao',
        showAvatar: value ? 'Hiển thị avatar' : 'Ẩn avatar'
    };
    
    if (messages[setting]) {
        showNotification(messages[setting], 'success');
    }
    
    // Handle specific setting changes
    if (setting === 'desktopNotifications' && value) {
        requestNotificationPermission();
    }
}

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                showNotification('Đã cấp quyền thông báo desktop', 'success');
            } else {
                showNotification('Không thể cấp quyền thông báo desktop', 'error');
            }
        });
    }
}

function initializeSettingsButtons() {
    const resetBtn = document.querySelector('.reset-btn');
    const saveBtn = document.querySelector('.save-btn');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSettings);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }
}

function resetSettings() {
    if (confirm('Bạn có chắc chắn muốn khôi phục cài đặt mặc định?')) {
        // Reset to defaults
        localStorage.removeItem('darkMode');
        localStorage.removeItem('colorScheme');
        localStorage.removeItem('fontSize');
        localStorage.removeItem('emailNotifications');
        localStorage.removeItem('soundNotifications');
        localStorage.removeItem('desktopNotifications');
        localStorage.removeItem('autoCheckin');
        localStorage.removeItem('breakReminder');
        localStorage.removeItem('showAvatar');
        
        // Apply defaults
        document.body.classList.remove('dark-mode');
        document.documentElement.style.setProperty('--primary-color', '#3498db');
        document.documentElement.style.setProperty('--primary-dark', '#2980b9');
        document.documentElement.style.setProperty('--base-font-size', '1rem');
        
        // Update UI
        loadSettings();
        
        showNotification('Đã khôi phục cài đặt mặc định', 'success');
    }
}

function saveSettings() {
    showNotification('Đã lưu tất cả cài đặt', 'success');
    
    // Close settings dropdown
    document.getElementById('settingsDropdown').classList.remove('show');
}

function loadSettings() {
    // Load dark mode
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = darkMode;
        toggleDarkMode(darkMode, true); // silent = true to prevent notification on load
    }
    
    // Load color scheme
    const colorScheme = localStorage.getItem('colorScheme') || 'blue';
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.color === colorScheme);
    });
    changeColorScheme(colorScheme, true); // silent = true to prevent notification on load
    
    // Load font size
    const fontSize = localStorage.getItem('fontSize') || 'medium';
    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.size === fontSize);
    });
    changeFontSize(fontSize, true); // silent = true to prevent notification on load
    
    // Load checkboxes
    const checkboxSettings = [
        'emailNotifications', 'soundNotifications', 'desktopNotifications',
        'autoCheckin', 'breakReminder', 'showAvatar'
    ];
    
    checkboxSettings.forEach(setting => {
        const checkbox = document.getElementById(setting);
        if (checkbox) {
            const value = localStorage.getItem(setting);
            checkbox.checked = value === null ? checkbox.checked : value === 'true';
        }
    });
}

// Console logging for development
console.log('Hệ thống chấm công CTSV đã được khởi tạo');
console.log('Phím tắt:');
console.log('- Ctrl+N: Tạo lịch công tác mới');
console.log('- Ctrl+I: Check-in');
console.log('- Ctrl+O: Check-out');
console.log('- Esc: Đóng modal');
