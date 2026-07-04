import type { GameFormat } from "../../types/event";

interface ReviewStepProps {
  format: GameFormat;
  participantCount: number;
  courtCount: number;
  roundCount: number;
}

export function ReviewStep({ format, participantCount, courtCount, roundCount }: ReviewStepProps) {
  const rows = [
    { label: "Format", value: format === "americano" ? "Americano" : "Team Americano" },
    { label: format === "americano" ? "Spieler" : "Teams", value: String(participantCount) },
    { label: "Courts", value: String(courtCount) },
    { label: "Runden", value: String(roundCount) },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-neutral-200">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-4 py-3 ${i % 2 === 0 ? "bg-neutral-50" : "bg-white"}`}
          >
            <span className="text-sm text-neutral-500">{row.label}</span>
            <span className="text-sm font-semibold text-neutral-900">{row.value}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-neutral-400">
        Alle Runden werden jetzt direkt generiert. Du kannst das Spiel jederzeit manuell beenden, um die finale
        Rangliste zu sehen.
      </p>
    </div>
  );
}
