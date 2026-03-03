const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const { activityLoggerMiddleware } = require("./middleware/activityLogger");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan("dev")); // Logging
app.use(activityLoggerMiddleware); // Activity logging middleware

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Technova CMS API",
    version: "1.0.0",
    status: "running",
  });
});

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const saleRoutes = require("./routes/sales");
const customerRoutes = require("./routes/customers");
const supplierRoutes = require("./routes/suppliers");
const inventoryRoutes = require("./routes/inventory");
const reportRoutes = require("./routes/reports");
const userRoutes = require("./routes/users");
const activityLogRoutes = require("./routes/activityLogs");
const categoryRoutes = require("./routes/categories");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/categories", categoryRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
