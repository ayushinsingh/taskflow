import { useCallback, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { initalNormalizedState } from "./data/normalizedMockData";
import type { GlobalStateStore, NormalizedTask } from "./types/normalized.type";
import { Sidebar } from "./components/Sidebar";
import { BoardCanvas } from "./components/BoardCanvas";
import { BoardProvider } from "./context/BoardContext";
import { TaskInspectorModal } from "./components/TaskInspectorModal";

export default function App() {
  const [state, setState] = useState(initalNormalizedState);
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

  const moveColumn = (state: GlobalStateStore, activeBoardId: string, sourceIndex: number, destinationIndex: number): GlobalStateStore => {
    const columnIds = [... state.boards.entities[activeBoardId].columnIds]
    const [sourceColumnId] =columnIds.splice(sourceIndex, 1);
    columnIds.splice(destinationIndex, 0, sourceColumnId)
    return {
      ...state,
      boards: {
        entities: {
          ...state.boards.entities,
          [activeBoardId]: {
            ...state.boards.entities[activeBoardId],
            columnIds: columnIds
          }
        },
        ids: state.boards.ids
      } 
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if(result.type === "COLUMN") {
      setState((prevState) => moveColumn(prevState, prevState.activeBoardId, result.source.index, result.destination!.index));
    } else {
      setState((prevState) => moveTaskTraditional(
        prevState,
        result.draggableId,
        result.source.droppableId,
        result.destination!.droppableId,
        result.destination!.index,
      ));
    }
  };

  const openTaskInspector = (id: string) => {
    setState((prevState) => ({...prevState, activeTaskId: id}));
  }

  const onUpdateTask = (taskId: string, updatedTask: NormalizedTask) => {
    setState((prevState) => ({...prevState, tasks: {
      entities: {...prevState.tasks.entities, [taskId]: updatedTask},
      ids: prevState.tasks.ids
    }}))
  }

  const onClose = () => {
    setState((prevState) => ({...prevState, activeTaskId: null}));
  }

  return (
    <BoardProvider state={state} handleAddTask={handleAddTask} openTaskInspector={openTaskInspector}>
      <div className="flex h-screen w-screen font-sans bg-zinc-900 text-zinc-100">
        <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-4">
          <h2 className="text-xl font-bold tracking-tight text-zinc-50 mb-6 text-center">
            {activeWorkspace.name}
          </h2>
          <Sidebar
            boards={state.boards}
            activeBoardId={state.activeBoardId}
            handleBoardChange={handleBoardChange}
          />
        </aside>
        <DragDropContext onDragEnd={handleDragEnd}>
          <BoardCanvas />
        </DragDropContext>
        {state.activeTaskId && <TaskInspectorModal task={state.tasks.entities[state.activeTaskId]} onUpdateTask={onUpdateTask} onClose={onClose} />}
      </div>
    </BoardProvider>
  );
}
