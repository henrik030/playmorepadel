import { motion } from "framer-motion";

interface StandingsListProps {
  rows: { id: string; label: string; points: number; matchesPlayed: number }[];
}

const medals = ["🥇", "🥈", "🥉"];

export function StandingsList({ rows }: StandingsListProps) {
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-neutral-400">Noch keine Daten.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, i) => (
        <motion.div
          key={row.id}
          layout
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, delay: i * 0.02 }}
          className={`flex items-center gap-3 rounded-xl border p-3 ${
            i === 0 ? "border-green-300 bg-green-50" : "border-neutral-200 bg-white"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-sm font-bold text-neutral-500">
            {medals[i] ?? i + 1}
          </span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-neutral-900">{row.label}</div>
            <div className="text-xs text-neutral-400">{row.matchesPlayed} Spiele</div>
          </div>
          <div className="text-lg font-bold text-neutral-900">{row.points}</div>
        </motion.div>
      ))}
    </div>
  );
}
