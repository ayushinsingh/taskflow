import { useState } from "react";
import { addTask } from "../store/slices/taskSlice";
import { linkTaskToColumn } from "../store/slices/columnSlice";
import { useAppDispatch } from "../store";
import type { NormalizedTask } from "../types/normalized.type";

export const AddTaskInput: React.FC<{ columnId: string }> = ({ columnId }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  return (
    <div className="mt-auto pt-2 border-t border-zinc-900">
      <input
        id={`new-task-input-${columnId}`}
        type="text"
        placeholder="+ Add new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const newTask: NormalizedTask = {
              id: crypto.randomUUID(),
              title,
              description: "",
              priority: "medium",
              subTaskIds: []
            }
            dispatch(addTask(newTask));
            dispatch(linkTaskToColumn({columnId, taskId: newTask.id}))
            setTitle("");
          }
        }}
        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none"
      />
    </div>
  );
};
