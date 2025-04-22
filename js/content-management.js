/**
 * 4GAMER Website - Content Management
 * إدارة المحتوى لموقع 4GAMER
 */

// تهيئة وظائف إدارة المحتوى عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نماذج إضافة المحتوى
    initContentForms();
    
    // تهيئة أزرار التحرير
    initEditButtons();
    
    // تهيئة وظائف الحفظ المحلي
    initLocalStorage();
});

// دالة تهيئة نماذج إضافة المحتوى
function initContentForms() {
    const contentForms = document.querySelectorAll('.content-form');
    
    contentForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // الحصول على نوع المحتوى
            const contentType = form.getAttribute('data-content-type');
            
            // جمع بيانات النموذج
            const formData = new FormData(form);
            const contentData = {};
            
            for (const [key, value] of formData.entries()) {
                contentData[key] = value;
            }
            
            // إضافة تاريخ الإنشاء
            contentData.createdAt = new Date().toISOString();
            
            // حفظ المحتوى
            saveContent(contentType, contentData);
            
            // إعادة تعيين النموذج
            form.reset();
            
            // تحديث عرض المحتوى
            updateContentDisplay(contentType);
            
            // إظهار رسالة نجاح
            showMessage('تم إضافة المحتوى بنجاح', 'success');
        });
    });
}

// دالة تهيئة أزرار التحرير
function initEditButtons() {
    document.addEventListener('click', function(e) {
        // التحقق من أن العنصر المنقر عليه هو زر تحرير
        if (e.target.classList.contains('edit-button') || e.target.closest('.edit-button')) {
            const button = e.target.classList.contains('edit-button') ? e.target : e.target.closest('.edit-button');
            const contentId = button.getAttribute('data-content-id');
            const contentType = button.getAttribute('data-content-type');
            
            // فتح نموذج التحرير
            openEditForm(contentType, contentId);
        }
        
        // التحقق من أن العنصر المنقر عليه هو زر حذف
        if (e.target.classList.contains('delete-button') || e.target.closest('.delete-button')) {
            const button = e.target.classList.contains('delete-button') ? e.target : e.target.closest('.delete-button');
            const contentId = button.getAttribute('data-content-id');
            const contentType = button.getAttribute('data-content-type');
            
            // تأكيد الحذف
            if (confirm('هل أنت متأكد من أنك تريد حذف هذا المحتوى؟')) {
                // حذف المحتوى
                deleteContent(contentType, contentId);
                
                // تحديث عرض المحتوى
                updateContentDisplay(contentType);
                
                // إظهار رسالة نجاح
                showMessage('تم حذف المحتوى بنجاح', 'success');
            }
        }
    });
}

// دالة تهيئة وظائف الحفظ المحلي
function initLocalStorage() {
    // التحقق من وجود بيانات المحتوى في التخزين المحلي
    if (!localStorage.getItem('4gamer_content')) {
        // إنشاء هيكل بيانات فارغ
        const initialData = {
            games: [],
            themes: [],
            apps: [],
            updates: [],
            tutorials: [],
            news: []
        };
        
        // حفظ هيكل البيانات في التخزين المحلي
        localStorage.setItem('4gamer_content', JSON.stringify(initialData));
    }
    
    // تحديث عرض المحتوى لجميع الأنواع
    updateAllContentDisplays();
}

// دالة حفظ المحتوى
function saveContent(contentType, contentData) {
    // الحصول على بيانات المحتوى الحالية
    const allContent = JSON.parse(localStorage.getItem('4gamer_content'));
    
    // التحقق من وجود معرف للمحتوى
    if (contentData.id) {
        // تحديث المحتوى الموجود
        const index = allContent[contentType].findIndex(item => item.id === contentData.id);
        
        if (index !== -1) {
            // الاحتفاظ بتاريخ الإنشاء
            const createdAt = allContent[contentType][index].createdAt;
            contentData.createdAt = createdAt;
            
            // إضافة تاريخ التحديث
            contentData.updatedAt = new Date().toISOString();
            
            // تحديث المحتوى
            allContent[contentType][index] = contentData;
        }
    } else {
        // إنشاء معرف فريد للمحتوى الجديد
        contentData.id = generateUniqueId();
        
        // إضافة المحتوى الجديد
        allContent[contentType].push(contentData);
    }
    
    // حفظ البيانات المحدثة
    localStorage.setItem('4gamer_content', JSON.stringify(allContent));
}

// دالة حذف المحتوى
function deleteContent(contentType, contentId) {
    // الحصول على بيانات المحتوى الحالية
    const allContent = JSON.parse(localStorage.getItem('4gamer_content'));
    
    // البحث عن المحتوى وحذفه
    const index = allContent[contentType].findIndex(item => item.id === contentId);
    
    if (index !== -1) {
        // حذف المحتوى
        allContent[contentType].splice(index, 1);
        
        // حفظ البيانات المحدثة
        localStorage.setItem('4gamer_content', JSON.stringify(allContent));
    }
}

// دالة فتح نموذج التحرير
function openEditForm(contentType, contentId) {
    // الحصول على بيانات المحتوى الحالية
    const allContent = JSON.parse(localStorage.getItem('4gamer_content'));
    
    // البحث عن المحتوى
    const content = allContent[contentType].find(item => item.id === contentId);
    
    if (content) {
        // البحث عن نموذج التحرير
        const editForm = document.querySelector(`.content-form[data-content-type="${contentType}"]`);
        
        if (editForm) {
            // ملء النموذج ببيانات المحتوى
            for (const key in content) {
                const input = editForm.querySelector(`[name="${key}"]`);
                
                if (input) {
                    input.value = content[key];
                }
            }
            
            // التمرير إلى النموذج
            editForm.scrollIntoView({ behavior: 'smooth' });
            
            // تغيير نص زر الإرسال
            const submitButton = editForm.querySelector('button[type="submit"]');
            
            if (submitButton) {
                submitButton.textContent = 'تحديث';
            }
            
            // إضافة زر إلغاء
            if (!editForm.querySelector('.cancel-button')) {
                const cancelButton = document.createElement('button');
                cancelButton.type = 'button';
                cancelButton.className = 'cancel-button';
                cancelButton.textContent = 'إلغاء';
                
                cancelButton.addEventListener('click', function() {
                    // إعادة تعيين النموذج
                    editForm.reset();
                    
                    // إعادة نص زر الإرسال
                    if (submitButton) {
                        submitButton.textContent = 'إضافة';
                    }
                    
                    // إزالة زر الإلغاء
                    this.remove();
                    
                    // إزالة معرف المحتوى
                    const idInput = editForm.querySelector('[name="id"]');
                    
                    if (idInput) {
                        idInput.value = '';
                    }
                });
                
                // إضافة زر الإلغاء بعد زر الإرسال
                submitButton.parentNode.insertBefore(cancelButton, submitButton.nextSibling);
            }
        }
    }
}

// دالة تحديث عرض المحتوى
function updateContentDisplay(contentType) {
    // الحصول على بيانات المحتوى الحالية
    const allContent = JSON.parse(localStorage.getItem('4gamer_content'));
    
    // البحث عن عنصر عرض المحتوى
    const contentDisplay = document.querySelector(`.content-display[data-content-type="${contentType}"]`);
    
    if (contentDisplay && allContent[contentType]) {
        // ترتيب المحتوى حسب تاريخ الإنشاء (الأحدث أولاً)
        const sortedContent = [...allContent[contentType]].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        // إنشاء HTML لعرض المحتوى
        let html = '';
        
        if (sortedContent.length === 0) {
            html = '<div class="no-content">لا يوجد محتوى</div>';
        } else {
            // إنشاء HTML لكل عنصر محتوى
            html = sortedContent.map(item => {
                return createContentItemHTML(contentType, item);
            }).join('');
        }
        
        // تحديث عنصر العرض
        contentDisplay.innerHTML = html;
    }
}

// دالة تحديث عرض جميع أنواع المحتوى
function updateAllContentDisplays() {
    // الحصول على بيانات المحتوى الحالية
    const allContent = JSON.parse(localStorage.getItem('4gamer_content'));
    
    // تحديث عرض كل نوع محتوى
    for (const contentType in allContent) {
        updateContentDisplay(contentType);
    }
}

// دالة إنشاء HTML لعنصر محتوى
function createContentItemHTML(contentType, item) {
    // إنشاء HTML مختلف حسب نوع المحتوى
    switch (contentType) {
        case 'games':
            return createGameItemHTML(item);
        case 'themes':
            return createThemeItemHTML(item);
        case 'apps':
            return createAppItemHTML(item);
        case 'updates':
            return createUpdateItemHTML(item);
        case 'tutorials':
            return createTutorialItemHTML(item);
        case 'news':
            return createNewsItemHTML(item);
        default:
            return '';
    }
}

// دالة إنشاء HTML لعنصر لعبة
function createGameItemHTML(game) {
    return `
        <div class="content-item game-item" data-id="${game.id}">
            <div class="content-item-image" data-external-image="${game.imageUrl}" data-alt="${game.title}"></div>
            <div class="content-item-details">
                <h3 class="content-item-title">${game.title}</h3>
                <div class="content-item-meta">
                    <span><i class="far fa-calendar-alt"></i> ${formatDate(game.releaseDate)}</span>
                    <span><i class="fas fa-hdd"></i> ${game.size}</span>
                </div>
                <p class="content-item-description">${game.description}</p>
                <div class="content-item-actions">
                    <a href="${game.downloadUrl}" class="download-btn" target="_blank">تحميل <i class="fas fa-download"></i></a>
                    <button class="edit-button" data-content-type="games" data-content-id="${game.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-button" data-content-type="games" data-content-id="${game.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `;
}

// دالة إنشاء HTML لعنصر ثيم
function createThemeItemHTML(theme) {
    return `
        <div class="content-item theme-item" data-id="${theme.id}">
            <div class="content-item-image" data-external-image="${theme.imageUrl}" data-alt="${theme.title}"></div>
            <div class="content-item-details">
                <h3 class="content-item-title">${theme.title}</h3>
                <div class="content-item-meta">
                    <span><i class="far fa-calendar-alt"></i> ${formatDate(theme.createdAt)}</span>
                </div>
                <p class="content-item-description">${theme.description}</p>
                <div class="content-item-actions">
                    <a href="${theme.downloadUrl}" class="download-btn" target="_blank">تحميل <i class="fas fa-download"></i></a>
                    <button class="edit-button" data-content-type="themes" data-content-id="${theme.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-button" data-content-type="themes" data-content-id="${theme.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `;
}

// دالة إنشاء HTML لعنصر تطبيق
function createAppItemHTML(app) {
    return `
        <div class="content-item app-item" data-id="${app.id}">
            <div class="content-item-image" data-external-image="${app.imageUrl}" data-alt="${app.title}"></div>
            <div class="content-item-details">
                <h3 class="content-item-title">${app.title}</h3>
                <div class="content-item-meta">
                    <span><i class="far fa-calendar-alt"></i> ${formatDate(app.createdAt)}</span>
                    <span><i class="fas fa-code-branch"></i> ${app.version}</span>
                </div>
                <p class="content-item-description">${app.description}</p>
                <div class="content-item-actions">
                    <a href="${app.downloadUrl}" class="download-btn" target="_blank">تحميل <i class="fas fa-download"></i></a>
                    <button class="edit-button" data-content-type="apps" data-content-id="${app.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-button" data-content-type="apps" data-content-id="${app.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `;
}

// دالة إنشاء HTML لعنصر تحديث
function createUpdateItemHTML(update) {
    return `
        <div class="content-item update-item" data-id="${update.id}">
            <div class="content-item-image" data-external-image="${update.imageUrl}" data-alt="${update.title}"></div>
            <div class="content-item-details">
                <h3 class="content-item-title">${update.title}</h3>
                <div class="content-item-meta">
                    <span><i class="far fa-calendar-alt"></i> ${formatDate(update.createdAt)}</span>
                    <span><i class="fas fa-code-branch"></i> ${update.version}</span>
                </div>
                <p class="content-item-description">${update.description}</p>
                <div class="content-item-actions">
                    <a href="${update.downloadUrl}" class="download-btn" target="_blank">تحميل <i class="fas fa-download"></i></a>
                    <button class="edit-button" data-content-type="updates" data-content-id="${update.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-button" data-content-type="updates" data-content-id="${update.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `;
}

// دالة إنشاء HTML لعنصر شرح
function createTutorialItemHTML(tutorial) {
    return `
        <div class="content-item tutorial-item" data-id="${tutorial.id}">
            <div class="content-item-video" data-video-id="${getYouTubeVideoId(tutorial.videoUrl)}"></div>
            <div class="content-item-details">
                <h3 class="content-item-title">${tutorial.title}</h3>
                <div class="content-item-meta">
                    <span><i class="far fa-calendar-alt"></i> ${formatDate(tutorial.createdAt)}</span>
                </div>
                <p class="content-item-description">${tutorial.description}</p>
                <div class="content-item-actions">
                    <button class="edit-button" data-content-type="tutorials" data-content-id="${tutorial.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-button" data-content-type="tutorials" data-content-id="${tutorial.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `;
}

// دالة إنشاء HTML لعنصر خبر
function createNewsItemHTML(news) {
    return `
        <div class="content-item news-item" data-id="${news.id}">
            <div class="content-item-image" data-external-image="${news.imageUrl}" data-alt="${news.title}"></div>
            <div class="content-item-details">
                <h3 class="content-item-title">${news.title}</h3>
                <div class="content-item-meta">
                    <span><i class="far fa-calendar-alt"></i> ${formatDate(news.createdAt)}</span>
                </div>
                <p class="content-item-description">${news.description}</p>
                <div class="content-item-actions">
                    <button class="edit-button" data-content-type="news" data-content-id="${news.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-button" data-content-type="news" data-content-id="${news.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `;
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

// دالة استخراج معرف فيديو يوتيوب
function getYouTubeVideoId(url) {
    if (!url) return '';
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : '';
}

// دالة إظهار رسالة
function showMessage(message, type = 'info') {
    // إنشاء عنصر الرسالة
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    
    // إضافة الرسالة إلى المستند
    document.body.appendChild(messageElement);
    
    // إظهار الرسالة
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10);
    
    // إخفاء الرسالة بعد 3 ثوانٍ
    setTimeout(() => {
        messageElement.classList.remove('show');
        
        // إزالة الرسالة من المستند بعد انتهاء الانتقال
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 3000);
}

// دالة تصدير البيانات
function exportData() {
    // الحصول على بيانات المحتوى الحالية
    const allContent = JSON.parse(localStorage.getItem('4gamer_content'));
    
    // تحويل البيانات إلى نص JSON
    const jsonData = JSON.stringify(allContent, null, 2);
    
    // إنشاء رابط تنزيل
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // إنشاء عنصر رابط وتنزيل الملف
    const a = document.createElement('a');
    a.href = url;
    a.download = '4gamer_content.json';
    document.body.appendChild(a);
    a.click();
    
    // تنظيف
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

// دالة استيراد البيانات
function importData(jsonFile) {
    // إنشاء قارئ ملفات
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            // تحليل البيانات
            const importedData = JSON.parse(e.target.result);
            
            // التحقق من صحة البيانات
            if (validateImportedData(importedData)) {
                // حفظ البيانات
                localStorage.setItem('4gamer_content', JSON.stringify(importedData));
                
                // تحديث عرض المحتوى
                updateAllContentDisplays();
                
                // إظهار رسالة نجاح
                showMessage('تم استيراد البيانات بنجاح', 'success');
            } else {
                // إظهار رسالة خطأ
                showMessage('تنسيق البيانات غير صحيح', 'error');
            }
        } catch (error) {
            // إظهار رسالة خطأ
            showMessage('حدث خطأ أثناء استيراد البيانات', 'error');
            console.error(error);
        }
    };
    
    reader.readAsText(jsonFile);
}

// دالة التحقق من صحة البيانات المستوردة
function validateImportedData(data) {
    // التحقق من وجود جميع أنواع المحتوى
    const requiredTypes = ['games', 'themes', 'apps', 'updates', 'tutorials', 'news'];
    
    for (const type of requiredTypes) {
        if (!data[type] || !Array.isArray(data[type])) {
            return false;
        }
    }
    
    return true;
}

// تصدير الدوال للاستخدام العام
window.exportData = exportData;
window.importData = importData;
window.updateContentDisplay = updateContentDisplay;
window.updateAllContentDisplays = updateAllContentDisplays;
