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

const Reports = () => {
  const theme = useTheme();
  const { products } = useSelector((state) => state.products);
  const { customers } = useSelector((state) => state.customers);

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const [reportType, setReportType] = useState("sales");

  // Sample KPI data
  const kpis = [
    {
      title: "Total Revenue",
      value: "Rs. 2,45,000",
      icon: <AttachMoneyIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      change: "+12.5%",
      bgColor: "rgba(25, 118, 210, 0.1)",
    },
    {
      title: "Total Sales",
      value: "156",
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
      value: "Rs. 1,570",
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#c2185b" }} />,
      change: "+3.8%",
      bgColor: "rgba(194, 24, 91, 0.1)",
    },
  ];

  // Sample product sales data
  const topProducts = [
    {
      id: 1,
      name: "Gaming Laptop",
      quantity: 45,
      revenue: 98000,
      status: "Best Seller",
    },
    {
      id: 2,
      name: "Wireless Mouse",
      quantity: 120,
      revenue: 24000,
      status: "Popular",
    },
    {
      id: 3,
      name: "USB-C Cable",
      quantity: 200,
      revenue: 16000,
      status: "Standard",
    },
    {
      id: 4,
      name: "Mechanical Keyboard",
      quantity: 60,
      revenue: 42000,
      status: "Popular",
    },
    {
      id: 5,
      name: "Monitor Stand",
      quantity: 35,
      revenue: 8400,
      status: "Standard",
    },
  ];

  // Sample sales summary by category
  const salesByCategory = [
    {
      category: "Laptops",
      quantity: 85,
      revenue: 180000,
      percentage: 35,
    },
    {
      category: "Accessories",
      quantity: 320,
      revenue: 48000,
      percentage: 22,
    },
    {
      category: "Monitors",
      quantity: 45,
      revenue: 67500,
      percentage: 28,
    },
    {
      category: "Keyboards & Mice",
      quantity: 180,
      revenue: 36000,
      percentage: 15,
    },
  ];

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
        </CardContent>
      </Card>

      {/* Sales by Category */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Sales by Category
          </Typography>
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
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;
