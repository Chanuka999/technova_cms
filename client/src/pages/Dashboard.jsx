import { useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  Inventory,
  ShoppingCart,
  People,
} from "@mui/icons-material";
import AdminDashboard from "../components/Dashboard/AdminDashboard";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const displayName = user?.name?.trim() || "User";

  // Show AdminDashboard for admin users
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  const stats = [
    {
      title: "Today's Revenue",
      value: "$0.00",
      icon: <TrendingUp fontSize="large" />,
      color: "primary.main",
    },
    {
      title: "Total Products",
      value: "0",
      icon: <Inventory fontSize="large" />,
      color: "success.main",
    },
    {
      title: "Today's Sales",
      value: "0",
      icon: <ShoppingCart fontSize="large" />,
      color: "warning.main",
    },
    {
      title: "Total Customers",
      value: "0",
      icon: <People fontSize="large" />,
      color: "secondary.main",
    },
  ];

  return (
    <Box sx={{ pb: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 1 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Welcome back, {displayName} 👋
          </Typography>
        </Box>
        <Chip label="Live Overview" color="primary" variant="outlined" />
      </Stack>

      <Grid container spacing={2.5} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 2.25 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <Box
                    sx={{
                      bgcolor: stat.color,
                      color: "white",
                      p: 1.1,
                      borderRadius: 1.5,
                      display: "flex",
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              minHeight: 170,
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Recent Sales
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              No sales data available yet.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              minHeight: 170,
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Low Stock Alert
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              No low stock items.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
