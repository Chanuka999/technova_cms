const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerPurchases,
} = require("../controllers/customerController");
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, getCustomers).post(protect, createCustomer);

router
  .route("/:id")
  .get(protect, getCustomer)
  .put(protect, updateCustomer)
  .delete(protect, authorize("admin", "manager"), deleteCustomer);

router.route("/:id/purchases").get(protect, getCustomerPurchases);

module.exports = router;
