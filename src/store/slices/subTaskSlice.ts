import {
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import type { NormalizedSubTask } from "../../types/normalized.type";
import type { RootState } from "../index";
import { initalNormalizedState } from "../../data/normalizedMockData";
import { createSubtask, fetchBoardWithId, toggleSubtask } from "../thunks/boardThunks";

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
    removeSubTasks: subTasksAdapter.removeMany,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardWithId.fulfilled, (state, action) => {
      subTasksAdapter.upsertMany(state, action.payload.subtasks)
    }).addCase(createSubtask.fulfilled, (state, action) => {
      subTasksAdapter.addOne(state,action.payload.subtask);
    }).addCase(toggleSubtask.fulfilled, (state, action) => {
      const subtaskId = action.payload;
      const subTask = state.entities[subtaskId];
      if (subTask) {
        subTask.isCompleted = !subTask.isCompleted;
      }
    })
  }
});

export const { addSubTask, removeSubTasks } =
  subTaskSlice.actions;

export const subTaskSelectors = subTasksAdapter.getSelectors<RootState>(
  (state) => state.subTasks,
);
export default subTaskSlice.reducer;
