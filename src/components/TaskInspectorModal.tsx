import { useState, useEffect } from "react";
import type { Priority } from "../types/normalized.type";
import { MetricCard } from "./MetricCard";
import { AddSubTaskInput } from "./AddSubTaskInput";
import { useAppDispatch, useAppSelector } from "../store";
import { updateTask, closeTaskInspector } from "../store/slices/taskSlice";
import { toggleSubTask } from "../store/slices/subTaskSlice";
import { X } from "lucide-react";

export const TaskInspectorModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTaskId = useAppSelector((state) => state.tasks.activeTaskId);
  const task = useAppSelector((state) =>
    activeTaskId ? state.tasks.entities[activeTaskId] : undefined,
  );
  const subTasks = useAppSelector((state) => state.subTasks);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [activeTaskId, task?.id]); // Safe optional chain boundary pointer

  if (!activeTaskId || !task) return null;

  const handlePriorityChange = (priority: Priority) => {
    dispatch(updateTask({ taskId: activeTaskId, changes: { priority } }));
  };

  const handleBlur = (key: "title" | "description", value: string) => {
    if (key === "title" && !value.trim()) return;
    dispatch(
      updateTask({ taskId: activeTaskId, changes: { [key]: value.trim() } }),
    );
  };

  const completedCount = task.subTaskIds.reduce(
    (total, current) =>
      subTasks.entities[current]?.isCompleted ? total + 1 : total,
    0,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={() => dispatch(closeTaskInspector())}
    >
      <div
        className="w-[450px] h-full bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col justify-between shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Task Inspector
            </span>
            <button
              onClick={() => dispatch(closeTaskInspector())}
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded-md hover:bg-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleBlur("title", title)}
            className="w-full bg-transparent text-xl font-bold text-zinc-100 border-b border-transparent focus:border-blue-500/50 outline-none pb-1"
          />

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleBlur("description", description)}
              placeholder="Add a detailed description for this task..."
              className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm text-zinc-300 focus:border-blue-500/50 focus:outline-none resize-none"
            />
          </div>

          {/* Priority Toggles */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["low", "medium", "high", "urgent"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePriorityChange(p)}
                  className={`py-1.5 text-xs font-medium rounded capitalize border transition-all ${
                    task.priority === p
                      ? "bg-blue-600/10 border-blue-500 text-blue-400 font-semibold"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Subtasks Stack */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Subtasks
            </label>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {task.subTaskIds.map((subTaskId) => {
                const subTask = subTasks.entities[subTaskId];
                if (!subTask) return null;
                return (
                  <div
                    key={subTaskId}
                    className="group flex items-center gap-3 bg-zinc-900/50 border border-zinc-850/60 px-3 py-2 rounded-md hover:bg-zinc-900 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={subTask.isCompleted}
                      onChange={() => dispatch(toggleSubTask(subTaskId))}
                      className="rounded border-zinc-700 text-blue-600 focus:ring-blue-500/20 bg-zinc-800 h-4 w-4 cursor-pointer"
                    />
                    <span
                      onClick={() => dispatch(toggleSubTask(subTaskId))}
                      className={`text-xs font-medium text-zinc-300 cursor-pointer select-none truncate ${
                        subTask.isCompleted
                          ? "line-through text-zinc-600 decoration-zinc-700"
                          : ""
                      }`}
                    >
                      {subTask.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <AddSubTaskInput taskId={task.id} />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-900">
          <MetricCard
            title="Completed Sub Tasks"
            value={completedCount}
            total={task.subTaskIds.length}
          />
        </div>
      </div>
    </div>
  );
};
