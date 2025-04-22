/**
 * 4GAMER Website - Search Functionality
 * وظيفة البحث لموقع 4GAMER
 */

// تهيئة وظيفة البحث عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initThemeToggle();
});

// دالة تهيئة وظيفة البحث
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchIcon = document.querySelector('.search-icon');
    
    if (!searchInput || !searchResults) return;
    
    // قاعدة بيانات البحث (للعرض التوضيحي فقط)
    // في الإصدار النهائي، يمكن تحميل هذه البيانات من ملف JSON أو API
    const searchDatabase = [
        {
            id: 1,
            title: "God of War Ragnarök",
            category: "ألعاب PS5",
            description: "مغامرة ملحمية في عالم الأساطير الإسكندنافية",
            tags: ["أكشن", "مغامرة", "PS5", "معربة"],
            url: "game-details.html?id=1&platform=PS5"
        },
        {
            id: 2,
            title: "Horizon Forbidden West",
            category: "ألعاب PS5",
            description: "استكشف عالماً مفتوحاً مليئاً بالآلات والمخاطر",
            tags: ["أكشن", "مغامرة", "عالم مفتوح", "PS5", "معربة"],
            url: "game-details.html?id=2&platform=PS5"
        },
        {
            id: 3,
            title: "Spider-Man 2",
            category: "ألعاب PS5",
            description: "انطلق في مغامرة جديدة كالرجل العنكبوت في مدينة نيويورك",
            tags: ["أكشن", "مغامرة", "عالم مفتوح", "PS5", "معربة"],
            url: "game-details.html?id=3&platform=PS5"
        },
        {
            id: 4,
            title: "The Last of Us Part II",
            category: "ألعاب PS4",
            description: "قصة مؤثرة في عالم ما بعد نهاية العالم",
            tags: ["أكشن", "مغامرة", "PS4", "معربة"],
            url: "game-details.html?id=4&platform=PS4"
        },
        {
            id: 5,
            title: "Ghost of Tsushima",
            category: "ألعاب PS4",
            description: "ملحمة الساموراي في اليابان القديمة",
            tags: ["أكشن", "مغامرة", "عالم مفتوح", "PS4", "معربة"],
            url: "game-details.html?id=5&platform=PS4"
        },
        {
            id: 6,
            title: "ثيم God of War",
            category: "ثيمات PS4",
            description: "ثيم ديناميكي مستوحى من لعبة God of War",
            tags: ["ثيمات", "PS4", "ديناميكي"],
            url: "themes.html#theme-1"
        },
        {
            id: 7,
            title: "ثيم Spider-Man",
            category: "ثيمات PS4",
            description: "ثيم ديناميكي مستوحى من لعبة Spider-Man",
            tags: ["ثيمات", "PS4", "ديناميكي"],
            url: "themes.html#theme-2"
        },
        {
            id: 8,
            title: "تطبيق Netflix",
            category: "تطبيقات",
            description: "شاهد الأفلام والمسلسلات على جهازك",
            tags: ["تطبيقات", "PS5", "PS4", "ترفيه"],
            url: "apps.html#app-1"
        },
        {
            id: 9,
            title: "تطبيق Spotify",
            category: "تطبيقات",
            description: "استمع إلى الموسيقى أثناء اللعب",
            tags: ["تطبيقات", "PS5", "PS4", "موسيقى"],
            url: "apps.html#app-2"
        },
        {
            id: 10,
            title: "GOLDHEN لـ PS4",
            category: "جيلبريك",
            description: "أحدث إصدار من GOLDHEN لأجهزة PS4",
            tags: ["جيلبريك", "PS4", "GOLDHEN"],
            url: "jailbreak.html#ps4"
        },
        {
            id: 11,
            title: "GOLDHEN لـ PS5",
            category: "جيلبريك",
            description: "أحدث إصدار من GOLDHEN لأجهزة PS5",
            tags: ["جيلبريك", "PS5", "GOLDHEN"],
            url: "jailbreak.html#ps5"
        },
        {
            id: 12,
            title: "تحديث PS5 الجديد",
            category: "أخبار",
            description: "تحديث جديد لنظام PS5 يضيف ميزات مطلوبة",
            tags: ["أخبار", "PS5", "تحديثات"],
            url: "news-details.html?id=1"
        },
        {
            id: 13,
            title: "الإعلان عن God of War Ragnarök",
            category: "أخبار",
            description: "الإعلان عن موعد إصدار توسعة God of War Ragnarök",
            tags: ["أخبار", "PS5", "God of War"],
            url: "news-details.html?id=2"
        },
        {
            id: 14,
            title: "تسريبات PlayStation 5 Pro",
            category: "أخبار",
            description: "تسريبات جديدة حول PlayStation 5 Pro المرتقب",
            tags: ["أخبار", "PS5", "PlayStation 5 Pro"],
            url: "news-details.html?id=3"
        },
        {
            id: 15,
            title: "تحديث نظام PS4",
            category: "تحديثات",
            description: "أحدث تحديث لنظام PS4 مع شرح للميزات الجديدة",
            tags: ["تحديثات", "PS4", "نظام"],
            url: "updates.html#ps4"
        },
        {
            id: 16,
            title: "تحديث نظام PS5",
            category: "تحديثات",
            description: "أحدث تحديث لنظام PS5 مع شرح للميزات الجديدة",
            tags: ["تحديثات", "PS5", "نظام"],
            url: "updates.html#ps5"
        }
    ];
    
    // فئات البحث
    const searchCategories = [
        { name: "الكل", value: "all" },
        { name: "ألعاب PS5", value: "ps5-games" },
        { name: "ألعاب PS4", value: "ps4-games" },
        { name: "ثيمات", value: "themes" },
        { name: "تطبيقات", value: "apps" },
        { name: "جيلبريك", value: "jailbreak" },
        { name: "تحديثات", value: "updates" },
        { name: "أخبار", value: "news" }
    ];
    
    // إنشاء فئات البحث
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'search-categories';
    
    searchCategories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'search-category';
        categoryElement.textContent = category.name;
        categoryElement.dataset.value = category.value;
        
        if (category.value === 'all') {
            categoryElement.classList.add('active');
        }
        
        categoryElement.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع الفئات
            document.querySelectorAll('.search-category').forEach(cat => {
                cat.classList.remove('active');
            });
            
            // إضافة الفئة النشطة للفئة المحددة
            this.classList.add('active');
            
            // إعادة البحث باستخدام الفئة المحددة
            performSearch(searchInput.value);
        });
        
        categoriesContainer.appendChild(categoryElement);
    });
    
    // إضافة فئات البحث إلى نتائج البحث
    searchResults.appendChild(categoriesContainer);
    
    // إضافة مستمع أحداث للبحث
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        if (query.length > 0) {
            // إظهار نتائج البحث
            searchResults.classList.add('active');
            
            // إظهار رمز التحميل
            searchResults.innerHTML = '<div class="search-loading">جاري البحث...</div>';
            searchResults.appendChild(categoriesContainer);
            
            // تأخير بسيط لمحاكاة البحث
            setTimeout(() => {
                performSearch(query);
            }, 300);
        } else {
            // إخفاء نتائج البحث إذا كان حقل البحث فارغًا
            searchResults.classList.remove('active');
        }
    });
    
    // إضافة مستمع أحداث للنقر خارج نتائج البحث
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.classList.remove('active');
        }
    });
    
    // إضافة مستمع أحداث للنقر على أيقونة البحث
    searchIcon.addEventListener('click', function() {
        searchInput.focus();
    });
    
    // دالة تنفيذ البحث
    function performSearch(query) {
        if (query.length === 0) {
            searchResults.classList.remove('active');
            return;
        }
        
        // الحصول على الفئة المحددة
        const selectedCategory = document.querySelector('.search-category.active');
        const categoryValue = selectedCategory ? selectedCategory.dataset.value : 'all';
        
        // تنفيذ البحث
        let results = [];
        
        // تحويل الاستعلام إلى حروف صغيرة للمقارنة
        const queryLower = query.toLowerCase();
        
        // البحث في قاعدة البيانات
        searchDatabase.forEach(item => {
            // التحقق من الفئة
            if (categoryValue !== 'all') {
                const categoryMatch = item.category.toLowerCase().includes(categoryValue) || 
                                     item.tags.some(tag => tag.toLowerCase().includes(categoryValue));
                if (!categoryMatch) return;
            }
            
            // البحث في العنوان والوصف والفئة والعلامات
            const titleMatch = item.title.toLowerCase().includes(queryLower);
            const descriptionMatch = item.description.toLowerCase().includes(queryLower);
            const categoryMatch = item.category.toLowerCase().includes(queryLower);
            const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(queryLower));
            
            if (titleMatch || descriptionMatch || categoryMatch || tagsMatch) {
                // إنشاء نسخة من العنصر مع تمييز الكلمات المطابقة
                const resultItem = { ...item };
                
                // تمييز الكلمات المطابقة في العنوان
                if (titleMatch) {
                    resultItem.titleHighlighted = highlightText(item.title, queryLower);
                } else {
                    resultItem.titleHighlighted = item.title;
                }
                
                // تمييز الكلمات المطابقة في الوصف
                if (descriptionMatch) {
                    resultItem.descriptionHighlighted = highlightText(item.description, queryLower);
                } else {
                    resultItem.descriptionHighlighted = item.description;
                }
                
                results.push(resultItem);
            }
        });
        
        // عرض النتائج
        displayResults(results, query);
    }
    
    // دالة تمييز النص المطابق
    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    // دالة عرض نتائج البحث
    function displayResults(results, query) {
        // إزالة نتائج البحث السابقة
        searchResults.innerHTML = '';
        
        // إضافة فئات البحث
        searchResults.appendChild(categoriesContainer);
        
        // التحقق من وجود نتائج
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'search-no-results';
            noResults.textContent = `لا توجد نتائج لـ "${query}"`;
            searchResults.appendChild(noResults);
            return;
        }
        
        // إنشاء عناصر النتائج
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="search-result-title">${result.titleHighlighted}</div>
                <div class="search-result-category">${result.category}</div>
                <div class="search-result-description">${result.descriptionHighlighted}</div>
            `;
            
            // إضافة مستمع أحداث للنقر على النتيجة
            resultItem.addEventListener('click', function() {
                window.location.href = result.url;
            });
            
            searchResults.appendChild(resultItem);
        });
    }
}

// دالة تهيئة زر تبديل السمة
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    
    // التحقق من السمة المحفوظة
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeToggleIcon(savedTheme);
    }
    
    // إضافة مستمع أحداث لزر تبديل السمة
    themeToggleBtn.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // تحديث السمة
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // تحديث أيقونة الزر
        updateThemeToggleIcon(newTheme);
    });
    
    // دالة تحديث أيقونة زر تبديل السمة
    function updateThemeToggleIcon(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (!icon) return;
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggleBtn.setAttribute('title', 'تفعيل الوضع المضيء');
        } else {
            icon.className = 'fas fa-moon';
            themeToggleBtn.setAttribute('title', 'تفعيل الوضع المظلم');
        }
    }
}
