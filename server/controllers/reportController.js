const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Expense = require("../models/Expense");
const Customer = require("../models/Customer");

// @desc    Get sales report
// @route   GET /api/reports/sales
// @access  Private (Admin, Manager)
exports.getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate && endDate) {
      query.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const sales = await Sale.find(query).populate(
      "items.product",
      "name costPrice",
    );

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalProfit = sales.reduce((sum, sale) => {
      const saleProfit = sale.items.reduce((itemSum, item) => {
        const profit =
          (item.price - (item.product?.costPrice || 0)) * item.quantity;
        return itemSum + profit;
      }, 0);
      return sum + saleProfit;
    }, 0);

    const paymentMethods = {};
    sales.forEach((sale) => {
      paymentMethods[sale.paymentMethod] =
        (paymentMethods[sale.paymentMethod] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        totalSales,
        totalRevenue: totalRevenue.toFixed(2),
        totalProfit: totalProfit.toFixed(2),
        averageSaleValue: (totalRevenue / totalSales).toFixed(2) || 0,
        paymentMethods,
        sales,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get inventory report
// @route   GET /api/reports/inventory
// @access  Private (Admin, Manager)
exports.getInventoryReport = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("category", "name")
      .populate("supplier", "name");

    const totalProducts = products.length;
    const totalStockValue = products.reduce(
      (sum, product) => sum + product.stock * product.costPrice,
      0,
    );
    const totalRetailValue = products.reduce(
      (sum, product) => sum + product.stock * product.price,
      0,
    );
    const lowStockProducts = products.filter(
      (p) => p.stock <= p.lowStockThreshold,
    );
    const outOfStockProducts = products.filter((p) => p.stock === 0);

    const categoryBreakdown = {};
    products.forEach((product) => {
      const categoryName = product.category?.name || "Uncategorized";
      if (!categoryBreakdown[categoryName]) {
        categoryBreakdown[categoryName] = {
          count: 0,
          totalValue: 0,
        };
      }
      categoryBreakdown[categoryName].count += 1;
      categoryBreakdown[categoryName].totalValue +=
        product.stock * product.costPrice;
    });

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalStockValue: totalStockValue.toFixed(2),
        totalRetailValue: totalRetailValue.toFixed(2),
        potentialProfit: (totalRetailValue - totalStockValue).toFixed(2),
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        categoryBreakdown,
        lowStockProducts,
        outOfStockProducts,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get profit & loss report
// @route   GET /api/reports/profit-loss
// @access  Private (Admin, Manager)
exports.getProfitLossReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate && endDate) {
      query.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const sales = await Sale.find(query).populate("items.product", "costPrice");
    const expenses = await Expense.find(
      startDate && endDate
        ? {
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          }
        : {},
    );

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    const totalCost = sales.reduce((sum, sale) => {
      const saleCost = sale.items.reduce((itemSum, item) => {
        return itemSum + (item.product?.costPrice || 0) * item.quantity;
      }, 0);
      return sum + saleCost;
    }, 0);

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const grossProfit = totalRevenue - totalCost;
    const netProfit = grossProfit - totalExpenses;
    const profitMargin =
      totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0;

    const expensesByCategory = {};
    expenses.forEach((expense) => {
      expensesByCategory[expense.category] =
        (expensesByCategory[expense.category] || 0) + expense.amount;
    });

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenue.toFixed(2),
        totalCost: totalCost.toFixed(2),
        grossProfit: grossProfit.toFixed(2),
        totalExpenses: totalExpenses.toFixed(2),
        netProfit: netProfit.toFixed(2),
        profitMargin: `${profitMargin}%`,
        expensesByCategory,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get top selling products
// @route   GET /api/reports/top-products
// @access  Private (Admin, Manager)
exports.getTopProducts = async (req, res, next) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;

    const query = {};
    if (startDate && endDate) {
      query.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const sales = await Sale.find(query).populate(
      "items.product",
      "name price costPrice",
    );

    const productStats = {};

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const productId = item.product?._id?.toString();
        if (!productId) return;

        if (!productStats[productId]) {
          productStats[productId] = {
            product: item.product,
            totalQuantity: 0,
            totalRevenue: 0,
            totalProfit: 0,
            salesCount: 0,
          };
        }

        productStats[productId].totalQuantity += item.quantity;
        productStats[productId].totalRevenue += item.subtotal;
        productStats[productId].totalProfit +=
          (item.price - (item.product?.costPrice || 0)) * item.quantity;
        productStats[productId].salesCount += 1;
      });
    });

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      count: topProducts.length,
      data: topProducts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/reports/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = await Sale.find({ saleDate: { $gte: today } });
    const totalCustomers = await Customer.countDocuments({ isActive: true });
    const lowStockProducts = await Product.find({ isActive: true });
    const lowStock = lowStockProducts.filter(
      (p) => p.stock <= p.lowStockThreshold,
    );

    const todayRevenue = todaySales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0,
    );
    const todayTransactions = todaySales.length;

    // Get last 7 days sales for chart
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const recentSales = await Sale.find({ saleDate: { $gte: last7Days } });

    res.status(200).json({
      success: true,
      data: {
        todayRevenue: todayRevenue.toFixed(2),
        todayTransactions,
        totalCustomers,
        lowStockCount: lowStock.length,
        recentSales: recentSales.slice(-10),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
