import { describe, expect, it } from "vitest";
import { entityState, makeColumn } from "../../test/fixtures";
import { columnSlice, moveTaskCard } from "./columnSlice";

describe("Tests for move tasks", () => {
  const beforeState = entityState([
    makeColumn({ id: "col-1", taskIds: ["t1", "t2", "t3"] }),
    makeColumn({ id: "col-2", taskIds: ["t4"] }),
  ]);

  it("should move columns correctly", () => {

    expect(beforeState.entities["col-1"].taskIds).toEqual(["t1", "t2", "t3"]);
    const payload = {
      sourceColumnId: "col-1",
      destinationColumnId: "col-2",
      sourceIndex: 1,
      destinationIndex: 0
    };
    const after = columnSlice.reducer(beforeState, moveTaskCard({ ...payload }));
    expect(after.entities["col-2"].taskIds).toEqual(["t2", "t4"]);
    expect(after.entities["col-1"].taskIds).toEqual(["t1", "t3"]);
  });

  it("should move a task to front within a column correctly", () => {
    expect(beforeState.entities["col-1"].taskIds).toEqual(["t1", "t2", "t3"]);
    const payload = {
      sourceColumnId: "col-1",
      destinationColumnId: "col-1",
      sourceIndex: 2,
      destinationIndex: 0
    };
    const after = columnSlice.reducer(beforeState, moveTaskCard({ ...payload }));
    expect(after.entities["col-1"].taskIds).toEqual(["t3", "t1", "t2"]);
  })

  it("should move a task to end within a column correctly", () => {
    expect(beforeState.entities["col-1"].taskIds).toEqual(["t1", "t2", "t3"]);
    const payload = {
      sourceColumnId: "col-1",
      destinationColumnId: "col-1",
      sourceIndex: 0,
      destinationIndex: 2
    };
    const after = columnSlice.reducer(beforeState, moveTaskCard({ ...payload }));
    expect(after.entities["col-1"].taskIds).toEqual(["t2", "t3", "t1"]);
  })

  it("should move a task to end of another column correctly", () => {
    expect(beforeState.entities["col-1"].taskIds).toEqual(["t1", "t2", "t3"]);
    const payload = {
      sourceColumnId: "col-1",
      destinationColumnId: "col-2",
      sourceIndex: 0,
      destinationIndex: 1
    };
    const after = columnSlice.reducer(beforeState, moveTaskCard({ ...payload }));
    expect(after.entities["col-1"].taskIds).toEqual(["t2", "t3"]);
    expect(after.entities["col-2"].taskIds).toEqual(["t4", "t1"]);
  })

  it("should not crash when the source column doesn't exists", () => {
    expect(beforeState.entities["col-1"].taskIds).toEqual(["t1", "t2", "t3"]);
    const payload = {
      sourceColumnId: "doen't exists",
      destinationColumnId: "col-1",
      sourceIndex: 0,
      destinationIndex: 1
    };
    const after = columnSlice.reducer(beforeState, moveTaskCard({ ...payload }));
    expect(after.entities["col-1"].taskIds).toEqual(["t1", "t2", "t3"]);
  })
})