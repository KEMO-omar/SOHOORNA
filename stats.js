// إعداد Firebase (نفس الكود اللي في صفحتك)
const firebaseConfig = {
    apiKey: "AIzaSyC0WJ11PvTUAWxLMlPBqXA-2QrcXM2uHg0",
    authDomain: "sohoorna.firebaseapp.com",
    databaseURL: "https://sohoorna-default-rtdb.firebaseio.com",
    projectId: "sohoorna",
    storageBucket: "sohoorna.firebasestorage.app",
    messagingSenderId: "433150559884",
    appId: "1:433150559884:web:62932d2ba01f19f3ec5da9"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const onlineRef = db.ref('stats/online');
const totalRef = db.ref('stats/totalVisits');

// كود "متصل الآن" (يوضع في الـ 17 صفحة)
const myStatus = onlineRef.push();
db.ref('.info/connected').on('value', s => {
    if (s.val()) { 
        myStatus.onDisconnect().remove(); 
        myStatus.set(true); 
    }
});

// عرض الأرقام (إذا كان لديك عناصر HTML لعرضها في تلك الصفحة)
onlineRef.on('value', s => {
    const el = document.getElementById('online-count');
    if(el) el.innerText = s.numChildren();
});

totalRef.on('value', s => {
    const el = document.getElementById('total-count');
    if(el) el.innerText = s.val() || 0;
});

// كود "إجمالي الزيارات" (يوضع فقط إذا كانت الصفحة هي index.html)
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    if (!localStorage.getItem('v26')) {
        totalRef.transaction(c => (c || 0) + 1);
        localStorage.setItem('v26', 'true');
    }
}
