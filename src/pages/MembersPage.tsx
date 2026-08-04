import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, UserPlus, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { DashboardLayout } from "../components/Layouts/DashboardLayout";
import { Spinner } from "../components/Spinner";
import { TextField } from "../components/TextField";
import {
  fetchWorkspaceMembers,
  revokeInvitation,
  sendInvitation,
} from "../store/thunks/memberThunks";
import { fetchWorkspaces } from "../store/thunks/workspaceThunks";
import { getFieldErrors } from "../utils/validators";
import { formatRelativeTime } from "../utils/formatRelativeTime";
import type { Role } from "../types/api/invitation.types";

const ROLE_STYLES: Record<Role, string> = {
  OWNER: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  ADMIN: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  MEMBER: "border-zinc-700 bg-zinc-800/60 text-zinc-300",
};

// OWNER is deliberately absent: the endpoint accepts it, but a workspace with
// two owners is not a state this UI should be able to create.
const INVITABLE_ROLES: Role[] = ["MEMBER", "ADMIN"];

const RoleBadge = ({ role }: { role: Role }) => (
  <span
    className={`inline-block rounded border px-2 py-0.5 text-[10px] font-semibold tracking-wider ${ROLE_STYLES[role]}`}
  >
    {role}
  </span>
);

export const MembersPage = () => {
  const dispatch = useAppDispatch();
  const { workspaceId } = useParams();

  const workspacesStatus = useAppSelector((state) => state.workspaces.status);
  const workspace = useAppSelector((state) =>
    workspaceId ? state.workspaces.entities[workspaceId] : undefined,
  );
  const {
    members,
    invites,
    status,
    error,
    inviteStatus,
    inviteError,
    revokeStatus,
    revokeError,
  } = useAppSelector((state) => state.members);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("MEMBER");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  const isAdmin = workspace?.role === "OWNER" || workspace?.role === "ADMIN";

  useEffect(() => {
    // Only fetch once we know the user is allowed to -- otherwise every MEMBER
    // landing here fires a request that can only 403.
    if (workspaceId && isAdmin) {
      dispatch(fetchWorkspaceMembers(workspaceId));
    }
  }, [dispatch, workspaceId, isAdmin]);

  if (!workspaceId) return <Navigate to="/" replace />;

  // Wait for the workspace list before judging access, or a refresh on this URL
  // would bounce before `workspace` has loaded.
  if (workspacesStatus === "succeeded" && !workspace) {
    return <Navigate to="/" replace />;
  }
  if (workspacesStatus === "succeeded" && !isAdmin) {
    return <Navigate to={`/workspaces/${workspaceId}`} replace />;
  }

  const emailError = getFieldErrors.email(email);
  const isInviting = inviteStatus === "loading";

  const handleInvite = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    if (emailError) return;
    try {
      await dispatch(sendInvitation({ workspaceId, email, role })).unwrap();
      setEmail("");
      setTouched(false);
    } catch {
      // message is already in state.members.inviteError
    }
  };

  const renderBody = () => {
    if (status === "idle" || status === "loading") return <Spinner />;

    if (status === "failed") {
      return (
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4">
          <p role="alert" className="text-sm text-red-400">
            {error ?? "Could not load members."}
          </p>
          <button
            onClick={() => dispatch(fetchWorkspaceMembers(workspaceId))}
            className="mt-3 rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
          >
            Try again
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-10">
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <Users className="h-4 w-4 shrink-0 text-zinc-500" />
            Members
            <span className="text-zinc-500">({members.length})</span>
          </h2>
          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full min-w-xl border-collapse text-left text-sm">
              <caption className="sr-only">Members of this workspace</caption>
              <thead className="bg-zinc-950 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Name</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Role</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {members.map((member) => (
                  <tr key={member.id}>
                    <th scope="row" className="px-4 py-3 font-semibold text-zinc-100">
                      {member.user.name}
                    </th>
                    <td className="px-4 py-3 text-zinc-400">{member.user.email}</td>
                    <td className="px-4 py-3">
                      <RoleBadge role={member.role} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                      <time dateTime={member.createdAt}>
                        {formatRelativeTime(member.createdAt)}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-200">
            Pending invitations{" "}
            <span className="text-zinc-500">({invites.length})</span>
          </h2>
          {invites.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-500">
              No pending invitations.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full min-w-xl border-collapse text-left text-sm">
                <caption className="sr-only">
                  Invitations sent for this workspace, with an action to revoke
                </caption>
                <thead className="bg-zinc-950 text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Role</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Invited by</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Sent</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {invites.map((invite) => {
                    const isBusy = revokeStatus[invite.id] === "loading";
                    const rowError = revokeError[invite.id];
                    return (
                      <tr key={invite.id}>
                        <th scope="row" className="px-4 py-3 font-semibold text-zinc-100">
                          {invite.email}
                          {rowError && (
                            <p role="alert" className="mt-1 text-xs font-normal text-red-400">
                              {rowError}
                            </p>
                          )}
                        </th>
                        <td className="px-4 py-3">
                          <RoleBadge role={invite.role} />
                        </td>
                        <td className="px-4 py-3 text-zinc-400">
                          {invite.invitedBy.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                          <time dateTime={invite.createdAt}>
                            {formatRelativeTime(invite.createdAt)}
                          </time>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() =>
                              dispatch(
                                revokeInvitation({
                                  workspaceId,
                                  invitationId: invite.id,
                                }),
                              )
                            }
                            disabled={isBusy}
                            className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-red-800 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isBusy ? "Revoking…" : "Revoke"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
            Members
          </h1>
          {workspace && (
            <p className="mt-1 text-sm text-zinc-500">{workspace.name}</p>
          )}
        </div>
        <Link
          to={`/workspaces/${workspaceId}`}
          className="inline-flex shrink-0 items-center gap-2 text-sm text-blue-400 transition-colors hover:text-blue-300 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to board
        </Link>
      </div>

      <form
        onSubmit={handleInvite}
        className="mb-8 rounded-lg border border-zinc-800 bg-zinc-950 p-4"
      >
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <UserPlus className="h-4 w-4 shrink-0 text-zinc-500" />
          Invite someone
        </h2>
        <div className="flex flex-wrap items-start gap-3">
          <div className="min-w-56 flex-1">
            <TextField
              id="invite-email"
              type="email"
              label="Email address"
              placeholder="colleague@example.com"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              error={touched ? emailError : ""}
              disabled={isInviting}
            />
          </div>
          <div>
            <label
              htmlFor="invite-role"
              className="mb-1 block text-xs text-zinc-400"
            >
              Role
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              disabled={isInviting}
              className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 focus:outline-none disabled:opacity-50"
            >
              {INVITABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isInviting}
            className="mt-5.5 shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            {isInviting ? "Sending…" : "Send invite"}
          </button>
        </div>
        {inviteError && (
          <p role="alert" className="mt-2 text-sm text-red-400">
            {inviteError}
          </p>
        )}
      </form>

      {renderBody()}
    </DashboardLayout>
  );
};
