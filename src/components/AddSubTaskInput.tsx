import { useState } from "react";
import { addSubTask } from "../store/slices/subTaskSlice";
import { useAppDispatch, useAppSelector } from "../store";
import type { NormalizedSubTask } from "../types/normalized.type";
import { linkSubTaskToTask } from "../store/slices/taskSlice";

export const AddSubTaskInput: React.FC = ({ }) => {
  const activeTaskId = useAppSelector((state) => state.tasks.activeTaskId);
  if(!activeTaskId) return
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  return (
    <div className="mt-auto pt-2 border-t border-zinc-900">
      <input
        id={`new-task-input-${activeTaskId}`}
        type="text"
        placeholder="+ Add new sub task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const newSubTask: NormalizedSubTask = {
              id: crypto.randomUUID(),
              title,
              isCompleted: false
            };

            dispatch(addSubTask(newSubTask));
            dispatch(linkSubTaskToTask({taskId: activeTaskId, subTaskId: newSubTask.id}));
            setTitle("");
          }
        }}
        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none"
      />
    </div>
  );
};
