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
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  reset,
} from "../redux/slices/supplierSlice";

const Suppliers = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { suppliers, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.suppliers,
  );
  const { token } = useSelector((state) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
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
    contactPerson: {
      name: "",
      phone: "",
      email: "",
    },
    paymentTerms: "",
    taxId: "",
    notes: "",
  });

  useEffect(() => {
    dispatch(getSuppliers());
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

  const handleOpenDialog = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        email: supplier.email || "",
        phone: supplier.phone,
        address: supplier.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        contactPerson: supplier.contactPerson || {
          name: "",
          phone: "",
          email: "",
        },
        paymentTerms: supplier.paymentTerms || "",
        taxId: supplier.taxId || "",
        notes: supplier.notes || "",
      });
    } else {
      setEditingSupplier(null);
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
        contactPerson: {
          name: "",
          phone: "",
          email: "",
        },
        paymentTerms: "",
        taxId: "",
        notes: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSupplier(null);
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

  const handleContactPersonChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        [name]: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      toast.error("Please fill in required fields (Name and Phone)");
      return;
    }

    if (editingSupplier) {
      dispatch(
        updateSupplier({
          id: editingSupplier._id,
          supplierData: formData,
        }),
      );
    } else {
      dispatch(createSupplier(formData));
    }

    handleCloseDialog();
  };

  const handleDelete = (supplierId) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      dispatch(deleteSupplier(supplierId));
    }
  };

  if (isLoading && suppliers.length === 0) {
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
        <Typography variant="h4">Suppliers Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Supplier
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
                },
              }}
            >
              <TableCell sx={{ fontWeight: 700 }}>
                <strong>Supplier Name</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <strong>Email</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <strong>Phone</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <strong>City</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <strong>Contact Person</strong>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>
                <strong>Tax ID</strong>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers && suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <TableRow
                  key={supplier._id}
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
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.email || "-"}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.address?.city || "-"}</TableCell>
                  <TableCell>{supplier.contactPerson?.name || "-"}</TableCell>
                  <TableCell>{supplier.taxId || "-"}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(supplier)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(supplier._id)}
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
                    No suppliers found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Supplier Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
        </DialogTitle>
        <DialogContent
          sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Basic Info */}
          <TextField
            fullWidth
            label="Supplier Name"
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

          {/* Contact Person */}
          <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: "bold" }}>
            Contact Person Information
          </Typography>
          <TextField
            fullWidth
            label="Contact Person Name"
            name="name"
            value={formData.contactPerson.name}
            onChange={handleContactPersonChange}
            size="small"
          />
          <TextField
            fullWidth
            label="Contact Person Phone"
            name="phone"
            value={formData.contactPerson.phone}
            onChange={handleContactPersonChange}
            size="small"
          />
          <TextField
            fullWidth
            label="Contact Person Email"
            name="email"
            type="email"
            value={formData.contactPerson.email}
            onChange={handleContactPersonChange}
            size="small"
          />

          {/* Business Details */}
          <TextField
            fullWidth
            label="Tax ID"
            name="taxId"
            value={formData.taxId}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Payment Terms"
            name="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleInputChange}
            placeholder="e.g., Net 30, Net 60"
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
            placeholder="Additional notes about the supplier"
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
            ) : editingSupplier ? (
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

export default Suppliers;
