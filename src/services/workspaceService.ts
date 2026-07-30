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
};
