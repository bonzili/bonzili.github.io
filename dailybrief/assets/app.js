(() => {
  'use strict';

  const app = document.getElementById('app');
  const LS = 'dailybrief.v1.';
  const KEY = {
    workspace: LS + 'workspace',
    read: (ws) => LS + ws + '.read',
    saved: (ws) => LS + ws + '.saved',
    lastData: LS + 'lastData',
    hint: LS + 'hintDismissed',
  };
  const TZ = 'Asia/Hong_Kong';
  const FALLBACK_COLOR = '#0B6B5D';
  const FALLBACK_COLOR_DARK = '#6FD3BE';

  const copy = {
    en: {
      today: 'Today', topics: 'Topics', saved: 'Saved', archive: 'Archive',
      open: 'Open', close: 'Close', save: 'Save for later', unsave: 'Remove from saved',
      story: 'story', stories: 'stories', updated: 'Updated', next: 'Next',
      sourceHealth: 'Source health', allSources: 'All sources responded.',
      sourceFailures: 'sources failed', sourcesChecked: 'sources checked',
      savedEmptyTitle: 'Nothing saved yet.',
      savedEmptyBody: 'Tap the bookmark on a story and it will wait here, on this phone.',
      savedSub: 'Kept on this phone. Not synced.',
      topicsSub: 'Everything pulled today, by subject. The brief is still the finite read.',
      archiveSub: 'The last 30 days of editions.',
      archiveEmptyTitle: 'No archive yet.',
      archiveEmptyBody: 'The first scheduled edition will appear here.',
      quietTitle: 'A quiet wire.',
      quietBody: 'Nothing new in these topics today. The next edition is at the scheduled time.',
      errorTitle: 'The wire is down.',
      errorBody: "The brief couldn't load. Check your connection and try again.",
      retry: 'Try again',
      stale: 'Saved copy',
      demo: 'Demo data',
      offline: 'Showing the last edition saved on this phone.',
      refreshTitle: 'Check for a new edition',
      chooserTitle: 'Pick your brief.',
      chooserSub: 'Two editions, one wire. Your choice stays on this phone.',
      chooserFoot: 'On iPhone: Share → Add to Home Screen for the full-screen version.',
      chooserFootStrong: 'Daily Brief',
      pick: 'Read this brief',
      switchTitle: 'Switch brief',
      switchNote: 'Your choice is stored on this device. Read state and saved stories stay in their own workspace.',
      markRead: 'opened',
      progressLabel: 'Reading progress',
      checking: 'Checking…',
      discussion: 'Discussion',
      sources: 'Sources',
      items: 'items',
      noTopic: 'No topic',
      nextEdition: 'Next edition',
      asItRan: 'as it ran',
      sourceSub: 'Each source is fetched separately. One broken feed never hides the rest of the brief.',
      sourceEmpty: 'No source health was recorded for this edition.',
      backToday: 'Back to today',
      backTopics: 'All topics',
      backArchive: 'Archive',
      savedOn: 'Saved',
      remove: 'Remove',
      all: 'All',
      filterBy: 'Filter by practice area',
      loadingEdition: 'Loading edition…',
      caughtUpKicker: 'Read',
      caughtUpTitle: "You're caught up.",
      caughtUpBody: 'Everything in this edition has already been read. New stories land with the next edition.',
      source: 'source', sources: 'sources', comment: 'comment', comments: 'comments',
      singleSource: 'Single source', excerpt: 'Excerpt',
      howItWorks: 'How this works', aboutTitle: 'How this works',
      aboutSub: 'Twice-daily collection, a finite brief, and a static app.',
      loaded: 'Loaded.',
      refreshed: 'Brief refreshed.',
      refreshFailed: "Couldn't refresh. Showing the last edition on this phone.",
      savedToast: 'Saved for later.',
      removedToast: 'Removed from saved.',
      installHint: 'Tip: add this to your Home Screen from Safari’s Share menu.',
      dismiss: 'Dismiss',
    },
    zh: {
      today: '今日', topics: '主題', saved: '已存', archive: '存檔',
      open: '展開', close: '收起', save: '儲存', unsave: '移除',
      story: '則', stories: '則', updated: '更新', next: '下一版',
      sourceHealth: '來源狀態', allSources: '所有來源正常。',
      sourceFailures: '個來源失敗', sourcesChecked: '個來源已檢查',
      savedEmptyTitle: '尚未儲存任何報導。',
      savedEmptyBody: '點按報導上的書籤，它會留在這部手機。',
      savedSub: '只存於此手機，不會同步。',
      topicsSub: '今日抓取的所有內容，按主題排列。簡報仍然是有限的一讀。',
      archiveSub: '過去 30 天的版本。',
      archiveEmptyTitle: '尚未有存檔。',
      archiveEmptyBody: '第一次排程更新後，版本會出現在這裡。',
      quietTitle: '今日風平浪靜。',
      quietBody: '這些主題暫時沒有新內容。下一版會在排程時間出現。',
      errorTitle: '連線中斷。',
      errorBody: '無法載入簡報。請檢查網絡，然後再試一次。',
      retry: '再試一次',
      stale: '已存副本',
      demo: '示範資料',
      offline: '顯示這部手機上次儲存的版本。',
      refreshTitle: '檢查新版本',
      chooserTitle: '選擇你的簡報。',
      chooserSub: '兩份簡報，同一條線。選擇只會留在這部手機。',
      chooserFoot: 'iPhone：分享 → 加入主畫面，即可全螢幕閱讀。',
      chooserFootStrong: 'Daily Brief',
      pick: '閱讀這份簡報',
      switchTitle: '切換簡報',
      switchNote: '選擇只會存在這部裝置。已讀狀態與儲存的報導各自獨立。',
      markRead: '已展開',
      progressLabel: '閱讀進度',
      checking: '檢查中…',
      discussion: '討論',
      sources: '來源',
      items: '項',
      noTopic: '未分類',
      nextEdition: '下一版',
      asItRan: '當時版本',
      sourceSub: '每個來源獨立抓取。一個來源故障，不會藏起其餘內容。',
      sourceEmpty: '此版本沒有來源狀態紀錄。',
      backToday: '返回今日',
      backTopics: '所有主題',
      backArchive: '存檔',
      savedOn: '已存於',
      remove: '移除',
      all: '全部',
      filterBy: '按範疇篩選',
      loadingEdition: '載入版本…',
      caughtUpKicker: '已讀',
      caughtUpTitle: '你已讀完。',
      caughtUpBody: '此版本的所有內容都已讀過。下一版會有新內容。',
      source: '來源', sources: '來源', comment: '留言', comments: '留言',
      singleSource: '單一來源', excerpt: '原文摘錄',
      howItWorks: '運作方式', aboutTitle: '運作方式',
      aboutSub: '每日兩次抓取、有限簡報、靜態應用程式。',
      loaded: '已載入。',
      refreshed: '簡報已更新。',
      refreshFailed: '無法更新，顯示這部手機上次的版本。',
      savedToast: '已儲存。',
      removedToast: '已移除。',
      installHint: '提示：在 Safari 的分享選單選擇「加入主畫面」。',
      dismiss: '關閉',
    },
  };

  const state = {
    data: null,
    archiveIndex: null,
    archiveEdition: null,
    workspaceId: null,
    read: {},
    saved: [],
    demo: false,
    booting: true,
    loading: true,
    fallback: false,
    routeLoading: false,
    error: null,
    tagFilter: 'All',
    tagFilterTopic: null,
  };

  let routeToken = 0;

  // ---------- small helpers ----------

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeUrl(value) {
    try {
      const url = new URL(String(value || ''), location.href);
      if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
    } catch (err) { /* ignore */ }
    return '#';
  }

  function safeColor(value, fallback) {
    return /^#[0-9a-f]{3,8}$/i.test(String(value || '')) ? value : fallback;
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  function removeStored(key) {
    try { localStorage.removeItem(key); } catch (err) { /* ignore */ }
  }

  function locale() {
    return state.workspaceId && workspace()?.lang?.startsWith('zh') ? 'zh-HK' : 'en';
  }

  function isZH() {
    return locale().startsWith('zh');
  }

  function t(key) {
    const lang = isZH() ? 'zh' : 'en';
    return copy[lang][key] ?? copy.en[key] ?? key;
  }

  function pickLangIn(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.en || Object.values(value)[0] || '';
  }

  function pickLang(value) {
    return pickLangIn(value, isZH() ? 'zh' : 'en');
  }

  function deviceLang() {
    // Both briefs use an English interface. Only the article content follows
    // the source language.
    return 'en';
  }

  function tDevice(key) {
    return copy[deviceLang()][key] ?? copy.en[key] ?? key;
  }

  function pickDevice(value) {
    return pickLangIn(value, deviceLang());
  }

  function workspace() {
    return state.data?.workspaces?.[state.workspaceId] || null;
  }

  function workspaceList() {
    return Object.entries(state.data?.workspaces || {}).map(([id, ws]) => ({ id, ...ws }));
  }

  function topicById(id) {
    return state.data?.topics?.find((topic) => topic.id === id) || null;
  }

  function topicVars(topic) {
    const color = safeColor(topic?.color, FALLBACK_COLOR);
    const dark = safeColor(topic?.color_dark, color);
    return `--topic:${esc(color)};--topic-dark:${esc(dark)}`;
  }

  function formatDate(iso, opts = { weekday: 'short', day: 'numeric', month: 'short' }) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(locale(), { ...opts, timeZone: TZ }).format(date);
  }

  function formatTime(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(locale(), {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ,
    }).format(date);
  }

  function formatHeroDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const lang = locale();
    const weekday = new Intl.DateTimeFormat(lang, { weekday: 'long', timeZone: TZ }).format(date);
    const day = new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', timeZone: TZ }).format(date);
    return `${esc(weekday)}<br>${esc(day)}`;
  }

  function formatGroupDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(locale(), {
      weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ,
    }).format(date);
  }

  function relativeTime(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const diff = date.getTime() - Date.now();
    const abs = Math.abs(diff);
    const rtf = new Intl.RelativeTimeFormat(locale(), { numeric: 'auto' });
    if (abs < 60 * 60 * 1000) {
      const mins = Math.round(diff / 60000);
      return rtf.format(Math.max(-59, mins), 'minute');
    }
    if (abs < 24 * 60 * 60 * 1000) {
      return rtf.format(Math.round(diff / 3600000), 'hour');
    }
    return rtf.format(Math.round(diff / 86400000), 'day');
  }

  function editionLabel() {
    return pickLang(state.archiveEdition?.edition_label || state.data?.edition_label || '');
  }

  function currentEdition() {
    return state.archiveEdition || state.data;
  }

  function currentWorkspace() {
    return currentEdition()?.workspaces?.[state.workspaceId] || workspace();
  }

  function isStale(iso) {
    const date = new Date(iso);
    return !Number.isNaN(date.getTime()) && Date.now() - date.getTime() > 24 * 3600 * 1000;
  }

  function briefPicks(edition, ws) {
    return (ws?.picks || []).map((pick) => {
      const card = edition?.cards?.find((item) => item.id === pick.card_id);
      return card ? { card, pick } : null;
    }).filter(Boolean);
  }

  function readInPreviousEdition(cardId, edition) {
    const readAt = Number(state.read[cardId] || 0);
    const editionAt = new Date(edition?.generated_at || 0).getTime();
    return readAt > 0 && editionAt > 0 && readAt < editionAt;
  }

  function visibleBriefPicks(edition, ws, { archive = false } = {}) {
    const all = briefPicks(edition, ws);
    if (archive) return all;
    return all.filter(({ card }) => !readInPreviousEdition(card.id, edition));
  }

  function sourceStatus() {
    if (Array.isArray(state.archiveEdition?.source_status)) return state.archiveEdition.source_status;
    return Array.isArray(state.data?.source_status) ? state.data.source_status : [];
  }

  function workspaceStatuses() {
    const statuses = sourceStatus();
    const ws = currentWorkspace();
    if (!ws?.topic_ids?.length) return statuses;
    return statuses.filter((source) => ws.topic_ids.includes(source.topic));
  }

  function countForWorkspace(edition, wsId) {
    return edition?.workspaces?.[wsId]?.picks?.length || 0;
  }

  function topicNames(ws) {
    return (ws?.topic_ids || [])
      .map((id) => pickLang(topicById(id)?.name) || id)
      .filter(Boolean)
      .join(isZH() ? '、' : ', ');
  }

  function storyCount(n) {
    return `${n} ${n === 1 ? t('story') : t('stories')}`;
  }

  function parseHash() {
    const raw = (location.hash || '').replace(/^#\/?/, '');
    const parts = raw.split('/').filter(Boolean);
    if (!parts.length) return { view: 'today' };
    if (parts[0] === 'topic') return { view: 'topic', param: decodeURIComponent(parts[1] || '') };
    if (parts[0] === 'archive') return { view: 'archive', param: parts[1] ? decodeURIComponent(parts[1]) : '' };
    if (['today', 'topics', 'saved', 'archive', 'sources', 'about'].includes(parts[0])) {
      return { view: parts[0] };
    }
    return { view: 'today' };
  }

  function navigate(hash) {
    if (location.hash !== hash) location.hash = hash;
    else handleRoute();
  }

  // ---------- data ----------

  async function fetchJSON(path) {
    const url = new URL(path, new URL('data/', document.baseURI));
    url.searchParams.set('v', String(Date.now()));
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function loadData({ refresh = false } = {}) {
    const wasLoaded = Boolean(state.data);
    let pendingToast = null;
    if (!wasLoaded) {
      state.loading = true;
      state.error = null;
      render();
    } else if (refresh) {
      showToast(t('checking'));
    }

    try {
      const data = await fetchJSON(state.demo ? 'demo.json' : 'today.json');
      if (!data || !data.workspaces || !Array.isArray(data.cards)) {
        throw new Error('Invalid brief data');
      }
      state.data = data;
      state.fallback = false;
      state.loading = false;
      state.error = null;
      if (!state.demo) {
        try { writeJSON(KEY.lastData, data); } catch (err) { /* ignore */ }
      }
      if (refresh) pendingToast = t('refreshed');
    } catch (err) {
      if (state.fallback || state.data) {
        if (refresh) pendingToast = t('refreshFailed');
      } else {
        const cached = readJSON(KEY.lastData, null);
        if (cached && cached.workspaces && Array.isArray(cached.cards)) {
          state.data = cached;
          state.fallback = true;
          state.loading = false;
          state.error = null;
          pendingToast = t('offline');
        } else {
          state.loading = false;
          state.error = err;
        }
      }
    }
    render();
    if (pendingToast) showToast(pendingToast);
  }

  async function loadArchiveIndex() {
    if (state.archiveIndex) return state.archiveIndex;
    try {
      const index = await fetchJSON('archive/index.json');
      state.archiveIndex = index && Array.isArray(index.editions) ? index : { editions: [] };
    } catch (err) {
      state.archiveIndex = { editions: [] };
    }
    return state.archiveIndex;
  }

  async function loadArchiveEdition(file) {
    if (!/^[a-z0-9._-]+\.json$/i.test(file)) throw new Error('Invalid archive file');
    if (state.archiveEdition?.__file === file) return state.archiveEdition;
    const edition = await fetchJSON(`archive/${file}`);
    if (!edition || !edition.workspaces || !Array.isArray(edition.cards)) {
      throw new Error('Invalid archive edition');
    }
    edition.__file = file;
    state.archiveEdition = edition;
    return edition;
  }

  // ---------- workspace / local state ----------

  function resolveWorkspace() {
    const ids = Object.keys(state.data?.workspaces || {});
    const query = new URLSearchParams(location.search);
    const requested = query.get('ws');
    if (requested && ids.includes(requested)) {
      writeJSON(KEY.workspace, requested);
      query.delete('ws');
      const next = location.pathname + (query.toString() ? `?${query}` : '') + location.hash;
      history.replaceState(null, '', next);
      return requested;
    }
    const stored = readJSON(KEY.workspace, null);
    if (stored && ids.includes(stored)) return stored;
    return null;
  }

  function loadWorkspaceState(id) {
    state.workspaceId = id;
    state.read = readJSON(KEY.read(id), {});
    state.saved = readJSON(KEY.saved(id), []);
    if (!state.read || typeof state.read !== 'object' || Array.isArray(state.read)) state.read = {};
    if (!Array.isArray(state.saved)) state.saved = [];
    document.documentElement.lang = isZH() ? 'zh-Hant-HK' : 'en';
    const selected = state.data?.workspaces?.[id];
    document.title = selected ? `Daily Brief · ${pickLang(selected.name)}` : 'Daily Brief';
  }

  function chooseWorkspace(id, { persist = true } = {}) {
    if (!state.data?.workspaces?.[id]) return;
    if (persist) writeJSON(KEY.workspace, id);
    loadWorkspaceState(id);
    if (document.getElementById('ws-dialog')) {
      try { document.getElementById('ws-dialog').close(); } catch (err) { /* ignore */ }
    }
    const route = parseHash();
    const nextWs = state.data?.workspaces?.[id];
    if (route.view === 'topic' && nextWs && !(nextWs.topic_ids || []).includes(route.param)) {
      history.replaceState(null, '', location.pathname + location.search + '#/topics');
    }
    if (!location.hash || location.hash === '#/' || location.hash === '#') {
      history.replaceState(null, '', location.pathname + location.search + '#/today');
    }
    if (parseHash().view === 'archive') {
      handleRoute();
      return;
    }
    render();
  }

  function persistRead() {
    if (state.workspaceId) writeJSON(KEY.read(state.workspaceId), state.read);
  }

  function persistSaved() {
    if (state.workspaceId) writeJSON(KEY.saved(state.workspaceId), state.saved);
  }

  function isRead(id) {
    return Boolean(state.read[id]);
  }

  function markRead(id) {
    if (!id || state.read[id]) return;
    state.read[id] = Date.now();
    persistRead();
    updateProgress();
    const card = document.querySelector(`[data-card-id="${cssEscape(id)}"]`);
    if (card) card.classList.add('is-read');
  }

  function isSaved(id) {
    return state.saved.some((entry) => entry?.card?.id === id);
  }

  function findContext(cardId) {
    const editions = [state.archiveEdition, state.data].filter(Boolean);
    for (const edition of editions) {
      const card = edition.cards.find((item) => item.id === cardId);
      if (!card) continue;
      const pick = edition.workspaces?.[state.workspaceId]?.picks?.find((item) => item.card_id === cardId) || null;
      return { card, pick };
    }
    const saved = state.saved.find((entry) => entry?.card?.id === cardId);
    return saved ? { card: saved.card, pick: saved.pick || null } : null;
  }

  function toggleSaved(cardId) {
    const existing = state.saved.findIndex((entry) => entry?.card?.id === cardId);
    if (existing >= 0) {
      state.saved.splice(existing, 1);
      persistSaved();
      showToast(t('removedToast'));
      if (parseHash().view === 'saved') render();
      else updateSaveButtons(cardId);
      return;
    }
    const context = findContext(cardId);
    if (!context?.card) return;
    state.saved.unshift({ card: context.card, pick: context.pick, savedAt: Date.now() });
    if (state.saved.length > 200) state.saved.length = 200;
    persistSaved();
    showToast(t('savedToast'));
    updateSaveButtons(cardId);
  }

  function cssEscape(value) {
    if (window.CSS?.escape) return CSS.escape(value);
    return String(value).replace(/["\\]/g, '\\$&');
  }

  // ---------- icons ----------

  const icons = {
    file: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 3.5h9l4 4v13h-13z"/><path d="M14.5 3.5v4h4M8.5 12h7M8.5 15.5h4.5"/></svg>',
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 4.5h11v15l-5.5-3.8-5.5 3.8z"/></svg>',
    bookmarkFill: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M6.5 4.5h11v15l-5.5-3.8-5.5 3.8z"/></svg>',
    archive: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.5h16v4H4zM5.5 11.5v8h13v-8M9.5 15.5h5"/></svg>',
    chevron: '<svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7.5l5 5 5-5"/></svg>',
    chevronRight: '<svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 5l5 5-5 5"/></svg>',
    arrowLeft: '<svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 10h-11M9 5.5L4.5 10 9 14.5"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 8.5A7.5 7.5 0 1 0 19.3 14"/><path d="M19 4.5v4h-4"/></svg>',
    close: '<svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg>',
    check: '<svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 10.5l3.5 3.5 7.5-8"/></svg>',
    link: '<svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12l4-4M7 14l-1 .8a3 3 0 0 1-4.2-4.2L5 8a3 3 0 0 1 4.2 0M13 6l1-.8a3 3 0 1 1 4.2 4.2L15 12a3 3 0 0 1-4.2 0"/></svg>',
  };

  // ---------- rendering ----------

  function renderBoot() {
    return `<div class="boot" role="status" aria-live="polite">
      <div class="boot__mark" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="boot__name">Daily Brief</p>
      <p class="boot__line">Loading the wire…</p>
    </div>`;
  }

  function render() {
    if (state.booting) return;
    if (state.loading && !state.data) {
      app.innerHTML = renderBoot();
      return;
    }
    if (state.error && !state.data) {
      app.innerHTML = renderError();
      return;
    }
    if (!state.data) {
      app.innerHTML = renderError();
      return;
    }
    if (!state.workspaceId) {
      app.innerHTML = renderChooser();
      return;
    }
    app.innerHTML = renderShell();
    updateProgress();
  }

  function renderError() {
    return `
      <main class="chooser" id="main" tabindex="-1">
        <div class="chooser__head">
          <p class="chooser__eyebrow"><span class="bar"></span>Daily Brief</p>
          <h1 class="chooser__title">${esc(tDevice('errorTitle'))}</h1>
          <p class="chooser__sub">${esc(tDevice('errorBody'))}</p>
          <button class="button" type="button" data-action="refresh">${esc(tDevice('retry'))}</button>
        </div>
        <p class="chooser__foot"><strong>bonzili.me</strong> · Daily Brief</p>
      </main>`;
  }

  function renderChooser() {
    const workspaces = workspaceList();
    const cards = workspaces.map((ws) => {
      const topics = (ws.topic_ids || []).map((id) => {
        const topic = topicById(id);
        return `<span class="choose-card__topic" style="${topicVars(topic)}">${esc(topic?.short || pickDevice(topic?.name) || id)}</span>`;
      }).join('');
      const accent = safeColor(ws.accent, FALLBACK_COLOR);
      return `
        <button class="choose-card" type="button" data-action="choose-workspace" data-ws="${esc(ws.id)}" style="--accent:${esc(accent)}">
          <span class="choose-card__name">${esc(pickDevice(ws.name) || ws.id)}</span>
          <span class="choose-card__desc">${esc(pickDevice(ws.description) || '')}</span>
          <span class="choose-card__topics">${topics}</span>
          <span class="choose-card__go" aria-hidden="true">${icons.chevronRight}</span>
        </button>`;
    }).join('');

    return `
      <main class="chooser" id="main" tabindex="-1">
        <div class="chooser__head">
          <p class="chooser__eyebrow"><span class="bar"></span>Daily Brief</p>
          <h1 class="chooser__title">${esc(tDevice('chooserTitle'))}</h1>
          <p class="chooser__sub">${esc(tDevice('chooserSub'))}</p>
        </div>
        <div class="chooser__cards">${cards}</div>
        <p class="chooser__foot">${esc(tDevice('chooserFoot'))}<br><strong>${esc(tDevice('chooserFootStrong'))}</strong> · bonzili.me</p>
      </main>`;
  }

  function renderShell() {
    const route = parseHash();
    const ws = currentWorkspace() || workspace();
    const meta = currentEdition() || state.data;
    const stale = isStale(meta?.generated_at);
    const label = editionLabel();

    return `
      <header class="top">
        <div class="top__bar">
          <a class="wordmark" href="#/today" aria-label="Daily Brief, today">
            <span class="wordmark__mark" aria-hidden="true"><span></span><span></span><span></span></span>
            <span class="wordmark__text">Daily Brief</span>
          </a>
          <button class="workspace-switch" type="button" data-action="open-workspace" aria-haspopup="dialog" aria-controls="ws-dialog">
            <span class="workspace-switch__dot" style="background:${esc(safeColor(ws?.accent, FALLBACK_COLOR))}"></span>
            <span class="workspace-switch__name">${esc(pickLang(ws?.name) || '')}</span>
            ${icons.chevron}
          </button>
        </div>
        <div class="top__meta">
          <span>${esc(label || '')}</span>
          <span class="sep">/</span>
          <span class="${stale ? 'stale' : ''}">${esc(t('updated'))} ${esc(formatTime(meta?.generated_at))} HKT${stale ? ` · ${esc(t('staleLabel'))}` : ''}</span>
          ${state.demo ? `<span class="sep">/</span><span>${esc(t('demo'))}</span>` : ''}
          ${state.fallback ? `<span class="sep">/</span><span class="stale">${esc(t('stale'))}</span>` : ''}
          <button class="top__refresh" type="button" data-action="refresh" aria-label="${esc(t('refreshTitle'))}" title="${esc(t('refreshTitle'))}">${icons.refresh}</button>
        </div>
        <div class="progress" role="progressbar" aria-label="${esc(t('progressLabel'))}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="progress__fill"></div></div>
      </header>
      <main class="main" id="main" tabindex="-1">
        ${state.routeLoading ? renderRouteLoading() : renderView(route)}
      </main>
      ${renderTabbar(route)}
      ${renderWorkspaceDialog()}
    `;
  }

  function renderRouteLoading() {
    return `<div class="empty"><p class="empty__kicker">Daily Brief</p><p class="empty__title">${esc(t('loadingEdition'))}</p></div>`;
  }

  function renderView(route) {
    switch (route.view) {
      case 'topics': return renderTopics();
      case 'topic': return renderTopic(route.param);
      case 'saved': return renderSaved();
      case 'archive': return route.param ? renderArchiveEdition() : renderArchive();
      case 'sources': return renderSources();
      case 'about': return renderAbout();
      case 'today':
      default: return renderBrief({ archive: false });
    }
  }

  function renderBrief({ archive = false } = {}) {
    const edition = archive ? state.archiveEdition : state.data;
    if (!edition) return renderRouteLoading();
    const ws = edition.workspaces?.[state.workspaceId];
    if (!ws) return '';
    const allPicks = briefPicks(edition, ws);
    const picks = archive ? allPicks : allPicks.filter(({ card }) => !readInPreviousEdition(card.id, edition));
    const hiddenCount = allPicks.length - picks.length;
    const names = topicNames(ws);
    const end = isZH() ? '。' : '.';
    const nextLine = edition.next_update
      ? `${t('nextEdition')} ${formatTime(edition.next_update)} HKT${isZH() ? '。' : '.'}`
      : '';
    const failed = workspaceStatuses().filter((source) => !source.ok).length;
    const total = picks.length;

    const hero = archive
      ? `<a class="back-link" href="#/archive">${icons.arrowLeft}${esc(t('backArchive'))}</a>
         <div class="page-head">
           <p class="eyebrow"><span class="eyebrow__dot"></span>${esc(t('archive'))} · ${esc(editionLabel())}</p>
           <h1 class="brief-title">${formatHeroDate(edition.generated_at)}</h1>
           <p class="brief-sub">${esc(storyCount(total))} ${esc(t('asItRan'))}.</p>
         </div>`
      : `<div class="page-head">
           <p class="eyebrow"><span class="eyebrow__dot"></span>${esc(editionLabel())} · ${esc(storyCount(total))}</p>
           <h1 class="brief-title">${formatHeroDate(edition.generated_at)}</h1>
           <p class="brief-sub">${esc(names)}${names ? esc(end) : ''}${isZH() ? '' : ' '}${esc(nextLine)}</p>
         </div>`;

    if (!total) {
      const caughtUp = !archive && hiddenCount > 0;
      return `${hero}
        <div class="empty">
          <p class="empty__kicker">${esc(caughtUp ? t('caughtUpKicker') : t('today'))}</p>
          <h2 class="empty__title">${esc(caughtUp ? t('caughtUpTitle') : t('quietTitle'))}</h2>
          <p class="empty__body">${esc(caughtUp ? t('caughtUpBody') : t('quietBody'))}</p>
          ${caughtUp ? `<a class="button button--quiet" href="#/topics">${esc(t('topics'))}</a>` : ''}
        </div>
        ${renderSourceFooter(failed)}`;
    }

    const stories = picks.map(({ card, pick }, index) => renderStory(card, pick, index)).join('');
    const hiddenNote = hiddenCount
      ? `<p class="footer-note">${esc(isZH()
        ? `${hiddenCount} 則先前已讀的故事未顯示於此版本。`
        : `${hiddenCount} previously read ${hiddenCount === 1 ? 'story' : 'stories'} hidden from this edition.`)}</p>`
      : '';
    return `${hero}<div class="stories">${stories}</div>${hiddenNote}${renderSourceFooter(failed)}`;
  }

  function renderSourceFooter(failed) {
    const statuses = workspaceStatuses();
    if (!statuses.length) return '';
    const total = statuses.length;
    const text = failed
      ? (isZH()
        ? `${failed} 個來源失敗 / ${total} 個來源已檢查`
        : `${failed} ${failed === 1 ? 'source' : 'sources'} failed / ${total} sources checked`)
      : esc(t('allSources'));
    return `<p class="footer-note">${text} · <a href="#/sources">${esc(t('sourceHealth'))}</a> · <a href="#/about">${esc(t('howItWorks'))}</a></p>`;
  }

  function renderStory(card, pick, index) {
    const topic = topicById(card.topic) || {
      short: (card.topic || '—').slice(0, 2).toUpperCase(),
      color: FALLBACK_COLOR,
      color_dark: FALLBACK_COLOR_DARK,
    };
    const bullets = (pick?.bullets?.length ? pick.bullets : card.bullets) || [];
    const why = pick?.why || card.why || '';
    const comments = Array.isArray(card.comments) ? card.comments.slice(0, 5) : [];
    const sources = Array.isArray(card.sources) ? card.sources.slice(0, 5) : [];
    const sourceCount = Number(card.cluster_size || sources.length || 0);
    const commentCount = comments.length;
    const summarySource = pick?.summary_source || (pick ? '' : 'extractive');
    const read = isRead(card.id);
    const open = false;
    const saved = isSaved(card.id);
    const number = String(index + 1).padStart(2, '0');
    const publisher = card.publisher || sources[0]?.publisher || '';
    const when = card.published ? relativeTime(card.published) : '';
    const tags = (Array.isArray(card.tags) ? card.tags : (card.tag ? [card.tag] : [])).filter(Boolean).slice(0, 2);
    const contentLang = card.headline_lang || 'en';
    const jurisdiction = card.jurisdiction || '';
    const cardId = esc(card.id);
    const bodyId = `card-body-${cardId}`;

    const bulletHtml = bullets.length
      ? `<ul class="bullets" lang="${esc(contentLang)}">${bullets.slice(0, 4).map((bullet) => `<li>${esc(bullet)}</li>`).join('')}</ul>`
      : `<p class="story__why">${esc(card.summary || 'Read the source for detail.')}</p>`;

    const commentsHtml = comments.length ? `
      <p class="block-label">${esc(t('discussion'))}</p>
      <div class="comments">${comments.map((comment) => {
        const meta = [
          comment.platform,
          comment.label,
          comment.author,
          comment.score != null ? String(comment.score) : '',
        ].filter(Boolean).join(' · ');
        const href = safeUrl(comment.url);
        const metaHtml = href !== '#'
          ? `<a class="comment__meta" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(meta)}</a>`
          : `<p class="comment__meta">${esc(meta)}</p>`;
        const commentLang = comment.platform === 'PTT' ? 'zh-Hant' : 'en';
        return `<figure class="comment"><blockquote class="comment__text" lang="${esc(commentLang)}">${esc(comment.text)}</blockquote>${metaHtml}</figure>`;
      }).join('')}</div>` : '';

    const sourcesHtml = sources.length ? `
      <p class="block-label">${esc(t('sources'))}</p>
      <div class="sources">${sources.map((source) => {
        const href = safeUrl(source.url);
        const sourceMeta = [source.publisher, source.published ? formatDate(source.published, { day: 'numeric', month: 'short' }) : ''].filter(Boolean).join(' · ');
        return `<a class="source" href="${esc(href)}" target="_blank" rel="noopener noreferrer">
          <span class="source__publisher">${esc(sourceMeta)}</span>
          <span class="source__title" lang="${esc(source.lang || contentLang)}">${esc(source.title || source.url || '')}</span>
          <span class="source__arrow" aria-hidden="true">↗</span>
        </a>`;
      }).join('')}</div>` : '';

    const signalParts = [];
    if (sourceCount) signalParts.push(`<span>${sourceCount} ${esc(sourceCount === 1 ? t('source') : t('sources'))}</span>`);
    if (commentCount) signalParts.push(`<span>${commentCount} ${esc(commentCount === 1 ? t('comment') : t('comments'))}</span>`);
    if (sourceCount === 1) signalParts.push(`<span class="signal signal--warn">${esc(t('singleSource'))}</span>`);
    if (summarySource === 'extractive') signalParts.push(`<span class="signal signal--muted">${esc(t('excerpt'))}</span>`);
    const signals = signalParts.join('<span class="signal-sep" aria-hidden="true">·</span>');

    const summary = `
      <button class="story__summary" type="button" data-action="toggle-story" data-card-id="${cardId}" aria-expanded="${open}" aria-controls="${esc(bodyId)}">
        <span class="story__top">
          <span class="story__number">${number}</span>
          <span class="topic" style="${topicVars(topic)}">${esc(topic.short || '')}</span>
          ${tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join('')}
          <span class="story__meta">${esc(jurisdiction ? `${jurisdiction} · ` : '')}${esc(publisher)}${when ? `<span class="sep">·</span>${esc(when)}` : ''}</span>
        </span>
        <span class="story__headline" role="heading" aria-level="2" lang="${esc(card.headline_lang || 'en')}" title="${esc(card.headline || '')}">${esc(card.headline || '')}</span>
        ${why ? `<span class="story__why" lang="${esc(contentLang)}"><span class="why-mark" aria-hidden="true">→</span>${esc(why)}</span>` : ''}
        <span class="story__footline">
          <span class="story__signals">${signals}</span>
          <span class="story__cue">${esc(t('open'))} ${icons.chevron}</span>
        </span>
      </button>`;

    return `
      <article class="story${open ? ' is-open' : ''}${read ? ' is-read' : ''}" data-card-id="${cardId}" style="${topicVars(topic)}">
        <div class="story__rail" aria-hidden="true"><span class="story__dot"></span></div>
        <div class="story__main">
          <button class="story__save" type="button" data-action="save-story" data-card-id="${cardId}" aria-pressed="${saved}" aria-label="${esc(saved ? t('unsave') : t('save'))}">${saved ? icons.bookmarkFill : icons.bookmark}</button>
          ${summary}
          <div class="story__body" id="${esc(bodyId)}">
            <div class="story__bodyInner"><div class="story__bodyPad">
              ${bulletHtml}
              ${commentsHtml}
              ${sourcesHtml}
            </div></div>
          </div>
        </div>
      </article>`;
  }

  function renderTopics() {
    const ws = currentWorkspace();
    if (!ws) return '';
    const topics = (ws.topic_ids || []).map((id) => topicById(id)).filter(Boolean);
    const rows = topics.map((topic) => {
      const count = state.data.cards.filter((card) => card.topic === topic.id).length;
      return `<a class="topic-row" href="#/topic/${encodeURIComponent(topic.id)}" style="${topicVars(topic)}">
        <span class="topic-row__bar"></span>
        <span>
          <span class="topic-row__name">${esc(pickLang(topic.name) || topic.id)}</span>
          <span class="topic-row__meta">${esc(storyCount(count))}</span>
        </span>
        <span class="topic-row__chevron" aria-hidden="true">${icons.chevronRight}</span>
      </a>`;
    }).join('');

    return `<div class="list-page">
      <div class="page-head">
        <p class="eyebrow"><span class="eyebrow__dot"></span>${esc(t('topics'))}</p>
        <h1 class="brief-title">${esc(t('topics'))}</h1>
        <p class="brief-sub">${esc(t('topicsSub'))}</p>
      </div>
      <div class="topic-list">${rows}</div>
    </div>`;
  }

  function renderTopic(topicId) {
    const topic = topicById(topicId);
    const wsForTopic = currentWorkspace();
    if (!topic || !(wsForTopic?.topic_ids || []).includes(topicId)) return renderTopics();
    const allCards = state.data.cards.filter((card) => card.topic === topicId);
    const tags = [...new Set(allCards.flatMap((card) => (Array.isArray(card.tags) ? card.tags : [])))].filter(Boolean);
    tags.sort((a, b) => (a === 'HK' ? -1 : b === 'HK' ? 1 : 0));
    if (state.tagFilterTopic !== topicId) {
      state.tagFilter = 'All';
      state.tagFilterTopic = topicId;
    }
    if (state.tagFilter !== 'All' && !tags.includes(state.tagFilter)) state.tagFilter = 'All';
    const cards = state.tagFilter === 'All' ? allCards : allCards.filter((card) => (card.tags || []).includes(state.tagFilter));
    const ws = currentWorkspace();
    const picks = ws?.picks || [];
    const pickFor = (cardId) => picks.find((pick) => pick.card_id === cardId) || null;
    const stories = cards.map((card, index) => renderStory(card, pickFor(card.id), index)).join('');
    const filters = tags.length > 1 ? `<div class="tag-filter" role="group" aria-label="${esc(t('filterBy'))}">
      <button class="tag-filter__item${state.tagFilter === 'All' ? ' is-active' : ''}" type="button" data-action="filter-tag" data-tag="All" aria-pressed="${state.tagFilter === 'All'}">${esc(t('all'))}</button>
      ${tags.map((tag) => `<button class="tag-filter__item${state.tagFilter === tag ? ' is-active' : ''}" type="button" data-action="filter-tag" data-tag="${esc(tag)}" aria-pressed="${state.tagFilter === tag}">${esc(tag)}</button>`).join('')}
    </div>` : '';

    return `<div class="list-page">
      <a class="back-link" href="#/topics">${icons.arrowLeft}${esc(t('backTopics'))}</a>
      <div class="page-head">
        <div class="topic-hero" style="${topicVars(topic)}">
          <span class="topic-hero__bar"></span>
          <div>
            <h1 class="topic-hero__name">${esc(pickLang(topic.name) || topic.id)}</h1>
            <p class="topic-hero__meta">${esc(storyCount(allCards.length))} · ${esc(t('today'))}</p>
          </div>
        </div>
        ${filters}
      </div>
      ${cards.length ? `<div class="stories">${stories}</div>` : `<div class="empty"><p class="empty__kicker">${esc(pickLang(topic.name) || topic.id)}</p><h2 class="empty__title">${esc(t('quietTitle'))}</h2><p class="empty__body">${esc(t('quietBody'))}</p></div>`}
    </div>`;
  }

  function renderSaved() {
    const saved = [...state.saved].sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));
    const stories = saved.map((entry, index) => {
      const card = entry.card;
      const pick = entry.pick || currentWorkspace()?.picks?.find((item) => item.card_id === card.id) || null;
      return renderStory(card, pick, index);
    }).join('');

    return `<div class="list-page">
      <div class="page-head">
        <p class="eyebrow"><span class="eyebrow__dot"></span>${esc(t('saved'))}</p>
        <h1 class="brief-title">${esc(t('saved'))}</h1>
        <p class="brief-sub">${esc(t('savedSub'))}</p>
      </div>
      ${saved.length ? `<div class="stories">${stories}</div>` : `<div class="empty">
        <p class="empty__kicker">${esc(t('saved'))}</p>
        <h2 class="empty__title">${esc(t('savedEmptyTitle'))}</h2>
        <p class="empty__body">${esc(t('savedEmptyBody'))}</p>
        <a class="button button--quiet" href="#/today">${esc(t('today'))}</a>
      </div>`}
    </div>`;
  }

  async function ensureArchive() {
    if (!state.archiveIndex) await loadArchiveIndex();
  }

  function renderArchive() {
    const index = state.archiveIndex || { editions: [] };
    const editions = Array.isArray(index.editions) ? index.editions : [];
    if (!editions.length) {
      return `<div class="list-page">
        <div class="page-head">
          <p class="eyebrow"><span class="eyebrow__dot"></span>${esc(t('archive'))}</p>
          <h1 class="brief-title">${esc(t('archive'))}</h1>
          <p class="brief-sub">${esc(t('archiveSub'))}</p>
        </div>
        <div class="empty"><p class="empty__kicker">${esc(t('archive'))}</p><h2 class="empty__title">${esc(t('archiveEmptyTitle'))}</h2><p class="empty__body">${esc(t('archiveEmptyBody'))}</p></div>
      </div>`;
    }

    const groups = new Map();
    for (const edition of editions) {
      const key = formatGroupDate(edition.generated_at);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(edition);
    }
    const html = Array.from(groups.entries()).map(([date, items]) => `
      <section class="edition-group">
        <p class="edition-group__date">${esc(date)}</p>
        ${items.map((edition) => `<a class="edition-row" href="#/archive/${encodeURIComponent(edition.file)}">
          <span class="edition-row__label">${esc(pickLang(edition.edition_label) || '')}</span>
          <span class="edition-row__meta">${esc(storyCount(edition.counts?.[state.workspaceId] || 0))}<br>${esc(formatTime(edition.generated_at))} HKT</span>
          <span class="edition-row__chevron" aria-hidden="true">${icons.chevronRight}</span>
        </a>`).join('')}
      </section>`).join('');

    return `<div class="list-page">
      <div class="page-head">
        <p class="eyebrow"><span class="eyebrow__dot"></span>${esc(t('archive'))}</p>
        <h1 class="brief-title">${esc(t('archive'))}</h1>
        <p class="brief-sub">${esc(t('archiveSub'))}</p>
      </div>
      ${html}
    </div>`;
  }

  function renderArchiveEdition() {
    if (!state.archiveEdition) return renderRouteLoading();
    return renderBrief({ archive: true });
  }

  function renderSources() {
    const statuses = sourceStatus();
    const failed = statuses.filter((source) => !source.ok).length;
    const rows = statuses.map((source) => {
      const topic = topicById(source.topic);
      const name = source.name || source.id;
      const meta = [topic?.short || source.topic, source.items != null ? `${source.items} ${t('items')}` : '', source.error ? '—' : ''].filter(Boolean).join(' · ');
      return `<div class="source-status${source.ok ? '' : ' is-bad'}">
        <span class="source-status__dot" aria-hidden="true"></span>
        <div>
          <div class="source-status__name">${esc(name)}</div>
          <div class="source-status__meta">${esc(meta)}</div>
          ${source.error ? `<div class="source-status__meta is-error">${esc(source.error)}</div>` : ''}
        </div>
        <span class="source-status__count">${source.ok ? (isZH() ? '正常' : 'OK') : (isZH() ? '失敗' : 'FAIL')}</span>
      </div>`;
    }).join('');

    return `<div class="list-page">
      <a class="back-link" href="#/today">${icons.arrowLeft}${esc(t('backToday'))}</a>
      <div class="page-head">
        <p class="eyebrow"><span class="eyebrow__dot"></span>${esc(t('sourceHealth'))}</p>
        <h1 class="brief-title">${esc(t('sourceHealth'))}</h1>
        <p class="brief-sub">${statuses.length ? `${statuses.length - failed} / ${statuses.length} ${esc(t('sourcesChecked'))}. ` : ''}${esc(t('sourceSub'))}</p>
      </div>
      ${statuses.length ? `<div class="source-list">${rows}</div>` : `<div class="empty"><p class="empty__kicker">${esc(t('sourceHealth'))}</p><h2 class="empty__title">${esc(t('sourceEmpty'))}</h2></div>`}
    </div>`;
  }

  function renderAbout() {
    return `<div class="list-page">
      <a class="back-link" href="#/today">${icons.arrowLeft}${esc(t('backToday'))}</a>
      <div class="page-head">
        <p class="eyebrow"><span class="eyebrow__dot"></span>${esc(t('howItWorks'))}</p>
        <h1 class="brief-title">${esc(t('aboutTitle'))}</h1>
        <p class="brief-sub">${esc(t('aboutSub'))}</p>
      </div>
      <div class="about">
        <section class="about__item">
          <h2>Twice a day</h2>
          <p>At 07:00 and 18:00 HKT, GitHub Actions fetches the public sources, selects the finite brief, and deploys a new static edition. A manual run does the same.</p>
        </section>
        <section class="about__item">
          <h2>Refresh is not a fetch</h2>
          <p>The refresh button only reloads the latest deployed edition. It does not fetch upstream sources, run GitHub Actions, or call Gemini.</p>
        </section>
        <section class="about__item">
          <h2>Summaries</h2>
          <p>Only the selected cards go to Gemini 3.5 Flash-Lite on the free tier. If a summary is unavailable or contains an unsupported number, that card falls back to a source excerpt. Headlines, bullets and takeaways stay in the source language; the interface is English.</p>
        </section>
        <section class="about__item">
          <h2>Reading</h2>
          <p>Opening a card marks it read on this device. Cards read in an earlier edition are hidden from the next Today, but remain under Topics, Archive and Saved. Read state is per browser and does not sync.</p>
        </section>
        <section class="about__item">
          <h2>What gets prioritised</h2>
          <p>Legal aims for at least three Hong Kong legal cards; cybersecurity aims for two Hong Kong and two global cards when available. Routine notices, vendor launches, event listings and soft news are damped.</p>
        </section>
        <section class="about__item">
          <h2>Sources and trust</h2>
          <p>Single-source cards are marked. There are no accounts, notifications, analytics, or Threads/Instagram scraping. Failed sources are listed under <a href="#/sources">Source health</a>.</p>
        </section>
      </div>
    </div>`;
  }

  function renderTabbar(route) {
    const active = (key) => {
      if (key === 'today') return ['today', 'sources', 'about'].includes(route.view) ? 'page' : null;
      if (key === 'topics') return route.view === 'topics' || route.view === 'topic' ? 'page' : null;
      if (key === 'saved') return route.view === 'saved' ? 'page' : null;
      if (key === 'archive') return route.view === 'archive' ? 'page' : null;
      return null;
    };
    const tab = (key, href, icon, label) => `<a href="${href}" ${active(key) ? 'aria-current="page"' : ''}>${icon}<span>${esc(label)}</span></a>`;
    return `<nav class="tabbar" aria-label="Sections">
      ${tab('today', '#/today', icons.file, t('today'))}
      ${tab('topics', '#/topics', icons.grid, t('topics'))}
      ${tab('saved', '#/saved', icons.bookmark, t('saved'))}
      ${tab('archive', '#/archive', icons.archive, t('archive'))}
    </nav>`;
  }

  function renderWorkspaceDialog() {
    const options = workspaceList().map((ws) => {
      const selected = ws.id === state.workspaceId;
      const accent = safeColor(ws.accent, FALLBACK_COLOR);
      return `<button class="workspace-option" type="button" role="menuitemradio" aria-checked="${selected}" data-action="set-workspace" data-ws="${esc(ws.id)}" style="--accent:${esc(accent)}">
        <span class="workspace-option__bar" aria-hidden="true"></span>
        <span>
          <span class="workspace-option__name">${esc(pickLang(ws.name) || ws.id)}</span>
          <span class="workspace-option__meta">${esc((ws.topic_ids || []).map((id) => topicById(id)?.short || id).join(' · '))}</span>
        </span>
        ${selected ? `<span class="workspace-option__check" aria-hidden="true">${icons.check}</span>` : ''}
      </button>`;
    }).join('');

    return `<dialog class="workspace-dialog" id="ws-dialog" aria-labelledby="ws-dialog-title">
      <div class="dialog__panel">
        <div class="dialog__head">
          <h2 class="dialog__title" id="ws-dialog-title">${esc(t('switchTitle'))}</h2>
          <button class="dialog__close" type="button" data-action="close-workspace" aria-label="${esc(t('close'))}">${icons.close}</button>
        </div>
        <div role="menu">${options}</div>
        <p class="dialog__note">${esc(t('switchNote'))}</p>
      </div>
    </dialog>`;
  }

  function updateProgress() {
    const edition = currentEdition();
    const ws = edition?.workspaces?.[state.workspaceId];
    const route = parseHash();
    const picks = visibleBriefPicks(edition, ws, { archive: route.view === 'archive' });
    const total = picks.length;
    const read = picks.filter(({ card }) => isRead(card.id)).length;
    const pct = total ? Math.round((read / total) * 100) : 0;
    const fill = $('.progress__fill');
    const bar = $('.progress');
    if (fill) fill.style.width = `${pct}%`;
    if (bar) {
      bar.setAttribute('aria-valuenow', String(pct));
      bar.setAttribute('aria-valuetext', isZH()
        ? `${read} / ${total} 已展開`
        : `${read} of ${total} opened`);
    }
  }

  function updateSaveButtons(cardId) {
    const saved = isSaved(cardId);
    $$('[data-action="save-story"]').forEach((button) => {
      if (button.dataset.cardId !== cardId) return;
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', saved ? t('unsave') : t('save'));
      button.innerHTML = saved ? icons.bookmarkFill : icons.bookmark;
    });
  }

  function showToast(message) {
    const old = $('.toast');
    if (old) old.remove();
    if (!message) return;
    const wrap = document.createElement('div');
    wrap.className = 'toast';
    wrap.innerHTML = `<div class="toast__inner" role="status">${esc(message)}</div>`;
    app.appendChild(wrap);
    window.setTimeout(() => wrap.remove(), 2400);
  }

  // ---------- interactions ----------

  function openWorkspaceDialog() {
    const dialog = document.getElementById('ws-dialog');
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  function closeWorkspaceDialog() {
    const dialog = document.getElementById('ws-dialog');
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  function toggleStory(button) {
    const story = button.closest('.story');
    if (!story) return;
    const cardId = button.dataset.cardId;
    const open = !story.classList.contains('is-open');
    story.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    const cue = button.querySelector('.story__cue');
    if (cue) cue.innerHTML = `${esc(open ? t('close') : t('open'))} ${icons.chevron}`;
    story.classList.toggle('is-read', isRead(cardId) || open);
    if (open) markRead(cardId);
  }

  app.addEventListener('click', (event) => {
    const dialog = event.target.closest('dialog.workspace-dialog');
    if (dialog && event.target === dialog) {
      closeWorkspaceDialog();
      return;
    }
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;

    if (action === 'choose-workspace' || action === 'set-workspace') {
      event.preventDefault();
      chooseWorkspace(target.dataset.ws);
      return;
    }
    if (action === 'open-workspace') {
      event.preventDefault();
      openWorkspaceDialog();
      return;
    }
    if (action === 'close-workspace') {
      event.preventDefault();
      closeWorkspaceDialog();
      return;
    }
    if (action === 'toggle-story') {
      event.preventDefault();
      toggleStory(target);
      return;
    }
    if (action === 'save-story') {
      event.preventDefault();
      toggleSaved(target.dataset.cardId);
      return;
    }
    if (action === 'refresh') {
      event.preventDefault();
      loadData({ refresh: true });
      return;
    }
    if (action === 'dismiss-hint') {
      event.preventDefault();
      writeJSON(KEY.hint, true);
      const hint = $('.install-hint');
      if (hint) hint.remove();
      return;
    }
    if (action === 'filter-tag') {
      event.preventDefault();
      state.tagFilter = target.dataset.tag || 'All';
      state.tagFilterTopic = parseHash().param || null;
      render();
    }
  });

  async function handleRoute() {
    const token = ++routeToken;
    const route = parseHash();
    if (!state.data) return;
    if (!state.workspaceId) return;

    if (route.view === 'topic') {
      const ws = currentWorkspace();
      if (ws && !(ws.topic_ids || []).includes(route.param)) {
        history.replaceState(null, '', location.pathname + location.search + '#/topics');
        render();
        return;
      }
    }

    if (route.view === 'archive') {
      state.routeLoading = true;
      render();
      try {
        await ensureArchive();
        if (token !== routeToken) return;
        if (route.param) {
          await loadArchiveEdition(route.param);
        } else {
          state.archiveEdition = null;
        }
      } catch (err) {
        state.archiveEdition = null;
        state.routeLoading = false;
        showToast(t('errorBody'));
        if (route.param) history.replaceState(null, '', location.pathname + location.search + '#/archive');
        render();
        return;
      }
      if (token !== routeToken) return;
      state.routeLoading = false;
      render();
      return;
    }

    state.archiveEdition = null;
    state.routeLoading = false;
    render();
  }

  window.addEventListener('hashchange', handleRoute);

  // Keep the visible edition fresh when returning to the installed app.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.data && !state.demo) {
      const generated = new Date(state.data.generated_at || 0).getTime();
      if (Date.now() - generated > 6 * 3600 * 1000) loadData({ refresh: true });
    }
  });

  // ---------- boot ----------

  async function boot() {
    state.demo = new URLSearchParams(location.search).get('demo') === '1';
    await loadData();
    if (!state.data) {
      state.booting = false;
      render();
      return;
    }
    const resolved = resolveWorkspace();
    if (resolved) {
      loadWorkspaceState(resolved);
      if (!location.hash || location.hash === '#/' || location.hash === '#') {
        history.replaceState(null, '', location.pathname + location.search + '#/today');
      }
      state.booting = false;
      await handleRoute();
    } else {
      state.booting = false;
      state.loading = false;
      render();
    }
  }

  boot();
})();
