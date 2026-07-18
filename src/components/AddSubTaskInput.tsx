import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { createSubtask } from "../store/thunks/boardThunks";

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
            dispatch(createSubtask({title, taskId: activeTaskId}));
            setTitle("");
          }
        }}
        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none"
      />
    </div>
  );
};
