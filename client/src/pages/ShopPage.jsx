import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { BikeCard } from "@/components/cards/BikeCard";
import { BikeCardSkeleton } from "@/components/cards/BikeCardSkeleton";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";
import { useBikes } from "@/hooks/useBikes";
import { BRANDS } from "@/constants/brands";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State from URL query or defaults
  const [search, setSearch]           = useState(searchParams.get("search") || "");
  const [selectedBrand, setBrand]     = useState(searchParams.get("brand") || "");
  const [selectedCategory, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice]       = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice]       = useState(searchParams.get("maxPrice") || "");
  const [minCC, setMinCC]             = useState(searchParams.get("minCC") || "");
  const [page, setPage]               = useState(Number(searchParams.get("page")) || 1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const { data: categories } = useCategories();

  // Query parameters for hook
  const queryParams = {
    search: debouncedSearch || undefined,
    category: selectedCategory || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    page,
    limit: 12,
  };

  const { data: bikes, pagination, loading } = useBikes(queryParams);

  // Sync state to URL search parameters
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedCategory) params.category = selectedCategory;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, selectedCategory, minPrice, maxPrice, page, setSearchParams]);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="py-10">
      <Container>
        {/* Header */}
        <SectionTitle
          subtitle="Inventory Catalog"
          title="All Motorcycles"
          description="Filter our entire range of sports, naked, adventure, cruiser, and commuter motorcycles."
        />

        {/* Search & Mobile Filter Toggle Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="w-full flex-1">
            <SearchBar
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder="Search by model name or keyword..."
            />
          </div>

          <Button
            variant="secondary"
            icon={SlidersHorizontal}
            onClick={() => setFilterDrawerOpen(true)}
            className="lg:hidden w-full sm:w-auto"
          >
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] rounded-2xl p-6 space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-subtle)]">
              <h3 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[var(--color-accent)]" />
                <span>Filters</span>
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:border-[var(--color-accent)]"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Price Range (BDT)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ৳"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-mono focus:border-[var(--color-accent)]"
                />
                <input
                  type="number"
                  placeholder="Max ৳"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-mono focus:border-[var(--color-accent)]"
                />
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <BikeCardSkeleton key={i} />
                ))}
              </div>
            ) : bikes.length === 0 ? (
              <EmptyState
                title="No bikes match your filters"
                description="Try clearing your search terms or relaxing your price/displacement constraints."
                actionText="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {bikes.map((bike) => (
                    <BikeCard key={bike._id} bike={bike} />
                  ))}
                </div>

                {pagination && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={(p) => setPage(p)}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
