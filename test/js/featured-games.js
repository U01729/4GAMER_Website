/**
 * 4GAMER Website - Featured Games Functionality
 * وظائف قسم الألعاب المميزة لموقع 4GAMER
 */

// تهيئة قسم الألعاب المميزة عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    initFeaturedGames();
});

// دالة تهيئة قسم الألعاب المميزة
function initFeaturedGames() {
    // بيانات الألعاب المميزة (للعرض التوضيحي فقط)
    // في الإصدار النهائي، يمكن تحميل هذه البيانات من ملف JSON أو API
    const featuredGamesData = [
        {
            id: 1,
            title: "God of War Ragnarök",
            description: "استكمل رحلة كريتوس وأتريوس في عالم الأساطير الإسكندنافية",
            platform: "PS5",
            genre: "أكشن، مغامرة",
            size: "85 GB",
            isArabic: true,
            arabicType: "official",
            imageUrl: "https://example.com/images/games/god-of-war-ragnarok.jpg",
            fullImageUrl: "https://example.com/images/games/god-of-war-ragnarok-full.jpg",
            detailsUrl: "game-details.html?id=1&platform=ps5",
            downloadUrl: "https://akirabox.com/download/god-of-war-ragnarok"
        },
        {
            id: 2,
            title: "Horizon Forbidden West",
            description: "انطلق في مغامرة ملحمية في عالم ما بعد نهاية العالم",
            platform: "PS5",
            genre: "أكشن، مغامرة، عالم مفتوح",
            size: "98 GB",
            isArabic: true,
            arabicType: "official",
            imageUrl: "https://example.com/images/games/horizon-forbidden-west.jpg",
            fullImageUrl: "https://example.com/images/games/horizon-forbidden-west-full.jpg",
            detailsUrl: "game-details.html?id=2&platform=ps5",
            downloadUrl: "https://akirabox.com/download/horizon-forbidden-west"
        },
        {
            id: 3,
            title: "The Last of Us Part II",
            description: "قصة مؤثرة في عالم ما بعد نهاية العالم",
            platform: "PS4",
            genre: "أكشن، مغامرة",
            size: "78 GB",
            isArabic: true,
            arabicType: "official",
            imageUrl: "https://example.com/images/games/the-last-of-us-2.jpg",
            fullImageUrl: "https://example.com/images/games/the-last-of-us-2-full.jpg",
            detailsUrl: "game-details.html?id=3&platform=ps4",
            downloadUrl: "https://akirabox.com/download/the-last-of-us-2"
        }
    ];
    
    // تحديد حاوية الألعاب المميزة
    const featuredGrid = document.querySelector('.featured-grid');
    if (!featuredGrid) return;
    
    // إنشاء بطاقات الألعاب المميزة
    featuredGamesData.forEach(game => {
        const featuredCard = createFeaturedGameCard(game);
        featuredGrid.appendChild(featuredCard);
    });
    
    // تهيئة أحداث النقر على بطاقات الألعاب المميزة
    initFeaturedCardEvents();
}

// دالة إنشاء بطاقة لعبة مميزة
function createFeaturedGameCard(gameData) {
    // إنشاء عنصر div للبطاقة
    const card = document.createElement('div');
    card.className = 'featured-card';
    card.setAttribute('data-external-image', gameData.imageUrl);
    card.setAttribute('data-alt', gameData.title);
    card.setAttribute('data-game-id', gameData.id);
    card.setAttribute('data-platform', gameData.platform.toLowerCase());
    
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
    overlay.className = 'featured-overlay';
    
    const title = document.createElement('h3');
    title.className = 'featured-title-card';
    title.textContent = gameData.title;
    overlay.appendChild(title);
    
    const desc = document.createElement('p');
    desc.className = 'featured-desc';
    desc.textContent = gameData.description;
    overlay.appendChild(desc);
    
    const meta = document.createElement('div');
    meta.className = 'featured-meta';
    
    const genre = document.createElement('span');
    genre.textContent = gameData.genre;
    meta.appendChild(genre);
    
    const size = document.createElement('span');
    size.textContent = gameData.size;
    meta.appendChild(size);
    
    overlay.appendChild(meta);
    
    const buttons = document.createElement('div');
    buttons.className = 'featured-buttons';
    
    const detailsBtn = document.createElement('a');
    detailsBtn.className = 'btn';
    detailsBtn.href = gameData.detailsUrl;
    detailsBtn.textContent = 'التفاصيل';
    buttons.appendChild(detailsBtn);
    
    const downloadBtn = document.createElement('a');
    downloadBtn.className = 'btn btn-outline download-btn';
    downloadBtn.href = gameData.downloadUrl;
    downloadBtn.setAttribute('data-download-url', gameData.downloadUrl);
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> تحميل';
    buttons.appendChild(downloadBtn);
    
    overlay.appendChild(buttons);
    card.appendChild(overlay);
    
    return card;
}

// دالة تهيئة أحداث النقر على بطاقات الألعاب المميزة
function initFeaturedCardEvents() {
    const featuredCards = document.querySelectorAll('.featured-card');
    
    featuredCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // تجاهل النقر إذا كان على الأزرار
            if (e.target.closest('.btn')) return;
            
            // الانتقال إلى صفحة تفاصيل اللعبة
            const gameId = this.getAttribute('data-game-id');
            const platform = this.getAttribute('data-platform');
            
            if (gameId && platform) {
                window.location.href = `game-details.html?id=${gameId}&platform=${platform}`;
            }
        });
    });
}

// تصدير الدوال للاستخدام العام
window.createFeaturedGameCard = createFeaturedGameCard;
