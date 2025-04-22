/**
 * 4GAMER - نظام إدارة الاقتراحات في لوحة المسؤول
 * يتضمن عرض الاقتراحات، تصفيتها، تغيير حالتها، وإدارتها
 */

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحميل الاقتراحات وعرضها
    loadSuggestions();
    
    // تحديث عدادات الإحصائيات
    updateStatistics();
    
    // تهيئة مستمعات الأحداث
    initEventListeners();
    
    // تحديث عدد الإشعارات الجديدة
    updateNotificationsCount();
});

/**
 * تهيئة مستمعات الأحداث للعناصر المختلفة
 */
function initEventListeners() {
    // مستمعات أزرار التصفية
    document.getElementById('applyFilterBtn').addEventListener('click', applyFilters);
    document.getElementById('resetFilterBtn').addEventListener('click', resetFilters);
    
    // مستمعات أزرار الإجراءات
    document.getElementById('refreshSuggestionsBtn').addEventListener('click', refreshSuggestions);
    document.getElementById('exportSuggestionsBtn').addEventListener('click', exportSuggestions);
    document.getElementById('deleteSelectedBtn').addEventListener('click', deleteSelectedSuggestions);
    
    // مستمع تحديد الكل
    document.getElementById('selectAllSuggestions').addEventListener('change', toggleSelectAll);
    
    // مستمعات النافذة المنبثقة
    document.getElementById('closeSuggestionDetailsBtn').addEventListener('click', closeSuggestionDetails);
    document.getElementById('closeModalBtn').addEventListener('click', closeSuggestionDetails);
    document.getElementById('updateStatusBtn').addEventListener('click', updateSuggestionStatus);
    document.getElementById('saveNotesBtn').addEventListener('click', saveSuggestionNotes);
    document.getElementById('deleteSuggestionBtn').addEventListener('click', deleteCurrentSuggestion);
    
    // مستمعات الإشعارات
    document.getElementById('notificationsBtn').addEventListener('click', toggleNotificationsDropdown);
    document.getElementById('markAllReadBtn').addEventListener('click', markAllNotificationsAsRead);
    
    // مستمعات قائمة المستخدم
    document.getElementById('userBtn').addEventListener('click', toggleUserDropdown);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

/**
 * تحميل الاقتراحات من التخزين المحلي وعرضها في الجدول
 */
function loadSuggestions() {
    // الحصول على الاقتراحات المخزنة
    const suggestions = getSuggestions();
    
    // تحديث عدد الاقتراحات الجديدة
    updateNewSuggestionsCount(suggestions);
    
    // تطبيق التصفية الحالية
    const filteredSuggestions = filterSuggestions(suggestions);
    
    // عرض الاقتراحات في الجدول
    displaySuggestions(filteredSuggestions);
}

/**
 * الحصول على الاقتراحات من التخزين المحلي
 * @returns {Array} - قائمة الاقتراحات
 */
function getSuggestions() {
    return JSON.parse(localStorage.getItem('4gamer_suggestions')) || [];
}

/**
 * تحديث عدد الاقتراحات الجديدة في القائمة الجانبية
 * @param {Array} suggestions - قائمة الاقتراحات
 */
function updateNewSuggestionsCount(suggestions) {
    const newSuggestions = suggestions.filter(suggestion => suggestion.status === 'جديد');
    const newSuggestionsCount = document.getElementById('newSuggestionsCount');
    
    if (newSuggestionsCount) {
        newSuggestionsCount.textContent = newSuggestions.length;
        newSuggestionsCount.style.display = newSuggestions.length > 0 ? 'inline-flex' : 'none';
    }
}

/**
 * تصفية الاقتراحات حسب المعايير المحددة
 * @param {Array} suggestions - قائمة الاقتراحات
 * @returns {Array} - قائمة الاقتراحات المصفاة
 */
function filterSuggestions(suggestions) {
    const statusFilter = document.getElementById('filterStatus').value;
    const typeFilter = document.getElementById('filterType').value;
    const dateFilter = document.getElementById('filterDate').value;
    const searchQuery = document.getElementById('searchSuggestion').value.trim().toLowerCase();
    
    return suggestions.filter(suggestion => {
        // تصفية حسب الحالة
        if (statusFilter !== 'all' && suggestion.status !== getStatusArabicName(statusFilter)) {
            return false;
        }
        
        // تصفية حسب النوع
        if (typeFilter !== 'all' && suggestion.contentType !== typeFilter) {
            return false;
        }
        
        // تصفية حسب التاريخ
        if (dateFilter !== 'all') {
            const suggestionDate = new Date(suggestion.date);
            const currentDate = new Date();
            
            if (dateFilter === 'today') {
                if (suggestionDate.toDateString() !== currentDate.toDateString()) {
                    return false;
                }
            } else if (dateFilter === 'week') {
                const weekAgo = new Date();
                weekAgo.setDate(currentDate.getDate() - 7);
                if (suggestionDate < weekAgo) {
                    return false;
                }
            } else if (dateFilter === 'month') {
                const monthAgo = new Date();
                monthAgo.setMonth(currentDate.getMonth() - 1);
                if (suggestionDate < monthAgo) {
                    return false;
                }
            }
        }
        
        // تصفية حسب البحث
        if (searchQuery) {
            const titleMatch = suggestion.title.toLowerCase().includes(searchQuery);
            const descriptionMatch = suggestion.description.toLowerCase().includes(searchQuery);
            const emailMatch = suggestion.email.toLowerCase().includes(searchQuery);
            
            if (!titleMatch && !descriptionMatch && !emailMatch) {
                return false;
            }
        }
        
        return true;
    });
}

/**
 * عرض الاقتراحات في الجدول
 * @param {Array} suggestions - قائمة الاقتراحات المصفاة
 */
function displaySuggestions(suggestions) {
    const tableBody = document.getElementById('suggestionsTableBody');
    const emptyMessage = document.getElementById('suggestionsEmpty');
    
    // مسح محتوى الجدول الحالي
    tableBody.innerHTML = '';
    
    // التحقق من وجود اقتراحات
    if (suggestions.length === 0) {
        emptyMessage.style.display = 'flex';
        return;
    }
    
    // إخفاء رسالة "لا توجد اقتراحات"
    emptyMessage.style.display = 'none';
    
    // إضافة الاقتراحات إلى الجدول
    suggestions.forEach(suggestion => {
        const row = document.createElement('tr');
        row.dataset.id = suggestion.id;
        
        // إنشاء خلايا الصف
        row.innerHTML = `
            <td class="checkbox-cell">
                <input type="checkbox" class="suggestion-checkbox" data-id="${suggestion.id}">
            </td>
            <td class="title-cell">${suggestion.title}</td>
            <td>${getContentTypeName(suggestion.contentType)}</td>
            <td>${formatDate(suggestion.date)}</td>
            <td>${suggestion.email}</td>
            <td>
                <span class="status-badge status-${getStatusClass(suggestion.status)}">${suggestion.status}</span>
            </td>
            <td class="actions-cell">
                <button class="admin-action-btn view-btn" data-id="${suggestion.id}" title="عرض التفاصيل">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="admin-action-btn delete-btn" data-id="${suggestion.id}" title="حذف">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        // إضافة الصف إلى الجدول
        tableBody.appendChild(row);
    });
    
    // إضافة مستمعات الأحداث للأزرار
    addTableButtonListeners();
    
    // إضافة مستمعات لمربعات الاختيار
    addCheckboxListeners();
}

/**
 * إضافة مستمعات الأحداث لأزرار الجدول
 */
function addTableButtonListeners() {
    // مستمعات أزرار العرض
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const suggestionId = this.dataset.id;
            openSuggestionDetails(suggestionId);
        });
    });
    
    // مستمعات أزرار الحذف
    const deleteButtons = document.querySelectorAll('.actions-cell .delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const suggestionId = this.dataset.id;
            deleteSuggestion(suggestionId);
        });
    });
}

/**
 * إضافة مستمعات لمربعات الاختيار
 */
function addCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.suggestion-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateDeleteSelectedButton);
    });
}

/**
 * تحديث حالة زر "حذف المحدد"
 */
function updateDeleteSelectedButton() {
    const checkboxes = document.querySelectorAll('.suggestion-checkbox:checked');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    
    deleteSelectedBtn.disabled = checkboxes.length === 0;
}

/**
 * تبديل حالة تحديد جميع الاقتراحات
 */
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAllSuggestions');
    const checkboxes = document.querySelectorAll('.suggestion-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateDeleteSelectedButton();
}

/**
 * فتح نافذة تفاصيل الاقتراح
 * @param {string} suggestionId - معرف الاقتراح
 */
function openSuggestionDetails(suggestionId) {
    // الحصول على الاقتراح من التخزين المحلي
    const suggestions = getSuggestions();
    const suggestion = suggestions.find(item => item.id === suggestionId);
    
    if (!suggestion) {
        showNotification('لم يتم العثور على الاقتراح', 'error');
        return;
    }
    
    // تعيين بيانات الاقتراح في النافذة المنبثقة
    document.getElementById('suggestionDetailsTitle').textContent = suggestion.title;
    document.getElementById('suggestionDetailsType').textContent = getContentTypeName(suggestion.contentType);
    document.getElementById('suggestionDetailsDate').textContent = formatDate(suggestion.date);
    document.getElementById('suggestionDetailsDescription').textContent = suggestion.description;
    document.getElementById('suggestionDetailsEmail').textContent = suggestion.email;
    
    // تعيين حالة الاقتراح
    const statusSelect = document.getElementById('suggestionStatusSelect');
    statusSelect.value = getStatusEnglishName(suggestion.status);
    
    // تعيين ملاحظات الاقتراح
    const notesTextarea = document.getElementById('suggestionNotesTextarea');
    notesTextarea.value = suggestion.notes || '';
    
    // تخزين معرف الاقتراح الحالي
    document.getElementById('suggestionDetailsModal').dataset.id = suggestionId;
    
    // إظهار النافذة المنبثقة
    document.getElementById('suggestionDetailsModal').classList.add('show');
}

/**
 * إغلاق نافذة تفاصيل الاقتراح
 */
function closeSuggestionDetails() {
    document.getElementById('suggestionDetailsModal').classList.remove('show');
}

/**
 * تحديث حالة الاقتراح
 */
function updateSuggestionStatus() {
    // الحصول على معرف الاقتراح الحالي
    const suggestionId = document.getElementById('suggestionDetailsModal').dataset.id;
    
    // الحصول على الحالة الجديدة
    const newStatus = document.getElementById('suggestionStatusSelect').value;
    
    // تحديث الاقتراح في التخزين المحلي
    updateSuggestionInStorage(suggestionId, {
        status: getStatusArabicName(newStatus)
    });
    
    // عرض رسالة نجاح
    showNotification('تم تحديث حالة الاقتراح بنجاح', 'success');
    
    // إعادة تحميل الاقتراحات
    loadSuggestions();
}

/**
 * حفظ ملاحظات الاقتراح
 */
function saveSuggestionNotes() {
    // الحصول على معرف الاقتراح الحالي
    const suggestionId = document.getElementById('suggestionDetailsModal').dataset.id;
    
    // الحصول على الملاحظات الجديدة
    const notes = document.getElementById('suggestionNotesTextarea').value;
    
    // تحديث الاقتراح في التخزين المحلي
    updateSuggestionInStorage(suggestionId, {
        notes: notes
    });
    
    // عرض رسالة نجاح
    showNotification('تم حفظ الملاحظات بنجاح', 'success');
}

/**
 * تحديث الاقتراح في التخزين المحلي
 * @param {string} suggestionId - معرف الاقتراح
 * @param {Object} updates - التحديثات المطلوبة
 */
function updateSuggestionInStorage(suggestionId, updates) {
    // الحصول على الاقتراحات المخزنة
    let suggestions = getSuggestions();
    
    // البحث عن الاقتراح المطلوب
    const index = suggestions.findIndex(item => item.id === suggestionId);
    
    if (index !== -1) {
        // تحديث الاقتراح
        suggestions[index] = {
            ...suggestions[index],
            ...updates
        };
        
        // حفظ الاقتراحات المحدثة
        localStorage.setItem('4gamer_suggestions', JSON.stringify(suggestions));
        
        // تحديث الإحصائيات
        updateStatistics();
    }
}

/**
 * حذف الاقتراح الحالي المفتوح في النافذة المنبثقة
 */
function deleteCurrentSuggestion() {
    // الحصول على معرف الاقتراح الحالي
    const suggestionId = document.getElementById('suggestionDetailsModal').dataset.id;
    
    // تأكيد الحذف
    if (confirm('هل أنت متأكد من حذف هذا الاقتراح؟')) {
        // حذف الاقتراح
        deleteSuggestion(suggestionId);
        
        // إغلاق النافذة المنبثقة
        closeSuggestionDetails();
    }
}

/**
 * حذف اقتراح محدد
 * @param {string} suggestionId - معرف الاقتراح
 */
function deleteSuggestion(suggestionId) {
    // الحصول على الاقتراحات المخزنة
    let suggestions = getSuggestions();
    
    // حذف الاقتراح
    suggestions = suggestions.filter(item => item.id !== suggestionId);
    
    // حفظ الاقتراحات المحدثة
    localStorage.setItem('4gamer_suggestions', JSON.stringify(suggestions));
    
    // عرض رسالة نجاح
    showNotification('تم حذف الاقتراح بنجاح', 'success');
    
    // إعادة تحميل الاقتراحات
    loadSuggestions();
    
    // تحديث الإحصائيات
    updateStatistics();
}

/**
 * حذف الاقتراحات المحددة
 */
function deleteSelectedSuggestions() {
    // الحصول على مربعات الاختيار المحددة
    const checkboxes = document.querySelectorAll('.suggestion-checkbox:checked');
    
    if (checkboxes.length === 0) {
        return;
    }
    
    // تأكيد الحذف
    if (confirm(`هل أنت متأكد من حذف ${checkboxes.length} اقتراح محدد؟`)) {
        // الحصول على معرفات الاقتراحات المحددة
        const selectedIds = Array.from(checkboxes).map(checkbox => checkbox.dataset.id);
        
        // الحصول على الاقتراحات المخزنة
        let suggestions = getSuggestions();
        
        // حذف الاقتراحات المحددة
        suggestions = suggestions.filter(item => !selectedIds.includes(item.id));
        
        // حفظ الاقتراحات المحدثة
        localStorage.setItem('4gamer_suggestions', JSON.stringify(suggestions));
        
        // عرض رسالة نجاح
        showNotification(`تم حذف ${checkboxes.length} اقتراح بنجاح`, 'success');
        
        // إعادة تعيين مربع اختيار "تحديد الكل"
        document.getElementById('selectAllSuggestions').checked = false;
        
        // إعادة تحميل الاقتراحات
        loadSuggestions();
        
        // تحديث الإحصائيات
        updateStatistics();
    }
}

/**
 * تطبيق التصفية على الاقتراحات
 */
function applyFilters() {
    loadSuggestions();
}

/**
 * إعادة تعيين التصفية
 */
function resetFilters() {
    // إعادة تعيين حقول التصفية
    document.getElementById('filterStatus').value = 'all';
    document.getElementById('filterType').value = 'all';
    document.getElementById('filterDate').value = 'all';
    document.getElementById('searchSuggestion').value = '';
    
    // إعادة تحميل الاقتراحات
    loadSuggestions();
}

/**
 * تحديث الاقتراحات
 */
function refreshSuggestions() {
    loadSuggestions();
    showNotification('تم تحديث الاقتراحات بنجاح', 'success');
}

/**
 * تصدير الاقتراحات إلى ملف CSV
 */
function exportSuggestions() {
    // الحصول على الاقتراحات المصفاة
    const suggestions = filterSuggestions(getSuggestions());
    
    if (suggestions.length === 0) {
        showNotification('لا توجد اقتراحات للتصدير', 'error');
        return;
    }
    
    // إنشاء محتوى CSV
    let csvContent = 'العنوان,النوع,التاريخ,البريد الإلكتروني,الحالة,الوصف,الملاحظات\n';
    
    suggestions.forEach(suggestion => {
        // تنظيف النصوص من الفواصل
        const title = suggestion.title.replace(/,/g, ' ');
        const type = getContentTypeName(suggestion.contentType);
        const date = formatDate(suggestion.date);
        const email = suggestion.email.replace(/,/g, ' ');
        const status = suggestion.status;
        const description = suggestion.description.replace(/,/g, ' ').replace(/\n/g, ' ');
        const notes = (suggestion.notes || '').replace(/,/g, ' ').replace(/\n/g, ' ');
        
        // إضافة الصف إلى CSV
        csvContent += `"${title}","${type}","${date}","${email}","${status}","${description}","${notes}"\n`;
    });
    
    // إنشاء رابط التنزيل
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `اقتراحات_4gamer_${formatDateForFilename(new Date())}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('تم تصدير الاقتراحات بنجاح', 'success');
}

/**
 * تحديث إحصائيات الاقتراحات
 */
function updateStatistics() {
    // الحصول على الاقتراحات
    const suggestions = getSuggestions();
    
    // تحديث إجمالي الاقتراحات
    document.getElementById('totalSuggestions').textContent = suggestions.length;
    
    // تحديث عدد اقتراحات الألعاب
    const gameSuggestions = suggestions.filter(item => item.contentType === 'game').length;
    document.getElementById('gameSuggestions').textContent = gameSuggestions;
    
    // تحديث عدد اقتراحات الأدوات
    const toolSuggestions = suggestions.filter(item => item.contentType === 'tool').length;
    document.getElementById('toolSuggestions').textContent = toolSuggestions;
    
    // تحديث عدد اقتراحات الشروحات
    const tutorialSuggestions = suggestions.filter(item => item.contentType === 'tutorial').length;
    document.getElementById('tutorialSuggestions').textContent = tutorialSuggestions;
}

/**
 * تحديث عدد الإشعارات الجديدة
 */
function updateNotificationsCount() {
    // الحصول على الإشعارات
    const notifications = JSON.parse(localStorage.getItem('4gamer_admin_notifications')) || [];
    
    // حساب عدد الإشعارات غير المقروءة
    const unreadCount = notifications.filter(item => !item.read).length;
    
    // تحديث العداد
    const notificationsCount = document.getElementById('notificationsCount');
    notificationsCount.textContent = unreadCount;
    notificationsCount.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
    
    // تحديث قائمة الإشعارات
    updateNotificationsList(notifications);
}

/**
 * تحديث قائمة الإشعارات
 * @param {Array} notifications - قائمة الإشعارات
 */
function updateNotificationsList(notifications) {
    const notificationsList = document.getElementById('notificationsList');
    
    // مسح القائمة الحالية
    notificationsList.innerHTML = '';
    
    if (notifications.length === 0) {
        // عرض رسالة "لا توجد إشعارات"
        const emptyItem = document.createElement('div');
        emptyItem.className = 'notification-empty';
        emptyItem.innerHTML = `
            <i class="fas fa-bell-slash"></i>
            <p>لا توجد إشعارات</p>
        `;
        notificationsList.appendChild(emptyItem);
        return;
    }
    
    // إضافة الإشعارات إلى القائمة
    notifications.slice(0, 10).forEach(notification => {
        const item = document.createElement('div');
        item.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        item.dataset.id = notification.id;
        
        item.innerHTML = `
            <div class="notification-icon">
                <i class="${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-text">${notification.content}</div>
                <div class="notification-time">${formatTimeAgo(notification.date)}</div>
            </div>
            <button class="notification-mark-read" title="${notification.read ? 'تعيين كغير مقروء' : 'تعيين كمقروء'}">
                <i class="fas ${notification.read ? 'fa-envelope' : 'fa-envelope-open'}"></i>
            </button>
        `;
        
        // إضافة مستمع لتعيين الإشعار كمقروء/غير مقروء
        const markReadBtn = item.querySelector('.notification-mark-read');
        markReadBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            toggleNotificationReadStatus(notification.id);
        });
        
        // إضافة مستمع للنقر على الإشعار
        item.addEventListener('click', function() {
            handleNotificationClick(notification);
        });
        
        notificationsList.appendChild(item);
    });
}

/**
 * تبديل حالة قراءة الإشعار
 * @param {string} notificationId - معرف الإشعار
 */
function toggleNotificationReadStatus(notificationId) {
    // الحصول على الإشعارات
    let notifications = JSON.parse(localStorage.getItem('4gamer_admin_notifications')) || [];
    
    // البحث عن الإشعار
    const index = notifications.findIndex(item => item.id === notificationId);
    
    if (index !== -1) {
        // تبديل حالة القراءة
        notifications[index].read = !notifications[index].read;
        
        // حفظ الإشعارات المحدثة
        localStorage.setItem('4gamer_admin_notifications', JSON.stringify(notifications));
        
        // تحديث عدد الإشعارات
        updateNotificationsCount();
    }
}

/**
 * معالجة النقر على الإشعار
 * @param {Object} notification - الإشعار
 */
function handleNotificationClick(notification) {
    // تعيين الإشعار كمقروء
    if (!notification.read) {
        toggleNotificationReadStatus(notification.id);
    }
    
    // إذا كان الإشعار متعلقاً باقتراح، فتح تفاصيل الاقتراح
    if (notification.type === 'suggestion' && notification.suggestionId) {
        openSuggestionDetails(notification.suggestionId);
    }
    
    // إغلاق قائمة الإشعارات
    document.getElementById('notificationsDropdown').classList.remove('show');
}

/**
 * تعيين جميع الإشعارات كمقروءة
 */
function markAllNotificationsAsRead() {
    // الحصول على الإشعارات
    let notifications = JSON.parse(localStorage.getItem('4gamer_admin_notifications')) || [];
    
    // تعيين جميع الإشعارات كمقروءة
    notifications = notifications.map(notification => ({
        ...notification,
        read: true
    }));
    
    // حفظ الإشعارات المحدثة
    localStorage.setItem('4gamer_admin_notifications', JSON.stringify(notifications));
    
    // تحديث عدد الإشعارات
    updateNotificationsCount();
    
    showNotification('تم تعيين جميع الإشعارات كمقروءة', 'success');
}

/**
 * تبديل عرض قائمة الإشعارات
 */
function toggleNotificationsDropdown() {
    const dropdown = document.getElementById('notificationsDropdown');
    dropdown.classList.toggle('show');
    
    // إغلاق قائمة المستخدم إذا كانت مفتوحة
    document.getElementById('userDropdown').classList.remove('show');
}

/**
 * تبديل عرض قائمة المستخدم
 */
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
    
    // إغلاق قائمة الإشعارات إذا كانت مفتوحة
    document.getElementById('notificationsDropdown').classList.remove('show');
}

/**
 * معالجة تسجيل الخروج
 */
function handleLogout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        // تنفيذ عملية تسجيل الخروج
        window.location.href = 'index.html';
    }
}

/**
 * الحصول على اسم نوع المحتوى بالعربية
 * @param {string} type - رمز نوع المحتوى
 * @returns {string} - اسم نوع المحتوى بالعربية
 */
function getContentTypeName(type) {
    const types = {
        'game': 'لعبة',
        'tool': 'أداة',
        'tutorial': 'شرح',
        'other': 'آخر'
    };
    
    return types[type] || 'غير معروف';
}

/**
 * الحصول على اسم الحالة بالعربية
 * @param {string} status - رمز الحالة بالإنجليزية
 * @returns {string} - اسم الحالة بالعربية
 */
function getStatusArabicName(status) {
    const statuses = {
        'new': 'جديد',
        'in-progress': 'قيد المراجعة',
        'approved': 'تمت الموافقة',
        'rejected': 'مرفوض',
        'implemented': 'تم التنفيذ'
    };
    
    return statuses[status] || 'غير معروف';
}

/**
 * الحصول على اسم الحالة بالإنجليزية
 * @param {string} status - اسم الحالة بالعربية
 * @returns {string} - رمز الحالة بالإنجليزية
 */
function getStatusEnglishName(status) {
    const statuses = {
        'جديد': 'new',
        'قيد المراجعة': 'in-progress',
        'تمت الموافقة': 'approved',
        'مرفوض': 'rejected',
        'تم التنفيذ': 'implemented'
    };
    
    return statuses[status] || 'new';
}

/**
 * الحصول على فئة CSS للحالة
 * @param {string} status - اسم الحالة
 * @returns {string} - فئة CSS
 */
function getStatusClass(status) {
    const classes = {
        'جديد': 'new',
        'قيد المراجعة': 'in-progress',
        'تمت الموافقة': 'approved',
        'مرفوض': 'rejected',
        'تم التنفيذ': 'implemented'
    };
    
    return classes[status] || 'new';
}

/**
 * الحصول على أيقونة نوع الإشعار
 * @param {string} type - نوع الإشعار
 * @returns {string} - فئة الأيقونة
 */
function getNotificationIcon(type) {
    const icons = {
        'suggestion': 'fas fa-lightbulb',
        'system': 'fas fa-cog',
        'user': 'fas fa-user',
        'game': 'fas fa-gamepad'
    };
    
    return icons[type] || 'fas fa-bell';
}

/**
 * تنسيق التاريخ بصيغة مقروءة
 * @param {string} dateString - سلسلة التاريخ
 * @returns {string} - التاريخ المنسق
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * تنسيق التاريخ لاستخدامه في اسم الملف
 * @param {Date} date - كائن التاريخ
 * @returns {string} - التاريخ المنسق
 */
function formatDateForFilename(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * تنسيق الوقت المنقضي منذ تاريخ معين
 * @param {string} dateString - سلسلة التاريخ
 * @returns {string} - الوقت المنقضي
 */
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
        return 'منذ لحظات';
    } else if (diffMin < 60) {
        return `منذ ${diffMin} دقيقة`;
    } else if (diffHour < 24) {
        return `منذ ${diffHour} ساعة`;
    } else if (diffDay < 30) {
        return `منذ ${diffDay} يوم`;
    } else {
        return formatDate(dateString);
    }
}

/**
 * عرض إشعار للمستخدم
 * @param {string} message - نص الإشعار
 * @param {string} type - نوع الإشعار (success, error, info)
 */
function showNotification(message, type = 'info') {
    // التحقق من وجود عنصر الإشعارات
    let notificationContainer = document.querySelector('.admin-notification-container');
    
    // إنشاء حاوية الإشعارات إذا لم تكن موجودة
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'admin-notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-${type}`;
    notification.innerHTML = `
        <div class="admin-notification-content">
            <i class="admin-notification-icon ${getNotificationTypeIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="admin-notification-close">×</button>
    `;
    
    // إضافة الإشعار إلى الحاوية
    notificationContainer.appendChild(notification);
    
    // إضافة مستمع لزر الإغلاق
    const closeButton = notification.querySelector('.admin-notification-close');
    closeButton.addEventListener('click', function() {
        notification.classList.add('admin-notification-hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // إخفاء الإشعار تلقائياً بعد فترة
    setTimeout(() => {
        notification.classList.add('admin-notification-hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * الحصول على أيقونة نوع الإشعار
 * @param {string} type - نوع الإشعار
 * @returns {string} - فئة الأيقونة
 */
function getNotificationTypeIcon(type) {
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'info': 'fas fa-info-circle'
    };
    
    return icons[type] || 'fas fa-info-circle';
}
