interface ScoreInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  highlight: boolean;
}

export function ScoreInput({ value, onChange, highlight }: ScoreInputProps) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      placeholder="–"
      className={`h-11 w-14 rounded-xl border text-center text-base font-semibold outline-none transition-all ${
        highlight
          ? "border-green-500 bg-green-50 text-green-700"
          : "border-neutral-200 bg-neutral-50 text-neutral-700 focus:border-accent-500 focus:bg-white"
      }`}
    />
  );
}
