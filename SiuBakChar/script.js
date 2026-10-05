/* ==========================================================================
   bonzili.me — birthday surprise
   Everything you'll want to edit lives in CONFIG + CONTENT below.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1) CONFIG — the only technical bit you need to touch
   -------------------------------------------------------------------------- */
const CONFIG = {
  /* Her birthday, with timezone. Format: YYYY-MM-DDTHH:mm:ss+HH:MM */
  birthday: "2026-10-12T00:00:00+08:00",

  /* Background music — drop the files into assets/ with these names,
     or change the paths. Leave a value as "" to disable that track.
     waiting page: 五月天《因為你 所以我》 / celebration page: 五月天《相信》 */
  music: {
    cover: "assets/because-of-you.mp3",
    celebrate: "assets/believe.mp3",
    volume: 0.2,
  },

  /* Open-when letters: one more letter becomes available at each of these
     times (Hong Kong time, UTC+8). Missed weeks carry over. */
  openWhen: {
    unlockTimes: [
      "2026-09-18T19:00:00+08:00",
      "2026-09-25T19:00:00+08:00",
      "2026-10-02T19:00:00+08:00",
    ],
  },
};

/* --------------------------------------------------------------------------
   2) CONTENT — all the words on the page (English; Chinese slots ready to fill later)
   -------------------------------------------------------------------------- */
const CONTENT = {
  /* The letter typed out under the title */
  letter:
    "To my beloved Siu Bak BB,\n\n" +
    "實體信 is way better so let me take out the real one:D\n\n" +
    "生生生生生生日日日日日日快快快快快快樂樂樂樂樂樂\n\n" +
    "Forever yours,\nSiu Gai Mo",

  /* Optional Chinese version of the letter — fill this in later and it appears automatically */
  letterZh: "",

  /* Love-story timeline — add / remove / edit freely.
     Optional `photos: ["assets/xxx.jpg"]` drops a tappable photo into the card. */
  timeline: [
    {
      when: "20 Mar 2026",
      title: "First day matched:D",
      zhTitle: "",
      text: "喺茫茫人海裡面match到你係我最大嘅幸運<3 好彩當時opening嗰陣你問weekend最想做乜我冇剩係答到訓到自然醒:D",
      zhText: "",
    },
    {
      when: "12 Apr 2026",
      title: "Our first date",
      zhTitle: "",
      text: "好好好緊張嘅第一次Date:D 嗰陣同你傾計知你中意狗點知轉頭就比我係IG 見到依間狗狗cafe:D 就係咁啱啱好<3",
      zhText: "",
      photos: ["assets/first-date.jpg"],
    },
    {
      when: "19 Apr 2026",
      title: "Officially us",
      zhTitle: "",
      text: "其實成晚都好想揾機會同你表白但又唔知點開口好。由灣仔周圍行行到海旁，雖然都係好好好緊張唔知自己要做乜好但係ICC嗰個擁抱時機·活出精彩嘅Banner鼓勵左我:D 我們的故事從此正式開啟💙",
      zhText: "",
    },
    {
      when: "8 Jul 2026",
      title: "Our first trip together",
      zhTitle: "",
      text: "嗰三場演唱會係我睇過最好睇嘅演唱會:D 多謝有你一入坑就陪我睇左三場<3 有你陪我慶祝生日，就算中間打風最後冇得去阿里山成個Trip我都好好好開心!",
      zhText: "",
      photos: ["assets/mayday.jpg"],
    },
    {
      when: "26 Aug 2026",
      title: "Our second trip to Japan",
      zhTitle: "",
      text: "成日都覺得自己頭幾日係日本根本唔知做緊乜:0)到你到左日本之後先開始真正嘅日本之旅<3 不過無論煙花幾靚都好都唔及有你係我身邊一齊睇💙",
      zhText: "",
      photos: ["assets/hanabi.jpg", "assets/disney.jpg"],
    },
    {
      when: "Today, and every day after",
      title: "Happy Birthday:D",
      zhTitle: "",
      text: "吳仲翎，生日快樂，就算生日以外都希望你日日快樂💙",
      zhText: "",
    },
  ],

  /* Polaroid wall — drop real files into assets/ and set src, e.g. src:"assets/photo-01.jpg" */
  gallery: [
    { cap: "Our first date", zh: "", src: "assets/first-date.jpg" },
    { cap: "Mayday", zh: "", src: "assets/mayday.jpg" },
    { cap: "Hanabi", zh: "", src: "assets/hanabi.jpg" },
    { cap: "Kai Tak", zh: "", src: "assets/kaitak.jpg" },
    { cap: "Disneyland", zh: "", src: "assets/disney.jpg" },
    { cap: "Camping", zh: "", src: "assets/camping.jpg" },
  ],

  /* "More and more incoming…" carousel — add photos any time with
     { cap: "…", src: "assets/xxx.jpg" }. Leave src empty until you have the file. */
  carousel: [
    { cap: "Taipei~", zh: "", src: "assets/carousell/carousel-1.jpg", pos: "20% 45%" },
    { cap: "Enoshima~", zh: "", src: "assets/carousell/carousel-2.jpg", pos: "42% 42%" },
    { cap: "Tokyo Disneyland~", zh: "", src: "assets/carousell/carousel-3.jpg", pos: "50% 45%" },
    { cap: "Picnic:D", zh: "", src: "assets/carousell/carousel-4.jpg", pos: "50% 30%" },
    { cap: "Mid Autumn!", zh: "", src: "assets/carousell/carousel-5.jpg", pos: "50% 55%" },
    { cap: "Lantern fair~", zh: "", src: "assets/carousell/mid-autumn.jpg", pos: "50% 30%" },
    { cap: "Happy Day 100<3", zh: "", src: "assets/carousell/carousel-6.jpg", pos: "50% 45%" },
    { cap: "HKUST", zh: "", src: "assets/carousell/carousel-7.jpg", pos: "50% 90%" },
    { cap: ":0", zh: "", src: "assets/carousell/carousel-8.jpg", pos: "32% 45%" },
  ],

  /* Open-when letters — write your own words in `body` (and optional `bodyZh`).
     Any one can be opened, then a 7-day cooldown starts before the next. */
  openWhen: [
    {
      icon: "🌪️",
      en: "you feel overwhelmed",
      zh: "",
      gif: "assets/overwhelmed.gif",
      body: "Take a deep breath!",
      bodyZh: "I know it feels like a million things are being thrown at you rn and there just aren't enough hours in the day to give everything it deserves. I didn't know how to say this but listen to me: You are not falling behind, and you are NOT greedy. You simply love life and want to experience everything it has to offerrrr. You have such a kind heart full of curiosity and excitement for life (just like meee:D) and this is a beautiful thing! Life is a longgggggggg journey meant to be treasured. Rmb you are a human not a machine:< Your worth doesnt decrease when you rest and people who love you just for you being yourself! Get a glass of water, take a deep breath, pick just one small task to finish. I believe in you so much, and no matter what me dou hai gum proud of my bb💙",
    },
    {
      icon: "💧",
      en: "you're having a hard day",
      zh: "",
      gif: "assets/hard-day.gif",
      body: "My love,",
      bodyZh: "I bet today was completely flooded with annoying tasks from seniors:< I’m sorry everything felt so frustrating today. Put everything down, take a deep breath, and just rest right now! A bad day is just 24 hours that didn’t go your way, but it does NOT mean your whole life is messed up. You don’t need to be strong, solve any big problems, or be productive all the timee gahhh. You did your best today, and you survived it~ Like YYLam alway says 薄盡無悔! Your only job for the rest of tonight is to lie on the bed and just hea:D. Tomorrow gets to be a completely fresh blank page. Sending you the biggest hugggg from siu gai mo:D. Get some more rest. You did good today and me dim dou hai gum support my bb💙",
    },
    {
      icon: "🫂",
      en: "you miss me",
      zh: "",
      gif: "assets/miss-me.gif",
      body: "Hey bbbbbbb,",
      bodyZh: "Good news: I'm missing you just as muchhhh (probably even moreee:D)! I wish I could just pop up right next to you right now and give u a biggggg hugggg and tip tip:p (lowkey I really like tip tip with uuuuuuuu even tho my face wui hai sai nei d jong:D). Every single second that passes right now is just counting down until we can see each other very soonnn. I bet we'll see each other super soon!! In the mean time, just close your eyes, imagine me hugging you tight, and text me/call me/annoy me whenever you read this:D I'm also missing you and can't wait to see my bb soon tooo💙",
    },
    {
      icon: "✨",
      en: "you doubt yourself",
      zh: "",
      gif: "assets/doubt-yourself.gif",
      body: "To the girl I believe in most,",
      bodyZh: "Stop being too harsh on yourself:< I really wish you could see how amazing you look through my eyes — you’re way smarter and better at things than you give yourself credit for! Think about all those scary, difficult things you’ve faced before, u dou managed to figure them out anyway! If you're feeling unsure right now, it's only because you care deeply, but that definitely doesn’t mean you’re incapable! Whenever your own confidence runs out, feel free to borrow mine, because I know exactly what kind of magic you're capable of creating:D (Suddenly reminds me of that DisneySea song when I'm writing this lmao). Just take it step by step. I believe in my lek lek geh Siu Bakkkk must be able to do it!",
    },
  ],

  /* Fallback GIF used if a letter has no `gif`, or its gif file is missing.
     Each letter's own gif is set in the `gif` field above. Set to "" to disable. */
  letterGif: "assets/SiuBakandSiuGaiMo.gif",

  /* Footer lyric on the celebration page */
  lyric: "勾勾手蓋手印，這一刻有約定。<br>那愛情變美麗，因為我開始相信。",
  lyricCite: "— 五月天《相信》",

  /* Hidden message behind the moon */
  secret:
    "P.S. 願紅花與太陽，永遠同乘💙",
};

/* ==========================================================================
   Everything below is the engine — you shouldn't need to edit it.
   ========================================================================== */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const GRADS = [
  ["#aed9f5", "#ffc2dc"],
  ["#c9b8f5", "#a9e8d4"],
  ["#ffe39a", "#ffc2dc"],
  ["#a9e8d4", "#aed9f5"],
  ["#ffc2dc", "#c9b8f5"],
  ["#aed9f5", "#ffe39a"],
  ["#c9b8f5", "#aed9f5"],
  ["#a9e8d4", "#ffe39a"],
];
const ENV_COLORS = ["#aed9f5", "#ffc2dc", "#c9b8f5", "#a9e8d4", "#ffe39a", "#aed9f5"];

const $ = (id) => document.getElementById(id);

/* look up a caption for a photo path from whichever list already knows about it */
function capFor(src) {
  const pools = [].concat(CONTENT.gallery || [], CONTENT.carousel || []);
  for (const p of pools) if (p.src === src) return p.cap || "";
  return "";
}

/* ---------------- rendering ---------------- */
function renderTimeline() {
  $("timeline-list").innerHTML = CONTENT.timeline
    .map(
      (item) => `
      <li class="timeline__item reveal">
        <span class="timeline__dot"></span>
        <div class="card">
          <p class="card__date">${item.when}</p>
          <h3 class="card__title">${item.title}${item.zhTitle ? `<span class="card__zh">${item.zhTitle}</span>` : ""}</h3>
          <p class="card__text">${item.text}</p>
          ${item.zhText ? `<p class="card__text">${item.zhText}</p>` : ""}
          ${
            item.photos && item.photos.length
              ? `<div class="card__photos">${item.photos
                  .map(
                    (src, i) =>
                      `<button class="card__photo" type="button" data-list="tl:${item.when}" data-i="${i}" aria-label="See the photo from ${item.when} bigger"><img src="${src}" alt="${capFor(src)}" loading="lazy" decoding="async"></button>`
                  )
                  .join("")}</div>`
              : ""
          }
        </div>
      </li>`
    )
    .join("");
}

function renderGallery() {
  $("gallery-grid").innerHTML = CONTENT.gallery
    .map((g, i) => {
      const grad = GRADS[i % GRADS.length];
      const tilt = (i % 2 ? 1 : -1) * (2 + (i % 3));
      const media = g.src
        ? `<button class="polaroid__open" type="button" data-list="wall" data-i="${i}" aria-label="See ${g.cap} bigger">
             <img class="polaroid__photo" src="${g.src}" alt="${g.cap}" loading="lazy" decoding="async"${
               g.pos ? ` style="object-position:${g.pos}"` : ""
             }>
           </button>`
        : `<div class="photo-ph" style="--g1:${grad[0]};--g2:${grad[1]}">${String(i + 1).padStart(2, "0")}</div>`;
      return `
        <figure class="polaroid reveal" style="--tilt:${tilt}deg">
          <span class="polaroid__tape" aria-hidden="true"></span>
          ${media}
          <figcaption class="polaroid__cap"><b>${g.cap}</b>${g.zh}</figcaption>
        </figure>`;
    })
    .join("");

  const btn = $("slideshow-btn");
  if (btn) btn.textContent = `▶ Play all ${CONTENT.gallery.filter((g) => g.src).length}`;
}

function renderCarousel() {
  const track = $("carousel-track");
  if (!track) return;
  track.innerHTML = CONTENT.carousel
    .map((c, i) => {
      const grad = GRADS[(i + 3) % GRADS.length];
      const media = c.src
        ? `<button class="slide__open" type="button" data-list="carousel" data-i="${i}" aria-label="See ${c.cap} bigger">
             <img class="slide__img" src="${c.src}" alt="${c.cap}" loading="lazy" decoding="async"${
               c.pos ? ` style="object-position:${c.pos}"` : ""
             }>
           </button>`
        : `<div class="slide__ph" style="--g1:${grad[0]};--g2:${grad[1]}" aria-hidden="true">✦</div>`;
      return `
        <figure class="slide">
          <div class="slide__media">${media}</div>
          <figcaption class="slide__cap">${c.cap}${c.zh ? ` · ${c.zh}` : ""}</figcaption>
        </figure>`;
    })
    .join("");
}

function initCarousel() {
  const track = $("carousel-track");
  const wrap = $("carousel");
  if (!track) return;

  const slides = () => [...track.querySelectorAll(".slide")];
  const step = () => {
    const first = track.querySelector(".slide");
    return first ? first.getBoundingClientRect().width + 16 : 260;
  };

  /* dots: how many photos there are, and which one she's looking at.
     Not focusable — the track itself is keyboard-scrollable with arrow keys. */
  const dotsBox = $("carousel-dots");
  if (dotsBox) {
    dotsBox.innerHTML = CONTENT.carousel
      .map(
        (_, i) =>
          `<button class="carousel__dot" type="button" tabindex="-1" data-i="${i}" aria-label="Photo ${i + 1}"></button>`
      )
      .join("");
    dotsBox.addEventListener("click", (e) => {
      const dot = e.target.closest(".carousel__dot");
      if (dot) scrollToSlide(Number(dot.dataset.i));
    });
  }

  function scrollToSlide(i) {
    const s = slides()[i];
    if (!s) return;
    const left = s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2;
    track.scrollTo({ left: Math.max(0, left), behavior: REDUCED ? "auto" : "smooth" });
  }

  let pending = 0;
  function sync() {
    pending = 0;
    const list = slides();
    if (!list.length) return;
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    list.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    if (dotsBox) {
      [...dotsBox.children].forEach((d, i) => d.classList.toggle("is-on", i === best));
    }
    const max = track.scrollWidth - track.clientWidth;
    const x = track.scrollLeft;
    const prev = $("carousel-prev");
    const next = $("carousel-next");
    if (prev) prev.disabled = x <= 2;
    if (next) next.disabled = x >= max - 2;
    if (wrap) {
      wrap.classList.toggle("fade-l", x > 2);
      wrap.classList.toggle("fade-r", x < max - 2);
    }
  }
  track.addEventListener(
    "scroll",
    () => {
      if (!pending) pending = requestAnimationFrame(sync);
    },
    { passive: true }
  );
  window.addEventListener("resize", sync);

  const prev = $("carousel-prev");
  const next = $("carousel-next");
  if (prev) prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: REDUCED ? "auto" : "smooth" }));
  if (next) next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: REDUCED ? "auto" : "smooth" }));
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      track.scrollBy({ left: step(), behavior: REDUCED ? "auto" : "smooth" });
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      track.scrollBy({ left: -step(), behavior: REDUCED ? "auto" : "smooth" });
    }
  });

  sync();
  /* images finish loading after first paint — re-measure once they do */
  window.addEventListener("load", sync);
  track.querySelectorAll("img").forEach((img) => img.addEventListener("load", sync, { once: true }));
}

function renderEnvelopes() {
  const list = $("envelope-list");
  if (!list) return;
  list.innerHTML = CONTENT.openWhen
    .map(
      (l, i) => `
      <button class="envelope reveal" style="--env:${ENV_COLORS[i % ENV_COLORS.length]}" data-index="${i}" type="button">
        <span class="envelope__icon" aria-hidden="true">${l.icon}</span>
        <span class="envelope__label">Open when ${l.en}</span>
        ${l.zh ? `<span class="envelope__zh">${l.zh}</span>` : ""}
        <span class="envelope__hint" data-hint></span>
      </button>`
    )
    .join("");
  refreshEnvelopeStates();
}

function renderFooter() {
  $("footer-lyric").innerHTML = `&ldquo;${CONTENT.lyric}&rdquo;<cite>${CONTENT.lyricCite}</cite>`;
}

/* ---------------- countdown & unlock ---------------- */
function renderHeroDate() {
  const el = $("hero-date");
  if (!el) return;
  const stamp = new Date(CONFIG.birthday);
  if (Number.isNaN(stamp.getTime())) return;
  /* read it in Hong Kong time so it always matches the countdown */
  const hk = new Date(stamp.getTime() + 8 * 3600 * 1000);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  el.textContent = `${hk.getUTCDate()} ${months[hk.getUTCMonth()]} ${hk.getUTCFullYear()}`;
}

function setCountdown(d, h, m, s) {
  $("cd-days").textContent = d;
  $("cd-hours").textContent = String(h).padStart(2, "0");
  $("cd-mins").textContent = String(m).padStart(2, "0");
  $("cd-secs").textContent = String(s).padStart(2, "0");
}

function startCountdown() {
  const target = new Date(CONFIG.birthday).getTime();
  const timer = setInterval(tick, 1000);
  tick();

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      clearInterval(timer);
      revealSite(true);
      return;
    }
    setCountdown(
      Math.floor(diff / 86400000),
      Math.floor(diff / 3600000) % 24,
      Math.floor(diff / 60000) % 60,
      Math.floor(diff / 1000) % 60
    );
  }
}

function revealSite(withConfetti) {
  document.body.classList.remove("is-locked");
  document.body.classList.add("is-unlocked");
  document.title = "Siu Bak Char💙";
  window.scrollTo({ top: 0, behavior: "auto" });
  observeReveals();
  if (withConfetti) launchConfetti(7000);
  startTypewriter();
  switchMusic("celebrate");
}

/* ---------------- typewriter ---------------- */
function fullLetter() {
  return CONTENT.letterZh ? `${CONTENT.letter}\n\n${CONTENT.letterZh}` : CONTENT.letter;
}

let skipTyping = null;

function startTypewriter() {
  const el = $("typed-letter");
  if (!el) return;
  if (skipTyping) skipTyping(); /* never leave a stale run behind */

  const text = fullLetter();
  const sr = $("letter-full");
  const hint = $("letter-hint");

  const settle = () => {
    el.textContent = text;
    el.classList.remove("is-typing", "is-skippable");
    el.removeAttribute("aria-hidden");
    if (sr) sr.textContent = text;
    if (hint) hint.hidden = true;
  };

  if (REDUCED) {
    settle();
    return;
  }

  /* ~15s of typing on a phone is a long wait — let her tap to finish it */
  el.textContent = "";
  el.classList.add("is-typing", "is-skippable");
  el.setAttribute("aria-hidden", "true");
  if (hint) hint.hidden = false;

  let i = 0;
  let timer = null;
  const finish = () => {
    if (!skipTyping) return;
    skipTyping();
    settle();
  };
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Escape") finish();
  };
  skipTyping = () => {
    clearTimeout(timer);
    el.removeEventListener("click", finish);
    el.removeEventListener("keydown", onKey);
    skipTyping = null;
  };
  el.addEventListener("click", finish);
  el.addEventListener("keydown", onKey);

  (function step() {
    if (!skipTyping) return;
    if (i >= text.length) {
      finish();
      return;
    }
    const ch = text[i++];
    el.textContent += ch;
    timer = setTimeout(step, ch === "\n" ? 170 : 24);
  })();
}

/* ---------------- scroll reveal ---------------- */
function observeReveals() {
  const els = document.querySelectorAll(".reveal:not(.is-in)");
  if (!("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    },
    /* threshold 0 — anything even slightly on screen counts, so a tall card
       can never get stuck invisible */
    { threshold: 0, rootMargin: "0px 0px -6% 0px" }
  );
  els.forEach((e) => io.observe(e));
}

/* ---------------- open-when letters (one per week) ---------------- */
let lastFocused = null;

const OPEN_WHEN_KEY = "openWhenLog";

/* Add ?preview=0 to the URL to debug: ignores the unlock schedule and
   does not record opens (so it won't disturb the real state). */
const OW_BYPASS = /[?&]preview=0/.test(location.search);

/* localStorage may be blocked (private mode etc.) — fall back to no gate */
let storageOK = true;
try {
  localStorage.setItem("__ow_test__", "1");
  localStorage.removeItem("__ow_test__");
} catch (e) {
  storageOK = false;
}

function getLog() {
  const empty = CONTENT.openWhen.map(() => 0);
  if (!storageOK) return empty;
  try {
    const raw = JSON.parse(localStorage.getItem(OPEN_WHEN_KEY) || "[]");
    return empty.map((_, i) => Number(raw[i]) || 0);
  } catch (e) {
    return empty;
  }
}

function saveLog(log) {
  if (!storageOK) return;
  try {
    localStorage.setItem(OPEN_WHEN_KEY, JSON.stringify(log));
  } catch (e) {}
}

/* ---- weekly unlock schedule (Hong Kong time, UTC+8) ---- */
const UNLOCK_MS = ((CONFIG.openWhen && CONFIG.openWhen.unlockTimes) || [])
  .map((t) => Date.parse(t))
  .filter((t) => !Number.isNaN(t))
  .sort((a, b) => a - b);

function unlocksPassed(now) {
  return UNLOCK_MS.filter((t) => now >= t).length;
}

/* one letter is available from the start; each passed unlock adds one more
   (missed weeks carry over, capped at the number of letters) */
function allowedOpened(now, total) {
  return Math.min(total, 1 + unlocksPassed(now));
}

function nextUnlock(now) {
  return UNLOCK_MS.find((t) => t > now) || 0;
}

/* e.g. "Fri 18 Sep, 7:00pm" — Hong Kong has no DST, so a fixed +8 shift is safe */
function formatUnlock(ms) {
  const d = new Date(ms + 8 * 3600 * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let h = d.getUTCHours();
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  return `${days[d.getUTCDay()]} ${d.getUTCDate()} ${months[d.getUTCMonth()]}, ${h}:${min}${ampm}`;
}

/* "opened" (readable again) | "open" (can open now) | "locked" (waiting for next unlock) */
function envelopeState(i, log, now) {
  if (OW_BYPASS) return log[i] ? "opened" : "open";
  if (log[i]) return "opened";
  if (!storageOK) return "open";
  const opened = log.filter(Boolean).length;
  return opened < allowedOpened(now, log.length) ? "open" : "locked";
}

function formatWait(ms) {
  const totalMin = Math.max(0, Math.ceil(ms / 60000));
  const d = Math.floor(totalMin / 1440);
  const h = Math.floor((totalMin % 1440) / 60);
  const m = totalMin % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function refreshEnvelopeStates() {
  const list = $("envelope-list");
  if (!list) return;
  const log = getLog();
  const now = Date.now();
  const total = log.length;
  const opened = log.filter(Boolean).length;
  const canOpenMore = opened < allowedOpened(now, total);
  const next = nextUnlock(now);
  const anyLeft = opened < total;

  list.querySelectorAll(".envelope").forEach((btn) => {
    const i = Number(btn.dataset.index);
    const state = envelopeState(i, log, now);
    btn.dataset.state = state;
    btn.setAttribute("aria-disabled", String(state === "locked"));
    btn.classList.toggle("envelope--opened", state === "opened");
    btn.classList.toggle("envelope--locked", state === "locked");
    const hint = btn.querySelector("[data-hint]");
    if (!hint) return;
    if (state === "opened") hint.textContent = "Read again";
    else if (state === "open") hint.textContent = "Read it";
    else hint.textContent = next ? "Opens " + formatUnlock(next) : "Locked for now";
  });

  const status = $("ow-status");
  if (!status) return;
  if (OW_BYPASS) status.textContent = "Debug: weekly gate bypassed.";
  else if (!anyLeft) status.textContent = "You've opened them all — re-read any time.";
  else if (canOpenMore) status.textContent = "Pick any one letter to open.";
  else if (next) status.textContent = "Next letter unlocks " + formatUnlock(next) + " (in " + formatWait(next - now) + ").";
  else status.textContent = "Pick any one letter to open.";
}

function openLetter(i) {
  const l = CONTENT.openWhen[i];
  if (!l) return;

  const log = getLog();
  const now = Date.now();
  const state = envelopeState(i, log, now);

  if (state === "locked") {
    const next = nextUnlock(now);
    toast(next ? "This letter opens " + formatUnlock(next) + "." : "This letter isn't ready yet.");
    return;
  }

  const hasContent = !!(l.body || l.bodyZh);

  /* mark as opened the first time (uses this week's slot) — blanks and debug bypass don't count */
  if (state !== "opened" && hasContent && !OW_BYPASS) {
    log[i] = now;
    saveLog(log);
    refreshEnvelopeStates();
  }

  lastFocused = document.activeElement;
  $("modal-kicker").textContent = "A letter for when";
  $("modal-title").innerHTML = `Open when ${l.en}${l.zh ? `<span class="zh">${l.zh}</span>` : ""}`;
  $("modal-body").innerHTML = `${l.body ? `<p>${l.body}</p>` : ""}${l.bodyZh ? `<p>${l.bodyZh}</p>` : ""}`;

  const gif = l.gif || CONTENT.letterGif;
  const fallback = CONTENT.letterGif;
  const gifEl = $("modal-gif");
  if (gifEl) {
    if (gif) {
      gifEl.hidden = false;
      gifEl.onerror = () => {
        /* per-letter gif missing? fall back to the shared one, else hide */
        if (fallback && gifEl.getAttribute("src") !== fallback) gifEl.src = fallback;
        else gifEl.hidden = true;
      };
      gifEl.src = gif;
    } else {
      gifEl.hidden = true;
      gifEl.onerror = null;
      gifEl.removeAttribute("src");
    }
  }
  const modal = $("modal");
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal__close").focus();
}

function closeLetter() {
  $("modal").hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

/* ---------------- photo lightbox ----------------
   Every photo on the celebration page opens here, full size:
   the polaroid wall, the carousel, and the little timeline memories. */
const LB = { el: null, img: null, cap: null, count: null, playBtn: null, list: [], i: 0, timer: null, auto: false, open: false };
let lbLastFocus = null;

function buildLightbox() {
  const el = document.createElement("div");
  el.className = "lightbox";
  el.id = "lightbox";
  el.hidden = true;
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", "Photo viewer");
  el.innerHTML = `
    <div class="lightbox__backdrop" data-lb-close></div>
    <figure class="lightbox__stage">
      <div class="lightbox__imgwrap">
        <img class="lightbox__img" id="lb-img" alt="">
        <button class="lightbox__btn lightbox__prev" id="lb-prev" type="button" aria-label="Previous photo">‹</button>
        <button class="lightbox__btn lightbox__next" id="lb-next" type="button" aria-label="Next photo">›</button>
      </div>
      <figcaption class="lightbox__cap">
        <span class="lightbox__title" id="lb-cap"></span>
        <span class="lightbox__count" id="lb-count"></span>
      </figcaption>
    </figure>
    <button class="lightbox__btn lightbox__close" id="lb-close" type="button" aria-label="Close">✕</button>
    <button class="lightbox__play" id="lb-play" type="button" aria-label="Pause">❙❙</button>`;
  document.body.appendChild(el);

  LB.el = el;
  LB.img = $("lb-img");
  LB.cap = $("lb-cap");
  LB.count = $("lb-count");
  LB.playBtn = $("lb-play");

  el.querySelectorAll("[data-lb-close]").forEach((n) => n.addEventListener("click", closeLightbox));
  $("lb-close").addEventListener("click", closeLightbox);
  $("lb-prev").addEventListener("click", () => lbStep(-1));
  $("lb-next").addEventListener("click", () => lbStep(1));
  LB.playBtn.addEventListener("click", () => (LB.auto ? lbStopAuto() : lbStartAuto()));

  /* swipe between photos */
  let x0 = null;
  let y0 = null;
  el.addEventListener(
    "touchstart",
    (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    },
    { passive: true }
  );
  el.addEventListener(
    "touchend",
    (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) lbStep(dx < 0 ? 1 : -1);
    },
    { passive: true }
  );

  /* keep tab focus inside the viewer while it's open */
  el.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = [...el.querySelectorAll("button:not([disabled])")].filter((n) => n.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

function lbShow(i) {
  const n = LB.list.length;
  if (!n) return;
  LB.i = (i + n) % n;
  const p = LB.list[LB.i];
  LB.img.src = p.src;
  LB.img.alt = p.cap || "";
  LB.cap.textContent = p.cap || "";
  LB.count.textContent = n > 1 ? `${LB.i + 1} / ${n}` : "";
  LB.el.classList.toggle("lightbox--single", n < 2);
  /* warm the neighbours so swiping feels instant */
  [LB.i + 1, LB.i - 1].forEach((k) => {
    const q = LB.list[(k + n) % n];
    if (q && q !== p) new Image().src = q.src;
  });
}

function lbStep(d) {
  lbShow(LB.i + d);
  if (LB.auto) lbStartAuto();
}

function lbStartAuto() {
  lbStopAuto();
  LB.auto = true;
  LB.playBtn.textContent = "❙❙ Pause";
  LB.playBtn.setAttribute("aria-label", "Pause the slideshow");
  LB.timer = setInterval(() => lbShow(LB.i + 1), 2600);
}

function lbStopAuto() {
  LB.auto = false;
  clearInterval(LB.timer);
  LB.timer = null;
  if (LB.playBtn) {
    LB.playBtn.textContent = "▶ Play";
    LB.playBtn.setAttribute("aria-label", "Play the slideshow");
  }
}

function openLightbox(list, i, autoplay) {
  const usable = (list || []).filter((p) => p && p.src);
  if (!usable.length) return;
  if (!LB.el) buildLightbox();
  const first = list.indexOf(usable[0]);
  LB.list = usable;
  lbLastFocus = document.activeElement;
  LB.el.hidden = false;
  LB.open = true;
  document.body.style.overflow = "hidden";
  lbShow(i != null ? i : Math.max(0, first));
  if (autoplay && LB.list.length > 1) lbStartAuto();
  else lbStopAuto();
  $("lb-close").focus();
}

function closeLightbox() {
  if (!LB.el || LB.el.hidden) return;
  lbStopAuto();
  LB.el.hidden = true;
  LB.open = false;
  LB.img.removeAttribute("src");
  document.body.style.overflow = "";
  if (lbLastFocusedTarget()) lbLastFocusedTarget().focus();
}

function lbLastFocusedTarget() {
  return lbLastFocus && lbLastFocus.isConnected ? lbLastFocus : null;
}

/* which photo list a [data-list] button belongs to */
function listFor(key) {
  if (key === "wall") return CONTENT.gallery;
  if (key === "carousel") return CONTENT.carousel;
  if (key && key.indexOf("tl:") === 0) {
    const when = key.slice(3);
    const item = CONTENT.timeline.find((t) => t.when === when);
    if (!item || !item.photos) return [];
    return item.photos.map((src) => ({ src, cap: capFor(src) }));
  }
  return [];
}

/* ---------------- toast ---------------- */
let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("is-shown");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-shown"), 4600);
}

/* ---------------- confetti ---------------- */
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let particles = [];
let raf = null;
let endAt = 0;
const COLORS = ["#7ec4ec", "#ffc2dc", "#c9b8f5", "#a9e8d4", "#ffe39a", "#3585bc", "#f78fb8"];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function makeParticle(seeded) {
  return {
    x: Math.random() * window.innerWidth,
    y: seeded ? -20 - Math.random() * window.innerHeight * 0.4 : -20,
    w: 6 + Math.random() * 8,
    h: 8 + Math.random() * 10,
    color: COLORS[(Math.random() * COLORS.length) | 0],
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.22,
    vx: (Math.random() - 0.5) * 1.7,
    vy: 2 + Math.random() * 3.6,
    circle: Math.random() < 0.35,
    life: 1,
  };
}

function launchConfetti(duration) {
  if (REDUCED) return;
  resizeCanvas();
  const count = Math.round(Math.min(220, window.innerWidth / 6));
  for (let i = 0; i < count; i++) particles.push(makeParticle(true));
  endAt = performance.now() + (duration || 6000);
  if (!raf) raf = requestAnimationFrame(confettiTick);
}

function confettiTick(now) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const emitting = now < endAt;
  if (emitting && particles.length < 320 && Math.random() < 0.45) particles.push(makeParticle(false));

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy = Math.min(p.vy + 0.035, 6);
    p.rot += p.vr;
    if (!emitting) p.life -= 0.02;

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.circle) {
      ctx.beginPath();
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    ctx.restore();
  });

  particles = particles.filter((p) => p.y < window.innerHeight + 40 && p.life > 0);

  if (emitting || particles.length) {
    raf = requestAnimationFrame(confettiTick);
  } else {
    raf = null;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

/* ---------------- background music ---------------- */
const BGM = {
  el: null,
  wrap: null,
  btn: null,
  heroBtn: null,
  heroLabel: null,
  vol: null,
  current: "cover",
  started: false,
  wantPlay: true,
};
const VOL_KEY = "bgmVolume";

function musicAvailable() {
  return BGM.el && BGM.el.getAttribute("src");
}

function trackSrc(kind) {
  const cfg = CONFIG.music || {};
  return kind === "celebrate" ? cfg.celebrate : cfg.cover;
}

/* attaching the src is what triggers the download — done only on first tap */
function loadTrack(kind) {
  const src = trackSrc(kind);
  if (!src) return false;
  if (BGM.el.getAttribute("src") !== src) {
    BGM.el.setAttribute("src", src);
    BGM.el.load();
  }
  return true;
}

function tryPlay() {
  if (!musicAvailable() || !BGM.wantPlay) return;
  const p = BGM.el.play();
  if (p && p.catch) p.catch(() => updateMusicUI());
}

function updateMusicUI() {
  if (!BGM.btn) return;
  const on = BGM.started && !BGM.el.paused && !BGM.el.muted;
  BGM.btn.classList.toggle("is-playing", on);
  BGM.btn.setAttribute("aria-pressed", String(on));
  const label = !BGM.started ? "Play music" : on ? "Mute music" : "Unmute music";
  BGM.btn.setAttribute("aria-label", label);
  BGM.btn.title = label;
  if (BGM.heroBtn) {
    BGM.heroBtn.setAttribute("aria-pressed", String(on));
    if (BGM.heroLabel) BGM.heroLabel.textContent = on ? "Pause our song" : "Play our song";
  }
}

function applyVolume(v) {
  BGM.el.volume = Math.min(1, Math.max(0, v));
  if (BGM.vol) BGM.vol.value = String(BGM.el.volume);
}

/* iOS Safari ignores programmatic volume changes (hardware-only) */
function supportsVolume() {
  const el = BGM.el;
  const original = el.volume;
  el.volume = original === 1 ? 0.5 : 1;
  const changed = el.volume !== original;
  el.volume = original;
  return changed;
}

/* iPhone/iPad (incl. iPadOS which reports itself as MacIntel) */
function isIOS() {
  return (
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function onMusicButton() {
  const src = trackSrc(BGM.current);
  if (!src) return;
  if (!BGM.started) {
    /* first tap — download the song now and start with sound (user gesture) */
    BGM.started = true;
    BGM.el.muted = false;
    BGM.wantPlay = true;
    if (loadTrack(BGM.current)) tryPlay();
  } else if (BGM.el.muted) {
    BGM.el.muted = false;
    BGM.wantPlay = true;
    tryPlay();
  } else {
    BGM.el.muted = true;
  }
  updateMusicUI();
}

function switchMusic(kind) {
  BGM.current = kind;
  if (BGM.started) loadTrack(kind);
}

function initMusic() {
  BGM.el = $("bgm");
  BGM.wrap = $("music");
  BGM.btn = $("music-btn");
  BGM.heroBtn = $("song-btn");
  BGM.heroLabel = $("song-btn-label");
  BGM.vol = $("music-vol");
  BGM.handle = $("music-handle");
  BGM.panel = $("music-panel");
  if (!BGM.el || !BGM.wrap || !BGM.btn || !CONFIG.music) return;

  /* mobile: keep the volume slider tucked at the edge until the tab is tapped */
  let panelHideTimer = null;
  const setPanel = (open) => {
    BGM.wrap.classList.toggle("is-open", open);
    if (BGM.handle) {
      BGM.handle.setAttribute("aria-expanded", String(open));
      BGM.handle.textContent = open ? "›" : "‹";
    }
  };
  const schedulePanelHide = () => {
    clearTimeout(panelHideTimer);
    panelHideTimer = setTimeout(() => setPanel(false), 4000);
  };
  if (BGM.handle) {
    BGM.handle.addEventListener("click", () => {
      const open = !BGM.wrap.classList.contains("is-open");
      setPanel(open);
      if (open) schedulePanelHide();
      else clearTimeout(panelHideTimer);
    });
  }
  document.addEventListener("pointerdown", (e) => {
    if (BGM.wrap && !BGM.wrap.contains(e.target)) setPanel(false);
  });

  /* volume — iOS ignores programmatic volume, so drop the slider UI there */
  if (!isIOS() && supportsVolume()) {
    let saved = null;
    try {
      saved = parseFloat(localStorage.getItem(VOL_KEY));
    } catch (e) {}
    const def = CONFIG.music.volume != null ? CONFIG.music.volume : 0.5;
    applyVolume(Number.isFinite(saved) ? saved : def);

    BGM.vol.addEventListener("input", () => {
      applyVolume(parseFloat(BGM.vol.value));
      try {
        localStorage.setItem(VOL_KEY, String(BGM.el.volume));
      } catch (e) {}
      if (BGM.el.paused && BGM.wantPlay) tryPlay();
      schedulePanelHide();
    });
  } else {
    /* no usable volume control — keep only the play/mute button */
    BGM.wrap.classList.add("no-vol");
    if (BGM.panel) BGM.panel.remove();
    if (BGM.handle) BGM.handle.remove();
    BGM.vol = null;
    BGM.handle = null;
    BGM.panel = null;
  }

  /* no src yet → the song is downloaded only when she taps the button */
  BGM.el.preload = "none";
  BGM.el.muted = true;
  BGM.wrap.hidden = false;
  BGM.el.addEventListener("playing", () => updateMusicUI());
  BGM.el.addEventListener("pause", () => updateMusicUI());
  BGM.el.addEventListener("volumechange", () => updateMusicUI());
  BGM.el.addEventListener("error", () => {
    BGM.wrap.hidden = true;
  });
  updateMusicUI();

  BGM.btn.addEventListener("click", onMusicButton);
  if (BGM.heroBtn) BGM.heroBtn.addEventListener("click", onMusicButton);
}

/* ---------------- reading progress + back to top ---------------- */
function initScrollUi() {
  const bar = $("progress-bar");
  const top = $("totop");
  let pending = 0;

  const update = () => {
    pending = 0;
    const y = window.pageYOffset || document.documentElement.scrollTop || 0;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, y / max))})`;
    if (top) top.classList.toggle("is-shown", y > window.innerHeight * 1.1);
  };
  const onScroll = () => {
    if (!pending) pending = requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();

  if (top)
    top.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" })
    );
}

/* ---------------- init ---------------- */
function init() {
  renderTimeline();
  renderGallery();
  renderCarousel();
  renderEnvelopes();
  renderFooter();
  renderHeroDate();
  $("year").textContent = new Date().getFullYear();

  observeReveals();
  setInterval(refreshEnvelopeStates, 30000);

  $("slideshow-btn").addEventListener("click", () => openLightbox(CONTENT.gallery, 0, true));

  initCarousel();
  initScrollUi();

  /* any tappable photo anywhere opens the viewer */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-list]");
    if (!btn) return;
    openLightbox(listFor(btn.dataset.list), Number(btn.dataset.i), false);
  });

  const envelopeList = $("envelope-list");
  if (envelopeList) {
    envelopeList.addEventListener("click", (e) => {
      const btn = e.target.closest(".envelope");
      if (btn) openLetter(Number(btn.dataset.index));
    });
  }

  const owOpen = $("open-when-open");
  const owClose = $("open-when-close");
  if (owOpen)
    owOpen.addEventListener("click", () => {
      $("lock").classList.add("is-letters");
      refreshEnvelopeStates();
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  if (owClose)
    owClose.addEventListener("click", () => {
      $("lock").classList.remove("is-letters");
      window.scrollTo({ top: 0, behavior: "auto" });
    });

  document.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeLetter));
  document.addEventListener("keydown", (e) => {
    if (LB.open) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") lbStep(1);
      else if (e.key === "ArrowLeft") lbStep(-1);
      return;
    }
    if (e.key !== "Escape") return;
    if (!$("modal").hidden) closeLetter();
    else if ($("lock").classList.contains("is-letters")) $("lock").classList.remove("is-letters");
  });

  $("moon").addEventListener("click", () => {
    launchConfetti(2600);
    toast(CONTENT.secret);
  });

  window.addEventListener("resize", resizeCanvas);

  initMusic();

  const preview = /[?&]preview=1/.test(location.search) || location.hash === "#preview";
  if (preview) {
    revealSite(false);
  } else {
    startCountdown();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
