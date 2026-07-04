import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-base text-neutral-900 outline-none transition-all placeholder:text-neutral-400",
        "focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20",
        className,
      )}
      {...props}
    />
  );
}
