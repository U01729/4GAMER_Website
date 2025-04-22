/**
 * 4GAMER Website - External Download Links Functionality
 * وظائف روابط التحميل الخارجية لموقع 4GAMER
 */

// تهيئة روابط التحميل عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    initExternalDownloadLinks();
    initAdSystem();
});

// دالة تهيئة روابط التحميل الخارجية
function initExternalDownloadLinks() {
    // تحديد جميع أزرار التحميل
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    // إضافة مستمع أحداث لكل زر تحميل
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // منع السلوك الافتراضي للرابط
            e.preventDefault();
            
            // الحصول على رابط التحميل من السمة data-download-url
            const downloadUrl = this.getAttribute('data-download-url');
            
            // التحقق من وجود رابط التحميل
            if (!downloadUrl) {
                console.error('رابط التحميل غير موجود');
                return;
            }
            
            // عرض الإعلان قبل التحميل (اختياري)
            if (Math.random() < 0.3) { // 30% فرصة لعرض الإعلان
                showAdPopup(downloadUrl);
            } else {
                // الانتقال مباشرة إلى رابط التحميل
                redirectToDownload(downloadUrl);
            }
        });
    });
}

// دالة الانتقال إلى رابط التحميل
function redirectToDownload(url) {
    // فتح الرابط في نافذة جديدة
    window.open(url, '_blank');
    
    // تسجيل إحصائيات التحميل (يمكن تنفيذها لاحقاً)
    logDownloadStats(url);
}

// دالة عرض الإعلان المنبثق قبل التحميل
function showAdPopup(downloadUrl) {
    // إنشاء عناصر الإعلان المنبثق
    const adPopupBackdrop = document.createElement('div');
    adPopupBackdrop.className = 'ad-popup-backdrop';
    
    const adPopup = document.createElement('div');
    adPopup.className = 'ad-popup';
    adPopup.innerHTML = `
        <div class="ad-close" id="ad-popup-close"><i class="fas fa-times"></i></div>
        <h3 class="ad-title">التحميل جاهز</h3>
        <div class="ad-in-content">
            <h4 class="ad-title">مساحة إعلانية</h4>
            <p class="ad-description">يمكن إضافة إعلانات ربحية هنا</p>
        </div>
        <p>سيبدأ التحميل تلقائياً خلال <span id="countdown">5</span> ثوانٍ</p>
        <button class="btn" id="download-now-btn">تحميل الآن</button>
    `;
    
    // إضافة العناصر إلى الصفحة
    document.body.appendChild(adPopupBackdrop);
    document.body.appendChild(adPopup);
    
    // تفعيل الإعلان المنبثق
    setTimeout(() => {
        adPopupBackdrop.classList.add('active');
        adPopup.classList.add('active');
    }, 100);
    
    // إضافة مستمع أحداث لزر الإغلاق
    const closeBtn = document.getElementById('ad-popup-close');
    closeBtn.addEventListener('click', function() {
        closeAdPopup();
    });
    
    // إضافة مستمع أحداث لزر التحميل الآن
    const downloadNowBtn = document.getElementById('download-now-btn');
    downloadNowBtn.addEventListener('click', function() {
        closeAdPopup();
        redirectToDownload(downloadUrl);
    });
    
    // إضافة مستمع أحداث للنقر خارج الإعلان المنبثق
    adPopupBackdrop.addEventListener('click', function() {
        closeAdPopup();
    });
    
    // بدء العد التنازلي
    let countdown = 5;
    const countdownElement = document.getElementById('countdown');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            closeAdPopup();
            redirectToDownload(downloadUrl);
        }
    }, 1000);
    
    // دالة إغلاق الإعلان المنبثق
    function closeAdPopup() {
        clearInterval(countdownInterval);
        adPopupBackdrop.classList.remove('active');
        adPopup.classList.remove('active');
        
        setTimeout(() => {
            document.body.removeChild(adPopupBackdrop);
            document.body.removeChild(adPopup);
        }, 300);
    }
}

// دالة تسجيل إحصائيات التحميل
function logDownloadStats(url) {
    // يمكن تنفيذ هذه الدالة لاحقاً لتسجيل إحصائيات التحميل
    console.log('تم النقر على رابط التحميل:', url);
}

// دالة تهيئة نظام الإعلانات
function initAdSystem() {
    // تحديد جميع أزرار إغلاق الإعلانات
    const adCloseButtons = document.querySelectorAll('.ad-close');
    
    // إضافة مستمع أحداث لكل زر إغلاق
    adCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            // الحصول على الإعلان الأب
            const ad = this.closest('.ad-container, .ad-sticky-bottom, .ad-popup');
            
            // إخفاء الإعلان
            if (ad) {
                ad.style.display = 'none';
            }
        });
    });
    
    // إنشاء الإعلان الثابت في الأسفل بعد فترة
    setTimeout(() => {
        createStickyAd();
    }, 5000); // 5 ثوانٍ
}

// دالة إنشاء الإعلان الثابت في الأسفل
function createStickyAd() {
    // التحقق من وجود الإعلان الثابت
    if (document.querySelector('.ad-sticky-bottom')) {
        return;
    }
    
    // إنشاء الإعلان الثابت
    const stickyAd = document.createElement('div');
    stickyAd.className = 'ad-sticky-bottom';
    stickyAd.innerHTML = `
        <div class="ad-close"><i class="fas fa-times"></i></div>
        <div class="ad-title">مساحة إعلانية</div>
    `;
    
    // إضافة الإعلان إلى الصفحة
    document.body.appendChild(stickyAd);
    
    // إضافة مستمع أحداث لزر الإغلاق
    const closeBtn = stickyAd.querySelector('.ad-close');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(stickyAd);
    });
}

// دالة إنشاء رابط تحميل خارجي
function createExternalDownloadLink(url, title, type, size) {
    // إنشاء عنصر div للرابط
    const linkContainer = document.createElement('div');
    linkContainer.className = 'download-link-container';
    
    // تحديد أيقونة النوع
    let typeIcon = 'fas fa-file';
    let typeText = 'ملف';
    
    switch (type.toLowerCase()) {
        case 'game':
            typeIcon = 'fas fa-gamepad';
            typeText = 'لعبة';
            break;
        case 'update':
            typeIcon = 'fas fa-sync-alt';
            typeText = 'تحديث';
            break;
        case 'dlc':
            typeIcon = 'fas fa-puzzle-piece';
            typeText = 'إضافة';
            break;
        case 'theme':
            typeIcon = 'fas fa-paint-brush';
            typeText = 'ثيم';
            break;
        case 'app':
            typeIcon = 'fas fa-mobile-alt';
            typeText = 'تطبيق';
            break;
        case 'jailbreak':
            typeIcon = 'fas fa-unlock-alt';
            typeText = 'جيلبريك';
            break;
    }
    
    // إنشاء محتوى الرابط
    linkContainer.innerHTML = `
        <div class="download-link-info">
            <div class="download-link-icon">
                <i class="${typeIcon}"></i>
            </div>
            <div class="download-link-details">
                <div class="download-link-title">${title}</div>
                <div class="download-link-meta">
                    <span class="download-link-type">${typeText}</span>
                    <span class="download-link-size">${size}</span>
                </div>
            </div>
        </div>
        <a href="${url}" class="download-btn" data-download-url="${url}">
            <i class="fas fa-download"></i> تحميل
        </a>
    `;
    
    return linkContainer;
}

// تصدير الدوال للاستخدام العام
window.createExternalDownloadLink = createExternalDownloadLink;
