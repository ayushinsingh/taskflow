import { describe, expect, it } from "vitest";
import type { RootStateType } from "../store";
import { renderWithProviders } from "../test/test-utils";
import { TaskCard } from "./TaskCard";
import { screen } from "@testing-library/react";

describe("TaskCard Identity Isolation UI Tests", () => {
  const createPreloadedState = (): Partial<RootStateType> => ({
    columns: {
      ids: ["col-1", "col-2"],
      entities: {
        "col-1": {
          id: "col-1",
          title: "To do",
          taskIds: ["task-1"]
        },
        "col-2": {
          id: "col-1",
          title: "To do",
          taskIds: []
        },
      }
    },
    tasks: {
      activeTaskId: null,
      ids: ["task-1"],
      entities: {
        "task-1": {
          id: "task-1",
          title: "Optimize React Re-renders",
          description: "Implement useMemo and centralized custom selector graphs.",
          priority: "high",
          subTaskIds: ["sub-1", "sub-2"]
        }
      }
    },
    subTasks: {
      ids: ["sub-1", "sub-2"],
      entities: {
        "sub-1": { id: "sub-1", title: "Write tests", isCompleted: true },
        "sub-2": { id: "sub-2", title: "Profile heap snapshot memory", isCompleted: false }
      }
    }
  });

  it("should look up and display accurate information from store using only a primitive ID property", () => {
    const preloadedState = createPreloadedState();
    renderWithProviders(<TaskCard taskId="task-1" columnId="col-1" />, { preloadedState });
    expect(screen.getByText("Optimize React Re-renders")).toBeInTheDocument();
    expect(
      screen.getByText(
        (_content, element) =>
          element?.tagName.toLowerCase() === "span" &&
          element?.textContent?.replace(/\s+/g, " ").trim() === "1 / 2",
      ),
    ).toBeInTheDocument();
  })

  it("should style status borders or badges correctly according to priority metadata scales", () => {
    const preloadedState = createPreloadedState();
    if (preloadedState.tasks?.entities["task-1"]) {
      preloadedState.tasks.entities["task-1"].priority = "urgent";
    }
    renderWithProviders(<TaskCard columnId="col-1" taskId="task-1" />, { preloadedState });
    const priorityBadge = screen.getByText(/urgent/i);
    expect(priorityBadge).toBeInTheDocument();
    expect(priorityBadge.className).toContain("text-red-300")
  });
})
