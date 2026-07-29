import { Brand } from "../Brand";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  footer,
}) => {
  return (
    <div className="h-screen overflow-y-auto flex flex-col items-center justify-center bg-zinc-900 text-zinc-100 px-4 py-8">
      <Brand as="h1" />
      <div className="mt-6 w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-50">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-zinc-400">{subtitle}</p>}
        </div>
        {children}
        <div className="mt-4 text-center">{footer}</div>
      </div>
    </div>
  );
};
