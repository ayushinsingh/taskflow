import { createAsyncThunk } from "@reduxjs/toolkit";
import { workspaceService } from "../../services/workspaceService";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { RootState } from "../index";
import type { Role } from "../../types/api/invitation.types";

/**
 * Members and pending invites always render together on the members page, so
 * they load as one unit behind a single status. One request failing fails both,
 * which is the honest outcome -- a half-rendered page would be worse.
 */
export const fetchWorkspaceMembers = createAsyncThunk(
  "app/fetchWorkspaceMembers",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const [members, invites] = await Promise.all([
        workspaceService.getMembers(workspaceId),
        workspaceService.getPendingInvites(workspaceId),
      ]);
      return {
        workspaceId,
        members: members.memberships,
        invites: invites.invites,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load members"));
    }
  },
  {
    condition: (workspaceId, { getState }) => {
      const members = (getState() as RootState).members;
      // Block only a duplicate request for the *same* workspace. Guarding on
      // status alone would drop a legitimate fetch when switching workspaces
      // while one is still in flight.
      return !(
        members.status === "loading" && members.workspaceId === workspaceId
      );
    },
  },
);

export const sendInvitation = createAsyncThunk(
  "app/sendInvitation",
  async (
    args: { workspaceId: string; email: string; role: Role },
    { rejectWithValue },
  ) => {
    try {
      const response = await workspaceService.sendInvitation(args.workspaceId, {
        email: args.email,
        role: args.role,
      });
      return response.invitation;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to send invitation"),
      );
    }
  },
);

export const revokeInvitation = createAsyncThunk(
  "app/revokeInvitation",
  async (
    args: { workspaceId: string; invitationId: string },
    { rejectWithValue },
  ) => {
    try {
      await workspaceService.revokeInvitation(args.workspaceId, args.invitationId);
      return args.invitationId;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to revoke invitation"),
      );
    }
  },
);
