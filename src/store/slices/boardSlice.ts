import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { NormalizedBoard, LoadStatus } from "../../types/normalized.type";
import type { RootState } from "../index";
import { createBoard, createColumn, deleteBoard, deleteColumn, fetchBoardWithId } from "../thunks/boardThunks";
import { fetchWorkspaces } from "../thunks/workspaceThunks";

const boardsAdapter = createEntityAdapter<NormalizedBoard>();

const initialState =
  boardsAdapter.getInitialState({
    activeBoardId: null as string | null,
    status: "idle" as LoadStatus,
    error: null as string | null,
  })

export const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    addBoard: boardsAdapter.addOne,
    updateBoardTitle: (
      state,
      action: PayloadAction<{ boardId: string; title: string }>,
    ) => {
      const { boardId, title } = action.payload;
      boardsAdapter.updateOne(state, { id: boardId, changes: { title } });
    },
    deleteBoards: boardsAdapter.removeMany,
    changeBoard: (state, action: PayloadAction<string | null>) => {
      state.activeBoardId = action.payload;
    },
    moveColumnLane: (
      state,
      action: PayloadAction<{
        boardId: string;
        sourceIndex: number;
        destinationIndex: number;
      }>
    ) => {
      const { boardId, sourceIndex, destinationIndex } = action.payload;
      const board = state.entities[boardId];
      if (!board) return;
      const columnId = board.columnIds[sourceIndex];
      board.columnIds.splice(sourceIndex, 1);
      board.columnIds.splice(destinationIndex, 0, columnId);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        const boards = action.payload.boards.map((board) => ({
          ...board,
          columnIds: state.entities[board.id]?.columnIds ?? board.columnIds,
        }));
        boardsAdapter.upsertMany(state, boards);
      })
      .addCase(fetchBoardWithId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBoardWithId.fulfilled, (state, action) => {
        boardsAdapter.upsertOne(state, action.payload.board);
        state.status = "succeeded";
      })
      .addCase(fetchBoardWithId.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch board";
      }).addCase(createBoard.fulfilled, (state, action) => {
        boardsAdapter.addOne(state, action.payload.board);
      }).addCase(deleteBoard.fulfilled, (state, action) => {
        boardsAdapter.removeOne(state, action.payload.boardId);
      }).addCase(createColumn.fulfilled, (state, action) => {
        const { boardId, column } = action.payload;
        const board = state.entities[boardId];
        if (board) {
          board.columnIds.push(column.id);
        }
      }).addCase(deleteColumn.fulfilled, (state, action) => {
        const { boardId, columnId } = action.payload;
        const board = state.entities[boardId];
        if (board) {
          board.columnIds = board.columnIds.filter((id) => id !== columnId);
        }
      })
  },
});

export const {
  addBoard,
  updateBoardTitle,
  deleteBoards,
  changeBoard,
  moveColumnLane
} = boardSlice.actions;

export const boardSelectors = boardsAdapter.getSelectors<RootState>(
  (state) => state.boards,
);

export default boardSlice.reducer;
