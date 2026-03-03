import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Tabs,
  Tab,
  Divider,
  Switch,
  FormControlLabel,
  Avatar,
  Stack,
  Paper,
  useTheme,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Settings = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  // Business Settings
  const [businessData, setBusinessData] = useState({
    businessName: "Technova Computer Shop",
    address: "123 Main Street, Colombo 07",
    phone: "+94 77 123 4567",
    email: "info@technova.lk",
    taxId: "123456789V",
    currency: "LKR",
    taxRate: 0,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    stockAlerts: true,
    salesAlerts: true,
    lowStockAlerts: true,
    dailyReports: false,
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    defaultView: "dashboard",
    itemsPerPage: 10,
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleBusinessChange = (e) => {
    setBusinessData({ ...businessData, [e.target.name]: e.target.value });
  };

  const handleNotificationToggle = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };

  const handleSystemToggle = (setting) => {
    setSystemSettings({
      ...systemSettings,
      [setting]: !systemSettings[setting],
    });
  };

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
  };

  const handleSaveBusiness = () => {
    toast.success("Business settings saved successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved successfully");
  };

  const handleSaveSystem = () => {
    toast.success("System settings saved successfully");
  };

  const handleChangePassword = () => {
    toast.info("Password change functionality coming soon");
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab icon={<PersonIcon />} label="Profile" iconPosition="start" />
          <Tab icon={<BusinessIcon />} label="Business" iconPosition="start" />
          <Tab
            icon={<NotificationsIcon />}
            label="Notifications"
            iconPosition="start"
          />
          <Tab icon={<PaletteIcon />} label="Appearance" iconPosition="start" />
          <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Profile Settings */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 40,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{user?.name}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {user?.email}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(33, 150, 243, 0.2)"
                        : "rgba(33, 150, 243, 0.1)",
                    display: "inline-block",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  Role: {user?.role?.toUpperCase()}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
              <Button variant="outlined" onClick={handleChangePassword}>
                Change Password
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Business Settings */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Business Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Business Name"
                  name="businessName"
                  value={businessData.businessName}
                  onChange={handleBusinessChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tax ID / Business Registration"
                  name="taxId"
                  value={businessData.taxId}
                  onChange={handleBusinessChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Address"
                  name="address"
                  value={businessData.address}
                  onChange={handleBusinessChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={businessData.phone}
                  onChange={handleBusinessChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={businessData.email}
                  onChange={handleBusinessChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Currency"
                  name="currency"
                  value={businessData.currency}
                  onChange={handleBusinessChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Default Tax Rate (%)"
                  name="taxRate"
                  type="number"
                  value={businessData.taxRate}
                  onChange={handleBusinessChange}
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveBusiness}
              >
                Save Business Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings */}
      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Communication Channels
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={() =>
                        handleNotificationToggle("emailNotifications")
                      }
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onChange={() =>
                        handleNotificationToggle("smsNotifications")
                      }
                    />
                  }
                  label="SMS Notifications"
                />
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Alert Types
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.stockAlerts}
                      onChange={() => handleNotificationToggle("stockAlerts")}
                    />
                  }
                  label="Stock Alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.salesAlerts}
                      onChange={() => handleNotificationToggle("salesAlerts")}
                    />
                  }
                  label="Sales Alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.lowStockAlerts}
                      onChange={() =>
                        handleNotificationToggle("lowStockAlerts")
                      }
                    />
                  }
                  label="Low Stock Alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.dailyReports}
                      onChange={() => handleNotificationToggle("dailyReports")}
                    />
                  }
                  label="Daily Summary Reports"
                />
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveNotifications}
              >
                Save Notification Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Appearance Settings */}
      {activeTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Appearance & Display
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Alert severity="info" sx={{ mb: 3 }}>
              Theme mode can be toggled from the top navigation bar (sun/moon
              icon)
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Default View"
                  value={systemSettings.defaultView}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      defaultView: e.target.value,
                    })
                  }
                  SelectProps={{ native: true }}
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="sales">Sales</option>
                  <option value="products">Products</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Items Per Page"
                  value={systemSettings.itemsPerPage}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      itemsPerPage: parseInt(e.target.value),
                    })
                  }
                  SelectProps={{ native: true }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Date Format"
                  value={systemSettings.dateFormat}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      dateFormat: e.target.value,
                    })
                  }
                  SelectProps={{ native: true }}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Time Format"
                  value={systemSettings.timeFormat}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      timeFormat: e.target.value,
                    })
                  }
                  SelectProps={{ native: true }}
                >
                  <option value="12h">12 Hour (AM/PM)</option>
                  <option value="24h">24 Hour</option>
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSystem}
              >
                Save Appearance Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Security Settings */}
      {activeTab === 4 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Security & Privacy
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Password
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Last changed: Never
                </Typography>
                <Button variant="outlined" onClick={handleChangePassword}>
                  Change Password
                </Button>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  System Backup
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.autoBackup}
                      onChange={() => handleSystemToggle("autoBackup")}
                    />
                  }
                  label="Enable Automatic Backups"
                />
                {systemSettings.autoBackup && (
                  <TextField
                    fullWidth
                    select
                    label="Backup Frequency"
                    value={systemSettings.backupFrequency}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        backupFrequency: e.target.value,
                      })
                    }
                    SelectProps={{ native: true }}
                    sx={{ mt: 2, maxWidth: 300 }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </TextField>
                )}
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Session Management
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Current Session: Active
                </Typography>
                <Button variant="outlined" color="error">
                  Logout All Devices
                </Button>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSystem}
              >
                Save Security Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Settings;
