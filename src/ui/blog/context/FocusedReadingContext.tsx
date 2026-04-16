"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type FocusedReadingContextType = {
  isFocused: boolean;
  toggle: () => void;
};

const FocusedReadingContext = createContext<FocusedReadingContextType>({
  isFocused: false,
  toggle: () => {},
});

export function FocusedReadingProvider({ children }: { children: React.ReactNode }) {
  const [isFocused, setIsFocused] = useState(false);
  const pathname = usePathname();

  // Auto-exit when navigating away from a blog post
  useEffect(() => {
    const isBlogPost = /\/blog\/.+/.test(pathname);
    if (!isBlogPost) setIsFocused(false);
  }, [pathname]);

  const toggle = useCallback(() => setIsFocused((v) => !v), []);

  return (
    <FocusedReadingContext.Provider value={{ isFocused, toggle }}>
      {children}
    </FocusedReadingContext.Provider>
  );
}

export function useFocusedReading() {
  return useContext(FocusedReadingContext);
}
