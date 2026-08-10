import type { NormalizedBoard, NormalizedColumn, NormalizedSubtask, NormalizedTask, NormalizedWorkspace } from "../types/normalized.type";
import type { AuthUser } from "../types/api/auth.types";
import type { Invitation } from "../types/api/invitation.types";
import type { WorkspaceInvite, WorkspaceMember } from "../types/api/member.types";
import type { TaskUser } from "../types/normalized.type";

export const FIXED_DATE = "2026-08-01T10:00:00.000Z";

export const IDS = {
  user: "user-1",
  otherUser: "user-2",
  workspace: "ws-1",
} as const;

export function entityState<T extends {id: string}>(items: T[]) {
  return {
    ids: items.map(item => item.id),
    entities: Object.fromEntries(items.map(item => [item.id, item]))
  };
}

export const makeTask = (overrides: Partial<NormalizedTask> = {}): NormalizedTask => ({
  id: "task-1",
  title: "Test task",
  description: "",
  priority: "MEDIUM",
  subTaskIds: [],
  createdBy: { name: "User A", email: "a@example.com" },
  assignedToId: null,
  assignedTo: null,
  ...overrides,
});

export const makeWorkspace = (overrides: Partial<NormalizedWorkspace> = {}): NormalizedWorkspace => ({
  id: "workspace-1",
  name: "Test workspace",
  boardIds: [],
  role: "OWNER",
  ...overrides,
});

export const makeBoard = (overrides: Partial<NormalizedBoard> = {}): NormalizedBoard => ({
  id: "board-1",
  title: "Test board",
  columnIds: [],
  ...overrides,
});

export const makeColumn = (overrides: Partial<NormalizedColumn> = {}): NormalizedColumn => ({
  id: "column-1",
  title: "Test column",
  taskIds: [],
  ...overrides,
});

export const makeSubtask = (overrides: Partial<NormalizedSubtask> = {}): NormalizedSubtask => ({
  id: "subtask-1",
  title: "Test subtask",
  isCompleted: false,
  ...overrides,
});

export const makeUser = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  id: IDS.user,
  name: "User A",
  email: "a@example.com",
  ...overrides,
});

export const makeTaskUser = (overrides: Partial<TaskUser> = {}): TaskUser => ({
  name: "User A",
  email: "a@example.com",
  ...overrides,
});

export const makeMember = (
  overrides: Partial<WorkspaceMember> = {},
): WorkspaceMember => ({
  id: "membership-1",
  userId: IDS.user,
  workspaceId: IDS.workspace,
  role: "MEMBER",
  createdAt: FIXED_DATE,
  user: makeTaskUser(),
  ...overrides,
});

export const makeInvitation = (overrides: Partial<Invitation> = {}): Invitation => ({
  id: "inv-1",
  email: "a@example.com",
  role: "MEMBER",
  status: "PENDING",
  createdAt: FIXED_DATE,
  workspaceId: IDS.workspace,
  invitedBy: makeTaskUser({ name: "User B", email: "b@example.com" }),
  workspace: { id: IDS.workspace, name: "Engineering" },
  ...overrides,
});

export const makeWorkspaceInvite = (
  overrides: Partial<WorkspaceInvite> = {},
): WorkspaceInvite => ({
  id: "inv-1",
  email: "c@example.com",
  role: "MEMBER",
  status: "PENDING",
  createdAt: FIXED_DATE,
  workspaceId: IDS.workspace,
  invitedById: IDS.otherUser,
  invitedBy: makeTaskUser({ name: "User B", email: "b@example.com" }),
  ...overrides,
});