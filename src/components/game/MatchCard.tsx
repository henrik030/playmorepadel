import { motion } from "framer-motion";
import type { Match } from "../../types/event";
import { ScoreInput } from "./ScoreInput";

interface MatchCardProps {
  match: Match;
  playerNameById: Map<string, string>;
  onSetScore: (side: "sideA" | "sideB", score: number | null) => void;
}

function sideNames(playerIds: string[], playerNameById: Map<string, string>) {
  return playerIds.map((id) => playerNameById.get(id) ?? "?");
}

export function MatchCard({ match, playerNameById, onSetScore }: MatchCardProps) {
  const { sideA, sideB } = match;
  const bothScored = sideA.score !== null && sideB.score !== null;
  const aWins = bothScored && sideA.score! > sideB.score!;
  const bWins = bothScored && sideB.score! > sideA.score!;

  return (
    <motion.div layout className="relative rounded-xl border border-neutral-200 bg-white p-4 pt-5">
      <span className="absolute -top-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-500">
        {match.court}
      </span>

      <div className="flex items-center gap-2">
        <div
          className={`flex-1 text-left text-sm font-medium leading-snug ${
            aWins ? "text-green-700" : "text-neutral-700"
          }`}
        >
          {sideNames(sideA.playerIds, playerNameById).map((name, i) => (
            <div key={i}>{name}</div>
          ))}
        </div>

        <ScoreInput value={sideA.score} onChange={(v) => onSetScore("sideA", v)} highlight={aWins} />
        <span className="shrink-0 text-xs font-medium text-neutral-300">:</span>
        <ScoreInput value={sideB.score} onChange={(v) => onSetScore("sideB", v)} highlight={bWins} />

        <div
          className={`flex-1 text-right text-sm font-medium leading-snug ${
            bWins ? "text-green-700" : "text-neutral-700"
          }`}
        >
          {sideNames(sideB.playerIds, playerNameById).map((name, i) => (
            <div key={i}>{name}</div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
