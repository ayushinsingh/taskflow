import { useState } from "react";
import { useBoardData } from "../context/BoardContext";

export const AddColumnInput: React.FC = () => {
  const { handleCreateColumn } = useBoardData();
  const [title, setTitle] = useState("");
  return (
    <div className="w-80 shrink-0 pt-2 border-t border-zinc-900">
      <input
        id="new-column-input"
        type="text"
        placeholder="+ Add new column..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCreateColumn(title);
            setTitle("");
          }
        }}
        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none"
      />
    </div>
  );
};
