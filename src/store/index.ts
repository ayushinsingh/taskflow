import { configureStore, combineReducers, type Middleware } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import subTaskReducer from "./slices/subTaskSlice";
import taskReducer from "./slices/taskSlice";
import columnReducer from "./slices/columnSlice";
import boardReducer from "./slices/boardSlice";
import authReducer from "./slices/authSlice";
import workspaceReducer from "./slices/workspaceSlice";
import { cascadeDeleteMiddleware } from "./middleware/cascadeDeleteMiddleware";

const localStorageMiddleware: Middleware = (storeApi) => (next) => (action) => {
  // Pass the action down the chain first so the state gets modified
  const result = next(action);
  
  // Grab the fresh state snapshot post-reducer update
  const {auth, ...rest} = storeApi.getState() as RootState;
  
  // Mirror the full state tree out to the client browser storage
  localStorage.setItem("kanban_redux_workspace_store", JSON.stringify(rest));
  
  return result;
};

export const rootReducer = combineReducers({
  subTasks: subTaskReducer,
  tasks: taskReducer,
  columns: columnReducer,
  boards: boardReducer,
  workspaces: workspaceReducer,
  auth: authReducer,
});

export type RootStateType = ReturnType<typeof rootReducer>

const getPreloadedState = (): RootStateType | undefined => {
  try {
    const savedCache = localStorage.getItem("kanban_redux_workspace_store");
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