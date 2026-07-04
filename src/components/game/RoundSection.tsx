import { motion } from "framer-motion";
import type { Round } from "../../types/event";
import { MatchCard } from "./MatchCard";

interface RoundSectionProps {
  round: Round;
  playerNameById: Map<string, string>;
  onSetScore: (matchId: string, side: "sideA" | "sideB", score: number | null) => void;
}

export function RoundSection({ round, playerNameById, onSetScore }: RoundSectionProps) {
  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-neutral-900">Runde {round.index}</h2>
        {round.sittingOutPlayerIds.length > 0 && (
          <span className="text-xs text-neutral-400">
            Pause: {round.sittingOutPlayerIds.map((id) => playerNameById.get(id) ?? "?").join(", ")}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {round.matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            playerNameById={playerNameById}
            onSetScore={(side, score) => onSetScore(match.id, side, score)}
          />
        ))}
      </div>
    </motion.section>
  );
}
