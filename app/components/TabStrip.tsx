"use client";

export type Tab = {
  id: string;
  title: string;
  url: string;
};

export default function TabStrip({
  tabs,
  activeId,
  onSelect,
  onClose,
  onNew
}: {
  tabs: Tab[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <div key={t.id} className={"tab" + (t.id === activeId ? " active" : "")}>
          <button onClick={() => onSelect(t.id)} style={{ all: "unset", cursor: "pointer" }}>
            {t.title || t.url}
          </button>
          <button className="badge" onClick={() => onClose(t.id)} aria-label="Close tab">?</button>
        </div>
      ))}
      <button className="tab" onClick={onNew} aria-label="New tab">? New</button>
    </div>
  );
}
