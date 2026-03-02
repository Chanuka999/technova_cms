import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Link,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  createProduct,
  getProducts,
  reset,
} from "../redux/slices/productSlice";
import categoryService from "../services/categoryService";

const initialFormData = {
  name: "",
  category: "",
  price: "",
  costPrice: "",
  stock: "",
  sku: "",
  description: "",
};

const Products = () => {
  const dispatch = useDispatch();
  const { products, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.products,
  );
  const { token } = useSelector((state) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  const loadCategories = async () => {
    if (!token) {
      return;
    }

    try {
      setIsCategoriesLoading(true);
      const categoryData = await categoryService.getCategories(token);
      setCategories(categoryData);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to load categories");
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    loadCategories();
  }, [token]);

  useEffect(() => {
    if (isError) {
      toast.error(message || "Failed to load products");
      dispatch(reset());
    }

    if (isSuccess) {
      dispatch(reset());
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleOpenDialog = async () => {
    await loadCategories();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.costPrice ||
      !formData.stock
    ) {
      toast.warning("Please fill all required fields");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      costPrice: Number(formData.costPrice),
      stock: Number(formData.stock),
      sku: formData.sku.trim() || undefined,
      description: formData.description.trim() || undefined,
    };

    const resultAction = await dispatch(createProduct(payload));

    if (createProduct.fulfilled.match(resultAction)) {
      toast.success("Product added successfully");
      handleCloseDialog();
    } else {
      toast.error(resultAction.payload || "Failed to add product");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Cost</TableCell>
              <TableCell align="right">Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {isLoading ? "Loading products..." : "No products found"}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku || "-"}</TableCell>
                  <TableCell align="right">
                    ${Number(product.price || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    ${Number(product.costPrice || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{product.stock ?? 0}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Product</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 0.5 }}>
              <TextField
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isCategoriesLoading}
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {!isCategoriesLoading && categories.length === 0 && (
                  <FormHelperText>
                    No categories found. Create one from{" "}
                    <Link
                      component={RouterLink}
                      to="/categories"
                      underline="hover"
                    >
                      Categories page
                    </Link>
                    .
                  </FormHelperText>
                )}
              </FormControl>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Selling Price"
                  name="price"
                  type="number"
                  inputProps={{ min: 0, step: "0.01" }}
                  value={formData.price}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Cost Price"
                  name="costPrice"
                  type="number"
                  inputProps={{ min: 0, step: "0.01" }}
                  value={formData.costPrice}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Stock"
                  name="stock"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  label="SKU"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  fullWidth
                />
              </Stack>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            {categories.length === 0 && (
              <Typography
                variant="caption"
                color="warning.main"
                sx={{ mr: "auto" }}
              >
                Add at least one category before creating products.
              </Typography>
            )}
            <Button onClick={handleCloseDialog} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || categories.length === 0}
            >
              {isLoading ? "Saving..." : "Save Product"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Products;
