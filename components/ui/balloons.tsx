"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const balloonsJs = typeof window !== "undefined" ? require("balloons-js") : null;

export interface BalloonsProps {
  type?: "default" | "text";
  text?: string;
  fontSize?: number;
  color?: string;
  className?: string;
  onLaunch?: () => void;
}

const Balloons = React.forwardRef<{ launchAnimation: () => void }, BalloonsProps>(
  ({ type = "default", text, fontSize = 120, color = "#000000", className, onLaunch }, ref) => {
    const launchAnimation = React.useCallback(() => {
      if (!balloonsJs) return;
      if (type === "default") {
        balloonsJs.balloons();
      } else if (type === "text" && text) {
        balloonsJs.textBalloons([{ text, fontSize, color }]);
      }
      onLaunch?.();
    }, [type, text, fontSize, color, onLaunch]);

    React.useImperativeHandle(ref, () => ({ launchAnimation }), [launchAnimation]);

    return <div className={cn("balloons-container", className)} />;
  },
);
Balloons.displayName = "Balloons";

export { Balloons };
