import React from "react";
import { TopNavbar } from "./TopNavbar";
import { Navbar } from "./Navbar";

/**
 * Combines the utility TopNavbar with the main Navbar into a single fixed
 * header. Fixing them together (rather than each pinning itself) keeps them
 * stacked correctly at every breakpoint and avoids the two bars fighting
 * over top-0.
 */
export function SiteHeader() {
  return (
    <div className="fixed inset-x-0 top-0 z-40">
      <TopNavbar />
      <Navbar />
    </div>
  );
}
