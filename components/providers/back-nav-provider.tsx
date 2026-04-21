"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

const BackNavContext = createContext(false);
export const useBackNav = () => useContext(BackNavContext);

export function BackNavProvider({ children }: PropsWithChildren) {
  const [isBackNav, setIsBackNav] = useState(false);

  useEffect(() => {
    try {
      const entries = performance.getEntriesByType("navigation");
      const type = (entries[0] as PerformanceNavigationTiming)?.type;
      if (type !== "back_forward") return;

      setIsBackNav(true);

      const saved = sessionStorage.getItem("portfolio-scroll-y");
      if (saved) {
        window.scrollTo({ top: parseInt(saved, 10), behavior: "instant" as ScrollBehavior });
        sessionStorage.removeItem("portfolio-scroll-y");
      }
    } catch {}
  }, []);

  return (
    <BackNavContext.Provider value={isBackNav}>
      {children}
    </BackNavContext.Provider>
  );
}
