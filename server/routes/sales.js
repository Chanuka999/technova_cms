const express = require("express");
const router = express.Router();
const {
  getSales,
  getSale,
  createSale,
  updateSale,
  getSalesByDateRange,
} = require("../controllers/saleController");
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, getSales).post(protect, createSale);

router.route("/range/:startDate/:endDate").get(protect, getSalesByDateRange);

router
  .route("/:id")
  .get(protect, getSale)
  .put(protect, authorize("admin", "manager"), updateSale);

module.exports = router;
