import { AnimatePresence, motion } from "framer-motion";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface TeamsStepProps {
  teams: [string, string][];
  onChange: (teams: [string, string][]) => void;
}

export function TeamsStep({ teams, onChange }: TeamsStepProps) {
  const update = (i: number, slot: 0 | 1, value: string) => {
    const next = teams.map((t) => [...t] as [string, string]);
    next[i][slot] = value;
    onChange(next);
  };

  const remove = (i: number) => {
    onChange(teams.filter((_, idx) => idx !== i));
  };

  const add = () => {
    onChange([...teams, ["", ""]]);
  };

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {teams.map((team, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, height: 0, marginBottom: -12 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: -12 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3"
          >
            <span className="w-6 shrink-0 text-center text-sm font-medium text-neutral-400">{i + 1}</span>
            <div className="flex flex-1 flex-col gap-2">
              <Input
                value={team[0]}
                onChange={(e) => update(i, 0, e.target.value)}
                placeholder="Spieler A"
              />
              <Input
                value={team[1]}
                onChange={(e) => update(i, 1, e.target.value)}
                placeholder="Spieler B"
              />
            </div>
            <button
              onClick={() => remove(i)}
              aria-label="Entfernen"
              className="shrink-0 cursor-pointer rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button variant="secondary" onClick={add} className="mt-1">
        + Team hinzufügen
      </Button>

      <p className="text-xs text-neutral-400">Mindestens 2 Teams nötig.</p>
    </div>
  );
}
