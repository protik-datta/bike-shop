import { ClipboardList, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import Spinner from "../../components/ui/Spinner";
import { Select } from "../../components/ui/Field";
import Dropdown from "../../components/ui/Dropdown";
import {
  ORDER_STATUSES,
  ORDER_STATUS_STYLES,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_STYLES,
} from "../../constants";
import { useOrders } from "../../hooks/useOrders";
import OrderDetail from "./OrderDetail";

export default function OrdersList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState(
    searchParams.get("orderStatus") || "",
  );
  const [paymentStatus, setPaymentStatus] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const orders = useOrders({
    page,
    limit: 15,
    search: search || undefined,
    orderStatus: orderStatus || undefined,
    paymentStatus: paymentStatus || undefined,
  });

  // Look the selected order up fresh from the list each render, so status/
  // payment mutations (which invalidate this query) are reflected instantly
  // in the open modal instead of showing a stale snapshot.
  const selectedOrder =
    orders.data?.data?.find((o) => o._id === selectedOrderId) || null;

  // Deep-link support: /orders?open=<id> opens that order once loaded.
  useEffect(() => {
    const openId = searchParams.get("open");
    if (!openId || !orders.data?.data) return;
    const match = orders.data.data.find((o) => o._id === openId);
    if (match) {
      setSelectedOrderId(match._id);
      searchParams.delete("open");
      setSearchParams(searchParams, { replace: true });
    }
  }, [orders.data, searchParams, setSearchParams]);

  return (
    <>
      <Topbar title="Orders" />

      <div className="p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search order # or name…"
              className="focus-ring w-full rounded-lg border border-ink-600 bg-ink-800 py-2 pl-8 pr-3 text-sm text-ink-100 placeholder:text-ink-500"
            />
          </div>
          <Dropdown
            value={orderStatus}
            onChange={(v) => {
              setOrderStatus(v);
              setPage(1);
            }}
            placeholder="All statuses"
            className="w-44"
            options={[
              { value: "", label: "All statuses" },
              ...ORDER_STATUSES.map((s) => ({ value: s, label: s })),
            ]}
          />
          <Dropdown
            value={paymentStatus}
            onChange={(v) => {
              setPaymentStatus(v);
              setPage(1);
            }}
            placeholder="All payments"
            className="w-44"
            options={[
              { value: "", label: "All payments" },
              ...PAYMENT_STATUSES.map((s) => ({ value: s, label: s })),
            ]}
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
          {orders.isLoading ? (
            <Spinner />
          ) : orders.data?.data?.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-800 text-xs text-ink-400">
                      <th className="px-5 py-3 font-medium">Order</th>
                      <th className="px-5 py-3 font-medium">Customer</th>
                      <th className="px-5 py-3 font-medium">Total</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Payment</th>
                      <th className="px-5 py-3 font-medium">Placed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-800">
                    {orders.data.data.map((order) => (
                      <tr
                        key={order._id}
                        onClick={() => setSelectedOrderId(order._id)}
                        className="cursor-pointer hover:bg-ink-800/40"
                      >
                        <td className="px-5 py-3 font-mono text-xs text-ink-300">
                          {order.orderNumber}
                        </td>
                        <td className="px-5 py-3 text-ink-100">
                          {order.firstName}
                        </td>
                        <td className="px-5 py-3 text-ink-300">
                          ৳{order.totalAmount?.toLocaleString()}
                        </td>
                        <td className="px-5 py-3">
                          <Badge
                            className={ORDER_STATUS_STYLES[order.orderStatus]}
                          >
                            {order.orderStatus}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <Badge
                            className={PAYMENT_STATUS_STYLES[order.paymentStatus]}
                          >
                            {order.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-ink-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={orders.data.pagination.page}
                totalPages={orders.data.pagination.totalPages}
                total={orders.data.pagination.total}
                onPageChange={setPage}
              />
            </>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="No orders found"
              description="Orders placed on the storefront will show up here."
            />
          )}
        </div>
      </div>

      <Modal
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrderId(null)}
        title="Order details"
        width="max-w-2xl"
      >
        {selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            onClose={() => setSelectedOrderId(null)}
          />
        )}
      </Modal>
    </>
  );
}
