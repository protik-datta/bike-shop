import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Search, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useOrders } from "@/hooks/useOrders";
import { trackOrder as trackOrderService } from "@/services/orderService";
import { formatPrice, formatDate } from "@/utils/formatters";
import { buildRoute, ROUTES } from "@/constants/routes";
import { useToastStore } from "@/store/toastStore";

export default function OrdersPage() {
  const { data: orders, loading } = useOrders();
  const [trackNum, setTrackNum]     = useState("");
  const [trackPhone, setTrackPhone] = useState("");
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackLoading, setTrackLoading]   = useState(false);
  const { error: toastError } = useToastStore();

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackNum || !trackPhone) {
      toastError("Please enter both Order Number and Phone Number.");
      return;
    }
    setTrackLoading(true);
    setTrackingOrder(null);
    try {
      const res = await trackOrderService(trackNum.trim().toUpperCase(), trackPhone.trim());
      setTrackingOrder(res);
    } catch (err) {
      toastError(err?.message || "No matching order found.");
    } finally {
      setTrackLoading(false);
    }
  };

  const statusBadges = {
    pending:    <Badge variant="warning">Pending</Badge>,
    processing: <Badge variant="info">Processing</Badge>,
    shipped:    <Badge variant="gold">Shipped</Badge>,
    delivered:  <Badge variant="success">Delivered</Badge>,
    cancelled:  <Badge variant="danger">Cancelled</Badge>,
  };

  return (
    <div className="py-10">
      <Container>
        <SectionTitle
          subtitle="Customer Portal"
          title="Track & Manage Orders"
          description="View your order history or track an active shipment using your order number and phone."
        />

        {/* Track Order Bar */}
        <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] mb-10 max-w-3xl mx-auto">
          <h3 className="text-base font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Track Order Status</span>
          </h3>

          <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Order # (e.g. AB123456)"
              value={trackNum}
              onChange={(e) => setTrackNum(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-mono uppercase focus:border-[var(--color-accent)]"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={trackPhone}
              onChange={(e) => setTrackPhone(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-mono focus:border-[var(--color-accent)]"
            />
            <Button type="submit" variant="primary" loading={trackLoading}>
              Track Order
            </Button>
          </form>

          {/* Tracked result preview */}
          {trackingOrder && (
            <div className="mt-6 p-4 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-accent-muted)] flex items-center justify-between animate-fadeIn">
              <div>
                <span className="text-xs font-mono font-bold text-[var(--color-accent)] block">
                  #{trackingOrder.orderNumber}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  Placed on {formatDate(trackingOrder.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {statusBadges[trackingOrder.orderStatus]}
                <Link to={buildRoute(ROUTES.ORDER_DETAIL, { id: trackingOrder.id || trackingOrder._id })}>
                  <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
