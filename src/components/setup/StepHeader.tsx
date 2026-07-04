interface StepHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
}

export function StepHeader({ step, totalSteps, title, subtitle }: StepHeaderProps) {
  return (
    <div className="mb-6">
      <div className="mb-4 flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= step ? "bg-green-500" : "bg-neutral-200"
            }`}
          />
        ))}
      </div>
      <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
    </div>
  );
}
