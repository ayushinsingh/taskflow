import type { InvitationStatus, Role } from "./invitation.types";

/**
 * A row from GET /api/workspaces/:workspaceId/members. `id` is the membership
 * id, not the user id -- both are present and they are not interchangeable.
 */
export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: Role;
  createdAt: string;
  user: { name: string; email: string };
}

export interface MembersResponse {
  memberships: WorkspaceMember[];
}

/**
 * A pending invitation *sent* for a workspace. Distinct from the `Invitation`
 * type, which is an invitation *received* by the signed-in user and carries the
 * joined `invitedBy` / `workspace` objects this one does not.
 */
export interface WorkspaceInvite {
  id: string;
  email: string;
  role: Role;
  status: InvitationStatus;
  createdAt: string;
  workspaceId: string;
  invitedById: string;
  invitedBy: { name: string; email: string };
}

export interface WorkspaceInvitesResponse {
  invites: WorkspaceInvite[];
}

export interface CreateInvitationResponse {
  invitation: WorkspaceInvite;
}
