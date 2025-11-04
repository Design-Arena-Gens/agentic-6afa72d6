"use client";

export type Bookmark = { title: string; url: string };

export default function BookmarkDrawer({
  visible,
  bookmarks,
  onSelect,
  onRemove,
  onClear,
  onClose
}: {
  visible: boolean;
  bookmarks: Bookmark[];
  onSelect: (url: string) => void;
  onRemove: (url: string) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  if (!visible) return null;
  return (
    <div className="menu">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Bookmarks</h3>
        <button className="badge" onClick={onClose}>Close</button>
      </div>
      <div className="list">
        {bookmarks.length === 0 && <div className="badge">No bookmarks yet</div>}
        {bookmarks.map((b) => (
          <div key={b.url} style={{ display: "flex", gap: ".5rem" }}>
            <button style={{ flex: 1 }} onClick={() => onSelect(b.url)}>
              <div style={{ color: "#e5e7eb" }}>{b.title || b.url}</div>
              <div className="badge" style={{ marginTop: ".25rem" }}>{b.url}</div>
            </button>
            <button className="badge" onClick={() => onRemove(b.url)} aria-label="Remove">??</button>
          </div>
        ))}
      </div>
      {bookmarks.length > 0 && (
        <>
          <hr />
          <button className="badge" onClick={onClear}>Clear all</button>
        </>
      )}
    </div>
  );
}
