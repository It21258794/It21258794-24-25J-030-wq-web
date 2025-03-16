import { createBrowserRouter, Outlet } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { GuestGuard } from "../components/auth/AuthGuard";
import { PrivateGuard } from "../components/auth/AuthGuard";
import SignIn from "../pages/Common/SignIn";
import ResetPassword from "../pages/Common/ResetPassword";
import SendOtpScreen from "../pages/Common/SendOtpScreen";
import Dashboard from "../pages/Dashboard/Dashboard";
import Sensors from "../pages/Sensors/Sensors";
import Water_Quality_Prediction from "../pages/Water Quality Prediction/WaterQualityPrediction";
import Chemical_Consumption from "../pages/Chemical Consumption/Chemical_Consumption";
import Flow_Customization from "../pages/Flow Customization/Flow_Customization";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";
import CompareSensors from "../pages/CompareSensors/CompareSensors";
import App from "../App";
import UserManagement from "../pages/UserManagement/UserManagement";
import ChangePassword from "../pages/Common/ChangePassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppRoutes />,
    children: [
      {
        path: "/",
        element: (
          <GuestGuard>
          <Outlet />
          </GuestGuard>
        ),
        children: [
          { index: true, element: <SignIn /> },
          { path: "send-reset-otp", element: <SendOtpScreen /> },
          { path: "reset-password", element: <ResetPassword /> },
          { path: "change-password", element: <ChangePassword /> },
        ],
      },
      {
        path: "/user",
        element: (
          <PrivateGuard>
             <App />
          </PrivateGuard>
        ),
        children: [
          { path: "waterQualityDashboard", element: <Dashboard /> },
          { path: "sensorsDashboard", element: <Sensors /> },
          { path: "waterQualityPrediction", element: <Water_Quality_Prediction /> },
          { path: "chemicalConsumption", element: <Chemical_Consumption /> },
          { path: "flowCustomization", element: <Flow_Customization /> },
          { path: "reports", element: <Reports /> },
          { path: "settings", element: <Settings /> },
          { path: "sensorsDashboard/compare", element: <CompareSensors /> },
          { path: "users", element: <UserManagement /> },
        ],
      },
    ],
  },
]);
export default router;
