import { describe, it, expect } from "vitest";
import type { RootStateType } from "../index";
import { selectBoardMetrics } from "./selectors";

describe("Task 4: Centralized Selector Memoization and Stats Tests", () => {
  const createMockState = (): RootStateType => ({
    workspaces: {
      ids: ["ws-1"],
      entities: {
        "ws-1": { id: "ws-1", name: "Engineering Ops", boardIds: ["board-1"] },
      },
      status: "idle",
      error: null,
    },
    boards: {
      ids: ["board-1"],
      activeBoardId: "board-1",
      entities: {
        "board-1": {
          id: "board-1",
          title: "Core Sprint Alpha",
          columnIds: ["col-1"],
        },
      },
      status: "idle",
      error: null,
    },
    columns: {
      ids: ["col-1"],
      entities: {
        "col-1": {
          id: "col-1",
          title: "In Progress",
          taskIds: ["task-1", "task-2"],
        },
      },
    },
    tasks: {
      activeTaskId: null,
      ids: ["task-1", "task-2"],
      entities: {
        "task-1": {
          id: "task-1",
          title: "Setup Vitest",
          description: "",
          priority: "high",
          subTaskIds: ["sub-1", "sub-2"],
        },
        "task-2": {
          id: "task-2",
          title: "Write Slices",
          description: "",
          priority: "medium",
          subTaskIds: [],
        },
      },
    },
    subTasks: {
      ids: ["sub-1", "sub-2"],
      entities: {
        "sub-1": {
          id: "sub-1",
          title: "Config file config",
          isCompleted: true,
        },
        "sub-2": { id: "sub-2", title: "Add utils setup", isCompleted: false },
      },
    },
  });

  it("should compile correct metrics calculation statistics for the active board context", () => {
    const state = createMockState();

    const metrics = selectBoardMetrics(state);
    expect(metrics.totalTasks).toBe(2);
    expect(metrics.totalSubTasks).toBe(2);
    expect(metrics.completedSubTasks).toBe(1);
    expect(metrics.completionPercentage).toBe(50);
  });

  it("should preserve memory address reference stability (memoize) when unrelated state parameters alter", () => {
    const state1 = createMockState();

    const result1 = selectBoardMetrics(state1);

    const state2: RootStateType = {
      ...state1,
      workspaces: {
        ids: ["ws-1"],
        entities: {
          "ws-1": {
            id: "ws-1",
            name: "Marketing Strategy Room",
            boardIds: ["board-1"],
          },
        },
        status: "idle",
        error: null,
      },
    };

    const result2 = selectBoardMetrics(state2);

    expect(result1).toBe(result2);
  });

  it("should break memoization and recalculate stats when data inside the containment tree updates", () => {
    const state1 = createMockState();
    const result1 = selectBoardMetrics(state1);

    const state2: RootStateType = {
      ...state1,
      subTasks: {
        ids: ["sub-1", "sub-2"],
        entities: {
          "sub-1": {
            id: "sub-1",
            title: "Config file config",
            isCompleted: true,
          },
          "sub-2": { id: "sub-2", title: "Add utils setup", isCompleted: true },
        },
      },
    };

    const result2 = selectBoardMetrics(state2);

    expect(result1).not.toBe(result2);
    expect(result2.completedSubTasks).toBe(2);
    expect(result2.completionPercentage).toBe(100);
  });
});
