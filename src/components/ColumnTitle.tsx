import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { useAppDispatch, useAppSelector } from "../store";
import { updateColumnTitle, deleteColumn } from "../store/slices/columnSlice";
import { unlinkColumnFromBoard } from "../store/slices/boardSlice";
import { removeTasks } from "../store/slices/taskSlice";
import { removeSubTasks } from "../store/slices/subTaskSlice";

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
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const activeBoardId = useAppSelector((state) => state.boards.activeBoardId);
  const taskIds = useAppSelector((state) => state.columns.entities[columnId].taskIds);
  const tasks = useAppSelector((state) => state.tasks)
  const subTaskIds = taskIds.flatMap((taskId) => tasks.entities[taskId].subTaskIds);

  const handleColumnDelete = () => {
    dispatch(unlinkColumnFromBoard({boardId: activeBoardId, columnId}));
    dispatch(removeTasks(taskIds));
    dispatch(removeSubTasks(subTaskIds));
    dispatch(deleteColumn(columnId));
  }

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
          dispatch(updateColumnTitle({columnId, title}));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsEditing(false);
            dispatch(updateColumnTitle({columnId, title}));
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
        className="opacity-0 group-hover:opacity-100 p-2 mr-1 text-zinc-500 hover:text-red-400 transition-all"
        aria-label={`Delete Column: ${columnTitle}`}
        onClick={() => handleColumnDelete()}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};
