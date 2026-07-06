import { describe, expect, it } from "vitest";
import type { NormalizedTask } from "../../types/normalized.type";
import type { RootStateType } from "..";
import { setupTestStore } from "../../test/test-utils";
import {
  addTask,
  closeTaskInspector,
  deleteTask,
  linkSubTaskToTask,
  openTaskInspector,
  removeTasks,
  updateTask,
} from "./taskSlice";

describe("Task Slice Unit Tests", () => {
  it("should handle adding a new task", () => {
    const preloaded: Partial<RootStateType> = {
      tasks: {
        activeTaskId: null,
        ids: ["t-1"],
        entities: {
          "t-1": {
            id: "t-1",
            title: "Add Tests for task slice",
            priority: "high",
            description: "",
            subTaskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloaded);
    const task: NormalizedTask = {
      id: "t-2",
      title: "Add Tests for Subtask slice",
      description: "Do it after the task slice",
      priority: "medium",
      subTaskIds: [],
    };
    store.dispatch(addTask(task));
    const state = store.getState().tasks;

    expect(state.ids).toContain("t-2");
    expect(state.entities["t-2"]).toEqual(task);
  });

  it("should update task with give id and changes", () => {
    const preloaded: Partial<RootStateType> = {
      tasks: {
        activeTaskId: null,
        ids: ["t-1"],
        entities: {
          "t-1": {
            id: "t-1",
            title: "Add Tests for task slice",
            priority: "high",
            description: "",
            subTaskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloaded);

    store.dispatch(
      updateTask({ taskId: "t-1", changes: { priority: "urgent" } }),
    );
    const state = store.getState().tasks;

    expect(state.entities["t-1"].priority).toEqual("urgent");
  });

  it("should delete task with given id gracefully", () => {
    const preloaded: Partial<RootStateType> = {
      tasks: {
        activeTaskId: null,
        ids: ["t-1"],
        entities: {
          "t-1": {
            id: "t-1",
            title: "Add Tests for task slice",
            priority: "high",
            description: "",
            subTaskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloaded);

    store.dispatch(deleteTask("t-1"));
    const state = store.getState().tasks;

    expect(state.ids).not.toContain("t-1");
    expect(state.entities["t-1"]).toBeUndefined();
  });

  it("should remove tasks with multiple ids gracefully", () => {
    const preloaded: Partial<RootStateType> = {
      tasks: {
        activeTaskId: null,
        ids: ["t-1", "t-2"],
        entities: {
          "t-1": {
            id: "t-1",
            title: "Add Tests for task slice",
            priority: "high",
            description: "",
            subTaskIds: [],
          },
          "t-2": {
            id: "t-2",
            title: "Add Tests for Subtask slice",
            description: "Do it after the task slice",
            priority: "medium",
            subTaskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloaded);

    store.dispatch(removeTasks(["t-1", "t-2"]));
    const state = store.getState().tasks;

    expect(state.ids).not.containSubset(["t-1", "t-2"]);
    expect(["t-1", "t-2"].every((t) => state.entities[t] === undefined)).toBe(
      true,
    );
  });

  it("should link subtask with give id to task with given id", () => {
    const preloaded: Partial<RootStateType> = {
      tasks: {
        activeTaskId: null,
        ids: ["t-1", "t-2"],
        entities: {
          "t-1": {
            id: "t-1",
            title: "Add Tests for task slice",
            priority: "high",
            description: "",
            subTaskIds: [],
          },
          "t-2": {
            id: "t-2",
            title: "Add Tests for Subtask slice",
            description: "Do it after the task slice",
            priority: "medium",
            subTaskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloaded);

    store.dispatch(linkSubTaskToTask({ taskId: "t-1", subTaskId: "s-1" }));
    const state = store.getState().tasks;

    expect(state.entities["t-1"].subTaskIds).toContain("s-1");
  });
  
  it("should set task with given id to activeTaskId", () => {
    const preloaded: Partial<RootStateType> = {
      tasks: {
        activeTaskId: null,
        ids: ["t-1", "t-2"],
        entities: {
          "t-1": {
            id: "t-1",
            title: "Add Tests for task slice",
            priority: "high",
            description: "",
            subTaskIds: [],
          },
          "t-2": {
            id: "t-2",
            title: "Add Tests for Subtask slice",
            description: "Do it after the task slice",
            priority: "medium",
            subTaskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloaded);

    store.dispatch(openTaskInspector("t-1"));
    const state = store.getState().tasks;

    expect(state.activeTaskId).toContain("t-1");
  });
  
  it("should set activeTaskId to null", () => {
    const preloaded: Partial<RootStateType> = {
      tasks: {
        activeTaskId: null,
        ids: ["t-1", "t-2"],
        entities: {
          "t-1": {
            id: "t-1",
            title: "Add Tests for task slice",
            priority: "high",
            description: "",
            subTaskIds: [],
          },
          "t-2": {
            id: "t-2",
            title: "Add Tests for Subtask slice",
            description: "Do it after the task slice",
            priority: "medium",
            subTaskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloaded);

    store.dispatch(closeTaskInspector());
    const state = store.getState().tasks;

    expect(state.activeTaskId).toBe(null);
  });

});
