import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Sidebar } from "./components/Sidebar";
import { BoardCanvas } from "./components/BoardCanvas";
import { TaskInspectorModal } from "./components/TaskInspectorModal";
import { useAppDispatch, useAppSelector } from "./store";
import { moveColumnLane } from "./store/slices/boardSlice";
import { moveTaskCard } from "./store/slices/columnSlice";

export default function App() {
  const dispatch = useAppDispatch();
  const activeTaskId = useAppSelector((state) => state.tasks.activeTaskId);
  const activeBoardId = useAppSelector((state) => state.boards.activeBoardId);
  const activeWorkspace = useAppSelector(
    (state) => state.workspaces.entities[state.workspaces.ids[0]],
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.type === "COLUMN") {
      dispatch(
        moveColumnLane({
          boardId: activeBoardId,
          sourceIndex: result.source.index,
          destinationIndex: result.destination.index,
        }),
      );
    } else {
      dispatch(
        moveTaskCard({
          sourceColumnId: result.source.droppableId,
          sourceIndex: result.source.index,
          destinationColumnId: result.destination.droppableId,
          destinationIndex: result.destination.index,
        }),
      );
    }
  };

  return (
    <div className="flex h-screen w-screen font-sans bg-zinc-900 text-zinc-100">
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-50 mb-6 text-center">
          {activeWorkspace.name}
        </h2>
        <Sidebar />
      </aside>
      <DragDropContext onDragEnd={handleDragEnd}>
        <BoardCanvas />
      </DragDropContext>
      {activeTaskId && <TaskInspectorModal />}
    </div>
  );
}
