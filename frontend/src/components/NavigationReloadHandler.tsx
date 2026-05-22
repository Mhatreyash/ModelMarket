"use client";

import { useEffect } from "react";

export function NavigationReloadHandler() {
  useEffect(() => {
    const handlePopState = () => {
      // Force reload when the user navigates back or forward via browser buttons
      window.location.reload();
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      // Force reload if the page is loaded from the back-forward cache (bfcache)
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return null;
}
