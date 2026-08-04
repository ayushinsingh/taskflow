import { configureStore, combineReducers, type Middleware } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import subTaskReducer from "./slices/subTaskSlice";
import taskReducer from "./slices/taskSlice";
import columnReducer from "./slices/columnSlice";
import boardReducer from "./slices/boardSlice";
import authReducer, { logout } from "./slices/authSlice";
import workspaceReducer from "./slices/workspaceSlice";
import { cascadeDeleteMiddleware } from "./middleware/cascadeDeleteMiddleware";
import { tokenService } from "../services/tokenService";
import invitationReducer from "./slices/invitationSlice";
import memberReducer from "./slices/memberSlice";

const PERSISTED_STATE_KEY = "kanban_redux_workspace_store";

const localStorageMiddleware: Middleware = (storeApi) => (next) => (action) => {
  // Pass the action down the chain first so the state gets modified
  const result = next(action);

  if (logout.match(action)) {
    localStorage.removeItem(PERSISTED_STATE_KEY);
    tokenService.clearToken();
    return result;
  }

  const { subTasks, tasks, columns, boards, workspaces } =
    storeApi.getState() as RootState;

  localStorage.setItem(
    PERSISTED_STATE_KEY,
    JSON.stringify({ subTasks, tasks, columns, boards, workspaces }),
  );

  return result;
};

const combinedReducer = combineReducers({
  subTasks: subTaskReducer,
  tasks: taskReducer,
  columns: columnReducer,
  boards: boardReducer,
  workspaces: workspaceReducer,
  auth: authReducer,
  invitations: invitationReducer,
  members: memberReducer
});

export type RootStateType = ReturnType<typeof combinedReducer>

export const rootReducer: typeof combinedReducer = (state, action) =>
  combinedReducer(logout.match(action) ? undefined : state, action);

const getPreloadedState = (): RootStateType | undefined => {
  try {
    const savedCache = localStorage.getItem(PERSISTED_STATE_KEY);
    if (savedCache) {
      return JSON.parse(savedCache);
    }
  } catch (error) {
    console.error("Failed to hydrate Redux store from localStorage:", error);
  }
  return undefined;
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: getPreloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cascadeDeleteMiddleware, localStorageMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;