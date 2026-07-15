import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/test-utils";
import { AddColumnInput } from "./AddColumnInput";
import { screen } from "@testing-library/react";
import type { RootStateType } from "../store";

describe("AddColumn Input Unit Tests", () => {
  it("should update its text field state correctly when user types characters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddColumnInput />);
    const inputElement = screen.getByRole("textbox") as HTMLInputElement;

    await user.type(inputElement, "Quality Assurance");

    expect(inputElement.value).toBe("Quality Assurance");
  });

  it("should clear the text field and append a new column pointer to the active board state when enter is pressed", async () => {
    const user = userEvent.setup();
    const preloadedState: Partial<RootStateType> = {
      boards: {
        ids: ["board-1"],
        activeBoardId: "board-1",
        entities: {
          "board-1": {
            id: "board-1",
            title: "Product Roadmap Canvas",
            columnIds: [],
          },
        },
        status: "idle",
        error: null,
      },
      columns: { ids: [], entities: {} },
      tasks: { activeTaskId: null, ids: [], entities: {} },
      subTasks: { ids: [], entities: {} },
    };

    const { store } = renderWithProviders(<AddColumnInput />, {
      preloadedState
    });

    const inputElement = screen.getByPlaceholderText("+ Add new column...") as HTMLInputElement;

    await user.type(inputElement, "Done Phase{Enter}");
    expect(inputElement.value).toBe("");
    const columnState = store.getState().columns;
    const addedColumnId = columnState.ids[0]
    expect(columnState.entities[addedColumnId].title).toBe("Done Phase");
    const updatedBoard = store.getState().boards.entities["board-1"];
    expect(updatedBoard.columnIds).toContain(addedColumnId);

  });
});
