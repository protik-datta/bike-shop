import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { SearchBar } from "@/components/ui/SearchBar";
import { BikeCard } from "@/components/cards/BikeCard";
import { BikeCardSkeleton } from "@/components/cards/BikeCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBikes } from "@/hooks/useBikes";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const debouncedQuery = useDebounce(query, 300);

  const { data: bikes, loading } = useBikes({
    search: debouncedQuery || undefined,
    limit: 20,
  });

  const handleSearchChange = (val) => {
    setQuery(val);
    setSearchParams(val ? { q: val } : {});
  };

  return (
    <div className="py-10">
      <Container>
        <SectionTitle
          subtitle="Inventory Lookup"
          title="Search Motorcycles"
          description="Find specific models, displacement ranges, or brand names instantly."
        />

        <div className="max-w-2xl mx-auto mb-10">
          <SearchBar
            value={query}
            onChange={handleSearchChange}
            placeholder="Type 'Yamaha', 'R15', 'ABS', '300cc'..."
            autoFocus
          />
        </div>

        {debouncedQuery && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)]">
              Showing search results for:{" "}
              <span className="text-[var(--color-accent)]">"{debouncedQuery}"</span>
            </h3>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <BikeCardSkeleton key={i} />
            ))}
          </div>
        ) : bikes.length === 0 ? (
          <EmptyState
            title="No matching bikes found"
            description="Try searching with a broader keyword like 'Honda', 'Sport', or '150'."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bikes.map((bike) => (
              <BikeCard key={bike._id} bike={bike} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
