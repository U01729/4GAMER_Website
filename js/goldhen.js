/**
 * 4GAMER Website - GOLDHEN Functionality
 * وظائف قسم GOLDHEN لموقع 4GAMER
 */

// تهيئة قسم GOLDHEN عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة الأسئلة الشائعة
    initFaqItems();
    
    // تهيئة أزرار التحميل
    initDownloadButtons();
    
    // تهيئة تحميل الصور الخارجية
    const externalImages = document.querySelectorAll('[data-external-image]');
    externalImages.forEach(imgContainer => {
        loadExternalImage(imgContainer);
    });
});

// دالة تهيئة الأسئلة الشائعة
function initFaqItems() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // إغلاق جميع الأسئلة الأخرى
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // تبديل حالة السؤال الحالي
            item.classList.toggle('active');
        });
    });
}

// دالة تهيئة أزرار التحميل
function initDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.goldhen-download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // الحصول على رابط التحميل
            const downloadUrl = this.getAttribute('href');
            
            // التحقق من وجود رابط التحميل
            if (!downloadUrl) {
                e.preventDefault();
                alert('رابط التحميل غير متوفر حالياً. يرجى المحاولة لاحقاً.');
                return;
            }
            
            // إظهار رسالة تأكيد التحميل
            const confirmMessage = 'جاري تحويلك إلى رابط التحميل...';
            console.log(confirmMessage);
            
            // يمكن إضافة تتبع التحميلات هنا إذا لزم الأمر
            trackDownload(this.getAttribute('data-version'), this.getAttribute('data-platform'));
        });
    });
}

// دالة تتبع التحميلات
function trackDownload(version, platform) {
    // هذه الدالة يمكن استخدامها لتتبع التحميلات
    // في الإصدار النهائي، يمكن إرسال بيانات التتبع إلى خدمة تحليلات
    console.log(`تم تحميل GOLDHEN الإصدار ${version} لمنصة ${platform}`);
}

// دالة التحقق من توافق الإصدار
function checkVersionCompatibility(firmwareVersion, platform) {
    // هذه الدالة تتحقق من توافق إصدار GOLDHEN مع إصدار نظام التشغيل
    // في الإصدار النهائي، يمكن استخدام بيانات حقيقية للتحقق من التوافق
    
    // بيانات التوافق الافتراضية
    const compatibilityData = {
        'ps4': {
            '9.00': ['2.3', '2.4'],
            '9.03': ['2.4'],
            '9.50': ['2.4', '2.5'],
            '9.60': ['2.5'],
            '10.00': ['2.5', '2.6'],
            '10.50': ['2.6']
        },
        'ps5': {
            '6.00': ['1.0'],
            '6.50': ['1.0', '1.1'],
            '7.00': ['1.1'],
            '7.50': ['1.1', '1.2'],
            '8.00': ['1.2']
        }
    };
    
    // التحقق من وجود بيانات التوافق للمنصة وإصدار النظام
    if (compatibilityData[platform] && compatibilityData[platform][firmwareVersion]) {
        return compatibilityData[platform][firmwareVersion];
    }
    
    // إذا لم يتم العثور على بيانات التوافق، يتم إرجاع مصفوفة فارغة
    return [];
}

// دالة الحصول على أحدث إصدار من GOLDHEN
function getLatestGoldhenVersion(platform) {
    // هذه الدالة تحصل على أحدث إصدار من GOLDHEN للمنصة المحددة
    // في الإصدار النهائي، يمكن استخدام بيانات حقيقية للحصول على أحدث إصدار
    
    // بيانات الإصدارات الافتراضية
    const latestVersions = {
        'ps4': '2.6',
        'ps5': '1.2'
    };
    
    // التحقق من وجود بيانات الإصدار للمنصة
    if (latestVersions[platform]) {
        return latestVersions[platform];
    }
    
    // إذا لم يتم العثور على بيانات الإصدار، يتم إرجاع قيمة افتراضية
    return 'غير معروف';
}

// دالة إنشاء بطاقة إصدار GOLDHEN
function createGoldhenCard(versionData) {
    // إنشاء عنصر div للبطاقة
    const card = document.createElement('div');
    card.className = 'goldhen-card';
    
    // إنشاء رأس البطاقة
    const header = document.createElement('div');
    header.className = 'goldhen-card-header';
    
    // إنشاء عنوان الإصدار
    const version = document.createElement('h3');
    version.className = 'goldhen-version';
    version.textContent = `GOLDHEN v${versionData.version}`;
    
    // إنشاء إصدار النظام
    const firmware = document.createElement('div');
    firmware.className = 'goldhen-firmware';
    firmware.textContent = `متوافق مع ${versionData.platform.toUpperCase()} ${versionData.firmware}`;
    
    header.appendChild(version);
    header.appendChild(firmware);
    
    // إنشاء محتوى البطاقة
    const body = document.createElement('div');
    body.className = 'goldhen-card-body';
    
    // إنشاء قائمة الميزات
    const features = document.createElement('div');
    features.className = 'goldhen-features';
    
    const featuresTitle = document.createElement('h4');
    featuresTitle.className = 'goldhen-features-title';
    featuresTitle.textContent = 'الميزات الرئيسية:';
    
    const featuresList = document.createElement('ul');
    featuresList.className = 'goldhen-features-list';
    
    versionData.features.forEach(feature => {
        const featureItem = document.createElement('li');
        featureItem.className = 'goldhen-feature-item';
        featureItem.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
        featuresList.appendChild(featureItem);
    });
    
    features.appendChild(featuresTitle);
    features.appendChild(featuresList);
    
    // إنشاء بيانات وصفية
    const meta = document.createElement('div');
    meta.className = 'goldhen-meta';
    
    // إنشاء تاريخ الإصدار
    const date = document.createElement('div');
    date.className = 'goldhen-meta-item';
    date.innerHTML = `<i class="far fa-calendar-alt"></i> ${versionData.date}`;
    
    // إنشاء حجم الملف
    const size = document.createElement('div');
    size.className = 'goldhen-meta-item';
    size.innerHTML = `<i class="fas fa-file-archive"></i> ${versionData.size}`;
    
    meta.appendChild(date);
    meta.appendChild(size);
    
    // إنشاء زر التحميل
    const downloadBtn = document.createElement('a');
    downloadBtn.className = 'goldhen-download-btn';
    downloadBtn.href = versionData.downloadUrl;
    downloadBtn.setAttribute('data-version', versionData.version);
    downloadBtn.setAttribute('data-platform', versionData.platform);
    downloadBtn.setAttribute('target', '_blank');
    downloadBtn.innerHTML = `تحميل <i class="fas fa-download"></i>`;
    
    // إضافة العناصر إلى محتوى البطاقة
    body.appendChild(features);
    body.appendChild(meta);
    body.appendChild(downloadBtn);
    
    // إضافة العناصر إلى البطاقة
    card.appendChild(header);
    card.appendChild(body);
    
    return card;
}

// تصدير الدوال للاستخدام العام
window.checkVersionCompatibility = checkVersionCompatibility;
window.getLatestGoldhenVersion = getLatestGoldhenVersion;
window.createGoldhenCard = createGoldhenCard;
