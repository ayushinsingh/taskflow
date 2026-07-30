import { createAsyncThunk } from "@reduxjs/toolkit";
import { workspaceService } from "../../services/workspaceService";
import type { RootState } from "../index";
import type {
  NormalizedWorkspace,
  NormalizedBoard,
} from "../../types/normalized.type";
import { getErrorMessage } from "../../utils/getErrorMessage";

/** The nested shape GET /api/workspaces returns. */
interface RawBoardSummary {
  id: string;
  title: string;
}
interface RawWorkspace {
  id: string;
  name: string;
  boards: RawBoardSummary[];
}

export interface FetchWorkspacesResult {
  workspaces: NormalizedWorkspace[];
  boards: NormalizedBoard[];
}

export const fetchWorkspaces = createAsyncThunk(
  "app/fetchWorkspaces",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await workspaceService.getWorkspaces();
      const rawWorkspaces: RawWorkspace[] = resp.workspaces;

      const workspaces: NormalizedWorkspace[] = rawWorkspaces.map((ws) => ({
        id: ws.id,
        name: ws.name,
        boardIds: ws.boards.map((b) => b.id),
      }));

      const boards: NormalizedBoard[] = rawWorkspaces.flatMap((ws) =>
        ws.boards.map((b) => ({ id: b.id, title: b.title, columnIds: [] })),
      );

      return { workspaces, boards } satisfies FetchWorkspacesResult;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch workspaces"),
      );
    }
  },
  {
    condition: (_arg, { getState }) => {
      const { status } = (getState() as RootState).workspaces;
      return status !== "loading";
    },
  },
);

export const createWorkspace = createAsyncThunk(
  "app/createWorkspace",
  async (workspaceData: { name: string }, { rejectWithValue }) => {
    try {
      const resp = await workspaceService.createWorkspace(workspaceData);
      // POST /api/workspaces returns memberships but no boards, so boardIds
      // starts empty rather than being mapped off the response.
      const workspace: NormalizedWorkspace = {
        id: resp.workspace.id,
        name: resp.workspace.name,
        boardIds: [],
      };
      return workspace;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to create workspace"),
      );
    }
  },
);
