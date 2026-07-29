export const ROUTES = {
  HOME:              "/",
  SHOP:              "/shop",
  CATEGORIES:        "/categories",
  CATEGORY_DETAIL:   "/categories/:slug",
  PRODUCT_DETAIL:    "/bikes/:slug",
  SEARCH:            "/search",
  WISHLIST:          "/wishlist",
  CART:              "/cart",
  CHECKOUT:          "/checkout",
  ORDERS:            "/orders",
  ORDER_DETAIL:      "/orders/:id",
  COMPARE:           "/compare",
  ABOUT:             "/about",
  CONTACT:           "/contact",
  NOT_FOUND:         "*",
};

/** Build a concrete URL from a route pattern */
export function buildRoute(pattern, params = {}) {
  return Object.entries(params).reduce(
    (url, [key, val]) => url.replace(`:${key}`, encodeURIComponent(val)),
    pattern
  );
}
