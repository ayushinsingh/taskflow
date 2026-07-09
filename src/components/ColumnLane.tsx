import React from "react";
import { TaskCard } from "./TaskCard";
import { AddTaskInput } from "./AddTaskInput";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ColumnTitle } from "./ColumnTitle";
import { useAppSelector } from "../store";

interface ColumnLaneProps {
  index: number;
  columnId: string;
}

export const ColumnLane: React.FC<ColumnLaneProps> = React.memo(
  ({ index, columnId }) => {
    const column = useAppSelector((state) => state.columns.entities[columnId]);
    return (
      <Draggable draggableId={columnId} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`group w-80 shrink-0 bg-zinc-950 rounded-lg p-4 flex flex-col max-h-full ${snapshot.isDragging ? "shadow-xl border-blue-500/50 bg-zinc-850" : ""}`}
          >
            <ColumnTitle columnId={columnId} columnTitle={column.title} dragProps={provided.dragHandleProps} />
            <Droppable droppableId={columnId} type="TASK">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 overflow-y-auto flex-1 mb-4"
                >
                  {column.taskIds.map((taskId) => (
                    <TaskCard
                      key={taskId}
                      taskId={taskId}
                      columnId={columnId}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <AddTaskInput columnId={columnId} />
          </div>
        )}
      </Draggable>
    );
  },
);
