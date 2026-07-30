export type Role = "OWNER" | "ADMIN" | "MEMBER";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "DECLINED";

/**
 * Rows from GET /api/invitations. `createdAt` is a Prisma DateTime, which
 * arrives as an ISO string over JSON -- keep it a string and format on display.
 */
export interface Invitation {
  id: string;
  email: string;
  role: Role;
  status: InvitationStatus;
  createdAt: string;
  workspaceId: string;
  invitedBy: { name: string };
  workspace: { id: string; name: string };
}

export interface InvitationsResponse {
  invitations: Invitation[];
}
