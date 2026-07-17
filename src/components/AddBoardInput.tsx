import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { createBoard } from "../store/thunks/boardThunks";
export const AddBoardInput: React.FC = () => {
  const workspaceId = useAppSelector((state) => state.workspaces.ids[0]);
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  return (
    <div className="mt-auto pt-2 border-t border-zinc-900">
      <input
        id="new-board-input"
        type="text"
        placeholder="+ Add new board..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {

            dispatch(createBoard({workspaceId, title}))
            setTitle("");
          }
        }}
        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none"
      />
    </div>
  );
};
