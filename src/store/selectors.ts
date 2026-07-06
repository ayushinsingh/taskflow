import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./index";

const selectBoards = (state: RootState) => state.boards;
const selectColumns = (state: RootState) => state.columns;
const selectTasks = (state: RootState) => state.tasks;
const selectSubTasks = (state: RootState) => state.subTasks;

export const selectActiveBoardId = (state: RootState) =>
  state.boards.activeBoardId;

export const selectActiveBoard = createSelector(
  [selectBoards, selectActiveBoardId],
  (boards, activeId) => {
    if(!activeId) return undefined;
    return boards.entities[activeId]
  },
);

export const selectActiveBoardColumns = createSelector(
  [selectActiveBoard, selectColumns],
  (activeBoard, columns) => {
    if (!activeBoard) return [];
    return activeBoard.columnIds
      .map((columnId) => columns.entities[columnId])
      .filter((col): col is NonNullable<typeof col> => !!col);
  },
);

const selectActiveTaskIds = createSelector(
  [selectActiveBoardColumns],
  (activeColumns) => activeColumns.flatMap((col) => col.taskIds),
);

export const selectBoardMetrics = createSelector(
  [selectActiveTaskIds, selectTasks, selectSubTasks],
  (activeTaskIds, tasks, subTasks) => {
    const totalTasks = activeTaskIds.length;
    const activeSubTaskIds = activeTaskIds.flatMap(
      (taskId) => tasks.entities[taskId].subTaskIds,
    );
    const totalSubTasks = activeSubTaskIds.length;
    const completedSubTasks = activeSubTaskIds.filter(
      (subTaskId) => subTasks.entities[subTaskId].isCompleted,
    ).length;
    const completionPercentage =
      totalSubTasks > 0
        ? Math.round((completedSubTasks / totalSubTasks) * 100)
        : 0;
    return {
      totalTasks,
      totalSubTasks,
      completedSubTasks,
      completionPercentage,
    };
  },
);
