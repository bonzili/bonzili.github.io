(() => {
  'use strict';

  const app = document.getElementById('app');
  const LS = 'dailybrief.v1.';
  const KEY = {
    workspace: LS + 'workspace',
    read: (ws) => LS + ws + '.read',
    saved: (ws) => LS + ws + '.saved',
    mutedCards: (ws) => LS + ws + '.mutedCards',
    mutedTopics: (ws) => LS + ws + '.mutedTopics',
    lunch: (ws) => LS + ws + '.lunch',
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
      notInterested: 'Not interested',
      muteTopic: 'Mute topic',
      unmuteTopic: 'Unmute topic',
      unmute: 'Unmute',
      mutedToast: 'Story muted.',
      topicMutedToast: 'Topic muted.',
      topicUnmutedToast: 'Topic unmuted.',
      mutedTopicsNote: 'Muted topics:',
      mutedCardsNote: 'hidden because you marked them not interested.',
      manageMuted: 'Manage',
      mutedSettingsTitle: 'Muted stories',
      mutedSettingsBody: 'Marked not interested on this device. They stay out of Today and Topics until you clear them.',
      clearMuted: 'Clear all muted stories',
      clearedMuted: 'Muted stories cleared.',
      mutedBadge: 'Muted',
      undo: 'Undo',
      lunchLink: 'Lunch near The Angle',
      lunchTitle: 'Lunch near The Angle',
      lunchSub: 'A short, curated list around 98 How Ming Street. Mostly team lunches, with dine-in or takeaway depending on the queue. Hours are typical — check before you go.',
      lunchEyebrow: 'Kwun Tong · Lunch',
      lunchFilter: 'Filter lunch list',
      lunchToday: "Today's pick",
      lunchAnother: 'Another idea',
      lunchMore: 'More options',
      lunchTeam: 'Team',
      lunchSolo: 'Solo',
      lunchQuick: '≤5 min',
      lunchTakeaway: 'Takeaway',
      lunchUnder100: '≤$100',
      lunchCrowdHigh: 'Usually busy',
      lunchCrowdMedium: 'Can get busy',
      lunchCrowdLow: 'Usually calmer',
      lunchDineIn: 'Dine-in',
      lunchTakeawayPossible: 'Takeaway',
      lunchDineInOnly: 'Dine-in only',
      lunchBeen: 'I ate here',
      lunchHide: 'Not interested',
      lunchBeenToast: 'Marked as eaten. It will sit out of the daily pick for a week.',
      lunchHiddenToast: 'Hidden from lunch suggestions.',
      lunchReset: 'Reset lunch preferences',
      lunchResetToast: 'Lunch preferences cleared.',
      lunchEmptyTitle: 'No lunch options left.',
      lunchEmptyBody: 'You have hidden every place on this list. Reset to see them again.',
      lunchErrorTitle: 'The lunch list is unavailable.',
      lunchErrorBody: 'The lunch data did not load. Try again.',
      lunchDisclaimer: 'Walk times are estimates from The Angle. Hours change; confirm before you go.',
      lunchLastVerified: 'Last verified',
      lunchMap: 'Map',
      lunchOpenRice: 'OpenRice',
      lunchBeenBadge: 'Eaten recently',
      lunchUpdated: 'List updated',
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
      notInterested: '沒興趣',
      muteTopic: '靜音主題',
      unmuteTopic: '取消靜音主題',
      unmute: '取消靜音',
      mutedToast: '已隱藏這則報導。',
      topicMutedToast: '已靜音主題。',
      topicUnmutedToast: '已取消靜音主題。',
      mutedTopicsNote: '已靜音主題：',
      mutedCardsNote: '則報導因標記為沒興趣而未顯示。',
      manageMuted: '管理',
      mutedSettingsTitle: '已靜音報導',
      mutedSettingsBody: '在此裝置標記為沒興趣。清除前不會顯示於今日與主題。',
      clearMuted: '清除所有已靜音報導',
      clearedMuted: '已清除靜音報導。',
      mutedBadge: '已靜音',
      undo: '復原',
      lunchLink: 'The Angle 午餐',
      lunchTitle: 'The Angle 午餐',
      lunchSub: '觀塘巧明街 98 號附近的精選午餐。以團隊午餐為主，會視乎排隊情況選擇堂食或外賣；營業時間只供參考，出發前請確認。',
      lunchEyebrow: '觀塘 · 午餐',
      lunchFilter: '篩選午餐清單',
      lunchToday: '今日推介',
      lunchAnother: '另一個主意',
      lunchMore: '更多選擇',
      lunchTeam: '團隊',
      lunchSolo: '一人',
      lunchQuick: '5 分鐘內',
      lunchTakeaway: '外賣',
      lunchUnder100: '100 元內',
      lunchCrowdHigh: '通常多人',
      lunchCrowdMedium: '可能多人',
      lunchCrowdLow: '通常較靜',
      lunchDineIn: '堂食',
      lunchTakeawayPossible: '外賣',
      lunchDineInOnly: '只限堂食',
      lunchBeen: '吃過了',
      lunchHide: '沒興趣',
      lunchBeenToast: '已記下。一星期內不會再成為今日推介。',
      lunchHiddenToast: '已從午餐建議中隱藏。',
      lunchReset: '重設午餐偏好',
      lunchResetToast: '已重設午餐偏好。',
      lunchEmptyTitle: '沒有午餐選擇了。',
      lunchEmptyBody: '你已隱藏清單上的所有餐廳。重設後會再次顯示。',
      lunchErrorTitle: '午餐清單暫時無法載入。',
      lunchErrorBody: '午餐資料載入失敗，請再試一次。',
      lunchDisclaimer: '步行時間為由 The Angle 出發的估算。營業時間會變，出發前請確認。',
      lunchLastVerified: '最後確認',
      lunchMap: '地圖',
      lunchOpenRice: 'OpenRice',
      lunchBeenBadge: '最近吃過',
      lunchUpdated: '清單更新',
    },
  };

  const state = {
    data: null,
    archiveIndex: null,
    archiveEdition: null,
    workspaceId: null,
    read: {},
    saved: [],
    mutedCards: {},
    mutedTopics: [],
    lunch: null,
    lunchError: null,
    lunchLoading: false,
    lunchFilter: 'All',
    lunchPickId: null,
    lunchPrefs: { been: {}, hidden: {} },
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
    return all.filter(({ card }) => (
      !isMutedTopic(card.topic)
      && !isMutedCard(card.id)
      && !readInPreviousEdition(card.id, edition)
    ));
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
    if (['today', 'topics', 'saved', 'archive', 'sources', 'about', 'lunch'].includes(parts[0])) {
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
    state.mutedCards = readJSON(KEY.mutedCards(id), {});
    state.mutedTopics = readJSON(KEY.mutedTopics(id), []);
    state.lunchPrefs = readJSON(KEY.lunch(id), {});
    state.lunchFilter = 'All';
    state.lunchPickId = null;
    if (!state.read || typeof state.read !== 'object' || Array.isArray(state.read)) state.read = {};
    if (!Array.isArray(state.saved)) state.saved = [];
    if (!state.mutedCards || typeof state.mutedCards !== 'object' || Array.isArray(state.mutedCards)) state.mutedCards = {};
    if (!Array.isArray(state.mutedTopics)) state.mutedTopics = [];
    if (!state.lunchPrefs || typeof state.lunchPrefs !== 'object' || Array.isArray(state.lunchPrefs)) state.lunchPrefs = { been: {}, hidden: {} };
    if (!state.lunchPrefs.been || typeof state.lunchPrefs.been !== 'object' || Array.isArray(state.lunchPrefs.been)) state.lunchPrefs.been = {};
    if (!state.lunchPrefs.hidden || typeof state.lunchPrefs.hidden !== 'object' || Array.isArray(state.lunchPrefs.hidden)) state.lunchPrefs.hidden = {};
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
    if (route.view === 'lunch' && id !== 'me') {
      history.replaceState(null, '', location.pathname + location.search + '#/today');
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

  function persistMutedCards() {
    if (state.workspaceId) writeJSON(KEY.mutedCards(state.workspaceId), state.mutedCards);
  }

  function persistMutedTopics() {
    if (state.workspaceId) writeJSON(KEY.mutedTopics(state.workspaceId), state.mutedTopics);
  }

  function persistLunchPrefs() {
    if (state.workspaceId) writeJSON(KEY.lunch(state.workspaceId), state.lunchPrefs);
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

  function isMutedCard(id) {
    return Boolean(state.mutedCards[id]);
  }

  function isMutedTopic(id) {
    return state.mutedTopics.includes(id);
  }

  function mutedCardCount() {
    return Object.keys(state.mutedCards).length;
  }

  function mutedTopicList(ws) {
    return (ws?.topic_ids || []).filter(isMutedTopic);
  }

  function isLunchHidden(id) {
    return Boolean(state.lunchPrefs.hidden[id]);
  }

  function lunchBeenRecently(id) {
    const stamp = Number(state.lunchPrefs.been[id] || 0);
    return stamp > 0 && Date.now() - stamp < 7 * 24 * 60 * 60 * 1000;
  }

  function hktDateKey() {
    return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
  }

  function hashString(value) {
    let hash = 0;
    const text = String(value || '');
    for (let index = 0; index < text.length; index += 1) {
      hash = ((hash * 31) + text.charCodeAt(index)) | 0;
    }
    return Math.abs(hash);
  }

  function currentLunchPick(places) {
    const visible = (places || []).filter((place) => !isLunchHidden(place.id));
    if (!visible.length) return null;
    if (state.lunchPickId) {
      const chosen = visible.find((place) => place.id === state.lunchPickId);
      if (chosen) return chosen;
    }
    const start = hashString(`${hktDateKey()}|${state.workspaceId}`) % visible.length;
    for (let index = 0; index < visible.length; index += 1) {
      const place = visible[(start + index) % visible.length];
      if (!lunchBeenRecently(place.id)) return place;
    }
    return visible[start];
  }

  function setAnotherLunchPick() {
    const places = Array.isArray(state.lunch?.places) ? state.lunch.places : [];
    const visible = places.filter((place) => !isLunchHidden(place.id));
    if (!visible.length) return;
    const current = currentLunchPick(places);
    const currentIndex = current ? visible.findIndex((place) => place.id === current.id) : -1;
    let candidate = null;
    for (let step = 1; step <= visible.length; step += 1) {
      const place = visible[(currentIndex + step + visible.length) % visible.length];
      if (place.id === current?.id || lunchBeenRecently(place.id)) continue;
      candidate = place;
      break;
    }
    if (!candidate) candidate = visible.find((place) => place.id !== current?.id) || current;
    if (!candidate) return;
    state.lunchPickId = candidate.id;
    render();
  }

  function markLunchBeen(placeId) {
    if (!placeId) return;
    const previous = state.lunchPrefs.been[placeId];
    state.lunchPrefs.been[placeId] = Date.now();
    if (state.lunchPickId === placeId) state.lunchPickId = null;
    persistLunchPrefs();
    render();
    showToast(t('lunchBeenToast'), () => {
      if (previous) state.lunchPrefs.been[placeId] = previous;
      else delete state.lunchPrefs.been[placeId];
      persistLunchPrefs();
      render();
    });
  }

  function hideLunchPlace(placeId) {
    if (!placeId) return;
    const previous = state.lunchPrefs.hidden[placeId];
    state.lunchPrefs.hidden[placeId] = Date.now();
    if (state.lunchPickId === placeId) state.lunchPickId = null;
    persistLunchPrefs();
    render();
    showToast(t('lunchHiddenToast'), () => {
      if (previous) state.lunchPrefs.hidden[placeId] = previous;
      else delete state.lunchPrefs.hidden[placeId];
      persistLunchPrefs();
      render();
    });
  }

  function resetLunchPrefs() {
    const previous = state.lunchPrefs;
    state.lunchPrefs = { been: {}, hidden: {} };
    state.lunchPickId = null;
    persistLunchPrefs();
    render();
    showToast(t('lunchResetToast'), () => {
      state.lunchPrefs = previous;
      persistLunchPrefs();
      render();
    });
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

  function muteCard(cardId) {
    if (!cardId || state.mutedCards[cardId]) return;
    state.mutedCards[cardId] = Date.now();
    persistMutedCards();
    render();
    showToast(t('mutedToast'), () => {
      delete state.mutedCards[cardId];
      persistMutedCards();
      render();
    });
  }

  function setTopicMuted(topicId, muted) {
    if (!topicId) return;
    const exists = state.mutedTopics.includes(topicId);
    if (muted && !exists) state.mutedTopics.push(topicId);
    if (!muted) state.mutedTopics = state.mutedTopics.filter((id) => id !== topicId);
    persistMutedTopics();
    render();
  }

  function toggleTopicMute(topicId) {
    if (!topicId) return;
    const muted = isMutedTopic(topicId);
    setTopicMuted(topicId, !muted);
    showToast(muted ? t('topicUnmutedToast') : t('topicMutedToast'), () => {
      setTopicMuted(topicId, muted);
    });
  }

  function clearMutedCards() {
    if (!mutedCardCount()) return;
    const previous = state.mutedCards;
    state.mutedCards = {};
    persistMutedCards();
    render();
    showToast(t('clearedMuted'), () => {
      state.mutedCards = previous;
      persistMutedCards();
      render();
    });
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
    eyeOff: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5.5 0 9 7 9 7a17 17 0 0 1-2.1 2.9"/><path d="M6.2 6.2C4.2 7.6 3 10 3 12c0 0 3.5 7 9 7 2.1 0 4-.8 5.6-2"/></svg>',
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
      case 'lunch': return renderLunch();
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
    const mutedTopics = archive ? [] : mutedTopicList(ws);
    const afterTopicMute = archive ? allPicks : allPicks.filter(({ card }) => !isMutedTopic(card.topic));
    const mutedTopicHidden = allPicks.length - afterTopicMute.length;
    const afterCardMute = archive ? afterTopicMute : afterTopicMute.filter(({ card }) => !isMutedCard(card.id));
    const mutedCardHidden = afterTopicMute.length - afterCardMute.length;
    const picks = archive ? afterCardMute : afterCardMute.filter(({ card }) => !readInPreviousEdition(card.id, edition));
    const readHidden = afterCardMute.length - picks.length;
    const names = topicNames(ws);
    const end = isZH() ? '。' : '.';
    const nextLine = edition.next_update
      ? `${t('nextEdition')} ${formatTime(edition.next_update)} HKT${isZH() ? '。' : '.'}`
      : '';
    const failed = workspaceStatuses().filter((source) => !source.ok).length;
    const total = picks.length;
    const lunchShortcut = !archive && state.workspaceId === 'me'
      ? `<p class="brief-shortcut"><a href="#/lunch">${esc(t('lunchLink'))} ↗</a></p>`
      : '';

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
           ${lunchShortcut}
         </div>`;

    const mutedTopicNote = !archive && mutedTopics.length
      ? `<p class="muted-note"><span>${esc(t('mutedTopicsNote'))}</span>${mutedTopics.map((id) => {
          const topic = topicById(id);
          return `<button type="button" data-action="toggle-topic-mute" data-topic-id="${esc(id)}">${esc(pickLang(topic?.name) || id)} · ${esc(t('unmute'))}</button>`;
        }).join('')}</p>`
      : '';
    const mutedCardNote = !archive && mutedCardHidden
      ? `<p class="footer-note">${esc(isZH()
          ? `${mutedCardHidden} ${t('mutedCardsNote')}`
          : `${mutedCardHidden} ${mutedCardHidden === 1 ? 'story' : 'stories'} ${t('mutedCardsNote')}`)} <a href="#/topics">${esc(t('manageMuted'))}</a></p>`
      : '';

    if (!total) {
      const caughtUp = !archive && readHidden > 0 && !mutedCardHidden && !mutedTopicHidden;
      return `${hero}${mutedTopicNote}${mutedCardNote}
        <div class="empty">
          <p class="empty__kicker">${esc(caughtUp ? t('caughtUpKicker') : t('today'))}</p>
          <h2 class="empty__title">${esc(caughtUp ? t('caughtUpTitle') : t('quietTitle'))}</h2>
          <p class="empty__body">${esc(caughtUp ? t('caughtUpBody') : t('quietBody'))}</p>
          ${caughtUp ? `<a class="button button--quiet" href="#/topics">${esc(t('topics'))}</a>` : ''}
        </div>
        ${renderSourceFooter(failed)}`;
    }

    const stories = picks.map(({ card, pick }, index) => renderStory(card, pick, index, { allowMute: !archive })).join('');
    const readNote = readHidden
      ? `<p class="footer-note">${esc(isZH()
        ? `${readHidden} 則先前已讀的故事未顯示於此版本。`
        : `${readHidden} previously read ${readHidden === 1 ? 'story' : 'stories'} hidden from this edition.`)}</p>`
      : '';
    return `${hero}${mutedTopicNote}<div class="stories">${stories}</div>${readNote}${mutedCardNote}${renderSourceFooter(failed)}`;
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

  function renderStory(card, pick, index, { allowMute = true } = {}) {
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

    const muteAction = allowMute
      ? `<div class="story__actions">
          <button class="story__action" type="button" data-action="mute-story" data-card-id="${cardId}">${icons.eyeOff}${esc(t('notInterested'))}</button>
        </div>`
      : '';

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
              ${muteAction}
            </div></div>
          </div>
        </div>
      </article>`;
  }

  function renderTopics() {
    const ws = currentWorkspace();
    if (!ws) return '';
    const topics = (ws.topic_ids || []).map((id) => topicById(id)).filter(Boolean);
    const mutedTopics = mutedTopicList(ws);
    const mutedCount = mutedCardCount();
    const rows = topics.map((topic) => {
      const count = state.data.cards.filter((card) => card.topic === topic.id && !isMutedCard(card.id)).length;
      const muted = isMutedTopic(topic.id);
      return `<a class="topic-row${muted ? ' is-muted' : ''}" href="#/topic/${encodeURIComponent(topic.id)}" style="${topicVars(topic)}">
        <span class="topic-row__bar"></span>
        <span>
          <span class="topic-row__name">${esc(pickLang(topic.name) || topic.id)}</span>
          <span class="topic-row__meta">${esc(storyCount(count))}${muted ? ` · ${esc(t('mutedBadge'))}` : ''}</span>
        </span>
        <span class="topic-row__chevron" aria-hidden="true">${icons.chevronRight}</span>
      </a>`;
    }).join('');

    const mutedSettings = (mutedTopics.length || mutedCount) ? `
      <section class="muted-settings">
        <h2 class="muted-settings__title">${esc(t('mutedSettingsTitle'))}</h2>
        <p class="muted-settings__body">${esc(t('mutedSettingsBody'))}</p>
        ${mutedTopics.length ? `<div class="muted-settings__row">${mutedTopics.map((id) => {
          const topic = topicById(id);
          return `<button class="muted-settings__button" type="button" data-action="toggle-topic-mute" data-topic-id="${esc(id)}">${esc(pickLang(topic?.name) || id)} · ${esc(t('unmute'))}</button>`;
        }).join('')}</div>` : ''}
        ${mutedCount ? `<button class="button button--quiet" type="button" data-action="clear-muted-cards">${esc(t('clearMuted'))}</button>` : ''}
      </section>` : '';

    return `<div class="list-page">
      <div class="page-head">
        <p class="eyebrow"><span class="eyebrow__dot"></span>${esc(t('topics'))}</p>
        <h1 class="brief-title">${esc(t('topics'))}</h1>
        <p class="brief-sub">${esc(t('topicsSub'))}</p>
      </div>
      <div class="topic-list">${rows}</div>
      ${mutedSettings}
    </div>`;
  }

  function renderTopic(topicId) {
    const topic = topicById(topicId);
    const wsForTopic = currentWorkspace();
    if (!topic || !(wsForTopic?.topic_ids || []).includes(topicId)) return renderTopics();
    const allCards = state.data.cards.filter((card) => card.topic === topicId && !isMutedCard(card.id));
    const tags = [...new Set(allCards.flatMap((card) => (Array.isArray(card.tags) ? card.tags : [])))].filter(Boolean);
    const tagPriority = ['HK', 'AI', 'Exploit', 'Tool', 'Model', 'Benchmark', 'IP', 'Privacy', 'Fintech', 'Cyber', 'Global'];
    tags.sort((a, b) => {
      const ia = tagPriority.indexOf(a);
      const ib = tagPriority.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
    });
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
            <p class="topic-hero__meta">${esc(storyCount(allCards.length))} · ${esc(t('today'))} · <button class="topic-hero__mute" type="button" data-action="toggle-topic-mute" data-topic-id="${esc(topic.id)}" aria-pressed="${isMutedTopic(topic.id)}">${esc(isMutedTopic(topic.id) ? t('unmuteTopic') : t('muteTopic'))}</button></p>
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
      return renderStory(card, pick, index, { allowMute: false });
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


  function lunchCrowdLabel(place) {
    if (place.crowd === 'High') return t('lunchCrowdHigh');
    if (place.crowd === 'Low') return t('lunchCrowdLow');
    return t('lunchCrowdMedium');
  }

  function lunchServiceLabel(place) {
    if (!place.dine_in && place.takeaway) return t('lunchTakeawayPossible');
    if (place.dine_in && !place.takeaway) return t('lunchDineInOnly');
    if (place.dine_in && place.takeaway) return `${t('lunchDineIn')} · ${t('lunchTakeawayPossible')}`;
    return '';
  }

  function lunchTags(place, { been = false } = {}) {
    const tags = (Array.isArray(place.tags) ? place.tags : []).slice(0, 4);
    return `${tags.map((tag) => `<span class="lunch-tag">${esc(tag)}</span>`).join('')}${been ? `<span class="lunch-tag lunch-tag--been">${esc(t('lunchBeenBadge'))}</span>` : ''}`;
  }

  function lunchVerified(place) {
    if (!place.last_verified) return '';
    const date = formatDate(`${place.last_verified}T00:00:00+08:00`, { day: 'numeric', month: 'short', year: 'numeric' });
    return date ? `${t('lunchLastVerified')} ${date}` : '';
  }

  function lunchLinks(place) {
    const map = safeUrl(place.map_url);
    const openrice = safeUrl(place.openrice_url);
    if (map === '#' && openrice === '#') return '';
    return `<div class="lunch-links">
      ${map !== '#' ? `<a class="lunch-link" href="${esc(map)}" target="_blank" rel="noopener noreferrer">${esc(t('lunchMap'))} ↗</a>` : ''}
      ${openrice !== '#' ? `<a class="lunch-link" href="${esc(openrice)}" target="_blank" rel="noopener noreferrer">${esc(t('lunchOpenRice'))} ↗</a>` : ''}
    </div>`;
  }

  function renderLunchPick(place) {
    const been = lunchBeenRecently(place.id);
    return `<article class="lunch-pick">
      <div class="lunch-pick__top">
        <p class="lunch-pick__eyebrow">${esc(t('lunchToday'))}</p>
        <button class="lunch-pick__another" type="button" data-action="lunch-another">${icons.refresh}${esc(t('lunchAnother'))}</button>
      </div>
      <h2 class="lunch-pick__title">${esc(place.name)}${place.name_en ? `<span>${esc(place.name_en)}</span>` : ''}</h2>
      <p class="lunch-pick__meta">${esc(place.cuisine)} · ~${esc(place.walk_minutes)} min · ${esc(place.price_band)} · ${esc(lunchCrowdLabel(place))}</p>
      <p class="lunch-pick__service">${esc(lunchServiceLabel(place))}</p>
      <p class="lunch-pick__note">${esc(place.note || '')}</p>
      <p class="lunch-pick__hours">${esc(place.hours || '')}${place.closed ? ` · ${esc(place.closed)}` : ''}</p>
      <p class="lunch-pick__verified">${esc(lunchVerified(place))}</p>
      <div class="lunch-tags">${lunchTags(place, { been })}</div>
      ${lunchLinks(place)}
      <div class="lunch-actions">
        <button class="lunch-action" type="button" data-action="lunch-been" data-place-id="${esc(place.id)}">${icons.check}${esc(t('lunchBeen'))}</button>
        <button class="lunch-action" type="button" data-action="lunch-hide" data-place-id="${esc(place.id)}">${icons.eyeOff}${esc(t('lunchHide'))}</button>
      </div>
    </article>`;
  }

  function renderLunchCard(place) {
    const been = lunchBeenRecently(place.id);
    return `<article class="lunch-card${been ? ' is-been' : ''}">
      <div class="lunch-card__head">
        <h3 class="lunch-card__name">${esc(place.name)}</h3>
        <span class="lunch-card__walk">~${esc(place.walk_minutes)} min</span>
      </div>
      <p class="lunch-card__meta">${place.name_en ? `${esc(place.name_en)} · ` : ''}${esc(place.cuisine)} · ${esc(place.price_band)}</p>
      <p class="lunch-card__note">${esc(place.note || '')}</p>
      <p class="lunch-card__hours">${esc(place.hours || '')}${place.closed ? ` · ${esc(place.closed)}` : ''}</p>
      <p class="lunch-card__verified">${esc(lunchVerified(place))}</p>
      <div class="lunch-tags">${lunchTags(place, { been })}</div>
      ${lunchLinks(place)}
      <div class="lunch-card__actions">
        <button class="lunch-action" type="button" data-action="lunch-been" data-place-id="${esc(place.id)}">${esc(t('lunchBeen'))}</button>
        <button class="lunch-action" type="button" data-action="lunch-hide" data-place-id="${esc(place.id)}">${esc(t('lunchHide'))}</button>
      </div>
    </article>`;
  }

  function renderLunch() {
    if (state.workspaceId !== 'me') {
      return `<div class="list-page">
        <a class="back-link" href="#/today">${icons.arrowLeft}${esc(t('backToday'))}</a>
        <div class="empty">
          <p class="empty__kicker">Lunch</p>
          <h2 class="empty__title">This lunch shortlist belongs to Siu Gai Mo's brief.</h2>
          <a class="button button--quiet" href="#/today">${esc(t('today'))}</a>
        </div>
      </div>`;
    }
    if (state.lunchLoading) return renderRouteLoading();
    if (!state.lunch) {
      return `<div class="list-page">
        <a class="back-link" href="#/today">${icons.arrowLeft}${esc(t('backToday'))}</a>
        <div class="empty">
          <p class="empty__kicker">Lunch</p>
          <h2 class="empty__title">${esc(t('lunchErrorTitle'))}</h2>
          <p class="empty__body">${esc(t('lunchErrorBody'))}</p>
          <button class="button" type="button" data-action="retry-lunch">${esc(t('retry'))}</button>
        </div>
      </div>`;
    }

    const places = Array.isArray(state.lunch.places) ? state.lunch.places : [];
    const visible = places.filter((place) => !isLunchHidden(place.id));
    const pick = currentLunchPick(places);

    if (!visible.length || !pick) {
      return `<div class="list-page">
        <a class="back-link" href="#/today">${icons.arrowLeft}${esc(t('backToday'))}</a>
        <div class="empty">
          <p class="empty__kicker">Lunch</p>
          <h2 class="empty__title">${esc(t('lunchEmptyTitle'))}</h2>
          <p class="empty__body">${esc(t('lunchEmptyBody'))}</p>
          <button class="button" type="button" data-action="lunch-reset">${esc(t('lunchReset'))}</button>
        </div>
      </div>`;
    }

    const filters = [
      { id: 'All', label: t('all'), test: () => true },
      { id: 'Team', label: t('lunchTeam'), test: (place) => Boolean(place.group) },
      { id: 'Quick', label: t('lunchQuick'), test: (place) => Number(place.walk_minutes) <= 5 },
      { id: 'Takeaway', label: t('lunchTakeaway'), test: (place) => Boolean(place.takeaway) },
      { id: 'Under100', label: t('lunchUnder100'), test: (place) => Number(place.price_max) <= 100 },
      { id: 'Solo', label: t('lunchSolo'), test: (place) => Boolean(place.solo) },
    ];
    if (!filters.some((filter) => filter.id === state.lunchFilter)) state.lunchFilter = 'All';
    const activeFilter = filters.find((filter) => filter.id === state.lunchFilter) || filters[0];
    const alternatives = visible
      .filter((place) => place.id !== pick.id && activeFilter.test(place))
      .map(renderLunchCard)
      .join('');
    const filterHtml = `<div class="tag-filter lunch-filter" role="group" aria-label="${esc(t('lunchFilter'))}">
      ${filters.map((filter) => `<button class="tag-filter__item${state.lunchFilter === filter.id ? ' is-active' : ''}" type="button" data-action="lunch-filter" data-filter="${esc(filter.id)}" aria-pressed="${state.lunchFilter === filter.id}">${esc(filter.label)}</button>`).join('')}
    </div>`;
    const updated = state.lunch.updated_at
      ? `<p class="footer-note">${esc(t('lunchUpdated'))} ${esc(formatDate(`${state.lunch.updated_at}T00:00:00+08:00`, { day: 'numeric', month: 'short', year: 'numeric' }))}. ${esc(t('lunchDisclaimer'))}</p>`
      : `<p class="footer-note">${esc(t('lunchDisclaimer'))}</p>`;
    const emptyFilter = alternatives
      ? `<div class="lunch-grid">${alternatives}</div>`
      : `<p class="footer-note">No places match this filter. <button class="lunch-inline-button" type="button" data-action="lunch-filter" data-filter="All">${esc(t('all'))}</button></p>`;
    const prefsCount = Object.keys(state.lunchPrefs.been).length + Object.keys(state.lunchPrefs.hidden).length;

    return `<div class="list-page lunch-page">
      <a class="back-link" href="#/today">${icons.arrowLeft}${esc(t('backToday'))}</a>
      <div class="page-head">
        <p class="eyebrow"><span class="eyebrow__dot"></span>${esc(t('lunchEyebrow'))}</p>
        <h1 class="brief-title">${esc(t('lunchTitle'))}</h1>
        <p class="brief-sub">${esc(t('lunchSub'))}</p>
      </div>
      ${filterHtml}
      ${renderLunchPick(pick)}
      ${alternatives ? `<p class="lunch-section-label">${esc(t('lunchMore'))}</p>${emptyFilter}` : `<p class="footer-note">No other places match this filter.</p>`}
      ${updated}
      ${prefsCount ? `<button class="button button--quiet" type="button" data-action="lunch-reset">${esc(t('lunchReset'))}</button>` : ''}
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
          <h2>AI models and tools</h2>
          <p>The AI desk covers model releases and benchmarks, but also new tools and products: GitHub trending projects, Product Hunt launches, Hugging Face and Google Open Source releases, and open-source AI news. A benchmark card is added when the Artificial Analysis top five changes, or once a week if it has not.</p>
        </section>
        <section class="about__item">
          <h2>Red teaming</h2>
          <p>Red teaming tracks AI red-team research and incidents, new offensive-security tools on GitHub, Google Project Zero, CISA’s exploited-vulnerability list and new CVE proof-of-concepts. The brief aims for one AI red-team card and one exploit or tool card when available.</p>
        </section>
        <section class="about__item">
          <h2>Lunch near The Angle</h2>
          <p>Siu Gai Mo's brief includes a small, manually curated lunch shortlist around 98 How Ming Street. It is not a live restaurant directory: walk times are estimates, hours are typical, and nothing claims to know whether a place is open or full. “I ate here” removes a place from the daily pick for a week; “Not interested” hides it until you reset lunch preferences. Both are local to this device.</p>
        </section>
        <section class="about__item">
          <h2>Reading and muting</h2>
          <p>Opening a card marks it read on this device. Cards read in an earlier edition are hidden from the next Today, but remain under Topics, Archive and Saved. Tap <strong>Not interested</strong> on an open card to hide it from Today and Topics; mute a topic from its page to keep it out of Today. Both are local, can be undone, and can be managed under Topics.</p>
        </section>
        <section class="about__item">
          <h2>What gets prioritised</h2>
          <p>Legal aims for at least three Hong Kong legal cards; cybersecurity aims for two Hong Kong cards; red teaming aims for one AI red-team card and one exploit or tool card; AI keeps at most one tool card so model and benchmark news still get space. Routine notices, vendor launches, event listings and soft news are damped.</p>
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
      if (key === 'today') return ['today', 'sources', 'about', 'lunch'].includes(route.view) ? 'page' : null;
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

  function showToast(message, undo) {
    const old = $('.toast');
    if (old) old.remove();
    if (!message) return;
    const wrap = document.createElement('div');
    wrap.className = 'toast';
    wrap.innerHTML = `<div class="toast__inner" role="status">${esc(message)}${undo ? `<button class="toast__action" type="button">${esc(t('undo'))}</button>` : ''}</div>`;
    if (undo) {
      wrap.querySelector('.toast__action')?.addEventListener('click', () => {
        undo();
        wrap.remove();
      });
    }
    app.appendChild(wrap);
    window.setTimeout(() => wrap.remove(), undo ? 4200 : 2400);
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
    if (action === 'mute-story') {
      event.preventDefault();
      muteCard(target.dataset.cardId);
      return;
    }
    if (action === 'toggle-topic-mute') {
      event.preventDefault();
      toggleTopicMute(target.dataset.topicId);
      return;
    }
    if (action === 'clear-muted-cards') {
      event.preventDefault();
      clearMutedCards();
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
      return;
    }
    if (action === 'lunch-filter') {
      event.preventDefault();
      state.lunchFilter = target.dataset.filter || 'All';
      render();
      return;
    }
    if (action === 'lunch-another') {
      event.preventDefault();
      setAnotherLunchPick();
      return;
    }
    if (action === 'lunch-been') {
      event.preventDefault();
      markLunchBeen(target.dataset.placeId);
      return;
    }
    if (action === 'lunch-hide') {
      event.preventDefault();
      hideLunchPlace(target.dataset.placeId);
      return;
    }
    if (action === 'lunch-reset') {
      event.preventDefault();
      resetLunchPrefs();
      return;
    }
    if (action === 'retry-lunch') {
      event.preventDefault();
      state.lunch = null;
      state.lunchError = null;
      handleRoute();
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

    if (route.view === 'lunch') {
      if (state.workspaceId !== 'me') {
        history.replaceState(null, '', location.pathname + location.search + '#/today');
        render();
        return;
      }
      state.archiveEdition = null;
      state.routeLoading = false;
      if (!state.lunch && !state.lunchLoading) {
        state.lunchLoading = true;
        state.lunchError = null;
        render();
        try {
          const data = await fetchJSON('lunch.json');
          if (!data || !Array.isArray(data.places)) throw new Error('Invalid lunch data');
          if (token !== routeToken) return;
          state.lunch = data;
        } catch (error) {
          if (token !== routeToken) return;
          state.lunch = null;
          state.lunchError = error;
        }
        state.lunchLoading = false;
        render();
        return;
      }
      render();
      return;
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
