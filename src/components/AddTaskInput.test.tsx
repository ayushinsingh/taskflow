import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test/test-utils";
import { AddTaskInput } from "./AddTaskInput";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/react";
import type { RootStateType } from "../store";

describe("Add Task Input Unit Tests", () => {
  it("should correctly update state when user types characters", async () => {
    const user = userEvent.setup();
     renderWithProviders(
      <div data-testId="todo-column-container">
        <h3>To do</h3>
        <AddTaskInput columnId="col-todo" />
      </div>
    );
    const columnContainer = screen.getByTestId("todo-column-container");
    const inputElement = within(columnContainer).getByPlaceholderText("+ Add new task...") as HTMLInputElement;
    await user.type(inputElement, "New Task");
    expect(inputElement.value).toBe("New Task");
  });

  it("should isolate the correct input field when targeted within a specific column context container", async () => {
    const mockPreloadedState: Partial<RootStateType> = {
      columns: {
        ids: ["col-todo", "col-done"],
        entities: {
          "col-todo": { id: "col-todo", title: "To Do Lane", taskIds: [] },
          "col-done": { id: "col-done", title: "Done Lane", taskIds: [] }
        }
      },
      tasks: { activeTaskId: null, ids: [], entities: {} }
    };
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <div data-testId="todo-column-container">
        <h3>To do</h3>
        <AddTaskInput columnId="col-todo" />
      </div>,
      {
        preloadedState: mockPreloadedState
      }
    );
    const columnContainer = screen.getByTestId("todo-column-container");
    const inputElement = within(columnContainer).getByPlaceholderText("+ Add new task...") as HTMLInputElement;
    await user.type(inputElement, "New Task{Enter}");
    expect(inputElement.value).toBe("");
    const taskState = store.getState().tasks;
    const addedTaskId = taskState.ids[0];
    const columnState = store.getState().columns;
    expect(taskState.entities[addedTaskId].title).toBe("New Task");
    expect(columnState.entities["col-todo"].taskIds).toContain(addedTaskId);
  });
});
