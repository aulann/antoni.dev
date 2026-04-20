"use client";

import React, { useRef, useLayoutEffect } from "react";
import { useScroll, useMotionValue, motion, type MotionValue } from "motion/react";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Desktop initial values at scroll=0: scale 1.05, rotateX 20deg, translateY 0
  const scale = useMotionValue(1.05);
  const rotate = useMotionValue(20);
  const translate = useMotionValue(0);

  useLayoutEffect(() => {
    const mobile = window.innerWidth <= 768;

    if (mobile) {
      // Lock to static values before first paint — no scroll subscription
      scale.set(1);
      rotate.set(0);
      translate.set(0);

      const onResize = () => {
        if (window.innerWidth > 768) window.location.reload();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    // Desktop: drive values from scroll
    const update = (v: number) => {
      scale.set(v * (1 - 1.05) + 1.05);
      rotate.set(v * -20 + 20);
      translate.set(v * -100);
    };
    // Sync with current scroll position immediately
    update(scrollYProgress.get());
    const unsub = scrollYProgress.on("change", update);

    const onResize = () => {
      if (window.innerWidth <= 768) window.location.reload();
    };
    window.addEventListener("resize", onResize);
    return () => {
      unsub();
      window.removeEventListener("resize", onResize);
    };
  }, [scrollYProgress, scale, rotate, translate]);

  return (
    <div
      className="relative flex items-center justify-center px-2 pb-2 pt-20 md:h-320 md:p-20"
      ref={containerRef}
    >
      <div className="relative w-full py-6 md:py-40 md:perspective-[1000px]">
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => (
  <motion.div
    style={{ translateY: translate }}
    className="mx-auto mb-8 max-w-5xl text-center"
  >
    {titleComponent}
  </motion.div>
);

const CARD_CLASS =
  "mx-auto mt-6 h-120 w-full max-w-5xl rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl md:-mt-12 md:h-160 md:p-6";

const CARD_SHADOW =
  "0 0 #00000020, 0 9px 20px #0000001e, 0 37px 37px #00000018, 0 84px 50px #0000000e, 0 149px 60px #00000005, 0 233px 65px #00000002";

const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      boxShadow: CARD_SHADOW,
    }}
    className={CARD_CLASS}
  >
    <div className="h-full w-full overflow-hidden rounded-[22px] md:rounded-[6px] bg-background">
      {children}
    </div>
  </motion.div>
);
