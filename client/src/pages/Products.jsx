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
import { Add, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  createProduct,
  getProducts,
  updateProduct,
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
  image: "",
};

const Products = () => {
  const dispatch = useDispatch();
  const { products, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.products,
  );
  const { token } = useSelector((state) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
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
    setIsEditMode(false);
    setEditingProductId(null);
    setFormData(initialFormData);
    setImagePreview("");
    setImageRemoved(false);
    setOpenDialog(true);
  };

  const handleEditProduct = async (product) => {
    await loadCategories();

    setIsEditMode(true);
    setEditingProductId(product._id);
    setImageRemoved(false);

    const existingImage =
      product.image && product.image !== "no-image.jpg" ? product.image : "";

    setFormData({
      name: product.name || "",
      category: product.category?._id || product.category || "",
      price: String(product.price ?? ""),
      costPrice: String(product.costPrice ?? ""),
      stock: String(product.stock ?? ""),
      sku: product.sku || "",
      description: product.description || "",
      image: existingImage,
    });

    setImagePreview(existingImage);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormData);
    setImagePreview("");
    setIsEditMode(false);
    setEditingProductId(null);
    setImageRemoved(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      if (typeof imageData === "string") {
        setFormData((prev) => ({
          ...prev,
          image: imageData,
        }));
        setImagePreview(imageData);
        setImageRemoved(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
    setImagePreview("");
    setImageRemoved(true);
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

    if (formData.image) {
      payload.image = formData.image;
    } else if (isEditMode && imageRemoved) {
      payload.image = "no-image.jpg";
    }

    const resultAction = isEditMode
      ? await dispatch(
          updateProduct({
            id: editingProductId,
            productData: payload,
          }),
        )
      : await dispatch(createProduct(payload));

    const isSuccessAction = isEditMode
      ? updateProduct.fulfilled.match(resultAction)
      : createProduct.fulfilled.match(resultAction);

    if (isSuccessAction) {
      toast.success(
        isEditMode
          ? "Product updated successfully"
          : "Product added successfully",
      );
      handleCloseDialog();
    } else {
      toast.error(
        resultAction.payload ||
          (isEditMode ? "Failed to update product" : "Failed to add product"),
      );
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
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Cost</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {isLoading ? "Loading products..." : "No products found"}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell>
                    {product.image && product.image !== "no-image.jpg" ? (
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{
                          width: 52,
                          height: 52,
                          objectFit: "cover",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: 1,
                          border: "1px dashed",
                          borderColor: "divider",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "text.secondary",
                          fontSize: 12,
                        }}
                      >
                        No Img
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku || "-"}</TableCell>
                  <TableCell align="right">
                    ${Number(product.price || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    ${Number(product.costPrice || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{product.stock ?? 0}</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </Button>
                  </TableCell>
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
        <DialogTitle>{isEditMode ? "Edit Product" : "Add Product"}</DialogTitle>
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

              <Button variant="outlined" component="label">
                {imagePreview ? "Change Product Image" : "Upload Product Image"}
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                />
              </Button>

              {(imagePreview || formData.image) && (
                <Button
                  variant="text"
                  color="error"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </Button>
              )}

              {imagePreview && (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Selected product"
                  sx={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
              )}
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
              {isLoading
                ? "Saving..."
                : isEditMode
                  ? "Update Product"
                  : "Save Product"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Products;
