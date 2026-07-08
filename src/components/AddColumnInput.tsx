import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { addColumn } from "../store/slices/columnSlice";
import { linkColumnToBoard } from "../store/slices/boardSlice";
import type { NormalizedColumn } from "../types/normalized.type";

export const AddColumnInput: React.FC = () => {
  const activeBoardId = useAppSelector((state) => state.boards.activeBoardId) as string;
  const dispatch = useAppDispatch();
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
            const newColumn: NormalizedColumn = {
              id: crypto.randomUUID(),
              title: title,
              taskIds: []
            }
            dispatch(addColumn(newColumn));
            dispatch(linkColumnToBoard({boardId: activeBoardId, columnId: newColumn.id}));
            setTitle("");
          }
        }}
        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none"
      />
    </div>
  );
};
