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