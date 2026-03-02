const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getCategories)
  .post(protect, authorize("admin", "manager", "inventory"), createCategory);

router
  .route("/:id")
  .delete(protect, authorize("admin", "manager"), deleteCategory);

module.exports = router;
