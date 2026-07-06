import React from "react";
import { AddBoardInput } from "./AddBoardInput";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { changeBoard, deleteBoard } from "../store/slices/boardSlice";
import { deleteColumns } from "../store/slices/columnSlice";
import { removeTasks } from "../store/slices/taskSlice";
import { unlinkBoardFromWorkspace } from "../store/slices/workspaceSlice";

export const Sidebar: React.FC = React.memo(
  () => {
    const activeWorkspaceId = useAppSelector((state) => state.workspaces.ids[0]);
    const dispatch = useAppDispatch();
    const activeBoardId = useAppSelector((state) => state.boards.activeBoardId);
    const activeWorkspace = useAppSelector((state) => state.workspaces.entities[activeWorkspaceId]);
    const boards = useAppSelector((state) => state.boards);
    const columns = useAppSelector((state) => state.columns);
    const tasks = useAppSelector((state) => state.tasks);
    return (
      <nav className="space-y-1">
        {activeWorkspace.boardIds.map((boardId) => (
          <div
            key={boardId}
            className="group flex items-center justify-between rounded-md text-sm font-medium transition-colors"
          >
            <button
              key={boardId}
              onClick={() => dispatch(changeBoard(boardId))}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                boardId === activeBoardId
                  ? "bg-zinc-800 text-zinc-50 border-l-4 border-blue-500"
                  : "text-zinc-300 border-l-4 border-transparent hover:bg-zinc-800 hover:text-zinc-100"
              }`}
            >
              📊 {boards.entities[boardId].title}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const columnIds = boards.entities[boardId].columnIds;
                const taskIds = columnIds.flatMap((columnId) => columns.entities[columnId].taskIds);
                const subTaskIds = taskIds.flatMap((taskId) => tasks.entities[taskId].subTaskIds);
                dispatch(deleteBoard(boardId));
                dispatch(unlinkBoardFromWorkspace({workspaceId:activeWorkspaceId, boardId}))
                dispatch(deleteColumns(boards.entities[boardId].columnIds));
                dispatch(removeTasks(taskIds))
                dispatch(removeTasks(subTaskIds));
              }}
              className="opacity-0 group-hover:opacity-100 p-2 mr-1 text-zinc-500 hover:text-red-400 transition-all"
              aria-label="Delete Board"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <AddBoardInput />
      </nav>
    );
  },
);
