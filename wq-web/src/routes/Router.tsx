import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import Chemical_Consumption from "../pages/Chemical Consumption/Chemical_Consumption";
import Flow_Customization from "../pages/Flow Customization/Flow_Customization";
import Water_Quality_Prediction from "../pages/Water Quality Prediction/Water_Quality_Prediction";
import Dashboard from "../pages/Dashboard/Dashboard";
import Sensors from "../pages/Sensors/Sensors";
import Settings from "../pages/Settings/Settings";
import Reports from "../pages/Reports/Reports";
import AddTest from "../pages/Flow Customization/addTest";
import AddStep from "../pages/Flow Customization/addStep";
import AddChemical from "../pages/Flow Customization/addChemical";
import StepView from "../pages/Flow Customization/stepView";

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
        path:"/flow/add-test",
        element:<AddTest />,
      },
      {
        path:"/flow/add-step",
        element:<AddStep />,
      },
      {
        path:"/flow/add-chemicals",
        element:<AddChemical />,
      }, 
      {
        path:"/flow/step/:stepId",
        element:<StepView />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);

export default router;
