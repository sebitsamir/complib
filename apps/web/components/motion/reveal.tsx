"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useRef, type ReactNode } from "react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  once?: boolean;
  amount?: number;
};

export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  once = true,
  amount = 0.2,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once, amount });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      custom={delay}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
};

export function Stagger({
  children,
  className,
  stagger = 0.09,
  delayChildren = 0.06,
  once = true,
  amount = 0.12,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once, amount });

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : stagger,
        delayChildren: reduceMotion ? 0 : delayChildren,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView || reduceMotion ? "visible" : "hidden"}
      variants={container}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
};

export function StaggerItem({
  children,
  className,
  variants = fadeUp,
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduceMotion ? fadeIn : variants}
    >
      {children}
    </motion.div>
  );
}

type HeroEntranceProps = {
  children: ReactNode;
  className?: string;
};

/** Above-the-fold staggered entrance (no scroll trigger). */
export function HeroEntrance({ children, className }: HeroEntranceProps) {
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.11,
        delayChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {children}
    </motion.div>
  );
}

export function HeroItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduceMotion ? fadeIn : fadeUp}
    >
      {children}
    </motion.div>
  );
}

type HoverLiftProps = {
  children: ReactNode;
  className?: string;
};

/** Subtle lift + shadow on hover for interactive cards. */
export function HoverLift({ children, className }: HoverLiftProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ y: -4, transition: { duration: 0.22, ease: EASE_OUT } }}
      whileTap={{ scale: 0.995 }}
    >
      {children}
    </motion.div>
  );
}
