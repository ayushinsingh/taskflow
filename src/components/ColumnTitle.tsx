import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { useAppDispatch, useAppSelector } from "../store";
import { updateColumnTitle } from "../store/slices/columnSlice";
import { deleteColumn } from "../store/thunks/boardThunks";

interface ColumnTitleProps {
  columnId: string;
  columnTitle: string;
  dragProps: DraggableProvidedDragHandleProps | null;
}

export const ColumnTitle: React.FC<ColumnTitleProps> = ({
  columnId,
  columnTitle,
  dragProps,
}) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");

  const activeBoardId = useAppSelector(
    (state) => state.boards.activeBoardId,
  ) as string;
  const column = useAppSelector((state) => state.columns.entities[columnId]);

  useEffect(() => {
    setTitle(columnTitle);
  }, [columnTitle]);

  if (!column) return null;

  const handleColumnDelete = () => {
    dispatch(deleteColumn({ boardId: activeBoardId, columnId }));
  };

  if (isEditing) {
    return (
      <input
        id="column-title-input"
        type="text"
        value={title}
        autoFocus
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => {
          setIsEditing(false);
          if (title.trim() && title.trim() !== columnTitle) {
            dispatch(updateColumnTitle({ columnId, title: title.trim() }));
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") setIsEditing(false);
          if (e.key === "Escape") {
            setTitle(columnTitle);
            setIsEditing(false);
          }
        }}
        className="bg-zinc-800 text-zinc-100 border border-zinc-700 rounded px-2 py-0.5 text-sm font-medium outline-none focus:border-blue-500 mb-3 w-full"
      />
    );
  }

  return (
    <div className="flex items-center justify-between mb-3 group/title">
      <h3
        {...dragProps}
        onDoubleClick={() => setIsEditing(true)}
        className="font-semibold text-zinc-300 text-sm px-1 cursor-grab active:cursor-grabbing truncate flex-1"
      >
        {columnTitle}
      </h3>
      <button
        onClick={handleColumnDelete}
        className="opacity-0 group-hover/title:opacity-100 p-1.5 rounded-md text-zinc-500 hover:bg-zinc-900 hover:text-red-400 transition-all shrink-0"
        aria-label="Delete column"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
