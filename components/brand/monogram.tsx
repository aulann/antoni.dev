import { TerminalWindow } from "@phosphor-icons/react";
import type { ComponentProps } from "react";

export function Monogram({
  className,
  ...props
}: ComponentProps<typeof TerminalWindow>) {
  return (
    <TerminalWindow
      weight="duotone"
      aria-label="Antoni"
      className={className}
      {...props}
    />
  );
}
