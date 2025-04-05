"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function WindowPathLogger() {
  const pathname = usePathname();

  useEffect(() => {
    console.log("Current pathname:", pathname);

    // Optional: Extract segments if needed
    const segments = pathname.split("/").filter(Boolean);
    const userName = segments[0];
    const courseName = segments[2];

    console.log("userName:", userName);
    console.log("courseName:", courseName);
  }, [pathname]);

  return null;
}
