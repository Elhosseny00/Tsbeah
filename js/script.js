const counterElement = document.getElementById("counter");
const countBtn = document.getElementById("countBtn");
const finishBtn = document.getElementById("finishBtn");
const resetBtn = document.getElementById("resetBtn");
const nameInput = document.getElementById("name");
const tasbeehSelect = document.getElementById("tasbeeh");
const virtueBox = document.getElementById("virtueBox");

let count = 0;
let clickTimes = [];
let speedWarningCount = 0; // عداد التحذيرات المتتالية
const maxRatePerSecond = 3;

// ===============================
// تحميل البيانات من LocalStorage
// ===============================
if (localStorage.getItem("count")) {
  count = parseInt(localStorage.getItem("count"));
  counterElement.innerText = count;
}
if (localStorage.getItem("tasbeeh")) tasbeehSelect.value = localStorage.getItem("tasbeeh");
if (localStorage.getItem("name")) nameInput.value = localStorage.getItem("name");

// ===============================
// حفظ الاسم تلقائيًا
// ===============================
nameInput.addEventListener("input", () => {
  localStorage.setItem("name", nameInput.value.trim());
});

// ===============================
// الفضائل
// ===============================
const virtues = {
  "سبحان الله وبحمده، سبحان الله العظيم": "ثِقيلتان في الميزان، حبيبتان إلى الرحمن.",
  "الحمد لله": "تملأ الميزان.",
  "الله أكبر": "أحب الكلام إلى الله.",
  "لا إله إلا الله": "أفضل الذكر.",
  "استغفر الله": "سبب لمغفرة الذنوب وتفريج الهموم.",
  "اللهم صلِّ على محمد": "من صلى عليّ صلاة صلى الله عليه بها عشرًا.",
};
tasbeehSelect.addEventListener("change", () => {
  const selected = tasbeehSelect.value;
  virtueBox.innerText = virtues[selected] || "";
  localStorage.setItem("tasbeeh", selected);
});

// ===============================
// رسائل تشجيعية
// ===============================
const encouragementMessages = [
  "ما شاء الله عليك 🌟 كمل!",
  "الله ينور عليك 🤍",
  "ثابت ومركز 💪",
  "ذكر الله يرفعك درجات 📈",
  "قلبك منور بالذكر ✨",
  "استمر يا بطل 🏆",
];

// ===============================
// زر التسبيح
// ===============================
countBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) { alert("من فضلك اكتب اسمك أولاً"); return; }

  const now = Date.now();
  clickTimes.push(now);
  clickTimes = clickTimes.filter(t => now - t <= 1000);

  // ==========================
  // تحقق صارم: ظهور التحذير المتتالي
  // ==========================
  if (clickTimes.length > maxRatePerSecond) {
    showSpeedPopup("هدي شويه 😅، هتكسب متقلقش!");
    speedWarningCount++;
  } else {
    speedWarningCount = 0; // إذا الضغط طبيعي نرجع صفر
  }

  count++;
  counterElement.innerText = count;
  localStorage.setItem("count", count);

  // اهتزاز العداد كل 10
  if (count % 10 === 0) {
    counterElement.classList.add("shake");
    setTimeout(() => counterElement.classList.remove("shake"), 400);
  }

  // تشجيع كل 20
  if (count % 20 === 0) {
    const randomMsg = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    showEncouragementPopup(randomMsg);
    if (navigator.vibrate) navigator.vibrate(200);
  }

  if (!localStorage.getItem("sessionStart")) localStorage.setItem("sessionStart", new Date().toISOString());
});

// ===============================

// ===============================
// زر إنهاء التسبيح
// ===============================
finishBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const selectedTasbeeh = tasbeehSelect.value;
  if (!name || !selectedTasbeeh) { alert("من فضلك اكتب اسمك واختر الذكر"); return; }
  if (count === 0) { alert("لم تقم بأي تسبيح بعد"); return; }

  const loader = document.createElement("div");
  loader.innerText = "جاري حفظ البيانات...";
  loader.style.cssText = `
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    background:rgba(59,130,246,0.9);
    color:#fff;
    padding:20px 30px;
    border-radius:20px;
    z-index:9999;
  `;
  document.body.appendChild(loader);

  const startTimeStr = localStorage.getItem("sessionStart") || new Date().toISOString();
  const startTime = new Date(startTimeStr);
  const endTime = new Date();
  const durationSec = (endTime - startTime)/1000;
  const durationStr = formatDuration(durationSec);
  const rate = count / durationSec;

  // ===============================
  // التحقق النهائي الصارم + Anti-Cheat
  // ===============================
  let status = "✅ صالح";

  // إذا التحذير ظهر 5 مرات متتالية → غش
  if (speedWarningCount >= 5) {
    status = "❌ غش واضح";
    speedWarningCount = 0;
  }

  if (durationSec <= 0 || isNaN(durationSec)) status = "❌ خطأ في الوقت";
  else if (rate > 4) status = "❌ سرعة مستحيلة";
  else if (durationSec < 10 && count > 40) status = "❌ تسبيح غير منطقي";
  else if (durationSec < 60 && count > 200) status = "❌ رقم مبالغ فيه";
  else if (durationSec < 30 && count > 120) status = "❌ غش واضح";

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://script.google.com/macros/s/AKfycbwrnZ7CUnJdziqZ5UCKBQBOECq2DXQdyKZ15Uh3e3r_mt2P-pl3nrVsQciP5V3JJd_e/exec";
  form.target = "hidden_iframe";

  const fields = [
    {name:"name", value:name},
    {name:"count", value:count},
    {name:"startTime", value:startTime.toISOString()},
    {name:"endTime", value:endTime.toISOString()},
    {name:"duration", value:durationStr},
    {name:"rate", value:rate.toFixed(2)},
    {name:"status", value:status}
  ];

  fields.forEach(f => {
    const input = document.createElement("input");
    input.type="hidden"; input.name=f.name; input.value=f.value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);

  count = 0;
  counterElement.innerText = count;
  localStorage.removeItem("count");
  localStorage.removeItem("sessionStart");

  setTimeout(()=>{ loader.remove(); showMessage(`تم إضافة ${fields[1].value} تسبيحات إلى رصيدك 🌸`) }, 500);
});

// ===============================
// تنسيق الوقت
// ===============================
function formatDuration(sec) {
  const h = Math.floor(sec/3600);
  const m = Math.floor((sec%3600)/60);
  const s = Math.floor(sec%60);
  return `${h}h:${m}m:${s}s`;
}

// ===============================
// Popup منع السرعة (فوق الزرار)
// ===============================
function showSpeedPopup(msg){
  const rect = countBtn.getBoundingClientRect();
  const div = document.createElement("div");
  div.innerText = msg;
  div.style.cssText = `
    position:fixed;
    top:${rect.top}px;
    left:${rect.left}px;
    width:${rect.width}px;
    height:${rect.height}px;
    background:#facc15;
    color:#000;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:15px;
    font-weight:bold;
    font-size:16px;
    z-index:9999;
    box-shadow:0 4px 10px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(div);
  setTimeout(()=>div.remove(),2000);
}

// ===============================
// Popup تشجيعي (نص الشاشة)
// ===============================
function showEncouragementPopup(msg){
  const div = document.createElement("div");
  div.innerText = msg;
  div.style.cssText = `
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%) scale(0.8);
    background:linear-gradient(135deg,#22c55e,#16a34a);
    color:#fff;
    padding:25px 40px;
    border-radius:25px;
    font-weight:bold;
    font-size:20px;
    text-align:center;
    z-index:9999;
    box-shadow:0 10px 30px rgba(0,0,0,0.3);
    opacity:0;
    transition:all 0.3s ease;
  `;
  document.body.appendChild(div);
  setTimeout(()=>{ div.style.opacity="1"; div.style.transform="translate(-50%,-50%) scale(1)"; },50);
  setTimeout(()=>{ div.style.opacity="0"; div.style.transform="translate(-50%,-50%) scale(0.8)";
  setTimeout(()=>div.remove(),300)},2500);
}

// ===============================
// رسالة إنهاء
// ===============================
function showMessage(msg){
  const div = document.createElement("div");
  div.innerText=msg;
  div.style.cssText=`
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    background:rgba(59,130,246,0.9);
    color:#fff;
    padding:20px 30px;
    border-radius:20px;
    z-index:9999;
  `;
  document.body.appendChild(div);
  setTimeout(()=>div.remove(),2000);
}