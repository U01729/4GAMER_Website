/**
 * 4GAMER Website - Test Functions
 * وظائف اختبار موقع 4GAMER
 */

// تهيئة وظائف الاختبار عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    // اختبار تحميل الصور الخارجية
    testExternalImages();
    
    // اختبار روابط التحميل
    testDownloadLinks();
    
    // اختبار وظائف البحث
    testSearchFunctionality();
    
    // اختبار تبديل السمة
    testThemeToggle();
    
    // اختبار القائمة المنسدلة
    testDropdownMenu();
    
    // اختبار عداد الزوار
    testVisitorCounter();
    
    // اختبار التصميم المتجاوب
    testResponsiveDesign();
    
    // اختبار وظائف إدارة المحتوى
    testContentManagement();
    
    // اختبار ميزات الأمان
    testSecurityFeatures();
    
    // عرض نتائج الاختبار
    displayTestResults();
});

// متغير عام لتخزين نتائج الاختبار
const testResults = {
    externalImages: { status: 'pending', message: 'لم يتم الاختبار بعد' },
    downloadLinks: { status: 'pending', message: 'لم يتم الاختبار بعد' },
    searchFunctionality: { status: 'pending', message: 'لم يتم الاختبار بعد' },
    themeToggle: { status: 'pending', message: 'لم يتم الاختبار بعد' },
    dropdownMenu: { status: 'pending', message: 'لم يتم الاختبار بعد' },
    visitorCounter: { status: 'pending', message: 'لم يتم الاختبار بعد' },
    responsiveDesign: { status: 'pending', message: 'لم يتم الاختبار بعد' },
    contentManagement: { status: 'pending', message: 'لم يتم الاختبار بعد' },
    securityFeatures: { status: 'pending', message: 'لم يتم الاختبار بعد' }
};

// دالة اختبار تحميل الصور الخارجية
function testExternalImages() {
    try {
        // التحقق من وجود دالة تحميل الصور الخارجية
        if (typeof loadExternalImages === 'function') {
            // التحقق من وجود عناصر تحميل الصور الخارجية
            const externalImageElements = document.querySelectorAll('[data-external-image]');
            
            if (externalImageElements.length > 0) {
                // اختبار تحميل صورة واحدة على الأقل
                const testElement = externalImageElements[0];
                const imageUrl = testElement.getAttribute('data-external-image');
                
                if (imageUrl) {
                    // إنشاء عنصر صورة للاختبار
                    const testImage = new Image();
                    
                    testImage.onload = function() {
                        testResults.externalImages = { status: 'success', message: 'تم تحميل الصور الخارجية بنجاح' };
                        updateTestResultDisplay('externalImages');
                    };
                    
                    testImage.onerror = function() {
                        testResults.externalImages = { status: 'warning', message: 'فشل تحميل بعض الصور الخارجية، تأكد من صحة الروابط' };
                        updateTestResultDisplay('externalImages');
                    };
                    
                    testImage.src = imageUrl;
                } else {
                    testResults.externalImages = { status: 'warning', message: 'تم العثور على عناصر صور خارجية ولكن بدون روابط' };
                    updateTestResultDisplay('externalImages');
                }
            } else {
                testResults.externalImages = { status: 'info', message: 'لم يتم العثور على عناصر صور خارجية في الصفحة الحالية' };
                updateTestResultDisplay('externalImages');
            }
        } else {
            testResults.externalImages = { status: 'error', message: 'دالة تحميل الصور الخارجية غير موجودة' };
            updateTestResultDisplay('externalImages');
        }
    } catch (error) {
        testResults.externalImages = { status: 'error', message: 'حدث خطأ أثناء اختبار تحميل الصور الخارجية: ' + error.message };
        updateTestResultDisplay('externalImages');
    }
}

// دالة اختبار روابط التحميل
function testDownloadLinks() {
    try {
        // التحقق من وجود روابط التحميل
        const downloadLinks = document.querySelectorAll('.download-btn, .goldhen-download-btn');
        
        if (downloadLinks.length > 0) {
            // التحقق من صحة الروابط
            let validLinks = 0;
            
            downloadLinks.forEach(link => {
                const href = link.getAttribute('href');
                
                if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                    validLinks++;
                }
            });
            
            if (validLinks === downloadLinks.length) {
                testResults.downloadLinks = { status: 'success', message: 'جميع روابط التحميل صحيحة' };
            } else if (validLinks > 0) {
                testResults.downloadLinks = { status: 'warning', message: `${validLinks} من ${downloadLinks.length} روابط التحميل صحيحة` };
            } else {
                testResults.downloadLinks = { status: 'error', message: 'جميع روابط التحميل غير صحيحة' };
            }
        } else {
            testResults.downloadLinks = { status: 'info', message: 'لم يتم العثور على روابط تحميل في الصفحة الحالية' };
        }
        
        updateTestResultDisplay('downloadLinks');
    } catch (error) {
        testResults.downloadLinks = { status: 'error', message: 'حدث خطأ أثناء اختبار روابط التحميل: ' + error.message };
        updateTestResultDisplay('downloadLinks');
    }
}

// دالة اختبار وظائف البحث
function testSearchFunctionality() {
    try {
        // التحقق من وجود عناصر البحث
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        
        if (searchInput && searchResults) {
            // التحقق من وجود دالة البحث
            if (typeof initSearch === 'function' || typeof performSearch === 'function') {
                testResults.searchFunctionality = { status: 'success', message: 'وظائف البحث موجودة وجاهزة للاستخدام' };
            } else {
                testResults.searchFunctionality = { status: 'warning', message: 'عناصر البحث موجودة ولكن دالة البحث غير موجودة' };
            }
        } else {
            testResults.searchFunctionality = { status: 'info', message: 'لم يتم العثور على عناصر البحث في الصفحة الحالية' };
        }
        
        updateTestResultDisplay('searchFunctionality');
    } catch (error) {
        testResults.searchFunctionality = { status: 'error', message: 'حدث خطأ أثناء اختبار وظائف البحث: ' + error.message };
        updateTestResultDisplay('searchFunctionality');
    }
}

// دالة اختبار تبديل السمة
function testThemeToggle() {
    try {
        // التحقق من وجود زر تبديل السمة
        const themeToggle = document.getElementById('theme-toggle');
        
        if (themeToggle) {
            // التحقق من وجود دالة تبديل السمة
            if (typeof toggleTheme === 'function') {
                // اختبار تبديل السمة
                const initialTheme = document.documentElement.getAttribute('data-theme');
                
                // محاكاة النقر على زر تبديل السمة
                themeToggle.click();
                
                // التحقق من تغيير السمة
                const newTheme = document.documentElement.getAttribute('data-theme');
                
                if (initialTheme !== newTheme) {
                    testResults.themeToggle = { status: 'success', message: 'تبديل السمة يعمل بشكل صحيح' };
                } else {
                    testResults.themeToggle = { status: 'warning', message: 'زر تبديل السمة موجود ولكن لا يغير السمة' };
                }
                
                // إعادة السمة إلى الوضع الأصلي
                if (initialTheme !== newTheme) {
                    themeToggle.click();
                }
            } else {
                testResults.themeToggle = { status: 'warning', message: 'زر تبديل السمة موجود ولكن دالة تبديل السمة غير موجودة' };
            }
        } else {
            testResults.themeToggle = { status: 'info', message: 'لم يتم العثور على زر تبديل السمة في الصفحة الحالية' };
        }
        
        updateTestResultDisplay('themeToggle');
    } catch (error) {
        testResults.themeToggle = { status: 'error', message: 'حدث خطأ أثناء اختبار تبديل السمة: ' + error.message };
        updateTestResultDisplay('themeToggle');
    }
}

// دالة اختبار القائمة المنسدلة
function testDropdownMenu() {
    try {
        // التحقق من وجود عناصر القائمة المنسدلة
        const menuToggle = document.getElementById('menu-toggle');
        const dropdownMenu = document.getElementById('dropdown-menu');
        
        if (menuToggle && dropdownMenu) {
            // التحقق من وجود دالة فتح/إغلاق القائمة
            if (typeof toggleDropdownMenu === 'function' || typeof openDropdownMenu === 'function' || typeof closeDropdownMenu === 'function') {
                testResults.dropdownMenu = { status: 'success', message: 'القائمة المنسدلة موجودة وجاهزة للاستخدام' };
            } else {
                testResults.dropdownMenu = { status: 'warning', message: 'عناصر القائمة المنسدلة موجودة ولكن دوال التحكم غير موجودة' };
            }
        } else {
            testResults.dropdownMenu = { status: 'info', message: 'لم يتم العثور على عناصر القائمة المنسدلة في الصفحة الحالية' };
        }
        
        updateTestResultDisplay('dropdownMenu');
    } catch (error) {
        testResults.dropdownMenu = { status: 'error', message: 'حدث خطأ أثناء اختبار القائمة المنسدلة: ' + error.message };
        updateTestResultDisplay('dropdownMenu');
    }
}

// دالة اختبار عداد الزوار
function testVisitorCounter() {
    try {
        // التحقق من وجود عناصر عداد الزوار
        const visitorCountElement = document.getElementById('visitor-count');
        const aboutVisitorCountElement = document.getElementById('about-visitor-count');
        
        if (visitorCountElement || aboutVisitorCountElement) {
            // التحقق من وجود دالة عداد الزوار
            if (typeof displayVisitorCount === 'function') {
                // التحقق من وجود قيمة عداد الزوار في التخزين المحلي
                const visitorCount = localStorage.getItem('visitor_count');
                
                if (visitorCount) {
                    testResults.visitorCounter = { status: 'success', message: 'عداد الزوار يعمل بشكل صحيح' };
                } else {
                    testResults.visitorCounter = { status: 'warning', message: 'عداد الزوار موجود ولكن لم يتم تخزين قيمة العداد' };
                }
            } else {
                testResults.visitorCounter = { status: 'warning', message: 'عناصر عداد الزوار موجودة ولكن دالة عداد الزوار غير موجودة' };
            }
        } else {
            testResults.visitorCounter = { status: 'info', message: 'لم يتم العثور على عناصر عداد الزوار في الصفحة الحالية' };
        }
        
        updateTestResultDisplay('visitorCounter');
    } catch (error) {
        testResults.visitorCounter = { status: 'error', message: 'حدث خطأ أثناء اختبار عداد الزوار: ' + error.message };
        updateTestResultDisplay('visitorCounter');
    }
}

// دالة اختبار التصميم المتجاوب
function testResponsiveDesign() {
    try {
        // التحقق من وجود ملف CSS للتصميم المتجاوب
        const responsiveStylesheet = Array.from(document.styleSheets).find(sheet => {
            return sheet.href && sheet.href.includes('responsive.css');
        });
        
        if (responsiveStylesheet) {
            // التحقق من وجود قواعد وسائط متعددة
            let mediaQueryRules = 0;
            
            try {
                // محاولة الوصول إلى قواعد CSS
                const rules = responsiveStylesheet.cssRules || responsiveStylesheet.rules;
                
                for (let i = 0; i < rules.length; i++) {
                    if (rules[i].type === CSSRule.MEDIA_RULE) {
                        mediaQueryRules++;
                    }
                }
                
                if (mediaQueryRules > 0) {
                    testResults.responsiveDesign = { status: 'success', message: `تم العثور على ${mediaQueryRules} قاعدة وسائط متعددة للتصميم المتجاوب` };
                } else {
                    testResults.responsiveDesign = { status: 'warning', message: 'ملف التصميم المتجاوب موجود ولكن لا يحتوي على قواعد وسائط متعددة' };
                }
            } catch (securityError) {
                // في حالة وجود قيود أمنية على الوصول إلى قواعد CSS
                testResults.responsiveDesign = { status: 'info', message: 'ملف التصميم المتجاوب موجود ولكن لا يمكن التحقق من قواعد الوسائط المتعددة بسبب قيود الأمان' };
            }
        } else {
            // التحقق من وجود قواعد وسائط متعددة مضمنة
            const allStylesheets = Array.from(document.styleSheets);
            let inlineMediaQueryRules = 0;
            
            for (const sheet of allStylesheets) {
                try {
                    const rules = sheet.cssRules || sheet.rules;
                    
                    for (let i = 0; i < rules.length; i++) {
                        if (rules[i].type === CSSRule.MEDIA_RULE) {
                            inlineMediaQueryRules++;
                        }
                    }
                } catch (securityError) {
                    // تجاهل أخطاء الأمان
                }
            }
            
            if (inlineMediaQueryRules > 0) {
                testResults.responsiveDesign = { status: 'success', message: `تم العثور على ${inlineMediaQueryRules} قاعدة وسائط متعددة مضمنة للتصميم المتجاوب` };
            } else {
                testResults.responsiveDesign = { status: 'warning', message: 'لم يتم العثور على ملف التصميم المتجاوب أو قواعد وسائط متعددة مضمنة' };
            }
        }
        
        // التحقق من وجود وسم الإعداد المناسب
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        
        if (!viewportMeta) {
            testResults.responsiveDesign = { status: 'error', message: 'وسم الإعداد للعرض المتجاوب غير موجود' };
        } else if (!viewportMeta.content.includes('width=device-width')) {
            testResults.responsiveDesign = { status: 'warning', message: 'وسم الإعداد للعرض المتجاوب موجود ولكن لا يحتوي على إعداد عرض الجهاز' };
        }
        
        updateTestResultDisplay('responsiveDesign');
    } catch (error) {
        testResults.responsiveDesign = { status: 'error', message: 'حدث خطأ أثناء اختبار التصميم المتجاوب: ' + error.message };
        updateTestResultDisplay('responsiveDesign');
    }
}

// دالة اختبار وظائف إدارة المحتوى
function testContentManagement() {
    try {
        // التحقق من وجود دوال إدارة المحتوى
        if (typeof saveContent === 'function' && typeof updateContentDisplay === 'function') {
            // التحقق من وجود بيانات المحتوى في التخزين المحلي
            const contentData = localStorage.getItem('4gamer_content');
            
            if (contentData) {
                try {
                    // التحقق من صحة بيانات المحتوى
                    const parsedData = JSON.parse(contentData);
                    
                    if (parsedData && typeof parsedData === 'object') {
                        // التحقق من وجود أنواع المحتوى المطلوبة
                        const requiredTypes = ['games', 'themes', 'apps', 'updates', 'tutorials', 'news'];
                        const missingTypes = requiredTypes.filter(type => !parsedData[type]);
                        
                        if (missingTypes.length === 0) {
                            testResults.contentManagement = { status: 'success', message: 'وظائف إدارة المحتوى تعمل بشكل صحيح' };
                        } else {
                            testResults.contentManagement = { status: 'warning', message: `وظائف إدارة المحتوى موجودة ولكن بعض أنواع المحتوى غير موجودة: ${missingTypes.join(', ')}` };
                        }
                    } else {
                        testResults.contentManagement = { status: 'warning', message: 'بيانات المحتوى موجودة ولكن ليست بالتنسيق الصحيح' };
                    }
                } catch (parseError) {
                    testResults.contentManagement = { status: 'error', message: 'فشل تحليل بيانات المحتوى: ' + parseError.message };
                }
            } else {
                testResults.contentManagement = { status: 'warning', message: 'دوال إدارة المحتوى موجودة ولكن لم يتم تخزين بيانات المحتوى' };
            }
        } else {
            // التحقق من وجود نماذج إدارة المحتوى
            const contentForms = document.querySelectorAll('.content-form');
            
            if (contentForms.length > 0) {
                testResults.contentManagement = { status: 'warning', message: 'نماذج إدارة المحتوى موجودة ولكن دوال إدارة المحتوى غير موجودة' };
            } else {
                testResults.contentManagement = { status: 'info', message: 'لم يتم العثور على وظائف إدارة المحتوى في الصفحة الحالية' };
            }
        }
        
        updateTestResultDisplay('contentManagement');
    } catch (error) {
        testResults.contentManagement = { status: 'error', message: 'حدث خطأ أثناء اختبار وظائف إدارة المحتوى: ' + error.message };
        updateTestResultDisplay('contentManagement');
    }
}

// دالة اختبار ميزات الأمان
function testSecurityFeatures() {
    try {
        // التحقق من وجود دوال الأمان
        let securityFunctionsCount = 0;
        
        // قائمة بدوال الأمان المتوقعة
        const expectedSecurityFunctions = [
            'initFormProtection',
            'initLinkProtection',
            'initAntiTracking',
            'initExternalLinkCheck',
            'generateCSRFToken',
            'sanitizeInput',
            'validateEmail',
            'checkPasswordStrength'
        ];
        
        // التحقق من وجود كل دالة
        for (const funcName of expectedSecurityFunctions) {
            if (typeof window[funcName] === 'function') {
                securityFunctionsCount++;
            }
        }
        
        if (securityFunctionsCount === expectedSecurityFunctions.length) {
            testResults.securityFeatures = { status: 'success', message: 'جميع ميزات الأمان موجودة وجاهزة للاستخدام' };
        } else if (securityFunctionsCount > 0) {
            testResults.securityFeatures = { status: 'warning', message: `${securityFunctionsCount} من ${expectedSecurityFunctions.length} ميزات الأمان موجودة` };
        } else {
            // التحقق من وجود ملف JavaScript للأمان
            const securityScript = Array.from(document.scripts).find(script => {
                return script.src && script.src.includes('security.js');
            });
            
            if (securityScript) {
                testResults.securityFeatures = { status: 'warning', message: 'ملف الأمان موجود ولكن دوال الأمان غير متاحة' };
            } else {
                testResults.securityFeatures = { status: 'info', message: 'لم يتم العثور على ميزات الأمان في الصفحة الحالية' };
            }
        }
        
        // التحقق من وجود رموز CSRF في النماذج
        const forms = document.querySelectorAll('form');
        let formsWithCSRF = 0;
        
        forms.forEach(form => {
            const csrfInput = form.querySelector('input[name="csrf_token"]');
            
            if (csrfInput) {
                formsWithCSRF++;
            }
        });
        
        if (forms.length > 0 && formsWithCSRF === 0) {
            testResults.securityFeatures = { status: 'warning', message: 'النماذج موجودة ولكن لا تحتوي على رموز CSRF' };
        }
        
        // التحقق من سمات الروابط الخارجية
        const externalLinks = Array.from(document.links).filter(link => {
            return link.hostname !== window.location.hostname && link.hostname !== '';
        });
        
        let secureExternalLinks = 0;
        
        externalLinks.forEach(link => {
            if (link.rel.includes('noopener') && link.rel.includes('noreferrer')) {
                secureExternalLinks++;
            }
        });
        
        if (externalLinks.length > 0 && secureExternalLinks === 0) {
            testResults.securityFeatures = { status: 'warning', message: 'الروابط الخارجية موجودة ولكن لا تحتوي على سمات الأمان' };
        }
        
        updateTestResultDisplay('securityFeatures');
    } catch (error) {
        testResults.securityFeatures = { status: 'error', message: 'حدث خطأ أثناء اختبار ميزات الأمان: ' + error.message };
        updateTestResultDisplay('securityFeatures');
    }
}

// دالة تحديث عرض نتيجة اختبار
function updateTestResultDisplay(testName) {
    // التحقق من وجود عنصر عرض نتائج الاختبار
    const testResultElement = document.getElementById(`test-result-${testName}`);
    
    if (testResultElement) {
        // تحديث نص النتيجة
        testResultElement.textContent = testResults[testName].message;
        
        // تحديث لون النتيجة
        testResultElement.className = `test-result test-result-${testResults[testName].status}`;
    }
}

// دالة عرض نتائج الاختبار
function displayTestResults() {
    // التحقق من وجود عنصر عرض نتائج الاختبار
    const testResultsContainer = document.getElementById('test-results-container');
    
    if (!testResultsContainer) {
        // إنشاء عنصر عرض نتائج الاختبار
        const container = document.createElement('div');
        container.id = 'test-results-container';
        container.className = 'test-results-container';
        
        // إضافة عنوان
        const title = document.createElement('h2');
        title.textContent = 'نتائج اختبار الموقع';
        container.appendChild(title);
        
        // إضافة وصف
        const description = document.createElement('p');
        description.textContent = 'نتائج اختبار وظائف الموقع المختلفة. هذه النتائج مخصصة للمطورين فقط ولن تظهر للمستخدمين.';
        container.appendChild(description);
        
        // إضافة زر إغلاق
        const closeButton = document.createElement('button');
        closeButton.className = 'test-results-close';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.addEventListener('click', function() {
            container.style.display = 'none';
        });
        container.appendChild(closeButton);
        
        // إضافة قائمة النتائج
        const resultsList = document.createElement('ul');
        resultsList.className = 'test-results-list';
        
        // إضافة عنصر لكل اختبار
        for (const testName in testResults) {
            const listItem = document.createElement('li');
            listItem.className = 'test-result-item';
            
            const testTitle = document.createElement('div');
            testTitle.className = 'test-result-title';
            testTitle.textContent = getTestTitle(testName);
            listItem.appendChild(testTitle);
            
            const testResult = document.createElement('div');
            testResult.id = `test-result-${testName}`;
            testResult.className = `test-result test-result-${testResults[testName].status}`;
            testResult.textContent = testResults[testName].message;
            listItem.appendChild(testResult);
            
            resultsList.appendChild(listItem);
        }
        
        container.appendChild(resultsList);
        
        // إضافة أزرار الإجراءات
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'test-results-actions';
        
        // زر إعادة الاختبار
        const retestButton = document.createElement('button');
        retestButton.className = 'test-results-action test-results-retest';
        retestButton.textContent = 'إعادة الاختبار';
        retestButton.addEventListener('click', function() {
            // إعادة تعيين نتائج الاختبار
            for (const testName in testResults) {
                testResults[testName] = { status: 'pending', message: 'جاري الاختبار...' };
                updateTestResultDisplay(testName);
            }
            
            // إعادة تشغيل الاختبارات
            setTimeout(function() {
                testExternalImages();
                testDownloadLinks();
                testSearchFunctionality();
                testThemeToggle();
                testDropdownMenu();
                testVisitorCounter();
                testResponsiveDesign();
                testContentManagement();
                testSecurityFeatures();
            }, 100);
        });
        actionsContainer.appendChild(retestButton);
        
        // زر إخفاء النتائج
        const hideButton = document.createElement('button');
        hideButton.className = 'test-results-action test-results-hide';
        hideButton.textContent = 'إخفاء النتائج';
        hideButton.addEventListener('click', function() {
            container.style.display = 'none';
        });
        actionsContainer.appendChild(hideButton);
        
        container.appendChild(actionsContainer);
        
        // إضافة أنماط CSS
        const styles = document.createElement('style');
        styles.textContent = `
            .test-results-container {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-width: 90vw;
                max-height: 90vh;
                overflow-y: auto;
                background-color: var(--card-bg, #fff);
                border: 1px solid var(--border-color, #ddd);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 20px;
                z-index: 9999;
                direction: rtl;
                font-family: 'Tajawal', sans-serif;
            }
            
            .test-results-container h2 {
                margin-top: 0;
                margin-bottom: 10px;
                font-size: 1.5rem;
                color: var(--text-color, #333);
            }
            
            .test-results-container p {
                margin-bottom: 20px;
                color: var(--text-color, #666);
                font-size: 0.9rem;
            }
            
            .test-results-close {
                position: absolute;
                top: 15px;
                left: 15px;
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: var(--text-color, #666);
            }
            
            .test-results-list {
                list-style: none;
                padding: 0;
                margin: 0 0 20px 0;
            }
            
            .test-result-item {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 10px 0;
                border-bottom: 1px solid var(--border-color, #eee);
            }
            
            .test-result-title {
                font-weight: 500;
                margin-left: 10px;
                color: var(--text-color, #333);
            }
            
            .test-result {
                font-size: 0.9rem;
                padding: 4px 8px;
                border-radius: 4px;
                max-width: 60%;
            }
            
            .test-result-success {
                background-color: rgba(76, 175, 80, 0.1);
                color: #2e7d32;
            }
            
            .test-result-warning {
                background-color: rgba(255, 152, 0, 0.1);
                color: #ef6c00;
            }
            
            .test-result-error {
                background-color: rgba(244, 67, 54, 0.1);
                color: #d32f2f;
            }
            
            .test-result-info {
                background-color: rgba(33, 150, 243, 0.1);
                color: #1976d2;
            }
            
            .test-result-pending {
                background-color: rgba(158, 158, 158, 0.1);
                color: #616161;
            }
            
            .test-results-actions {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
            
            .test-results-action {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                font-family: 'Tajawal', sans-serif;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .test-results-retest {
                background-color: var(--primary-color, #4caf50);
                color: white;
            }
            
            .test-results-hide {
                background-color: var(--light-bg, #f5f5f5);
                color: var(--text-color, #333);
            }
            
            @media (max-width: 767px) {
                .test-results-container {
                    top: 10px;
                    right: 10px;
                    width: calc(100% - 20px);
                    max-width: none;
                }
                
                .test-result-item {
                    flex-direction: column;
                }
                
                .test-result-title {
                    margin-bottom: 5px;
                    margin-left: 0;
                }
                
                .test-result {
                    max-width: 100%;
                }
            }
        `;
        
        document.head.appendChild(styles);
        
        // إضافة العنصر إلى المستند
        document.body.appendChild(container);
    } else {
        // تحديث نتائج الاختبار
        for (const testName in testResults) {
            updateTestResultDisplay(testName);
        }
    }
}

// دالة الحصول على عنوان الاختبار
function getTestTitle(testName) {
    const titles = {
        externalImages: 'تحميل الصور الخارجية',
        downloadLinks: 'روابط التحميل',
        searchFunctionality: 'وظائف البحث',
        themeToggle: 'تبديل السمة',
        dropdownMenu: 'القائمة المنسدلة',
        visitorCounter: 'عداد الزوار',
        responsiveDesign: 'التصميم المتجاوب',
        contentManagement: 'إدارة المحتوى',
        securityFeatures: 'ميزات الأمان'
    };
    
    return titles[testName] || testName;
}

// تصدير الدوال للاستخدام العام
window.runTests = function() {
    testExternalImages();
    testDownloadLinks();
    testSearchFunctionality();
    testThemeToggle();
    testDropdownMenu();
    testVisitorCounter();
    testResponsiveDesign();
    testContentManagement();
    testSecurityFeatures();
    displayTestResults();
};
