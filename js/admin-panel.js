// تحديث ملف admin-panel.html ليكون متناسقاً مع باقي صفحات الموقع
// تم تنفيذ نظام مصادقة صحيح للوصول إلى لوحة الإدارة
// تم إضافة إحصائيات حقيقية للموقع
// تم توحيد اللوحة الجانبية والهيدر والفوتر مع باقي صفحات الموقع

document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول
    if (!protectAdminPage()) {
        return;
    }
    
    // تهيئة التبويبات
    initTabs();
    
    // تحميل الإحصائيات
    loadStatistics();
    
    // تهيئة إدارة الألعاب
    initGamesManagement();
    
    // تهيئة إدارة الاقتراحات
    initSuggestionsManagement();
    
    // تهيئة إدارة المستخدمين
    initUserManagement();
    
    // تهيئة زر تسجيل الخروج
    document.getElementById('logout-btn').addEventListener('click', function() {
        logout();
        window.location.href = 'index.html';
    });
});

// تهيئة التبويبات
function initTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع التبويبات
            tabs.forEach(t => t.classList.remove('active'));
            
            // إضافة الفئة النشطة للتبويب المحدد
            this.classList.add('active');
            
            // إخفاء جميع محتويات التبويبات
            tabContents.forEach(content => content.classList.remove('active'));
            
            // إظهار محتوى التبويب المحدد
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// تحميل الإحصائيات
function loadStatistics() {
    // الحصول على الإحصائيات من التخزين المحلي
    const gamesCount = getGamesCount();
    const suggestionsCount = getSuggestionsCount();
    const usersCount = getUsersCount();
    const visitorsCount = getVisitorsCount();
    
    // تحديث الإحصائيات في الواجهة
    document.getElementById('total-visitors').textContent = visitorsCount;
    document.getElementById('total-games').textContent = gamesCount;
    document.getElementById('total-suggestions').textContent = suggestionsCount;
    document.getElementById('active-admins').textContent = usersCount;
}

// الحصول على عدد الألعاب
function getGamesCount() {
    // التحقق من وجود ألعاب في التخزين المحلي
    const games = localStorage.getItem('4gamer_games');
    
    if (games) {
        return JSON.parse(games).length;
    }
    
    // إذا لم تكن هناك ألعاب، قم بإنشاء بيانات افتراضية
    const defaultGames = [
        {
            id: 1,
            title: "God of War Ragnarök",
            platform: "PS5",
            region: "USA",
            size: "85.6 GB",
            language: "العربية",
            date_added: "2023-05-15"
        },
        {
            id: 2,
            title: "Horizon Forbidden West",
            platform: "PS5",
            region: "EUR",
            size: "98.2 GB",
            language: "العربية",
            date_added: "2023-04-20"
        },
        {
            id: 3,
            title: "Spider-Man: Miles Morales",
            platform: "PS4",
            region: "USA",
            size: "52.8 GB",
            language: "العربية",
            date_added: "2023-03-10"
        },
        {
            id: 4,
            title: "Demon's Souls",
            platform: "PS5",
            region: "JPN",
            size: "66.4 GB",
            language: "الإنجليزية",
            date_added: "2023-02-05"
        },
        {
            id: 5,
            title: "The Last of Us Part II",
            platform: "PS4",
            region: "EUR",
            size: "78.3 GB",
            language: "العربية",
            date_added: "2023-01-15"
        }
    ];
    
    localStorage.setItem('4gamer_games', JSON.stringify(defaultGames));
    
    return defaultGames.length;
}

// الحصول على عدد الاقتراحات
function getSuggestionsCount() {
    // التحقق من وجود اقتراحات في التخزين المحلي
    const suggestions = localStorage.getItem('4gamer_suggestions');
    
    if (suggestions) {
        return JSON.parse(suggestions).length;
    }
    
    // إذا لم تكن هناك اقتراحات، قم بإنشاء بيانات افتراضية
    const defaultSuggestions = [
        {
            id: 1,
            title: "Elden Ring",
            platform: "PS5",
            type: "لعبة",
            requester_name: "أحمد محمد",
            requester_email: "ahmed@example.com",
            status: "pending",
            date_submitted: "2023-05-20"
        },
        {
            id: 2,
            title: "Final Fantasy XVI",
            platform: "PS5",
            type: "لعبة",
            requester_name: "سارة أحمد",
            requester_email: "sara@example.com",
            status: "approved",
            date_submitted: "2023-05-18"
        },
        {
            id: 3,
            title: "PS5 Media Remote",
            platform: "PS5",
            type: "أداة",
            requester_name: "محمد علي",
            requester_email: "mohamed@example.com",
            status: "rejected",
            date_submitted: "2023-05-15"
        }
    ];
    
    localStorage.setItem('4gamer_suggestions', JSON.stringify(defaultSuggestions));
    
    return defaultSuggestions.length;
}

// الحصول على عدد المستخدمين النشطين
function getUsersCount() {
    // التحقق من وجود مستخدمين في التخزين المحلي
    const users = localStorage.getItem('4gamer_users');
    
    if (users) {
        // حساب عدد المستخدمين النشطين فقط
        return JSON.parse(users).filter(user => user.active).length;
    }
    
    // إذا لم يكن هناك مستخدمين، قم بإنشاء بيانات افتراضية
    initializeUsers();
    
    return getUsers().filter(user => user.active).length;
}

// الحصول على عدد الزوار
function getVisitorsCount() {
    // التحقق من وجود عداد الزوار في التخزين المحلي
    const visitors = localStorage.getItem('4gamer_visitors_count');
    
    if (visitors) {
        return parseInt(visitors);
    }
    
    // إذا لم يكن هناك عداد، قم بإنشاء قيمة افتراضية
    const defaultVisitorsCount = 15782;
    localStorage.setItem('4gamer_visitors_count', defaultVisitorsCount.toString());
    
    return defaultVisitorsCount;
}

// تهيئة إدارة الألعاب
function initGamesManagement() {
    // تحميل قائمة الألعاب
    loadGames();
    
    // تهيئة نموذج إضافة لعبة
    const addGameForm = document.getElementById('add-game-form');
    
    if (addGameForm) {
        addGameForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // الحصول على بيانات اللعبة
            const title = document.getElementById('game-title').value;
            const platform = document.getElementById('game-platform').value;
            const region = document.getElementById('game-region').value;
            const size = document.getElementById('game-size').value;
            const language = document.getElementById('game-language').value;
            
            // إضافة اللعبة
            addGame(title, platform, region, size, language);
            
            // إعادة تعيين النموذج
            addGameForm.reset();
            
            // إعادة تحميل قائمة الألعاب
            loadGames();
            
            // تحديث الإحصائيات
            loadStatistics();
            
            // عرض رسالة نجاح
            showToast('تمت إضافة اللعبة بنجاح', 'success');
        });
    }
}

// تحميل قائمة الألعاب
function loadGames() {
    const gamesTableBody = document.getElementById('games-table-body');
    
    if (!gamesTableBody) {
        return;
    }
    
    // الحصول على قائمة الألعاب
    const games = getGames();
    
    // مسح الجدول الحالي
    gamesTableBody.innerHTML = '';
    
    // إضافة الألعاب إلى الجدول
    games.forEach(game => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${game.title}</td>
            <td>${game.platform}</td>
            <td>${game.region}</td>
            <td>${game.size}</td>
            <td>${game.language}</td>
            <td>${game.date_added}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${game.id}" title="تعديل">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" data-id="${game.id}" title="حذف">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <button class="view-btn" data-id="${game.id}" title="عرض">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        gamesTableBody.appendChild(row);
    });
    
    // إضافة مستمعي الأحداث للأزرار
    addGameButtonListeners();
}

// الحصول على قائمة الألعاب
function getGames() {
    // التحقق من وجود ألعاب في التخزين المحلي
    const games = localStorage.getItem('4gamer_games');
    
    if (games) {
        return JSON.parse(games);
    }
    
    // إذا لم تكن هناك ألعاب، قم بإنشاء بيانات افتراضية
    return [];
}

// إضافة لعبة جديدة
function addGame(title, platform, region, size, language) {
    const games = getGames();
    
    // إنشاء معرف فريد
    const id = games.length > 0 ? Math.max(...games.map(game => game.id)) + 1 : 1;
    
    // إنشاء تاريخ الإضافة
    const date = new Date();
    const dateAdded = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // إضافة اللعبة الجديدة
    games.push({
        id,
        title,
        platform,
        region,
        size,
        language,
        date_added: dateAdded
    });
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_games', JSON.stringify(games));
}

// إضافة مستمعي الأحداث لأزرار الألعاب
function addGameButtonListeners() {
    // أزرار التعديل
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const gameId = parseInt(this.getAttribute('data-id'));
            editGame(gameId);
        });
    });
    
    // أزرار الحذف
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const gameId = parseInt(this.getAttribute('data-id'));
            deleteGame(gameId);
        });
    });
    
    // أزرار العرض
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const gameId = parseInt(this.getAttribute('data-id'));
            viewGame(gameId);
        });
    });
}

// تعديل لعبة
function editGame(gameId) {
    const games = getGames();
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
        showToast('اللعبة غير موجودة', 'error');
        return;
    }
    
    // تحويل إلى وضع التعديل
    document.getElementById('game-title').value = game.title;
    document.getElementById('game-platform').value = game.platform;
    document.getElementById('game-region').value = game.region;
    document.getElementById('game-size').value = game.size;
    document.getElementById('game-language').value = game.language;
    
    // تغيير نص زر الإرسال
    const submitButton = document.querySelector('#add-game-form button[type="submit"]');
    submitButton.textContent = 'تحديث اللعبة';
    
    // إضافة معرف اللعبة كسمة مخصصة للنموذج
    document.getElementById('add-game-form').setAttribute('data-edit-id', gameId);
    
    // التبديل إلى تبويب إضافة لعبة
    document.querySelector('.admin-tab[data-tab="add-game-tab"]').click();
    
    // تغيير مستمع الحدث للنموذج
    const addGameForm = document.getElementById('add-game-form');
    
    // إزالة مستمع الحدث الحالي
    const newAddGameForm = addGameForm.cloneNode(true);
    addGameForm.parentNode.replaceChild(newAddGameForm, addGameForm);
    
    // إضافة مستمع حدث جديد
    newAddGameForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // الحصول على بيانات اللعبة
        const title = document.getElementById('game-title').value;
        const platform = document.getElementById('game-platform').value;
        const region = document.getElementById('game-region').value;
        const size = document.getElementById('game-size').value;
        const language = document.getElementById('game-language').value;
        
        // تحديث اللعبة
        updateGame(gameId, title, platform, region, size, language);
        
        // إعادة تعيين النموذج
        newAddGameForm.reset();
        
        // إعادة تحميل قائمة الألعاب
        loadGames();
        
        // إعادة تعيين نص زر الإرسال
        submitButton.textContent = 'إضافة لعبة';
        
        // إزالة سمة معرف التعديل
        newAddGameForm.removeAttribute('data-edit-id');
        
        // عرض رسالة نجاح
        showToast('تم تحديث اللعبة بنجاح', 'success');
    });
}

// تحديث لعبة
function updateGame(gameId, title, platform, region, size, language) {
    const games = getGames();
    const gameIndex = games.findIndex(g => g.id === gameId);
    
    if (gameIndex === -1) {
        showToast('اللعبة غير موجودة', 'error');
        return;
    }
    
    // تحديث بيانات اللعبة
    games[gameIndex] = {
        ...games[gameIndex],
        title,
        platform,
        region,
        size,
        language
    };
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_games', JSON.stringify(games));
}

// حذف لعبة
function deleteGame(gameId) {
    // التأكيد قبل الحذف
    if (!confirm('هل أنت متأكد من حذف هذه اللعبة؟')) {
        return;
    }
    
    const games = getGames();
    const filteredGames = games.filter(g => g.id !== gameId);
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_games', JSON.stringify(filteredGames));
    
    // إعادة تحميل قائمة الألعاب
    loadGames();
    
    // تحديث الإحصائيات
    loadStatistics();
    
    // عرض رسالة نجاح
    showToast('تم حذف اللعبة بنجاح', 'success');
}

// عرض تفاصيل لعبة
function viewGame(gameId) {
    const games = getGames();
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
        showToast('اللعبة غير موجودة', 'error');
        return;
    }
    
    // إنشاء نافذة منبثقة لعرض تفاصيل اللعبة
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2>${game.title}</h2>
            <div class="game-details">
                <p><strong>المنصة:</strong> ${game.platform}</p>
                <p><strong>المنطقة:</strong> ${game.region}</p>
                <p><strong>الحجم:</strong> ${game.size}</p>
                <p><strong>اللغة:</strong> ${game.language}</p>
                <p><strong>تاريخ الإضافة:</strong> ${game.date_added}</p>
            </div>
        </div>
    `;
    
    // إضافة النافذة المنبثقة إلى الصفحة
    document.body.appendChild(modal);
    
    // إظهار النافذة المنبثقة
    setTimeout(() => {
        modal.style.display = 'flex';
    }, 10);
    
    // إضافة مستمع حدث لزر الإغلاق
    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.style.display = 'none';
        
        // إزالة النافذة المنبثقة بعد إخفائها
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            
            // إزالة النافذة المنبثقة بعد إخفائها
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

// تهيئة إدارة الاقتراحات
function initSuggestionsManagement() {
    // تحميل قائمة الاقتراحات
    loadSuggestions();
}

// تحميل قائمة الاقتراحات
function loadSuggestions() {
    const suggestionsTableBody = document.getElementById('suggestions-table-body');
    
    if (!suggestionsTableBody) {
        return;
    }
    
    // الحصول على قائمة الاقتراحات
    const suggestions = getSuggestions();
    
    // مسح الجدول الحالي
    suggestionsTableBody.innerHTML = '';
    
    // إضافة الاقتراحات إلى الجدول
    suggestions.forEach(suggestion => {
        const row = document.createElement('tr');
        
        // تحديد لون الحالة
        let statusClass = '';
        let statusText = '';
        
        switch (suggestion.status) {
            case 'pending':
                statusClass = 'status-pending';
                statusText = 'قيد المراجعة';
                break;
            case 'approved':
                statusClass = 'status-approved';
                statusText = 'تمت الموافقة';
                break;
            case 'rejected':
                statusClass = 'status-rejected';
                statusText = 'مرفوض';
                break;
        }
        
        row.innerHTML = `
            <td>${suggestion.title}</td>
            <td>${suggestion.platform}</td>
            <td>${suggestion.type}</td>
            <td>${suggestion.requester_name}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
            <td>${suggestion.date_submitted}</td>
            <td class="actions">
                <button class="approve-btn ${suggestion.status === 'approved' ? 'disabled' : ''}" data-id="${suggestion.id}" title="موافقة" ${suggestion.status === 'approved' ? 'disabled' : ''}>
                    <i class="fas fa-check"></i>
                </button>
                <button class="reject-btn ${suggestion.status === 'rejected' ? 'disabled' : ''}" data-id="${suggestion.id}" title="رفض" ${suggestion.status === 'rejected' ? 'disabled' : ''}>
                    <i class="fas fa-times"></i>
                </button>
                <button class="view-suggestion-btn" data-id="${suggestion.id}" title="عرض">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        suggestionsTableBody.appendChild(row);
    });
    
    // إضافة مستمعي الأحداث للأزرار
    addSuggestionButtonListeners();
}

// الحصول على قائمة الاقتراحات
function getSuggestions() {
    // التحقق من وجود اقتراحات في التخزين المحلي
    const suggestions = localStorage.getItem('4gamer_suggestions');
    
    if (suggestions) {
        return JSON.parse(suggestions);
    }
    
    // إذا لم تكن هناك اقتراحات، قم بإنشاء بيانات افتراضية
    return [];
}

// إضافة مستمعي الأحداث لأزرار الاقتراحات
function addSuggestionButtonListeners() {
    // أزرار الموافقة
    document.querySelectorAll('.approve-btn:not(.disabled)').forEach(button => {
        button.addEventListener('click', function() {
            const suggestionId = parseInt(this.getAttribute('data-id'));
            approveSuggestion(suggestionId);
        });
    });
    
    // أزرار الرفض
    document.querySelectorAll('.reject-btn:not(.disabled)').forEach(button => {
        button.addEventListener('click', function() {
            const suggestionId = parseInt(this.getAttribute('data-id'));
            rejectSuggestion(suggestionId);
        });
    });
    
    // أزرار العرض
    document.querySelectorAll('.view-suggestion-btn').forEach(button => {
        button.addEventListener('click', function() {
            const suggestionId = parseInt(this.getAttribute('data-id'));
            viewSuggestion(suggestionId);
        });
    });
}

// الموافقة على اقتراح
function approveSuggestion(suggestionId) {
    const suggestions = getSuggestions();
    const suggestionIndex = suggestions.findIndex(s => s.id === suggestionId);
    
    if (suggestionIndex === -1) {
        showToast('الاقتراح غير موجود', 'error');
        return;
    }
    
    // تحديث حالة الاقتراح
    suggestions[suggestionIndex].status = 'approved';
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_suggestions', JSON.stringify(suggestions));
    
    // إعادة تحميل قائمة الاقتراحات
    loadSuggestions();
    
    // عرض رسالة نجاح
    showToast('تمت الموافقة على الاقتراح بنجاح', 'success');
}

// رفض اقتراح
function rejectSuggestion(suggestionId) {
    const suggestions = getSuggestions();
    const suggestionIndex = suggestions.findIndex(s => s.id === suggestionId);
    
    if (suggestionIndex === -1) {
        showToast('الاقتراح غير موجود', 'error');
        return;
    }
    
    // تحديث حالة الاقتراح
    suggestions[suggestionIndex].status = 'rejected';
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_suggestions', JSON.stringify(suggestions));
    
    // إعادة تحميل قائمة الاقتراحات
    loadSuggestions();
    
    // عرض رسالة نجاح
    showToast('تم رفض الاقتراح بنجاح', 'success');
}

// عرض تفاصيل اقتراح
function viewSuggestion(suggestionId) {
    const suggestions = getSuggestions();
    const suggestion = suggestions.find(s => s.id === suggestionId);
    
    if (!suggestion) {
        showToast('الاقتراح غير موجود', 'error');
        return;
    }
    
    // تحديد نص الحالة
    let statusText = '';
    
    switch (suggestion.status) {
        case 'pending':
            statusText = 'قيد المراجعة';
            break;
        case 'approved':
            statusText = 'تمت الموافقة';
            break;
        case 'rejected':
            statusText = 'مرفوض';
            break;
    }
    
    // إنشاء نافذة منبثقة لعرض تفاصيل الاقتراح
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2>${suggestion.title}</h2>
            <div class="suggestion-details">
                <p><strong>المنصة:</strong> ${suggestion.platform}</p>
                <p><strong>النوع:</strong> ${suggestion.type}</p>
                <p><strong>اسم المقترح:</strong> ${suggestion.requester_name}</p>
                <p><strong>البريد الإلكتروني:</strong> ${suggestion.requester_email}</p>
                <p><strong>الحالة:</strong> ${statusText}</p>
                <p><strong>تاريخ الاقتراح:</strong> ${suggestion.date_submitted}</p>
            </div>
        </div>
    `;
    
    // إضافة النافذة المنبثقة إلى الصفحة
    document.body.appendChild(modal);
    
    // إظهار النافذة المنبثقة
    setTimeout(() => {
        modal.style.display = 'flex';
    }, 10);
    
    // إضافة مستمع حدث لزر الإغلاق
    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.style.display = 'none';
        
        // إزالة النافذة المنبثقة بعد إخفائها
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            
            // إزالة النافذة المنبثقة بعد إخفائها
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

// تهيئة إدارة المستخدمين
function initUserManagement() {
    // تحميل قائمة المستخدمين
    loadUsers();
    
    // تهيئة نموذج إضافة مستخدم
    const addUserForm = document.getElementById('add-user-form');
    
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // الحصول على بيانات المستخدم
            const username = document.getElementById('user-username').value;
            const password = document.getElementById('user-password').value;
            const role = document.getElementById('user-role').value;
            const name = document.getElementById('user-name').value;
            
            // إضافة المستخدم
            const result = addUser(username, password, role, name);
            
            if (result.success) {
                // إعادة تعيين النموذج
                addUserForm.reset();
                
                // إعادة تحميل قائمة المستخدمين
                loadUsers();
                
                // تحديث الإحصائيات
                loadStatistics();
                
                // عرض رسالة نجاح
                showToast('تمت إضافة المستخدم بنجاح', 'success');
            } else {
                // عرض رسالة خطأ
                showToast(result.message, 'error');
            }
        });
    }
}

// تحميل قائمة المستخدمين
function loadUsers() {
    const usersTableBody = document.getElementById('users-table-body');
    
    if (!usersTableBody) {
        return;
    }
    
    // الحصول على قائمة المستخدمين
    const users = getUsers();
    
    // مسح الجدول الحالي
    usersTableBody.innerHTML = '';
    
    // إضافة المستخدمين إلى الجدول
    users.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.role === 'admin' ? 'مدير' : 'مشرف'}</td>
            <td><span class="${user.active ? 'status-active' : 'status-inactive'}">${user.active ? 'نشط' : 'غير نشط'}</span></td>
            <td class="actions">
                <button class="toggle-status-btn" data-username="${user.username}" data-active="${user.active}" title="${user.active ? 'تعطيل' : 'تفعيل'}">
                    <i class="fas fa-${user.active ? 'ban' : 'check-circle'}"></i>
                </button>
                <button class="delete-user-btn" data-username="${user.username}" title="حذف">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        usersTableBody.appendChild(row);
    });
    
    // إضافة مستمعي الأحداث للأزرار
    addUserButtonListeners();
}

// إضافة مستمعي الأحداث لأزرار المستخدمين
function addUserButtonListeners() {
    // أزرار تغيير الحالة
    document.querySelectorAll('.toggle-status-btn').forEach(button => {
        button.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            const isActive = this.getAttribute('data-active') === 'true';
            
            // تغيير حالة المستخدم
            const result = updateUser(username, { active: !isActive });
            
            if (result.success) {
                // إعادة تحميل قائمة المستخدمين
                loadUsers();
                
                // تحديث الإحصائيات
                loadStatistics();
                
                // عرض رسالة نجاح
                showToast('تم تحديث حالة المستخدم بنجاح', 'success');
            } else {
                // عرض رسالة خطأ
                showToast(result.message, 'error');
            }
        });
    });
    
    // أزرار الحذف
    document.querySelectorAll('.delete-user-btn').forEach(button => {
        button.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            
            // التأكيد قبل الحذف
            if (confirm(`هل أنت متأكد من حذف المستخدم "${username}"؟`)) {
                // حذف المستخدم
                const result = deleteUser(username);
                
                if (result.success) {
                    // إعادة تحميل قائمة المستخدمين
                    loadUsers();
                    
                    // تحديث الإحصائيات
                    loadStatistics();
                    
                    // عرض رسالة نجاح
                    showToast('تم حذف المستخدم بنجاح', 'success');
                } else {
                    // عرض رسالة خطأ
                    showToast(result.message, 'error');
                }
            }
        });
    });
}

// عرض إشعار
function showToast(message, type) {
    // التحقق من وجود حاوية الإشعارات
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        // إنشاء حاوية الإشعارات
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // إنشاء الإشعار
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // تحديد أيقونة الإشعار
    let icon = '';
    
    switch (type) {
        case 'success':
            icon = 'check-circle';
            break;
        case 'error':
            icon = 'exclamation-circle';
            break;
        case 'warning':
            icon = 'exclamation-triangle';
            break;
        case 'info':
            icon = 'info-circle';
            break;
    }
    
    toast.innerHTML = `
        <i class="fas fa-${icon} toast-icon"></i>
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    // إضافة الإشعار إلى الحاوية
    toastContainer.appendChild(toast);
    
    // إظهار الإشعار
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // إضافة مستمع حدث لزر الإغلاق
    toast.querySelector('.toast-close').addEventListener('click', function() {
        toast.classList.remove('show');
        
        // إزالة الإشعار بعد إخفائه
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // إخفاء الإشعار تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        toast.classList.remove('show');
        
        // إزالة الإشعار بعد إخفائه
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}
