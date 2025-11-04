"use client";
import { useEffect, useRef, useState } from "react";

export default function WebView({
  url,
  reloadKey
}: {
  url: string;
  reloadKey: string;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    setBlocked(false);
    const t = setTimeout(() => setBlocked(true), 1500);
    return () => clearTimeout(t);
  }, [url, reloadKey]);

  return (
    <div className="webview">
      <iframe
        key={reloadKey}
        ref={frameRef}
        src={url}
        sandbox="allow-forms allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        onLoad={() => setBlocked(false)}
      />
      {blocked && (
        <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",padding:"1rem",background:"linear-gradient(180deg, rgba(11,15,26,.85), rgba(11,15,26,.85))",backdropFilter:"blur(2px)"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:16, color:"#e5e7eb", marginBottom:".5rem"}}>This site may block embedding</div>
            <a className="badge" href={url} target="_blank" rel="noreferrer">Open in new tab</a>
          </div>
        </div>
      )}
    </div>
  );
}
