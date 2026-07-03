import React, { useEffect, useState } from "react";

interface BoardTitleProps {
  boardId: string;
  boardTitle: string;
  handleUpdateBoardTitle: (boardId: string, boardTitle: string) => void;
}

export const BoardTitle: React.FC<BoardTitleProps> = ({
  boardId,
  boardTitle,
  handleUpdateBoardTitle,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    setTitle(boardTitle);
  }, [boardTitle]);

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 flex items-center px-4">
      {isEditing ? (
        <input
          id="board-title-input"
          type="text"
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
            handleUpdateBoardTitle(boardId, title);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIsEditing(false);
              handleUpdateBoardTitle(boardId, title);
            }
            if (e.key === "Escape") {
              setTitle(boardTitle);
              setIsEditing(false);
            }
          }}
          className="bg-zinc-800 text-zinc-100 border border-zinc-700 rounded px-2 py-0.5 text-xl font-semibold outline-none focus:border-blue-500"
        />
      ) : (
        <h1 onDoubleClick={() => setIsEditing(true)} className="text-xl font-semibold">
          {boardTitle || "Select a board"}
        </h1>
      )}
    </header>
  );
};
