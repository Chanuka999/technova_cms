const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getProducts)
  .post(protect, authorize("admin", "manager", "inventory"), createProduct);

router.route("/lowstock").get(protect, getLowStockProducts);

router
  .route("/:id")
  .get(protect, getProduct)
  .put(protect, authorize("admin", "manager", "inventory"), updateProduct)
  .delete(protect, authorize("admin", "manager"), deleteProduct);

module.exports = router;
