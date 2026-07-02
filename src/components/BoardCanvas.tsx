import React from "react";
import { ColumnLane } from "./ColumnLane";
import { useBoardData } from "../context/BoardContext";
import { Droppable } from "@hello-pangea/dnd";

export const BoardCanvas: React.FC = () => {
  const { state, handleDeleteColumn } = useBoardData();
  const board = state.boards.entities[state.activeBoardId];
  return (
    <main className="flex-1 flex flex-col min-w-0">
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 flex items-center px-4">
        <h1 className="text-xl font-semibold">
          {board.title || "Select a board"}
        </h1>
      </header>
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
                columnTitle={state.columns.entities[columnId].title}
                taskIds={state.columns.entities[columnId].taskIds}
                handleDeleteColumn={handleDeleteColumn}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </main>
  );
};
