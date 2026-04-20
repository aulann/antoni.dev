"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "motion/react";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const isMobileRef = React.useRef(false);

  React.useEffect(() => {
    const check = () => { isMobileRef.current = window.innerWidth <= 768; };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // rotateX disabled on mobile — 3D perspective causes GPU jank during scroll on iOS/Android
  const rotate = useTransform(scrollYProgress, (v) =>
    isMobileRef.current ? 0 : v * -20 + 20
  );
  const scale = useTransform(scrollYProgress, (v) =>
    v * (isMobileRef.current ? (1 - 0.85) : (1 - 1.05)) + (isMobileRef.current ? 0.85 : 1.05)
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="relative flex h-200 items-center justify-center p-2 md:h-320 md:p-20"
      ref={containerRef}
    >
      <div className="relative w-full py-10 md:py-40" style={{ perspective: "1000px" }}>
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
      willChange: "transform",
      backfaceVisibility: "hidden",
      boxShadow:
        "0 0 #00000020, 0 9px 20px #0000001e, 0 37px 37px #00000018, 0 84px 50px #0000000e, 0 149px 60px #00000005, 0 233px 65px #00000002",
    }}
    className="mx-auto -mt-12 h-120 w-full max-w-5xl rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl md:h-160 md:p-6"
  >
    <div className="h-full w-full overflow-hidden rounded-2xl bg-background">
      {children}
    </div>
  </motion.div>
);
