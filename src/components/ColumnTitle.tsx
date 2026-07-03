import { useEffect, useState } from "react";
import { useBoardData } from "../context/BoardContext";
import { Trash2 } from "lucide-react";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

interface ColumnTitleProps {
  columnId: string;
  columnTitle: string;
  dragProps: DraggableProvidedDragHandleProps | null;
}

export const ColumnTitle: React.FC<ColumnTitleProps> = ({
  columnId,
  columnTitle,
  dragProps
}) => {
  const { handleDeleteColumn, handleUpdateColumnTitle } = useBoardData();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    setTitle(columnTitle);
  }, [columnTitle]);

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
          handleUpdateColumnTitle(columnId, title);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsEditing(false);
            handleUpdateColumnTitle(columnId, title);
          }
          if (e.key === "Escape") {
            setTitle(columnTitle);
            setIsEditing(false);
          }
        }}
        className="bg-zinc-800 text-zinc-100 border border-zinc-700 rounded px-2 py-0.5 outline-none focus:border-blue-500 mb-3"
      />
    );
  }

  return (
    <div className="flex items-center justify-between mb-3">
      <h3
        {...dragProps}
        onDoubleClick={() => setIsEditing(true)}
        className="font-semibold text-zinc-300 text-center px-1"
      >
        {columnTitle}
      </h3>
      <button
        className="rounded-md p-2 text-zinc-500 hover:bg-red-100 hover:text-red-600 transition-colors"
        aria-label={`Delete Column: ${columnTitle}`}
        onClick={() => handleDeleteColumn(columnId)}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};
