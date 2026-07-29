import React from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Clock, Truck, ShieldCheck, Printer, Ban } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { useOrderDetail } from "@/hooks/useOrders";
import { cancelOrder as cancelOrderService, getStatusIndex, ORDER_STATUS_STEPS } from "@/services/orderService";
import { formatPrice, formatDate } from "@/utils/formatters";
import { ROUTES } from "@/constants/routes";
import { useToastStore } from "@/store/toastStore";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, loading, error } = useOrderDetail(id);
  const { success, error: toastError } = useToastStore();

  if (loading) return <Loader fullPage text="Retrieving order timeline..." />;
  if (error || !order) return <ErrorState title="Order Not Found" message={error} />;

  const currentStep = getStatusIndex(order.orderStatus);

  const handleCancelOrder = async () => {
    try {
      await cancelOrderService(order.id || order._id);
      success("Order cancelled successfully.");
      window.location.reload();
    } catch (err) {
      toastError(err?.message || "Failed to cancel order.");
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="py-10">
      <Container>
        <Breadcrumb
          items={[
            { label: "Orders", to: ROUTES.ORDERS },
            { label: `Order #${order.orderNumber}` },
          ]}
        />

        {/* Invoice Header Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-8 p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-display uppercase tracking-wider text-[var(--color-text)]">
                Order #{order.orderNumber}
              </h1>
              <Badge variant={order.orderStatus === "cancelled" ? "danger" : "success"}>
                {order.orderStatus}
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1 font-mono">
              Placed on {formatDate(order.createdAt)} • Payment Method: Cash on Delivery
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            {["pending", "processing"].includes(order.orderStatus) && (
              <Button variant="danger" icon={Ban} size="sm" onClick={handleCancelOrder}>
                Cancel Order
              </Button>
            )}
            <Button variant="secondary" icon={Printer} size="sm" onClick={handlePrintInvoice}>
              Print Invoice
            </Button>
          </div>
        </div>

        {/* Shipment Status Progress Timeline */}
        {order.orderStatus !== "cancelled" && (
          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-6">
              Delivery Progress
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {ORDER_STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                return (
                  <div key={step} className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all ${
                        isCompleted
                          ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[rgba(255,77,0,0.3)]"
                          : "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text)]">
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-4">
              <h3 className="text-base font-bold text-[var(--color-text)] border-b border-[var(--color-border-subtle)] pb-3">
                Purchased Motorcycles
              </h3>

              <div className="space-y-4">
                {order.orderItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[var(--color-bg-subtle)]"
                  >
                    <div className="flex items-center gap-4">
                      {item.thumbnail && (
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-20 h-14 object-cover rounded-lg bg-black shrink-0"
                        />
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-[var(--color-text)]">
                          {item.name}
                        </h4>
                        <span className="text-xs text-[var(--color-text-muted)] font-mono">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-sm font-bold text-[var(--color-text)]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address info */}
            <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-2">
              <h3 className="text-base font-bold text-[var(--color-text)] border-b border-[var(--color-border-subtle)] pb-3 mb-3">
                Recipient Shipping Details
              </h3>
              <p className="text-sm font-bold text-[var(--color-text)]">{order.firstName}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{order.streetAddress}</p>
              <p className="text-xs font-mono text-[var(--color-text-muted)]">
                Phone: {order.phone} {order.email && `• Email: ${order.email}`}
              </p>
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-4">
            <h3 className="text-base font-bold text-[var(--color-text)] border-b border-[var(--color-border-subtle)] pb-3">
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>Subtotal</span>
                <span className="font-mono text-[var(--color-text)] font-semibold">
                  {formatPrice(order.subtotal || order.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>Delivery Charge</span>
                <span className="font-mono text-[var(--color-text)] font-semibold">
                  {formatPrice(order.deliveryFee || 500)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono">-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-[var(--color-text)] pt-3 border-t border-[var(--color-border-subtle)]">
                <span>Total Amount</span>
                <span className="font-mono text-[var(--color-accent)]">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
