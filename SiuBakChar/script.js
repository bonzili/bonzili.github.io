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
};

/* --------------------------------------------------------------------------
   2) CONTENT — all the words on the page (English + Traditional Chinese)
   -------------------------------------------------------------------------- */
const CONTENT = {
  /* The letter typed out under the title */
  letter:
    "To my dearest Siu Bak Char, my 小白Char —\n\n" +
    "Thank you for walking into my most ordinary days and turning them into the ones I want to keep forever. You are my favourite hello, my softest place to land, and the reason a plain Tuesday can suddenly feel like a celebration.\n\n" +
    "多謝你，喺我最平凡嘅日子裡面出現，將每一日都變成值得收藏嘅回憶。你係我最鍾意嘅「你好」，亦都係我最想返去嘅地方。\n\n" +
    "Happy birthday, my love. May this year love you back as much as you love everyone around you.\n" +
    "生日快樂，我最親愛嘅你。願你今年被世界溫柔對待，就好似你溫柔對待身邊每一個人咁。\n\n" +
    "Forever yours,\nSiu Gai Mo（小雞毛）",

  /* Love-story timeline — add / remove / edit freely */
  timeline: [
    {
      when: "Chapter One · 第一章",
      title: "The first hello",
      zhTitle: "第一次嘅「你好」",
      text: "I still remember how nervous I was. One hello, and somehow my whole week rearranged itself around you.",
      zhText: "我仲記得嗰日有幾緊張。一句「你好」，就令我成個星期都圍住你轉。",
    },
    {
      when: "Chapter Two · 第二章",
      title: "Our first date",
      zhTitle: "第一次約會",
      text: "I planned the day a hundred times in my head, and it still went nothing like I imagined — it was better.",
      zhText: "我喺腦海入面計劃咗一百次，但最後同我想像嘅完全唔同——係更好。",
    },
    {
      when: "Chapter Three · 第三章",
      title: "Officially us",
      zhTitle: "正式成為「我們」",
      text: "No big speech, no fireworks. Just two people quietly deciding to choose each other, again and again.",
      zhText: "冇盛大嘅告白，冇煙花。只係兩個人，靜靜咁決定一次又一次選擇對方。",
    },
    {
      when: "Chapter Four · 第四章",
      title: "Our first trip together",
      zhTitle: "第一次一齊去旅行",
      text: "Wrong turns, shared snacks, and photos we'll keep forever. I'd get lost with you anywhere.",
      zhText: "行錯路、分住食嘅零食，同埋會一直收藏嘅相。同你一齊，去邊度盪失路都得。",
    },
    {
      when: "Chapter Five · 第五章",
      title: "The small fights & the making up",
      zhTitle: "小爭吵，同埋和好",
      text: "We learned that loving someone isn't about never arguing — it's about always finding the way back to each other.",
      zhText: "後尾我哋明白，愛一個人唔係永遠唔吵架，而係每一次都會搵到路返去對方身邊。",
    },
    {
      when: "Chapter Six · 第六章",
      title: "Today, and every day after",
      zhTitle: "今日，同埋之後每一日",
      text: "Here we are. Still choosing each other, still laughing at the same jokes. Happy birthday, my love.",
      zhText: "我哋仲喺度。仍然選擇對方，仍然為同一個笑話而笑。生日快樂，我最愛嘅人。",
    },
  ],

  /* Polaroid wall — drop real files into assets/ and set src, e.g. src:"assets/photo-01.jpg" */
  gallery: [
    { cap: "Us, somewhere happy", zh: "我們，喺某個開心嘅地方", src: "" },
    { cap: "That lazy afternoon", zh: "嗰個懶洋洋嘅下午", src: "" },
    { cap: "Your favourite face", zh: "我最鍾意嘅你", src: "" },
    { cap: "Tiny adventure", zh: "小小嘅冒險", src: "" },
    { cap: "Food we still talk about", zh: "我哋仲講緊嘅嘢食", src: "" },
    { cap: "Rainy day, warm us", zh: "落雨天，暖暖嘅我們", src: "" },
    { cap: "Just because", zh: "純粹因為想影", src: "" },
    { cap: "Here's to more", zh: "祝我哋仲有更多", src: "" },
  ],

  /* Open-when letters */
  openWhen: [
    {
      icon: "🌙",
      en: "you can't sleep",
      zh: "當你睡不著的時候",
      body: "If the night feels too long, imagine I'm right there, tracing little circles on your hand until your breathing slows down. You are safe, you are loved, and tomorrow can wait.",
      bodyZh: "如果夜晚太長，就當我喺你身邊，喺你手背上畫圈圈，直到你呼吸慢慢變慢。你好安全，你被愛住，聽日嘅事可以等一等。",
    },
    {
      icon: "💧",
      en: "you're having a hard day",
      zh: "當你難過的時候",
      body: "You don't have to be strong all the time. Feel it, let it out, and then let me carry some of it for you. I'm not going anywhere.",
      bodyZh: "你唔需要成日都咁堅強。想喊就喊，然後分一部分俾我幫你孭。我邊度都唔會去。",
    },
    {
      icon: "🫂",
      en: "you miss me",
      zh: "當你想我的時候",
      body: "Good news: I'm always just one call away, and I'm probably thinking about you right now too. Distance is just a number — you live in my every day.",
      bodyZh: "好消息：我永遠都喺一個電話嘅距離。而且我而家好可能都喺度掛住你。距離只係一個數字——你一直都住喺我每一日裡面。",
    },
    {
      icon: "😂",
      en: "you need to laugh",
      zh: "當你想笑的時候",
      body: "Remember that time we laughed so hard we couldn't breathe? I still don't fully know why it was funny, and I still laugh every single time.",
      bodyZh: "記得嗰次我哋笑到透唔到氣嗎？我到而家都唔係好清楚有咩咁好笑，但每一次諗起都會笑。",
    },
    {
      icon: "🌪️",
      en: "you feel overwhelmed",
      zh: "當你覺得頂唔順的時候",
      body: "One thing at a time. You don't have to solve everything today. Close the laptop, drink some water, and breathe. I'll be proud of you either way.",
      bodyZh: "一步一步嚟。你唔需要今日解決所有嘢。合埋電腦，飲啖水，深呼吸。無論點，我都為你驕傲。",
    },
    {
      icon: "✨",
      en: "you doubt yourself",
      zh: "當你懷疑自己的時候",
      body: "I wish you could see yourself the way I see you — brave, kind, and so much brighter than you give yourself credit for. You're the best thing in my sky.",
      bodyZh: "我好想你可以用我嘅眼睛睇吓自己——勇敢、善良，比你所想嘅閃亮好多。你係我天空入面最美好嘅嘢。",
    },
  ],

  /* Footer lyric — a short line from your favourite band */
  lyric: "如果我們不曾相遇，我現在會在哪裡？",
  lyricCite: "— Mayday 五月天《如果我們不曾相遇》",

  /* Hidden message behind the moon */
  secret:
    "P.S. 你嘅笑容係我最想收藏嘅星星 ✨ 願你今年嘅每一個願望都成真，就好似你為我做嘅每一件小事咁美好。",
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
          <h3 class="card__title">${item.title}<span class="card__zh">${item.zhTitle}</span></h3>
          <p class="card__text">${item.text}</p>
          <p class="card__text">${item.zhText}</p>
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
        <span class="envelope__zh">${l.zh}</span>
        <span class="envelope__hint">Read it · 打開</span>
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
}

/* ---------------- typewriter ---------------- */
function startTypewriter() {
  const el = $("typed-letter");
  if (!el) return;
  if (REDUCED) {
    el.textContent = CONTENT.letter;
    return;
  }
  setTimeout(() => typeWriter(el, CONTENT.letter, 24), 800);
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
  $("modal-kicker").textContent = "A letter for when · 給你的信";
  $("modal-title").innerHTML = `Open when ${l.en}<span class="zh">${l.zh}</span>`;
  $("modal-body").innerHTML = `<p>${l.body}</p><p>${l.bodyZh}</p>`;
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
