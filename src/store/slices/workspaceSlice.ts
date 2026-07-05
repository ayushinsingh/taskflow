import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { NormalizedWorkspace } from "../../types/normalized.type";
import type { RootState } from "../index";
import { initalNormalizedState } from "../../data/normalizedMockData";

const workspaceAdapter = createEntityAdapter<NormalizedWorkspace>();

const initialState = workspaceAdapter.setAll(
  workspaceAdapter.getInitialState(),
  initalNormalizedState.workspaces.entities,
);

export const workspaceSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {
    addWorkspace: workspaceAdapter.addOne,
    linkBoardToWorkspace: (
      state,
      action: PayloadAction<{ workspaceId: string; boardId: string }>,
    ) => {
      const { workspaceId, boardId } = action.payload;
      const ws = state.entities[workspaceId];
      if (ws) {
        ws.boardIds.push(boardId);
      }
    },
    unlinkBoardFromWorkspace: (
      state,
      action: PayloadAction<{ workspaceId: string; boardId: string }>,
    ) => {
      const { workspaceId, boardId } = action.payload;
      const ws = state.entities[workspaceId];
      if (ws) {
        ws.boardIds = ws.boardIds.filter((id) => id !== boardId);
      }
    },
  },
});

export const { addWorkspace, linkBoardToWorkspace, unlinkBoardFromWorkspace } =
  workspaceSlice.actions;

export const workspaceSelectors = workspaceAdapter.getSelectors<RootState>(
  (state) => state.workspaces,
);

export default workspaceSlice.reducer;
