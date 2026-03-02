import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Stack,
  Grid,
  useTheme,
  Chip,
  Alert,
  Card,
  CardContent,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  WarningAmber as WarningIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getProducts } from "../redux/slices/productSlice";

const Inventory = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { products, isLoading } = useSelector((state) => state.products);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setAdjustmentType("add");
    setQuantity("");
    setNotes("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleAdjustStock = () => {
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const adjustedQty =
      adjustmentType === "add" ? parseInt(quantity) : -parseInt(quantity);
    const newStock = selectedProduct.stock + adjustedQty;

    if (newStock < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    toast.success(
      `Stock ${adjustmentType === "add" ? "increased" : "decreased"} by ${quantity} units`,
    );
    handleCloseDialog();
  };

  const getStockStatus = (product) => {
    const stockPercentage =
      (product.stock / (product.lowStockThreshold * 2)) * 100;

    if (product.stock <= product.lowStockThreshold) {
      return {
        status: "Critical",
        color: "error",
        bgColor: "rgba(211, 47, 47, 0.1)",
      };
    } else if (product.stock <= product.lowStockThreshold + 10) {
      return {
        status: "Low",
        color: "warning",
        bgColor: "rgba(245, 127, 23, 0.1)",
      };
    } else if (product.stock > product.lowStockThreshold + 30) {
      return {
        status: "Optimal",
        color: "success",
        bgColor: "rgba(76, 175, 80, 0.1)",
      };
    }
    return {
      status: "Good",
      color: "info",
      bgColor: "rgba(33, 150, 243, 0.1)",
    };
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "critical")
      return matchesSearch && product.stock <= product.lowStockThreshold;
    if (filterStatus === "low")
      return (
        matchesSearch &&
        product.stock > product.lowStockThreshold &&
        product.stock <= product.lowStockThreshold + 10
      );
    if (filterStatus === "optimal")
      return matchesSearch && product.stock > product.lowStockThreshold + 30;
    return matchesSearch;
  });

  const criticalCount = products.filter(
    (p) => p.stock <= p.lowStockThreshold,
  ).length;
  const lowCount = products.filter(
    (p) => p.stock > p.lowStockThreshold && p.stock <= p.lowStockThreshold + 10,
  ).length;

  if (isLoading && products.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Inventory Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={() => dispatch(getProducts())}
        >
          Refresh
        </Button>
      </Box>

      {/* Alerts */}
      {criticalCount > 0 && (
        <Alert severity="error" sx={{ mb: 2 }} icon={<WarningIcon />}>
          <strong>{criticalCount} product(s)</strong> have critical stock
          levels. Please reorder immediately.
        </Alert>
      )}

      {lowCount > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <strong>{lowCount} product(s)</strong> have low stock levels. Consider
          placing an order soon.
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Products
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {products.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor:
                criticalCount > 0
                  ? "rgba(211, 47, 47, 0.1)"
                  : "rgba(76, 175, 80, 0.1)",
            }}
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Critical Stock
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: criticalCount > 0 ? "#d32f2f" : "#4caf50",
                }}
              >
                {criticalCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor:
                lowCount > 0
                  ? "rgba(245, 127, 23, 0.1)"
                  : "rgba(33, 150, 243, 0.1)",
            }}
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: lowCount > 0 ? "#f57f17" : "#2196f3",
                }}
              >
                {lowCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Stock Value
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Rs.{" "}
                {products
                  .reduce((sum, p) => sum + (p.stock * p.costPrice || 0), 0)
                  .toFixed(0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search & Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Filter by Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Products</MenuItem>
              <MenuItem value="critical">Critical Stock</MenuItem>
              <MenuItem value="low">Low Stock</MenuItem>
              <MenuItem value="optimal">Optimal Stock</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Inventory Table */}
      <TableContainer component={Paper}>
        <Table>
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
              <TableCell sx={{ fontWeight: 700 }}>
                <strong>SKU</strong>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                <strong>Current Stock</strong>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                <strong>Reorder Level</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <strong>Status</strong>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                <strong>Stock Value</strong>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const stockInfo = getStockStatus(product);
                return (
                  <TableRow
                    key={product._id}
                    sx={{
                      backgroundColor: stockInfo.bgColor,
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    <TableCell>
                      <strong>{product.name}</strong>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {product.stock}
                        </Typography>
                        {product.stock <= product.lowStockThreshold && (
                          <WarningIcon
                            sx={{ fontSize: 18, color: "#d32f2f" }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {product.lowStockThreshold}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={stockInfo.status}
                        size="small"
                        color={stockInfo.color}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      Rs.{" "}
                      {(product.stock * product.costPrice).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 0 },
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(product)}
                        title="Adjust Stock"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography
                    color={
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(0, 0, 0, 0.6)"
                    }
                  >
                    No products found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Stock Adjustment Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Adjust Stock - {selectedProduct?.name}</DialogTitle>
        <DialogContent
          sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Current Stock: <strong>{selectedProduct?.stock} units</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Reorder Level:{" "}
              <strong>{selectedProduct?.lowStockThreshold} units</strong>
            </Typography>
          </Box>

          <TextField
            fullWidth
            select
            label="Adjustment Type"
            value={adjustmentType}
            onChange={(e) => setAdjustmentType(e.target.value)}
            required
          >
            <MenuItem value="add">Add Stock (Inbound)</MenuItem>
            <MenuItem value="reduce">Reduce Stock (Outbound)</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            inputProps={{ min: "1", step: "1" }}
            required
          />

          <TextField
            fullWidth
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add reason for adjustment (optional)"
            multiline
            rows={2}
          />

          {quantity && (
            <Alert severity="info">
              New stock will be:{" "}
              <strong>
                {selectedProduct?.stock +
                  (adjustmentType === "add"
                    ? parseInt(quantity)
                    : -parseInt(quantity))}
              </strong>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAdjustStock}
            variant="contained"
            color={adjustmentType === "add" ? "success" : "error"}
          >
            Adjust Stock
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
