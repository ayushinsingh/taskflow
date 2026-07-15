import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/test-utils";
import { AddBoardInput } from "./AddBoardInput";
import { screen } from "@testing-library/react";
import type { RootStateType } from "../store";

describe("AddColumn Input Unit Tests", () => {
  it("should update its text field state correctly when user types characters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddBoardInput />);
    const inputElement = screen.getByPlaceholderText("+ Add new board...") as HTMLInputElement;

    await user.type(inputElement, "Full stack tasks board");

    expect(inputElement.value).toBe("Full stack tasks board");
  });

  it("should clear the text field and append a new board pointer to the board state when enter is pressed", async () => {
    const user = userEvent.setup();
    const preloadedState: RootStateType = {
      workspaces: {
        ids: ["ws-1"],
        entities: {
          "ws-1": {
            id: "ws-1",
            name: "My Workspace",
            boardIds: []
          }
        },
        status: "idle",
        error: null,
      },
      boards: {
        ids: [],
        entities: {},
        activeBoardId: null,
        status: "idle",
        error: null,
      },
      columns: {
        ids: [],
        entities: {},
      },
      tasks: {
        ids: [],
        entities: {},
        activeTaskId: null,
      },
      subTasks: {
        ids: [],
        entities: {},
      },
    };

    const { store } = renderWithProviders(<AddBoardInput />, {
      preloadedState,
    });

    const inputElement = screen.getByPlaceholderText("+ Add new board...") as HTMLInputElement;

    await user.type(inputElement, "New Board{Enter}");
    expect(inputElement.value).toBe("");
    const boardState = store.getState().boards;
    const addedBoardId = boardState.ids[0];
    expect(boardState.entities[addedBoardId].title).toBe("New Board");
    const updatedWorkspace = store.getState().workspaces.entities["ws-1"];
    expect(updatedWorkspace.boardIds).toContain(addedBoardId);
  });
});
