import type {
  CreateInvitationResponse,
  MembersResponse,
  WorkspaceInvitesResponse,
} from "../types/api/member.types";
import type { Role } from "../types/api/invitation.types";
import type {
  CreateWorkspaceResponse,
  WorkspacesResponse,
} from "../types/api/workspace.types";
import api from "./api";

export const workspaceService = {
  getWorkspaces: async (): Promise<WorkspacesResponse> => {
    const response = await api.get("/api/workspaces");
    return response.data;
  },
  createWorkspace: async (workspaceData: {
    name: string;
  }): Promise<CreateWorkspaceResponse> => {
    const response = await api.post("/api/workspaces", workspaceData);
    return response.data;
  },
  getMembers: async (workspaceId: string): Promise<MembersResponse> => {
    const response = await api.get(`/api/workspaces/${workspaceId}/members`);
    return response.data;
  },
  getPendingInvites: async (
    workspaceId: string,
  ): Promise<WorkspaceInvitesResponse> => {
    const response = await api.get(
      `/api/workspaces/${workspaceId}/invitations`,
    );
    return response.data;
  },
  sendInvitation: async (
    workspaceId: string,
    invitation: { email: string; role: Role },
  ): Promise<CreateInvitationResponse> => {
    const response = await api.post(
      `/api/workspaces/${workspaceId}/invitations`,
      invitation,
    );
    return response.data;
  },
  // Returns only { message: "Success" }, so callers keep hold of the id.
  revokeInvitation: async (workspaceId: string, invitationId: string) => {
    const response = await api.delete(
      `/api/workspaces/${workspaceId}/invitations/${invitationId}`,
    );
    return response.data;
  },
};
