import { createSlice } from "@reduxjs/toolkit";
import type { LoadStatus } from "../../types/normalized.type";
import type {
  WorkspaceInvite,
  WorkspaceMember,
} from "../../types/api/member.types";
import {
  fetchWorkspaceMembers,
  revokeInvitation,
  sendInvitation,
} from "../thunks/memberThunks";

interface MemberState {
  /** Which workspace the lists below belong to, so stale data is detectable. */
  workspaceId: string | null;
  members: WorkspaceMember[];
  invites: WorkspaceInvite[];
  status: LoadStatus;
  error: string | null;
  inviteStatus: LoadStatus;
  inviteError: string | null;
  /** Keyed by invitation id -- revoking is per-row, like accept/decline. */
  revokeStatus: Record<string, LoadStatus>;
  revokeError: Record<string, string>;
}

const initialState: MemberState = {
  workspaceId: null,
  members: [],
  invites: [],
  status: "idle",
  error: null,
  inviteStatus: "idle",
  inviteError: null,
  revokeStatus: {},
  revokeError: {},
};

const memberSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    clearInviteError: (state) => {
      state.inviteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceMembers.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        // Drop the previous workspace's rows immediately so a slow request
        // can't show one workspace's members under another's name.
        if (state.workspaceId !== action.meta.arg) {
          state.workspaceId = action.meta.arg;
          state.members = [];
          state.invites = [];
        }
      })
      .addCase(fetchWorkspaceMembers.fulfilled, (state, action) => {
        state.workspaceId = action.payload.workspaceId;
        state.members = action.payload.members;
        state.invites = action.payload.invites;
        state.status = "succeeded";
      })
      .addCase(fetchWorkspaceMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to load members";
      })
      .addCase(sendInvitation.pending, (state) => {
        state.inviteStatus = "loading";
        state.inviteError = null;
      })
      .addCase(sendInvitation.fulfilled, (state, action) => {
        state.inviteStatus = "succeeded";
        state.invites.push(action.payload);
      })
      .addCase(sendInvitation.rejected, (state, action) => {
        state.inviteStatus = "failed";
        state.inviteError =
          (action.payload as string) ?? "Failed to send invitation";
      })
      .addCase(revokeInvitation.pending, (state, action) => {
        state.revokeStatus[action.meta.arg.invitationId] = "loading";
        delete state.revokeError[action.meta.arg.invitationId];
      })
      .addCase(revokeInvitation.fulfilled, (state, action) => {
        state.invites = state.invites.filter((i) => i.id !== action.payload);
        delete state.revokeStatus[action.payload];
      })
      .addCase(revokeInvitation.rejected, (state, action) => {
        const { invitationId } = action.meta.arg;
        state.revokeStatus[invitationId] = "failed";
        state.revokeError[invitationId] =
          (action.payload as string) ?? "Failed to revoke invitation";
      });
  },
});

export const { clearInviteError } = memberSlice.actions;

export default memberSlice.reducer;
