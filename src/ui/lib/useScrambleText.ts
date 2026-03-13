"use client";

import { useEffect, useState } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%@&";

type UseScrambleTextOptions = {
  text: string;
  /** Milliseconds per animation frame (default: 40) */
  speed?: number;
  /** Milliseconds stagger between each character starting to scramble (default: 70) */
  revealDelay?: number;
  /** Number of scramble iterations before a character settles (default: 6) */
  scrambleFrames?: number;
  /** Milliseconds before the animation begins (default: 0) */
  startDelay?: number;
  /** Set false for reduced-motion — shows the final text immediately (default: true) */
  enabled?: boolean;
};

export function useScrambleText({
  text,
  speed = 40,
  revealDelay = 70,
  scrambleFrames = 6,
  startDelay = 0,
  enabled = true,
}: UseScrambleTextOptions) {
  const [displayedText, setDisplayedText] = useState(enabled ? "" : text);
  const [settledCount, setSettledCount] = useState(enabled ? 0 : text.length);
  const [isComplete, setIsComplete] = useState(!enabled);
  const [isStarted, setIsStarted] = useState(!enabled);

  const nonSpaceCount = text.replace(/ /g, "").length;

  /** Estimated total duration in ms (useful for chaining downstream animations). */
  const totalDuration = enabled
    ? startDelay + Math.max(0, nonSpaceCount - 1) * revealDelay + scrambleFrames * speed
    : 0;

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setSettledCount(text.length);
      setIsComplete(true);
      setIsStarted(true);
      return;
    }

    setDisplayedText(" ".repeat(text.length));
    setSettledCount(0);
    setIsComplete(false);
    setIsStarted(false);

    let rafId: number;

    // Map each position to its non-space index (spaces get -1)
    const nsMap: number[] = [];
    let nsIdx = 0;
    for (let i = 0; i < text.length; i++) {
      nsMap.push(text[i] === " " ? -1 : nsIdx++);
    }

    const timeout = setTimeout(() => {
      setIsStarted(true);
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const frame = Math.floor(elapsed / speed);

        let result = "";
        let nsSettled = 0;

        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") {
            result += " ";
            continue;
          }

          const charOrder = nsMap[i];
          const charStartFrame = Math.floor((charOrder * revealDelay) / speed);
          const framesActive = frame - charStartFrame;

          if (framesActive < 0) {
            result += " ";
          } else if (framesActive < scrambleFrames) {
            result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          } else {
            result += text[i];
            nsSettled++;
          }
        }

        setDisplayedText(result);
        setSettledCount(nsSettled);

        if (nsSettled >= nonSpaceCount) {
          setDisplayedText(text); // guarantee perfect final state
          setSettledCount(nonSpaceCount);
          setIsComplete(true);
        } else {
          rafId = requestAnimationFrame(step);
        }
      };

      rafId = requestAnimationFrame(step);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId);
    };
  }, [text, speed, revealDelay, scrambleFrames, startDelay, enabled, nonSpaceCount]);

  return { displayedText, settledCount, isComplete, isStarted, totalDuration };
}
