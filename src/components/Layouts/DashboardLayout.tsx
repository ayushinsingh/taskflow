import type React from "react";
import { AppHeader } from "./AppHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Frame for scrollable content pages (workspaces, invitations, members).
 *
 * The column is pinned to the viewport and <main> owns the scrolling, which is
 * why the header needs no `sticky`: it is a flex sibling *outside* the scroll
 * area, so it cannot scroll away in the first place.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className="flex h-screen flex-col bg-zinc-900 text-zinc-100">
      <AppHeader />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
      </main>
    </div>
  );
};
