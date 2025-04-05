// components/WindowPathLogger.tsx
"use client";

import { useEffect } from "react";

const WindowPathLogger = () => {
  useEffect(() => {
    const tokens = window.location.pathname.split("/");
    console.log("Tokens:", tokens);
  }, []);

  return null; // This component just logs, doesn't render anything
};

export default WindowPathLogger;
