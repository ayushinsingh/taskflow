import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { useBoardData } from "../context/BoardContext";
import { Trash2 } from "lucide-react";

interface TaskCardProp {
  taskId: string;
  columnId: string;
  index: number;
}

export const TaskCard: React.FC<TaskCardProp> = ({
  taskId,
  columnId,
  index,
}) => {
  const { state, openTaskInspector, handleDeleteTask } = useBoardData();
  const task = state.tasks.entities[taskId];
  const totalCompletedTasks = task.subTaskIds.reduce(
    (total, current) =>
      state.subTasks.entities[current].isCompleted ? total + 1 : total,
    0,
  );
  if (!task) return null;
  const activeColorMap = {
    low: "border-emerald-500/40 text-emerald-300 bg-emerald-500/20",
    medium: "border-amber-500/40 text-amber-300 bg-amber-500/20",
    high: "border-rose-500/40 text-rose-300 bg-rose-500/20",
    urgent: "border-orange-500/40 text-orange-300 bg-orange-500/20",
  };
  return (
    <Draggable draggableId={taskId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-zinc-900 p-4 rounded-md border border-zinc-800 shadow-sm transition-shadow ${
            snapshot.isDragging
              ? "shadow-xl border-blue-500/50 bg-zinc-850"
              : ""
          }`}
          onClick={() => openTaskInspector(taskId)}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-zinc-200 mb-1">{task.title}</h4>
            <button
              className="rounded-md p-2 text-zinc-500 hover:bg-red-100 hover:text-red-600 transition-colors"
              aria-label={`Delete Column: ${task.title}`}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(taskId, columnId);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-400 line-clamp-2">
            {task.description}
          </p>
          <div className="mt-2.5 flex items-center justify-between text-xs text-zinc-500 font-medium tabular-nums">
            <span
              className={`mt-3 inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${activeColorMap[task.priority]}`}
            >
              {task.priority}
            </span>
            <span className="text-zinc-400">
              {totalCompletedTasks} <span className="text-zinc-600">/</span>{" "}
              {task.subTaskIds.length}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};
