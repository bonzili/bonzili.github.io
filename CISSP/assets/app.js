/* ==========================================================================
   CISSP Field Manual — application
   No build step. State lives in localStorage. Everything else is derived.
   ========================================================================== */

(function () {
  "use strict";

  var DOMAINS = (window.CISSP && CISSP.domains) || [];
  var MINDSET = (window.CISSP && CISSP.mindset) || { rules: [], verbs: [], worked: {} };
  var PLAN = (window.CISSP && CISSP.studyPlan) || { weeks: [], daily: [], examDay: [] };
  var META = (window.CISSP && CISSP.meta) || {};
  var QUESTIONS = ((window.CISSP && CISSP.questions) || []).slice();
  var QID = {};

  /* The authored bank clusters correct answers in one position. Redistribute
     them deterministically so position is never a clue. Explanations and
     per-option notes move with their option text. */
  (function balanceAnswerPositions() {
    if (!QUESTIONS.length) return;
    var targets = [];
    var i;
    for (i = 0; i < QUESTIONS.length; i++) targets.push(i % 4);
    var seed = 20261102;
    for (i = targets.length - 1; i > 0; i--) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      var j = seed % (i + 1);
      var tmp = targets[i]; targets[i] = targets[j]; targets[j] = tmp;
    }
    QUESTIONS.forEach(function (q, index) {
      var target = targets[index];
      var oldAnswer = q.answer;
      if (oldAnswer === target || !q.options || q.options.length !== 4) return;
      var options = q.options.slice();
      var displaced = options[target];
      options[target] = options[oldAnswer];
      options[oldAnswer] = displaced;
      q.options = options;
      if (q.why) {
        var oldWhy = q.why;
        var newWhy = {};
        Object.keys(oldWhy).forEach(function (key) { newWhy[key] = oldWhy[key]; });
        newWhy[target] = oldWhy[oldAnswer];
        newWhy[oldAnswer] = oldWhy[target];
        q.why = newWhy;
      }
      q.answer = target;
    });
  })();

  QUESTIONS.forEach(function (q) { QID[q.id] = q; });

  var PACK_QUESTIONS = [];
  var PACK_QID = {};
  var packMeta = null;
  var PACK_KEY = "cissp.fieldmanual.pack.v1";
  var PACK_SEEN_KEY = "cissp.fieldmanual.packseen.v1";
  var packSeen = {};

  function normalizePack(raw) {
    if (!raw || !Array.isArray(raw.questions) || !raw.questions.length) throw new Error("No questions in pack");
    if (raw.questions.length > 1500) throw new Error("Pack is too large");
    var questions = [];
    var seen = {};
    var seenStems = {};
    raw.questions.forEach(function (q, index) {
      if (!q || typeof q.stem !== "string" || !Array.isArray(q.options) || q.options.length !== 4) return;
      if (typeof q.answer !== "number" || q.answer < 0 || q.answer > 3) return;
      var options = q.options.map(function (o) { return String(o).trim(); });
      if (options.some(function (o) { return !o; })) return;
      var stemKey = q.stem.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (seenStems[stemKey]) return;
      if (/shown here|shown in the figure|figure shown|following diagram|following illustration|what occurs between steps/i.test(q.stem)) return;
      seenStems[stemKey] = true;
      var id = String(q.id || ("pack-" + (index + 1)));
      if (QID[id] || seen[id]) id = "pack-" + (index + 1);
      if (seen[id]) return;
      seen[id] = true;
      var domainId = Number(q.d);
      if (!(domainId >= 1 && domainId <= 8)) domainId = 0;
      questions.push({
        id: id,
        d: domainId,
        topic: q.topic || "Official practice",
        diff: 2,
        stem: String(q.stem).trim(),
        options: options,
        answer: q.answer,
        whyText: String(q.whyText || q.explain || "").trim(),
        lens: "",
        pack: true,
        source: q.source || raw.source || ""
      });
    });
    if (!questions.length) throw new Error("No usable questions in pack");
    return {
      title: String(raw.title || "Local question pack"),
      source: String(raw.source || ""),
      importedAt: Number(raw.importedAt) || Date.now(),
      questions: questions
    };
  }

  function loadPack() {
    try {
      var raw = localStorage.getItem(PACK_KEY);
      if (!raw) return;
      var pack = normalizePack(JSON.parse(raw));
      PACK_QUESTIONS = pack.questions;
      PACK_QID = {};
      PACK_QUESTIONS.forEach(function (q) { PACK_QID[q.id] = q; });
      packMeta = { title: pack.title, source: pack.source, importedAt: pack.importedAt };
    } catch (err) {
      PACK_QUESTIONS = [];
      PACK_QID = {};
      packMeta = null;
    }
  }

  function findQuestion(id) {
    return QID[id] || PACK_QID[id] || null;
  }

  function savePack(pack) {
    localStorage.setItem(PACK_KEY, JSON.stringify({
      title: pack.title,
      source: pack.source,
      importedAt: pack.importedAt,
      questions: pack.questions
    }));
    clearPackSeen();
    PACK_QUESTIONS = pack.questions;
    PACK_QID = {};
    PACK_QUESTIONS.forEach(function (q) { PACK_QID[q.id] = q; });
    packMeta = { title: pack.title, source: pack.source, importedAt: pack.importedAt };
  }

  function clearPack() {
    try { localStorage.removeItem(PACK_KEY); } catch (err) { /* ignore */ }
    PACK_QUESTIONS = [];
    PACK_QID = {};
    packMeta = null;
    clearPackSeen();
    if (typeof examSession !== "undefined" && examSession && examSession.pack) {
      examSession = null;
      clearActiveExam();
    }
  }

  function loadPackSeen() {
    try {
      var raw = localStorage.getItem(PACK_SEEN_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;
      Object.keys(parsed).forEach(function (id) {
        if (PACK_QID[id]) packSeen[id] = Number(parsed[id]) || 0;
      });
    } catch (err) { packSeen = {}; }
  }

  function savePackSeen() {
    try { localStorage.setItem(PACK_SEEN_KEY, JSON.stringify(packSeen)); } catch (err) { /* ignore */ }
  }

  function clearPackSeen() {
    packSeen = {};
    try { localStorage.removeItem(PACK_SEEN_KEY); } catch (err) { /* ignore */ }
  }

  function pickPack(count, domainId) {
    var unseen = [];
    var seen = [];
    var source = domainId ? PACK_QUESTIONS.filter(function (q) { return q.d === Number(domainId); }) : PACK_QUESTIONS;
    source.forEach(function (q) {
      var last = packSeen[q.id];
      if (!last) unseen.push(q);
      else seen.push({ q: q, last: last });
    });
    seen.sort(function (a, b) { return a.last - b.last; });
    return shuffle(unseen).concat(seen.map(function (x) { return x.q; })).slice(0, count);
  }

  loadPack();
  loadPackSeen();

  var CARDS = ((window.CISSP && CISSP.cards) || []).slice();
  var CARDID = {};
  CARDS.forEach(function (c) { CARDID[c.id] = c; });

  var STORAGE_KEY = "cissp.fieldmanual.v1";
  var ACTIVE_EXAM_KEY = "cissp.fieldmanual.exam.v1";
  var ACTIVE_PRACTICE_KEY = "cissp.fieldmanual.practice.v1";

  var SYNC = window.CISSP_SYNC || null;
  var syncConfig = SYNC ? SYNC.loadConfig() : null;
  var syncStatus = {
    state: "idle",
    lastError: null,
    devices: syncConfig ? (syncConfig.lastDeviceCount || 0) : 0,
    lastSyncAt: syncConfig ? syncConfig.lastSyncAt : null
  };
  var syncInFlight = false;
  var syncQueued = false;
  var syncTimer = null;
  var syncShowCode = false;
  var PALETTE = {
    1: { name: "Security and Risk Management", short: "Risk & Governance", weight: 16 },
    2: { name: "Asset Security", short: "Asset Security", weight: 10 },
    3: { name: "Security Architecture and Engineering", short: "Architecture", weight: 13 },
    4: { name: "Communication and Network Security", short: "Network Security", weight: 13 },
    5: { name: "Identity and Access Management", short: "Identity & Access", weight: 13 },
    6: { name: "Security Assessment and Testing", short: "Assessment & Testing", weight: 12 },
    7: { name: "Security Operations", short: "Operations", weight: 13 },
    8: { name: "Software Development Security", short: "Software Security", weight: 10 }
  };

  var view = document.getElementById("view");
  var main = document.getElementById("main");
  var toastEl = document.getElementById("toast");
  var spine = document.getElementById("spine");
  var scrim = document.getElementById("spine-scrim");
  var menuButton = document.getElementById("menu-button");
  var TEXT_SIZE_KEY = "cissp.fieldmanual.textsize.v1";
  var TEXT_SCALES = [0.9, 1, 1.1, 1.2, 1.3];
  var textScale = loadTextScale();

  var practiceSession = null;
  var cardSession = null;
  var examSession = null;
  var lastExamResult = null;
  var lastPracticeSummary = null;
  var timerHandle = null;
  var toastHandle = null;
  var scrollObserver = null;

  /* ------------------------------------------------------------------ utils */

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function makeId(prefix) {
    var value;
    if (window.crypto && window.crypto.randomUUID) value = window.crypto.randomUUID();
    else value = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
    return (prefix || "") + value;
  }

  function dateKey(date) {
    var d = date || new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function parseDateKey(key) {
    if (!key) return null;
    var parts = key.split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function todayKey() { return dateKey(new Date()); }

  function addDaysKey(days) {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + days);
    return dateKey(d);
  }

  function formatDate(key, opts) {
    var d = parseDateKey(key);
    if (!d) return "—";
    return d.toLocaleDateString(undefined, opts || { day: "numeric", month: "short", year: "numeric" });
  }

  function formatDuration(seconds) {
    if (seconds == null || isNaN(seconds)) return "—";
    var s = Math.max(0, Math.round(seconds));
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    if (h > 0) return h + "h " + pad(m) + "m";
    if (m > 0) return m + "m " + pad(s % 60) + "s";
    return s + "s";
  }

  function formatClock(seconds) {
    var s = Math.max(0, Math.round(seconds));
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    return pad(h) + ":" + pad(m) + ":" + pad(sec);
  }

  function pct(value) {
    if (value == null || isNaN(value)) return "—";
    return Math.round(value * 100) + "%";
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function pickQuestions(pool, count) {
    var unseen = [];
    var seen = [];
    pool.forEach(function (q) {
      var a = state.attempts[q.id];
      if (!a) unseen.push(q);
      else seen.push({ q: q, last: a.last || 0 });
    });
    seen.sort(function (a, b) { return a.last - b.last; });
    return shuffle(unseen).concat(seen.map(function (x) { return x.q; })).slice(0, count);
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function plural(n, one, many) { return n + " " + (n === 1 ? one : (many || one + "s")); }

  function domainById(id) {
    return DOMAINS.filter(function (d) { return d.id === Number(id); })[0] || null;
  }

  function questionsFor(domainId) {
    return QUESTIONS.filter(function (q) { return q.d === Number(domainId); });
  }

  function domainName(id) {
    if (Number(id) === 0) return "Official practice pack";
    var d = domainById(id);
    return d ? d.name : (PALETTE[id] ? PALETTE[id].name : "Domain " + id);
  }

  function domainShort(id) {
    if (Number(id) === 0) return "Official pack";
    var d = domainById(id);
    return d ? d.short : (PALETTE[id] ? PALETTE[id].short : "Domain " + id);
  }

  function icon(name, cls) {
    var paths = {
      arrow: '<path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
      arrowLeft: '<path d="M20 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
      check: '<path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
      x: '<path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      flag: '<path d="M6 21V4m0 0h11l-2 4 2 4H6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
      bookmark: '<path d="M7 4h10v17l-5-3.5L7 21Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
      bookmarkFill: '<path d="M7 4h10v17l-5-3.5L7 21Z" fill="currentColor" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
      clock: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.5V12l3.2 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
      grid: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" fill="none" stroke="currentColor" stroke-width="1.7"/>',
      flame: '<path d="M12 3c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 .2 2 1 3 2 3 0-3 1-5 1-8Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
      layers: '<path d="M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
      target: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
      book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5ZM4 20.5A2.5 2.5 0 0 1 6.5 18H20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
      card: '<path d="M4 7h12v12H4z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 3h12v12" fill="none" stroke="currentColor" stroke-width="1.6"/>',
      compass: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m15 9-2 4-4 2 2-4 4-2Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
      chart: '<path d="M4 20V4M4 20h16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M8 16v-4M12 16V8M16 16v-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
      home: '<path d="M4 10.5 12 4l8 6.5V20h-6v-5h-4v5H4Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
      play: '<path d="M8 5l11 7-11 7Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
      refresh: '<path d="M20 11a8 8 0 1 0-2 6M20 5v6h-6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
      eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/>',
      calendar: '<path d="M5 5h14v15H5zM5 9h14M9 3v4M15 3v4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
    };
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (paths[name] || "") + "</svg>";
  }

  /* ---------------------------------------------------------------- storage */

  function defaultState() {
    return {
      v: 2,
      attempts: {},
      bookmarks: {},
      cards: {},
      exams: [],
      activity: {},
      settings: { examDate: null, examDateAt: 0 },
      daily: { date: todayKey(), drill: false, review: false, cards: false },
      visits: {},
      lastSummary: null,
      streak: { last: null, count: 0 }
    };
  }

  /* localState is this device's own snapshot. state is the merged view the UI
     reads. Only localState is ever written to disk or pushed to the Worker. */
  var localState = loadState();
  var remoteStates = (SYNC && syncConfig) ? SYNC.loadCachedStates() : {};
  var state = buildMergedState();
  persistLocal();

  function buildMergedState() {
    var docs = [localState];
    if (syncConfig) {
      Object.keys(remoteStates || {}).forEach(function (id) {
        if (id !== syncConfig.deviceId && remoteStates[id]) docs.push(remoteStates[id]);
      });
    }
    return SYNC ? SYNC.mergeStates(docs, defaultState()) : localState;
  }

  function rebuildState() {
    state = buildMergedState();
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      var next = sanitizeState(parsed);
      if (parsed && parsed.lastSummary && typeof parsed.lastSummary === "object") {
        next.lastSummary = parsed.lastSummary;
      }
      return next;
    } catch (err) {
      return defaultState();
    }
  }

  function persistLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localState));
    } catch (err) {
      /* Storage may be unavailable or full; the session still works in memory. */
    }
  }

  function save() {
    rebuildState();
    persistLocal();
    scheduleSync();
  }

  function safeNumber(value, min, max, fallback) {
    var n = Number(value);
    if (!isFinite(n)) return fallback;
    return clamp(n, min, max);
  }

  function isDateKey(value) {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  }

  function sanitizeState(source) {
    if (!source || typeof source !== "object") throw new Error("Invalid progress file");
    var next = defaultState();
    var maxFuture = Date.now() + 86400000;

    if (source.attempts && typeof source.attempts === "object") {
      Object.keys(source.attempts).forEach(function (id) {
        if (!QID[id] && !PACK_QID[id]) return;
        var a = source.attempts[id];
        if (!a || typeof a !== "object") return;
        var c = safeNumber(a.c, 0, 9999, 0);
        var w = safeNumber(a.w, 0, 9999, 0);
        next.attempts[id] = {
          c: c,
          w: w,
          last: a.last == null ? 0 : safeNumber(a.last, 0, maxFuture, 0),
          box: safeNumber(a.box, 0, 4, 0),
          lastResult: typeof a.lastResult === "boolean" ? a.lastResult : (w > 0 ? false : true)
        };
      });
    }

    if (Array.isArray(source.bookmarks)) {
      source.bookmarks.forEach(function (id) {
        if (QID[id]) next.bookmarks[id] = { on: true, at: 0 };
      });
    } else if (source.bookmarks && typeof source.bookmarks === "object") {
      Object.keys(source.bookmarks).forEach(function (id) {
        if (!QID[id]) return;
        var b = source.bookmarks[id];
        if (b == null) return;
        next.bookmarks[id] = {
          on: typeof b === "boolean" ? b : !!b.on,
          at: b && typeof b === "object" ? safeNumber(b.at, 0, maxFuture, 0) : 0
        };
      });
    }

    if (source.cards && typeof source.cards === "object") {
      Object.keys(source.cards).forEach(function (id) {
        if (!CARDID[id]) return;
        var c = source.cards[id];
        if (!c || typeof c !== "object") return;
        next.cards[id] = {
          box: safeNumber(c.box, 0, 4, 0),
          due: isDateKey(c.due) ? c.due : todayKey(),
          seen: safeNumber(c.seen, 0, 9999, 0),
          lapses: safeNumber(c.lapses, 0, 9999, 0),
          last: c.last == null ? 0 : safeNumber(c.last, 0, maxFuture, 0)
        };
      });
    }

    if (Array.isArray(source.exams)) {
      source.exams.slice(-20).forEach(function (e) {
        if (!e || typeof e !== "object") return;
        var total = safeNumber(e.total, 0, 300, 0);
        if (!total) return;
        var correct = safeNumber(e.correct, 0, total, 0);
        var seconds = safeNumber(e.seconds, 0, 10800, 0);
        var dateKeyValue = isDateKey(e.dateKey) ? e.dateKey : todayKey();
        var examId = typeof e.id === "string" && /^[A-Za-z0-9._:-]{1,80}$/.test(e.id) ? e.id : "";
        if (!examId) {
          examId = "legacy-" + dateKeyValue + "-" + total + "-" + correct + "-" + Math.round(seconds);
        }
        if (next.exams.some(function (x) { return x.id === examId; })) return;
        var byDomain = {};
        Object.keys(e.byDomain || {}).forEach(function (id) {
          if (!/^[1-8]$/.test(id)) return;
          var row = e.byDomain[id];
          if (!row || typeof row !== "object") return;
          var rowTotal = safeNumber(row.total, 0, 300, 0);
          if (!rowTotal) return;
          byDomain[id] = { total: rowTotal, correct: safeNumber(row.correct, 0, rowTotal, 0) };
        });
        var review = [];
        (Array.isArray(e.review) ? e.review : []).slice(0, 200).forEach(function (r) {
          if (!r || !QID[r.id]) return;
          review.push({
            id: r.id,
            picked: typeof r.picked === "number" ? safeNumber(r.picked, 0, 3, null) : null,
            correct: !!r.correct
          });
        });
        next.exams.push({
          id: examId,
          dateKey: dateKeyValue,
          date: typeof e.date === "string" ? e.date : new Date().toISOString(),
          total: total,
          correct: correct,
          pct: correct / total,
          scaled: safeNumber(e.scaled, 300, 1000, Math.round(300 + (correct / total) * 700)),
          seconds: seconds,
          strict: !!e.strict,
          pack: !!e.pack,
          byDomain: byDomain,
          review: review
        });
      });
    }

    if (source.activity && typeof source.activity === "object") {
      Object.keys(source.activity).sort().slice(-400).forEach(function (key) {
        if (!isDateKey(key)) return;
        var day = source.activity[key];
        if (!day || typeof day !== "object") return;
        next.activity[key] = {
          a: safeNumber(day.a, 0, 100000, 0),
          c: safeNumber(day.c, 0, 100000, 0),
          cards: safeNumber(day.cards, 0, 100000, 0)
        };
      });
    }

    if (source.settings) {
      var at = source.settings.examDateAt == null
        ? 0
        : safeNumber(source.settings.examDateAt, 0, maxFuture, 0);
      if (isDateKey(source.settings.examDate)) {
        next.settings.examDate = source.settings.examDate;
        next.settings.examDateAt = at || 1;
      } else if (source.settings.examDate === null) {
        next.settings.examDate = null;
        next.settings.examDateAt = at;
      }
    }

    if (source.daily && isDateKey(source.daily.date)) {
      next.daily = {
        date: source.daily.date,
        drill: !!source.daily.drill,
        review: !!source.daily.review,
        cards: !!source.daily.cards
      };
    }

    if (source.streak && isDateKey(source.streak.last)) {
      next.streak = { last: source.streak.last, count: safeNumber(source.streak.count, 0, 100000, 0) };
    }

    if (source.visits && typeof source.visits === "object") {
      Object.keys(source.visits).forEach(function (id) {
        if (!/^[1-8]$/.test(id)) return;
        next.visits[id] = safeNumber(source.visits[id], 0, maxFuture, 0);
      });
    }

    next.v = 2;
    next.lastSummary = null;
    return next;
  }

  function sanitizeImportedState(raw) {
    var source = raw && raw.app === "cissp-field-manual" ? raw.state : raw;
    if (!source || typeof source !== "object") throw new Error("Invalid progress file");
    return sanitizeState(source);
  }

  function exportProgress() {
    var payload = {
      app: "cissp-field-manual",
      version: 2,
      exportedAt: new Date().toISOString(),
      state: state
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "cissp-progress-" + todayKey() + ".json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1200);
    toast("Progress exported. Keep the file somewhere safe.");
  }

  function importProgressFile(file) {
    if (!file) return;
    if (syncConfig) {
      openDialog({
        title: "Import is paused while sync is on",
        body: "<p>Importing a merged backup on a synced device would count the same answers twice. Turn sync off on your devices first, then import the backup and create a new sync code.</p><p>Your local progress is unchanged.</p>",
        actions: '<button type="button" class="btn btn--small" data-close>OK</button>'
      });
      return;
    }
    if (file.size > 3 * 1024 * 1024) { toast("That file is too large for a progress backup."); return; }
    file.text().then(function (text) {
      var parsed;
      try { parsed = JSON.parse(text); } catch (err) { toast("That file is not valid JSON."); return; }
      var next;
      try { next = sanitizeImportedState(parsed); } catch (err) { toast("That file is not a CISSP progress export."); return; }
      var answered = Object.keys(next.attempts).length;
      var seenCards = Object.keys(next.cards).length;
      var dialog = openDialog({
        title: "Replace this browser’s progress?",
        body: "<p>The file contains <strong>" + answered + " answered questions</strong>, <strong>" + seenCards + " cards</strong>, and <strong>" + next.exams.length + " mock exams</strong>.</p><p>Importing replaces the progress currently stored in this browser. Export your current progress first if you want a copy.</p>",
        actions: '<button type="button" class="btn btn--ghost btn--small" data-close>Keep current progress</button><button type="button" class="btn btn--small" data-confirm-import>Replace and import</button>'
      });
      dialog.querySelector("[data-confirm-import]").addEventListener("click", function () {
        dialog.close();
        localState = next;
        lastPracticeSummary = null;
        lastExamResult = null;
        practiceSession = null;
        cardSession = null;
        examSession = null;
        clearPracticeState();
        clearActiveExam();
        save();
        render();
        toast("Progress imported.");
      });
    }).catch(function () { toast("The file could not be read."); });
  }

  function importPackFile(file) {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast("That pack is too large."); return; }
    file.text().then(function (text) {
      var parsed;
      try { parsed = JSON.parse(text); } catch (err) { toast("That file is not valid JSON."); return; }
      var pack;
      try { pack = normalizePack(parsed); } catch (err) { toast("That file is not a valid question pack."); return; }
      var dialog = openDialog({
        title: "Load this question pack?",
        body: "<p><strong>" + esc(pack.title) + "</strong></p><p>" + pack.questions.length + " questions. " + esc(pack.source || "Local source") + "</p><p>The pack stays in this browser. It is not uploaded or included in cross-device sync.</p>",
        actions: '<button type="button" class="btn btn--ghost btn--small" data-close>Cancel</button><button type="button" class="btn btn--small" data-confirm-pack>Load pack</button>'
      });
      dialog.querySelector("[data-confirm-pack]").addEventListener("click", function () {
        dialog.close();
        try {
          pack.importedAt = Date.now();
          savePack(pack);
          practiceSession = null;
          clearPracticeState();
          render();
          toast("Question pack loaded locally.");
        } catch (err) {
          toast("The pack could not be stored in this browser.");
        }
      });
    }).catch(function () { toast("The file could not be read."); });
  }

  function removePack() {
    var dialog = openDialog({
      title: "Remove the local question pack?",
      body: "<p>This removes the imported questions from this browser. Your domain progress is not affected.</p>",
      actions: '<button type="button" class="btn btn--ghost btn--small" data-close>Keep pack</button><button type="button" class="btn btn--signal btn--small" data-confirm-pack-remove>Remove</button>'
    });
    dialog.querySelector("[data-confirm-pack-remove]").addEventListener("click", function () {
      dialog.close();
      clearPack();
      practiceSession = null;
      clearPracticeState();
      render();
      toast("Question pack removed.");
    });
  }

  function ensureDaily() {
    if (!localState.daily || localState.daily.date !== todayKey()) {
      localState.daily = { date: todayKey(), drill: false, review: false, cards: false };
      rebuildState();
    }
  }

  function hasActivity(key) {
    var day = state.activity[key];
    return !!(day && ((day.a || 0) + (day.cards || 0) > 0));
  }

  function currentStreak() {
    var start = hasActivity(todayKey()) ? 0 : 1;
    if (!hasActivity(addDaysKey(-start))) return 0;
    var count = 0;
    for (var i = start; i < 400; i++) {
      if (!hasActivity(addDaysKey(-i))) break;
      count += 1;
    }
    return count;
  }

  function visitedToday(domainId) {
    var last = state.visits && state.visits[domainId];
    return !!last && dateKey(new Date(last)) === todayKey();
  }

  function logActivity(kind, correct) {
    ensureDaily();
    var key = todayKey();
    var day = localState.activity[key] || { a: 0, c: 0, cards: 0 };
    if (kind === "answer") {
      day.a += 1;
      if (correct) day.c += 1;
    } else if (kind === "card") {
      day.cards += 1;
    }
    localState.activity[key] = day;
  }

  /* --------------------------------------------------------------- analytics */

  function domainStats(domainId) {
    var qs = questionsFor(domainId);
    var correct = 0, wrong = 0, seen = 0;
    qs.forEach(function (q) {
      var a = state.attempts[q.id];
      if (!a) return;
      seen += 1;
      correct += a.c || 0;
      wrong += a.w || 0;
    });
    var attempts = correct + wrong;
    var accuracy = attempts ? correct / attempts : null;
    var coverage = qs.length ? seen / qs.length : 0;
    var confidence = Math.min(attempts, 12) / 12;
    var mastery = attempts
      ? Math.round(100 * (0.6 * accuracy + 0.4 * coverage) * (0.55 + 0.45 * confidence))
      : 0;
    return {
      total: qs.length,
      seen: seen,
      attempts: attempts,
      correct: correct,
      wrong: wrong,
      accuracy: accuracy,
      coverage: coverage,
      mastery: clamp(mastery, 0, 100)
    };
  }

  function allStats() {
    var attempts = 0, correct = 0, seen = 0;
    Object.keys(state.attempts).forEach(function (id) {
      if (!QID[id]) return;
      var a = state.attempts[id];
      attempts += (a.c || 0) + (a.w || 0);
      correct += a.c || 0;
      seen += 1;
    });
    return {
      attempts: attempts,
      correct: correct,
      seen: seen,
      total: QUESTIONS.length,
      accuracy: attempts ? correct / attempts : null,
      coverage: QUESTIONS.length ? seen / QUESTIONS.length : 0
    };
  }

  function readiness() {
    var stats = allStats();
    if (stats.attempts < 8) return null;
    var totalWeight = 0;
    var sum = 0;
    DOMAINS.forEach(function (d) {
      totalWeight += d.weight;
      sum += domainStats(d.id).mastery * d.weight;
    });
    return totalWeight ? Math.round(sum / totalWeight) : null;
  }

  function readinessLabel(value) {
    if (value == null) return "Not enough evidence yet";
    if (value >= 82) return "Strong — keep the edge";
    if (value >= 68) return "On track — protect the weak domain";
    if (value >= 50) return "Building — drill, don't reread";
    return "Early — establish a baseline";
  }

  function weakestDomain() {
    var attempted = DOMAINS.filter(function (d) { return domainStats(d.id).attempts > 0; });
    var pool = attempted.length ? attempted : DOMAINS;
    return pool.slice().sort(function (a, b) {
      var sa = domainStats(a.id), sb = domainStats(b.id);
      if (sa.mastery !== sb.mastery) return sa.mastery - sb.mastery;
      return a.id - b.id;
    })[0];
  }

  function wrongQuestions() {
    return QUESTIONS.concat(PACK_QUESTIONS).filter(function (q) {
      var a = state.attempts[q.id];
      return a && a.lastResult === false;
    });
  }

  function dueCards(domainId) {
    var today = todayKey();
    return CARDS.filter(function (c) {
      if (domainId && c.d !== Number(domainId)) return false;
      var s = state.cards[c.id];
      return !s || !s.due || s.due <= today;
    });
  }

  function examDateInfo() {
    var key = (state.settings && state.settings.examDate) || (META.examDate || null);
    if (!key) return null;
    var target = parseDateKey(key);
    if (!target) return null;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var days = Math.round((target - today) / 86400000);
    return { key: key, days: days };
  }

  function peekActiveExam() {
    try {
      var raw = localStorage.getItem(ACTIVE_EXAM_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.questions)) return null;
      if (parsed.endsAt <= Date.now()) return null;
      return parsed;
    } catch (err) {
      return null;
    }
  }

  /* ----------------------------------------------------------------- routing */

  function parseRoute(hash) {
    var path = (hash || "/").replace(/^#/, "") || "/";
    if (path.charAt(0) !== "/") path = "/" + path;
    path = path.replace(/\/+$/, "") || "/";
    var parts = path.split("/").filter(Boolean);
    return { path: path, parts: parts };
  }

  function routeFor(parts) {
    var p = parts[0] || "home";
    if (p === "home") return { name: "home", section: "home" };
    if (p === "mindset") return { name: "mindset", section: "mindset" };
    if (p === "plan") return { name: "plan", section: "plan" };
    if (p === "study") {
      if (parts[1]) return { name: "domain", section: "study", id: Number(parts[1]) };
      return { name: "study", section: "study" };
    }
    if (p === "practice") {
      if (parts[1] === "session") return { name: "practiceSession", section: "practice" };
      if (parts[1] === "summary") return { name: "practiceSummary", section: "practice" };
      return { name: "practice", section: "practice" };
    }
    if (p === "flashcards") {
      if (parts[1] === "session") return { name: "cardsSession", section: "flashcards" };
      return { name: "flashcards", section: "flashcards" };
    }
    if (p === "exam") {
      if (parts[1] === "run") return { name: "examRun", section: "exam" };
      if (parts[1] === "results") return { name: "examResults", section: "exam" };
      return { name: "exam", section: "exam" };
    }
    if (p === "progress") return { name: "progress", section: "progress" };
    return { name: "notFound", section: "home" };
  }

  function render() {
    var route = routeFor(parseRoute(location.hash).parts);
    clearTick();
    if (scrollObserver) { scrollObserver.disconnect(); scrollObserver = null; }
    closeDialogs();

    var output;
    try {
      output = renderRoute(route);
    } catch (err) {
      output = {
        html: '<section class="empty"><h1>Something went wrong.</h1><p>' + esc(err.message) + '</p><a class="btn" href="#/">Return home</a></section>'
      };
      if (window.console) console.error(err);
    }

    view.innerHTML = output.html || "";
    document.title = (output.title ? output.title + " — " : "") + "CISSP Field Manual";
    if (output.mount) {
      try { output.mount(); } catch (err) { if (window.console) console.error(err); }
    }
    refreshChrome(route);
    window.scrollTo(0, 0);
    view.classList.remove("view-enter");
    void view.offsetWidth;
    view.classList.add("view-enter");
  }

  function renderRoute(route) {
    switch (route.name) {
      case "home": return viewHome();
      case "mindset": return viewMindset();
      case "plan": return viewPlan();
      case "study": return viewStudy();
      case "domain": return viewDomain(route.id);
      case "practice": return viewPractice();
      case "practiceSession": return viewPracticeSession();
      case "practiceSummary": return viewPracticeSummary();
      case "flashcards": return viewFlashcards();
      case "cardsSession": return viewCardsSession();
      case "exam": return viewExam();
      case "examRun": return viewExamRun();
      case "examResults": return viewExamResults();
      case "progress": return viewProgress();
      default:
        return {
          title: "Not found",
          html: '<section class="empty"><h1>That page is not in the manual.</h1><p>Use the sections on the left, or return to the opening brief.</p><a class="btn" href="#/">Return home</a></section>'
        };
    }
  }

  /* ------------------------------------------------------------------ chrome */

  var NAV = [
    { section: "home", href: "#/", label: "Opening brief", icon: "home" },
    { section: "mindset", href: "#/mindset", label: "Manager's lens", icon: "compass" },
    { section: "plan", href: "#/plan", label: "Study plan", icon: "calendar" },
    { section: "study", href: "#/study", label: "Domain notes", icon: "book" },
    { section: "practice", href: "#/practice", label: "Practice drills", icon: "target" },
    { section: "flashcards", href: "#/flashcards", label: "Flashcards", icon: "card" },
    { section: "exam", href: "#/exam", label: "Mock exam", icon: "clock" },
    { section: "progress", href: "#/progress", label: "Progress", icon: "chart" }
  ];

  function loadTextScale() {
    try {
      var n = parseFloat(localStorage.getItem(TEXT_SIZE_KEY));
      if (!isFinite(n)) return 1;
      var best = TEXT_SCALES[0];
      var bestDistance = Math.abs(n - best);
      TEXT_SCALES.forEach(function (scale) {
        var distance = Math.abs(n - scale);
        if (distance < bestDistance) { best = scale; bestDistance = distance; }
      });
      return best;
    } catch (err) {
      return 1;
    }
  }

  function applyTextScale() {
    var root = document.documentElement;
    if (textScale === 1) {
      root.removeAttribute("data-reading");
      root.style.removeProperty("--reading-scale");
    } else {
      root.setAttribute("data-reading", "on");
      root.style.setProperty("--reading-scale", textScale);
    }
    var label = document.getElementById("text-size-label");
    if (label) {
      var percent = Math.round(textScale * 100) + "%";
      label.textContent = percent;
      label.setAttribute("aria-label", "Reading size " + percent);
    }
    var index = TEXT_SCALES.indexOf(textScale);
    var dec = document.querySelector("[data-text-dec]");
    var inc = document.querySelector("[data-text-inc]");
    if (dec) dec.disabled = index <= 0;
    if (inc) inc.disabled = index >= TEXT_SCALES.length - 1;
  }

  function changeTextScale(delta) {
    var index = TEXT_SCALES.indexOf(textScale);
    if (index < 0) index = 1;
    var next = clamp(index + delta, 0, TEXT_SCALES.length - 1);
    if (next === index) return;
    textScale = TEXT_SCALES[next];
    try { localStorage.setItem(TEXT_SIZE_KEY, String(textScale)); } catch (err) { /* ignore */ }
    applyTextScale();
  }

  function refreshChrome(route) {
    var nav = document.getElementById("primary-nav");
    nav.innerHTML = NAV.map(function (item) {
      return '<a href="' + item.href + '" class="' + (item.section === route.section ? "is-active" : "") + '"' +
        (item.section === route.section ? ' aria-current="page"' : "") + ">" +
        icon(item.icon) + "<span>" + esc(item.label) + "</span></a>";
    }).join("");

    var domainNav = document.getElementById("domain-nav");
    domainNav.innerHTML = DOMAINS.map(function (d) {
      var s = domainStats(d.id);
      var active = route.name === "domain" && route.id === d.id;
      return '<a class="domain-link ' + (active ? "is-active" : "") + '" href="#/study/' + d.id + '"' +
        (active ? ' aria-current="page"' : "") + ">" +
        '<span class="domain-link__no">' + pad(d.id) + "</span>" +
        '<span class="domain-link__name">' + esc(d.short) + "</span>" +
        '<span class="domain-link__pct">' + s.mastery + "%</span>" +
        '<span class="domain-link__bar"><i style="width:' + s.mastery + '%"></i></span>' +
        "</a>";
    }).join("");

    var mastered = DOMAINS.filter(function (d) { return domainStats(d.id).mastery >= 80; }).length;
    document.getElementById("spine-progress").textContent = mastered + " / 8";

    renderExamDate();
    renderStreak();
    renderCrumbs(route);

    var tabMap = { home: "home", study: "study", practice: "practice", flashcards: "cards", exam: "exam", progress: "progress" };
    var tabs = document.querySelectorAll(".tabbar a");
    Array.prototype.forEach.call(tabs, function (a) {
      var active = a.getAttribute("data-tab") === tabMap[route.section];
      a.classList.toggle("is-active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function renderExamDate() {
    var block = document.getElementById("exam-date-block");
    var info = examDateInfo();
    if (!info) {
      block.innerHTML =
        '<span class="exam-date__label">Exam date</span>' +
        '<span class="exam-date__value">Not set</span>' +
        '<button type="button" class="exam-date__set" data-set-exam-date>Set a target date</button>';
      return;
    }
    var value;
    if (info.days > 1) value = info.days + ' <small>days left</small>';
    else if (info.days === 1) value = 'Tomorrow';
    else if (info.days === 0) value = 'Today';
    else value = '<small>Date passed</small>';
    block.innerHTML =
      '<span class="exam-date__label">Exam date · ' + esc(formatDate(info.key, { day: "numeric", month: "short" })) + "</span>" +
      '<span class="exam-date__value">' + value + "</span>" +
      '<button type="button" class="exam-date__set" data-set-exam-date>Change date</button>';
  }

  function renderStreak() {
    var pill = document.getElementById("streak-pill");
    var n = currentStreak();
    if (n > 0) {
      pill.classList.remove("is-empty");
      pill.innerHTML = icon("flame") + "<span>" + plural(n, "day") + " running</span>";
    } else {
      pill.classList.add("is-empty");
      pill.innerHTML = icon("flame") + "<span>No streak yet</span>";
    }
  }

  function renderCrumbs(route) {
    var crumbs = document.getElementById("crumbs");
    var items = [{ label: "Field manual", href: "#/" }];
    if (route.section === "mindset") items.push({ label: "Mindset" });
    if (route.section === "plan") items.push({ label: "Study plan" });
    if (route.section === "study") {
      items.push({ label: "Domain notes", href: "#/study" });
      if (route.name === "domain") items.push({ label: pad(route.id) + " · " + domainShort(route.id) });
    }
    if (route.section === "practice") {
      items.push({ label: "Practice", href: "#/practice" });
      if (route.name === "practiceSession") items.push({ label: "Drill" });
      if (route.name === "practiceSummary") items.push({ label: "Session summary" });
    }
    if (route.section === "flashcards") {
      items.push({ label: "Flashcards", href: "#/flashcards" });
      if (route.name === "cardsSession") items.push({ label: "Review" });
    }
    if (route.section === "exam") {
      items.push({ label: "Mock exam", href: "#/exam" });
      if (route.name === "examRun") items.push({ label: "In progress" });
      if (route.name === "examResults") items.push({ label: "Results" });
    }
    if (route.section === "progress") items.push({ label: "Progress" });

    crumbs.innerHTML = items.map(function (item, index) {
      var last = index === items.length - 1;
      var piece = last
        ? '<span aria-current="page">' + esc(item.label) + "</span>"
        : '<a href="' + item.href + '">' + esc(item.label) + "</a>";
      return (index ? '<span class="sep">/</span>' : "") + piece;
    }).join("");
  }

  function openSpine() {
    spine.classList.add("is-open");
    scrim.hidden = false;
    menuButton.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var closeButton = document.getElementById("spine-close");
    if (closeButton) closeButton.focus({ preventScroll: true });
  }

  function closeSpine() {
    var wasOpen = spine.classList.contains("is-open");
    spine.classList.remove("is-open");
    scrim.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (wasOpen) menuButton.focus({ preventScroll: true });
  }

  function motionBehavior() {
    try {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    } catch (err) {
      return "auto";
    }
  }

  function focusSoon(selector) {
    window.requestAnimationFrame(function () {
      var target = document.querySelector(selector);
      if (target) target.focus({ preventScroll: true });
    });
  }

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-on");
    if (toastHandle) clearTimeout(toastHandle);
    toastHandle = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2600);
  }

  /* -------------------------------------------------------------------- home */

  function bubbleSheet() {
    var r = readiness();
    var focus = weakestDomain();
    var rows = DOMAINS.map(function (d) {
      var s = domainStats(d.id);
      var filled = Math.round((s.mastery / 100) * 24);
      var bubbles = "";
      for (var i = 0; i < 24; i++) {
        bubbles += '<span class="bubble' + (i < filled ? " is-filled" : "") + '"></span>';
      }
      return '<div class="sheet__row' + (focus && focus.id === d.id ? " is-focus" : "") + '">' +
        '<span class="sheet__no">' + pad(d.id) + "</span>" +
        '<span class="bubbles" aria-hidden="true">' + bubbles + "</span>" +
        '<span class="sheet__pct">' + s.mastery + "%</span>" +
        "</div>";
    }).join("");

    return '<div class="sheet" aria-label="Domain mastery answer sheet">' +
      '<div class="sheet__head">' +
        '<div class="sheet__title">Answer sheet<strong>Domain mastery</strong></div>' +
        '<div class="sheet__score"><strong>' + (r == null ? "—" : r) + "</strong><span>readiness / 100</span></div>" +
      "</div>" +
      '<div class="sheet__rows">' + rows + "</div>" +
      '<div class="sheet__foot"><span>' + (r == null ? "No marks yet — start a diagnostic" : "Fill = weighted practice mastery") + "</span><span>" + esc(readinessLabel(r)) + "</span></div>" +
      "</div>";
  }

  function briefItem(done, kicker, title, sub, href, attrs) {
    return '<a class="brief__item ' + (done ? "is-done" : "") + '" href="' + href + '" ' + (attrs || "") + ">" +
      '<span class="brief__box" aria-hidden="true">' + (done ? "✓" : "") + "</span>" +
      "<span><span class=\"brief__kicker\">" + esc(kicker) + "</span>" +
      '<span class="brief__title">' + esc(title) + "</span>" +
      '<span class="brief__sub">' + esc(sub) + "</span></span>" +
      '<span class="brief__go" aria-hidden="true">→</span>' +
      "</a>";
  }

  function viewHome() {
    ensureDaily();
    var stats = allStats();
    var r = readiness();
    var focus = weakestDomain();
    var focusStats = domainStats(focus.id);
    var due = dueCards().length;
    var wrong = wrongQuestions().length;
    var primary = stats.attempts === 0
      ? '<a class="btn btn--signal" href="#/practice" data-start="diagnostic">Start the 20-question diagnostic ' + icon("arrow") + "</a>"
      : '<a class="btn" href="#/practice" data-start="quick">Start a 10-question drill ' + icon("arrow") + "</a>";

    var brief = "";
    brief += briefItem(state.daily.cards || due === 0, "Warm up", due === 0 ? "No cards due" : (due > 24 ? "Review 24 of " + due + " due" : plural(due, "flashcard") + " due"), "Spaced recall, two minutes a domain.", "#/flashcards/session", due > 0 ? 'data-cards-start="due"' : 'data-cards-start="all"');
    brief += briefItem(visitedToday(focus.id), "Focus", "Domain " + pad(focus.id) + " · " + focus.name, focusStats.attempts ? "Your weakest domain at " + focusStats.mastery + "% mastery." : "No evidence yet. Read the notes, then drill.", "#/study/" + focus.id);
    brief += briefItem(state.daily.drill, "Apply", "A 10-question mixed drill", "Interleaved practice beats rereading.", "#/practice", 'data-start="quick"');
    brief += briefItem(state.daily.review || wrong === 0, "Repair", wrong > 0 ? plural(wrong, "missed question") + " to revisit" : "No missed questions", wrong > 0 ? "Re-answer them until the reasoning sticks." : "Keep it that way.", "#/practice", 'data-start="review"');

    var active = peekActiveExam();
    var resumeBanner = active
      ? '<div class="exam-warning" style="border-color:#a9c6b4;background:var(--ok-soft)"><p style="color:#1b4a37"><strong>A mock exam is paused.</strong> Question ' + (active.index + 1) + " of " + active.questions.length + ", " + formatClock((active.endsAt - Date.now()) / 1000) + " remaining. " +
        '<a href="#/exam/run" style="color:#1b4a37">Resume now</a> · <button type="button" data-exam-discard style="border:0;background:none;padding:0;text-decoration:underline;color:#1b4a37;font:inherit">discard</button></p></div>'
      : "";

    return {
      title: "Opening brief",
      html:
        resumeBanner +
        '<section class="hero">' +
          '<div class="hero__copy">' +
            '<p class="eyebrow">' + esc(META.outline) + ' · 8 domains · 100–150 questions</p>' +
            '<h1 class="display-xl">The exam rewards <em>judgment</em>, not recall.</h1>' +
            '<p class="lede">A working field manual for the CISSP: condensed notes for every domain, original scenario questions, and explanations that show why the best answer is the best answer.</p>' +
            '<div class="hero__actions">' + primary +
              '<a class="btn btn--ghost" href="#/mindset">Read the manager’s lens</a>' +
            "</div>" +
            '<div class="hero__meta">' +
              "<span><i></i>" + QUESTIONS.length + " practice questions</span>" +
              "<span><i></i>" + CARDS.length + " flashcards</span>" +
              "<span><i></i>125-question mock · 3 hours</span>" +
              "<span><i></i>Progress saved locally</span>" +
            "</div>" +
          "</div>" +
          "<div>" + bubbleSheet() + "</div>" +
        "</section>" +

        '<section class="section">' +
          '<div class="section-head"><div><h2>Today’s brief</h2><p>A short, deliberate session beats a long, passive one.</p></div>' +
          '<span class="label">' + esc(formatDate(todayKey(), { weekday: "long", day: "numeric", month: "long" })) + "</span></div>" +
          '<div class="split">' +
            '<div class="brief"><div class="brief__head"><h2>Four moves</h2><span class="label">' + (state.daily.drill && (state.daily.cards || due === 0) && (state.daily.review || wrong === 0) && visitedToday(focus.id) ? "Brief complete" : "In progress") + "</span></div>" +
              '<div class="brief__list">' + brief + "</div>" +
            "</div>" +
            '<div class="lens-card">' +
              '<p class="label">The manager’s lens</p>' +
              '<h2 class="display-m">Answer the role, not the tool.</h2>' +
              '<p>Most missed questions are not missed facts. They are answers given by an engineer when the question asked for a manager.</p>' +
              '<ul class="lens-card__rules">' +
                "<li><span>01</span>People before process before technology.</li>" +
                "<li><span>02</span>When all four are true, choose the most complete.</li>" +
                "<li><span>03</span>Risk is accepted by the business, never the analyst.</li>" +
              "</ul>" +
              '<a class="link-arrow" href="#/mindset">Open the full primer ' + icon("arrow") + "</a>" +
            "</div>" +
          "</div>" +
        "</section>" +

        '<section class="section">' +
          '<div class="section-head"><div><h2>The domain register</h2><p>Your evidence, weighted the way the exam weights it.</p></div>' +
          '<a class="link-arrow" href="#/study">Read the notes ' + icon("arrow") + "</a></div>" +
          domainRegister() +
        "</section>" +

        "</section>" +
        planTeaser()
    };
  }

  function domainRegister() {
    var rows = DOMAINS.map(function (d) {
      var s = domainStats(d.id);
      return "<tr>" +
        '<td class="register__no">' + pad(d.id) + "</td>" +
        '<td class="register__name"><a href="#/study/' + d.id + '">' + esc(d.name) + "</a>" +
          '<span class="register__sub">' + esc(d.short) + " · " + plural(s.total, "question") + "</span></td>" +
        '<td class="register__num">' + d.weight + "%</td>" +
        '<td class="register__num">' + s.seen + " / " + s.total + "</td>" +
        '<td class="register__num">' + (s.accuracy == null ? "—" : Math.round(s.accuracy * 100) + "%") + "</td>" +
        '<td><div class="register__bar"><i style="width:' + s.mastery + '%"></i></div><span class="register__empty"> ' + s.mastery + "%</span></td>" +
        "</tr>";
    }).join("");

    return '<table class="register"><thead><tr><th scope="col">No.</th><th scope="col">Domain</th><th scope="col">Weight</th><th scope="col">Seen</th><th scope="col">Accuracy</th><th scope="col">Mastery</th></tr></thead><tbody>' + rows + "</tbody></table>";
  }

  /* ----------------------------------------------------------------- mindset */

  function viewMindset() {
    var rules = MINDSET.rules.map(function (rule) {
      return '<article class="rule-item"><div><h3>' + esc(rule.title) + "</h3><p>" + esc(rule.body) + "</p></div></article>";
    }).join("");

    var verbs = MINDSET.verbs.map(function (v) {
      return "<tr><td>" + esc(v.verb) + "</td><td>" + esc(v.meaning) + "</td></tr>";
    }).join("");

    var technical = (MINDSET.technical || []).map(function (item, index) {
      return '<article class="tech-item"><span class="tech-item__no">' + pad(index + 1) + "</span>" +
        "<h3>" + esc(item.title) + "</h3><p>" + esc(item.body) + "</p></article>";
    }).join("");

    var worked = MINDSET.worked || { options: [] };
    var options = (worked.options || []).map(function (o) {
      var isCorrect = /^B$/.test(o.letter);
      return '<div class="worked__option ' + (isCorrect ? "is-in" : "is-out") + '">' +
        '<span class="worked__letter">' + esc(o.letter) + "</span>" +
        '<span><strong style="font-weight:500">' + esc(o.text) + "</strong>" +
        (o.note ? '<span style="display:block;color:var(--ink-3);font-size:11.5px;margin-top:4px">' + esc(o.note) + "</span>" : "") +
        "</span></div>";
    }).join("");

    return {
      title: "The manager's lens",
      html:
        '<header class="page-head"><div class="page-head__copy">' +
          '<p class="eyebrow">Mindset primer</p>' +
          '<h1 class="display-l">Think like the person<br>the question describes.</h1>' +
          '<p class="lede">' + esc(MINDSET.intro) + "</p>" +
        "</div>" +
        '<div class="page-head__aside"><a class="btn" href="#/practice" data-start="diagnostic">Test the mindset ' + icon("arrow") + "</a></div></header>" +

        '<section class="section--tight"><div class="section-head"><div><h2>Ten rules for ambiguous answers</h2><p>Use them when two options both look defensible.</p></div></div>' +
        '<div class="rules">' + rules + "</div></section>" +

        '<section class="section"><div class="section-head"><div><h2>If you come from a technical role</h2><p>Your depth is an advantage in the technical domains. These are the reflexes that cost technical candidates marks.</p></div>' +
        '<a class="link-arrow" href="#/practice" data-start="manager">Take the manager’s cut ' + icon("arrow") + "</a></div>" +
        '<div class="tech-grid">' + technical + "</div></section>" +

        '<section class="section"><div class="section-head"><div><h2>Read the operative word</h2><p>The same scenario has a different answer for FIRST and BEST.</p></div></div>' +
        '<table class="verb-table"><tbody>' + verbs + "</tbody></table></section>" +

        '<section class="section"><div class="section-head"><div><h2>A worked elimination</h2><p>Notice how the role and the verb remove three answers.</p></div></div>' +
        '<div class="worked">' +
          '<p class="label">Practice question · management judgment</p>' +
          '<p class="worked__stem">' + esc(worked.stem) + "</p>" +
          '<div class="worked__options">' + options + "</div>" +
          '<p class="worked__note">' + esc(worked.note) + "</p>" +
        "</div></section>" +

        '<section class="section"><div class="study-cta"><div><h3>Put the lens to work.</h3><p>Ten mixed questions. Explanations after every answer.</p></div><a class="btn" href="#/practice" data-start="quick">Start a drill ' + icon("arrow") + "</a></div></section>"
    };
  }


  /* -------------------------------------------------------------------- plan */

  function planWeekDates() {
    var info = examDateInfo();
    if (!info) return [];
    var exam = parseDateKey(info.key);
    if (!exam) return [];
    var start = new Date(exam.getFullYear(), exam.getMonth(), exam.getDate() - 28);
    var out = [];
    for (var i = 0; i < 4; i++) {
      var a = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i * 7);
      var b = new Date(a.getFullYear(), a.getMonth(), a.getDate() + 6);
      out.push({ start: dateKey(a), end: dateKey(b) });
    }
    return out;
  }

  function currentPlanWeek() {
    var info = examDateInfo();
    if (!info) return 0;
    var days = info.days;
    if (days < 0 || days > 28) return 0;
    return clamp(4 - Math.floor((days - 1) / 7), 1, 4);
  }

  function planDateRange(index, dates) {
    var range = dates && dates[index];
    if (!range) return "Week " + (index + 1);
    return formatDate(range.start, { day: "numeric", month: "short" }) + "–" + formatDate(range.end, { day: "numeric", month: "short" });
  }

  function planTeaser() {
    if (!PLAN.weeks || !PLAN.weeks.length) return "";
    var dates = planWeekDates();
    var current = currentPlanWeek();
    var info = examDateInfo();
    var steps = PLAN.weeks.map(function (week, index) {
      return '<a class="plan-step ' + (current === index + 1 ? "is-current" : "") + '" href="#/plan">' +
        '<span class="plan-step__no">' + pad(index + 1) + "</span>" +
        '<span class="plan-step__week">' + esc(planDateRange(index, dates)) + "</span>" +
        "<strong>" + esc(week.theme) + "</strong>" +
        "<small>" + esc(week.focus) + "</small>" +
      "</a>";
    }).join("");

    return '<section class="section">' +
      '<div class="section-head"><div><h2>The final 28 days</h2>' +
        "<p>" + (info ? esc(info.days > 0 ? info.days + " days until the exam. " : info.days === 0 ? "Exam day. " : "The date has passed — set a new one. ") : "") + "Four weeks of retrieval, simulation, and repair.</p></div>" +
        '<a class="link-arrow" href="#/plan">Open the plan ' + icon("arrow") + "</a></div>" +
      '<div class="plan-strip">' + steps + "</div>" +
    "</section>";
  }

  function viewPlan() {
    var info = examDateInfo();
    var dates = planWeekDates();
    var current = currentPlanWeek();
    var weeks = PLAN.weeks.map(function (week, index) {
      var isCurrent = current === index + 1;
      return '<article class="plan-week ' + (isCurrent ? "is-current" : "") + '">' +
        '<div class="plan-week__no">' + pad(index + 1) + "</div>" +
        '<div class="plan-week__body">' +
          '<div class="plan-week__meta"><span>' + esc(planDateRange(index, dates)) + "</span><span>" + esc(week.focus) + "</span>" +
            (isCurrent ? '<span class="chip chip--signal">This week</span>' : "") + "</div>" +
          "<h2>" + esc(week.theme) + "</h2>" +
          '<p class="plan-week__summary">' + esc(week.summary) + "</p>" +
          '<ul class="plan-week__actions">' + week.actions.map(function (action) { return "<li>" + esc(action) + "</li>"; }).join("") + "</ul>" +
          '<div class="plan-week__milestone"><span class="label">The milestone</span><p>' + esc(week.milestone) + "</p></div>" +
        "</div>" +
      "</article>";
    }).join("");

    var daily = PLAN.daily.map(function (item, index) {
      return '<article class="plan-day"><span class="plan-day__time">' + esc(item.time) + "</span>" +
        "<h3>" + esc(item.title) + "</h3><p>" + esc(item.body) + "</p></article>";
    }).join("");

    var examDay = PLAN.examDay.map(function (item) { return "<li>" + esc(item) + "</li>"; }).join("");

    var countdown = "";
    if (info) {
      countdown = '<span class="chip ' + (info.days >= 0 && info.days <= 28 ? "chip--signal" : "") + '">' +
        (info.days > 0 ? info.days + " days out" : info.days === 0 ? "Exam day" : "Date passed") + "</span>" +
        '<span class="chip">' + esc(formatDate(info.key, { day: "numeric", month: "long" })) + "</span>";
    }

    var dailyNote = info && info.days <= 0
      ? "The date has passed. Set a new exam date to restart the countdown and use the same four-week route."
      : "One deliberate hour on a weekday is enough. Weekends carry the longer sets and the mocks.";

    return {
      title: "Study plan",
      html:
        '<header class="page-head"><div class="page-head__copy">' +
          '<p class="eyebrow">Study plan · ' + (info ? (info.days > 0 ? info.days + " days out" : info.days === 0 ? "exam day" : "date passed") : "four weeks") + "</p>" +
          '<h1 class="display-l">Four weeks.<br>One attempt at a time.</h1>' +
          '<p class="lede">' + esc(PLAN.intro) + " Peace of Mind is insurance, not a plan: prepare for the first attempt as if it is the only one.</p>" +
        "</div>" +
        '<div class="page-head__aside">' + countdown + '<a class="btn btn--ghost" href="#/practice" data-start="quick">Start today’s drill ' + icon("arrow") + "</a></div></header>" +

        '<div class="plan-note"><p class="label">The shape of the four weeks</p><p>' + (info && info.days > 28
          ? "You have " + info.days + " days. Use the extra time for a first pass through the notes, then start this route 28 days before the exam."
          : "Cover the register once, then spend the rest of the time retrieving it. The mock in week three is the midpoint, not the finish line.") + "</p></div>" +

        '<section class="plan-timeline">' + weeks + "</section>" +

        '<section class="section"><div class="section-head"><div><h2>The daily hour</h2><p>Short, repeatable, and mostly retrieval.</p></div><span class="label">' + esc(dailyNote) + "</span></div>" +
        '<div class="plan-daily">' + daily + "</div></section>" +

        '<section class="section"><div class="plan-exam"><div><p class="label">Exam day · ' + esc(info ? formatDate(info.key, { day: "numeric", month: "long" }) : "your date") + '</p><h2>Protect the decisions, not the facts.</h2><p>You will not recall every term. You will recognise the role, the property, and the verb — and that is enough to eliminate three answers.</p></div>' +
        "<ul>" + examDay + "</ul></div></section>" +

        '<div class="q-actions" style="margin-top:26px"><a class="btn" href="#/mindset">Read the manager’s lens ' + icon("arrow") + "</a>" +
        '<a class="btn btn--ghost" href="#/study">Open the domain notes</a></div>'
    };
  }

  /* ------------------------------------------------------------------- study */

  function viewStudy() {
    var cards = DOMAINS.map(function (d) {
      var s = domainStats(d.id);
      return '<a class="domain-card" href="#/study/' + d.id + '">' +
        '<div class="domain-card__top"><span class="domain-card__no">Domain ' + pad(d.id) + "</span>" +
        '<span class="chip">' + d.weight + "% of exam</span></div>" +
        "<h3>" + esc(d.name) + "</h3>" +
        "<p>" + esc(d.blurb) + "</p>" +
        '<div class="domain-card__foot"><span>' + s.seen + " / " + s.total + " seen · " + (s.accuracy == null ? "no accuracy yet" : Math.round(s.accuracy * 100) + "% correct") + "</span>" +
        '<span class="domain-card__meter"><i><b style="width:' + s.mastery + '%"></b></i>' + s.mastery + "%</span></div>" +
        "</a>";
    }).join("");

    return {
      title: "Domain notes",
      html:
        '<header class="page-head"><div class="page-head__copy">' +
          '<p class="eyebrow">Field notes · ' + esc(META.outline) + "</p>" +
          '<h1 class="display-l">Eight domains, condensed<br>to what the exam actually asks.</h1>' +
          '<p class="lede">Read one domain, then drill it while the reasoning is fresh. The notes deliberately favour decisions and traps over encyclopaedic detail.</p>' +
        "</div>" +
        '<div class="page-head__aside"><a class="btn btn--ghost" href="#/mindset">Manager’s lens</a></div></header>' +
        '<h2 class="sr-only">The eight domains</h2>' +
        '<div class="domain-cards">' + cards + "</div>" +
        '<section class="section"><div class="study-cta"><div><h3>Not sure where to start?</h3><p>The diagnostic samples every domain and fills in your answer sheet.</p></div><a class="btn" href="#/practice" data-start="diagnostic">Take the diagnostic ' + icon("arrow") + "</a></div></section>"
    };
  }

  function viewDomain(id) {
    var domain = domainById(id);
    if (!domain) {
      return { title: "Domain not found", html: '<section class="empty"><h1>No such domain.</h1><p>The manual has eight domains, numbered 1 to 8.</p><a class="btn" href="#/study">Back to the notes</a></section>' };
    }
    var s = domainStats(domain.id);
    if (!localState.visits) localState.visits = {};
    localState.visits[domain.id] = Date.now();
    save();
    var sections = domain.sections.map(function (section, index) {
      var terms = (section.terms || []).map(function (term) {
        return '<div class="term"><dt>' + esc(term.t) + "</dt><dd>" + esc(term.d) + "</dd></div>";
      }).join("");
      var points = (section.points || []).map(function (point) { return "<li>" + point + "</li>"; }).join("");
      return '<section class="study-section" id="sec-' + domain.id + "-" + (index + 1) + '">' +
        '<h2><span>' + pad(index + 1) + "</span>" + esc(section.title) + "</h2>" +
        (section.lead ? '<p class="study-section__lead">' + esc(section.lead) + "</p>" : "") +
        '<ul class="study-list">' + points + "</ul>" +
        (terms ? '<dl class="term-list">' + terms + "</dl>" : "") +
        "</section>";
    }).join("");

    var nav = domain.sections.map(function (section, index) {
      return '<a href="#sec-' + domain.id + "-" + (index + 1) + '" data-scroll="sec-' + domain.id + "-" + (index + 1) + '">' + esc(section.title) + "</a>";
    }).join("");

    var traps = (domain.traps || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");

    return {
      title: pad(domain.id) + " " + domain.short,
      html:
        '<header class="page-head"><div class="page-head__copy">' +
          '<p class="eyebrow">Domain ' + pad(domain.id) + " · " + domain.weight + "% of the exam</p>" +
          '<h1 class="display-l">' + esc(domain.name) + "</h1>" +
          '<p class="lede">' + esc(domain.blurb) + "</p>" +
        "</div>" +
        '<div class="page-head__aside">' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap"><span class="chip">' + s.seen + " / " + s.total + " seen</span>" +
          '<span class="chip ' + (s.mastery >= 70 ? "chip--ok" : "") + '">' + s.mastery + "% mastery</span></div>" +
          '<a class="btn" href="#/practice" data-start="domain" data-domain="' + domain.id + '">Drill this domain ' + icon("arrow") + "</a>" +
        "</div></header>" +

        '<div class="callout"><p class="callout__label">What the exam asks</p><p>' + esc(domain.ask) + "</p></div>" +

        '<div class="study-layout">' +
          '<nav class="study-nav" aria-label="Sections in this domain"><span class="study-nav__label">On this page</span>' + nav + "</nav>" +
          '<div class="study-body">' +
            sections +
            (traps ? '<div class="callout callout--trap"><p class="callout__label">Traps that cost marks</p><ul>' + traps + "</ul></div>" : "") +
            (domain.mnemonic ? '<div class="callout callout--mnemonic"><p class="callout__label">' + esc(domain.mnemonic.label) + "</p><p>" + esc(domain.mnemonic.text) + "</p></div>" : "") +
            '<div class="study-cta"><div><h3>Drill Domain ' + pad(domain.id) + ".</h3><p>Fifteen questions, immediate explanations, and a record of what stuck.</p></div>" +
              '<a class="btn" href="#/practice" data-start="domain" data-domain="' + domain.id + '">Start the drill ' + icon("arrow") + "</a></div>" +
          "</div>" +
        "</div>",
      mount: function () { mountStudyNav(); }
    };
  }

  function mountStudyNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".study-nav a[data-scroll]"));
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute("data-scroll")); }).filter(Boolean);
    if (!links.length || !sections.length) return;

    links.forEach(function (a) {
      a.addEventListener("click", function (event) {
        event.preventDefault();
        var target = document.getElementById(a.getAttribute("data-scroll"));
        if (target) target.scrollIntoView({ behavior: motionBehavior(), block: "start" });
      });
    });

    if (!("IntersectionObserver" in window)) return;
    scrollObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("data-scroll") === entry.target.id); });
      });
    }, { rootMargin: "-88px 0px -65% 0px", threshold: 0 });
    sections.forEach(function (s) { scrollObserver.observe(s); });
  }

  /* ---------------------------------------------------------------- practice */

  function viewPractice() {
    ensureDaily();
    var stats = allStats();
    var wrong = wrongQuestions().length;
    var bookmarked = Object.keys(state.bookmarks).filter(function (id) {
      var b = state.bookmarks[id];
      return b && b.on && QID[id];
    }).length;
    var focus = weakestDomain();
    var isNew = stats.attempts === 0;
    var activeDrill = (practiceSession && !practiceSession.completed) ? practiceSession : loadPracticeState();
    var resumeDrill = activeDrill
      ? '<div class="exam-warning" style="border-color:#a9c6b4;background:var(--ok-soft)"><p style="color:#1b4a37"><strong>A drill is paused.</strong> Question ' +
        (activeDrill.index + 1) + " of " + activeDrill.items.length + " in “" + esc(activeDrill.title) + "”. " +
        '<a href="#/practice/session" style="color:#1b4a37">Resume</a> · <button type="button" data-practice-discard style="border:0;background:none;padding:0;text-decoration:underline;color:#1b4a37;font:inherit">discard</button></p></div>'
      : "";

    var modes = "";
    modes += '<a class="mode ' + (isNew ? "mode--primary" : "") + '" href="#/practice" data-start="diagnostic">' +
      '<div class="mode__top"><span class="label">Start here</span><span class="chip">20 questions</span></div>' +
      "<h3>Diagnostic</h3><p>Two or three questions from every domain. A quick, honest baseline before you choose what to study.</p>" +
      '<div class="mode__foot"><span>~ 15 minutes</span><span>Mixed</span></div></a>';

    modes += '<a class="mode ' + (isNew ? "" : "mode--primary") + '" href="#/practice" data-start="quick">' +
      '<div class="mode__top"><span class="label">Daily drill</span><span class="chip">10 questions</span></div>' +
      "<h3>Quick ten</h3><p>A short interleaved set from across the register. The best use of a coffee break.</p>" +
      '<div class="mode__foot"><span>~ 8 minutes</span><span>Mixed</span></div></a>';

    modes += '<a class="mode" href="#/practice" data-start="manager">' +
      '<div class="mode__top"><span class="label">For technical candidates</span><span class="chip">20 questions</span></div>' +
      "<h3>Manager’s cut</h3><p>Five questions each from risk, assets, assessment, and operations — the four domains technical candidates most often underweight.</p>" +
      '<div class="mode__foot"><span>~ 15 minutes</span><span>Management-weighted</span></div></a>';

    if (PACK_QUESTIONS.length) {
      modes += '<a class="mode mode--pack" href="#/practice" data-start="pack">' +
        '<div class="mode__top"><span class="label">Local pack</span><span class="chip">' + PACK_QUESTIONS.length + " questions</span></div>" +
        "<h3>Official practice</h3><p>" + esc(packMeta ? packMeta.title : "Imported question pack") + ". Single-answer items with the source answer key. Not counted toward domain readiness.</p>" +
        '<div class="mode__foot"><span>20 at a time</span><span>Local only</span></div></a>';
    }

    modes += '<a class="mode" href="#/practice" data-start="weak">' +
      '<div class="mode__top"><span class="label">Adaptive</span><span class="chip">20 questions</span></div>' +
      "<h3>Weak areas</h3><p>Weighted toward the domains and topics where your evidence is thinnest.</p>" +
      '<div class="mode__foot"><span>~ 15 minutes</span><span>Adaptive</span></div></a>';

    modes += '<a class="mode" href="#/practice" data-start="review">' +
      '<div class="mode__top"><span class="label">Repair</span><span class="chip">' + wrong + " missed</span></div>" +
      "<h3>Review mistakes</h3><p>Re-answer the questions you last got wrong. The explanation is the point; the score is a side effect.</p>" +
      '<div class="mode__foot"><span>' + (wrong ? "~ " + Math.max(1, Math.round(wrong * 0.8)) + " minutes" : "Nothing to review") + "</span><span>Your log</span></div></a>";

    if (bookmarked) {
      modes += '<a class="mode" href="#/practice" data-start="bookmarks">' +
        '<div class="mode__top"><span class="label">Saved</span><span class="chip">' + bookmarked + " saved</span></div>" +
        "<h3>Bookmarked</h3><p>The questions you flagged for a second look, in one set.</p>" +
        '<div class="mode__foot"><span>Your selection</span><span>Mixed</span></div></a>';
    }

    modes += '<a class="mode" href="#/exam">' +
      '<div class="mode__top"><span class="label">Simulation</span><span class="chip">125 questions</span></div>' +
      "<h3>Mock exam</h3><p>Four hours, official domain weights, and a results page that tells you where the marks leaked.</p>" +
      '<div class="mode__foot"><span>3 hours</span><span>Fixed form</span></div></a>';

    var picker = DOMAINS.map(function (d) {
      return '<button type="button" data-start="domain" data-domain="' + d.id + '">' + pad(d.id) + " · " + esc(d.short) + "</button>";
    }).join("");

    var packPanel;
    if (PACK_QUESTIONS.length) {
      packPanel = '<div class="section-head"><div><h2>Local question pack</h2><p>Imported from your own file. It stays in this browser and is not uploaded.</p></div>' +
        '<span class="label">' + PACK_QUESTIONS.length + " questions</span></div>" +
        '<div class="pack-card"><div><p class="label">Loaded · local only</p><h3>' + esc(packMeta ? packMeta.title : "Imported pack") + "</h3>" +
        "<p>" + esc(packMeta && packMeta.source ? packMeta.source : "Answer key supplied by the imported file.") + "</p></div>" +
        '<div class="q-actions"><a class="btn btn--small" href="#/practice" data-start="pack">Start 20</a>' +
        '<a class="btn btn--ghost btn--small" href="#/practice" data-start="packFull">125-question set</a>' +
        '<button type="button" class="btn btn--ghost btn--small" data-pack-remove>Remove</button></div></div>' +
        (function () {
          var buttons = DOMAINS.map(function (d) {
            var count = PACK_QUESTIONS.filter(function (q) { return q.d === d.id; }).length;
            if (!count) return "";
            return '<button type="button" data-start="packDomain" data-domain="' + d.id + '">' + pad(d.id) + " · " + esc(d.short) + " · " + count + "</button>";
          }).join("");
          return buttons ? '<div class="pack-domains"><p class="label">Official domain drills</p><div class="domain-picker">' + buttons + "</div></div>" : "";
        })();
    } else {
      packPanel = '<div class="section-head"><div><h2>Local question pack</h2><p>Load a JSON pack built from your own book. The questions stay in this browser; nothing is committed or uploaded.</p></div></div>' +
        '<div class="empty pack-empty"><h3>No local pack loaded</h3><p>The core bank remains the original 160-question practice set. A local pack is optional and separate from domain readiness.</p>' +
        '<button type="button" class="btn" data-pack-import>Load question pack</button></div>';
    }

    return {
      title: "Practice",
      html:
        '<header class="page-head"><div class="page-head__copy">' +
          '<p class="eyebrow">Active recall</p>' +
          '<h1 class="display-l">Practice is where<br>the reading becomes judgment.</h1>' +
          '<p class="lede">' + (PACK_QUESTIONS.length ? "The core bank is original. The loaded pack is your local source, kept separate from domain readiness." : "Every question is original, scenario-based, and followed by the reasoning a manager would use. Wrong answers are data, not verdicts.") + "</p>" +
        "</div>" +
        '<div class="page-head__aside"><span class="chip">' + stats.attempts + " answered</span>" +
        '<span class="chip ' + (stats.accuracy != null && stats.accuracy >= 0.7 ? "chip--ok" : "") + '">' + (stats.accuracy == null ? "No accuracy yet" : pct(stats.accuracy) + " correct") + "</span></div></header>" +

        resumeDrill +
        '<h2 class="sr-only">Practice modes</h2>' +
        '<div class="mode-grid">' + modes + "</div>" +

        '<section class="section"><div class="section-head"><div><h2>Drill one domain</h2><p>Fifteen questions from a single domain, in a random order.</p></div>' +
        '<span class="label">Weakest: ' + pad(focus.id) + " · " + esc(focus.short) + "</span></div>" +
        '<div class="domain-picker">' + picker + "</div></section>" +

        '<div class="callout" style="margin-top:18px"><p class="callout__label">How close is this bank?</p><p>The core bank is original, written to the outline. It is deliberately shorter and more direct than the real CAT. Use it for daily retrieval and explanation practice; use the official practice tests for your score benchmark.</p></div>' +

        '<section class="section">' + packPanel + "</section>" +
        '<input type="file" id="pack-import" accept=".json,application/json" hidden>' +

        '<section class="section"><div class="split"><div class="callout" style="margin:0"><p class="callout__label">How to review a miss</p><p>Name the property under attack, the role in the question, and the operative verb. If the explanation surprises you, bookmark the question and revisit it in three days — not in three minutes.</p></div>' +
        '<div class="callout callout--mnemonic" style="margin:0"><p class="callout__label">Estimated readiness</p><p>' + (readiness() == null ? "Answer at least eight questions and your answer sheet will start to fill." : readiness() + " / 100 — " + readinessLabel(readiness()) + ". This is a practice estimate, not an ISC2 score.") + "</p></div></div></section>"
    };
  }

  function makePractice(kind, domainId) {
    var pool = [];
    var title = "Practice";
    var kicker = "Mixed drill";

    if (kind === "diagnostic") {
      var perDomain = { 1: 3, 2: 2, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 2 };
      DOMAINS.forEach(function (d) {
        pool = pool.concat(pickQuestions(questionsFor(d.id), perDomain[d.id] || 2));
      });
      title = "Diagnostic";
      kicker = "Baseline · every domain";
    } else if (kind === "quick") {
      pool = pickQuestions(QUESTIONS, 10);
      title = "Quick ten";
      kicker = "Daily drill";
    } else if (kind === "domain") {
      var domain = domainById(domainId);
      if (!domain) return null;
      pool = pickQuestions(questionsFor(domain.id), 15);
      title = "Domain " + pad(domain.id);
      kicker = domain.name;
    } else if (kind === "pack" || kind === "packFull" || kind === "packDomain") {
      if (!PACK_QUESTIONS.length) return null;
      if (kind === "packDomain") {
        var packDomain = Number(domainId);
        if (!packDomain || !PACK_QUESTIONS.some(function (q) { return q.d === packDomain; })) return null;
        pool = pickPack(20, packDomain);
        title = "Official pack · Domain " + pad(packDomain);
        kicker = domainName(packDomain) + " · official domain questions";
      } else {
        pool = kind === "packFull" ? pickPack(125) : pickPack(20);
        title = kind === "packFull" ? "Official pack · 125" : "Official pack";
        kicker = packMeta ? packMeta.title : "Imported pack";
      }
    } else if (kind === "manager") {
      [1, 2, 6, 7].forEach(function (domainId) {
        pool = pool.concat(pickQuestions(questionsFor(domainId), 5));
      });
      pool = shuffle(pool);
      title = "Manager’s cut";
      kicker = "Risk · assets · assessment · operations";
    } else if (kind === "weak") {
      var weighted = [];
      DOMAINS.forEach(function (d) {
        var mastery = domainStats(d.id).mastery;
        var gap = Math.max(4, 100 - mastery);
        var qs = shuffle(questionsFor(d.id));
        qs.forEach(function (q, i) {
          var a = state.attempts[q.id];
          var weight = gap * (a && a.lastResult === false ? 2.2 : 1);
          for (var n = 0; n < Math.ceil(weight / 12); n++) weighted.push(q);
          if (i > 8) return;
        });
      });
      pool = [];
      var used = {};
      shuffle(weighted).forEach(function (q) {
        if (pool.length < 20 && !used[q.id]) { used[q.id] = true; pool.push(q); }
      });
      title = "Weak areas";
      kicker = "Adaptive set";
    } else if (kind === "review") {
      pool = shuffle(wrongQuestions()).slice(0, 20);
      title = "Review mistakes";
      kicker = "Your question log";
    } else if (kind === "bookmarks") {
      pool = shuffle(Object.keys(state.bookmarks).filter(function (id) {
        var b = state.bookmarks[id];
        return b && b.on && QID[id];
      }).map(function (id) { return QID[id]; })).slice(0, 20);
      title = "Bookmarked";
      kicker = "Saved questions";
    }

    pool = shuffle(pool);
    if (!pool.length) {
      toast(kind === "review" ? "Nothing to review yet. Answer a few questions first." : "That set is empty. Try another mode.");
      return null;
    }

    return {
      kind: kind,
      domainId: domainId ? Number(domainId) : null,
      title: title,
      kicker: kicker,
      items: pool.map(function (q) { return { q: q, picked: null, submitted: false, correct: null }; }),
      index: 0,
      startedAt: Date.now(),
      completed: false,
      correct: 0
    };
  }

  function startPractice(kind, domainId) {
    var session = makePractice(kind, domainId);
    if (!session) return;
    practiceSession = session;
    lastPracticeSummary = null;
    savePracticeState();
    if (location.hash !== "#/practice/session") location.hash = "#/practice/session";
    else render();
  }

  function practiceItem() {
    return practiceSession ? practiceSession.items[practiceSession.index] : null;
  }

  function savePracticeState() {
    try {
      if (!practiceSession || practiceSession.completed) {
        localStorage.removeItem(ACTIVE_PRACTICE_KEY);
        return;
      }
      localStorage.setItem(ACTIVE_PRACTICE_KEY, JSON.stringify({
        v: 1,
        kind: practiceSession.kind,
        domainId: practiceSession.domainId,
        title: practiceSession.title,
        kicker: practiceSession.kicker,
        index: practiceSession.index,
        startedAt: practiceSession.startedAt,
        correct: practiceSession.correct,
        items: practiceSession.items.map(function (item) {
          return { id: item.q.id, picked: item.picked, submitted: item.submitted, correct: item.correct };
        })
      }));
    } catch (err) { /* storage may be unavailable; the session still works in memory */ }
  }

  function clearPracticeState() {
    try { localStorage.removeItem(ACTIVE_PRACTICE_KEY); } catch (err) { /* ignore */ }
  }

  function loadPracticeState() {
    try {
      var raw = localStorage.getItem(ACTIVE_PRACTICE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || data.v !== 1 || !Array.isArray(data.items) || !data.items.length) return null;
      var items = [];
      for (var i = 0; i < data.items.length; i++) {
        var rawItem = data.items[i];
        var q = rawItem && findQuestion(rawItem.id);
        if (!q) return null;
        var picked = typeof rawItem.picked === "number" && rawItem.picked >= 0 && rawItem.picked < 4 ? rawItem.picked : null;
        items.push({ q: q, picked: picked, submitted: !!rawItem.submitted, correct: !!rawItem.correct });
      }
      var index = clamp(Number(data.index) || 0, 0, items.length - 1);
      return {
        kind: data.kind || "quick",
        domainId: data.domainId || null,
        title: data.title || "Practice drill",
        kicker: data.kicker || "Resumed drill",
        items: items,
        index: index,
        startedAt: Number(data.startedAt) || Date.now(),
        completed: false,
        correct: items.filter(function (item) { return item.submitted && item.correct; }).length
      };
    } catch (err) {
      return null;
    }
  }

  function viewPracticeSession() {
    if (!practiceSession) {
      var resumed = loadPracticeState();
      if (resumed) {
        practiceSession = resumed;
        toast("Your drill resumed.");
      }
    }
    if (!practiceSession) {
      return {
        title: "Practice",
        html: '<section class="empty"><h1>No drill is open.</h1><p>Choose a mode and the first question will appear here.</p><a class="btn" href="#/practice">Choose a drill</a></section>'
      };
    }
    var item = practiceItem();
    if (!item) {
      practiceSession = null;
      clearPracticeState();
      return {
        title: "Practice",
        html: '<section class="empty"><h1>That drill has ended.</h1><p>Open the summary to see what stuck.</p><a class="btn" href="#/practice">Choose another drill</a></section>'
      };
    }
    return { title: practiceSession.title + " · Drill", html: practiceHTML(), mount: function () { bindPracticeKeys(); } };
  }

  function practiceHTML() {
    var s = practiceSession;
    var item = practiceItem();
    var q = item.q;
    var selected = item.picked;
    var submitted = item.submitted;

    var dots = s.items.map(function (it, i) {
      var cls = it.submitted ? (it.correct ? "is-done" : "is-wrong") : "";
      if (i === s.index) cls += " is-current";
      return '<span class="' + cls + '"></span>';
    }).join("");

    var options = q.options.map(function (text, i) {
      var cls = "option";
      if (selected === i) cls += " is-selected";
      if (submitted) {
        if (i === q.answer) cls += " is-correct";
        else if (i === selected) cls += " is-incorrect";
        else cls += " is-muted";
      }
      var why = "";
      if (submitted && q.why && q.why[i]) why = '<span class="option__why">' + esc(q.why[i]) + "</span>";
      return '<button type="button" class="' + cls + '" data-option="' + i + '"' + (submitted ? " disabled" : "") + ">" +
        '<span class="option__letter">' + "ABCD"[i] + "</span>" +
        '<span class="option__body">' + esc(text) + why + "</span>" +
        "</button>";
    }).join("");

    var progress = Math.round(((s.index + (submitted ? 1 : 0)) / s.items.length) * 100);
    var bookmarkInfo = state.bookmarks[q.id];
    var bookmarked = !!(bookmarkInfo && bookmarkInfo.on);
    var last = s.index === s.items.length - 1;

    var verdict = "";
    var explanation = "";
    if (submitted) {
      verdict = '<div class="verdict-row" role="status" aria-live="polite">' +
        '<span class="stamp ' + (item.correct ? "" : "stamp--bad") + '">' + (item.correct ? icon("check") + "Correct" : icon("x") + "Not yet") + "</span>" +
        '<span class="verdict-note">' + (item.correct ? "One more piece of evidence. Move on." : "The best answer is " + "ABCD"[q.answer] + ". Read the lens before the next one.") + "</span>" +
      "</div>";
      explanation = '<div class="explain">' +
        '<h2 class="explain__heading">Why</h2><p>' + esc(q.whyText || q.explain || "") + "</p>" +
        (q.lens ? '<div class="lens"><p class="lens__label">' + icon("compass") + "Manager’s lens</p><p>" + esc(q.lens) + "</p></div>" : "") +
      "</div>";
    }

    return '<div class="session">' +
      '<div class="session__main">' +
        '<div class="q-head">' +
          '<span class="q-head__no">Question <strong>' + pad(s.index + 1) + "</strong> / " + pad(s.items.length) + "</span>" +
          '<span class="chip">' + (q.pack ? (q.d ? "Domain " + pad(q.d) : "Official pack") : "Domain " + pad(q.d)) + "</span>" +
          '<span class="chip chip--blue">' + esc(q.topic || "Scenario") + "</span>" +
          (q.diff === 3 ? '<span class="chip chip--signal">Hard</span>' : "") +
          (q.pack ? "" : '<button type="button" class="flag-button" data-bookmark aria-pressed="' + bookmarked + '" style="margin-left:auto">' +
            icon(bookmarked ? "bookmarkFill" : "bookmark") + (bookmarked ? "Saved" : "Save") + "</button>") +
        "</div>" +
        '<h1 class="q-stem">' + esc(q.stem) + "</h1>" +
        '<div class="options" role="group" aria-label="Answer choices">' + options + "</div>" +
        verdict +
        '<div class="q-actions">' +
          (submitted
            ? '<button type="button" class="btn" data-next>' + (last ? "See results" : "Next question") + " " + icon("arrow") + "</button>" +
              '<span class="q-actions__spacer"></span><span class="kbd-hint"><span class="kbd">Enter</span> next · <span class="kbd">B</span> save</span>'
            : '<button type="button" class="btn" data-submit' + (selected == null ? " disabled" : "") + ">Submit answer " + icon("check") + "</button>" +
              '<span class="q-actions__spacer"></span><span class="kbd-hint"><span class="kbd">1–4</span> select · <span class="kbd">Enter</span> submit</span>') +
        "</div>" +
        explanation +
        '<div class="session-foot"><span class="label">' + esc(s.kicker) + "</span><a class=\"label\" href=\"#/practice\" data-quit style=\"text-decoration:none\">Exit drill →</a></div>" +
      "</div>" +
      '<aside class="session__rail" aria-label="Drill progress">' +
        '<div class="rail-box"><div class="rail-box__head"><span>Progress</span><span>' + progress + "%</span></div>" +
          '<div class="rail-box__big">' + s.correct + ' <small>correct</small></div>' +
          '<p>' + s.items.filter(function (it) { return it.submitted; }).length + " of " + s.items.length + " answered</p>" +
          '<div class="rail-track"><i style="width:' + progress + '%"></i></div>' +
          '<div class="dot-grid" aria-hidden="true">' + dots + "</div>" +
        "</div>" +
        '<div class="rail-box"><div class="rail-box__head"><span>Keep in mind</span></div>' +
          "<p style=\"margin-top:8px;font-size:11.5px;color:var(--ink-2)\"><strong>Answer the question asked.</strong> FIRST is not BEST. The most technical option is often a distractor.</p>" +
          '<a class="link-arrow" href="#/mindset" style="margin-top:12px;font-size:8.5px">Manager’s lens ' + icon("arrow") + "</a>" +
        "</div>" +
      "</aside>" +
    "</div>";
  }

  function repaintPractice() {
    if (!practiceSession) return;
    view.innerHTML = practiceHTML();
  }

  function submitPracticeAnswer() {
    var item = practiceItem();
    if (!item || item.submitted || item.picked == null) return;
    var q = item.q;
    item.submitted = true;
    item.correct = item.picked === q.answer;
    if (item.correct) practiceSession.correct += 1;
    recordAnswer(q, item.correct);
    save();
    savePracticeState();
    repaintPractice();
    focusSoon("[data-next]");
    var feedback = document.querySelector(".verdict-row");
    if (feedback) {
      var box = feedback.getBoundingClientRect();
      if (box.bottom > window.innerHeight - 76 || box.top < 70) {
        feedback.scrollIntoView({ block: "center", behavior: motionBehavior() });
      }
    }
  }

  function recordAnswer(q, correct, persist) {
    var a = localState.attempts[q.id] || { c: 0, w: 0, last: 0, box: 0 };
    if (correct) { a.c = (a.c || 0) + 1; a.box = Math.min(4, (a.box || 0) + 1); }
    else { a.w = (a.w || 0) + 1; a.box = 0; }
    a.last = Date.now();
    a.lastResult = !!correct;
    localState.attempts[q.id] = a;
    if (q.pack) { packSeen[q.id] = Date.now(); savePackSeen(); }
    logActivity("answer", !!correct);
    if (persist !== false) save();
  }

  function finishPractice() {
    if (!practiceSession) return;
    ensureDaily();
    if (practiceSession.kind === "review") localState.daily.review = true;
    else localState.daily.drill = true;
    practiceSession.completed = true;
    var items = practiceSession.items;
    var byDomain = {};
    items.forEach(function (it) {
      if (!byDomain[it.q.d]) byDomain[it.q.d] = { total: 0, correct: 0 };
      byDomain[it.q.d].total += 1;
      if (it.correct) byDomain[it.q.d].correct += 1;
    });
    lastPracticeSummary = {
      title: practiceSession.title,
      kind: practiceSession.kind,
      domainId: practiceSession.domainId,
      total: items.length,
      correct: practiceSession.correct,
      startedAt: practiceSession.startedAt,
      finishedAt: Date.now(),
      byDomain: byDomain,
      pack: items.some(function (it) { return !!it.q.pack; }),
      missed: items.filter(function (it) { return !it.correct; }).map(function (it) { return { id: it.q.id, picked: it.picked }; })
    };
    localState.lastSummary = lastPracticeSummary;
    save();
    clearPracticeState();
    location.hash = "#/practice/summary";
  }

  function viewPracticeSummary() {
    var summary = lastPracticeSummary || state.lastSummary;
    if (!summary) {
      return {
        title: "Session summary",
        html: '<section class="empty"><h1>No summary to show.</h1><p>Finish a drill and the results will appear here.</p><a class="btn" href="#/practice">Start a drill</a></section>'
      };
    }
    var accuracy = summary.total ? summary.correct / summary.total : 0;
    var domainRows = Object.keys(summary.byDomain).map(function (id) {
      var row = summary.byDomain[id];
      var p = row.total ? row.correct / row.total : 0;
      return "<tr><td>" + (id == 0 ? "Official pack" : pad(id) + " · " + esc(domainShort(id))) + "</td>" +
        '<td class="num">' + row.correct + " / " + row.total + "</td>" +
        '<td class="bar-cell"><div class="bar-cell__track"><i style="width:' + Math.round(p * 100) + '%"></i><span>' + Math.round(p * 100) + "%</span></div></td></tr>";
    }).join("");

    var missed = summary.missed.map(function (entry) {
      var id = entry.id;
      var picked = entry.picked;
      var q = findQuestion(id);
      if (!q) return "";
      return '<details class="review-item"><summary>' +
        '<span class="review-item__no">' + (picked == null ? "—" : "ABCD"[picked]) + "</span>" +
        '<span class="review-item__stem">' + esc(q.stem) + "</span>" +
        '<span class="review-item__tag">' + (q.d ? "Domain " + pad(q.d) : "Official pack") + "</span>" +
        '</summary><div class="review-item__body">' +
          '<p class="review-item__answer">Best answer: ' + "ABCD"[q.answer] + ". " + esc(q.options[q.answer]) + "</p>" +
          '<p class="review-item__answer is-wrong">You chose: ' + (picked == null ? "No answer" : "ABCD"[picked] + ". " + esc(q.options[picked])) + "</p>" +
          "<p>" + esc(q.whyText || q.explain || "") + "</p>" +
          (q.lens ? '<p style="border-left:2px solid var(--signal);padding-left:12px;color:var(--ink-3)"><strong>Lens:</strong> ' + esc(q.lens) + "</p>" : "") +
        "</div></details>";
    }).join("");

    return {
      title: "Session summary",
      html:
        '<header class="page-head"><div class="page-head__copy"><p class="eyebrow">Drill complete</p>' +
          '<h1 class="display-l">' + esc(summary.title) + " · " + esc(pct(accuracy)) + "</h1>" +
          '<p class="lede">' + summary.correct + " correct out of " + summary.total + ". " + (summary.missed.length ? "Read the misses once, then move on — repetition is for tomorrow." : "Clean sweep. The next set should be harder.") + "</p></div>" +
          '<div class="page-head__aside"><a class="btn btn--ghost" href="#/practice">Another drill</a></div></header>' +

        '<div class="score-band">' +
          '<div class="score-band__score"><strong>' + summary.correct + "<small>/" + summary.total + "</small></strong><span>correct this session</span></div>" +
          '<div class="score-band__copy"><h2>' + (accuracy >= 0.8 ? "This is exam-level." : accuracy >= 0.6 ? "Close. The reasoning needs one more pass." : "Slow down. Read the role and the verb.") + "</h2>" +
          "<p>" + (summary.pack ? "These official pack results are separate from domain readiness. Use them to calibrate the source, not to inflate the answer sheet." : "Your answer sheet has been updated. Accuracy is only half the signal — coverage tells you whether the sample was fair.") + "</p></div>" +
        "</div>" +

        '<section><div class="section-head"><div><h2>' + (summary.pack && !summary.domainId ? "By section" : "By domain") + '</h2><p>Where the marks came from.</p></div></div>' +
        '<table class="summary-table"><thead><tr><th scope="col">Domain</th><th scope="col">Score</th><th scope="col">Rate</th></tr></thead><tbody>' + domainRows + "</tbody></table></section>" +

        (summary.missed.length
          ? '<section class="section"><div class="section-head"><div><h2>What to repair</h2><p>' + plural(summary.missed.length, "question") + " to revisit.</p></div>" +
            '<span class="label">Explanations inside</span></div><div class="review-list">' + missed + "</div></section>"
          : "") +

        '<div class="q-actions" style="margin-top:28px">' +
        (summary.pack ? '<a class="btn" href="#/practice" data-start="pack">Another 20 from the pack ' + icon("arrow") + "</a>" : '<a class="btn" href="#/practice" data-start="weak">Drill weak areas ' + icon("arrow") + "</a>") +
        '<a class="btn btn--ghost" href="#/practice">Choose another mode</a></div>'
    };
  }

  /* -------------------------------------------------------------- flashcards */

  function viewFlashcards() {
    var due = dueCards().length;
    var totalSeen = Object.keys(state.cards).length;
    var rows = DOMAINS.map(function (d) {
      var cards = CARDS.filter(function (c) { return c.d === d.id; });
      var dueCount = dueCards(d.id).length;
      var seen = cards.filter(function (c) { return state.cards[c.id]; }).length;
      return '<a class="deck-row" href="#/flashcards/session" data-cards-start="domain" data-domain="' + d.id + '">' +
        '<span class="deck-row__no">' + pad(d.id) + "</span>" +
        "<div><h3>" + esc(d.short) + "</h3><p>" + esc(d.name) + "</p></div>" +
        '<span class="deck-row__count">' + dueCount + " due<small>" + seen + " / " + cards.length + " seen</small></span>" +
        '<span class="deck-row__meter"><i style="width:' + (cards.length ? Math.round((seen / cards.length) * 100) : 0) + '%"></i></span>' +
        "</a>";
    }).join("");

    return {
      title: "Flashcards",
      html:
        '<header class="page-head"><div class="page-head__copy">' +
          '<p class="eyebrow">Spaced recall</p>' +
          '<h1 class="display-l">Terms you should be able<br>to define without hesitating.</h1>' +
          '<p class="lede">' + (due ? due + " cards are due. Each session samples up to 24 so the queue stays honest rather than endless." : "No cards are due. You can review ahead, or come back tomorrow.") + " Grade honestly: <em>Again</em> if the definition was not on the tip of your tongue, <em>Got it</em> if it was.</p>" +
        "</div>" +
        '<div class="page-head__aside"><span class="chip">' + totalSeen + " / " + CARDS.length + " seen</span>" +
        '<a class="btn" href="#/flashcards/session" data-cards-start="due">' + (due ? "Review " + Math.min(due, 24) + " cards " : "Review all cards ") + icon("arrow") + "</a></div></header>" +

        '<h2 class="sr-only">Decks</h2>' +
        '<div class="deck-list">' + rows + "</div>" +

        '<section class="section"><div class="split">' +
          '<div class="callout" style="margin:0"><p class="callout__label">Why definitions matter</p><p>CISSP questions rarely ask for a definition. They use the term precisely and expect you to notice the difference: threat versus vulnerability, RTO versus RPO, clearing versus purging.</p></div>' +
          '<div class="callout callout--mnemonic" style="margin:0"><p class="callout__label">Scheduling</p><p>Cards you get right return after 1, 3, 7, 21, then 45 days. Cards you miss return tomorrow. The queue is stored in this browser.</p></div>' +
        "</div></section>"
    };
  }

  function startCards(domainId, mode) {
    var pool;
    if (mode === "domain" && domainId) {
      pool = dueCards(domainId);
      if (!pool.length) pool = CARDS.filter(function (c) { return c.d === Number(domainId); });
    } else if (mode === "all") {
      pool = CARDS.slice();
    } else {
      pool = dueCards();
      if (!pool.length) pool = CARDS.slice();
    }
    pool = shuffle(pool).slice(0, 24);
    if (!pool.length) { toast("No cards in that deck."); return; }
    cardSession = {
      queue: pool,
      index: 0,
      flipped: false,
      again: 0,
      good: 0,
      startedAt: Date.now()
    };
    if (location.hash !== "#/flashcards/session") location.hash = "#/flashcards/session";
    else render();
  }

  function currentCard() {
    return cardSession ? cardSession.queue[cardSession.index] : null;
  }

  function viewCardsSession() {
    if (!cardSession) {
      return {
        title: "Flashcards",
        html: '<section class="empty"><h1>No card session is open.</h1><p>Pick a deck and the first card will appear here.</p><a class="btn" href="#/flashcards">Choose a deck</a></section>'
      };
    }
    return { title: "Card review", html: cardsHTML(), mount: function () { bindCardKeys(); } };
  }

  function cardsHTML() {
    var s = cardSession;
    var card = currentCard();

    if (!card) {
      var total = s.again + s.good;
      return '<h1 class="sr-only">Flashcard review</h1>' +
        '<div class="card-stage">' +
        '<div class="score-band" style="width:100%;max-width:720px"><div class="score-band__score"><strong>' + s.good + "<small>/" + total + "</small></strong><span>recalled</span></div>" +
        '<div class="score-band__copy"><h2>Deck complete.</h2><p>' + (s.again ? s.again + " cards went back to tomorrow. That is the system working, not failing." : "Every card was recalled. The intervals will stretch.") + "</p></div></div>" +
        '<div class="card-controls"><a class="btn btn--ghost" href="#/flashcards">Back to decks</a><a class="btn" href="#/flashcards/session" data-restart-cards>Review again ' + icon("refresh") + "</a></div>" +
        "</div>";
    }

    var domain = domainById(card.d);
    var progress = Math.round((s.index / s.queue.length) * 100);
    var stateInfo = state.cards[card.id];
    var box = stateInfo ? stateInfo.box || 0 : 0;
    var isNew = !stateInfo;
    var cardLabel = s.flipped
      ? "Term: " + card.term + ". Definition: " + card.definition + ". Press to hide."
      : "Term: " + card.term + ". Press to reveal the definition.";

    return '<h1 class="sr-only">Flashcard review</h1>' +
      '<div class="card-stage">' +
      '<div class="card-meta"><span class="card-meta__count">Card ' + pad(s.index + 1) + " of " + pad(s.queue.length) + "</span>" +
        '<span class="chip">Domain ' + pad(card.d) + " · " + esc(domain ? domain.short : "") + "</span>" +
        '<span class="card-meta__count">' + (isNew ? "New" : "Box " + box) + "</span></div>" +
      '<div class="deck-progress"><i style="width:' + progress + '%"></i></div>' +
      '<button type="button" class="flashcard ' + (s.flipped ? "is-flipped" : "") + '" data-flip aria-label="' + esc(cardLabel) + '">' +
        '<span class="flashcard__inner">' +
          '<span class="flashcard__face flashcard__face--front" aria-hidden="' + (s.flipped ? "true" : "false") + '">' +
            '<span class="flashcard__label">Term · ' + esc(card.topic || "Key concept") + "</span>" +
            '<span class="flashcard__term">' + esc(card.term) + "</span>" +
            '<span class="flashcard__foot"><span>Tap, click, or press Space to reveal</span><span>' + esc(domain ? domain.name : "") + "</span></span>" +
          "</span>" +
          '<span class="flashcard__face flashcard__face--back" aria-hidden="' + (s.flipped ? "false" : "true") + '">' +
            '<span class="flashcard__label">Definition</span>' +
            '<span class="flashcard__def">' + esc(card.definition) + "</span>" +
            (card.hint ? '<span class="flashcard__hint">' + esc(card.hint) + "</span>" : "") +
            '<span class="flashcard__foot"><span>Tap or press Space to return</span><span>' + esc(card.term) + "</span></span>" +
          "</span>" +
        "</span>" +
      "</button>" +
      '<div class="card-controls">' +
        '<button type="button" class="btn btn--again" data-grade="again"' + (s.flipped ? "" : " disabled") + '>Again <span class="kbd">1</span></button>' +
        '<button type="button" class="btn btn--good" data-grade="good"' + (s.flipped ? "" : " disabled") + '>Got it <span class="kbd">2</span></button>' +
      "</div>" +
      '<div class="session-foot" style="width:100%;max-width:720px"><span class="label">Again ' + s.again + " · Got it " + s.good + '</span><a class="label" href="#/flashcards" style="text-decoration:none">Exit cards →</a></div>' +
    "</div>";
  }

  function repaintCards() {
    if (!cardSession) return;
    view.innerHTML = cardsHTML();
  }

  function gradeCard(grade) {
    if (!cardSession) return;
    var card = currentCard();
    if (!card) return;
    if (!cardSession.flipped) { toast("Reveal the definition before grading."); return; }
    var today = todayKey();
    var localInfo = localState.cards[card.id] || { box: 0, due: today, seen: 0, lapses: 0, last: 0 };
    var mergedInfo = state.cards[card.id] || localInfo;
    var info = {
      box: mergedInfo.box || 0,
      due: mergedInfo.due || today,
      seen: localInfo.seen || 0,
      lapses: localInfo.lapses || 0,
      last: localInfo.last || 0
    };
    info.seen = (info.seen || 0) + 1;
    info.last = Date.now();
    if (grade === "good") {
      info.box = Math.min(4, (info.box || 0) + 1);
      var intervals = [1, 3, 7, 21, 45];
      info.due = addDaysKey(intervals[info.box - 1] || 45);
      cardSession.good += 1;
    } else {
      info.box = 0;
      info.lapses = (info.lapses || 0) + 1;
      info.due = addDaysKey(1);
      cardSession.again += 1;
    }
    localState.cards[card.id] = info;
    logActivity("card");
    ensureDaily();
    localState.daily.cards = true;
    save();
    cardSession.index += 1;
    cardSession.flipped = false;
    repaintCards();
    focusSoon(".flashcard");
  }

  function bindCardKeys() {
    /* Key handling is global; this is kept as a mount hook. */
  }

  /* -------------------------------------------------------------------- exam */

  function buildExam() {
    var plan = [20, 13, 16, 16, 16, 15, 16, 13];
    var picked = [];
    DOMAINS.forEach(function (d, i) {
      var qs = questionsFor(d.id);
      var unseen = shuffle(qs.filter(function (q) { return !state.attempts[q.id]; }));
      var seen = shuffle(qs.filter(function (q) { return state.attempts[q.id]; }));
      picked = picked.concat(unseen.concat(seen).slice(0, plan[i] || 12));
    });
    if (picked.length < META.examQuestions) {
      var used = {};
      picked.forEach(function (q) { used[q.id] = true; });
      var extras = shuffle(QUESTIONS).filter(function (q) { return !used[q.id]; });
      picked = picked.concat(extras.slice(0, META.examQuestions - picked.length));
    }
    return shuffle(picked).slice(0, META.examQuestions);
  }

  function startExam(source) {
    source = source === "pack" ? "pack" : "core";
    var strictEl = document.getElementById("strict-mode");
    var strict = !!(strictEl && strictEl.checked);
    var active = peekActiveExam();
    if (active) {
      var dialog = openDialog({
        title: "Start a new attempt?",
        body: "<p>A mock exam is already in progress at question " + (active.index + 1) + " of " + active.questions.length + ", with " + formatClock((active.endsAt - Date.now()) / 1000) + " remaining.</p><p>Starting a new attempt discards the paused one and its timer. Your recorded answers stay in the question log.</p>",
        actions: '<button type="button" class="btn btn--ghost btn--small" data-close>Keep the paused exam</button><button type="button" class="btn btn--signal btn--small" data-confirm-new>Discard and start</button>'
      });
      dialog.querySelector("[data-confirm-new]").addEventListener("click", function () {
        dialog.close();
        examSession = null;
        clearActiveExam();
        launchExam(strict, source);
      });
      return;
    }
    launchExam(strict, source);
  }

  function launchExam(strict, source) {
    var isPack = source === "pack";
    var qs = isPack ? pickPack(META.examQuestions) : buildExam();
    if (qs.length < META.examQuestions) {
      toast(isPack ? "The local pack needs at least " + META.examQuestions + " questions for a mock." : "The question bank is still being written. Only " + qs.length + " questions are available.");
      return;
    }
    examSession = {
      questions: qs.map(function (q) { return q.id; }),
      answers: {},
      flags: {},
      index: 0,
      startedAt: Date.now(),
      endsAt: Date.now() + (META.examMinutes || 180) * 60000,
      submitted: false,
      strict: !!strict,
      pack: isPack,
      source: isPack ? "pack" : "core"
    };
    saveActiveExam();
    if (location.hash !== "#/exam/run") location.hash = "#/exam/run";
    else render();
  }

  function saveActiveExam() {
    try {
      if (examSession && !examSession.submitted) localStorage.setItem(ACTIVE_EXAM_KEY, JSON.stringify(examSession));
      else localStorage.removeItem(ACTIVE_EXAM_KEY);
    } catch (err) { /* ignore */ }
  }

  function loadActiveExam() {
    if (examSession && !examSession.submitted) return examSession;
    try {
      var raw = localStorage.getItem(ACTIVE_EXAM_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.questions)) return null;
      if (parsed.endsAt <= Date.now()) {
        var expired = parsed;
        expired.submitted = false;
        examSession = expired;
        submitExam(true);
        return null;
      }
      examSession = parsed;
      return examSession;
    } catch (err) {
      return null;
    }
  }

  function clearActiveExam() {
    try { localStorage.removeItem(ACTIVE_EXAM_KEY); } catch (err) { /* ignore */ }
  }

  function examRemaining() {
    if (!examSession) return 0;
    return Math.max(0, examSession.endsAt - Date.now());
  }

  function viewExam() {
    var active = loadActiveExam();
    var last = state.exams.length ? state.exams[state.exams.length - 1] : null;
    var resume = "";
    if (active) {
      resume = '<div class="exam-warning" style="border-color:#a9c6b4;background:var(--ok-soft)"><p style="color:#1b4a37"><strong>A mock exam is in progress.</strong> ' +
        "Question " + (active.index + 1) + " of " + active.questions.length + ", " + formatClock(examRemaining() / 1000) + " remaining. " +
        '<a href="#/exam/run" style="color:#1b4a37">Resume now</a> · <button type="button" data-exam-discard style="border:0;background:none;padding:0;text-decoration:underline;color:#1b4a37;font:inherit">discard</button></p></div>';
    }

    var weights = DOMAINS.map(function (d) {
      return "<tr><td>" + pad(d.id) + " · " + esc(d.short) + '<span class="wbar" style="width:' + (d.weight * 2) + 'px"></span></td><td>' + d.weight + "%</td></tr>";
    }).join("");

    return {
      title: "Mock exam",
      html:
        '<header class="page-head"><div class="page-head__copy">' +
          '<p class="eyebrow">Simulation · 3 hours</p>' +
          '<h1 class="display-l">One hundred and twenty-five questions.<br>A hundred small decisions.</h1>' +
          '<p class="lede">The real CISSP is an adaptive exam of 100–150 questions with a three-hour limit. This fixed form uses 125 questions to reproduce the domain mix, the clock, and the fatigue. No explanations until you submit — that is the point.</p>' +
        "</div>" +
        '<div class="page-head__aside">' + (last ? '<span class="chip">Last: ' + last.correct + " / " + last.total + '</span><a class="btn btn--ghost" href="#/exam/results">Last results</a>' : "") + "</div></header>" +

        resume +

        '<div class="exam-rules">' +
          "<div>" +
            '<div class="section-head"><div><h2>Before you begin</h2><p>Read this once. It will save you a restart.</p></div></div>' +
            '<ol class="rules-list">' +
              '<li><span class="n">01</span><span><strong>125 questions, 180 minutes.</strong> The timer starts immediately and keeps running if you leave the page.</span></li>' +
              '<li><span class="n">02</span><span><strong>The core mock is weighted by domain.</strong> The official pack mock is a mixed set. Neither uses adaptive stopping.</span></li>' +
              '<li><span class="n">03</span><span><strong>You may flag and revisit</strong> inside this simulation. The real adaptive exam does not permit review, so answer as if you cannot come back — or switch on CAT-style pacing below.</span></li>' +
              '<li><span class="n">04</span><span><strong>No feedback until submission.</strong> Choose the best answer, not the most technical one.</span></li>' +
              '<li><span class="n">05</span><span><strong>Unanswered counts as wrong.</strong> There is no penalty for guessing, so never leave a blank if time is short.</span></li>' +
              '<li><span class="n">06</span><span><strong>The score is an estimate.</strong> It is mapped from raw practice performance, not generated by ISC2. Use it as a trend, not a prediction.</span></li>' +
            "</ol>" +
            '<label class="strict-option" for="strict-mode"><input type="checkbox" id="strict-mode">' +
              "<span><strong>CAT-style pacing</strong><em>No previous question, no flag, no map. The next question is final — closer to the real adaptive test.</em></span></label>" +
            '<div class="q-actions"><button type="button" class="btn btn--signal" data-exam-start>Begin the core mock ' + icon("arrow") + "</button>" +
            (PACK_QUESTIONS.length >= META.examQuestions ? '<button type="button" class="btn btn--ghost" data-exam-start-pack>Begin official pack mock</button>' : "") +
            (active ? '<a class="btn btn--ghost" href="#/exam/run">Resume in progress</a>' : "") + "</div>" +
            (PACK_QUESTIONS.length >= META.examQuestions ? '<p class="label" style="margin-top:12px">The pack mock uses 125 mixed official single-answer questions. It is not domain-weighted and does not update domain readiness.</p>' : "") +
          "</div>" +
          '<aside class="card" style="padding:20px"><p class="label">Weighted allocation</p>' +
            '<table class="weight-table" style="margin-top:10px">' + weights + '<tr><td><strong>Total</strong></td><td><strong>125</strong></td></tr></table>' +
            '<p style="font-size:10.5px;color:var(--ink-3);margin-top:14px;line-height:1.5">The CISSP is a computerised adaptive test: 100–150 questions in three hours, scored 700/1000 to pass. This mock uses the 125-question midpoint. It cannot reproduce the adaptive stopping rule, but it does reproduce the domain mix and time pressure.</p>' +
          "</aside>" +
        "</div>" +

        (last ? '<section class="section"><div class="section-head"><div><h2>Last attempt</h2><p>' + esc(formatDate(last.dateKey, { day: "numeric", month: "long", year: "numeric" })) + " · " + last.correct + " / " + last.total + " correct</p></div>" +
          '<a class="link-arrow" href="#/exam/results">Open results ' + icon("arrow") + "</a></div>" +
          '<div class="score-band"><div class="score-band__score"><strong>' + last.scaled + "<small>/1000</small></strong><span>estimated scaled score</span></div>" +
          '<div class="score-band__copy"><h2>' + (last.scaled >= 700 ? "Above the practice pass line." : "Below the practice pass line.") + "</h2><p>" + (last.scaled >= 700 ? "Keep the edge: drill the two weakest domains and retake in three days." : "Do not reread the whole book. Repair the weakest domains, then retake.") + "</p></div></div></section>" : "")
    };
  }

  function viewExamRun() {
    var s = loadActiveExam();
    if (!s) {
      return {
        title: "Mock exam",
        html: '<section class="empty"><h1>No exam is in progress.</h1><p>Start a new simulation, or resume one you left open. Finished attempts live in your progress log.</p><a class="btn" href="#/exam">Go to the exam desk</a></section>'
      };
    }
    if (s.pack && !PACK_QUESTIONS.length) {
      examSession = null;
      clearActiveExam();
      return { title: "Mock exam", html: '<section class="empty"><h1>The local pack is no longer loaded.</h1><p>Import the pack again, then start a new pack mock.</p><a class="btn" href="#/exam">Go to the exam desk</a></section>' };
    }
    if (s.endsAt <= Date.now()) {
      submitExam(true);
      return { title: "Mock exam", html: '<section class="empty"><h1>Time is up. Scoring…</h1></section>' };
    }
    return { title: "Mock exam · In progress", html: examHTML(), mount: function () { startExamTimer(); } };
  }

  function examHTML() {
    var s = examSession;
    var strict = !!s.strict;
    var q = findQuestion(s.questions[s.index]);
    if (!q) return '<section class="empty"><h1>Question not found.</h1><p>This attempt may be corrupted.</p></section>';
    var picked = s.answers[q.id];
    var flagged = !!s.flags[q.id];

    var options = q.options.map(function (text, i) {
      return '<button type="button" class="option ' + (picked === i ? "is-selected" : "") + '" data-exam-option="' + i + '">' +
        '<span class="option__letter">' + "ABCD"[i] + "</span>" +
        '<span class="option__body">' + esc(text) + "</span>" +
        "</button>";
    }).join("");

    var answered = Object.keys(s.answers).length;

    return '<div class="exam-shell">' +
      '<div class="exam-bar">' +
        '<div class="exam-bar__title">' + (s.pack ? "Pack mock" : "Mock exam") + '<strong>' + (strict ? "CAT-style · answers are final" : (s.pack ? "Official pack · mixed set" : "Fixed-form simulation")) + "</strong></div>" +
        '<div class="exam-bar__right">' +
          '<span class="timer" id="exam-timer">' + formatClock(examRemaining() / 1000) + "</span>" +
          '<span class="exam-count"><strong>' + (s.index + 1) + " / " + s.questions.length + "</strong>" + answered + " answered</span>" +
          (strict ? "" : '<button type="button" class="palette-toggle" data-exam-palette>' + icon("grid") + " Map</button>") +
        "</div>" +
      "</div>" +
      '<div class="exam-q">' +
        '<div class="q-head">' +
          '<span class="q-head__no">Question <strong>' + pad(s.index + 1) + "</strong></span>" +
          '<span class="chip">' + (q.pack ? (q.d ? "Domain " + pad(q.d) : "Official pack") : "Domain " + pad(q.d)) + "</span>" +
          '<span class="chip chip--blue">' + esc(q.topic || "Scenario") + "</span>" +
          (strict ? "" : '<button type="button" class="flag-button ' + (flagged ? "is-on" : "") + '" data-exam-flag style="margin-left:auto">' + icon("flag") + (flagged ? "Flagged" : "Flag for review") + "</button>") +
        "</div>" +
        '<h1 class="q-stem">' + esc(q.stem) + "</h1>" +
        '<div class="options" role="group" aria-label="Answer choices">' + options + "</div>" +
        '<div class="exam-nav">' +
          (strict ? '<span class="exam-nav__spacer"></span>' : '<button type="button" class="btn btn--ghost btn--small" data-exam-prev' + (s.index === 0 ? " disabled" : "") + ">" + icon("arrowLeft") + " Previous</button>" +
          '<span class="exam-nav__spacer"></span>') +
          '<button type="button" class="btn btn--ghost btn--small" data-exam-submit>' + (strict ? "Submit exam" : "Review & submit") + "</button>" +
          '<button type="button" class="btn btn--small" data-exam-next' + (s.index === s.questions.length - 1 ? " disabled" : "") + ">Next " + icon("arrow") + "</button>" +
        "</div>" +
        '<p class="kbd-hint" style="margin-top:16px;text-align:center"><span class="kbd">1–4</span> answer · ' + (strict ? '<span class="kbd">→</span> next' : '<span class="kbd">←</span> <span class="kbd">→</span> navigate · <span class="kbd">F</span> flag') + "</p>" +
      "</div>" +
    "</div>";
  }

  function repaintExam() {
    if (!examSession) return;
    view.innerHTML = examHTML();
  }

  function startExamTimer() {
    clearTick();
    timerHandle = setInterval(function () {
      var remaining = examRemaining();
      var el = document.getElementById("exam-timer");
      if (el) {
        el.textContent = formatClock(remaining / 1000);
        el.classList.toggle("is-low", remaining <= 600000);
      }
      if (remaining <= 0) {
        clearTick();
        submitExam(true);
      }
    }, 1000);
  }

  function openPalette() {
    if (!examSession || examSession.strict) return;
    var s = examSession;
    var cells = s.questions.map(function (id, i) {
      var answered = s.answers[id] != null;
      var flagged = !!s.flags[id];
      var cls = (answered ? "is-answered " : "") + (flagged ? "is-flagged " : "") + (i === s.index ? "is-current" : "");
      return '<button type="button" class="' + cls + '" data-exam-goto="' + i + '" aria-label="Question ' + (i + 1) + (answered ? ", answered" : ", unanswered") + '">' + (i + 1) + "</button>";
    }).join("");

    var dialog = document.createElement("dialog");
    dialog.className = "palette-dialog";
    dialog.innerHTML =
      '<div class="palette-dialog__head"><h3>Question map</h3><button type="button" class="dialog__close" data-close aria-label="Close">×</button></div>' +
      '<div class="palette-dialog__body"><div class="palette-grid">' + cells + "</div>" +
      '<div class="palette-legend"><span><i class="lg-answered"></i> answered</span><span><i></i> unanswered</span><span><i class="lg-flagged"></i> flagged</span></div>' +
      '<div class="dialog__foot" style="padding:18px 0 0;justify-content:space-between"><span class="label">' + Object.keys(s.answers).length + " / " + s.questions.length + ' answered</span><button type="button" class="btn btn--signal btn--small" data-exam-submit>Review & submit</button></div></div>';
    document.body.appendChild(dialog);
    dialog.addEventListener("close", function () { dialog.remove(); });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog || event.target.closest("[data-close]")) { dialog.close(); return; }
      var goto = event.target.closest("[data-exam-goto]");
      if (goto) {
        examSession.index = Number(goto.getAttribute("data-exam-goto"));
        saveActiveExam();
        dialog.close();
        repaintExam();
        window.scrollTo(0, 0);
        return;
      }
      if (event.target.closest("[data-exam-submit]")) {
        dialog.close();
        openExamSubmit();
      }
    });
    dialog.showModal();
  }

  function openExamSubmit() {
    if (!examSession) return;
    var s = examSession;
    var unanswered = s.questions.length - Object.keys(s.answers).length;
    var flagged = Object.keys(s.flags).filter(function (id) { return s.flags[id]; }).length;
    var dialog = openDialog({
      title: "Submit the mock exam?",
      body: "<p>" + plural(Object.keys(s.answers).length, "question") + " answered. " +
        (unanswered ? "<strong>" + plural(unanswered, "question") + " unanswered</strong> — these will be scored wrong. " : "Nothing is blank. ") +
        (flagged ? plural(flagged, "question") + " still flagged. " : "") +
        "You cannot change answers after submission.</p>" +
        '<p class="label" style="margin-bottom:0">Time used: ' + formatDuration((META.examMinutes * 60) - examRemaining() / 1000) + "</p>",
      actions: '<button type="button" class="btn btn--ghost btn--small" data-close>Keep working</button><button type="button" class="btn btn--signal btn--small" data-confirm-submit>Submit and score</button>'
    });
    dialog.querySelector("[data-confirm-submit]").addEventListener("click", function () {
      dialog.close();
      submitExam(false);
    });
  }

  function submitExam(auto) {
    if (!examSession || examSession.submitted) return;
    examSession.submitted = true;
    clearTick();
    closeDialogs();

    var s = examSession;
    var byDomain = {};
    var review = [];
    var correctTotal = 0;
    var started = s.startedAt;
    var seconds = Math.max(1, Math.round(((s.endsAt - s.startedAt) - Math.max(0, s.endsAt - Date.now())) / 1000));

    s.questions.forEach(function (id) {
      var q = findQuestion(id);
      if (!q) return;
      var picked = s.answers[id];
      var correct = picked === q.answer;
      if (correct) correctTotal += 1;
      if (!byDomain[q.d]) byDomain[q.d] = { total: 0, correct: 0 };
      byDomain[q.d].total += 1;
      if (correct) byDomain[q.d].correct += 1;
      review.push({ id: id, picked: picked == null ? null : picked, correct: correct });
      if (picked != null) recordAnswer(q, correct, false);
    });

    var pctRaw = s.questions.length ? correctTotal / s.questions.length : 0;
    var scaled = Math.round(pctRaw <= 0.7 ? 300 + (pctRaw / 0.7) * 400 : 700 + ((pctRaw - 0.7) / 0.3) * 300);
    scaled = clamp(scaled, 300, 1000);

    var entry = {
      id: makeId("exam-"),
      dateKey: todayKey(),
      date: new Date().toISOString(),
      total: s.questions.length,
      correct: correctTotal,
      pct: pctRaw,
      scaled: scaled,
      seconds: clamp(seconds, 1, META.examMinutes * 60),
      strict: !!s.strict,
      pack: !!s.pack,
      byDomain: byDomain,
      review: review
    };

    localState.exams.push(entry);
    if (localState.exams.length > 20) localState.exams = localState.exams.slice(-20);
    lastExamResult = entry;
    examSession = null;
    clearActiveExam();
    save();
    toast(auto ? "Time is up. The attempt has been scored." : "Exam scored. Review the weak domains.");
    if (location.hash !== "#/exam/results") location.hash = "#/exam/results";
    else render();
  }

  function viewExamResults() {
    var result = lastExamResult || state.exams[state.exams.length - 1];
    if (!result) {
      return {
        title: "Exam results",
        html: '<section class="empty"><h1>No results yet.</h1><p>Complete a mock exam and the breakdown will appear here.</p><a class="btn" href="#/exam">Go to the exam desk</a></section>'
      };
    }
    var pctRaw = result.correct / result.total;
    var pass = result.scaled >= 700;

    var domains = Object.keys(result.byDomain).map(function (id) {
      var row = result.byDomain[id];
      var rate = row.total ? row.correct / row.total : 0;
      return "<tr><td>" + (id == 0 ? "Official pack" : pad(id) + " · " + esc(domainShort(id))) + "</td>" +
        '<td class="num">' + row.correct + " / " + row.total + "</td>" +
        '<td class="bar-cell"><div class="bar-cell__track"><i style="width:' + Math.round(rate * 100) + '%"></i><span>' + Math.round(rate * 100) + "%</span></div></td></tr>";
    }).join("");

    var missedAll = (result.review || []).filter(function (r) { return !r.correct; });
    var missedShown = missedAll.slice(0, 30);
    var missed = missedShown.map(function (r) {
      var q = findQuestion(r.id);
      if (!q) return "";
      var picked = r.picked == null ? "No answer" : "ABCD"[r.picked] + ". " + q.options[r.picked];
      return '<details class="review-item"><summary>' +
        '<span class="review-item__no">' + (r.picked == null ? "—" : "ABCD"[r.picked]) + "</span>" +
        '<span class="review-item__stem">' + esc(q.stem) + "</span>" +
        '<span class="review-item__tag">' + (q.d ? "Domain " + pad(q.d) : "Official pack") + "</span>" +
        '</summary><div class="review-item__body">' +
          '<p class="review-item__answer">Best answer: ' + "ABCD"[q.answer] + ". " + esc(q.options[q.answer]) + "</p>" +
          '<p class="review-item__answer is-wrong" style="margin-bottom:10px">You chose: ' + esc(picked) + "</p>" +
          "<p>" + esc(q.whyText || q.explain || "") + "</p>" +
          (q.lens ? '<p style="border-left:2px solid var(--signal);padding-left:12px;color:var(--ink-3)"><strong>Lens:</strong> ' + esc(q.lens) + "</p>" : "") +
        "</div></details>";
    }).join("");

    var weak = Object.keys(result.byDomain).map(function (id) {
      var row = result.byDomain[id];
      return { id: Number(id), rate: row.total ? row.correct / row.total : 0 };
    }).sort(function (a, b) { return a.rate - b.rate; }).slice(0, 2);

    return {
      title: "Exam results",
      html:
        '<header class="page-head"><div class="page-head__copy"><p class="eyebrow">' + (result.pack ? "Pack mock complete" : "Mock exam complete") + " · " + esc(formatDate(result.dateKey, { day: "numeric", month: "long" })) + "</p>" +
          '<h1 class="display-l">' + (pass ? "Above the line." : "Below the line.") + "<br>" + result.correct + " of " + result.total + " correct.</h1>" +
          '<p class="lede">' + (result.pack ? "A mixed set of official single-answer practice items. Useful for timing and exposure, but not a domain-weighted core mock or an ISC2 score." : (pass ? "The estimate says you are close. The domain table says where the next hour should go." : "This is a fixed-form estimate, not an ISC2 result. The useful signal is the domain breakdown, not the number.")) + "</p></div>" +
          '<div class="page-head__aside"><span class="chip ' + (pass ? "chip--ok" : "chip--signal") + '">Estimated scaled ' + result.scaled + "</span>" +
          '<span class="chip">' + formatDuration(result.seconds) + " used</span>" +
          (result.strict ? '<span class="chip">CAT-style · no review</span>' : "") + "</div></header>" +

        '<div class="score-band">' +
          '<div class="score-band__score"><strong>' + result.scaled + "<small>/1000</small></strong><span>estimated scaled score</span></div>" +
          '<div class="score-band__copy"><h2>' + (pass ? "At or above the practice pass line" : "Below the practice pass line") + "</h2>" +
            "<p>" + Math.round(pctRaw * 100) + "% raw accuracy. " + (result.pack ? "The pack is a mixed official question set; use the result for calibration, not a pass prediction." : "The practice mapping puts 700 at 70% raw. The real exam is adaptive and scored differently; this is a study estimate.") + "</p></div>" +
        "</div>" +

        '<section><div class="section-head"><div><h2>' + (result.pack ? "By section" : "By domain") + '</h2><p>' + (result.pack ? "A mixed official set, not a domain-weighted sample." : "Weighted like the exam, scored like a drill.") + "</p></div>" +
        (weak.length && !result.pack ? '<span class="label">Weakest: ' + weak.map(function (w) { return pad(w.id); }).join(" · ") + "</span>" : "") +
        "</div>" +
        '<table class="summary-table"><thead><tr><th scope="col">Domain</th><th scope="col">Score</th><th scope="col">Rate</th></tr></thead><tbody>' + domains + "</tbody></table></section>" +

        '<div class="q-actions" style="margin-top:26px">' +
          (result.pack ? '<a class="btn" href="#/exam">Another pack mock ' + icon("arrow") + "</a>" : '<a class="btn" href="#/practice" data-start="weak">Drill the weak areas ' + icon("arrow") + "</a>") +
          '<a class="btn btn--ghost" href="#/study">Return to the notes</a>' +
          '<a class="btn btn--ghost" href="#/exam">Retake the mock</a>' +
        "</div>" +

        (missed ? '<section class="section"><div class="section-head"><div><h2>Questions to review</h2><p>Read the reasoning, not just the letter.</p></div><span class="label">' + plural(missedAll.length, "missed question") + (missedAll.length > missedShown.length ? " · first " + missedShown.length : "") + "</span></div>" +
          '<div class="review-list">' + missed + "</div>" +
          (missedAll.length > missedShown.length ? '<p class="label" style="margin-top:14px">Showing the first ' + missedShown.length + " of " + missedAll.length + " misses. Drill the weak domains to work through the rest.</p>" : "") +
          "</section>" : '<section class="section"><div class="empty"><h3>A clean sheet.</h3><p>Every question correct. Move the exam date closer or raise the difficulty of your practice.</p></div></section>')
    };
  }

  /* ------------------------------------------------------------------- sync */

  function relativeTime(timestamp) {
    var diff = Math.max(0, Date.now() - Number(timestamp || 0));
    if (!timestamp) return "never";
    if (diff < 45000) return "just now";
    var minutes = Math.round(diff / 60000);
    if (minutes < 60) return minutes + "m ago";
    var hours = Math.round(minutes / 60);
    if (hours < 24) return hours + "h ago";
    return Math.round(hours / 24) + "d ago";
  }

  function syncSectionHTML() {
    var on = !!(syncConfig && SYNC);
    var status = syncStatus.state;
    var statusText = "Sync off";
    var statusClass = "chip--ok";
    if (on) {
      if (status === "syncing") { statusText = "Syncing…"; statusClass = "chip--blue"; }
      else if (status === "error") { statusText = "Sync failed"; statusClass = "chip--signal"; }
      else if (status === "offline") { statusText = "Offline"; statusClass = "chip--signal"; }
      else if (!syncStatus.lastSyncAt) { statusText = "Ready to sync"; statusClass = "chip--blue"; }
      else { statusText = "Synced " + relativeTime(syncStatus.lastSyncAt); }
    }

    var body;
    if (!on) {
      body = "<p>Keep this browser and your phone on the same answer sheet. Sync uses a private code, not an account, and the Worker stores only encrypted progress.</p>" +
        '<div class="q-actions" style="margin-top:14px">' +
          '<button type="button" class="btn btn--small" data-sync-create>Create a sync code</button>' +
          '<button type="button" class="btn btn--ghost btn--small" data-sync-join>I have a code</button>' +
        "</div>" +
        '<p class="sync-fineprint">No email, no password, no analytics. If you lose the code, the server copy cannot be recovered; local progress stays.</p>';
    } else {
      var code = syncShowCode
        ? esc(SYNC.formatCode(syncConfig.code))
        : "••••-••••-••••-••••-••••-••••-••••-••••";
      var devices = syncStatus.devices || syncConfig.lastDeviceCount || 1;
      body = '<div class="sync-status-row"><span class="chip ' + statusClass + '">' + esc(statusText) + "</span>" +
        '<span class="sync-devices">' + devices + (devices === 1 ? " device" : " devices") + "</span></div>" +
        (syncStatus.lastError ? '<p class="sync-error">' + esc(syncStatus.lastError) + "</p>" : "") +
        '<div class="sync-code-row"><code class="sync-code">' + code + "</code>" +
          '<button type="button" class="btn btn--ghost btn--small" data-sync-toggle-code>' + (syncShowCode ? "Hide" : "Show") + "</button>" +
          '<button type="button" class="btn btn--ghost btn--small" data-sync-copy>Copy</button>' +
        "</div>" +
        '<p class="sync-fineprint">Anyone with this code can read and change your synced progress. Store it in your password manager.</p>' +
        '<div class="q-actions" style="margin-top:14px">' +
          '<button type="button" class="btn btn--small" data-sync-now' + (status === "syncing" ? " disabled" : "") + ">Sync now</button>" +
          '<button type="button" class="btn btn--ghost btn--small" data-sync-disable>Turn off on this device</button>' +
          '<button type="button" class="btn btn--ghost btn--small" data-sync-delete>Delete synced data</button>' +
        "</div>" +
        '<details class="sync-advanced"><summary>Server lock (advanced)</summary>' +
          '<p class="sync-fineprint">Optional: set the Worker\u2019s <code>ACCOUNT_ID</code> to a fingerprint of this code so it rejects every other account before touching D1.</p>' +
          '<button type="button" class="btn btn--ghost btn--small" data-sync-lock>Show lock value</button>' +
        "</details>";
    }

    return '<section class="section" id="sync-section"><div class="section-head"><div><h2>Sync across devices</h2><p>Laptop and phone, one progress record.</p></div></div>' +
      '<div class="card sync-card">' + body + "</div></section>";
  }

  function refreshSyncPanel() {
    var panel = document.getElementById("sync-section");
    if (panel) panel.outerHTML = syncSectionHTML();
  }

  function isProgressRoute() {
    return routeFor(parseRoute(location.hash).parts).name === "progress";
  }

  function isHomeRoute() {
    return routeFor(parseRoute(location.hash).parts).name === "home";
  }

  function hasActiveSession() {
    var route = routeFor(parseRoute(location.hash).parts);
    if (route.name === "practiceSession") return !!(practiceSession && !practiceSession.completed);
    if (route.name === "cardsSession") return !!cardSession;
    if (route.name === "examRun") return !!examSession;
    return false;
  }

  function scheduleSync() {
    if (!syncConfig || !SYNC) return;
    if (syncTimer) return;
    syncTimer = setTimeout(function () {
      syncTimer = null;
      syncNow(false);
    }, 4000);
  }

  async function syncNow(manual) {
    if (!syncConfig || !SYNC) return;
    if (syncTimer) { clearTimeout(syncTimer); syncTimer = null; }
    if (syncInFlight) { syncQueued = true; return; }
    if (navigator.onLine === false) {
      syncStatus.state = "offline";
      syncStatus.lastError = null;
      refreshSyncPanel();
      if (manual) toast("You are offline. Progress will sync when you reconnect.");
      return;
    }

    syncInFlight = true;
    syncStatus.state = "syncing";
    syncStatus.lastError = null;
    refreshSyncPanel();
    var shouldRender = false;

    try {
      var envelope = await SYNC.encryptState(localState, syncConfig.code);
      var data = await SYNC.push(syncConfig, envelope);
      var devices = Array.isArray(data.devices) ? data.devices : [];
      var nextRemote = {};
      var readWarning = null;

      for (var i = 0; i < devices.length; i++) {
        var device = devices[i];
        if (!device || !device.deviceId || device.deviceId === syncConfig.deviceId) continue;
        try {
          var raw = await SYNC.decryptState(device.envelope, syncConfig.code);
          nextRemote[device.deviceId] = sanitizeState(raw);
        } catch (err) {
          readWarning = "One device snapshot could not be read and was skipped.";
        }
      }

      remoteStates = nextRemote;
      SYNC.saveCachedStates(remoteStates);
      syncConfig.lastSyncAt = Date.now();
      syncConfig.lastDeviceCount = devices.length || 1;
      syncConfig = SYNC.saveConfig(syncConfig) || syncConfig;
      syncStatus.state = "idle";
      syncStatus.lastError = readWarning;
      syncStatus.devices = syncConfig.lastDeviceCount;
      syncStatus.lastSyncAt = syncConfig.lastSyncAt;
      shouldRender = manual || isProgressRoute() || isHomeRoute();
      rebuildState();

      if (shouldRender && !hasActiveSession() && !document.querySelector("dialog[open]")) {
        render();
      } else {
        refreshChrome(routeFor(parseRoute(location.hash).parts));
        refreshSyncPanel();
      }
      if (manual) toast(readWarning || "Progress synced.");
    } catch (err) {
      syncStatus.state = "error";
      syncStatus.lastError = err && err.message ? err.message : "Sync failed.";
      refreshSyncPanel();
      if (manual) toast(syncStatus.lastError);
    } finally {
      syncInFlight = false;
      if (syncQueued) {
        syncQueued = false;
        scheduleSync();
      }
    }
  }

  function adoptSyncCode(code, deviceCount) {
    syncConfig = SYNC.saveConfig({
      code: code,
      deviceId: SYNC.newDeviceId(),
      lastSyncAt: null,
      lastDeviceCount: deviceCount || 1,
      createdAt: Date.now()
    });
    if (!syncConfig) { toast("That sync code could not be saved."); return; }
    remoteStates = {};
    SYNC.clearCache();
    syncStatus = { state: "idle", lastError: null, devices: deviceCount || 1, lastSyncAt: null };
    syncShowCode = false;
    rebuildState();
    persistLocal();
    syncNow(true);
  }

  function copyText(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast(successMessage);
      }, function () {
        window.prompt("Copy", text);
      });
    } else {
      window.prompt("Copy", text);
    }
  }

  function copySyncCode() {
    if (!syncConfig || !SYNC) return;
    copyText(SYNC.formatCode(syncConfig.code), "Sync code copied.");
  }

  async function openSyncLock() {
    if (!syncConfig || !SYNC) return;
    var lock;
    try {
      lock = await SYNC.accountId(syncConfig.code);
    } catch (err) {
      toast(err.message || "Could not compute the lock value.");
      return;
    }
    var dialog = openDialog({
      title: "Server lock",
      body: "<p>This is a SHA-256 fingerprint of your sync code. Set the Worker variable <code>ACCOUNT_ID</code> to this value, then redeploy. The Worker will reject every other account before it touches D1.</p>" +
        '<div class="sync-code-row"><code class="sync-code">' + esc(lock) + "</code></div>" +
        '<p class="sync-fineprint">The fingerprint is not the sync code and cannot decrypt your data. It does not stop request floods; the <code>/v1/sync</code> rate-limit rule does that.</p>',
      actions: '<button type="button" class="btn btn--small" data-sync-lock-copy>Copy lock value</button>' +
        '<button type="button" class="btn btn--ghost btn--small" data-close>Close</button>'
    });
    var copy = dialog.querySelector("[data-sync-lock-copy]");
    if (copy) copy.addEventListener("click", function () { copyText(lock, "Server lock value copied."); });
  }

  function showSyncCodeDialog(created) {
    if (!syncConfig || !SYNC) return;
    var code = SYNC.formatCode(syncConfig.code);
    var dialog = openDialog({
      title: created ? "Your sync code" : "Sync code",
      body: "<p>" + (created
        ? "This device is ready. Enter the same code on your phone."
        : "Enter this code on another device.") + "</p>" +
        '<div class="sync-code-row"><code class="sync-code">' + esc(code) + "</code></div>" +
        '<p class="sync-fineprint">Store it somewhere safe. Without it, the server copy cannot be decrypted.</p>',
      actions: '<button type="button" class="btn btn--small" data-sync-copy>Copy code</button>' +
        '<button type="button" class="btn btn--ghost btn--small" data-close>Done</button>'
    });
    var copy = dialog.querySelector("[data-sync-copy]");
    if (copy) copy.addEventListener("click", function () { copySyncCode(); });
  }

  function openSyncCreate() {
    if (!SYNC) { toast("Sync is unavailable in this browser."); return; }
    var dialog = openDialog({
      title: "Create a sync code",
      body: "<p>This code is the only key to your synced progress. It is not an account and there is no password reset.</p>" +
        '<div class="callout"><p class="callout__label">Anyone with this code</p><p>can read and change your synced progress. Treat it like a passphrase and store it in your password manager.</p></div>',
      actions: '<button type="button" class="btn btn--ghost btn--small" data-close>Cancel</button>' +
        '<button type="button" class="btn btn--small" data-sync-create-confirm>Create code</button>'
    });
    dialog.querySelector("[data-sync-create-confirm]").addEventListener("click", function () {
      dialog.close();
      var code;
      try { code = SYNC.generateCode(); } catch (err) { toast(err.message); return; }
      syncConfig = SYNC.saveConfig({
        code: code,
        deviceId: SYNC.newDeviceId(),
        lastSyncAt: null,
        lastDeviceCount: 1,
        createdAt: Date.now()
      });
      if (!syncConfig) { toast("Could not create a sync code."); return; }
      remoteStates = {};
      SYNC.clearCache();
      syncStatus = { state: "idle", lastError: null, devices: 1, lastSyncAt: null };
      syncShowCode = true;
      rebuildState();
      persistLocal();
      showSyncCodeDialog(true);
      syncNow(true);
    });
  }

  function openSyncJoin() {
    if (!SYNC) { toast("Sync is unavailable in this browser."); return; }
    var dialog = openDialog({
      title: "Enter a sync code",
      body: '<form id="sync-join-form"><div class="field"><label for="sync-join-input">Sync code</label>' +
        '<input id="sync-join-input" name="code" type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Paste your sync code">' +
        "<small>Paste the code from your other device.</small></div></form>",
      actions: '<button type="button" class="btn btn--ghost btn--small" data-close>Cancel</button>' +
        '<button type="submit" class="btn btn--small" form="sync-join-form">Connect</button>'
    });
    var form = dialog.querySelector("#sync-join-form");
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      var input = dialog.querySelector("#sync-join-input");
      var code = SYNC.normalizeCode(input.value);
      var submit = dialog.querySelector('button[type="submit"]');
      if (!SYNC.validCode(code)) {
        toast("That code is not the right length. It has 32 letters and digits.");
        return;
      }
      if (submit) { submit.disabled = true; submit.textContent = "Checking…"; }
      try {
        var data = await SYNC.pull(code);
        if (!dialog.open) return;
        var devices = Array.isArray(data.devices) ? data.devices : [];
        var verified = false;
        for (var i = 0; i < devices.length && !verified; i++) {
          try {
            await SYNC.decryptState(devices[i].envelope, code);
            verified = true;
          } catch (err) { /* try the next device */ }
        }
        if (devices.length && !verified) {
          toast("That code does not match the saved progress.");
          if (submit) { submit.disabled = false; submit.textContent = "Connect"; }
          return;
        }
        dialog.close();
        if (!devices.length) {
          var confirmJoin = openDialog({
            title: "No progress found",
            body: "<p>No saved progress was found for that code. If this is the code from your first device, it may not have synced yet. If you mistyped it, go back and check.</p>",
            actions: '<button type="button" class="btn btn--ghost btn--small" data-close>Check the code</button>' +
              '<button type="button" class="btn btn--small" data-sync-join-anyway>Use this code</button>'
          });
          confirmJoin.querySelector("[data-sync-join-anyway]").addEventListener("click", function () {
            confirmJoin.close();
            adoptSyncCode(code, 1);
          });
          return;
        }
        adoptSyncCode(code, devices.length);
      } catch (err) {
        toast(err.message || "Could not check that code.");
        if (submit) { submit.disabled = false; submit.textContent = "Connect"; }
      }
    });
  }

  function openSyncDisable() {
    if (!syncConfig || !SYNC) return;
    var dialog = openDialog({
      title: "Turn off sync on this device?",
      body: "<p>Progress already merged into this browser stays. This device stops sending and receiving updates and forgets the sync code; the snapshot already on the server stays there for your other devices.</p>" +
        "<p>If you turn sync back on later, use a new code. Reusing the old code after this device has absorbed the combined progress can count the same answers twice.</p>",
      actions: '<button type="button" class="btn btn--ghost btn--small" data-close>Cancel</button>' +
        '<button type="button" class="btn btn--signal btn--small" data-sync-disable-confirm>Turn off sync</button>'
    });
    dialog.querySelector("[data-sync-disable-confirm]").addEventListener("click", function () {
      dialog.close();
      localState = state;
      syncConfig = null;
      SYNC.clearConfig();
      SYNC.clearCache();
      remoteStates = {};
      syncStatus = { state: "idle", lastError: null, devices: 0, lastSyncAt: null };
      syncShowCode = false;
      save();
      render();
      toast("Sync turned off on this device. The server snapshot stays for your other devices.");
    });
  }

  function openSyncDelete() {
    if (!syncConfig || !SYNC) return;
    var dialog = openDialog({
      title: "Delete all synced progress?",
      body: "<p>This removes the encrypted snapshots from the sync service and turns sync off on this device. Progress on this device stays.</p>" +
        "<p>Other devices keep their local copies and may upload them again if they sync later, so turn sync off on those devices too if you want a clean removal.</p>",
      actions: '<button type="button" class="btn btn--ghost btn--small" data-close>Cancel</button>' +
        '<button type="button" class="btn btn--signal btn--small" data-sync-delete-confirm>Delete synced data</button>'
    });
    dialog.querySelector("[data-sync-delete-confirm]").addEventListener("click", async function () {
      dialog.close();
      var config = syncConfig;
      try {
        await SYNC.deleteAccount(config);
      } catch (err) {
        toast(err.message || "Could not delete the synced data.");
        return;
      }
      localState = state;
      syncConfig = null;
      SYNC.clearConfig();
      SYNC.clearCache();
      remoteStates = {};
      syncStatus = { state: "idle", lastError: null, devices: 0, lastSyncAt: null };
      syncShowCode = false;
      save();
      render();
      toast("Synced data deleted. This device kept its local progress.");
    });
  }

  /* ---------------------------------------------------------------- progress */

  function viewProgress() {
    var stats = allStats();
    var r = readiness();
    var due = dueCards().length;
    var streak = currentStreak();
    var exams = state.exams.slice().reverse();
    var days = [];
    for (var i = 13; i >= 0; i--) {
      var key = addDaysKey(-i);
      var day = state.activity[key] || { a: 0, c: 0, cards: 0 };
      days.push({ key: key, count: (day.a || 0) + (day.cards || 0) });
    }
    var maxDay = Math.max.apply(null, days.map(function (d) { return d.count; }).concat([1]));

    var activity = days.map(function (d) {
      var h = Math.max(2, Math.round((d.count / maxDay) * 100));
      return '<div class="activity__day ' + (d.key === todayKey() ? "is-today" : "") + '">' +
        '<div class="activity__bar" title="' + d.count + ' activities"><i style="height:' + h + '%"></i></div>' +
        "<span>" + esc(d.key.slice(8)) + "</span></div>";
    }).join("");

    var domainRows = DOMAINS.map(function (d) {
      var s = domainStats(d.id);
      return "<tr><td>" + pad(d.id) + " · " + esc(d.short) + "</td>" +
        '<td class="num">' + s.seen + " / " + s.total + "</td>" +
        '<td class="num">' + (s.accuracy == null ? "—" : Math.round(s.accuracy * 100) + "%") + "</td>" +
        '<td class="bar-cell"><div class="bar-cell__track"><i style="width:' + s.mastery + '%"></i><span>' + s.mastery + "%</span></div></td></tr>";
    }).join("");

    var examRows = exams.length ? exams.map(function (e) {
      return "<tr><td>" + esc(formatDate(e.dateKey, { day: "numeric", month: "short" })) + "</td>" +
        '<td class="num">' + e.correct + " / " + e.total + "</td>" +
        '<td class="num">' + e.scaled + "</td>" +
        '<td class="num">' + Math.round(e.pct * 100) + "%</td>" +
        '<td class="num">' + formatDuration(e.seconds) + "</td></tr>";
    }).join("") : "";

    var recent = Object.keys(state.attempts).map(function (id) {
      var a = state.attempts[id];
      return { q: findQuestion(id), a: a };
    }).filter(function (item) { return item.q; }).sort(function (x, y) { return (y.a.last || 0) - (x.a.last || 0); }).slice(0, 10);

    var recentList = recent.map(function (item) {
      return "<tr><td>" + (item.q.pack ? "Official" : pad(item.q.d)) + "</td><td>" + esc(item.q.topic || "Scenario") + "</td>" +
        '<td><span class="chip ' + (item.a.lastResult ? "chip--ok" : "chip--signal") + '">' + (item.a.lastResult ? "Correct" : "Missed") + "</span></td>" +
        '<td class="num">' + (item.a.c || 0) + " / " + ((item.a.c || 0) + (item.a.w || 0)) + "</td></tr>";
    }).join("");

    return {
      title: "Progress",
      html:
        '<header class="page-head"><div class="page-head__copy"><p class="eyebrow">Candidate record</p>' +
          '<h1 class="display-l">' + (r == null ? (stats.attempts ? "Not enough evidence yet." : "The sheet is still blank.") : r + " / 100 readiness.") + "</h1>" +
          '<p class="lede">' + (r == null ? "Answer at least eight questions to establish a baseline. Until then, every number below is an empty container." : readinessLabel(r) + ". Readiness is a weighted practice estimate — useful for direction, not a prediction of your ISC2 score.") + "</p></div>" +
          '<div class="page-head__aside"><button type="button" class="btn btn--ghost btn--small" data-export-progress>Export</button>' +
          '<button type="button" class="btn btn--ghost btn--small" data-import-progress>Import</button>' +
          '<button type="button" class="btn btn--ghost btn--small" data-set-exam-date>Exam date</button>' +
          '<button type="button" class="btn btn--ghost btn--small" data-reset>Reset data</button></div></header>' +

        syncSectionHTML() +

        '<div class="stat-grid">' +
          '<div class="stat"><p class="stat__label">Questions answered</p><p class="stat__value">' + stats.attempts + '</p><p class="stat__note">' + stats.seen + " unique of " + stats.total + "</p></div>" +
          '<div class="stat"><p class="stat__label">Accuracy</p><p class="stat__value">' + (stats.accuracy == null ? "—" : Math.round(stats.accuracy * 100) + "<small>%</small>") + '</p><p class="stat__note">All attempts, including repeats</p></div>' +
          '<div class="stat"><p class="stat__label">Coverage</p><p class="stat__value">' + Math.round(stats.coverage * 100) + "<small>%</small></p><p class=\"stat__note\">" + stats.seen + " of " + stats.total + " questions seen</p></div>" +
          '<div class="stat"><p class="stat__label">Current streak</p><p class="stat__value">' + streak + "<small> days</small></p><p class=\"stat__note\">" + due + " cards due today</p></div>" +
        "</div>" +

        '<section class="section"><div class="section-head"><div><h2>The last fourteen days</h2><p>Answers and cards, not minutes. Consistency beats duration.</p></div></div>' +
        '<div class="card" style="padding:20px"><div class="activity">' + activity + "</div></div></section>" +

        '<section class="section"><div class="section-head"><div><h2>Domain evidence</h2><p>Accuracy, coverage, and the weighted mastery score.</p></div></div>' +
        '<table class="summary-table"><thead><tr><th scope="col">Domain</th><th scope="col">Seen</th><th scope="col">Accuracy</th><th scope="col">Mastery</th></tr></thead><tbody>' + domainRows + "</tbody></table></section>" +

        '<section class="section"><div class="section-head"><div><h2>Mock exam history</h2><p>Most recent first. Scaled scores are estimates.</p></div></div>' +
        (examRows ? '<table class="history"><thead><tr><th scope="col">Date</th><th scope="col">Score</th><th scope="col">Scaled</th><th scope="col">Raw</th><th scope="col">Time</th></tr></thead><tbody>' + examRows + "</tbody></table>" : '<div class="empty"><h3>No simulations yet.</h3><p>A full mock is uncomfortable for a reason. Take one before you feel ready.</p><a class="btn" href="#/exam">Open the exam desk</a></div>') +
        "</section>" +

        '<section class="section"><div class="section-head"><div><h2>Recent answers</h2><p>Your last ten question attempts, newest first.</p></div></div>' +
        (recentList ? '<table class="history"><thead><tr><th scope="col">Domain</th><th scope="col">Topic</th><th scope="col">Result</th><th scope="col">Record</th></tr></thead><tbody>' + recentList + "</tbody></table>" : '<div class="empty"><h3>No answers recorded.</h3><p>Start with the diagnostic and the log will fill itself.</p><a class="btn" href="#/practice" data-start="diagnostic">Start the diagnostic</a></div>') +
        "</section>" +

        '<section class="section"><div class="callout"><p class="callout__label">Your data</p><p>Progress is local to this browser. Use <strong>Export</strong> for a JSON backup, or turn on <strong>sync</strong> above to keep this device and your phone together. Import is available only while sync is off.</p></div></section>' +
        '<input type="file" id="progress-import" accept=".json,application/json" hidden>'
    };
  }

  /* ---------------------------------------------------------------- dialogs */

  function closeDialogs() {
    Array.prototype.forEach.call(document.querySelectorAll("dialog"), function (dialog) {
      if (dialog.open) {
        try { dialog.close(); } catch (err) { /* ignore */ }
      }
      if (dialog.parentNode) dialog.parentNode.removeChild(dialog);
    });
  }

  function openDialog(options) {
    closeDialogs();
    var dialog = document.createElement("dialog");
    dialog.className = "dialog";
    dialog.innerHTML =
      '<div class="dialog__head"><h2>' + esc(options.title) + '</h2><button type="button" class="dialog__close" data-close aria-label="Close">×</button></div>' +
      '<div class="dialog__body">' + (options.body || "") + "</div>" +
      '<div class="dialog__foot">' + (options.actions || '<button type="button" class="btn btn--small" data-close>Close</button>') + "</div>";
    document.body.appendChild(dialog);
    dialog.addEventListener("close", function () { if (dialog.parentNode) dialog.parentNode.removeChild(dialog); });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog || event.target.closest("[data-close]")) dialog.close();
    });
    dialog.showModal();
    return dialog;
  }

  function openExamDate() {
    var current = (state.settings && state.settings.examDate) || "";
    var dialog = openDialog({
      title: "Set your exam date",
      body: '<form id="exam-date-form"><div class="field"><label for="exam-date-input">Target date</label>' +
        '<input type="date" id="exam-date-input" name="date" value="' + esc(current) + '" min="' + todayKey() + '">' +
        "<small>The sidebar will show the countdown. You can change it later.</small></div></form>",
      actions: '<button type="button" class="btn btn--ghost btn--small" data-close>Cancel</button><button type="submit" class="btn btn--small" form="exam-date-form">Save date</button>'
    });
    var form = dialog.querySelector("#exam-date-form");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = dialog.querySelector("#exam-date-input").value;
      localState.settings.examDate = value || null;
      localState.settings.examDateAt = Date.now();
      save();
      dialog.close();
      renderExamDate();
      render();
      toast(value ? "Exam date saved." : "Exam date cleared.");
    });
  }

  function clearLocalProgress() {
    localState = defaultState();
    practiceSession = null;
    cardSession = null;
    examSession = null;
    lastExamResult = null;
    lastPracticeSummary = null;
    clearPracticeState();
    clearActiveExam();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) { /* ignore */ }
    save();
  }

  function openReset() {
    var on = !!(syncConfig && SYNC);
    var dialog = openDialog({
      title: on ? "Reset progress?" : "Reset all progress?",
      body: on
        ? "<p><strong>Reset this device</strong> clears this browser's answers and sends the empty sheet to sync. Your other devices keep their progress.</p><p><strong>Reset everything</strong> also deletes the synced account. Other devices may re-upload their local copies if they sync again.</p>"
        : "<p>This deletes every answer, flashcard schedule, bookmark, and mock result stored in this browser. It cannot be undone.</p>",
      actions: on
        ? '<button type="button" class="btn btn--ghost btn--small" data-close>Keep my progress</button>' +
          '<button type="button" class="btn btn--ghost btn--small" data-confirm-reset-device>Reset this device</button>' +
          '<button type="button" class="btn btn--signal btn--small" data-confirm-reset-all>Reset everything</button>'
        : '<button type="button" class="btn btn--ghost btn--small" data-close>Keep my progress</button>' +
          '<button type="button" class="btn btn--signal btn--small" data-confirm-reset>Reset everything</button>'
    });

    if (!on) {
      dialog.querySelector("[data-confirm-reset]").addEventListener("click", function () {
        dialog.close();
        clearLocalProgress();
        render();
        toast("Progress reset. A clean sheet.");
      });
      return;
    }

    dialog.querySelector("[data-confirm-reset-device]").addEventListener("click", function () {
      dialog.close();
      clearLocalProgress();
      render();
      toast("This device was reset. Other synced devices keep their progress.");
    });

    dialog.querySelector("[data-confirm-reset-all]").addEventListener("click", async function () {
      dialog.close();
      var config = syncConfig;
      try {
        await SYNC.deleteAccount(config);
      } catch (err) {
        toast(err.message || "Could not delete the synced data.");
        return;
      }
      syncConfig = null;
      SYNC.clearConfig();
      SYNC.clearCache();
      remoteStates = {};
      syncStatus = { state: "idle", lastError: null, devices: 0, lastSyncAt: null };
      clearLocalProgress();
      render();
      toast("All synced progress was deleted.");
    });
  }

  /* ---------------------------------------------------------------- session */

  function clearTick() {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
  }

  function bindPracticeKeys() {
    /* Global key handler covers practice and exam. */
  }

  document.addEventListener("keydown", function (event) {
    var tag = (event.target && event.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (document.querySelector("dialog[open]")) return;

    var route = routeFor(parseRoute(location.hash).parts);

    if (route.name === "practiceSession" && practiceSession) {
      var item = practiceItem();
      if (!item) return;
      var key = event.key.toLowerCase();
      if (!item.submitted) {
        if (["1", "2", "3", "4"].indexOf(key) !== -1) {
          event.preventDefault();
          item.picked = Number(key) - 1;
          savePracticeState();
          repaintPractice();
          focusSoon(".option.is-selected");
        } else if (["a", "b", "c", "d"].indexOf(key) !== -1) {
          event.preventDefault();
          item.picked = "abcd".indexOf(key);
          savePracticeState();
          repaintPractice();
          focusSoon(".option.is-selected");
        } else if (event.key === "Enter") {
          event.preventDefault();
          submitPracticeAnswer();
        }
      } else if (event.key === "Enter") {
        event.preventDefault();
        nextPractice();
      }
      if (key === "b") {
        event.preventDefault();
        toggleBookmark(item.q.id);
        repaintPractice();
        focusSoon("[data-bookmark]");
      }
    }

    if (route.name === "cardsSession" && cardSession) {
      var cardKey = event.key.toLowerCase();
      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        cardSession.flipped = !cardSession.flipped;
        repaintCards();
        focusSoon(".flashcard");
      } else if (cardKey === "1" && cardSession.flipped) {
        event.preventDefault();
        gradeCard("again");
      } else if (cardKey === "2" && cardSession.flipped) {
        event.preventDefault();
        gradeCard("good");
      }
    }

    if (route.name === "examRun" && examSession) {
      var ek = event.key.toLowerCase();
      if (["1", "2", "3", "4"].indexOf(ek) !== -1) {
        event.preventDefault();
        var q = QID[examSession.questions[examSession.index]];
        if (q) {
          examSession.answers[q.id] = Number(ek) - 1;
          saveActiveExam();
          repaintExam();
          focusSoon(".option.is-selected");
        }
      } else if (event.key === "ArrowLeft" && !examSession.strict && examSession.index > 0) {
        event.preventDefault();
        examSession.index -= 1;
        saveActiveExam();
        repaintExam();
        window.scrollTo(0, 0);
        focusSoon(".option");
      } else if (event.key === "ArrowRight" && examSession.index < examSession.questions.length - 1) {
        event.preventDefault();
        examSession.index += 1;
        saveActiveExam();
        repaintExam();
        window.scrollTo(0, 0);
        focusSoon(".option");
      } else if (ek === "f" && !examSession.strict) {
        event.preventDefault();
        var cq = QID[examSession.questions[examSession.index]];
        if (cq) {
          examSession.flags[cq.id] = !examSession.flags[cq.id];
          saveActiveExam();
          repaintExam();
          focusSoon("[data-exam-flag]");
        }
      }
    }
  });

  function toggleBookmark(id) {
    var current = state.bookmarks[id];
    var next = !(current && current.on);
    localState.bookmarks[id] = { on: next, at: Date.now() };
    toast(next ? "Saved to your bookmarks." : "Removed from bookmarks.");
    save();
  }

  function nextPractice() {
    if (!practiceSession) return;
    if (!practiceItem().submitted) return;
    if (practiceSession.index >= practiceSession.items.length - 1) {
      finishPractice();
    } else {
      practiceSession.index += 1;
      savePracticeState();
      repaintPractice();
      window.scrollTo(0, 0);
      focusSoon(".option");
    }
  }

  /* ------------------------------------------------------------- delegation */

  view.addEventListener("click", function (event) {
    var start = event.target.closest("[data-start]");
    if (start) {
      event.preventDefault();
      startPractice(start.getAttribute("data-start"), start.getAttribute("data-domain"));
      return;
    }

    var cardsStart = event.target.closest("[data-cards-start]");
    if (cardsStart) {
      event.preventDefault();
      startCards(cardsStart.getAttribute("data-domain"), cardsStart.getAttribute("data-cards-start"));
      return;
    }

    if (event.target.closest("[data-restart-cards]")) {
      event.preventDefault();
      var first = cardSession && cardSession.queue[0];
      startCards(first ? first.d : null, "all");
      return;
    }

    if (event.target.closest("[data-pack-import]")) {
      event.preventDefault();
      var packInput = document.getElementById("pack-import");
      if (packInput) packInput.click();
      return;
    }

    if (event.target.closest("[data-pack-remove]")) {
      event.preventDefault();
      removePack();
      return;
    }

    if (event.target.closest("[data-export-progress]")) {
      event.preventDefault();
      exportProgress();
      return;
    }

    if (event.target.closest("[data-import-progress]")) {
      event.preventDefault();
      var importInput = document.getElementById("progress-import");
      if (importInput) importInput.click();
      return;
    }

    if (event.target.closest("[data-set-exam-date]")) {
      event.preventDefault();
      openExamDate();
      return;
    }

    if (event.target.closest("[data-reset]")) {
      event.preventDefault();
      openReset();
      return;
    }

    if (event.target.closest("[data-sync-create]")) {
      event.preventDefault();
      openSyncCreate();
      return;
    }

    if (event.target.closest("[data-sync-join]")) {
      event.preventDefault();
      openSyncJoin();
      return;
    }

    if (event.target.closest("[data-sync-now]")) {
      event.preventDefault();
      syncNow(true);
      return;
    }

    if (event.target.closest("[data-sync-toggle-code]")) {
      event.preventDefault();
      syncShowCode = !syncShowCode;
      refreshSyncPanel();
      return;
    }

    if (event.target.closest("[data-sync-copy]")) {
      event.preventDefault();
      copySyncCode();
      return;
    }

    if (event.target.closest("[data-sync-lock]")) {
      event.preventDefault();
      openSyncLock();
      return;
    }

    if (event.target.closest("[data-sync-disable]")) {
      event.preventDefault();
      openSyncDisable();
      return;
    }

    if (event.target.closest("[data-sync-delete]")) {
      event.preventDefault();
      openSyncDelete();
      return;
    }

    if (event.target.closest("[data-quit]")) {
      practiceSession = null;
      clearPracticeState();
      return;
    }

    if (event.target.closest("[data-practice-discard]")) {
      practiceSession = null;
      clearPracticeState();
      render();
      toast("Paused drill discarded.");
      return;
    }

    var option = event.target.closest("[data-option]");
    if (option && practiceSession) {
      var item = practiceItem();
      if (!item || item.submitted) return;
      item.picked = Number(option.getAttribute("data-option"));
      savePracticeState();
      repaintPractice();
      focusSoon(".option.is-selected");
      return;
    }

    if (event.target.closest("[data-submit]") && practiceSession) {
      submitPracticeAnswer();
      return;
    }

    if (event.target.closest("[data-next]") && practiceSession) {
      nextPractice();
      return;
    }

    if (event.target.closest("[data-bookmark]") && practiceSession) {
      var current = practiceItem();
      if (current) {
        toggleBookmark(current.q.id);
        repaintPractice();
        focusSoon("[data-bookmark]");
      }
      return;
    }

    if (event.target.closest("[data-flip]") && cardSession) {
      cardSession.flipped = !cardSession.flipped;
      repaintCards();
      focusSoon(".flashcard");
      return;
    }

    var grade = event.target.closest("[data-grade]");
    if (grade && cardSession) {
      gradeCard(grade.getAttribute("data-grade"));
      return;
    }

    if (event.target.closest("[data-exam-start-pack]")) {
      startExam("pack");
      return;
    }

    if (event.target.closest("[data-exam-start]")) {
      startExam();
      return;
    }

    if (event.target.closest("[data-exam-discard]")) {
      var confirmDiscard = openDialog({
        title: "Discard this attempt?",
        body: "<p>The timer will stop and no result will be recorded. Any answers already given stay in your question log.</p>",
        actions: '<button type="button" class="btn btn--ghost btn--small" data-close>Keep the attempt</button><button type="button" class="btn btn--signal btn--small" data-confirm-discard>Discard</button>'
      });
      confirmDiscard.querySelector("[data-confirm-discard]").addEventListener("click", function () {
        examSession = null;
        clearTick();
        clearActiveExam();
        confirmDiscard.close();
        render();
        toast("Attempt discarded.");
      });
      return;
    }

    var examOption = event.target.closest("[data-exam-option]");
    if (examOption && examSession) {
      var eq = QID[examSession.questions[examSession.index]];
      if (eq) {
        examSession.answers[eq.id] = Number(examOption.getAttribute("data-exam-option"));
        saveActiveExam();
        repaintExam();
        focusSoon(".option.is-selected");
      }
      return;
    }

    if (event.target.closest("[data-exam-next]") && examSession) {
      if (examSession.index < examSession.questions.length - 1) {
        examSession.index += 1;
        saveActiveExam();
        repaintExam();
        window.scrollTo(0, 0);
        focusSoon(".option");
      }
      return;
    }

    if (event.target.closest("[data-exam-prev]") && examSession) {
      if (examSession.index > 0) {
        examSession.index -= 1;
        saveActiveExam();
        repaintExam();
        window.scrollTo(0, 0);
        focusSoon(".option");
      }
      return;
    }

    if (event.target.closest("[data-exam-flag]") && examSession) {
      var fq = QID[examSession.questions[examSession.index]];
      if (fq) {
        examSession.flags[fq.id] = !examSession.flags[fq.id];
        saveActiveExam();
        repaintExam();
        focusSoon("[data-exam-flag]");
      }
      return;
    }

    if (event.target.closest("[data-exam-palette]") && examSession) {
      openPalette();
      return;
    }

    if (event.target.closest("[data-exam-submit]") && examSession) {
      openExamSubmit();
      return;
    }
  });

  /* --------------------------------------------------------------- lifecycle */

  document.addEventListener("change", function (event) {
    if (!event.target) return;
    if (event.target.id === "pack-import") {
      var packFile = event.target.files && event.target.files[0];
      event.target.value = "";
      if (packFile) importPackFile(packFile);
      return;
    }
    if (event.target.id === "progress-import") {
      var progressFile = event.target.files && event.target.files[0];
      event.target.value = "";
      if (progressFile) importProgressFile(progressFile);
    }
  });

  function handleHashChange() {
    closeSpine();
    render();
  }

  window.addEventListener("hashchange", handleHashChange);

  menuButton.addEventListener("click", function () {
    if (spine.classList.contains("is-open")) closeSpine();
    else openSpine();
  });
  spine.addEventListener("click", function (event) {
    if (event.target.closest("[data-set-exam-date]")) {
      event.preventDefault();
      openExamDate();
    }
  });
  document.getElementById("spine-close").addEventListener("click", closeSpine);
  scrim.addEventListener("click", closeSpine);
  spine.addEventListener("keydown", function (event) {
    if (event.key !== "Tab" || !spine.classList.contains("is-open")) return;
    var focusable = Array.prototype.slice.call(spine.querySelectorAll('a[href], button:not([disabled])'));
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && spine.classList.contains("is-open")) closeSpine();
  });

  window.addEventListener("beforeunload", function (event) {
    if (examSession && !examSession.submitted) {
      event.preventDefault();
      event.returnValue = "";
    }
  });

  if (location.hash === "#/") {
    history.replaceState(null, "", location.pathname + location.search);
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-text-dec]"), function (button) {
    button.addEventListener("click", function () { changeTextScale(-1); });
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-text-inc]"), function (button) {
    button.addEventListener("click", function () { changeTextScale(1); });
  });
  applyTextScale();

  render();

  if (syncConfig && SYNC) {
    setTimeout(function () { syncNow(false); }, 700);
  }

  window.addEventListener("online", function () {
    if (syncConfig && SYNC) syncNow(false);
  });

  document.addEventListener("visibilitychange", function () {
    if (syncConfig && SYNC) syncNow(false);
  });

  window.addEventListener("storage", function (event) {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        var parsed = JSON.parse(event.newValue);
        localState = sanitizeState(parsed);
        if (parsed && parsed.lastSummary && typeof parsed.lastSummary === "object") {
          localState.lastSummary = parsed.lastSummary;
        }
        rebuildState();
        if (!hasActiveSession() && !document.querySelector("dialog[open]")) render();
      } catch (err) { /* ignore a malformed write from another tab */ }
      return;
    }
    if (SYNC && event.key === SYNC.CONFIG_KEY) {
      syncConfig = SYNC.loadConfig();
      remoteStates = syncConfig ? SYNC.loadCachedStates() : {};
      rebuildState();
      if (!hasActiveSession() && !document.querySelector("dialog[open]")) render();
      if (syncConfig) setTimeout(function () { syncNow(false); }, 300);
    }
  });
})();
