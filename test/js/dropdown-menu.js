/**
 * 4GAMER Website - Dropdown Menu Functionality
 * وظائف القائمة المنسدلة لموقع 4GAMER
 */

// تهيئة القائمة المنسدلة عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    initDropdownMenu();
});

// دالة تهيئة القائمة المنسدلة
function initDropdownMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownBackdrop = document.getElementById('dropdown-backdrop');
    const dropdownClose = document.getElementById('dropdown-close');
    const dropdownItems = document.querySelectorAll('.dropdown-link');
    
    if (!menuToggle || !dropdownMenu || !dropdownBackdrop || !dropdownClose) return;
    
    // فتح القائمة المنسدلة
    menuToggle.addEventListener('click', function() {
        dropdownMenu.classList.add('active');
        dropdownBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden'; // منع التمرير في الصفحة الرئيسية
    });
    
    // إغلاق القائمة المنسدلة
    function closeDropdownMenu() {
        dropdownMenu.classList.remove('active');
        dropdownBackdrop.classList.remove('active');
        document.body.style.overflow = ''; // السماح بالتمرير مرة أخرى
    }
    
    dropdownClose.addEventListener('click', closeDropdownMenu);
    dropdownBackdrop.addEventListener('click', closeDropdownMenu);
    
    // تفعيل القوائم الفرعية
    dropdownItems.forEach(item => {
        const hasSubmenu = item.nextElementSibling && item.nextElementSibling.classList.contains('dropdown-submenu');
        
        if (hasSubmenu) {
            const arrow = item.querySelector('.dropdown-arrow');
            const submenu = item.nextElementSibling;
            
            item.addEventListener('click', function(e) {
                e.preventDefault(); // منع الانتقال إلى الرابط
                
                // تبديل حالة القائمة الفرعية
                const isActive = submenu.classList.contains('active');
                
                // إغلاق جميع القوائم الفرعية الأخرى
                document.querySelectorAll('.dropdown-submenu.active').forEach(sub => {
                    if (sub !== submenu) {
                        sub.classList.remove('active');
                        const otherArrow = sub.previousElementSibling.querySelector('.dropdown-arrow');
                        if (otherArrow) otherArrow.classList.remove('active');
                    }
                });
                
                // تبديل حالة القائمة الفرعية الحالية
                if (isActive) {
                    submenu.classList.remove('active');
                    arrow.classList.remove('active');
                } else {
                    submenu.classList.add('active');
                    arrow.classList.add('active');
                }
            });
        }
    });
    
    // إغلاق القائمة المنسدلة عند النقر على رابط في القائمة الفرعية
    const sublinks = document.querySelectorAll('.dropdown-sublink');
    sublinks.forEach(link => {
        link.addEventListener('click', function() {
            closeDropdownMenu();
        });
    });
}
