"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Balloons } from "@/components/ui/balloons";

const SHAKE_THRESHOLD = 18;
const COOLDOWN_MS = 1800;

export function ShakeBalloons() {
  const balloonsRef = useRef<{ launchAnimation: () => void } | null>(null);
  const [listening, setListening] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const lastShake = useRef(0);
  const prevAccel = useRef({ x: 0, y: 0, z: 0 });

  const launch = useCallback(() => {
    balloonsRef.current?.launchAnimation();
  }, []);

  const onMotion = useCallback(
    (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      const x = a.x ?? 0, y = a.y ?? 0, z = a.z ?? 0;
      const delta =
        Math.abs(x - prevAccel.current.x) +
        Math.abs(y - prevAccel.current.y) +
        Math.abs(z - prevAccel.current.z);
      prevAccel.current = { x, y, z };
      const now = Date.now();
      if (delta > SHAKE_THRESHOLD && now - lastShake.current > COOLDOWN_MS) {
        lastShake.current = now;
        launch();
      }
    },
    [launch],
  );

  useEffect(() => {
    if (typeof DeviceMotionEvent === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      setNeedsPermission(true);
      return;
    }
    window.addEventListener("devicemotion", onMotion);
    setListening(true);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [onMotion]);

  const requestPermission = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (DeviceMotionEvent as any).requestPermission();
      if (result === "granted") {
        window.addEventListener("devicemotion", onMotion);
        setListening(true);
        setNeedsPermission(false);
      }
    } catch {
      /* denied */
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-card/60 py-16 px-8 md:hidden">
      <span className="absolute top-4 left-4 select-none text-[0.65rem] font-medium tracking-[0.2em] text-muted-foreground/50 uppercase">
        Shake it!
      </span>

      {needsPermission ? (
        <button
          onClick={requestPermission}
          className="flex flex-col items-center gap-5 text-center"
        >
          <span className="text-6xl">📱</span>
          <p className="font-heading text-xl font-medium">Włącz czujnik ruchu</p>
          <p className="text-sm text-muted-foreground">Dotknij aby zezwolić</p>
        </button>
      ) : (
        <button onClick={launch} className="flex flex-col items-center gap-5 text-center">
          <motion.span
            className="select-none text-6xl"
            animate={{ rotate: [-12, 12, -12] }}
            transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
          >
            📱
          </motion.span>
          <p className="font-heading text-2xl font-medium">
            {listening ? "Potrząśnij telefonem!" : "Potrząśnij!"}
          </p>
          <p className="text-sm text-muted-foreground">lub dotknij ekran</p>
        </button>
      )}

      <span className="absolute bottom-4 right-5 select-none text-[0.6rem] text-muted-foreground/30">
        tylko mobile →
      </span>

      <Balloons ref={balloonsRef} type="default" />
    </div>
  );
}
