const counterElement = document.getElementById("counter");
const finishBtn = document.getElementById("finishBtn");
const nameInput = document.getElementById("name");
const tasbeehSelect = document.getElementById("tasbeeh");
const tasbeehContainer = document.getElementById("tasbeehContainer");

let count = parseInt(localStorage.getItem("count")) || 0;
let currentBead = parseInt(localStorage.getItem("currentBead")) || 0;
let clickTimes = [];
let speedWarningCount = 0;
const maxRatePerSecond = 3;
const beadsCount = 33;
const fixedText = "الله";

// رسائل تشجيعية عشوائية
const encouragementMessages = [
  "ممتاز! استمر على هذا",
  "تسبيح رائع! بارك الله فيك",
  "واصل يا بطل! 🌟",
  "أحسنت! قلبك مليء بالذكر",
  "الله أكبر! Keep going",
  "يا سلام! لقد أتممت 33 ذكرًا",
  "تسبيح جميل ومثمر",
  "استمر ولا تتوقف",
  "مبروك! روحك مرتاحة الآن"
];

// تحديث العدّاد عند التحميل
counterElement.innerText = count;

// استرجاع الاسم والذكر من localStorage
if (localStorage.getItem("name")) nameInput.value = localStorage.getItem("name");
if (localStorage.getItem("tasbeeh")) tasbeehSelect.value = localStorage.getItem("tasbeeh");

// تعيين وقت بداية الجلسة لو مش موجود أو تم إنهاء 33 ذكر
if (!localStorage.getItem("sessionStart")) {
  localStorage.setItem("sessionStart", new Date().toISOString());
}

// حفظ الاسم عند تغييره
nameInput.addEventListener("input", () =>
  localStorage.setItem("name", nameInput.value.trim())
);

// حفظ اختيار الذكر عند تغييره
tasbeehSelect.addEventListener("change", () => {
  localStorage.setItem("tasbeeh", tasbeehSelect.value);
  createBeads();
});

// إنشاء الحبات
function createBeads() {
  tasbeehContainer.innerHTML = "";
  const radius = 150;
  const center = 140;

  for (let i = 0; i < beadsCount; i++) {
    const bead = document.createElement("div");
    bead.classList.add("tasbeeh-bead");

    // النص داخل الحبة
    bead.innerText = fixedText;
    bead.style.fontWeight = "bold";
    bead.style.display = "flex";
    bead.style.justifyContent = "center";
    bead.style.alignItems = "center";

    const angle = (i / beadsCount) * 2 * Math.PI;
    bead.style.position = "absolute";
    bead.style.left = `${center + radius * Math.cos(angle)}px`;
    bead.style.top = `${center + radius * Math.sin(angle)}px`;

    if (i < currentBead) bead.classList.add("active");

    bead.addEventListener("click", (e) => {
      e.stopPropagation();
      handleTasbeeh();
    });

    tasbeehContainer.appendChild(bead);
  }
}
createBeads();

// التعامل مع ضغط الحبة
function handleTasbeeh() {
  if (!nameInput.value.trim()) {
    alert("اكتب اسمك أولاً");
    return;
  }

  // تعيين وقت بداية الجلسة لو مش موجود
  if (!localStorage.getItem("sessionStart")) {
    localStorage.setItem("sessionStart", new Date().toISOString());
  }

  const now = Date.now();
  clickTimes.push(now);
  clickTimes = clickTimes.filter(t => now - t <= 1000);

  if (clickTimes.length > maxRatePerSecond) {
    showFullScreenPopup('هتبوظ التاتش براحه ياعم😒');
    speedWarningCount++;
    return;
  } else speedWarningCount = 0;

  const beads = document.querySelectorAll(".tasbeeh-bead");
  if (currentBead < beadsCount) {
    beads[currentBead].classList.add("active");
    currentBead++;
    localStorage.setItem("currentBead", currentBead);
    count++;
    counterElement.innerText = count;
    localStorage.setItem("count", count);
  }

  if (currentBead === beadsCount) {
    // اهتزاز الهاتف
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    // رسالة تشجيعية عشوائية
    const randomMsg = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    showEncouragementPopup(randomMsg);

    currentBead = 0;
    localStorage.setItem("currentBead", currentBead);
    beads.forEach(b => b.classList.remove("active"));

    // إعادة تعيين بداية الجلسة بعد إنهاء 33 ذكر
    localStorage.setItem("sessionStart", new Date().toISOString());
  }
}

// زر إنهاء التسبيح
finishBtn.addEventListener("click", () => {
  if (!nameInput.value.trim()) { alert("اكتب اسمك"); return; }
  if (count === 0) { alert("لم تقم بأي تسبيح بعد"); return; }

  const loader = document.createElement("div");
  loader.innerText = "جاري حفظ البيانات...";
  loader.classList.add("loader", "show");
  document.body.appendChild(loader);

  const startTime = new Date(localStorage.getItem("sessionStart"));
  const endTime = new Date();
  const durationSec = (endTime - startTime)/1000;
  const durationStr = formatDuration(durationSec);
  const rate = count/durationSec;

  let status = speedWarningCount >= 5 ? "❌ غش واضح" : "✅ صالح";

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://script.google.com/macros/s/AKfycbwrnZ7CUnJdziqZ5UCKBQBOECq2DXQdyKZ15Uh3e3r_mt2P-pl3nrVsQciP5V3JJd_e/exec";
  form.target = "hidden_iframe";

  const fields = [
    { name: "name", value: nameInput.value },
    { name: "count", value: count },
    { name: "startTime", value: startTime.toISOString() },
    { name: "endTime", value: endTime.toISOString() },
    { name: "duration", value: durationStr },
    { name: "rate", value: rate.toFixed(2) },
    { name: "status", value: status }
  ];

  fields.forEach(f => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = f.name;
    input.value = f.value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);

  // إعادة تعيين كل شيء
  count = 0;
  currentBead = 0;
  counterElement.innerText = count;
  localStorage.removeItem("count");
  localStorage.removeItem("currentBead");
  localStorage.removeItem("sessionStart");
  createBeads();

  setTimeout(() => loader.remove(), 500);
});

function formatDuration(sec) {
  const h = Math.floor(sec/3600);
  const m = Math.floor((sec%3600)/60);
  const s = Math.floor(sec%60);
  return `${h}h:${m}m:${s}s`;
}

function showFullScreenPopup(msg) {
  const div = document.createElement("div");
  div.innerText = msg;
  div.style.cssText = `
    position:fixed; top:0; left:0;
    width:100%; height:100%;
    background:rgba(0, 0, 0, 0.94);
    color:#fff; display:flex;
    justify-content:center; align-items:center;
    font-size:32px; font-weight:bold; z-index:9999;
  `;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1500);
}

function showEncouragementPopup(msg) {
  const div = document.createElement("div");
  div.innerText = msg;
  div.style.cssText = `
    position:fixed; top:50%; left:50%;
    transform:translate(-50%,-50%) scale(0.8);
    background:linear-gradient(135deg,#22c55e,#16a34a);
    color:#fff; padding:20px 35px;
    border-radius:25px; font-weight:bold; font-size:20px;
    text-align:center; z-index:9999;
    opacity:0; transition:all 0.3s ease;
  `;
  document.body.appendChild(div);
  setTimeout(() => {
    div.style.opacity = "1";
    div.style.transform = "translate(-50%,-50%) scale(1)";
  }, 50);
  setTimeout(() => {
    div.style.opacity = "0";
    div.style.transform = "translate(-50%,-50%) scale(0.8)";
    setTimeout(() => div.remove(), 300);
  }, 2500);
}