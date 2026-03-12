"use client";

import { useEffect, useState } from "react";

type UseTypingAnimationOptions = {
  text: string;
  speed?: number;
  startDelay?: number;
  enabled?: boolean;
};

export function useTypingAnimation({
  text,
  speed = 30,
  startDelay = 0,
  enabled = true,
}: UseTypingAnimationOptions) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      setIsStarted(true);
      return;
    }

    setDisplayedText("");
    setIsComplete(false);
    setIsStarted(false);

    let rafId: number;

    const startTimeout = setTimeout(() => {
      setIsStarted(true);
      let startTime: number | null = null;
      let lastIndex = 0;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const nextIndex = Math.min(Math.floor(elapsed / speed), text.length);

        if (nextIndex !== lastIndex) {
          lastIndex = nextIndex;
          setDisplayedText(text.slice(0, nextIndex));
        }

        if (nextIndex < text.length) {
          rafId = requestAnimationFrame(step);
        } else {
          setIsComplete(true);
        }
      };

      rafId = requestAnimationFrame(step);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(rafId);
    };
  }, [text, speed, startDelay, enabled]);

  return { displayedText, isComplete, isStarted };
}
