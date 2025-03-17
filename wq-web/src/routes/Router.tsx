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
import AddTest from "../pages/Flow Customization/addTest";
import AddStep from "../pages/Flow Customization/addStep";
import AddChemical from "../pages/Flow Customization/addChemical";
import StepView from "../pages/Flow Customization/stepView";
import Prediction from "../pages/Flow Customization/prediction";

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
          { path: "flow/add-test", element: <AddTest /> },
          { path: "flow/add-step", element: <AddStep /> },
          { path: "flow/add-chemical", element: <AddChemical /> },
          { path: "flow/step/:stepId", element: <StepView /> },
          { path: "flow/prediction", element: <Prediction /> },
          
        ],
      },
    ],
  },
]);
export default router;



