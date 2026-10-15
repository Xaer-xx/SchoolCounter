const el = id => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");

// Cieľ: najbližší 24.12. o 0:00 (lokálny čas)
function getTarget(now) {
  let t = new Date(now.getFullYear(), 11, 24, 0, 0, 0, 0);
  // Počas 24.–26.12. ukážeme oslavnú správu, potom odpočítavame na ďalší rok
  const endCelebration = new Date(now.getFullYear(), 11, 27, 0, 0, 0, 0);
  if (now >= endCelebration) {
    t = new Date(now.getFullYear() + 1, 11, 24, 0, 0, 0, 0);
  }
  return t;
}

// "Nástenný" čas v ms (ignoruje posun letného/zimného času)
const wall = d => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(),
                           d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());

// Pripočíta n mesiacov; ak mesiac nemá taký deň, použije jeho posledný deň
function addMonths(d, n) {
  const y = d.getFullYear(), m = d.getMonth() + n;
  const lastDay = new Date(y, m + 1, 0).getDate();
  return new Date(y, m, Math.min(d.getDate(), lastDay),
                  d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
}

function tick() {
  const now = new Date();
  const target = getTarget(now);

  if (now >= target) {
    el("countdown").style.display = "none";
    el("message").style.display = "block";
    return;
  }
  el("countdown").style.display = "";
  el("message").style.display = "none";

  // Celé kalendárne mesiace
  let months = (target.getFullYear() - now.getFullYear()) * 12 +
               (target.getMonth() - now.getMonth());
  while (months > 0 && addMonths(now, months) > target) months--;

  // Zvyšok po mesiacoch
  let rest = wall(target) - wall(addMonths(now, months));

  const SEC = 1000, MIN = 60 * SEC, HOUR = 60 * MIN,
        DAY = 24 * HOUR, WEEK = 7 * DAY;

  const weeks = Math.floor(rest / WEEK);  rest -= weeks * WEEK;
  const days = Math.floor(rest / DAY);    rest -= days * DAY;
  const hours = Math.floor(rest / HOUR);  rest -= hours * HOUR;
  const minutes = Math.floor(rest / MIN); rest -= minutes * MIN;
  // zaokrúhlenie nahor, aby sa pri zobrazení nezastavilo na 0 sekundách o sekundu skôr
  const seconds = Math.ceil(rest / SEC);

  // ošetrenie preklopenia 60 s -> +1 minúta
  let s = seconds, m = minutes, h = hours, d = days, w = weeks;
  if (s === 60) { s = 0; m++; }
  if (m === 60) { m = 0; h++; }
  if (h === 24) { h = 0; d++; }
  if (d === 7)  { d = 0; w++; }

  el("months").textContent = months;
  el("weeks").textContent = w;
  el("days").textContent = d;
  el("hours").textContent = pad(h);
  el("minutes").textContent = pad(m);
  el("seconds").textContent = pad(s);
}

// Aktualizácia presne na začiatku každej sekundy
function loop() {
  tick();
  setTimeout(loop, 1000 - (Date.now() % 1000));
}

// Sneženie
function snowflake() {
  const s = document.createElement("div");
  s.className = "snow";
  s.textContent = "❄";
  s.style.left = Math.random() * 100 + "vw";
  s.style.fontSize = (10 + Math.random() * 18) + "px";
  s.style.opacity = .4 + Math.random() * .6;
  const dur = 6 + Math.random() * 8;
  s.style.animationDuration = dur + "s";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), dur * 1000);
}
setInterval(snowflake, 350);

loop();