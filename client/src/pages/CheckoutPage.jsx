import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { placeOrder } from "@/services/orderService";
import { validateCheckoutForm } from "@/utils/validators";
import {
  DIVISIONS,
  DISTRICTS_BY_DIVISION,
  PAYMENT_METHODS,
} from "@/constants/checkout";
import { formatPrice } from "@/utils/formatters";
import { buildRoute, ROUTES } from "@/constants/routes";

// Backend limits — keep in sync with models/Order.js
const FIELD_LIMITS = {
  firstName: 100,
  streetAddress: 500,
  notes: 1000,
};

// Strip spaces, dashes, parentheses so "017 000-00000" / "+880 1700 000000"
// still passes the backend's BD_PHONE_REGEX (which has no tolerance for them).
const normalizePhone = (value) => value.replace(/[\s\-()]/g, "");

export default function CheckoutPage() {
  const { items, summary, clearCart, discountAmount } = useCartStore();
  const { success, error: toastError } = useToastStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    streetAddress: "",
    phone: "",
    email: "",
    division: "Dhaka",
    district: DISTRICTS_BY_DIVISION["Dhaka"]?.[0] || "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const districts = DISTRICTS_BY_DIVISION[formData.division] || [];

  const handleChange = (field, val) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: val };

      if (field === "division") {
        const nextDistricts = DISTRICTS_BY_DIVISION[val] || [];
        updated.district = nextDistricts[0] || "";
      }

      if (field === "phone") {
        updated.phone = normalizePhone(val);
      }

      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!formData.district) {
      setErrors((prev) => ({ ...prev, district: "Please select a district" }));
      toastError("Please select a district.");
      return;
    }

    const validation = validateCheckoutForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toastError("Please fix the highlighted fields in the form.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        division: formData.division,
        district: formData.district,
        streetAddress: formData.streetAddress.trim(),
        phone: normalizePhone(formData.phone),
        email: formData.email.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        orderItems: items.map((i) => ({
          bike: i._id || i.id,
          name: i.name,
          price: i.offerPrice ?? i.price,
          quantity: i.quantity,
          thumbnail: i.thumbnail,
        })),
        deliveryFee: summary.delivery,
        discountAmount,
        subtotal: summary.subtotal,
        totalAmount: summary.total,
      };

      console.log("Submitting orderItems:", payload.orderItems);

      const createdOrder = await placeOrder(payload);
      clearCart();
      success(`Order placed successfully! Order #${createdOrder.orderNumber}`);
      navigate(
        buildRoute(ROUTES.ORDER_DETAIL, {
          id: createdOrder.id || createdOrder._id,
        }),
      );
    } catch (err) {
      toastError(err?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-12 text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">
          Your cart is empty
        </h2>
        <Button variant="primary" onClick={() => navigate(ROUTES.SHOP)}>
          Return to Shop
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display uppercase tracking-wider text-[var(--color-text)]">
            Checkout & Shipping
          </h1>
          <p className="text-xs text-[var(--color-text-muted)]">
            Complete your shipping address and confirm your Cash on Delivery
            order.
          </p>
        </div>

        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-4">
              <h3 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border-subtle)] pb-3">
                Shipping Information
              </h3>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  maxLength={FIELD_LIMITS.firstName}
                  placeholder="e.g. Rafiqul Islam"
                  className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border text-sm text-[var(--color-text)] focus:outline-none ${
                    errors.firstName
                      ? "border-rose-500"
                      : "border-[var(--color-border)] focus:border-[var(--color-accent)]"
                  }`}
                />
                {errors.firstName && (
                  <span className="text-[11px] text-rose-400">
                    {errors.firstName}
                  </span>
                )}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                    Phone Number (BD) *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="e.g. 01700000000"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border text-sm text-[var(--color-text)] font-mono focus:outline-none ${
                      errors.phone
                        ? "border-rose-500"
                        : "border-[var(--color-border)] focus:border-[var(--color-accent)]"
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-[11px] text-rose-400">
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="e.g. rafiq@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border text-sm text-[var(--color-text)] focus:outline-none ${
                      errors.email
                        ? "border-rose-500"
                        : "border-[var(--color-border)] focus:border-[var(--color-accent)]"
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[11px] text-rose-400">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Division & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                    Division *
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => handleChange("division", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:border-[var(--color-accent)]"
                  >
                    {DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                    District *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                    disabled={districts.length === 0}
                    className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] ${
                      errors.district
                        ? "border-rose-500"
                        : "border-[var(--color-border)]"
                    }`}
                  >
                    {districts.length === 0 ? (
                      <option value="">No districts available</option>
                    ) : (
                      districts.map((dis) => (
                        <option key={dis} value={dis}>
                          {dis}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.district && (
                    <span className="text-[11px] text-rose-400">
                      {errors.district}
                    </span>
                  )}
                </div>
              </div>

              {/* Street Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                  Detailed Street Address *
                </label>
                <textarea
                  rows={3}
                  value={formData.streetAddress}
                  onChange={(e) =>
                    handleChange("streetAddress", e.target.value)
                  }
                  maxLength={FIELD_LIMITS.streetAddress}
                  placeholder="House number, road number, area landmarks..."
                  className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border text-sm text-[var(--color-text)] focus:outline-none ${
                    errors.streetAddress
                      ? "border-rose-500"
                      : "border-[var(--color-border)] focus:border-[var(--color-accent)]"
                  }`}
                />
                {errors.streetAddress && (
                  <span className="text-[11px] text-rose-400">
                    {errors.streetAddress}
                  </span>
                )}
              </div>

              {/* Order Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                  Delivery Notes (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  maxLength={FIELD_LIMITS.notes}
                  placeholder="Special instructions for delivery truck driver..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-4">
              <h3 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border-subtle)] pb-3">
                Payment Method
              </h3>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      pm.available
                        ? paymentMethod === pm.id
                          ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)] cursor-pointer"
                          : "border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] cursor-pointer"
                        : "border-[var(--color-border-subtle)] opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === pm.id}
                        disabled={!pm.available}
                        onChange={() => setPaymentMethod(pm.id)}
                        className="accent-[var(--color-accent)]"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-[var(--color-text)]">
                          {pm.label}
                        </h4>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {pm.description}
                        </p>
                      </div>
                    </div>

                    {pm.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {pm.badge}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-6 sticky top-24">
            <h3 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border-subtle)] pb-3">
              Order Summary
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 no-scrollbar">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-bold font-mono text-[var(--color-accent)]">
                      {item.quantity}x
                    </span>
                    <span className="font-medium text-[var(--color-text)] truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono text-[var(--color-text-muted)] shrink-0 font-semibold">
                    {formatPrice(
                      (item.offerPrice ?? item.price) * item.quantity,
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs pt-4 border-t border-[var(--color-border-subtle)]">
              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>Subtotal</span>
                <span className="font-mono text-[var(--color-text)] font-semibold">
                  {formatPrice(summary.subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>Delivery Charge</span>
                <span className="font-mono text-[var(--color-text)] font-semibold">
                  {summary.delivery === 0
                    ? "FREE"
                    : formatPrice(summary.delivery)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono">
                    -{formatPrice(discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-[var(--color-text)] pt-3 border-t border-[var(--color-border-subtle)]">
                <span>Total Amount</span>
                <span className="font-mono text-[var(--color-accent)]">
                  {formatPrice(summary.total)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              icon={Lock}
            >
              Confirm Order (Cash on Delivery)
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--color-text-muted)]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Risk-Free Cash on Delivery</span>
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
}
