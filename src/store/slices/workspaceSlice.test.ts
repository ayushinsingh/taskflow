import { describe, it, expect } from "vitest";
import { setupTestStore } from "../../test/test-utils";
import { deleteWorkspace } from "./workspaceSlice";
import type { RootStateType } from "../index";

describe("Task 9: Multi-Slice Cascading Deletion Unit Tests", () => {

  const createSaturatedState = (): RootStateType => ({
    workspaces: {
      ids: ["ws-engineering"],
      entities: {
        "ws-engineering": { id: "ws-engineering", name: "Engineering Core", boardIds: ["board-sprint-1"] }
      },
      status: "idle",
      error: null,
    },
    boards: {
      ids: ["board-sprint-1", "board-unrelated"],
      activeBoardId: "board-sprint-1",
      entities: {
        "board-sprint-1": { id: "board-sprint-1", title: "Sprint 1 Canvas", columnIds: ["col-todo"] },
        "board-unrelated": { id: "board-unrelated", title: "Marketing Campaign", columnIds: ["col-marketing"] }
      },
      status: "idle",
      error: null,
    },
    columns: {
      ids: ["col-todo", "col-marketing"],
      entities: {
        "col-todo": { id: "col-todo", title: "To Do Lane", taskIds: ["task-leak-check"] },
        "col-marketing": { id: "col-marketing", title: "SEO Strategy", taskIds: [] }
      }
    },
    tasks: {
      activeTaskId: null,
      ids: ["task-leak-check"],
      entities: {
        "task-leak-check": { id: "task-leak-check", title: "Fix Memory Bugs", description: "", priority: "high", subTaskIds: ["subtask-leak-check"] }
      }
    },
    subTasks: {
      ids: ["subtask-leak-check"],
      entities: {
        "subtask-leak-check": { id: "subtask-leak-check", title: "Verify structural leak trees", isCompleted: false }
      }
    }
  });

  it("should completely purge all nested child boards, columns, tasks, and subtasks when a parent workspace is deleted", () => {
    const preloadedState = createSaturatedState();
    const store = setupTestStore(preloadedState);

    expect(store.getState().workspaces.ids).toContain("ws-engineering");
    expect(store.getState().boards.ids).toContain("board-sprint-1");
    expect(store.getState().columns.ids).toContain("col-todo");
    expect(store.getState().tasks.ids).toContain("task-leak-check");
    expect(store.getState().subTasks.ids).toContain("subtask-leak-check");

    store.dispatch(deleteWorkspace("ws-engineering"));

    const finalState = store.getState();

    expect(finalState.workspaces.ids).not.toContain("ws-engineering");

    expect(finalState.boards.ids).not.toContain("board-sprint-1");
    expect(finalState.columns.ids).not.toContain("col-todo");
    expect(finalState.tasks.ids).not.toContain("task-leak-check");
    expect(finalState.subTasks.ids).not.toContain("subtask-leak-check");

    expect(finalState.boards.ids).toContain("board-unrelated");
    expect(finalState.columns.ids).toContain("col-marketing");
  });
});