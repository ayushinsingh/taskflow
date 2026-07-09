import { describe, expect, it } from "vitest";
import type { RootStateType } from "../store";
import { renderWithProviders } from "../test/test-utils";
import { TaskInspectorModal } from "./TaskInspectorModal";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("TaskInspector modal ui mutation tests", () => {
  // reads subtask and displays correct task;
  // It allows users to modify text fields on the fly
  // It maps a checklist array of subtasks, allowing users to toggle completion checkboxes

  const createOpenModalState = (): Partial<RootStateType> => ({
    tasks: {
      activeTaskId: "task-focused", // 🌟 Critical: Pins the pointer to tell the modal what to inspect
      ids: ["task-focused"],
      entities: {
        "task-focused": {
          id: "task-focused",
          title: "Refactor State Sync Modules",
          description: "Initial raw description text stub.",
          priority: "medium",
          subTaskIds: ["sub-checkbox-1"],
        },
      },
    },
    subTasks: {
      ids: ["sub-checkbox-1"],
      entities: {
        "sub-checkbox-1": {
          id: "sub-checkbox-1",
          title: "Verify hydration states",
          isCompleted: false,
        },
      },
    },
  });

  it("should display the full details of the active task when mounted into the view overlay", () => {
    const preloadedState = createOpenModalState();
    renderWithProviders(<TaskInspectorModal />, { preloadedState });
    expect(
      screen.getByDisplayValue("Refactor State Sync Modules"),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Initial raw description text stub."),
    ).toBeInTheDocument();
    expect(screen.getByText("Verify hydration states")).toBeInTheDocument();
  });

  it("should dispatch description field blur updates to the store when the user edits the description text box", async () => {
    const preloadedState = createOpenModalState();
    const user = userEvent.setup();

    const { store } = renderWithProviders(<TaskInspectorModal />, {
      preloadedState,
    });

    const descriptionTextArea = screen.getByRole("textbox", {
      name: /description/i,
    });

    await user.clear(descriptionTextArea);
    await user.type(descriptionTextArea, "New detailed description.{Tab}");
    expect(
      screen.getByDisplayValue("New detailed description."),
    ).toBeInTheDocument();
    const updatedTask = store.getState().tasks.entities["task-focused"];
    expect(updatedTask?.description).toBe("New detailed description.");
  });

  it("should toggle a subtask item's completed boolean state when its tracking checkbox is clicked", async () => {
    const preloadedState = createOpenModalState();
    const user = userEvent.setup();
    const { store } = renderWithProviders(<TaskInspectorModal />, { preloadedState })
    const checkbox = screen.getByRole("checkbox", {name: /Verify hydration states/i}) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);
    const subTaskRecord = store.getState().subTasks.entities["sub-checkbox-1"];
    expect(subTaskRecord?.isCompleted).toBe(true);
  });
});
