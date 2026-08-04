import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAppDispatch } from "../store";
import { logoutUser } from "../store/thunks/authThunks";

export const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
    } catch {
      // Local state is cleared either way -- see the thunk's `finally`.
    } finally {
      // Navigate rather than letting ProtectedRoute notice: it would otherwise
      // fire a doomed /auth/me and flash a spinner on the way to /login.
      navigate("/login", { replace: true });
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900/50 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <LogOut className="h-4 w-4 shrink-0" />
      {isLoggingOut ? "Logging out…" : "Log out"}
    </button>
  );
};
