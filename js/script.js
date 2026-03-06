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

const encouragementMessages = [
"ممتاز! استمر على هذا",
"تسبيح رائع! بارك الله فيك",
"واصل يا بطل 🌟",
"أحسنت! قلبك مليء بالذكر",
"الله أكبر! استمر",
"يا سلام! لقد أتممت 33 ذكرًا",
"تسبيح جميل ومثمر",
"استمر ولا تتوقف",
"مبروك! روحك مرتاحة الآن"
];
const speedMessages = [
  "هتبوظ التاتش براحه 😒",
  "السبحة مش سباق  😂",
  "براحه شوية 😅",
  "استهدى بالله وخدها بالراحة",
  "مش كده يا عم الحج",
  "الذكر بالراحة أجمل ❤️",
  "مش قلنا نسبح براحه؟ 😅",
  "هوا انت هندي ولا إيه؟😏",
  "يا صديقي دي 200 جنيه مش تلاجه 😂",
  "متبقاش رخم بقا 😒",
  "سبحان الله وبالحال دي هتخرب السبحة 😂",
  "ياعم خد 200 جنيه وابعد عن السبحة 😾",
  ];

  let speedMessageIndex = 0;
counterElement.innerText = count;

// استرجاع الاسم
if(localStorage.getItem("name")){
nameInput.value = localStorage.getItem("name");
}

// استرجاع الذكر
if(localStorage.getItem("tasbeeh")){
tasbeehSelect.value = localStorage.getItem("tasbeeh");
}

// بداية الجلسة بشكل آمن
let sessionStart = parseInt(localStorage.getItem("sessionStart"));

if(!sessionStart || isNaN(sessionStart)){
sessionStart = Date.now();
localStorage.setItem("sessionStart", sessionStart);
}

// حفظ الاسم
nameInput.addEventListener("input",()=>{
localStorage.setItem("name",nameInput.value.trim());
});

// حفظ الذكر
tasbeehSelect.addEventListener("change",()=>{
localStorage.setItem("tasbeeh",tasbeehSelect.value);
createBeads();
});

// إنشاء حبات السبحة
function createBeads(){

const counter = document.getElementById("counter");

tasbeehContainer.innerHTML="";
tasbeehContainer.appendChild(counter);

const radius = 120;
const center = 100;

for(let i=0;i<beadsCount;i++){

const bead=document.createElement("div");
bead.classList.add("tasbeeh-bead");

const angle=(i/beadsCount)*2*Math.PI;

bead.style.left=`${center+radius*Math.cos(angle)}px`;
bead.style.top=`${center+radius*Math.sin(angle)}px`;

if(i<currentBead) bead.classList.add("active");

bead.addEventListener("click",(e)=>{
e.stopPropagation();
handleTasbeeh();
});

tasbeehContainer.appendChild(bead);

}

}

createBeads();

// الضغط على الحبة
function handleTasbeeh(){

if(!nameInput.value.trim()){
alert("اكتب اسمك أولاً");
return;
}

const now=Date.now();

clickTimes.push(now);

clickTimes=clickTimes.filter(t=>now-t<=1000);

if(clickTimes.length > maxRatePerSecond){

  showFullScreenPopup(speedMessages[speedMessageIndex]);

  speedMessageIndex++;

  if(speedMessageIndex >= speedMessages.length){
    speedMessageIndex = 0;
  }

  speedWarningCount++;

  return;

}
const beads=document.querySelectorAll(".tasbeeh-bead");

if(currentBead<beadsCount){

beads[currentBead].classList.add("active");

currentBead++;

localStorage.setItem("currentBead",currentBead);

count++;

counterElement.innerText=count;

localStorage.setItem("count",count);

}

if(currentBead===beadsCount){

if(navigator.vibrate) navigator.vibrate([200,100,200]);

const randomMsg=encouragementMessages[Math.floor(Math.random()*encouragementMessages.length)];

showEncouragementPopup(randomMsg);

currentBead=0;

localStorage.setItem("currentBead",currentBead);

beads.forEach(b=>b.classList.remove("active"));

}

}
const tasbeehBtn = document.getElementById("tasbeehBtn");

tasbeehBtn.addEventListener("click", handleTasbeeh);
// زر إنهاء التسبيح
finishBtn.addEventListener("click",()=>{

if(!nameInput.value.trim()){
alert("اكتب اسمك");
return;
}

if(count===0){
alert("لم تقم بأي تسبيح بعد");
return;
}

const loader=document.createElement("div");

loader.innerText="جاري حفظ البيانات...";

loader.classList.add("loader","show");

document.body.appendChild(loader);

const startTime=new Date(sessionStart);
const endTime=new Date();

const durationSec=Math.max(1,(endTime-startTime)/1000);

const durationStr=formatDuration(durationSec);

const rate=count/durationSec;

let status=speedWarningCount>=5?"❌ غش واضح":"✅ صالح";

const form=document.createElement("form");

form.method="POST";

form.action="https://script.google.com/macros/s/AKfycbwrIemSy0MWIGmscqRWIa7oyuuLOx642Fa5sYFhtBGfPUjTwpQGIbFVxLgn7oM6xpdi/exec";

form.target="hidden_iframe";

const fields=[
{name:"name",value:nameInput.value},
{name:"count",value:count},
{name:"startTime",value:formatDateTime12(startTime)},
{name:"endTime",value:formatDateTime12(endTime)},
{name:"duration",value:durationStr},
{name:"rate",value:rate.toFixed(2)},
{name:"status",value:status}
];

fields.forEach(f=>{

const input=document.createElement("input");

input.type="hidden";

input.name=f.name;

input.value=f.value;

form.appendChild(input);

});

document.body.appendChild(form);

form.submit();

document.body.removeChild(form);

// إعادة الضبط
count=0;
currentBead=0;

counterElement.innerText=count;

localStorage.removeItem("count");
localStorage.removeItem("currentBead");
localStorage.removeItem("sessionStart");

createBeads();

setTimeout(()=>loader.remove(),500);

});

// حساب المدة
function formatDuration(sec){

const h=Math.floor(sec/3600);
const m=Math.floor((sec%3600)/60);
const s=Math.floor(sec%60);

return `${h}h:${m}m:${s}s`;

}

// تنسيق التاريخ والوقت 12 ساعة
function formatDateTime12(date){

return date.toLocaleString("en-US",{
year:"numeric",
month:"2-digit",
day:"2-digit",
hour:"2-digit",
minute:"2-digit",
second:"2-digit",
hour12:true
});

}

// رسالة تحذير السرعة
function showFullScreenPopup(msg){

const div=document.createElement("div");

div.innerText=msg;

div.style.cssText=`
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:#000;
color:#fff;
display:flex;
justify-content:center;
align-items:center;
font-size:32px;
font-weight:bold;
z-index:9999;
Text-align:center;
`;

document.body.appendChild(div);

setTimeout(()=>div.remove(),1700);

}

// رسالة تشجيع
function showEncouragementPopup(msg){

const div=document.createElement("div");

div.innerText=msg;

div.style.cssText=`
position:fixed;
top:50%;
left:50%;
transform:translate(-50%,-50%) scale(0.8);
background:linear-gradient(135deg,#22c55e,#16a34a);
color:#fff;
padding:20px 35px;
border-radius:25px;
font-weight:bold;
font-size:20px;
text-align:center;
z-index:9999;
opacity:0;
transition:all 0.3s ease;
`;

document.body.appendChild(div);

setTimeout(()=>{
div.style.opacity="1";
div.style.transform="translate(-50%,-50%) scale(1)";
},50);

setTimeout(()=>{
div.style.opacity="0";
div.style.transform="translate(-50%,-50%) scale(0.8)";
setTimeout(()=>div.remove(),300);
},2500);

}