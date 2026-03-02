const express = require("express");
const router = express.Router();
const {
  getInventoryOverview,
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrder,
  adjustStock,
} = require("../controllers/inventoryController");
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, getInventoryOverview);

router
  .route("/purchase-orders")
  .get(protect, getPurchaseOrders)
  .post(
    protect,
    authorize("admin", "manager", "inventory"),
    createPurchaseOrder,
  );

router
  .route("/purchase-orders/:id")
  .put(
    protect,
    authorize("admin", "manager", "inventory"),
    updatePurchaseOrder,
  );

router
  .route("/adjust/:productId")
  .put(protect, authorize("admin", "manager", "inventory"), adjustStock);

module.exports = router;
