import React from "react";
import { TaskCard } from "./TaskCard";
import { AddTaskInput } from "./AddTaskInput";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface ColumnLaneProps {
  index: number;
  columnId: string;
  columnTitle: string;
  taskIds: string[];
}

export const ColumnLane: React.FC<ColumnLaneProps> = React.memo(
  ({ index, columnId, columnTitle, taskIds }) => {
    return (
      <Draggable draggableId={columnId} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`w-80 shrink-0 bg-zinc-950 rounded-lg p-4 flex flex-col max-h-full ${snapshot.isDragging ? "shadow-xl border-blue-500/50 bg-zinc-850" : ""}`}
          >
            <h3
              {...provided.dragHandleProps}
              className="font-semibold text-zinc-300 mb-3 px-1"
            >
              {columnTitle}
            </h3>
            <Droppable droppableId={columnId} type="TASK">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 overflow-y-auto flex-1 mb-4"
                >
                  {taskIds.map((taskId, index) => (
                    <TaskCard key={taskId} taskId={taskId} index={index} />
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
