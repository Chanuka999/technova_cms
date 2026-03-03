import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  PersonAdd,
  Computer,
  AccountCircle,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { register, reset } from "../redux/slices/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.warning("Please fill all required fields");
      return;
    }

    dispatch(register(formData));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          top: "-200px",
          right: "-200px",
          animation: "float 6s ease-in-out infinite",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          bottom: "-150px",
          left: "-150px",
          animation: "float 8s ease-in-out infinite",
        },
        "@keyframes float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(20px)",
          },
        },
      }}
    >
      <Container component="main" maxWidth="lg">
        <Fade in={true} timeout={1000}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {/* Left Side - Illustration */}
            <Slide direction="right" in={true} timeout={800}>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    animation: "bounce 3s ease-in-out infinite",
                    "@keyframes bounce": {
                      "0%, 100%": {
                        transform: "translateY(0)",
                      },
                      "50%": {
                        transform: "translateY(-20px)",
                      },
                    },
                  }}
                >
                  {/* SVG Illustration for Register */}
                  <svg
                    width="400"
                    height="400"
                    viewBox="0 0 400 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Multiple Users Icon */}
                    <circle
                      cx="150"
                      cy="150"
                      r="35"
                      fill="white"
                      fillOpacity="0.9"
                    />
                    <path
                      d="M150 190 Q150 190 110 220 L190 220 Q150 190 150 190Z"
                      fill="white"
                      fillOpacity="0.9"
                    />
                    <circle
                      cx="250"
                      cy="160"
                      r="30"
                      fill="white"
                      fillOpacity="0.7"
                    />
                    <path
                      d="M250 195 Q250 195 215 220 L285 220 Q250 195 250 195Z"
                      fill="white"
                      fillOpacity="0.7"
                    />
                    <circle
                      cx="200"
                      cy="240"
                      r="25"
                      fill="white"
                      fillOpacity="0.8"
                    />
                    <path
                      d="M200 270 Q200 270 170 295 L230 295 Q200 270 200 270Z"
                      fill="white"
                      fillOpacity="0.8"
                    />
                    {/* Floating Plus Icons */}
                    <g fillOpacity="0.6">
                      <rect x="90" y="90" width="20" height="4" fill="white">
                        <animate
                          attributeName="opacity"
                          values="0.6;1;0.6"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </rect>
                      <rect x="98" y="82" width="4" height="20" fill="white">
                        <animate
                          attributeName="opacity"
                          values="0.6;1;0.6"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </rect>
                    </g>
                    <g fillOpacity="0.6">
                      <rect x="300" y="120" width="16" height="3" fill="white">
                        <animate
                          attributeName="opacity"
                          values="0.6;1;0.6"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </rect>
                      <rect x="306" y="114" width="3" height="16" fill="white">
                        <animate
                          attributeName="opacity"
                          values="0.6;1;0.6"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </rect>
                    </g>
                    {/* Floating Elements */}
                    <circle
                      cx="330"
                      cy="200"
                      r="8"
                      fill="white"
                      fillOpacity="0.6"
                    >
                      <animate
                        attributeName="cy"
                        values="200;190;200"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx="70"
                      cy="180"
                      r="6"
                      fill="white"
                      fillOpacity="0.6"
                    >
                      <animate
                        attributeName="cy"
                        values="180;170;180"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    mt: 3,
                    fontWeight: "bold",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Join Us Today!
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mt: 1,
                    opacity: 0.9,
                    textAlign: "center",
                    maxWidth: "400px",
                  }}
                >
                  Create your account and start managing your business
                </Typography>
              </Box>
            </Slide>

            {/* Right Side - Register Form */}
            <Zoom in={true} timeout={1000}>
              <Paper
                elevation={24}
                sx={{
                  p: 5,
                  width: { xs: "100%", sm: "500px" },
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      m: 1,
                      bgcolor: "primary.main",
                      width: 70,
                      height: 70,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    <PersonAdd sx={{ fontSize: 40 }} />
                  </Avatar>

                  <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                      mt: 2,
                      fontWeight: "bold",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Technova CMS
                  </Typography>
                  <Typography
                    component="h2"
                    variant="h6"
                    sx={{ mt: 1, color: "primary.main", fontWeight: 500 }}
                  >
                    Create Your Account
                  </Typography>

                  {isError && (
                    <Fade in={isError}>
                      <Alert
                        severity="error"
                        sx={{
                          mt: 2,
                          width: "100%",
                          borderRadius: 2,
                        }}
                      >
                        {message}
                      </Alert>
                    </Fade>
                  )}

                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ mt: 2, width: "100%" }}
                  >
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      autoFocus
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{
                        style: { color: "#555" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          backgroundColor: "rgba(0,0,0,0.02)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#555",
                          fontWeight: 500,
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#667eea",
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#333",
                        },
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{
                        style: { color: "#555" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          backgroundColor: "rgba(0,0,0,0.02)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#555",
                          fontWeight: 500,
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#667eea",
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#333",
                        },
                      }}
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{
                        style: { color: "#555" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          backgroundColor: "rgba(0,0,0,0.02)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#555",
                          fontWeight: 500,
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#667eea",
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#333",
                        },
                      }}
                    />
                    <FormControl margin="normal" fullWidth>
                      <InputLabel
                        id="role-label"
                        sx={{
                          color: "#555",
                          fontWeight: 500,
                          "&.Mui-focused": {
                            color: "#667eea",
                          },
                        }}
                      >
                        Role
                      </InputLabel>
                      <Select
                        labelId="role-label"
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        startAdornment={
                          <InputAdornment position="start">
                            <AccountCircle color="primary" />
                          </InputAdornment>
                        }
                        sx={{
                          borderRadius: 2,
                          transition: "all 0.3s",
                          backgroundColor: "rgba(0,0,0,0.02)",
                          color: "#333",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="manager">Manager</MenuItem>
                        <MenuItem value="cashier">Cashier</MenuItem>
                        <MenuItem value="inventory">Inventory</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{
                        style: { color: "#555" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s",
                          backgroundColor: "rgba(0,0,0,0.02)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#555",
                          fontWeight: 500,
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#667eea",
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#333",
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isLoading}
                      startIcon={<PersonAdd />}
                      sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                          background:
                            "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                        },
                        "&:disabled": {
                          background: "grey",
                        },
                      }}
                    >
                      {isLoading ? "Creating..." : "Create Account"}
                    </Button>

                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        background:
                          "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body2" color="primary.main">
                        Already have an account?{" "}
                        <Link
                          component={RouterLink}
                          to="/login"
                          underline="none"
                          sx={{
                            fontWeight: "bold",
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Sign In
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Zoom>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;
