import { motion } from "framer-motion";

interface CourtsStepProps {
  value: number;
  onChange: (value: number) => void;
  maxRecommended: number;
}

export function CourtsStep({ value, onChange, maxRecommended }: CourtsStepProps) {
  const dec = () => onChange(Math.max(1, value - 1));
  const inc = () => onChange(value + 1);

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <p className="text-sm text-neutral-500">Wie viele Courts stehen zur Verfügung?</p>
      <div className="flex items-center gap-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={dec}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-xl text-neutral-600 hover:bg-neutral-50"
        >
          −
        </motion.button>
        <motion.span
          key={value}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="w-16 text-center text-4xl font-bold text-neutral-900"
        >
          {value}
        </motion.span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={inc}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-xl text-neutral-600 hover:bg-neutral-50"
        >
          +
        </motion.button>
      </div>
      {value > maxRecommended && (
        <p className="text-xs text-amber-600">
          Mit aktueller Spieleranzahl reichen {maxRecommended} Court{maxRecommended === 1 ? "" : "s"} aus, um alle
          Courts pro Runde zu nutzen.
        </p>
      )}
    </div>
  );
}
