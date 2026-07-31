import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  GitCompare,
  ShoppingBag,
  ShieldCheck,
  Zap,
  Gauge,
  CheckCircle2,
  Share2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { BikeCard } from "@/components/cards/BikeCard";
import { useBikeDetail } from "@/hooks/useBikes";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCompareStore } from "@/store/compareStore";
import { useToastStore } from "@/store/toastStore";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { getRelatedBikes } from "@/services/bikeService";
import { getReviewsBySlug, getRatingStats } from "@/services/reviewService";
import { formatPrice } from "@/utils/formatters";
import { ROUTES } from "@/constants/routes";
import { FaWhatsapp } from "react-icons/fa";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: bike, loading, error } = useBikeDetail(slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs"); // specs | features | reviews
  const [relatedBikes, setRelatedBikes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);

  const { addItem: addToCart } = useCartStore();
  const { toggle: toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToCompare, isInCompare } = useCompareStore();
  const { success, info, warning } = useToastStore();
  const { addBike: addRecentlyViewed, getRecentlyViewed } = useRecentlyViewed();

  const isWishlisted = bike ? isInWishlist(bike._id) : false;
  const isCompared = bike ? isInCompare(bike._id) : false;

  useEffect(() => {
    if (!bike) return;
    addRecentlyViewed(bike);
    setSelectedImage(0);

    // Fetch related bikes & reviews
    getRelatedBikes(bike.slug, bike.category?.slug || "sport")
      .then(setRelatedBikes)
      .catch(() => {});

    getReviewsBySlug(bike.slug)
      .then(setReviews)
      .catch(() => {});
    getRatingStats(bike.slug)
      .then(setRatingStats)
      .catch(() => {});
  }, [bike]);

  if (loading) return <Loader fullPage text="Inspecting motorcycle..." />;
  if (error || !bike)
    return <ErrorState title="Bike Not Found" message={error} />;

  const galleryImages = [bike.thumbnail, ...(bike.images || [])].filter(
    Boolean,
  );

  const handleAddToCart = () => {
    addToCart(bike, quantity);
    success(`Added ${quantity}x ${bike.name} to Cart!`);
  };

  const handleBuyNow = () => {
    addToCart(bike, quantity);
    navigate(ROUTES.CHECKOUT);
  };

  const handleWishlist = () => {
    const added = toggleWishlist(bike);
    if (added) success(`Added ${bike.name} to Wishlist`);
    else info(`Removed ${bike.name} from Wishlist`);
  };

  const handleCompare = () => {
    const res = addToCompare(bike);
    if (res.success) success(`Added ${bike.name} to Compare list`);
    else warning(res.message);
  };

  const recentBikes = getRecentlyViewed(bike.slug);

  return (
    <div className="py-8">
      <Container>
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: "Bikes", to: ROUTES.SHOP },
            {
              label: bike.brand,
              to: `${ROUTES.SHOP}?brand=${encodeURIComponent(bike.brand)}`,
            },
            { label: bike.name },
          ]}
        />

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 my-8">
          {/* Gallery with Main Image Zoom & Thumbnails */}
          <div className="space-y-4">
            <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] group">
              <img
                src={galleryImages[selectedImage] || bike.thumbnail}
                alt={bike.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {bike.isSale && <Badge variant="accent">Sale</Badge>}
                {bike.isNewArrival && <Badge variant="gold">New Arrival</Badge>}
              </div>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === idx
                        ? "border-[var(--color-accent)] shadow-md shadow-[rgba(255,77,0,0.3)]"
                        : "border-[var(--color-border-subtle)] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Overview & Purchase Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-accent)] uppercase tracking-widest mb-1">
                <span>{bike.brand}</span>
                <span>•</span>
                <span>{bike.category?.name || "Motorcycle"}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-wider text-[var(--color-text)]">
                {bike.name}
              </h1>

              <div className="flex items-center gap-4 mt-2">
                <Rating
                  rating={bike.rating || 4.8}
                  reviewCount={bike.reviewCount || 45}
                  showValue
                />
                <span className="text-xs font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {bike.stock > 0
                    ? `${bike.stock} Available In Stock`
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
              <Price
                price={bike.price}
                offerPrice={bike.offerPrice}
                size="xl"
              />

              {/* EMI Calculation Snippet */}
              {bike.emiPerMonth && (
                <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs text-[var(--color-text-muted)] font-mono">
                  <span>EMI Starting At:</span>
                  <span className="font-bold text-[var(--color-gold)] font-sans">
                    {formatPrice(bike.emiPerMonth)}/mo (
                    {bike.emiDuration || "36 mos"}) @{" "}
                    {bike.interestRate || "0%"}
                  </span>
                </div>
              )}
            </div>

            {/* Key Quick Specs */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)]">
                <Zap className="w-5 h-5 text-[var(--color-accent)] mx-auto mb-1" />
                <span className="block text-xs font-mono font-bold text-[var(--color-text)]">
                  {bike.engineCC} cc
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  Displacement
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)]">
                <Gauge className="w-5 h-5 text-[var(--color-gold)] mx-auto mb-1" />
                <span className="block text-xs font-mono font-bold text-[var(--color-text)]">
                  {bike.mileage}
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  Mileage
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)]">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="block text-xs font-mono font-bold text-[var(--color-text)]">
                  {bike.brakeType}
                </span>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  Brake System
                </span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {bike.description}
            </p>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                  Quantity:
                </span>
                <div className="flex items-center gap-2 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-bold text-[var(--color-text)] hover:text-[var(--color-accent)]"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm px-2 text-[var(--color-text)]">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(bike.stock, quantity + 1))
                    }
                    className="px-3 py-1 text-sm font-bold text-[var(--color-text)] hover:text-[var(--color-accent)]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  icon={ShoppingBag}
                  onClick={handleAddToCart}
                  size="lg"
                >
                  Add to Cart
                </Button>
                <Button variant="primary" onClick={handleBuyNow} size="lg">
                  Buy Now
                </Button>
                <Button
                  variant="secondary"
                  icon={FaWhatsapp}
                  size="lg"
                  onClick={() => {
                    const message = `Hello, I'm interested in the ${bike.name} (${bike.slug}). Could you provide more details?`;
                    const whatsappUrl = `https://wa.me/+8801744361242?text=${encodeURIComponent(
                      message,
                    )}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                >
                  Order Now on WhatsApp
                </Button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="ghost"
                  icon={Heart}
                  size="sm"
                  onClick={handleWishlist}
                  className={isWishlisted ? "text-rose-500 font-bold" : ""}
                >
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </Button>

                <Button
                  variant="ghost"
                  icon={GitCompare}
                  size="sm"
                  onClick={handleCompare}
                  className={isCompared ? "text-amber-500 font-bold" : ""}
                >
                  {isCompared ? "In Compare" : "Compare"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Bikes Section */}
        {relatedBikes.length > 0 && (
          <div className="my-16 pt-8 border-t border-[var(--color-border-subtle)]">
            <h3 className="text-2xl font-display uppercase tracking-wider text-[var(--color-text)] mb-8">
              Related Motorcycles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBikes.map((rel) => (
                <BikeCard key={rel._id} bike={rel} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Section */}
        {recentBikes.length > 0 && (
          <div className="my-16 pt-8 border-t border-[var(--color-border-subtle)]">
            <h3 className="text-2xl font-display uppercase tracking-wider text-[var(--color-text)] mb-8">
              Recently Viewed
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentBikes.slice(0, 4).map((rec) => (
                <BikeCard key={rec._id} bike={rec} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
