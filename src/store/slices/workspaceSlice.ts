import {
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import type {
  NormalizedWorkspace,
  LoadStatus,
} from "../../types/normalized.type";
import type { RootState } from "../index";
import { createBoard, deleteBoard } from "../thunks/boardThunks";
import { createWorkspace, fetchWorkspaces } from "../thunks/workspaceThunks";

const workspaceAdapter = createEntityAdapter<NormalizedWorkspace>();

const initialState = workspaceAdapter.getInitialState({
  status: "idle" as LoadStatus,
  error: null as string | null,
  createStatus: "idle" as LoadStatus,
  createError: null as string | null,
})

export const workspaceSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {
    addWorkspace: workspaceAdapter.addOne,
    deleteWorkspace: workspaceAdapter.removeOne,
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
      }).addCase(deleteBoard.fulfilled, (state, action) => {
        const { workspaceId, boardId } = action.payload;
        const ws = state.entities[workspaceId];
        if (ws) {
          ws.boardIds = ws.boardIds.filter((id) => id !== boardId);
        }
      })
      .addCase(createWorkspace.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        workspaceAdapter.addOne(state, action.payload);
        state.createStatus = "succeeded";
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          (action.payload as string) ?? "Failed to create workspace";
      })
  },
});

export const {
  addWorkspace,
  deleteWorkspace,
} = workspaceSlice.actions;

export const workspaceSelectors = workspaceAdapter.getSelectors<RootState>(
  (state) => state.workspaces,
);

export default workspaceSlice.reducer;
