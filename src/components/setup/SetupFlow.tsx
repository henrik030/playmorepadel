import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GameFormat } from "../../types/event";
import type { CreateEventInput } from "../../hooks/useEventStore";
import { generateAmericanoRounds, generateTeamAmericanoRounds } from "../../lib/roundGenerator";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { StepHeader } from "./StepHeader";
import { FormatStep } from "./FormatStep";
import { PlayersStep } from "./PlayersStep";
import { TeamsStep } from "./TeamsStep";
import { CourtsStep } from "./CourtsStep";
import { ReviewStep } from "./ReviewStep";

interface SetupFlowProps {
  onComplete: (input: CreateEventInput) => void;
}

const TOTAL_STEPS = 4;

export function SetupFlow({ onComplete }: SetupFlowProps) {
  const [step, setStep] = useState(0);
  const [format, setFormat] = useState<GameFormat | null>(null);
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", "", ""]);
  const [teamPairs, setTeamPairs] = useState<[string, string][]>([
    ["", ""],
    ["", ""],
  ]);
  const [courtCount, setCourtCount] = useState(1);
  const [direction, setDirection] = useState(1);

  const validNames = playerNames.map((n) => n.trim()).filter(Boolean);
  const validTeamPairs = teamPairs.filter(([a, b]) => a.trim() && b.trim()) as [string, string][];

  const participantCount = format === "americano" ? validNames.length : validTeamPairs.length;
  const maxRecommendedCourts = format === "americano" ? Math.max(1, Math.floor(validNames.length / 4)) : Math.max(1, Math.floor(validTeamPairs.length / 2));

  const roundCount = useMemo(() => {
    if (!format) return 0;
    if (format === "americano") {
      if (validNames.length < 4) return 0;
      const players = validNames.map((name, i) => ({ id: String(i), name }));
      return generateAmericanoRounds(players, courtCount).length;
    }
    if (validTeamPairs.length < 2) return 0;
    const teams = validTeamPairs.map((pair, i) => ({ id: String(i), playerIds: [`${i}a`, `${i}b`] as [string, string] }));
    return generateTeamAmericanoRounds(teams, courtCount).length;
  }, [format, validNames, validTeamPairs, courtCount]);

  const canProceed = (() => {
    if (step === 0) return format !== null;
    if (step === 1) return format === "americano" ? validNames.length >= 4 : validTeamPairs.length >= 2;
    if (step === 2) return courtCount >= 1;
    return true;
  })();

  const goNext = () => {
    if (step === TOTAL_STEPS - 1) {
      if (format === "americano") {
        onComplete({ format: "americano", playerNames: validNames, courtCount });
      } else if (format === "team_americano") {
        onComplete({ format: "team_americano", teamPlayerNamePairs: validTeamPairs, courtCount });
      }
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const titles = ["Spielformat wählen", format === "americano" ? "Spieler hinzufügen" : "Teams hinzufügen", "Courts angeben", "Bereit zum Start"];

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-8">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl">🎾</span>
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight text-neutral-900">PlayMorePadel</span>
          <span className="text-xs leading-tight text-neutral-400">Padel Games App</span>
        </div>
      </div>

      <Card className="mt-4 flex-1">
        <StepHeader step={step} totalSteps={TOTAL_STEPS} title={titles[step]} />

        <div className="relative -mx-2 overflow-hidden px-2">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && <FormatStep value={format} onChange={setFormat} />}
              {step === 1 && format === "americano" && <PlayersStep names={playerNames} onChange={setPlayerNames} />}
              {step === 1 && format === "team_americano" && <TeamsStep teams={teamPairs} onChange={setTeamPairs} />}
              {step === 2 && <CourtsStep value={courtCount} onChange={setCourtCount} maxRecommended={maxRecommendedCourts} />}
              {step === 3 && format && (
                <ReviewStep format={format} participantCount={participantCount} courtCount={courtCount} roundCount={roundCount} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>

      <div className="mt-4 flex gap-3">
        {step > 0 && (
          <Button variant="secondary" onClick={goBack} className="flex-1">
            Zurück
          </Button>
        )}
        <Button onClick={goNext} disabled={!canProceed} className="flex-1">
          {step === TOTAL_STEPS - 1 ? "Spiel starten" : "Weiter"}
        </Button>
      </div>
    </div>
  );
}
