"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { MonthlyChartPoint } from "@/types/admin";

interface Props { data: MonthlyChartPoint[]; }

export default function MonthlyChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data available yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradQ" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#0057D9" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#0057D9" stopOpacity={0}    />
          </linearGradient>
          <linearGradient id="gradC" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false} tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "12px", border: "1px solid #E5E7EB",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: 12,
          }}
          cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
        <Area
          type="monotone" dataKey="quotes" name="Quote Requests"
          stroke="#0057D9" strokeWidth={2} fill="url(#gradQ)"
          dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Area
          type="monotone" dataKey="contacts" name="Contact Messages"
          stroke="#7C3AED" strokeWidth={2} fill="url(#gradC)"
          dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
