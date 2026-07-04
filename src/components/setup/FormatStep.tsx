import { motion } from "framer-motion";
import clsx from "clsx";
import type { GameFormat } from "../../types/event";

interface FormatStepProps {
  value: GameFormat | null;
  onChange: (format: GameFormat) => void;
}

const options: { format: GameFormat; title: string; description: string; emoji: string }[] = [
  {
    format: "americano",
    title: "Americano",
    description: "Partner wechseln jede Runde. Punkte zählen individuell pro Spieler.",
    emoji: "🔄",
  },
  {
    format: "team_americano",
    title: "Team Americano",
    description: "Feste Teams spielen gegen wechselnde Gegner. Punkte zählen pro Team.",
    emoji: "🤝",
  },
];

export function FormatStep({ value, onChange }: FormatStepProps) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => (
        <motion.button
          key={opt.format}
          onClick={() => onChange(opt.format)}
          whileTap={{ scale: 0.98 }}
          className={clsx(
            "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors cursor-pointer",
            value === opt.format ? "border-accent-500 bg-accent-50" : "border-neutral-200 bg-white hover:border-neutral-300",
          )}
        >
          <span className="text-2xl">{opt.emoji}</span>
          <span>
            <span className="block font-semibold text-neutral-900">{opt.title}</span>
            <span className="mt-0.5 block text-sm text-neutral-500">{opt.description}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
}
