"use client";

import { useEffect, useRef } from "react";

export function FeatureVideo({ src, label, portrait }: { src: string; label: string; portrait?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      disablePictureInPicture
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      className={portrait ? "h-full w-full cursor-pointer object-cover" : "aspect-video w-full cursor-pointer"}
      aria-label={label}
    />
  );
}
