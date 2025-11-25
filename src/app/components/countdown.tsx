"use client";

import { differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";

export function Countdown({ target }: { target: string | Date | null }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!target) return;
    const targetDate = typeof target === "string" ? new Date(target) : target;
    const interval = setInterval(() => {
      const now = new Date();
      setRemaining(Math.max(0, differenceInSeconds(targetDate, now)));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (!target) return <span className="text-sm text-slate-500">No countdown</span>;

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return (
    <span className="font-semibold text-brand-700">
      {days}d {hours}h {minutes}m {seconds}s
    </span>
  );
}
