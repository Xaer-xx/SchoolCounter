document.addEventListener("DOMContentLoaded", () => {
  const el = id => document.getElementById(id);
  const pad = n => String(n).padStart(2, "0");

  // Cieľový deň: 29. október daného roka
  function targetDate(year) {
    return new Date(year, 9, 29, 0, 0, 0, 0); // Mesiac 9 je október (0-indexované)
  }

  // Cieľ: najbližší 29. október o 0:00 (lokálny čas)
  function getTarget(now) {
    let t = targetDate(now.getFullYear());
    const endCelebration = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 3, 0, 0, 0, 0);
    if (now >= endCelebration) {
      t = targetDate(now.getFullYear() + 1);
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

    const countdownEl = el("countdown");
    const messageEl = el("message");

    if (now >= target) {
      if (countdownEl) countdownEl.style.display = "none";
      if (messageEl) messageEl.style.display = "block";
      return;
    }
    if (countdownEl) countdownEl.style.display = "";
    if (messageEl) messageEl.style.display = "none";

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
    const seconds = Math.ceil(rest / SEC);

    // ošetrenie preklopenia 60 s -> +1 minúta
    let s = seconds, m = minutes, h = hours, d = days, w = weeks;
    if (s === 60) { s = 0; m++; }
    if (m === 60) { m = 0; h++; }
    if (h === 24) { h = 0; d++; }
    if (d === 7)  { d = 0; w++; }

    if (el("months")) el("months").textContent = months;
    if (el("weeks")) el("weeks").textContent = w;
    if (el("days")) el("days").textContent = d;
    if (el("hours")) el("hours").textContent = pad(h);
    if (el("minutes")) el("minutes").textContent = pad(m);
    if (el("seconds")) el("seconds").textContent = pad(s);
  }

  // Aktualizácia presne na začiatku každej sekundy
  function loop() {
    tick();
    setTimeout(loop, 1000 - (Date.now() % 1000));
  }

  // Padajúce lístie / symboly namiesto snehu
  function snowflake() {
    const s = document.createElement("div");
    s.className = "snow";
    s.textContent = "🍁";
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
});