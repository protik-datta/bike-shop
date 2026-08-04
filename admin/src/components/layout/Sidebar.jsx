import { LayoutDashboard, Bike, Tags, ClipboardList, Zap, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/bikes", label: "Bikes", icon: Bike },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/orders", label: "Orders", icon: ClipboardList },
];

export default function Sidebar({ open = false, onClose = () => {} }) {
  return (
    <>
      {/* Backdrop — mobile only, shown while the drawer is open */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/70 backdrop-blur-sm sm:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 -translate-x-full flex-col border-r border-ink-800 bg-ink-900 px-4 py-5 transition-transform duration-200 sm:translate-x-0 ${
          open ? "translate-x-0" : ""
        }`}
      >
        <div className="mb-8 flex items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ember-500 text-ink-950">
              <Zap size={16} fill="currentColor" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold leading-tight text-ink-100">
                New Infinity Motors BD
              </p>
              <p className="text-[11px] leading-tight text-ink-500">Admin console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="focus-ring rounded-md p-1 text-ink-400 hover:bg-ink-800 hover:text-ink-100 sm:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `focus-ring flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-ember-500/15 text-ember-300"
                    : "text-ink-300 hover:bg-ink-800 hover:text-ink-100"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <p className="px-2 text-[11px] text-ink-600">Static admin session</p>
      </aside>
    </>
  );
}
