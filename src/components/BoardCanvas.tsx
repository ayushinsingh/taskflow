import React, { useState } from "react";
import { ColumnLane } from "./ColumnLane";
import { useBoardData } from "../context/BoardContext";
import { Droppable } from "@hello-pangea/dnd";
import { AddColumnInput } from "./AddColumnInput";
import { BoardTitle } from "./BoardTitle";
import { BarChart3, CheckCircle2 } from "lucide-react";

export const BoardCanvas: React.FC = () => {
  const { state, handleUpdateBoardTitle } = useBoardData();
  const board = state.boards.entities[state.activeBoardId];
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

  const boardColumns = board.columnIds
    .map((id) => state.columns.entities[id])
    .filter(Boolean);
  const activeTaskIds = boardColumns.flatMap((col) => col.taskIds);
  const totalTasks = activeTaskIds.length;

  const activeSubTaskIds = activeTaskIds.flatMap(
    (id) => state.tasks.entities[id]?.subTaskIds || [],
  );
  const totalSubTasks = activeSubTaskIds.length;
  const completedSubTasks = activeSubTaskIds.filter(
    (id) => state.subTasks.entities[id]?.isCompleted,
  ).length;

  const completionPercentage =
    totalSubTasks > 0
      ? Math.round((completedSubTasks / totalSubTasks) * 100)
      : 0;

  return (
    <main className="flex-1 flex flex-col min-w-0">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/50 pr-4">
        <div className="flex-1">
          <BoardTitle
            boardId={board.id}
            boardTitle={board.title}
            handleUpdateBoardTitle={handleUpdateBoardTitle}
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
      {showMetrics && (
        <div className=" bg-zinc-950 border-b border-zinc-800 p-4 grid grid-cols-3 gap-4 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
              Total Active Tasks
            </p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">
              {totalTasks}
            </p>
          </div>
          <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
              Subtask Breakdown
            </p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">
              {completedSubTasks}{" "}
              <span className="text-sm text-zinc-500 font-normal">
                / {totalSubTasks} done
              </span>
            </p>
          </div>
          <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
              Board Sprint Progress
            </p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-2xl font-bold text-blue-400">
                {completionPercentage}%
              </p>
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
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
