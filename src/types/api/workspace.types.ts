interface Board {
  id: string;
  title: string
}

interface WorkspaceType {
  id: string;
  name: string;
  boards: Board[];
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
