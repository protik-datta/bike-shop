import React from "react";
import { Link } from "react-router-dom";
import { GitCompare, Trash2, ShoppingBag } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Price } from "@/components/ui/Price";
import { useCompareStore } from "@/store/compareStore";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { buildRoute, ROUTES } from "@/constants/routes";

export default function ComparePage() {
  const { items: bikes, removeItem, clearCompare } = useCompareStore();
  const { addItem: addToCart } = useCartStore();
  const { success } = useToastStore();

  if (bikes.length === 0) {
    return (
      <div className="py-12">
        <Container>
          <EmptyState
            icon={GitCompare}
            title="No bikes selected for comparison"
            description="Add up to 3 bikes to compare engine power, torque, price, and braking side-by-side."
            actionText="Browse Bikes"
            onAction={() => (window.location.href = ROUTES.SHOP)}
          />
        </Container>
      </div>
    );
  }

  const specRows = [
    { label: "Price", render: (b) => <Price price={b.price} offerPrice={b.offerPrice} size="sm" /> },
    { label: "Displacement", render: (b) => <span className="font-mono font-bold">{b.engineCC} cc</span> },
    { label: "Mileage", render: (b) => <span className="font-mono">{b.mileage}</span> },
    { label: "Brake Type", render: (b) => <span>{b.brakeType}</span> },
    { label: "Engine", render: (b) => <span>{b.specs?.engine || "—"}</span> },
    { label: "Max Power", render: (b) => <span className="font-mono text-[var(--color-accent)]">{b.specs?.maxPower || "—"}</span> },
    { label: "Max Torque", render: (b) => <span className="font-mono text-[var(--color-gold)]">{b.specs?.maxTorque || "—"}</span> },
    { label: "Fuel Tank", render: (b) => <span className="font-mono">{b.specs?.fuelTank || "—"}</span> },
    { label: "Kerb Weight", render: (b) => <span className="font-mono">{b.specs?.weight || "—"}</span> },
    { label: "Top Speed", render: (b) => <span className="font-mono">{b.specs?.topSpeed || "—"}</span> },
  ];

  return (
    <div className="py-10">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionTitle
            subtitle="Side-By-Side Analysis"
            title={`Compare Motorcycles (${bikes.length}/3)`}
            description="Analyze detailed technical specifications to select your perfect machine."
          />
          <Button variant="ghost" icon={Trash2} onClick={clearCompare}>
            Clear All
          </Button>
        </div>

        {/* Comparison Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)]">
          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)]">
                <th className="p-4 w-1/4 text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-bold">
                  Spec / Model
                </th>
                {bikes.map((b) => (
                  <th key={b._id} className="p-4 w-1/4 text-center align-top">
                    <div className="relative group">
                      <button
                        onClick={() => removeItem(b._id)}
                        className="absolute top-0 right-0 p-1 text-[var(--color-text-muted)] hover:text-rose-400"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <img
                        src={b.thumbnail}
                        alt={b.name}
                        className="w-full h-28 object-cover rounded-xl mb-2 bg-black"
                      />
                      <h4 className="font-bold text-sm text-[var(--color-text)] line-clamp-1">
                        <Link to={buildRoute(ROUTES.PRODUCT_DETAIL, { slug: b.slug })}>
                          {b.name}
                        </Link>
                      </h4>
                      <span className="text-xs uppercase font-bold text-[var(--color-accent)]">
                        {b.brand}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-subtle)]/50 transition-colors"
                >
                  <td className="p-4 font-bold text-xs uppercase text-[var(--color-text-muted)]">
                    {row.label}
                  </td>
                  {bikes.map((b) => (
                    <td key={b._id} className="p-4 text-center text-xs text-[var(--color-text)]">
                      {row.render(b)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4">Action</td>
                {bikes.map((b) => (
                  <td key={b._id} className="p-4 text-center">
                    <Button
                      size="sm"
                      variant="primary"
                      icon={ShoppingBag}
                      onClick={() => {
                        addToCart(b, 1);
                        success(`Added ${b.name} to Cart`);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}
