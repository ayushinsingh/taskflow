import {
  createSlice,
  createEntityAdapter,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { NormalizedTask } from "../../types/normalized.type";
import type { RootState } from "../index";
import { initalNormalizedState } from "../../data/normalizedMockData";

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
    updateTask: (
      state,
      action: PayloadAction<{
        taskId: string;
        changes: Partial<NormalizedTask>;
      }>,
    ) => {
      const { taskId, changes } = action.payload;
      tasksAdapter.updateOne(state, { id: taskId, changes });
    },
    deleteTask: tasksAdapter.removeOne,
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
});

export const { addTask, updateTask, deleteTask, removeTasks, openTaskInspector, closeTaskInspector, linkSubTaskToTask } =
  taskSlice.actions;

export const taskSelectors = tasksAdapter.getSelectors<RootState>(
  (state) => state.tasks,
);
export default taskSlice.reducer;
