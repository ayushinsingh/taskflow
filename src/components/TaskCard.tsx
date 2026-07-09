import React from "react";
import { Trash2 } from "lucide-react";
import { deleteTask } from "../store/slices/taskSlice";
import { useAppDispatch, useAppSelector } from "../store";
import { removeSubTasks } from "../store/slices/subTaskSlice";
import { unlinkTaskFromColumn } from "../store/slices/columnSlice";

interface TaskCardProp {
  taskId: string;
  columnId: string;
}

export const TaskCard: React.FC<TaskCardProp> = ({ taskId, columnId }) => {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => state.tasks.entities[taskId]);
  const subTasks = useAppSelector((state) => state.subTasks);

  if (!task) return null;

  const totalCompletedTasks = task.subTaskIds.reduce(
    (total, current) =>
      subTasks.entities[current]?.isCompleted ? total + 1 : total,
    0,
  );

  const activeColorMap = {
    low: "border-emerald-500/40 text-emerald-300 bg-emerald-500/20",
    medium: "border-amber-500/40 text-amber-300 bg-amber-500/20",
    high: "border-rose-500/40 text-rose-300 bg-rose-500/20",
    urgent: "border-red-500/40 text-red-300 bg-red-500/20",
  };

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-medium text-zinc-200 truncate pr-2">
          {task.title}
        </h4>
        <button
          className="opacity-0 group-hover/task:opacity-100 p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-all shrink-0"
          aria-label="Delete Task"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(unlinkTaskFromColumn({ columnId, taskId }));
            dispatch(deleteTask(taskId));
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {task.description && (
        <p className="text-xs text-zinc-400 line-clamp-2 mb-2">
          {task.description}
        </p>
      )}
      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 font-medium font-mono">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${activeColorMap[task.priority] || activeColorMap.medium}`}
        >
          {task.priority}
        </span>
        {task.subTaskIds.length > 0 && (
          <span className="text-zinc-400">
            {totalCompletedTasks} <span className="text-zinc-600">/</span>{" "}
            {task.subTaskIds.length}
          </span>
        )}
      </div>
    </>
  );
};
