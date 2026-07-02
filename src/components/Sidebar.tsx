import React from "react";
import type { EntityState, NormalizedBoard } from "../types/normalized.type";

interface SidebarProps {
  boards: EntityState<NormalizedBoard>;
  activeBoardId: string;
  handleBoardChange: (boardId: string) => void;
}
export const Sidebar: React.FC<SidebarProps> = React.memo(
  ({ boards, activeBoardId, handleBoardChange }) => {
    return (
      <nav className="space-y-1">
        {boards.ids.map((boardId) => (
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
        ))}
      </nav>
    );
  },
);
