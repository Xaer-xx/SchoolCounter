const el = id => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");

// Cieľ: 15. február daného roka o 0:00 (lokálny čas)
function getTarget(now) {
  let year = now.getFullYear();
  let t = new Date(year, 1, 15, 0, 0, 0, 0); // Meniť mesiac na 1, keďže január je 0 a február je 1
  
  // Počas 3 dní od tohto dátumu ukážeme oslavnú správu, potom odpočítavame na ďalší rok
  const endCelebration = new Date(year, 1, 15 + 3, 0, 0, 0, 0);
  
  if (now >= endCelebration) {
    t = new Date(year + 1, 1, 15, 0, 0, 0, 0);
  } else if (now > t && now < endCelebration) {
    // Ak prebieha samotná oslava
    t = new Date(year, 1, 15, 0, 0, 0, 0);
  }
  
  // Ak je už po 15. februári, ale ešte neuplynuli 3 dni
  if (now >= t && now < endCelebration) {
    return t;
  }
  
  // Ak už prešiel aj čas osláv, cieli na ďalší rok
  if (now >= endCelebration) {
    t = new Date(year + 1, 1, 15, 0, 0, 0, 0);
  }
  
  return t;
}

// Jednoduchšia verzia getTarget funkcie:
function getTargetSimple(now) {
  let year = now.getFullYear();
  let t = new Date(year, 1, 15, 0, 0, 0, 0); // 15. február
  const endCelebration = new Date(year, 1, 18, 0, 0, 0, 0); // + 3 dni osláv

  if (now >= endCelebration) {
    t = new Date(year + 1, 1, 15, 0, 0, 0, 0);
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
  const target = getTargetSimple(now);

  if (now >= target && now < new Date(target.getFullYear(), target.getMonth(), target.getDate() + 3)) {
    el("countdown").style.display = "none";
    el("message").style.display = "block";
    return;
  }
  
  // Ak už prešli aj 3 dni osláv, target sa posunul na ďalší rok, takže odpočítavame
  if (now >= target) {
    // Ak by nastal okrajový stav
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

// Sneženie (alebo kvety, podľa pôvodného kódu)
function snowflake() {
  const s = document.createElement("div");
  s.className = "snow";
  s.textContent = "🌺";
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