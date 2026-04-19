"use client";

import { ReactLenis } from "lenis/react";
import type { PropsWithChildren } from "react";

export function LenisProvider({ children }: PropsWithChildren) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
