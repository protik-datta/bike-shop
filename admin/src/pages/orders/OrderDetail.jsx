import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Select } from "../../components/ui/Field";
import {
  ALLOWED_STATUS_TRANSITIONS,
  ORDER_STATUS_STYLES,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_STYLES,
} from "../../constants";
import {
  useCancelOrder,
  useDeleteOrder,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
} from "../../hooks/useOrders";

export default function OrderDetail({ order, onClose }) {
  const updateStatus = useUpdateOrderStatus();
  const updatePayment = useUpdatePaymentStatus();
  const cancelOrder = useCancelOrder();
  const deleteOrder = useDeleteOrder();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const nextStatuses = ALLOWED_STATUS_TRANSITIONS[order.orderStatus] || [];
  const canCancel = ["pending", "processing"].includes(order.orderStatus);

  const handleStatusChange = async (e) => {
    const orderStatus = e.target.value;
    if (!orderStatus) return;
    try {
      await updateStatus.mutateAsync({ id: order.id, orderStatus });
      toast.success(`Order marked as ${orderStatus}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePaymentChange = async (e) => {
    const paymentStatus = e.target.value;
    try {
      await updatePayment.mutateAsync({ id: order.id, paymentStatus });
      toast.success(`Payment marked as ${paymentStatus}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelOrder.mutateAsync(order.id);
      toast.success("Order cancelled — stock restored");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrder.mutateAsync(order.id);
      toast.success("Order deleted");
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-ink-400">{order.orderNumber}</p>
          <p className="text-xs text-ink-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={ORDER_STATUS_STYLES[order.orderStatus]}>
            {order.orderStatus}
          </Badge>
          <Badge className={PAYMENT_STATUS_STYLES[order.paymentStatus]}>
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-ink-700 p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-ink-500">Customer</p>
          <p className="text-sm text-ink-100">{order.firstName}</p>
          <p className="text-sm text-ink-300">{order.phone}</p>
          {order.email && <p className="text-sm text-ink-300">{order.email}</p>}
        </div>
        <div>
          <p className="text-xs font-medium text-ink-500">Delivery address</p>
          <p className="text-sm text-ink-100">{order.streetAddress}</p>
          <p className="text-sm text-ink-300">
            {order.district}, {order.division}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-ink-700">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-800 text-xs text-ink-400">
              <th className="px-4 py-2 font-medium">Item</th>
              <th className="px-4 py-2 font-medium">Qty</th>
              <th className="px-4 py-2 font-medium text-right">Price</th>
              <th className="px-4 py-2 font-medium text-right">Line total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800">
            {order.orderItems.map((item) => (
              <tr key={item.id}>
                <td className="flex items-center gap-2 px-4 py-2">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="h-8 w-8 rounded object-cover"
                  />
                  {item.name}
                </td>
                <td className="px-4 py-2 text-ink-300">{item.quantity}</td>
                <td className="px-4 py-2 text-right text-ink-300">
                  ৳{item.price?.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right text-ink-100">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="space-y-1 border-t border-ink-800 px-4 py-3 text-sm">
          <div className="flex justify-between text-ink-400">
            <span>Subtotal</span>
            <span>৳{order.subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-ink-400">
            <span>Delivery fee</span>
            <span>৳{order.deliveryFee?.toLocaleString()}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-ink-400">
              <span>Discount</span>
              <span>-৳{order.discountAmount?.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-ink-800 pt-1.5 font-medium text-ink-100">
            <span>Total (Cash on Delivery)</span>
            <span>৳{order.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {order.notes && (
        <div>
          <p className="text-xs font-medium text-ink-500">Notes</p>
          <p className="text-sm text-ink-300">{order.notes}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 border-t border-ink-800 pt-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-medium text-ink-300">Order status</p>
          <Select
            value=""
            onChange={handleStatusChange}
            disabled={nextStatuses.length === 0 || updateStatus.isPending}
          >
            <option value="" disabled>
              {nextStatuses.length
                ? "Move to…"
                : `${order.orderStatus} (final)`}
            </option>
            {nextStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-medium text-ink-300">Payment status</p>
          <Select
            value={order.paymentStatus}
            onChange={handlePaymentChange}
            disabled={updatePayment.isPending}
          >
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex justify-between border-t border-ink-800 pt-4">
        <Button
          variant="ghost"
          onClick={() => setConfirmDelete(true)}
          className="text-rose-300"
        >
          <Trash2 size={14} /> Delete order
        </Button>
        <div className="flex gap-2">
          {canCancel && (
            <Button variant="danger" onClick={handleCancel} loading={cancelOrder.isPending}>
              Cancel order
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        loading={deleteOrder.isPending}
        title="Delete this order?"
        description="This permanently removes the order. Stock will be restored if it wasn't already cancelled. This cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
