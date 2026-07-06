import { describe, it, expect } from "vitest";
import { setupTestStore } from "../../test/test-utils";
import {
  addColumn,
  deleteColumn,
  deleteColumns,
  updateColumnTitle,
  linkTaskToColumn,
  unlinkTaskFromColumn,
  moveTaskCard,
} from "./columnSlice";
import type { RootStateType } from "../index";
import type { NormalizedColumn } from "../../types/normalized.type";

describe("Column Slice Unit Tests", () => {
  it("should handle adding a new column", () => {
    const preloadedState: Partial<RootStateType> = {
      columns: {
        ids: ["c-1", "c-2"],
        entities: {
          "c-1": {
            id: "c-1",
            title: "To do",
            taskIds: [],
          },
          "c-2": {
            id: "c-2",
            title: "In Progress",
            taskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloadedState);
    const newColumn: NormalizedColumn = {
      id: "c-3",
      title: "Ready for review",
      taskIds: [],
    };
    store.dispatch(addColumn(newColumn));
    const state = store.getState().columns;
    expect(state.ids).toContain("c-3");
    expect(state.entities["c-3"]).toEqual(newColumn);
  });
  
  it("should handle deleting a column with given id gracefully", () => {
    const preloadedState: Partial<RootStateType> = {
      columns: {
        ids: ["c-1", "c-2"],
        entities: {
          "c-1": {
            id: "c-1",
            title: "To do",
            taskIds: [],
          },
          "c-2": {
            id: "c-2",
            title: "In Progress",
            taskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloadedState);
    
    store.dispatch(deleteColumn("c-2"));
    const state = store.getState().columns;
    expect(state.ids).not.toContain("c-2");
    expect(state.entities["c-2"]).toBeUndefined();
  });

  it("should handle deleting multiple columns with ids gracefully", () => {
    const preloadedState: Partial<RootStateType> = {
      columns: {
        ids: ["c-1", "c-2", "c-3"],
        entities: {
          "c-1": {
            id: "c-1",
            title: "To do",
            taskIds: [],
          },
          "c-2": {
            id: "c-2",
            title: "In Progress",
            taskIds: [],
          },
          "c-3": {
            id: "c-3",
            title: "Ready for review",
            taskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloadedState);
    
    store.dispatch(deleteColumns(["c-2", "c-3"]));
    const state = store.getState().columns;
    expect(state.ids).not.containSubset(["c-2", "c-3"]);
    expect(["c-2", "c-3"].every((id:string) => state.entities[id] === undefined)).toBe(true);
  });
  
  it("should update column title with given colum id", () => {
    const preloadedState: Partial<RootStateType> = {
      columns: {
        ids: ["c-1", "c-2", "c-3"],
        entities: {
          "c-1": {
            id: "c-1",
            title: "To do",
            taskIds: [],
          },
          "c-2": {
            id: "c-2",
            title: "In Progress",
            taskIds: [],
          },
          "c-3": {
            id: "c-3",
            title: "Ready for review",
            taskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloadedState);
    
    store.dispatch(updateColumnTitle({columnId: "c-3", title: "Done"}));
    const state = store.getState().columns;
    expect(state.entities["c-3"].title).toBe("Done");
  });
  
  it("should link task with given id to column with given id", () => {
    const preloadedState: Partial<RootStateType> = {
      columns: {
        ids: ["c-1", "c-2", "c-3"],
        entities: {
          "c-1": {
            id: "c-1",
            title: "To do",
            taskIds: [],
          },
          "c-2": {
            id: "c-2",
            title: "In Progress",
            taskIds: [],
          },
          "c-3": {
            id: "c-3",
            title: "Ready for review",
            taskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloadedState);
    
    store.dispatch(linkTaskToColumn({columnId: "c-3", taskId: "t-1"}));
    const state = store.getState().columns;
    expect(state.entities["c-3"].taskIds).toContain("t-1");
  });
  
  it("should unlink task with given id from column with given id", () => {
    const preloadedState: Partial<RootStateType> = {
      columns: {
        ids: ["c-1", "c-2", "c-3"],
        entities: {
          "c-1": {
            id: "c-1",
            title: "To do",
            taskIds: ["t-1", "t-2"],
          },
          "c-2": {
            id: "c-2",
            title: "In Progress",
            taskIds: [],
          },
          "c-3": {
            id: "c-3",
            title: "Ready for review",
            taskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloadedState);
    
    store.dispatch(unlinkTaskFromColumn({columnId: "c-3", taskId: "t-2"}));
    const state = store.getState().columns;
    expect(state.entities["c-3"].taskIds).not.toContain("t-2");
  });
  
  it("should unlink task with given id from column with given id", () => {
    const preloadedState: Partial<RootStateType> = {
      columns: {
        ids: ["c-1", "c-2", "c-3"],
        entities: {
          "c-1": {
            id: "c-1",
            title: "To do",
            taskIds: ["t-1", "t-2"],
          },
          "c-2": {
            id: "c-2",
            title: "In Progress",
            taskIds: ["t-3","t-4"],
          },
          "c-3": {
            id: "c-3",
            title: "Ready for review",
            taskIds: [],
          },
        },
      },
    };
    const store = setupTestStore(preloadedState);
    
    store.dispatch(moveTaskCard({sourceColumnId: "c-2", sourceIndex: 1, destinationColumnId: "c-3", destinationIndex: 0}));
    const state = store.getState().columns;
    expect(state.entities["c-2"].taskIds).not.toContain("t-4");
    expect(state.entities["c-3"].taskIds).toContain("t-4");
  });

});
