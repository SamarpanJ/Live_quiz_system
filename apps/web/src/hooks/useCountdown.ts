"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders a countdown that is identical on every device. We never trust the
 * local clock: `endsAt` is a server timestamp, and `serverNow` lets us measure
 * this device's offset from the server, so the displayed remaining time matches
 * for all students regardless of their own clock being fast/slow.
 */
export function useCountdown(endsAt: number | null, serverNow: number | null): number {
  const offsetRef = useRef(0);
  const endsAtRef = useRef<number | null>(endsAt);
  const [remaining, setRemaining] = useState(0);

  // Re-sync the device->server offset whenever a fresh snapshot arrives.
  useEffect(() => {
    if (serverNow != null) offsetRef.current = serverNow - Date.now();
    endsAtRef.current = endsAt;
  }, [endsAt, serverNow]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const target = endsAtRef.current;
      if (target == null) {
        setRemaining(0);
      } else {
        const serverClock = Date.now() + offsetRef.current;
        setRemaining(Math.max(0, target - serverClock));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return remaining;
}
