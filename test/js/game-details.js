/**
 * 4GAMER Website - Game Details Functionality
 * وظائف صفحة تفاصيل اللعبة لموقع 4GAMER
 */

// تهيئة صفحة تفاصيل اللعبة عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    // استخراج معرف اللعبة ومنصة اللعب من عنوان URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameTitle = urlParams.get('title');
    const platform = urlParams.get('platform');
    
    if (gameTitle && platform) {
        // تحميل بيانات اللعبة
        loadGameDetails(gameTitle, platform);
    } else {
        // إظهار رسالة خطأ إذا لم يتم توفير معرف اللعبة أو المنصة
        showErrorMessage('لم يتم توفير معلومات اللعبة المطلوبة');
    }
    
    // تهيئة علامات التبويب في قسم الوسائط
    initMediaTabs();
    
    // تهيئة معرض الصور
    initScreenshotsGallery();
});

// دالة تحميل بيانات اللعبة
function loadGameDetails(gameTitle, platform) {
    // في الإصدار النهائي، يمكن تحميل البيانات من ملف JSON أو API
    // لأغراض العرض، سنستخدم بيانات ثابتة
    
    // بيانات اللعبة الافتراضية
    const gameData = {
        title: gameTitle,
        platform: platform.toUpperCase(),
        isArabic: true,
        releaseDate: '15 مارس 2025',
        developer: 'استوديو الألعاب',
        publisher: 'ناشر الألعاب',
        genre: 'أكشن، مغامرة، عالم مفتوح',
        size: '45 GB',
        description: 'وصف تفصيلي للعبة يشرح قصتها وأسلوب اللعب والميزات الرئيسية. هذه اللعبة توفر تجربة فريدة من نوعها مع رسومات عالية الجودة وقصة مشوقة وأسلوب لعب سلس.',
        tags: ['أكشن', 'مغامرة', 'عالم مفتوح', 'قتال', 'تصويب'],
        coverImage: 'https://example.com/images/games/' + gameTitle.toLowerCase().replace(/\s+/g, '-') + '.jpg',
        screenshots: [
            'https://example.com/images/screenshots/' + gameTitle.toLowerCase().replace(/\s+/g, '-') + '-1.jpg',
            'https://example.com/images/screenshots/' + gameTitle.toLowerCase().replace(/\s+/g, '-') + '-2.jpg',
            'https://example.com/images/screenshots/' + gameTitle.toLowerCase().replace(/\s+/g, '-') + '-3.jpg',
            'https://example.com/images/screenshots/' + gameTitle.toLowerCase().replace(/\s+/g, '-') + '-4.jpg',
            'https://example.com/images/screenshots/' + gameTitle.toLowerCase().replace(/\s+/g, '-') + '-5.jpg',
            'https://example.com/images/screenshots/' + gameTitle.toLowerCase().replace(/\s+/g, '-') + '-6.jpg'
        ],
        videoId: 'dQw4w9WgXcQ',
        requirements: {
            system: platform.toUpperCase(),
            firmware: '10.50 أو أحدث',
            storage: '50 GB مساحة حرة',
            notes: 'تتطلب اتصال بالإنترنت للتحديثات والمحتوى الإضافي'
        },
        downloads: [
            {
                title: 'اللعبة الأساسية',
                version: '1.0',
                size: '45 GB',
                date: '15 مارس 2025',
                url: 'https://akirabox.com/download/' + gameTitle.toLowerCase().replace(/\s+/g, '-') + '-base'
            },
            {
                title: 'التحديث v1.1',
                version: '1.1',
                size: '2.5 GB',
                date: '1 أبريل 2025',
                url: 'https://akirabox.com/download/' + gameTitle.toLowerCase().replace(/\s+/g, '-') + '-update-1.1'
            },
            {
                title: 'المحتوى الإضافي',
                version: '1.0',
                size: '8 GB',
                date: '10 أبريل 2025',
                url: 'https://akirabox.com/download/' + gameTitle.toLowerCase().replace(/\s+/g, '-') + '-dlc'
            }
        ],
        similarGames: [
            {
                title: 'لعبة مشابهة 1',
                platform: platform.toUpperCase(),
                coverImage: 'https://example.com/images/games/similar-game-1.jpg'
            },
            {
                title: 'لعبة مشابهة 2',
                platform: platform.toUpperCase(),
                coverImage: 'https://example.com/images/games/similar-game-2.jpg'
            },
            {
                title: 'لعبة مشابهة 3',
                platform: platform.toUpperCase(),
                coverImage: 'https://example.com/images/games/similar-game-3.jpg'
            },
            {
                title: 'لعبة مشابهة 4',
                platform: platform.toUpperCase(),
                coverImage: 'https://example.com/images/games/similar-game-4.jpg'
            }
        ]
    };
    
    // تحديث عنوان الصفحة
    document.title = gameData.title + ' - ' + gameData.platform + ' - 4GAMER';
    
    // تحديث محتوى الصفحة
    updateGameDetails(gameData);
}

// دالة تحديث محتوى صفحة تفاصيل اللعبة
function updateGameDetails(gameData) {
    // تحديث صورة اللعبة
    const gameCoverContainer = document.querySelector('.game-cover-container');
    if (gameCoverContainer) {
        gameCoverContainer.setAttribute('data-external-image', gameData.coverImage);
        gameCoverContainer.setAttribute('data-alt', gameData.title);
        
        // إضافة شارة المنصة
        const platformBadge = document.createElement('div');
        platformBadge.className = 'game-platform-badge';
        platformBadge.textContent = gameData.platform;
        gameCoverContainer.appendChild(platformBadge);
        
        // إضافة شارة التعريب إذا كانت اللعبة معربة
        if (gameData.isArabic) {
            const arabicBadge = document.createElement('div');
            arabicBadge.className = 'game-arabic-badge';
            arabicBadge.textContent = 'معربة';
            gameCoverContainer.appendChild(arabicBadge);
        }
    }
    
    // تحديث عنوان اللعبة
    const gameTitle = document.querySelector('.game-title');
    if (gameTitle) {
        gameTitle.textContent = gameData.title;
    }
    
    // تحديث بيانات اللعبة
    const gameMeta = document.querySelector('.game-meta');
    if (gameMeta) {
        gameMeta.innerHTML = `
            <div class="game-meta-item"><i class="far fa-calendar-alt"></i> ${gameData.releaseDate}</div>
            <div class="game-meta-item"><i class="far fa-building"></i> ${gameData.developer}</div>
            <div class="game-meta-item"><i class="fas fa-tags"></i> ${gameData.genre}</div>
            <div class="game-meta-item"><i class="fas fa-hdd"></i> ${gameData.size}</div>
        `;
    }
    
    // تحديث وصف اللعبة
    const gameDescription = document.querySelector('.game-description');
    if (gameDescription) {
        gameDescription.textContent = gameData.description;
    }
    
    // تحديث وسوم اللعبة
    const gameTags = document.querySelector('.game-tags');
    if (gameTags && gameData.tags) {
        gameTags.innerHTML = '';
        gameData.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'game-tag';
            tagElement.textContent = tag;
            gameTags.appendChild(tagElement);
        });
    }
    
    // تحديث روابط التحميل
    const downloadLinks = document.querySelector('.download-links');
    if (downloadLinks && gameData.downloads) {
        downloadLinks.innerHTML = '';
        gameData.downloads.forEach(download => {
            const downloadLinkContainer = document.createElement('div');
            downloadLinkContainer.className = 'download-link-container';
            
            downloadLinkContainer.innerHTML = `
                <div class="download-link-info">
                    <div class="download-link-icon">
                        <i class="fas fa-download"></i>
                    </div>
                    <div class="download-link-details">
                        <div class="download-link-title">${download.title}</div>
                        <div class="download-link-meta">
                            <span><i class="fas fa-code-branch"></i> ${download.version}</span>
                            <span><i class="fas fa-hdd"></i> ${download.size}</span>
                            <span><i class="far fa-calendar-alt"></i> ${download.date}</span>
                        </div>
                    </div>
                </div>
                <a href="${download.url}" class="download-btn" target="_blank">
                    تحميل <i class="fas fa-download"></i>
                </a>
            `;
            
            downloadLinks.appendChild(downloadLinkContainer);
        });
    }
    
    // تحديث صور اللعبة
    const screenshotsGrid = document.querySelector('.screenshots-grid');
    if (screenshotsGrid && gameData.screenshots) {
        screenshotsGrid.innerHTML = '';
        gameData.screenshots.forEach((screenshot, index) => {
            const screenshotContainer = document.createElement('div');
            screenshotContainer.className = 'screenshot-container';
            screenshotContainer.setAttribute('data-external-image', screenshot);
            screenshotContainer.setAttribute('data-alt', `${gameData.title} - صورة ${index + 1}`);
            screenshotContainer.setAttribute('data-index', index);
            
            screenshotsGrid.appendChild(screenshotContainer);
        });
    }
    
    // تحديث فيديو اللعبة
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer && gameData.videoId) {
        videoContainer.setAttribute('data-video-id', gameData.videoId);
        initYoutubeVideos();
    }
    
    // تحديث متطلبات التشغيل
    const requirementsList = document.querySelector('.requirements-list');
    if (requirementsList && gameData.requirements) {
        requirementsList.innerHTML = `
            <div class="requirement-item">
                <div class="requirement-label">النظام:</div>
                <div class="requirement-value">${gameData.requirements.system}</div>
            </div>
            <div class="requirement-item">
                <div class="requirement-label">إصدار النظام:</div>
                <div class="requirement-value">${gameData.requirements.firmware}</div>
            </div>
            <div class="requirement-item">
                <div class="requirement-label">مساحة التخزين:</div>
                <div class="requirement-value">${gameData.requirements.storage}</div>
            </div>
            <div class="requirement-item">
                <div class="requirement-label">ملاحظات:</div>
                <div class="requirement-value">${gameData.requirements.notes}</div>
            </div>
        `;
    }
    
    // تحديث الألعاب المشابهة
    const similarGamesGrid = document.querySelector('.similar-games-grid');
    if (similarGamesGrid && gameData.similarGames) {
        similarGamesGrid.innerHTML = '';
        gameData.similarGames.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.setAttribute('data-external-image', game.coverImage);
            gameCard.setAttribute('data-alt', game.title);
            
            const gamePlatform = document.createElement('div');
            gamePlatform.className = 'game-platform';
            gamePlatform.textContent = game.platform;
            
            const gameOverlay = document.createElement('div');
            gameOverlay.className = 'game-overlay';
            
            const gameTitle = document.createElement('h3');
            gameTitle.className = 'game-title';
            gameTitle.textContent = game.title;
            
            gameOverlay.appendChild(gameTitle);
            gameCard.appendChild(gamePlatform);
            gameCard.appendChild(gameOverlay);
            
            // إضافة حدث النقر للانتقال إلى صفحة تفاصيل اللعبة
            gameCard.addEventListener('click', function() {
                window.location.href = `game-details.html?title=${encodeURIComponent(game.title)}&platform=${encodeURIComponent(game.platform.toLowerCase())}`;
            });
            
            similarGamesGrid.appendChild(gameCard);
        });
        
        // تهيئة تحميل الصور الخارجية
        const externalImages = similarGamesGrid.querySelectorAll('[data-external-image]');
        externalImages.forEach(imgContainer => {
            loadExternalImage(imgContainer);
        });
    }
    
    // تهيئة تحميل الصور الخارجية
    const externalImages = document.querySelectorAll('[data-external-image]');
    externalImages.forEach(imgContainer => {
        loadExternalImage(imgContainer);
    });
}

// دالة تهيئة علامات التبويب في قسم الوسائط
function initMediaTabs() {
    const mediaTabs = document.querySelectorAll('.media-tab');
    const mediaContents = document.querySelectorAll('.media-content');
    
    mediaTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع علامات التبويب
            mediaTabs.forEach(t => t.classList.remove('active'));
            
            // إضافة الفئة النشطة إلى علامة التبويب المحددة
            this.classList.add('active');
            
            // إخفاء جميع محتويات علامات التبويب
            mediaContents.forEach(content => content.classList.remove('active'));
            
            // إظهار محتوى علامة التبويب المحددة
            const target = this.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });
}

// دالة تهيئة معرض الصور
function initScreenshotsGallery() {
    const screenshotsGrid = document.querySelector('.screenshots-grid');
    
    if (screenshotsGrid) {
        screenshotsGrid.addEventListener('click', function(e) {
            const screenshotContainer = e.target.closest('.screenshot-container');
            
            if (screenshotContainer) {
                const imageUrl = screenshotContainer.getAttribute('data-external-image');
                const imageAlt = screenshotContainer.getAttribute('data-alt');
                const imageIndex = parseInt(screenshotContainer.getAttribute('data-index'));
                
                if (imageUrl) {
                    showImageGallery(imageUrl, imageAlt, imageIndex);
                }
            }
        });
    }
}

// دالة عرض معرض الصور
function showImageGallery(imageUrl, imageAlt, currentIndex) {
    // إنشاء عناصر معرض الصور
    const galleryBackdrop = document.createElement('div');
    galleryBackdrop.className = 'gallery-backdrop';
    
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'gallery-container';
    
    // إنشاء زر الإغلاق
    const closeBtn = document.createElement('button');
    closeBtn.className = 'gallery-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    
    // إنشاء أزرار التنقل
    const prevBtn = document.createElement('button');
    prevBtn.className = 'gallery-nav gallery-prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'gallery-nav gallery-next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    // إنشاء حاوية الصورة
    const imageContainer = document.createElement('div');
    imageContainer.className = 'gallery-image-container';
    
    // إنشاء عنصر الصورة
    const image = document.createElement('img');
    image.className = 'gallery-image';
    image.src = imageUrl;
    image.alt = imageAlt || 'صورة اللعبة';
    
    // إضافة العناصر إلى الصفحة
    imageContainer.appendChild(image);
    galleryContainer.appendChild(closeBtn);
    galleryContainer.appendChild(prevBtn);
    galleryContainer.appendChild(nextBtn);
    galleryContainer.appendChild(imageContainer);
    document.body.appendChild(galleryBackdrop);
    document.body.appendChild(galleryContainer);
    
    // تفعيل معرض الصور
    setTimeout(() => {
        galleryBackdrop.classList.add('active');
        galleryContainer.classList.add('active');
    }, 10);
    
    // الحصول على جميع الصور في المعرض
    const screenshotContainers = document.querySelectorAll('.screenshot-container');
    const totalImages = screenshotContainers.length;
    
    // دالة تحديث الصورة الحالية
    function updateImage(index) {
        // التأكد من أن الفهرس ضمن النطاق
        if (index < 0) {
            index = totalImages - 1;
        } else if (index >= totalImages) {
            index = 0;
        }
        
        // تحديث الصورة الحالية
        const newImageUrl = screenshotContainers[index].getAttribute('data-external-image');
        const newImageAlt = screenshotContainers[index].getAttribute('data-alt');
        
        image.src = newImageUrl;
        image.alt = newImageAlt || 'صورة اللعبة';
        
        // تحديث الفهرس الحالي
        currentIndex = index;
    }
    
    // إضافة مستمع أحداث لزر الإغلاق
    closeBtn.addEventListener('click', closeGallery);
    
    // إضافة مستمع أحداث للنقر خارج المعرض
    galleryBackdrop.addEventListener('click', closeGallery);
    
    // إضافة مستمع أحداث لزر السابق
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        updateImage(currentIndex - 1);
    });
    
    // إضافة مستمع أحداث لزر التالي
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        updateImage(currentIndex + 1);
    });
    
    // إضافة مستمع أحداث لمفاتيح الأسهم
    document.addEventListener('keydown', handleKeyDown);
    
    // دالة معالجة مفاتيح الأسهم
    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            closeGallery();
        } else if (e.key === 'ArrowLeft') {
            updateImage(currentIndex + 1);
        } else if (e.key === 'ArrowRight') {
            updateImage(currentIndex - 1);
        }
    }
    
    // دالة إغلاق المعرض
    function closeGallery() {
        galleryBackdrop.classList.remove('active');
        galleryContainer.classList.remove('active');
        
        setTimeout(() => {
            document.body.removeChild(galleryBackdrop);
            document.body.removeChild(galleryContainer);
            document.removeEventListener('keydown', handleKeyDown);
        }, 300);
    }
}

// دالة إظهار رسالة خطأ
function showErrorMessage(message) {
    const gameDetailsContainer = document.querySelector('.game-details-container');
    
    if (gameDetailsContainer) {
        gameDetailsContainer.innerHTML = `
            <div class="container">
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <h2>حدث خطأ</h2>
                    <p>${message}</p>
                    <a href="index.html" class="btn">العودة إلى الصفحة الرئيسية</a>
                </div>
            </div>
        `;
    }
}

// تصدير الدوال للاستخدام العام
window.loadGameDetails = loadGameDetails;
window.showImageGallery = showImageGallery;
