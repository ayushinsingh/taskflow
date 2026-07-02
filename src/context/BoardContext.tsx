import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { GlobalStateStore } from "../types/normalized.type";

interface BoardContextType {
  state: GlobalStateStore;
  handleAddTask: (columnId: string, title: string) => void;
  openTaskInspector: (id: string) => void;
  handleAddSubTask: (taskId: string, title: string) => void;
  handleToggleSubTask: (subTaskId: string) => void;
}

interface BoardContextProviderProps extends BoardContextType {
  children: ReactNode
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<BoardContextProviderProps> = ({state, handleAddTask, openTaskInspector, handleAddSubTask, handleToggleSubTask, children}) => {
  return (
    <BoardContext.Provider value={{state, handleAddTask, openTaskInspector, handleAddSubTask, handleToggleSubTask}}>
      {children}
    </BoardContext.Provider>
  )
}

export const useBoardData = () => {
  const context = useContext(BoardContext);
  if (!context) throw new Error("useBoardData must be used within a BoardProvider");
  return context;
}