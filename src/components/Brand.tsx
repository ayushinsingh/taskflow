import { KanbanSquare } from "lucide-react";

interface BrandProps {
  /** Rendered as an <h1> when the page has no other heading above it. */
  as?: "h1" | "div";
}

export const Brand: React.FC<BrandProps> = ({ as: Tag = "div" }) => {
  return (
    <Tag className="flex items-center justify-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20">
        <KanbanSquare className="h-5 w-5 text-white" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-zinc-50">
        TaskFlow
      </span>
    </Tag>
  );
};
