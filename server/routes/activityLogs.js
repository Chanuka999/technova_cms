const express = require("express");
const {
  getActivityLogs,
  getLogsByRole,
  getLogsByUser,
  getActivityStats,
  getTodayActivitySummary,
  deleteActivityLogs,
} = require("../controllers/activityController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get activity logs (Admin only)
router.get("/", authorize("admin"), getActivityLogs);

// Get today's activity summary (Admin only)
router.get("/summary/today", authorize("admin"), getTodayActivitySummary);

// Get activity stats (Admin only)
router.get("/stats/dashboard", authorize("admin"), getActivityStats);

// Get logs by role (Admin only)
router.get("/by-role/:role", authorize("admin"), getLogsByRole);

// Get logs by user (Admin only)
router.get("/user/:userId", authorize("admin"), getLogsByUser);

// Delete old logs (Admin only)
router.delete("/", authorize("admin"), deleteActivityLogs);

module.exports = router;
