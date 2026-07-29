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
  }
};