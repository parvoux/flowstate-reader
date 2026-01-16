import './style.css';
import ePub from 'epubjs';

/* =========================
   Theme system (easy-on-eyes)
   ========================= */

type ThemeId =
  | 'light'
  | 'paper'
  | 'sepia'
  | 'solarized-light'
  | 'soft-dark'
  | 'midnight'
  | 'forest'
  | 'solarized-dark';

type Theme = {
  id: ThemeId;
  name: string;
  vars: Record<string, string>;
};

const THEMES: Theme[] = [
  {
    id: 'paper',
    name: 'Paper (warm)',
    vars: {
      '--bg': '#fbf6ea',
      '--text': '#1a1a1a',
      '--muted': '#4a4a4a',
      '--panel': '#f3ead7',
      '--panel-border': '#e2d6bb',
      '--accent': '#b0893b',
      '--highlight': '#ffe08a',
      '--button-bg': '#ffffff',
      '--button-text': '#111111',
      '--button-border': '#d7c9ac',
    },
  },
  {
    id: 'sepia',
    name: 'Sepia',
    vars: {
      '--bg': '#f4ecd8',
      '--text': '#1f1a12',
      '--muted': '#4b3e2f',
      '--panel': '#efe2c3',
      '--panel-border': '#d9c9a3',
      '--accent': '#8c6a2a',
      '--highlight': '#ffd98a',
      '--button-bg': '#ffffff',
      '--button-text': '#1f1a12',
      '--button-border': '#cdbb93',
    },
  },
  {
    id: 'light',
    name: 'Light (clean)',
    vars: {
      '--bg': '#ffffff',
      '--text': '#111111',
      '--muted': '#444444',
      '--panel': '#f4f4f4',
      '--panel-border': '#dddddd',
      '--accent': '#2b6cb0',
      '--highlight': '#ffe08a',
      '--button-bg': '#ffffff',
      '--button-text': '#111111',
      '--button-border': '#cccccc',
    },
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    vars: {
      '--bg': '#fdf6e3',
      '--text': '#073642',
      '--muted': '#586e75',
      '--panel': '#eee8d5',
      '--panel-border': '#d8d2c0',
      '--accent': '#268bd2',
      '--highlight': '#ffd98a',
      '--button-bg': '#ffffff',
      '--button-text': '#073642',
      '--button-border': '#d8d2c0',
    },
  },
  {
    id: 'soft-dark',
    name: 'Soft Dark (easy)',
    vars: {
      '--bg': '#111315',
      '--text': '#e9e7e2',
      '--muted': '#b9b4aa',
      '--panel': '#1b1f23',
      '--panel-border': '#2a3138',
      '--accent': '#8ab4f8',
      '--highlight': '#3b3a22',
      '--button-bg': '#1b1f23',
      '--button-text': '#e9e7e2',
      '--button-border': '#2a3138',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    vars: {
      '--bg': '#0b1020',
      '--text': '#e9eef8',
      '--muted': '#b8c2d9',
      '--panel': '#111a33',
      '--panel-border': '#1f2a4a',
      '--accent': '#7aa2f7',
      '--highlight': '#283055',
      '--button-bg': '#111a33',
      '--button-text': '#e9eef8',
      '--button-border': '#1f2a4a',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    vars: {
      '--bg': '#0f1a14',
      '--text': '#e9f1ea',
      '--muted': '#b7c6bb',
      '--panel': '#16251c',
      '--panel-border': '#243a2c',
      '--accent': '#7bd88f',
      '--highlight': '#2b3a2f',
      '--button-bg': '#16251c',
      '--button-text': '#e9f1ea',
      '--button-border': '#243a2c',
    },
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    vars: {
      '--bg': '#002b36',
      '--text': '#eee8d5',
      '--muted': '#93a1a1',
      '--panel': '#073642',
      '--panel-border': '#0b4554',
      '--accent': '#2aa198',
      '--highlight': '#134e4a',
      '--button-bg': '#073642',
      '--button-text': '#eee8d5',
      '--button-border': '#0b4554',
    },
  },
];

const THEME_STORAGE_KEY = 'speedreader.theme.v1';

function applyTheme(themeId: ThemeId) {
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const root = document.documentElement;
  for (const [k, v] of Object.entries(theme.vars)) root.style.setProperty(k, v);
  localStorage.setItem(THEME_STORAGE_KEY, theme.id);
}

function loadTheme(): ThemeId {
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
  if (saved && THEMES.some((t) => t.id === saved)) return saved;
  return 'paper';
}

applyTheme(loadTheme());

/* =========================
   App UI
   ========================= */

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('#app not found');

app.innerHTML = `
  <div style="
    height: 100vh;
    width: 100vw;
    background: var(--bg);
    color: var(--text);
    display: flex;
    justify-content: center;
    overflow: hidden;
  ">
    <div style="
      font-family: system-ui;
      width: min(1180px, 100%);
      height: 100vh;
      box-sizing: border-box;
      padding: 16px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    ">
      <div style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      ">
        <h1 style="margin: 0;">Flowstate Reader</h1>

        <label style="
          display: flex;
          gap: 8px;
          align-items: center;
          padding: 6px 10px;
          border-radius: 10px;
          border: 1px solid var(--panel-border);
          background: var(--panel);
        ">
          <strong>Theme</strong>
          <select id="themeSelect"
            style="
              padding: 6px 8px;
              border-radius: 8px;
              border: 1px solid var(--panel-border);
              background: var(--button-bg);
              color: var(--button-text);
            ">
            ${THEMES.map((t) => `<option value="${t.id}">${t.name}</option>`).join('')}
          </select>
        </label>
      </div>

      <div style="display:flex; gap: 12px; align-items:flex-end; flex-wrap: wrap; margin: 8px 0 14px;">

        <div style="display:flex; gap: 12px; align-items:end; flex-wrap: wrap;">
          <div>
            <strong>EPUB</strong><br/>
            <input id="fileInput" type="file" accept=".epub" style="display:none;" />
            <label for="fileInput"
              style="
                display:inline-flex;
                align-items:center;
                justify-content:center;
                padding: 10px 12px;
                border-radius: 10px;
                border: 1px solid var(--button-border);
                background: var(--button-bg);
                color: var(--button-text);
                cursor: pointer;
                user-select: none;
              ">
              Choose EPUB…
            </label>
            <div style="margin-top: 6px; color: var(--muted); font-size: 12px;">
              or drag & drop on the right
            </div>
          </div>

          <div id="dropZone"
            style="
              flex: 1;
              min-width: 260px;
              padding: 12px;
              border-radius: 12px;
              border: 1px dashed var(--panel-border);
              background: var(--panel);
              color: var(--muted);
              height: 52px;
              display:flex;
              align-items:center;
              justify-content:center;
              text-align:center;
            ">
            Drop EPUB here
          </div>
        </div>
      </div>

      <div style="margin: 8px 0;">
        <strong>Status:</strong>
        <span id="status">Waiting for file…</span>
      </div>

      <div style="margin-top: 12px; display:flex; gap: 10px; flex-wrap: wrap; align-items: center;">
        <button id="playPause" disabled
          style="padding: 8px 12px; border-radius: 10px; border: 1px solid var(--button-border);
                 background: var(--button-bg); color: var(--button-text);">
          Play
        </button>

        <button id="rewind" disabled
          style="padding: 8px 12px; border-radius: 10px; border: 1px solid var(--button-border);
                 background: var(--button-bg); color: var(--button-text);">
          Rewind
        </button>

        <label style="display:flex; gap: 8px; align-items:center;">
          <span>by</span>
          <input id="rewindCount" type="number" min="1" max="2000" value="10"
            style="width: 80px; padding: 6px; border-radius: 10px;
                   border: 1px solid var(--panel-border);
                   background: var(--button-bg); color: var(--button-text);" />
          <span>words</span>
        </label>

        <button id="restart" disabled
          style="padding: 8px 12px; border-radius: 10px; border: 1px solid var(--button-border);
                 background: var(--button-bg); color: var(--button-text);">
          Restart book
        </button>

        <button id="resumeSaved" disabled
          style="padding: 8px 12px; border-radius: 10px; border: 1px solid var(--button-border);
                 background: var(--button-bg); color: var(--button-text);">
          Resume saved position
        </button>

        <label style="display:flex; gap: 10px; align-items:center; margin-left: 6px;">
          <strong>Speed</strong>
          <input id="wpm" type="range" min="120" max="900" value="300" step="10" />
          <span id="wpmLabel">300 wpm</span>
        </label>
      </div>

      <div style="margin-top: 14px;">
        <div style="font-weight: 600; margin-bottom: 6px;">Now reading</div>
        <div id="wordBox"
          style="padding: 18px; background: var(--panel);
                 border: 1px solid var(--panel-border); border-radius: 14px;
                 font-size: 42px; font-weight: 700; letter-spacing: 0.5px;
                 min-height: 82px; display:flex; align-items:center; justify-content:center;">
          —
        </div>

        <div id="posInfo" style="margin-top: 8px; color: var(--muted);">
          No book loaded.
        </div>
        <div id="hintInfo" style="margin-top: 6px; color: var(--muted); font-size: 12px;"></div>
      </div>

      <div style="
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        flex: 1; /* takes remaining vertical space */
        min-height: 0;
      ">
        <div style="font-weight: 700; margin-bottom: 6px;">
          Document (whole book) — click a word to jump
        </div>

        <div id="docWrap"
          style="
            flex: 1;
            min-height: 0;
            border: 1px solid var(--panel-border);
            border-radius: 10px;
            background: var(--bg);
            padding: 12px;
            line-height: 1.55;
            overflow-y: auto;   /* ✅ ONLY SCROLL */
            overflow-x: hidden;
          ">
          <div style="color: var(--muted);">
            Load an EPUB to see the document.
          </div>
        </div>
      </div>
    </div>
  </div>
`;

/* =========================
   DOM refs
   ========================= */

type Token = {
  word: string;
  spineIndex: number;
  spineHref?: string;
  nodeIndex: number;
  startOffset: number;
  endOffset: number;
};

type SpineItemData = {
  spineIndex: number;
  href?: string;
  idref?: string;
  doc: Document;
  textNodes: Text[];
  spineItem: any;
  tokenStart: number;
  tokenEnd: number;
};

type LoadedBook = {
  spineCount: number;
  tokens: Token[];
  items: SpineItemData[];
  itemBySpineIndex: Map<number, SpineItemData>;
};

type SavedProgress = {
  version: 2;
  fileKey: string;
  globalWordIndex: number;
  wpm: number;
  savedAtIso: string;
};

const themeSelect = document.querySelector<HTMLSelectElement>('#themeSelect');
const fileInput = document.querySelector<HTMLInputElement>('#fileInput');
const dropZone = document.querySelector<HTMLDivElement>('#dropZone');
const statusEl = document.querySelector<HTMLSpanElement>('#status');

const playPauseBtn = document.querySelector<HTMLButtonElement>('#playPause');
const rewindBtn = document.querySelector<HTMLButtonElement>('#rewind');
const rewindCountInput = document.querySelector<HTMLInputElement>('#rewindCount');
const restartBtn = document.querySelector<HTMLButtonElement>('#restart');
const resumeSavedBtn = document.querySelector<HTMLButtonElement>('#resumeSaved');

const wpmInput = document.querySelector<HTMLInputElement>('#wpm');
const wpmLabel = document.querySelector<HTMLSpanElement>('#wpmLabel');

const wordBox = document.querySelector<HTMLDivElement>('#wordBox');
const posInfo = document.querySelector<HTMLDivElement>('#posInfo');
const hintInfo = document.querySelector<HTMLDivElement>('#hintInfo');
const docWrap = document.querySelector<HTMLDivElement>('#docWrap');

if (
  !themeSelect ||
  !fileInput ||
  !dropZone ||
  !statusEl ||
  !playPauseBtn ||
  !rewindBtn ||
  !rewindCountInput ||
  !restartBtn ||
  !resumeSavedBtn ||
  !wpmInput ||
  !wpmLabel ||
  !wordBox ||
  !posInfo ||
  !hintInfo ||
  !docWrap
) {
  throw new Error('UI elements missing');
}

themeSelect.value = loadTheme();
themeSelect.addEventListener('change', () => applyTheme(themeSelect.value as ThemeId));

/* =========================
   EPUB -> tokens (whole book)
   ========================= */

function cleanText(s: string): string {
  return s
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function looksLikeCssOrJunk(s: string): boolean {
  const t = s.trim();
  if (t.length < 200) return true;

  const cssWordHits =
    (t.match(/\b(margin|padding|font|color|background|text-align|line-height|@page)\b/g)?.length ??
      0);
  const braceCount = (t.match(/[{}]/g)?.length ?? 0);
  const semiCount = (t.match(/;/g)?.length ?? 0);

  if (cssWordHits > 8) return true;
  if (braceCount > 20 && semiCount > 20) return true;

  const letters = (t.match(/[A-Za-z\u00C0-\u024F]/g)?.length ?? 0);
  if (letters / t.length < 0.5) return true;

  return false;
}

async function getSpineCount(book: any): Promise<number> {
  const spineAny = book.spine as any;
  return (
    (Array.isArray(spineAny?.spineItems) ? spineAny.spineItems.length : 0) ||
    (Array.isArray(spineAny?.items) ? spineAny.items.length : 0) ||
    (typeof spineAny?.length === 'number' ? spineAny.length : 0) ||
    0
  );
}

function parseToDocument(section: unknown): Document {
  if (section instanceof Document) return section;

  const maybeOuter = (section as any)?.outerHTML;
  const maybeDocEl = (section as any)?.documentElement?.outerHTML;

  const html =
    typeof section === 'string'
      ? section
      : typeof maybeOuter === 'string'
        ? maybeOuter
        : typeof maybeDocEl === 'string'
          ? maybeDocEl
          : '';

  const safeHtml = html.includes('<html') ? html : `<html><body>${html}</body></html>`;
  return new DOMParser().parseFromString(safeHtml, 'text/html');
}

function removeNoiseNodes(doc: Document) {
  doc.querySelectorAll('style, script, nav, noscript').forEach((el) => el.remove());
}

function collectTextNodes(doc: Document, root: Node): Text[] {
  const out: Text[] = [];
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const t = node as Text;
    if (t.nodeValue && t.nodeValue.trim().length > 0) out.push(t);
  }
  return out;
}

function buildTokensForItem(spineIndex: number, spineHref: string | undefined, textNodes: Text[]) {
  const tokens: Token[] = [];
  for (let nodeIndex = 0; nodeIndex < textNodes.length; nodeIndex++) {
    const raw = textNodes[nodeIndex].nodeValue ?? '';
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(raw)) !== null) {
      const word = m[0];
      tokens.push({
        word,
        spineIndex,
        spineHref,
        nodeIndex,
        startOffset: m.index,
        endOffset: m.index + word.length,
      });
    }
  }
  return tokens;
}

function fileKeyFor(file: File): string {
  return `${file.name}::${file.size}`;
}

/* =========================
   Reading + saving
   ========================= */

const STORAGE_KEY = 'speedreader.progress.v2';

function readSavedProgress(): SavedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedProgress;
    if (parsed?.version !== 2) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSavedProgress(p: SavedProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function getWpm(): number {
  return Number(wpmInput.value);
}

function setWpm(wpm: number) {
  wpmInput.value = String(Math.max(120, Math.min(900, Math.round(wpm / 10) * 10)));
  updateWpmLabel();
}

function updateWpmLabel() {
  wpmLabel.textContent = `${getWpm()} wpm`;
}

function msPerWord(wpm: number): number {
  return Math.max(10, Math.round(60000 / wpm));
}

function getRewindCount(): number {
  const n = Number(rewindCountInput.value);
  if (!Number.isFinite(n)) return 10;
  return Math.max(1, Math.min(2000, Math.floor(n)));
}

let loadedBook: LoadedBook | null = null;
let currentFileKey: string | null = null;

let isPlaying = false;
let globalWordIndex = 0;
let timer: number | null = null;

let docBuilt = false;

function setControlsEnabled(enabled: boolean) {
  playPauseBtn.disabled = !enabled;
  rewindBtn.disabled = !enabled;
  restartBtn.disabled = !enabled;
}

function stopTimer() {
  if (timer !== null) {
    window.clearTimeout(timer);
    timer = null;
  }
}

function ensureDocHtml() {
  if (!loadedBook || docBuilt) return;

  // NOTE: For very large books, this can be slow. Next step is virtualization.
  const parts: string[] = [];
  for (const item of loadedBook.items) {
    const title = `Spine #${item.spineIndex}${item.href ? ` — ${item.href}` : ''}`;
    parts.push(
      `<div style="margin: 10px 0 6px; font-weight: 700; color: var(--muted); font-size: 13px;">${escapeHtml(
        title,
      )}</div>`,
    );

    const slice = loadedBook.tokens.slice(item.tokenStart, item.tokenEnd);
    for (let local = 0; local < slice.length; local++) {
      const globalI = item.tokenStart + local;
      const w = escapeHtml(slice[local].word);
      parts.push(`<span class="tok" data-i="${globalI}" style="cursor:pointer;">${w}</span> `);
    }

    parts.push(`<div style="height: 8px;"></div>`);
  }

  docWrap.innerHTML = parts.join('');
  docBuilt = true;
}

function highlightCurrentWord(scrollIntoView: boolean) {
  if (!loadedBook) return;
  ensureDocHtml();

  const prev = docWrap.querySelector<HTMLSpanElement>('span.tok.current');
  if (prev) {
    prev.classList.remove('current');
    prev.style.background = '';
    prev.style.borderRadius = '';
    prev.style.padding = '';
  }

  const el = docWrap.querySelector<HTMLSpanElement>(`span.tok[data-i="${globalWordIndex}"]`);
  if (el) {
    el.classList.add('current');
    el.style.background = 'var(--highlight)';
    el.style.borderRadius = '6px';
    el.style.padding = '1px 3px';
    if (scrollIntoView) el.scrollIntoView({ block: 'center' });
  }
}

function updatePositionInfo(extra?: string) {
  if (!loadedBook) {
    posInfo.textContent = 'No book loaded.';
    hintInfo.textContent = '';
    return;
  }

  const total = loadedBook.tokens.length;
  const idx = Math.max(0, Math.min(globalWordIndex, total - 1));
  const pct = total ? Math.round(((idx + 1) / total) * 100) : 0;

  const tok = loadedBook.tokens[idx];
  const where = `Spine #${tok.spineIndex}${tok.spineHref ? ` (${tok.spineHref})` : ''}`;
  posInfo.textContent = `${where} — Word ${idx + 1} / ${total} (${pct}%)${extra ? ` — ${extra}` : ''}`;
  hintInfo.textContent = 'Drop or choose an EPUB. Click in Document to jump. Rewind goes back the specified number of words.';
}

function showCurrentWord(scrollDocToWord: boolean) {
  if (!loadedBook || loadedBook.tokens.length === 0) {
    wordBox.textContent = '—';
    updatePositionInfo();
    return;
  }

  const idx = Math.max(0, Math.min(globalWordIndex, loadedBook.tokens.length - 1));
  wordBox.textContent = loadedBook.tokens[idx].word;

  updatePositionInfo(isPlaying ? 'Playing' : 'Paused');
  highlightCurrentWord(scrollDocToWord);
}

function updateResumeButton() {
  const saved = readSavedProgress();
  if (!saved || !currentFileKey || saved.fileKey !== currentFileKey) {
    resumeSavedBtn.disabled = true;
    return;
  }
  resumeSavedBtn.disabled = !loadedBook;
}

function saveProgress(reason: string) {
  if (!loadedBook || !currentFileKey) return;

  const p: SavedProgress = {
    version: 2,
    fileKey: currentFileKey,
    globalWordIndex,
    wpm: getWpm(),
    savedAtIso: new Date().toISOString(),
  };

  writeSavedProgress(p);
  updateResumeButton();
  updatePositionInfo(reason);
}

function stepPlayback() {
  if (!loadedBook) return;

  const total = loadedBook.tokens.length;
  if (total === 0) return;

  if (globalWordIndex >= total - 1) {
    isPlaying = false;
    playPauseBtn.textContent = 'Play';
    stopTimer();
    showCurrentWord(true);
    saveProgress('finished');
    return;
  }

  globalWordIndex += 1;
  showCurrentWord(false);
  timer = window.setTimeout(stepPlayback, msPerWord(getWpm()));
}

function play() {
  if (!loadedBook || loadedBook.tokens.length === 0) return;
  isPlaying = true;
  playPauseBtn.textContent = 'Pause';
  stopTimer();
  showCurrentWord(false);
  timer = window.setTimeout(stepPlayback, msPerWord(getWpm()));
}

function pause() {
  isPlaying = false;
  playPauseBtn.textContent = 'Play';
  stopTimer();
  showCurrentWord(true);
  saveProgress('pause');
}

function togglePlayPause() {
  if (!loadedBook) return;
  if (isPlaying) pause();
  else play();
}

function restartBook() {
  if (!loadedBook) return;
  const wasPlaying = isPlaying;
  pause();
  globalWordIndex = 0;
  showCurrentWord(true);
  saveProgress('restart');
  if (wasPlaying) play();
}

function rewindWords() {
  if (!loadedBook) return;
  const n = getRewindCount();
  const wasPlaying = isPlaying;
  pause();
  globalWordIndex = Math.max(0, globalWordIndex - n);
  showCurrentWord(true);
  saveProgress('rewind');
  if (wasPlaying) play();
}

/* =========================
   Drag & Drop styling
   ========================= */

function setDropZoneActive(active: boolean) {
  dropZone.style.borderColor = active ? 'var(--accent)' : 'var(--panel-border)';
  dropZone.style.color = active ? 'var(--text)' : 'var(--muted)';
}

/* =========================
   Whole-book loader
   ========================= */

async function loadWholeBook(file: File): Promise<LoadedBook> {
  const arrayBuffer = await file.arrayBuffer();
  const book = ePub(arrayBuffer);
  await book.ready;

  const spineCount = await getSpineCount(book);

  const tokens: Token[] = [];
  const items: SpineItemData[] = [];
  const itemBySpineIndex = new Map<number, SpineItemData>();

  for (let i = 0; i < spineCount; i++) {
    const spineItem = book.spine.get(i);
    if (!spineItem) continue;

    const href = String((spineItem as any).href ?? '');
    const idref = String((spineItem as any).idref ?? '');
    const lower = (href + ' ' + idref).toLowerCase();

    // basic skip heuristics
    if (/(cover|toc|nav|title|copyright|styles?)/.test(lower)) continue;

    try {
      const loadedSection = await spineItem.load(book.load.bind(book));
      const doc = parseToDocument(loadedSection);
      removeNoiseNodes(doc);

      const rawText = doc.body?.textContent ?? doc.documentElement?.textContent ?? '';
      const cleaned = cleanText(String(rawText));
      if (looksLikeCssOrJunk(cleaned)) continue;

      const root: Node = doc.body ?? doc.documentElement;
      const textNodes = collectTextNodes(doc, root);

      const itemTokens = buildTokensForItem(i, href || undefined, textNodes);
      if (itemTokens.length < 30) continue;

      const tokenStart = tokens.length;
      tokens.push(...itemTokens);
      const tokenEnd = tokens.length;

      const itemData: SpineItemData = {
        spineIndex: i,
        href: href || undefined,
        idref: idref || undefined,
        doc,
        textNodes,
        spineItem,
        tokenStart,
        tokenEnd,
      };

      items.push(itemData);
      itemBySpineIndex.set(i, itemData);
    } catch {
      // skip spine item if it fails
    }
  }

  if (tokens.length === 0) throw new Error('No readable text found across the spine.');

  return { spineCount, tokens, items, itemBySpineIndex };
}

async function handleEpubFile(file: File) {
  // Basic validation
  if (!file.name.toLowerCase().endsWith('.epub')) {
    statusEl.textContent = 'Please choose a .epub file.';
    return;
  }

  // Reset UI
  currentFileKey = fileKeyFor(file);
  loadedBook = null;
  globalWordIndex = 0;
  isPlaying = false;
  stopTimer();
  docBuilt = false;

  docWrap.innerHTML = `<div style="color: var(--muted);">Loading whole book…</div>`;
  setControlsEnabled(false);
  resumeSavedBtn.disabled = true;
  playPauseBtn.textContent = 'Play';
  wordBox.textContent = '—';
  posInfo.textContent = 'Loading…';
  hintInfo.textContent = '';
  statusEl.textContent = `Loading: ${file.name}…`;

  try {
    const loaded = await loadWholeBook(file);
    loadedBook = loaded;

    statusEl.textContent = `Loaded: ${file.name} — Tokens: ${loaded.tokens.length} (from ${loaded.items.length} spine items)`;
    setControlsEnabled(true);

    ensureDocHtml();

    const saved = readSavedProgress();
    if (saved && saved.fileKey === currentFileKey) {
      setWpm(saved.wpm);
      resumeSavedBtn.disabled = false;
      globalWordIndex = Math.max(0, Math.min(saved.globalWordIndex, loaded.tokens.length - 1));
      showCurrentWord(true);
      updatePositionInfo('saved progress found');
    } else {
      resumeSavedBtn.disabled = true;
      globalWordIndex = 0;
      showCurrentWord(true);
      updatePositionInfo('ready');
    }

    updateResumeButton();
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Failed to load book (see console).';
    docWrap.innerHTML = `<div style="color: var(--muted);">Failed to load book.</div>`;
    setControlsEnabled(false);
    resumeSavedBtn.disabled = true;
    posInfo.textContent = 'Error.';
    hintInfo.textContent = '';
  }
}

/* =========================
   Small utilities
   ========================= */

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/* =========================
   Wire up events
   ========================= */

updateWpmLabel();

wpmInput.addEventListener('input', () => {
  updateWpmLabel();
  if (isPlaying) {
    stopTimer();
    timer = window.setTimeout(stepPlayback, msPerWord(getWpm()));
    updatePositionInfo('speed changed');
  }
});

playPauseBtn.addEventListener('click', togglePlayPause);
restartBtn.addEventListener('click', restartBook);
rewindBtn.addEventListener('click', rewindWords);

resumeSavedBtn.addEventListener('click', () => {
  const saved = readSavedProgress();
  if (!loadedBook || !saved || !currentFileKey || saved.fileKey !== currentFileKey) return;

  pause();
  setWpm(saved.wpm);
  globalWordIndex = Math.max(0, Math.min(saved.globalWordIndex, loadedBook.tokens.length - 1));
  showCurrentWord(true);
  updatePositionInfo('resumed');
});

docWrap.addEventListener('click', (e) => {
  if (!loadedBook) return;
  const target = e.target as HTMLElement | null;
  const span = target?.closest?.('span.tok') as HTMLSpanElement | null;
  if (!span) return;

  const i = Number(span.dataset.i);
  if (!Number.isFinite(i)) return;

  const wasPlaying = isPlaying;
  pause();
  globalWordIndex = Math.max(0, Math.min(i, loadedBook.tokens.length - 1));
  showCurrentWord(true);
  saveProgress('seek');
  if (wasPlaying) play();
});

// File picker
fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  await handleEpubFile(file);
});

// Drag & drop
['dragenter', 'dragover'].forEach((evt) => {
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropZoneActive(true);
  });
});

['dragleave', 'drop'].forEach((evt) => {
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropZoneActive(false);
  });
});

dropZone.addEventListener('drop', async (e) => {
  const dt = (e as DragEvent).dataTransfer;
  const file = dt?.files?.[0];
  if (!file) return;

  if (!file.name.toLowerCase().endsWith('.epub')) {
    const old = dropZone.textContent;
    dropZone.textContent = 'Please drop a .epub file';
    setTimeout(() => (dropZone.textContent = old ?? 'Drop EPUB here'), 1200);
    return;
  }

  await handleEpubFile(file);
});
