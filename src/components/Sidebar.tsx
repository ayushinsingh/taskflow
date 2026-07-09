import React from "react";
import { AddBoardInput } from "./AddBoardInput";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { changeBoard, deleteBoard } from "../store/slices/boardSlice";
import { unlinkBoardFromWorkspace } from "../store/slices/workspaceSlice";

export const Sidebar: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const activeWorkspaceId = useAppSelector(
    (state) => state.workspaces.ids[0],
  ) as string | undefined;
  const activeBoardId = useAppSelector((state) => state.boards.activeBoardId);

  const activeWorkspace = useAppSelector((state) =>
    activeWorkspaceId
      ? state.workspaces.entities[activeWorkspaceId]
      : undefined,
  );
  const boards = useAppSelector((state) => state.boards);
  const columns = useAppSelector((state) => state.columns);
  const tasks = useAppSelector((state) => state.tasks);

  if (!activeWorkspace || !activeWorkspaceId) {
    return <div className="text-zinc-600 text-xs p-3">No workspaces found</div>;
  }

  return (
    <nav className="space-y-1">
      {activeWorkspace.boardIds.map((boardId) => {
        const board = boards.entities[boardId];
        if (!board) return null;

        return (
          <div
            key={boardId}
            className="group flex items-center justify-between rounded-md text-sm font-medium hover:bg-zinc-900/50 transition-colors"
          >
            <button
              onClick={() => dispatch(changeBoard(boardId))}
              className={`flex-1 text-left px-3 py-2 rounded-md text-sm font-medium transition-colors truncate ${
                boardId === activeBoardId
                  ? "bg-zinc-800 text-zinc-50 border-l-4 border-blue-500 font-semibold"
                  : "text-zinc-400 border-l-4 border-transparent hover:text-zinc-200"
              }`}
            >
              📊 {board.title}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  unlinkBoardFromWorkspace({
                    workspaceId: activeWorkspaceId,
                    boardId,
                  }),
                );
                dispatch(deleteBoard(boardId));
              }}
              className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-400 transition-all shrink-0"
              aria-label="Delete Board"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}
      <AddBoardInput />
    </nav>
  );
});
