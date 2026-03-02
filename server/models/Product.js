const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a product name"],
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please add a category"],
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please add a selling price"],
    min: 0,
  },
  costPrice: {
    type: Number,
    required: [true, "Please add a cost price"],
    min: 0,
  },
  stock: {
    type: Number,
    required: [true, "Please add stock quantity"],
    default: 0,
    min: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: 0,
  },
  sku: {
    type: String,
    unique: true,
    trim: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
  },
  image: {
    type: String,
    default: "no-image.jpg",
  },
  variants: [
    {
      name: String,
      value: String,
      priceAdjustment: {
        type: Number,
        default: 0,
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for profit margin
ProductSchema.virtual("profitMargin").get(function () {
  return (((this.price - this.costPrice) / this.costPrice) * 100).toFixed(2);
});

// Check if stock is low
ProductSchema.virtual("isLowStock").get(function () {
  return this.stock <= this.lowStockThreshold;
});

module.exports = mongoose.model("Product", ProductSchema);
