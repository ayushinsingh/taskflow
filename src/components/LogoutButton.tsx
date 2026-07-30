import { LogOut } from "lucide-react";
import { useAppDispatch } from "../store";
import { logout } from "../store/slices/authSlice";

export const LogoutButton = () => {
  const dispatch = useAppDispatch();
  return (
    <button
      onClick={() => dispatch(logout())}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900/50 hover:text-zinc-200"
    >
      <LogOut className="h-4 w-4 shrink-0" />
      Log out
    </button>
  );
};
