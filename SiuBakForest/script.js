"use strict";

const CONFIG = {
  requiredGems: 4,
  progressKey: "siuBakForestProgress",
  soundKey: "siuBakForestSound",
  identityKey: "siuBakForestIdentity",
  calmKey: "siuBakForestCalm",
  recordsKey: "siuBakForestRecords",
  wishKey: "siuBakForestWishes",
  celebrationVolume: 0.24,
  characters: {
    fire: "Siu Bak",
    water: "Siu Gai Mo"
  }
};

const platform = (x, y, w, h = 22, kind = "stone") => ({ x, y, w, h, kind });
const pool = (x, w, type) => ({ x, y: 642, w, h: 48, type });
const moving = (x, y, w, h, axis, range, speed, phase) => ({ x, y, baseX: x, baseY: y, w, h, axis, range, speed, phase, dx: 0, dy: 0, kind: "moving" });
const launchPad = (x, y, w, speed) => ({ x, y, w, h: 12, speed });
const heartGate = (firstX, secondX) => ({ firstX, secondX, open: false });
const saw = (x, y, range, speed, phase, r = 22) => ({ x, y, baseX: x, range, speed, phase, r, type: "spore" });
const spikes = (x, y, w, h = 32) => ({ x, y, w, h });
const checkpoint = (x, y) => ({ x, y, active: false });
const wish = (x, y) => ({ x, y, taken: false });

const LEVELS = [
  {
    name: "Fern Hollow",
    subtitle: "Find your rhythm",
    skyTop: "#0a2925",
    skyBottom: "#173f32",
    accent: "#7fd08d",
    platforms: [
      platform(235, 555, 84, 95, "fern-pier"),
      platform(395, 475, 78, 175, "fern-pier"),
      platform(525, 545, 80, 105, "fern-step"),
      platform(685, 465, 78, 185, "fern-pier"),
      platform(835, 520, 175, 22, "root-bridge")
    ],
    pools: [
      pool(205, 115, "fire"),
      pool(340, 120, "water"),
      pool(500, 110, "fire"),
      pool(625, 115, "water"),
      pool(770, 110, "fire")
    ],
    gems: [
      { x: 255, y: 529, type: "fire" },
      { x: 300, y: 529, type: "water" },
      { x: 415, y: 449, type: "fire" },
      { x: 455, y: 449, type: "water" },
      { x: 545, y: 519, type: "fire" },
      { x: 585, y: 519, type: "water" },
      { x: 860, y: 494, type: "fire" },
      { x: 980, y: 494, type: "water" }
    ],
    wishes: [
      wish(435, 440),
      wish(700, 439),
      wish(940, 494)
    ],
    checkpoints: [checkpoint(920, 520)],
    moving: [],
    launchPads: [],
    spikes: [],
    saws: []
  },
  {
    name: "Twin Falls",
    subtitle: "Trust the other path",
    skyTop: "#08262c",
    skyBottom: "#17464a",
    accent: "#6ed9d6",
    platforms: [
      platform(220, 545, 80, 105, "fall-pier"),
      platform(350, 465, 80, 185, "fall-pier"),
      platform(500, 385, 80, 265, "fall-pier"),
      platform(880, 425, 80, 225, "fall-pier"),
      platform(1000, 500, 130, 22, "bridge-root")
    ],
    pools: [
      pool(215, 180, "fire"),
      pool(415, 180, "water"),
      pool(615, 180, "fire"),
      pool(815, 175, "water")
    ],
    gems: [
      { x: 245, y: 519, type: "fire" },
      { x: 275, y: 519, type: "water" },
      { x: 370, y: 439, type: "fire" },
      { x: 410, y: 439, type: "water" },
      { x: 520, y: 359, type: "fire" },
      { x: 560, y: 359, type: "water" },
      { x: 900, y: 399, type: "fire" },
      { x: 940, y: 399, type: "water" }
    ],
    wishes: [
      wish(390, 439),
      wish(540, 359),
      wish(1070, 474)
    ],
    checkpoints: [checkpoint(1050, 500)],
    moving: [
      moving(665, 385, 120, 20, "x", 85, 0.72, 3.1)
    ],
    launchPads: [],
    spikes: [],
    saws: []
  },
  {
    name: "Moss Cathedral",
    subtitle: "Move together",
    skyTop: "#10251e",
    skyBottom: "#29482a",
    accent: "#a7d77d",
    platforms: [
      platform(215, 555, 90, 95, "moss-pier"),
      platform(345, 475, 86, 175, "moss-pier"),
      platform(720, 390, 100, 22, "choir-ledge"),
      platform(890, 420, 86, 230, "moss-pier"),
      platform(1010, 500, 120, 22, "root-exit")
    ],
    pools: [
      pool(275, 120, "water"),
      pool(455, 145, "fire"),
      pool(665, 135, "water"),
      pool(835, 145, "fire")
    ],
    gems: [
      { x: 235, y: 529, type: "fire" },
      { x: 280, y: 529, type: "water" },
      { x: 365, y: 449, type: "fire" },
      { x: 410, y: 449, type: "water" },
      { x: 740, y: 364, type: "fire" },
      { x: 800, y: 364, type: "water" },
      { x: 910, y: 394, type: "fire" },
      { x: 955, y: 394, type: "water" }
    ],
    wishes: [
      wish(420, 430),
      wish(805, 350),
      wish(1080, 470)
    ],
    checkpoints: [checkpoint(1060, 500)],
    moving: [
      moving(520, 500, 120, 20, "y", 80, 0.78, 0.3)
    ],
    launchPads: [],
    spikes: [],
    saws: []
  },
  {
    name: "Clockwork Canopy",
    subtitle: "Watch the forest breathe",
    skyTop: "#171d2d",
    skyBottom: "#343049",
    accent: "#c5b7ff",
    platforms: [
      platform(210, 555, 80, 95, "gear-pier"),
      platform(585, 455, 110, 195, "gear-pier"),
      platform(740, 245, 100, 22, "clock-deck"),
      platform(1010, 450, 85, 200, "gear-pier"),
      platform(335, 600, 170, 18, "escapement")
    ],
    pools: [
      pool(270, 130, "water"),
      pool(420, 140, "fire"),
      pool(600, 130, "water"),
      pool(760, 130, "fire"),
      pool(910, 80, "water")
    ],
    gems: [
      { x: 230, y: 529, type: "fire" },
      { x: 270, y: 529, type: "water" },
      { x: 610, y: 429, type: "fire" },
      { x: 665, y: 429, type: "water" },
      { x: 755, y: 219, type: "fire" },
      { x: 815, y: 219, type: "water" },
      { x: 1030, y: 424, type: "fire" },
      { x: 1070, y: 424, type: "water" }
    ],
    wishes: [
      wish(260, 500),
      wish(815, 190),
      wish(1085, 400)
    ],
    checkpoints: [checkpoint(1050, 450)],
    moving: [
      moving(380, 500, 110, 20, "x", 80, 0.95, 4.3),
      moving(850, 330, 100, 20, "y", 80, 0.78, 0.82)
    ],
    launchPads: [
      launchPad(585, 455, 56, 860)
    ],
    spikes: [
      spikes(390, 568, 56, 32)
    ],
    saws: [
      saw(720, 330, 70, 0.85, 4.3, 20),
      saw(900, 525, 55, 0.75, 2.2, 18)
    ]
  },
  {
    name: "Heart of the Forest",
    subtitle: "One last path for two",
    skyTop: "#251a25",
    skyBottom: "#553037",
    accent: "#ffc48c",
    platforms: [
      platform(210, 555, 85, 95, "heart-pier"),
      platform(610, 430, 115, 220, "heart-cleft"),
      platform(760, 225, 100, 20, "heart-tip"),
      platform(1038, 450, 102, 22, "heart-dais")
    ],
    pools: [
      pool(205, 130, "fire"),
      pool(355, 145, "water"),
      pool(520, 160, "fire"),
      pool(705, 135, "water"),
      pool(860, 130, "fire")
    ],
    gems: [
      { x: 235, y: 529, type: "fire" },
      { x: 270, y: 529, type: "water" },
      { x: 635, y: 404, type: "fire" },
      { x: 700, y: 404, type: "water" },
      { x: 785, y: 199, type: "fire" },
      { x: 835, y: 199, type: "water" },
      { x: 1050, y: 424, type: "fire" },
      { x: 1110, y: 424, type: "water" }
    ],
    wishes: [
      wish(260, 500),
      wish(810, 180),
      wish(1115, 410)
    ],
    checkpoints: [checkpoint(1070, 450)],
    moving: [
      moving(395, 500, 110, 20, "x", 85, 1, 4.21),
      moving(930, 285, 100, 20, "y", 100, 0.75, 1.04)
    ],
    launchPads: [
      launchPad(617, 430, 56, 840)
    ],
    heartGate: heartGate(1080, 1115),
    spikes: [],
    saws: [
      saw(750, 300, 80, 0.82, 4.9, 20)
    ]
  }
];

const VALID_WISH_IDS = new Set(
  LEVELS.flatMap((level, levelIndex) => level.wishes.map((_, wishIndex) => `${levelIndex + 1}-${wishIndex + 1}`))
);

const MEMORIES = [
  { title: "The first hello", text: "A first hello became my favourite beginning." },
  { title: "Your kind of happy", text: "Your laugh makes ordinary days brighter." },
  { title: "A soft place", text: "I still feel lucky that I found you." },
  { title: "Mayday with you", text: "Three songs, one very good company." },
  { title: "Our first trip", text: "Even the journey felt like a date with you." },
  { title: "Little adventures", text: "You make every small plan feel like an occasion." },
  { title: "Officially us", text: "The moment I asked you to be mine." },
  { title: "Fireworks in Japan", text: "The fireworks were beautiful, but you beside me were the best part." },
  { title: "Life, your way", text: "I love how fully you throw yourself into life." },
  { title: "Growing softer", text: "Thank you for letting me see your softer side." },
  { title: "A shared rhythm", text: "We found a way to make ordinary Tuesdays feel special." },
  { title: "Together, moving", text: "Every new place feels better when I get to explore it with you." },
  { title: "The next chapter", text: "I hope this year loves you back as much as you love everyone around you." },
  { title: "Little sparks", text: "The small surprises you bring are some of my favourite parts." },
  { title: "Forever yours", text: "I am still excited for every ordinary day with you." }
];

const COLORS = {
  paper: "#fff1b8",
  fire: "#ff6b3d",
  fireLight: "#ffd166",
  water: "#45c8df",
  waterLight: "#b8f4f5",
  moss: "#70b66f",
  ink: "#071a18"
};

const VIEW_WIDTH = 1280;
const VIEW_HEIGHT = 720;
const PLAYER_WIDTH = 34;
const PLAYER_HEIGHT = 52;
const GRAVITY = 1500;
const MOVE_SPEED = 245;
const JUMP_SPEED = 635;
const FLOOR_Y = 650;
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (id) => document.getElementById(id);
const canvas = $("game");
const ctx = canvas.getContext("2d");
const screens = {
  intro: $("intro-screen"),
  pause: $("pause-screen"),
  clear: $("clear-screen"),
  final: $("final-screen"),
  memory: $("memory-screen")
};

let renderScale = 1;

function resizeCanvas() {
  const bounds = canvas.getBoundingClientRect();
  const displayWidth = bounds.width || VIEW_WIDTH;
  const displayHeight = bounds.height || VIEW_HEIGHT;
  const pixelRatio = window.devicePixelRatio || 1;
  const coverScale = Math.max(displayWidth / VIEW_WIDTH, displayHeight / VIEW_HEIGHT);
  renderScale = clamp(coverScale * pixelRatio, 1, 3);
  const width = Math.round(VIEW_WIDTH * renderScale);
  const height = Math.round(VIEW_HEIGHT * renderScale);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
  ctx.imageSmoothingEnabled = true;
}

resizeCanvas();

let state = "intro";
let levelIndex = 0;
let level = null;
let players = [];
let particles = [];
let completedLevels = clamp(Math.floor(readNumber(CONFIG.progressKey, 0)), 0, LEVELS.length);
let collectedWishKeys = new Set(readStringArray(CONFIG.wishKey).filter((key) => VALID_WISH_IDS.has(key)));
let totalFireflies = Math.min(collectedWishKeys.size, LEVELS.length * 3);
let soundEnabled = readBoolean(CONFIG.soundKey, true);
let calmMode = readBoolean(CONFIG.calmKey, false);
let records = readRecords(CONFIG.recordsKey);
const savedIdentity = readString(CONFIG.identityKey, "fire");
let identityType = ["fire", "water"].includes(savedIdentity) ? savedIdentity : "fire";
let levelTime = 0;
let levelStartedAt = performance.now();
let levelResets = 0;
let previousFocus = null;
let visualTime = 0;
let renderClock = 0;
let lastFrame = performance.now();
let toastTimer = 0;
let cameraShake = 0;
let cameraOffset = 0;
let flash = 0;
let audioContext = null;
let activePointerInputs = new Map();

const query = new URLSearchParams(window.location.search);
const skipValue = (query.get("skip") || query.get("final") || "").toLowerCase();
const levelValue = query.get("level") || (/^\d+$/.test(query.get("skip") || "") ? query.get("skip") : null);
const parsedLevel = Number(levelValue);
const hasRequestedLevel = levelValue !== null && Number.isFinite(parsedLevel);
const requestedLevel = clamp(Math.round(parsedLevel || 1) - 1, 0, LEVELS.length - 1);
const finalPreview = ["1", "true", "yes", "final"].includes(skipValue);
const fireflyPreview = query.has("fireflies")
  ? clamp(Math.round(Number(query.get("fireflies")) || 0), 0, LEVELS.length * 3)
  : null;

const keys = new Set();
const touch = {
  fire: { left: false, right: false, jump: false },
  water: { left: false, right: false, jump: false }
};

const bindings = {
  fire: {
    left: ["ArrowLeft"],
    right: ["ArrowRight"],
    jump: ["ArrowUp", "Space"]
  },
  water: {
    left: ["KeyA"],
    right: ["KeyD"],
    jump: ["KeyW"]
  }
};

const random = seededRandom(8617);
const stars = Array.from({ length: 72 }, () => ({
  x: random() * VIEW_WIDTH,
  y: 25 + random() * 350,
  radius: 0.5 + random() * 1.4,
  phase: random() * Math.PI * 2,
  speed: 0.6 + random() * 1.4
}));

const fireflies = Array.from({ length: 34 }, () => ({
  x: random() * VIEW_WIDTH,
  y: 160 + random() * 430,
  range: 8 + random() * 24,
  phase: random() * Math.PI * 2,
  speed: 0.35 + random() * 0.8,
  radius: 1.3 + random() * 2
}));

const fallingLeaves = Array.from({ length: 18 }, () => ({
  x: random() * VIEW_WIDTH,
  y: random() * VIEW_HEIGHT,
  speed: 12 + random() * 20,
  drift: 8 + random() * 18,
  phase: random() * Math.PI * 2,
  size: 3 + random() * 4,
  color: random() > 0.5 ? "#8fb77b" : "#d39a6a"
}));

const farTrees = Array.from({ length: 18 }, (_, index) => ({
  x: index * 82 - 35,
  height: 170 + random() * 150,
  width: 72 + random() * 68,
  lean: (random() - 0.5) * 0.14
}));

const midTrees = Array.from({ length: 13 }, (_, index) => ({
  x: index * 118 - 40,
  height: 205 + random() * 185,
  width: 100 + random() * 78,
  lean: (random() - 0.5) * 0.12
}));

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function readNumber(key, fallback) {
  try {
    const value = Number(window.localStorage.getItem(key));
    return Number.isFinite(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function readString(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

function readStringArray(key) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function readBoolean(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value === "true";
  } catch {
    return fallback;
  }
}

function readRecords(key) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function saveValue(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    return;
  }
}

function saveStringArray(key, values) {
  try {
    const merged = new Set(readStringArray(key).filter((item) => VALID_WISH_IDS.has(item)));
    values.forEach((item) => merged.add(item));
    window.localStorage.setItem(key, JSON.stringify([...merged]));
  } catch {
    return;
  }
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function approach(current, target, amount) {
  if (current < target) return Math.min(current + amount, target);
  if (current > target) return Math.max(current - amount, target);
  return target;
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function createPlayer(type, x) {
  return {
    type,
    name: CONFIG.characters[type],
    x,
    y: 575,
    w: PLAYER_WIDTH,
    h: PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    facing: 1,
    grounded: false,
    groundId: null,
    coyote: 0,
    invulnerable: 0,
    collected: 0,
    animation: 0,
    jumpBuffer: 0,
    spawn: { x, y: 575 }
  };
}

function setIdentity(nextType, persist = true) {
  identityType = nextType === "water" ? "water" : "fire";
  CONFIG.characters.fire = identityType === "fire" ? "Siu Bak" : "Siu Gai Mo";
  CONFIG.characters.water = identityType === "water" ? "Siu Bak" : "Siu Gai Mo";
  if (persist) saveValue(CONFIG.identityKey, identityType);

  document.querySelectorAll('input[name="character-colour"]').forEach((input) => {
    input.checked = input.value === identityType;
  });

  $("fire-hero-name").textContent = CONFIG.characters.fire;
  $("water-hero-name").textContent = CONFIG.characters.water;
  $("fire-rule-name").textContent = CONFIG.characters.fire;
  $("water-rule-name").textContent = CONFIG.characters.water;
  $("fire-key-name").textContent = CONFIG.characters.fire;
  $("water-key-name").textContent = CONFIG.characters.water;
  $("fire-touch-name").textContent = CONFIG.characters.fire;
  $("water-touch-name").textContent = CONFIG.characters.water;
  $("fire-legend-name").textContent = CONFIG.characters.fire;
  $("water-legend-name").textContent = CONFIG.characters.water;

  document.querySelectorAll(".touch-controls button[data-player]").forEach((button) => {
    const name = CONFIG.characters[button.dataset.player];
    const action = button.dataset.action;
    button.setAttribute("aria-label", action === "jump" ? `Jump ${name}` : `Move ${name} ${action}`);
  });

  players.forEach((player) => {
    player.name = CONFIG.characters[player.type];
  });
}

function setCalmMode(enabled) {
  calmMode = Boolean(enabled);
  saveValue(CONFIG.calmKey, calmMode);
  $("calm-mode").checked = calmMode;
  document.body.dataset.calmMode = String(calmMode);
  announceStatus(calmMode ? "Calm Mode enabled. Hazards move more gently." : "Standard Mode enabled.");
}

function loadLevel(index) {
  levelIndex = index;
  level = JSON.parse(JSON.stringify(LEVELS[index]));
  level.ground = {
    id: "ground",
    x: 0,
    y: FLOOR_Y,
    w: VIEW_WIDTH,
    h: VIEW_HEIGHT - FLOOR_Y,
    prevY: FLOOR_Y,
    dx: 0,
    dy: 0,
    kind: "ground"
  };
  level.lastDoorHint = -Infinity;
  level.wishes = level.wishes || [];
  level.checkpoints = level.checkpoints || [];
  level.launchPads = level.launchPads || [];
  level.heartGate = level.heartGate || null;
  if (level.heartGate) {
    level.heartGate.open = false;
    level.heartGate.lastHint = -Infinity;
  }
  level.fireflies = 0;
  level.syncCount = 0;
  level.lastGemPickup = null;
  level.wishes.forEach((item, wishIndex) => {
    const memory = MEMORIES[levelIndex * 3 + wishIndex];
    item.title = memory?.title || "A little memory";
    item.text = memory?.text || "A small moment worth keeping.";
    item.taken = false;
  });
  level.checkpoints.forEach((item) => {
    item.active = false;
  });
  level.platforms.forEach((item, itemIndex) => {
    item.id = `solid-${itemIndex}`;
    item.prevY = item.y;
    item.dx = 0;
    item.dy = 0;
  });
  level.moving.forEach((item, itemIndex) => {
    item.id = `moving-${itemIndex}`;
    const offset = Math.sin(item.phase) * item.range;
    item.x = item.baseX + (item.axis === "x" ? offset : 0);
    item.y = item.baseY + (item.axis === "y" ? offset : 0);
    item.prevX = item.x;
    item.prevY = item.y;
  });
  level.saws.forEach((item) => {
    item.x = item.baseX + Math.sin(item.phase) * item.range;
  });
  level.gems.forEach((item) => {
    item.taken = false;
  });
  players = [createPlayer("fire", 82), createPlayer("water", 168)];
  cameraOffset = getCameraTarget();
  levelTime = 0;
  levelStartedAt = performance.now();
  levelResets = 0;
  cameraShake = 0;
  flash = 0;
  particles = [];
  updateInterface();
  showToast(level.subtitle, 2200);
}

function getSolids() {
  return [level.ground].concat(level.platforms, level.moving);
}

function updateMovingPlatforms() {
  level.moving.forEach((item) => {
    item.prevX = item.x;
    item.prevY = item.y;
    const offset = Math.sin(levelTime * (calmMode ? 0.65 : 1) * item.speed + item.phase) * item.range;
    item.x = item.baseX + (item.axis === "x" ? offset : 0);
    item.y = item.baseY + (item.axis === "y" ? offset : 0);
    item.dx = item.x - item.prevX;
    item.dy = item.y - item.prevY;
  });
}

function updateSaws() {
  level.saws.forEach((item) => {
    item.x = item.baseX + Math.sin(levelTime * (calmMode ? 0.65 : 1) * item.speed + item.phase) * item.range;
  });
}

function actionActive(type, action) {
  const keyActive = bindings[type][action].some((code) => keys.has(code));
  return keyActive || touch[type][action];
}

function updatePlayer(player, delta) {
  const solids = getSolids();
  const wasGrounded = player.grounded;
  const support = wasGrounded ? solids.find((item) => item.id === player.groundId) : null;
  const direction = Number(actionActive(player.type, "right")) - Number(actionActive(player.type, "left"));
  const targetSpeed = direction * MOVE_SPEED;

  player.vx = approach(player.vx, targetSpeed, (player.grounded ? 2100 : 1450) * delta);
  if (direction !== 0) player.facing = direction;

  if (wasGrounded) {
    player.coyote = 0.11;
  } else {
    player.coyote = Math.max(0, player.coyote - delta);
  }

  player.jumpBuffer = Math.max(0, player.jumpBuffer - delta);
  if (player.jumpBuffer > 0 && (wasGrounded || player.coyote > 0)) {
    player.jumpBuffer = 0;
    player.vy = -JUMP_SPEED;
    player.grounded = false;
    player.groundId = null;
    player.coyote = 0;
    spawnBurst(player.x + player.w / 2, player.y + player.h, player.type === "fire" ? COLORS.fire : COLORS.water, 7, 90, "dot");
    playTone(player.type === "fire" ? 300 : 390, "sine", 0.11, 0.035, player.type === "fire" ? 450 : 590, 0);
  }

  if (support && wasGrounded) {
    player.x += support.dx;
    player.y += support.dy;
  }

  player.x += player.vx * delta;
  for (const solid of solids) {
    if (!overlaps(player, solid)) continue;
    if (player.vx > 0) {
      player.x = solid.x - player.w;
      player.vx = 0;
    } else if (player.vx < 0) {
      player.x = solid.x + solid.w;
      player.vx = 0;
    }
  }

  const oldY = player.y;
  player.vy = Math.min(player.vy + GRAVITY * delta, 820);
  player.y += player.vy * delta;
  player.grounded = false;
  player.groundId = null;

  for (const solid of solids) {
    const horizontal = player.x + player.w > solid.x + 1 && player.x < solid.x + solid.w - 1;
    if (!horizontal) continue;
    const oldBottom = oldY + player.h;
    const previousTop = solid.prevY ?? solid.y;
    if (player.vy >= 0 && oldBottom <= previousTop + 7 && player.y + player.h >= solid.y) {
      player.y = solid.y - player.h;
      player.vy = 0;
      player.grounded = true;
      player.groundId = solid.id;
    } else if (player.vy < 0 && oldY >= previousTop + (solid.h ?? 22) - 7 && player.y <= solid.y + solid.h) {
      player.y = solid.y + solid.h;
      player.vy = 0;
    }
  }

  for (const pad of level.launchPads) {
    const bottom = player.y + player.h;
    const horizontal = player.x + player.w > pad.x && player.x < pad.x + pad.w;
    if (!player.grounded || !horizontal || Math.abs(bottom - pad.y) > 4) continue;
    player.vy = -pad.speed;
    player.grounded = false;
    player.groundId = null;
    player.coyote = 0;
    player.jumpQueued = false;
    spawnBurst(player.x + player.w / 2, pad.y, COLORS.paper, 20, 150, "spark");
    playTone(260, "triangle", 0.2, 0.04, 720, 0);
    playTone(720, "sine", 0.2, 0.025, 1040, 0.08);
    break;
  }

  if (player.grounded) {
    player.coyote = 0.11;
    player.animation += Math.abs(player.vx) * delta * 0.065;
  }

  player.invulnerable = Math.max(0, player.invulnerable - delta);
  collectGems(player);
  collectWish(player);
  checkHazards(player);

  if (player.y > VIEW_HEIGHT + 90) {
    respawnPlayer(player, "fell into the forest");
  }
}

function collectGems(player) {
  const centerX = player.x + player.w / 2;
  const centerY = player.y + player.h / 2;
  level.gems.forEach((gem) => {
    if (gem.taken || gem.type !== player.type) return;
    const distance = Math.hypot(centerX - gem.x, centerY - gem.y);
    if (distance > 29) return;
    gem.taken = true;
    player.collected = Math.min(CONFIG.requiredGems, player.collected + 1);
    const color = gem.type === "fire" ? COLORS.fire : COLORS.water;
    spawnBurst(gem.x, gem.y, color, 18, 175, "spark");
    cameraShake = Math.max(cameraShake, 2.2);
    playTone(gem.type === "fire" ? 610 : 720, "triangle", 0.15, 0.045, gem.type === "fire" ? 920 : 1080, 0.045);
    const now = performance.now();
    if (level.lastGemPickup && level.lastGemPickup.type !== gem.type && now - level.lastGemPickup.time < 900) {
      level.syncCount += 1;
      spawnBurst((gem.x + level.lastGemPickup.x) / 2, gem.y, COLORS.paper, 14, 120, "spark");
      showToast("Perfect pair · keep moving together", 1400);
    }
    level.lastGemPickup = { type: gem.type, x: gem.x, time: now };
    updateInterface();
    if (player.collected === CONFIG.requiredGems) {
      showToast(`${player.type === "fire" ? "Red" : "Blue"} door is glowing`, 1800);
      playTone(gem.type === "fire" ? 860 : 980, "sine", 0.22, 0.04, gem.type === "fire" ? 1120 : 1280, 0.12);
    }
  });
}

function collectWish(player) {
  const centerX = player.x + player.w / 2;
  const centerY = player.y + player.h / 2;
  level.wishes.forEach((memory, memoryIndex) => {
    if (memory.taken || Math.hypot(centerX - memory.x, centerY - memory.y) > 31) return;
    memory.taken = true;
    level.fireflies = Math.min(3, level.fireflies + 1);
    const wishKey = `${levelIndex + 1}-${memoryIndex + 1}`;
    const isNew = !collectedWishKeys.has(wishKey);
    if (isNew) {
      collectedWishKeys.add(wishKey);
      totalFireflies = Math.min(LEVELS.length * 3, collectedWishKeys.size);
      saveStringArray(CONFIG.wishKey, collectedWishKeys);
    }
    spawnBurst(memory.x, memory.y, COLORS.paper, isNew ? 24 : 12, isNew ? 190 : 110, "spark");
    cameraShake = Math.max(cameraShake, isNew ? 3.4 : 1.6);
    playTone(isNew ? 880 : 660, "sine", 0.24, 0.04, isNew ? 1320 : 790, 0);
    playTone(isNew ? 1320 : 790, "sine", 0.18, 0.025, isNew ? 1760 : 990, 0.09);
    updateInterface();
    showToast(
      level.fireflies === 3
        ? "All three memories are glowing"
        : isNew
          ? `${memory.title} · memory found`
          : `${memory.title} · already glowing`,
      1900
    );
  });
}

function checkCheckpoints() {
  const horizontalRange = calmMode ? 96 : 72;
  const verticalRange = calmMode ? 48 : 34;
  level.checkpoints.forEach((lantern) => {
    if (lantern.active) return;
    const together = players.every((player) => {
      const centerX = player.x + player.w / 2;
      const bottom = player.y + player.h;
      return Math.abs(centerX - lantern.x) < horizontalRange && Math.abs(bottom - lantern.y) < verticalRange;
    });
    if (!together) return;
    lantern.active = true;
    spawnBurst(lantern.x, lantern.y - 58, COLORS.paper, 34, 190, "spark");
    showToast("Shared lantern lit — this is your new starting point", 2100);
    playTone(520, "triangle", 0.2, 0.04, 780, 0);
    playTone(780, "triangle", 0.3, 0.04, 1040, 0.12);
  });
}

function checkHeartGate() {
  const gate = level.heartGate;
  if (!gate || gate.open) return;
  const fire = players.find((player) => player.type === "fire");
  const water = players.find((player) => player.type === "water");
  const near = (player, x) => Math.abs(player.x + player.w / 2 - x) < 32 && player.y + player.h > 620;
  const fireNear = near(fire, gate.firstX);
  const waterNear = near(water, gate.secondX);
  if (fireNear && waterNear) {
    gate.open = true;
    spawnBurst((gate.firstX + gate.secondX) / 2, 550, "#ff8fa8", 42, 180, "spark");
    showToast("Heart gate open — reach the RED and BLUE doors together", 2200);
    playTone(520, "triangle", 0.25, 0.045, 780, 0);
    playTone(780, "triangle", 0.35, 0.04, 1040, 0.12);
    return;
  }
  if ((fireNear || waterNear) && visualTime - gate.lastHint > 3) {
    gate.lastHint = visualTime;
    showToast("Stand on both heart pads together", 1700);
  }
}

function checkHazards(player) {
  for (const hazard of level.pools) {
    if (hazard.type === player.type || !overlaps(player, hazard)) continue;
    respawnPlayer(player, `touched the ${hazard.type} pool`);
    return;
  }

  for (const hazard of level.spikes) {
    if (overlaps(player, hazard)) {
      respawnPlayer(player, "touched the forest thorns");
      return;
    }
  }

  for (const hazard of level.saws) {
    const closestX = clamp(hazard.x, player.x, player.x + player.w);
    const closestY = clamp(hazard.y, player.y, player.y + player.h);
    if (Math.hypot(hazard.x - closestX, hazard.y - closestY) < hazard.r + 3) {
      respawnPlayer(player, "met a moonseed");
      return;
    }
  }
}

function respawnPlayer(player, reason) {
  if (player.invulnerable > 0) return;
  const color = player.type === "fire" ? COLORS.fire : COLORS.water;
  const lantern = level.checkpoints.find((item) => item.active);
  spawnBurst(player.x + player.w / 2, player.y + player.h / 2, color, 24, 220, "spark");
  player.x = lantern ? lantern.x + (player.type === "fire" ? -10 : 10) : player.spawn.x;
  player.y = lantern ? lantern.y - player.h : player.spawn.y;
  player.vx = 0;
  player.vy = 0;
  player.grounded = false;
  player.groundId = null;
  player.invulnerable = 1.05;
  player.jumpBuffer = 0;
  levelResets += 1;
  cameraShake = Math.max(cameraShake, 7);
  flash = 0.18;
  showToast(`${player.name} ${reason} — trying again`, 1700);
  playTone(145, "sawtooth", 0.22, 0.05, 82, 0);
}

function nearDoor(player, door) {
  const centerX = player.x + player.w / 2;
  const bottom = player.y + player.h;
  return Math.abs(centerX - (door.x + door.w / 2)) < 34 && bottom > 620 && bottom < 675;
}

function checkDoors() {
  const fire = players.find((player) => player.type === "fire");
  const water = players.find((player) => player.type === "water");
  const fireDoor = { x: 1200, w: 42 };
  const waterDoor = { x: 1150, w: 42 };
  const atFireDoor = nearDoor(fire, fireDoor);
  const atWaterDoor = nearDoor(water, waterDoor);
  const gateReady = !level.heartGate || level.heartGate.open;

  if ((atFireDoor || atWaterDoor) && !gateReady && visualTime - level.lastDoorHint > 3) {
    level.lastDoorHint = visualTime;
    showToast("Light the shared heart gate first", 1800);
  }

  if (atFireDoor && fire.collected < CONFIG.requiredGems && visualTime - level.lastDoorHint > 3) {
    level.lastDoorHint = visualTime;
    showToast(`Red door needs ${CONFIG.requiredGems - fire.collected} more red diamond${CONFIG.requiredGems - fire.collected === 1 ? "" : "s"}`, 1800);
  }

  if (atWaterDoor && water.collected < CONFIG.requiredGems && visualTime - level.lastDoorHint > 3) {
    level.lastDoorHint = visualTime;
    showToast(`Blue door needs ${CONFIG.requiredGems - water.collected} more blue diamond${CONFIG.requiredGems - water.collected === 1 ? "" : "s"}`, 1800);
  }

  if (
    atFireDoor &&
    atWaterDoor &&
    gateReady &&
    fire.collected >= CONFIG.requiredGems &&
    water.collected >= CONFIG.requiredGems
  ) {
    finishLevel();
  }
}

function updateEffects(delta) {
  particles.forEach((particle) => {
    particle.life -= delta;
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.vy += particle.gravity * delta;
    particle.rotation += particle.spin * delta;
  });
  particles = particles.filter((particle) => particle.life > 0).slice(-420);
  cameraShake = Math.max(0, cameraShake - delta * 18);
  flash = Math.max(0, flash - delta);
}

function spawnBurst(x, y, color, count, speed, shape) {
  const amount = REDUCED ? Math.max(3, Math.floor(count * 0.35)) : count;
  for (let index = 0; index < amount; index += 1) {
    const angle = random() * Math.PI * 2;
    const velocity = speed * (0.3 + random() * 0.7);
    const life = 0.45 + random() * 0.65;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - speed * 0.2,
      gravity: shape === "confetti" ? 130 : 260,
      life,
      maxLife: life,
      size: shape === "confetti" ? 4 + random() * 5 : 2 + random() * 4,
      color,
      rotation: random() * Math.PI,
      spin: (random() - 0.5) * 8,
      shape
    });
  }
}

function spawnCelebration() {
  const colors = [COLORS.fire, COLORS.fireLight, COLORS.water, COLORS.waterLight, COLORS.paper, "#ff8fa8"];
  for (let index = 0; index < 90; index += 1) {
    particles.push({
      x: 360 + random() * 560,
      y: -20 - random() * 300,
      vx: (random() - 0.5) * 80,
      vy: 70 + random() * 130,
      gravity: 55,
      life: 5 + random() * 3,
      maxLife: 8,
      size: 4 + random() * 5,
      color: colors[index % colors.length],
      rotation: random() * Math.PI,
      spin: (random() - 0.5) * 7,
      shape: "confetti"
    });
  }
}

function formatDuration(seconds) {
  const totalSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainder = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function announceStatus(message) {
  $("game-status").textContent = message;
}

function updateFinalCard(preview = false, count = totalFireflies) {
  $("final-firefly-count").textContent = String(count);
  $("final-context").textContent = preview
    ? "Final message preview · progress unchanged"
    : "You found the forest's little secret";
  if (count >= LEVELS.length * 3) {
    $("final-firefly-copy").textContent = "You found every little firefly. That is every memory, glowing all at once.";
  } else if (count >= 10) {
    $("final-firefly-copy").textContent = "So many memories found. The forest is practically glowing with us.";
  } else if (count === 0) {
    $("final-firefly-copy").textContent = "Even without every firefly, you still reached the heart of the forest.";
  } else {
    $("final-firefly-copy").textContent = "Each firefly is one small memory from our story. A few are still hiding among the trees.";
  }
}

function renderMemoryJournal() {
  const entries = LEVELS.flatMap((level, levelIndex) => level.wishes.map((_, wishIndex) => {
    const id = `${levelIndex + 1}-${wishIndex + 1}`;
    const memory = MEMORIES[levelIndex * 3 + wishIndex];
    const unlocked = collectedWishKeys.has(id);
    return `<article class="memory-note${unlocked ? "" : " is-locked"}"><span class="memory-note__index">${String(levelIndex * 3 + wishIndex + 1).padStart(2, "0")}</span><div><h3>${unlocked ? memory.title : "A memory still hidden"}</h3><p>${unlocked ? memory.text : "Keep exploring the forest to find this little spark."}</p></div><span class="memory-note__status">${unlocked ? "Found" : "Hidden"}</span></article>`;
  }));
  $("memory-summary").textContent = `${collectedWishKeys.size} / ${LEVELS.length * 3} memories found`;
  $("memory-list").innerHTML = entries.join("");
}

function openMemoryJournal() {
  renderMemoryJournal();
  setState("memory");
}

function closeMemoryJournal() {
  setState("final");
}

function showFinalPreview(preview = true) {
  loadLevel(LEVELS.length - 1);
  level.gems.forEach((gem) => {
    gem.taken = true;
  });
  players.forEach((player) => {
    player.collected = CONFIG.requiredGems;
    player.y = FLOOR_Y - player.h;
    player.vx = 0;
    player.vy = 0;
    player.grounded = true;
    player.groundId = "ground";
  });
  players.find((player) => player.type === "water").x = 1150;
  players.find((player) => player.type === "fire").x = 1200;
  cameraOffset = getCameraTarget();
  updateInterface();
  updateFinalCard(preview, preview ? fireflyPreview ?? totalFireflies : totalFireflies);
  stopCelebrationSong();
  spawnCelebration();
  setState("final");
}

function updateRecord(index, elapsedSeconds, retries, fireflies, syncCount) {
  const saved = records[index];
  const previous = saved && Number.isFinite(Number(saved.time)) && Number.isFinite(Number(saved.retries))
    ? { time: Number(saved.time), retries: Number(saved.retries), fireflies: Number(saved.fireflies) || 0, sync: Number(saved.sync) || 0 }
    : null;
  const current = {
    time: elapsedSeconds,
    retries,
    fireflies,
    sync: syncCount
  };
  const isBetter = !previous || current.time < previous.time || (current.time === previous.time && current.retries < previous.retries);
  if (isBetter) {
    records[index] = current;
    saveValue(CONFIG.recordsKey, JSON.stringify(records));
  }
  return { best: isBetter ? current : previous, isNew: isBetter };
}

function renderClearBadges(elapsed, retries) {
  const badges = ["Trailblazer"];
  if (level.fireflies === 3) badges.push("Memory Keeper");
  if (retries === 0) badges.push("Perfect Pair");
  if (elapsed <= 75) badges.push("Quick Step");
  if (level.syncCount >= 2) badges.push("Sync Spark");
  $("clear-badges").innerHTML = badges.map((badge) => `<span class="clear-badge">${badge}</span>`).join("");
}

function finishLevel() {
  if (state !== "playing") return;
  playFinishSound();
  if (levelIndex === LEVELS.length - 1) {
    completedLevels = LEVELS.length;
    saveValue(CONFIG.progressKey, completedLevels);
    updateFinalCard(false, totalFireflies);
    stopCelebrationSong();
    spawnCelebration();
    setState("final");
    return;
  }
  completedLevels = Math.max(completedLevels, levelIndex + 1);
  saveValue(CONFIG.progressKey, completedLevels);
  const memoryLine = level.fireflies === 3
    ? "Every memory on this path is glowing."
    : `${level.fireflies} of 3 memories found on this path.`;
  const elapsedSeconds = (performance.now() - levelStartedAt) / 1000;
  const elapsed = formatDuration(elapsedSeconds);
  $("clear-copy").textContent = `Both doors are open. ${memoryLine} ${totalFireflies} / ${LEVELS.length * 3} fireflies discovered.`;
  $("clear-stats").textContent = `Time ${elapsed} · ${levelResets} ${levelResets === 1 ? "retry" : "retries"} · ${level.syncCount} perfect pairs`;
  const record = updateRecord(levelIndex, elapsedSeconds, levelResets, level.fireflies, level.syncCount);
  $("clear-best").textContent = record.best
    ? `${record.isNew ? "New best" : "Best"} · ${formatDuration(record.best.time)} · ${record.best.retries} retries`
    : "First run";
  renderClearBadges(elapsedSeconds, levelResets);
  announceStatus(`${level.name} cleared in ${elapsed} with ${levelResets} retries.`);
  spawnBurst(640, 390, COLORS.paper, 64, 280, "spark");
  setState("clear");
}

function updateInterface() {
  if (!level || !players.length) return;
  $("level-kicker").textContent = `Forest ${String(levelIndex + 1).padStart(2, "0")} / ${String(LEVELS.length).padStart(2, "0")}`;
  $("level-name").textContent = level.name;
  $("fire-gems").textContent = String(players.find((player) => player.type === "fire").collected);
  $("water-gems").textContent = String(players.find((player) => player.type === "water").collected);
  $("firefly-count").textContent = String(level.fireflies || 0);
  announceStatus(`${level.name}. Red ${players.find((player) => player.type === "fire").collected} of ${CONFIG.requiredGems}, blue ${players.find((player) => player.type === "water").collected} of ${CONFIG.requiredGems}.`);
  const steps = document.querySelectorAll(".journey__step");
  steps.forEach((step, index) => {
    step.classList.toggle("is-active", index === levelIndex);
    step.classList.toggle("is-complete", index < levelIndex || completedLevels >= LEVELS.length);
  });
  if (levelIndex === LEVELS.length - 1) {
    $("next-label").textContent = "Open the heart of the forest";
  } else {
    $("next-label").textContent = "Follow the fireflies";
  }
}

function setState(nextState) {
  if (state !== nextState && document.activeElement instanceof HTMLElement) previousFocus = document.activeElement;
  state = nextState;
  document.body.dataset.state = nextState;
  Object.entries(screens).forEach(([name, screen]) => {
    screen.hidden = name !== nextState;
  });
  $("hud").inert = nextState !== "playing";
  $("touch-controls").inert = nextState !== "playing";
  if (nextState !== "playing") resetInput();

  if (nextState === "pause") {
    window.setTimeout(() => $("resume-button").focus(), 0);
  } else if (nextState === "clear") {
    window.setTimeout(() => $("next-button").focus(), 0);
  } else if (nextState === "final") {
    window.setTimeout(() => $("song-button").focus(), 0);
  } else if (nextState === "memory") {
    window.setTimeout(() => $("memory-close").focus(), 0);
  } else if (nextState === "playing" && previousFocus && document.contains(previousFocus) && previousFocus.offsetParent !== null) {
    previousFocus.focus();
    previousFocus = null;
  }
}

function startAdventure() {
  initAudio();
  if (!hasRequestedLevel && completedLevels >= LEVELS.length) {
    showFinalPreview(false);
    return;
  }
  const startIndex = hasRequestedLevel
    ? requestedLevel
    : Math.min(completedLevels, LEVELS.length - 1);
  loadLevel(startIndex);
  setState("playing");
  playTone(440, "triangle", 0.16, 0.04, 660, 0.08);
}

function restartLevel() {
  if (!level || !["playing", "pause"].includes(state)) return;
  loadLevel(levelIndex);
  setState("playing");
  showToast("A fresh path through the trees", 1300);
}

function pauseGame() {
  if (state !== "playing") return;
  setState("pause");
}

function resumeGame() {
  if (state !== "pause") return;
  initAudio();
  setState("playing");
}

function showToast(message, duration = 1600) {
  window.clearTimeout(toastTimer);
  $("game-toast").textContent = message;
  $("game-toast").classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    $("game-toast").classList.remove("is-visible");
  }, duration);
}

function initAudio() {
  if (!soundEnabled) return;
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") audioContext.resume();
}

function playTone(frequency, type, duration, volume, endFrequency, delay) {
  if (!soundEnabled || !audioContext) return;
  const start = audioContext.currentTime + delay;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, endFrequency), start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

function playFinishSound() {
  playTone(523, "triangle", 0.26, 0.04, 659, 0);
  playTone(659, "triangle", 0.28, 0.04, 784, 0.11);
  playTone(784, "triangle", 0.42, 0.045, 1047, 0.22);
}

function setSoundEnabled(enabled, initialize = false) {
  soundEnabled = enabled;
  saveValue(CONFIG.soundKey, enabled);
  const button = $("sound-button");
  button.setAttribute("aria-pressed", String(!enabled));
  button.setAttribute("aria-label", enabled ? "Mute sound" : "Enable sound");
  $("celebration-audio").volume = enabled ? CONFIG.celebrationVolume : 0;
  if (!enabled && !$("celebration-audio").paused) stopCelebrationSong();
  if (enabled && initialize) initAudio();
}

async function toggleCelebrationSong() {
  const audio = $("celebration-audio");
  const button = $("song-button");
  if (!soundEnabled) {
    showToast("Enable sound to play our song", 1900);
    return;
  }
  if (!audio.paused) {
    audio.pause();
    button.setAttribute("aria-pressed", "false");
    $("song-label").textContent = "Play our song";
    return;
  }
  audio.volume = soundEnabled ? CONFIG.celebrationVolume : 0;
  try {
    await audio.play();
    button.setAttribute("aria-pressed", "true");
    $("song-label").textContent = "Pause our song";
  } catch {
    showToast("Tap once more to play our song", 1900);
  }
}

function stopCelebrationSong() {
  const audio = $("celebration-audio");
  audio.pause();
  $("song-button").setAttribute("aria-pressed", "false");
  $("song-label").textContent = "Play our song";
}

function updateFullscreenButton() {
  const button = $("fullscreen-button");
  const active = Boolean(document.fullscreenElement);
  button.setAttribute("aria-label", active ? "Exit fullscreen" : "Enter fullscreen");
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen?.();
    } else {
      await document.documentElement.requestFullscreen?.();
    }
    updateFullscreenButton();
  } catch {
    showToast("Fullscreen is not available in this browser", 1900);
  }
}

function resetInput() {
  keys.clear();
  touch.fire.left = false;
  touch.fire.right = false;
  touch.fire.jump = false;
  touch.water.left = false;
  touch.water.right = false;
  touch.water.jump = false;
  players.forEach((player) => {
    player.jumpBuffer = 0;
  });
  activePointerInputs.clear();
  document.querySelectorAll(".touch-controls button").forEach((button) => {
    button.classList.remove("is-pressed");
  });
}

function queueJump(type) {
  const player = players.find((item) => item.type === type);
  if (player) {
    player.jumpBuffer = 0.15;
  }
}

function trapDialogFocus(event) {
  const screen = screens[state];
  if (!screen) return;
  const focusable = [...screen.querySelectorAll("button, input, a, [tabindex]:not([tabindex='-1'])")].filter((element) => !element.disabled);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function handleKeyDown(event) {
  const controlledCodes = [
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "Space",
    "KeyA",
    "KeyD",
    "KeyW"
  ];
  const interactive = event.target instanceof HTMLElement && Boolean(event.target.closest("button, input, select, textarea, a, [contenteditable]"));

  if (event.code === "Tab" && screens[state]) {
    trapDialogFocus(event);
    return;
  }
  if (event.code === "Escape" && state === "memory") {
    closeMemoryJournal();
    return;
  }
  if (event.code === "KeyP" || event.code === "Escape") {
    if (state === "playing") pauseGame();
    else if (state === "pause") resumeGame();
    return;
  }
  if (interactive) return;
  if (state === "playing" && controlledCodes.includes(event.code)) event.preventDefault();
  if (event.repeat) return;

  if (event.code === "Enter" && state === "intro" && !interactive) {
    startAdventure();
    return;
  }
  if (event.code === "KeyR" && state === "playing" && !interactive) {
    restartLevel();
    return;
  }
  if (state !== "playing") return;

  keys.add(event.code);
  if (bindings.fire.jump.includes(event.code)) queueJump("fire");
  if (bindings.water.jump.includes(event.code)) queueJump("water");
}

function handleKeyUp(event) {
  keys.delete(event.code);
}

function bindTouchControls() {
  document.querySelectorAll(".touch-controls button").forEach((button) => {
    const type = button.dataset.player;
    const action = button.dataset.action;
    const release = (event) => {
      activePointerInputs.delete(event.pointerId);
      const stillHeld = [...activePointerInputs.values()].some((input) => input.type === type && input.action === action);
      touch[type][action] = stillHeld;
      button.classList.toggle("is-pressed", stillHeld);
    };
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      initAudio();
      button.setPointerCapture(event.pointerId);
      activePointerInputs.set(event.pointerId, { type, action, button, pointerId: event.pointerId });
      touch[type][action] = true;
      button.classList.add("is-pressed");
      if (action === "jump") queueJump(type);
    });
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
  });
}

function getCameraTarget() {
  const portrait = window.innerHeight > window.innerWidth;
  if (!portrait || !players.length) return 0;
  const centers = players.map((player) => player.x + player.w / 2);
  const midpoint = (Math.min(...centers) + Math.max(...centers)) / 2;
  return VIEW_WIDTH / 2 - midpoint;
}

function updateCamera(delta) {
  const target = getCameraTarget();
  if (REDUCED) {
    cameraOffset = target;
    return;
  }
  cameraOffset += (target - cameraOffset) * Math.min(1, delta * 6);
}

function draw() {
  ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  ctx.save();
  if (cameraShake > 0 && !REDUCED) {
    ctx.translate((Math.random() - 0.5) * cameraShake, (Math.random() - 0.5) * cameraShake);
  }
  drawBackground();
  ctx.save();
  ctx.translate(cameraOffset, 0);
  drawLevel();
  drawParticles();
  ctx.restore();
  ctx.restore();
  if (flash > 0 && !REDUCED) {
    ctx.fillStyle = `rgba(255,255,255,${flash * 0.8})`;
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  }
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  gradient.addColorStop(0, level.skyTop);
  gradient.addColorStop(0.62, level.skyBottom);
  gradient.addColorStop(1, "#0b1d19");
  ctx.fillStyle = gradient;
  ctx.fillRect(-10, -10, VIEW_WIDTH + 20, VIEW_HEIGHT + 20);

  drawStars();
  drawMoon();
  drawMoonRays();
  drawForestLayer(farTrees, "rgba(4, 18, 17, 0.38)", 370, 0.58);
  drawForestLayer(midTrees, "rgba(4, 20, 17, 0.62)", 510, 0.86);
  drawGroundMist();
  drawFireflies();
  drawForegroundLeaves();
}

function drawStars() {
  ctx.save();
  for (const star of stars) {
    const alpha = 0.35 + Math.sin(visualTime * star.speed + star.phase) * 0.22;
    ctx.globalAlpha = clamp(alpha, 0.12, 0.72);
    ctx.fillStyle = "#e7fff2";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawMoon() {
  const x = 1025;
  const y = 112;
  const glow = ctx.createRadialGradient(x, y, 8, x, y, 112);
  glow.addColorStop(0, "rgba(255, 241, 184, 0.42)");
  glow.addColorStop(0.45, "rgba(255, 241, 184, 0.12)");
  glow.addColorStop(1, "rgba(255, 241, 184, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, 112, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff2bd";
  ctx.beginPath();
  ctx.arc(x, y, 43, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(196, 174, 116, 0.17)";
  for (const [offsetX, offsetY, radius] of [[-13, -9, 7], [12, 6, 9], [4, 22, 5], [-20, 20, 4]]) {
    ctx.beginPath();
    ctx.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMoonRays() {
  ctx.save();
  ctx.translate(1025, 112);
  ctx.rotate(-0.28);
  for (let index = 0; index < 4; index += 1) {
    const width = 30 + index * 18;
    const gradient = ctx.createLinearGradient(0, 0, 0, 640);
    gradient.addColorStop(0, "rgba(255, 241, 184, 0.075)");
    gradient.addColorStop(1, "rgba(255, 241, 184, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(-width / 2, 0);
    ctx.lineTo(width / 2, 0);
    ctx.lineTo(width * 1.7, 650);
    ctx.lineTo(-width * 1.7, 650);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawForestLayer(trees, color, baseY, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  trees.forEach((tree, index) => {
    const sway = Math.sin(visualTime * 0.35 + index) * 3;
    ctx.save();
    ctx.translate(tree.x + sway, baseY);
    ctx.rotate(tree.lean);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-tree.width * 0.07, 10);
    ctx.lineTo(-tree.width * 0.1, -tree.height);
    ctx.lineTo(tree.width * 0.11, -tree.height);
    ctx.lineTo(tree.width * 0.08, 10);
    ctx.closePath();
    ctx.fill();
    const clusters = 4;
    for (let cluster = 0; cluster < clusters; cluster += 1) {
      const centerX = (cluster - 1.5) * tree.width * 0.22;
      const centerY = -tree.height + cluster * tree.height * 0.12;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, tree.width * 0.48, tree.height * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
  ctx.restore();
}

function drawGroundMist() {
  const gradient = ctx.createLinearGradient(0, 400, 0, 680);
  gradient.addColorStop(0, "rgba(160, 214, 187, 0)");
  gradient.addColorStop(0.75, "rgba(132, 190, 166, 0.08)");
  gradient.addColorStop(1, "rgba(12, 34, 28, 0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, 430);
  for (let x = 0; x <= VIEW_WIDTH; x += 80) {
    ctx.quadraticCurveTo(x + 40, 390 + Math.sin(x * 0.018 + visualTime) * 18, x + 80, 430);
  }
  ctx.lineTo(VIEW_WIDTH, 690);
  ctx.lineTo(0, 690);
  ctx.closePath();
  ctx.fill();
}

function drawFireflies() {
  ctx.save();
  for (const firefly of fireflies) {
    const x = firefly.x + Math.sin(visualTime * firefly.speed + firefly.phase) * firefly.range;
    const y = firefly.y + Math.cos(visualTime * firefly.speed * 0.73 + firefly.phase) * firefly.range * 0.5;
    const pulse = 0.35 + Math.max(0, Math.sin(visualTime * 2.4 + firefly.phase)) * 0.65;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, firefly.radius * 7);
    glow.addColorStop(0, `rgba(255, 233, 139, ${0.8 * pulse})`);
    glow.addColorStop(1, "rgba(255, 233, 139, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, firefly.radius * 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255, 244, 184, ${pulse})`;
    ctx.beginPath();
    ctx.arc(x, y, firefly.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawForegroundLeaves() {
  ctx.save();
  for (const leaf of fallingLeaves) {
    const x = leaf.x + Math.sin(visualTime * 0.5 + leaf.phase) * leaf.drift;
    const y = (leaf.y + visualTime * leaf.speed) % (VIEW_HEIGHT + 80) - 40;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(visualTime + leaf.phase);
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = leaf.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, leaf.size, leaf.size * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawLevel() {
  drawGround();
  level.platforms.forEach(drawPlatform);
  level.moving.forEach(drawPlatform);
  level.launchPads.forEach(drawLaunchPad);
  level.pools.forEach(drawPool);
  level.spikes.forEach(drawSpikes);
  level.saws.forEach(drawSaw);
  level.checkpoints.forEach(drawCheckpoint);
  level.wishes.forEach(drawWish);
  level.gems.forEach(drawGem);
  drawDoor(1150, "water");
  drawDoor(1200, "fire");
  drawFinalHeart();
  drawHeartGate();
  players.forEach(drawPlayer);
}

function drawGround() {
  const gradient = ctx.createLinearGradient(0, FLOOR_Y, 0, VIEW_HEIGHT);
  gradient.addColorStop(0, "#244737");
  gradient.addColorStop(0.12, "#173426");
  gradient.addColorStop(1, "#0b1a16");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, FLOOR_Y, VIEW_WIDTH, VIEW_HEIGHT - FLOOR_Y);
  ctx.strokeStyle = "rgba(126, 181, 112, 0.35)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, FLOOR_Y + 1);
  ctx.lineTo(VIEW_WIDTH, FLOOR_Y + 1);
  ctx.stroke();

  for (let x = 0; x < VIEW_WIDTH; x += 18) {
    const height = 7 + Math.sin(x * 0.13) * 3 + (x % 3) * 2;
    ctx.strokeStyle = x % 4 === 0 ? "rgba(103, 161, 94, 0.65)" : "rgba(63, 115, 77, 0.5)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x, FLOOR_Y + 2);
    ctx.quadraticCurveTo(x + 4, FLOOR_Y - height, x + 9, FLOOR_Y + 2);
    ctx.stroke();
  }
}

function drawPlatform(item) {
  const y = item.y;
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 8;
  const gradient = ctx.createLinearGradient(0, y, 0, y + item.h);
  if (item.kind === "moving") {
    gradient.addColorStop(0, "#6c684d");
    gradient.addColorStop(0.24, "#514e3d");
    gradient.addColorStop(1, "#302f28");
  } else {
    gradient.addColorStop(0, "#4b6650");
    gradient.addColorStop(0.28, "#32473a");
    gradient.addColorStop(1, "#1c2b26");
  }
  roundedRectPath(ctx, item.x, y, item.w, item.h, Math.min(9, item.h / 2));
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.fillStyle = item.kind === "moving" ? "rgba(220, 196, 111, 0.42)" : "rgba(111, 182, 107, 0.72)";
  roundedRectPath(ctx, item.x + 2, y - 2, item.w - 4, 7, 4);
  ctx.fill();

  ctx.strokeStyle = "rgba(238, 220, 145, 0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(item.x + 9, y + 8);
  ctx.lineTo(item.x + item.w * 0.42, y + 11);
  ctx.lineTo(item.x + item.w * 0.7, y + 6);
  ctx.stroke();

  const leafCount = Math.max(2, Math.floor(item.w / 40));
  for (let index = 0; index < leafCount; index += 1) {
    const leafX = item.x + 10 + index * ((item.w - 20) / Math.max(1, leafCount - 1));
    const direction = index % 2 === 0 ? -1 : 1;
    ctx.fillStyle = index % 2 === 0 ? "#70a867" : "#4f8c5c";
    ctx.beginPath();
    ctx.ellipse(leafX, y - 3, 7, 3.2, direction * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }

  if (item.kind === "moving") {
    ctx.strokeStyle = "rgba(242, 214, 121, 0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 5]);
    ctx.beginPath();
    if (item.axis === "y") {
      ctx.moveTo(item.baseX + item.w / 2, item.baseY - item.range);
      ctx.lineTo(item.baseX + item.w / 2, item.baseY + item.range + item.h);
    } else {
      ctx.moveTo(item.baseX - item.range, y + item.h + 12);
      ctx.lineTo(item.baseX + item.range, y + item.h + 12);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawLaunchPad(pad) {
  const pulse = 1 + Math.sin(visualTime * 5) * 0.05;
  const centerX = pad.x + pad.w / 2;
  ctx.save();
  ctx.translate(centerX, pad.y);
  const glow = ctx.createRadialGradient(0, -8, 2, 0, -8, pad.w * 0.9);
  glow.addColorStop(0, "rgba(255,241,184,0.52)");
  glow.addColorStop(0.45, "rgba(255,143,168,0.18)");
  glow.addColorStop(1, "rgba(255,143,168,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, -8, pad.w * 0.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6e6043";
  roundedRectPath(ctx, -10, -5, 20, 13, 5);
  ctx.fill();
  ctx.save();
  ctx.scale(pulse, pulse);
  ctx.fillStyle = "#ff9a83";
  ctx.beginPath();
  ctx.ellipse(0, -7, pad.w / 2, 11, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,241,184,0.78)";
  for (let index = 0; index < 2; index += 1) {
    const offsetY = -9 + index * 5;
    ctx.beginPath();
    ctx.moveTo(-7, offsetY + 3);
    ctx.lineTo(0, offsetY - 2);
    ctx.lineTo(7, offsetY + 3);
    ctx.strokeStyle = "rgba(255,241,184,0.78)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
}

function drawPool(hazard) {
  const isFire = hazard.type === "fire";
  const main = isFire ? COLORS.fire : COLORS.water;
  const light = isFire ? COLORS.fireLight : COLORS.waterLight;
  const gradient = ctx.createLinearGradient(0, hazard.y, 0, hazard.y + hazard.h);
  gradient.addColorStop(0, light);
  gradient.addColorStop(0.28, main);
  gradient.addColorStop(1, isFire ? "#8c1f1b" : "#176d8c");
  ctx.save();
  roundedRectPath(ctx, hazard.x, hazard.y + 5, hazard.w, hazard.h - 5, 10);
  ctx.clip();
  ctx.fillStyle = gradient;
  ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
  ctx.fillStyle = "rgba(255, 255, 255, 0.34)";
  ctx.beginPath();
  ctx.moveTo(hazard.x, hazard.y + 8);
  for (let x = 0; x <= hazard.w; x += 12) {
    ctx.quadraticCurveTo(
      x + 6,
      hazard.y + 3 + Math.sin((hazard.x + x) * 0.045 + visualTime * 3.4) * 4,
      x + 12,
      hazard.y + 8
    );
  }
  ctx.lineTo(hazard.x + hazard.w, hazard.y + 1);
  ctx.lineTo(hazard.x, hazard.y + 1);
  ctx.closePath();
  ctx.fill();
  for (let index = 0; index < Math.max(2, Math.floor(hazard.w / 38)); index += 1) {
    const bubbleX = hazard.x + 15 + ((index * 47 + visualTime * (isFire ? 13 : 20)) % Math.max(20, hazard.w - 30));
    const bubbleY = hazard.y + 18 + Math.sin(visualTime * 2 + index) * 8;
    ctx.strokeStyle = isFire ? "rgba(255, 229, 170, 0.42)" : "rgba(220, 253, 255, 0.45)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(bubbleX, bubbleY, 3 + (index % 3), 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSpikes(hazard) {
  const count = Math.max(1, Math.floor(hazard.w / 18));
  const step = hazard.w / count;
  ctx.save();
  for (let index = 0; index < count; index += 1) {
    const x = hazard.x + index * step;
    const gradient = ctx.createLinearGradient(0, hazard.y, 0, hazard.y + hazard.h);
    gradient.addColorStop(0, "#c8d2c0");
    gradient.addColorStop(1, "#5b6a60");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(x + 1, hazard.y + hazard.h);
    ctx.lineTo(x + step / 2, hazard.y);
    ctx.lineTo(x + step - 1, hazard.y + hazard.h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawSaw(hazard) {
  ctx.save();
  ctx.translate(hazard.x, hazard.y);
  ctx.rotate(visualTime * 3.1);
  ctx.shadowColor = "rgba(204, 245, 187, 0.45)";
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#a7c99e";
  ctx.beginPath();
  for (let index = 0; index < 24; index += 1) {
    const angle = (index / 24) * Math.PI * 2;
    const radius = index % 2 === 0 ? hazard.r : hazard.r * 0.74;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#476455";
  ctx.beginPath();
  ctx.arc(0, 0, hazard.r * 0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#dff3c9";
  ctx.beginPath();
  ctx.arc(0, 0, hazard.r * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGem(gem) {
  if (gem.taken) return;
  const color = gem.type === "fire" ? COLORS.fire : COLORS.water;
  const light = gem.type === "fire" ? COLORS.fireLight : COLORS.waterLight;
  const y = gem.y + Math.sin(visualTime * 2.6 + gem.x * 0.03) * 5;
  ctx.save();
  ctx.translate(gem.x, y);
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -13);
  ctx.lineTo(10, -3);
  ctx.lineTo(6, 14);
  ctx.lineTo(-6, 14);
  ctx.lineTo(-10, -3);
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = light;
  ctx.beginPath();
  ctx.moveTo(0, -13);
  ctx.lineTo(0, 12);
  ctx.lineTo(-10, -3);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.beginPath();
  ctx.moveTo(0, -13);
  ctx.lineTo(4, -4);
  ctx.lineTo(0, 1);
  ctx.lineTo(-4, -4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCheckpoint(lantern) {
  const x = lantern.x;
  const y = lantern.y;
  const orbY = y - 55;
  const pulse = lantern.active ? 1 + Math.sin(visualTime * 4) * 0.06 : 1;
  ctx.save();
  ctx.globalAlpha = lantern.active ? 1 : 0.52;
  ctx.strokeStyle = lantern.active ? "#d8c68a" : "#62766c";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y - 2);
  ctx.lineTo(x, orbY + 13);
  ctx.moveTo(x - 12, y - 2);
  ctx.lineTo(x + 12, y - 2);
  ctx.stroke();

  if (lantern.active) {
    const glow = ctx.createRadialGradient(x, orbY, 2, x, orbY, 38);
    glow.addColorStop(0, "rgba(255,241,184,0.72)");
    glow.addColorStop(0.42, "rgba(255,209,102,0.2)");
    glow.addColorStop(1, "rgba(255,209,102,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, orbY, 38, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.translate(x, orbY);
  ctx.scale(pulse, pulse);
  roundedRectPath(ctx, -13, -15, 26, 30, 8);
  ctx.fillStyle = lantern.active ? "rgba(255,229,151,0.2)" : "rgba(39,67,58,0.75)";
  ctx.fill();
  ctx.strokeStyle = lantern.active ? COLORS.paper : "rgba(213,235,193,0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = lantern.active ? COLORS.fire : "rgba(117,140,130,0.42)";
  ctx.beginPath();
  ctx.moveTo(-7, 8);
  ctx.quadraticCurveTo(-12, -1, -4, -8);
  ctx.quadraticCurveTo(-2, 0, 3, -4);
  ctx.quadraticCurveTo(4, 4, 7, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = lantern.active ? COLORS.water : "rgba(117,140,130,0.42)";
  ctx.beginPath();
  ctx.moveTo(7, 8);
  ctx.quadraticCurveTo(12, -1, 4, -8);
  ctx.quadraticCurveTo(2, 0, -3, -4);
  ctx.quadraticCurveTo(-4, 4, -7, 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawWish(memory) {
  if (memory.taken) return;
  const y = memory.y + Math.sin(visualTime * 3 + memory.x * 0.02) * 7;
  const wing = 3 + Math.sin(visualTime * 8 + memory.x) * 2;
  ctx.save();
  ctx.translate(memory.x, y);
  const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 32);
  glow.addColorStop(0, "rgba(255,241,184,0.7)");
  glow.addColorStop(0.38, "rgba(255,209,102,0.2)");
  glow.addColorStop(1, "rgba(255,209,102,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(220,255,225,0.7)";
  ctx.beginPath();
  ctx.ellipse(-7, -2, 8, wing, -0.55, 0, Math.PI * 2);
  ctx.ellipse(7, -2, 8, wing, 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.fireLight;
  ctx.beginPath();
  ctx.ellipse(0, 1, 4, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLORS.paper;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-1, -5);
  ctx.lineTo(-4, -10);
  ctx.moveTo(1, -5);
  ctx.lineTo(4, -10);
  ctx.stroke();
  ctx.restore();
}

function drawDoor(x, type) {
  const player = players.find((item) => item.type === type);
  const count = player ? player.collected : 0;
  const open = count >= CONFIG.requiredGems;
  const color = type === "fire" ? COLORS.fire : COLORS.water;
  const light = type === "fire" ? COLORS.fireLight : COLORS.waterLight;
  const y = FLOOR_Y - 108;
  const width = 42;
  const height = 108;

  ctx.save();
  if (open) {
    const glow = ctx.createRadialGradient(x + width / 2, y + height / 2, 4, x + width / 2, y + height / 2, 86);
    glow.addColorStop(0, `${light}88`);
    glow.addColorStop(0.4, `${color}44`);
    glow.addColorStop(1, `${color}00`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, 86, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.beginPath();
  ctx.moveTo(x, FLOOR_Y);
  ctx.lineTo(x, y + 26);
  ctx.quadraticCurveTo(x, y, x + width / 2, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + 26);
  ctx.lineTo(x + width, FLOOR_Y);
  ctx.closePath();
  const doorGradient = ctx.createLinearGradient(x, y, x, FLOOR_Y);
  doorGradient.addColorStop(0, open ? light : "#31483f");
  doorGradient.addColorStop(0.24, open ? color : "#182d29");
  doorGradient.addColorStop(1, open ? `${color}55` : "#0d1d1a");
  ctx.fillStyle = doorGradient;
  ctx.fill();
  ctx.strokeStyle = open ? light : "rgba(213, 235, 193, 0.38)";
  ctx.lineWidth = 3;
  ctx.stroke();

  if (open) {
    ctx.globalAlpha = 0.34 + Math.sin(visualTime * 4) * 0.08;
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.ellipse(x + width / 2, FLOOR_Y - 5, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  const markerSize = 5;
  const markerGap = 9;
  const markerStart = x + width / 2 - ((CONFIG.requiredGems - 1) * markerGap) / 2;
  for (let index = 0; index < CONFIG.requiredGems; index += 1) {
    ctx.save();
    ctx.translate(markerStart + index * markerGap, y + 37);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = index < count ? light : "rgba(255,255,255,0.2)";
    ctx.fillRect(-markerSize / 2, -markerSize / 2, markerSize, markerSize);
    ctx.restore();
  }

  ctx.fillStyle = open ? "#ffffff" : "rgba(255,255,255,0.72)";
  ctx.font = '800 12px "Baloo 2", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(type === "fire" ? "RED" : "BLUE", x + width / 2, y + 67);
  ctx.restore();
}

function drawFinalHeart() {
  if (levelIndex !== LEVELS.length - 1) return;
  const ready = players.every((player) => player.collected >= CONFIG.requiredGems);
  const pulse = 1 + Math.sin(visualTime * 4) * 0.05;
  const x = 1196;
  const y = 500;
  ctx.save();
  ctx.globalAlpha = ready ? 0.95 : 0.42;
  ctx.strokeStyle = ready ? COLORS.waterLight : COLORS.water;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(1171, 555);
  ctx.quadraticCurveTo(1169, 533, x, y + 7);
  ctx.stroke();
  ctx.strokeStyle = ready ? COLORS.fireLight : COLORS.fire;
  ctx.beginPath();
  ctx.moveTo(1221, 555);
  ctx.quadraticCurveTo(1223, 533, x, y + 7);
  ctx.stroke();
  ctx.translate(x, y);
  ctx.scale(pulse, pulse);
  const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 34);
  glow.addColorStop(0, ready ? "rgba(255,241,184,0.75)" : "rgba(255,143,168,0.25)");
  glow.addColorStop(1, "rgba(255,143,168,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = ready ? "#fff1b8" : "#ff8fa8";
  ctx.beginPath();
  ctx.moveTo(0, 17);
  ctx.bezierCurveTo(-25, 1, -17, -18, 0, -8);
  ctx.bezierCurveTo(17, -18, 25, 1, 0, 17);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawHeartGate() {
  const gate = level.heartGate;
  if (!gate) return;
  const centerX = (gate.firstX + gate.secondX) / 2;
  const pulse = 1 + Math.sin(visualTime * 4) * 0.06;
  ctx.save();
  ctx.globalAlpha = gate.open ? 0.95 : 0.48;
  ctx.strokeStyle = gate.open ? "#ffb6c8" : "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 5]);
  ctx.beginPath();
  ctx.moveTo(gate.firstX, FLOOR_Y - 4);
  ctx.quadraticCurveTo(centerX, 560, gate.secondX, FLOOR_Y - 4);
  ctx.stroke();
  ctx.setLineDash([]);
  [gate.firstX, gate.secondX].forEach((x, index) => {
    ctx.fillStyle = gate.open ? (index === 0 ? COLORS.fire : COLORS.water) : "rgba(255,255,255,0.28)";
    ctx.beginPath();
    ctx.ellipse(x, FLOOR_Y - 5, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.translate(centerX, 550);
  ctx.scale(pulse, pulse);
  const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 32);
  glow.addColorStop(0, gate.open ? "rgba(255,241,184,0.7)" : "rgba(255,143,168,0.18)");
  glow.addColorStop(1, "rgba(255,143,168,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = gate.open ? "#fff1b8" : "#ff8fa8";
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.bezierCurveTo(-20, 1, -13, -14, 0, -6);
  ctx.bezierCurveTo(13, -14, 20, 1, 0, 14);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPlayer(player) {
  if (!player) return;
  const isFire = player.type === "fire";
  const body = isFire ? COLORS.fire : COLORS.water;
  const light = isFire ? COLORS.fireLight : COLORS.waterLight;
  const groundedBob = player.grounded ? Math.sin(player.animation) * 1.5 : 0;
  const centerX = player.x + player.w / 2;
  const bottom = player.y + player.h + groundedBob;

  ctx.save();
  if (player.invulnerable > 0 && Math.floor(visualTime * 14) % 2 === 0) {
    ctx.globalAlpha = 0.42;
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.ellipse(centerX, player.y + player.h + 4, 19, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(centerX, bottom);
  ctx.scale(player.facing, 1);

  ctx.strokeStyle = isFire ? "#a73827" : "#187c98";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  const step = player.grounded ? Math.sin(player.animation) * 4 : 2;
  ctx.beginPath();
  ctx.moveTo(-8, -8);
  ctx.lineTo(-12, 0);
  ctx.lineTo(-15 + step, 1);
  ctx.moveTo(8, -8);
  ctx.lineTo(12, 0);
  ctx.lineTo(15 - step, 1);
  ctx.stroke();

  ctx.strokeStyle = isFire ? "#c84a2c" : "#259bb7";
  ctx.beginPath();
  ctx.moveTo(-9, -31);
  ctx.lineTo(-18, -22);
  ctx.moveTo(9, -31);
  ctx.lineTo(18, -22);
  ctx.stroke();

  const bodyGradient = ctx.createLinearGradient(-17, -PLAYER_HEIGHT, 17, 0);
  bodyGradient.addColorStop(0, light);
  bodyGradient.addColorStop(0.48, body);
  bodyGradient.addColorStop(1, isFire ? "#b83527" : "#147c9d");
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.moveTo(0, -PLAYER_HEIGHT);
  ctx.bezierCurveTo(12, -PLAYER_HEIGHT + 3, 18, -37, 18, -23);
  ctx.bezierCurveTo(19, -10, 13, 0, 0, 0);
  ctx.bezierCurveTo(-13, 0, -19, -10, -18, -23);
  ctx.bezierCurveTo(-18, -37, -12, -PLAYER_HEIGHT + 3, 0, -PLAYER_HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.beginPath();
  ctx.ellipse(-7, -35, 4, 8, -0.4, 0, Math.PI * 2);
  ctx.fill();

  if (isFire) {
    ctx.fillStyle = COLORS.fireLight;
    ctx.beginPath();
    ctx.moveTo(-12, -44);
    ctx.quadraticCurveTo(-17, -54, -9, -60);
    ctx.quadraticCurveTo(-8, -51, 0, -55);
    ctx.quadraticCurveTo(1, -64, 7, -68);
    ctx.quadraticCurveTo(5, -56, 14, -52);
    ctx.quadraticCurveTo(8, -47, 9, -43);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.moveTo(-13, -44);
    ctx.quadraticCurveTo(-20, -53, -8, -58);
    ctx.quadraticCurveTo(0, -65, 9, -57);
    ctx.quadraticCurveTo(17, -52, 11, -45);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "#fff9e8";
  ctx.beginPath();
  ctx.ellipse(0, -27, 12, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#18302d";
  ctx.beginPath();
  ctx.arc(-4.5, -28, 1.5, 0, Math.PI * 2);
  ctx.arc(4.5, -28, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#a3474a";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(0, -24.5, 3, 0.12, Math.PI - 0.12);
  ctx.stroke();

  ctx.scale(player.facing, 1);
  ctx.textAlign = "center";
  ctx.font = '800 9px "Baloo 2", sans-serif';
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(3,18,16,0.9)";
  ctx.strokeText(player.name, 0, -76);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(player.name, 0, -76);
  if (player.collected >= CONFIG.requiredGems) {
    ctx.fillStyle = isFire ? COLORS.fireLight : COLORS.waterLight;
    ctx.font = '800 9px "Baloo 2", sans-serif';
    ctx.fillText("READY", 0, -89);
  }
  ctx.restore();
  ctx.restore();
}

function drawParticles() {
  ctx.save();
  for (const particle of particles) {
    ctx.save();
    ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = particle.color;
    if (particle.shape === "confetti") {
      ctx.fillRect(-particle.size / 2, -particle.size, particle.size, particle.size * 1.8);
    } else if (particle.shape === "dot") {
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
    }
    ctx.restore();
  }
  ctx.restore();
}

function roundedRectPath(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function frame(timestamp) {
  const delta = Math.min((timestamp - lastFrame) / 1000, 0.033);
  lastFrame = timestamp;
  visualTime += delta;

  if (state === "playing") {
    levelTime += delta;
    updateMovingPlatforms();
    updateSaws();
    players.forEach((player) => updatePlayer(player, delta));
    checkCheckpoints();
    checkHeartGate();
    if (state === "playing") checkDoors();
  }

  updateCamera(delta);
  updateEffects(delta);
  renderClock += delta;
  if (state === "playing" || particles.length > 0 || renderClock >= 1 / 30) {
    draw();
    renderClock = 0;
  }
  requestAnimationFrame(frame);
}

$("start-button").addEventListener("click", startAdventure);
document.querySelectorAll('input[name="character-colour"]').forEach((input) => {
  input.addEventListener("change", () => {
    if (input.checked) setIdentity(input.value);
  });
});
$("calm-mode").addEventListener("change", (event) => setCalmMode(event.target.checked));
$("next-button").addEventListener("click", () => {
  loadLevel(levelIndex + 1);
  setState("playing");
});
$("resume-button").addEventListener("click", resumeGame);
$("pause-button").addEventListener("click", pauseGame);
$("restart-button").addEventListener("click", restartLevel);
$("pause-restart-button").addEventListener("click", restartLevel);
$("sound-button").addEventListener("click", () => setSoundEnabled(!soundEnabled, !soundEnabled));
$("fullscreen-button").addEventListener("click", toggleFullscreen);
$("song-button").addEventListener("click", toggleCelebrationSong);
$("memory-button").addEventListener("click", openMemoryJournal);
$("memory-close").addEventListener("click", closeMemoryJournal);
$("replay-button").addEventListener("click", () => {
  stopCelebrationSong();
  loadLevel(0);
  setState("playing");
});
$("celebration-audio").addEventListener("ended", () => {
  $("song-button").setAttribute("aria-pressed", "false");
  $("song-label").textContent = "Play our song";
});

window.addEventListener("keydown", handleKeyDown, { passive: false });
window.addEventListener("keyup", handleKeyUp);
window.addEventListener("blur", () => {
  if (state === "playing") pauseGame();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && state === "playing") pauseGame();
});
window.addEventListener("pagehide", stopCelebrationSong);
document.addEventListener("fullscreenchange", updateFullscreenButton);
window.addEventListener("resize", resizeCanvas);
window.visualViewport?.addEventListener("resize", resizeCanvas);
bindTouchControls();

setSoundEnabled(soundEnabled);
updateFullscreenButton();
setCalmMode(calmMode);
setIdentity(identityType, false);
if (finalPreview) {
  showFinalPreview();
} else {
  loadLevel(0);
  setState("intro");

  if (hasRequestedLevel) {
    $("start-label").textContent = `Enter Forest ${String(requestedLevel + 1).padStart(2, "0")}`;
  } else if (completedLevels >= LEVELS.length) {
    $("start-label").textContent = "View final message";
  } else if (completedLevels > 0) {
    const continueIndex = Math.min(completedLevels, LEVELS.length - 1);
    $("start-label").textContent = `Continue at ${LEVELS[continueIndex].name}`;
  }
}

requestAnimationFrame(frame);
