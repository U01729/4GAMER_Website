/**
 * 4GAMER Website - Tutorials & Videos Functionality
 * وظائف قسم الشروحات والفيديوهات لموقع 4GAMER
 */

// تهيئة قسم الشروحات عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    initTutorials();
    initYoutubeVideos();
    initNewsCards();
});

// دالة تهيئة قسم الشروحات
function initTutorials() {
    // تهيئة أحداث النقر على بطاقات الشروحات
    const tutorialCards = document.querySelectorAll('.tutorial-card');
    
    tutorialCards.forEach(card => {
        card.addEventListener('click', function() {
            // الحصول على معرف الفيديو
            const videoId = this.getAttribute('data-video-id');
            
            // التحقق من وجود معرف الفيديو
            if (!videoId) {
                console.error('معرف الفيديو غير موجود');
                return;
            }
            
            // الحصول على عنوان الشرح
            const tutorialTitle = this.querySelector('.tutorial-title').textContent;
            
            // عرض الفيديو في نافذة منبثقة
            showVideoPopup(videoId, tutorialTitle);
        });
    });
}

// دالة تهيئة الفيديوهات من يوتيوب
function initYoutubeVideos() {
    // تحديد جميع حاويات الفيديو
    const videoContainers = document.querySelectorAll('.video-container[data-video-id]');
    
    videoContainers.forEach(container => {
        // الحصول على معرف الفيديو
        const videoId = container.getAttribute('data-video-id');
        
        // التحقق من وجود معرف الفيديو
        if (!videoId) {
            console.error('معرف الفيديو غير موجود');
            return;
        }
        
        // إنشاء عنصر iframe
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.title = 'YouTube video player';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        
        // إضافة iframe إلى الحاوية
        container.appendChild(iframe);
    });
}

// دالة تهيئة بطاقات الأخبار
function initNewsCards() {
    // تهيئة أحداث النقر على بطاقات الأخبار
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        // تهيئة زر "اقرأ المزيد"
        const readMoreBtn = card.querySelector('.news-read-more');
        
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // الحصول على معرف الخبر
                const newsId = card.getAttribute('data-news-id');
                
                // التحقق من وجود معرف الخبر
                if (!newsId) {
                    console.error('معرف الخبر غير موجود');
                    return;
                }
                
                // الانتقال إلى صفحة الخبر
                window.location.href = `news-details.html?id=${newsId}`;
            });
        }
        
        // تهيئة النقر على البطاقة بأكملها
        card.addEventListener('click', function(e) {
            // تجاهل النقر إذا كان على الزر
            if (e.target.closest('.news-read-more')) return;
            
            // الحصول على معرف الخبر
            const newsId = this.getAttribute('data-news-id');
            
            // التحقق من وجود معرف الخبر
            if (!newsId) {
                console.error('معرف الخبر غير موجود');
                return;
            }
            
            // الانتقال إلى صفحة الخبر
            window.location.href = `news-details.html?id=${newsId}`;
        });
    });
}

// دالة عرض الفيديو في نافذة منبثقة
function showVideoPopup(videoId, title) {
    // إنشاء عناصر النافذة المنبثقة
    const popupBackdrop = document.createElement('div');
    popupBackdrop.className = 'video-popup-backdrop';
    
    const popupContainer = document.createElement('div');
    popupContainer.className = 'video-popup-container';
    
    // إنشاء عنوان الفيديو
    const popupTitle = document.createElement('div');
    popupTitle.className = 'video-popup-title';
    popupTitle.textContent = title || 'فيديو شرح';
    
    // إنشاء زر الإغلاق
    const closeBtn = document.createElement('button');
    closeBtn.className = 'video-popup-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    // إنشاء حاوية الفيديو
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    
    // إنشاء عنصر iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.title = 'YouTube video player';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    
    // إضافة العناصر إلى الصفحة
    videoContainer.appendChild(iframe);
    popupContainer.appendChild(closeBtn);
    popupContainer.appendChild(popupTitle);
    popupContainer.appendChild(videoContainer);
    document.body.appendChild(popupBackdrop);
    document.body.appendChild(popupContainer);
    
    // تفعيل النافذة المنبثقة
    setTimeout(() => {
        popupBackdrop.classList.add('active');
        popupContainer.classList.add('active');
    }, 10);
    
    // إضافة مستمع أحداث لزر الإغلاق
    closeBtn.addEventListener('click', closeVideoPopup);
    
    // إضافة مستمع أحداث للنقر خارج النافذة المنبثقة
    popupBackdrop.addEventListener('click', closeVideoPopup);
    
    // دالة إغلاق النافذة المنبثقة
    function closeVideoPopup() {
        popupBackdrop.classList.remove('active');
        popupContainer.classList.remove('active');
        
        setTimeout(() => {
            document.body.removeChild(popupBackdrop);
            document.body.removeChild(popupContainer);
        }, 300);
    }
}

// دالة إنشاء بطاقة شرح
function createTutorialCard(tutorialData) {
    // إنشاء عنصر div للبطاقة
    const card = document.createElement('div');
    card.className = 'tutorial-card';
    card.setAttribute('data-video-id', tutorialData.videoId);
    
    // إنشاء صورة مصغرة للفيديو
    const thumbnail = document.createElement('div');
    thumbnail.className = 'tutorial-thumbnail';
    
    // إنشاء عنصر الصورة
    const img = document.createElement('img');
    img.src = tutorialData.thumbnailUrl || `https://img.youtube.com/vi/${tutorialData.videoId}/maxresdefault.jpg`;
    img.alt = tutorialData.title;
    thumbnail.appendChild(img);
    
    // إنشاء زر التشغيل
    const playBtn = document.createElement('div');
    playBtn.className = 'tutorial-play-btn';
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    thumbnail.appendChild(playBtn);
    
    // إنشاء محتوى البطاقة
    const content = document.createElement('div');
    content.className = 'tutorial-content';
    
    // إنشاء عنوان الشرح
    const title = document.createElement('h3');
    title.className = 'tutorial-title';
    title.textContent = tutorialData.title;
    content.appendChild(title);
    
    // إنشاء بيانات وصفية للشرح
    const meta = document.createElement('div');
    meta.className = 'tutorial-meta';
    
    // إنشاء تاريخ النشر
    const date = document.createElement('div');
    date.className = 'tutorial-meta-item';
    date.innerHTML = `<i class="far fa-calendar-alt"></i> ${tutorialData.date}`;
    meta.appendChild(date);
    
    // إنشاء عدد المشاهدات
    const views = document.createElement('div');
    views.className = 'tutorial-meta-item';
    views.innerHTML = `<i class="far fa-eye"></i> ${tutorialData.views}`;
    meta.appendChild(views);
    
    content.appendChild(meta);
    
    // إنشاء وصف الشرح إذا كان موجوداً
    if (tutorialData.description) {
        const description = document.createElement('p');
        description.className = 'tutorial-description';
        description.textContent = tutorialData.description;
        content.appendChild(description);
    }
    
    // إنشاء الوسوم إذا كانت موجودة
    if (tutorialData.tags && tutorialData.tags.length > 0) {
        const tags = document.createElement('div');
        tags.className = 'tutorial-tags';
        
        tutorialData.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tutorial-tag';
            tagElement.textContent = tag;
            tags.appendChild(tagElement);
        });
        
        content.appendChild(tags);
    }
    
    // إضافة العناصر إلى البطاقة
    card.appendChild(thumbnail);
    card.appendChild(content);
    
    return card;
}

// دالة إنشاء بطاقة خبر
function createNewsCard(newsData) {
    // إنشاء عنصر div للبطاقة
    const card = document.createElement('div');
    card.className = 'news-card';
    card.setAttribute('data-news-id', newsData.id);
    
    // إنشاء صورة الخبر إذا كانت موجودة
    if (newsData.imageUrl) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'news-img-container';
        imgContainer.setAttribute('data-external-image', newsData.imageUrl);
        imgContainer.setAttribute('data-alt', newsData.title);
        card.appendChild(imgContainer);
    }
    
    // إنشاء محتوى البطاقة
    const content = document.createElement('div');
    content.className = 'news-content';
    
    // إنشاء عنوان الخبر
    const title = document.createElement('h3');
    title.className = 'news-title';
    title.textContent = newsData.title;
    content.appendChild(title);
    
    // إنشاء بيانات وصفية للخبر
    const meta = document.createElement('div');
    meta.className = 'news-meta';
    
    // إنشاء تاريخ النشر
    const date = document.createElement('div');
    date.className = 'news-meta-item';
    date.innerHTML = `<i class="far fa-calendar-alt"></i> ${newsData.date}`;
    meta.appendChild(date);
    
    // إنشاء الكاتب
    const author = document.createElement('div');
    author.className = 'news-meta-item';
    author.innerHTML = `<i class="far fa-user"></i> ${newsData.author}`;
    meta.appendChild(author);
    
    content.appendChild(meta);
    
    // إنشاء وصف الخبر
    const description = document.createElement('p');
    description.className = 'news-description';
    description.textContent = newsData.description;
    content.appendChild(description);
    
    // إنشاء زر "اقرأ المزيد"
    const readMore = document.createElement('a');
    readMore.className = 'news-read-more';
    readMore.href = `news-details.html?id=${newsData.id}`;
    readMore.innerHTML = 'اقرأ المزيد <i class="fas fa-arrow-left"></i>';
    content.appendChild(readMore);
    
    // إضافة المحتوى إلى البطاقة
    card.appendChild(content);
    
    return card;
}

// تصدير الدوال للاستخدام العام
window.showVideoPopup = showVideoPopup;
window.createTutorialCard = createTutorialCard;
window.createNewsCard = createNewsCard;
