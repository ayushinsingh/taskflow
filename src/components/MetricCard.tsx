import React from "react";

interface MetricCardProps {
  title: string;
  value: number;
  total: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, total }) => {
  // Prevent division by zero errors if there are no subtasks yet
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/20 p-5 mt-4 text-zinc-400 shadow-sm backdrop-blur-sm">
      {/* Label and Percentage Header Row */}
      <div className="mb-2.5 flex justify-between items-baseline">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          {title}
        </h3>
        <span className="text-sm font-semibold tabular-nums text-blue-400">
          {percent}%
        </span>
      </div>

      {/* Pure Tailwind Custom Progress Track */}
      <div className="w-full h-2 bg-zinc-800/60 rounded-full overflow-hidden border border-zinc-800/30">
        <div
          className="h-full bg-linear-to-r from-blue-600 to-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Fractional Progress Counter */}
      <div className="mt-2.5 flex items-center justify-between text-xs text-zinc-500 font-medium tabular-nums">
        <span>Subtask Completion</span>
        <span className="text-zinc-400">
          {value} <span className="text-zinc-600">/</span> {total}
        </span>
      </div>
    </div>
  );
};