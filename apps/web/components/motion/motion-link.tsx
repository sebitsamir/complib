"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

type MotionLinkProps = ComponentProps<typeof Link> & {
  children: ReactNode;
};

export function MotionNavLink({
  children,
  className,
  href,
  ...props
}: MotionLinkProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="inline-flex"
      whileHover={reduceMotion ? undefined : { y: -1 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.18 }}
    >
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    </motion.div>
  );
}

export function MotionCtaLink({
  children,
  className,
  href,
  ...props
}: MotionLinkProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="inline-flex"
      whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    </motion.div>
  );
}
