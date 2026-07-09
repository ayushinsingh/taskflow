import type { Middleware } from "@reduxjs/toolkit";
import type { RootStateType } from "../index";
import {
  deleteWorkspace,
} from "../slices/workspaceSlice";
import {
  deleteBoard,
  deleteBoards,
} from "../slices/boardSlice";
import {
  deleteColumn,
  deleteColumns,
} from "../slices/columnSlice";
import { deleteTask, removeTasks } from "../slices/taskSlice";
import { removeSubTasks } from "../slices/subTaskSlice";

/**
 * The collectors below walk one layer of the normalized tree and gather every
 * descendant id. Each composes the layer beneath it, so a board collector
 * reuses the column collector, which reuses the task collector. Traversal
 * relies on the relational links being intact, so collectors must run against
 * the state snapshot taken *before* the container is removed.
 */
const collectTaskDescendants = (state: RootStateType, taskIds: string[]) => {
  const subTaskIds: string[] = [];
  for (const taskId of taskIds) {
    const task = state.tasks.entities[taskId];
    if (!task) continue;
    subTaskIds.push(...task.subTaskIds);
  }
  return { subTaskIds };
};

const collectColumnDescendants = (
  state: RootStateType,
  columnIds: string[],
) => {
  const taskIds: string[] = [];
  for (const columnId of columnIds) {
    const column = state.columns.entities[columnId];
    if (!column) continue;
    taskIds.push(...column.taskIds);
  }
  const { subTaskIds } = collectTaskDescendants(state, taskIds);
  return { taskIds, subTaskIds };
};

const collectBoardDescendants = (state: RootStateType, boardIds: string[]) => {
  const columnIds: string[] = [];
  for (const boardId of boardIds) {
    const board = state.boards.entities[boardId];
    if (!board) continue;
    columnIds.push(...board.columnIds);
  }
  const { taskIds, subTaskIds } = collectColumnDescendants(state, columnIds);
  return { columnIds, taskIds, subTaskIds };
};

/**
 * A deleted child leaves a stale id inside its parent's reference array. The
 * child entities don't carry a back-pointer to their parent, so we locate the
 * owner by scanning the parent slice for the one still referencing the child.
 */
const findWorkspaceOwningBoard = (state: RootStateType, boardId: string) =>
  state.workspaces.ids.find((id) =>
    state.workspaces.entities[id]?.boardIds.includes(boardId),
  );

const findBoardOwningColumn = (state: RootStateType, columnId: string) =>
  state.boards.ids.find((id) =>
    state.boards.entities[id]?.columnIds.includes(columnId),
  );

const findColumnOwningTask = (state: RootStateType, taskId: string) =>
  state.columns.ids.find((id) =>
    state.columns.entities[id]?.taskIds.includes(taskId),
  );

/**
 * Garbage-collects the entity tree when a container is deleted:
 *   - deleteWorkspace -> its boards, columns, tasks, subtasks
 *   - deleteBoard     -> its columns, tasks, subtasks
 *   - deleteColumn    -> its tasks, subtasks
 *   - deleteTask      -> its subtasks
 * The snapshot is read *before* `next(action)` removes the container, so the
 * child links are still present while we gather the ids to purge.
 */
export const cascadeDeleteMiddleware: Middleware =
  (storeApi) => (next) => (action) => {
    const state = storeApi.getState() as RootStateType;

    if (deleteWorkspace.match(action)) {
      const workspace = state.workspaces.entities[action.payload];
      if (workspace) {
        const boardIds = workspace.boardIds ?? [];
        const { columnIds, taskIds, subTaskIds } = collectBoardDescendants(
          state,
          boardIds,
        );
        storeApi.dispatch(removeSubTasks(subTaskIds));
        storeApi.dispatch(removeTasks(taskIds));
        storeApi.dispatch(deleteColumns(columnIds));
        storeApi.dispatch(deleteBoards(boardIds));
      }
    }

    if (deleteBoard.match(action)) {
      const boardId = action.payload;
      if (state.boards.entities[boardId]) {
        const { columnIds, taskIds, subTaskIds } = collectBoardDescendants(
          state,
          [boardId],
        );
        storeApi.dispatch(removeSubTasks(subTaskIds));
        storeApi.dispatch(removeTasks(taskIds));
        storeApi.dispatch(deleteColumns(columnIds));
      }
    }

    if (deleteColumn.match(action)) {
      const columnId = action.payload;
      if (state.columns.entities[columnId]) {
        const { taskIds, subTaskIds } = collectColumnDescendants(state, [
          columnId,
        ]);
        storeApi.dispatch(removeSubTasks(subTaskIds));
        storeApi.dispatch(removeTasks(taskIds));
      }
    }

    if (deleteTask.match(action)) {
      const taskId = action.payload;
      if (state.tasks.entities[taskId]) {
        const { subTaskIds } = collectTaskDescendants(state, [taskId]);
        storeApi.dispatch(removeSubTasks(subTaskIds));
      }
    }

    return next(action);
  };
