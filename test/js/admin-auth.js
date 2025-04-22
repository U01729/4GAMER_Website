/**
 * 4GAMER Website - Admin Authentication System
 * نظام مصادقة المسؤولين لموقع 4GAMER
 */

// تهيئة نظام المصادقة عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام المصادقة
    initAuthSystem();
    
    // التحقق من حالة تسجيل الدخول
    checkLoginStatus();
    
    // إعداد نموذج تسجيل الدخول
    setupLoginForm();
    
    // إعداد زر تسجيل الخروج
    setupLogoutButton();
    
    // إعداد نظام إدارة المستخدمين
    setupUserManagement();
});

// دالة تهيئة نظام المصادقة
function initAuthSystem() {
    // التحقق من وجود بيانات المستخدمين في التخزين المحلي
    if (!localStorage.getItem('4gamer_users')) {
        // إنشاء هيكل بيانات المستخدمين مع مستخدم افتراضي
        const initialUsers = [
            {
                id: 'admin1',
                username: 'admin',
                password: hashPassword('admin123'), // كلمة مرور افتراضية للتجربة فقط
                name: 'مدير الموقع',
                email: 'admin@4gamer.com',
                role: 'admin',
                createdAt: new Date().toISOString()
            }
        ];
        
        // حفظ بيانات المستخدمين في التخزين المحلي
        localStorage.setItem('4gamer_users', JSON.stringify(initialUsers));
    }
}

// دالة التحقق من حالة تسجيل الدخول
function checkLoginStatus() {
    // التحقق من وجود جلسة نشطة
    const session = getActiveSession();
    
    // التحقق من صفحات الإدارة
    const isAdminPage = window.location.pathname.includes('admin-');
    
    if (isAdminPage && !session) {
        // إعادة التوجيه إلى صفحة تسجيل الدخول إذا كانت الصفحة الحالية هي صفحة إدارة ولم يتم تسجيل الدخول
        if (!window.location.pathname.includes('admin-login.html')) {
            window.location.href = 'admin-login.html';
        }
    } else if (session) {
        // إظهار معلومات المستخدم إذا كان مسجل الدخول
        displayUserInfo(session.user);
    }
}

// دالة إعداد نموذج تسجيل الدخول
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // الحصول على بيانات تسجيل الدخول
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // التحقق من صحة بيانات تسجيل الدخول
            const loginResult = login(username, password);
            
            if (loginResult.success) {
                // إعادة التوجيه إلى لوحة الإدارة بعد تسجيل الدخول بنجاح
                window.location.href = 'admin-panel.html';
            } else {
                // عرض رسالة الخطأ
                const errorElement = document.getElementById('login-error');
                if (errorElement) {
                    errorElement.textContent = loginResult.message;
                    errorElement.style.display = 'block';
                } else {
                    alert(loginResult.message);
                }
            }
        });
    }
}

// دالة إعداد زر تسجيل الخروج
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // تسجيل الخروج
            logout();
            
            // إعادة التوجيه إلى الصفحة الرئيسية
            window.location.href = 'index.html';
        });
    }
}

// دالة إعداد نظام إدارة المستخدمين
function setupUserManagement() {
    // التحقق من وجود قسم إدارة المستخدمين
    const userManagementSection = document.getElementById('user-management');
    
    if (userManagementSection) {
        // عرض قائمة المستخدمين
        displayUsersList();
        
        // إعداد نموذج إضافة مستخدم جديد
        const addUserForm = document.getElementById('add-user-form');
        
        if (addUserForm) {
            addUserForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // جمع بيانات المستخدم الجديد
                const userData = {
                    username: document.getElementById('new-username').value,
                    password: document.getElementById('new-password').value,
                    name: document.getElementById('new-name').value,
                    email: document.getElementById('new-email').value,
                    role: document.getElementById('new-role').value
                };
                
                // إضافة المستخدم الجديد
                const result = addUser(userData);
                
                if (result.success) {
                    // إعادة تعيين النموذج
                    addUserForm.reset();
                    
                    // تحديث قائمة المستخدمين
                    displayUsersList();
                    
                    // عرض رسالة نجاح
                    alert(result.message);
                } else {
                    // عرض رسالة الخطأ
                    alert(result.message);
                }
            });
        }
    }
}

// دالة تسجيل الدخول
function login(username, password) {
    // الحصول على قائمة المستخدمين
    const users = JSON.parse(localStorage.getItem('4gamer_users'));
    
    // البحث عن المستخدم
    const user = users.find(u => u.username === username);
    
    if (!user) {
        return {
            success: false,
            message: 'اسم المستخدم غير موجود'
        };
    }
    
    // التحقق من كلمة المرور
    if (user.password !== hashPassword(password)) {
        return {
            success: false,
            message: 'كلمة المرور غير صحيحة'
        };
    }
    
    // إنشاء جلسة جديدة
    const session = {
        id: generateUniqueId(),
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
        },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // تنتهي الجلسة بعد 24 ساعة
    };
    
    // حفظ الجلسة في التخزين المحلي
    localStorage.setItem('4gamer_active_session', JSON.stringify(session));
    
    return {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: session.user
    };
}

// دالة تسجيل الخروج
function logout() {
    // حذف الجلسة النشطة
    localStorage.removeItem('4gamer_active_session');
}

// دالة الحصول على الجلسة النشطة
function getActiveSession() {
    // الحصول على الجلسة من التخزين المحلي
    const sessionData = localStorage.getItem('4gamer_active_session');
    
    if (!sessionData) {
        return null;
    }
    
    // تحويل بيانات الجلسة إلى كائن
    const session = JSON.parse(sessionData);
    
    // التحقق من صلاحية الجلسة
    if (new Date(session.expiresAt) < new Date()) {
        // حذف الجلسة منتهية الصلاحية
        localStorage.removeItem('4gamer_active_session');
        return null;
    }
    
    return session;
}

// دالة إضافة مستخدم جديد
function addUser(userData) {
    // التحقق من وجود اسم المستخدم
    if (!userData.username || userData.username.trim() === '') {
        return {
            success: false,
            message: 'يجب إدخال اسم المستخدم'
        };
    }
    
    // التحقق من وجود كلمة المرور
    if (!userData.password || userData.password.trim() === '') {
        return {
            success: false,
            message: 'يجب إدخال كلمة المرور'
        };
    }
    
    // الحصول على قائمة المستخدمين
    const users = JSON.parse(localStorage.getItem('4gamer_users'));
    
    // التحقق من عدم وجود مستخدم بنفس اسم المستخدم
    if (users.some(u => u.username === userData.username)) {
        return {
            success: false,
            message: 'اسم المستخدم موجود بالفعل'
        };
    }
    
    // إنشاء كائن المستخدم الجديد
    const newUser = {
        id: generateUniqueId(),
        username: userData.username,
        password: hashPassword(userData.password),
        name: userData.name || userData.username,
        email: userData.email || '',
        role: userData.role || 'editor',
        createdAt: new Date().toISOString()
    };
    
    // إضافة المستخدم الجديد إلى قائمة المستخدمين
    users.push(newUser);
    
    // حفظ قائمة المستخدمين المحدثة
    localStorage.setItem('4gamer_users', JSON.stringify(users));
    
    return {
        success: true,
        message: 'تم إضافة المستخدم بنجاح',
        user: {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            role: newUser.role
        }
    };
}

// دالة حذف مستخدم
function deleteUser(userId) {
    // الحصول على قائمة المستخدمين
    const users = JSON.parse(localStorage.getItem('4gamer_users'));
    
    // البحث عن المستخدم
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return {
            success: false,
            message: 'المستخدم غير موجود'
        };
    }
    
    // التحقق من عدم حذف المستخدم الوحيد بدور المدير
    if (users[userIndex].role === 'admin' && users.filter(u => u.role === 'admin').length === 1) {
        return {
            success: false,
            message: 'لا يمكن حذف المدير الوحيد'
        };
    }
    
    // حذف المستخدم
    users.splice(userIndex, 1);
    
    // حفظ قائمة المستخدمين المحدثة
    localStorage.setItem('4gamer_users', JSON.stringify(users));
    
    return {
        success: true,
        message: 'تم حذف المستخدم بنجاح'
    };
}

// دالة عرض معلومات المستخدم
function displayUserInfo(user) {
    // البحث عن عنصر اسم المستخدم
    const usernameElement = document.getElementById('admin-name');
    
    if (usernameElement && user) {
        usernameElement.textContent = user.name || user.username;
    }
}

// دالة عرض قائمة المستخدمين
function displayUsersList() {
    // البحث عن عنصر قائمة المستخدمين
    const usersListElement = document.getElementById('users-list');
    
    if (usersListElement) {
        // الحصول على قائمة المستخدمين
        const users = JSON.parse(localStorage.getItem('4gamer_users'));
        
        // إنشاء HTML لكل مستخدم
        let html = '';
        
        users.forEach(user => {
            html += `
                <tr data-user-id="${user.id}">
                    <td>${user.username}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${translateRole(user.role)}</td>
                    <td>${formatDate(user.createdAt)}</td>
                    <td class="actions">
                        <button class="edit-user-btn" data-user-id="${user.id}"><i class="fas fa-edit"></i></button>
                        <button class="delete-user-btn" data-user-id="${user.id}"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        
        // تحديث عنصر قائمة المستخدمين
        usersListElement.innerHTML = html;
        
        // إضافة مستمعي الأحداث لأزرار التحرير والحذف
        setupUserActionButtons();
    }
}

// دالة إعداد أزرار إجراءات المستخدمين
function setupUserActionButtons() {
    // أزرار تحرير المستخدمين
    const editButtons = document.querySelectorAll('.edit-user-btn');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            editUser(userId);
        });
    });
    
    // أزرار حذف المستخدمين
    const deleteButtons = document.querySelectorAll('.delete-user-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            
            if (confirm('هل أنت متأكد من أنك تريد حذف هذا المستخدم؟')) {
                const result = deleteUser(userId);
                
                if (result.success) {
                    // تحديث قائمة المستخدمين
                    displayUsersList();
                    
                    // عرض رسالة نجاح
                    alert(result.message);
                } else {
                    // عرض رسالة الخطأ
                    alert(result.message);
                }
            }
        });
    });
}

// دالة تحرير مستخدم
function editUser(userId) {
    // الحصول على قائمة المستخدمين
    const users = JSON.parse(localStorage.getItem('4gamer_users'));
    
    // البحث عن المستخدم
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        alert('المستخدم غير موجود');
        return;
    }
    
    // ملء نموذج تحرير المستخدم
    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-username').value = user.username;
    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-role').value = user.role;
    
    // عرض نموذج تحرير المستخدم
    document.getElementById('edit-user-modal').style.display = 'block';
}

// دالة تشفير كلمة المرور
function hashPassword(password) {
    // ملاحظة: هذه ليست طريقة آمنة لتشفير كلمات المرور في بيئة الإنتاج
    // في بيئة حقيقية، يجب استخدام خوارزميات تشفير قوية مثل bcrypt
    // هذه الدالة مبسطة للأغراض التعليمية فقط
    
    // تحويل كلمة المرور إلى سلسلة Base64
    return btoa(password);
}

// دالة ترجمة دور المستخدم
function translateRole(role) {
    switch (role) {
        case 'admin':
            return 'مدير';
        case 'editor':
            return 'محرر';
        case 'author':
            return 'كاتب';
        default:
            return role;
    }
}

// دالة توليد معرف فريد
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// دالة تنسيق التاريخ
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// تصدير الدوال للاستخدام العام
window.login = login;
window.logout = logout;
window.getActiveSession = getActiveSession;
window.addUser = addUser;
window.deleteUser = deleteUser;
window.checkLoginStatus = checkLoginStatus;
