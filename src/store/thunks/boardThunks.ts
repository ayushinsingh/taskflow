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