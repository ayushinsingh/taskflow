import type { GlobalStateStore } from "../types/normalized.type";

export const initalNormalizedState: GlobalStateStore = {
  workspaces: {
    entities: {
      "w-101": {
        id: "w-101",
        name: "Engineering Squad Workspace",
        boardIds: ["b-201"],
      },
    },
    ids: ["w-101"],
  },
  boards: {
    entities: {
      "b-201": {
        id: "b-201",
        title: "Q3 Development Sprint",
        columnIds: ["c-301", "c-302"],
      },
    },
    ids: ["b-201"],
  },
  columns: {
    entities: {
      "c-301": {
        id: "c-301",
        title: "To do",
        taskIds: ["t-401", "t-402"],
      },
      "c-302": {
        id: "c-302",
        title: "In Progress",
        taskIds: [],
      },
    },
    ids: ["c-301", "c-302"],
  },
  tasks: {
    entities: {
      "t-401": {
        id: "t-401",
        title: "Configure Development Environment",
        description:
          "Initialize repository layout structure, ESLint validation baselines, and custom styling overrides.",
        priority: "high",
        subTaskIds: ["s-501", "s-502"],
      },
      "t-402": {
        id: "t-402",
        title: "Design Shell Layout Containers",
        description:
          "Implement structural sidebar navigation items and collapsible canvas grid properties.",
        priority: "medium",
        subTaskIds: [],
      },
    },
    ids: ["t-401", "t-402"],
  },
  subTasks: {
    entities: {
      "s-501": {
        id: "s-501",
        title: "Create Jsx structure",
        isCompleted: false
      },
      "s-502": {
        id: "s-502",
        title: "Add state logic",
        isCompleted: false
      }
    },
    ids: ["s-501", "s-502"],
  },
  activeBoardId: 'b-201',
  activeTaskId: null
};
