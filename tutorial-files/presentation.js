function openTab(tabId) {
    // إخفاء كل المحتوى
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    // إزالة تفعيل كل الأزرار
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // إظهار المحتوى المطلوب
    document.getElementById(tabId).classList.add('active');

    // تفعيل الزر الذي تم الضغط عليه
    event.currentTarget.classList.add('active');
}
