// const counterElement = document.getElementById("counter");
// const countBtn = document.getElementById("countBtn");
// const finishBtn = document.getElementById("finishBtn");
// const resetBtn = document.getElementById("resetBtn");
// const nameInput = document.getElementById("name");
// const tasbeehSelect = document.getElementById("tasbeeh");
// const virtueBox = document.getElementById("virtueBox");

// let count = 0;

// // استعادة البيانات من LocalStorage
// if(localStorage.getItem("count")) {
//   count = parseInt(localStorage.getItem("count"));
//   counterElement.innerText = count;
// }
// if(localStorage.getItem("name")) {
//   nameInput.value = localStorage.getItem("name");
// }
// if(localStorage.getItem("tasbeeh")) {
//   tasbeehSelect.value = localStorage.getItem("tasbeeh");
// }

// // الفضائل
// const virtues = {
//   "سبحان الله وبحمده، سبحان الله العظيم": "ثِقيلتان في الميزان، حبيبتان إلى الرحمن.",
//   "الحمد لله": "تملأ الميزان.",
//   "الله أكبر": "أحب الكلام إلى الله.",
//   "لا إله إلا الله": "أفضل الذكر.",
//   "استغفر الله": "سبب لمغفرة الذنوب وتفريج الهموم.",
//   "اللهم صلِّ على محمد": "من صلى عليّ صلاة صلى الله عليه بها عشرًا."
// };

// // عرض الفضائل فورًا
// tasbeehSelect.addEventListener("change", ()=>{
//   const selected = tasbeehSelect.value;
//   virtueBox.innerText = virtues[selected] || "";
// });

// // زر التسبيح
// countBtn.addEventListener("click", ()=>{
//   count++;
//   counterElement.innerText = count;

//   localStorage.setItem("count", count);
//   localStorage.setItem("name", nameInput.value);
//   localStorage.setItem("tasbeeh", tasbeehSelect.value);

//   // رسالة ممتعة كل 10
//   if(count % 10 === 0){
//     showMessage(`ما شاء الله! وصلت ${count} تسبيحات 🌸`);
//   }
// });

// // زر التصفير
// resetBtn.addEventListener("click", ()=>{
//   count = 0;
//   counterElement.innerText = count;
//   localStorage.removeItem("count");
// });

// // زر إنهاء التسبيح
// finishBtn.addEventListener("click", ()=>{
//   const name = nameInput.value;
//   const selectedTasbeeh = tasbeehSelect.value;

//   if(!name || !selectedTasbeeh){
//     alert("من فضلك ادخل اسمك واختر الذكر!");
//     return;
//   }

//   // إرسال للـ Google Sheet باستخدام form workaround لتجنب CORS
//   const form = document.createElement("form");
//   form.method = "POST";
//   form.action = "https://script.google.com/macros/s/AKfycbza4UDqFxRw_qUOHk1wUWJKWEByxnsa2hlBgbzcv3Iuz9_HPteahEUWNr6rzx2Mz-x2/exec";
//   form.target = "hidden_iframe";

//   const inputName = document.createElement("input");
//   inputName.name = "name"; inputName.value = name; form.appendChild(inputName);

//   const inputCount = document.createElement("input");
//   inputCount.name = "count"; inputCount.value = count; form.appendChild(inputCount);

//   document.body.appendChild(form);
//   form.submit();
//   document.body.removeChild(form);

//   // تصفير كل شيء
//   count = 0;
//   counterElement.innerText = count;
//   nameInput.value = "";
//   tasbeehSelect.value = "";
//   virtueBox.innerText = "";
//   localStorage.clear();
// });

// // رسالة ممتعة متحركة
// function showMessage(msg){
//   const div = document.createElement("div");
//   div.classList.add("message-box");
//   div.innerText = msg;
//   document.body.appendChild(div);

//   setTimeout(()=>{ div.style.opacity = "1"; div.style.transform = "translate(-50%, -50%) scale(1)"; }, 50);
//   setTimeout(()=>{
//     div.style.opacity = "0";
//     div.style.transform = "translate(-50%, -50%) scale(0.5)";
//     setTimeout(()=>{ div.remove(); }, 500);
//   }, 2000);
// }
//#########################
// ===== عناصر الصفحة =====
// ===== عناصر الصفحة =====
const counterElement = document.getElementById("counter");
const countBtn = document.getElementById("countBtn");
const finishBtn = document.getElementById("finishBtn");
const resetBtn = document.getElementById("resetBtn");
const nameInput = document.getElementById("name");
const tasbeehSelect = document.getElementById("tasbeeh");
const virtueBox = document.getElementById("virtueBox");

let count = 0;

// ===== استعادة البيانات من LocalStorage =====
if(localStorage.getItem("count")) {
  count = parseInt(localStorage.getItem("count"));
  counterElement.innerText = count;
}
if(localStorage.getItem("name")) {
  nameInput.value = localStorage.getItem("name");
}
if(localStorage.getItem("tasbeeh")) {
  tasbeehSelect.value = localStorage.getItem("tasbeeh");
}

// ===== الفضائل =====
const virtues = {
  "سبحان الله وبحمده، سبحان الله العظيم": "ثِقيلتان في الميزان، حبيبتان إلى الرحمن.",
  "الحمد لله": "تملأ الميزان.",
  "الله أكبر": "أحب الكلام إلى الله.",
  "لا إله إلا الله": "أفضل الذكر.",
  "استغفر الله": "سبب لمغفرة الذنوب وتفريج الهموم.",
  "اللهم صلِّ على محمد": "من صلى عليّ صلاة صلى الله عليه بها عشرًا."
};

// ===== عرض الفضائل فورًا عند التغيير =====
tasbeehSelect.addEventListener("change", () => {
  const selected = tasbeehSelect.value;
  virtueBox.innerText = virtues[selected] || "";
});

// ===== رسائل مختلفة كل 10 تسبيحات =====
const tenMessages = [
  "ما شاء الله! وصلت 10 تسبيحات 🌸",
  "ما شاء الله! 20 تسبيحة 💫",
  "سبحان الله! 30 تسبيحة ✨",
  "استمر! 40 تسبيحة 🙏",
  "تبارك الله! 50 تسبيحة 🌷",
  "ما شاء الله! 60 تسبيحة 🌼",
  "ما شاء الله! 70 تسبيحة 🌺",
  "أحسنت! 80 تسبيحة 🌹",
  "سبحان الله! 90 تسبيحة 🌟",
  "تهانينا! وصلت 100 تسبيحة 🎉"
];

// ===== زر التسبيح =====
countBtn.addEventListener("click", () => {
  count++;
  counterElement.innerText = count;

  // حفظ مؤقت
  localStorage.setItem("count", count);
  localStorage.setItem("name", nameInput.value);
  localStorage.setItem("tasbeeh", tasbeehSelect.value);

  // رسالة ممتعة كل 10
  if(count % 10 === 0){
    const index = Math.min(Math.floor(count / 10) - 1, tenMessages.length - 1);
    showMessage(tenMessages[index]);
  }
});

// ===== زر التصفير =====
resetBtn.addEventListener("click", () => {
  count = 0;
  counterElement.innerText = count;
  localStorage.removeItem("count");
});

// ===== زر إنهاء التسبيح =====
finishBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const selectedTasbeeh = tasbeehSelect.value;

  if (!name || !selectedTasbeeh) {
    alert("من فضلك ادخل اسمك واختر الذكر!");
    return;
  }

  // ===== عرض Loader =====
  const loader = document.createElement("div");
  loader.classList.add("message-box");
  loader.innerText = "جاري حفظ البيانات...";
  loader.style.background = "rgba(59, 130, 246, 0.9)";
  loader.style.fontSize = "18px";
  loader.style.padding = "20px 30px";
  loader.style.borderRadius = "20px";
  document.body.appendChild(loader);
  setTimeout(() => {
    loader.style.opacity = "1";
    loader.style.transform = "translate(-50%, -50%) scale(1)";
  }, 50);

  // ===== إنشاء Form وإرسال البيانات =====
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://script.google.com/macros/s/AKfycbza4UDqFxRw_qUOHk1wUWJKWEByxnsa2hlBgbzcv3Iuz9_HPteahEUWNr6rzx2Mz-x2/exec";
  form.target = "hidden_iframe";

  const inputName = document.createElement("input");
  inputName.name = "name";
  inputName.value = name;
  form.appendChild(inputName);

  const inputCount = document.createElement("input");
  inputCount.name = "count";
  inputCount.value = count;
  form.appendChild(inputCount);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);

  // ===== إزالة Loader بعد 1.5 ثانية =====
  setTimeout(() => {
    loader.remove();
    showMessage(`تم تسجيل ${count} تسبيحات بنجاح 🌸`);

    // تصفير كل شيء
    count = 0;
    counterElement.innerText = count;
    nameInput.value = "";
    tasbeehSelect.value = "";
    virtueBox.innerText = "";
    localStorage.clear();
  }, 1500);
});

// ===== رسالة ممتعة متحركة =====
function showMessage(msg){
  const div = document.createElement("div");
  div.classList.add("message-box");
  div.innerText = msg;
  div.style.position = "fixed";
  div.style.top = "50%";
  div.style.left = "50%";
  div.style.transform = "translate(-50%, -50%) scale(0.5)";
  div.style.background = "rgba(59, 130, 246, 0.9)";
  div.style.color = "#fff";
  div.style.fontSize = "18px";
  div.style.fontWeight = "700";
  div.style.padding = "20px 30px";
  div.style.borderRadius = "20px";
  div.style.opacity = "0";
  div.style.zIndex = "9999";
  div.style.transition = "0.5s";
  document.body.appendChild(div);

  setTimeout(()=>{ div.style.opacity = "1"; div.style.transform = "translate(-50%, -50%) scale(1)"; }, 50);
  setTimeout(()=>{
    div.style.opacity = "0";
    div.style.transform = "translate(-50%, -50%) scale(0.5)";
    setTimeout(()=>{ div.remove(); }, 500);
  }, 2000);
}