import React from "react";
import type { EntityState, NormalizedBoard } from "../types/normalized.type";
import { AddBoardInput } from "./AddBoardInput";
import { Trash2 } from "lucide-react";

interface SidebarProps {
  boards: EntityState<NormalizedBoard>;
  activeBoardId: string;
  handleBoardChange: (boardId: string) => void;
  handleDeleteBoard: (boardId: string) => void;
}
export const Sidebar: React.FC<SidebarProps> = React.memo(
  ({ boards, activeBoardId, handleBoardChange, handleDeleteBoard }) => {
    return (
      <nav className="space-y-1">
        {boards.ids.map((boardId) => (
          <div
            key={boardId}
            className="group flex items-center justify-between rounded-md text-sm font-medium transition-colors"
          >
            <button
              key={boardId}
              onClick={() => handleBoardChange(boardId)}
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
                handleDeleteBoard(boardId);
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
