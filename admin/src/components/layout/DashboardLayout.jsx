import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-ink-950">
      <Sidebar />
      <main className="sm:pl-60">
        <Outlet />
      </main>
    </div>
  );
}
