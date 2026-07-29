/** React Query / cache key namespaces for services */
export const QUERY_KEYS = {
  BIKES:         "bikes",
  BIKE_DETAIL:   "bike-detail",
  FEATURED:      "bikes-featured",
  TRENDING:      "bikes-trending",
  NEW_ARRIVALS:  "bikes-new-arrivals",
  BEST_SELLERS:  "bikes-best-sellers",
  HOT_DEALS:     "bikes-hot-deals",
  POPULAR:       "bikes-popular",

  CATEGORIES:     "categories",
  CATEGORY_DETAIL:"category-detail",

  ORDERS:         "orders",
  ORDER_DETAIL:   "order-detail",

  REVIEWS:        "reviews",
};

/** localStorage key constants */
export const LS_KEYS = {
  CART:            "revmotion:cart",
  WISHLIST:        "revmotion:wishlist",
  COMPARE:         "revmotion:compare",
  RECENTLY_VIEWED: "revmotion:recently-viewed",
  ORDERS:          "revmotion:orders",
};

/** Items per page defaults */
export const PAGE_SIZE = {
  SHOP:    12,
  ORDERS:  10,
  REVIEWS:  5,
};

/** Max compare items */
export const MAX_COMPARE_ITEMS = 3;

/** Max recently viewed */
export const MAX_RECENTLY_VIEWED = 8;
