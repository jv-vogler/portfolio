"use client";

import { useFocusedReading } from "@/ui/blog/context/FocusedReadingContext";
import { cn } from "@/lib/utils";

type FocusedHideProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Smoothly collapses its children when focused reading mode is active.
 * Uses CSS grid row transition for height + opacity for a polished effect.
 */
export function FocusedHide({ children, className }: FocusedHideProps) {
  const { isFocused } = useFocusedReading();

  return (
    <div
      className={cn(
        "grid transition-all duration-500 ease-in-out",
        isFocused ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
        className,
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
