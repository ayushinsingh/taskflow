import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { Invitation } from "../../types/api/invitation.types";
import type { LoadStatus } from "../../types/normalized.type";
import { acceptInvitation, declineInvitation, fetchInvitations } from "../thunks/invitationThunks";

interface InvitationState {
  invitations: Invitation[];
  status: LoadStatus;
  actionStatus: Record<string, LoadStatus>;
  actionError: Record<string, string>;
  error: null | string;
}

const initialState: InvitationState = {
  invitations: [],
  status: "idle",
  actionStatus: {},
  actionError: {},
  error: null
};

const invitationSlice = createSlice({
  name: "invitations",
  initialState:initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvitations.pending, (state) => {
      state.status = "loading";
      state.error = null;
    }).addCase(fetchInvitations.fulfilled, (state, action) => {
      state.invitations = action.payload;
      state.status='succeeded';
    }).addCase(fetchInvitations.rejected, (state, action) => {
      state.error = action.payload as string;
      state.status = "failed";
    }).addMatcher(isAnyOf(acceptInvitation.pending, declineInvitation.pending), (state, action) => {
      state.actionStatus[action.meta.arg] = "loading";
      delete state.actionError[action.meta.arg];
    }).addMatcher(isAnyOf(acceptInvitation.fulfilled, declineInvitation.fulfilled), (state, action) => {
      state.invitations = state.invitations.filter((i) => i.id !== action.meta.arg);
      delete state.actionStatus[action.meta.arg];
    }).addMatcher(isAnyOf(acceptInvitation.rejected, declineInvitation.rejected), (state, action) => {
      state.actionStatus[action.meta.arg] = "failed";
      state.actionError[action.meta.arg] = action.payload as string;
    })
  }
})

export default invitationSlice.reducer;
