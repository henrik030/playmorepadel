import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent-500 text-neutral-900 shadow-sm shadow-accent-600/20 hover:bg-accent-600",
  secondary: "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50",
  ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100",
  danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-xl",
};

export function Button({ variant = "primary", size = "md", className, children, disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.12 }}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
