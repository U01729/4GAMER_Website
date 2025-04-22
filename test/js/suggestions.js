/**
 * 4GAMER Website - Suggestions System
 * نظام الاقتراحات لموقع 4GAMER
 */

// تهيئة نظام الاقتراحات عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام الاقتراحات
    initSuggestionSystem();
    
    // عرض الاقتراحات المقبولة
    displayAcceptedSuggestions();
    
    // معالجة نموذج الاقتراح
    setupSuggestionForm();
});

// دالة تهيئة نظام الاقتراحات
function initSuggestionSystem() {
    // التحقق من وجود بيانات الاقتراحات في التخزين المحلي
    if (!localStorage.getItem('4gamer_suggestions')) {
        // إنشاء هيكل بيانات فارغ مع بعض الاقتراحات المقبولة كأمثلة
        const initialData = {
            suggestions: [],
            acceptedSuggestions: [
                {
                    id: 'example1',
                    type: 'game',
                    platform: 'ps5',
                    title: 'God of War Ragnarök',
                    description: 'إضافة النسخة المعربة من لعبة God of War Ragnarök مع جميع التحديثات والإضافات.',
                    link: '',
                    name: 'محمد أحمد',
                    email: 'example@example.com',
                    notes: '',
                    date: '2025-03-15T10:30:00.000Z',
                    status: 'implemented'
                },
                {
                    id: 'example2',
                    type: 'tool',
                    platform: 'ps4',
                    title: 'أداة نقل الألعاب بين الأجهزة',
                    description: 'أداة تسهل نقل الألعاب والبيانات المحفوظة بين أجهزة PS4 المختلفة دون الحاجة إلى إعادة التحميل.',
                    link: '',
                    name: 'سارة خالد',
                    email: 'example2@example.com',
                    notes: '',
                    date: '2025-03-20T14:45:00.000Z',
                    status: 'approved'
                },
                {
                    id: 'example3',
                    type: 'theme',
                    platform: 'both',
                    title: 'ثيم رمضان 2025',
                    description: 'ثيم خاص بشهر رمضان المبارك يتضمن خلفيات وأيقونات مميزة.',
                    link: '',
                    name: 'عبدالله محمد',
                    email: 'example3@example.com',
                    notes: '',
                    date: '2025-04-01T09:15:00.000Z',
                    status: 'implemented'
                }
            ]
        };
        
        // حفظ هيكل البيانات في التخزين المحلي
        localStorage.setItem('4gamer_suggestions', JSON.stringify(initialData));
    }
}

// دالة إعداد نموذج الاقتراح
function setupSuggestionForm() {
    const suggestionForm = document.getElementById('suggestion-form');
    
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق من صحة النموذج
            const requiredFields = suggestionForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                alert('يرجى ملء جميع الحقول المطلوبة.');
                return;
            }
            
            // جمع بيانات النموذج
            const formData = new FormData(suggestionForm);
            const suggestionData = {};
            
            for (const [key, value] of formData.entries()) {
                suggestionData[key] = value;
            }
            
            // إضافة معلومات إضافية
            suggestionData.id = generateUniqueId();
            suggestionData.date = new Date().toISOString();
            suggestionData.status = 'pending';
            
            // حفظ الاقتراح
            saveSuggestion(suggestionData);
            
            // إعادة تعيين النموذج
            suggestionForm.reset();
            
            // عرض رسالة نجاح
            alert('تم إرسال اقتراحك بنجاح. سيتم مراجعته من قبل فريق الموقع في أقرب وقت ممكن.');
        });
    }
}

// دالة حفظ الاقتراح
function saveSuggestion(suggestionData) {
    // الحصول على بيانات الاقتراحات الحالية
    const suggestionsData = JSON.parse(localStorage.getItem('4gamer_suggestions'));
    
    // إضافة الاقتراح الجديد
    suggestionsData.suggestions.push(suggestionData);
    
    // حفظ البيانات المحدثة
    localStorage.setItem('4gamer_suggestions', JSON.stringify(suggestionsData));
}

// دالة عرض الاقتراحات المقبولة
function displayAcceptedSuggestions() {
    // الحصول على بيانات الاقتراحات الحالية
    const suggestionsData = JSON.parse(localStorage.getItem('4gamer_suggestions'));
    
    // الحصول على عنصر قائمة الاقتراحات
    const suggestionsList = document.getElementById('suggestions-list');
    
    if (suggestionsList) {
        // التحقق من وجود اقتراحات مقبولة
        if (suggestionsData.acceptedSuggestions.length === 0) {
            suggestionsList.innerHTML = '<div class="no-suggestions">لا توجد اقتراحات مقبولة حالياً</div>';
            return;
        }
        
        // ترتيب الاقتراحات المقبولة حسب التاريخ (الأحدث أولاً)
        const sortedSuggestions = [...suggestionsData.acceptedSuggestions].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // إنشاء HTML لكل اقتراح مقبول
        let html = '';
        
        sortedSuggestions.forEach(suggestion => {
            html += createSuggestionItemHTML(suggestion);
        });
        
        // تحديث عنصر قائمة الاقتراحات
        suggestionsList.innerHTML = html;
    }
}

// دالة إنشاء HTML لعنصر اقتراح
function createSuggestionItemHTML(suggestion) {
    // تحديد نص نوع الاقتراح
    let typeText = '';
    switch (suggestion.type) {
        case 'game':
            typeText = 'لعبة';
            break;
        case 'theme':
            typeText = 'ثيم';
            break;
        case 'app':
            typeText = 'تطبيق';
            break;
        case 'tool':
            typeText = 'أداة';
            break;
        default:
            typeText = 'أخرى';
    }
    
    // تحديد نص المنصة
    let platformText = '';
    switch (suggestion.platform) {
        case 'ps4':
            platformText = 'PS4';
            break;
        case 'ps5':
            platformText = 'PS5';
            break;
        case 'both':
            platformText = 'PS4 و PS5';
            break;
        default:
            platformText = '';
    }
    
    // تحديد نص الحالة
    let statusText = '';
    let statusClass = '';
    switch (suggestion.status) {
        case 'pending':
            statusText = 'قيد المراجعة';
            statusClass = 'status-pending';
            break;
        case 'approved':
            statusText = 'تمت الموافقة';
            statusClass = 'status-approved';
            break;
        case 'rejected':
            statusText = 'تم الرفض';
            statusClass = 'status-rejected';
            break;
        case 'implemented':
            statusText = 'تم التنفيذ';
            statusClass = 'status-implemented';
            break;
        default:
            statusText = 'قيد المراجعة';
            statusClass = 'status-pending';
    }
    
    // إنشاء HTML لعنصر الاقتراح
    return `
        <div class="suggestion-item" data-id="${suggestion.id}">
            <div class="suggestion-header">
                <h3 class="suggestion-title">${suggestion.title}</h3>
                <span class="suggestion-type">${typeText}</span>
            </div>
            <div class="suggestion-meta">
                <span><i class="fab fa-playstation"></i> ${platformText}</span>
                <span><i class="far fa-calendar-alt"></i> ${formatDate(suggestion.date)}</span>
                <span><i class="far fa-user"></i> ${suggestion.name}</span>
            </div>
            <p class="suggestion-description">${suggestion.description}</p>
            <span class="suggestion-status ${statusClass}">${statusText}</span>
        </div>
    `;
}

// دالة توليد معرف فريد
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// دالة تنسيق التاريخ
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// تصدير الدوال للاستخدام العام
window.saveSuggestion = saveSuggestion;
window.displayAcceptedSuggestions = displayAcceptedSuggestions;
