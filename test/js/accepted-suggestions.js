/**
 * 4GAMER - نظام إدارة الاقتراحات المقبولة
 * يتضمن عرض الاقتراحات، التصويت، التصفية، والإحصائيات
 */

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة البيانات
    initSuggestionSystem();
    
    // إضافة مستمعات الأحداث
    setupEventListeners();
    
    // عرض الإحصائيات
    updateStatistics();
    
    // عرض الاقتراحات ذات الأولوية
    loadPrioritySuggestions();
    
    // عرض جميع الاقتراحات
    loadAllSuggestions();
});

/**
 * تهيئة نظام الاقتراحات
 */
function initSuggestionSystem() {
    // التحقق من وجود بيانات اختبار وإنشائها إذا لم تكن موجودة
    if (!localStorage.getItem('4gamer_suggestions')) {
        createSampleSuggestions();
    }
    
    // تهيئة نظام التصويت إذا لم يكن موجوداً
    if (!localStorage.getItem('4gamer_votes')) {
        localStorage.setItem('4gamer_votes', JSON.stringify({}));
    }
    
    // تهيئة الصفحة الحالية
    window.currentPage = 1;
    window.itemsPerPage = 5;
    window.currentFilters = {
        type: 'all',
        status: 'all',
        sort: 'date-desc',
        search: ''
    };
}

/**
 * إعداد مستمعات الأحداث
 */
function setupEventListeners() {
    // مستمعات أزرار التصفية
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // مستمع زر البحث
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchInput = document.getElementById('searchSuggestions');
            window.currentFilters.search = searchInput.value.trim();
            loadAllSuggestions();
        });
    }
    
    // مستمع حقل البحث (للبحث عند الضغط على Enter)
    const searchInput = document.getElementById('searchSuggestions');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                window.currentFilters.search = searchInput.value.trim();
                loadAllSuggestions();
            }
        });
    }
    
    // مستمع زر عرض كل الاقتراحات ذات الأولوية
    const viewAllPriorityBtn = document.getElementById('viewAllPriority');
    if (viewAllPriorityBtn) {
        viewAllPriorityBtn.addEventListener('click', function() {
            window.currentFilters.status = 'priority';
            
            // تحديث قائمة التصفية في واجهة المستخدم
            const filterStatusSelect = document.getElementById('filterStatus');
            if (filterStatusSelect) {
                filterStatusSelect.value = 'priority';
            }
            
            loadAllSuggestions();
            
            // التمرير إلى قسم جميع الاقتراحات
            document.querySelector('.all-suggestions').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // مستمع إغلاق النافذة المنبثقة
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    const suggestionModal = document.getElementById('suggestionModal');
    if (suggestionModal) {
        suggestionModal.addEventListener('click', function(e) {
            if (e.target === suggestionModal) {
                closeModal();
            }
        });
    }
}

/**
 * تحديث إحصائيات الاقتراحات
 */
function updateStatistics() {
    const suggestions = getSuggestions();
    
    // إجمالي الاقتراحات
    const totalSuggestionsElement = document.getElementById('totalSuggestions');
    if (totalSuggestionsElement) {
        totalSuggestionsElement.textContent = suggestions.length;
    }
    
    // الاقتراحات المقبولة
    const acceptedSuggestions = suggestions.filter(suggestion => 
        suggestion.status === 'approved' || 
        suggestion.status === 'in-progress' || 
        suggestion.status === 'implemented' ||
        suggestion.status === 'priority'
    );
    
    const acceptedSuggestionsElement = document.getElementById('acceptedSuggestions');
    if (acceptedSuggestionsElement) {
        acceptedSuggestionsElement.textContent = acceptedSuggestions.length;
    }
    
    // الاقتراحات التي تم تنفيذها
    const implementedSuggestions = suggestions.filter(suggestion => 
        suggestion.status === 'implemented'
    );
    
    const implementedSuggestionsElement = document.getElementById('implementedSuggestions');
    if (implementedSuggestionsElement) {
        implementedSuggestionsElement.textContent = implementedSuggestions.length;
    }
    
    // اقتراحات هذا الشهر
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const monthlySuggestions = suggestions.filter(suggestion => {
        const suggestionDate = new Date(suggestion.date);
        return suggestionDate >= firstDayOfMonth;
    });
    
    const monthlySuggestionsElement = document.getElementById('monthlySuggestions');
    if (monthlySuggestionsElement) {
        monthlySuggestionsElement.textContent = monthlySuggestions.length;
    }
}

/**
 * تحميل الاقتراحات ذات الأولوية
 */
function loadPrioritySuggestions() {
    const suggestions = getSuggestions();
    
    // الحصول على الاقتراحات ذات الأولوية
    const prioritySuggestions = suggestions.filter(suggestion => 
        suggestion.status === 'priority'
    ).sort((a, b) => getVotesCount(b.id) - getVotesCount(a.id));
    
    // الحصول على حاوية الاقتراحات ذات الأولوية
    const prioritySuggestionsGrid = document.getElementById('prioritySuggestionsGrid');
    const emptyPrioritySuggestions = document.getElementById('emptyPrioritySuggestions');
    
    if (!prioritySuggestionsGrid) return;
    
    // إذا لم تكن هناك اقتراحات ذات أولوية، عرض رسالة فارغة
    if (prioritySuggestions.length === 0) {
        if (emptyPrioritySuggestions) {
            emptyPrioritySuggestions.style.display = 'block';
        }
        return;
    }
    
    // إخفاء رسالة فارغة
    if (emptyPrioritySuggestions) {
        emptyPrioritySuggestions.style.display = 'none';
    }
    
    // إنشاء بطاقات الاقتراحات ذات الأولوية
    let priorityHTML = '';
    
    // عرض أول 4 اقتراحات فقط
    const displayCount = Math.min(prioritySuggestions.length, 4);
    
    for (let i = 0; i < displayCount; i++) {
        const suggestion = prioritySuggestions[i];
        const votesCount = getVotesCount(suggestion.id);
        const hasVoted = hasUserVoted(suggestion.id);
        
        priorityHTML += createSuggestionCard(suggestion, votesCount, hasVoted);
    }
    
    prioritySuggestionsGrid.innerHTML = priorityHTML;
    
    // إضافة مستمعات الأحداث للبطاقات
    addCardEventListeners();
}

/**
 * تحميل جميع الاقتراحات المقبولة
 */
function loadAllSuggestions() {
    const suggestions = getSuggestions();
    
    // تطبيق التصفية
    let filteredSuggestions = filterSuggestions(suggestions);
    
    // الحصول على حاوية الاقتراحات
    const allSuggestionsList = document.getElementById('allSuggestionsList');
    const emptySuggestions = document.getElementById('emptySuggestions');
    const suggestionsCount = document.getElementById('suggestionsCount');
    
    if (!allSuggestionsList) return;
    
    // تحديث عدد الاقتراحات
    if (suggestionsCount) {
        suggestionsCount.textContent = filteredSuggestions.length;
    }
    
    // إذا لم تكن هناك اقتراحات، عرض رسالة فارغة
    if (filteredSuggestions.length === 0) {
        if (emptySuggestions) {
            emptySuggestions.style.display = 'block';
        }
        
        // إخفاء ترقيم الصفحات
        const suggestionsPagination = document.getElementById('suggestionsPagination');
        if (suggestionsPagination) {
            suggestionsPagination.style.display = 'none';
        }
        
        return;
    }
    
    // إخفاء رسالة فارغة
    if (emptySuggestions) {
        emptySuggestions.style.display = 'none';
    }
    
    // حساب عدد الصفحات
    const totalPages = Math.ceil(filteredSuggestions.length / window.itemsPerPage);
    
    // التأكد من أن الصفحة الحالية ضمن النطاق
    if (window.currentPage > totalPages) {
        window.currentPage = 1;
    }
    
    // الحصول على الاقتراحات للصفحة الحالية
    const startIndex = (window.currentPage - 1) * window.itemsPerPage;
    const endIndex = Math.min(startIndex + window.itemsPerPage, filteredSuggestions.length);
    const pageSuggestions = filteredSuggestions.slice(startIndex, endIndex);
    
    // إنشاء عناصر الاقتراحات
    let suggestionsHTML = '';
    
    for (const suggestion of pageSuggestions) {
        const votesCount = getVotesCount(suggestion.id);
        const hasVoted = hasUserVoted(suggestion.id);
        
        suggestionsHTML += createSuggestionItem(suggestion, votesCount, hasVoted);
    }
    
    allSuggestionsList.innerHTML = suggestionsHTML;
    
    // إنشاء ترقيم الصفحات
    createPagination(totalPages);
    
    // إضافة مستمعات الأحداث للعناصر
    addItemEventListeners();
}

/**
 * تصفية الاقتراحات حسب المعايير الحالية
 * @param {Array} suggestions - قائمة الاقتراحات
 * @returns {Array} - الاقتراحات المصفاة
 */
function filterSuggestions(suggestions) {
    // تصفية الاقتراحات المقبولة فقط
    let filteredSuggestions = suggestions.filter(suggestion => 
        suggestion.status === 'approved' || 
        suggestion.status === 'in-progress' || 
        suggestion.status === 'implemented' ||
        suggestion.status === 'priority'
    );
    
    // تصفية حسب النوع
    if (window.currentFilters.type !== 'all') {
        filteredSuggestions = filteredSuggestions.filter(suggestion => 
            suggestion.contentType === window.currentFilters.type
        );
    }
    
    // تصفية حسب الحالة
    if (window.currentFilters.status !== 'all') {
        filteredSuggestions = filteredSuggestions.filter(suggestion => 
            suggestion.status === window.currentFilters.status
        );
    }
    
    // تصفية حسب البحث
    if (window.currentFilters.search) {
        const searchTerm = window.currentFilters.search.toLowerCase();
        filteredSuggestions = filteredSuggestions.filter(suggestion => 
            suggestion.title.toLowerCase().includes(searchTerm) ||
            suggestion.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // ترتيب الاقتراحات
    switch (window.currentFilters.sort) {
        case 'date-desc':
            filteredSuggestions.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-asc':
            filteredSuggestions.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'votes-desc':
            filteredSuggestions.sort((a, b) => getVotesCount(b.id) - getVotesCount(a.id));
            break;
        case 'votes-asc':
            filteredSuggestions.sort((a, b) => getVotesCount(a.id) - getVotesCount(b.id));
            break;
    }
    
    return filteredSuggestions;
}

/**
 * تطبيق معايير التصفية من واجهة المستخدم
 */
function applyFilters() {
    // الحصول على قيم التصفية
    const filterType = document.getElementById('filterType');
    const filterStatus = document.getElementById('filterStatus');
    const filterSort = document.getElementById('filterSort');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    // تحديث معايير التصفية الحالية
    if (filterType) {
        window.currentFilters.type = filterType.value;
    }
    
    if (filterStatus) {
        window.currentFilters.status = filterStatus.value;
    }
    
    if (filterSort) {
        window.currentFilters.sort = filterSort.value;
    }
    
    if (searchSuggestions) {
        window.currentFilters.search = searchSuggestions.value.trim();
    }
    
    // إعادة تعيين الصفحة الحالية
    window.currentPage = 1;
    
    // إعادة تحميل الاقتراحات
    loadAllSuggestions();
    
    // عرض إشعار
    showNotification('تم تطبيق التصفية', 'success');
}

/**
 * إعادة تعيين معايير التصفية
 */
function resetFilters() {
    // إعادة تعيين قيم التصفية في واجهة المستخدم
    const filterType = document.getElementById('filterType');
    const filterStatus = document.getElementById('filterStatus');
    const filterSort = document.getElementById('filterSort');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (filterType) {
        filterType.value = 'all';
    }
    
    if (filterStatus) {
        filterStatus.value = 'all';
    }
    
    if (filterSort) {
        filterSort.value = 'date-desc';
    }
    
    if (searchSuggestions) {
        searchSuggestions.value = '';
    }
    
    // إعادة تعيين معايير التصفية الحالية
    window.currentFilters = {
        type: 'all',
        status: 'all',
        sort: 'date-desc',
        search: ''
    };
    
    // إعادة تعيين الصفحة الحالية
    window.currentPage = 1;
    
    // إعادة تحميل الاقتراحات
    loadAllSuggestions();
    
    // عرض إشعار
    showNotification('تم إعادة تعيين التصفية', 'info');
}

/**
 * إنشاء ترقيم الصفحات
 * @param {number} totalPages - إجمالي عدد الصفحات
 */
function createPagination(totalPages) {
    const paginationContainer = document.getElementById('suggestionsPagination');
    
    if (!paginationContainer) return;
    
    // إظهار ترقيم الصفحات
    paginationContainer.style.display = 'flex';
    
    // إذا كانت هناك صفحة واحدة فقط، إخفاء ترقيم الصفحات
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    let paginationHTML = '';
    
    // زر الصفحة السابقة
    paginationHTML += `
        <button class="pagination-btn ${window.currentPage === 1 ? 'disabled' : ''}" 
                data-page="prev" ${window.currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    // أزرار الصفحات
    const maxVisiblePages = 5;
    let startPage = Math.max(1, window.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // ضبط نطاق الصفحات المعروضة
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // إضافة زر الصفحة الأولى إذا لم تكن معروضة
    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" data-page="1">1</button>
        `;
        
        if (startPage > 2) {
            paginationHTML += `
                <button class="pagination-btn disabled" disabled>...</button>
            `;
        }
    }
    
    // إضافة أزرار الصفحات
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === window.currentPage ? 'active' : ''}" 
                    data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    // إضافة زر الصفحة الأخيرة إذا لم تكن معروضة
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `
                <button class="pagination-btn disabled" disabled>...</button>
            `;
        }
        
        paginationHTML += `
            <button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>
        `;
    }
    
    // زر الصفحة التالية
    paginationHTML += `
        <button class="pagination-btn ${window.currentPage === totalPages ? 'disabled' : ''}" 
                data-page="next" ${window.currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // إضافة مستمعات الأحداث لأزرار الترقيم
    const paginationButtons = paginationContainer.querySelectorAll('.pagination-btn:not(.disabled)');
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.dataset.page;
            
            if (page === 'prev') {
                window.currentPage = Math.max(1, window.currentPage - 1);
            } else if (page === 'next') {
                window.currentPage = Math.min(totalPages, window.currentPage + 1);
            } else {
                window.currentPage = parseInt(page);
            }
            
            loadAllSuggestions();
            
            // التمرير إلى أعلى قائمة الاقتراحات
            document.querySelector('.all-suggestions').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/**
 * إنشاء بطاقة اقتراح
 * @param {Object} suggestion - بيانات الاقتراح
 * @param {number} votesCount - عدد الأصوات
 * @param {boolean} hasVoted - هل قام المستخدم بالتصويت
 * @returns {string} - HTML البطاقة
 */
function createSuggestionCard(suggestion, votesCount, hasVoted) {
    const date = new Date(suggestion.date);
    const formattedDate = date.toLocaleDateString('ar-SA');
    
    return `
        <div class="suggestion-card ${suggestion.status === 'priority' ? 'priority' : ''} ${suggestion.status === 'implemented' ? 'implemented' : ''}" data-id="${suggestion.id}">
            <div class="suggestion-header">
                <span class="suggestion-type">${getContentTypeName(suggestion.contentType)}</span>
                <h3 class="suggestion-title">${suggestion.title}</h3>
                <div class="suggestion-meta">
                    <span class="suggestion-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${formattedDate}
                    </span>
                    <span class="suggestion-status status-${suggestion.status}">
                        ${getStatusName(suggestion.status)}
                    </span>
                </div>
            </div>
            
            <div class="suggestion-body">
                <p class="suggestion-description">${suggestion.description}</p>
            </div>
            
            <div class="suggestion-footer">
                <div class="suggestion-votes">
                    <i class="fas fa-thumbs-up"></i>
                    <span class="votes-count">${votesCount}</span>
                </div>
                
                <div class="suggestion-actions">
                    <button class="vote-btn ${hasVoted ? 'voted' : ''}" data-id="${suggestion.id}">
                        <i class="fas ${hasVoted ? 'fa-thumbs-up' : 'fa-thumbs-up'}"></i>
                        ${hasVoted ? 'تم التصويت' : 'تصويت'}
                    </button>
                    
                    <button class="details-btn" data-id="${suggestion.id}">
                        <i class="fas fa-info-circle"></i>
                        التفاصيل
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * إنشاء عنصر اقتراح
 * @param {Object} suggestion - بيانات الاقتراح
 * @param {number} votesCount - عدد الأصوات
 * @param {boolean} hasVoted - هل قام المستخدم بالتصويت
 * @returns {string} - HTML العنصر
 */
function createSuggestionItem(suggestion, votesCount, hasVoted) {
    const date = new Date(suggestion.date);
    const formattedDate = date.toLocaleDateString('ar-SA');
    
    return `
        <div class="suggestion-item ${suggestion.status === 'priority' ? 'priority' : ''} ${suggestion.status === 'implemented' ? 'implemented' : ''}" data-id="${suggestion.id}">
            <div class="suggestion-item-info">
                <h3 class="suggestion-item-title">
                    ${suggestion.title}
                    <span class="suggestion-type">${getContentTypeName(suggestion.contentType)}</span>
                    <span class="suggestion-status status-${suggestion.status}">
                        ${getStatusName(suggestion.status)}
                    </span>
                </h3>
                
                <p class="suggestion-item-description">${suggestion.description.length > 150 ? suggestion.description.substring(0, 150) + '...' : suggestion.description}</p>
                
                <div class="suggestion-item-meta">
                    <span class="suggestion-item-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${formattedDate}
                    </span>
                    
                    <span class="suggestion-item-votes">
                        <i class="fas fa-thumbs-up"></i>
                        <span class="votes-count">${votesCount}</span> صوت
                    </span>
                </div>
            </div>
            
            <div class="suggestion-item-actions">
                <button class="btn vote-btn ${hasVoted ? 'voted' : ''}" data-id="${suggestion.id}">
                    <i class="fas ${hasVoted ? 'fa-thumbs-up' : 'fa-thumbs-up'}"></i>
                    ${hasVoted ? 'تم التصويت' : 'تصويت'}
                </button>
                
                <button class="btn details-btn" data-id="${suggestion.id}">
                    <i class="fas fa-info-circle"></i>
                    التفاصيل
                </button>
            </div>
        </div>
    `;
}

/**
 * إضافة مستمعات الأحداث لبطاقات الاقتراحات
 */
function addCardEventListeners() {
    // مستمعات أزرار التصويت
    const voteButtons = document.querySelectorAll('.suggestion-card .vote-btn');
    
    voteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const suggestionId = this.dataset.id;
            toggleVote(suggestionId, this);
        });
    });
    
    // مستمعات أزرار التفاصيل
    const detailsButtons = document.querySelectorAll('.suggestion-card .details-btn');
    
    detailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const suggestionId = this.dataset.id;
            showSuggestionDetails(suggestionId);
        });
    });
    
    // مستمعات النقر على البطاقة
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    
    suggestionCards.forEach(card => {
        card.addEventListener('click', function() {
            const suggestionId = this.dataset.id;
            showSuggestionDetails(suggestionId);
        });
    });
}

/**
 * إضافة مستمعات الأحداث لعناصر الاقتراحات
 */
function addItemEventListeners() {
    // مستمعات أزرار التصويت
    const voteButtons = document.querySelectorAll('.suggestion-item .vote-btn');
    
    voteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const suggestionId = this.dataset.id;
            toggleVote(suggestionId, this);
        });
    });
    
    // مستمعات أزرار التفاصيل
    const detailsButtons = document.querySelectorAll('.suggestion-item .details-btn');
    
    detailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const suggestionId = this.dataset.id;
            showSuggestionDetails(suggestionId);
        });
    });
    
    // مستمعات النقر على العنصر
    const suggestionItems = document.querySelectorAll('.suggestion-item');
    
    suggestionItems.forEach(item => {
        item.addEventListener('click', function() {
            const suggestionId = this.dataset.id;
            showSuggestionDetails(suggestionId);
        });
    });
}

/**
 * تبديل حالة التصويت
 * @param {string} suggestionId - معرف الاقتراح
 * @param {HTMLElement} button - زر التصويت
 */
function toggleVote(suggestionId, button) {
    // الحصول على بيانات التصويت
    const votes = JSON.parse(localStorage.getItem('4gamer_votes')) || {};
    
    // التحقق مما إذا كان المستخدم قد صوت بالفعل
    const hasVoted = votes[suggestionId] === true;
    
    // تبديل حالة التصويت
    if (hasVoted) {
        votes[suggestionId] = false;
        button.classList.remove('voted');
        button.innerHTML = '<i class="fas fa-thumbs-up"></i> تصويت';
        
        // عرض إشعار
        showNotification('تم إلغاء التصويت', 'info');
    } else {
        votes[suggestionId] = true;
        button.classList.add('voted');
        button.innerHTML = '<i class="fas fa-thumbs-up"></i> تم التصويت';
        
        // عرض إشعار
        showNotification('تم التصويت بنجاح', 'success');
    }
    
    // حفظ بيانات التصويت
    localStorage.setItem('4gamer_votes', JSON.stringify(votes));
    
    // تحديث عدد الأصوات في واجهة المستخدم
    updateVotesCount(suggestionId);
    
    // تحديث حالة الاقتراح إذا تجاوز عدد الأصوات الحد
    updateSuggestionPriorityStatus(suggestionId);
    
    // إعادة تحميل الاقتراحات ذات الأولوية
    loadPrioritySuggestions();
}

/**
 * تحديث عدد الأصوات في واجهة المستخدم
 * @param {string} suggestionId - معرف الاقتراح
 */
function updateVotesCount(suggestionId) {
    const votesCount = getVotesCount(suggestionId);
    
    // تحديث عدد الأصوات في بطاقات الاقتراحات
    const cardVotesElements = document.querySelectorAll(`.suggestion-card[data-id="${suggestionId}"] .votes-count`);
    
    cardVotesElements.forEach(element => {
        element.textContent = votesCount;
    });
    
    // تحديث عدد الأصوات في عناصر الاقتراحات
    const itemVotesElements = document.querySelectorAll(`.suggestion-item[data-id="${suggestionId}"] .votes-count`);
    
    itemVotesElements.forEach(element => {
        element.textContent = votesCount;
    });
    
    // تحديث عدد الأصوات في نافذة التفاصيل
    const modalVotesElement = document.querySelector('#modalBody .votes-count-large');
    
    if (modalVotesElement && document.querySelector('#modalBody').dataset.id === suggestionId) {
        modalVotesElement.textContent = votesCount;
    }
}

/**
 * تحديث حالة الأولوية للاقتراح
 * @param {string} suggestionId - معرف الاقتراح
 */
function updateSuggestionPriorityStatus(suggestionId) {
    const suggestions = getSuggestions();
    const suggestion = suggestions.find(s => s.id === suggestionId);
    
    if (!suggestion) return;
    
    const votesCount = getVotesCount(suggestionId);
    const priorityThreshold = 5; // الحد الأدنى للأصوات لتصبح ذات أولوية
    
    // تحديث حالة الاقتراح
    if (votesCount >= priorityThreshold && suggestion.status === 'approved') {
        suggestion.status = 'priority';
        
        // حفظ التغييرات
        saveSuggestions(suggestions);
        
        // عرض إشعار
        showNotification('تم ترقية الاقتراح إلى ذو أولوية', 'success');
        
        // إعادة تحميل الاقتراحات
        loadAllSuggestions();
    } else if (votesCount < priorityThreshold && suggestion.status === 'priority') {
        suggestion.status = 'approved';
        
        // حفظ التغييرات
        saveSuggestions(suggestions);
        
        // عرض إشعار
        showNotification('تم إلغاء أولوية الاقتراح', 'info');
        
        // إعادة تحميل الاقتراحات
        loadAllSuggestions();
    }
}

/**
 * عرض تفاصيل الاقتراح
 * @param {string} suggestionId - معرف الاقتراح
 */
function showSuggestionDetails(suggestionId) {
    const suggestions = getSuggestions();
    const suggestion = suggestions.find(s => s.id === suggestionId);
    
    if (!suggestion) return;
    
    const votesCount = getVotesCount(suggestionId);
    const hasVoted = hasUserVoted(suggestionId);
    
    const date = new Date(suggestion.date);
    const formattedDate = date.toLocaleDateString('ar-SA');
    
    // إنشاء محتوى النافذة
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!modalBody || !modalTitle) return;
    
    // تعيين عنوان النافذة
    modalTitle.textContent = suggestion.title;
    
    // تعيين معرف الاقتراح للنافذة
    modalBody.dataset.id = suggestionId;
    
    // إنشاء محتوى النافذة
    const modalContent = `
        <div class="suggestion-detail">
            <div class="suggestion-detail-header">
                <div class="suggestion-detail-meta">
                    <div class="suggestion-detail-type">
                        <i class="fas ${getContentTypeIcon(suggestion.contentType)}"></i>
                        <span>${getContentTypeName(suggestion.contentType)}</span>
                    </div>
                    
                    <div class="suggestion-detail-date">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${formattedDate}</span>
                    </div>
                    
                    <div class="suggestion-detail-status">
                        <i class="fas ${getStatusIcon(suggestion.status)}"></i>
                        <span class="suggestion-status status-${suggestion.status}">
                            ${getStatusName(suggestion.status)}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="suggestion-detail-description">
                <h4>وصف الاقتراح</h4>
                <p>${suggestion.description}</p>
            </div>
            
            <div class="suggestion-detail-votes">
                <div class="votes-info">
                    <span class="votes-count-large">${votesCount}</span>
                    <span class="votes-label">صوت</span>
                </div>
                
                <button class="vote-btn-large ${hasVoted ? 'voted' : ''}" data-id="${suggestion.id}">
                    <i class="fas ${hasVoted ? 'fa-thumbs-up' : 'fa-thumbs-up'}"></i>
                    ${hasVoted ? 'تم التصويت' : 'تصويت'}
                </button>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = modalContent;
    
    // إضافة مستمع لزر التصويت
    const voteButton = modalBody.querySelector('.vote-btn-large');
    
    if (voteButton) {
        voteButton.addEventListener('click', function() {
            toggleVote(suggestionId, this);
        });
    }
    
    // عرض النافذة
    const suggestionModal = document.getElementById('suggestionModal');
    
    if (suggestionModal) {
        suggestionModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * إغلاق نافذة تفاصيل الاقتراح
 */
function closeModal() {
    const suggestionModal = document.getElementById('suggestionModal');
    
    if (suggestionModal) {
        suggestionModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

/**
 * الحصول على عدد الأصوات لاقتراح معين
 * @param {string} suggestionId - معرف الاقتراح
 * @returns {number} - عدد الأصوات
 */
function getVotesCount(suggestionId) {
    const votes = JSON.parse(localStorage.getItem('4gamer_votes')) || {};
    let count = 0;
    
    // حساب عدد الأصوات
    for (const id in votes) {
        if (id === suggestionId && votes[id] === true) {
            count++;
        }
    }
    
    // إضافة أصوات عشوائية للاختبار
    const randomVotes = getRandomVotesForSuggestion(suggestionId);
    
    return count + randomVotes;
}

/**
 * التحقق مما إذا كان المستخدم قد صوت لاقتراح معين
 * @param {string} suggestionId - معرف الاقتراح
 * @returns {boolean} - هل قام المستخدم بالتصويت
 */
function hasUserVoted(suggestionId) {
    const votes = JSON.parse(localStorage.getItem('4gamer_votes')) || {};
    return votes[suggestionId] === true;
}

/**
 * الحصول على اسم نوع المحتوى
 * @param {string} contentType - رمز نوع المحتوى
 * @returns {string} - اسم نوع المحتوى
 */
function getContentTypeName(contentType) {
    const types = {
        'game': 'لعبة',
        'tool': 'أداة',
        'tutorial': 'شرح',
        'other': 'آخر'
    };
    
    return types[contentType] || 'غير معروف';
}

/**
 * الحصول على أيقونة نوع المحتوى
 * @param {string} contentType - رمز نوع المحتوى
 * @returns {string} - فئة الأيقونة
 */
function getContentTypeIcon(contentType) {
    const icons = {
        'game': 'fa-gamepad',
        'tool': 'fa-tools',
        'tutorial': 'fa-book-open',
        'other': 'fa-star'
    };
    
    return icons[contentType] || 'fa-lightbulb';
}

/**
 * الحصول على اسم حالة الاقتراح
 * @param {string} status - رمز حالة الاقتراح
 * @returns {string} - اسم حالة الاقتراح
 */
function getStatusName(status) {
    const statuses = {
        'approved': 'تمت الموافقة',
        'in-progress': 'قيد التنفيذ',
        'implemented': 'تم التنفيذ',
        'priority': 'ذو أولوية'
    };
    
    return statuses[status] || 'غير معروف';
}

/**
 * الحصول على أيقونة حالة الاقتراح
 * @param {string} status - رمز حالة الاقتراح
 * @returns {string} - فئة الأيقونة
 */
function getStatusIcon(status) {
    const icons = {
        'approved': 'fa-check',
        'in-progress': 'fa-spinner',
        'implemented': 'fa-check-circle',
        'priority': 'fa-star'
    };
    
    return icons[status] || 'fa-info-circle';
}

/**
 * الحصول على قائمة الاقتراحات
 * @returns {Array} - قائمة الاقتراحات
 */
function getSuggestions() {
    return JSON.parse(localStorage.getItem('4gamer_suggestions')) || [];
}

/**
 * حفظ قائمة الاقتراحات
 * @param {Array} suggestions - قائمة الاقتراحات
 */
function saveSuggestions(suggestions) {
    localStorage.setItem('4gamer_suggestions', JSON.stringify(suggestions));
}

/**
 * الحصول على عدد أصوات عشوائية لاقتراح معين
 * @param {string} suggestionId - معرف الاقتراح
 * @returns {number} - عدد الأصوات العشوائية
 */
function getRandomVotesForSuggestion(suggestionId) {
    // استخدام معرف الاقتراح لإنشاء عدد ثابت من الأصوات العشوائية
    const hash = suggestionId.split('_')[1] || '0';
    const seed = parseInt(hash) % 100;
    
    return seed % 20; // عدد عشوائي بين 0 و 19
}

/**
 * إنشاء اقتراحات اختبار
 */
function createSampleSuggestions() {
    const sampleSuggestions = [
        {
            id: 'sug_1650123456_abc123',
            title: 'إضافة لعبة Elden Ring المعربة',
            contentType: 'game',
            description: 'أقترح إضافة لعبة Elden Ring مع التعريب الكامل للنصوص والحوارات. هذه اللعبة من أفضل ألعاب العالم المفتوح وستكون إضافة رائعة للموقع خاصة مع التعريب.',
            email: 'user1@example.com',
            date: '2023-05-15T10:30:00.000Z',
            status: 'priority'
        },
        {
            id: 'sug_1650123789_def456',
            title: 'أداة تحسين أداء PS4 للألعاب الثقيلة',
            contentType: 'tool',
            description: 'أداة تساعد على تحسين أداء جهاز PS4 عند تشغيل الألعاب الثقيلة مثل Red Dead Redemption 2 و Cyberpunk 2077. الأداة تقوم بتحسين استخدام الذاكرة وتقليل التقطيع أثناء اللعب.',
            email: 'user2@example.com',
            date: '2023-06-20T14:45:00.000Z',
            status: 'in-progress'
        },
        {
            id: 'sug_1650124567_ghi789',
            title: 'شرح تفصيلي لتثبيت التحديثات على PS4 المهكر',
            contentType: 'tutorial',
            description: 'شرح خطوة بخطوة لكيفية تثبيت التحديثات على أجهزة PS4 المهكرة بدون فقدان الجيلبريك، مع توضيح الإصدارات المتوافقة والطرق الآمنة للتحديث.',
            email: 'user3@example.com',
            date: '2023-07-05T09:15:00.000Z',
            status: 'implemented'
        },
        {
            id: 'sug_1650125678_jkl012',
            title: 'إضافة لعبة God of War Ragnarök',
            contentType: 'game',
            description: 'إضافة لعبة God of War Ragnarök مع جميع الإضافات والتحديثات. هذه اللعبة من أفضل ألعاب الأكشن والمغامرات وتعتبر من أهم حصريات PlayStation.',
            email: 'user4@example.com',
            date: '2023-08-10T16:20:00.000Z',
            status: 'approved'
        },
        {
            id: 'sug_1650126789_mno345',
            title: 'أداة نسخ الألعاب من القرص إلى الهارد',
            contentType: 'tool',
            description: 'أداة تسمح بنسخ الألعاب من القرص مباشرة إلى الهارد الخارجي أو الداخلي بصيغة متوافقة مع PS4 المهكر، مما يسهل عملية النسخ ويحافظ على القرص من التلف.',
            email: 'user5@example.com',
            date: '2023-09-15T11:30:00.000Z',
            status: 'approved'
        },
        {
            id: 'sug_1650127890_pqr678',
            title: 'شرح تعريب الألعاب يدوياً',
            contentType: 'tutorial',
            description: 'شرح مفصل لكيفية تعريب الألعاب يدوياً عن طريق استبدال ملفات اللغة، مع أمثلة على ألعاب شهيرة وشرح للأدوات المستخدمة في عملية التعريب.',
            email: 'user6@example.com',
            date: '2023-10-20T13:45:00.000Z',
            status: 'in-progress'
        },
        {
            id: 'sug_1650128901_stu901',
            title: 'إضافة لعبة Horizon Forbidden West',
            contentType: 'game',
            description: 'إضافة لعبة Horizon Forbidden West مع جميع الإضافات والتحديثات. استكمال لمغامرة آلوي في عالم ما بعد نهاية العالم المليء بالآلات والأسرار.',
            email: 'user7@example.com',
            date: '2023-11-25T15:10:00.000Z',
            status: 'priority'
        },
        {
            id: 'sug_1650129012_vwx234',
            title: 'أداة تحويل صيغ الألعاب',
            contentType: 'tool',
            description: 'أداة لتحويل صيغ الألعاب بين PKG و ISO و Folder، مما يسهل على المستخدمين تثبيت الألعاب بالصيغة المناسبة لأجهزتهم.',
            email: 'user8@example.com',
            date: '2023-12-30T10:20:00.000Z',
            status: 'approved'
        },
        {
            id: 'sug_1650130123_yz0123',
            title: 'شرح استخدام برامج المحاكاة على PS4',
            contentType: 'tutorial',
            description: 'شرح كيفية تثبيت واستخدام برامج محاكاة الأجهزة القديمة على PS4 المهكر، مثل محاكي PS1 و PS2 و PSP وغيرها من الأجهزة.',
            email: 'user9@example.com',
            date: '2024-01-05T14:30:00.000Z',
            status: 'implemented'
        },
        {
            id: 'sug_1650131234_abc456',
            title: 'إضافة لعبة Spider-Man 2',
            contentType: 'game',
            description: 'إضافة لعبة Spider-Man 2 الجديدة من إنتاج Insomniac Games، والتي تجمع بين بيتر باركر ومايلز موراليس في مغامرة جديدة في مدينة نيويورك.',
            email: 'user10@example.com',
            date: '2024-02-10T09:45:00.000Z',
            status: 'priority'
        },
        {
            id: 'sug_1650132345_def789',
            title: 'أداة تنظيف وتسريع PS4',
            contentType: 'tool',
            description: 'أداة لتنظيف ذاكرة التخزين المؤقت وتسريع أداء PS4، تقوم بإزالة الملفات غير الضرورية وتحسين استخدام الموارد.',
            email: 'user11@example.com',
            date: '2024-03-15T16:40:00.000Z',
            status: 'in-progress'
        },
        {
            id: 'sug_1650133456_ghi012',
            title: 'شرح تثبيت الإضافات والتحديثات للألعاب',
            contentType: 'tutorial',
            description: 'شرح تفصيلي لكيفية تثبيت الإضافات والتحديثات للألعاب على PS4 المهكر، مع توضيح الفرق بين أنواع الإضافات وكيفية التعامل معها.',
            email: 'user12@example.com',
            date: '2024-04-20T11:25:00.000Z',
            status: 'approved'
        }
    ];
    
    localStorage.setItem('4gamer_suggestions', JSON.stringify(sampleSuggestions));
    
    // إنشاء بعض الأصوات العشوائية للاختبار
    const votes = {};
    
    sampleSuggestions.forEach(suggestion => {
        // إضافة تصويت للاقتراحات ذات الأولوية
        if (suggestion.status === 'priority') {
            votes[suggestion.id] = true;
        }
    });
    
    localStorage.setItem('4gamer_votes', JSON.stringify(votes));
}

/**
 * عرض إشعار للمستخدم
 * @param {string} message - نص الإشعار
 * @param {string} type - نوع الإشعار (success, error, info)
 */
function showNotification(message, type = 'info') {
    // التحقق من وجود عنصر الإشعارات
    let notificationContainer = document.querySelector('.notification-container');
    
    // إنشاء حاوية الإشعارات إذا لم تكن موجودة
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">×</button>
    `;
    
    // إضافة الإشعار إلى الحاوية
    notificationContainer.appendChild(notification);
    
    // إضافة مستمع لزر الإغلاق
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.classList.add('notification-hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // إخفاء الإشعار تلقائياً بعد فترة
    setTimeout(() => {
        notification.classList.add('notification-hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * الحصول على أيقونة مناسبة لنوع الإشعار
 * @param {string} type - نوع الإشعار
 * @returns {string} - فئة الأيقونة
 */
function getNotificationIcon(type) {
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'info': 'fas fa-info-circle'
    };
    
    return icons[type] || 'fas fa-info-circle';
}
