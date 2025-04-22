/**
 * 4GAMER Website - External Image Loading Functionality
 * وظائف تحميل الصور الخارجية لموقع 4GAMER
 */

// تهيئة نظام تحميل الصور الخارجية عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    initExternalImageLoading();
});

// دالة تهيئة نظام تحميل الصور الخارجية
function initExternalImageLoading() {
    // تحديد جميع عناصر الصور التي تحتاج إلى تحميل من مصادر خارجية
    const externalImages = document.querySelectorAll('[data-external-image]');
    
    // تحميل الصور من المصادر الخارجية
    externalImages.forEach(imgContainer => {
        loadExternalImage(imgContainer);
    });
    
    // إضافة مستمع أحداث للنقر على الصور لعرضها بحجم كامل
    const gameImages = document.querySelectorAll('.game-img, .theme-img, .app-img');
    gameImages.forEach(img => {
        img.addEventListener('click', function() {
            if (this.dataset.fullImage) {
                showFullImage(this.dataset.fullImage, this.alt);
            }
        });
    });
}

// دالة تحميل الصورة من مصدر خارجي
function loadExternalImage(imgContainer) {
    // الحصول على رابط الصورة الخارجية
    const imageUrl = imgContainer.getAttribute('data-external-image');
    
    // الحصول على النص البديل للصورة
    const altText = imgContainer.getAttribute('data-alt') || 'صورة';
    
    // الحصول على رابط الصورة بحجم كامل (إن وجد)
    const fullImageUrl = imgContainer.getAttribute('data-full-image') || imageUrl;
    
    // التحقق من وجود رابط الصورة
    if (!imageUrl) {
        console.error('رابط الصورة غير موجود');
        return;
    }
    
    // إنشاء عنصر الصورة
    const img = document.createElement('img');
    img.alt = altText;
    
    // إضافة سمة data-full-image للصورة
    img.dataset.fullImage = fullImageUrl;
    
    // إضافة فئة CSS للصورة بناءً على نوع الحاوية
    if (imgContainer.classList.contains('game-card')) {
        img.className = 'game-img';
    } else if (imgContainer.classList.contains('theme-card')) {
        img.className = 'theme-img';
    } else if (imgContainer.classList.contains('app-card')) {
        img.className = 'app-img';
    } else if (imgContainer.classList.contains('news-img-container')) {
        img.className = 'news-img';
    } else {
        img.className = 'external-img';
    }
    
    // إضافة مستمع أحداث لتحميل الصورة
    img.addEventListener('load', function() {
        // إزالة فئة CSS للتحميل
        imgContainer.classList.remove('loading');
        
        // إضافة فئة CSS للصورة المحملة
        imgContainer.classList.add('loaded');
    });
    
    // إضافة مستمع أحداث لخطأ تحميل الصورة
    img.addEventListener('error', function() {
        // إزالة فئة CSS للتحميل
        imgContainer.classList.remove('loading');
        
        // إضافة فئة CSS لخطأ التحميل
        imgContainer.classList.add('error');
        
        // إضافة رسالة خطأ
        const errorMsg = document.createElement('div');
        errorMsg.className = 'image-error';
        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> تعذر تحميل الصورة';
        
        // إضافة رسالة الخطأ إلى الحاوية
        imgContainer.appendChild(errorMsg);
    });
    
    // تعيين مصدر الصورة
    img.src = imageUrl;
    
    // إضافة فئة CSS للتحميل
    imgContainer.classList.add('loading');
    
    // إضافة الصورة إلى الحاوية
    imgContainer.appendChild(img);
}

// دالة عرض الصورة بحجم كامل
function showFullImage(imageUrl, altText) {
    // إنشاء عناصر عرض الصورة بحجم كامل
    const fullImageBackdrop = document.createElement('div');
    fullImageBackdrop.className = 'full-image-backdrop';
    
    const fullImageContainer = document.createElement('div');
    fullImageContainer.className = 'full-image-container';
    
    // إنشاء عنصر الصورة
    const img = document.createElement('img');
    img.className = 'full-image';
    img.src = imageUrl;
    img.alt = altText || 'صورة بحجم كامل';
    
    // إنشاء زر الإغلاق
    const closeBtn = document.createElement('button');
    closeBtn.className = 'full-image-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    // إضافة العناصر إلى الصفحة
    fullImageContainer.appendChild(img);
    fullImageContainer.appendChild(closeBtn);
    document.body.appendChild(fullImageBackdrop);
    document.body.appendChild(fullImageContainer);
    
    // تفعيل عرض الصورة بحجم كامل
    setTimeout(() => {
        fullImageBackdrop.classList.add('active');
        fullImageContainer.classList.add('active');
    }, 10);
    
    // إضافة مستمع أحداث لزر الإغلاق
    closeBtn.addEventListener('click', closeFullImage);
    
    // إضافة مستمع أحداث للنقر خارج الصورة
    fullImageBackdrop.addEventListener('click', closeFullImage);
    
    // دالة إغلاق عرض الصورة بحجم كامل
    function closeFullImage() {
        fullImageBackdrop.classList.remove('active');
        fullImageContainer.classList.remove('active');
        
        setTimeout(() => {
            document.body.removeChild(fullImageBackdrop);
            document.body.removeChild(fullImageContainer);
        }, 300);
    }
}

// دالة إنشاء بطاقة لعبة بصورة خارجية
function createGameCard(gameData) {
    // إنشاء عنصر div للبطاقة
    const card = document.createElement('div');
    card.className = 'game-card';
    card.setAttribute('data-external-image', gameData.imageUrl);
    card.setAttribute('data-alt', gameData.title);
    
    // إضافة رابط الصورة بحجم كامل إذا كان متوفراً
    if (gameData.fullImageUrl) {
        card.setAttribute('data-full-image', gameData.fullImageUrl);
    }
    
    // إضافة منصة اللعبة
    const platform = document.createElement('div');
    platform.className = 'game-platform';
    platform.textContent = gameData.platform;
    card.appendChild(platform);
    
    // إضافة شارة اللغة العربية إذا كانت اللعبة معربة
    if (gameData.isArabic) {
        const arabicBadge = document.createElement('div');
        arabicBadge.className = 'arabic-badge';
        arabicBadge.textContent = gameData.arabicType === 'official' ? 'معربة رسمياً' : 'معربة';
        card.appendChild(arabicBadge);
    }
    
    // إضافة معلومات اللعبة
    const overlay = document.createElement('div');
    overlay.className = 'game-overlay';
    
    const title = document.createElement('h3');
    title.className = 'game-title';
    title.textContent = gameData.title;
    overlay.appendChild(title);
    
    const info = document.createElement('div');
    info.className = 'game-info';
    
    const genre = document.createElement('span');
    genre.textContent = gameData.genre;
    info.appendChild(genre);
    
    const size = document.createElement('span');
    size.textContent = gameData.size;
    info.appendChild(size);
    
    overlay.appendChild(info);
    card.appendChild(overlay);
    
    // إضافة رابط إلى صفحة تفاصيل اللعبة
    card.addEventListener('click', function() {
        window.location.href = `game-details.html?id=${gameData.id}&platform=${gameData.platform.toLowerCase()}`;
    });
    
    return card;
}

// دالة إنشاء بطاقة ثيم بصورة خارجية
function createThemeCard(themeData) {
    // إنشاء عنصر div للبطاقة
    const card = document.createElement('div');
    card.className = 'theme-card';
    card.setAttribute('data-external-image', themeData.imageUrl);
    card.setAttribute('data-alt', themeData.title);
    
    // إضافة رابط الصورة بحجم كامل إذا كان متوفراً
    if (themeData.fullImageUrl) {
        card.setAttribute('data-full-image', themeData.fullImageUrl);
    }
    
    // إضافة منصة الثيم
    const platform = document.createElement('div');
    platform.className = 'theme-platform';
    platform.textContent = themeData.platform;
    card.appendChild(platform);
    
    // إضافة معلومات الثيم
    const overlay = document.createElement('div');
    overlay.className = 'theme-overlay';
    
    const title = document.createElement('h3');
    title.className = 'theme-title';
    title.textContent = themeData.title;
    overlay.appendChild(title);
    
    const downloadBtn = document.createElement('a');
    downloadBtn.className = 'download-btn';
    downloadBtn.href = themeData.downloadUrl;
    downloadBtn.setAttribute('data-download-url', themeData.downloadUrl);
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> تحميل';
    overlay.appendChild(downloadBtn);
    
    card.appendChild(overlay);
    
    return card;
}

// دالة إنشاء بطاقة تطبيق بصورة خارجية
function createAppCard(appData) {
    // إنشاء عنصر div للبطاقة
    const card = document.createElement('div');
    card.className = 'app-card';
    card.setAttribute('data-external-image', appData.imageUrl);
    card.setAttribute('data-alt', appData.title);
    
    // إضافة رابط الصورة بحجم كامل إذا كان متوفراً
    if (appData.fullImageUrl) {
        card.setAttribute('data-full-image', appData.fullImageUrl);
    }
    
    // إضافة منصة التطبيق
    const platform = document.createElement('div');
    platform.className = 'app-platform';
    platform.textContent = appData.platform;
    card.appendChild(platform);
    
    // إضافة معلومات التطبيق
    const overlay = document.createElement('div');
    overlay.className = 'app-overlay';
    
    const title = document.createElement('h3');
    title.className = 'app-title';
    title.textContent = appData.title;
    overlay.appendChild(title);
    
    const description = document.createElement('p');
    description.className = 'app-desc';
    description.textContent = appData.description;
    overlay.appendChild(description);
    
    const downloadBtn = document.createElement('a');
    downloadBtn.className = 'download-btn';
    downloadBtn.href = appData.downloadUrl;
    downloadBtn.setAttribute('data-download-url', appData.downloadUrl);
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> تحميل';
    overlay.appendChild(downloadBtn);
    
    card.appendChild(overlay);
    
    return card;
}

// تصدير الدوال للاستخدام العام
window.loadExternalImage = loadExternalImage;
window.showFullImage = showFullImage;
window.createGameCard = createGameCard;
window.createThemeCard = createThemeCard;
window.createAppCard = createAppCard;
