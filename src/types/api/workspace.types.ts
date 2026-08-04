import type { Role } from "./invitation.types";

interface Board {
  id: string;
  title: string
}

interface WorkspaceType {
  id: string;
  name: string;
  boards: Board[];
  /**
   * Filtered server-side to the requesting user, so this is always a
   * single-element array -- their own membership in this workspace.
   */
  memberships: { role: Role }[];
}

export interface WorkspacesResponse {
  workspaces: WorkspaceType[];
}

/**
 * POST /api/workspaces returns the freshly created workspace with its
 * memberships but *no* `boards` array -- unlike GET /api/workspaces. Hence a
 * separate type rather than reusing WorkspaceType.
 */
export interface CreateWorkspaceResponse {
  workspace: {
    id: string;
    name: string;
  };
}
