/**
 * import-products-complete.js
 *
 * ONE script that pulls EVERY field it possibly can from
 * newinfinitymotorsbd.com and upserts it into your Bike model:
 *
 *   name, brand, category, price, offerPrice, downPayment, cashbackOffer,
 *   emiPerMonth, emiDuration, interestRate, thumbnail, images, description,
 *   engineCC, mileage, brakeType, stock, isSale
 *
 * Safe to run multiple times: it UPSERTS by product name, so re-running
 * fills in anything that was missing before instead of duplicating.
 *
 * SETUP:
 *   npm install axios cheerio
 *
 * RUN:
 *   node import-products-complete.js
 *
 * Edit the 3 lines marked "// <-- EDIT" before running.
 */

const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

// <-- EDIT 1/2: paths to your real models
const Bike = require("./src/model/bike.model");
const Category = require("./src/model/category.model");

// <-- EDIT 3: your real MongoDB connection string
const MONGODB_URI =process.env.MONGODB_URI || "mongodb://localhost:27017/bike-shop";

const SOURCE_SITE = "https://newinfinitymotorsbd.com";

const KNOWN_BRANDS = [
  "Bajaj",
  "Yamaha",
  "Honda",
  "Suzuki",
  "TVS",
  "Hero",
  "Royal Enfield",
  "FB Mondial",
  "Enfield",
];

function detectBrand(text) {
  const found = KNOWN_BRANDS.find((b) =>
    text.toLowerCase().includes(b.toLowerCase()),
  );
  return found || "Other";
}

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumber(str) {
  if (!str) return undefined;
  const match = String(str)
    .replace(/,/g, "")
    .match(/[\d.]+/);
  return match ? Number(match[0]) : undefined;
}

// Pulls the DOWN PAYMENT / CASH BACK OFFER / EMI PER MONTH / EMI DURATION /
// INTEREST RATE table that WooCommerce stores in short_description.
function parseEmiTable(html) {
  const $ = cheerio.load(html || "");
  const result = {};

  $("table tr").each((_, tr) => {
    const cells = $(tr).find("td, th");
    if (cells.length < 2) return;
    const label = $(cells[0]).text().trim().toUpperCase();
    const value = $(cells[1]).text().trim();

    if (label.includes("DOWN PAYMENT")) result.downPayment = parseNumber(value);
    else if (label.includes("CASH BACK") || label.includes("CASHBACK"))
      result.cashbackOffer = parseNumber(value);
    else if (label.includes("EMI PER MONTH"))
      result.emiPerMonth = parseNumber(value);
    else if (label.includes("EMI DURATION")) result.emiDuration = value;
    else if (label.includes("INTEREST RATE")) result.interestRate = value;
  });

  return result;
}

// Best-effort extraction of engineCC / mileage / brakeType from the long
// free-text description. Site content isn't perfectly consistent, so this
// is a heuristic - anything it can't find is left undefined and reported
// at the end so you can fill it in by hand.
function cap(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

function parseBrakeType(plainText, productName) {
  // Pattern A: "Front and rear disc brakes" / "front and rear drum brake"
  let m = plainText.match(/front\s+and\s+rear\s+(disc|drum)\s*brakes?/i);
  if (m) return `Front ${cap(m[1])}, Rear ${cap(m[1])}`;

  // Pattern B: separate "Front Disc Brake" ... "Rear Drum Brake" mentions
  const front = plainText.match(/front\s+(disc|drum)\s*brake/i);
  const rear = plainText.match(/rear\s+(disc|drum)\s*brake/i);
  if (front || rear) {
    const parts = [];
    if (front) parts.push(`Front ${cap(front[1])}`);
    if (rear) parts.push(`Rear ${cap(rear[1])}`);
    return parts.join(", ");
  }

  // Pattern C: fall back to hints in the product name itself
  if (/dual disc|double disc/i.test(productName))
    return "Front Disc, Rear Disc";
  if (/single disc/i.test(productName)) return "Front Disc, Rear Drum";
  if (/\bdrum\b/i.test(productName) && !/disc/i.test(productName))
    return "Front Drum, Rear Drum";

  // Pattern D: last resort - just note which brake types are mentioned at all
  const hasDisc = /disc\s*brake/i.test(plainText);
  const hasDrum = /drum\s*brake/i.test(plainText);
  if (hasDisc && hasDrum) return "Front Disc, Rear Drum";
  if (hasDisc) return "Disc";
  if (hasDrum) return "Drum";

  return undefined;
}

function parseSpecs(plainText, productName) {
  const specs = {};

  const ccMatch = plainText.match(/(\d{2,4}(?:\.\d+)?)\s*cc\b/i);
  if (ccMatch) specs.engineCC = Number(ccMatch[1]);

  const mileageMatch = plainText.match(
    /(\d{2,3}(?:\s*-\s*\d{2,3})?)\s*(?:km\/l|kmpl)/i,
  );
  if (mileageMatch)
    specs.mileage = `${mileageMatch[1].replace(/\s+/g, "")} km/l`;

  const brakeType = parseBrakeType(plainText, productName);
  if (brakeType) specs.brakeType = brakeType;

  return specs;
}

async function fetchAllProductsRaw() {
  const products = [];
  let page = 1;
  while (true) {
    const url = `${SOURCE_SITE}/wp-json/wc/store/v1/products?per_page=100&page=${page}`;
    const { data } = await axios.get(url, { timeout: 15000 });
    if (!Array.isArray(data) || data.length === 0) break;
    products.push(...data);
    page++;
  }
  return products;
}

const categoryCache = new Map();
async function getOrCreateCategory(name, fallbackImage) {
  if (categoryCache.has(name)) return categoryCache.get(name);
  let cat = await Category.findOne({ name });
  if (!cat) {
    cat = await Category.create({
      name,
      description: `${name} motorcycles and bikes.`,
      image:
        fallbackImage ||
        "https://via.placeholder.com/400x300?text=" + encodeURIComponent(name),
    });
  }
  categoryCache.set(name, cat);
  return cat;
}

(async () => {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  console.log("Fetching all products from Store API...");
  const rawProducts = await fetchAllProductsRaw();
  console.log(`Got ${rawProducts.length} products.\n`);

  let inserted = 0;
  let updated = 0;
  let failed = 0;
  const incompleteReport = [];

  for (const p of rawProducts) {
    const images = (p.images || []).map((img) => img.src);
    const categoryName = p.categories?.[0]?.name || "Uncategorized";
    const fullDescriptionHtml = p.description || p.short_description || "";
    const plainDescription = stripHtml(fullDescriptionHtml);

    const emiData = parseEmiTable(p.short_description);
    const specs = parseSpecs(plainDescription, p.name);

    const doc = {
      name: p.name,
      brand: detectBrand(`${categoryName} ${p.name}`),
      price: Number(p.prices?.regular_price) / 100 || 0,
      offerPrice: p.on_sale ? Number(p.prices?.price) / 100 : undefined,
      thumbnail: images[0] || "",
      images: images.slice(1),
      description: plainDescription || "No description available.",
      stock: p.is_in_stock ? (p.stock_quantity ?? 1) : 0,
      isSale: !!p.on_sale,
      ...emiData,
      ...specs,
    };

    if (!doc.name || !doc.thumbnail) {
      console.log(
        `SKIP "${p.name || "unnamed"}" - missing name or thumbnail (required fields).`,
      );
      failed++;
      continue;
    }

    const category = await getOrCreateCategory(categoryName, images[0]);
    doc.category = category._id;

    // Track anything we could not find, per product, for the end-of-run report
    const missing = [];
    for (const key of [
      "downPayment",
      "cashbackOffer",
      "emiPerMonth",
      "emiDuration",
      "interestRate",
      "engineCC",
      "mileage",
      "brakeType",
    ]) {
      if (doc[key] === undefined) missing.push(key);
    }
    if (missing.length > 0) incompleteReport.push({ name: p.name, missing });

    try {
      const existed = await Bike.findOne({ name: p.name });
      await Bike.findOneAndUpdate(
        { name: p.name },
        { $set: doc },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );
      if (existed) updated++;
      else inserted++;
    } catch (err) {
      console.log(`FAILED "${p.name}": ${err.message}`);
      failed++;
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`Inserted: ${inserted}, Updated: ${updated}, Failed: ${failed}`);

  if (incompleteReport.length > 0) {
    console.log(
      `\n${incompleteReport.length} product(s) have at least one field that could not be auto-detected:`,
    );
    for (const r of incompleteReport) {
      console.log(`  - ${r.name}: missing [${r.missing.join(", ")}]`);
    }
    console.log(
      `\nThese need a manual check in the admin panel - the source page's wording likely didn't match the expected pattern.`,
    );
  } else {
    console.log(`\nEvery field was found for every product.`);
  }

  await mongoose.disconnect();
})();
