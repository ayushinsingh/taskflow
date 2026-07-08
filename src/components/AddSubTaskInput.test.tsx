import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test/test-utils";
import { AddSubTaskInput } from "./AddSubTaskInput";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { RootStateType } from "../store";

describe("SubTask Input Unit Tests", () => {
  const preloadedState: Partial<RootStateType> = {
    tasks: {
      ids: ["t-1", "t-2"],
      entities: {
        "t-1": {
          id: "t-1",
          title: "Task1",
          description: "",
          priority: "medium",
          subTaskIds: [],
        },
        "t-2": {
          id: "t-2",
          title: "Task2",
          description: "",
          priority: "medium",
          subTaskIds: [],
        },
      },
      activeTaskId: "t-1",
    },
    subTasks: {
      ids: [],
      entities: {},
    },
  };
  it("should correctly update state of textfield when user types characters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddSubTaskInput />, { preloadedState });
    const inputElement = screen.getByPlaceholderText(
      "+ Add new sub task...",
    ) as HTMLInputElement;
    await user.type(inputElement, "New subtask");
    expect(inputElement.value).toBe("New subtask");
  });

  it("should correctly update state of textfield when user types characters", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<AddSubTaskInput />, { preloadedState });
    const inputElement = screen.getByPlaceholderText(
      "+ Add new sub task...",
    ) as HTMLInputElement;
    await user.type(inputElement, "New subtask{Enter}");
    expect(inputElement.value).toBe("");
    const subTaskState = store.getState().subTasks;
    const addedSubTaskId = subTaskState.ids[0];
    const taskState = store.getState().tasks;

    expect(subTaskState.entities[addedSubTaskId].title).toBe("New subtask");
    expect(taskState.entities["t-1"].subTaskIds).toContain(addedSubTaskId);
  });
});
