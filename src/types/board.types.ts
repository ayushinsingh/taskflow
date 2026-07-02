export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subTasks: SubTask[];
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
}

export interface Workspace {
  id: string;
  name: string;
  boards: Board[];
}




