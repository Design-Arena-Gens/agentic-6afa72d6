"use client";
import { useRef } from "react";

export default function AddressBar({
  value,
  onChange,
  onSubmit,
  onBookmarksClick,
  onNewTab
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onBookmarksClick: () => void;
  onNewTab: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="header">
      <button className="icon-btn" aria-label="Bookmarks" onClick={onBookmarksClick}>
        ?
      </button>
      <form
        className="input"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <span style={{ color: "#9ca3af" }}>??</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search or enter address"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
        <button className="badge" type="submit">Go</button>
      </form>
      <button className="icon-btn" aria-label="New Tab" onClick={onNewTab}>?</button>
    </div>
  );
}
