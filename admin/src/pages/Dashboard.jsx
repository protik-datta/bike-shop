import { Bike, ClipboardList, Tags, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Topbar from "../components/layout/Topbar";
import { useBikes } from "../hooks/useBikes";
import { useCategories } from "../hooks/useCategories";
import { useOrders } from "../hooks/useOrders";
import { ORDER_STATUS_STYLES } from "../constants";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";

export default function Dashboard() {
  const bikes = useBikes({ page: 1, limit: 1, isActive: "true" });
  const categories = useCategories({ page: 1, limit: 1, isActive: "true" });
  const pendingOrders = useOrders({ page: 1, limit: 1, orderStatus: "pending" });
  const recentOrders = useOrders({ page: 1, limit: 5 });

  const stats = [
    {
      label: "Active bikes",
      value: bikes.data?.pagination?.total,
      icon: Bike,
      to: "/bikes",
    },
    {
      label: "Active categories",
      value: categories.data?.pagination?.total,
      icon: Tags,
      to: "/categories",
    },
    {
      label: "Pending orders",
      value: pendingOrders.data?.pagination?.total,
      icon: ClipboardList,
      to: "/orders?orderStatus=pending",
    },
  ];

  return (
    <>
      <Topbar title="Overview" />
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              className="focus-ring rounded-2xl border border-ink-700 bg-ink-900 p-5 transition-colors hover:border-ink-600"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-ink-400">{label}</p>
                <Icon size={16} className="text-ember-400" />
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-ink-100">
                {value ?? "—"}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-ink-700 bg-ink-900">
          <div className="flex items-center justify-between border-b border-ink-800 px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-ink-100">
              <TrendingUp size={16} className="text-ember-400" />
              Recent orders
            </h2>
            <Link to="/orders" className="text-xs text-ember-400 hover:underline">
              View all
            </Link>
          </div>

          {recentOrders.isLoading ? (
            <Spinner />
          ) : recentOrders.data?.data?.length ? (
            <div className="divide-y divide-ink-800">
              {recentOrders.data.data.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders?open=${order.id}`}
                  className="flex items-center justify-between px-5 py-3 text-sm hover:bg-ink-800/50"
                >
                  <div>
                    <p className="font-mono text-xs text-ink-300">
                      {order.orderNumber}
                    </p>
                    <p className="text-ink-100">{order.firstName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-ink-400">
                      ৳{order.totalAmount?.toLocaleString()}
                    </span>
                    <Badge className={ORDER_STATUS_STYLES[order.orderStatus]}>
                      {order.orderStatus}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-ink-500">
              No orders yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
