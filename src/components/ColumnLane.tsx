import React from "react";
import { TaskCard } from "./TaskCard";
import { AddTaskInput } from "./AddTaskInput";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";
import { ColumnTitle } from "./ColumnTitle";

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
            <ColumnTitle columnId={columnId} columnTitle={columnTitle} dragProps={provided.dragHandleProps} />
            <Droppable droppableId={columnId} type="TASK">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 overflow-y-auto flex-1 mb-4"
                >
                  {taskIds.map((taskId, index) => (
                    <TaskCard
                      key={taskId}
                      taskId={taskId}
                      columnId={columnId}
                      index={index}
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
