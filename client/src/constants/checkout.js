/** Coupon codes applied entirely on the frontend (mock). */
export const COUPONS = {
  MOTO10:  { discount: 0.10, label: "10% off your order" },
  RIDE15:  { discount: 0.15, label: "15% off your order" },
  REV20:   { discount: 0.20, label: "20% off your order" },
  FIRST5:  { discount: 0.05, label: "5% first-time discount" },
};

/** Flat delivery fee in BDT */
export const DELIVERY_FEE = 500;

/** Free delivery threshold */
export const FREE_DELIVERY_THRESHOLD = 200000;

/** Divisions of Bangladesh */
export const DIVISIONS = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

/** Districts by division */
export const DISTRICTS_BY_DIVISION = {
  Dhaka: [
    "Dhaka", "Gazipur", "Narayanganj", "Narsingdi", "Manikganj",
    "Munshiganj", "Faridpur", "Madaripur", "Shariatpur", "Gopalganj",
    "Kishoreganj", "Tangail", "Rajbari",
  ],
  Chittagong: [
    "Chittagong", "Cox's Bazar", "Comilla", "Noakhali", "Feni",
    "Lakshmipur", "Chandpur", "Brahmanbaria", "Khagrachhari",
    "Rangamati", "Bandarban",
  ],
  Rajshahi: [
    "Rajshahi", "Bogura", "Joypurhat", "Naogaon", "Natore",
    "Chapainawabganj", "Pabna", "Sirajganj",
  ],
  Khulna: [
    "Khulna", "Bagerhat", "Chuadanga", "Jessore", "Jhenaidah",
    "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira",
  ],
  Barishal: [
    "Barishal", "Barguna", "Bhola", "Jhalokathi", "Patuakhali", "Pirojpur",
  ],
  Sylhet: [
    "Sylhet", "Moulvibazar", "Habiganj", "Sunamganj",
  ],
  Rangpur: [
    "Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat",
    "Nilphamari", "Panchagarh", "Thakurgaon",
  ],
  Mymensingh: [
    "Mymensingh", "Jamalpur", "Netrokona", "Sherpur",
  ],
};

/** Payment methods */
export const PAYMENT_METHODS = [
  {
    id:          "cod",
    label:       "Cash on Delivery",
    description: "Pay when your bike arrives.",
    available:   true,
  },
  {
    id:          "online",
    label:       "Online Payment",
    description: "bKash, Nagad, card — coming soon.",
    available:   false,
    badge:       "Coming Soon",
  },
];
