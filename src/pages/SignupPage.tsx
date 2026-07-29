import { useEffect, useState } from "react";
import { TextField } from "../components/TextField";
import { useAppDispatch, useAppSelector } from "../store";
import { signup } from "../store/thunks/authThunks";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/Layouts/AuthLayout";
import { clearError } from "../store/slices/authSlice";
import { getFieldErrors } from "../utils/validators";


export const SignupPage = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({name: "", email: "", password: ""});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ email: true, password: true, name: true });
    if(getFieldErrors.name(values.name) || getFieldErrors.email(values.email) || getFieldErrors.password(values.password)) return;
    try {
      //.unwrap() re-throws on rejection, so success and failure are plain control flow.
      await dispatch(signup({ name: values.name, email: values.email, password: values.password })).unwrap();
      navigate("/");
    } catch {
      // rejection message is already in state.auth.error via the slice
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setValues((values) => ({...values, [e.target.name]: e.target.value}))
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    setTouched((touched) => ({ ...touched, [e.target.name]: true }));
  };

  const isSubmitDisabled = () => {
    return (
      auth.status === "loading" ||
      (touched["name"] && touched["email"] &&
        touched["password"] &&
        (!!getFieldErrors.name(values.name) || !!getFieldErrors.email(values.email) || !!getFieldErrors.password(values.password)))
    );
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <AuthLayout
      title="Signup"
      footer={
        <Link
          className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
          to="/login"
        >
          already have an account?
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextField
          name="name"
          id="name-text"
          label="Name"
          value={values.name}
          autoComplete="name"
          error={touched["name"] ? getFieldErrors.name(values.name) : ""}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <TextField
          name="email"
          id="email-text"
          label="Email"
          autoComplete="email"
          value={values.email}
          error={touched["email"] ? getFieldErrors.email(values.email) : ""}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <TextField
          name="password"
          id="password-text"
          label="Password"
          value={values.password}
          autoComplete="new-password"
          error={touched["password"] ? getFieldErrors.password(values.password) : ""}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          type="password"
        />
        <button
          id="signup-btn"
          className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors
hover:bg-blue-500
focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          disabled={isSubmitDisabled()}
          type="submit"
        >
          {auth.status === "loading" ? "Signing up" : "Sign up"}
        </button>
      </form>
      <p role="alert" className="text-sm text-red-400">
        {auth.error}
      </p>
    </AuthLayout>
  );
};
