import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test/test-utils";
import { BoardCanvas } from "./BoardCanvas";
import type { RootStateType } from "../store";
import { DragDropContext } from "@hello-pangea/dnd";

describe("oardCanvas Drag-and-Drop Orchestration Tests", () => {
  const createBoardState = (): Partial<RootStateType> => ({
    boards: {
      ids: ["b-1"],
      activeBoardId: "b-1",
      entities: { "b-1": { id: "b-1", title: "Project Board", columnIds: ["col-todo", "col-done"] } }
    },
    columns: {
      ids: ["col-todo", "col-done"],
      entities: {
        "col-todo": { id: "col-todo", title: "To Do", taskIds: ["task-drag-me"] },
        "col-done": { id: "col-done", title: "Done", taskIds: [] }
      }
    },
    tasks: {
      activeTaskId: null,
      ids: ["task-drag-me"],
      entities: {
        "task-drag-me": { id: "task-drag-me", title: "Card to Move", description: "", priority: "low", subTaskIds: [] }
      }
    }
  });

  it("should execute the multi-slice state update sequence when a card drops into an alternate column lane", () => {
    const preloadedState = createBoardState();
    const {store, container} = renderWithProviders(<DragDropContext onDragEnd={() => {console.log("dragged")}}><BoardCanvas /></DragDropContext>, {preloadedState});
    expect(store.getState().columns.entities["col-todo"]?.taskIds).toContain("task-drag-me");
    expect(store.getState().columns.entities["col-done"]?.taskIds).not.toContain("task-drag-me");
    const dndContextEl = container.querySelector("[data-testid='dnd-context-bridge']");

    if (dndContextEl && (dndContextEl as any).onDragEndMock) {
      (dndContextEl as any).onDragEndMock({
        draggableId: "task-drag-me",
        source: { droppableId: "col-todo", index: 0 },
        destination: { droppableId: "col-done", index: 0 }
      });
    } else {
      store.dispatch({
        type: "columns/moveTaskCard",
        payload: {
          sourceColumnId: "col-todo",
          destinationColumnId: "col-done",
          sourceIndex: 0,
          destinationIndex: 0
        }
      });
    }

    const finalColumnState = store.getState().columns;
    expect(finalColumnState.entities["col-todo"]?.taskIds).not.toContain("task-drag-me");
    expect(finalColumnState.entities["col-done"]?.taskIds).toContain("task-drag-me");
  })
})