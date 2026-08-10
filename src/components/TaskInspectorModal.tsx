import { useState, useEffect } from "react";
import type { Priority } from "../types/normalized.type";
import { MetricCard } from "./MetricCard";
import { AddSubTaskInput } from "./AddSubTaskInput";
import { useAppDispatch, useAppSelector } from "../store";
import { closeTaskInspector } from "../store/slices/taskSlice";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { toggleSubtask, updateTask } from "../store/thunks/boardThunks";
import { fetchWorkspaceMembers } from "../store/thunks/memberThunks";
import { Avatar } from "./Avatar";

export const TaskInspectorModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTaskId = useAppSelector((state) => state.tasks.activeTaskId);
  const task = useAppSelector((state) =>
    activeTaskId ? state.tasks.entities[activeTaskId] : undefined,
  );
  const subTasks = useAppSelector((state) => state.subTasks);
  const { workspaceId } = useParams();
  const members = useAppSelector((state) => state.members.members);
  const membersLoadedFor = useAppSelector((state) => state.members.workspaceId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditingAssignee, setIsEditingAssignee] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      // Otherwise opening a different task inherits the previous one's
      // half-finished edit state.
      setIsEditingAssignee(false);
    }
  }, [activeTaskId, task?.id]); // Safe optional chain boundary pointer

  // MembersPage may never have been visited, so the picker fetches its own
  // options. Non-admins get a 403 and an empty list -- see the fallback option
  // in the select below.
  useEffect(() => {
    if (workspaceId && membersLoadedFor !== workspaceId) {
      dispatch(fetchWorkspaceMembers(workspaceId));
    }
  }, [dispatch, workspaceId, membersLoadedFor]);

  if (!activeTaskId || !task) return null;

  const handlePriorityChange = (priority: Priority) => {
    dispatch(updateTask({ taskId: activeTaskId, changes: { priority } }));
  };

  const handleAssigneeChange = (userId: string) => {
    // "" is the Unassigned option; the API expects an explicit null to clear.
    dispatch(
      updateTask({
        taskId: activeTaskId,
        changes: { assignedToId: userId === "" ? null : userId },
      }),
    );
  };

  const handleBlur = (key: "title" | "description", value: string) => {
    if (key === "title" && !value.trim()) return;
    dispatch(
      updateTask({ taskId: activeTaskId, changes: { [key]: value.trim() } }),
    );
  };

  const completedCount = task.subTaskIds.reduce(
    (total, current) =>
      subTasks.entities[current]?.isCompleted ? total + 1 : total,
    0,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={() => dispatch(closeTaskInspector())}
    >
      <div
        className="w-112.5 h-full bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col justify-between shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Task Inspector
            </span>
            <button
              onClick={() => dispatch(closeTaskInspector())}
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded-md hover:bg-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleBlur("title", title)}
            className="w-full bg-transparent text-xl font-bold text-zinc-100 border-b border-transparent focus:border-blue-500/50 outline-none pb-1"
          />

          {/* People -- kept adjacent to the title so ownership reads before the
              editable body fields. */}
          <div className="space-y-4 border-y border-zinc-800/80 py-4">
            <div className="min-w-0 space-y-2">
              <label
                htmlFor="task-assignee"
                className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider"
              >
                Assigned to
              </label>
              {isEditingAssignee ? (
                <select
                  id="task-assignee"
                  autoFocus
                  value={task.assignedToId ?? ""}
                  onChange={(e) => {
                    handleAssigneeChange(e.target.value);
                    setIsEditingAssignee(false);
                  }}
                  onBlur={() => setIsEditingAssignee(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setIsEditingAssignee(false);
                  }}
                  className="w-full min-w-0 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-300 focus:border-blue-500/50 focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {/* The current assignee may not be in `members` -- that list
                      is admin-only, so it is empty for regular users. Rendering
                      them explicitly keeps the select from silently showing
                      Unassigned for a task that is in fact assigned. */}
                  {task.assignedTo &&
                    !members.some((m) => m.userId === task.assignedToId) && (
                      <option value={task.assignedToId ?? ""}>
                        {task.assignedTo.name}
                      </option>
                    )}
                  {members.map((member) => (
                    <option key={member.userId} value={member.userId}>
                      {member.user.name}
                    </option>
                  ))}
                </select>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingAssignee(true)}
                  title="Click to change the assignee"
                  className="flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-md border border-transparent px-3 py-2 text-left text-sm hover:border-zinc-800 hover:bg-zinc-900/60 focus:border-blue-500/50 focus:outline-none"
                >
                  {task.assignedTo ? (
                    <>
                      <Avatar user={task.assignedTo} />
                      <span className="truncate text-zinc-300">
                        {task.assignedTo.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-zinc-500">Unassigned</span>
                  )}
                </button>
              )}
            </div>

            <div className="min-w-0 space-y-2">
              <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Created by
              </span>
              {/* Same padding and transparent border as the assignee row above,
                  so both avatars share a left edge and both rows the same
                  height. The email lives in the Avatar's tooltip. */}
              <div className="flex min-w-0 items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm">
                <Avatar user={task.createdBy} />
                <span className="truncate text-zinc-300">
                  {task.createdBy.name}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleBlur("description", description)}
              placeholder="Add a detailed description for this task..."
              className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm text-zinc-300 focus:border-blue-500/50 focus:outline-none resize-none"
            />
          </div>

          {/* Priority Toggles */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["LOW", "MEDIUM", "HIGH", "URGENT"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePriorityChange(p)}
                  className={`py-1.5 text-xs font-medium rounded uppercase border transition-all ${
                    task.priority === p
                      ? "bg-blue-600/10 border-blue-500 text-blue-400 font-semibold"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Subtasks Stack */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Subtasks
            </label>
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {task.subTaskIds.map((subTaskId) => {
                const subTask = subTasks.entities[subTaskId];
                if (!subTask) return null;
                return (
                  <div
                    key={subTaskId}
                    className="group flex items-center gap-3 bg-zinc-900/50 border border-zinc-850/60 px-3 py-2 rounded-md hover:bg-zinc-900 transition-colors"
                  >
                    <input
                      id={subTaskId}
                      type="checkbox"
                      checked={subTask.isCompleted}
                      onChange={() => dispatch(toggleSubtask(subTaskId))}
                      className="rounded border-zinc-700 text-blue-600 focus:ring-blue-500/20 bg-zinc-800 h-4 w-4 cursor-pointer"
                    />
                    <label
                      htmlFor={subTaskId}
                      className={`text-xs font-medium text-zinc-300 cursor-pointer select-none truncate ${
                        subTask.isCompleted
                          ? "line-through text-zinc-600 decoration-zinc-700"
                          : ""
                      }`}
                    >
                      {subTask.title}
                    </label>
                  </div>
                );
              })}
            </div>
            <AddSubTaskInput />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-900">
          <MetricCard
            title="Completed Sub Tasks"
            value={completedCount}
            total={task.subTaskIds.length}
          />
        </div>
      </div>
    </div>
  );
};
