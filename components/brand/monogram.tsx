import type { SVGProps } from "react";

export function Monogram({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Antoni"
      className={className}
      {...props}
    >
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="9"
        className="fill-foreground"
      />
      <path
        d="M13 29L20 11L27 29M15.6 23H24.4"
        className="stroke-background"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
