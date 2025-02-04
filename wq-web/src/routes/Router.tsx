import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import Chemical_Consumption from "../pages/Chemical Consumption/Chemical_Consumption";
import Flow_Customization from "../pages/Flow Customization/Flow_Customization";
import Water_Quality_Prediction from "../pages/Water Quality Prediction/WaterQualityPrediction";
import Dashboard from "../pages/Dashboard/Dashboard";
import Sensors from "../pages/Sensors/Sensors";
import Settings from "../pages/Settings/Settings";
import Reports from "../pages/Reports/Reports";
import CompareSensors from "../pages/CompareSensors/CompareSensors";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/waterQualityDashboard",
        element: <Dashboard />,
      },
      {
        path: "/sensorsDashboard",
        element: <Sensors />,
      },
      {
        path: "/waterQualityPrediction",
        element: <Water_Quality_Prediction />,
      },
      {
        path: "/chemicalConsumption",
        element: <Chemical_Consumption />,
      },
      {
        path: "/flowCustomization",
        element: <Flow_Customization />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/sensorsDashboard/compare",
        element: <CompareSensors />,
      },
    ],
  },
]);

export default router;
