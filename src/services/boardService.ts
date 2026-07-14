import type { WorkspacesResponse } from "../types/api/workspace.types";
import type { Priority } from "../types/normalized.type";
import api from "./api";

export const boardService = {
  getWorkspaces: async (): Promise<WorkspacesResponse> => {
    const response = await api.get("/workspaces");
    return response.data;
  },
  getBoard: async (boardId: string) => {
    const reponse = await api.get(`/boards/${boardId}`);
    return reponse.data;
  },
  createBoard: async (boardData: {title: string; workspaceId: string;}) => {
    const response = await api.post('/boards', boardData);
    return response.data;
  },
  deleteBoard: async (boardId: string) => {
    const response = await api.delete(`/boards/${boardId}`);
    return response.data;
  },
  createColumn: async (columnData: { title: string; boardId: string }) => {
    const response = await api.post("/boards/columns", columnData);
    return response.data;
  },
  updateColumn: async (columnData: {title: string, columnId: string}) => {
    const response = await api.patch("/boards/columns", columnData);
    return response.data;
  },
  reorderColumns: async (columns: Array<{id: string, position: number}>) => {
    const response = await api.patch("/boards/columns/reorder", {columns});
    return response.data;
  },
  deleteColumn: async (columnId: string) => {
    const response = await api.delete(`/boards/columns/${columnId}`);
    return response.data;
  },
  createTask: async (boardData: {title: string, columnId: string; description?: string; priority?: Priority, }) => {
    const response = await api.post("/boards/tasks", boardData);
    return response.data;
  },
  updateTask: async (boardData: {title: string, taskId: string; description?: string; priority?: Priority, }) => {
    const response = await api.patch("/boards/tasks", boardData);
    return response.data;
  },
  deleteTask: async (taskId: string) => {
    const response = await api.delete(`/boards/tasks/${taskId}`);
    return response.data;
  },
  reorderTasks: async (tasks: Array<{id: string; position: number; columnId: string}>) => {
    const response = await api.patch("/boards/tasks/reorder", {tasks});
    return response.data;
  },
  createSubtask: async (subtaskData: {title: string; taskId: string}) => {
    const response = await api.post("/boards/subtasks", subtaskData);
    return response.data;
  },
  toggleSubtask: async (subtaskId: string) => {
    const response = await api.patch(`/boards/subtasks/${subtaskId}/toggle`);
    return response.data;
  }
}