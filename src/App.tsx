import { useEffect } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Sidebar } from "./components/Sidebar";
import { BoardCanvas } from "./components/BoardCanvas";
import { TaskInspectorModal } from "./components/TaskInspectorModal";
import { useAppDispatch, useAppSelector } from "./store";
import { changeBoard, moveColumnLane } from "./store/slices/boardSlice";
import { moveTaskCard } from "./store/slices/columnSlice";
import { fetchBoardWithId } from "./store/thunks/boardThunks";
import { fetchWorkspaces } from "./store/thunks/workspaceThunks";
import { Navigate, useParams } from "react-router-dom";

export default function App() {
  const dispatch = useAppDispatch();
  const activeTaskId = useAppSelector((state) => state.tasks.activeTaskId);
  const activeBoardId = useAppSelector((state) => state.boards.activeBoardId);
  const { workspaceId } = useParams();
  const workspaces = useAppSelector((state) => state.workspaces);
  const workspace = useAppSelector((state) =>
    workspaceId ? state.workspaces.entities[workspaceId] : undefined,
  );

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  useEffect(() => {
    if (!workspace) return;
    const ids = workspace.boardIds;
    if (!activeBoardId || !ids.includes(activeBoardId)) {
      dispatch(changeBoard(ids[0] ?? null));
    }
  }, [dispatch, workspace, activeBoardId]);

  useEffect(() => {
    if (activeBoardId) {
      dispatch(fetchBoardWithId(activeBoardId));
    }
  }, [dispatch, activeBoardId]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!result.destination || !activeBoardId) return;
    if (
      source.droppableId === destination!.droppableId &&
      source.index === destination!.index
    ) {
      return;
    }
    if (type === "COLUMN") {
      dispatch(
        moveColumnLane({
          boardId: activeBoardId,
          sourceIndex: source.index,
          destinationIndex: destination!.index,
        }),
      );
    } else {
      dispatch(
        moveTaskCard({
          sourceColumnId: source.droppableId,
          sourceIndex: source.index,
          destinationColumnId: destination!.droppableId,
          destinationIndex: destination!.index,
        }),
      );
    }
  };

  if ((workspaces.status === "succeeded" && !workspace) || !workspaceId)
    return <Navigate to="/" replace />;

  return (
    <div className="flex h-screen w-screen font-sans bg-zinc-900 text-zinc-100">
      <aside className="flex w-64 flex-col border-r border-zinc-800 bg-zinc-950 p-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-50 mb-6 text-center">
          {workspace?.name}
        </h2>
        <Sidebar workspaceId={workspaceId} />
      </aside>
      <DragDropContext onDragEnd={handleDragEnd}>
        <BoardCanvas />
      </DragDropContext>
      {activeTaskId && <TaskInspectorModal />}
    </div>
  );
}
