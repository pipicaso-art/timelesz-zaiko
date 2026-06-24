import type { StockRange } from '@/types';
import { STOCK_RANGE_LABELS, STOCK_RANGE_COLORS } from '@/types';

interface Props {
  range: StockRange;
  className?: string;
}

export function StockBadge({ range, className = '' }: Props) {
  const colorClass = STOCK_RANGE_COLORS[range];
  const label = STOCK_RANGE_LABELS[range];

  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${colorClass} ${className}`}
    >
      {label}
    </span>
  );
}
