const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
exports.getSales = async (req, res, next) => {
  try {
    const sales = await Sale.find()
      .populate("customer", "name phone email")
      .populate("cashier", "name")
      .populate("items.product", "name")
      .sort("-saleDate");

    res.status(200).json({
      success: true,
      count: sales.length,
      data: sales,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
exports.getSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("customer", "name phone email address")
      .populate("cashier", "name email")
      .populate("items.product", "name sku");

    if (!sale) {
      return res.status(404).json({
        success: false,
        error: "Sale not found",
      });
    }

    res.status(200).json({
      success: true,
      data: sale,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private (All authenticated users)
exports.createSale = async (req, res, next) => {
  try {
    // Add cashier from logged in user
    req.body.cashier = req.user.id;

    // Calculate totals
    let subtotal = 0;
    for (let item of req.body.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product not found: ${item.product}`,
        });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for product: ${product.name}. Available: ${product.stock}`,
        });
      }

      // Calculate item subtotal
      item.price = product.price;
      item.productName = product.name;
      item.subtotal = item.price * item.quantity - (item.discount || 0);
      subtotal += item.subtotal;

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    req.body.subtotal = subtotal;
    req.body.totalAmount =
      subtotal + (req.body.tax || 0) - (req.body.discount || 0);

    // Set payment status
    req.body.amountPaid = req.body.amountPaid || req.body.totalAmount;
    req.body.amountDue = req.body.totalAmount - req.body.amountPaid;

    if (req.body.amountDue === 0) {
      req.body.paymentStatus = "paid";
    } else if (req.body.amountPaid > 0) {
      req.body.paymentStatus = "partial";
    } else {
      req.body.paymentStatus = "pending";
    }

    const sale = await Sale.create(req.body);

    // Update customer total purchases if customer is provided
    if (req.body.customer) {
      const customer = await Customer.findById(req.body.customer);
      if (customer) {
        customer.totalPurchases += req.body.totalAmount;
        customer.loyaltyPoints += Math.floor(req.body.totalAmount / 10); // 1 point per $10
        await customer.save();
      }
    }

    const populatedSale = await Sale.findById(sale._id)
      .populate("customer", "name phone")
      .populate("cashier", "name")
      .populate("items.product", "name");

    res.status(201).json({
      success: true,
      data: populatedSale,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update sale
// @route   PUT /api/sales/:id
// @access  Private (Admin, Manager)
exports.updateSale = async (req, res, next) => {
  try {
    let sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        error: "Sale not found",
      });
    }

    sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: sale,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get sales by date range
// @route   GET /api/sales/range/:startDate/:endDate
// @access  Private
exports.getSalesByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.params;

    const sales = await Sale.find({
      saleDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate("customer", "name")
      .populate("cashier", "name")
      .sort("-saleDate");

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    res.status(200).json({
      success: true,
      count: sales.length,
      totalRevenue,
      data: sales,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
