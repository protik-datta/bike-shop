import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { formatPrice } from "@/utils/formatters";
import { ROUTES } from "@/constants/routes";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    summary,
    applyCoupon,
    removeCoupon,
    couponCode,
    couponLabel,
    discountAmount,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const { success, error: toastError } = useToastStore();
  const navigate = useNavigate();

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const effectivePrice = Number(item.offerPrice ?? item.price ?? 0);
        return sum + effectivePrice * Number(item.quantity || 0);
      }, 0),
    [items]
  );

  const deliveryCharge = Number(summary?.delivery ?? 0);
  const couponDiscountAmount = Number(discountAmount ?? 0);
  const totalAmount = Math.max(0, subtotal + deliveryCharge - couponDiscountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      success(`Coupon applied: ${res.message}`);
      setCouponInput("");
    } else {
      toastError(res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-12">
        <Container>
          <EmptyState
            icon={ShoppingBag}
            title="Your Cart is Empty"
            description="Explore our inventory to add motorcycles to your shopping cart."
            actionText="Start Shopping"
            onAction={() => navigate(ROUTES.SHOP)}
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10">
      <Container>
        <SectionTitle
          subtitle="Order Review"
          title="Shopping Cart"
          description="Review your selected bikes, apply promotional coupons, and proceed to checkout."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const effectivePrice = item.offerPrice ?? item.price;
              const lineTotal = effectivePrice * item.quantity;

              return (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-24 h-16 object-cover rounded-xl bg-[var(--color-bg-subtle)] shrink-0"
                    />
                    <div>
                      <h3 className="text-base font-bold text-[var(--color-text)]">
                        {item.name}
                      </h3>
                      <span className="text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                        {item.brand}
                      </span>
                      <div className="mt-1">
                        <Price price={item.price} offerPrice={item.offerPrice} size="sm" />
                      </div>
                    </div>
                  </div>

                  {/* Quantity adjustment & Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--color-border-subtle)]">
                    <div className="flex items-center gap-2 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-1">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-2.5 py-1 text-sm font-bold text-[var(--color-text)] hover:text-[var(--color-accent)]"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-sm px-2 text-[var(--color-text)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="px-2.5 py-1 text-sm font-bold text-[var(--color-text)] hover:text-[var(--color-accent)] disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right font-mono font-bold text-base text-[var(--color-text)]">
                      {formatPrice(lineTotal)}
                    </div>

                    <button
                      onClick={() => removeItem(item._id)}
                      className="p-2 text-[var(--color-text-muted)] hover:text-rose-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link to={ROUTES.SHOP}>
                <Button variant="secondary">Continue Shopping</Button>
              </Link>
            </div>
          </div>

          {/* Cart Summary & Coupon UI */}
          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-6 sticky top-28">
            <h3 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border-subtle)] pb-4">
              Order Summary
            </h3>

            {/* Coupon Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Have a coupon code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. REV20"
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-mono uppercase focus:border-[var(--color-accent)]"
                />
                <Button type="submit" variant="secondary" size="sm">
                  Apply
                </Button>
              </div>

              {couponCode && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {couponCode}: {couponLabel}
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-3 text-sm pt-4 border-t border-[var(--color-border-subtle)]">
              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>Subtotal</span>
                <span className="font-mono text-[var(--color-text)] font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>Delivery Charge</span>
                <span className="font-mono text-[var(--color-text)] font-semibold">
                  {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
                </span>
              </div>

              {couponDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Coupon Discount</span>
                  <span className="font-mono">
                    -{formatPrice(couponDiscountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold text-[var(--color-text)] pt-3 border-t border-[var(--color-border-subtle)]">
                <span>Total Amount</span>
                <span className="font-mono text-[var(--color-accent)]">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate(ROUTES.CHECKOUT)}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
