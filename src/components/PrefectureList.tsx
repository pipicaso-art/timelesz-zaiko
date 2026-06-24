import Link from 'next/link';
import { REGIONS, PREFECTURES_BY_REGION } from '@/data/prefectures';

export function PrefectureList() {
  return (
    <div className="space-y-3">
      {REGIONS.map((region) => (
        <div key={region}>
          <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1.5">
            {region}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {PREFECTURES_BY_REGION[region].map((pref) => (
              <Link
                key={pref.code}
                href={`/stock/${pref.code}`}
                className="text-sm text-gray-700 hover:text-emerald-600 hover:underline transition-colors"
              >
                {pref.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
