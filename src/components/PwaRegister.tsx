"use client";

import { useEffect } from "react";

export default function PWARegister() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", async () => {
                try {
                    const registration = await navigator.serviceWorker.register("/sw.js");
                    console.log("✅ Service Worker registered:", registration);
                } catch (err) {
                    console.error("❌ Service Worker registration failed:", err);
                }
            });
        }
    }, []);

    return null;
}
