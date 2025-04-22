/**
 * 4GAMER - نظام معالجة نموذج اقتراح لعبة أو أداة
 * يتضمن التحقق من صحة النموذج، معالجة البيانات، وتخزينها محلياً
 */

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const suggestionForm = document.getElementById('suggestionForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (suggestionForm) {
        // إضافة مستمع لحدث تقديم النموذج
        suggestionForm.addEventListener('submit', handleFormSubmit);
        
        // إضافة مستمعات للتحقق من الحقول أثناء الكتابة
        const inputs = suggestionForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
    
    // التحقق من وجود اقتراحات سابقة وعرضها في قسم "اقتراحات شائعة"
    loadPopularSuggestions();
});

/**
 * معالجة تقديم النموذج
 * @param {Event} event - حدث تقديم النموذج
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // التحقق من صحة جميع الحقول
    const form = event.target;
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('يرجى التحقق من جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // إنشاء معرف فريد للاقتراح
    const suggestionId = generateUniqueId();
    
    // جمع بيانات النموذج
    const formData = {
        id: suggestionId,
        title: form.suggestionTitle.value,
        contentType: form.contentType.value,
        description: form.suggestionDescription.value,
        email: form.contactEmail.value || 'غير متوفر',
        date: new Date().toISOString(),
        status: 'جديد'
    };
    
    // حفظ البيانات
    saveSuggestion(formData);
    
    // إظهار رسالة النجاح
    form.style.display = 'none';
    const formSuccess = document.getElementById('formSuccess');
    formSuccess.style.display = 'block';
    
    // عرض الرقم المرجعي للاقتراح
    const suggestionReference = document.getElementById('suggestionReference');
    if (suggestionReference) {
        suggestionReference.textContent = suggestionId.substring(4, 12).toUpperCase();
    }
    
    // إظهار معلومات الإشعار بالبريد الإلكتروني إذا تم تقديم بريد إلكتروني
    const emailNotificationInfo = document.getElementById('emailNotificationInfo');
    if (emailNotificationInfo && form.contactEmail.value) {
        emailNotificationInfo.style.display = 'flex';
        
        // إرسال رسالة تأكيد بالبريد الإلكتروني
        sendEmailConfirmation(formData);
    }
    
    // إعادة تعيين النموذج
    form.reset();
    
    // عرض إشعار نجاح
    showNotification('تم إرسال اقتراحك بنجاح!', 'success');
}

/**
 * التحقق من صحة حقل معين
 * @param {HTMLElement} field - الحقل المراد التحقق منه
 * @returns {boolean} - نتيجة التحقق (صحيح/خاطئ)
 */
function validateField(field) {
    // إزالة رسائل الخطأ السابقة
    removeErrorMessage(field);
    
    // التحقق من الحقول المطلوبة
    if (field.hasAttribute('required') && !field.value.trim()) {
        showErrorMessage(field, 'هذا الحقل مطلوب');
        return false;
    }
    
    // التحقق من صحة البريد الإلكتروني
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showErrorMessage(field, 'يرجى إدخال بريد إلكتروني صحيح');
            return false;
        }
    }
    
    return true;
}

/**
 * عرض رسالة خطأ لحقل معين
 * @param {HTMLElement} field - الحقل المراد عرض الخطأ له
 * @param {string} message - نص رسالة الخطأ
 */
function showErrorMessage(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // إضافة الفئة للحقل لتمييزه كخاطئ
    field.classList.add('error-field');
    
    // إضافة رسالة الخطأ بعد الحقل
    field.parentNode.appendChild(errorElement);
}

/**
 * إزالة رسالة الخطأ من حقل معين
 * @param {HTMLElement} field - الحقل المراد إزالة الخطأ منه
 */
function removeErrorMessage(field) {
    // إزالة الفئة من الحقل
    field.classList.remove('error-field');
    
    // إزالة رسالة الخطأ إن وجدت
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * حفظ الاقتراح في التخزين المحلي
 * @param {Object} suggestion - بيانات الاقتراح
 */
function saveSuggestion(suggestion) {
    // الحصول على الاقتراحات المخزنة سابقاً
    let suggestions = JSON.parse(localStorage.getItem('4gamer_suggestions')) || [];
    
    // إضافة الاقتراح الجديد
    suggestions.push(suggestion);
    
    // حفظ الاقتراحات المحدثة
    localStorage.setItem('4gamer_suggestions', JSON.stringify(suggestions));
    
    // إرسال إشعار للمسؤولين (سيتم تنفيذه في نظام الإشعارات)
    notifyAdmins(suggestion);
    
    // تحديث الاقتراحات الشائعة
    updatePopularSuggestions(suggestion.contentType);
}

/**
 * إنشاء معرف فريد للاقتراح
 * @returns {string} - معرف فريد
 */
function generateUniqueId() {
    return 'sug_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * إرسال إشعار للمسؤولين بوجود اقتراح جديد
 * @param {Object} suggestion - بيانات الاقتراح
 */
function notifyAdmins(suggestion) {
    // الحصول على الإشعارات المخزنة سابقاً
    let notifications = JSON.parse(localStorage.getItem('4gamer_admin_notifications')) || [];
    
    // إنشاء إشعار جديد
    const notification = {
        id: 'notif_' + Date.now(),
        type: 'suggestion',
        title: 'اقتراح جديد: ' + suggestion.title,
        content: 'تم استلام اقتراح جديد من نوع: ' + getContentTypeName(suggestion.contentType),
        date: new Date().toISOString(),
        read: false,
        suggestionId: suggestion.id
    };
    
    // إضافة الإشعار الجديد
    notifications.unshift(notification);
    
    // حفظ الإشعارات المحدثة
    localStorage.setItem('4gamer_admin_notifications', JSON.stringify(notifications));
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
 * تحميل الاقتراحات الشائعة
 */
function loadPopularSuggestions() {
    const suggestionsList = document.querySelector('.suggestions-list');
    if (!suggestionsList) return;
    
    // الحصول على الاقتراحات المخزنة
    const suggestions = JSON.parse(localStorage.getItem('4gamer_suggestions')) || [];
    
    // إذا كان هناك اقتراحات كافية، نعرضها
    if (suggestions.length >= 4) {
        // تحديث عناصر الاقتراحات الشائعة
        updateSuggestionItems(suggestionsList, suggestions);
    }
}

/**
 * تحديث عناصر الاقتراحات الشائعة
 * @param {HTMLElement} container - حاوية عناصر الاقتراحات
 * @param {Array} suggestions - قائمة الاقتراحات
 */
function updateSuggestionItems(container, suggestions) {
    // تصنيف الاقتراحات حسب النوع
    const typeCount = {};
    suggestions.forEach(suggestion => {
        typeCount[suggestion.contentType] = (typeCount[suggestion.contentType] || 0) + 1;
    });
    
    // تحويل إلى مصفوفة للترتيب
    const sortedTypes = Object.keys(typeCount).map(type => ({
        type,
        count: typeCount[type]
    })).sort((a, b) => b.count - a.count);
    
    // تحديث العناصر
    const items = container.querySelectorAll('.suggestion-item');
    for (let i = 0; i < Math.min(items.length, sortedTypes.length); i++) {
        const item = items[i];
        const type = sortedTypes[i].type;
        
        // تحديث الأيقونة
        const icon = item.querySelector('i');
        if (icon) {
            icon.className = getTypeIcon(type);
        }
        
        // تحديث النص
        const span = item.querySelector('span');
        if (span) {
            span.textContent = getPopularSuggestionText(type);
        }
    }
}

/**
 * الحصول على أيقونة مناسبة لنوع المحتوى
 * @param {string} type - نوع المحتوى
 * @returns {string} - فئة الأيقونة
 */
function getTypeIcon(type) {
    const icons = {
        'game': 'fas fa-gamepad',
        'tool': 'fas fa-tools',
        'tutorial': 'fas fa-book-open',
        'other': 'fas fa-star'
    };
    
    return icons[type] || 'fas fa-lightbulb';
}

/**
 * الحصول على نص مناسب للاقتراح الشائع
 * @param {string} type - نوع المحتوى
 * @returns {string} - نص الاقتراح الشائع
 */
function getPopularSuggestionText(type) {
    const texts = {
        'game': 'ألعاب جديدة ومعربة',
        'tool': 'أدوات تحسين الأداء',
        'tutorial': 'شروحات تعريب الألعاب',
        'other': 'محتوى متنوع'
    };
    
    return texts[type] || 'اقتراحات متنوعة';
}

/**
 * تحديث الاقتراحات الشائعة بناءً على نوع المحتوى الجديد
 * @param {string} type - نوع المحتوى
 */
function updatePopularSuggestions(type) {
    // تحديث عداد الاقتراحات الشائعة
    let popularTypes = JSON.parse(localStorage.getItem('4gamer_popular_types')) || {};
    popularTypes[type] = (popularTypes[type] || 0) + 1;
    localStorage.setItem('4gamer_popular_types', JSON.stringify(popularTypes));
}

/**
 * إعادة تعيين النموذج وإخفاء رسالة النجاح
 */
function resetForm() {
    const suggestionForm = document.getElementById('suggestionForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (suggestionForm && formSuccess) {
        suggestionForm.reset();
        suggestionForm.style.display = 'flex';
        formSuccess.style.display = 'none';
    }
}

/**
 * عرض إشعار للمستخدم
 * @param {string} message - نص الإشعار
 * @param {string} type - نوع الإشعار (success, error, info)
 */
function showNotification(message, type = 'info') {
    // التحقق من وجود عنصر الإشعارات
    let notificationContainer = document.querySelector('.notification-container');
    
    // إنشاء حاوية الإشعارات إذا لم تكن موجودة
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">×</button>
    `;
    
    // إضافة الإشعار إلى الحاوية
    notificationContainer.appendChild(notification);
    
    // إضافة مستمع لزر الإغلاق
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.classList.add('notification-hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // إخفاء الإشعار تلقائياً بعد فترة
    setTimeout(() => {
        notification.classList.add('notification-hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * الحصول على أيقونة مناسبة لنوع الإشعار
 * @param {string} type - نوع الإشعار
 * @returns {string} - فئة الأيقونة
 */
function getNotificationIcon(type) {
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'info': 'fas fa-info-circle'
    };
    
    return icons[type] || 'fas fa-info-circle';
}

/**
 * إرسال رسالة تأكيد بالبريد الإلكتروني للمستخدم
 * @param {Object} suggestion - بيانات الاقتراح
 */
function sendEmailConfirmation(suggestion) {
    // في بيئة حقيقية، هنا سيتم استدعاء خدمة إرسال البريد الإلكتروني
    // مثل SendGrid أو Mailgun أو SMTP مباشر
    
    console.log('إرسال بريد إلكتروني تأكيد إلى:', suggestion.email);
    
    // تخزين سجل بالبريد الإلكتروني المرسل في التخزين المحلي للاختبار
    let emailLogs = JSON.parse(localStorage.getItem('4gamer_email_logs')) || [];
    
    const emailLog = {
        id: 'email_' + Date.now(),
        type: 'confirmation',
        recipient: suggestion.email,
        subject: 'تأكيد استلام اقتراحك - 4GAMER',
        suggestionId: suggestion.id,
        suggestionTitle: suggestion.title,
        date: new Date().toISOString(),
        status: 'sent'
    };
    
    emailLogs.push(emailLog);
    localStorage.setItem('4gamer_email_logs', JSON.stringify(emailLogs));
    
    // في بيئة الإنتاج، سيتم استبدال هذا بكود حقيقي لإرسال البريد الإلكتروني
    // مثال لمحتوى البريد الإلكتروني:
    /*
    const emailContent = `
    <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4ade80;">4GAMER</h1>
            <p style="color: #666;">منصة PlayStation العربية الأولى</p>
        </div>
        
        <h2 style="color: #333;">شكراً لاقتراحك!</h2>
        
        <p>مرحباً،</p>
        
        <p>نشكرك على اقتراحك: <strong>${suggestion.title}</strong></p>
        
        <p>لقد تم تسجيل اقتراحك برقم مرجعي: <strong>${suggestion.id.substring(4, 12).toUpperCase()}</strong></p>
        
        <p>سنقوم بمراجعة اقتراحك في أقرب وقت ممكن وسنعلمك بأي تحديثات.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">تفاصيل الاقتراح:</h3>
            <p><strong>العنوان:</strong> ${suggestion.title}</p>
            <p><strong>النوع:</strong> ${getContentTypeName(suggestion.contentType)}</p>
            <p><strong>تاريخ الاستلام:</strong> ${new Date(suggestion.date).toLocaleDateString('ar-SA')}</p>
        </div>
        
        <p>يمكنك الاطلاع على الاقتراحات المقبولة من خلال زيارة <a href="https://4gamer.com/accepted-suggestions.html" style="color: #4ade80; text-decoration: none;">صفحة الاقتراحات المقبولة</a>.</p>
        
        <p>شكراً لدعمك المستمر،<br>فريق 4GAMER</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; text-align: center;">
            <p>هذه رسالة آلية، يرجى عدم الرد عليها.</p>
            <p>إذا لم تكن قد أرسلت هذا الاقتراح، يرجى تجاهل هذه الرسالة.</p>
        </div>
    </div>
    `;
    */
}
