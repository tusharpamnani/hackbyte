"use client";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function SyncUser() {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/auth") // Force fresh request

    }
  }, [isSignedIn]);

  return null;
}
