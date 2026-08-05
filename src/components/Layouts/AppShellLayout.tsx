import type React from "react";
import { AppHeader } from "./AppHeader";

interface AppShellLayoutProps {
  children: React.ReactNode;
}

/**
 * Frame for the board view: full-bleed, and the page itself never scrolls --
 * the sidebar and the column canvas scroll independently inside it.
 *
 * `min-h-0` on the body row is what makes that work. A flex child defaults to
 * `min-height: auto`, meaning it refuses to shrink below its content, so a wide
 * board would stretch the row past the viewport and the internal overflow rules
 * would never engage. This deliberately renders no <main>; BoardCanvas provides
 * it, and a document may only have one.
 */
export const AppShellLayout: React.FC<AppShellLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col bg-zinc-900 font-sans text-zinc-100">
      <AppHeader contained={false} />
      <div className="flex min-h-0 flex-1">{children}</div>
    </div>
  );
};
