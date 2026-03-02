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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  reset,
} from "../redux/slices/customerSlice";

const Customers = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { customers, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.customers,
  );
  const { token } = useSelector((state) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    creditLimit: 0,
    notes: "",
  });

  useEffect(() => {
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

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone,
        address: customer.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        creditLimit: customer.creditLimit || 0,
        notes: customer.notes || "",
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        creditLimit: 0,
        notes: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCustomer(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      toast.error("Please fill in required fields (Name and Phone)");
      return;
    }

    if (editingCustomer) {
      dispatch(
        updateCustomer({
          id: editingCustomer._id,
          customerData: formData,
        }),
      );
    } else {
      dispatch(createCustomer(formData));
    }

    handleCloseDialog();
  };

  const handleDelete = (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      dispatch(deleteCustomer(customerId));
    }
  };

  if (isLoading && customers.length === 0) {
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Customers Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Customer
        </Button>
      </Box>

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
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.primary.main
                      : theme.palette.primary.light,
                },
              }}
            >
              <TableCell sx={{ fontWeight: 700 }}>
                <Typography fontWeight="bold" sx={{ color: "inherit" }}>
                  Name
                </Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <Typography fontWeight="bold" sx={{ color: "inherit" }}>
                  Email
                </Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <Typography fontWeight="bold" sx={{ color: "inherit" }}>
                  Phone
                </Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <Typography fontWeight="bold" sx={{ color: "inherit" }}>
                  City
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                <Typography fontWeight="bold" sx={{ color: "inherit" }}>
                  Credit Limit
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                <Typography fontWeight="bold" sx={{ color: "inherit" }}>
                  Purchases
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                <Typography fontWeight="bold" sx={{ color: "inherit" }}>
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers && customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow
                  key={customer._id}
                  hover
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
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email || "-"}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address?.city || "-"}</TableCell>
                  <TableCell align="right">
                    Rs. {customer.creditLimit?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell align="right">
                    Rs. {customer.totalPurchases?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(customer)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(customer._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
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
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography
                    color={
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(0, 0, 0, 0.6)"
                    }
                  >
                    No customers found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Customer Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCustomer ? "Edit Customer" : "Add New Customer"}
        </DialogTitle>
        <DialogContent
          sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Basic Info */}
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />

          {/* Address Fields */}
          <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: "bold" }}>
            Address Information
          </Typography>
          <TextField
            fullWidth
            label="Street"
            name="street"
            value={formData.address.street}
            onChange={handleAddressChange}
            size="small"
          />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.address.city}
                onChange={handleAddressChange}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.address.state}
                onChange={handleAddressChange}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Zip Code"
                name="zipCode"
                value={formData.address.zipCode}
                onChange={handleAddressChange}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.address.country}
                onChange={handleAddressChange}
                size="small"
              />
            </Grid>
          </Grid>

          {/* Credit Limit */}
          <TextField
            fullWidth
            label="Credit Limit"
            name="creditLimit"
            type="number"
            value={formData.creditLimit}
            onChange={handleInputChange}
            inputProps={{ step: "0.01", min: "0" }}
          />

          {/* Notes */}
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            multiline
            rows={2}
            placeholder="Additional notes about the customer"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : editingCustomer ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
