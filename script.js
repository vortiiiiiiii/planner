const data = JSON.parse(localStorage.getItem("planner")) || {
  weeks: []
};

let currentWeekIndex = null;

function save(){
  localStorage.setItem("planner", JSON.stringify(data));
}

/* ---------- HAFTALAR ---------- */
function renderWeeks(){
  const weeksDiv = document.getElementById("weeks");
  weeksDiv.innerHTML = "";

  data.weeks.forEach((week, index) => {
    const box = document.createElement("div");
    box.className = "week-box";
    if(week.done) box.classList.add("done");

    box.innerHTML = `
      <div class="delete-week">✕</div>
      <div class="ribbon-check">🎀</div>
      ${index + 1}. Hafta
    `;

    box.onclick = () => openWeek(index);

    box.querySelector(".delete-week").onclick = (e)=>{
      e.stopPropagation();
      data.weeks.splice(index,1);
      save();
      renderWeeks();
    };

    box.querySelector(".ribbon-check").onclick = (e)=>{
      e.stopPropagation();
      week.done = !week.done;
      save();
      renderWeeks();
    };

    weeksDiv.appendChild(box);
  });
}

function addWeek(){
  data.weeks.push({
    done:false,
    subjects:[]
  });
  save();
  renderWeeks();
}

/* ---------- DETAY ---------- */
function openWeek(index){
  currentWeekIndex = index;
  document.getElementById("overview").style.display = "none";
  document.getElementById("detail").style.display = "block";
  document.getElementById("weekTitle").textContent = `${index+1}. Hafta`;
  renderSubjects();
}

function back(){
  document.getElementById("detail").style.display = "none";
  document.getElementById("overview").style.display = "block";
}

/* ---------- KONULAR ---------- */
function addSubject(){
  data.weeks[currentWeekIndex].subjects.push({
    title:"Yeni konu",
    items:[]
  });
  save();
  renderSubjects();
}

function renderSubjects(){
  const subjectsDiv = document.getElementById("subjects");
  subjectsDiv.innerHTML = "";

  data.weeks[currentWeekIndex].subjects.forEach((subject, sIndex)=>{
    const box = document.createElement("div");
    box.className = "subject";

    /* konu sil */
    const delSub = document.createElement("div");
    delSub.className = "delete-subject";
    delSub.textContent = "✕";
    delSub.onclick = ()=>{
      data.weeks[currentWeekIndex].subjects.splice(sIndex,1);
      save();
      renderSubjects();
    };

    const title = document.createElement("input");
    title.value = subject.title;
    title.placeholder = "Yeni konu";

    title.onfocus = ()=>{
      if(title.value === "Yeni konu") title.value = "";
    };
    title.oninput = ()=>{
      subject.title = title.value || "Yeni konu";
      save();
    };

    const addItemBtn = document.createElement("button");
    addItemBtn.textContent = "➕ Madde ekle";
    addItemBtn.onclick = ()=>{
      subject.items.push({ text:"", done:false });
      save();
      renderSubjects();
    };

    box.appendChild(delSub);
    box.appendChild(title);
    box.appendChild(addItemBtn);

    subject.items.forEach((item, iIndex)=>{
      const row = document.createElement("div");
      row.className = "item";
      if(item.done) row.classList.add("done");

const tick = document.createElement("div");
tick.className = "tick-circle";
tick.onclick = ()=>{
  item.done = !item.done;
  save();
  renderSubjects();
};


      const text = document.createElement("input");
      text.type = "text";
      text.value = item.text;
      text.oninput = ()=>{
        item.text = text.value;
        save();
      };

      const ribbon = document.createElement("div");
      ribbon.className = "ribbon-check";
      ribbon.textContent = "🎀";
      ribbon.onclick = ()=>{
        item.done = !item.done;
        save();
        renderSubjects();
      };

      const delItem = document.createElement("div");
      delItem.className = "delete-item";
      delItem.textContent = "✕";
      delItem.onclick = ()=>{
        subject.items.splice(iIndex,1);
        save();
        renderSubjects();
      };
 
  row.appendChild(tick);
  row.appendChild(text);
  row.appendChild(delItem);
  row.appendChild(ribbon);


      box.appendChild(row);
    });

    subjectsDiv.appendChild(box);
  });
}

/* ---------- BUTONLAR ---------- */
document.getElementById("addWeekBtn").onclick = addWeek;
document.getElementById("backBtn").onclick = back;
document.getElementById("addSubjectBtn").onclick = addSubject;

renderWeeks();

document.querySelectorAll(".check-box").forEach(box => {
  box.addEventListener("click", () => {
    box.classList.toggle("checked");
    let konu = box.parentElement; // konu divi
    konu.classList.toggle("strikethrough");
  });
});
// Ana sayfa butonları
const home = document.getElementById("home");
const weeksPage = document.getElementById("weeksPage");
const derslerPage = document.getElementById("derslerPage");

document.getElementById("showWeeksBtn").onclick = () => {
  home.style.display = "none";
  weeksPage.style.display = "block";
};

document.getElementById("showDerslerBtn").onclick = () => {
  home.style.display = "none";
  derslerPage.style.display = "block";
};

document.getElementById("backFromWeeks").onclick = () => {
  weeksPage.style.display = "none";
  home.style.display = "block";
};

document.getElementById("backFromDersler").onclick = () => {
  derslerPage.style.display = "none";
  home.style.display = "block";
};

// --------- Haftalık Plan JS (senin eski kodları buraya) ---------
// const data = ...
// renderWeeks(), addWeek(), openWeek(), addSubject() vs.
// Eski script kodunu buraya ekle

// --------- Dersler check-box JS ---------
document.querySelectorAll(".check-box").forEach(box => {
  box.addEventListener("click", () => {
    box.classList.toggle("checked");
    box.parentElement.classList.toggle("strikethrough");
  });
});

// --------- Geri sayım ---------
function countdown(targetId, dateStr){
  const el = document.getElementById(targetId);
  function update(){
    const now = new Date();
    const target = new Date(dateStr);
    const diff = target - now;
    if(diff < 0){
      el.textContent = "Süre doldu!";
      return;
    }
    const days = Math.floor(diff/1000/60/60/24);
    const hours = Math.floor(diff/1000/60/60)%24;
    const minutes = Math.floor(diff/1000/60)%60;
    const seconds = Math.floor(diff/1000)%60;
    el.textContent = `${days} gün ${hours} saat ${minutes} dk ${seconds} sn`;
  }
  update();
  setInterval(update, 1000);
}
function countdown(targetId, dateStr) {
  const el = document.getElementById(targetId);

  function update() {
    const now = new Date();
    const target = new Date(dateStr);
    let diff = target - now;

    if (diff < 0) {
      el.textContent = "Süre doldu!";
      return;
    }

    // Toplam gün sayısı
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Ay sayısı yaklaşık (1 ay = 30 gün)
    const months = Math.floor(totalDays / 30);
    const daysAfterMonths = totalDays % 30;

    // Hafta sayısı
    const weeks = Math.floor(daysAfterMonths / 7);
    const days = daysAfterMonths % 7;

    el.textContent = `${months} ay ${weeks} hafta ${days} gün`;
  }

  update();
  setInterval(update, 1000 * 60 * 60); // her saat güncelle
}

// Kullanım:
countdown("kpss-timer", "2026-10-04T00:00:00");
countdown("dgs-timer", "2026-07-19T00:00:00");



// Dersler sayfasındaki kutucuk işaretleme
document.querySelectorAll('#derslerPage .check-box').forEach(box => {
  box.addEventListener('click', function() {
    const konu = this.parentElement.querySelector('span');

    // Eğer zaten işaretli ise kaldır, değilse ekle
    if (konu.classList.contains('done')) {
      konu.classList.remove('done');
      this.style.backgroundColor = ''; // kutucuğu boş yap
    } else {
      konu.classList.add('done');
      this.style.backgroundColor = '#f3a6c8'; // pembe kutucuk
    }
  });
});
