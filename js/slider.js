/**
 * 4GAMER Website - Slider Functionality
 * وظائف الشريط المتحرك لموقع 4GAMER
 */

// تهيئة الشريط المتحرك عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    initSlider();
});

// دالة تهيئة الشريط المتحرك
function initSlider() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-nav');
    const prevBtn = document.querySelector('.slider-arrow-left');
    const nextBtn = document.querySelector('.slider-arrow-right');
    
    if (!slider || slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // وقت التبديل التلقائي (5 ثوانٍ)
    
    // إنشاء نقاط التنقل
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'slider-dot';
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetInterval();
        });
        
        dotsContainer.appendChild(dot);
    });
    
    // دالة الانتقال إلى شريحة محددة
    function goToSlide(slideIndex) {
        if (slideIndex < 0) {
            slideIndex = slides.length - 1;
        } else if (slideIndex >= slides.length) {
            slideIndex = 0;
        }
        
        // تحديث الشريحة الحالية
        currentSlide = slideIndex;
        
        // تحريك الشريط المتحرك
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // تحديث النقاط النشطة
        document.querySelectorAll('.slider-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // إعادة تشغيل تأثيرات الحركة
        resetAnimations();
    }
    
    // دالة الانتقال إلى الشريحة التالية
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // دالة الانتقال إلى الشريحة السابقة
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // دالة إعادة تعيين الفاصل الزمني
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, intervalTime);
    }
    
    // دالة إعادة تعيين تأثيرات الحركة
    function resetAnimations() {
        const currentSlideContent = slides[currentSlide].querySelector('.slide-content');
        const elements = currentSlideContent.children;
        
        // إزالة تأثيرات الحركة
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.animation = 'none';
            elements[i].offsetHeight; // إعادة تدفق العنصر
            elements[i].style.animation = null;
        }
    }
    
    // إضافة مستمعي أحداث لأزرار التنقل
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
    }
    
    // إضافة مستمعي أحداث للتمرير باللمس
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50; // عتبة التمرير
        
        if (touchEndX + swipeThreshold < touchStartX) {
            // تمرير لليسار (الشريحة التالية)
            nextSlide();
            resetInterval();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // تمرير لليمين (الشريحة السابقة)
            prevSlide();
            resetInterval();
        }
    }
    
    // بدء التبديل التلقائي
    resetInterval();
}

// دالة إنشاء شريحة
function createSlide(slideData) {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.style.backgroundImage = `url(${slideData.backgroundImage})`;
    
    const content = document.createElement('div');
    content.className = 'slide-content';
    
    // إضافة شارة الشريحة
    if (slideData.badge) {
        const badge = document.createElement('div');
        badge.className = 'slide-badge';
        badge.textContent = slideData.badge;
        content.appendChild(badge);
    }
    
    // إضافة عنوان الشريحة
    const title = document.createElement('h2');
    title.className = 'slide-title';
    title.textContent = slideData.title;
    content.appendChild(title);
    
    // إضافة وصف الشريحة
    const description = document.createElement('p');
    description.className = 'slide-description';
    description.textContent = slideData.description;
    content.appendChild(description);
    
    // إضافة بيانات وصفية للشريحة
    const meta = document.createElement('div');
    meta.className = 'slide-meta';
    
    // إضافة المنصة
    const platform = document.createElement('div');
    platform.className = 'slide-meta-item';
    platform.innerHTML = `<i class="fab fa-playstation"></i> ${slideData.platform}`;
    meta.appendChild(platform);
    
    // إضافة النوع
    const genre = document.createElement('div');
    genre.className = 'slide-meta-item';
    genre.innerHTML = `<i class="fas fa-gamepad"></i> ${slideData.genre}`;
    meta.appendChild(genre);
    
    // إضافة الحجم
    const size = document.createElement('div');
    size.className = 'slide-meta-item';
    size.innerHTML = `<i class="fas fa-hdd"></i> ${slideData.size}`;
    meta.appendChild(size);
    
    content.appendChild(meta);
    
    // إضافة أزرار الشريحة
    const buttons = document.createElement('div');
    buttons.className = 'slide-buttons';
    
    // زر التفاصيل
    const detailsBtn = document.createElement('a');
    detailsBtn.className = 'btn';
    detailsBtn.href = slideData.detailsUrl;
    detailsBtn.textContent = 'التفاصيل';
    buttons.appendChild(detailsBtn);
    
    // زر التحميل
    const downloadBtn = document.createElement('a');
    downloadBtn.className = 'btn btn-outline';
    downloadBtn.href = slideData.downloadUrl;
    downloadBtn.setAttribute('data-download-url', slideData.downloadUrl);
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> تحميل';
    buttons.appendChild(downloadBtn);
    
    content.appendChild(buttons);
    slide.appendChild(content);
    
    return slide;
}

// تصدير الدوال للاستخدام العام
window.createSlide = createSlide;
