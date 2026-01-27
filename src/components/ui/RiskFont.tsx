import { cn } from '@/lib/utils';


interface RiskFontProps {
  score: number;
}

export function getRiskLevel(score: number) {
  if (score <= 33) return { color: 'text-green-500' };
  if (score <= 66) return { color: 'text-yellow-500' };
  return { color: 'text-destructive' }; // or 'text-red-500' if you prefer
}

export function RiskFont({
  score,
}: RiskFontProps) {
  const { color } = getRiskLevel(score);

  return (
    <div className={cn(color)}>
      {score}
    </div>
  );
}
