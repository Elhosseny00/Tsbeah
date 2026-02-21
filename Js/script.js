// ===== عناصر الصفحة =====
const counterElement = document.getElementById("counter");
const countBtn = document.getElementById("countBtn");
const finishBtn = document.getElementById("finishBtn");
const resetBtn = document.getElementById("resetBtn");
const nameInput = document.getElementById("name");
const tasbeehSelect = document.getElementById("tasbeeh");
const virtueBox = document.getElementById("virtueBox");

let count = 0;

// ==== استعادة البيانات من LocalStorage لو الصفحة اتعملها Refresh ====
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

// ===== عرض فضل الذكر فورًا عند تغييره =====
tasbeehSelect.addEventListener("change", () => {
  const selected = tasbeehSelect.value;
  if(virtues[selected]) {
    virtueBox.innerText = virtues[selected];
    virtueBox.classList.add("active");
  } else {
    virtueBox.innerText = "";
    virtueBox.classList.remove("active");
  }
});

// ===== زر التسبيح =====
countBtn.addEventListener("click", () => {
  count++;
  counterElement.innerText = count;

  // حفظ مؤقت
  localStorage.setItem("count", count);
  localStorage.setItem("name", nameInput.value);
  localStorage.setItem("tasbeeh", tasbeehSelect.value);

  // عرض رسالة ممتعة كل 10 تسبيحات
  if(count % 10 === 0){
    showMessage(`ما شاء الله! وصلت ${count} تسبيحات 🌸`);
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
  const name = nameInput.value;
  const selectedTasbeeh = tasbeehSelect.value;

  if(!name || !selectedTasbeeh){
    alert("من فضلك ادخل اسمك واختر الذكر!");
    return;
  }

  // إرسال البيانات للـ Google Sheet
  fetch("https://script.google.com/macros/s/AKfycbw3sx2h6TldqvJVhsyg5RQwfIRUWZ27B57U3o0bz55bUGwJ-bU4dgDZIpqfg4-qHU9d/exec", {
    method: "POST",
    body: JSON.stringify({name: name, count: count})
  })
  .then(res => res.json())
  .then(data => {
    if(data.status === "success"){
      alert(`تم تسجيل ${count} تسبيحات للمسبح: ${name}`);
    } else {
      alert("حدث خطأ أثناء تسجيل البيانات!");
      console.log(data);
    }

    // تصفير كل شيء
    count = 0;
    counterElement.innerText = count;
    nameInput.value = "";
    tasbeehSelect.value = "";
    virtueBox.innerText = "";
    localStorage.clear();
  })
  .catch(err => {
    alert("حدث خطأ أثناء إرسال البيانات!");
    console.log(err);
  });
});

// ===== رسالة ممتعة متحركة =====
function showMessage(msg){
  const messageDiv = document.createElement("div");
  messageDiv.innerText = msg;
  messageDiv.style.position = "fixed";
  messageDiv.style.top = "50%";
  messageDiv.style.left = "50%";
  messageDiv.style.transform = "translate(-50%, -50%)";
  messageDiv.style.background = "rgba(59, 130, 246, 0.9)";
  messageDiv.style.color = "#fff";
  messageDiv.style.padding = "20px 30px";
  messageDiv.style.borderRadius = "20px";
  messageDiv.style.fontSize = "18px";
  messageDiv.style.zIndex = "9999";
  messageDiv.style.opacity = "0";
  messageDiv.style.transition = "0.5s";

  document.body.appendChild(messageDiv);

  // ظهور تدريجي
  setTimeout(()=>{ messageDiv.style.opacity = "1"; }, 50);

  // اختفاء تدريجي بعد 2 ثانية
  setTimeout(()=>{
    messageDiv.style.opacity = "0";
    setTimeout(()=>{ document.body.removeChild(messageDiv); }, 500);
  }, 2000);
}