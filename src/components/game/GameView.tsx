import { useMemo, useState } from "react";
import clsx from "clsx";
import type { GameEvent } from "../../types/event";
import { computePlayerStandings, computeTeamStandings } from "../../lib/standings";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { RoundSection } from "./RoundSection";
import { StandingsList } from "./StandingsList";

interface GameViewProps {
  event: GameEvent;
  onSetScore: (roundId: string, matchId: string, side: "sideA" | "sideB", score: number | null) => void;
  onFinish: () => void;
  onReset: () => void;
}

export function GameView({ event, onSetScore, onFinish, onReset }: GameViewProps) {
  const [tab, setTab] = useState<"rounds" | "standings">(event.status === "finished" ? "standings" : "rounds");
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const playerNameById = useMemo(() => new Map(event.players.map((p) => [p.id, p.name])), [event.players]);

  const standingsRows = useMemo(() => {
    if (event.format === "americano") {
      return computePlayerStandings(event).map((s) => ({
        id: s.playerId,
        label: s.name,
        points: s.points,
        matchesPlayed: s.matchesPlayed,
      }));
    }
    return computeTeamStandings(event).map((s) => ({
      id: s.teamId,
      label: s.playerNames.join(" & "),
      points: s.points,
      matchesPlayed: s.matchesPlayed,
    }));
  }, [event]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎾</span>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-neutral-900">PlayMorePadel</span>
            <span className="text-xs leading-tight text-neutral-400">Padel Games App</span>
          </div>
        </div>
        {event.status === "finished" ? (
          <Button variant="secondary" size="sm" onClick={() => setConfirmReset(true)}>
            Neues Spiel
          </Button>
        ) : (
          <Button variant="danger" size="sm" onClick={() => setConfirmFinish(true)}>
            Beenden
          </Button>
        )}
      </div>

      {event.status === "finished" && (
        <div className="mb-4 rounded-xl bg-green-50 px-4 py-2.5 text-center text-sm font-medium text-green-700">
          Spiel beendet — finale Rangliste
        </div>
      )}

      <div className="mb-4 flex gap-1 rounded-xl bg-neutral-100 p-1">
        <button
          onClick={() => setTab("rounds")}
          className={clsx(
            "flex-1 cursor-pointer rounded-lg py-2 text-sm font-medium transition-colors",
            tab === "rounds" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500",
          )}
        >
          Runden
        </button>
        <button
          onClick={() => setTab("standings")}
          className={clsx(
            "flex-1 cursor-pointer rounded-lg py-2 text-sm font-medium transition-colors",
            tab === "standings" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500",
          )}
        >
          Rangliste
        </button>
      </div>

      {tab === "rounds" ? (
        <div className="flex flex-col gap-6">
          {event.rounds.map((round) => (
            <RoundSection
              key={round.id}
              round={round}
              playerNameById={playerNameById}
              onSetScore={(matchId, side, score) => onSetScore(round.id, matchId, side, score)}
            />
          ))}
        </div>
      ) : (
        <StandingsList rows={standingsRows} />
      )}

      <ConfirmDialog
        open={confirmFinish}
        title="Spiel beenden?"
        description="Die finale Rangliste wird angezeigt. Eingetragene Ergebnisse bleiben erhalten."
        confirmLabel="Beenden"
        onConfirm={() => {
          onFinish();
          setTab("standings");
          setConfirmFinish(false);
        }}
        onCancel={() => setConfirmFinish(false)}
      />

      <ConfirmDialog
        open={confirmReset}
        title="Neues Spiel starten?"
        description="Das aktuelle Spiel wird verworfen und du landest wieder im Setup."
        confirmLabel="Neues Spiel"
        onConfirm={() => {
          onReset();
          setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
