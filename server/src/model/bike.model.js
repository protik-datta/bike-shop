// models/Bike.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const bikeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    brand: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    downPayment: { type: Number },
    cashbackOffer: { type: Number },
    emiPerMonth: { type: Number },
    emiDuration: { type: String },
    interestRate: { type: String },
    thumbnail: { type: String, required: true },
    images: [{ type: String }],
    imagesPublicIds: [{ type: String }],
    description: { type: String, required: true },
    engineCC: { type: Number },
    mileage: { type: String },
    brakeType: { type: String },
    stock: { type: Number, default: 0 },
    isSale: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isTopSelling: { type: Boolean, default: false },
    isHotDeal: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

bikeSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

bikeSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  const name = update?.$set?.name ?? update?.name;

  if (name && name.trim().length > 0) {
    const slug = slugify(name, { lower: true, strict: true });
    this.set({ slug });
  }
});

module.exports = mongoose.model("Bike", bikeSchema);
