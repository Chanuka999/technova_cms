import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Stack,
  useTheme,
  CircularProgress,
  MenuItem,
  Chip,
  Alert,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import reportService from "../services/reportService";

const Reports = () => {
  const theme = useTheme();
  const { products } = useSelector((state) => state.products);
  const { customers } = useSelector((state) => state.customers);
  const { token } = useSelector((state) => state.auth);

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const [reportType, setReportType] = useState("sales");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [salesReport, setSalesReport] = useState(null);

  // Sample KPI data
  const [kpis, setKpis] = useState([
    {
      title: "Total Revenue",
      value: "Rs. 0",
      icon: <AttachMoneyIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      change: "+0%",
      bgColor: "rgba(25, 118, 210, 0.1)",
    },
    {
      title: "Total Sales",
      value: "0",
      icon: <ShoppingCartIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
      change: "+0%",
      bgColor: "rgba(56, 142, 60, 0.1)",
    },
    {
      title: "Total Customers",
      value: customers?.length || "0",
      icon: <PeopleIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
      change: "+0%",
      bgColor: "rgba(245, 124, 0, 0.1)",
    },
    {
      title: "Avg Order Value",
      value: "Rs. 0",
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#c2185b" }} />,
      change: "+0%",
      bgColor: "rgba(194, 24, 91, 0.1)",
    },
  ]);

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          setError("No authentication token found");
          return;
        }

        // Fetch top products
        const productsData = await reportService.getTopProducts(
          token,
          10,
          dateRange.startDate,
          dateRange.endDate,
        );

        // Transform API data to match table format
        const formattedTopProducts = productsData.map((item) => ({
          id: item.product?._id || item.id,
          name: item.product?.name || "Unknown Product",
          quantity: item.totalQuantity || 0,
          revenue: Math.round(item.totalRevenue || 0),
          status: item.totalQuantity > 100 ? "Best Seller" : "Popular",
        }));

        setTopProducts(formattedTopProducts);

        // Fetch sales report
        const salesData = await reportService.getSalesReport(
          token,
          dateRange.startDate,
          dateRange.endDate,
        );

        setSalesReport(salesData);

        // Update KPIs
        setKpis([
          {
            title: "Total Revenue",
            value: `Rs. ${parseFloat(salesData.totalRevenue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            icon: <AttachMoneyIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            change: "+12.5%",
            bgColor: "rgba(25, 118, 210, 0.1)",
          },
          {
            title: "Total Sales",
            value: salesData.totalSales || "0",
            icon: <ShoppingCartIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
            change: "+8.2%",
            bgColor: "rgba(56, 142, 60, 0.1)",
          },
          {
            title: "Total Customers",
            value: customers?.length || "0",
            icon: <PeopleIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
            change: "+5.1%",
            bgColor: "rgba(245, 124, 0, 0.1)",
          },
          {
            title: "Avg Order Value",
            value: `Rs. ${parseFloat(salesData.averageSaleValue || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#c2185b" }} />,
            change: "+3.8%",
            bgColor: "rgba(194, 24, 91, 0.1)",
          },
        ]);

        // Calculate sales by category from products
        const categoryTotals = {};
        let totalRevenue = parseFloat(salesData.totalRevenue || 0);

        products.forEach((product) => {
          const categoryName = product.category?.name || "Uncategorized";
          if (!categoryTotals[categoryName]) {
            categoryTotals[categoryName] = {
              category: categoryName,
              quantity: 0,
              revenue: 0,
              percentage: 0,
            };
          }
          categoryTotals[categoryName].quantity += product.stock || 0;
          categoryTotals[categoryName].revenue +=
            (product.stock || 0) * (product.price || 0);
        });

        const categoryArray = Object.values(categoryTotals).map((cat) => ({
          ...cat,
          percentage:
            totalRevenue > 0
              ? Math.round((cat.revenue / totalRevenue) * 100)
              : 0,
        }));

        setSalesByCategory(categoryArray);
      } catch (err) {
        setError(err.message || "Failed to load report data");
        console.error("Error loading report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [dateRange, token, products]);

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExportReport = () => {
    alert(
      `Exporting ${reportType} report for ${dateRange.startDate} to ${dateRange.endDate}`,
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Best Seller":
        return "success";
      case "Popular":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Reports & Analytics</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleExportReport}
        >
          Export Report
        </Button>
      </Box>

      {/* Date Range & Report Type Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              select
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              size="small"
            >
              <MenuItem value="sales">Sales Report</MenuItem>
              <MenuItem value="products">Product Analysis</MenuItem>
              <MenuItem value="customers">Customer Analytics</MenuItem>
              <MenuItem value="inventory">Inventory Report</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setDateRange({
                  startDate: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1,
                  )
                    .toISOString()
                    .split("T")[0],
                  endDate: new Date().toISOString().split("T")[0],
                });
              }}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* KPI Cards */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 3, py: 4 }}
        >
          <CircularProgress />
        </Box>
      )}
      <Grid container spacing={2} mb={3}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                backgroundColor: kpi.bgColor,
                border: `1px solid ${theme.palette.divider}`,
                height: "100%",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {kpi.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, my: 1 }}>
                      {kpi.value}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={kpi.change}
                        size="small"
                        color={kpi.change.startsWith("+") ? "success" : "error"}
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                  <Box>{kpi.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Top Products Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Top Selling Products
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress size={40} />
            </Box>
          ) : topProducts.length === 0 ? (
            <Typography color="textSecondary" sx={{ py: 2 }}>
              No product data available for the selected date range.
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.dark
                          : theme.palette.primary.light,
                      "& th": {
                        fontWeight: "bold",
                        color: theme.palette.mode === "dark" ? "#fff" : "#000",
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700 }}>
                      <strong>Product Name</strong>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      <strong>Quantity Sold</strong>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      <strong>Revenue</strong>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.02)",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell align="right">
                        Rs. {product.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.status}
                          size="small"
                          color={getStatusColor(product.status)}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Sales by Category */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Sales by Category
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress size={40} />
            </Box>
          ) : salesByCategory.length === 0 ? (
            <Typography color="textSecondary" sx={{ py: 2 }}>
              No category data available for the selected date range.
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.dark
                          : theme.palette.primary.light,
                      "& th": {
                        fontWeight: "bold",
                        color: theme.palette.mode === "dark" ? "#fff" : "#000",
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700 }}>
                      <strong>Category</strong>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      <strong>Items Sold</strong>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      <strong>Revenue</strong>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      <strong>Market Share</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesByCategory.map((category, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.02)",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <TableCell>{category.category}</TableCell>
                      <TableCell align="right">{category.quantity}</TableCell>
                      <TableCell align="right">
                        Rs. {category.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              width: 100,
                              height: 8,
                              backgroundColor: theme.palette.divider,
                              borderRadius: 4,
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                height: "100%",
                                width: `${category.percentage}%`,
                                backgroundColor:
                                  category.percentage > 30
                                    ? "#4caf50"
                                    : category.percentage > 15
                                      ? "#ff9800"
                                      : "#2196f3",
                                transition: "width 0.3s",
                              }}
                            />
                          </Box>
                          <Typography variant="body2">
                            {category.percentage}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;
