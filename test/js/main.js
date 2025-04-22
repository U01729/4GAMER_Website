/**
 * 4GAMER Website - Main JavaScript File
 * ملف الجافاسكريبت الرئيسي لموقع 4GAMER
 */

// انتظار تحميل المستند بالكامل
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة المتغيرات
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const contactForm = document.getElementById('contactForm');
    
    // ========== وظائف الشريط العلوي ==========
    
    // تغيير مظهر الشريط العلوي عند التمرير
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // تفعيل القائمة المتنقلة للأجهزة المحمولة
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // تغيير أيقونة الزر
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // إغلاق القائمة المتنقلة عند النقر على أي رابط
    const mobileLinks = document.querySelectorAll('.nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // ========== تأثيرات الظهور عند التمرير ==========
    
    // تحديد العناصر التي ستظهر عند التمرير
    const fadeElements = document.querySelectorAll('.fade-in:not(.delay-1):not(.delay-2):not(.delay-3)');
    const fadeDelay1 = document.querySelectorAll('.fade-in.delay-1');
    const fadeDelay2 = document.querySelectorAll('.fade-in.delay-2');
    const fadeDelay3 = document.querySelectorAll('.fade-in.delay-3');
    
    // دالة للتحقق مما إذا كان العنصر مرئيًا في نافذة العرض
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // دالة لإظهار العناصر المرئية
    function showVisibleElements() {
        fadeElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
        
        setTimeout(() => {
            fadeDelay1.forEach(element => {
                if (isElementInViewport(element)) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }, 200);
        
        setTimeout(() => {
            fadeDelay2.forEach(element => {
                if (isElementInViewport(element)) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }, 400);
        
        setTimeout(() => {
            fadeDelay3.forEach(element => {
                if (isElementInViewport(element)) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }, 600);
    }
    
    // تعيين نمط البداية للعناصر
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    fadeDelay1.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    fadeDelay2.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    fadeDelay3.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // تنفيذ الدالة عند التمرير وعند تحميل الصفحة
    window.addEventListener('scroll', showVisibleElements);
    window.addEventListener('resize', showVisibleElements);
    showVisibleElements(); // تنفيذ عند تحميل الصفحة
    
    // ========== معالجة نموذج الاتصال ==========
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // الحصول على قيم الحقول
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // التحقق من صحة البريد الإلكتروني
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('يرجى إدخال بريد إلكتروني صحيح');
                return;
            }
            
            // في الإصدار النهائي، يمكن إرسال البيانات إلى الخادم
            // لكن في هذا المثال، سنعرض رسالة نجاح فقط
            
            // حفظ البيانات محليًا (للعرض التوضيحي فقط)
            localStorage.setItem('contactName', name);
            localStorage.setItem('contactEmail', email);
            localStorage.setItem('contactSubject', subject);
            localStorage.setItem('contactMessage', message);
            
            // عرض رسالة نجاح
            alert('تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.');
            
            // إعادة تعيين النموذج
            contactForm.reset();
        });
    }
    
    // ========== نموذج النشرة الإخبارية ==========
    
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('.newsletter-input').value;
            
            // التحقق من صحة البريد الإلكتروني
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('يرجى إدخال بريد إلكتروني صحيح');
                return;
            }
            
            // حفظ البريد الإلكتروني محليًا (للعرض التوضيحي فقط)
            localStorage.setItem('newsletterEmail', email);
            
            // عرض رسالة نجاح
            alert('تم الاشتراك في النشرة الإخبارية بنجاح!');
            
            // إعادة تعيين النموذج
            this.reset();
        });
    }
    
    // ========== تحميل المحتوى الديناميكي ==========
    
    // دالة لتحميل محتوى الألعاب من ملف JSON محلي
    function loadGames(platform, containerId, limit = 4) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // في الإصدار النهائي، يمكن تحميل البيانات من ملف JSON أو API
        // لكن في هذا المثال، سنستخدم بيانات وهمية
        
        // محاكاة تحميل البيانات (يمكن استبدالها بطلب fetch حقيقي)
        setTimeout(() => {
            // إضافة رمز التحميل
            container.innerHTML = '<div class="loading">جاري التحميل...</div>';
            
            // محاكاة استجابة البيانات
            setTimeout(() => {
                // إزالة رمز التحميل
                container.innerHTML = '';
                
                // إنشاء بطاقات الألعاب (يمكن استبدالها ببيانات حقيقية)
                for (let i = 1; i <= limit; i++) {
                    const gameCard = document.createElement('div');
                    gameCard.className = 'game-card';
                    gameCard.innerHTML = `
                        <img src="images/games/placeholder.jpg" alt="Game ${i}" class="game-img">
                        <div class="game-platform">${platform}</div>
                        ${Math.random() > 0.5 ? '<div class="arabic-badge">معربة رسمياً</div>' : ''}
                        <div class="game-overlay">
                            <h3 class="game-title">عنوان اللعبة ${i}</h3>
                            <div class="game-info">
                                <span>أكشن، مغامرة</span>
                                <span>${Math.floor(Math.random() * 100) + 10} GB</span>
                            </div>
                        </div>
                    `;
                    
                    // إضافة رابط للصفحة التفصيلية
                    gameCard.addEventListener('click', function() {
                        window.location.href = `game-details.html?id=${i}&platform=${platform}`;
                    });
                    
                    container.appendChild(gameCard);
                }
            }, 1000);
        }, 300);
    }
    
    // ========== وظائف صفحة تفاصيل اللعبة ==========
    
    // دالة لتحميل تفاصيل اللعبة من المعلمات في عنوان URL
    function loadGameDetails() {
        const gameDetailsContainer = document.getElementById('game-details');
        if (!gameDetailsContainer) return;
        
        // الحصول على معلمات URL
        const urlParams = new URLSearchParams(window.location.search);
        const gameId = urlParams.get('id');
        const platform = urlParams.get('platform');
        
        if (!gameId || !platform) {
            gameDetailsContainer.innerHTML = '<div class="error">معلومات اللعبة غير متوفرة</div>';
            return;
        }
        
        // إضافة رمز التحميل
        gameDetailsContainer.innerHTML = '<div class="loading">جاري تحميل تفاصيل اللعبة...</div>';
        
        // محاكاة تحميل البيانات (يمكن استبدالها بطلب fetch حقيقي)
        setTimeout(() => {
            // إنشاء محتوى تفاصيل اللعبة (يمكن استبدالها ببيانات حقيقية)
            gameDetailsContainer.innerHTML = `
                <div class="game-details-header">
                    <div class="game-details-cover">
                        <img src="images/games/placeholder.jpg" alt="Game Cover">
                    </div>
                    <div class="game-details-info">
                        <h1 class="game-details-title">عنوان اللعبة ${gameId}</h1>
                        <div class="game-details-meta">
                            <span class="game-platform">${platform}</span>
                            <span class="game-genre">أكشن، مغامرة</span>
                            <span class="game-size">${Math.floor(Math.random() * 100) + 10} GB</span>
                            <span class="game-release">تاريخ الإصدار: 2025</span>
                        </div>
                        <div class="game-arabic-support">
                            <i class="fas fa-language"></i> دعم اللغة العربية: 
                            <span class="support-badge">معربة رسمياً</span>
                        </div>
                        <div class="game-details-description">
                            <p>وصف اللعبة يظهر هنا. هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها التطبيق.</p>
                        </div>
                        <div class="game-details-buttons">
                            <a href="#download-section" class="btn">تحميل اللعبة</a>
                            <a href="#screenshots" class="btn btn-outline">عرض الصور</a>
                        </div>
                    </div>
                </div>
                
                <div class="game-details-tabs">
                    <ul class="tabs-nav">
                        <li class="active" data-tab="description">الوصف</li>
                        <li data-tab="screenshots">الصور</li>
                        <li data-tab="videos">الفيديوهات</li>
                        <li data-tab="requirements">متطلبات التشغيل</li>
                    </ul>
                    
                    <div class="tabs-content">
                        <div class="tab-pane active" id="description">
                            <h2>وصف اللعبة</h2>
                            <p>وصف تفصيلي للعبة يظهر هنا. هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها التطبيق.</p>
                            <p>إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربي زيادة عدد الفقرات كما تريد، النص لن يبدو مقسماً ولا يحوي أخطاء لغوية، مولد النص العربي مفيد لمصممي المواقع على وجه الخصوص، حيث يحتاج العميل في كثير من الأحيان أن يطلع على صورة حقيقية لتصميم الموقع.</p>
                            <h3>المميزات الرئيسية</h3>
                            <ul>
                                <li>ميزة رئيسية للعبة تظهر هنا</li>
                                <li>ميزة رئيسية للعبة تظهر هنا</li>
                                <li>ميزة رئيسية للعبة تظهر هنا</li>
                                <li>ميزة رئيسية للعبة تظهر هنا</li>
                            </ul>
                        </div>
                        
                        <div class="tab-pane" id="screenshots">
                            <h2>صور اللعبة</h2>
                            <div class="screenshots-grid">
                                <div class="screenshot">
                                    <img src="images/games/screenshot1.jpg" alt="Screenshot 1">
                                </div>
                                <div class="screenshot">
                                    <img src="images/games/screenshot2.jpg" alt="Screenshot 2">
                                </div>
                                <div class="screenshot">
                                    <img src="images/games/screenshot3.jpg" alt="Screenshot 3">
                                </div>
                                <div class="screenshot">
                                    <img src="images/games/screenshot4.jpg" alt="Screenshot 4">
                                </div>
                            </div>
                        </div>
                        
                        <div class="tab-pane" id="videos">
                            <h2>فيديوهات اللعبة</h2>
                            <div class="videos-grid">
                                <div class="video">
                                    <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                                <div class="video">
                                    <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tab-pane" id="requirements">
                            <h2>متطلبات التشغيل</h2>
                            <div class="requirements">
                                <p>متطلبات تشغيل اللعبة على ${platform}:</p>
                                <ul>
                                    <li>نظام التشغيل: ${platform} Firmware 9.00 أو أحدث</li>
                                    <li>المعالج: ${platform} CPU</li>
                                    <li>الذاكرة: ${platform} RAM</li>
                                    <li>مساحة التخزين: ${Math.floor(Math.random() * 100) + 10} GB</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="download-section" id="download-section">
                    <h2>روابط التحميل</h2>
                    <div class="download-tabs">
                        <ul class="download-tabs-nav">
                            <li class="active" data-tab="game">اللعبة الأساسية</li>
                            <li data-tab="update">التحديثات</li>
                            <li data-tab="dlc">الإضافات</li>
                        </ul>
                        
                        <div class="download-tabs-content">
                            <div class="download-tab-pane active" id="game">
                                <div class="download-links">
                                    <div class="download-link-card">
                                        <div class="download-link-info">
                                            <h3>رابط التحميل المباشر</h3>
                                            <p>حجم الملف: ${Math.floor(Math.random() * 100) + 10} GB</p>
                                        </div>
                                        <a href="#" class="btn download-btn" onclick="alert('تم النقر على رابط التحميل'); return false;">تحميل</a>
                                    </div>
                                    
                                    <div class="download-link-card">
                                        <div class="download-link-info">
                                            <h3>رابط تحميل بديل</h3>
                                            <p>حجم الملف: ${Math.floor(Math.random() * 100) + 10} GB</p>
                                        </div>
                                        <a href="#" class="btn download-btn" onclick="alert('تم النقر على رابط التحميل البديل'); return false;">تحميل</a>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="download-tab-pane" id="update">
                                <div class="download-links">
                                    <div class="download-link-card">
                                        <div class="download-link-info">
                                            <h3>تحديث v1.05</h3>
                                            <p>حجم الملف: ${Math.floor(Math.random() * 10) + 1} GB</p>
                                        </div>
                                        <a href="#" class="btn download-btn" onclick="alert('تم النقر على رابط تحميل التحديث'); return false;">تحميل</a>
                                    </div>
                                    
                                    <div class="download-link-card">
                                        <div class="download-link-info">
                                            <h3>تحديث v1.04</h3>
                                            <p>حجم الملف: ${Math.floor(Math.random() * 10) + 1} GB</p>
                                        </div>
                                        <a href="#" class="btn download-btn" onclick="alert('تم النقر على رابط تحميل التحديث'); return false;">تحميل</a>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="download-tab-pane" id="dlc">
                                <div class="download-links">
                                    <div class="download-link-card">
                                        <div class="download-link-info">
                                            <h3>الإضافة الأولى</h3>
                                            <p>حجم الملف: ${Math.floor(Math.random() * 5) + 1} GB</p>
                                        </div>
                                        <a href="#" class="btn download-btn" onclick="alert('تم النقر على رابط تحميل الإضافة'); return false;">تحميل</a>
                                    </div>
                                    
                                    <div class="download-link-card">
                                        <div class="download-link-info">
                                            <h3>الإضافة الثانية</h3>
                                            <p>حجم الملف: ${Math.floor(Math.random() * 5) + 1} GB</p>
                                        </div>
                                        <a href="#" class="btn download-btn" onclick="alert('تم النقر على رابط تحميل الإضافة'); return false;">تحميل</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="installation-guide">
                    <h2>دليل التثبيت</h2>
                    <ol>
                        <li>قم بتحميل ملفات اللعبة من الروابط أعلاه</li>
                        <li>قم بفك ضغط الملفات باستخدام برنامج فك الضغط</li>
                        <li>انقل الملفات إلى جهاز ${platform} الخاص بك</li>
                        <li>قم بتثبيت اللعبة من قائمة الألعاب</li>
                        <li>استمتع باللعب!</li>
                    </ol>
                </div>
                
                <div class="related-games">
                    <h2>ألعاب مشابهة</h2>
                    <div class="games-grid">
                        <div class="game-card">
                            <img src="images/games/placeholder.jpg" alt="Related Game 1" class="game-img">
                            <div class="game-platform">${platform}</div>
                            <div class="game-overlay">
                                <h3 class="game-title">لعبة مشابهة 1</h3>
                                <div class="game-info">
                                    <span>أكشن، مغامرة</span>
                                    <span>${Math.floor(Math.random() * 100) + 10} GB</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="game-card">
                            <img src="images/games/placeholder.jpg" alt="Related Game 2" class="game-img">
                            <div class="game-platform">${platform}</div>
                            <div class="game-overlay">
                                <h3 class="game-title">لعبة مشابهة 2</h3>
                                <div class="game-info">
                                    <span>أكشن، مغامرة</span>
                                    <span>${Math.floor(Math.random() * 100) + 10} GB</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="game-card">
                            <img src="images/games/placeholder.jpg" alt="Related Game 3" class="game-img">
                            <div class="game-platform">${platform}</div>
                            <div class="game-overlay">
                                <h3 class="game-title">لعبة مشابهة 3</h3>
                                <div class="game-info">
                                    <span>أكشن، مغامرة</span>
                                    <span>${Math.floor(Math.random() * 100) + 10} GB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // تفعيل علامات التبويب
            initTabs();
            initDownloadTabs();
        }, 1000);
    }
    
    // دالة لتفعيل علامات التبويب
    function initTabs() {
        const tabsNav = document.querySelector('.tabs-nav');
        if (!tabsNav) return;
        
        const tabItems = tabsNav.querySelectorAll('li');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabItems.forEach(item => {
            item.addEventListener('click', function() {
                // إزالة الفئة النشطة من جميع العناصر
                tabItems.forEach(tab => tab.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // إضافة الفئة النشطة للعنصر المحدد
                this.classList.add('active');
                
                // تنشيط المحتوى المقابل
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // دالة لتفعيل علامات تبويب التحميل
    function initDownloadTabs() {
        const downloadTabsNav = document.querySelector('.download-tabs-nav');
        if (!downloadTabsNav) return;
        
        const downloadTabItems = downloadTabsNav.querySelectorAll('li');
        const downloadTabPanes = document.querySelectorAll('.download-tab-pane');
        
        downloadTabItems.forEach(item => {
            item.addEventListener('click', function() {
                // إزالة الفئة النشطة من جميع العناصر
                downloadTabItems.forEach(tab => tab.classList.remove('active'));
                downloadTabPanes.forEach(pane => pane.classList.remove('active'));
                
                // إضافة الفئة النشطة للعنصر المحدد
                this.classList.add('active');
                
                // تنشيط المحتوى المقابل
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // ========== تحميل GOLDHEN ==========
    
    // دالة لتحميل قسم GOLDHEN
    function loadGoldhenSection() {
        const goldhenContainer = document.getElementById('goldhen-container');
        if (!goldhenContainer) return;
        
        // إضافة رمز التحميل
        goldhenContainer.innerHTML = '<div class="loading">جاري تحميل معلومات GOLDHEN...</div>';
        
        // محاكاة تحميل البيانات (يمكن استبدالها بطلب fetch حقيقي)
        setTimeout(() => {
            goldhenContainer.innerHTML = `
                <div class="goldhen-header">
                    <h2>تحميل GOLDHEN - أحدث إصدار</h2>
                    <p>GOLDHEN هو أداة جيلبريك لأجهزة PlayStation تتيح تشغيل التطبيقات والألعاب المعدلة.</p>
                </div>
                
                <div class="goldhen-versions">
                    <div class="goldhen-version-card">
                        <div class="goldhen-version-header">
                            <h3>GOLDHEN لـ PS4</h3>
                            <span class="version-badge">v2.4</span>
                        </div>
                        <div class="goldhen-version-info">
                            <p>متوافق مع إصدارات النظام حتى 9.00</p>
                            <ul>
                                <li>دعم تثبيت الألعاب المعدلة</li>
                                <li>دعم التطبيقات المساعدة</li>
                                <li>تحسينات في الأداء والاستقرار</li>
                            </ul>
                        </div>
                        <a href="#" class="btn download-btn" onclick="alert('تم النقر على رابط تحميل GOLDHEN لـ PS4'); return false;">تحميل GOLDHEN PS4</a>
                    </div>
                    
                    <div class="goldhen-version-card">
                        <div class="goldhen-version-header">
                            <h3>GOLDHEN لـ PS5</h3>
                            <span class="version-badge">v1.2</span>
                        </div>
                        <div class="goldhen-version-info">
                            <p>متوافق مع إصدارات النظام حتى 5.50</p>
                            <ul>
                                <li>دعم تثبيت الألعاب المعدلة</li>
                                <li>دعم التطبيقات المساعدة</li>
                                <li>تحسينات في الأداء والاستقرار</li>
                            </ul>
                        </div>
                        <a href="#" class="btn download-btn" onclick="alert('تم النقر على رابط تحميل GOLDHEN لـ PS5'); return false;">تحميل GOLDHEN PS5</a>
                    </div>
                </div>
                
                <div class="goldhen-installation">
                    <h3>دليل التثبيت</h3>
                    <div class="installation-tabs">
                        <ul class="installation-tabs-nav">
                            <li class="active" data-tab="ps4-install">تثبيت على PS4</li>
                            <li data-tab="ps5-install">تثبيت على PS5</li>
                        </ul>
                        
                        <div class="installation-tabs-content">
                            <div class="installation-tab-pane active" id="ps4-install">
                                <ol>
                                    <li>قم بتحميل ملف GOLDHEN لـ PS4</li>
                                    <li>انسخ الملف إلى محرك أقراص USB</li>
                                    <li>قم بتوصيل محرك الأقراص بجهاز PS4</li>
                                    <li>افتح متصفح الإنترنت على PS4</li>
                                    <li>انتقل إلى صفحة الجيلبريك</li>
                                    <li>اتبع التعليمات على الشاشة لتثبيت GOLDHEN</li>
                                </ol>
                            </div>
                            
                            <div class="installation-tab-pane" id="ps5-install">
                                <ol>
                                    <li>قم بتحميل ملف GOLDHEN لـ PS5</li>
                                    <li>انسخ الملف إلى محرك أقراص USB</li>
                                    <li>قم بتوصيل محرك الأقراص بجهاز PS5</li>
                                    <li>افتح متصفح الإنترنت على PS5</li>
                                    <li>انتقل إلى صفحة الجيلبريك</li>
                                    <li>اتبع التعليمات على الشاشة لتثبيت GOLDHEN</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // تفعيل علامات تبويب التثبيت
            initInstallationTabs();
        }, 1000);
    }
    
    // دالة لتفعيل علامات تبويب التثبيت
    function initInstallationTabs() {
        const installationTabsNav = document.querySelector('.installation-tabs-nav');
        if (!installationTabsNav) return;
        
        const installationTabItems = installationTabsNav.querySelectorAll('li');
        const installationTabPanes = document.querySelectorAll('.installation-tab-pane');
        
        installationTabItems.forEach(item => {
            item.addEventListener('click', function() {
                // إزالة الفئة النشطة من جميع العناصر
                installationTabItems.forEach(tab => tab.classList.remove('active'));
                installationTabPanes.forEach(pane => pane.classList.remove('active'));
                
                // إضافة الفئة النشطة للعنصر المحدد
                this.classList.add('active');
                
                // تنشيط المحتوى المقابل
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // ========== تحميل المحتوى حسب الصفحة ==========
    
    // تحديد الصفحة الحالية وتحميل المحتوى المناسب
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'index.html':
        case '':
            // الصفحة الرئيسية
            break;
            
        case 'ps4-games.html':
            // صفحة ألعاب PS4
            loadGames('PS4', 'ps4-games-container', 8);
            break;
            
        case 'ps5-games.html':
            // صفحة ألعاب PS5
            loadGames('PS5', 'ps5-games-container', 8);
            break;
            
        case 'game-details.html':
            // صفحة تفاصيل اللعبة
            loadGameDetails();
            break;
            
        case 'jailbreak.html':
            // صفحة الجيلبريك
            loadGoldhenSection();
            break;
    }
    
    // ========== وظائف الأمان البسيطة ==========
    
    // دالة للتحقق من محاولات الاختراق البسيطة
    function checkSecurity() {
        // التحقق من محاولات XSS البسيطة في معلمات URL
        const urlParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlParams.entries()) {
            if (value.includes('<script>') || value.includes('javascript:')) {
                console.error('محاولة XSS محتملة تم اكتشافها!');
                // يمكن إعادة توجيه المستخدم إلى صفحة آمنة
                // window.location.href = 'index.html';
                break;
            }
        }
        
        // التحقق من وجود إطار iframe
        if (window.self !== window.top) {
            console.error('محاولة clickjacking محتملة تم اكتشافها!');
            // يمكن منع عرض الموقع داخل إطار
            // window.top.location = window.self.location;
        }
    }
    
    // تنفيذ فحص الأمان
    checkSecurity();
});

// ========== وظائف إدارة المحتوى المحلي ==========

// دالة لحفظ البيانات محلياً
function saveLocalData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('خطأ في حفظ البيانات محلياً:', error);
        return false;
    }
}

// دالة لاسترجاع البيانات المحلية
function getLocalData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('خطأ في استرجاع البيانات المحلية:', error);
        return null;
    }
}

// دالة لإضافة لعبة جديدة (للمسؤولين فقط)
function addNewGame(gameData) {
    // التحقق من صلاحيات المستخدم (للعرض التوضيحي فقط)
    const isAdmin = getLocalData('isAdmin');
    if (!isAdmin) {
        alert('ليس لديك صلاحيات كافية لإضافة لعبة جديدة');
        return false;
    }
    
    // الحصول على قائمة الألعاب الحالية
    let games = getLocalData('games') || [];
    
    // إضافة معرف فريد للعبة الجديدة
    gameData.id = Date.now();
    gameData.dateAdded = new Date().toISOString();
    
    // إضافة اللعبة الجديدة إلى القائمة
    games.push(gameData);
    
    // حفظ القائمة المحدثة
    return saveLocalData('games', games);
}

// دالة لتحديث لعبة موجودة (للمسؤولين فقط)
function updateGame(gameId, gameData) {
    // التحقق من صلاحيات المستخدم (للعرض التوضيحي فقط)
    const isAdmin = getLocalData('isAdmin');
    if (!isAdmin) {
        alert('ليس لديك صلاحيات كافية لتحديث اللعبة');
        return false;
    }
    
    // الحصول على قائمة الألعاب الحالية
    let games = getLocalData('games') || [];
    
    // البحث عن اللعبة المطلوبة
    const gameIndex = games.findIndex(game => game.id === gameId);
    if (gameIndex === -1) {
        alert('اللعبة غير موجودة');
        return false;
    }
    
    // تحديث بيانات اللعبة
    games[gameIndex] = { ...games[gameIndex], ...gameData, dateUpdated: new Date().toISOString() };
    
    // حفظ القائمة المحدثة
    return saveLocalData('games', games);
}

// دالة لحذف لعبة (للمسؤولين فقط)
function deleteGame(gameId) {
    // التحقق من صلاحيات المستخدم (للعرض التوضيحي فقط)
    const isAdmin = getLocalData('isAdmin');
    if (!isAdmin) {
        alert('ليس لديك صلاحيات كافية لحذف اللعبة');
        return false;
    }
    
    // الحصول على قائمة الألعاب الحالية
    let games = getLocalData('games') || [];
    
    // حذف اللعبة المطلوبة
    games = games.filter(game => game.id !== gameId);
    
    // حفظ القائمة المحدثة
    return saveLocalData('games', games);
}
