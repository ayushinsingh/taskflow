export function validateEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export const getFieldErrors = {
  email: (email: string) => {
    if (!email) return "Email is required";
    return validateEmail(email) ? "" : "Not a valid email";
  },
  password: (password: string) => {
    if (!password) return "Password is required";
    return password.length < 8 ? "Password must be at least 8 characters" : "";
  },
  name: (name: string) => {
    if(!name) return "Name is required";
    return name.length < 2 || name.length > 100 ? "Name should be between 2 to 100 characters." : "";
  },
  // Mirrors createWorkspaceSchema on the backend: z.string().min(3).max(20).
  // Deliberately not the same rule as `name` above -- that one is a user's name.
  workspaceName: (name: string) => {
    if (!name) return "Workspace name is required";
    return name.length < 3 || name.length > 20
      ? "Workspace name should be between 3 to 20 characters."
      : "";
  }
};