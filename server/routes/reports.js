const express = require("express");
const router = express.Router();
const {
  getSalesReport,
  getInventoryReport,
  getProfitLossReport,
  getTopProducts,
  getDashboardStats,
} = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/sales")
  .get(protect, authorize("admin", "manager"), getSalesReport);

router
  .route("/inventory")
  .get(protect, authorize("admin", "manager"), getInventoryReport);

router
  .route("/profit-loss")
  .get(protect, authorize("admin", "manager"), getProfitLossReport);

router
  .route("/top-products")
  .get(protect, authorize("admin", "manager"), getTopProducts);

router.route("/dashboard").get(protect, getDashboardStats);

module.exports = router;
