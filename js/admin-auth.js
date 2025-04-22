// نظام المصادقة والصلاحيات لموقع 4GAMER
// تم التحديث: 22 أبريل 2025

// بيانات المستخدمين الافتراضية
const defaultUsers = [
    {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'المدير العام',
        active: true
    },
    {
        username: 'moderator',
        password: 'mod123',
        role: 'moderator',
        name: 'مشرف المحتوى',
        active: true
    }
];

// التحقق من وجود مستخدمين في التخزين المحلي
function initializeUsers() {
    if (!localStorage.getItem('4gamer_users')) {
        localStorage.setItem('4gamer_users', JSON.stringify(defaultUsers));
    }
}

// الحصول على قائمة المستخدمين
function getUsers() {
    initializeUsers();
    return JSON.parse(localStorage.getItem('4gamer_users'));
}

// إضافة مستخدم جديد
function addUser(username, password, role, name) {
    const users = getUsers();
    
    // التحقق من عدم وجود اسم مستخدم مكرر
    if (users.some(user => user.username === username)) {
        return {
            success: false,
            message: 'اسم المستخدم موجود بالفعل'
        };
    }
    
    // إضافة المستخدم الجديد
    users.push({
        username,
        password,
        role,
        name,
        active: true
    });
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_users', JSON.stringify(users));
    
    return {
        success: true,
        message: 'تمت إضافة المستخدم بنجاح'
    };
}

// تعديل بيانات مستخدم
function updateUser(username, updates) {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex === -1) {
        return {
            success: false,
            message: 'المستخدم غير موجود'
        };
    }
    
    // تحديث بيانات المستخدم
    users[userIndex] = { ...users[userIndex], ...updates };
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_users', JSON.stringify(users));
    
    return {
        success: true,
        message: 'تم تحديث بيانات المستخدم بنجاح'
    };
}

// حذف مستخدم
function deleteUser(username) {
    const users = getUsers();
    const filteredUsers = users.filter(user => user.username !== username);
    
    if (filteredUsers.length === users.length) {
        return {
            success: false,
            message: 'المستخدم غير موجود'
        };
    }
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_users', JSON.stringify(filteredUsers));
    
    return {
        success: true,
        message: 'تم حذف المستخدم بنجاح'
    };
}

// التحقق من صحة بيانات تسجيل الدخول
function authenticateUser(username, password) {
    const users = getUsers();
    const user = users.find(user => user.username === username && user.password === password && user.active);
    
    if (!user) {
        return {
            success: false,
            message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
        };
    }
    
    // إنشاء جلسة جديدة
    const session = {
        username: user.username,
        role: user.role,
        name: user.name,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // تنتهي الجلسة بعد 24 ساعة
    };
    
    // حفظ الجلسة في التخزين المحلي
    localStorage.setItem('4gamer_active_session', JSON.stringify(session));
    
    return {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: {
            username: user.username,
            role: user.role,
            name: user.name
        }
    };
}

// الحصول على الجلسة النشطة
function getActiveSession() {
    const sessionData = localStorage.getItem('4gamer_active_session');
    
    if (!sessionData) {
        return null;
    }
    
    const session = JSON.parse(sessionData);
    
    // التحقق من صلاحية الجلسة
    if (session.expiresAt < Date.now()) {
        // الجلسة منتهية، قم بحذفها
        localStorage.removeItem('4gamer_active_session');
        return null;
    }
    
    return session;
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('4gamer_active_session');
    return {
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
    };
}

// التحقق من صلاحيات المستخدم
function checkPermission(requiredRole) {
    const session = getActiveSession();
    
    if (!session) {
        return false;
    }
    
    // التحقق من الصلاحيات
    if (requiredRole === 'admin') {
        return session.role === 'admin';
    } else if (requiredRole === 'moderator') {
        return session.role === 'admin' || session.role === 'moderator';
    }
    
    return true;
}

// حماية صفحات الإدارة
function protectAdminPage() {
    const session = getActiveSession();
    
    if (!session) {
        // إعادة التوجيه إلى صفحة تسجيل الدخول
        window.location.href = 'admin-login.html';
        return false;
    }
    
    return true;
}

// تهيئة نموذج تسجيل الدخول
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من وجود نموذج تسجيل الدخول
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('login-error');
            
            // التحقق من صحة البيانات
            const result = authenticateUser(username, password);
            
            if (result.success) {
                // إعادة التوجيه إلى لوحة الإدارة
                window.location.href = 'admin-panel-enhanced.html';
            } else {
                // عرض رسالة الخطأ
                errorElement.textContent = result.message;
                errorElement.style.display = 'block';
            }
        });
    }
    
    // التحقق من حالة تسجيل الدخول في صفحة تسجيل الدخول
    if (window.location.pathname.includes('admin-login.html')) {
        const session = getActiveSession();
        
        if (session) {
            // إعادة التوجيه إلى لوحة الإدارة إذا كان المستخدم مسجل الدخول بالفعل
            window.location.href = 'admin-panel-enhanced.html';
        }
    }
    
    // حماية صفحات الإدارة
    if (window.location.pathname.includes('admin-panel') || 
        window.location.pathname.includes('admin-suggestions')) {
        protectAdminPage();
    }
    
    // إضافة زر تسجيل الخروج
    const logoutButton = document.getElementById('logout-button');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            logout();
            window.location.href = 'index.html';
        });
    }
    
    // عرض اسم المستخدم في لوحة الإدارة
    const userNameElement = document.getElementById('admin-user-name');
    
    if (userNameElement) {
        const session = getActiveSession();
        
        if (session) {
            userNameElement.textContent = session.name;
        }
    }
});

// تهيئة إدارة المستخدمين
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من وجود قسم إدارة المستخدمين
    const userManagementSection = document.getElementById('user-management-section');
    
    if (userManagementSection) {
        // عرض قائمة المستخدمين
        displayUsersList();
        
        // تهيئة نموذج إضافة مستخدم
        const addUserForm = document.getElementById('add-user-form');
        
        if (addUserForm) {
            addUserForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                const username = document.getElementById('new-username').value;
                const password = document.getElementById('new-password').value;
                const role = document.getElementById('new-role').value;
                const name = document.getElementById('new-name').value;
                
                // إضافة المستخدم الجديد
                const result = addUser(username, password, role, name);
                
                if (result.success) {
                    // إعادة عرض قائمة المستخدمين
                    displayUsersList();
                    
                    // إعادة تعيين النموذج
                    addUserForm.reset();
                    
                    // عرض رسالة نجاح
                    showNotification('تمت إضافة المستخدم بنجاح', 'success');
                } else {
                    // عرض رسالة خطأ
                    showNotification(result.message, 'error');
                }
            });
        }
    }
});

// عرض قائمة المستخدمين
function displayUsersList() {
    const usersListElement = document.getElementById('users-list');
    
    if (!usersListElement) {
        return;
    }
    
    const users = getUsers();
    
    // مسح القائمة الحالية
    usersListElement.innerHTML = '';
    
    // إضافة المستخدمين إلى القائمة
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        
        userItem.innerHTML = `
            <div class="user-info">
                <h3>${user.name}</h3>
                <p><strong>اسم المستخدم:</strong> ${user.username}</p>
                <p><strong>الدور:</strong> ${user.role === 'admin' ? 'مدير' : 'مشرف'}</p>
                <p><strong>الحالة:</strong> <span class="${user.active ? 'active-status' : 'inactive-status'}">${user.active ? 'نشط' : 'غير نشط'}</span></p>
            </div>
            <div class="user-actions">
                <button class="toggle-status-btn" data-username="${user.username}" data-active="${user.active}">
                    ${user.active ? 'تعطيل' : 'تفعيل'}
                </button>
                <button class="delete-user-btn" data-username="${user.username}">
                    حذف
                </button>
            </div>
        `;
        
        usersListElement.appendChild(userItem);
    });
    
    // إضافة مستمعي الأحداث للأزرار
    document.querySelectorAll('.toggle-status-btn').forEach(button => {
        button.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            const isActive = this.getAttribute('data-active') === 'true';
            
            // تغيير حالة المستخدم
            const result = updateUser(username, { active: !isActive });
            
            if (result.success) {
                // إعادة عرض قائمة المستخدمين
                displayUsersList();
                
                // عرض رسالة نجاح
                showNotification('تم تحديث حالة المستخدم بنجاح', 'success');
            } else {
                // عرض رسالة خطأ
                showNotification(result.message, 'error');
            }
        });
    });
    
    document.querySelectorAll('.delete-user-btn').forEach(button => {
        button.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            
            // التأكيد قبل الحذف
            if (confirm(`هل أنت متأكد من حذف المستخدم "${username}"؟`)) {
                // حذف المستخدم
                const result = deleteUser(username);
                
                if (result.success) {
                    // إعادة عرض قائمة المستخدمين
                    displayUsersList();
                    
                    // عرض رسالة نجاح
                    showNotification('تم حذف المستخدم بنجاح', 'success');
                } else {
                    // عرض رسالة خطأ
                    showNotification(result.message, 'error');
                }
            }
        });
    });
}

// عرض إشعار
function showNotification(message, type) {
    // التحقق من وجود عنصر الإشعارات
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        // إنشاء عنصر الإشعارات
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // إنشاء الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // إضافة الإشعار إلى الحاوية
    notificationContainer.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.classList.add('fade-out');
        
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// تهيئة المستخدمين عند تحميل الصفحة
initializeUsers();
