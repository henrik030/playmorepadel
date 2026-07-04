import { AnimatePresence, motion } from "framer-motion";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface PlayersStepProps {
  names: string[];
  onChange: (names: string[]) => void;
}

export function PlayersStep({ names, onChange }: PlayersStepProps) {
  const update = (i: number, value: string) => {
    const next = [...names];
    next[i] = value;
    onChange(next);
  };

  const remove = (i: number) => {
    onChange(names.filter((_, idx) => idx !== i));
  };

  const add = () => {
    onChange([...names, ""]);
  };

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {names.map((name, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, height: 0, marginBottom: -12 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: -12 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2"
          >
            <span className="w-6 shrink-0 text-center text-sm font-medium text-neutral-400">{i + 1}</span>
            <Input
              autoFocus={i === names.findIndex((n) => n === "")}
              value={name}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`Spieler ${i + 1}`}
            />
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
        + Spieler hinzufügen
      </Button>

      <p className="text-xs text-neutral-400">
        Mindestens 4 Spieler nötig.{" "}
        {names.length > 0 && names.length % 4 !== 0 && (
          <span>Bei {names.length} Spielern setzt jede Runde reihum jemand aus.</span>
        )}
      </p>
    </div>
  );
}
