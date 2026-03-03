const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a customer name"],
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  phone: {
    type: String,
    required: [true, "Please add a phone number"],
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  totalPurchases: {
    type: Number,
    default: 0,
    min: 0,
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0,
  },
  creditLimit: {
    type: Number,
    default: 0,
    min: 0,
  },
  currentCredit: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Customer", CustomerSchema);
