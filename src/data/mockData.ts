import type { Workspace } from "../types/board.types";

export const initialWorkspace: Workspace = {
  id: "w-101",
  name: "Engineering Squad Workspace",
  boards: [
    {
      id: "b-201",
      title: "Q3 Development Sprint",
      columns: [
        {
          id: "c-301",
          title: "To Do",
          tasks: [
            {
              id: "t-401",
              title: "Configure Development Environment",
              description:
                "Initialize repository layout structure, ESLint validation baselines, and custom styling overrides.",
              priority: "high",
              subTasks: [
                {
                  id: "s-501",
                  title: "Verify bundle compiler configs",
                  isCompleted: true,
                },
                {
                  id: "s-502",
                  title: "Bootstrap global styles canvas",
                  isCompleted: false,
                },
              ],
            },
            {
              id: "t-402",
              title: "Design Shell Layout Containers",
              description:
                "Implement structural sidebar navigation items and collapsible canvas grid properties.",
              priority: "medium",
              subTasks: [],
            },
          ],
        },
        {
          id: "c-302",
          title: "In Progress",
          tasks: [],
        },
      ],
    },
  ],
};
