import { useCallback, useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { initalNormalizedState } from "./data/normalizedMockData";
import type {
  GlobalStateStore,
  NormalizedBoard,
  NormalizedColumn,
  NormalizedSubTask,
  NormalizedTask,
} from "./types/normalized.type";
import { Sidebar } from "./components/Sidebar";
import { BoardCanvas } from "./components/BoardCanvas";
import { BoardProvider } from "./context/BoardContext";
import { TaskInspectorModal } from "./components/TaskInspectorModal";

export default function App() {
  const [state, setState] = useState<GlobalStateStore>(() => {
    const localCache = localStorage.getItem("kanban_workspace_store");
    return localCache ? JSON.parse(localCache) : initalNormalizedState;
  });

  useEffect(() => {
    localStorage.setItem("kanban_workspace_store", JSON.stringify(state));
  }, [state]);

  const activeWorkspace = state.workspaces.entities[state.workspaces.ids[0]];

  const handleBoardChange = useCallback((boardId: string) => {
    setState((prevState) => ({ ...prevState, activeBoardId: boardId }));
  }, []);

  const handleAddTask = useCallback(
    (columnId: string, newTaskTitle: string) => {
      const newTask: NormalizedTask = {
        id: crypto.randomUUID(),
        title: newTaskTitle,
        description: "",
        priority: "medium",
        subTaskIds: [],
      };

      setState((prevState) => ({
        ...prevState,
        columns: {
          entities: {
            ...prevState.columns.entities,
            [columnId]: {
              ...prevState.columns.entities[columnId],
              taskIds: [
                ...prevState.columns.entities[columnId].taskIds,
                newTask.id,
              ],
            },
          },
          ids: prevState.columns.ids,
        },
        tasks: {
          entities: {
            ...prevState.tasks.entities,
            [newTask.id]: newTask,
          },
          ids: [...prevState.tasks.ids, newTask.id],
        },
      }));
    },
    [],
  );

  const moveTaskTraditional = useCallback(
    (
      state: GlobalStateStore,
      taskId: string,
      sourceColumnId: string,
      destColumnId: string,
      destIndex: number,
    ): GlobalStateStore => {
      const sourceColumn = state.columns.entities[sourceColumnId];
      const destColumn = state.columns.entities[destColumnId];
      const updatedSourceTaskIds = sourceColumn.taskIds.filter(
        (t) => t !== taskId,
      );
      const updatedDestTaskIds =
        sourceColumnId === destColumnId
          ? [...updatedSourceTaskIds]
          : [...destColumn.taskIds];
      updatedDestTaskIds.splice(destIndex, 0, taskId);

      return {
        ...state,
        columns: {
          entities: {
            ...state.columns.entities,
            [sourceColumnId]: {
              ...sourceColumn,
              taskIds: updatedSourceTaskIds,
            },
            [destColumnId]: { ...destColumn, taskIds: updatedDestTaskIds },
          },
          ids: state.columns.ids,
        },
      };
    },
    [],
  );

  const handleAddSubTask = (taskId: string, title: string) => {
    const newSubTask: NormalizedSubTask = {
      id: crypto.randomUUID(),
      title: title,
      isCompleted: false,
    };
    setState((prevState) => ({
      ...prevState,
      tasks: {
        entities: {
          ...prevState.tasks.entities,
          [taskId]: {
            ...prevState.tasks.entities[taskId],
            subTaskIds: [
              ...prevState.tasks.entities[taskId].subTaskIds,
              newSubTask.id,
            ],
          },
        },
        ids: prevState.tasks.ids,
      },
      subTasks: {
        entities: {
          ...prevState.subTasks.entities,
          [newSubTask.id]: newSubTask,
        },
        ids: [...prevState.subTasks.ids, newSubTask.id],
      },
    }));
  };

  const handleToggleSubTask = (subTaskId: string) => {
    setState((prevState) => ({
      ...prevState,
      subTasks: {
        entities: {
          ...prevState.subTasks.entities,
          [subTaskId]: {
            ...prevState.subTasks.entities[subTaskId],
            isCompleted: !prevState.subTasks.entities[subTaskId].isCompleted,
          },
        },
        ids: prevState.subTasks.ids,
      },
    }));
  };

  const moveColumn = (
    state: GlobalStateStore,
    activeBoardId: string,
    sourceIndex: number,
    destinationIndex: number,
  ): GlobalStateStore => {
    const columnIds = [...state.boards.entities[activeBoardId].columnIds];
    const [sourceColumnId] = columnIds.splice(sourceIndex, 1);
    columnIds.splice(destinationIndex, 0, sourceColumnId);
    return {
      ...state,
      boards: {
        entities: {
          ...state.boards.entities,
          [activeBoardId]: {
            ...state.boards.entities[activeBoardId],
            columnIds: columnIds,
          },
        },
        ids: state.boards.ids,
      },
    };
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.type === "COLUMN") {
      setState((prevState) =>
        moveColumn(
          prevState,
          prevState.activeBoardId,
          result.source.index,
          result.destination!.index,
        ),
      );
    } else {
      setState((prevState) =>
        moveTaskTraditional(
          prevState,
          result.draggableId,
          result.source.droppableId,
          result.destination!.droppableId,
          result.destination!.index,
        ),
      );
    }
  };

  const openTaskInspector = (id: string) => {
    setState((prevState) => ({ ...prevState, activeTaskId: id }));
  };

  const onUpdateTask = (taskId: string, updatedTask: NormalizedTask) => {
    setState((prevState) => ({
      ...prevState,
      tasks: {
        entities: { ...prevState.tasks.entities, [taskId]: updatedTask },
        ids: prevState.tasks.ids,
      },
    }));
  };

  const onClose = () => {
    setState((prevState) => ({ ...prevState, activeTaskId: null }));
  };

  const handleDeleteColumn = (columnId: string) => {
    setState((prevState) => {
      const updatedColumns = { ...prevState.columns.entities };
      delete updatedColumns[columnId];
      const updatedColumnIds = prevState.columns.ids.filter(
        (col) => col != columnId,
      );

      const prevTaskIds = prevState.columns.entities[columnId].taskIds;
      const updatedTaskIds = prevState.tasks.ids.filter(
        (t) => !prevTaskIds.includes(t),
      );
      const updatedTasks = { ...prevState.tasks.entities };
      let prevSubTaskIds: string[] = [];

      prevTaskIds.forEach((id) => {
        prevSubTaskIds = [
          ...prevSubTaskIds,
          ...prevState.tasks.entities[id].subTaskIds,
        ];
        delete updatedTasks[id];
      });

      const updatedSubTasks = { ...prevState.subTasks.entities };
      const updatedSubTaskIds = prevState.subTasks.ids.filter(
        (id) => !prevSubTaskIds.includes(id),
      );
      prevSubTaskIds.forEach((id) => {
        delete updatedSubTasks[id];
      });

      return {
        ...prevState,
        boards: {
          entities: {
            ...prevState.boards.entities,
            [prevState.activeBoardId]: {
              ...prevState.boards.entities[prevState.activeBoardId],
              columnIds: prevState.boards.entities[
                prevState.activeBoardId
              ].columnIds.filter((c) => c != columnId),
            },
          },
          ids: prevState.boards.ids,
        },
        columns: {
          entities: updatedColumns,
          ids: updatedColumnIds,
        },
        tasks: {
          entities: updatedTasks,
          ids: updatedTaskIds,
        },
        subTasks: {
          entities: updatedSubTasks,
          ids: updatedSubTaskIds,
        },
        activeTaskId:
          prevState.activeTaskId && prevTaskIds.includes(prevState.activeTaskId)
            ? null
            : prevState.activeTaskId,
      };
    });
  };
  const handleDeleteTask = (taskId: string, columnId: string) => {
    setState((prevState) => {
      const subTaskIds = prevState.tasks.entities[taskId].subTaskIds;
      const updatedTaskIds = prevState.tasks.ids.filter((t) => t != taskId);
      const updatedTasks = { ...prevState.tasks.entities };
      delete updatedTasks[taskId];
      const updatedSubTaskIds = prevState.subTasks.ids.filter(
        (id) => !subTaskIds.includes(id),
      );
      const updatedSubTasks = { ...prevState.subTasks.entities };
      subTaskIds.forEach((id) => {
        delete updatedSubTasks[id];
      });

      return {
        ...prevState,
        columns: {
          entities: {
            ...prevState.columns.entities,
            [columnId]: {
              ...prevState.columns.entities[columnId],
              taskIds: prevState.columns.entities[columnId].taskIds.filter(
                (t) => t != taskId,
              ),
            },
          },
          ids: prevState.columns.ids,
        },
        tasks: {
          entities: updatedTasks,
          ids: updatedTaskIds,
        },
        subTasks: {
          entities: updatedSubTasks,
          ids: updatedSubTaskIds,
        },
        activeTaskId:
          taskId === prevState.activeTaskId ? null : prevState.activeTaskId,
      };
    });
  };

  const handleCreateBoard = (title: string) => {
    const newBoard: NormalizedBoard = {
      id: crypto.randomUUID(),
      title: title,
      columnIds: [],
    };
    setState((prevState) => ({
      ...prevState,
      workspaces: {
        entities: {
          ...prevState.workspaces.entities,
          [prevState.workspaces.ids[0]]: {
            ...prevState.workspaces.entities[prevState.workspaces.ids[0]],
            boardIds: [
              ...prevState.workspaces.entities[prevState.workspaces.ids[0]]
                .boardIds,
              newBoard.id,
            ],
          },
        },
        ids: prevState.workspaces.ids,
      },
      boards: {
        ...prevState.boards,
        entities: {
          ...prevState.boards.entities,
          [newBoard.id]: newBoard,
        },
        ids: [...prevState.boards.ids, newBoard.id],
      },
      activeBoardId: newBoard.id,
    }));
  };

  const handleUpdateBoardTitle = (boardId: string, boardTitle: string) => {
    setState((prevState) => ({
      ...prevState,
      boards: {
        ...prevState.boards,
        entities: {
          ...prevState.boards.entities,
          [boardId]: {
            ...prevState.boards.entities[boardId],
            title: boardTitle,
          },
        },
      },
    }));
  };

  const handleDeleteBoard = (boardId: string) => {
    setState((prevState) => {
      const primaryWorkspaceId = prevState.workspaces.ids[0];
      const updatedBoardEntities = {...prevState.boards.entities};
      delete updatedBoardEntities[boardId];

      const updatedColumnEntities = {...prevState.columns.entities};
      const updatedTaskEntites = {...prevState.tasks.entities};
      const updatedSubTaskEntites = {...prevState.subTasks.entities};

      prevState.boards.entities[boardId].columnIds.forEach((columnId) => {
        delete updatedColumnEntities[columnId];
        prevState.columns.entities[columnId].taskIds.forEach((taskId) => {
          delete updatedTaskEntites[taskId];
          prevState.tasks.entities[taskId].subTaskIds.forEach((subTaskId) => {
            delete updatedSubTaskEntites[subTaskId];
          })
        })
      })
      
      prevState.boards.entities[boardId].columnIds.forEach((columnId) => {
        delete updatedColumnEntities[columnId];
      })

      let nextActiveBoardId = prevState.activeBoardId;
      let nextActiveTaskId =  prevState.activeTaskId;

      if(prevState.activeBoardId === boardId) {
        nextActiveBoardId = prevState.activeBoardId === boardId ? Object.keys(updatedBoardEntities)[0] : prevState.activeBoardId;
        nextActiveTaskId = null;
      }
      return {
        ...prevState,
        activeBoardId: nextActiveBoardId,
        activeTaskId: nextActiveTaskId,
        workspaces: {
          ...prevState.workspaces,
          entities: {
            ...prevState.workspaces.entities,
            [primaryWorkspaceId]: {
              ...prevState.workspaces.entities[primaryWorkspaceId],
              boardIds: prevState.workspaces.entities[primaryWorkspaceId].boardIds.filter(id => id != boardId)
            }
          }
        },
        boards: {
          entities: updatedBoardEntities,
          ids: Object.keys(updatedBoardEntities)
        },
        columns: {
          entities: updatedColumnEntities,
          ids: Object.keys(updatedColumnEntities)
        },
        tasks: {
          entities: updatedTaskEntites,
          ids: Object.keys(updatedTaskEntites)
        },
        subTasks: {
          entities: updatedSubTaskEntites,
          ids: Object.keys(updatedSubTaskEntites)
        }
      }
    })
  }

  const handleCreateColumn = (title: string) => {
    const newColumn: NormalizedColumn = {
      id: crypto.randomUUID(),
      title: title,
      taskIds: [],
    };
    setState((prevState) => ({
      ...prevState,
      boards: {
        ...prevState.boards,
        entities: {
          ...prevState.boards.entities,
          [prevState.activeBoardId]: {
            ...prevState.boards.entities[prevState.activeBoardId],
            columnIds: [
              ...prevState.boards.entities[prevState.activeBoardId].columnIds,
              newColumn.id,
            ],
          },
        },
      },
      columns: {
        entities: {
          ...prevState.columns.entities,
          [newColumn.id]: newColumn,
        },
        ids: [...prevState.columns.ids, newColumn.id],
      },
    }));
  };

  const handleUpdateColumnTitle = (columnId: string, columnTitle: string) => {
    setState((prevState) => ({
      ...prevState,
      columns: {
        ids: prevState.columns.ids,
        entities: {
          ...prevState.columns.entities,
          [columnId]: {
            ...prevState.columns.entities[columnId],
            title: columnTitle,
          },
        },
      },
    }));
  };

  return (
    <BoardProvider
      state={state}
      handleAddTask={handleAddTask}
      openTaskInspector={openTaskInspector}
      handleAddSubTask={handleAddSubTask}
      handleToggleSubTask={handleToggleSubTask}
      handleDeleteColumn={handleDeleteColumn}
      handleDeleteTask={handleDeleteTask}
      handleCreateBoard={handleCreateBoard}
      handleCreateColumn={handleCreateColumn}
      handleUpdateColumnTitle={handleUpdateColumnTitle}
      handleUpdateBoardTitle={handleUpdateBoardTitle}
    >
      <div className="flex h-screen w-screen font-sans bg-zinc-900 text-zinc-100">
        <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-4">
          <h2 className="text-xl font-bold tracking-tight text-zinc-50 mb-6 text-center">
            {activeWorkspace.name}
          </h2>
          <Sidebar
            boards={state.boards}
            activeBoardId={state.activeBoardId}
            handleBoardChange={handleBoardChange}
            handleDeleteBoard={handleDeleteBoard}
          />
        </aside>
        <DragDropContext onDragEnd={handleDragEnd}>
          <BoardCanvas />
        </DragDropContext>
        {state.activeTaskId && (
          <TaskInspectorModal
            task={state.tasks.entities[state.activeTaskId]}
            onUpdateTask={onUpdateTask}
            onClose={onClose}
          />
        )}
      </div>
    </BoardProvider>
  );
}
