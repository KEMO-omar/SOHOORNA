// 1. إعدادات Firebase الخاصة بمشروعك
const firebaseConfig = {
    apiKey: "AIzaSyC0WJ11PvTUAWxLMlPBqXA-2QrcXM2uHg0",
    authDomain: "sohoorna.firebaseapp.com",
    databaseURL: "https://sohoorna-default-rtdb.firebaseio.com",
    projectId: "sohoorna",
    storageBucket: "sohoorna.firebasestorage.app",
    messagingSenderId: "433150559884",
    appId: "1:433150559884:web:62932d2ba01f19f3ec5da9"
};

// 2. تهيئة Firebase ومنع التكرار
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// 3. تعريف المراجع في قاعدة البيانات
const onlineRef = db.ref('stats/online');
const totalRef = db.ref('stats/totalVisits');

// --- أولاً: كود "المتواجدون الآن" (يعمل في كل الصفحات الـ 17) ---
const myStatus = onlineRef.push();

// مراقبة حالة الاتصال بالإنترنت
db.ref('.info/connected').on('value', (snapshot) => {
    if (snapshot.val() === true) {
        // عند انقطاع الاتصال (إغلاق الصفحة)، احذف هذا المستخدم من القائمة
        myStatus.onDisconnect().remove();
        // عند الاتصال، سجل المستخدم كـ "true"
        myStatus.set(true);
    }
});

// --- ثانياً: كود "إجمالي الزيارات" (يعمل في index.html فقط) ---
// نتأكد من اسم الصفحة الحالية
const currentPage = window.location.pathname.split("/").pop();

if (currentPage === "index.html" || currentPage === "" || window.location.pathname === "/") {
    // استخدمنا localStorage لضمان عدم زيادة العدد عند عمل Refresh للصفحة
    if (!localStorage.getItem('hasVisitedToday')) {
        totalRef.transaction((currentValue) => {
            return (currentValue || 0) + 1;
        });
        // حفظ علامة في المتصفح تدل على أن الزيارة تم احتسابها
        localStorage.setItem('hasVisitedToday', 'true');
    }
}

// --- ثالثاً: عرض الأرقام في الصفحة (إذا وجدت عناصر HTML) ---
// لتحديث عداد "متصل الآن" في أي صفحة
onlineRef.on('value', (snapshot) => {
    const onlineElement = document.getElementById('online-count');
    if (onlineElement) {
        onlineElement.innerText = snapshot.numChildren();
    }
});

// لتحديث عداد "إجمالي الزيارات"
totalRef.on('value', (snapshot) => {
    const totalElement = document.getElementById('total-count');
    if (totalElement) {
        totalElement.innerText = snapshot.val() || 0;
    }
});

console.log("Stats System Active: Page -> " + (currentPage || "Home"));
