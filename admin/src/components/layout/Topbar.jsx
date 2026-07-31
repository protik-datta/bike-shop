import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ title, actions }) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-800 bg-ink-950/90 px-6 py-4 backdrop-blur">
      <h1 className="font-display text-lg font-semibold text-ink-100">{title}</h1>
      <div className="flex items-center gap-4">
        {actions}
        <div className="flex items-center gap-3 border-l border-ink-800 pl-4">
          <span className="hidden text-xs text-ink-400 sm:inline">
            {session?.email}
          </span>
          <button
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-300 hover:bg-ink-800 hover:text-ink-100"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
