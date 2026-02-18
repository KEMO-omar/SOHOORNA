// 1. إعدادات Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC0WJ11PvTUAWxLMlPBqXA-2QrcXM2uHg0",
    authDomain: "sohoorna.firebaseapp.com",
    databaseURL: "https://sohoorna-default-rtdb.firebaseio.com",
    projectId: "sohoorna",
    storageBucket: "sohoorna.firebasestorage.app",
    messagingSenderId: "433150559884",
    appId: "1:433150559884:web:62932d2ba01f19f3ec5da9"
};

// تهيئة Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const durationRef = db.ref('stats/totalDurationMinutes');
const onlineRef = db.ref('stats/online');
const totalRef = db.ref('stats/totalVisits');

// --- أولاً: تتبع المتواجدين الآن (يعمل في كل الصفحات) ---
const myStatus = onlineRef.push();
db.ref('.info/connected').on('value', (s) => {
    if (s.val()) {
        myStatus.onDisconnect().remove();
        myStatus.set(true);
    }
});

// --- ثانياً: إجمالي الزيارات (يحتسب مرة واحدة فقط في اليوم للمستخدم) ---
if (!localStorage.getItem('v26_visited')) {
    totalRef.transaction(c => (c || 0) + 1);
    localStorage.setItem('v26_visited', 'true');
}

// --- ثالثاً: حساب الدقائق التراكمي (الحل السحري لـ 17 صفحة) ---
let pageStartTime = Date.now();

function updateGlobalDuration() {
    const now = Date.now();
    const sessionMs = now - pageStartTime;
    pageStartTime = now; // إعادة التعيين للجزء القادم

    // جلب ما تم تخزينه سابقاً في المتصفح (بالملي ثانية)
    let accumulatedMs = parseFloat(localStorage.getItem('accMs') || 0);
    accumulatedMs += sessionMs;

    // تحويل الملي ثانية المكتملة إلى دقائق
    const minutesToSend = Math.floor(accumulatedMs / 60000);
    
    if (minutesToSend > 0) {
        // إرسال الدقائق المكتملة فقط لـ Firebase
        durationRef.transaction(current => (current || 0) + minutesToSend);
        // حفظ الباقي (الأقل من دقيقة) للمرة القادمة أو الصفحة التالية
        accumulatedMs = accumulatedMs % 60000;
    }

    localStorage.setItem('accMs', accumulatedMs);
}

// التحديث عند مغادرة الصفحة أو إغلاقها أو تغيير التبويب
window.addEventListener('beforeunload', updateGlobalDuration);
window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') updateGlobalDuration();
});

// تحديث تلقائي كل دقيقة لضمان عدم ضياع البيانات إذا ظل المستخدم في صفحة واحدة طويلاً
setInterval(updateGlobalDuration, 60000);

// --- رابعاً: تحديث العناصر في الواجهة (إذا وجدت) ---
onlineRef.on('value', s => {
    const el = document.getElementById('online-count');
    if (el) el.innerText = s.numChildren();
});
totalRef.on('value', s => {
    const el = document.getElementById('total-count');
    if (el) el.innerText = s.val() || 0;
});
