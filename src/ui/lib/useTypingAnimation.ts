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

    const startTimeout = setTimeout(() => {
      setIsStarted(true);
      let index = 0;

      const interval = setInterval(() => {
        index++;
        setDisplayedText(text.slice(0, index));

        if (index >= text.length) {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, startDelay, enabled]);

  return { displayedText, isComplete, isStarted };
}
