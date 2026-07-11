import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export default function EmptyState({ icon: Icon, title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
        <Icon size={26} className="text-gray-400" />
      </div>
      <div>
        <div className="font-semibold text-gray-700 text-base">{title}</div>
        {description && <div className="text-gray-400 text-sm mt-1">{description}</div>}
      </div>
    </div>
  );
}
