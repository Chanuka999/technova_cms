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
  Download as DownloadIcon,
  Receipt as ReceiptIcon,
  ContentCopy as ContentCopyIcon,
  Print as PrintIcon,
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
  const [openBillPreview, setOpenBillPreview] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [previewSale, setPreviewSale] = useState(null);
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

  const handleOpenBillPreview = (sale) => {
    setPreviewSale(sale);
    setOpenBillPreview(true);
  };

  const handleCloseBillPreview = () => {
    setOpenBillPreview(false);
    setPreviewSale(null);
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

  const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

  const escapeHtml = (text = "") =>
    String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const buildBillHtml = (sale) => {
    const saleDate = new Date(sale.saleDate || Date.now()).toLocaleString();
    const customerName = sale.customer?.name || "Walk-in Customer";
    const cashierName = sale.cashier?.name || user?.name || "Cashier";
    const paymentMethod = (sale.paymentMethod || "").toUpperCase();
    const paymentStatus = (sale.paymentStatus || "").toUpperCase();
    const noteText = (sale.notes || "").trim();

    const itemRows = (sale.items || [])
      .map(
        (item, index) => `
          <tr>
            <td class="center">${index + 1}</td>
            <td>${escapeHtml(item.productName || "Item")}</td>
            <td class="center">${item.quantity}</td>
            <td class="right">${formatCurrency(item.price)}</td>
            <td class="right">${formatCurrency(item.discount)}</td>
            <td class="right strong">${formatCurrency(item.subtotal)}</td>
          </tr>`,
      )
      .join("");

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Bill ${escapeHtml(sale.invoiceNumber)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #f2f4f8;
      color: #1f2937;
      font-family: "Segoe UI", Tahoma, Arial, sans-serif;
      line-height: 1.45;
      padding: 28px;
    }
    .bill {
      max-width: 920px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #dbe3ee;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
    }
    .bill-head {
      background: linear-gradient(135deg, #1f5d9d 0%, #2f7ac6 100%);
      color: #ffffff;
      padding: 24px 28px;
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }
    .bill-title {
      font-size: 30px;
      font-weight: 700;
      margin: 0 0 4px;
    }
    .bill-sub {
      opacity: 0.95;
      margin: 0;
      font-size: 14px;
    }
    .chip-wrap {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;
    }
    .chip {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255,255,255,0.45);
      background: rgba(255,255,255,0.16);
      color: #ffffff;
      border-radius: 12px;
      min-height: 56px;
      min-width: 150px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
    }
    .action-bar {
      display: flex;
      gap: 8px;
      padding: 10px 28px 0;
      flex-wrap: wrap;
    }
    .action-btn {
      border: 1px solid #cbd5e1;
      background: #fff;
      color: #1e293b;
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .action-btn:hover { background: #f8fafc; }
    .body-pad { padding: 24px 28px 16px; }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 20px;
    }
    .meta-card {
      border: 1px solid #e5eaf1;
      border-radius: 10px;
      padding: 12px 14px;
      background: #fbfcfe;
    }
    .label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .value { font-size: 15px; font-weight: 600; color: #0f172a; }
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #e5eaf1;
      border-radius: 10px;
      overflow: hidden;
    }
    th, td { padding: 10px 12px; font-size: 14px; }
    th {
      background: #f0f5fb;
      color: #1f3b5c;
      text-align: left;
      border-bottom: 1px solid #d8e3f0;
    }
    tbody tr:nth-child(even) { background: #fcfdff; }
    tbody td { border-bottom: 1px solid #edf2f7; }
    tbody tr:last-child td { border-bottom: none; }
    .center { text-align: center; }
    .right { text-align: right; }
    .strong { font-weight: 700; }
    .summary-wrap {
      display: flex;
      justify-content: flex-end;
      margin-top: 18px;
    }
    .summary {
      width: 340px;
      border: 1px solid #e5eaf1;
      border-radius: 10px;
      padding: 12px 14px;
      background: #fbfcfe;
    }
    .sum-row {
      display: flex;
      justify-content: space-between;
      margin: 7px 0;
      font-size: 14px;
    }
    .sum-total {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed #c9d6e6;
      font-size: 20px;
      font-weight: 800;
      color: #0f3b67;
    }
    .note {
      margin-top: 16px;
      border: 1px solid #e5eaf1;
      background: #fffdf5;
      border-radius: 10px;
      padding: 12px 14px;
    }
    .footer {
      margin-top: 20px;
      padding: 12px 28px 18px;
      border-top: 1px solid #edf2f7;
      font-size: 12px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .bill { box-shadow: none; border: none; border-radius: 0; }
      .action-bar { display: none; }
    }
    @media (max-width: 700px) {
      body { padding: 12px; }
      .bill-head {
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
      }
      .chip-wrap { justify-content: flex-start; }
      .chip {
        font-size: 11px;
        min-height: 46px;
        min-width: 128px;
        padding: 6px 10px;
      }
      .body-pad { padding: 16px; }
      .meta-grid { grid-template-columns: 1fr; gap: 10px; }
      .summary-wrap { justify-content: stretch; }
      .summary { width: 100%; }
      .action-bar { padding: 10px 16px 0; }
    }
  </style>
</head>
<body>
  <div class="bill">
    <div class="bill-head">
      <div>
        <h1 class="bill-title">Technova CMS</h1>
        <p class="bill-sub">Sales Invoice</p>
      </div>
      <div class="chip-wrap">
        <span class="chip">Invoice: ${escapeHtml(sale.invoiceNumber)}</span>
        <span class="chip">Payment: ${escapeHtml(paymentMethod)}</span>
        <span class="chip">Status: ${escapeHtml(paymentStatus)}</span>
      </div>
    </div>

    <div class="action-bar">
      <button class="action-btn" onclick="window.print()">Print Bill</button>
      <button class="action-btn" onclick="copyInvoice()">Copy Invoice No</button>
      <button class="action-btn" onclick="scrollToTotals()">Go To Total</button>
    </div>

    <div class="body-pad">
      <div class="meta-grid">
        <div class="meta-card">
          <div class="label">Customer</div>
          <div class="value">${escapeHtml(customerName)}</div>
        </div>
        <div class="meta-card">
          <div class="label">Date & Time</div>
          <div class="value">${escapeHtml(saleDate)}</div>
        </div>
        <div class="meta-card">
          <div class="label">Cashier</div>
          <div class="value">${escapeHtml(cashierName)}</div>
        </div>
        <div class="meta-card">
          <div class="label">Item Count</div>
          <div class="value">${(sale.items || []).length}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th class="center" style="width: 52px;">#</th>
            <th>Item</th>
            <th class="center" style="width: 80px;">Qty</th>
            <th class="right" style="width: 140px;">Price</th>
            <th class="right" style="width: 140px;">Discount</th>
            <th class="right" style="width: 150px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div class="summary-wrap" id="totals-section">
        <div class="summary">
          <div class="sum-row"><span>Subtotal</span><span>${formatCurrency(sale.subtotal)}</span></div>
          <div class="sum-row"><span>Tax</span><span>${formatCurrency(sale.tax)}</span></div>
          <div class="sum-row"><span>Discount</span><span>${formatCurrency(sale.discount)}</span></div>
          <div class="sum-row sum-total"><span>Total</span><span>${formatCurrency(sale.totalAmount)}</span></div>
          <div class="sum-row"><span>Amount Paid</span><span>${formatCurrency(sale.amountPaid)}</span></div>
          <div class="sum-row"><span>Amount Due</span><span>${formatCurrency(sale.amountDue)}</span></div>
        </div>
      </div>

      ${noteText ? `<div class="note"><div class="label">Notes</div><div>${escapeHtml(noteText)}</div></div>` : ""}
    </div>

    <div class="footer">
      <span>Thank you for your purchase!</span>
      <span>Generated by Technova CMS</span>
    </div>
  </div>
  <script>
    function copyInvoice() {
      var invoice = ${JSON.stringify(sale.invoiceNumber || "")};
      if (!invoice) return;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(invoice).then(function () {
          alert("Invoice copied: " + invoice);
        });
        return;
      }
      var temp = document.createElement("textarea");
      temp.value = invoice;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      alert("Invoice copied: " + invoice);
    }

    function scrollToTotals() {
      var totals = document.getElementById("totals-section");
      if (totals) totals.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  </script>
</body>
</html>`;
  };

  const copyInvoiceNumber = async (sale) => {
    if (!sale?.invoiceNumber) {
      toast.error("Invoice number not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(sale.invoiceNumber);
      toast.success(`Copied: ${sale.invoiceNumber}`);
    } catch (error) {
      toast.error("Failed to copy invoice number");
    }
  };

  const downloadBill = (sale) => {
    console.log("Downloading bill for sale:", sale);

    if (!sale || !sale.invoiceNumber) {
      toast.error("Cannot generate bill: Sale data is incomplete");
      console.error("Invalid sale data:", sale);
      return;
    }

    const html = buildBillHtml(sale);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = `Bill-${sale.invoiceNumber}.html`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log("Bill download triggered:", fileName);
    toast.success(`Bill downloaded: ${fileName}`);
    toast.info("Check your Downloads folder", { autoClose: 5000 });
  };

  const handleSubmit = async () => {
    console.log("=== handleSubmit called ===");

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

    console.log("Sale data prepared:", saleData);

    try {
      const result = await dispatch(createSale(saleData)).unwrap();
      console.log("Sale created result:", result);

      // Show bill preview instead of auto-download
      if (result) {
        handleCloseDialog();
        toast.success("Sale completed successfully!");
        // Show bill preview dialog
        setTimeout(() => {
          handleOpenBillPreview(result);
        }, 300);
      } else {
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Sale creation error:", error);
      toast.error(error || "Failed to create sale");
    }
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
                      sx={{ mr: 0.5 }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleOpenBillPreview(sale)}
                      title="View Bill"
                    >
                      <ReceiptIcon fontSize="small" />
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
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => selectedSale && downloadBill(selectedSale)}
            variant="outlined"
          >
            Download Bill
          </Button>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Bill Preview Dialog */}
      <Dialog
        open={openBillPreview}
        onClose={handleCloseBillPreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingCartIcon />
            <span>Sales Bill Preview</span>
          </Box>
          <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
            {previewSale?.invoiceNumber}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {previewSale && (
            <Box>
              {/* Bill Header */}
              <Paper
                elevation={0}
                sx={{ p: 3, mb: 2, bgcolor: "rgba(102, 126, 234, 0.05)" }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Technova CMS - Sales Bill
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Invoice Number
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {previewSale.invoiceNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {new Date(
                        previewSale.saleDate || Date.now(),
                      ).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Customer
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {previewSale.customer?.name || "Walk-in Customer"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Cashier
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {previewSale.cashier?.name || user?.name || "Cashier"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {(previewSale.paymentMethod || "").toUpperCase()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Status
                    </Typography>
                    <Chip
                      label={(previewSale.paymentStatus || "").toUpperCase()}
                      size="small"
                      color={getPaymentStatusColor(previewSale.paymentStatus)}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Items Table */}
              <TableContainer component={Paper} elevation={2} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "rgba(102, 126, 234, 0.1)" }}>
                      <TableCell>
                        <strong>Item</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Qty</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Price</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Discount</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Subtotal</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(previewSale.items || []).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName || "Item"}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.price)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.discount)}
                        </TableCell>
                        <TableCell align="right">
                          <strong>{formatCurrency(item.subtotal)}</strong>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Totals Summary */}
              <Paper
                elevation={2}
                sx={{ p: 2, bgcolor: "rgba(102, 126, 234, 0.05)" }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography>Subtotal:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right" fontWeight="600">
                      {formatCurrency(previewSale.subtotal)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right" fontWeight="600">
                      {formatCurrency(previewSale.tax)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Discount:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right" fontWeight="600">
                      {formatCurrency(previewSale.discount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
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
                      {formatCurrency(previewSale.totalAmount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="text.secondary">Amount Paid:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right" fontWeight="600">
                      {formatCurrency(previewSale.amountPaid)}
                    </Typography>
                  </Grid>
                  {previewSale.amountDue > 0 && (
                    <>
                      <Grid item xs={6}>
                        <Typography color="error" fontWeight="bold">
                          Amount Due:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          align="right"
                          color="error"
                          fontWeight="bold"
                        >
                          {formatCurrency(previewSale.amountDue)}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>

              {previewSale.notes && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "rgba(0,0,0,0.03)",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Notes:
                  </Typography>
                  <Typography variant="body1">{previewSale.notes}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => previewSale && copyInvoiceNumber(previewSale)}
            variant="outlined"
            startIcon={<ContentCopyIcon />}
          >
            Copy Invoice
          </Button>
          <Button onClick={handleCloseBillPreview} variant="outlined">
            Close
          </Button>
          <Button
            onClick={() => {
              if (previewSale) {
                const printContent = document.getElementById(
                  "bill-preview-content",
                );
                const winPrint = window.open("", "", "width=800,height=600");
                winPrint.document.write(buildBillHtml(previewSale));
                winPrint.document.close();
                winPrint.focus();
                winPrint.print();
                winPrint.close();
              }
            }}
            variant="outlined"
            color="secondary"
            startIcon={<PrintIcon />}
          >
            Print
          </Button>
          <Button
            onClick={() => previewSale && downloadBill(previewSale)}
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sales;
