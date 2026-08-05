import type React from "react";
import { Brand } from "../Brand";
import { LogoutButton } from "../LogoutButton";

interface AppHeaderProps {
  /**
   * Content pages constrain their body to max-w-5xl, so the header must match
   * or the brand won't line up with the content below it. The board shell is
   * full-bleed, so it doesn't.
   */
  contained?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ contained = true }) => {
  return (
    <header className="shrink-0 border-b border-zinc-800 bg-zinc-950">
      <div
        className={`flex items-center justify-between px-4 py-3 ${
          contained ? "mx-auto max-w-5xl" : ""
        }`}
      >
        <Brand as="div" />
        <LogoutButton />
      </div>
    </header>
  );
};
