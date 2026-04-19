"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function EasterEggs() {
  useEffect(() => {
    let seq: string[] = [];

    const handle = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      const isEditable =
        tag === "input" ||
        tag === "textarea" ||
        (e.target as HTMLElement).isContentEditable;

      // Konami — track regardless of focus
      seq = [...seq, e.key].slice(-KONAMI.length);
      if (seq.join(",") === KONAMI.join(",")) {
        seq = [];
        toast("↑↑↓↓←→←→BA — Konami aktywowany!", {
          description: "Jesteś prawdziwym nerdem. Pozdrawiam :)",
          duration: 5000,
        });
        return;
      }

      if (isEditable) return;

      // / → scroll to terminal and focus it
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        document.getElementById("lab")?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          (document.getElementById("terminal-input") as HTMLInputElement | null)?.focus();
        }, 700);
        return;
      }

      // ? → list shortcuts
      if (e.key === "?") {
        e.preventDefault();
        toast("Skróty klawiszowe", {
          description: "/  → Terminal   ·   ?  → Ta lista   ·   ↑↑↓↓←→←→BA  → Niespodzianka",
          duration: 5000,
        });
      }
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  return null;
}
