import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { ROUTES } from "@/constants/routes";
import { formatPrice } from "@/utils/formatters";

export function CartDrawer() {
  const { cartDrawerOpen, closeCartDrawer } = useUiStore();
  const { items, updateQuantity, removeItem, summary } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCartDrawer();
    navigate(ROUTES.CHECKOUT);
  };

  const handleViewCart = () => {
    closeCartDrawer();
    navigate(ROUTES.CART);
  };

  return (
    <Drawer
      isOpen={cartDrawerOpen}
      onClose={closeCartDrawer}
      title={`Your Cart (${items.reduce((s, i) => s + i.quantity, 0)})`}
      position="right"
      width="max-w-md"
    >
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added any bikes to your cart yet."
          actionText="Browse Bikes"
          onAction={() => {
            closeCartDrawer();
            navigate(ROUTES.SHOP);
          }}
        />
      ) : (
        <div className="flex flex-col h-full justify-between">
          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-3 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)]"
              >
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-20 h-14 object-cover rounded-lg bg-[var(--color-bg-card)] shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[var(--color-text)] truncate">
                    {item.name}
                  </h4>
                  <Price price={item.price} offerPrice={item.offerPrice} size="sm" />

                  {/* Quantity adjustment */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-1 rounded bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:text-[var(--color-accent)]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold font-mono px-2">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1 rounded bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:text-[var(--color-accent)] disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeItem(item._id)}
                  className="p-2 text-[var(--color-text-muted)] hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Footer Summary */}
          <div className="pt-6 border-t border-[var(--color-border)] mt-6 space-y-4 shrink-0">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>Subtotal</span>
                <span className="font-mono text-[var(--color-text)] font-semibold">
                  {formatPrice(summary.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>Estimated Delivery</span>
                <span className="font-mono text-[var(--color-text)] font-semibold">
                  {summary.delivery === 0 ? "FREE" : formatPrice(summary.delivery)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[var(--color-text)] pt-2 border-t border-[var(--color-border-subtle)]">
                <span>Total</span>
                <span className="font-mono text-[var(--color-accent)]">
                  {formatPrice(summary.total)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="secondary" onClick={handleViewCart}>
                View Cart
              </Button>
              <Button variant="primary" icon={ArrowRight} iconPosition="right" onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
