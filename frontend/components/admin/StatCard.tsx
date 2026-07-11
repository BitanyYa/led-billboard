"use client";

import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: { value: number; label: string };
}

export default function StatCard({ title, value, subtitle, icon: Icon, color = "#0057D9", trend }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color + "15" }}
        >
          <Icon size={22} style={{ color }} />
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trend.value >= 0
                ? "text-emerald-700 bg-emerald-50"
                : "text-red-600 bg-red-50"
            }`}
          >
            {trend.value >= 0 ? "+" : ""}{trend.value} {trend.label}
          </span>
        )}
      </div>
      <div className="font-heading font-bold text-3xl text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-700">{title}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
    </div>
  );
}
