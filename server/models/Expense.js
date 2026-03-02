const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Please add expense description"],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "Please add expense amount"],
    min: 0,
  },
  category: {
    type: String,
    required: [true, "Please add expense category"],
    enum: [
      "rent",
      "utilities",
      "salaries",
      "maintenance",
      "supplies",
      "marketing",
      "other",
    ],
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "cheque", "online"],
    default: "cash",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  attachments: [
    {
      type: String,
    },
  ],
  notes: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
