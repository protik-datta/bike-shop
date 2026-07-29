import { lazy } from "react";

export const HomePage           = lazy(() => import("@/pages/HomePage"));
export const ShopPage           = lazy(() => import("@/pages/ShopPage"));
export const CategoriesPage     = lazy(() => import("@/pages/CategoriesPage"));
export const CategoryDetailPage = lazy(() => import("@/pages/CategoryDetailPage"));
export const ProductDetailPage  = lazy(() => import("@/pages/ProductDetailPage"));
export const SearchPage         = lazy(() => import("@/pages/SearchPage"));
export const WishlistPage       = lazy(() => import("@/pages/WishlistPage"));
export const CartPage           = lazy(() => import("@/pages/CartPage"));
export const CheckoutPage       = lazy(() => import("@/pages/CheckoutPage"));
export const OrdersPage         = lazy(() => import("@/pages/OrdersPage"));
export const OrderDetailPage    = lazy(() => import("@/pages/OrderDetailPage"));
export const ComparePage        = lazy(() => import("@/pages/ComparePage"));
export const AboutPage          = lazy(() => import("@/pages/AboutPage"));
export const ContactPage        = lazy(() => import("@/pages/ContactPage"));
export const NotFoundPage       = lazy(() => import("@/pages/NotFoundPage"));
