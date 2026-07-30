import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { useEffect } from "react";
import { me } from "../store/thunks/authThunks";

export const ProtectedRoute = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!auth.user) {
      dispatch(me());
    }
  }, [dispatch, auth.user]);

  if (!auth.token || auth.status === "failed")
    return <Navigate to="/login" replace />;
  if (auth.user) return <Outlet />;
  return (
    <div className="flex justify-center items-center h-screen bg-zinc-900">
      <div className="w-12 h-12 border-2 border-zinc-800 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};
