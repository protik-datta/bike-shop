import React from "react";
import { Heart, Trash2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { BikeCard } from "@/components/cards/BikeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useWishlistStore } from "@/store/wishlistStore";

export default function WishlistPage() {
  const { items: wishlistItems, clearWishlist } = useWishlistStore();

  return (
    <div className="py-10">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-accent)] mb-2 block">
              Saved Motorcycles
            </span>
            <h1 className="text-4xl font-display uppercase tracking-wider text-[var(--color-text)]">
              Your Wishlist ({wishlistItems.length})
            </h1>
          </div>

          {wishlistItems.length > 0 && (
            <Button variant="ghost" icon={Trash2} onClick={clearWishlist}>
              Clear Wishlist
            </Button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Tap the heart icon on any bike to save your dream machines here."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((bike) => (
              <BikeCard key={bike._id} bike={bike} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
