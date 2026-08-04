import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  acceptInvitation,
  declineInvitation,
  fetchInvitations,
} from "../store/thunks/invitationThunks";
import { Spinner } from "../components/Spinner";
import { DashboardLayout } from "../components/Layouts/DashboardLayout";
import { Link } from "react-router-dom";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import type { Role } from "../types/api/invitation.types";
import { formatRelativeTime } from "../utils/formatRelativeTime";

const ROLE_STYLES: Record<Role, string> = {
  OWNER: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  ADMIN: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  MEMBER: "border-zinc-700 bg-zinc-800/60 text-zinc-300",
};

export const InvitationPage = () => {
  const { invitations, error, status, actionStatus, actionError } =
    useAppSelector((state) => state.invitations);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchInvitations());
  }, [dispatch]);

  const workspacesLink = (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-sm text-blue-400 transition-colors hover:text-blue-300 hover:underline"
    >
      <ArrowLeft className="h-4 w-4 shrink-0" />
      Back to workspaces
    </Link>
  );

  const renderList = () => {
    if (status === "idle" || status === "loading") return <Spinner />;

    if (status === "failed") {
      return (
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4">
          <p role="alert" className="text-sm text-red-400">
            {error ?? "Could not load your invitations."}
          </p>
          <button
            onClick={() => dispatch(fetchInvitations())}
            className="mt-3 rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
          >
            Try again
          </button>
        </div>
      );
    }

    if (invitations.length === 0) {
      return (
        <div className="rounded-lg border border-dashed border-zinc-800 p-8 text-center">
          <LayoutGrid className="mx-auto h-8 w-8 text-zinc-600" />
          <h2 className="mt-3 text-sm font-semibold text-zinc-200">
            No pending invitations
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            When someone invites you to a workspace, it will show up here.
          </p>
        </div>
      );
    }

    return (
      // Tables have a hard minimum width, so the wrapper scrolls rather than
      // letting the page body scroll sideways on narrow screens.
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full min-w-xl border-collapse text-left text-sm">
          <caption className="sr-only">
            Pending workspace invitations, with actions to accept or decline
          </caption>
          <thead className="bg-zinc-950 text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Workspace
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Invited by
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Role
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Received
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {invitations.map((invitation) => {
              const isBusy = actionStatus[invitation.id] === "loading";
              const rowError = actionError[invitation.id];

              return (
                <tr key={invitation.id} className="align-middle">
                  <th
                    scope="row"
                    className="px-4 py-3 font-semibold text-zinc-100"
                  >
                    {invitation.workspace.name}
                    {rowError && (
                      <p
                        role="alert"
                        className="mt-1 text-xs font-normal text-red-400"
                      >
                        {rowError}
                      </p>
                    )}
                  </th>
                  <td className="px-4 py-3 text-zinc-400">
                    {invitation.invitedBy.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded border px-2 py-0.5 text-[10px] font-semibold tracking-wider ${ROLE_STYLES[invitation.role]}`}
                    >
                      {invitation.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                    <time dateTime={invitation.createdAt}>
                      {formatRelativeTime(invitation.createdAt)}
                    </time>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          dispatch(declineInvitation(invitation.id))
                        }
                        disabled={isBusy}
                        className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => dispatch(acceptInvitation(invitation.id))}
                        disabled={isBusy}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
                      >
                        {isBusy ? "Working…" : "Accept"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
          Your invitations
        </h1>
        {workspacesLink}
      </div>
      {renderList()}
    </DashboardLayout>
  );
};
