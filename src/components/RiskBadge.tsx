import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface RiskBadgeProps {
  score: number;
  showLabel?: boolean;
  decimals?: number;
}

export function getRiskLevel(score: number) {
  if (score <= 33) return { label: 'Low Risk', color: 'bg-green-500' };
  if (score <= 66) return { label: 'Medium Risk', color: 'bg-yellow-500' };
  return { label: 'High Risk', color: 'bg-destructive' };
}

export function RiskBadge({
  score,
  showLabel = true,
  decimals = 0,
}: RiskBadgeProps) {
  const { label, color } = getRiskLevel(score);
  return (
    <Badge className={cn('text-white border-0', color)}>
      {showLabel ? label : `${score.toFixed(decimals)}`}
    </Badge>
  );
}
