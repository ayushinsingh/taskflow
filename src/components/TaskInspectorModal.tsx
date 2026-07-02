import { useState } from "react";
import type { NormalizedTask, Priority } from "../types/normalized.type";

interface TaskInspectorModalProp {
  task: NormalizedTask
  onUpdateTask: (taskId: string, updatedTask: NormalizedTask) => void;
  onClose: () => void;
}


export const TaskInspectorModal: React.FC<TaskInspectorModalProp> = ({task, onUpdateTask, onClose}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handlePriorityChange = (priority: Priority) => {
    onUpdateTask(task.id, {...task, priority})
  };

  const handleBlur = (key: string, value: string) => {
    if(key === "title" && !value) return;
    onUpdateTask(task.id, {...task, [key]: value});
  };


  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div
        className="absolute inset-0 transition-opacity animate-fade-in"
      />
      <div className="pointer-events-auto relative h-full w-full max-w-lg bg-zinc-950 border-l border-zinc-800/80 p-8 shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)] flex flex-col justify-start text-zinc-100 z-10 animate-slide-in">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
              Task Details
            </span>
          </div>
          <button
            onClick={() => onClose()}
            className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-all focus:outline-none"
          >
            <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">✕</span>
            Close Panel
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleBlur("title", title)}
            className="w-full bg-transparent text-2xl font-semibold border-b border-transparent hover:border-zinc-800 focus:border-blue-500 pb-2 focus:outline-none transition-colors text-zinc-100 tracking-tight"
            placeholder="Untitled Task"
          />
        </div>
        <div className="mb-8">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Priority Level
          </label>
          <div className="flex gap-2">
            {(["low", "medium", "high", "urgent"] as const).map((level) => {
              const isActive = task.priority === level;
              const colorMap = {
                low: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 active:bg-emerald-500/20",
                medium: "border-amber-500/20 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 active:bg-amber-500/20",
                high: "border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 active:bg-rose-500/20",
                urgent: "border-orange-500/20 text-orange-400 bg-orange-500/5 hover:bg-orange-500/10 active:bg-orange-500/20",
              };
              const activeColorMap = {
                low: "border-emerald-500/40 text-emerald-300 bg-emerald-500/20",
                medium: "border-amber-500/40 text-amber-300 bg-amber-500/20",
                high: "border-rose-500/40 text-rose-300 bg-rose-500/20",
                urgent: "border-orange-500/40 text-orange-300 bg-orange-500/20",
              };

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => handlePriorityChange(level)}
                  className={`flex-1 text-center py-2 px-3 text-xs font-medium rounded-lg border tracking-wider capitalize transition-all duration-150 ${
                    isActive 
                      ? `${activeColorMap[level]} shadow-inner font-semibold ring-1 ring-white/5` 
                      : `${colorMap[level]} opacity-50 hover:opacity-100`
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Description & Specs
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur("description", description)}
            placeholder="Add a detailed breakdown, notes, or technical specifications for this item..."
            className="w-full flex-1 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800/50 resize-none leading-relaxed transition-all"
          />
        </div>
      </div>
    </div>
  );
};
