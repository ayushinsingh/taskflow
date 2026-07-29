import type React from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  ...rest
}) => {
  return (
    <div>
      <label className="block text-xs text-zinc-400 mb-1" htmlFor={rest.id}>{label}</label>
      <input
        {...rest}
        aria-invalid={!!error}
        aria-describedby={`${rest.id}-error`}
        className={`w-full bg-zinc-900 border ${!error ? "border-zinc-800": "border-red-800"} rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none ${rest.className ?? ""}`}
      />
      <p
        id={`${rest.id}-error`}
        className="min-h-4 text-xs text-red-400"
        aria-live="polite"
      >
        {error}
      </p>
    </div>
  );
};
