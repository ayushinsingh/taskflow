import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { useEffect } from "react";
import { me } from "../store/thunks/authThunks";
import { Spinner } from "../components/Spinner";

export const ProtectedRoute = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!auth.user) {
      dispatch(me());
    }
  }, [dispatch, auth.user]);

  // With an httpOnly cookie there is nothing readable to check synchronously,
  // so the server is the only authority: ask, then decide.
  if (auth.user) return <Outlet />;
  if (auth.status === "failed") return <Navigate to="/login" replace />;
  return <Spinner />;
};
