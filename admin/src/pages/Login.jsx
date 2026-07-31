import { Lock, Zap } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/Field";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = login(email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const redirectTo = location.state?.from?.pathname || "/";
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ember-500 text-ink-950">
            <Zap size={22} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-ink-100">
              Velocity Motors
            </h1>
            <p className="text-sm text-ink-400">Admin console</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-ink-700 bg-ink-900 p-6 shadow-panel"
        >
          <Field label="Email" required>
            <Input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@velocitymotors.bd"
            />
          </Field>
          <Field label="Password" required>
            <Input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            <Lock size={14} />
            Log in
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-ink-600">
          Single-admin login — credentials come from this app's .env file.
        </p>
      </div>
    </div>
  );
}
