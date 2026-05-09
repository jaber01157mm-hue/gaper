// مجرد اختبار بسيط لطباعة رسالة في الكونسول (Console)
console.log("مرحباً بك في كورس الشرح الخاص بمشروع AutoPro!");

// الإمساك بالزر الموجود في ملف HTML
const alertBtn = document.getElementById("alertBtn");

// إضافة حدث (Event) عند الضغط على الزر
alertBtn.addEventListener("click", function() {
    // إظهار رسالة منبثقة للمستخدم
    alert("تم الضغط على الزر بنجاح! هذا مثال بسيط على تفاعل الجافاسكربت.");
    
    // تغيير نص الزر بعد الضغط عليه
    alertBtn.innerText = "تم الضغط ✓";
    alertBtn.style.backgroundColor = "#4CAF50"; // تغيير اللون للأخضر
});
