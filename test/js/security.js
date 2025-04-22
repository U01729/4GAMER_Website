/**
 * 4GAMER Website - Security Features
 * ميزات الأمان لموقع 4GAMER
 */

// تهيئة ميزات الأمان عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة حماية النموذج
    initFormProtection();
    
    // تهيئة حماية الروابط
    initLinkProtection();
    
    // تهيئة مكافحة التتبع
    initAntiTracking();
    
    // تهيئة التحقق من الروابط الخارجية
    initExternalLinkCheck();
    
    // تهيئة تشفير البريد الإلكتروني
    initEmailEncryption();
});

// دالة تهيئة حماية النموذج
function initFormProtection() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // إضافة رمز CSRF
        const csrfToken = generateCSRFToken();
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrf_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
        
        // تعيين وقت انتهاء صلاحية النموذج
        const expiryInput = document.createElement('input');
        expiryInput.type = 'hidden';
        expiryInput.name = 'form_expiry';
        expiryInput.value = Date.now() + (30 * 60 * 1000); // 30 دقيقة
        form.appendChild(expiryInput);
        
        // إضافة مستمع لحدث الإرسال
        form.addEventListener('submit', function(e) {
            // التحقق من وقت انتهاء الصلاحية
            if (parseInt(expiryInput.value) < Date.now()) {
                e.preventDefault();
                alert('انتهت صلاحية النموذج. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
                return;
            }
            
            // التحقق من حقول النموذج
            const inputs = form.querySelectorAll('input, textarea, select');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.type !== 'hidden' && input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                }
                
                // تنظيف المدخلات
                if (input.type === 'text' || input.type === 'textarea') {
                    input.value = sanitizeInput(input.value);
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('يرجى ملء جميع الحقول المطلوبة.');
                return;
            }
        });
    });
}

// دالة تهيئة حماية الروابط
function initLinkProtection() {
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        // إضافة سمة rel="noopener noreferrer" للروابط الخارجية
        if (link.hostname !== window.location.hostname && link.hostname !== '') {
            link.setAttribute('rel', 'noopener noreferrer');
            
            // إضافة تأكيد للروابط الخارجية
            link.addEventListener('click', function(e) {
                // استثناء روابط التحميل المباشر
                if (link.classList.contains('goldhen-download-btn') || link.classList.contains('download-btn')) {
                    return;
                }
                
                const confirmMessage = 'أنت على وشك الانتقال إلى موقع خارجي. هل تريد المتابعة؟';
                if (!confirm(confirmMessage)) {
                    e.preventDefault();
                }
            });
        }
    });
}

// دالة تهيئة مكافحة التتبع
function initAntiTracking() {
    // إضافة سمة referrerpolicy="no-referrer" لعناصر الصور والنصوص
    const media = document.querySelectorAll('img, video, iframe');
    
    media.forEach(element => {
        element.setAttribute('referrerpolicy', 'no-referrer');
    });
    
    // إضافة سياسة الإحالة إلى رأس المستند
    const metaReferrer = document.createElement('meta');
    metaReferrer.name = 'referrer';
    metaReferrer.content = 'no-referrer-when-downgrade';
    document.head.appendChild(metaReferrer);
}

// دالة تهيئة التحقق من الروابط الخارجية
function initExternalLinkCheck() {
    // قائمة بالمجالات الموثوقة
    const trustedDomains = [
        'akirabox.com',
        't.me',
        'github.com',
        'github.io',
        'youtube.com',
        'youtu.be'
    ];
    
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
        const hostname = new URL(link.href).hostname;
        const domainParts = hostname.split('.');
        const domain = domainParts.length > 1 ? `${domainParts[domainParts.length - 2]}.${domainParts[domainParts.length - 1]}` : hostname;
        
        // إضافة فئة للروابط غير الموثوقة
        if (!trustedDomains.some(trustedDomain => domain.includes(trustedDomain))) {
            link.classList.add('untrusted-link');
            
            // إضافة أيقونة تحذير
            const warningIcon = document.createElement('i');
            warningIcon.className = 'fas fa-exclamation-triangle warning-icon';
            warningIcon.style.marginRight = '5px';
            warningIcon.style.color = '#e74c3c';
            link.insertBefore(warningIcon, link.firstChild);
            
            // إضافة تأكيد إضافي للروابط غير الموثوقة
            link.addEventListener('click', function(e) {
                const confirmMessage = 'تحذير: أنت على وشك الانتقال إلى موقع غير موثوق. هل أنت متأكد من أنك تريد المتابعة؟';
                if (!confirm(confirmMessage)) {
                    e.preventDefault();
                }
            });
        }
    });
}

// دالة تهيئة تشفير البريد الإلكتروني
function initEmailEncryption() {
    const emailElements = document.querySelectorAll('.email-protected');
    
    emailElements.forEach(element => {
        const encodedEmail = element.getAttribute('data-email');
        if (encodedEmail) {
            const decodedEmail = decodeEmail(encodedEmail);
            
            element.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = `mailto:${decodedEmail}`;
            });
            
            element.addEventListener('mouseenter', function() {
                element.setAttribute('title', decodedEmail);
            });
        }
    });
}

// دالة توليد رمز CSRF
function generateCSRFToken() {
    // توليد رمز عشوائي
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    
    for (let i = 0; i < 32; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // تخزين الرمز في sessionStorage
    sessionStorage.setItem('csrf_token', token);
    
    return token;
}

// دالة تنظيف المدخلات
function sanitizeInput(input) {
    // إزالة العلامات HTML
    let sanitized = input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // إزالة النصوص البرمجية
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+=/gi, '');
    
    return sanitized;
}

// دالة فك تشفير البريد الإلكتروني
function decodeEmail(encodedEmail) {
    // فك تشفير البريد الإلكتروني
    return atob(encodedEmail);
}

// دالة تشفير البريد الإلكتروني
function encodeEmail(email) {
    // تشفير البريد الإلكتروني
    return btoa(email);
}

// دالة التحقق من صحة البريد الإلكتروني
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// دالة التحقق من قوة كلمة المرور
function checkPasswordStrength(password) {
    let strength = 0;
    
    // التحقق من طول كلمة المرور
    if (password.length >= 8) {
        strength += 1;
    }
    
    // التحقق من وجود أحرف كبيرة
    if (/[A-Z]/.test(password)) {
        strength += 1;
    }
    
    // التحقق من وجود أحرف صغيرة
    if (/[a-z]/.test(password)) {
        strength += 1;
    }
    
    // التحقق من وجود أرقام
    if (/[0-9]/.test(password)) {
        strength += 1;
    }
    
    // التحقق من وجود رموز خاصة
    if (/[^A-Za-z0-9]/.test(password)) {
        strength += 1;
    }
    
    return strength;
}

// تصدير الدوال للاستخدام العام
window.validateEmail = validateEmail;
window.checkPasswordStrength = checkPasswordStrength;
window.encodeEmail = encodeEmail;
