import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { NormalizedColumn } from "../../types/normalized.type";
import type { RootState } from "../index";
import { initalNormalizedState } from "../../data/normalizedMockData";

const columnsAdapter = createEntityAdapter<NormalizedColumn>();
const initialState = columnsAdapter.setAll(
  columnsAdapter.getInitialState(),
  initalNormalizedState.columns.entities,
);

export const columnSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    addColumn: columnsAdapter.addOne,
    updateColumnTitle: (
      state,
      action: PayloadAction<{ columnId: string; title: string }>,
    ) => {
      const { columnId, title } = action.payload;
      columnsAdapter.updateOne(state, { id: columnId, changes: { title } });
    },
    deleteColumn: columnsAdapter.removeOne,
    linkTaskToColumn: (
      state,
      action: PayloadAction<{ columnId: string; taskId: string }>,
    ) => {
      const { columnId, taskId } = action.payload;
      const column = state.entities[columnId];
      if (column) {
        column.taskIds.push(taskId);
      }
    },
    unlinkTaskFromColumn: (
      state,
      action: PayloadAction<{ columnId: string; taskId: string }>,
    ) => {
      const { columnId, taskId } = action.payload;
      const column = state.entities[columnId];
      if (column) {
        column.taskIds = column.taskIds.filter((id) => id !== taskId);
      }
    },
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

      if (!sourceColumn || !deleteColumn) return;

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
});

export const {
  addColumn,
  updateColumnTitle,
  deleteColumn,
  linkTaskToColumn,
  unlinkTaskFromColumn,
  moveTaskCard,
} = columnSlice.actions;
export const columnSelectors = columnsAdapter.getSelectors<RootState>(
  (state) => state.columns,
);

export default columnSlice.reducer;
