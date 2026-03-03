// INTEGRATION GUIDE: Activity Logging

// ============================================
// HOW TO USE ACTIVITY LOGGING IN CONTROLLERS
// ============================================

// 1. The activity logger middleware is already added to server.js
//    It automatically adds req.logActivity() to all protected routes

// 2. In your controller methods, use req.logActivity() like this:

// EXAMPLE 1: Logging Product Creation
// ====================================
// @desc    Create new product
// @route   POST /api/products
// @access  Private
// exports.createProduct = async (req, res, next) => {
//   try {
//     const product = await Product.create(req.body);

//     // LOG THE ACTIVITY
//     await req.logActivity(
//       "CREATE",                    // action
//       "products",                  // module
//       `Created product: ${product.name}`,  // description
//       { productId: product._id, productName: product.name }  // details (optional)
//     );

//     res.status(201).json({
//       success: true,
//       data: product,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// EXAMPLE 2: Logging Product Update
// ==================================
// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
// exports.updateProduct = async (req, res, next) => {
//   try {
//     let product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: "Product not found",
//       });
//     }

//     product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     // LOG THE ACTIVITY
//     await req.logActivity(
//       "UPDATE",
//       "products",
//       `Updated product: ${product.name}`,
//       { productId: product._id, updatedFields: Object.keys(req.body) }
//     );

//     res.status(200).json({
//       success: true,
//       data: product,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// EXAMPLE 3: Logging Product Deletion
// ====================================
// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
// exports.deleteProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
//
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: "Product not found",
//       });
//     }

//     // LOG THE ACTIVITY (especially important for deletions)
//     await req.logActivity(
//       "DELETE",
//       "products",
//       `Deleted product: ${product.name}`,
//       { productId: product._id, productName: product.name, price: product.price }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Product deleted successfully",
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// EXAMPLE 4: Logging Sale Creation
// =================================
// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
// exports.createSale = async (req, res, next) => {
//   try {
//     const sale = await Sale.create(req.body);

//     // LOG THE ACTIVITY - Include important details
//     await req.logActivity(
//       "CREATE",
//       "sales",
//       `Created sale with amount: $${sale.totalAmount}`,
//       {
//         saleId: sale._id,
//         customerId: sale.customerId,
//         totalAmount: sale.totalAmount,
//         itemCount: sale.items.length
//       }
//     );

//     res.status(201).json({
//       success: true,
//       data: sale,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// EXAMPLE 5: Logging Customer Creation
// =====================================
// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
// exports.createCustomer = async (req, res, next) => {
//   try {
//     const customer = await Customer.create(req.body);

//     await req.logActivity(
//       "CREATE",
//       "customers",
//       `Added new customer: ${customer.name}`,
//       { customerId: customer._id, customerName: customer.name, email: customer.email }
//     );

//     res.status(201).json({
//       success: true,
//       data: customer,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// ============================================
// ACTIVITY LOG PARAMETERS
// ============================================
//
// await req.logActivity(
//   action,      // "CREATE" | "UPDATE" | "DELETE" | "VIEW" | "LOGIN" | "LOGOUT" | "DOWNLOAD" | "EXPORT"
//   module,      // "products" | "sales" | "customers" | "suppliers" | "inventory" | "users" | "reports" | "categories" | "auth"
//   description, // string - Human readable description of the action
//   details      // object (optional) - Additional details to store
// );

// ============================================
// ACTIVITY LOG API ENDPOINTS (Admin Only)
// ============================================
//
// GET  /api/activity-logs                    - Get all activity logs with filters
// GET  /api/activity-logs/summary/today      - Get today's activity summary
// GET  /api/activity-logs/stats/dashboard    - Get activity statistics
// GET  /api/activity-logs/by-role/:role      - Get logs by user role
// GET  /api/activity-logs/user/:userId       - Get logs by specific user
// DELETE /api/activity-logs                  - Delete old logs (older than specified days)

// ============================================
// QUERY PARAMETERS EXAMPLES
// ============================================
//
// GET /api/activity-logs
//   ?role=admin              - Filter by role (admin, manager, cashier, inventory)
//   ?module=products         - Filter by module
//   ?action=CREATE           - Filter by action
//   ?userId=<id>             - Filter by user ID
//   ?startDate=2024-01-01    - Filter by start date
//   ?endDate=2024-01-31      - Filter by end date
//   ?limit=50                - Results per page
//   ?page=1                  - Page number

// ============================================
// RESPONSE EXAMPLES
// ============================================
//
// Success Response:
// {
//   "success": true,
//   "count": 50,
//   "total": 250,
//   "pages": 5,
//   "currentPage": 1,
//   "data": [
//     {
//       "_id": "...",
//       "userId": { "name": "John Doe", "email": "john@example.com" },
//       "userName": "John Doe",
//       "userRole": "admin",
//       "action": "CREATE",
//       "module": "products",
//       "description": "Created product: Laptop XPS 13",
//       "details": { "productId": "...", "productName": "Laptop XPS 13" },
//       "ipAddress": "192.168.1.1",
//       "timestamp": "2024-01-15T10:30:00.000Z"
//     }
//     // more logs...
//   ]
// }
//
// Today's Summary:
// {
//   "success": true,
//   "data": {
//     "totalActivities": 45,
//     "totalLogins": 8,
//     "totalLogouts": 3,
//     "totalCreations": 5,
//     "totalUpdates": 12,
//     "totalDeletions": 2,
//     "activeUsersCount": 6,
//     "activeUsers": ["userId1", "userId2", ...],
//     "recentActivities": [...]
//   }
// }
