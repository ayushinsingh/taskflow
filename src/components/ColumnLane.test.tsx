import { describe, expect, it } from "vitest";
import type { RootStateType } from "../store";
import { renderWithProviders } from "../test/test-utils";
import { ColumnLane } from "./ColumnLane";
import { screen } from "@testing-library/react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

describe("ColumnLane Identity Isolation UI Tests", () => {
  it("should render its header title correctly and correctly mount all children task ID's found in its store array", () => {
    const mockPreloadedState: Partial<RootStateType> = {
      columns: {
        ids: ["col-backlog"],
        entities: {
          "col-backlog": {
            id: "col-backlog",
            title: "Backlog Sprint Items",
            taskIds: ["task-alpha", "task-beta"],
          },
        },
      },
      tasks: {
        activeTaskId: null,
        ids: ["task-alpha", "task-beta"],
        entities: {
          "task-alpha": {
            id: "task-alpha",
            title: "Alpha Task Title",
            description: "",
            priority: "low",
            subTaskIds: [],
          },
          "task-beta": {
            id: "task-beta",
            title: "Beta Task Title",
            description: "",
            priority: "medium",
            subTaskIds: [],
          },
        },
      },
      subTasks: { ids: [], entities: {} },
    };
    renderWithProviders(
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="column" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-1 p-6 overflow-x-auto flex items-start gap-4"
            >
              <ColumnLane index={0} columnId={"col-backlog"} />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>,
      { preloadedState: mockPreloadedState },
    );
    expect(screen.getByText("Backlog Sprint Items")).toBeInTheDocument();
    expect(screen.getByText("Alpha Task Title")).toBeInTheDocument();
    expect(screen.getByText("Beta Task Title")).toBeInTheDocument();
  });

  
});
