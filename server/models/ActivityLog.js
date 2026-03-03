const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    enum: ["admin", "manager", "cashier", "inventory"],
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      "CREATE",
      "UPDATE",
      "DELETE",
      "VIEW",
      "LOGIN",
      "LOGOUT",
      "DOWNLOAD",
      "EXPORT",
    ],
  },
  module: {
    type: String,
    required: true,
    enum: [
      "products",
      "sales",
      "customers",
      "suppliers",
      "inventory",
      "users",
      "reports",
      "categories",
      "auth",
    ],
  },
  description: {
    type: String,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  ipAddress: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient querying
ActivityLogSchema.index({ userId: 1, timestamp: -1 });
ActivityLogSchema.index({ userRole: 1, timestamp: -1 });
ActivityLogSchema.index({ module: 1, timestamp: -1 });

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
