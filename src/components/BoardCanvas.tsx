import React, { useState } from "react";
import { ColumnLane } from "./ColumnLane";
import { Droppable } from "@hello-pangea/dnd";
import { AddColumnInput } from "./AddColumnInput";
import { BoardTitle } from "./BoardTitle";
import { BarChart3 } from "lucide-react";
import { useAppSelector } from "../store";
import { Metrics } from "./Metrics";

export const BoardCanvas: React.FC = () => {
  const activeBoardId = useAppSelector((state) => state.boards.activeBoardId);
  const board = useAppSelector((state) => state.boards.entities[activeBoardId]);
  const [showMetrics, setShowMetrics] = useState<boolean>(false);

  if (!board) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-zinc-900 text-zinc-500">
        <p className="text-lg font-medium">No active board selected</p>
        <p className="text-sm text-zinc-600 mt-1">
          Select or create a board from the sidebar to get started.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/50 pr-4">
        <div className="flex-1">
          <BoardTitle
            boardId={board.id}
            boardTitle={board.title}
          />
        </div>
        <button
          onClick={() => setShowMetrics(!showMetrics)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors"
        >
          <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
          {showMetrics ? "Hide Analytics" : "Show Analytics"}
        </button>
      </div>
      {showMetrics && <Metrics boardId={activeBoardId} />}
      <Droppable droppableId="column" direction="horizontal" type="COLUMN">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 p-6 overflow-x-auto flex items-start gap-4"
          >
            {board.columnIds.map((columnId, index) => (
              <ColumnLane
                key={columnId}
                index={index}
                columnId={columnId}
              />
            ))}
            {provided.placeholder}
            <AddColumnInput />
          </div>
        )}
      </Droppable>
    </main>
  );
};
