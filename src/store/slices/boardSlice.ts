import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { NormalizedBoard } from "../../types/normalized.type";
import type { RootState } from "../index";
import { initalNormalizedState } from "../../data/normalizedMockData";

const boardsAdapter = createEntityAdapter<NormalizedBoard>();

const initialState = boardsAdapter.setAll(
  boardsAdapter.getInitialState({
    activeBoardId: initalNormalizedState.activeBoardId,
  }),
  initalNormalizedState.boards.entities as Record<string, NormalizedBoard>,
);

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
    deleteBoard: boardsAdapter.removeOne,
    changeBoard: (state, action: PayloadAction<string>) => {
      state.activeBoardId = action.payload;
    },
    linkColumnToBoard: (
      state,
      action: PayloadAction<{ boardId: string; columnId: string }>,
    ) => {
      const { boardId, columnId } = action.payload;
      const board = state.entities[boardId];
      if (board) {
        board.columnIds.push(columnId);
      }
    },
    unlinkColumnFromBoard: (
      state,
      action: PayloadAction<{ boardId: string; columnId: string }>,
    ) => {
      const { boardId, columnId } = action.payload;
      const board = state.entities[boardId];
      if (board) {
        board.columnIds = board.columnIds.filter((id) => id !== columnId);
      }
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
      if(!board) return;
      const columnId = board.columnIds[sourceIndex];
      board.columnIds.splice(sourceIndex, 1);
      board.columnIds.splice(destinationIndex, 0, columnId);
    }
  },
});

export const {
  addBoard,
  updateBoardTitle,
  deleteBoard,
  changeBoard,
  linkColumnToBoard,
  unlinkColumnFromBoard,
  moveColumnLane
} = boardSlice.actions;

export const boardSelectors = boardsAdapter.getSelectors<RootState>(
  (state) => state.boards,
);

export default boardSlice.reducer;
