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
  Divider,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSales, createSale, reset } from "../redux/slices/saleSlice";
import { getProducts } from "../redux/slices/productSlice";
import { getCustomers } from "../redux/slices/customerSlice";

const Sales = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { sales, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.sales,
  );
  const { products } = useSelector((state) => state.products);
  const { customers } = useSelector((state) => state.customers);
  const { user } = useSelector((state) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [formData, setFormData] = useState({
    customer: "",
    items: [],
    paymentMethod: "cash",
    paymentStatus: "paid",
    amountPaid: 0,
    tax: 0,
    discount: 0,
    notes: "",
  });

  const [currentItem, setCurrentItem] = useState({
    product: "",
    quantity: 1,
    price: 0,
    discount: 0,
  });

  useEffect(() => {
    dispatch(getSales());
    dispatch(getProducts());
    dispatch(getCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && message) {
      toast.success(message);
      dispatch(reset());
    }
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch]);

  const handleOpenDialog = () => {
    setFormData({
      customer: "",
      items: [],
      paymentMethod: "cash",
      paymentStatus: "paid",
      amountPaid: 0,
      tax: 0,
      discount: 0,
      notes: "",
    });
    setCurrentItem({
      product: "",
      quantity: 1,
      price: 0,
      discount: 0,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenViewDialog = (sale) => {
    setSelectedSale(sale);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedSale(null);
  };

  const handleProductSelect = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      setCurrentItem({
        product: productId,
        quantity: 1,
        price: product.price,
        discount: 0,
      });
    }
  };

  const handleAddItem = () => {
    if (!currentItem.product || currentItem.quantity <= 0) {
      toast.error("Please select a product and enter valid quantity");
      return;
    }

    const product = products.find((p) => p._id === currentItem.product);
    const subtotal =
      currentItem.quantity * currentItem.price - currentItem.discount;

    const newItem = {
      product: currentItem.product,
      productName: product.name,
      quantity: currentItem.quantity,
      price: currentItem.price,
      discount: currentItem.discount,
      subtotal: subtotal,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setCurrentItem({
      product: "",
      quantity: 1,
      price: 0,
      discount: 0,
    });
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );
    const taxAmount = (subtotal * formData.tax) / 100;
    const totalAmount = subtotal + taxAmount - formData.discount;
    return { subtotal, taxAmount, totalAmount };
  };

  const handleSubmit = () => {
    if (formData.items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const { subtotal, taxAmount, totalAmount } = calculateTotals();
    const amountDue = totalAmount - formData.amountPaid;

    const saleData = {
      customer: formData.customer || undefined,
      items: formData.items,
      subtotal,
      tax: taxAmount,
      discount: formData.discount,
      totalAmount,
      paymentMethod: formData.paymentMethod,
      paymentStatus:
        amountDue > 0
          ? formData.amountPaid > 0
            ? "partial"
            : "pending"
          : "paid",
      amountPaid: formData.amountPaid || totalAmount,
      amountDue: amountDue > 0 ? amountDue : 0,
      cashier: user.id,
      notes: formData.notes,
    };

    dispatch(createSale(saleData));
    handleCloseDialog();
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "partial":
        return "warning";
      case "pending":
        return "error";
      default:
        return "default";
    }
  };

  const { subtotal, taxAmount, totalAmount } = calculateTotals();

  if (isLoading && sales.length === 0) {
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
        <Typography variant="h4">Sales Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          New Sale
        </Button>
      </Box>

      {/* Sales Table */}
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
                <strong>Invoice #</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <strong>Customer</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <strong>Date</strong>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                <strong>Items</strong>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                <strong>Total Amount</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <strong>Payment</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <strong>Status</strong>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales && sales.length > 0 ? (
              sales.map((sale) => (
                <TableRow
                  key={sale._id}
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
                  <TableCell>
                    <strong>{sale.invoiceNumber}</strong>
                  </TableCell>
                  <TableCell>
                    {sale.customer?.name || "Walk-in Customer"}
                  </TableCell>
                  <TableCell>
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">{sale.items?.length || 0}</TableCell>
                  <TableCell align="right">
                    <strong>Rs. {sale.totalAmount?.toFixed(2)}</strong>
                  </TableCell>
                  <TableCell>{sale.paymentMethod?.toUpperCase()}</TableCell>
                  <TableCell>
                    <Chip
                      label={sale.paymentStatus?.toUpperCase()}
                      size="small"
                      color={getPaymentStatusColor(sale.paymentStatus)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenViewDialog(sale)}
                      title="View Details"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                }}
              >
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography
                    color={
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(0, 0, 0, 0.6)"
                    }
                  >
                    No sales found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Sale Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingCartIcon />
            New Sale
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            {/* Customer Selection */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Customer (Optional)"
                value={formData.customer}
                onChange={(e) =>
                  setFormData({ ...formData, customer: e.target.value })
                }
                size="small"
              >
                <MenuItem value="">Walk-in Customer</MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer._id} value={customer._id}>
                    {customer.name} - {customer.phone}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Add Product Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="subtitle2">Add Products</Typography>
              </Divider>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Select Product"
                value={currentItem.product}
                onChange={(e) => handleProductSelect(e.target.value)}
                size="small"
              >
                <MenuItem value="">-- Select Product --</MenuItem>
                {products
                  .filter((p) => p.stock > 0)
                  .map((product) => (
                    <MenuItem key={product._id} value={product._id}>
                      {product.name} (Stock: {product.stock})
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={currentItem.quantity}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    quantity: parseInt(e.target.value) || 1,
                  })
                }
                inputProps={{ min: 1 }}
                size="small"
              />
            </Grid>

            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                type="number"
                label="Price"
                value={currentItem.price}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                inputProps={{ min: 0, step: 0.01 }}
                size="small"
              />
            </Grid>

            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                type="number"
                label="Discount"
                value={currentItem.discount}
                onChange={(e) =>
                  setCurrentItem({
                    ...currentItem,
                    discount: parseFloat(e.target.value) || 0,
                  })
                }
                inputProps={{ min: 0, step: 0.01 }}
                size="small"
              />
            </Grid>

            <Grid item xs={6} sm={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddItem}
                sx={{ height: "100%" }}
              >
                Add
              </Button>
            </Grid>

            {/* Items List */}
            {formData.items.length > 0 && (
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Sale Items
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Qty</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Discount</TableCell>
                          <TableCell align="right">Subtotal</TableCell>
                          <TableCell align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">
                              Rs. {item.price.toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              Rs. {item.discount.toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              <strong>Rs. {item.subtotal.toFixed(2)}</strong>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Payment Details */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Typography variant="subtitle2">Payment Details</Typography>
              </Divider>
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Tax (%)"
                value={formData.tax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tax: parseFloat(e.target.value) || 0,
                  })
                }
                inputProps={{ min: 0, step: 0.01 }}
                size="small"
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Discount (Rs.)"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount: parseFloat(e.target.value) || 0,
                  })
                }
                inputProps={{ min: 0, step: 0.01 }}
                size="small"
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                select
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMethod: e.target.value })
                }
                size="small"
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="cheque">Cheque</MenuItem>
                <MenuItem value="credit">Credit</MenuItem>
                <MenuItem value="online">Online</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label="Amount Paid"
                value={formData.amountPaid}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amountPaid: parseFloat(e.target.value) || 0,
                  })
                }
                inputProps={{ min: 0, step: 0.01 }}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                multiline
                rows={2}
                size="small"
              />
            </Grid>

            {/* Totals Summary */}
            {formData.items.length > 0 && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(33, 150, 243, 0.1)"
                        : "rgba(33, 150, 243, 0.05)",
                  }}
                >
                  <CardContent>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography>Subtotal:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          Rs. {subtotal.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>Tax ({formData.tax}%):</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          Rs. {taxAmount.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>Discount:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          - Rs. {formData.discount.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6" fontWeight="bold">
                          Total:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          align="right"
                          color="primary"
                        >
                          Rs. {totalAmount.toFixed(2)}
                        </Typography>
                      </Grid>
                      {formData.amountPaid > 0 &&
                        formData.amountPaid < totalAmount && (
                          <>
                            <Grid item xs={6}>
                              <Typography color="error">Amount Due:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography align="right" color="error">
                                Rs.{" "}
                                {(totalAmount - formData.amountPaid).toFixed(2)}
                              </Typography>
                            </Grid>
                          </>
                        )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading || formData.items.length === 0}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            Complete Sale
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Sale Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Sale Details</DialogTitle>
        <DialogContent>
          {selectedSale && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Invoice: {selectedSale.invoiceNumber}
              </Typography>
              <Typography>
                Customer: {selectedSale.customer?.name || "Walk-in Customer"}
              </Typography>
              <Typography>
                Date: {new Date(selectedSale.saleDate).toLocaleString()}
              </Typography>
              <Typography>
                Payment: {selectedSale.paymentMethod?.toUpperCase()}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Items:
              </Typography>
              {selectedSale.items?.map((item, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography>
                    {item.productName} x {item.quantity} @ Rs. {item.price} =
                    Rs. {item.subtotal}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography>Total: Rs. {selectedSale.totalAmount}</Typography>
              <Typography>
                Status:{" "}
                <Chip
                  label={selectedSale.paymentStatus?.toUpperCase()}
                  size="small"
                  color={getPaymentStatusColor(selectedSale.paymentStatus)}
                />
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sales;
