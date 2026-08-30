"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type AnimatedStatProps = {
  value: string;
  label: string;
  className?: string;
};

function parseStat(value: string): {
  prefix: string;
  num: number | null;
  suffix: string;
} {
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return { prefix: "", num: null, suffix: value };
  return {
    prefix: match[1],
    num: Number(match[2]),
    suffix: match[3],
  };
}

export function AnimatedStat({ value, label, className }: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const { prefix, num, suffix } = parseStat(value);
  const [display, setDisplay] = useState(reduceMotion || num === null ? value : `${prefix}0${suffix}`);

  useEffect(() => {
    if (!inView || num === null || reduceMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = num * eased;
      const formatted =
        Number.isInteger(num) || suffix === "%"
          ? suffix === "%" && !Number.isInteger(num)
            ? current.toFixed(1)
            : String(Math.round(current))
          : current.toFixed(1);
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, num, prefix, suffix, value, reduceMotion]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-3xl font-bold tabular-nums text-foreground">{display}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}
