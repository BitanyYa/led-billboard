// Reusable skeleton primitives for loading states

function pulse(cls: string) {
  return `animate-pulse bg-gray-200 rounded ${cls}`;
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={pulse("w-11 h-11 rounded-xl")} />
      </div>
      <div className={pulse("h-8 w-16 mb-2")} />
      <div className={pulse("h-4 w-24")} />
    </div>
  );
}

export function SkeletonRow({ cols = 3 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0">
      <div className="flex-1 space-y-2">
        <div className={pulse("h-4 w-32")} />
        <div className={pulse("h-3 w-48")} />
      </div>
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <div key={i} className={pulse("h-5 w-14 rounded-full")} />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="flex items-end gap-2 h-48 pt-4">
      {[55, 75, 40, 88, 65, 50, 80, 60, 70, 45, 90, 55].map((h, i) => (
        <div
          key={i}
          className={pulse("flex-1 rounded-t")}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}
