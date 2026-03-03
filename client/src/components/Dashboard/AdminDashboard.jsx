import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp,
  Inventory,
  ShoppingCart,
  People,
  WarningAmber,
  CheckCircle,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchTodayActivitySummary } from "../../redux/slices/activityLogSlice";
import * as productService from "../../services/productService";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c"];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { summary } = useSelector((state) => state.activityLogs);
  const [inventoryData, setInventoryData] = useState({
    totalProducts: 0,
    lowStockProducts: [],
    topProducts: [],
    loading: true,
  });

  const displayName = user?.name?.trim() || "Admin";

  useEffect(() => {
    dispatch(fetchTodayActivitySummary());
    loadInventoryData();
  }, [dispatch]);

  const loadInventoryData = async () => {
    try {
      // Fetch products data
      const response = await productService.getProducts();
      if (response.success) {
        const products = response.data;

        // Get low stock products (assuming stock < 10 is low)
        const lowStockProds = products.filter((p) => p.stock < 10);

        // Sort by stock for top/bottom info
        const sorted = [...products].sort((a, b) => b.stock - a.stock);

        setInventoryData({
          totalProducts: products.length,
          lowStockProducts: lowStockProds,
          topProducts: sorted.slice(0, 5),
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error loading inventory data:", error);
      setInventoryData((prev) => ({ ...prev, loading: false }));
    }
  };

  const stats = [
    {
      title: "Total Products",
      value: inventoryData.totalProducts,
      icon: <Inventory fontSize="large" />,
      color: "success.main",
    },
    {
      title: "Low Stock Items",
      value: inventoryData.lowStockProducts.length,
      icon: <WarningAmber fontSize="large" />,
      color: "warning.main",
    },
    {
      title: "Active Users Today",
      value: summary?.activeUsersCount || 0,
      icon: <People fontSize="large" />,
      color: "secondary.main",
    },
    {
      title: "Today's Activities",
      value: summary?.totalActivities || 0,
      icon: <TrendingUp fontSize="large" />,
      color: "primary.main",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Typography variant="body2" color="textSecondary">
          Welcome back, {displayName}! Here's an overview of your system.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                p: 2,
                background: `linear-gradient(135deg, ${stat.color} 0%, rgba(136, 132, 216, 0.1) 100%)`,
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Typography color="textSecondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {stat.value}
                </Typography>
              </CardContent>
              <Box sx={{ color: stat.color, fontSize: 40 }}>{stat.icon}</Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Inventory Section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Low Stock Products */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <WarningAmber sx={{ color: "#ff9800" }} />
              Low Stock Items ({inventoryData.lowStockProducts.length})
            </Typography>
            {inventoryData.loading ? (
              <CircularProgress size={24} />
            ) : inventoryData.lowStockProducts.length === 0 ? (
              <Box sx={{ p: 2, textAlign: "center", color: "#4caf50" }}>
                <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
                <Typography>All products have sufficient stock</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#fff3e0" }}>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Stock</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryData.lowStockProducts
                      .slice(0, 5)
                      .map((product) => (
                        <TableRow
                          key={product._id}
                          sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                        >
                          <TableCell>
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{ maxWidth: 200 }}
                            >
                              {product.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={product.stock}
                              color={product.stock <= 5 ? "error" : "warning"}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={product.stock <= 5 ? "Critical" : "Low"}
                              size="small"
                              sx={{
                                backgroundColor:
                                  product.stock <= 5 ? "#ff6b6b" : "#ffa500",
                                color: "white",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Top Products by Stock */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Inventory sx={{ color: "#4caf50" }} />
              Top Products by Stock
            </Typography>
            {inventoryData.loading ? (
              <CircularProgress size={24} />
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
                      <TableCell>Product Name</TableCell>
                      <TableCell align="right">Stock Qty</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryData.topProducts.slice(0, 5).map((product) => (
                      <TableRow
                        key={product._id}
                        sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 200 }}
                          >
                            {product.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={product.stock}
                            color="primary"
                            size="small"
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label="In Stock"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Activity Summary */}
      {summary && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Today's Activity Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#e3f2fd",
                  borderRadios: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6">{summary.totalLogins}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Logins
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#f3e5f5",
                  borderRadios: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6">{summary.totalCreations}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Created
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#e1f5fe",
                  borderRadios: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6">{summary.totalUpdates}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Updated
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#ffebee",
                  borderRadios: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6">{summary.totalDeletions}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Deleted
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#e0f2f1",
                  borderRadios: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6">{summary.activeUsersCount}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Active Users
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default AdminDashboard;
