import React from "react";
import { Link } from "react-router-dom";
import { Heart, GitCompare, ShoppingBag, Eye, Gauge, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCompareStore } from "@/store/compareStore";
import { useToastStore } from "@/store/toastStore";
import { buildRoute, ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

export function BikeCard({ bike, className = "" }) {
  const { addItem: addToCart } = useCartStore();
  const { toggle: toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToCompare, isInCompare } = useCompareStore();
  const { success, info, warning } = useToastStore();

  const isWishlisted = isInWishlist(bike._id);
  const isCompared = isInCompare(bike._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(bike);
    if (added) {
      success(`Added ${bike.name} to Wishlist`);
    } else {
      info(`Removed ${bike.name} from Wishlist`);
    }
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addToCompare(bike);
    if (result.success) {
      success(`Added ${bike.name} to Compare list`);
    } else {
      warning(result.message);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(bike, 1);
    success(`Added ${bike.name} to Cart!`);
  };

  const detailUrl = buildRoute(ROUTES.PRODUCT_DETAIL, { slug: bike.slug });

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[rgba(255,77,0,0.12)]",
        className
      )}
    >
      {/* Top Badges & Quick Action Overlay */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-bg-subtle)]">
        <img
          src={bike.thumbnail}
          alt={bike.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {bike.isSale && <Badge variant="accent">Sale</Badge>}
          {bike.isNewArrival && <Badge variant="gold">New</Badge>}
          {bike.isHotDeal && <Badge variant="danger font-bold">Hot Deal</Badge>}
        </div>

        {/* Quick Actions (Hover overlay) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleWishlist}
            className={cn(
              "p-2 rounded-full backdrop-blur-md transition-all shadow-md",
              isWishlisted
                ? "bg-rose-500 text-white"
                : "bg-black/60 text-white hover:bg-[var(--color-accent)]"
            )}
            title="Add to Wishlist"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={handleCompare}
            className={cn(
              "p-2 rounded-full backdrop-blur-md transition-all shadow-md",
              isCompared
                ? "bg-amber-500 text-black font-bold"
                : "bg-black/60 text-white hover:bg-[var(--color-accent)]"
            )}
            title="Compare Bike"
          >
            <GitCompare className="w-4 h-4" />
          </button>
        </div>

        {/* Quick View Link */}
        <Link
          to={detailUrl}
          className="absolute inset-0 z-0"
          aria-label={bike.name}
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-1">
          <span className="font-semibold uppercase text-[var(--color-accent)] tracking-wider">
            {bike.brand}
          </span>
          <span className="font-medium text-[var(--color-text-faint)]">
            {bike.category?.name || "Motorcycle"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-1 mb-2">
          <Link to={detailUrl}>{bike.name}</Link>
        </h3>

        {/* Key Spec Badges */}
        <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)] mb-4 font-mono">
          <span className="inline-flex items-center gap-1">
            <Zap className="w-3 h-3 text-[var(--color-gold)]" />
            {bike.engineCC} cc
          </span>
          <span className="text-[var(--color-border)]">•</span>
          <span className="inline-flex items-center gap-1">
            <Gauge className="w-3 h-3 text-[var(--color-accent)]" />
            {bike.mileage}
          </span>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <Rating
            rating={bike.rating || 4.5}
            reviewCount={bike.reviewCount || 12}
            size="sm"
          />
        </div>

        {/* Price & Add to Cart Button */}
        <div className="mt-auto pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-2">
          <Price
            price={bike.price}
            offerPrice={bike.offerPrice}
            size="md"
          />

          <button
            onClick={handleAddToCart}
            disabled={bike.stock <= 0}
            className="p-2.5 rounded-xl bg-[var(--color-bg-subtle)] hover:bg-[var(--color-accent)] text-[var(--color-text)] hover:text-white border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all shadow-sm active:scale-95 disabled:opacity-40 shrink-0"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
