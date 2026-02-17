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
const durationRef = db.ref('stats/totalDurationMinutes'); // المرجع الجديد للدقائق

// --- أولاً: كود "المتواجدون الآن" ---
const myStatus = onlineRef.push();
db.ref('.info/connected').on('value', (snapshot) => {
    if (snapshot.val() === true) {
        myStatus.onDisconnect().remove();
        myStatus.set(true);
    }
});

// --- ثانياً: كود "إجمالي الزيارات" ---
const currentPage = window.location.pathname.split("/").pop();
if (currentPage === "index.html" || currentPage === "" || window.location.pathname === "/") {
    if (!localStorage.getItem('hasVisitedToday')) {
        totalRef.transaction((currentValue) => (currentValue || 0) + 1);
        localStorage.setItem('hasVisitedToday', 'true');
    }
}

// --- ثالثاً: حساب مدة البقاء بالدقائق (احترافي) ---
let startTime = Date.now();

function logDuration() {
    const endTime = Date.now();
    const durationMs = endTime - startTime;
    
    // تحويل الملي ثانية إلى دقائق (القسمة على 60000)
    // أضفنا "بقايا الوقت" من الجلسة السابقة لضمان دقة الحساب إذا كانت الجلسة قصيرة
    let savedMs = parseFloat(localStorage.getItem('pendingMs') || 0);
    let totalMs = durationMs + savedMs;
    
    const minutesToReport = Math.floor(totalMs / 60000);
    const remainingMs = totalMs % 60000;

    if (minutesToReport > 0) {
        durationRef.transaction((currentValue) => (currentValue || 0) + minutesToReport);
    }
    
    // حفظ الأجزاء التي لم تكمل دقيقة للمرة القادمة
    localStorage.setItem('pendingMs', remainingMs);
    startTime = Date.now(); // إعادة تعيين الوقت
}

// إرسال البيانات عند إغلاق المتصفح أو التنقل
window.addEventListener('beforeunload', logDuration);
window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') logDuration();
});

// --- رابعاً: عرض الأرقام في الصفحة ---
onlineRef.on('value', (snapshot) => {
    const onlineElement = document.getElementById('online-count');
    if (onlineElement) onlineElement.innerText = snapshot.numChildren();
});

totalRef.on('value', (snapshot) => {
    const totalElement = document.getElementById('total-count');
    if (totalElement) totalElement.innerText = snapshot.val() || 0;
});

console.log("Stats System Active: Tracking Minutes");
