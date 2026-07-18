import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { NormalizedColumn } from "../../types/normalized.type";
import type { RootState } from "../index";
import { initalNormalizedState } from "../../data/normalizedMockData";
import { createColumn, createTask, deleteTask, fetchBoardWithId, updateColumn } from "../thunks/boardThunks";

const columnsAdapter = createEntityAdapter<NormalizedColumn>();
const initialState = columnsAdapter.setAll(
  columnsAdapter.getInitialState(),
  initalNormalizedState.columns.entities as Record<string, NormalizedColumn>,
);

export const columnSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    deleteColumns: columnsAdapter.removeMany,
    moveTaskCard: (
      state,
      action: PayloadAction<{
        sourceColumnId: string;
        destinationColumnId: string;
        sourceIndex: number;
        destinationIndex: number;
      }>,
    ) => {
      const {
        sourceColumnId,
        destinationColumnId,
        sourceIndex,
        destinationIndex,
      } = action.payload;

      const sourceColumn = state.entities[sourceColumnId];

      const destinationColumn = state.entities[destinationColumnId];
      const taskId = sourceColumn.taskIds[sourceIndex];

      if (!sourceColumn || !destinationColumn) return;

      if (sourceColumnId === destinationColumnId) {
        const updatedTaskIds = [...sourceColumn.taskIds];
        updatedTaskIds.splice(sourceIndex, 1);
        updatedTaskIds.splice(destinationIndex, 0, taskId);
        sourceColumn.taskIds = updatedTaskIds;
      } else {
        sourceColumn.taskIds.splice(sourceIndex, 1);
        destinationColumn.taskIds.splice(destinationIndex, 0, taskId);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardWithId.fulfilled, (state, action) => {
      columnsAdapter.upsertMany(state, action.payload.columns)
    }).addCase(createColumn.fulfilled, (state, action) => {
      const { column } = action.payload;
      columnsAdapter.addOne(state, column);
    }).addCase(updateColumn.fulfilled, (state, action) => {
      const {id, title} = action.payload;
      columnsAdapter.updateOne(state, { id, changes: { title } });
    }).addCase(createTask.fulfilled, (state, action) => {
      const {columnId, task} = action.payload;
      const column = state.entities[columnId];
      if (column) {
        column.taskIds.push(task.id);
      }
    }).addCase(deleteTask.fulfilled, (state, action) => {
      const { columnId, taskId } = action.payload;
      const column = state.entities[columnId];
      if (column) {
        column.taskIds = column.taskIds.filter((id) => id !== taskId);
      }
    })
  }
});

export const {
  deleteColumns,
  moveTaskCard,
} = columnSlice.actions;
export const columnSelectors = columnsAdapter.getSelectors<RootState>(
  (state) => state.columns,
);

export default columnSlice.reducer;
