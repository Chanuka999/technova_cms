import { useState, useEffect } from "react";
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
  InputAdornment,
  IconButton,
  Avatar,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  LoginRounded,
  Computer,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { login, reset } from "../redux/slices/authSlice";
import logosImage from "../images/logos.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
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
        backgroundImage: `linear-gradient(rgba(22, 28, 72, 0.82), rgba(70, 36, 104, 0.84)), url(${logosImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
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
          left: "-200px",
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
          right: "-150px",
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
                  {/* SVG Illustration */}
                  <svg
                    width="400"
                    height="400"
                    viewBox="0 0 400 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Computer Monitor */}
                    <rect
                      x="80"
                      y="100"
                      width="240"
                      height="180"
                      rx="10"
                      fill="white"
                      fillOpacity="0.9"
                    />
                    <rect
                      x="95"
                      y="115"
                      width="210"
                      height="140"
                      fill="#667eea"
                      fillOpacity="0.3"
                    />
                    {/* Monitor Stand */}
                    <rect
                      x="185"
                      y="280"
                      width="30"
                      height="40"
                      fill="white"
                      fillOpacity="0.8"
                    />
                    <rect
                      x="160"
                      y="320"
                      width="80"
                      height="10"
                      rx="5"
                      fill="white"
                      fillOpacity="0.8"
                    />
                    {/* User Icon on Screen */}
                    <circle
                      cx="200"
                      cy="165"
                      r="25"
                      fill="white"
                      fillOpacity="0.9"
                    />
                    <path
                      d="M200 195 Q200 195 170 220 L230 220 Q200 195 200 195Z"
                      fill="white"
                      fillOpacity="0.9"
                    />
                    {/* Floating Elements */}
                    <circle
                      cx="120"
                      cy="80"
                      r="8"
                      fill="white"
                      fillOpacity="0.6"
                    >
                      <animate
                        attributeName="cy"
                        values="80;70;80"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx="280"
                      cy="90"
                      r="6"
                      fill="white"
                      fillOpacity="0.6"
                    >
                      <animate
                        attributeName="cy"
                        values="90;80;90"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx="340"
                      cy="200"
                      r="10"
                      fill="white"
                      fillOpacity="0.6"
                    >
                      <animate
                        attributeName="cy"
                        values="200;190;200"
                        dur="2.5s"
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
                  Welcome Back!
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
                  Manage your computer shop with ease and efficiency
                </Typography>
              </Box>
            </Slide>

            {/* Right Side - Login Form */}
            <Zoom in={true} timeout={1000}>
              <Paper
                elevation={24}
                sx={{
                  p: 5,
                  width: { xs: "100%", sm: "450px" },
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
                    <Computer sx={{ fontSize: 40 }} />
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
                    sx={{
                      mt: 1,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 500,
                    }}
                  >
                    Sign In to Continue
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
                    sx={{ mt: 3, width: "100%" }}
                  >
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
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
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
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
                      startIcon={<LoginRounded />}
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
                      {isLoading ? "Signing In..." : "Sign In"}
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
                        Don&apos;t have an account?{" "}
                        <Link
                          component={RouterLink}
                          to="/register"
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
                          Register Now
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

export default Login;
