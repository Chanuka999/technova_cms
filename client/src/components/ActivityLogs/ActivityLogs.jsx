import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  fetchActivityLogs,
  clearActivityLogs,
} from "../../redux/slices/activityLogSlice";
import { formatDistanceToNow } from "date-fns";

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const { logs, loading, pagination } = useSelector(
    (state) => state.activityLogs,
  );
  const [filters, setFilters] = useState({
    role: "",
    module: "",
    action: "",
    limit: 50,
    page: 1,
  });
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteOldDays, setDeleteOldDays] = useState(90);

  useEffect(() => {
    dispatch(fetchActivityLogs(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handlePageChange = (event, newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage + 1,
    }));
  };

  const handleRowsPerPageChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1,
    }));
  };

  const getActionColor = (action) => {
    const colors = {
      CREATE: "success",
      UPDATE: "info",
      DELETE: "error",
      VIEW: "default",
      LOGIN: "success",
      LOGOUT: "warning",
      DOWNLOAD: "info",
      EXPORT: "info",
    };
    return colors[action] || "default";
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "error",
      manager: "warning",
      cashier: "success",
      inventory: "info",
    };
    return colors[role] || "default";
  };

  const getModuleColor = (module) => {
    const colors = {
      products: "primary",
      sales: "success",
      customers: "info",
      suppliers: "warning",
      inventory: "secondary",
      users: "error",
      reports: "default",
      categories: "default",
      auth: "default",
    };
    return colors[module] || "default";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <h2>Activity Logs</h2>
        <p>Monitor user activities across the system by role and action</p>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                label="Role"
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="cashier">Cashier</MenuItem>
                <MenuItem value="inventory">Inventory</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Module</InputLabel>
              <Select
                name="module"
                value={filters.module}
                onChange={handleFilterChange}
                label="Module"
              >
                <MenuItem value="">All Modules</MenuItem>
                <MenuItem value="products">Products</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
                <MenuItem value="customers">Customers</MenuItem>
                <MenuItem value="suppliers">Suppliers</MenuItem>
                <MenuItem value="inventory">Inventory</MenuItem>
                <MenuItem value="users">Users</MenuItem>
                <MenuItem value="reports">Reports</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Action</InputLabel>
              <Select
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                label="Action"
              >
                <MenuItem value="">All Actions</MenuItem>
                <MenuItem value="CREATE">Create</MenuItem>
                <MenuItem value="UPDATE">Update</MenuItem>
                <MenuItem value="DELETE">Delete</MenuItem>
                <MenuItem value="VIEW">View</MenuItem>
                <MenuItem value="LOGIN">Login</MenuItem>
                <MenuItem value="LOGOUT">Logout</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Results Per Page</InputLabel>
              <Select
                name="limit"
                value={filters.limit}
                onChange={handleRowsPerPageChange}
                label="Results Per Page"
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Logs Table */}
      <TableContainer component={Paper}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : logs.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <p>No activity logs found</p>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Module</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id} hover>
                    <TableCell>
                      <strong>{log.userName || "N/A"}</strong>
                      <br />
                      <small style={{ color: "#666" }}>
                        {log.userId?.email || "Unknown"}
                      </small>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.userRole}
                        color={getRoleColor(log.userRole)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        color={getActionColor(log.action)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.module}
                        color={getModuleColor(log.module)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell sx={{ fontSize: "0.9rem", color: "#666" }}>
                      {log.timestamp
                        ? formatDistanceToNow(new Date(log.timestamp), {
                            addSuffix: true,
                          })
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={pagination.total || 0}
              rowsPerPage={filters.limit}
              page={filters.page - 1}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </>
        )}
      </TableContainer>
    </Box>
  );
};

export default ActivityLogs;
