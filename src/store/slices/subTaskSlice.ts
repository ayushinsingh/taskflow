import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { NormalizedSubTask } from "../../types/normalized.type";
import type { RootState } from "../index";
import { initalNormalizedState } from "../../data/normalizedMockData";
import { fetchBoardWithId } from "../thunks/boardThunks";

const subTasksAdapter = createEntityAdapter<NormalizedSubTask>();

const initialState = subTasksAdapter.setAll(
  subTasksAdapter.getInitialState(),
  initalNormalizedState.subTasks.entities as Record<string, NormalizedSubTask>,
);

export const subTaskSlice = createSlice({
  name: "subTasks",
  initialState,
  reducers: {
    addSubTask: subTasksAdapter.addOne,
    toggleSubTask: (state, action: PayloadAction<string>) => {
      const subTaskId = action.payload;
      const subTask = state.entities[subTaskId];
      if (subTask) {
        subTask.isCompleted = !subTask.isCompleted;
      }
    },
    removeSubTasks: subTasksAdapter.removeMany,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardWithId.fulfilled, (state, action) => {
      subTasksAdapter.upsertMany(state, action.payload.subtasks)
    })
  }
});

export const { addSubTask, toggleSubTask, removeSubTasks } =
  subTaskSlice.actions;

export const subTaskSelectors = subTasksAdapter.getSelectors<RootState>(
  (state) => state.subTasks,
);
export default subTaskSlice.reducer;
