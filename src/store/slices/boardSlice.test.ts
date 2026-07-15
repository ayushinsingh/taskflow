import { describe, it, expect } from "vitest";
import { setupTestStore } from "../../test/test-utils";
import {
  addBoard,
  updateBoardTitle,
  deleteBoard,
  changeBoard,
  linkColumnToBoard,
  unlinkColumnFromBoard,
  moveColumnLane,
} from "./boardSlice";
import type { NormalizedBoard } from "../../types/normalized.type";
import type { RootStateType } from "..";

describe("boardSlice Unit Tests", () => {
  it("should handle adding a brand new board", () => {
    const store = setupTestStore();
    const mockNewBoard: NormalizedBoard = {
      id: "board-99",
      title: "Sprint Panning Alpha",
      columnIds: [],
    };

    store.dispatch(addBoard(mockNewBoard));
    const state = store.getState().boards;
    expect(state.ids).contains(mockNewBoard.id);
    expect(state.entities["board-99"]).toEqual(mockNewBoard);
  });
  it("should update board title given an exact id pointer", () => {
    const preloadedState: Partial<RootStateType> = {
      boards: {
        ids: ["board-1"],
        activeBoardId: "board-1",
        entities: {
          "board-1": {
            id: "board-1",
            title: "Old Board Title",
            columnIds: [],
          },
        },
        status: "idle",
        error: null,
      },
    };
    const store = setupTestStore(preloadedState);

    store.dispatch(
      updateBoardTitle({ boardId: "board-1", title: "New Board Title" }),
    );
    const state = store.getState().boards;
    expect(state.entities["board-1"]?.title).toBe("New Board Title");
  });

  it("should gracefully handle deletion of a board", () => {
    const preloadedState: Partial<RootStateType> = {
      boards: {
        activeBoardId: "b-1",
        ids: ["b-1", "b-2"],
        entities: {
          "b-1": {
            id: "b-1",
            title: "Board 1",
            columnIds: [],
          },
          "b-2": {
            id: "b-2",
            title: "Board 2",
            columnIds: [],
          },
        },
        status: "idle",
        error: null,
      },
    };

    const store = setupTestStore(preloadedState);

    store.dispatch(deleteBoard("b-1"));
    const state = store.getState().boards;
    expect(state.ids).not.toContain("b-1");
    expect(state.entities["b-1"]).toBeUndefined();
  });

  it("should change active board gracefully", () => {
    const preloadedState: Partial<RootStateType> = {
      boards: {
        activeBoardId: "b-1",
        ids: ["b-1", "b-2"],
        entities: {
          "b-1": {
            id: "b-1",
            title: "Board 1",
            columnIds: [],
          },
          "b-2": {
            id: "b-2",
            title: "Board 2",
            columnIds: [],
          },
        },
        status: "idle",
        error: null,
      },
    };

    const store = setupTestStore(preloadedState);

    store.dispatch(changeBoard("b-2"));
    const state = store.getState().boards;
    expect(state.activeBoardId).toBe("b-2");
  });

  it("should link column with given id to board with given id", () => {
    const preloadedState: Partial<RootStateType> = {
      boards: {
        activeBoardId: "b-1",
        ids: ["b-1", "b-2"],
        entities: {
          "b-1": {
            id: "b-1",
            title: "Board 1",
            columnIds: [],
          },
          "b-2": {
            id: "b-2",
            title: "Board 2",
            columnIds: [],
          },
        },
        status: "idle",
        error: null,
      },
    };

    const store = setupTestStore(preloadedState);

    store.dispatch(linkColumnToBoard({columnId: "c-1", boardId: "b-1"}));
    const state = store.getState().boards;
    expect(state.entities["b-1"].columnIds).toContain("c-1");
  });

  it("should unlink column with given id to board with given id", () => {
    const preloadedState: Partial<RootStateType> = {
      boards: {
        activeBoardId: "b-1",
        ids: ["b-1", "b-2"],
        entities: {
          "b-1": {
            id: "b-1",
            title: "Board 1",
            columnIds: ["c-1", "c-2"],
          },
          "b-2": {
            id: "b-2",
            title: "Board 2",
            columnIds: [],
          },
        },
        status: "idle",
        error: null,
      },
    };

    const store = setupTestStore(preloadedState);

    store.dispatch(unlinkColumnFromBoard({columnId: "c-1", boardId: "b-1"}));
    const state = store.getState().boards;
    expect(state.entities["b-1"].columnIds).not.toContain("c-1");
  });

  it("should re-order column lane arrays correctly when moving cross-lane slots",() => {
    const preloadedState: Partial<RootStateType> = {
      boards: {
        activeBoardId: "b-1",
        ids: ["b-1", "b-2"],
        entities: {
          "b-1": {
            id: "b-1",
            title: "board 1",
            columnIds: ["Col-A", "Col-B", "Col-C"]
          },
          "b-2": {
            id: "b-2",
            title: "board 1",
            columnIds: ["Col-A", "Col-B", "Col-C"]
          },
        },
        status: "idle",
        error: null,
      }
    }

    const store = setupTestStore(preloadedState);

    store.dispatch(moveColumnLane({boardId: "b-1", sourceIndex: 0, destinationIndex: 2}));

    const finalColumnIds = store.getState().boards.entities["b-1"].columnIds;

    expect(finalColumnIds).toEqual(["Col-B", "Col-C", "Col-A"]);
  })
});
