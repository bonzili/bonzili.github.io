/* ==========================================================================
   CISSP Field Manual — sync core
   End-to-end encrypted, per-device snapshots. No accounts.
   The Worker only ever stores ciphertext; this file owns the sync code,
   the device id, the merge rules, and the API calls.
   ========================================================================== */

(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CISSP_SYNC = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var CONFIG_KEY = "cissp.fieldmanual.sync.v1";
  var CACHE_KEY = "cissp.fieldmanual.sync.cache.v1";
  var DEFAULT_API = "https://sync.bonzili.me/v1/sync";
  var CODE_RE = /^[0-9A-F]{32}$/;
  var encoder = new TextEncoder();
  var decoder = new TextDecoder();

  function apiUrl() {
    return (root && root.CISSP_SYNC_API_URL) || DEFAULT_API;
  }

  function normalizeCode(code) {
    return String(code == null ? "" : code).toUpperCase().replace(/[^0-9A-F]/g, "");
  }

  function formatCode(code) {
    var clean = normalizeCode(code);
    var groups = clean.match(/.{1,4}/g);
    return groups ? groups.join("-") : "";
  }

  function validCode(code) {
    return CODE_RE.test(normalizeCode(code));
  }

  function generateCode() {
    if (!root.crypto || !root.crypto.getRandomValues) {
      throw new Error("This browser cannot generate a secure sync code.");
    }
    var bytes = new Uint8Array(16);
    root.crypto.getRandomValues(bytes);
    return Array.prototype.map.call(bytes, function (b) {
      return ("0" + b.toString(16)).slice(-2);
    }).join("").toUpperCase();
  }

  function newDeviceId() {
    if (root.crypto && root.crypto.randomUUID) return root.crypto.randomUUID();
    if (!root.crypto || !root.crypto.getRandomValues) {
      throw new Error("This browser cannot generate a device id.");
    }
    var bytes = new Uint8Array(16);
    root.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    var hex = Array.prototype.map.call(bytes, function (b) {
      return ("0" + b.toString(16)).slice(-2);
    }).join("");
    return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" +
      hex.slice(16, 20) + "-" + hex.slice(20);
  }

  function toBase64(bytes) {
    var binary = "";
    for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    if (root.btoa) return root.btoa(binary);
    if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64");
    throw new Error("Base64 encoding is unavailable.");
  }

  function fromBase64(text) {
    var binary;
    if (root.atob) binary = root.atob(text);
    else if (typeof Buffer !== "undefined") binary = Buffer.from(text, "base64").toString("binary");
    else throw new Error("Base64 decoding is unavailable.");
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  async function accountId(code) {
    if (!validCode(code)) throw new Error("That sync code is not valid.");
    if (!root.crypto || !root.crypto.subtle) {
      throw new Error("Web Crypto is unavailable. Open the site over HTTPS.");
    }
    var digest = await root.crypto.subtle.digest(
      "SHA-256",
      encoder.encode("cissp-sync-account:" + normalizeCode(code))
    );
    return Array.prototype.map.call(new Uint8Array(digest), function (b) {
      return ("0" + b.toString(16)).slice(-2);
    }).join("");
  }

  async function deriveKey(code) {
    if (!validCode(code)) throw new Error("That sync code is not valid.");
    if (!root.crypto || !root.crypto.subtle) {
      throw new Error("Web Crypto is unavailable. Open the site over HTTPS.");
    }
    var material = await root.crypto.subtle.importKey(
      "raw",
      encoder.encode("cissp-sync-key:" + normalizeCode(code)),
      { name: "HKDF" },
      false,
      ["deriveKey"]
    );
    return root.crypto.subtle.deriveKey(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: encoder.encode("cissp-field-manual"),
        info: encoder.encode("progress-v1")
      },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptState(state, code) {
    var key = await deriveKey(code);
    var iv = new Uint8Array(12);
    root.crypto.getRandomValues(iv);
    var plaintext = encoder.encode(JSON.stringify(state));
    var ciphertext = await root.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
        additionalData: encoder.encode("cissp-field-manual-sync-v1")
      },
      key,
      plaintext
    );
    return {
      v: 1,
      iv: toBase64(iv),
      ct: toBase64(new Uint8Array(ciphertext))
    };
  }

  async function decryptState(envelope, code) {
    if (!envelope || typeof envelope.iv !== "string" || typeof envelope.ct !== "string") {
      throw new Error("That sync payload is not readable.");
    }
    var key = await deriveKey(code);
    var plaintext = await root.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: fromBase64(envelope.iv),
        additionalData: encoder.encode("cissp-field-manual-sync-v1")
      },
      key,
      fromBase64(envelope.ct)
    );
    return JSON.parse(decoder.decode(plaintext));
  }

  async function request(method, code, body) {
    if (!validCode(code)) throw new Error("That sync code is not valid.");
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 20000);
    var response;
    try {
      response = await fetch(apiUrl(), {
        method: method,
        cache: "no-store",
        signal: controller.signal,
        headers: {
          "Authorization": "Bearer " + normalizeCode(code),
          "Content-Type": "application/json"
        },
        body: body == null ? undefined : JSON.stringify(body)
      });
    } catch (err) {
      throw new Error("Could not reach the sync service.");
    } finally {
      clearTimeout(timer);
    }

    var text = await response.text();
    var data = {};
    if (text) {
      try { data = JSON.parse(text); } catch (err) { data = {}; }
    }
    if (!response.ok) {
      throw new Error((data && data.error) || ("Sync service error (" + response.status + ")."));
    }
    return data;
  }

  function pull(code) {
    return request("GET", code);
  }

  function push(config, envelope) {
    return request("POST", config.code, {
      deviceId: config.deviceId,
      envelope: envelope
    });
  }

  function deleteDevice(config) {
    return request("DELETE", config.code, { deviceId: config.deviceId });
  }

  function deleteAccount(config) {
    return request("DELETE", config.code, { all: true });
  }

  function loadConfig() {
    try {
      if (!root.localStorage) return null;
      var raw = root.localStorage.getItem(CONFIG_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !validCode(parsed.code) || !parsed.deviceId) return null;
      return {
        code: normalizeCode(parsed.code),
        deviceId: String(parsed.deviceId).slice(0, 80),
        lastSyncAt: Number(parsed.lastSyncAt) || null,
        lastDeviceCount: Number(parsed.lastDeviceCount) || 0,
        createdAt: Number(parsed.createdAt) || null
      };
    } catch (err) {
      return null;
    }
  }

  function saveConfig(config) {
    if (!config || !validCode(config.code) || !config.deviceId) {
      clearConfig();
      return null;
    }
    var clean = {
      code: normalizeCode(config.code),
      deviceId: String(config.deviceId).slice(0, 80),
      lastSyncAt: Number(config.lastSyncAt) || null,
      lastDeviceCount: Number(config.lastDeviceCount) || 0,
      createdAt: Number(config.createdAt) || Date.now()
    };
    try {
      root.localStorage.setItem(CONFIG_KEY, JSON.stringify(clean));
    } catch (err) {
      /* storage may be unavailable */
    }
    return clean;
  }

  function clearConfig() {
    try { if (root.localStorage) root.localStorage.removeItem(CONFIG_KEY); } catch (err) { /* ignore */ }
  }

  function loadCachedStates() {
    try {
      if (!root.localStorage) return {};
      var raw = root.localStorage.getItem(CACHE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && parsed.devices && typeof parsed.devices === "object" ? parsed.devices : {};
    } catch (err) {
      return {};
    }
  }

  function saveCachedStates(states) {
    try {
      root.localStorage.setItem(CACHE_KEY, JSON.stringify({
        v: 1,
        savedAt: Date.now(),
        devices: states || {}
      }));
    } catch (err) {
      /* storage may be unavailable */
    }
  }

  function clearCache() {
    try { if (root.localStorage) root.localStorage.removeItem(CACHE_KEY); } catch (err) { /* ignore */ }
  }

  /* ------------------------------------------------------------------ merge */

  function num(value) {
    var n = Number(value);
    return isFinite(n) ? n : 0;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function emptyBase() {
    return {
      v: 2,
      attempts: {},
      bookmarks: {},
      cards: {},
      exams: [],
      activity: {},
      settings: { examDate: null, examDateAt: 0 },
      daily: { date: "", drill: false, review: false, cards: false },
      visits: {},
      lastSummary: null,
      streak: { last: null, count: 0 }
    };
  }

  function examTime(exam) {
    var stamp = Date.parse((exam && (exam.date || exam.dateKey)) || "");
    return isFinite(stamp) ? stamp : 0;
  }

  function mergeStates(states, base) {
    var out = clone(base || emptyBase());
    var docs = Array.isArray(states) ? states : [];
    out.v = 2;
    out.attempts = {};
    out.bookmarks = {};
    out.cards = {};
    out.exams = [];
    out.activity = {};
    out.visits = {};

    docs.forEach(function (doc) {
      if (!doc || typeof doc !== "object") return;

      var attempts = doc.attempts;
      if (attempts && typeof attempts === "object") {
        Object.keys(attempts).forEach(function (id) {
          var src = attempts[id];
          if (!src || typeof src !== "object") return;
          var dst = out.attempts[id];
          if (!dst) {
            out.attempts[id] = {
              c: num(src.c),
              w: num(src.w),
              last: num(src.last),
              box: num(src.box),
              lastResult: src.lastResult === true
            };
            return;
          }
          dst.c = num(dst.c) + num(src.c);
          dst.w = num(dst.w) + num(src.w);
          if (num(src.last) > num(dst.last)) {
            dst.last = num(src.last);
            dst.box = num(src.box);
            dst.lastResult = src.lastResult === true;
          }
        });
      }

      var cards = doc.cards;
      if (cards && typeof cards === "object") {
        Object.keys(cards).forEach(function (id) {
          var src = cards[id];
          if (!src || typeof src !== "object") return;
          var dst = out.cards[id];
          if (!dst) {
            out.cards[id] = {
              box: num(src.box),
              due: typeof src.due === "string" ? src.due : "",
              seen: num(src.seen),
              lapses: num(src.lapses),
              last: num(src.last)
            };
            return;
          }
          dst.seen = num(dst.seen) + num(src.seen);
          dst.lapses = num(dst.lapses) + num(src.lapses);
          if (num(src.last) > num(dst.last)) {
            dst.box = num(src.box);
            dst.due = typeof src.due === "string" ? src.due : dst.due;
            dst.last = num(src.last);
          }
        });
      }

      var exams = doc.exams;
      if (Array.isArray(exams)) {
        exams.forEach(function (exam) {
          if (!exam || typeof exam !== "object") return;
          var id = typeof exam.id === "string" ? exam.id : "";
          if (!id) return;
          if (out.exams.some(function (e) { return e.id === id; })) return;
          out.exams.push(clone(exam));
        });
      }

      var bookmarks = doc.bookmarks;
      if (Array.isArray(bookmarks)) {
        bookmarks.forEach(function (id) {
          if (typeof id === "string" && !out.bookmarks[id]) {
            out.bookmarks[id] = { on: true, at: 0 };
          }
        });
      } else if (bookmarks && typeof bookmarks === "object") {
        Object.keys(bookmarks).forEach(function (id) {
          var src = bookmarks[id];
          if (src == null) return;
          var on = typeof src === "boolean" ? src : !!src.on;
          var at = typeof src === "object" ? num(src.at) : 0;
          var dst = out.bookmarks[id];
          if (!dst || at >= dst.at) out.bookmarks[id] = { on: on, at: at };
        });
      }

      var activity = doc.activity;
      if (activity && typeof activity === "object") {
        Object.keys(activity).forEach(function (key) {
          var src = activity[key];
          if (!src || typeof src !== "object") return;
          var dst = out.activity[key] || { a: 0, c: 0, cards: 0 };
          dst.a = num(dst.a) + num(src.a);
          dst.c = num(dst.c) + num(src.c);
          dst.cards = num(dst.cards) + num(src.cards);
          out.activity[key] = dst;
        });
      }

      var visits = doc.visits;
      if (visits && typeof visits === "object") {
        Object.keys(visits).forEach(function (id) {
          var at = num(visits[id]);
          if (at > num(out.visits[id])) out.visits[id] = at;
        });
      }
    });

    var bestAt = -1;
    var bestDate = out.settings && out.settings.examDate ? out.settings.examDate : null;
    docs.forEach(function (doc) {
      if (!doc || !doc.settings) return;
      var at = num(doc.settings.examDateAt);
      if (at > bestAt) {
        bestAt = at;
        bestDate = doc.settings.examDate || null;
      }
    });
    out.settings = { examDate: bestDate || null, examDateAt: bestAt >= 0 ? bestAt : 0 };

    var daily = null;
    docs.forEach(function (doc) {
      var day = doc && doc.daily;
      if (!day || typeof day.date !== "string") return;
      if (!daily || day.date > daily.date) {
        daily = { date: day.date, drill: !!day.drill, review: !!day.review, cards: !!day.cards };
      } else if (day.date === daily.date) {
        daily.drill = daily.drill || !!day.drill;
        daily.review = daily.review || !!day.review;
        daily.cards = daily.cards || !!day.cards;
      }
    });
    if (daily) out.daily = daily;

    var summary = out.lastSummary || null;
    var summaryAt = summary ? num(summary.finishedAt) : 0;
    docs.forEach(function (doc) {
      var next = doc && doc.lastSummary;
      if (next && typeof next === "object" && num(next.finishedAt) >= summaryAt) {
        summary = clone(next);
        summaryAt = num(next.finishedAt);
      }
    });
    out.lastSummary = summary;

    out.exams.sort(function (a, b) { return examTime(a) - examTime(b); });
    if (out.exams.length > 20) out.exams = out.exams.slice(-20);

    if (!out.streak || typeof out.streak !== "object") {
      out.streak = { last: null, count: 0 };
    }
    return out;
  }

  return {
    CONFIG_KEY: CONFIG_KEY,
    CACHE_KEY: CACHE_KEY,
    apiUrl: apiUrl,
    normalizeCode: normalizeCode,
    formatCode: formatCode,
    validCode: validCode,
    generateCode: generateCode,
    newDeviceId: newDeviceId,
    accountId: accountId,
    deriveKey: deriveKey,
    encryptState: encryptState,
    decryptState: decryptState,
    pull: pull,
    push: push,
    deleteDevice: deleteDevice,
    deleteAccount: deleteAccount,
    loadConfig: loadConfig,
    saveConfig: saveConfig,
    clearConfig: clearConfig,
    loadCachedStates: loadCachedStates,
    saveCachedStates: saveCachedStates,
    clearCache: clearCache,
    mergeStates: mergeStates
  };
});
