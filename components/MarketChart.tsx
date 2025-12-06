'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoryPoint } from "@/types";

type MarketChartProps = {
  history: HistoryPoint[];
  chance: number;
};

const MarketChart = ({ history, chance }: MarketChartProps) => {
  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 h-[400px]">
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-4xl font-bold text-[#BEFF1D]">{chance}%</span>
        <span className="text-neutral-400">Вероятность исхода &quot;Да&quot;</span>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={history}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#BEFF1D" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#BEFF1D" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#525252", fontSize: 12 }}
            minTickGap={30}
          />
          <YAxis hide domain={[0, 100]} />
          <CartesianGrid vertical={false} stroke="#262626" strokeDasharray="3 3" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#171717",
              border: "1px solid #333",
              borderRadius: "8px",
            }}
            itemStyle={{ color: "#BEFF1D" }}
            labelStyle={{ color: "#999" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#BEFF1D"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;

