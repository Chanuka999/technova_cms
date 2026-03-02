const Product = require("../models/Product");
const PurchaseOrder = require("../models/PurchaseOrder");

// @desc    Get inventory overview
// @route   GET /api/inventory
// @access  Private
exports.getInventoryOverview = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("category", "name")
      .populate("supplier", "name");

    const totalProducts = products.length;
    const totalStockValue = products.reduce(
      (sum, product) => sum + product.stock * product.costPrice,
      0,
    );
    const lowStockProducts = products.filter(
      (p) => p.stock <= p.lowStockThreshold,
    );
    const outOfStockProducts = products.filter((p) => p.stock === 0);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalStockValue,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        products,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get purchase orders
// @route   GET /api/inventory/purchase-orders
// @access  Private
exports.getPurchaseOrders = async (req, res, next) => {
  try {
    const orders = await PurchaseOrder.find()
      .populate("supplier", "name phone email")
      .populate("items.product", "name sku")
      .populate("createdBy", "name")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Create purchase order
// @route   POST /api/inventory/purchase-orders
// @access  Private (Admin, Manager, Inventory)
exports.createPurchaseOrder = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    // Calculate totals
    let totalAmount = 0;
    for (let item of req.body.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product not found: ${item.product}`,
        });
      }

      item.productName = product.name;
      item.subtotal = item.costPrice * item.quantity;
      totalAmount += item.subtotal;
    }

    req.body.totalAmount = totalAmount;

    const order = await PurchaseOrder.create(req.body);

    const populatedOrder = await PurchaseOrder.findById(order._id)
      .populate("supplier", "name")
      .populate("items.product", "name")
      .populate("createdBy", "name");

    res.status(201).json({
      success: true,
      data: populatedOrder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update purchase order status
// @route   PUT /api/inventory/purchase-orders/:id
// @access  Private (Admin, Manager, Inventory)
exports.updatePurchaseOrder = async (req, res, next) => {
  try {
    let order = await PurchaseOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Purchase order not found",
      });
    }

    // If status is changed to 'received', update product stock
    if (req.body.status === "received" && order.status !== "received") {
      for (let item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
      req.body.actualDeliveryDate = Date.now();
    }

    order = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Adjust product stock
// @route   PUT /api/inventory/adjust/:productId
// @access  Private (Admin, Manager, Inventory)
exports.adjustStock = async (req, res, next) => {
  try {
    const { adjustment, reason } = req.body;

    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    product.stock += adjustment;

    if (product.stock < 0) {
      return res.status(400).json({
        success: false,
        error: "Stock cannot be negative",
      });
    }

    await product.save();

    res.status(200).json({
      success: true,
      data: product,
      message: `Stock adjusted by ${adjustment}. Reason: ${reason || "Not specified"}`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
