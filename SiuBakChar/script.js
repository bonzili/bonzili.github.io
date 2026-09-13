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
    { cap: "Us, somewhere happy", zh: "", src: "" },
    { cap: "That lazy afternoon", zh: "", src: "" },
    { cap: "Your favourite face", zh: "", src: "" },
    { cap: "Tiny adventure", zh: "", src: "" },
    { cap: "Food we still talk about", zh: "", src: "" },
    { cap: "Rainy day, warm us", zh: "", src: "" },
    { cap: "Just because", zh: "", src: "" },
    { cap: "Here's to more", zh: "", src: "" },
  ],

  /* Open-when letters */
  openWhen: [
    {
      icon: "🌙",
      en: "you can't sleep",
      zh: "",
      body: "If the night feels too long, imagine I'm right there, tracing little circles on your hand until your breathing slows down. You are safe, you are loved, and tomorrow can wait.",
      bodyZh: "",
    },
    {
      icon: "💧",
      en: "you're having a hard day",
      zh: "",
      body: "You don't have to be strong all the time. Feel it, let it out, and then let me carry some of it for you. I'm not going anywhere.",
      bodyZh: "",
    },
    {
      icon: "🫂",
      en: "you miss me",
      zh: "",
      body: "Good news: I'm always just one call away, and I'm probably thinking about you right now too. Distance is just a number — you live in my every day.",
      bodyZh: "",
    },
    {
      icon: "😂",
      en: "you need to laugh",
      zh: "",
      body: "Remember that time we laughed so hard we couldn't breathe? I still don't fully know why it was funny, and I still laugh every single time.",
      bodyZh: "",
    },
    {
      icon: "🌪️",
      en: "you feel overwhelmed",
      zh: "",
      body: "One thing at a time. You don't have to solve everything today. Close the laptop, drink some water, and breathe. I'll be proud of you either way.",
      bodyZh: "",
    },
    {
      icon: "✨",
      en: "you doubt yourself",
      zh: "",
      body: "I wish you could see yourself the way I see you — brave, kind, and so much brighter than you give yourself credit for. You're the best thing in my sky.",
      bodyZh: "",
    },
  ],

  /* Footer lyric on the celebration page */
  lyric: "勾勾手蓋手印，這一刻有約定。那愛情變美麗，因為我開始相信。",
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
  $("envelope-list").innerHTML = CONTENT.openWhen
    .map(
      (l, i) => `
      <button class="envelope reveal" style="--env:${ENV_COLORS[i % ENV_COLORS.length]}" data-index="${i}" type="button">
        <span class="envelope__icon" aria-hidden="true">${l.icon}</span>
        <span class="envelope__label">Open when ${l.en}</span>
        ${l.zh ? `<span class="envelope__zh">${l.zh}</span>` : ""}
        <span class="envelope__hint">Read it</span>
      </button>`
    )
    .join("");
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

/* ---------------- letters modal ---------------- */
let lastFocused = null;

function openLetter(i) {
  const l = CONTENT.openWhen[i];
  if (!l) return;
  lastFocused = document.activeElement;
  $("modal-kicker").textContent = "A letter for when";
  $("modal-title").innerHTML = `Open when ${l.en}${l.zh ? `<span class="zh">${l.zh}</span>` : ""}`;
  $("modal-body").innerHTML = `<p>${l.body}</p>${l.bodyZh ? `<p>${l.bodyZh}</p>` : ""}`;
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
const BGM = { el: null, btn: null, icon: null, current: null, wantPlay: true };

function musicAvailable() {
  return BGM.el && BGM.el.getAttribute("src");
}

function setTrack(kind) {
  const cfg = CONFIG.music || {};
  const src = kind === "celebrate" ? cfg.celebrate : cfg.cover;
  BGM.current = kind;
  if (!src) {
    if (BGM.btn) BGM.btn.hidden = true;
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
  if (p && p.catch) p.catch(() => updateMusicUI(false));
}

function updateMusicUI(playing) {
  if (!BGM.btn) return;
  BGM.icon.textContent = playing ? "🎵" : "🔇";
  BGM.btn.classList.toggle("is-playing", playing);
  BGM.btn.setAttribute("aria-pressed", String(playing));
  BGM.btn.setAttribute("aria-label", playing ? "Pause music" : "Play music");
  BGM.btn.title = playing ? "Pause music" : "Play music";
}

function onMusicButton() {
  if (!musicAvailable()) return;
  if (BGM.el.paused) {
    BGM.wantPlay = true;
    tryPlay();
  } else {
    BGM.wantPlay = false;
    BGM.el.pause();
  }
}

function switchMusic(kind) {
  if (!BGM.el || BGM.current === kind) return;
  setTrack(kind);
}

function initMusic() {
  BGM.el = $("bgm");
  BGM.btn = $("music-btn");
  BGM.icon = $("music-icon");
  if (!BGM.el || !BGM.btn || !CONFIG.music) return;

  BGM.el.addEventListener("canplay", () => {
    BGM.btn.hidden = false;
    tryPlay();
  });
  BGM.el.addEventListener("playing", () => updateMusicUI(true));
  BGM.el.addEventListener("pause", () => updateMusicUI(false));
  BGM.el.addEventListener("error", () => {
    BGM.btn.hidden = true;
  });

  BGM.btn.addEventListener("click", onMusicButton);

  /* Sound autoplay is blocked until the first interaction, so retry on gesture */
  const gesture = (e) => {
    if (BGM.btn.contains(e.target)) return;
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

  $("slideshow-btn").addEventListener("click", openSlideshow);

  $("envelope-list").addEventListener("click", (e) => {
    const btn = e.target.closest(".envelope");
    if (btn) openLetter(Number(btn.dataset.index));
  });

  document.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeLetter));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!$("modal").hidden) closeLetter();
      if (slideshowEl && !slideshowEl.hidden) closeSlideshow();
    }
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
