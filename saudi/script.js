const $ = (s) => document.querySelector(s);

const target = new Date("2027-09-23T00:00:00+03:00");
function updateCountdown(){
  const now = new Date();
  let diff = target - now;
  if(diff < 0) diff = 0;
  $("#days").textContent = Math.floor(diff/86400000);
  $("#hours").textContent = Math.floor(diff/3600000)%24;
  $("#minutes").textContent = Math.floor(diff/60000)%60;
  $("#seconds").textContent = Math.floor(diff/1000)%60;
}
updateCountdown();
setInterval(updateCountdown,1000);

const questions=[
 ["ما هو اليوم الوطني السعودي؟",["23 سبتمبر","22 فبراير","1 يناير","10 محرم"],0],
 ["في أي عام تم توحيد المملكة؟",["1902","1932","1953","1975"],1],
 ["كم عدد مناطق المملكة الإدارية؟",["10","12","13","15"],2],
 ["ما اسم رؤية المملكة الطموحة؟",["رؤية 2020","رؤية 2030","رؤية 2040","رؤية 2050"],1],
 ["ما عاصمة المملكة العربية السعودية؟",["جدة","مكة المكرمة","الرياض","المدينة المنورة"],2]
];
let qi=0,score=0;

function renderQuestion(){
  const q=questions[qi];
  $("#quizProgress").textContent=`السؤال ${qi+1} من ${questions.length}`;
  $("#quizScore").textContent=`${score} نقاط`;
  $("#question").textContent=q[0];
  $("#answers").innerHTML=q[1].map((a,i)=>`<button class="answer" data-index="${i}">${a}</button>`).join("");
  document.querySelectorAll(".answer").forEach(btn=>{
    btn.addEventListener("click",()=>answerQuestion(Number(btn.dataset.index),btn));
  });
}
function answerQuestion(index,clicked){
  document.querySelectorAll(".answer").forEach(b=>b.disabled=true);
  const correct=questions[qi][2];
  if(index===correct){ score++; clicked.classList.add("correct"); }
  else{
    clicked.classList.add("wrong");
    const right=document.querySelector(`.answer[data-index="${correct}"]`);
    if(right) right.classList.add("correct");
  }
  $("#quizScore").textContent=`${score} نقاط`;
  setTimeout(()=>{
    qi++;
    if(qi<questions.length) renderQuestion();
    else{
      $("#question").textContent=`انتهى الاختبار! نتيجتك ${score} من ${questions.length} 🎉`;
      $("#answers").innerHTML="";
      $("#startQuiz").textContent="إعادة الاختبار";
    }
  },700);
}
$("#startQuiz").addEventListener("click",()=>{
  qi=0;score=0;
  $("#startQuiz").textContent="الاختبار مستمر";
  renderQuestion();
});

const regionData={
 "الرياض":["العاصمة وأكبر مدن المملكة","من أبرز معالمها برج المملكة ومركز الملك عبدالله المالي."],
 "مكة المكرمة":["مهد الحرم المكي الشريف","تضم المسجد الحرام والمشاعر المقدسة."],
 "المدينة المنورة":["مدينة رسول الله ﷺ","تضم المسجد النبوي الشريف ومواقع تاريخية مهمة."],
 "القصيم":["منطقة تشتهر بالزراعة والتمور","من مدنها بريدة وعنيزة."],
 "حائل":["منطقة تاريخية في شمال وسط المملكة","تشتهر بجبل أجا وسلمى."],
 "المنطقة الشرقية":["منطقة ساحلية غنية بالتنوع الاقتصادي","تضم الدمام والخبر والأحساء."],
 "عسير":["منطقة جبلية ذات طبيعة خلابة","تشتهر بأبها والمرتفعات والقرى التراثية."],
 "تبوك":["منطقة شمال غرب المملكة","تتميز بالسواحل والمعالم الطبيعية والتاريخية."],
 "جازان":["منطقة ساحلية جنوب غرب المملكة","تشتهر بجزر فرسان وتنوعها الطبيعي."],
 "نجران":["منطقة جنوبية ذات تراث عريق","تشتهر بالأخدود والعمارة الطينية."],
 "الباحة":["منطقة جبلية خضراء","تشتهر بالغابات والقرى التراثية."],
 "الجوف":["منطقة شمالية ذات تاريخ قديم","تشتهر بزراعة الزيتون وآثارها التاريخية."],
 "الحدود الشمالية":["منطقة في شمال المملكة","تضم عرعر وتتميز بموقعها الحدودي."],
};
const regionNames=Object.keys(regionData);
$("#regions").innerHTML=regionNames.map(name=>`<button data-region="${name}">${name}</button>`).join("");

function openDiscovery(){ $("#modal").classList.add("show"); }
function closeDiscovery(){ $("#modal").classList.remove("show"); }
$("#regionBtn").addEventListener("click",openDiscovery);
$("#closeModal").addEventListener("click",closeDiscovery);
$("#modal").addEventListener("click",(e)=>{if(e.target===e.currentTarget)closeDiscovery();});

$("#regions").addEventListener("click",(e)=>{
  const btn=e.target.closest("[data-region]");
  if(!btn)return;
  const [title,desc]=regionData[btn.dataset.region];
  $("#regionInfo").innerHTML=`<strong>📍 ${btn.dataset.region}</strong><span>${title} — ${desc}</span>`;
});

$("#nameInput").addEventListener("input",(e)=>{
  $("#previewName").textContent=e.target.value.trim()||"وسيم";
});

$("#makeCard").addEventListener("click",()=>{
  const name=$("#nameInput").value.trim()||"وسيم";
  const region=$("#regionSelect").value;
  $("#generatedName").textContent=name;
  $("#generatedRegion").textContent=region;
  $("#cardModal").classList.add("show");
});
$("#closeCard").addEventListener("click",()=>$("#cardModal").classList.remove("show"));
$("#cardModal").addEventListener("click",(e)=>{
  if(e.target===e.currentTarget)$("#cardModal").classList.remove("show");
});

$("#downloadCard").addEventListener("click",()=>{
  const card=document.querySelector(".generated-card");
  const rect=card.getBoundingClientRect();
  const canvas=document.createElement("canvas");
  const scale=2; canvas.width=rect.width*scale; canvas.height=rect.height*scale;
  const ctx=canvas.getContext("2d"); ctx.scale(scale,scale);
  const grad=ctx.createLinearGradient(0,0,rect.width,rect.height);
  grad.addColorStop(0,"#eaf0e9");grad.addColorStop(.52,"#c4d9cf");grad.addColorStop(1,"#76b99f");
  ctx.fillStyle=grad;ctx.roundRect(0,0,rect.width,rect.height,24);ctx.fill();
  ctx.fillStyle="#087553";ctx.font="800 13px Cairo";ctx.direction="rtl";ctx.textAlign="right";
  ctx.fillText("اليوم الوطني السعودي 96",rect.width-28,42);
  ctx.fillStyle="#07372a";ctx.font="900 30px Cairo";ctx.fillText("دام عزك يا وطن",rect.width-28,82);
  ctx.font="900 38px Cairo";ctx.fillText($("#generatedName").textContent,rect.width-28,135);
  ctx.font="700 14px Cairo";ctx.fillText($("#generatedRegion").textContent,rect.width-28,165);
  ctx.font="800 13px Cairo";ctx.fillText("مستقبلنا بأيدينا 🇸🇦",rect.width-28,rect.height-25);
  const link=document.createElement("a");
  link.download=`وطننا-96-${$("#generatedName").textContent}.png`;
  link.href=canvas.toDataURL("image/png");link.click();
  toast("تم تحميل بطاقتك بنجاح 📸");
});

function toast(text){
  const t=$("#toast");t.textContent=text;t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2200);
}

document.querySelectorAll(".navbar nav a").forEach(link=>{
  link.addEventListener("click",()=>{
    document.querySelectorAll(".navbar nav a").forEach(a=>a.classList.remove("active"));
    link.classList.add("active");
  });
});
