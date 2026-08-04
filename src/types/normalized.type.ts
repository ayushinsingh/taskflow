import type { Role } from "./api/invitation.types";

// Matches the backend Prisma/Zod enum exactly -- the API is the source of truth.
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export interface NormalizedWorkspace {
  id: string;
  name: string;
  boardIds: string[];
  /** The signed-in user's own role in this workspace. Drives admin-only UI. */
  role: Role;
}
export interface NormalizedBoard {
  id: string;
  title: string;
  columnIds: string[];
}
export interface NormalizedColumn {
  id: string;
  title: string;
  taskIds: string[];
}

export interface NormalizedTask {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  subTaskIds: string[];
}

export interface NormalizedSubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface EntityState<T> {
  entities: { [id: string]: T };
  ids: string[];
}

export interface GlobalStateStore {
  workspaces: EntityState<NormalizedWorkspace>;
  boards: EntityState<NormalizedBoard>;
  columns: EntityState<NormalizedColumn>;
  tasks: EntityState<NormalizedTask>;
  subTasks: EntityState<NormalizedSubTask>;
  activeBoardId: string | null;
  activeTaskId: string | null;
}