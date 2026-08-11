import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";

export function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "header";
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <Tag ref={ref as never} data-visible={visible} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
