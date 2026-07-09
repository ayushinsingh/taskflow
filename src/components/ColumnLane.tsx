import React from "react";
import { TaskCard } from "./TaskCard";
import { AddTaskInput } from "./AddTaskInput";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ColumnTitle } from "./ColumnTitle";
import { useAppDispatch, useAppSelector } from "../store";
import { openTaskInspector } from "../store/slices/taskSlice";

interface ColumnLaneProps {
  index: number;
  columnId: string;
}

export const ColumnLane: React.FC<ColumnLaneProps> = React.memo(
  ({ index, columnId }) => {
    const column = useAppSelector((state) => state.columns.entities[columnId]);
    const dispatch = useAppDispatch();
    return (
      <Draggable draggableId={columnId} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`group w-80 shrink-0 bg-zinc-950 rounded-lg p-4 flex flex-col max-h-full ${snapshot.isDragging ? "shadow-xl border-blue-500/50 bg-zinc-850" : ""}`}
          >
            <ColumnTitle
              columnId={columnId}
              columnTitle={column.title}
              dragProps={provided.dragHandleProps}
            />
            <Droppable droppableId={columnId} type="TASK">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 overflow-y-auto flex-1 mb-4"
                >
                  {column.taskIds.map((taskId, index) => (
                    <Draggable draggableId={taskId} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          className={`group/task bg-zinc-900 border border-zinc-800/80 p-3 rounded-md shadow-sm cursor-grab active:cursor-grabbing hover:border-zinc-700 transition-colors ${
                            snapshot.isDragging
                              ? "shadow-lg border-blue-500/50 bg-zinc-850"
                              : ""
                          }`}
                          onClick={() => dispatch(openTaskInspector(taskId))}
                        >
                          <TaskCard
                            key={taskId}
                            taskId={taskId}
                            columnId={columnId}
                          />
                        </div>
                      )}
                    </Draggable>
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
