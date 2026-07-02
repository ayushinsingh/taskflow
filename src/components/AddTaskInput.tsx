import { useState } from "react";
import { useBoardData } from "../context/BoardContext";

export const AddTaskInput: React.FC<{ columnId: string }> = ({ columnId }) => {
  const { handleAddTask } = useBoardData();
  const [title, setTitle] = useState('');
  return (
    <div className="mt-auto pt-2 border-t border-zinc-900">
      <input
        type="text"
        placeholder="+ Add new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddTask(columnId, title);
            setTitle("");
          }
        }}
        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none"
      />
    </div>
  );
};
