import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  fetchActivityStats,
  fetchTodayActivitySummary,
} from "../../redux/slices/activityLogSlice";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AssignmentOutlined,
  LoginOutlined,
  LogoutOutlined,
  CreateOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@mui/icons-material";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];
const ROLE_COLORS = {
  admin: "#ff7c7c",
  manager: "#ffc658",
  cashier: "#82ca9d",
  inventory: "#8884d8",
};

const ActivityDashboard = () => {
  const dispatch = useDispatch();
  const { stats, summary, loading } = useSelector(
    (state) => state.activityLogs,
  );
  const [days, setDays] = useState(7);

  useEffect(() => {
    dispatch(fetchActivityStats(days));
    dispatch(fetchTodayActivitySummary());
  }, [dispatch, days]);

  if (loading || !stats || !summary) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const getActionIcon = (action) => {
    const icons = {
      CREATE: <CreateOutlined />,
      UPDATE: <EditOutlined />,
      DELETE: <DeleteOutlined />,
      LOGIN: <LoginOutlined />,
      LOGOUT: <LogoutOutlined />,
    };
    return icons[action] || <AssignmentOutlined />;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#e3f2fd" }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Activities (Today)
              </Typography>
              <Typography variant="h4">{summary.totalActivities}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#e8f5e9" }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h4">{summary.activeUsersCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#fff3e0" }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Logins
              </Typography>
              <Typography variant="h4">{summary.totalLogins}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#fce4ec" }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Data Changes
              </Typography>
              <Typography variant="h4">
                {summary.totalCreations +
                  summary.totalUpdates +
                  summary.totalDeletions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Activities by Role */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Activities by Role ({days} days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byRole}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Activities by Action */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Activities by Action ({days} days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.byAction}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry._id}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.byAction.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Activities by Module */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Activities by Module ({days} days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byModule} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="_id" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activities Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Activities (Last 10)
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Module</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.recentActivities?.slice(0, 10).map((activity) => (
                <TableRow key={activity._id}>
                  <TableCell>{activity.userName}</TableCell>
                  <TableCell>
                    <Chip
                      label={activity.userRole}
                      size="small"
                      sx={{
                        backgroundColor:
                          ROLE_COLORS[activity.userRole] || "#ccc",
                        color: "white",
                      }}
                    />
                  </TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>{activity.module}</TableCell>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell sx={{ fontSize: "0.85rem" }}>
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ActivityDashboard;
