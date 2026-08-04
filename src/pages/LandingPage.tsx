import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutGrid, Mail, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  createWorkspace,
  fetchWorkspaces,
} from "../store/thunks/workspaceThunks";
import { workspaceSelectors } from "../store/slices/workspaceSlice";
import { fetchInvitations } from "../store/thunks/invitationThunks";
import { Spinner } from "../components/Spinner";
import { DashboardLayout } from "../components/Layouts/DashboardLayout";
import { TextField } from "../components/TextField";
import { getFieldErrors } from "../utils/validators";

export const LandingPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const workspaces = useAppSelector(workspaceSelectors.selectAll);
  const { status, error, createStatus, createError } = useAppSelector(
    (state) => state.workspaces,
  );
  const pendingInvitations = useAppSelector(
    (state) => state.invitations.invitations.length,
  );

  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkspaces());
    dispatch(fetchInvitations());
  }, [dispatch]);

  const nameError = getFieldErrors.workspaceName(name);
  const isCreating = createStatus === "loading";

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    if (nameError) return;
    try {
      const created = await dispatch(createWorkspace({ name })).unwrap();
      navigate(`/workspaces/${created.id}`);
    } catch {
      // rejection message is already in state.workspaces.createError
    }
  };

  // The create form renders in every branch below, so a failed fetch still
  // leaves a first-run user something to do.
  const createForm = (
    <form onSubmit={handleSubmit} className="flex items-start gap-2">
      <div className="flex-1">
        <TextField
          id="workspace-name"
          label="New workspace"
          placeholder="e.g. Design Team"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched(true)}
          error={touched ? nameError : ""}
          disabled={isCreating}
          maxLength={20}
        />
      </div>
      <button
        type="submit"
        disabled={isCreating}
        className="mt-5.5 flex shrink-0 items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
      >
        <Plus className="h-4 w-4 shrink-0" />
        {isCreating ? "Creating…" : "Create"}
      </button>
    </form>
  );

  const invitationsLink = (
    <Link
      to="/invitations"
      className="inline-flex items-center gap-2 text-sm text-blue-400 transition-colors hover:text-blue-300 hover:underline"
    >
      <Mail className="h-4 w-4 shrink-0" />
      View invitations
      {pendingInvitations > 0 && (
        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white no-underline">
          {pendingInvitations}
        </span>
      )}
    </Link>
  );

  const renderList = () => {
    if (status === "idle" || status === "loading") return <Spinner />;

    if (status === "failed") {
      return (
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4">
          <p role="alert" className="text-sm text-red-400">
            {error ?? "Could not load your workspaces."}
          </p>
          <button
            onClick={() => dispatch(fetchWorkspaces())}
            className="mt-3 rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
          >
            Try again
          </button>
        </div>
      );
    }

    if (workspaces.length === 0) {
      return (
        <div className="rounded-lg border border-dashed border-zinc-800 p-8 text-center">
          <LayoutGrid className="mx-auto h-8 w-8 text-zinc-600" />
          <h2 className="mt-3 text-sm font-semibold text-zinc-200">
            No workspaces yet
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Create one below to get started, or check your invitations.
          </p>
        </div>
      );
    }

    return (
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((workspace) => (
          <li key={workspace.id}>
            <Link
              to={`/workspaces/${workspace.id}`}
              className="block h-full rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <h2 className="truncate font-semibold text-zinc-100">
                {workspace.name}
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                {workspace.boardIds.length}{" "}
                {workspace.boardIds.length === 1 ? "board" : "boards"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
          Your workspaces
        </h1>
        {invitationsLink}
      </div>

      {renderList()}

      <div className="mt-8 border-t border-zinc-800 pt-6">
        {createForm}
        {createError && (
          <p role="alert" className="mt-2 text-sm text-red-400">
            {createError}
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};
