"use client";

import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import type { StatusDistributionPoint } from "@/types/admin";

interface Props {
  data: StatusDistributionPoint[];
  title?: string;
}

export default function StatusDonut({ data, title }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data available yet
      </div>
    );
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="45%"
            innerRadius={55} outerRadius={80}
            paddingAngle={3} dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, name: any) => [value, name] as [any, any]}
            contentStyle={{
              borderRadius: "12px", border: "1px solid #E5E7EB",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>

      {/* Centre total label */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ top: "-14px" }}
      >
        <span className="font-heading font-bold text-2xl text-gray-900">{total}</span>
        <span className="text-xs text-gray-400 mt-0.5">{title ?? "Total"}</span>
      </div>
    </div>
  );
}
