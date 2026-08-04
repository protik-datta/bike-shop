import { LogOut, Menu } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ title, actions }) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext() ?? {};

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-ink-800 bg-ink-950/90 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={openSidebar}
          className="focus-ring shrink-0 rounded-lg p-1.5 text-ink-300 hover:bg-ink-800 hover:text-ink-100 sm:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="truncate font-display text-lg font-semibold text-ink-100">{title}</h1>
      </div>
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
