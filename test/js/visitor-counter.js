/**
 * 4GAMER Website - Visitor Counter
 * عداد الزوار لموقع 4GAMER
 */

// تهيئة عداد الزوار عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    // تحديث عداد الزوار
    updateVisitorCounter();
    
    // عرض عداد الزوار في قسم "من نحن"
    displayVisitorCount();
});

// دالة تحديث عداد الزوار
function updateVisitorCounter() {
    // التحقق من وجود ملف تعريف ارتباط للزائر
    if (!getCookie('visitor_counted')) {
        // زيادة عدد الزوار في التخزين المحلي
        incrementVisitorCount();
        
        // تعيين ملف تعريف ارتباط لمنع العد المتكرر للزائر نفسه
        setCookie('visitor_counted', 'true', 30); // صالح لمدة 30 يوم
    }
}

// دالة زيادة عدد الزوار
function incrementVisitorCount() {
    // الحصول على العدد الحالي من التخزين المحلي
    let currentCount = localStorage.getItem('visitor_count');
    
    // إذا لم يكن هناك عدد مخزن، ابدأ من 1
    if (!currentCount) {
        currentCount = 1;
    } else {
        // زيادة العدد بمقدار 1
        currentCount = parseInt(currentCount) + 1;
    }
    
    // تخزين العدد الجديد في التخزين المحلي
    localStorage.setItem('visitor_count', currentCount);
    
    // في الإصدار النهائي، يمكن إرسال العدد إلى خادم لتخزينه بشكل دائم
    // sendVisitorCountToServer(currentCount);
}

// دالة عرض عدد الزوار
function displayVisitorCount() {
    // الحصول على العدد الحالي من التخزين المحلي
    let currentCount = localStorage.getItem('visitor_count');
    
    // إذا لم يكن هناك عدد مخزن، استخدم قيمة افتراضية
    if (!currentCount) {
        currentCount = 1;
        localStorage.setItem('visitor_count', currentCount);
    }
    
    // البحث عن عنصر عرض عدد الزوار
    const visitorCountElement = document.getElementById('visitor-count');
    
    // إذا وجد العنصر، قم بتحديث المحتوى
    if (visitorCountElement) {
        visitorCountElement.textContent = formatNumber(currentCount);
    }
    
    // البحث عن عنصر عرض عدد الزوار في قسم "من نحن"
    const aboutVisitorCountElement = document.getElementById('about-visitor-count');
    
    // إذا وجد العنصر، قم بتحديث المحتوى
    if (aboutVisitorCountElement) {
        aboutVisitorCountElement.textContent = formatNumber(currentCount);
    }
}

// دالة تنسيق الأرقام بإضافة فواصل للآلاف
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// دالة تعيين ملف تعريف ارتباط
function setCookie(name, value, days) {
    let expires = "";
    
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    
    document.cookie = name + "=" + value + expires + "; path=/";
}

// دالة الحصول على قيمة ملف تعريف ارتباط
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    
    return null;
}

// دالة إرسال عدد الزوار إلى الخادم (للإصدار النهائي)
function sendVisitorCountToServer(count) {
    // في الإصدار النهائي، يمكن استخدام هذه الدالة لإرسال العدد إلى خادم
    // لتخزينه بشكل دائم. هذا مجرد مثال وليس جزءًا من التنفيذ الحالي.
    
    /*
    fetch('/api/visitor-count', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: count }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('تم تحديث عدد الزوار بنجاح:', data);
    })
    .catch((error) => {
        console.error('خطأ في تحديث عدد الزوار:', error);
    });
    */
}

// تصدير الدوال للاستخدام العام
window.displayVisitorCount = displayVisitorCount;
window.formatNumber = formatNumber;
