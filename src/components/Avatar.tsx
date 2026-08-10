import type React from "react";
import type { TaskUser } from "../types/normalized.type";

// The User model has no image field, so avatars are initials on a colour picked
// deterministically from the email -- the same person is always the same colour,
// across sessions and machines, without storing anything.
const PALETTE = [
  "bg-rose-500/20 text-rose-300 ring-rose-500/30",
  "bg-amber-500/20 text-amber-300 ring-amber-500/30",
  "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
  "bg-sky-500/20 text-sky-300 ring-sky-500/30",
  "bg-violet-500/20 text-violet-300 ring-violet-500/30",
  "bg-fuchsia-500/20 text-fuchsia-300 ring-fuchsia-500/30",
];

function paletteFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AvatarProps {
  user: TaskUser;
  size?: "sm" | "md";
}

export const Avatar: React.FC<AvatarProps> = ({ user, size = "sm" }) => {
  const dimensions = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-1 ${dimensions} ${paletteFor(user.email)}`}
      // Native tooltip on hover; the sr-only text below covers screen readers,
      // which do not announce `title` reliably.
      title={`${user.name} (${user.email})`}
    >
      <span aria-hidden="true">{initialsFor(user.name)}</span>
      <span className="sr-only">{user.name}</span>
    </span>
  );
};
