import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { CheckoutLayout } from "@/layouts/CheckoutLayout";
import { Loader } from "@/components/ui/Loader";
import { ROUTES } from "@/constants/routes";
import {
  HomePage,
  ShopPage,
  CategoriesPage,
  CategoryDetailPage,
  ProductDetailPage,
  SearchPage,
  WishlistPage,
  CartPage,
  CheckoutPage,
  OrdersPage,
  OrderDetailPage,
  ComparePage,
  AboutPage,
  ContactPage,
  NotFoundPage,
} from "./LazyRoutes";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader fullPage text="Loading RevMotion..." />}>
        <Routes>
          {/* Main Layout Routes */}
          <Route element={<RootLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.SHOP} element={<ShopPage />} />
            <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
            <Route path={ROUTES.CATEGORY_DETAIL} element={<CategoryDetailPage />} />
            <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
            <Route path={ROUTES.SEARCH} element={<SearchPage />} />
            <Route path={ROUTES.WISHLIST} element={<WishlistPage />} />
            <Route path={ROUTES.CART} element={<CartPage />} />
            <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
            <Route path={ROUTES.ORDER_DETAIL} element={<OrderDetailPage />} />
            <Route path={ROUTES.COMPARE} element={<ComparePage />} />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
            <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          </Route>

          {/* Checkout Dedicated Layout */}
          <Route element={<CheckoutLayout />}>
            <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
