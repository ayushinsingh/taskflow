import { useAppSelector } from "../store";

interface MetricProps {
  boardId: string;
}

export const Metrics: React.FC<MetricProps> = ({ boardId }) => {
  const board = useAppSelector((state) => state.boards.entities[boardId]);
  const columns = useAppSelector((state) => state.columns);
  const tasks = useAppSelector((state) => state.tasks);
  const subTasks = useAppSelector((state) => state.subTasks);

  const boardColumns = board.columnIds
    .map((id) => columns.entities[id])
    .filter(Boolean);
  const activeTaskIds = boardColumns.flatMap((col) => col.taskIds);
  const totalTasks = activeTaskIds.length;

  const activeSubTaskIds = activeTaskIds.flatMap(
    (id) => tasks.entities[id]?.subTaskIds || [],
  );
  const totalSubTasks = activeSubTaskIds.length;
  const completedSubTasks = activeSubTaskIds.filter(
    (id) => subTasks.entities[id]?.isCompleted,
  ).length;

  const completionPercentage =
    totalSubTasks > 0
      ? Math.round((completedSubTasks / totalSubTasks) * 100)
      : 0;

  return (
    <div className=" bg-zinc-950 border-b border-zinc-800 p-4 grid grid-cols-3 gap-4 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
          Total Active Tasks
        </p>
        <p className="text-2xl font-bold text-zinc-100 mt-1">{totalTasks}</p>
      </div>
      <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
          Subtask Breakdown
        </p>
        <p className="text-2xl font-bold text-zinc-100 mt-1">
          {completedSubTasks}{" "}
          <span className="text-sm text-zinc-500 font-normal">
            / {totalSubTasks} done
          </span>
        </p>
      </div>
      <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
          Board Sprint Progress
        </p>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-2xl font-bold text-blue-400">
            {completionPercentage}%
          </p>
          <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
