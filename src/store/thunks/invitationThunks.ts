import { createAsyncThunk } from "@reduxjs/toolkit";
import { invitationService } from "../../services/invitationService";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useAppDispatch, type RootState } from "..";
import { fetchWorkspaces } from "./workspaceThunks";

const dispatch = useAppDispatch();

export const fetchInvitations = createAsyncThunk("app/fetchInvitations", async (_, {rejectWithValue}) => {
  try {
    const response = await invitationService.getInvitations();
    return response.invitations;
  } catch(error) {
    return rejectWithValue(getErrorMessage(error, "Error while fetching invitations"));
  }
},
{
    condition: (_arg, { getState }) => {
      const { status } = (getState() as RootState).invitations;
      return status !== "loading";
    },
  },
)

export const acceptInvitation = createAsyncThunk("app/acceptInvitation", async (invitationId: string, {rejectWithValue}) => {
  try {
    const response = await invitationService.acceptInvitation(invitationId);
    dispatch(fetchWorkspaces());
    return response;
  } catch(error) {
    return rejectWithValue(getErrorMessage(error, "Error while accepting invitation"));
  }
})

export const declineInvitation = createAsyncThunk("app/declineInvitation", async (invitationId: string, {rejectWithValue}) => {
  try {
    const response = await invitationService.declineInvitation(invitationId);
    return response;
  } catch(error) {
    return rejectWithValue(getErrorMessage(error, "Error while declining invitation"));
  }
})