"use client";
import { useEffect, useMemo, useState } from "react";
import AddressBar from "./components/AddressBar";
import TabStrip, { Tab as UITab } from "./components/TabStrip";
import WebView from "./components/WebView";
import BookmarkDrawer, { Bookmark } from "./components/BookmarkDrawer";
import { getItemJSON, setItemJSON } from "./lib/storage";

function isLikelyUrl(input: string): boolean {
  try {
    // allow host-only by prefixing http
    if (/^\w+:\/\//.test(input)) {
      new URL(input);
      return true;
    }
    if (/^[^\s]+\.[^\s]+/.test(input)) {
      new URL("http://" + input);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function toUrlOrSearch(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "https://duckduckgo.com";
  if (isLikelyUrl(trimmed)) {
    if (/^\w+:\/\//.test(trimmed)) return trimmed;
    return "http://" + trimmed;
  }
  const q = encodeURIComponent(trimmed);
  return `https://duckduckgo.com/?q=${q}`;
}

function id(): string { return Math.random().toString(36).slice(2, 10); }

export type Tab = {
  id: string;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
};

type PersistShape = {
  tabs: Tab[];
  activeId: string | null;
  bookmarks: Bookmark[];
};

const DEFAULT_HOME = "https://duckduckgo.com";

export default function Page() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [address, setAddress] = useState<string>(DEFAULT_HOME);
  const [reloadNonce, setReloadNonce] = useState(0);
  const [showBookmarks, setShowBookmarks] = useState(false);

  // Load persisted
  useEffect(() => {
    const data = getItemJSON<PersistShape>("agentic_state", {
      tabs: [],
      activeId: "",
      bookmarks: []
    });
    if (data.tabs.length === 0) {
      const first: Tab = { id: id(), title: "DuckDuckGo", url: DEFAULT_HOME, history: [DEFAULT_HOME], historyIndex: 0 };
      setTabs([first]);
      setActiveId(first.id);
      setAddress(first.url);
      setBookmarks([]);
    } else {
      setTabs(data.tabs);
      setActiveId(data.activeId || data.tabs[0].id);
      const active = data.tabs.find(t => t.id === (data.activeId || data.tabs[0].id));
      setAddress(active?.url || DEFAULT_HOME);
      setBookmarks(data.bookmarks || []);
    }
  }, []);

  // Persist
  useEffect(() => {
    const payload: PersistShape = { tabs, activeId, bookmarks };
    setItemJSON("agentic_state", payload);
  }, [tabs, activeId, bookmarks]);

  const activeTab = useMemo(() => tabs.find(t => t.id === activeId) || tabs[0], [tabs, activeId]);

  useEffect(() => {
    if (activeTab) setAddress(activeTab.url);
  }, [activeTab?.url, activeId]);

  function navigateActive(input: string) {
    const target = toUrlOrSearch(input);
    setTabs(prev => prev.map(t => {
      if (t.id !== activeId) return t;
      const newHistory = t.history.slice(0, t.historyIndex + 1).concat(target);
      return { ...t, url: target, title: prettifyTitle(target), history: newHistory, historyIndex: newHistory.length - 1 };
    }));
  }

  function prettifyTitle(u: string): string {
    try { const { hostname } = new URL(u); return hostname.replace(/^www\./, ""); } catch { return u; }
  }

  function addTab(u?: string) {
    const target = u || DEFAULT_HOME;
    const t: Tab = { id: id(), title: prettifyTitle(target), url: target, history: [target], historyIndex: 0 };
    setTabs(prev => [...prev, t]);
    setActiveId(t.id);
    setAddress(target);
  }

  function closeTab(idToClose: string) {
    setTabs(prev => {
      const idx = prev.findIndex(t => t.id === idToClose);
      if (idx === -1) return prev;
      const next = prev.filter(t => t.id !== idToClose);
      if (idToClose === activeId && next.length) {
        const newActive = next[Math.max(0, idx - 1)];
        setActiveId(newActive.id);
        setAddress(newActive.url);
      }
      return next.length ? next : [{ id: id(), title: "DuckDuckGo", url: DEFAULT_HOME, history: [DEFAULT_HOME], historyIndex: 0 }];
    });
  }

  function goBack() {
    setTabs(prev => prev.map(t => {
      if (t.id !== activeId) return t;
      const idx = Math.max(0, t.historyIndex - 1);
      return { ...t, historyIndex: idx, url: t.history[idx] };
    }));
  }
  function goForward() {
    setTabs(prev => prev.map(t => {
      if (t.id !== activeId) return t;
      const idx = Math.min(t.history.length - 1, t.historyIndex + 1);
      return { ...t, historyIndex: idx, url: t.history[idx] };
    }));
  }
  function reload() { setReloadNonce(n => n + 1); }

  function toggleBookmarkCurrent() {
    if (!activeTab) return;
    const exists = bookmarks.some(b => b.url === activeTab.url);
    if (exists) {
      setBookmarks(prev => prev.filter(b => b.url !== activeTab.url));
    } else {
      setBookmarks(prev => [{ title: activeTab.title || activeTab.url, url: activeTab.url }, ...prev].slice(0, 200));
    }
  }

  const isCurrentBookmarked = !!bookmarks.find(b => b.url === activeTab?.url);

  const uiTabs: UITab[] = tabs.map(t => ({ id: t.id, title: t.title, url: t.url }));

  return (
    <div id="app">
      <AddressBar
        value={address}
        onChange={setAddress}
        onSubmit={() => navigateActive(address)}
        onBookmarksClick={() => setShowBookmarks(true)}
        onNewTab={() => addTab()}
      />
      <TabStrip
        tabs={uiTabs}
        activeId={activeId}
        onSelect={setActiveId}
        onClose={closeTab}
        onNew={() => addTab()}
      />

      {activeTab && (
        <WebView url={activeTab.url} reloadKey={`${activeTab.url}-${reloadNonce}`} />
      )}

      <div className="footer">
        <button className="icon-btn" onClick={goBack} aria-label="Back">?</button>
        <button className="icon-btn" onClick={goForward} aria-label="Forward">?</button>
        <button className="icon-btn" onClick={reload} aria-label="Reload">?</button>
        <a className="icon-btn" href={activeTab?.url} target="_blank" rel="noreferrer" aria-label="Open externally">?</a>
        <button className="icon-btn" onClick={toggleBookmarkCurrent} aria-label="Bookmark">{isCurrentBookmarked ? "?" : "?"}</button>
        <button className="icon-btn" onClick={() => navigateActive(DEFAULT_HOME)} aria-label="Home">?</button>
      </div>

      <BookmarkDrawer
        visible={showBookmarks}
        bookmarks={bookmarks}
        onSelect={(u) => { setShowBookmarks(false); navigateActive(u); }}
        onRemove={(u) => setBookmarks(prev => prev.filter(b => b.url !== u))}
        onClear={() => setBookmarks([])}
        onClose={() => setShowBookmarks(false)}
      />
    </div>
  );
}
