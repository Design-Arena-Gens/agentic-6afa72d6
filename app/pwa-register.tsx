"use client";
import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        // Optional: auto update
        setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
      } catch (err) {
        // noop
      }
    };

    register();
  }, []);
  return null;
}
