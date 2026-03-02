import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { user, token } = useSelector((state) => state.auth);

  return user && token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
