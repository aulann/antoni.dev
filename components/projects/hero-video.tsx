"use client";

export function HeroVideo({ src, label }: { src: string; label: string }) {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      className="aspect-video w-full"
      aria-label={label}
    />
  );
}
