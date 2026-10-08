import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login"); 
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === "login";
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await signup(form.name, form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const input = "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3 rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{isLogin ? "Log in" : "Create account"}</h1>
        {error && <div className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">{error}</div>}

        {!isLogin && (
          <input className={input} name="name" placeholder="Name" value={form.name} onChange={onChange} />
        )}
        <input className={input} name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input
          className={input}
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={onChange}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
        </button>

        <p className="text-center text-sm text-gray-600">
          {isLogin ? "No account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => {
              setError("");
              setMode(isLogin ? "signup" : "login");
            }}
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </form>
    </div>
  );
}
