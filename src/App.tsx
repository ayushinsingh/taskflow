import { useEffect } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { LogOut } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { BoardCanvas } from "./components/BoardCanvas";
import { TaskInspectorModal } from "./components/TaskInspectorModal";
import { useAppDispatch, useAppSelector } from "./store";
import { moveColumnLane } from "./store/slices/boardSlice";
import { moveTaskCard } from "./store/slices/columnSlice";
import { logout } from "./store/slices/authSlice";
import { fetchWorkspaces, fetchBoardWithId } from "./store/thunks/boardThunks";

export default function App() {
  const dispatch = useAppDispatch();
  const activeTaskId = useAppSelector((state) => state.tasks.activeTaskId);
  const activeBoardId = useAppSelector((state) => state.boards.activeBoardId);
  const activeWorkspace = useAppSelector(
    (state) => state.workspaces.entities[state.workspaces.ids[0]],
  );

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

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

  return (
    <div className="flex h-screen w-screen font-sans bg-zinc-900 text-zinc-100">
      <aside className="flex w-64 flex-col border-r border-zinc-800 bg-zinc-950 p-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-50 mb-6 text-center">
          {activeWorkspace?.name}
        </h2>
        <Sidebar />
        <button
          onClick={() => dispatch(logout())}
          className="mt-auto flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900/50 hover:text-zinc-200"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log out
        </button>
      </aside>
      <DragDropContext onDragEnd={handleDragEnd}>
        <BoardCanvas />
      </DragDropContext>
      {activeTaskId && <TaskInspectorModal />}
    </div>
  );
}
