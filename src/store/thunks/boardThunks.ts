import { createAsyncThunk } from "@reduxjs/toolkit";
import { boardService } from "../../services/boardService";
import type { RootState } from "../index";
import type {
  NormalizedWorkspace,
  NormalizedBoard,
  NormalizedTask,
  NormalizedColumn,
  Priority,
  NormalizedSubTask,
} from "../../types/normalized.type";

/**
 * The nested shape the backend returns from GET /workspaces.
 * Adjust these field names if your Express response differs.
 */
interface RawSummary {
  id: string;
  title: string;
}
interface RawWorkspace {
  id: string;
  name: string;
  boards: RawSummary[];
}

interface RawSubtask extends RawSummary {
  isCompleted: boolean;
}

interface RawTask extends RawSummary {
  priority: Priority;
  description: string;
  subtasks: RawSubtask[];
}

interface RawColumns extends RawSummary {
  id: string;
  title: string;
  tasks: RawTask[]
}

interface RawBoard extends RawSummary {
  columns: RawColumns[];
}

interface CreateBoardResult extends RawSummary {
  workspaceId: string
}

interface CreateColumnResult extends RawSummary {
  boardId: string;
}
interface CreateSubtaskResult extends RawSummary {
  taskId: string;
  isCompleted: boolean;
}
interface CreateTaskResult extends RawSummary {
  columnId: string;
  priority: Priority;
  description: string;
}

export interface FetchWorkspacesResult {
  workspaces: NormalizedWorkspace[];
  boards: NormalizedBoard[];
  activeBoardId: string | null;
}

export const fetchWorkspaces = createAsyncThunk(
  "app/fetchWorkspaces",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await boardService.getWorkspaces();
      const rawWorkspaces: RawWorkspace[] = resp.workspaces;

      const workspaces: NormalizedWorkspace[] = rawWorkspaces.map((ws) => ({
        id: ws.id,
        name: ws.name,
        boardIds: ws.boards.map((b) => b.id),
      }));

      const boards: NormalizedBoard[] = rawWorkspaces.flatMap((ws) =>
        ws.boards.map((b) => ({ id: b.id, title: b.title, columnIds: [] })),
      );

      const activeBoardId = boards[0]?.id ?? null;

      return { workspaces, boards, activeBoardId } satisfies FetchWorkspacesResult;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch workspaces";
      return rejectWithValue(message);
    }
  },
  {
    condition: (_arg, { getState }) => {
      const { status } = (getState() as RootState).workspaces;
      return status !== "loading";
    },
  },
);

export const fetchBoardWithId = createAsyncThunk(
  "app/fetchBoardWithId",
  async (id: string, { rejectWithValue }) => {
    try {
      const board: RawBoard = await boardService.getBoard(id);
      const columns: NormalizedColumn[] = board.columns.map((column) => ({ id: column.id, title: column.title, taskIds: column.tasks.map(task => task.id) }));
      const tasks: NormalizedTask[] = board.columns.flatMap((column) => column.tasks.map(task => ({ id: task.id, title: task.title, priority: task.priority, description: task.description, subTaskIds: task.subtasks.map((subtask) => subtask.id) })));
      const subtasks: NormalizedSubTask[] = board.columns.flatMap((column) => column.tasks.flatMap(task => task.subtasks.map((subtask) => ({id: subtask.id, title: subtask.title, isCompleted: subtask.isCompleted}))));

      return {
        board: {id: board.id, title: board.title, columnIds: board.columns.map((c) => c.id)},
        columns,
        tasks,
        subtasks
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch board";
      return rejectWithValue(message);
    }
  },
  {
    condition: (_arg, { getState }) => {
      const { status } = (getState() as RootState).boards;
      return status !== "loading";
    },
  },
);

export const createBoard = createAsyncThunk("app/createBoard", async (boardData: {title: string; workspaceId: string;}, { rejectWithValue }) => {
  try {
    const newBoard: CreateBoardResult = await boardService.createBoard(boardData);
    const normalizedBoard: NormalizedBoard = {
      id: newBoard.id,
      title: newBoard.title,
      columnIds: []
    }
    return {workspaceId: newBoard.workspaceId, board: normalizedBoard};
  } catch (error) {
    const message = error instanceof Error ? error.message: "Failed to create board";
    return rejectWithValue(message);
  }
})

export const deleteBoard = createAsyncThunk("app/deleteBoard", async (boardData: {boardId: string; workspaceId: string;}, { rejectWithValue }) => {
  try {
    await boardService.deleteBoard(boardData.boardId);
    return boardData;
  } catch (error) {
    const message = error instanceof Error ? error.message: "Failed to create board";
    return rejectWithValue(message);
  }
})

export const createColumn = createAsyncThunk("app/createColumn", async (columnData: {title: string; boardId: string;}, { rejectWithValue }) => {
  try {
    const newBoard: CreateColumnResult = await boardService.createColumn(columnData);
    const normalizedColumn: NormalizedColumn = {
      id: newBoard.id,
      title: newBoard.title,
      taskIds: []
    }
    return {boardId: newBoard.boardId, column: normalizedColumn};
  } catch (error) {
    const message = error instanceof Error ? error.message: "Failed to create board";
    return rejectWithValue(message);
  }
})

export const deleteColumn = createAsyncThunk("app/deleteColumn", async (columnData: {boardId: string; columnId: string;}, { rejectWithValue }) => {
  try {
    await boardService.deleteColumn(columnData.columnId);
    return columnData;
  } catch (error) {
    const message = error instanceof Error ? error.message: "Failed to create board";
    return rejectWithValue(message);
  }
})

export const updateColumn = createAsyncThunk("app/updateColumn", async (columnData: {columnId: string; title: string}, {rejectWithValue}) => {
  try{
    const resp: CreateColumnResult = await boardService.updateColumn(columnData);
    return resp;
  } catch(error) {
    const message = error  instanceof Error ?  error.message : "Error updating column title";
    return rejectWithValue(message);
  }
})

export const createTask = createAsyncThunk("app/createTask", async (taskData: {title: string; columnId: string;}, { rejectWithValue }) => {
  try {
    const newTask: CreateTaskResult = await boardService.createTask(taskData);
    const normalizedTask: NormalizedTask = {
      id: newTask.id,
      title: newTask.title,
      priority: newTask.priority,
      description: newTask.description,
      subTaskIds: []
    }
    return {columnId: newTask.columnId, task: normalizedTask};
  } catch (error) {
    const message = error instanceof Error ? error.message: "Failed to create board";
    return rejectWithValue(message);
  }
})

export const updateTask = createAsyncThunk("app/updateTask", async (taskData: {taskId: string; changes: Partial<Omit<NormalizedTask,"subTaskIds">>}, { rejectWithValue }) => {
  try {
    const updatedTask: CreateTaskResult = await boardService.updateTask(taskData.taskId, taskData.changes);
    const normalizedTask: Omit<NormalizedTask, "subTaskIds"> = {
      id: updatedTask.id,
      title: updatedTask.title,
      priority: updatedTask.priority,
      description: updatedTask.description,
    }
    return normalizedTask;
  } catch (error) {
    const message = error instanceof Error ? error.message: "Failed to create board";
    return rejectWithValue(message);
  }
})

export const deleteTask = createAsyncThunk("app/deleteTask", async (taskData:{ taskId: string; columnId: string}, { rejectWithValue }) => {
  try {
    await boardService.deleteTask(taskData.taskId);
    return taskData;
  }catch(error) {
    const message = error instanceof Error ? error.message: "Error while deleting task";
    return rejectWithValue(message);
  }
})

export const createSubtask = createAsyncThunk("app/createSubtask", async (subtaskData: {title: string; taskId: string}, { rejectWithValue }) => {
  try {
    const resp: CreateSubtaskResult = await boardService.createSubtask(subtaskData);
    const subtask: NormalizedSubTask = {
      id: resp.id,
      title: resp.title,
      isCompleted: resp.isCompleted
    }
    return {taskId: resp.taskId, subtask};
  }catch(error) {
    const message = error instanceof Error ? error.message: "Error while creating subtask";
    return rejectWithValue(message);
  }
});

export const toggleSubtask = createAsyncThunk("app/toggleSubtask", async (subtaskId: string, { rejectWithValue }) => {
  try {
    await boardService.toggleSubtask(subtaskId);
    return subtaskId;
  } catch (error) {
    const message = error instanceof Error ? error.message: "Error while toggling subtask";
    return rejectWithValue(message);
  }
})
