export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export interface NormalizedWorkspace {
  id: string;
  name: string;
  boardIds: string[];
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
  activeBoardId: string;
  activeTaskId: string | null;
}