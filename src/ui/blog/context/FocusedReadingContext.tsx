"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type FocusedReadingContextType = {
  isFocused: boolean;
  isBlogPost: boolean;
  toggle: () => void;
};

const FocusedReadingContext = createContext<FocusedReadingContextType>({
  isFocused: false,
  isBlogPost: false,
  toggle: () => {},
});

export function FocusedReadingProvider({ children }: { children: React.ReactNode }) {
  const [isFocused, setIsFocused] = useState(false);
  const pathname = usePathname();
  const isBlogPost = /\/blog\/.+/.test(pathname);

  // Auto-exit when navigating away from a blog post
  useEffect(() => {
    if (!isBlogPost) setIsFocused(false);
  }, [isBlogPost]);

  const toggle = useCallback(() => setIsFocused((v) => !v), []);

  return (
    <FocusedReadingContext.Provider value={{ isFocused, isBlogPost, toggle }}>
      {children}
    </FocusedReadingContext.Provider>
  );
}

export function useFocusedReading() {
  return useContext(FocusedReadingContext);
}
