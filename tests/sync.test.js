"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
if (!globalThis.crypto) globalThis.crypto = require("node:crypto").webcrypto;
const sync = require("../CISSP/assets/sync.js");

function baseState() {
  return {
    v: 2,
    attempts: {},
    bookmarks: {},
    cards: {},
    exams: [],
    activity: {},
    settings: { examDate: null, examDateAt: 0 },
    daily: { date: "2026-11-02", drill: false, review: false, cards: false },
    visits: {},
    lastSummary: null,
    streak: { last: null, count: 0 }
  };
}

test("sync code formatting", () => {
  const raw = "0123456789abcdef0123456789abcdef";
  assert.equal(sync.normalizeCode("0123-4567 89ab-cdef"), "0123456789ABCDEF");
  assert.equal(sync.validCode(raw), true);
  assert.equal(sync.validCode("not-a-code"), false);
  assert.equal(sync.formatCode(raw), "0123-4567-89AB-CDEF-0123-4567-89AB-CDEF");
  assert.match(sync.generateCode(), /^[0-9A-F]{32}$/);
  assert.match(sync.newDeviceId(), /^[0-9a-f-]{36}$/);
});

test("account id is a stable SHA-256 fingerprint", async () => {
  const code = "0123456789ABCDEF0123456789ABCDEF";
  const first = await sync.accountId(code);
  const second = await sync.accountId(code.toLowerCase());
  assert.match(first, /^[0-9a-f]{64}$/);
  assert.equal(first, second);
});

test("attempts sum and keep the newest result", () => {
  const a = baseState();
  a.attempts.d1q1 = { c: 1, w: 0, last: 10, box: 1, lastResult: true };
  const b = baseState();
  b.attempts.d1q1 = { c: 0, w: 1, last: 20, box: 0, lastResult: false };
  b.attempts.d1q2 = { c: 2, w: 0, last: 5, box: 2, lastResult: true };

  const merged = sync.mergeStates([a, b], baseState());
  assert.equal(merged.attempts.d1q1.c, 1);
  assert.equal(merged.attempts.d1q1.w, 1);
  assert.equal(merged.attempts.d1q1.last, 20);
  assert.equal(merged.attempts.d1q1.box, 0);
  assert.equal(merged.attempts.d1q1.lastResult, false);
  assert.equal(merged.attempts.d1q2.c, 2);
  assert.equal(merged.attempts.d1q2.lastResult, true);
});

test("cards sum reviews and take the newest schedule", () => {
  const a = baseState();
  a.cards.c1 = { box: 1, due: "2026-11-03", seen: 1, lapses: 0, last: 10 };
  const b = baseState();
  b.cards.c1 = { box: 2, due: "2026-11-05", seen: 2, lapses: 0, last: 20 };
  b.cards.c2 = { box: 0, due: "2026-11-04", seen: 1, lapses: 1, last: 5 };

  const merged = sync.mergeStates([a, b], baseState());
  assert.equal(merged.cards.c1.seen, 3);
  assert.equal(merged.cards.c1.box, 2);
  assert.equal(merged.cards.c1.due, "2026-11-05");
  assert.equal(merged.cards.c2.lapses, 1);
  assert.equal(merged.cards.c2.seen, 1);
});

test("exams union by id and sort chronologically", () => {
  const a = baseState();
  a.exams = [
    { id: "e2", date: "2026-11-02", dateKey: "2026-11-02", total: 10, correct: 7 },
    { id: "e1", date: "2026-11-01", dateKey: "2026-11-01", total: 10, correct: 6 }
  ];
  const b = baseState();
  b.exams = [
    { id: "e2", date: "2026-11-02", dateKey: "2026-11-02", total: 10, correct: 7 },
    { id: "e3", date: "2026-11-03", dateKey: "2026-11-03", total: 10, correct: 8 }
  ];

  const merged = sync.mergeStates([a, b], baseState());
  assert.deepEqual(merged.exams.map((e) => e.id), ["e1", "e2", "e3"]);
});

test("bookmark removal wins over an older save", () => {
  const a = baseState();
  a.bookmarks.q1 = { on: true, at: 10 };
  a.bookmarks.q2 = { on: true, at: 10 };
  const b = baseState();
  b.bookmarks.q1 = { on: false, at: 20 };
  b.bookmarks.q2 = { on: true, at: 20 };

  const merged = sync.mergeStates([a, b], baseState());
  assert.equal(merged.bookmarks.q1.on, false);
  assert.equal(merged.bookmarks.q2.on, true);
});

test("activity, daily, settings and visits merge", () => {
  const a = baseState();
  a.activity["2026-11-02"] = { a: 2, c: 1, cards: 1 };
  a.daily = { date: "2026-11-02", drill: true, review: false, cards: false };
  a.settings = { examDate: "2026-11-30", examDateAt: 10 };
  a.visits = { 1: 100, 2: 50 };

  const b = baseState();
  b.activity["2026-11-02"] = { a: 1, c: 1, cards: 2 };
  b.activity["2026-11-01"] = { a: 1, c: 1, cards: 0 };
  b.daily = { date: "2026-11-02", drill: false, review: true, cards: true };
  b.settings = { examDate: "2026-12-01", examDateAt: 20 };
  b.visits = { 1: 200 };

  const merged = sync.mergeStates([a, b], baseState());
  assert.deepEqual(merged.activity["2026-11-02"], { a: 3, c: 2, cards: 3 });
  assert.equal(merged.activity["2026-11-01"].a, 1);
  assert.deepEqual(merged.daily, { date: "2026-11-02", drill: true, review: true, cards: true });
  assert.equal(merged.settings.examDate, "2026-12-01");
  assert.equal(merged.settings.examDateAt, 20);
  assert.equal(merged.visits["1"], 200);
  assert.equal(merged.visits["2"], 50);
});
