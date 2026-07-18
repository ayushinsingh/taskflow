import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { NormalizedTask } from "../../types/normalized.type";
import type { RootState } from "../index";
import { initalNormalizedState } from "../../data/normalizedMockData";
import { createSubtask, createTask, deleteTask, fetchBoardWithId, updateTask } from "../thunks/boardThunks";

const tasksAdapter = createEntityAdapter<NormalizedTask>();

const initialState = tasksAdapter.setAll(
  tasksAdapter.getInitialState({
    activeTaskId: null as string | null,
  }),
  initalNormalizedState.tasks.entities as Record<string, NormalizedTask>,
);

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: tasksAdapter.addOne,
    removeTasks: tasksAdapter.removeMany,
    linkSubTaskToTask: (
      state,
      action: PayloadAction<{ taskId: string; subTaskId: string }>,
    ) => {
      const { taskId, subTaskId } = action.payload;
      const task = state.entities[taskId];
      if (task) {
        task.subTaskIds.push(subTaskId);
      }
    },
    openTaskInspector: (state, action: PayloadAction<string>) => {
      state.activeTaskId = action.payload;
    },
    closeTaskInspector: (state) => {
      state.activeTaskId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardWithId.fulfilled, (state, action) => {
      tasksAdapter.upsertMany(state, action.payload.tasks)
    }).addCase(createTask.fulfilled, (state, action) => {
      tasksAdapter.addOne(state, action.payload.task);
    }).addCase(updateTask.fulfilled, (state, action) => {
      const task = action.payload;
      tasksAdapter.updateOne(state, {id: task.id, changes: task});
    }).addCase(deleteTask.fulfilled, (state, action) => {
      const { taskId } = action.payload;
      tasksAdapter.removeOne(state, taskId);
    }).addCase(createSubtask.fulfilled, (state, action) => {
      const {taskId, subtask} = action.payload;
      const task = state.entities[taskId];
      if(task) {
        task.subTaskIds.push(subtask.id);
      }
    })
  }
});

export const { addTask, removeTasks, openTaskInspector, closeTaskInspector, linkSubTaskToTask } =
  taskSlice.actions;

export const taskSelectors = tasksAdapter.getSelectors<RootState>(
  (state) => state.tasks,
);
export const selectActiveTaskId = (state: RootState) => state.tasks.activeTaskId;
export default taskSlice.reducer;
