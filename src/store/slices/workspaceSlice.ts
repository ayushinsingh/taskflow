import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  NormalizedWorkspace,
  LoadStatus,
} from "../../types/normalized.type";
import type { RootState } from "../index";
import { initalNormalizedState } from "../../data/normalizedMockData";
import { createBoard, fetchWorkspaces } from "../thunks/boardThunks";

const workspaceAdapter = createEntityAdapter<NormalizedWorkspace>();

const initialState = workspaceAdapter.setAll(
  workspaceAdapter.getInitialState({
    status: "idle" as LoadStatus,
    error: null as string | null,
  }),
  initalNormalizedState.workspaces.entities as Record<string, NormalizedWorkspace>,
);

export const workspaceSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {
    addWorkspace: workspaceAdapter.addOne,
    deleteWorkspace: workspaceAdapter.removeOne,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        workspaceAdapter.setAll(state, action.payload.workspaces);
        state.status = "succeeded";
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch workspaces";
      }).addCase(createBoard.fulfilled, (state, action) => {
        state.entities[action.payload.workspaceId].boardIds.push(action.payload.board.id);
      })
  },
});

export const {
  addWorkspace,
  deleteWorkspace,
  unlinkBoardFromWorkspace,
} = workspaceSlice.actions;

export const workspaceSelectors = workspaceAdapter.getSelectors<RootState>(
  (state) => state.workspaces,
);

export default workspaceSlice.reducer;
