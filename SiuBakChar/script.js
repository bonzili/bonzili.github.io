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
    "To my dearest Siu Bak Char,\n\n" +
    "Thank you for walking into my most ordinary days and turning them into the ones I want to keep forever. You are my favourite hello, my softest place to land, and the reason a plain Tuesday can suddenly feel like a celebration.\n\n" +
    "Happy birthday, my love. May this year love you back as much as you love everyone around you.\n\n" +
    "Forever yours,\nSiu Gai Mo",

  /* Optional Chinese version of the letter — fill this in later and it appears automatically */
  letterZh: "",

  /* Love-story timeline — add / remove / edit freely */
  timeline: [
    {
      when: "Chapter One",
      title: "The first hello",
      zhTitle: "",
      text: "I still remember how nervous I was. One hello, and somehow my whole week rearranged itself around you.",
      zhText: "",
    },
    {
      when: "Chapter Two",
      title: "Our first date",
      zhTitle: "",
      text: "I planned the day a hundred times in my head, and it still went nothing like I imagined — it was better.",
      zhText: "",
    },
    {
      when: "Chapter Three",
      title: "Officially us",
      zhTitle: "",
      text: "No big speech, no fireworks. Just two people quietly deciding to choose each other, again and again.",
      zhText: "",
    },
    {
      when: "Chapter Four",
      title: "Our first trip together",
      zhTitle: "",
      text: "Wrong turns, shared snacks, and photos we'll keep forever. I'd get lost with you anywhere.",
      zhText: "",
    },
    {
      when: "Chapter Five",
      title: "The small fights & the making up",
      zhTitle: "",
      text: "We learned that loving someone isn't about never arguing — it's about always finding the way back to each other.",
      zhText: "",
    },
    {
      when: "Chapter Six",
      title: "Today, and every day after",
      zhTitle: "",
      text: "Here we are. Still choosing each other, still laughing at the same jokes. Happy birthday, my love.",
      zhText: "",
    },
  ],

  /* Polaroid wall — drop real files into assets/ and set src, e.g. src:"assets/photo-01.jpg" */
  gallery: [
    { cap: "Our first date", zh: "", src: "assets/first-date.jpg" },
    { cap: "Mayday, together", zh: "", src: "assets/mayday.jpg" },
    { cap: "Hanabi night", zh: "", src: "assets/hanabi.jpg" },
    { cap: "Tiny adventure", zh: "", src: "" },
    { cap: "Food we still talk about", zh: "", src: "" },
    { cap: "Rainy day, warm us", zh: "", src: "" },
    { cap: "Just because", zh: "", src: "" },
    { cap: "Here's to more", zh: "", src: "" },
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
      bodyZh: "I bet today was completely flooded with annoying tasks from seniors:< I’m sorry everything felt so frustrating today. Put everything down, take a deep breath, and just rest right now! A bad day is just 24 hours that didn’t go our way, but it does NOT mean your whole life is messed up or that you're doing badly. You don’t need to be strong, solve any big problems, or be productive all the timee gahhh. You did your absolute best today, and you survived it! Your only job for the rest of tonight is to lie on the bed and just hea:D. Tomorrow gets to be a completely fresh blank page. Sending you the biggest hugggg from siu gai mo:D. Get some more rest. You did good today and me dim dou hai gum support my bb💙",
    },
    {
      icon: "🫂",
      en: "you miss me",
      zh: "",
      gif: "assets/miss-me.gif",
      body: "Hey bbbbbbb,",
      bodyZh: "Good news: I'm missing you just as muchhhh (probably even moreee:D)! I wish I could just pop up right next to you right now and give u a biggggg hugggg and tip tip:p (lowkey I really like tip tip with uuuuuuuu even tho my face wui hai sai nei d jong:D). Every single second that passes right now is just counting down until we can see each other very soonnn. I'm not gonna abandon u to go on a solo trip for half a month anymoree, so I bet we'll see each other super soon!! In the mean time, just close your eyes, imagine me hugging you tight, and text me/call me/annoy me whenever you read this:D I'm also missing you and can't wait to see my bb soon tooo💙",
    },
    {
      icon: "✨",
      en: "you doubt yourself",
      zh: "",
      gif: "assets/doubt-yourself.gif",
      body: "To the girl I believe in most,",
      bodyZh: "Stop being too harsh on yourself:< I really wish you could see how amazing you look through my eyes — you’re way smarter and better at things than you give yourself credit for! Think about all those scary, difficult things you’ve faced before, u dou managed to figure them out anyway! If you're feeling unsure right now, it's only because you care deeply, but that definitely doesn’t mean you’re incapable :< Whenever your own confidence runs out, feel free to borrow mine, because I know exactly what kind of magic you're capable of creating:D (Reminds me of that DisneySea song when I'm writing this lmao). Just take it step by step. I believe in my lek lek geh Siu Bakkkk must be able to do it!",
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
    "P.S. Your smile is the star I most want to keep. May every wish you make this year come true.",
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
        ? `<img class="polaroid__photo" src="${g.src}" alt="${g.cap}" loading="lazy">`
        : `<div class="photo-ph" style="--g1:${grad[0]};--g2:${grad[1]}">${String(i + 1).padStart(2, "0")}</div>`;
      return `
        <figure class="polaroid reveal" style="--tilt:${tilt}deg">
          <span class="polaroid__tape" aria-hidden="true"></span>
          ${media}
          <figcaption class="polaroid__cap"><b>${g.cap}</b>${g.zh}</figcaption>
        </figure>`;
    })
    .join("");
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
    document.title = `${Math.floor(diff / 86400000)}d ${Math.floor(diff / 3600000) % 24}h until your surprise 🌷`;
  }
}

function revealSite(withConfetti) {
  document.body.classList.remove("is-locked");
  document.body.classList.add("is-unlocked");
  document.title = "Siu Bak Char · Happy Birthday 🌷";
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

function startTypewriter() {
  const el = $("typed-letter");
  if (!el) return;
  if (REDUCED) {
    el.textContent = fullLetter();
    return;
  }
  setTimeout(() => typeWriter(el, fullLetter(), 24), 800);
}

function typeWriter(el, text, speed) {
  el.textContent = "";
  el.classList.add("is-typing");
  let i = 0;
  (function step() {
    if (i >= text.length) {
      el.classList.remove("is-typing");
      return;
    }
    const ch = text[i++];
    el.textContent += ch;
    setTimeout(step, ch === "\n" ? speed * 7 : speed);
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
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
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

/* ---------------- slideshow ---------------- */
let slideshowEl = null;
let slideTimer = null;
let slideIndex = 0;

function buildSlideshow() {
  slideshowEl = document.createElement("div");
  slideshowEl.className = "slideshow";
  slideshowEl.hidden = true;
  slideshowEl.innerHTML = `
    <div class="slideshow__frame">
      <button class="slideshow__close" type="button" aria-label="Close slideshow">✕</button>
      <div class="slideshow__photo" id="slide-photo"></div>
      <p class="slideshow__cap" id="slide-cap"></p>
    </div>`;
  document.body.appendChild(slideshowEl);
  slideshowEl.querySelector(".slideshow__close").addEventListener("click", closeSlideshow);
  slideshowEl.addEventListener("click", (e) => {
    if (e.target === slideshowEl) closeSlideshow();
  });
}

function showSlide(i) {
  const g = CONTENT.gallery[i];
  const grad = GRADS[i % GRADS.length];
  const ph = $("slide-photo");
  if (g.src) {
    ph.style.background = `#eaf6ff url('${g.src}') center/cover`;
    ph.textContent = "";
  } else {
    ph.style.background = `linear-gradient(140deg,${grad[0]},${grad[1]})`;
    ph.textContent = String(i + 1).padStart(2, "0");
  }
  $("slide-cap").innerHTML = `<b>${g.cap}</b> · ${g.zh}`;
}

function openSlideshow() {
  if (!slideshowEl) buildSlideshow();
  slideshowEl.hidden = false;
  document.body.style.overflow = "hidden";
  slideIndex = 0;
  showSlide(0);
  clearInterval(slideTimer);
  slideTimer = setInterval(() => {
    slideIndex = (slideIndex + 1) % CONTENT.gallery.length;
    showSlide(slideIndex);
  }, 2200);
}

function closeSlideshow() {
  if (slideshowEl) slideshowEl.hidden = true;
  clearInterval(slideTimer);
  document.body.style.overflow = "";
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
const BGM = { el: null, wrap: null, btn: null, icon: null, vol: null, current: null, wantPlay: true };
const VOL_KEY = "bgmVolume";

function musicAvailable() {
  return BGM.el && BGM.el.getAttribute("src");
}

function setTrack(kind) {
  const cfg = CONFIG.music || {};
  const src = kind === "celebrate" ? cfg.celebrate : cfg.cover;
  BGM.current = kind;
  if (!src) {
    if (BGM.wrap) BGM.wrap.hidden = true;
    return;
  }
  if (BGM.el.getAttribute("src") !== src) {
    BGM.el.setAttribute("src", src);
    BGM.el.load();
  }
}

function tryPlay() {
  if (!musicAvailable() || !BGM.wantPlay) return;
  const p = BGM.el.play();
  if (p && p.catch) p.catch(() => updateMusicUI());
}

function updateMusicUI() {
  if (!BGM.btn) return;
  const on = !BGM.el.paused && !BGM.el.muted;
  BGM.icon.textContent = on ? "🎵" : "🔇";
  BGM.btn.classList.toggle("is-playing", on);
  BGM.btn.setAttribute("aria-pressed", String(on));
  BGM.btn.setAttribute("aria-label", on ? "Mute music" : "Unmute music");
  BGM.btn.title = on ? "Mute music" : "Unmute music";
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

function onMusicButton() {
  if (!musicAvailable()) return;
  if (BGM.el.muted) {
    BGM.el.muted = false;
    BGM.wantPlay = true;
    tryPlay();
  } else {
    BGM.el.muted = true;
  }
  updateMusicUI();
}

function switchMusic(kind) {
  if (!BGM.el || BGM.current === kind) return;
  setTrack(kind);
}

function initMusic() {
  BGM.el = $("bgm");
  BGM.wrap = $("music");
  BGM.btn = $("music-btn");
  BGM.icon = $("music-icon");
  BGM.vol = $("music-vol");
  if (!BGM.el || !BGM.wrap || !BGM.btn || !CONFIG.music) return;

  /* volume — hide the slider where it can't work (iOS), else use saved/default level */
  if (supportsVolume()) {
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
    });
  } else {
    BGM.vol.hidden = true;
    BGM.wrap.classList.add("no-vol");
  }

  BGM.el.muted = true;
  BGM.el.addEventListener("canplay", () => {
    BGM.wrap.hidden = false;
    tryPlay();
  });
  BGM.el.addEventListener("playing", () => updateMusicUI());
  BGM.el.addEventListener("pause", () => updateMusicUI());
  BGM.el.addEventListener("volumechange", () => updateMusicUI());
  BGM.el.addEventListener("error", () => {
    BGM.wrap.hidden = true;
  });
  updateMusicUI();

  BGM.btn.addEventListener("click", onMusicButton);

  /* Sound autoplay is blocked until the first interaction, so retry on gesture */
  const gesture = (e) => {
    if (BGM.wrap.contains(e.target)) return;
    if (BGM.wantPlay && BGM.el.paused) tryPlay();
  };
  ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
    window.addEventListener(ev, gesture, { passive: true })
  );

  setTrack("cover");
}

/* ---------------- init ---------------- */
function init() {
  renderTimeline();
  renderGallery();
  renderEnvelopes();
  renderFooter();
  $("year").textContent = new Date().getFullYear();

  observeReveals();
  setInterval(refreshEnvelopeStates, 30000);

  $("slideshow-btn").addEventListener("click", openSlideshow);

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
    if (e.key !== "Escape") return;
    if (!$("modal").hidden) closeLetter();
    else if (slideshowEl && !slideshowEl.hidden) closeSlideshow();
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
