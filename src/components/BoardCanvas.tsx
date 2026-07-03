import React from "react";
import { ColumnLane } from "./ColumnLane";
import { useBoardData } from "../context/BoardContext";
import { Droppable } from "@hello-pangea/dnd";
import { AddColumnInput } from "./AddColumnInput";
import { BoardTitle } from "./BoardTitle";

export const BoardCanvas: React.FC = () => {
  const { state, handleUpdateBoardTitle } = useBoardData();
  const board = state.boards.entities[state.activeBoardId];

  if (!board) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-zinc-900 text-zinc-500">
        <p className="text-lg font-medium">No active board selected</p>
        <p className="text-sm text-zinc-600 mt-1">Select or create a board from the sidebar to get started.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0">
      <BoardTitle boardId={board.id} boardTitle={board.title} handleUpdateBoardTitle={handleUpdateBoardTitle} />
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
