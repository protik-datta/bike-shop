/**
 * Mock reviews data — keyed by bike slug.
 * Replace with a real reviews API endpoint when available.
 */

const REVIEWER_POOL = [
  { name: "Rafiqul Islam",  avatar: "https://i.pravatar.cc/60?img=11", location: "Dhaka"       },
  { name: "Sumaiya Akter",  avatar: "https://i.pravatar.cc/60?img=47", location: "Chittagong"  },
  { name: "Tanvir Ahmed",   avatar: "https://i.pravatar.cc/60?img=33", location: "Sylhet"      },
  { name: "Md. Hasan",      avatar: "https://i.pravatar.cc/60?img=59", location: "Rajshahi"    },
  { name: "Nazmul Haque",   avatar: "https://i.pravatar.cc/60?img=15", location: "Khulna"      },
  { name: "Farhan Kabir",   avatar: "https://i.pravatar.cc/60?img=68", location: "Barishal"    },
  { name: "Jahangir Alam",  avatar: "https://i.pravatar.cc/60?img=25", location: "Mymensingh"  },
  { name: "Ritu Barua",     avatar: "https://i.pravatar.cc/60?img=45", location: "Rangpur"     },
];

function makeReview(id, reviewerIndex, rating, title, body, date) {
  return {
    id,
    reviewer: REVIEWER_POOL[reviewerIndex % REVIEWER_POOL.length],
    rating,
    title,
    body,
    date,
    helpful: Math.floor(Math.random() * 40),
    verified: true,
  };
}

export const MOCK_REVIEWS = {
  "yamaha-r15-v4": [
    makeReview("r1", 0, 5, "Best sportbike under 3 lakh!",       "The R15 V4 is an absolute masterpiece. The VVA engine is silky smooth and the cornering stability is phenomenal. Gets compliments everywhere.", "2025-05-10T00:00:00.000Z"),
    makeReview("r2", 1, 5, "Track-ready right out of the box",    "Took it to the track on the third day. The slipper clutch and traction-ready chassis made me feel confident immediately. Worth every taka.", "2025-04-22T00:00:00.000Z"),
    makeReview("r3", 2, 4, "Great bike, minor ergonomic issues",  "Loving the bike. Seat height is a bit tall for shorter riders. But the ride quality and fuel economy (45 km/L) make up for it.", "2025-03-18T00:00:00.000Z"),
    makeReview("r4", 3, 5, "Stunning looks, even better ride",    "My colleagues stop me every day asking about it. The quickshifter is buttery, the brakes bite hard and true. 10/10.", "2025-06-05T00:00:00.000Z"),
    makeReview("r5", 4, 4, "Solid daily and weekend machine",     "Perfect for both commuting and weekend rides. Only complaint is the heat on slow traffic. Otherwise pure joy.", "2025-07-01T00:00:00.000Z"),
  ],
  "kawasaki-z400": [
    makeReview("r6",  0, 5, "Screams at every rev",              "The parallel-twin engine has incredible character. Sounds aggressive at high RPM and pulls hard everywhere. Absolutely addictive.", "2025-04-30T00:00:00.000Z"),
    makeReview("r7",  1, 4, "Sharp handling, stiff suspension",  "The handling precision is surgical. The suspension is a bit firm for our roads but it's a pure street fighter — I wouldn't change it.", "2025-05-15T00:00:00.000Z"),
    makeReview("r8",  2, 5, "Built like a tank, rides like air", "Premium quality finish throughout. Brembo brakes are confidence-inspiring. Kawasaki did an outstanding job with the Z400.", "2025-06-22T00:00:00.000Z"),
    makeReview("r9",  3, 5, "Best naked bike in this segment",   "Compared it with CBR300R and Duke 390. The Z400 wins on feel and outright grunt. No regrets.", "2025-07-10T00:00:00.000Z"),
  ],
  "default": [
    makeReview("rd1", 0, 5, "Excellent purchase!",               "Everything about this bike exceeded my expectations. Great value for money and amazing to ride.", "2025-05-01T00:00:00.000Z"),
    makeReview("rd2", 1, 4, "Very happy with my choice",         "The build quality is top-notch. Minor teething issues early on but nothing serious. Would recommend.", "2025-05-20T00:00:00.000Z"),
    makeReview("rd3", 2, 5, "Premium experience from RevMotion", "Ordering was smooth, delivery fast, and the bike is exactly as described. Couldn't ask for more.", "2025-06-10T00:00:00.000Z"),
    makeReview("rd4", 3, 4, "Great daily rider",                 "Solid fuel economy and comfortable for long rides. The ergonomics suit me perfectly.", "2025-07-01T00:00:00.000Z"),
  ],
};

/** Get reviews for a bike slug, falling back to default set */
export function getReviewsForBike(slug) {
  return MOCK_REVIEWS[slug] ?? MOCK_REVIEWS["default"];
}

/** Compute aggregate stats from a reviews array */
export function computeRatingStats(reviews) {
  if (!reviews || reviews.length === 0) {
    return { average: 0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  }
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let total = 0;
  reviews.forEach((r) => {
    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    total += r.rating;
  });
  return {
    average: +(total / reviews.length).toFixed(1),
    count: reviews.length,
    distribution,
  };
}
